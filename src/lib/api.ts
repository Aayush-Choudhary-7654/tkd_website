import { ZodError } from "zod";

export function jsonOk(data: unknown, init?: ResponseInit) {
  return Response.json(data, init);
}

export function jsonError(error: unknown, fallback = "Something went wrong.") {
  if (error instanceof ZodError) {
    return Response.json(
      { error: "Validation failed.", details: error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  if (error instanceof Error && error.message.includes("MONGODB_URI")) {
    return Response.json({ error: error.message }, { status: 503 });
  }

  console.error(error);
  return Response.json({ error: fallback }, { status: 500 });
}
