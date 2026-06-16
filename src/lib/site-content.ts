import type { SiteContent } from "./types";

export type SiteContentField = {
  name: keyof SiteContent;
  label: string;
  group: string;
  type?: "text" | "url" | "textarea";
  full?: boolean;
};

export const defaultSiteContent: SiteContent = {
  key: "main",
  name: "ACTIVE TAEKWONDO ACADEMY",
  tagline: "Discipline. Strength. Respect.",
  phone: process.env.NEXT_PUBLIC_SITE_PHONE || "+91 00000 00000",
  whatsapp: process.env.NEXT_PUBLIC_SITE_WHATSAPP || "910000000000",
  address: process.env.NEXT_PUBLIC_SITE_ADDRESS || "Durg, Chhattisgarh",
  mapUrl:
    process.env.NEXT_PUBLIC_SITE_MAP_URL ||
    "https://maps.google.com/?q=Durg%20Chhattisgarh",
  instagram: process.env.NEXT_PUBLIC_SITE_INSTAGRAM || "https://instagram.com/",
  facebook: process.env.NEXT_PUBLIC_SITE_FACEBOOK || "https://facebook.com/",
  metaDescription:
    "Taekwondo training for discipline, strength, respect, fitness, and competition readiness.",
  navJoinLabel: "Join Now",
  homeHeroEyebrow: "Active Taekwondo Academy",
  homeHeroTitle: "Train Like a Champion",
  homeHeroBody:
    "Build discipline, strength, focus, and respect through modern Taekwondo training for kids, beginners, advanced students, and competitors.",
  primaryCtaLabel: "Join Now",
  secondaryCtaLabel: "Book Free Trial",
  studentSubmitLabel: "Submit Registration",
  contactSubmitLabel: "Send Inquiry",
  trialSubmitLabel: "Book Free Trial",
  statOneValue: "4",
  statOneLabel: "Focused training programs",
  statTwoValue: "6",
  statTwoLabel: "Class days every week",
  statThreeValue: "100%",
  statThreeLabel: "Discipline-led coaching",
  homeWhyEyebrow: "Why Choose Us",
  homeWhyTitle: "Train with purpose",
  homeWhyBody:
    "Students learn more than kicks. Every class reinforces focus, confidence, athletic ability, and respect.",
  homeProgramsEyebrow: "Programs",
  homeProgramsTitle: "Choose your path",
  homeProgramsBody:
    "From first class to competition readiness, each program has a clear training rhythm and progression.",
  homeScheduleEyebrow: "Schedule",
  homeScheduleTitle: "Weekly training rhythm",
  homeScheduleBody:
    "Pick a class time that fits your routine, then start with a trial session.",
  homeAchievementsEyebrow: "Achievements",
  homeAchievementsTitle: "Progress worth celebrating",
  homeAchievementsBody:
    "Belt promotions, competitions, and academy milestones keep students motivated.",
  homeGalleryEyebrow: "Gallery",
  homeGalleryTitle: "Inside the academy",
  homeGalleryBody:
    "A look at training energy, events, and competition preparation.",
  homeCtaEyebrow: "Start Today",
  homeCtaTitle: "Start Your Taekwondo Journey Today",
  homeCtaBody:
    "Register for a program or book a free trial class and let the academy team guide the next step.",
  homeTrialEyebrow: "Free Trial",
  homeTrialTitle: "Visit the mat",
  homeTrialBody:
    "Share your details and the team will help you choose the right class.",
  featureOneTitle: "Certified Coaches",
  featureOneText:
    "Structured classes led with safety, discipline, and student progression in mind.",
  featureTwoTitle: "Professional Training",
  featureTwoText:
    "Technical drills, flexibility, stamina, and sparring practice for real improvement.",
  featureThreeTitle: "Competition Preparation",
  featureThreeText:
    "Focused coaching for tournament rules, poomsae, scoring, and match confidence.",
  featureFourTitle: "Fitness & Discipline",
  featureFourText:
    "A positive routine that builds respect, resilience, coordination, and strength.",
  aboutHeroEyebrow: "About Active Taekwondo",
  aboutHeroTitle: "Built for disciplined growth",
  aboutHeroBody:
    "ACTIVE TAEKWONDO helps students build strength, focus, flexibility, self-control, and confidence through structured martial arts training.",
  aboutAcademyEyebrow: "Academy",
  aboutAcademyTitle: "More than a workout",
  aboutAcademyBody:
    "Taekwondo gives students a complete training environment: movement, mindset, respect, goal-setting, and the confidence to keep improving.",
  aboutAcademyImage:
    "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=1200&q=80",
  aboutValuesEyebrow: "Values",
  aboutValuesTitle: "What students practice",
  aboutValuesBody:
    "Each class is designed to develop both martial arts ability and everyday character.",
  valueOneTitle: "Discipline",
  valueOneText:
    "Students train with clear expectations, respectful routines, and steady progression.",
  valueTwoTitle: "Technique",
  valueTwoText:
    "Classes focus on clean fundamentals, safe movement, speed, and controlled power.",
  valueThreeTitle: "Respect",
  valueThreeText:
    "Every session reinforces confidence, humility, teamwork, and responsibility.",
  valueFourTitle: "Achievement",
  valueFourText:
    "The academy supports belt goals, demonstrations, competition preparation, and fitness.",
  programsHeroEyebrow: "Programs",
  programsHeroTitle: "Training for every level",
  programsHeroBody:
    "Choose the right path for your age, ability, and goals. The academy can recommend a class after your first conversation or trial.",
  programsSectionTitle: "Available programs",
  programsSectionBody: "All program details are managed from the admin dashboard.",
  scheduleHeroEyebrow: "Schedule",
  scheduleHeroTitle: "Find your class time",
  scheduleHeroBody:
    "Training runs across the week for kids, beginners, advanced students, and competition-focused athletes.",
  scheduleSectionTitle: "Weekly class schedule",
  scheduleSectionBody:
    "Class availability can change during events or tournaments, so contact the academy before your first visit.",
  galleryHeroEyebrow: "Gallery",
  galleryHeroTitle: "Training, events, competition",
  galleryHeroBody:
    "A visual record of academy energy, student milestones, and competition preparation.",
  gallerySectionTitle: "Photo gallery",
  gallerySectionBody: "Admin-managed image URLs keep the gallery simple for v1.",
  galleryAchievementsTitle: "Achievements",
  galleryAchievementsBody:
    "Highlights from belt promotions, tournament results, and student growth.",
  contactHeroEyebrow: "Contact",
  contactHeroTitle: "Book a visit",
  contactHeroBody:
    "Ask a question, schedule a free trial, or confirm the best program before joining.",
  contactSectionTitle: "Send an inquiry",
  contactSectionBody: "Share your details and the academy team will follow up.",
  contactMapTitle: "Location",
  joinHeroEyebrow: "Join Now",
  joinHeroTitle: "Register for training",
  joinHeroBody:
    "Submit student details and the academy team will contact you to confirm class timing, program fit, and next steps.",
  joinSectionTitle: "Student registration",
  joinSectionBody: "This creates a real student lead in the backend for the admin team.",
  joinInfoTitle: "Before your first class",
  joinInfoBody:
    "Wear comfortable sports clothing, carry water, and arrive a little early so the coach can understand your level."
};

