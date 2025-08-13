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
    conn = sqlite3.connect(DB_PATH, timeout=5.0)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    db = get_db()

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

    app.register_blueprint(test_bp, url_prefix="/api")
    app.register_blueprint(auth_bp, url_prefix="/api")

    init_db()

    return app
