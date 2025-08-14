import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const ISSUER = "agrids";
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// Helper function to verify a JWT
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

// Middleware - Protecting routes
export async function middleware(req) {
  const { pathname, search } = req.nextUrl;
  const isProtected = pathname.startsWith("/dashboard");
  const isAdmin = pathname.startsWith("/admin");

  // If the route isnt dashboard or admin - proceed to page (login page)
  if (!isProtected && !isAdmin) return NextResponse.next();

  // If the user has no cookies - return to login (not logged in)
  const session = req.cookies.get("session")?.value;
  if (!session) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }

  // If the user doesnt have admin role - return to dashboard (logged in but not admin)
  if (isAdmin) {
    const payload = await verifyJWT(session);

    if (!payload) {
      const url = new URL("/login", req.url);
      url.searchParams.set("next", pathname + search);
      return NextResponse.redirect(url);
    }

    const role = payload.account_type;

    if (role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // Continue
  return NextResponse.next();
}

// Only activate on these routes
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
