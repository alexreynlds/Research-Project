from flask import Blueprint, request, jsonify
from db import get_db
import string
import random

admin_bp = Blueprint("admin", __name__, url_prefix="/admin")


def generate_code(length=12):
    return "".join(random.choices(string.ascii_letters + string.digits, k=length))


@admin_bp.route("/users", methods=["GET"])
def get_users():
    print("Fetching all users...")
    db = get_db()
    users = db.execute("SELECT id, email, role FROM users ORDER BY id ASC").fetchall()

    users = [
        {"id": user["id"], "email": user["email"], "role": user["role"]}
        for user in users
    ]
    print(users)

    if not users:
        return jsonify({"users": []}), 404

    # Return users and true
    return jsonify({"users": users})


@admin_bp.delete("/users/<int:user_id>")
def delete_user(user_id: int):
    db = get_db()
    user = db.execute("SELECT id, role FROM users WHERE id = ?", (user_id,)).fetchone()

    if not user:
        return jsonify({"error": "User not found"}), 404

    if user["role"] == "admin":
        return jsonify({"error": "Cannot delete admin user"}), 403

    db.execute("DELETE FROM users WHERE id = ?", (user_id,))
    db.commit()
    return jsonify({"message": "User deleted successfully"}), 200


@admin_bp.post("/invite_codes")
def generate_invite_code():
    db = get_db()
    code = generate_code()

    try:
        db.execute("INSERT INTO invite_codes (code) VALUES (?)", (code,))
        db.commit()
        return jsonify({"invite_code": code}), 201
    except Exception:
        return jsonify({"error": "Failed to generate invite code"}), 500


@admin_bp.get("/invite_codes")
def list_invite_codes():
    db = get_db()
    codes = db.execute("SELECT id, code, created_at FROM invite_codes").fetchall()
    codes = [
        {"id": code["id"], "code": code["code"], "created_at": code["created_at"]}
        for code in codes
    ]
    return jsonify({"codes": codes}), 200


@admin_bp.delete("/invite_codes/<int:code_id>")
def delete_invite_code(code_id: int):
    db = get_db()
    code = db.execute("SELECT id FROM invite_codes WHERE id = ?", (code_id,)).fetchone()

    if not code:
        return jsonify({"error": "Invite code not found"}), 404

    db.execute("DELETE FROM invite_codes WHERE id = ?", (code_id,))
    db.commit()
    return jsonify({"message": "Invite code deleted successfully"}), 200
