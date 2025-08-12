# app/auth.py
# This file handles user authentication across the application.

import sqlite3
from flask import Blueprint, request, jsonify
from .. import get_db, bcrypt

auth_bp = Blueprint("auth", __name__)


# Normalize email function
def _norm_email(v: str) -> str:
    return (v or "").strip().lower()


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
            "INSERT INTO users (email, password) VALUES (?, ?)",
            (email, hashed),
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
            "SELECT id, email, password FROM users WHERE email = ?",
            (email,),
        ).fetchone()

        if not row:
            return jsonify({"error": "Invalid email or password"}), 401

        stored_hash = row["password"] if hasattr(row, "keys") else row[2]
        if not bcrypt.check_password_hash(stored_hash, password):
            return jsonify({"error": "Invalid email or password"}), 401

        user = {
            "id": row["id"] if hasattr(row, "keys") else row[0],
            "email": row["email"] if hasattr(row, "keys") else row[1],
        }
        return jsonify({"message": "Login successful", "user": user}), 200

    except Exception as e:
        return jsonify({"error": f"Server error: {e}"}), 500
