"use client";

import { useState, useEffect } from "react";

type Database = "none" | "postgres" | "sqlite" | "mongodb";
type Auth = "none" | "lucia" | "jwt";
type Framework = "nextjs" | "vite" | "astro" | "sveltekit" | "remix" | "hono" | "fastapi" | "go" | "rust";

type Language = "js" | "python" | "go" | "rust";

const FRAMEWORKS: { id: Framework; label: string; logo: string; lang: Language }[] = [
  { 
    id: "nextjs", 
    label: "Next.js", 
    logo: `<svg class="w-4 h-4" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="90" cy="90" r="90" fill="white"/><path d="M149.508 157.52L69.142 54H54v72h12.585V71.748L135.21 161.755a90 90 0 0 0 14.298-4.235zM126 54h-12v72h12V54z" fill="black"/></svg>`,
    lang: "js"
  },
  { 
    id: "vite", 
    label: "Vite + React", 
    logo: `<svg class="w-4 h-4" viewBox="0 0 256 257" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M251.9 45.4L136 244.3a18.2 18.2 0 0 1-31.5 0L1.7 54a9.1 9.1 0 0 1 11.2-13.4L128 78.5l112.5-38a9.1 9.1 0 0 1 11.4 4.9z" fill="url(#vite-g)"/><path d="M192.4 0l-74.8 55.4L44.8 11a4.5 4.5 0 0 0-6.7 5.1L128 256.7l5.6-9.6L200 4.6a4.5 4.5 0 0 0-7.6-4.6z" fill="url(#vite-g2)"/><defs><linearGradient id="vite-g" x1="12.5" y1="20" x2="216" y2="242.5" gradientUnits="userSpaceOnUse"><stop stop-color="#41D1FF"/><stop offset="1" stop-color="#BD34FE"/></linearGradient><linearGradient id="vite-g2" x1="133.5" y1="18.5" x2="167" y2="251" gradientUnits="userSpaceOnUse"><stop stop-color="#FF8800"/><stop offset="1" stop-color="#E1007E"/></linearGradient></defs></svg>`,
    lang: "js"
  },
  { 
    id: "astro", 
    label: "Astro", 
    logo: `<svg class="w-4 h-4" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M121.2 59.9C114.7 44.5 98.7 18.5 75.3 12.8c-22.3-5.4-38.3 8.3-43.1 13.9C15.6 44 4.6 77.2 9.5 93c4.7 15.3 15.6 22 25.3 22 17.5 0 35-18.7 44-33.8 6.5 13 19 28.5 30 28.5 7.6 0 14.5-5.3 16.3-15.5 2.1-12.2-2.7-27-3.9-34.3z" fill="url(#astro-g)"/><path d="M80.1 57.6C75 48.7 65.5 35 55.3 35c-7.3 0-11 7.2-11.8 12-.7 4 .8 12.7 4 23.4 3 10 7.8 22 10.3 29 1.3 3.6.4 5-1.1 5-2.6 0-10.4-10-15.5-17.6-.7-1-2-.6-2.1.5-.7 8.3.9 17.7 7 24 6 6.3 15.5 5 19.8 0 7-8 15-26 19.5-36 1.8-4 .7-5-1.3-8.7z" fill="white"/><defs><linearGradient id="astro-g" x1="24" y1="11" x2="108" y2="114" gradientUnits="userSpaceOnUse"><stop stop-color="#FF5D01"/><stop offset="1" stop-color="#FF00A0"/></linearGradient></defs></svg>`,
    lang: "js"
  },
  {
    id: "sveltekit",
    label: "SvelteKit",
    logo: `<svg class="w-4 h-4" viewBox="0 0 256 313" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M189 67c-17-18-47-21-69-5L35 125c-35 34-31 92 10 120l19 13 41-47-22-15c-15-10-18-29-7-43l85-63c11-9 28-7 35 4s5 26-6 34l-85 63c-33 25-38 72-13 103l79 97c18 22 50 25 72 7l86-63c35-34 31-92-10-120l-19-13-41 47 22 15c15 10 18 29 7 43l-85 63c-11 9-28 7-35-4s-5-26 6-34l85-63c33-25 38-72 13-103L189 67z" fill="#FF3E00"/></svg>`,
    lang: "js"
  },
  {
    id: "remix",
    label: "Remix",
    logo: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" fill="white"/></svg>`,
    lang: "js"
  },
  {
    id: "hono",
    label: "Hono API",
    logo: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#FF5000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#FF5000"/></svg>`,
    lang: "js"
  },
  {
    id: "fastapi",
    label: "FastAPI",
    logo: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#009688" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" fill="#009688"/></svg>`,
    lang: "python"
  },
  {
    id: "go",
    label: "Go (Fiber)",
    logo: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#00ADD8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16.5 9.4 7.55 4.24a1.78 1.78 0 0 0-2.5 1.55v12.42a1.78 1.78 0 0 0 2.5 1.55l8.95-5.17a1.78 1.78 0 0 0 0-3.1Z" fill="#00ADD8"/></svg>`,
    lang: "go"
  },
  {
    id: "rust",
    label: "Rust (Axum)",
    logo: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#DEA584" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18M12 12l6 6M12 12l-6-6M12 12l-6 6M12 12l6-6"/></svg>`,
    lang: "rust"
  }
];

