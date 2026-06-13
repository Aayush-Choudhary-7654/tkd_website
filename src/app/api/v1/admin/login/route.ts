import { createAdminToken, verifyAdminCredentials, adminCookieName } from "@/lib/auth";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!(await verifyAdminCredentials(String(email || ""), String(password || "")))) {
    return Response.json({ error: "Invalid admin credentials." }, { status: 401 });
  }

  const token = await createAdminToken(String(email));
  const response = Response.json({ ok: true });
  response.headers.append(
    "Set-Cookie",
    `${adminCookieName}=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=28800${
      process.env.NODE_ENV === "production" ? "; Secure" : ""
    }`
  );
  return response;
}
