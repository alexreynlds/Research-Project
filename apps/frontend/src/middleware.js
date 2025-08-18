import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const ISSUER = "agrids";
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// Helper function to verify a JWT token
async function verifyJWT(token) {
  try {
    const { payload } = await jwtVerify(token, SECRET, {
      issuer: ISSUER,
      algorithms: ["HS256"],
    });
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(req) {
  const url = req.nextUrl;
  const path = url.pathname;

  const isLogin = path === "/login";

  const session = req.cookies.get("session")?.value;

  // If going to login for whatever reason whilst already being logged in,
  // send to dashboard
  if (isLogin) {
    if (session) return NextResponse.redirect(new URL("/", req.url));
    return NextResponse.next();
  }

  // Protect root "/"
  if (path === "/") {
    if (!session) {
      const dest = new URL("/login", req.url);
      dest.searchParams.set("next", path + url.search);
      return NextResponse.redirect(dest);
    }
    return NextResponse.next();
  }

  // Admin-only guard
  if (path.startsWith("/admin")) {
    if (!session) {
      const dest = new URL("/login", req.url);
      dest.searchParams.set("next", path + url.search);
      return NextResponse.redirect(dest);
    }
    const payload = await verifyJWT(session);
    if (!payload || payload.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Run on everything except static assets and API routes
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|img|public|api).*)"],
};
