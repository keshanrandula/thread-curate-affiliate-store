import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getSiteSettings } from "@/lib/api";
import { AdminSettingsForm } from "@/components/AdminSettingsForm";

export default async function AdminSettingsPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const settings = await getSiteSettings();

  return <AdminSettingsForm initialSettings={settings} />;
}
