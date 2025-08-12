import jwt, time, os
from flask import request
from urllib.parse import urlparse

JWT_SECRET = os.getenv("JWT_SECRET", "secret_key")
JWT_ISSUER = "agrids"
ACCESS_TTL = 60 * 60
REFRESH_TTL = 60 * 60 * 24 * 30  # 30 days
DEV_INSECURE = os.getenv("DEV_INSECURE", "0") == "1"


def make_token(sub: str, ttl: int, typ: str):
    now = int(time.time())
    payload = {"iss": JWT_ISSUER, "sub": sub, "iat": now, "exp": now + ttl, "typ": typ}
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")


def decode_token(token: str):
    try:
        return jwt.decode(
            token,
            JWT_SECRET,
            algorithms=["HS256"],
            options={"require": ["exp", "sub", "typ"]},
        )
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None


def same_site():
    origin = request.headers.get("Origin", "")
    host = request.headers.get("Host", "")
    if not origin:
        return "Lax"
    try:
        o_host = (urlparse(origin).hostname or "").lower()
        h_host = (host.split(":")[0]).lower()
        is_cross = o_host != h_host
    except Exception:
        is_cross = True
    return "None" if is_cross else "Lax"


def secure_flag():
    return not DEV_INSECURE


def set_cookie(response, name: str, token: str, ttl: int):
    response.set_cookie(
        name,
        token,
        httponly=True,
        secure=secure_flag(),
        samesite=same_site(),
        max_age=ttl,
        path="/",
    )


def clear_cookie(response, name: str):
    response.set_cookie(
        name,
        "",
        max_age=0,
        httponly=True,
        secure=secure_flag(),
        samesite=same_site(),
        path="/",
    )


def set_cookies(resp, access_token: str, refresh_token: str):
    set_cookie(resp, "session", access_token, ACCESS_TTL)
    set_cookie(resp, "refresh", refresh_token, REFRESH_TTL)


def clear_cookies(resp):
    clear_cookie(resp, "session")
    clear_cookie(resp, "refresh")
