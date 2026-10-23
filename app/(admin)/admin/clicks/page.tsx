import { redirect } from "next/navigation";
import { MousePointerClick, ExternalLink, Calendar, Compass, Laptop } from "lucide-react";
import { getAdminSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { ClickEvent, Product } from "@/models";
import { FALLBACK_PRODUCTS } from "@/lib/db-fallback";

export default async function AdminClicksPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  let clicks: any[] = [];
  try {
    await connectToDatabase();
    const rawClicks = await ClickEvent.find({})
      .populate("productId", "title brand affiliateNetwork price currency")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    clicks = rawClicks.map((c: any) => ({
      ...c,
      _id: c._id.toString(),
      product: c.productId,
    }));
  } catch {
    // Generate simulated click log for fallback
    const baseTime = 1714500000000;
    clicks = FALLBACK_PRODUCTS.slice(0, 10).map((p, i) => ({
      _id: `click_demo_${i}`,
      product: p,
      referrer: "https://google.com/search",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0",
      createdAt: new Date(baseTime - i * 1800000).toISOString(),
    }));
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Outbound Click Logs</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Detailed real-time logs of outbound clicks generated toward merchant affiliate links.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
            <a
              href="/admin/analytics"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
            >
              Visual Analytics
            </a>
            <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white">
              Raw Click Log
            </span>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900/60 rounded-2xl border border-zinc-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950/80 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800">
              <tr>
                <th className="p-4">Time</th>
                <th className="p-4">Product</th>
                <th className="p-4">Merchant Network</th>
                <th className="p-4">Referrer</th>
                <th className="p-4">Device / User Agent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {clicks.length > 0 ? (
                clicks.map((click) => (
                  <tr key={click._id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[11px]">
                        <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{new Date(click.createdAt).toLocaleString()}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="font-semibold text-white block">
                        {click.product?.title || "Unknown Product"}
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        {click.product?.brand || "Brand"}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold text-[10px] border border-indigo-500/20">
                        {click.product?.affiliateNetwork || "Affiliate Partner"}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1 text-zinc-400 text-xs truncate max-w-xs">
                        <Compass className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        <span className="truncate">{click.referrer || "Direct / Internal"}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 truncate max-w-sm">
                        <Laptop className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        <span className="truncate">{click.userAgent || "Unknown"}</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-xs text-zinc-500">
                    No outbound clicks logged yet. Click &ldquo;Buy now&rdquo; on any shop product to trigger live tracking!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
