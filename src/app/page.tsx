"use client";

import { useState, useEffect } from "react";

type Database = "none" | "postgres" | "mysql" | "sqlite" | "mongodb" | "redis" | "mssql";
type Auth = "none" | "lucia" | "jwt" | "nextauth";
type Language = "js" | "python" | "go" | "rust" | "php" | "java" | "csharp";
type Framework =
  | "nextjs" | "vite" | "astro" | "sveltekit" | "remix" | "hono" | "express" | "nestjs" | "nuxt" | "angular" | "vue"
  | "fastapi" | "django" | "flask"
  | "go" | "rust"
  | "laravel" | "symfony"
  | "springboot" | "dotnet";

interface FrameworkDef { id: Framework; label: string; logo: string; lang: Language }

const FRAMEWORKS: FrameworkDef[] = [
  { id: "nextjs",    label: "Next.js",     lang: "js",     logo: `<svg class="w-5 h-5" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="90" cy="90" r="90" fill="white"/><path d="M149.508 157.52L69.142 54H54v72h12.585V71.748L135.21 161.755a90 90 0 0 0 14.298-4.235zM126 54h-12v72h12V54z" fill="black"/></svg>` },
  { id: "vite",      label: "Vite + React", lang: "js",    logo: `<svg class="w-5 h-5" viewBox="0 0 256 257" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M251.9 45.4L136 244.3a18.2 18.2 0 0 1-31.5 0L1.7 54a9.1 9.1 0 0 1 11.2-13.4L128 78.5l112.5-38a9.1 9.1 0 0 1 11.4 4.9z" fill="url(#vg)"/><path d="M192.4 0l-74.8 55.4L44.8 11a4.5 4.5 0 0 0-6.7 5.1L128 256.7l5.6-9.6L200 4.6a4.5 4.5 0 0 0-7.6-4.6z" fill="url(#vg2)"/><defs><linearGradient id="vg" x1="12.5" y1="20" x2="216" y2="242.5" gradientUnits="userSpaceOnUse"><stop stop-color="#41D1FF"/><stop offset="1" stop-color="#BD34FE"/></linearGradient><linearGradient id="vg2" x1="133.5" y1="18.5" x2="167" y2="251" gradientUnits="userSpaceOnUse"><stop stop-color="#FF8800"/><stop offset="1" stop-color="#E1007E"/></linearGradient></defs></svg>` },
  { id: "astro",     label: "Astro",        lang: "js",    logo: `<svg class="w-5 h-5" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M121.2 59.9C114.7 44.5 98.7 18.5 75.3 12.8c-22.3-5.4-38.3 8.3-43.1 13.9C15.6 44 4.6 77.2 9.5 93c4.7 15.3 15.6 22 25.3 22 17.5 0 35-18.7 44-33.8 6.5 13 19 28.5 30 28.5 7.6 0 14.5-5.3 16.3-15.5 2.1-12.2-2.7-27-3.9-34.3z" fill="url(#ag)"/><path d="M80.1 57.6C75 48.7 65.5 35 55.3 35c-7.3 0-11 7.2-11.8 12-.7 4 .8 12.7 4 23.4 3 10 7.8 22 10.3 29 1.3 3.6.4 5-1.1 5-2.6 0-10.4-10-15.5-17.6-.7-1-2-.6-2.1.5-.7 8.3.9 17.7 7 24 6 6.3 15.5 5 19.8 0 7-8 15-26 19.5-36 1.8-4 .7-5-1.3-8.7z" fill="white"/><defs><linearGradient id="ag" x1="24" y1="11" x2="108" y2="114" gradientUnits="userSpaceOnUse"><stop stop-color="#FF5D01"/><stop offset="1" stop-color="#FF00A0"/></linearGradient></defs></svg>` },
  { id: "sveltekit", label: "SvelteKit",    lang: "js",    logo: `<svg class="w-5 h-5" viewBox="0 0 256 313" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M189 67c-17-18-47-21-69-5L35 125c-35 34-31 92 10 120l19 13 41-47-22-15c-15-10-18-29-7-43l85-63c11-9 28-7 35 4s5 26-6 34l-85 63c-33 25-38 72-13 103l79 97c18 22 50 25 72 7l86-63c35-34 31-92-10-120l-19-13-41 47 22 15c15 10 18 29 7 43l-85 63c-11 9-28 7-35-4s-5-26 6-34l85-63c33-25 38-72 13-103L189 67z" fill="#FF3E00"/></svg>` },
  { id: "remix",     label: "Remix",        lang: "js",    logo: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M14.72 15.94c.14.81.17 1.59.17 2.06H9.9c0-.33-.02-.66-.07-1.01-.23-1.78-1.07-2.18-2.7-2.18H3.98v-3.64h3.3c1.97 0 2.84-.55 2.84-2.05 0-1.3-.87-2.04-2.84-2.04H3.98V3.44h4.22c4.3 0 6.34 1.98 6.34 4.93 0 2.01-1.16 3.37-2.79 3.9 1.37.46 2.67 1.45 2.97 3.67zM3.98 19.65V16.5H7.8c1.09 0 1.53.44 1.53 1.3 0 .84-.44 1.85-1.53 1.85H3.98z"/></svg>` },
  { id: "hono",      label: "Hono",         lang: "js",    logo: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="#FF5000" xmlns="http://www.w3.org/2000/svg"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>` },
  { id: "express",   label: "Express",      lang: "js",    logo: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" xmlns="http://www.w3.org/2000/svg"><path d="M3 12h18M3 6h18M3 18h18"/></svg>` },
  { id: "nestjs",    label: "NestJS",       lang: "js",    logo: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="#E0234E" xmlns="http://www.w3.org/2000/svg"><path d="M17 3.34a10 10 0 1 1-14.995 8.984L2 12l.005-.324A10 10 0 0 1 17 3.34zm-5 3.66a6 6 0 0 0-5.2 9h10.4A6 6 0 0 0 12 7z"/></svg>` },
  { id: "nuxt",      label: "Nuxt.js",      lang: "js",    logo: `<svg class="w-5 h-5" viewBox="0 0 400 298" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M227.923 82.584L172.844 174.27h110.16L227.923 82.584z" fill="#00DC82"/><path d="M314.58 174.27L241.34 48.91a16.18 16.18 0 0 0-28.028 0l-27.469 47.544L245.72 198.01 314.58 174.27z" fill="#00DC82"/><path d="M86.373 224.27h227.255L241.34 98.91 86.373 224.27z" fill="#00DC82"/></svg>` },
  { id: "angular",   label: "Angular",      lang: "js",    logo: `<svg class="w-5 h-5" viewBox="0 0 250 250" fill="#DD0031" xmlns="http://www.w3.org/2000/svg"><path d="M125 30L31.9 63.2l14.2 123.1L125 230l78.9-43.7 14.2-123.1z"/><path d="M125 52.1L66.8 182.6h21.7l11.7-29.2h49.4l11.7 29.2H183L125 52.1z" fill="white"/><path d="M106.2 135.3l18.8-47.1 18.8 47.1h-37.6z" fill="#DD0031"/></svg>` },
  { id: "vue",       label: "Vue.js",       lang: "js",    logo: `<svg class="w-5 h-5" viewBox="0 0 261.76 226.69" xmlns="http://www.w3.org/2000/svg"><path d="M161.096.001l-30.224 52.35L100.647.001H-.005l130.877 226.688L261.762.001z" fill="#41B883"/><path d="M161.096.001l-30.224 52.35L100.647.001H52.346l78.505 135.93L209.392.001z" fill="#34495E"/></svg>` },
  { id: "fastapi",   label: "FastAPI",      lang: "python", logo: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="#009688" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm1 14.5V13h3l-4-7v5H9l4 7z"/></svg>` },
  { id: "django",    label: "Django",       lang: "python", logo: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="#092E20" xmlns="http://www.w3.org/2000/svg"><path d="M11.5 2H14v13.5c0 3.59-2.91 5.5-5.5 5.5S3 19.09 3 15.5c0-3.25 2.5-5.5 5.5-5.5.52 0 1.02.07 1.5.2V2h1.5zm-3 12c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>` },
  { id: "flask",     label: "Flask",        lang: "python", logo: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" xmlns="http://www.w3.org/2000/svg"><path d="M9 3h6M9 3v5.5L4 17a3 3 0 0 0 2.6 4.5h10.8A3 3 0 0 0 20 17l-5-8.5V3M9 3H7M15 3h2"/></svg>` },
  { id: "go",        label: "Go (Fiber)",   lang: "go",    logo: `<svg class="w-5 h-5" viewBox="0 0 207.43 78" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.18 24.28c-.37 0-.46-.19-.28-.46l1.94-2.49c.19-.28.65-.46 1.02-.46h35.42c.37 0 .46.28.28.55l-1.57 2.4c-.19.28-.65.55-.93.55l-35.88-.09z" fill="#00ADD8"/><path d="M.54 33.6c-.37 0-.46-.19-.28-.46l1.94-2.49c.19-.28.65-.46 1.02-.46h45.32c.37 0 .55.28.46.55l-.74 2.21c-.09.37-.46.55-.83.55L.54 33.6z" fill="#00ADD8"/><path d="M25.47 42.92c-.37 0-.46-.28-.28-.55l1.29-2.3c.19-.28.55-.55.93-.55h19.95c.37 0 .55.28.55.65l-.19 2.21c0 .37-.37.65-.65.65l-21.6-.11z" fill="#00ADD8"/><path d="M129.15 22.62c-6.32 1.75-10.63 3.04-16.86 4.79-1.57.46-1.66.55-2.96-.93-1.48-1.66-2.59-2.77-4.7-3.79-6.32-3.04-12.45-2.12-18.22 1.57-6.88 4.42-10.44 10.82-10.35 18.87.09 7.98 5.54 14.56 13.43 15.68 6.78.93 12.45-1.48 17-6.6.93-1.11 1.75-2.3 2.77-3.79H93.08c-2.21 0-2.77-1.38-2.04-3.13 1.38-3.32 3.96-8.84 5.45-11.61.37-.65 1.11-1.75 2.68-1.75h38.91c-.19 2.77-.19 5.54-.55 8.3-1.02 6.69-3.5 12.82-7.71 18.22-6.97 8.93-16.11 14.47-27.48 16.02-9.41 1.29-18.13-.46-25.83-6.13-7.14-5.26-11.24-12.36-12.36-21.11-1.29-10.26 1.75-19.57 7.89-27.66C80.08 10.54 90.24 4.96 102.7 3.85c10.07-.93 19.57 1.38 27.75 7.71 5.08 3.96 8.7 9.04 11.06 14.94.65.74.28 1.11-2.36 2.12z" fill="#00ADD8"/><path d="M155.97 79.01c-9.04-.19-17.28-2.77-24.14-8.7-5.82-5.08-9.41-11.52-10.53-19.2-1.66-11.71 1.57-22.15 8.84-31.09 7.89-9.6 17.74-14.84 30.19-16.11 10.72-1.11 20.68 1.02 29.52 7.43 7.98 5.91 12.64 13.71 13.71 23.68 1.38 13.15-2.4 23.96-11.33 33.09-6.6 6.78-14.75 11.06-24.14 13.06-4.05.55-8.12.65-12.12-.16zm20.12-33.93c-.09-1.2-.09-2.12-.28-3.04-1.66-9.32-10.07-14.56-18.96-12.36-8.7 2.12-14.38 8.12-15.86 17.09-1.2 7.43 2.87 14.84 9.79 17.56 5.45 2.12 10.9 1.57 15.95-1.48 7.34-4.42 10.44-11.33 9.36-17.77z" fill="#00ADD8"/></svg>` },
  { id: "rust",      label: "Rust (Axum)",  lang: "rust",  logo: `<svg class="w-5 h-5" viewBox="0 0 144 144" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M63.1 1.7a8.4 8.4 0 0 1 17.8 0l1 5a63.4 63.4 0 0 1 14.2 5.9l4.3-2.8a8.4 8.4 0 0 1 11.7 11.7l-2.8 4.3a63.4 63.4 0 0 1 5.9 14.2l5 1a8.4 8.4 0 0 1 0 17.8l-5 1a63.4 63.4 0 0 1-5.9 14.2l2.8 4.3a8.4 8.4 0 0 1-11.7 11.7l-4.3-2.8a63.4 63.4 0 0 1-14.2 5.9l-1 5a8.4 8.4 0 0 1-17.8 0l-1-5a63.4 63.4 0 0 1-14.2-5.9l-4.3 2.8a8.4 8.4 0 0 1-11.7-11.7l2.8-4.3a63.4 63.4 0 0 1-5.9-14.2l-5-1a8.4 8.4 0 0 1 0-17.8l5-1a63.4 63.4 0 0 1 5.9-14.2L31.8 20a8.4 8.4 0 0 1 11.7-11.7l4.3 2.8A63.4 63.4 0 0 1 62 5.7l1-4z" fill="#DEA584"/><circle cx="72" cy="72" r="31" fill="#1A1A1A"/><path d="M56 67h7m18 0h7M60 58l4 4M80 58l-4 4M60 86l4-4M80 86l-4-4M72 82V72m-8-4c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="#DEA584" stroke-width="3" stroke-linecap="round"/></svg>` },
  { id: "laravel",   label: "Laravel",      lang: "php",   logo: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="#FF2D20" xmlns="http://www.w3.org/2000/svg"><path d="M23.644 5.43a.392.392 0 0 1 .014.1v5.228a.392.392 0 0 1-.196.338l-4.353 2.486v4.927a.392.392 0 0 1-.195.337l-9.09 5.187c-.017.01-.035.017-.054.023-.007.003-.014.008-.022.01a.388.388 0 0 1-.2 0c-.01-.002-.017-.007-.027-.01-.018-.006-.036-.013-.052-.022L.226 18.845a.392.392 0 0 1-.196-.338V3.624a.403.403 0 0 1 .014-.1c.003-.012.01-.02.014-.032.006-.016.01-.032.02-.046.007-.013.02-.022.03-.033.01-.013.02-.026.032-.037.014-.009.027-.013.04-.02.014-.01.027-.02.042-.027h.001L4.97.192a.392.392 0 0 1 .39 0l4.782 2.74h.001c.015.008.028.018.042.027.013.007.026.011.04.02.012.012.022.025.032.037.012.011.022.02.03.033.01.014.015.03.02.046.006.013.012.02.015.032zm-.783 5.194V6.053l-1.822 1.042-2.528 1.444v4.572l4.35-2.487zm-4.742 8.175V14.23l-2.487 1.42-7.13 4.075v4.61l9.617-5.536zM.43 4.061v14.384l9.585 5.517v-4.61l-5.008-2.836-.005-.003-.004-.002c-.014-.01-.027-.018-.04-.03-.011-.01-.021-.02-.031-.03-.012-.013-.018-.028-.028-.042-.007-.013-.015-.024-.02-.037-.006-.016-.008-.032-.012-.048-.003-.014-.008-.026-.008-.04v-.001V6.553L2.252 5.11.43 4.061zm4.351-3.132L.83 3.395l4.349 2.487 4.35-2.487L5.007.562c-.177-.1-.391-.1-.568 0zm-.194 18.29 2.487-1.42V5.938L4.351 7.38l-2.529 1.444v12.948l2.766-1.575zm9.617-5.536l2.528-1.443V7.495l-2.528 1.443-1.822 1.043v4.572l1.822-1.042v.293z"/></svg>` },
  { id: "symfony",   label: "Symfony",      lang: "php",   logo: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" stroke-width="1.5" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"/><path d="M8 10.5C8.5 8 11 7 13 8.5s1.5 3.5 0 4.5-4 1-4.5 4c-.5 2.5 2 4 4 3.5"/><circle cx="17" cy="8" r="1" fill="#1A1A1A"/></svg>` },
  { id: "springboot",label: "Spring Boot",  lang: "java",  logo: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="#6DB33F" xmlns="http://www.w3.org/2000/svg"><path d="M20.59 5.41A9.94 9.94 0 0 0 14 2.06V0h-4v2.06A10 10 0 1 0 20.59 5.41zM12 20a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm1-13h-2v6l5.25 3.15.75-1.23-4-2.37V7z"/></svg>` },
  { id: "dotnet",    label: ".NET Core",    lang: "csharp", logo: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="#512BD4" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>` },
];

const LANG_LABELS: Record<Language, string> = {
  js: "JS / TS", python: "Python", go: "Go", rust: "Rust", php: "PHP", java: "Java", csharp: "C#",
};

export default function Home() {
  const [projectName, setProjectName] = useState("my-app");
  const [selectedLang, setSelectedLang] = useState<Language>("js");
  const [search, setSearch] = useState("");
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
    setSearch("");
    const first = FRAMEWORKS.find((f) => f.lang === lang);
    if (first) setFramework(first.id);
  }

  function handleAuthChange(selectedAuth: Auth) {
    setAuth(selectedAuth);
    if (selectedAuth === "lucia" || selectedAuth === "nextauth") {
      if (database === "none") setDatabase("postgres");
    }
  }

  // filter: if search active → across all langs, else by selected lang
  const visibleFrameworks = FRAMEWORKS.filter((f) => {
    if (search.trim()) return f.label.toLowerCase().includes(search.toLowerCase());
    return f.lang === selectedLang;
  });

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
      <header className="border-b border-neutral-900 px-6 py-4 sm:px-12 flex justify-between items-center">
        <span className="font-semibold tracking-wider text-sm uppercase text-neutral-200">SkipInit</span>
        <span className="text-xs text-neutral-500 font-mono">v0.1.0</span>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 sm:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        {/* Left */}
        <div className="md:col-span-6 space-y-6 md:py-8">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full border border-neutral-800 bg-neutral-900/40 text-xs text-neutral-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Ready to use
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Save your tokens for real code.
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg leading-relaxed max-w-lg">
            Stop asking AI to set up the same boilerplate over and over. Pick your stack, get a clean starter zip, then spend your context window on features.
          </p>
          <div className="space-y-3 pt-4 border-t border-neutral-900">
            {["Select language & framework", "Pick database & auth", "Download ZIP or copy terminal command"].map((step, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs font-mono text-neutral-400 border border-neutral-800">{i + 1}</div>
                <p className="text-sm text-neutral-400">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="md:col-span-6 bg-neutral-900/30 border border-neutral-900 rounded-xl p-6 sm:p-8 space-y-5">
          {/* Project Name */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2 font-medium">Project Name</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="my-app"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2 text-sm outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600 transition-all text-neutral-200"
            />
          </div>

          {/* Language tabs */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2 font-medium">Language</label>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(LANG_LABELS) as Language[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => handleLangChange(lang)}
                  className={`rounded-md border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                    selectedLang === lang && !search
                      ? "border-neutral-200 bg-neutral-100 text-neutral-950"
                      : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200"
                  }`}
                >
                  {LANG_LABELS[lang]}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 stroke-neutral-500" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search framework..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-md pl-8 pr-3 py-2 text-xs outline-none focus:border-neutral-600 transition-all text-neutral-200 placeholder:text-neutral-600"
            />
            {search && (
              <button type="button" onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 text-xs">✕</button>
            )}
          </div>

          {/* Framework grid */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2 font-medium">
              Framework {search && <span className="normal-case tracking-normal text-neutral-600">— searching all</span>}
            </label>
            {visibleFrameworks.length === 0 ? (
              <p className="text-xs text-neutral-600 py-4 text-center">No framework found for &quot;{search}&quot;</p>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                {visibleFrameworks.map((option) => {
                  const isSelected = framework === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => { setFramework(option.id); setSearch(""); setSelectedLang(option.lang); }}
                      className={`flex items-center gap-2.5 rounded-md border px-3 py-2.5 text-sm transition-all text-left ${
                        isSelected
                          ? "border-neutral-200 bg-neutral-100 text-neutral-950 font-medium"
                          : "border-neutral-800 bg-neutral-950 text-neutral-300 hover:border-neutral-700"
                      }`}
                    >
                      <span
                        className={`shrink-0 w-5 h-5 flex items-center justify-center rounded-sm ${isSelected ? "bg-neutral-200" : "bg-neutral-800"}`}
                        dangerouslySetInnerHTML={{ __html: option.logo }}
                      />
                      <span className="truncate text-xs">{option.label}</span>
                      {search && (
                        <span className="ml-auto text-[9px] text-neutral-500 shrink-0">{LANG_LABELS[option.lang]}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Database */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2 font-medium">Database</label>
            <div className="grid grid-cols-2 gap-2">
              {(["none", "postgres", "mysql", "sqlite", "mongodb", "redis", "mssql"] as Database[]).map((option) => {
                const isSelected = database === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => { setDatabase(option); if (option === "none" && (auth === "lucia" || auth === "nextauth")) setAuth("none"); }}
                    className={`flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-xs transition-all ${
                      isSelected ? "border-neutral-200 bg-neutral-100 text-neutral-950 font-medium" : "border-neutral-800 bg-neutral-950 text-neutral-300 hover:border-neutral-700"
                    }`}
                  >
                    <span>{option === "none" ? "None" : option === "postgres" ? "PostgreSQL" : option === "mysql" ? "MySQL" : option === "mssql" ? "MS SQL" : option.charAt(0).toUpperCase() + option.slice(1)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Auth */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2 font-medium">Auth</label>
            <div className="grid grid-cols-4 gap-2">
              {(["none", "lucia", "jwt", "nextauth"] as Auth[]).map((option) => {
                const isSelected = auth === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleAuthChange(option)}
                    className={`flex items-center justify-center gap-1.5 rounded-md border px-2 py-2 text-xs transition-all ${
                      isSelected ? "border-neutral-200 bg-neutral-100 text-neutral-950 font-medium" : "border-neutral-800 bg-neutral-950 text-neutral-300 hover:border-neutral-700"
                    }`}
                  >
                    {option === "none" ? "None" : option === "nextauth" ? "NextAuth" : option === "lucia" ? "Lucia" : "JWT"}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Download */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-md bg-neutral-100 text-neutral-950 text-sm font-semibold py-3 hover:bg-white transition-all disabled:opacity-50 active:scale-[0.98]"
          >
            <svg className="w-4 h-4 shrink-0 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 6h12a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z"/><path d="M5 12h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1Z"/><path d="M4 18h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1Z"/>
            </svg>
            {loading ? "Generating ZIP..." : "Download Starter Zip"}
          </button>

          {/* CLI */}
          <div className="border-t border-neutral-900 pt-4">
            <p className="block text-xs uppercase tracking-wider text-neutral-500 mb-2 font-medium">Or initialize via terminal</p>
            <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-md p-2 pl-3 font-mono text-[10px] text-neutral-300 overflow-hidden">
              <span className="text-neutral-500 mr-2 shrink-0">$</span>
              <span className="flex-1 overflow-x-auto whitespace-nowrap pr-2 select-all">{cliCommand}</span>
              <button
                type="button"
                onClick={handleCopy}
                className="ml-2 px-2.5 py-1.5 rounded bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-300 font-sans hover:bg-neutral-800 hover:text-white transition-all shrink-0"
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

      <footer className="border-t border-neutral-900 px-6 py-6 sm:px-12 text-center text-xs text-neutral-600">
        <p>SkipInit © {new Date().getFullYear()}. Starter templates clean of prompts.</p>
      </footer>
    </div>
  );
}
