import Link from "next/link";
import { Tag, Percent, Gamepad2 } from "lucide-react";

const BANNERS = [
  {
    title: "Under $10",
    subtitle: "Great games at pocket-friendly prices",
    href: "/deals?max=10",
    icon: Tag,
    gradient: "from-emerald-500 to-teal-600",
    iconBg: "bg-white/20",
  },
  {
    title: "Historic Lows",
    subtitle: "Cheapest prices ever recorded",
    href: "/deals?filter=historic-low",
    icon: Percent,
    gradient: "from-brand-500 to-brand-700",
    iconBg: "bg-white/20",
  },
  {
    title: "AAA Titles",
    subtitle: "Big-budget games at big discounts",
    href: "/deals?category=aaa",
    icon: Gamepad2,
    gradient: "from-purple-500 to-indigo-600",
    iconBg: "bg-white/20",
  },
];

export default function SaleBanners() {
  return (
    <section className="py-10">
      <div className="container-main">
        <h2 className="text-2xl font-bold text-gray-900">
          Browse by Category
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {BANNERS.map((banner) => (
            <Link
              key={banner.title}
              href={banner.href}
              className="group relative overflow-hidden rounded-xl shadow-md transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              <div
                className={`bg-gradient-to-br ${banner.gradient} px-6 py-8`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${banner.iconBg}`}
                >
                  <banner.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-white">
                  {banner.title}
                </h3>
                <p className="mt-1 text-sm text-white/80">
                  {banner.subtitle}
                </p>
                <span className="mt-4 inline-flex items-center text-sm font-medium text-white/90 group-hover:text-white">
                  Shop deals →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
