# app/auth.py
# This file handles user authentication across the application.

import sqlite3
from flask import Blueprint, request, jsonify, make_response
from .jwt import (
    make_token,
    make_access_refresh,
    decode_token,
    set_cookies,
    clear_cookies,
    set_cookie,
    ACCESS_TTL,
    REFRESH_TTL,
)
from .. import get_db, bcrypt

auth_bp = Blueprint("auth", __name__)


# Normalize email function
def _norm_email(v: str) -> str:
    return (v or "").strip().lower()


# Endpoint to handle user registration
# It checks if the email is already registered and creates a new user if not
@auth_bp.post("/register")
def register():
    # Extract data from the request
    data = request.get_json(silent=True) or {}
    email = _norm_email(data.get("email"))
    password = data.get("password") or ""

    # If email or password is missing, return an error
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    # Connect to the database and attempt to create a new user
    db = get_db()
    try:
        hashed = bcrypt.generate_password_hash(password).decode("utf-8")
        db.execute(
            "INSERT INTO users (email, password, account_type) VALUES (?, ?, ?)",
            (email, hashed, "user"),
        )
        db.commit()
        return jsonify({"message": "Account created successfully"}), 201

    # Handle potential errors
    except sqlite3.IntegrityError:
        db.rollback()
        return jsonify({"error": "Account already exists"}), 409
    except Exception as e:
        db.rollback()
        return jsonify({"error": f"Server error: {e}"}), 500


# Endpoint to handle user login
# It checks the provided email and password against the database
# If valid, it generates access and refresh tokens and sets them as cookies
@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    email = _norm_email(data.get("email"))
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    try:
        db = get_db()

        row = db.execute(
            "SELECT id, email, password, account_type FROM users WHERE email = ?",
            (email,),
        ).fetchone()

        if not row:
            return jsonify({"error": "Invalid email or password"}), 401

        if not bcrypt.check_password_hash(row["password"], password):
            return jsonify({"error": "Invalid email or password"}), 401

        uid = str(row["id"])
        account_type = row["account_type"]
        access, refresh = make_access_refresh(uid, account_type)

        resp = make_response(jsonify({"message": "Login successful"}))
        set_cookies(resp, access, refresh)
        return resp, 200

    except Exception as e:
        return jsonify({"error": f"Server error: {e}"}), 500


# Endpoint to get the current user's information
# It checks the session cookie for a valid access token
# If the token is valid, it returns the user's ID and email
@auth_bp.get("/me")
def me():
    token = request.cookies.get("session")
    if not token:
        return jsonify({"error": "Unauthorized"}), 401

    decoded = decode_token(token)
    if not decoded or decoded.get("typ") != "access":
        return jsonify({"error": "Unauthorized"}), 401

    uid = decoded.get("sub")
    db = get_db()
    row = db.execute(
        "SELECT id, email, account_type FROM users WHERE id = ?", (uid,)
    ).fetchone()

    if not row:
        return jsonify({"error": "User not found"}), 404

    return (
        jsonify(
            {
                "id": row["id"] if hasattr(row, "keys") else row[0],
                "email": row["email"] if hasattr(row, "keys") else row[1],
                "account_type": row["account_type"] if hasattr(row, "keys") else row[2],
            }
        ),
        200,
    )


# Endpoint to refresh the access token using the refresh token
# If the user has a valid refresh token, a new access token is generated
@auth_bp.post("/refresh")
def refresh():
    req_token = request.cookies.get("refresh")
    if not req_token:
        return jsonify({"error": "Unauthorized"}), 401

    decoded = decode_token(req_token)
    if not decoded or decoded.get("typ") != "refresh":
        return jsonify({"error": "Unauthorized"}), 401

    uid = decoded.get("sub")
    account_type = decoded.get("account_type")

    if not account_type:
        db = get_db()
        row = db.execute(
            "SELECT account_type FROM users WHERE id = ?",
            (uid,),
        ).fetchone()
        account_type = row["account_type"] if row else "user"

    new_access = make_token(uid, ACCESS_TTL, "access", {"account_type": account_type})

    resp = make_response(jsonify({"ok": True}))

    set_cookie(resp, "session", new_access, ACCESS_TTL)
    return resp, 200


# Endpoint to handle a user logout, cleaning the users cookies
@auth_bp.post("/logout")
def logout():
    resp = make_response(jsonify({"ok": True}))
    clear_cookies(resp)
    return resp, 200
