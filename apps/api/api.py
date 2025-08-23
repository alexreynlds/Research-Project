from flask import Blueprint, jsonify
import uuid


api_bp = Blueprint("api", __name__, url_prefix="/api")


@api_bp.get("/generate_key")
def generate_key():
    new_key = str(uuid.uuid4())
    return jsonify({"api_key": new_key})
