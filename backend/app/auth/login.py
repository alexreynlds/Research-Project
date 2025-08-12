# login.py
from .. import get_db, bcrypt
from flask import Blueprint, request, jsonify

login_bp = Blueprint("login", __name__)


@login_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    try:
        db = get_db()
        row = db.execute(
            "SELECT id, email, password FROM users WHERE email =?", (email,)
        ).fetchone()

        if not row:
            return jsonify({"error": "Invalid email or password"}), 401

        stored_pw = row["password"] if hasattr(row, "keys") else row[2]

        if not bcrypt.check_password_hash(stored_pw, password):
            return jsonify({"error": "Invalid email or password"}), 401

        return jsonify({"message": "Login successfull"}), 200

    except Exception as e:
        return jsonify({"error", "Server error: ", e})
