import os
import time
import jwt
from flask import Blueprint, request, jsonify, make_response, current_app
from extensions import bcrypt
from db import get_db

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")


# Helper function to normalize email addresses
def _normalize_email(email: str) -> str:
    return email.strip().lower()


# Helper function to create a JWT token
def _make_token(user, type="access"):
    now = int(time.time())
    return jwt.encode(
        {
            "iss": current_app.config["JWT_ISSUER"],
            "sub": str(user["id"]),
            "iat": now,
            "exp": now + int(current_app.config["JWT_ACCESS_TTL"]),
            "typ": type,
            "email": user["email"],
            "role": user["role"],
        },
        current_app.config["SECRET_KEY"],
        algorithm="HS256",
    )


# Helper functions to set and clear cookies
def _set_cookie(response, token: str):
    response.set_cookie(
        current_app.config["JWT_COOKIE_NAME"],
        token,
        httponly=True,
        samesite="Lax",
        secure=False,
        max_age=int(current_app.config["JWT_ACCESS_TTL"]),
        path="/",
    )


def _clear_cookie(response):
    response.delete_cookie(current_app.config["JWT_COOKIE_NAME"], path="/")


# Helper function to get the current user from the JWT token
def _current_user():
    token = request.cookies.get(current_app.config["JWT_COOKIE_NAME"])
    if not token:
        return None
    try:
        payload = jwt.decode(
            token,
            current_app.config["SECRET_KEY"],
            algorithms=["HS256"],
            options={"require": ["exp", "iat", "iss"]},
        )
        uid = int(payload.get("sub", "0"))
        db = get_db()

        # Return the user email, id and role
        row = db.execute(
            "SELECT id, email, role FROM users WHERE id=?", (uid,)
        ).fetchone()
        return row
    except Exception:
        return None


# Helper function to consume an invite code
# They are one time use per reg, so need to be deleted
def _consume_invite_code(db, code: str) -> bool:
    code = (code or "").strip()
    row = db.execute("SELECT id FROM invite_codes WHERE code = ?", (code,)).fetchone()
    if not row:
        return False
    db.execute("DELETE FROM invite_codes WHERE id = ?", (row["id"],))
    db.commit()
    return True


# Endpoint to allow users to register
@auth_bp.post("/register")
def register():
    data = request.get_json(silent=True) or {}
    email = _normalize_email(data.get("email"))
    password = data.get("password") or ""
    inviteCode = data.get("inviteCode") or ""

    if not email or not password or not inviteCode:
        return jsonify({"error": "Email, password and invite code required"}), 400

    db = get_db()

    if db.execute("SELECT 1 FROM users WHERE email=?", (email,)).fetchone():
        return jsonify({"error": "Email already registered"}), 409

    hashed = bcrypt.generate_password_hash(password).decode("utf-8")
    now = int(time.time())

    db.execute(
        "INSERT INTO users (email, password_hash, role, created_at) VALUES (?,?,?,?)",
        (email, hashed, "user", now),
    )

    db.commit()

    user = db.execute(
        "SELECT id, email, role FROM users WHERE email=?", (email,)
    ).fetchone()

    # Consume the invite code
    _consume_invite_code(db, inviteCode)

    tok = _make_token(user, "access")
    resp = make_response(
        {"user": {"id": user["id"], "email": user["email"], "role": user["role"]}}
    )
    _set_cookie(resp, tok)
    return resp


# Endpoint to allow users to log in
@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    email = _normalize_email(data.get("email"))
    password = data.get("password") or ""
    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    db = get_db()
    row = db.execute(
        "SELECT id, email, role, password_hash FROM users WHERE email=?", (email,)
    ).fetchone()
    if not row or not bcrypt.check_password_hash(row["password_hash"], password):
        return jsonify({"error": "Invalid credentials"}), 401

    user = {"id": row["id"], "email": row["email"], "role": row["role"]}
    tok = _make_token(user, "access")
    resp = make_response({"user": user})
    _set_cookie(resp, tok)
    return resp


# Endpoint to allow users to log out
@auth_bp.post("/logout")
def logout():
    resp = make_response({"ok": True})
    _clear_cookie(resp)
    return resp


# Endpoint to get a user's details'
@auth_bp.get("/me")
def me():
    user = _current_user()
    if not user:
        return jsonify({"error": "unauthorized"}), 401
    return {"user": {"id": user["id"], "email": user["email"], "role": user["role"]}}
