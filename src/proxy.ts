import { jwtVerify } from "jose";
import { NextResponse, type NextRequest } from "next/server";

const studentCookieName = "active_tkd_student";

function getSecret() {
  const secret =
    process.env.AUTH_SECRET ||
    (process.env.NODE_ENV === "production" ? "" : "local-development-secret");

  if (!secret) {
    return null;
  }

  return new TextEncoder().encode(secret);
}

async function hasValidStudentToken(token?: string) {
  const secret = getSecret();
  if (!token || !secret) {
    return false;
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload.role === "student" && typeof payload.studentId === "string";
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/students/login" || pathname.startsWith("/students/login/")) {
    return NextResponse.next();
  }

  if (await hasValidStudentToken(request.cookies.get(studentCookieName)?.value)) {
    return NextResponse.next();
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/students/login";
  loginUrl.searchParams.set("next", pathname);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/students/:path*"]
};
