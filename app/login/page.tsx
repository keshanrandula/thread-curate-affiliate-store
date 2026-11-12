"use client";

import { useActionState, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  Check,
  KeyRound,
  ArrowLeft,
} from "lucide-react";
import { loginAction } from "@/server/actions/auth";

function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const [email, setEmail] = useState("admin@affiliate.com");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [autoFilled, setAutoFilled] = useState(false);

  const fillDemoCredentials = () => {
    setEmail("admin@affiliate.com");
    setPassword("admin123");
    setAutoFilled(true);
    setTimeout(() => setAutoFilled(false), 2500);
  };

  return (
    <div className="relative w-full max-w-md">
      {/* Radiant Background Glow Accent */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-80 h-80 bg-gradient-to-tr from-amber-500/20 via-orange-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Login Card */}
      <div className="relative bg-zinc-900/90 border border-zinc-800 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-2xl">
        {/* Brand Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-orange-500/25 ring-4 ring-amber-500/10">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
              Backoffice Management Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Merchant Admin Login
            </h1>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto">
              Sign in with your admin credentials to manage products, categories, affiliate links, and analytics.
            </p>
          </div>
        </div>

        {/* Quick Autofill Helper Pill */}
        <div className="mb-6 p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-amber-300">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Default Admin Credentials:</span>
            </div>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="text-[11px] font-semibold text-amber-200 hover:text-white bg-amber-900/60 hover:bg-amber-900 px-2 py-0.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              {autoFilled ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Filled!</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-3 h-3 text-amber-400" />
                  <span>1-Click Autofill</span>
                </>
              )}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-300">
            <div className="truncate">
              <span className="text-zinc-500">Email: </span>
              <code className="font-mono text-amber-300 font-semibold">admin@affiliate.com</code>
            </div>
            <div className="truncate">
              <span className="text-zinc-500">Pass: </span>
              <code className="font-mono text-amber-300 font-semibold">admin123</code>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {state?.error && (
          <div className="mb-5 p-3 rounded-xl bg-red-950/50 border border-red-800/60 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span className="font-medium">{state.error}</span>
          </div>
        )}

        {/* Login Form */}
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="callbackUrl" value={callbackUrl} />

          {/* Email field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-500" />
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="admin@affiliate.com"
                className="w-full pl-10 pr-3.5 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-500" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember session & Security badge */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-zinc-400">
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-zinc-800 bg-zinc-950 text-amber-500 focus:ring-amber-500 w-3.5 h-3.5 accent-amber-500 cursor-pointer"
              />
              <span className="text-[11px]">Remember for 7 days</span>
            </label>
            <span className="text-[11px] text-amber-400/90 font-medium">
              Encrypted Session
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3.5 px-4 btn-amber-gradient font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 active:scale-[0.99] disabled:opacity-50 transition-all cursor-pointer"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Verifying credentials...</span>
              </span>
            ) : (
              <>
                <span>Sign In to Admin Dashboard</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </>
            )}
          </button>
        </form>

        {/* Back to Public Store */}
        <div className="mt-8 pt-5 border-t border-zinc-800 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>&larr; Back to Public Shop</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function StandaloneLoginPage() {
  return (
    <div className="min-h-screen bg-[#0c0a09] flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-zinc-500 text-xs">Loading portal...</div>}>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
