"use client";

import { useState } from "react";

type Database = "none" | "postgres";
type Auth = "none" | "lucia";
type Framework = "nextjs" | "vite" | "remix" | "astro" | "sveltekit";

const FRAMEWORKS: { id: Framework; label: string; available: boolean }[] = [
  { id: "nextjs", label: "Next.js", available: true },
  { id: "vite", label: "Vite + React", available: false },
  { id: "remix", label: "Remix", available: false },
  { id: "astro", label: "Astro", available: false },
  { id: "sveltekit", label: "SvelteKit", available: false },
];

export default function Home() {
  const [projectName, setProjectName] = useState("my-app");
  const [framework, setFramework] = useState<Framework>("nextjs");
  const [database, setDatabase] = useState<Database>("none");
  const [auth, setAuth] = useState<Auth>("none");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleAuthChange(selectedAuth: Auth) {
    setAuth(selectedAuth);
    if (selectedAuth === "lucia") {
      setDatabase("postgres");
    }
  }

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectName, framework, database, auth }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Generation failed");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${projectName || "my-app"}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex-1 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="mb-10">
          <h1 className="text-2xl font-semibold tracking-tight">skipinit</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Configure your stack. Download a starter kit.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-wide text-neutral-500 mb-2">
              Project Name
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="my-app"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-sm outline-none focus:border-neutral-600 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wide text-neutral-500 mb-2">
              Framework
            </label>
            <div className="grid grid-cols-2 gap-2">
              {FRAMEWORKS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  disabled={!option.available}
                  onClick={() => setFramework(option.id)}
                  className={`rounded-md border px-3 py-2 text-sm transition-colors text-left ${
                    framework === option.id
                      ? "border-neutral-100 bg-neutral-100 text-neutral-950"
                      : option.available
                        ? "border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-neutral-600"
                        : "border-neutral-800 bg-neutral-900 text-neutral-600 cursor-not-allowed"
                  }`}
                >
                  {option.label}
                  {!option.available && (
                    <span className="block text-[10px] text-neutral-600">soon</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wide text-neutral-500 mb-2">
              Database
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(["none", "postgres"] as Database[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setDatabase(option);
                    if (option === "none" && auth === "lucia") {
                      setAuth("none");
                    }
                  }}
                  className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                    database === option
                      ? "border-neutral-100 bg-neutral-100 text-neutral-950"
                      : "border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-neutral-600"
                  }`}
                >
                  {option === "none" ? "None" : "PostgreSQL"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wide text-neutral-500 mb-2">
              Auth
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(["none", "lucia"] as Auth[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleAuthChange(option)}
                  className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                    auth === option
                      ? "border-neutral-100 bg-neutral-100 text-neutral-950"
                      : "border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-neutral-600"
                  }`}
                >
                  {option === "none" ? "None" : "Lucia Auth"}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="w-full rounded-md bg-neutral-100 text-neutral-950 text-sm font-medium py-2.5 hover:bg-white transition-colors disabled:opacity-50"
          >
            {loading ? "Generating…" : "Download .zip"}
          </button>

          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>
      </div>
    </main>
  );
}
