import { ObjectId, type Document, type OptionalUnlessRequiredId } from "mongodb";
import { getDb, hasMongoConfig } from "./mongodb";
import {
  defaultAchievements,
  defaultGallery,
  defaultPrograms,
  defaultSchedule
} from "./seed-data";
import type {
  Achievement,
  ContactInquiry,
  GalleryItem,
  Program,
  PublicContent,
  ScheduleItem,
  Student
} from "./types";

export type CollectionName =
  | "students"
  | "contacts"
  | "programs"
  | "schedule"
  | "gallery"
  | "achievements";

const fallbackContent = {
  programs: defaultPrograms,
  schedule: defaultSchedule,
  gallery: defaultGallery,
  achievements: defaultAchievements
};

function normalizeId(value: unknown) {
  if (value instanceof ObjectId) {
    return value.toHexString();
  }
  return String(value || "");
}

export function toPlain<T extends Record<string, unknown>>(doc: T) {
  const { _id, ...rest } = doc;
  const plain: Record<string, unknown> = {
    id: doc.id ? String(doc.id) : normalizeId(_id),
    ...rest
  };

  for (const [key, value] of Object.entries(plain)) {
    if (value instanceof Date) {
      plain[key] = value.toISOString();
    }
  }

  return plain;
}

export async function listDocuments<T extends Record<string, unknown>>(
  collectionName: CollectionName,
  options: { fallback?: T[]; sort?: Document } = {}
): Promise<T[]> {
  if (!hasMongoConfig()) {
    return options.fallback || [];
  }

  try {
    const db = await getDb();
    const docs = await db
      .collection(collectionName)
      .find({})
      .sort(options.sort || { createdAt: -1 })
      .toArray();
    return docs.map((doc) => toPlain(doc) as T);
  } catch (error) {
    console.error(`Failed to read ${collectionName}:`, error);
    return options.fallback || [];
  }
}

export async function insertDocument<T extends Document>(
  collectionName: CollectionName,
  payload: OptionalUnlessRequiredId<T>
) {
  const db = await getDb();
  const result = await db.collection<T>(collectionName).insertOne(payload);
  const doc = await db.collection(collectionName).findOne({ _id: result.insertedId });
  return doc ? toPlain(doc) : { id: result.insertedId.toHexString(), ...payload };
}

export async function updateDocument(
  collectionName: CollectionName,
  id: string,
  payload: Document
) {
  const db = await getDb();
  await db
    .collection(collectionName)
    .updateOne({ _id: new ObjectId(id) }, { $set: payload });
  const doc = await db.collection(collectionName).findOne({ _id: new ObjectId(id) });
  return doc ? toPlain(doc) : null;
}

export async function deleteDocument(collectionName: CollectionName, id: string) {
  const db = await getDb();
  const result = await db.collection(collectionName).deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

export async function getPublicContent(): Promise<PublicContent> {
  const [programs, schedule, gallery, achievements] = await Promise.all([
    listDocuments<Program>("programs", {
      fallback: fallbackContent.programs,
      sort: { name: 1 }
    }),
    listDocuments<ScheduleItem>("schedule", {
      fallback: fallbackContent.schedule,
      sort: { day: 1, time: 1 }
    }),
    listDocuments<GalleryItem>("gallery", {
      fallback: fallbackContent.gallery,
      sort: { createdAt: -1 }
    }),
    listDocuments<Achievement>("achievements", {
      fallback: fallbackContent.achievements,
      sort: { date: -1 }
    })
  ]);

  return { programs, schedule, gallery, achievements };
}

export async function getStudents() {
  return listDocuments<Student>("students", { sort: { createdAt: -1 } });
}

export async function getContacts() {
  return listDocuments<ContactInquiry>("contacts", { sort: { createdAt: -1 } });
}
