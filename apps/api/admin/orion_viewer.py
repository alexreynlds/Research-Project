import os
import requests
from flask import Blueprint, request, Response, jsonify

viewer_bp = Blueprint("orion_viewer", __name__, url_prefix="/api/orion")


ORION_BASE = os.getenv("FIWARE_ORION_BASE_URL", "http://localhost:1026/v2").rstrip("/")
FIWARE_SERVICE = os.getenv("FIWARE_SERVICE", "agrids")
FIWARE_SERVICE_PATH = os.getenv("FIWARE_SERVICE_PATH", "/")


# Helper function to generate Fiware headers
def fiware_headers():
    return {"Fiware-Service": FIWARE_SERVICE, "Fiware-ServicePath": FIWARE_SERVICE_PATH}


# Entrypoint to list available Orion API endpoints
@viewer_bp.get("/index")
def index():
    return jsonify(
        {
            "entities": "/api/orion/proxy/v2/entities",
            "subscriptions": "/api/orion/proxy/v2/subscriptions",
            "registrations": "/api/orion/proxy/v2/registrations",
            "types": "/api/orion/proxy/v2/types",
            "version": "/api/orion/proxy/version",
        }
    )


# Entrypoint to proxy requests to Orion
@viewer_bp.route("/proxy/<path:path>", methods=["GET"])
def proxy(path: str):
    url = f"{ORION_BASE}/{path.lstrip('/')}"
    try:
        r = requests.get(url, headers=fiware_headers(), params=request.args, timeout=20)
    except requests.RequestException as ex:
        return jsonify({"error": "orion_unreachable", "detail": str(ex)}), 502

    resp = Response(
        r.content,
        status=r.status_code,
        mimetype=r.headers.get("Content-Type", "application/json"),
    )
    for h in ("Fiware-Total-Count", "Link"):
        if h in r.headers:
            resp.headers[h] = r.headers[h]
    return resp
