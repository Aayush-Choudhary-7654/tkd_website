import { AdminDashboard } from "@/components/admin-dashboard";
import { requireAdminPage } from "@/lib/auth";
import { getContacts, getPublicContent, getStudents } from "@/lib/repository";

export default async function AdminPage() {
  await requireAdminPage();

  const [students, contacts, content] = await Promise.all([
    getStudents(),
    getContacts(),
    getPublicContent()
  ]);

  return <AdminDashboard students={students} contacts={contacts} content={content} />;
}
