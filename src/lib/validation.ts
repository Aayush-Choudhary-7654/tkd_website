import { z } from "zod";
import { mergeSiteContent, siteContentFields } from "./site-content";
import type { SiteContent } from "./types";

function isSafeUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

const imageSourceSchema = z
  .string()
  .trim()
  .max(600, "Media URL is too long.")
  .min(1, "Media is required.")
  .refine(
    (value) =>
      value.startsWith("/api/v1/uploads/") ||
      value.startsWith("/uploads/") ||
      isSafeUrl(value),
    "Media must be a valid URL or uploaded media path."
  );

export const studentSchema = z.object({
  name: z.string().trim().min(2, "Full name is required.").max(80),
  age: z.coerce.number().int().min(3).max(80),
  phone: z.string().trim().min(7, "Phone number is required.").max(24),
  email: z.string().trim().email("Valid email is required.").max(120),
  parentName: z.string().trim().max(80).optional().default(""),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  program: z.string().trim().min(2, "Program is required.").max(120)
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is required.").max(80),
  phone: z.string().trim().min(7, "Phone number is required.").max(24),
  email: z.string().trim().email("Valid email is required.").max(120),
  message: z.string().trim().min(5, "Message is required.").max(1000)
});

export const programSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().min(10).max(1200),
  ageGroup: z.string().trim().min(2).max(80),
  schedule: z.string().trim().min(2).max(120),
  fees: z.string().trim().max(80).optional().default(""),
  image: imageSourceSchema
});

export const scheduleSchema = z.object({
  day: z.string().trim().min(2).max(20),
  time: z.string().trim().min(2).max(80),
  program: z.string().trim().min(2).max(120)
});

export const gallerySchema = z.object({
  imageUrl: imageSourceSchema,
  category: z.string().trim().min(2, "Gallery category is required.").max(80)
});

export const achievementSchema = z.object({
  title: z.string().trim().min(2).max(140),
  description: z.string().trim().min(10).max(1200),
  image: imageSourceSchema,
  date: z.string().trim().min(4).max(40)
});

const siteContentShape = siteContentFields.reduce(
  (shape, field) => {
    shape[field.name] =
      field.type === "url"
        ? z
            .string()
            .trim()
            .max(600, `${field.label} is too long.`)
            .refine(isSafeUrl, `${field.label} must be a valid http or https URL.`)
        : z.string().trim().min(1, `${field.label} is required.`).max(1600);
    return shape;
  },
  {} as Record<keyof SiteContent, z.ZodType<string>>
);

export const siteContentSchema = z
  .object(siteContentShape)
  .partial()
  .transform((value) => mergeSiteContent(value as Partial<SiteContent>));

export async function readJson<T>(request: Request, schema: z.ZodSchema<T>) {
  const body = await request.json();
  return schema.parse(body);
}
