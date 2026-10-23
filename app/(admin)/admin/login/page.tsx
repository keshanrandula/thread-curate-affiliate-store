"use client";

import { useActionState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { loginAction } from "@/server/actions/auth";

function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  return (
    <div className="relative w-full max-w-md bg-zinc-900/80 border border-zinc-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
      <div className="text-center space-y-2 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-orange-500/25">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-extrabold text-white">Merchant Admin Login</h1>
        <p className="text-xs text-zinc-400">
          Sign in with credentials to manage affiliate products, categories, and analytics
        </p>
      </div>

      {/* Demo Credentials Helper Pill */}
      <div className="mb-6 p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200 space-y-1">
        <div className="flex items-center gap-1.5 font-semibold text-amber-300">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Default Seed Credentials:</span>
        </div>
        <p className="text-[11px] text-amber-200/90">
          Email: <code className="bg-amber-900/50 px-1 py-0.5 rounded text-white font-mono">admin@affiliate.com</code>
        </p>
        <p className="text-[11px] text-amber-200/90">
          Password: <code className="bg-amber-900/50 px-1 py-0.5 rounded text-white font-mono">admin123</code>
        </p>
      </div>

      {state?.error && (
        <div className="mb-5 p-3 rounded-xl bg-red-950/40 border border-red-800/50 text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="callbackUrl" value={callbackUrl} />

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-300">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
            <input
              type="email"
              name="email"
              defaultValue="admin@affiliate.com"
              required
              placeholder="admin@affiliate.com"
              className="w-full pl-9 pr-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-300">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
            <input
              type="password"
              name="password"
              defaultValue="admin123"
              required
              placeholder="••••••••"
              className="w-full pl-9 pr-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 px-4 btn-amber-gradient font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
        >
          <span>{isPending ? "Authenticating..." : "Sign In to Admin"}</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </button>
      </form>

      <div className="mt-6 pt-4 border-t border-zinc-800 text-center">
        <Link href="/" className="text-xs text-zinc-400 hover:text-white transition-colors">
          &larr; Back to Public Shop
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#0c0a09] flex items-center justify-center p-4">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <Suspense fallback={<div className="text-zinc-500 text-xs">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
