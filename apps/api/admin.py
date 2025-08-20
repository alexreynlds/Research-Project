from flask import Blueprint, request, jsonify
from db import get_db

admin_bp = Blueprint("admin", __name__, url_prefix="/admin")


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
