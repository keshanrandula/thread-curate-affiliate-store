import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  Layers,
  MousePointerClick,
  Sparkles,
  Plus,
  ArrowRight,
  TrendingUp,
  Database,
  ExternalLink,
  Calendar,
  Clock,
  CheckCircle2,
  FileText,
  BarChart2,
  Compass,
} from "lucide-react";
import { getAdminSession } from "@/lib/auth";
import { getDashboardStats } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { DashboardClicksChart } from "@/components/DashboardClicksChart";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default async function AdminDashboardOverview() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const stats = await getDashboardStats();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-1 border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Merchant Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {session.name}
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time analytics, outbound referral tracking, and affiliate catalog inventory.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
          <Link
            href="/admin/analytics"
            className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <BarChart2 className="w-4 h-4 text-indigo-400" />
            <span>Analytics</span>
          </Link>
        </div>
      </div>

      {/* Database Connection Status Banner */}
      <div
        className={`p-3.5 rounded-xl border text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          stats.dbConnected
            ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
            : "bg-amber-950/20 border-amber-500/30 text-amber-300"
        }`}
      >
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 shrink-0" />
          <span>
            {stats.dbConnected
              ? "Live MongoDB Engine: All catalog changes, categories, and outbound referral logs persist to MongoDB."
              : "Demo Catalog Active: MongoDB offline; interactive in-memory sample catalog is serving data."}
          </span>
        </div>
        <span className="font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700">
          {stats.dbConnected ? "Live Connected" : "Local Seed"}
        </span>
      </div>

      {/* 4 Stat KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Products */}
        <Link
          href="/admin/products"
          className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-all card-hover-lift block group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400">Total Products</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{stats.totalProducts}</div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              {stats.publishedProducts} published
            </span>
            <span className="text-[11px] text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
              <FileText className="w-3 h-3" />
              {stats.draftProducts} draft
            </span>
          </div>
        </Link>

        {/* Total Clicks */}
        <Link
          href="/admin/analytics"
          className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-all card-hover-lift block group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400">Total Outbound Clicks</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 group-hover:bg-rose-500/20 transition-colors">
              <MousePointerClick className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{stats.totalClicks}</div>
          <p className="text-[11px] text-zinc-400 mt-2 flex items-center gap-1">
            <span>All-time partner referrals</span>
            <ArrowRight className="w-3 h-3 text-rose-400" />
          </p>
        </Link>

        {/* Clicks Last 7 Days */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400">Clicks (Last 7 Days)</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{stats.clicks7Days}</div>
          <p className="text-[11px] text-blue-400 mt-2 font-medium">
            ~{Math.round(stats.clicks7Days / 7)} clicks / day avg
          </p>
        </div>

        {/* Clicks Last 30 Days */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400">Clicks (Last 30 Days)</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{stats.clicks30Days}</div>
          <p className="text-[11px] text-purple-400 mt-2 font-medium">
            {stats.totalClicks > 0
              ? `${Math.round((stats.clicks30Days / stats.totalClicks) * 100)}% of all-time traffic`
              : "Active traffic"}
          </p>
        </div>
      </div>

      {/* Line Chart of Clicks Over Time */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <span>Outbound Referral Clicks Over Time</span>
            </CardTitle>
            <p className="text-xs text-zinc-400 mt-1">
              Daily trend of user clicks on merchant buy buttons over the past 14 days.
            </p>
          </div>
          <Badge variant="default" className="text-[10px]">
            Last 14 Days
          </Badge>
        </CardHeader>
        <CardContent className="pt-4">
          <DashboardClicksChart data={stats.clicksOverTime} />
        </CardContent>
      </Card>

      {/* Two Column Grid: Top 10 Clicked Products & Recent Clicks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Top 10 Clicked Products Table (7 cols) */}
        <div className="lg:col-span-7 bg-zinc-900/60 rounded-2xl border border-zinc-800/80 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <h2 className="font-bold text-sm text-white">Top 10 Clicked Products</h2>
            </div>
            <Link
              href="/admin/products"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Catalog &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-950/80 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Product</th>
                  <th className="py-2.5 px-3">Brand</th>
                  <th className="py-2.5 px-3 text-right">Price</th>
                  <th className="py-2.5 px-3 text-center">Clicks</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {stats.topProducts.slice(0, 10).map((p: any, idx: number) => {
                  const img =
                    p.images && p.images.length > 0
                      ? p.images[0]
                      : "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80";

                  return (
                    <tr key={p._id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3 px-3">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                            idx === 0
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              : idx === 1
                              ? "bg-zinc-400/20 text-zinc-200 border border-zinc-400/30"
                              : idx === 2
                              ? "bg-orange-600/20 text-orange-300 border border-orange-600/30"
                              : "bg-zinc-800 text-zinc-400"
                          }`}
                        >
                          {idx + 1}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="relative w-8 h-8 rounded-lg bg-zinc-950 overflow-hidden shrink-0 border border-zinc-800">
                            <Image
                              src={img}
                              alt={p.title}
                              fill
                              sizes="32px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0 max-w-[180px]">
                            <p className="font-semibold text-white truncate text-xs">{p.title}</p>
                            <span className="text-[10px] text-indigo-400">{p.affiliateNetwork}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-zinc-300 font-medium">{p.brand}</td>

                      <td className="py-3 px-3 text-right font-bold text-white">
                        {formatPrice(p.price, p.currency || "USD")}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className="inline-block px-2 py-0.5 rounded-full font-bold text-[11px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {p.clicks || 0}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <Link
                          href={`/admin/products/${p._id}/edit`}
                          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Clicks Stream (5 cols) */}
        <div className="lg:col-span-5 bg-zinc-900/60 rounded-2xl border border-zinc-800/80 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MousePointerClick className="w-4 h-4 text-rose-400" />
              <h2 className="font-bold text-sm text-white">Live Click Stream</h2>
            </div>
            <Link
              href="/admin/analytics"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Full report &rarr;
            </Link>
          </div>

          {stats.recentClicks && stats.recentClicks.length > 0 ? (
            <div className="divide-y divide-zinc-800/60">
              {stats.recentClicks.slice(0, 8).map((c: any) => (
                <div key={c._id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">
                      {c.product?.title || "Product Referral"}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-400 mt-0.5">
                      <span className="text-rose-400 font-medium">
                        {c.product?.affiliateNetwork || "Partner"}
                      </span>
                      <span>&bull;</span>
                      <span className="truncate max-w-[120px]">{c.referrer || "Direct"}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1 text-[10px] text-zinc-400">
                      <Clock className="w-3 h-3 text-zinc-500" />
                      <span>
                        {new Date(c.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-zinc-500">
              No recent click events recorded yet. Click &ldquo;Buy now&rdquo; on any shop product to trigger live tracking!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
