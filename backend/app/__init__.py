from flask import Flask
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
import sqlite3
from pathlib import Path

bcrypt = Bcrypt()
load_dotenv()

DB_PATH = Path(__file__).resolve().parent.parent / "app.db"


def get_db():
    conn = sqlite3.connect(DB_PATH, timeout=5.0, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db():
    db = get_db()

    # Users table
    db.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            account_type TEXT NOT NULL,
            password TEXT NOT NULL
        )
    """
    )

    # Vineyards table
    db.execute(
        """
      CREATE TABLE IF NOT EXISTS vineyards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        name TEXT NOT NULL,
        street_address TEXT,
        owner TEXT,
        geom TEXT
      )
    """
    )

    db.execute(
        """
        CREATE TABLE IF NOT EXISTS user_vineyards (
            user_id INTEGER NOT NULL,
            vineyard_id INTEGER NOT NULL,
            PRIMARY KEY (user_id, vineyard_id),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (vineyard_id) REFERENCES vineyards(id) ON DELETE CASCADE
        )
    """
    )

    db.execute(
        "CREATE INDEX IF NOT EXISTS idx_user_vineyards_user ON user_vineyards(user_id)"
    )
    db.execute(
        "CREATE INDEX IF NOT EXISTS idx_user_vineyards_vineyard ON user_vineyards(vineyard_id)"
    )

    db.commit()
    db.close()


def create_app():
    app = Flask(__name__)

    app.config.from_mapping(
        JSON_SORT_KEYS=False,
    )

    bcrypt.init_app(app)
    CORS(
        app,
        supports_credentials=True,
        resources={r"/api/*": {"origins": "http://localhost:3000"}},
    )

    from .test_functions.test import test_bp
    from .auth.auth import auth_bp
    from .admin.admin import admin_bp
    from .security.api_keys import api_keys_bp

    app.register_blueprint(test_bp, url_prefix="/api")
    app.register_blueprint(auth_bp, url_prefix="/api")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(api_keys_bp, url_prefix="/api")

    init_db()

    return app
