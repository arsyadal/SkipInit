import { NextRequest, NextResponse } from "next/server";
import { readdir, readFile, stat } from "fs/promises";
import path from "path";
import Mustache from "mustache";
import { ZipArchive } from "archiver";

const TEMPLATES_ROOT = path.join(process.cwd(), "templates");

interface GenerateRequest {
  projectName: string;
  framework: string;
  database: "none" | "postgres" | "sqlite" | "mongodb";
  auth: "none" | "lucia" | "jwt";
}

const FRAMEWORK_TEMPLATES: Record<string, { dir: string; label: string }> = {
  nextjs:     { dir: "nextjs-base",  label: "Next.js" },
  vite:       { dir: "vite-react",   label: "Vite + React" },
  astro:      { dir: "astro",        label: "Astro" },
  sveltekit:  { dir: "sveltekit",    label: "SvelteKit" },
  remix:      { dir: "remix",        label: "Remix" },
  hono:       { dir: "hono",         label: "Hono" },
  express:    { dir: "express",      label: "Express" },
  nestjs:     { dir: "nestjs",       label: "NestJS" },
  nuxt:       { dir: "nuxt",         label: "Nuxt.js" },
  angular:    { dir: "angular",      label: "Angular" },
  vue:        { dir: "vue",          label: "Vue.js" },
  fastapi:    { dir: "fastapi",      label: "FastAPI" },
  django:     { dir: "django",       label: "Django" },
  flask:      { dir: "flask",        label: "Flask" },
  go:         { dir: "go-fiber",     label: "Go (Fiber)" },
  rust:       { dir: "rust-axum",    label: "Rust (Axum)" },
  laravel:    { dir: "laravel",      label: "Laravel" },
  symfony:    { dir: "symfony",      label: "Symfony" },
  springboot: { dir: "springboot",   label: "Spring Boot" },
  dotnet:     { dir: "dotnet",       label: ".NET Core" },
  rails:      { dir: "rails",        label: "Ruby on Rails" },
  deno:       { dir: "deno",         label: "Deno" },
  phoenix:    { dir: "phoenix",      label: "Phoenix" },
};

interface TemplateFile {
  relativePath: string;
  content: string;
}

async function collectFiles(dir: string, base = dir): Promise<TemplateFile[]> {
  const entries = await readdir(dir);
  const files: TemplateFile[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stats = await stat(fullPath);

    if (stats.isDirectory()) {
      files.push(...(await collectFiles(fullPath, base)));
    } else {
      const content = await readFile(fullPath, "utf-8");
      const relativePath = path
        .relative(base, fullPath)
        .replace(/\.tmpl$/, "")
        .split(path.sep)
        .join("/");
      files.push({ relativePath, content });
    }
  }

  return files;
}

function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "my-app";
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as GenerateRequest;

  const template = FRAMEWORK_TEMPLATES[body.framework];

  if (!template) {
    return NextResponse.json(
      { error: `Framework "${body.framework}" is not supported yet.` },
      { status: 400 }
    );
  }

  const projectName = body.projectName?.trim() || "my-app";
  const hasPostgres = body.database === "postgres";
  const hasSqlite = body.database === "sqlite";
  const hasMongodb = body.database === "mongodb";
  const hasLucia = body.auth === "lucia";
  const hasJwt = body.auth === "jwt";

  if (hasLucia && !hasPostgres && !hasSqlite) {
    return NextResponse.json(
      { error: "Lucia Auth requires PostgreSQL or SQLite database." },
      { status: 400 }
    );
  }

  const view = {
    projectName,
    projectNameSlug: slugify(projectName),
    hasPostgres,
    hasSqlite,
    hasMongodb,
    frameworkLabel: template.label,
    databaseLabel: body.database === "postgres" ? "PostgreSQL" : body.database === "sqlite" ? "SQLite" : body.database === "mongodb" ? "MongoDB" : "None",
    hasLucia,
    hasJwt,
  };

  const baseFiles = await collectFiles(path.join(TEMPLATES_ROOT, template.dir));
  const moduleFiles: TemplateFile[] = [];

  if (body.database !== "none") {
    const dbDir = path.join(TEMPLATES_ROOT, "modules", `${body.database}-${body.framework}`);
    const generalDbDir = path.join(TEMPLATES_ROOT, "modules", body.database);
    try {
      moduleFiles.push(...(await collectFiles(dbDir)));
    } catch {
      const isTsFramework = ["nextjs", "vite", "astro", "sveltekit", "remix", "hono"].includes(body.framework);
      if (isTsFramework) {
        try {
          moduleFiles.push(...(await collectFiles(generalDbDir)));
        } catch {
          // No files
        }
      }
    }
  }

  if (body.auth !== "none") {
    const authDir = path.join(TEMPLATES_ROOT, "modules", `${body.auth}-${body.framework}`);
    const generalAuthDir = path.join(TEMPLATES_ROOT, "modules", body.auth);
    try {
      moduleFiles.push(...(await collectFiles(authDir)));
    } catch {
      const isTsFramework = ["nextjs", "vite", "astro", "sveltekit", "remix", "hono"].includes(body.framework);
      if (isTsFramework) {
        try {
          moduleFiles.push(...(await collectFiles(generalAuthDir)));
        } catch {
          // No files
        }
      }
    }
  }

  const archive = new ZipArchive({ zlib: { level: 9 } });
  const chunks: Buffer[] = [];

  archive.on("data", (chunk) => chunks.push(chunk));

  const zipDone = new Promise<void>((resolve, reject) => {
    archive.on("end", resolve);
    archive.on("error", reject);
  });

  for (const file of [...baseFiles, ...moduleFiles]) {
    const rendered = Mustache.render(file.content, view);
    archive.append(rendered, { name: `${view.projectNameSlug}/${file.relativePath}` });
  }

  await archive.finalize();
  await zipDone;

  const zipBuffer = Buffer.concat(chunks);

  return new NextResponse(zipBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${view.projectNameSlug}.zip"`,
      "Content-Length": String(zipBuffer.length),
    },
  });
}
