"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { FRAMEWORKS, DATABASES, AUTHS, LANG_LABELS, LANG_LOGOS, Language, DatabaseId as Database, AuthId as Auth } from "@/lib/registry";

export default function Home() {
  const { resolvedTheme, setTheme } = useTheme();
  const [projectName, setProjectName] = useState("my-app");
  const [selectedLang, setSelectedLang] = useState<Language>("js");
  const [search, setSearch] = useState("");
  const [framework, setFramework] = useState<string>("nextjs");
  const [database, setDatabase] = useState<Database>("none");
  const [auth, setAuth] = useState<Auth>("none");
  const [docker, setDocker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const origin = mounted ? window.location.origin : "http://localhost:3000";
  const dockerAvailable = FRAMEWORKS.find((f) => f.id === framework)?.dockerSupported ?? false;
  const cliCommand = `curl -sSL ${origin}/api/cli | bash -s -- ${projectName} ${framework} ${database} ${auth}${dockerAvailable && docker ? " docker" : ""}`;

  function handleCopy() {
    navigator.clipboard.writeText(cliCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleLangChange(lang: Language) {
    setSelectedLang(lang);
    setSearch("");
    const first = FRAMEWORKS.find((f) => f.lang === lang);
    if (first) {
      setFramework(first.id);
      if (!first.dockerSupported) setDocker(false);
    }
  }

  function handleAuthChange(selectedAuth: Auth) {
    setAuth(selectedAuth);
    if (selectedAuth === "lucia" || selectedAuth === "nextauth" || selectedAuth === "betterauth") {
      if (database === "none") setDatabase("postgres");
    }
  }

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
        body: JSON.stringify({ projectName, framework, database, auth, docker: dockerAvailable && docker }),
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
    <div className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 flex flex-col justify-between selection:bg-neutral-200 selection:text-neutral-900 dark:selection:bg-neutral-800 dark:selection:text-white">
      <header className="border-b border-neutral-200 dark:border-neutral-900 px-6 py-4 sm:px-12 flex justify-between items-center">
        <span className="font-semibold tracking-wider text-sm uppercase text-neutral-800 dark:text-neutral-200">SkipInit</span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-neutral-500 font-mono">v0.2.0</span>
          {mounted && (
            <button
              type="button"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              className="rounded-md p-1.5 border border-neutral-300 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400 dark:hover:border-neutral-700 hover:text-neutral-900 dark:hover:text-neutral-200 transition-all"
            >
              {resolvedTheme === "dark" ? (
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
              ) : (
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/></svg>
              )}
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 sm:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        {/* Left */}
        <div className="md:col-span-6 space-y-6 md:py-8">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full border border-neutral-300 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900/40 text-xs text-neutral-600 dark:text-neutral-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Ready to use
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white leading-tight">
            Save your tokens for real code.
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-base sm:text-lg leading-relaxed max-w-lg">
            Stop asking AI to set up the same boilerplate over and over. Pick your stack, get a clean starter zip, then spend your context window on features.
          </p>
          <div className="space-y-3 pt-4 border-t border-neutral-200 dark:border-neutral-900">
            {["Select language & framework", "Pick database & auth", "Download ZIP or copy terminal command"].map((step, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-900 text-xs font-mono text-neutral-600 dark:text-neutral-400 border border-neutral-300 dark:border-neutral-800">{i + 1}</div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="md:col-span-6 bg-neutral-50 dark:bg-neutral-900/30 border border-neutral-200 dark:border-neutral-900 rounded-xl p-6 sm:p-8 space-y-5">
          {/* Project Name */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2 font-medium">Project Name</label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 stroke-neutral-500" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h6l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/>
              </svg>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="my-app"
                className="w-full bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-md pl-9 pr-3 py-2 text-sm outline-none focus:border-neutral-400 dark:focus:border-neutral-600 focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition-all text-neutral-900 dark:text-neutral-200"
              />
            </div>
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
                  className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                    selectedLang === lang && !search
                      ? "border-neutral-200 bg-neutral-100 text-neutral-950"
                      : "border-neutral-300 bg-neutral-50 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:text-neutral-200"
                  }`}
                >
                  <span dangerouslySetInnerHTML={{ __html: LANG_LOGOS[lang] }} />
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
              className="w-full bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-md pl-8 pr-8 py-2 text-xs outline-none focus:border-neutral-400 dark:focus:border-neutral-600 transition-all text-neutral-900 dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
            />
            {search && (
              <button type="button" onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300 text-xs">x</button>
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
                      onClick={() => { setFramework(option.id); setSearch(""); setSelectedLang(option.lang); if (!option.dockerSupported) setDocker(false); }}
                      className={`flex items-center gap-2.5 rounded-md border px-3 py-2.5 text-sm transition-all text-left ${
                        isSelected
                          ? "border-neutral-200 bg-neutral-100 text-neutral-950 font-medium"
                          : "border-neutral-300 bg-neutral-50 text-neutral-700 hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:border-neutral-700"
                      }`}
                    >
                      <span
                        className={`shrink-0 w-5 h-5 flex items-center justify-center rounded-sm ${isSelected ? "bg-neutral-200" : "bg-neutral-200 dark:bg-neutral-800"}`}
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
              {DATABASES.map(({ id: option }) => {
                const isSelected = database === option;
                const dbIcons: Record<Database, React.ReactNode> = {
                  none:     <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 14.14 14.14"/></svg>,
                  postgres: <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="#4169E1"><path d="M23.5594 14.7228a.5269.5269 0 0 0-.0563-.1191c-.139-.2632-.4768-.3418-1.0074-.2321-1.6533.3411-2.2935.1312-2.5256-.0191 1.342-2.0482 2.445-4.522 3.0411-6.8297.2714-1.0507.7982-3.5237.1222-4.7316a1.5641 1.5641 0 0 0-.1509-.235C21.6931.9086 19.8007.0248 17.5099.0005c-1.4947-.0158-2.7705.3461-3.1161.4794a9.449 9.449 0 0 0-.5159-.0816 8.044 8.044 0 0 0-1.3114-.1278c-1.1822-.0184-2.2038.2642-3.0498.8406-.8573-.3211-4.7888-1.645-7.2219.0788C.9359 2.1526.3086 3.8733.4302 6.3043c.0409.818.5069 3.334 1.2423 5.7436.4598 1.5065.9387 2.7019 1.4334 3.582.553.9942 1.1259 1.5933 1.7143 1.7895.4474.1491 1.1327.1441 1.8581-.7279.8012-.9635 1.5903-1.8258 1.9446-2.2069.4351.2355.9064.3625 1.39.3772a.0569.0569 0 0 0 .0004.0041 11.0312 11.0312 0 0 0-.2472.3054c-.3389.4302-.4094.5197-1.5002.7443-.3102.064-1.1344.2339-1.1464.8115-.0025.1224.0329.2309.0919.3268.2269.4231.9216.6097 1.015.6331 1.3345.3335 2.5044.092 3.3714-.6787-.017 2.231.0775 4.4174.3454 5.0874.2212.5529.7618 1.9045 2.4692 1.9043.2505 0 .5263-.0291.8296-.0941 1.7819-.3821 2.5557-1.1696 2.855-2.9059.1503-.8707.4016-2.8753.5388-4.1012.0169-.0703.0357-.1207.057-.1362.0007-.0005.0697-.0471.4272.0307a.3673.3673 0 0 0 .0443.0068l.2539.0223.0149.001c.8468.0384 1.9114-.1426 2.5312-.4308.6438-.2988 1.8057-1.0323 1.5951-1.6698z"/></svg>,
                  mysql:    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="#4479A1"><path d="M16.405 5.501c-.115 0-.193.014-.274.033v.013h.014c.054.104.146.18.214.273.054.107.1.214.154.32l.014-.015c.094-.066.14-.172.14-.333-.04-.047-.046-.094-.08-.14-.04-.067-.126-.1-.18-.153zM5.77 18.695h-.927a50.854 50.854 0 00-.27-4.41h-.008l-1.41 4.41H2.45l-1.4-4.41h-.01a72.892 72.892 0 00-.195 4.41H0c.055-1.966.192-3.81.41-5.53h1.15l1.335 4.064h.008l1.347-4.064h1.095c.242 2.015.384 3.86.428 5.53zm4.017-4.08c-.378 2.045-.876 3.533-1.492 4.46-.482.716-1.01 1.073-1.583 1.073-.153 0-.34-.046-.566-.138v-.494c.11.017.24.026.386.026.268 0 .483-.075.647-.222.197-.18.295-.382.295-.605 0-.155-.077-.47-.23-.944L6.23 14.615h.91l.727 2.36c.164.536.233.91.205 1.123.4-1.064.678-2.227.835-3.483zm12.325 4.08h-2.63v-5.53h.885v4.85h1.745zm-3.32.135l-1.016-.5c.09-.076.177-.158.255-.25.433-.506.648-1.258.648-2.253 0-1.83-.718-2.746-2.155-2.746-.704 0-1.254.232-1.65.697-.43.508-.646 1.256-.646 2.245 0 .972.19 1.686.574 2.14.35.41.877.615 1.583.615.264 0 .506-.033.725-.098l1.325.772.36-.622zM15.5 17.588c-.225-.36-.337-.94-.337-1.736 0-1.393.424-2.09 1.27-2.09.443 0 .77.167.977.5.224.362.336.936.336 1.723 0 1.404-.424 2.108-1.27 2.108-.445 0-.77-.167-.978-.5z"/></svg>,
                  sqlite:   <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="#003B57"><path d="M21.678.521c-1.032-.92-2.28-.55-3.513.544a8.71 8.71 0 0 0-.547.535c-2.109 2.237-4.066 6.38-4.674 9.544.237.48.422 1.093.544 1.561a13.044 13.044 0 0 1 .164.703s-.019-.071-.096-.296l-.05-.146a1.689 1.689 0 0 0-.033-.08c-.138-.32-.518-.995-.686-1.289-.143.423-.27.818-.376 1.176.484.884.778 2.4.778 2.4s-.025-.099-.147-.442c-.107-.303-.644-1.244-.772-1.464-.217.804-.304 1.346-.226 1.478.152.256.296.698.422 1.186.286 1.1.485 2.44.485 2.44l.017.224a22.41 22.41 0 0 0 .056 2.748c.095 1.146.273 2.13.5 2.657l.155-.084c-.334-1.038-.47-2.399-.41-3.967.09-2.398.642-5.29 1.661-8.304 1.723-4.55 4.113-8.201 6.3-9.945-1.993 1.8-4.692 7.63-5.5 9.788-.904 2.416-1.545 4.684-1.931 6.857.666-2.037 2.821-2.912 2.821-2.912s1.057-1.304 2.292-3.166c-.74.169-1.955.458-2.362.629-.6.251-.762.337-.762.337s1.945-1.184 3.613-1.72C21.695 7.9 24.195 2.767 21.678.521m-18.573.543A1.842 1.842 0 0 0 1.27 2.9v16.608a1.84 1.84 0 0 0 1.835 1.834h9.418a22.953 22.953 0 0 1-.052-2.707c-.006-.062-.011-.141-.016-.2a27.01 27.01 0 0 0-.473-2.378c-.121-.47-.275-.898-.369-1.057-.116-.197-.098-.31-.097-.432 0-.12.015-.245.037-.386a9.98 9.98 0 0 1 .234-1.045l.217-.028c-.017-.035-.014-.065-.031-.097l-.041-.381a32.8 32.8 0 0 1 .382-1.194l.2-.019c-.008-.016-.01-.038-.018-.053l-.043-.316c.63-3.28 2.587-7.443 4.8-9.791.066-.069.133-.128.198-.194Z"/></svg>,
                  mongodb:  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="#47A248"><path d="M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.888 9.884l.07.05A73.49 73.49 0 0111.91 24h.481c.114-1.032.284-2.056.51-3.07.417-.296.604-.463.85-.693a11.342 11.342 0 003.639-8.464c.01-.814-.103-1.662-.197-2.218zm-5.336 8.195s0-8.291.275-8.29c.213 0 .49 10.695.49 10.695-.381-.045-.765-1.76-.765-2.405z"/></svg>,
                  redis:    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="#FF4438"><path d="M22.71 13.145c-1.66 2.092-3.452 4.483-7.038 4.483-3.203 0-4.397-2.825-4.48-5.12.701 1.484 2.073 2.685 4.214 2.63 4.117-.133 6.94-3.852 6.94-7.239 0-4.05-3.022-6.972-8.268-6.972-3.752 0-8.4 1.428-11.455 3.685C2.59 6.937 3.885 9.958 4.35 9.626c2.648-1.904 4.748-3.13 6.784-3.744C8.12 9.244.886 17.05 0 18.425c.1 1.261 1.66 4.648 2.424 4.648.232 0 .431-.133.664-.365a100.49 100.49 0 0 0 5.54-6.765c.222 3.104 1.748 6.898 6.014 6.898 3.819 0 7.604-2.756 9.33-8.965.2-.764-.73-1.361-1.261-.73zm-4.349-5.013c0 1.959-1.926 2.922-3.685 2.922-.941 0-1.664-.247-2.235-.568 1.051-1.592 2.092-3.225 3.21-4.973 1.972.334 2.71 1.43 2.71 2.619z"/></svg>,
                  mssql:    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="#CC2927"><path d="M0 2.036C0 .91.91 0 2.036 0h19.928C23.09 0 24 .91 24 2.036v19.928C24 23.09 23.09 24 21.964 24H2.036A2.036 2.036 0 0 1 0 21.964V2.036zm5.858 14.999l.84-1.354L4.77 13.29l1.956-1.494-2.185-1.453L6.74 8.8l-2.29-1.529L6.8 5.843H4.113v11.192zm3.047 0h2.296V5.843H8.905zm3.693 0h2.297V5.843h-2.297zm6.588-5.568c0 3.105-1.327 5.568-4.292 5.568h-.994V5.843h.994c2.965 0 4.292 2.463 4.292 5.624z"/></svg>,
                };
                const dbLabel = DATABASES.find((d) => d.id === option)!.label;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => { setDatabase(option); if (option === "none" && (auth === "lucia" || auth === "nextauth" || auth === "betterauth")) setAuth("none"); }}
                    className={`flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-xs transition-all ${
                      isSelected ? "border-neutral-200 bg-neutral-100 text-neutral-950 font-medium" : "border-neutral-300 bg-neutral-50 text-neutral-700 hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:border-neutral-700"
                    }`}
                  >
                    {dbIcons[option]}
                    {dbLabel}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Auth */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2 font-medium">Auth</label>
            <div className="grid grid-cols-3 gap-2">
              {AUTHS.map(({ id: option }) => {
                const isSelected = auth === option;
                const authIcons: Record<Auth, React.ReactNode> = {
                  none:     <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 14.14 14.14"/></svg>,
                  lucia:    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>,
                  jwt:      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
                  nextauth: <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
                  betterauth: <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>,
                };
                const authLabel = AUTHS.find((a) => a.id === option)!.label;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleAuthChange(option)}
                    className={`flex items-center justify-center gap-1.5 rounded-md border px-2 py-2 text-xs transition-all ${
                      isSelected ? "border-neutral-200 bg-neutral-100 text-neutral-950 font-medium" : "border-neutral-300 bg-neutral-50 text-neutral-700 hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:border-neutral-700"
                    }`}
                  >
                    {authIcons[option]}
                    {authLabel}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Docker */}
          {dockerAvailable && (
            <label className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={docker}
                onChange={(e) => setDocker(e.target.checked)}
                className="w-3.5 h-3.5 rounded accent-neutral-900 dark:accent-neutral-100"
              />
              Include Dockerfile + docker-compose.yml
            </label>
          )}

          {/* Download */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-md bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-white text-sm font-semibold py-3 transition-all disabled:opacity-50 active:scale-[0.98]"
          >
            <svg className="w-4 h-4 shrink-0 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 6h12a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z"/><path d="M5 12h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1Z"/><path d="M4 18h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1Z"/>
            </svg>
            {loading ? "Generating ZIP..." : "Download Starter Zip"}
          </button>

          {/* CLI */}
          <div className="border-t border-neutral-200 dark:border-neutral-900 pt-4">
            <p className="block text-xs uppercase tracking-wider text-neutral-500 mb-2 font-medium">Or initialize via terminal</p>
            <div className="flex items-center bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-md p-2 pl-3 font-mono text-[10px] text-neutral-700 dark:text-neutral-300 overflow-hidden">
              <span className="text-neutral-500 mr-2 shrink-0">$</span>
              <span className="flex-1 overflow-x-auto whitespace-nowrap pr-2 select-all">{cliCommand}</span>
              <button
                type="button"
                onClick={handleCopy}
                className="ml-2 px-2.5 py-1.5 rounded bg-neutral-200 border border-neutral-300 text-neutral-700 hover:bg-neutral-300 hover:text-neutral-900 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white text-[10px] font-sans transition-all shrink-0"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 dark:bg-red-950/30 dark:border-red-900/50 rounded-md">
              <p className="text-xs text-red-600 dark:text-red-400 font-medium">{error}</p>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-neutral-200 dark:border-neutral-900 px-6 py-6 sm:px-12 text-center text-xs text-neutral-600">
        <p>SkipInit {new Date().getFullYear()}. Starter templates clean of prompts.</p>
      </footer>
    </div>
  );
}
