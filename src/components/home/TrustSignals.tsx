import { BarChart3, Eye, Shield, Gamepad2 } from "lucide-react";

interface TrustSignalsProps {
  gamesAnalyzed?: number;
  dropRatesTracked?: number;
  systemTypes?: number;
}

export default function TrustSignals({
  gamesAnalyzed = 0,
  dropRatesTracked = 0,
  systemTypes = 5,
}: TrustSignalsProps) {
  const signals = [
    {
      icon: Gamepad2,
      value: `${gamesAnalyzed}+`,
      label: "Games Analyzed",
    },
    {
      icon: Eye,
      value: `${dropRatesTracked}+`,
      label: "Drop Rates Tracked",
    },
    {
      icon: Shield,
      value: `${systemTypes}`,
      label: "System Types Covered",
    },
    {
      icon: BarChart3,
      value: "8",
      label: "Scoring Dimensions",
    },
  ];

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
