"use client";

import { useState } from "react";
import { Mail, Check, Sparkles } from "lucide-react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-stone-100 via-white to-amber-100/40 dark:from-zinc-900/90 dark:via-zinc-950 dark:to-amber-950/30 border border-stone-200 dark:border-amber-500/20 p-8 sm:p-14 text-center max-w-4xl mx-auto shadow-lg dark:shadow-2xl transition-colors">
        <div className="relative z-10 max-w-xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-semibold border border-amber-500/30 dark:border-amber-500/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span>Weekly Fashion Radar</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            Be the First to Catch Vetted Price Drops
          </h2>

          <p className="text-xs sm:text-sm text-stone-600 dark:text-zinc-300 leading-relaxed">
            Get our weekly editorial digest featuring top-tier designer deals, seasonal wardrobe
            staples, and verified affiliate promotions directly in your inbox.
          </p>

          {subscribed ? (
            <div className="pt-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Thank you! You are now subscribed to our weekly deal alerts.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="pt-2 flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-stone-400 dark:text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email address..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-white dark:bg-zinc-950 border border-stone-300 dark:border-zinc-800 rounded-xl text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-500 focus:outline-none focus:border-amber-500 shadow-sm"
                />
              </div>
              <button
                type="submit"
                className="btn-amber-gradient px-6 py-2.5 text-white text-xs font-bold rounded-xl transition-all duration-200 active:scale-95 whitespace-nowrap"
              >
                Join Curation Club
              </button>
            </form>
          )}

          <p className="text-[11px] text-stone-500 dark:text-zinc-500 pt-1">
            Zero spam. Unsubscribe with one click anytime. Review our{" "}
            <a href="/privacy" className="underline hover:text-stone-700 dark:hover:text-zinc-400">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
