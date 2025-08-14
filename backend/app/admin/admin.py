from flask import Blueprint, request, jsonify
from app.auth.jwt import decode_token
from .. import get_db

admin_bp = Blueprint("admin", __name__)


def require_admin():
    token = request.cookies.get("session")

    if not token:
        return None, jsonify({"error": "Unauthorized"}), 401

    decoded = decode_token(token)

    if not decoded or decoded.get("typ") != "access":
        return None, jsonify({"error": "Unauthorized"}), 401

    if decoded.get("account_type") != "admin":
        return None, jsonify({"error": "Forbidden"}), 403

    return decoded, None


@admin_bp.route("/users", methods=["GET"])
def list_users():
    _, err = require_admin()
    if err:
        return err

    db = get_db()
    users = db.execute(
        "SELECT id, email, account_type FROM users ORDER BY id ASC"
    ).fetchall()

    users = [
        {
            "id": u["id"],
            "email": u["email"],
            "account_type": u["account_type"],
            "vineyards": [],
        }
        for u in users
    ]

    if not users:
        return jsonify({"users": []})

    user_ids = tuple(u["id"] for u in users)
    q_marks = ",".join(["?"] * len(user_ids))
    rows = db.execute(
        f"""
        SELECT uv.user_id, v.id, v.type, v.name, v.street_address, v.owner, v.geom
        FROM user_vineyards uv
        JOIN vineyards v ON v.id = uv.vineyard_id
        WHERE uv.user_id IN ({q_marks})
        ORDER BY v.name
        """,
        user_ids,
    ).fetchall()

    by_user = {}
    for r in rows:
        by_user.setdefault(r["user_id"], []).append(
            {
                "id": r["id"],
                "type": r["type"],
                "name": r["name"],
                "street_address": r["street_address"],
                "owner": r["owner"],
                "geom": r["geom"],
            }
        )

    for u in users:
        u["vineyards"] = by_user.get(u["id"], [])

    return jsonify({"users": users})


@admin_bp.get("/vineyards")
def list_vineyards():
    payload, error = require_admin()
    if error:
        return error

    db = get_db()
    rows = db.execute(
        """
        SELECT id, type, name, street_address, owner, geom
        FROM vineyards
        ORDER BY id
        """
    ).fetchall()
    vineyards = [dict(r) for r in rows]
    return jsonify({"vineyards": vineyards})


@admin_bp.post("/users/<int:user_id>/vineyards")
def add_vineyard_to_user(user_id: int):
    _, error = require_admin()
    if error:
        return err

    data = request.get_json(silent=True) or {}
    vineyard_id = data.get("vineyardId")
    if not vineyard_id:
        return jsonify({"error": "vineyard_id is required"}), 400

    db = get_db()

    user = db.execute(
        "SELECT id FROM users WHERE id = ?",
        (user_id,),
    ).fetchone()

    vineyard = db.execute(
        "SELECT id FROM vineyards WHERE id = ?",
        (vineyard_id,),
    ).fetchone()

    if not user or not vineyard:
        return jsonify({"error": "User or vineyard not found"}), 404

    try:
        db.execute(
            "INSERT OR IGNORE INTO user_vineyards (user_id, vineyard_id) VALUES (?, ?)",
            (user_id, vineyard_id),
        )
        db.commit()
        return jsonify({"message": "Vineyard added to user successfully"}), 201
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500


@admin_bp.delete("/users/<int:user_id>/vineyards/<int:vineyard_id>")
def remove_vineyard_from_user(user_id: int, vineyard_id: int):
    _, err = require_admin()
    if err:
        return err

    db = get_db()
    db.execute(
        "DELETE FROM user_vineyards WHERE user_id = ? AND vineyard_id = ?",
        (user_id, vineyard_id),
    )
    db.commit()
    return jsonify({"message": "Vineyard removed from user successfully"}), 200


@admin_bp.delete("/user/<int:user_id>")
def delete_user(user_id: int):
    _, err = require_admin()
    if err:
        return err

    db = get_db()
    db.execute("DELETE FROM users WHERE id = ?", (user_id,))
    db.execute("DELETE FROM user_vineyards WHERE user_id = ?", (user_id,))
    db.commit()
    return jsonify({"message": "User deleted successfully"}), 200
