# SkipInit

> Save your tokens for real code. Stop asking AI models to setup the same configuration boilerplate over and over.

SkipInit is a clean, minimal project starter downloader. It provides battle-tested templates for various tech stacks, ready to unzip and run. Avoid wasting your AI context window/chat tokens on recreating the same boilerplate configs.

## Features

- **Step-by-step Filtering**: Instantly filters frameworks by language (JavaScript/TypeScript, Python, Go, Rust).
- **Interactive UI**: Clean, desktop-first, developer-friendly interface.
- **Dynamic Generator API**: Downloads a custom-tailored ZIP on the fly.
- **Terminal CLI Installer**: Copy a single command from the web and paste it to automatically download, extract, and run `npm install`.

## Supported Stacks

### Languages & Frameworks
- **JavaScript / TypeScript**: Next.js, Vite + React, Astro, SvelteKit, Remix, Hono API
- **Python**: FastAPI
- **Go**: Go (Fiber)
- **Rust**: Rust (Axum)

### Databases
- PostgreSQL, SQLite, MongoDB, None

### Authentication
- Lucia Auth, JWT, None

## Development

First, install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Architecture

- Frontend: Next.js + React 19 + Tailwind CSS v4
- Endpoint `/api/generate`: Post request handler that compiles template modules using Mustache and zips them with `archiver`.
- Endpoint `/api/cli`: Exposes the dynamic shell installation script.
