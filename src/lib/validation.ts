import { z } from "zod";

export const studentSchema = z.object({
  name: z.string().trim().min(2, "Full name is required."),
  age: z.coerce.number().int().min(3).max(80),
  phone: z.string().trim().min(7, "Phone number is required."),
  parentName: z.string().trim().optional().default(""),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  program: z.string().trim().min(2, "Program is required.")
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is required."),
  phone: z.string().trim().min(7, "Phone number is required."),
  message: z.string().trim().min(5, "Message is required.")
});

export const programSchema = z.object({
  name: z.string().trim().min(2),
  description: z.string().trim().min(10),
  ageGroup: z.string().trim().min(2),
  schedule: z.string().trim().min(2),
  fees: z.string().trim().optional().default(""),
  image: z.string().trim().url()
});

export const scheduleSchema = z.object({
  day: z.string().trim().min(2),
  time: z.string().trim().min(2),
  program: z.string().trim().min(2)
});

export const gallerySchema = z.object({
  imageUrl: z.string().trim().url(),
  category: z.enum(["Training", "Events", "Competition"])
});

export const achievementSchema = z.object({
  title: z.string().trim().min(2),
  description: z.string().trim().min(10),
  image: z.string().trim().url(),
  date: z.string().trim().min(4)
});

export async function readJson<T>(request: Request, schema: z.ZodSchema<T>) {
  const body = await request.json();
  return schema.parse(body);
}
