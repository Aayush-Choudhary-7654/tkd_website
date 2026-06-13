import bcrypt from "bcryptjs";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

export const adminCookieName = "active_tkd_admin";

const fallbackEmail = "admin@activetaekwondo.com";
const fallbackPassword = "admin123";

function getSecret() {
  const secret =
    process.env.AUTH_SECRET ||
    (process.env.NODE_ENV === "production" ? "" : "local-development-secret");

  if (!secret) {
    throw new Error("AUTH_SECRET must be configured in production.");
  }

  return new TextEncoder().encode(secret);
}

export async function verifyAdminCredentials(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL || fallbackEmail;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;

  if (email.toLowerCase() !== adminEmail.toLowerCase()) {
    return false;
  }

  if (passwordHash) {
    return bcrypt.compare(password, passwordHash);
  }

  return process.env.NODE_ENV !== "production" && password === fallbackPassword;
}

export async function createAdminToken(email: string) {
  return new SignJWT({ role: "admin", email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(getSecret());
}

export async function verifyAdminToken(token?: string) {
  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.role === "admin" ? payload : null;
  } catch {
    return null;
  }
}

export async function isAdminRequest(request: NextRequest | Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`${adminCookieName}=([^;]+)`));
  return Boolean(await verifyAdminToken(match?.[1]));
}

export async function requireAdminRequest(request: NextRequest | Request) {
  if (!(await isAdminRequest(request))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function requireAdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(adminCookieName)?.value;

  if (!(await verifyAdminToken(token))) {
    redirect("/admin/login");
  }
}
