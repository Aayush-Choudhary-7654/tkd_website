import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { ObjectId, type Document, type Filter, type OptionalUnlessRequiredId } from "mongodb";
import { getDb, hasMongoConfig } from "./mongodb";
import {
  defaultAchievements,
  defaultGallery,
  defaultPrograms,
  defaultSchedule
} from "./seed-data";
import { mergeSiteContent } from "./site-content";
import { sortScheduleItems } from "./schedule-order";
import type {
  Achievement,
  ContactInquiry,
  GalleryItem,
  Program,
  PublicContent,
  ScheduleItem,
  SiteContent,
  Student
} from "./types";

export type CollectionName =
  | "students"
  | "contacts"
  | "programs"
  | "schedule"
  | "gallery"
  | "achievements"
  | "siteContent";

const fallbackContent = {
  programs: defaultPrograms,
  schedule: defaultSchedule,
  gallery: defaultGallery,
  achievements: defaultAchievements
};

type EditableCollectionName = keyof typeof fallbackContent;

const localDataDir = path.join(process.cwd(), ".data");
let mongoDisabledForProcess = false;

function canUseLocalFallback() {
  return process.env.NODE_ENV !== "production" && !process.env.VERCEL;
}

function shouldUseMongo() {
  return hasMongoConfig() && !mongoDisabledForProcess && process.env.NEXT_PHASE !== "phase-production-build";
}

function switchToLocalFallback(collectionName: CollectionName, error: unknown) {
  mongoDisabledForProcess = true;
  const message = error instanceof Error ? error.message : String(error);
  console.info(`Mongo unavailable for ${collectionName}; using local .data fallback. ${message}`);
}

async function readLocalDocuments<T>(collectionName: CollectionName): Promise<T[]> {
  try {
    const content = await fs.readFile(path.join(localDataDir, `${collectionName}.json`), "utf8");
    return JSON.parse(content) as T[];
  } catch (error) {
    const code = error instanceof Error && "code" in error ? (error as NodeJS.ErrnoException).code : "";
    if (code !== "ENOENT") {
      console.error(`Failed to read local ${collectionName}:`, error);
    }
    return [];
  }
}

async function localCollectionExists(collectionName: CollectionName) {
  try {
    await fs.access(path.join(localDataDir, `${collectionName}.json`));
    return true;
  } catch {
    return false;
  }
}

async function writeLocalDocuments<T>(collectionName: CollectionName, documents: T[]) {
  await fs.mkdir(localDataDir, { recursive: true });
  await fs.writeFile(
    path.join(localDataDir, `${collectionName}.json`),
    JSON.stringify(documents, null, 2)
  );
}

function getEditableFallback(collectionName: CollectionName) {
  return collectionName in fallbackContent
    ? fallbackContent[collectionName as EditableCollectionName]
    : [];
}

async function getLocalEditableDocuments(
  collectionName: CollectionName
): Promise<Record<string, unknown>[]> {
  const docs = await readLocalDocuments<Record<string, unknown>>(collectionName);
  if (docs.length || (await localCollectionExists(collectionName))) {
    return docs;
  }

  const fallback = getEditableFallback(collectionName).map((doc) => ({ ...doc })) as Record<
    string,
    unknown
  >[];
  if (fallback.length) {
    await writeLocalDocuments(collectionName, fallback);
  }
  return fallback;
}

async function listLocalOrFallback<T extends Record<string, unknown>>(
  collectionName: CollectionName,
  fallback: T[] = []
) {
  const docs = await readLocalDocuments<T>(collectionName);
  return docs.length || (await localCollectionExists(collectionName)) ? docs : fallback;
}

function normalizeId(value: unknown) {
  if (value instanceof ObjectId) {
    return value.toHexString();
  }
  return String(value || "");
}

function getDocumentIdFilter(id: string): Filter<Document> {
  return ObjectId.isValid(id)
    ? { $or: [{ _id: new ObjectId(id) }, { id }] }
    : { id };
}

