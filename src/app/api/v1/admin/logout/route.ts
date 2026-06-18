import { adminCookie } from "@/lib/auth";
import { requireSameOrigin } from "@/lib/security";

export async function POST(request: Request) {
  const originError = requireSameOrigin(request);
  if (originError) return originError;

  const response = Response.json({ ok: true });
  response.headers.append("Set-Cookie", adminCookie("", 0));
  return response;
}
