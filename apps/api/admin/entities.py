import os
from flask import Blueprint, request, jsonify, current_app
import requests

entities_bp = Blueprint("entities", __name__, url_prefix="/api/v1")

ORION_BASE = os.getenv("FIWARE_ORION_BASE_URL", "http://localhost:1026/v2")
FIWARE_SERVICE = os.getenv("FIWARE_SERVICE", "agrids")
FIWARE_SERVICE_PATH = os.getenv("FIWARE_SERVICE_PATH", "/")


def fiware_headers():
    return {
        "Fiware-Service": FIWARE_SERVICE,
        "Fiware-ServicePath": FIWARE_SERVICE_PATH,
    }


# Entrypoint to list entities in Orion
@entities_bp.get("/entities")
def list_entities():
    limit = 1000
    offset = 0
    items = []
    session = requests.Session()

    params = {
        "options": "keyValues",
        "limit": limit,
        "offset": offset,
    }

    while True:
        params["offset"] = offset
        r = session.get(
            f"{ORION_BASE}/entities",
            headers=fiware_headers(),
            params=params,
            timeout=10,
        )
        r.raise_for_status()
        batch = r.json() if r.text.strip() else []
        if not isinstance(batch, list):
            batch = []
        for e in batch:
            items.append(
                {
                    "id": e.get("id", ""),
                    "type": e.get("type", ""),
                    "vineyard_id": e.get("vineyard_id", ""),
                    "name": e.get("name", ""),
                    "user_defined_id": e.get("user_defined_id", ""),
                }
            )
        if len(batch) < limit:
            break
        offset += limit

    return jsonify(items), 200


# Entrypoint to delete enetiries in Orion,
# will be given a list of entity IDs to delete
@entities_bp.delete("/entities")
def delete_entities():
    data = request.get_json(silent=True) or {}
    entity_ids = data.get("entity_ids", [])

    if not isinstance(entity_ids, list) or not all(
        isinstance(eid, str) for eid in entity_ids
    ):
        return jsonify(
            {"error": "Invalid entity_ids format, needs to be {ids: [`id1`, `id2`]}"}
        ), 400

    session = requests.Session()
    deleted, failed = [], []

    for eid in entity_ids:
        try:
            r = session.delete(
                f"{ORION_BASE}/entities/{eid}",
                headers=fiware_headers(),
                timeout=10,
            )
            if r.status_code in (204, 404):
                deleted.append(eid)
            else:
                current_app.logger.error(
                    f"Failed to delete entity {eid}: {r.status_code} {r.text}"
                )
                failed.append(eid)
        except requests.RequestException as e:
            current_app.logger.error(f"Error deleting entity {eid}: {str(e)}")
            failed.append(eid)

    return jsonify({"deleted": deleted, "failed": failed}), 200
