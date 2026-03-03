import { Store, Clock, Heart, ShieldCheck } from "lucide-react";

const signals = [
  {
    icon: Store,
    value: "8+",
    label: "Store Integrations",
  },
  {
    icon: Clock,
    value: "Hourly",
    label: "Price Updates",
  },
  {
    icon: Heart,
    value: "100%",
    label: "Free to Use",
  },
  {
    icon: ShieldCheck,
    value: "Always",
    label: "Affiliate Disclosed",
  },
];

export default function TrustSignals() {
  return (
    <section className="border-y border-gray-100 bg-gray-50/50 py-10 dark:border-gray-800 dark:bg-gray-900/50">
      <div className="container-main">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {signals.map((signal) => (
            <div key={signal.label} className="flex flex-col items-center text-center">
              <signal.icon className="h-5 w-5 text-brand-600" />
              <span className="mt-2 text-lg font-bold text-gray-900 dark:text-white">
                {signal.value}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{signal.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
