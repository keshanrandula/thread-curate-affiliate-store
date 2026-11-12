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
  ArrowLeft,
  KeyRound,
} from "lucide-react";
import { loginAction } from "@/server/actions/auth";
import { Breadcrumbs } from "@/components/Breadcrumbs";

function LoginForm() {
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
    <div className="relative w-full max-w-md mx-auto">
      {/* Decorative Glow Background */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-72 h-72 bg-gradient-to-tr from-amber-500/20 via-orange-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="relative bg-white/90 dark:bg-zinc-900/80 border border-stone-200 dark:border-zinc-800 rounded-3xl p-7 sm:p-9 shadow-xl dark:shadow-2xl backdrop-blur-xl transition-all">
        {/* Header Icon & Title */}
        <div className="text-center space-y-3 mb-7">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-orange-500/25 ring-4 ring-amber-500/10">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
              Merchant &amp; Admin Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">
              Welcome Back
            </h1>
            <p className="text-xs text-stone-600 dark:text-zinc-400 max-w-xs mx-auto">
              Sign in to manage catalog products, categories, affiliate deals, and store performance.
            </p>
          </div>
        </div>

        {/* Quick Demo Credentials Helper */}
        <div className="mb-6 p-3.5 rounded-2xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/25 dark:border-amber-500/20 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
              <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Default Credentials</span>
            </div>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 bg-amber-200/60 dark:bg-amber-900/50 hover:bg-amber-200 dark:hover:bg-amber-900/80 px-2 py-0.5 rounded-lg transition-colors flex items-center gap-1"
            >
              {autoFilled ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>Filled!</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-3 h-3" />
                  <span>Autofill</span>
                </>
              )}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-700 dark:text-zinc-300">
            <div className="truncate">
              <span className="text-stone-500 dark:text-zinc-400">Email: </span>
              <code className="font-mono text-amber-800 dark:text-amber-300 font-semibold">admin@affiliate.com</code>
            </div>
            <div className="truncate">
              <span className="text-stone-500 dark:text-zinc-400">Pass: </span>
              <code className="font-mono text-amber-800 dark:text-amber-300 font-semibold">admin123</code>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {state?.error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span className="font-medium">{state.error}</span>
          </div>
        )}

        {/* Login Form */}
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="callbackUrl" value={callbackUrl} />

          {/* Email field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-800 dark:text-zinc-200">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-stone-400 dark:text-zinc-500" />
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="admin@affiliate.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-stone-100 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-800 rounded-xl text-xs sm:text-sm text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all font-medium"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-800 dark:text-zinc-200">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-stone-400 dark:text-zinc-500" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-stone-100 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-800 rounded-xl text-xs sm:text-sm text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 p-0.5 text-stone-400 hover:text-stone-700 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me & Security info */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-stone-600 dark:text-zinc-400">
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-stone-300 dark:border-zinc-800 text-amber-600 focus:ring-amber-500 w-3.5 h-3.5 accent-amber-500 cursor-pointer"
              />
              <span className="text-[11px]">Remember for 7 days</span>
            </label>
            <span className="text-[11px] text-amber-700 dark:text-amber-400/90 font-medium">
              Encrypted Session
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3.5 px-4 btn-amber-gradient text-white font-extrabold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Authenticating...</span>
              </span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </>
            )}
          </button>
        </form>

        {/* Footer Navigation Back to Shop */}
        <div className="mt-7 pt-5 border-t border-stone-200 dark:border-zinc-800 flex items-center justify-between text-xs text-stone-500 dark:text-zinc-400">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-stone-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Store</span>
          </Link>
          <Link
            href="/shop"
            className="hover:text-stone-900 dark:hover:text-zinc-200 transition-colors"
          >
            Browse Deals
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: "Sign In" }]} />

      <div className="mt-4 sm:mt-8 flex justify-center">
        <Suspense
          fallback={
            <div className="w-full max-w-md h-96 rounded-3xl bg-stone-100 dark:bg-zinc-900 animate-pulse flex items-center justify-center text-xs text-stone-400">
              Loading sign in portal...
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
