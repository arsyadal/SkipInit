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

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  SkipInit: Initializing project..."
echo "  Name:      $PROJECT_NAME"
echo "  Stack:     $FRAMEWORK | $DATABASE | $AUTH"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Create temp download name
ZIP_FILE="\${PROJECT_NAME}_tmp.zip"

echo "→ Downloading template..."
curl -s -X POST -H "Content-Type: application/json" \\
  -d "{\\"projectName\\":\\"$PROJECT_NAME\\",\\"framework\\":\\"$FRAMEWORK\\",\\"database\\":\\"$DATABASE\\",\\"auth\\":\\"$AUTH\\"}" \\
  -o "$ZIP_FILE" "${apiURL}"

echo "→ Extracting files..."
unzip -q -o "$ZIP_FILE"
rm "$ZIP_FILE"

# Change directory
cd "$PROJECT_NAME"

if [ -f "package.json" ]; then
  echo "→ Running npm install..."
  npm install
fi

echo "✓ Done! Project is ready in './$PROJECT_NAME'"
echo "  See $PROJECT_NAME/README.md for setup and run instructions"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
`;

  return new NextResponse(script, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
