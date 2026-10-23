import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getAnalyticsData } from "@/lib/api";
import { AdminAnalyticsDashboard } from "@/components/AdminAnalyticsDashboard";

export default async function AdminAnalyticsPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const analyticsData = await getAnalyticsData(90);

  return <AdminAnalyticsDashboard initialData={analyticsData} />;
}
