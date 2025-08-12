from flask import Blueprint, jsonify

test_bp = Blueprint("test", __name__)


@test_bp.get("/health")
def health():
    return jsonify({"status": "ok"}), 200
