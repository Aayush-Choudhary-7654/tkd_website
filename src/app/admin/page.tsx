import { AdminDashboard } from "@/components/admin-dashboard";
import { requireAdminPage } from "@/lib/auth";
import { getContacts, getPublicContent, getSiteContent, getStudents } from "@/lib/repository";

export default async function AdminPage() {
  await requireAdminPage();

  const [students, contacts, content, siteContent] = await Promise.all([
    getStudents(),
    getContacts(),
    getPublicContent(),
    getSiteContent()
  ]);

  return (
    <AdminDashboard
      students={students}
      contacts={contacts}
      content={content}
      siteContent={siteContent}
    />
  );
}
