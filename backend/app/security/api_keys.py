import json
import os
import uuid
from flask import request, jsonify, Blueprint

APP_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # -> app/
CONFIG_DIR = os.path.join(APP_DIR, "config")
API_KEYS_FILE = os.path.join(CONFIG_DIR, "api_keys.json")

api_keys_bp = Blueprint("api_keys", __name__)


def load_api_keys():
    try:
        with open(API_KEYS_FILE, "r") as f:
            data = json.load(f)
        return set(data.get("api_keys", []))
    except FileNotFoundError:
        return set()


def save_api_key(api_key):
    keys = load_api_keys()
    keys.add(api_key)
    with open(API_KEYS_FILE, "w") as f:
        json.dump({"api_keys": list(keys)}, f, indent=4)


@api_keys_bp.route("/api_keys", methods=["GET"])
def list_api_keys():
    keys = load_api_keys()
    return jsonify({"api_keys": list(keys)})
