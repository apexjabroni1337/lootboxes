import { Search, BarChart3, Wallet } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Compare Deals",
    description:
      "We scan 8+ stores every hour to find the lowest prices on PC and console games. No more tab-hopping.",
    accent: "text-brand-600 bg-brand-50",
  },
  {
    icon: BarChart3,
    title: "Analyze Value",
    description:
      "Our LootBoxes Score rates every battle pass, gacha system, and in-game shop so you know what's fair.",
    accent: "text-purple-600 bg-purple-50",
  },
  {
    icon: Wallet,
    title: "Save Money",
    description:
      "Get deal alerts, historic low notifications, and weekly roundups — never overpay for a game again.",
    accent: "text-success-600 bg-success-50",
  },
];

export default function HowItWorks() {
  return (
    <section className="border-y border-gray-100 bg-gray-50/50 py-14">
      <div className="container-main">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            How LootBoxes.com Works
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-gray-500">
            More than a deal finder — we help you understand the true value of
            every gaming purchase.
          </p>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.title} className="text-center">
              <div
                className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${step.accent}`}
              >
                <step.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