export const siteContentFields: SiteContentField[] = [
  { group: "Brand & Contact", name: "name", label: "Academy Name" },
  { group: "Brand & Contact", name: "tagline", label: "Tagline" },
  { group: "Brand & Contact", name: "phone", label: "Phone" },
  { group: "Brand & Contact", name: "whatsapp", label: "WhatsApp Number" },
  { group: "Brand & Contact", name: "address", label: "Address", full: true },
  { group: "Brand & Contact", name: "mapUrl", label: "Map URL", type: "url", full: true },
  { group: "Brand & Contact", name: "instagram", label: "Instagram URL", type: "url" },
  { group: "Brand & Contact", name: "facebook", label: "Facebook URL", type: "url" },
  { group: "Brand & Contact", name: "metaDescription", label: "SEO Description", type: "textarea", full: true },
  { group: "Brand & Contact", name: "navJoinLabel", label: "Header Join Button" },
  { group: "Home Hero", name: "homeHeroEyebrow", label: "Hero Eyebrow" },
  { group: "Home Hero", name: "homeHeroTitle", label: "Hero Title" },
  { group: "Home Hero", name: "homeHeroBody", label: "Hero Body", type: "textarea", full: true },
  { group: "Home Hero", name: "primaryCtaLabel", label: "Primary CTA" },
  { group: "Home Hero", name: "secondaryCtaLabel", label: "Secondary CTA" },
  { group: "Form Labels", name: "studentSubmitLabel", label: "Student Form Button" },
  { group: "Form Labels", name: "contactSubmitLabel", label: "Contact Form Button" },
  { group: "Form Labels", name: "trialSubmitLabel", label: "Trial Form Button" },
  { group: "Home Stats", name: "statOneValue", label: "Stat 1 Value" },
  { group: "Home Stats", name: "statOneLabel", label: "Stat 1 Label" },
  { group: "Home Stats", name: "statTwoValue", label: "Stat 2 Value" },
  { group: "Home Stats", name: "statTwoLabel", label: "Stat 2 Label" },
  { group: "Home Stats", name: "statThreeValue", label: "Stat 3 Value" },
  { group: "Home Stats", name: "statThreeLabel", label: "Stat 3 Label" },
  { group: "Home Sections", name: "homeWhyEyebrow", label: "Why Eyebrow" },
  { group: "Home Sections", name: "homeWhyTitle", label: "Why Title" },
  { group: "Home Sections", name: "homeWhyBody", label: "Why Body", type: "textarea", full: true },
  { group: "Home Sections", name: "homeProgramsEyebrow", label: "Programs Eyebrow" },
  { group: "Home Sections", name: "homeProgramsTitle", label: "Programs Title" },
  { group: "Home Sections", name: "homeProgramsBody", label: "Programs Body", type: "textarea", full: true },
  { group: "Home Sections", name: "homeScheduleEyebrow", label: "Schedule Eyebrow" },
  { group: "Home Sections", name: "homeScheduleTitle", label: "Schedule Title" },
  { group: "Home Sections", name: "homeScheduleBody", label: "Schedule Body", type: "textarea", full: true },
  { group: "Home Sections", name: "homeAchievementsEyebrow", label: "Achievements Eyebrow" },
  { group: "Home Sections", name: "homeAchievementsTitle", label: "Achievements Title" },
  { group: "Home Sections", name: "homeAchievementsBody", label: "Achievements Body", type: "textarea", full: true },
  { group: "Home Sections", name: "homeGalleryEyebrow", label: "Gallery Eyebrow" },
  { group: "Home Sections", name: "homeGalleryTitle", label: "Gallery Title" },
  { group: "Home Sections", name: "homeGalleryBody", label: "Gallery Body", type: "textarea", full: true },
  { group: "Home CTA", name: "homeCtaEyebrow", label: "CTA Eyebrow" },
  { group: "Home CTA", name: "homeCtaTitle", label: "CTA Title" },
  { group: "Home CTA", name: "homeCtaBody", label: "CTA Body", type: "textarea", full: true },
  { group: "Home Trial", name: "homeTrialEyebrow", label: "Trial Eyebrow" },
  { group: "Home Trial", name: "homeTrialTitle", label: "Trial Title" },
  { group: "Home Trial", name: "homeTrialBody", label: "Trial Body", type: "textarea", full: true },
  { group: "Home Features", name: "featureOneTitle", label: "Feature 1 Title" },
  { group: "Home Features", name: "featureOneText", label: "Feature 1 Text", type: "textarea", full: true },
  { group: "Home Features", name: "featureTwoTitle", label: "Feature 2 Title" },
  { group: "Home Features", name: "featureTwoText", label: "Feature 2 Text", type: "textarea", full: true },
  { group: "Home Features", name: "featureThreeTitle", label: "Feature 3 Title" },
  { group: "Home Features", name: "featureThreeText", label: "Feature 3 Text", type: "textarea", full: true },
  { group: "Home Features", name: "featureFourTitle", label: "Feature 4 Title" },
  { group: "Home Features", name: "featureFourText", label: "Feature 4 Text", type: "textarea", full: true },
  { group: "About", name: "aboutHeroEyebrow", label: "Hero Eyebrow" },
  { group: "About", name: "aboutHeroTitle", label: "Hero Title" },
  { group: "About", name: "aboutHeroBody", label: "Hero Body", type: "textarea", full: true },
  { group: "About", name: "aboutAcademyEyebrow", label: "Academy Eyebrow" },
  { group: "About", name: "aboutAcademyTitle", label: "Academy Title" },
  { group: "About", name: "aboutAcademyBody", label: "Academy Body", type: "textarea", full: true },
  { group: "About", name: "aboutAcademyImage", label: "Academy Image URL", type: "url", full: true },
  { group: "About", name: "aboutValuesEyebrow", label: "Values Eyebrow" },
  { group: "About", name: "aboutValuesTitle", label: "Values Title" },
  { group: "About", name: "aboutValuesBody", label: "Values Body", type: "textarea", full: true },
  { group: "About Values", name: "valueOneTitle", label: "Value 1 Title" },
  { group: "About Values", name: "valueOneText", label: "Value 1 Text", type: "textarea", full: true },
  { group: "About Values", name: "valueTwoTitle", label: "Value 2 Title" },
  { group: "About Values", name: "valueTwoText", label: "Value 2 Text", type: "textarea", full: true },
  { group: "About Values", name: "valueThreeTitle", label: "Value 3 Title" },
  { group: "About Values", name: "valueThreeText", label: "Value 3 Text", type: "textarea", full: true },
  { group: "About Values", name: "valueFourTitle", label: "Value 4 Title" },
  { group: "About Values", name: "valueFourText", label: "Value 4 Text", type: "textarea", full: true },
  { group: "Programs Page", name: "programsHeroEyebrow", label: "Hero Eyebrow" },
  { group: "Programs Page", name: "programsHeroTitle", label: "Hero Title" },
  { group: "Programs Page", name: "programsHeroBody", label: "Hero Body", type: "textarea", full: true },
  { group: "Programs Page", name: "programsSectionTitle", label: "Section Title" },
  { group: "Programs Page", name: "programsSectionBody", label: "Section Body", type: "textarea", full: true },
  { group: "Schedule Page", name: "scheduleHeroEyebrow", label: "Hero Eyebrow" },
  { group: "Schedule Page", name: "scheduleHeroTitle", label: "Hero Title" },
  { group: "Schedule Page", name: "scheduleHeroBody", label: "Hero Body", type: "textarea", full: true },
  { group: "Schedule Page", name: "scheduleSectionTitle", label: "Section Title" },
  { group: "Schedule Page", name: "scheduleSectionBody", label: "Section Body", type: "textarea", full: true },
  { group: "Gallery Page", name: "galleryHeroEyebrow", label: "Hero Eyebrow" },
  { group: "Gallery Page", name: "galleryHeroTitle", label: "Hero Title" },
  { group: "Gallery Page", name: "galleryHeroBody", label: "Hero Body", type: "textarea", full: true },
  { group: "Gallery Page", name: "gallerySectionTitle", label: "Gallery Title" },
  { group: "Gallery Page", name: "gallerySectionBody", label: "Gallery Body", type: "textarea", full: true },
  { group: "Gallery Page", name: "galleryAchievementsTitle", label: "Achievements Title" },
  { group: "Gallery Page", name: "galleryAchievementsBody", label: "Achievements Body", type: "textarea", full: true },
  { group: "Contact Page", name: "contactHeroEyebrow", label: "Hero Eyebrow" },
  { group: "Contact Page", name: "contactHeroTitle", label: "Hero Title" },
  { group: "Contact Page", name: "contactHeroBody", label: "Hero Body", type: "textarea", full: true },
  { group: "Contact Page", name: "contactSectionTitle", label: "Section Title" },
  { group: "Contact Page", name: "contactSectionBody", label: "Section Body", type: "textarea", full: true },
  { group: "Contact Page", name: "contactMapTitle", label: "Map Title" },
  { group: "Join Page", name: "joinHeroEyebrow", label: "Hero Eyebrow" },
  { group: "Join Page", name: "joinHeroTitle", label: "Hero Title" },
  { group: "Join Page", name: "joinHeroBody", label: "Hero Body", type: "textarea", full: true },
  { group: "Join Page", name: "joinSectionTitle", label: "Section Title" },
  { group: "Join Page", name: "joinSectionBody", label: "Section Body", type: "textarea", full: true },
  { group: "Join Page", name: "joinInfoTitle", label: "Info Card Title" },
  { group: "Join Page", name: "joinInfoBody", label: "Info Card Body", type: "textarea", full: true }
];

export function mergeSiteContent(content: Partial<SiteContent> = {}): SiteContent {
  return { ...defaultSiteContent, ...content, key: "main" };
}
