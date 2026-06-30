export type ExperienceLevel = "Beginner" | "Intermediate" | "Advanced";

export type Student = {
  id: string;
  name: string;
  age: number;
  phone: string;
  email?: string;
  parentName?: string;
  level: ExperienceLevel;
  program: string;
  createdAt: string;
};

export type ContactInquiry = {
  id: string;
  name: string;
  phone: string;
  email?: string;
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
  category: string;
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

export type SiteContent = {
  id?: string;
  key?: string;
  name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  address: string;
  mapUrl: string;
  instagram: string;
  facebook: string;
  metaDescription: string;
  navJoinLabel: string;
  homeHeroEyebrow: string;
  homeHeroTitle: string;
  homeHeroBody: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  studentSubmitLabel: string;
  contactSubmitLabel: string;
  trialSubmitLabel: string;
  statOneValue: string;
  statOneLabel: string;
  statTwoValue: string;
  statTwoLabel: string;
  statThreeValue: string;
  statThreeLabel: string;
  homeWhyEyebrow: string;
  homeWhyTitle: string;
  homeWhyBody: string;
  homeProgramsEyebrow: string;
  homeProgramsTitle: string;
  homeProgramsBody: string;
  homeScheduleEyebrow: string;
  homeScheduleTitle: string;
  homeScheduleBody: string;
  homeAchievementsEyebrow: string;
  homeAchievementsTitle: string;
  homeAchievementsBody: string;
  homeGalleryEyebrow: string;
  homeGalleryTitle: string;
  homeGalleryBody: string;
  homeCtaEyebrow: string;
  homeCtaTitle: string;
  homeCtaBody: string;
  homeTrialEyebrow: string;
  homeTrialTitle: string;
  homeTrialBody: string;
  featureOneTitle: string;
  featureOneText: string;
  featureTwoTitle: string;
  featureTwoText: string;
  featureThreeTitle: string;
  featureThreeText: string;
  featureFourTitle: string;
  featureFourText: string;
  aboutHeroEyebrow: string;
  aboutHeroTitle: string;
  aboutHeroBody: string;
  aboutAcademyEyebrow: string;
  aboutAcademyTitle: string;
  aboutAcademyBody: string;
  aboutAcademyImage: string;
  aboutValuesEyebrow: string;
  aboutValuesTitle: string;
  aboutValuesBody: string;
  valueOneTitle: string;
  valueOneText: string;
  valueTwoTitle: string;
  valueTwoText: string;
  valueThreeTitle: string;
  valueThreeText: string;
  valueFourTitle: string;
  valueFourText: string;
  programsHeroEyebrow: string;
  programsHeroTitle: string;
  programsHeroBody: string;
  programsSectionTitle: string;
  programsSectionBody: string;
  scheduleHeroEyebrow: string;
  scheduleHeroTitle: string;
  scheduleHeroBody: string;
  scheduleSectionTitle: string;
  scheduleSectionBody: string;
  galleryHeroEyebrow: string;
  galleryHeroTitle: string;
  galleryHeroBody: string;
  gallerySectionTitle: string;
  gallerySectionBody: string;
  galleryAchievementsTitle: string;
  galleryAchievementsBody: string;
  contactHeroEyebrow: string;
  contactHeroTitle: string;
  contactHeroBody: string;
  contactSectionTitle: string;
  contactSectionBody: string;
  contactMapTitle: string;
  joinHeroEyebrow: string;
  joinHeroTitle: string;
  joinHeroBody: string;
  joinSectionTitle: string;
  joinSectionBody: string;
  joinInfoTitle: string;
  joinInfoBody: string;
};
