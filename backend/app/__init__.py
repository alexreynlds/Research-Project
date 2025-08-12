from flask import Flask
from flask_cors import CORS

from .test_functions.test import test_bp
from .auth.login import login_bp


def create_app():
    app = Flask(__name__)

    app.config.from_mapping(
        JSON_SORT_KEYS=False,
    )

    CORS(app, resources={r"/api/*": {"origins": "*"}})

    app.register_blueprint(test_bp, url_prefix="/api")
    app.register_blueprint(login_bp, url_prefix="/api")

    return app
