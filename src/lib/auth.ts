import bcrypt from "bcryptjs";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

export const adminCookieName = "active_tkd_admin";
export const studentCookieName = "active_tkd_student";

const fallbackEmail = "opgaming765@gmail.com";
const fallbackPassword = "ACTIVE123!@#";

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

export function adminCookie(value: string, maxAge: number) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${adminCookieName}=${value}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${maxAge}; Priority=High${secure}`;
}

export function studentCookie(value: string, maxAge: number) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${studentCookieName}=${value}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${maxAge}; Priority=High${secure}`;
}

export async function createAdminToken(email: string) {
  return new SignJWT({ role: "admin", email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(getSecret());
}

export async function createStudentToken(studentId: string, email?: string) {
  return new SignJWT({ role: "student", studentId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
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

export async function verifyStudentToken(token?: string) {
  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.role === "student" && typeof payload.studentId === "string" ? payload : null;
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

export async function getStudentSessionFromRequest(request: NextRequest | Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`${studentCookieName}=([^;]+)`));
  const payload = await verifyStudentToken(match?.[1]);
  if (!payload || typeof payload.studentId !== "string") {
    return null;
  }

  return {
    studentId: payload.studentId,
    email: typeof payload.email === "string" ? payload.email : undefined
  };
}

export async function requireStudentRequest(request: NextRequest | Request) {
  const session = await getStudentSessionFromRequest(request);
  if (!session) {
    return {
      response: Response.json({ error: "Student login required." }, { status: 401 }),
      session: null
    };
  }

  return { response: null, session };
}

export async function requireAdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(adminCookieName)?.value;

  if (!(await verifyAdminToken(token))) {
    redirect("/admin/login");
  }
}

export async function requireStudentPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(studentCookieName)?.value;
  const payload = await verifyStudentToken(token);

  if (!payload || typeof payload.studentId !== "string") {
    redirect("/students/login");
  }

  return {
    studentId: payload.studentId,
    email: typeof payload.email === "string" ? payload.email : undefined
  };
}
