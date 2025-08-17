import json
import os
import uuid
from flask import request, jsonify, Blueprint

APP_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # -> app/
CONFIG_DIR = os.path.join(APP_DIR, "config")
API_KEYS_FILE = os.path.join(CONFIG_DIR, "api_keys.json")

api_keys_bp = Blueprint("api_keys", __name__)


def ensure_keys_file():
    os.makedirs(CONFIG_DIR, exist_ok=True)
    if not os.path.exists(API_KEYS_FILE):
        with open(API_KEYS_FILE, "w") as f:
            json.dump({"api_keys": []}, f, indent=4)


def save_all_keys(key_set):
    ensure_keys_file()
    try:
        with open(API_KEYS_FILE, "w") as f:
            json.dump({"api_keys": list(key_set)}, f, indent=4)
    except Exception as e:
        print(f"Error saving API keys: {e}")


def save_api_key(api_key):
    keys = load_api_keys()
    keys.add(api_key)
    save_all_keys(keys)


def load_api_keys():
    try:
        with open(API_KEYS_FILE, "r") as f:
            data = json.load(f)
        return set(data.get("api_keys", []))
    except FileNotFoundError:
        return set()


def delete_api_key(api_key):
    keys = load_api_keys()
    if api_key in keys:
        keys.remove(api_key)
        save_all_keys(keys)
        return True
    return False


def generate_api_key() -> str:
    return str(uuid.uuid4())


@api_keys_bp.route("/api_keys", methods=["GET"])
def list_api_keys():
    keys = load_api_keys()
    return jsonify({"api_keys": list(keys)})


@api_keys_bp.route("/api_keys", methods=["POST"])
def create_api_key():
    new_key = generate_api_key()
    save_api_key(new_key)
    return jsonify({"api_key": new_key}), 201


@api_keys_bp.route("/api_keys/<string:api_key>", methods=["DELETE"])
def delete_key(api_key):
    if delete_api_key(api_key):
        return jsonify({"message": "API key deleted successfully"}), 200
    else:
        return jsonify({"error": "API key not found"}), 404
