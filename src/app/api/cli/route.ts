import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const host = request.headers.get("host") || "localhost:3000";
  const protocol = request.headers.get("x-forwarded-proto") || "http";
  const apiURL = `${protocol}://${host}/api/generate`;

  const script = `#!/bin/bash
set -e

PROJECT_NAME=\${1:-my-app}
FRAMEWORK=\${2:-nextjs}
DATABASE=\${3:-none}
AUTH=\${4:-none}

# Slugify to match the folder name inside the generated zip
SLUG=$(echo "$PROJECT_NAME" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+|-+$//g')
SLUG=\${SLUG:-my-app}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  SkipInit: Initializing project..."
echo "  Name:      $PROJECT_NAME"
echo "  Stack:     $FRAMEWORK | $DATABASE | $AUTH"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Create temp download name
ZIP_FILE="\${SLUG}_tmp.zip"

echo "→ Downloading template..."
curl -sSf -X POST -H "Content-Type: application/json" \\
  -d "{\\"projectName\\":\\"$SLUG\\",\\"framework\\":\\"$FRAMEWORK\\",\\"database\\":\\"$DATABASE\\",\\"auth\\":\\"$AUTH\\"}" \\
  -o "$ZIP_FILE" "${apiURL}"

echo "→ Extracting files..."
unzip -q -o "$ZIP_FILE"
rm "$ZIP_FILE"

# Change directory
cd "$SLUG"

if [ -f "package.json" ]; then
  echo "→ Running npm install..."
  npm install
fi

echo "✓ Done! Project is ready in './$SLUG'"
echo "  See $SLUG/README.md for setup and run instructions"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
`;

  return new NextResponse(script, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
