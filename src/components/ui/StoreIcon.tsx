import { STORES } from "@/lib/types";

interface StoreIconProps {
  store: string;
  size?: "sm" | "md";
}

// Simple letter-based store icons with store colors
export default function StoreIcon({ store, size = "sm" }: StoreIconProps) {
  const storeInfo = STORES[store] || { name: store, color: "#666" };
  const initial = storeInfo.name.charAt(0).toUpperCase();

  const sizeClasses = size === "sm" ? "h-5 w-5 text-[9px]" : "h-6 w-6 text-[10px]";

  return (
    <span
      className={`inline-flex items-center justify-center rounded ${sizeClasses} font-bold text-white flex-shrink-0`}
      style={{ backgroundColor: storeInfo.color }}
      title={storeInfo.name}
    >
      {initial}
    </span>
  );
}
