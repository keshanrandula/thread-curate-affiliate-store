import { ShieldCheck, Flame, CheckCircle2, ArrowUpRight } from "lucide-react";

export function ValueProps() {
  const items = [
    {
      icon: ShieldCheck,
      title: "100% Verified Merchants",
      description: "Direct official checkout on Amazon, ASOS, Nike & Nordstrom.",
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/15 dark:bg-emerald-500/10",
    },
    {
      icon: Flame,
      title: "Handpicked Price Drops",
      description: "Real seasonal discounts up to 45% off vetted designer fashion.",
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-500/15 dark:bg-rose-500/10",
    },
    {
      icon: CheckCircle2,
      title: "Zero Added Markup",
      description: "You never pay a penny extra. Retailers pay our referral fee.",
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/15 dark:bg-amber-500/10",
    },
    {
      icon: ArrowUpRight,
      title: "Instant Redirection",
      description: "Seamless safe outbound link right into merchant cart.",
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-500/15 dark:bg-orange-500/10",
    },
  ];

  return (
    <section className="border-y border-stone-200/80 dark:border-zinc-800/80 bg-stone-100/70 dark:bg-zinc-950/40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-start gap-3.5">
                <div className={`p-2.5 rounded-xl ${item.bg} ${item.color} shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-wider text-stone-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-zinc-400 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
