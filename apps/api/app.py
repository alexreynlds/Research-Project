import os
from flask import Flask
from flask_cors import CORS
from extensions import bcrypt
from dotenv import load_dotenv

from db import init_db, close_db
from auth import auth_bp
from admin.admin import admin_bp
from admin.entities import entities_bp
from api import api_bp


def create_app():
    load_dotenv()

    # Initalize Flask application
    # and set up CORS
    app = Flask(__name__)
    CORS(
        app,
        supports_credentials=True,
        resources={r"/*": {"origins": ["http://localhost:3000"]}},
    )

    # Load all the environment variables
    app.config.update(
        SECRET_KEY=os.environ.get("SECRET_KEY", "dev"),
        JWT_ISSUER=os.environ.get("JWT_ISSUER", "agrids"),
        JWT_COOKIE_NAME=os.environ.get("JWT_COOKIE_NAME", "session"),
        JWT_ACCESS_TTL=int(os.environ.get("JWT_ACCESS_TTL", "1800")),
        DATABASE=os.environ.get("DATABASE", "./agrids.sqlite"),
    )

    bcrypt.init_app(app)

    @app.teardown_appcontext
    def _teardown(exc):
        close_db()

    with app.app_context():
        init_db()

    app.register_blueprint(auth_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(api_bp)
    app.register_blueprint(entities_bp)

    # Small health check endpoint
    @app.get("/health")
    def health():
        return {"ok": True}

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5050, debug=True)