export default function Home() {
  const [projectName, setProjectName] = useState("my-app");
  const [selectedLang, setSelectedLang] = useState<Language>("js");
  const [framework, setFramework] = useState<Framework>("nextjs");
  const [database, setDatabase] = useState<Database>("none");
  const [auth, setAuth] = useState<Auth>("none");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const origin = mounted ? window.location.origin : "http://localhost:3000";
  const cliCommand = `curl -sSL ${origin}/api/cli | bash -s -- ${projectName} ${framework} ${database} ${auth}`;

  function handleCopy() {
    navigator.clipboard.writeText(cliCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleLangChange(lang: Language) {
    setSelectedLang(lang);
    const firstOfLang = FRAMEWORKS.find((f) => f.lang === lang);
    if (firstOfLang) {
      setFramework(firstOfLang.id);
    }
  }

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
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-100 flex flex-col justify-between selection:bg-neutral-800 selection:text-white">
      {/* Header */}
      <header className="border-b border-neutral-900 px-6 py-4 sm:px-12 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="font-semibold tracking-wider text-sm uppercase text-neutral-200">SkipInit</span>
        </div>
        <div className="text-xs text-neutral-500 font-mono">
          v0.1.0
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 sm:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        {/* Left Column: Headline & Info */}
        <div className="md:col-span-6 space-y-6 md:py-8">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full border border-neutral-800 bg-neutral-900/40 text-xs text-neutral-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Ready to use
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Save your tokens for real code.
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg leading-relaxed max-w-lg">
            Stop asking AI models to setup the same configuration boilerplate over and over. Pick your stack, get a clean zip starter template, and spend your context window building features.
          </p>
          <div className="space-y-4 pt-4 border-t border-neutral-900">
            <div className="flex gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs font-mono text-neutral-400 border border-neutral-800">1</div>
              <p className="text-sm text-neutral-400">Select framework & dependencies</p>
            </div>
            <div className="flex gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs font-mono text-neutral-400 border border-neutral-800">2</div>
              <p className="text-sm text-neutral-400">Download clean package.json, configs & file layout</p>
            </div>
            <div className="flex gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs font-mono text-neutral-400 border border-neutral-800">3</div>
              <p className="text-sm text-neutral-400">Unzip, run <code>npm install</code>, and start building</p>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Card Form */}
        <div className="md:col-span-6 bg-neutral-900/30 border border-neutral-900 rounded-xl p-6 sm:p-8 space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2 font-medium">
              Project Name
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="my-app"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2 text-sm outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600 transition-all text-neutral-200"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2 font-medium">
              Language
            </label>
            <div className="grid grid-cols-4 gap-1.5 mb-4">
              {(["js", "python", "go", "rust"] as Language[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => handleLangChange(lang)}
                  className={`rounded-md border py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                    selectedLang === lang
                      ? "border-neutral-200 bg-neutral-100 text-neutral-950"
                      : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200"
                  }`}
                >
                  {lang === "js" ? "JS / TS" : lang}
                </button>
              ))}
            </div>

            <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2 font-medium">
              Framework
            </label>
            <div className="grid grid-cols-2 gap-2">
              {FRAMEWORKS.filter((option) => option.lang === selectedLang).map((option) => {
                const isSelected = framework === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setFramework(option.id)}
                    className={`w-full flex items-center justify-between rounded-md border px-4 py-3 text-sm transition-all text-left ${
                      isSelected
                        ? "border-neutral-200 bg-neutral-100 text-neutral-950 font-medium"
                        : "border-neutral-800 bg-neutral-950 text-neutral-300 hover:border-neutral-700"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span 
                        className={`p-1 rounded-sm ${isSelected ? 'bg-neutral-200' : 'bg-neutral-800'}`}
                        dangerouslySetInnerHTML={{ __html: option.logo }}
                      />
                      {option.label}
                    </span>
                    {isSelected && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-950 text-neutral-100 font-mono scale-90">
                        active
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2 font-medium">
              Database
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(["none", "postgres", "sqlite", "mongodb"] as Database[]).map((option) => {
                const isSelected = database === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setDatabase(option);
                      if (option === "none" && auth === "lucia") {
                        setAuth("none");
                      }
                    }}
                    className={`flex items-center justify-center gap-2 rounded-md border px-3 py-2.5 text-sm transition-all ${
                      isSelected
                        ? "border-neutral-200 bg-neutral-100 text-neutral-950 font-medium"
                        : "border-neutral-800 bg-neutral-950 text-neutral-300 hover:border-neutral-700"
                    }`}
                  >
                    {option === "none" ? (
                      <svg className="w-4 h-4 stroke-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="m4.93 4.93 14.14 14.14"/>
                      </svg>
                    ) : option === "postgres" ? (
                      <svg className={`w-4 h-4 ${isSelected ? 'stroke-neutral-950' : 'stroke-neutral-400'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <ellipse cx="12" cy="5" rx="9" ry="3"/>
                        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
                        <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/>
                      </svg>
                    ) : option === "sqlite" ? (
                      <svg className={`w-4 h-4 ${isSelected ? 'stroke-neutral-950' : 'stroke-neutral-400'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/>
                        <path d="M16 8 2 22"/>
                        <path d="M17.5 15H9"/>
                      </svg>
                    ) : (
                      <svg className={`w-4 h-4 ${isSelected ? 'stroke-neutral-950' : 'stroke-neutral-400'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2C9.5 7 5 12 5 15.5a7 7 0 0 0 14 0C19 12 14.5 7 12 2Z"/>
                        <path d="M12 5v15"/>
                      </svg>
                    )}
                    {option === "none" ? "None" : option === "postgres" ? "PostgreSQL" : option === "sqlite" ? "SQLite" : "MongoDB"}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2 font-medium">
              Auth
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["none", "lucia", "jwt"] as Auth[]).map((option) => {
                const isSelected = auth === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleAuthChange(option)}
                    className={`flex items-center justify-center gap-2 rounded-md border px-2 py-2.5 text-sm transition-all ${
                      isSelected
                        ? "border-neutral-200 bg-neutral-100 text-neutral-950 font-medium"
                        : "border-neutral-800 bg-neutral-950 text-neutral-300 hover:border-neutral-700"
                    }`}
                  >
                    {option === "none" ? (
                      <svg className="w-4 h-4 stroke-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="m4.93 4.93 14.14 14.14"/>
                      </svg>
                    ) : option === "lucia" ? (
                      <svg className={`w-4 h-4 ${isSelected ? 'stroke-neutral-950' : 'stroke-neutral-400'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
                      </svg>
                    ) : (
                      <svg className={`w-4 h-4 ${isSelected ? 'stroke-neutral-950' : 'stroke-neutral-400'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="10" rx="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    )}
                    {option === "none" ? "None" : option === "lucia" ? "Lucia" : "JWT"}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-md bg-neutral-100 text-neutral-950 text-sm font-semibold py-3 hover:bg-white transition-all disabled:opacity-50 active:scale-[0.98]"
            >
              <svg className="w-5 h-5 shrink-0 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 6h12a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z" />
                <path d="M5 12h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1Z" />
                <path d="M4 18h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1Z" />
              </svg>
              {loading ? "Generating ZIP..." : "Download Starter Zip"}
            </button>
          </div>

          <div className="relative border-t border-neutral-900 pt-4">
            <p className="block text-xs uppercase tracking-wider text-neutral-500 mb-2 font-medium">
              Or initialize via terminal
            </p>
            <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-md p-2 pl-3 font-mono text-[10px] text-neutral-300 overflow-hidden">
              <span className="text-neutral-500 mr-2 shrink-0">$</span>
              <span className="flex-1 overflow-x-auto whitespace-nowrap scrollbar-none pr-2 select-all">{cliCommand}</span>
              <button
                type="button"
                onClick={handleCopy}
                className="ml-2 px-2.5 py-1.5 rounded bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-300 font-sans hover:bg-neutral-800 hover:text-white transition-all shrink-0 active:scale-[0.97]"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-950/30 border border-red-900/50 rounded-md">
              <p className="text-xs text-red-400 font-medium">{error}</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 px-6 py-6 sm:px-12 text-center text-xs text-neutral-600">
        <p>SkipInit © {new Date().getFullYear()}. Starter templates clean of prompts.</p>
      </footer>
    </div>
  );
}
