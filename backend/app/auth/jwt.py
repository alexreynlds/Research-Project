import jwt, time, os
from flask import request
from urllib.parse import urlparse

JWT_SECRET = os.getenv("JWT_SECRET", "secret_key")
JWT_ISSUER = "agrids"

ACCESS_TTL = 60 * 60
REFRESH_TTL = 60 * 60 * 24 * 30  # 30 days - change as needed
DEV_INSECURE = os.getenv("DEV_INSECURE", "0") == "1"

# Reserved claims that should not be used as custom claims
# iss: Issuer
# sub: Subject (the user ID)
# iat: Issued At
# exp: Expiration Time
# typ: Type (access, refresh)
RESERVED = {"iss", "sub", "iat", "exp", "typ"}


# Function to create a JWT token
def make_token(sub: str, ttl: int, typ: str, extra_claims: dict | None = None):
    now = int(time.time())
    payload = {"iss": JWT_ISSUER, "sub": sub, "iat": now, "exp": now + ttl, "typ": typ}
    if extra_claims:
        for k, v in extra_claims.items():
            if k not in RESERVED:
                payload[k] = v
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")


# Function to decode a JWT token
def decode_token(token: str):
    try:
        return jwt.decode(
            token,
            JWT_SECRET,
            algorithms=["HS256"],
            options={"require": ["exp", "sub", "typ", "iss"]},
        )
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None


# Function to determine the SameSite attribute for cookies
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


# Function to determine if cookies should be secure
# Will be True if program is in production
def secure_flag():
    return not DEV_INSECURE


# Function to set a cookie in the response
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


# Function to clear a specific cookie from the response
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


# Function to set cookies in the response
def set_cookies(resp, access_token: str, refresh_token: str):
    set_cookie(resp, "session", access_token, ACCESS_TTL)
    set_cookie(resp, "refresh", refresh_token, REFRESH_TTL)


# Function to clear cookies from the response
def clear_cookies(resp):
    clear_cookie(resp, "session")
    clear_cookie(resp, "refresh")


# Helper function to easily create access and refresh tokens
def make_access_refresh(sub: str, role: str) -> tuple[str, str]:
    access = make_token(sub, ACCESS_TTL, "access", {"role": role})
    refresh = make_token(sub, REFRESH_TTL, "refresh", {"role": role})

    return access, refresh
