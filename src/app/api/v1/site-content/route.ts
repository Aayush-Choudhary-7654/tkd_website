import { jsonError, jsonOk } from "@/lib/api";
import { getSiteContent, saveSiteContent } from "@/lib/repository";
import { requireSecureAdminJsonMutation } from "@/lib/security";
import { readJson, siteContentSchema } from "@/lib/validation";

export async function GET() {
  const siteContent = await getSiteContent();
  return jsonOk({ siteContent });
}

export async function PUT(request: Request) {
  const unauthorized = await requireSecureAdminJsonMutation(request, "admin-site-content");
  if (unauthorized) return unauthorized;

  try {
    const payload = await readJson(request, siteContentSchema);
    const siteContent = await saveSiteContent(payload);
    return jsonOk({ siteContent });
  } catch (error) {
    return jsonError(error, "Could not update site content.");
  }
}
