import time
from flask import Blueprint, request, jsonify

login_bp = Blueprint("login", __name__)


@login_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    print(
        f"Login attempt at {time.strftime('%Y-%m-%d %H:%M:%S')}: Username: {
            username
        }, Password: {password}"
    )

    if username == "admin" and password == "password":
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401
