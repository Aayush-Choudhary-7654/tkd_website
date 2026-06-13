export type ExperienceLevel = "Beginner" | "Intermediate" | "Advanced";

export type Student = {
  id: string;
  name: string;
  age: number;
  phone: string;
  parentName?: string;
  level: ExperienceLevel;
  program: string;
  createdAt: string;
};

export type ContactInquiry = {
  id: string;
  name: string;
  phone: string;
  message: string;
  createdAt: string;
};

export type Program = {
  id: string;
  name: string;
  description: string;
  ageGroup: string;
  schedule: string;
  fees?: string;
  image: string;
};

export type ScheduleItem = {
  id: string;
  day: string;
  time: string;
  program: string;
};

export type GalleryItem = {
  id: string;
  imageUrl: string;
  category: "Training" | "Events" | "Competition";
  createdAt: string;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
};

export type PublicContent = {
  programs: Program[];
  schedule: ScheduleItem[];
  gallery: GalleryItem[];
  achievements: Achievement[];
};
