import sqlite3
from flask import g, current_app


# Function to get the database connection
def get_db():
    if "db" not in g:
        path = current_app.config["DATABASE"]
        g.db = sqlite3.connect(path, detect_types=sqlite3.PARSE_DECLTYPES)
        g.db.row_factory = sqlite3.Row
    return g.db


# Function to close the database connection
def close_db(e=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()


# Database schema for the users table
SCHEMA = """
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS invite_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
"""


# Function to initialize the database
def init_db():
    db = get_db()
    db.executescript(SCHEMA)
    db.commit()
