import { adminCookie, createAdminToken, verifyAdminCredentials } from "@/lib/auth";
import { rateLimit, requireJsonRequest, requireSameOrigin } from "@/lib/security";

export async function POST(request: Request) {
  const originError = requireSameOrigin(request);
  if (originError) return originError;

  const contentTypeError = requireJsonRequest(request);
  if (contentTypeError) return contentTypeError;

  const { email, password } = await request.json();
  const limited = rateLimit(request, {
    key: `admin-login:${String(email || "").toLowerCase()}`,
    limit: 5,
    windowMs: 15 * 60 * 1000
  });
  if (limited) return limited;

  if (!(await verifyAdminCredentials(String(email || ""), String(password || "")))) {
    return Response.json({ error: "Invalid admin credentials." }, { status: 401 });
  }

  const token = await createAdminToken(String(email));
  const response = Response.json({ ok: true });
  response.headers.append("Set-Cookie", adminCookie(token, 28800));
  return response;
}
