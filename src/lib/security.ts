import { requireAdminRequest } from "./auth";

type RateLimitOptions = {
  limit: number;
  windowMs: number;
  key: string;
};

type Bucket = {
  count: number;
  resetAt: number;
};

const globalRateStore = globalThis as typeof globalThis & {
  activeTkdRateLimits?: Map<string, Bucket>;
};

const rateLimits = globalRateStore.activeTkdRateLimits || new Map<string, Bucket>();
globalRateStore.activeTkdRateLimits = rateLimits;

function getAllowedOrigins(request: Request) {
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
  const protocol =
    request.headers.get("x-forwarded-proto") ||
    (process.env.NODE_ENV === "production" ? "https" : "http");
  const currentOrigin = host ? `${protocol}://${host}` : "";
  const configured = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return new Set([currentOrigin, ...configured].filter(Boolean));
}

export function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    forwardedFor ||
    "local"
  );
}

export function requireSameOrigin(request: Request) {
  const method = request.method.toUpperCase();
  if (!["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    return null;
  }

  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
  const allowedOrigins = getAllowedOrigins(request);

  if (origin) {
    try {
      if (allowedOrigins.has(origin) || new URL(origin).host === host) {
        return null;
      }
    } catch {
      return Response.json({ error: "Invalid request origin." }, { status: 403 });
    }
  }

  if (!origin && referer) {
    try {
      const refererOrigin = new URL(referer).origin;
      if (allowedOrigins.has(refererOrigin) || new URL(referer).host === host) {
        return null;
      }
    } catch {
      return Response.json({ error: "Invalid request origin." }, { status: 403 });
    }
  }

  if (!origin && !referer && process.env.NODE_ENV !== "production") {
    return null;
  }

  return Response.json({ error: "Invalid request origin." }, { status: 403 });
}

export function rateLimit(request: Request, options: RateLimitOptions) {
  const now = Date.now();
  const key = `${options.key}:${getClientIp(request)}`;

  for (const [bucketKey, bucket] of rateLimits.entries()) {
    if (bucket.resetAt <= now) {
      rateLimits.delete(bucketKey);
    }
  }

  const bucket = rateLimits.get(key);
  if (!bucket || bucket.resetAt <= now) {
    rateLimits.set(key, { count: 1, resetAt: now + options.windowMs });
    return null;
  }

  bucket.count += 1;

  if (bucket.count <= options.limit) {
    return null;
  }

  const retryAfter = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
  return Response.json(
    { error: "Too many requests. Please try again later." },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfter),
        "X-RateLimit-Limit": String(options.limit),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(Math.ceil(bucket.resetAt / 1000))
      }
    }
  );
}

export function requireJsonRequest(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return Response.json({ error: "Content-Type must be application/json." }, { status: 415 });
  }
  return null;
}

export async function requireSecureAdminMutation(request: Request, key = "admin-mutation") {
  const originError = requireSameOrigin(request);
  if (originError) return originError;

  const limited = rateLimit(request, {
    key,
    limit: 120,
    windowMs: 10 * 60 * 1000
  });
  if (limited) return limited;

  return requireAdminRequest(request);
}

export async function requireSecureAdminJsonMutation(request: Request, key = "admin-json-mutation") {
  const unauthorized = await requireSecureAdminMutation(request, key);
  if (unauthorized) return unauthorized;

  return requireJsonRequest(request);
}
