/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const TEST_DIR = path.join(__dirname, "tmp-smoke-test");
const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

const TEST_CASES = [
  { framework: "nextjs", database: "postgres", auth: "lucia" },
  { framework: "vite", database: "mysql", auth: "jwt" },
  { framework: "astro", database: "sqlite", auth: "none" },
  { framework: "sveltekit", database: "mongodb", auth: "none" },
  { framework: "remix", database: "redis", auth: "none" },
  { framework: "hono", database: "mssql", auth: "none" },
  { framework: "express", database: "postgres", auth: "jwt" },
  { framework: "nestjs", database: "mysql", auth: "none" },
  { framework: "fastify", database: "postgres", auth: "jwt" },
  { framework: "solid", database: "none", auth: "none" },
  { framework: "htmx", database: "none", auth: "none" },
  { framework: "quarkus", database: "postgres", auth: "none" },
  { framework: "nuxt", database: "sqlite", auth: "none" },
  { framework: "angular", database: "none", auth: "none" },
  { framework: "vue", database: "none", auth: "none" },
  { framework: "deno", database: "postgres", auth: "jwt" },
  { framework: "fastapi", database: "sqlite", auth: "none" },
  { framework: "django", database: "postgres", auth: "none" },
  { framework: "flask", database: "mongodb", auth: "none" },
  { framework: "go", database: "mongodb", auth: "none" },
  { framework: "rust", database: "mysql", auth: "none" },
  { framework: "laravel", database: "sqlite", auth: "none" },
  { framework: "symfony", database: "postgres", auth: "none" },
  { framework: "springboot", database: "postgres", auth: "none" },
  { framework: "dotnet", database: "postgres", auth: "none" },
  { framework: "blazor", database: "postgres", auth: "none" },
  { framework: "rails", database: "postgres", auth: "none" },
  { framework: "phoenix", database: "postgres", auth: "none" }
];

async function runTest() {
  console.log("Starting SkipInit Smoke Tests for all 29 frameworks...");
  
  if (fs.existsSync(TEST_DIR)) {
    fs.rmSync(TEST_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(TEST_DIR);

  let passed = true;

  for (const tc of TEST_CASES) {
    const projName = `test-${tc.framework}`;
    const zipPath = path.join(TEST_DIR, `${projName}.zip`);
    const extractPath = path.join(TEST_DIR, projName);

    console.log(`Testing framework: [${tc.framework}]`);

    try {
      const response = await fetch(`${BASE_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName: projName,
          framework: tc.framework,
          database: tc.database,
          auth: tc.auth
        })
      });

      if (!response.ok) {
        throw new Error(`API returned HTTP ${response.status}: ${await response.text()}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      fs.writeFileSync(zipPath, Buffer.from(arrayBuffer));

      execSync(`unzip -q -o ${zipPath} -d ${TEST_DIR}`);
      
      if (!fs.existsSync(extractPath)) {
        throw new Error(`Extracted folder not found`);
      }

      const files = fs.readdirSync(extractPath);
      if (files.length === 0) {
        throw new Error(`Folder is empty`);
      }

      if (tc.framework === "django" && !fs.existsSync(path.join(extractPath, "manage.py"))) throw new Error("Missing manage.py");
      if (tc.framework === "laravel" && !fs.existsSync(path.join(extractPath, "composer.json"))) throw new Error("Missing composer.json");
      if (tc.framework === "rust" && !fs.existsSync(path.join(extractPath, "Cargo.toml"))) throw new Error("Missing Cargo.toml");
      if (tc.framework === "go" && !fs.existsSync(path.join(extractPath, "go.mod"))) throw new Error("Missing go.mod");
      if (tc.framework === "springboot" && !fs.existsSync(path.join(extractPath, "pom.xml"))) throw new Error("Missing pom.xml");
      if (tc.framework === "blazor" && !fs.existsSync(path.join(extractPath, "App.razor"))) throw new Error("Missing App.razor");

      fs.rmSync(zipPath, { force: true });
      fs.rmSync(extractPath, { recursive: true, force: true });
    } catch (err) {
      console.error(`Failed: [${tc.framework}] - ${err.message}`);
      passed = false;
    }
  }

  fs.rmSync(TEST_DIR, { recursive: true, force: true });

  if (passed) {
    console.log("\nAll 29 frameworks generated successfully!");
    process.exit(0);
  } else {
    console.error("\nSome framework tests failed.");
    process.exit(1);
  }
}

runTest();
