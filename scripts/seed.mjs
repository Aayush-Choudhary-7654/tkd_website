import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "active_taekwondo";

if (!uri) {
  console.error("MONGODB_URI is required to seed the database.");
  process.exit(1);
}

const programs = [
  {
    name: "Kids Program",
    description: "A fun foundation for focus, confidence, balance, and respectful discipline.",
    ageGroup: "Ages 5-10",
    schedule: "Mon, Wed, Fri - 5:00 PM",
    fees: "Contact for fees",
    image: "https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Beginner",
    description: "Learn stances, kicks, movement basics, flexibility, and safe training habits.",
    ageGroup: "Ages 11+",
    schedule: "Tue, Thu, Sat - 6:00 PM",
    fees: "Contact for fees",
    image: "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Advanced",
    description: "Sharpen speed, sparring control, combinations, and belt progression technique.",
    ageGroup: "Experienced students",
    schedule: "Mon, Wed, Fri - 7:00 PM",
    fees: "Contact for fees",
    image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Competition Training",
    description: "Focused coaching for tournament readiness, scoring strategy, stamina, and poomsae.",
    ageGroup: "Coach approved",
    schedule: "Sat - 8:00 AM",
    fees: "Contact for fees",
    image: "https://images.unsplash.com/photo-1591117207239-788bf8de6c3b?auto=format&fit=crop&w=1200&q=80"
  }
];

const schedule = [
  { day: "Monday", time: "5:00 PM - 6:00 PM", program: "Kids Program" },
  { day: "Monday", time: "7:00 PM - 8:15 PM", program: "Advanced" },
  { day: "Tuesday", time: "6:00 PM - 7:00 PM", program: "Beginner" },
  { day: "Wednesday", time: "5:00 PM - 6:00 PM", program: "Kids Program" },
  { day: "Thursday", time: "6:00 PM - 7:00 PM", program: "Beginner" },
  { day: "Friday", time: "7:00 PM - 8:15 PM", program: "Advanced" },
  { day: "Saturday", time: "8:00 AM - 9:30 AM", program: "Competition Training" }
];

const gallery = [
  { imageUrl: "https://images.unsplash.com/photo-1544717301-9cdcb1f5940f?auto=format&fit=crop&w=1200&q=80", category: "Training", createdAt: new Date("2026-01-10") },
  { imageUrl: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?auto=format&fit=crop&w=1200&q=80", category: "Events", createdAt: new Date("2026-02-05") },
  { imageUrl: "https://images.unsplash.com/photo-1517438322307-e67111335449?auto=format&fit=crop&w=1200&q=80", category: "Competition", createdAt: new Date("2026-03-18") }
];

const achievements = [
  { title: "District Championship Medals", description: "Students earned podium finishes across junior and senior categories.", image: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=1200&q=80", date: new Date("2026-02-20") },
  { title: "Belt Promotion Ceremony", description: "A strong batch advanced after technical assessment and discipline review.", image: "https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?auto=format&fit=crop&w=1200&q=80", date: new Date("2026-04-12") },
  { title: "State Team Selections", description: "Competition squad members qualified for the next level of training camps.", image: "https://images.unsplash.com/photo-1571019613914-85f342c6a11e?auto=format&fit=crop&w=1200&q=80", date: new Date("2026-05-02") }
];

const client = new MongoClient(uri);
await client.connect();
const db = client.db(dbName);

for (const [name, docs] of Object.entries({ programs, schedule, gallery, achievements })) {
  const count = await db.collection(name).countDocuments();
  if (count === 0) {
    await db.collection(name).insertMany(docs.map((doc) => ({ ...doc, createdAt: doc.createdAt || new Date(), updatedAt: new Date() })));
    console.log(`Seeded ${name}.`);
  } else {
    console.log(`Skipped ${name}; collection already has data.`);
  }
}

await client.close();
