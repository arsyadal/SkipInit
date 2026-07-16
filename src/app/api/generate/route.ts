import { NextRequest, NextResponse } from "next/server";
import { readdir, readFile, stat } from "fs/promises";
import path from "path";
import Mustache from "mustache";
import { ZipArchive } from "archiver";

const TEMPLATES_ROOT = path.join(process.cwd(), "templates");

interface GenerateRequest {
  projectName: string;
  framework: string;
  database: "none" | "postgres";
  auth: "none" | "lucia";
}

const SUPPORTED_FRAMEWORKS = new Set(["nextjs"]);

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

  if (!SUPPORTED_FRAMEWORKS.has(body.framework)) {
    return NextResponse.json(
      { error: `Framework "${body.framework}" is not supported yet.` },
      { status: 400 }
    );
  }

  const projectName = body.projectName?.trim() || "my-app";
  const hasPostgres = body.database === "postgres";
  const hasAuth = body.auth === "lucia";

  if (hasAuth && !hasPostgres) {
    return NextResponse.json(
      { error: "Lucia Auth requires a database. Please select PostgreSQL." },
      { status: 400 }
    );
  }

  const view = {
    projectName,
    projectNameSlug: slugify(projectName),
    hasPostgres,
    databaseLabel: hasPostgres ? "PostgreSQL" : "None",
    hasAuth,
  };

  const baseFiles = await collectFiles(path.join(TEMPLATES_ROOT, "nextjs-base"));
  const moduleFiles: TemplateFile[] = [];

  if (hasPostgres) {
    moduleFiles.push(...(await collectFiles(path.join(TEMPLATES_ROOT, "modules", "postgres"))));
  }
  if (hasAuth) {
    moduleFiles.push(...(await collectFiles(path.join(TEMPLATES_ROOT, "modules", "lucia-auth"))));
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
