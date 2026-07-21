import { NextRequest, NextResponse } from "next/server";
import { readdir, readFile, stat } from "fs/promises";
import path from "path";
import Mustache from "mustache";
import { ZipArchive } from "archiver";
import { DATABASES, AUTHS, getFramework, getDatabaseLabel, getAuth, DatabaseId, AuthId } from "@/lib/registry";

const TEMPLATES_ROOT = path.join(process.cwd(), "templates");

interface GenerateRequest {
  projectName: string;
  framework: string;
  database: DatabaseId;
  auth: AuthId;
  docker?: boolean;
}

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

  const template = getFramework(body.framework);

  if (!template) {
    return NextResponse.json(
      { error: `Framework "${body.framework}" is not supported yet.` },
      { status: 400 }
    );
  }

  if (!DATABASES.some((d) => d.id === body.database) || !AUTHS.some((a) => a.id === body.auth)) {
    return NextResponse.json(
      { error: "Invalid database or auth option." },
      { status: 400 }
    );
  }

  const projectName = body.projectName?.trim() || "my-app";
  const hasPostgres = body.database === "postgres";
  const hasSqlite = body.database === "sqlite";
  const hasMongodb = body.database === "mongodb";
  const hasMysql = body.database === "mysql";
  const hasRedis = body.database === "redis";
  const hasMssql = body.database === "mssql";
  const hasLucia = body.auth === "lucia";
  const hasJwt = body.auth === "jwt";
  const hasNextauth = body.auth === "nextauth";
  const hasBetterAuth = body.auth === "betterauth";

  const authDef = getAuth(body.auth);
  if (authDef?.requiresDatabase && !authDef.requiresDatabase.includes(body.database)) {
    return NextResponse.json(
      { error: `${authDef.label} Auth requires ${authDef.requiresDatabase.map(getDatabaseLabel).join(" or ")} database.` },
      { status: 400 }
    );
  }

  const view = {
    projectName,
    projectNameSlug: slugify(projectName),
    hasPostgres,
    hasSqlite,
    hasMongodb,
    hasMysql,
    hasRedis,
    hasMssql,
    frameworkLabel: template.label,
    databaseLabel: getDatabaseLabel(body.database),
    hasLucia,
    hasJwt,
    hasNextauth,
    hasBetterAuth,
  };

  const baseFiles = await collectFiles(path.join(TEMPLATES_ROOT, template.dir));
  const moduleFiles: TemplateFile[] = [];

  if (body.database !== "none") {
    const dbDir = path.join(TEMPLATES_ROOT, "modules", `${body.database}-${body.framework}`);
    const generalDbDir = path.join(TEMPLATES_ROOT, "modules", body.database);
    try {
      moduleFiles.push(...(await collectFiles(dbDir)));
    } catch {
      if (template.supportsGenericModules) {
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
      if (template.supportsGenericModules) {
        try {
          moduleFiles.push(...(await collectFiles(generalAuthDir)));
        } catch {
          // No files
        }
      }
    }
  }

  if (body.docker && template.dockerSupported) {
    const dockerDir = path.join(TEMPLATES_ROOT, "modules", `docker-${body.framework}`);
    try {
      moduleFiles.push(...(await collectFiles(dockerDir)));
    } catch {
      // No files
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