export function toPlain<T extends Record<string, unknown>>(doc: T) {
  const { _id, id, ...rest } = doc;
  const plain: Record<string, unknown> = {
    id: _id ? normalizeId(_id) : normalizeId(id),
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
  if (!shouldUseMongo()) {
    return listLocalOrFallback(collectionName, options.fallback);
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
    switchToLocalFallback(collectionName, error);
    return listLocalOrFallback(collectionName, options.fallback);
  }
}

export async function insertDocument<T extends Document>(
  collectionName: CollectionName,
  payload: OptionalUnlessRequiredId<T>
) {
  if (shouldUseMongo()) {
    try {
      const db = await getDb();
      const result = await db.collection<T>(collectionName).insertOne(payload);
      const doc = await db.collection(collectionName).findOne({ _id: result.insertedId });
      return doc ? toPlain(doc) : { id: result.insertedId.toHexString(), ...payload };
    } catch (error) {
      if (!canUseLocalFallback()) {
        throw error;
      }
      switchToLocalFallback(collectionName, error);
    }
  }

  if (!canUseLocalFallback()) {
    throw new Error("Database is unavailable. Configure MongoDB for admin CRUD.");
  }

  const docs = await getLocalEditableDocuments(collectionName);
  const doc = toPlain({ ...payload, _id: randomUUID() } as Record<string, unknown>);
  docs.unshift(doc);
  await writeLocalDocuments(collectionName, docs);
  return doc;
}

export async function updateDocument(
  collectionName: CollectionName,
  id: string,
  payload: Document
) {
  if (shouldUseMongo()) {
    try {
      const db = await getDb();
      const filter = getDocumentIdFilter(id);
      await db.collection(collectionName).updateOne(filter, { $set: payload });
      const doc = await db.collection(collectionName).findOne(filter);
      return doc ? toPlain(doc) : null;
    } catch (error) {
      if (!canUseLocalFallback()) {
        throw error;
      }
      switchToLocalFallback(collectionName, error);
    }
  }

  if (!canUseLocalFallback()) {
    throw new Error("Database is unavailable. Configure MongoDB for admin CRUD.");
  }

  const docs = await getLocalEditableDocuments(collectionName);
  const index = docs.findIndex((doc) => String(doc.id) === id);
  if (index === -1) {
    return null;
  }
  docs[index] = { ...docs[index], ...payload, id };
  await writeLocalDocuments(collectionName, docs);
  return docs[index];
}

export async function deleteDocument(collectionName: CollectionName, id: string) {
  if (shouldUseMongo()) {
    try {
      const db = await getDb();
      const result = await db.collection(collectionName).deleteOne(getDocumentIdFilter(id));
      return result.deletedCount > 0;
    } catch (error) {
      if (!canUseLocalFallback()) {
        throw error;
      }
      switchToLocalFallback(collectionName, error);
    }
  }

  if (!canUseLocalFallback()) {
    throw new Error("Database is unavailable. Configure MongoDB for admin CRUD.");
  }

  const docs = await getLocalEditableDocuments(collectionName);
  const next = docs.filter((doc) => String(doc.id) !== id);
  await writeLocalDocuments(collectionName, next);
  return next.length < docs.length;
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

  return { programs, schedule: sortScheduleItems(schedule), gallery, achievements };
}

export async function getSiteContent(): Promise<SiteContent> {
  if (!shouldUseMongo()) {
    const local = await readLocalDocuments<Partial<SiteContent>>("siteContent");
    return mergeSiteContent(local[0] || {});
  }

  try {
    const db = await getDb();
    const doc = await db.collection("siteContent").findOne({ key: "main" });
    return mergeSiteContent(doc ? (toPlain(doc) as Partial<SiteContent>) : {});
  } catch (error) {
    switchToLocalFallback("siteContent", error);
    const local = await readLocalDocuments<Partial<SiteContent>>("siteContent");
    return mergeSiteContent(local[0] || {});
  }
}

export async function saveSiteContent(payload: SiteContent): Promise<SiteContent> {
  const content = mergeSiteContent(payload);
  const doc: Partial<SiteContent> = { ...content };
  delete doc.id;
  if (shouldUseMongo()) {
    try {
      const db = await getDb();
      const result = await db.collection("siteContent").findOneAndUpdate(
        { key: "main" },
        {
          $set: { ...doc, updatedAt: new Date() },
          $setOnInsert: { createdAt: new Date() }
        },
        { upsert: true, returnDocument: "after" }
      );

      return mergeSiteContent(result ? (toPlain(result) as Partial<SiteContent>) : doc);
    } catch (error) {
      if (!canUseLocalFallback()) {
        throw error;
      }
      switchToLocalFallback("siteContent", error);
    }
  }

  if (!canUseLocalFallback()) {
    throw new Error("Database is unavailable. Configure MongoDB for admin CRUD.");
  }

  const local = mergeSiteContent({
    ...doc,
    id: "main",
    updatedAt: new Date().toISOString()
  } as Partial<SiteContent>);
  await writeLocalDocuments("siteContent", [local]);
  return local;
}

export async function getStudents() {
  return listDocuments<Student>("students", { sort: { createdAt: -1 } });
}

export async function getContacts() {
  return listDocuments<ContactInquiry>("contacts", { sort: { createdAt: -1 } });
}
