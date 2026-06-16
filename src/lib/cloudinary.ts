import { createHash } from "crypto";

const placeholderValues = new Set([
  "",
  "replace-with-cloud-name",
  "replace-with-api-key",
  "replace-with-api-secret"
]);

const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim() || "";
const apiKey = process.env.CLOUDINARY_API_KEY?.trim() || "";
const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim() || "";
const uploadFolder = process.env.CLOUDINARY_UPLOAD_FOLDER?.trim() || "active-taekwondo/gallery";

export function getCloudinaryConfigStatus() {
  const missing = [
    ["CLOUDINARY_CLOUD_NAME", cloudName],
    ["CLOUDINARY_API_KEY", apiKey],
    ["CLOUDINARY_API_SECRET", apiSecret]
  ]
    .filter(([, value]) => placeholderValues.has(value))
    .map(([key]) => key);

  return {
    configured: missing.length === 0,
    missing
  };
}

export function hasCloudinaryConfig() {
  return getCloudinaryConfigStatus().configured;
}

function signUpload(params: Record<string, string>) {
  const payload = Object.entries(params)
    .filter(([, value]) => value)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return createHash("sha1").update(`${payload}${apiSecret}`).digest("hex");
}

type CloudinaryUploadResponse = {
  public_id?: string;
  secure_url?: string;
  error?: { message?: string };
};

export async function uploadImageToCloudinary(file: File) {
  const config = getCloudinaryConfigStatus();
  if (!config.configured) {
    throw new Error(
      `Cloudinary is not configured. Missing ${config.missing.join(", ")}.`
    );
  }

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signedParams = {
    folder: uploadFolder,
    timestamp
  };

  const body = new FormData();
  body.append("file", file);
  body.append("api_key", apiKey);
  body.append("timestamp", timestamp);
  body.append("folder", uploadFolder);
  body.append("signature", signUpload(signedParams));

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body
  });
  const data = (await response.json().catch(() => null)) as CloudinaryUploadResponse | null;

  if (!response.ok || !data?.secure_url) {
    throw new Error(data?.error?.message || "Cloudinary upload failed.");
  }

  return {
    publicId: data.public_id || "",
    url: data.secure_url
  };
}
