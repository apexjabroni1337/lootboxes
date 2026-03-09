"use client";

import { useState, useRef } from "react";

const BYMYKEL_CRATES_URL =
  "https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/crates.json";

const BATCH_SIZE = 5; // crates per API call — small to stay well within timeout

interface ByMykelRarity {
  id: string;
  name: string;
  color: string;
}

interface ByMykelCrateItem {
  id: string;
  name: string;
  rarity?: ByMykelRarity;
  image?: string;
}

interface ByMykelCrate {
  id: string;
  name: string;
  description?: string | null;
  type?: string;
  first_sale_date?: string;
  image?: string;
  contains?: ByMykelCrateItem[];
  contains_rare?: ByMykelCrateItem[];
}

function classifyCrateType(crate: ByMykelCrate): string {
  const name = crate.name.toLowerCase();
  const type = (crate.type || "").toLowerCase();
  if (type.includes("case") || name.includes("case")) return "Weapon Case";
  if (type.includes("souvenir") || name.includes("souvenir")) return "Souvenir Package";
  if (name.includes("sticker") && (name.includes("capsule") || name.includes("collection")))
    return "Sticker Capsule";
  if (name.includes("patch") && (name.includes("pack") || name.includes("collection")))
    return "Patch Pack";
  if (name.includes("graffiti")) return "Graffiti Box";
  if (name.includes("music kit")) return "Music Kit Box";
  if (name.includes("pin") && name.includes("capsule")) return "Pin Capsule";
  if (name.includes("agent")) return "Agent";
  if (name.includes("capsule") || name.includes("collection")) return "Capsule";
  return "Other";
}

function transformCrate(raw: ByMykelCrate) {
  const normalItems = (raw.contains || []).map((item) => ({
    bymykel_id: item.id,
    name: item.name,
    rarity_name: item.rarity?.name || "Unknown",
    rarity_color: item.rarity?.color || null,
    image: item.image || null,
    is_rare_special: false,
  }));

  const rareItems = (raw.contains_rare || []).map((item) => ({
    bymykel_id: item.id,
    name: item.name,
    rarity_name: item.rarity?.name || "Extraordinary",
    rarity_color: item.rarity?.color || "#e4ae39",
    image: item.image || null,
    is_rare_special: true,
  }));

  return {
    bymykel_id: raw.id,
    name: raw.name,
    type: classifyCrateType(raw),
    description: raw.description || null,
    image: raw.image || null,
    first_sale_date: raw.first_sale_date || null,
    items: [...normalItems, ...rareItems],
  };
}

export default function SeedCS2Page() {
  const [secret, setSecret] = useState("");
  const [status, setStatus] = useState<string>("idle");
  const [log, setLog] = useState<string[]>([]);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const abortRef = useRef(false);

  const addLog = (msg: string) => {
    setLog((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleSeed = async () => {
    if (!secret) {
      alert("Enter the secret");
      return;
    }

    abortRef.current = false;
    setLog([]);
    setStatus("fetching");
    addLog("Fetching crates.json from ByMykel...");

    try {
      const res = await fetch(BYMYKEL_CRATES_URL);
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const rawCrates: ByMykelCrate[] = await res.json();
      addLog(`Fetched ${rawCrates.length} crates. Transforming...`);

      const transformed = rawCrates
        .filter((c) => c.id && c.name)
        .map(transformCrate);

      addLog(`Transformed ${transformed.length} crates. Starting upload...`);
      setStatus("uploading");
      setProgress({ current: 0, total: transformed.length });

      let totalCrates = 0;
      let totalItems = 0;
      let errorCount = 0;

      for (let i = 0; i < transformed.length; i += BATCH_SIZE) {
        if (abortRef.current) {
          addLog("Aborted by user.");
          setStatus("aborted");
          return;
        }

        const batch = transformed.slice(i, i + BATCH_SIZE);
        const batchNum = Math.floor(i / BATCH_SIZE) + 1;
        const totalBatches = Math.ceil(transformed.length / BATCH_SIZE);

        try {
          const resp = await fetch("/api/admin/seed-cs2-cases", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ secret, crates: batch }),
          });

          const data = await resp.json();

          if (data.success) {
            totalCrates += data.cratesUpserted || 0;
            totalItems += data.itemsUpserted || 0;
            addLog(
              `Batch ${batchNum}/${totalBatches}: ${data.cratesUpserted} crates, ${data.itemsUpserted} items`
            );
          } else {
            errorCount++;
            addLog(`Batch ${batchNum}/${totalBatches} ERROR: ${data.error}`);
          }
        } catch (err: any) {
          errorCount++;
          addLog(`Batch ${batchNum}/${totalBatches} NETWORK ERROR: ${err.message}`);
        }

        setProgress({ current: Math.min(i + BATCH_SIZE, transformed.length), total: transformed.length });
      }

      addLog(`\nDone! ${totalCrates} crates, ${totalItems} items upserted. ${errorCount} errors.`);
      setStatus("done");
    } catch (err: any) {
      addLog(`FATAL ERROR: ${err.message}`);
      setStatus("error");
    }
  };

  const pct = progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8 font-mono">
      <h1 className="text-2xl font-bold mb-6">CS2 Case Seeder</h1>
      <p className="text-gray-400 mb-4 text-sm">
        Fetches all CS2 cases/capsules from ByMykel API in your browser, then uploads
        them in small batches to avoid serverless timeouts.
      </p>

      <div className="flex gap-3 mb-6">
        <input
          type="password"
          placeholder="CRON_SECRET"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded px-3 py-2 w-64"
        />
        <button
          onClick={handleSeed}
          disabled={status === "fetching" || status === "uploading"}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 px-4 py-2 rounded font-semibold"
        >
          {status === "fetching"
            ? "Fetching..."
            : status === "uploading"
            ? "Uploading..."
            : "Seed Cases"}
        </button>
        {status === "uploading" && (
          <button
            onClick={() => (abortRef.current = true)}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold"
          >
            Abort
          </button>
        )}
      </div>

      {progress.total > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-400 mb-1">
            <span>
              {progress.current} / {progress.total} crates
            </span>
            <span>{pct}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      <div className="bg-gray-900 border border-gray-800 rounded p-4 h-96 overflow-y-auto text-sm">
        {log.length === 0 ? (
          <span className="text-gray-600">Logs will appear here...</span>
        ) : (
          log.map((line, i) => (
            <div key={i} className={line.includes("ERROR") ? "text-red-400" : "text-green-400"}>
              {line}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
