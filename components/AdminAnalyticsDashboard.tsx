"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  Calendar,
  TrendingUp,
  Package,
  Layers,
  MousePointerClick,
  Sparkles,
  ExternalLink,
  Store,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Props {
  initialData: {
    clicksPerDay: { date: string; clicks: number }[];
    clicksPerProduct: { title: string; brand: string; clicks: number; network: string }[];
    clicksPerCategory: { name: string; clicks: number }[];
    networkDistribution: { network: string; clicks: number }[];
    totalClicksInRange: number;
    totalProducts: number;
    averageDailyClicks: number;
  };
}

const COLORS = ["#6366f1", "#a855f7", "#ec4899", "#3b82f6", "#10b981", "#f59e0b"];

export function AdminAnalyticsDashboard({ initialData }: Props) {
  const [rangeDays, setRangeDays] = useState<7 | 14 | 30 | 90>(30);
  const data = initialData;

  // Filter daily clicks by selected range
  const displayedDailyClicks = data.clicksPerDay.slice(-rangeDays);

  const totalRangeClicks = displayedDailyClicks.reduce((sum, d) => sum + d.clicks, 0);
  const avgDaily = Math.round(totalRangeClicks / rangeDays);
  const topProduct = data.clicksPerProduct[0];
  const topNetwork = data.networkDistribution[0];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Header & Date Range Picker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-indigo-400" />
            <span>Referral Click Analytics</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Performance metrics, product attribution, category distribution, and partner network conversions.
          </p>
        </div>

        {/* Date Range Picker Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-xl self-start sm:self-auto">
          {([7, 14, 30, 90] as const).map((days) => (
            <button
              key={days}
              type="button"
              onClick={() => setRangeDays(days)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                rangeDays === days
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {days === 7 ? "7 Days" : days === 14 ? "14 Days" : days === 30 ? "30 Days" : "90 Days"}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400">Clicks in Selected Range</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <MousePointerClick className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{totalRangeClicks}</div>
          <p className="text-[11px] text-zinc-400 mt-2 font-medium">
            Over the last {rangeDays} days
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400">Average Daily Clicks</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{avgDaily}</div>
          <p className="text-[11px] text-emerald-400 mt-2 font-medium">
            Steady daily affiliate flow
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400">Top Performing Product</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-sm font-extrabold text-white truncate">
            {topProduct?.title || "N/A"}
          </div>
          <p className="text-[11px] text-purple-400 mt-2 font-semibold">
            {topProduct?.clicks || 0} clicks ({topProduct?.brand || "Brand"})
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400">Top Partner Network</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Store className="w-5 h-5" />
            </div>
          </div>
          <div className="text-lg font-extrabold text-white truncate">
            {topNetwork?.network || "Amazon"}
          </div>
          <p className="text-[11px] text-amber-400 mt-2 font-semibold">
            {topNetwork?.clicks || 0} total referrals
          </p>
        </div>
      </div>

      {/* 1. Clicks Per Day Area Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <span>Clicks Per Day ({rangeDays} Days Timeline)</span>
            </CardTitle>
            <p className="text-xs text-zinc-400 mt-1">
              Time-series tracking of outbound referral traffic sent to merchant partner links.
            </p>
          </div>
          <Badge variant="default" className="text-[10px]">
            Daily Aggregation
          </Badge>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={displayedDailyClicks}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="analyticsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#71717a"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: "#27272a" }}
                />
                <YAxis
                  stroke="#71717a"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-zinc-900 border border-zinc-700/80 p-3 rounded-xl shadow-2xl backdrop-blur-md">
                          <p className="text-[11px] font-semibold text-zinc-400">{label}</p>
                          <p className="text-sm font-extrabold text-indigo-400 mt-0.5">
                            {payload[0].value}{" "}
                            <span className="text-xs font-normal text-zinc-300">
                              referral clicks
                            </span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="clicks"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#analyticsGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Two Column Grid: Clicks Per Category & Partner Network Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 2. Clicks Per Category (6 cols) */}
        <div className="lg:col-span-6 bg-zinc-900/60 rounded-2xl border border-zinc-800/80 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <h2 className="font-bold text-sm text-white">Clicks Per Category</h2>
            </div>
            <Badge variant="featured" className="text-[10px]">
              Distribution
            </Badge>
          </div>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.clicksPerCategory}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-zinc-900 border border-zinc-700/80 p-2.5 rounded-xl shadow-xl">
                          <p className="text-xs font-semibold text-zinc-300">{label}</p>
                          <p className="text-xs font-bold text-purple-400">
                            {payload[0].value} clicks
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="clicks" radius={[6, 6, 0, 0]}>
                  {data.clicksPerCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Partner Networks Distribution (6 cols) */}
        <div className="lg:col-span-6 bg-zinc-900/60 rounded-2xl border border-zinc-800/80 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-rose-400" />
              <h2 className="font-bold text-sm text-white">Affiliate Network Breakdown</h2>
            </div>
            <Badge variant="default" className="text-[10px]">
              Merchant Sources
            </Badge>
          </div>

          <div className="space-y-3 pt-2">
            {data.networkDistribution.map((item, idx) => {
              const maxClicks = Math.max(...data.networkDistribution.map((x) => x.clicks), 1);
              const percentage = Math.round((item.clicks / maxClicks) * 100);

              return (
                <div key={item.network} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">{item.network}</span>
                    <span className="text-zinc-400 font-mono text-[11px]">
                      {item.clicks} clicks
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: COLORS[idx % COLORS.length],
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Clicks Per Product Ranked Leaderboard Table */}
      <div className="bg-zinc-900/60 rounded-2xl border border-zinc-800/80 p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-indigo-400" />
            <h2 className="font-bold text-sm text-white">Clicks Per Product Leaderboard</h2>
          </div>
          <span className="text-xs text-zinc-400">Top 10 High-Intent Products</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950/80 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800">
              <tr>
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Product Title</th>
                <th className="py-2.5 px-3">Brand</th>
                <th className="py-2.5 px-3">Affiliate Partner</th>
                <th className="py-2.5 px-3 text-right">Referral Clicks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {data.clicksPerProduct.map((prod, idx) => (
                <tr key={idx} className="hover:bg-zinc-800/30 transition-colors">
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
                  <td className="py-3 px-3 font-semibold text-white max-w-sm truncate">
                    {prod.title}
                  </td>
                  <td className="py-3 px-3 text-zinc-300">{prod.brand}</td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full font-semibold border border-indigo-500/20">
                      {prod.network}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-extrabold text-indigo-400 text-sm">
                    {prod.clicks}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
