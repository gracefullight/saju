const DEFAULT_LOCAL_BRIDGE_URL = "http://localhost:8787/cafe24/oauth/callback";

function buildHtml(params: {
  code?: string | null;
  error?: string | null;
  state?: string | null;
  localBridgeUrl: string;
}) {
  const { code, error, state, localBridgeUrl } = params;
  const statusMessage = error
    ? `Authorization failed: ${error}`
    : "Authorization code received. Completing login...";
  const codeParam = code ? `code=${encodeURIComponent(code)}` : "";
  const stateParam = state ? `&state=${encodeURIComponent(state)}` : "";
  const redirectTarget = code ? `${localBridgeUrl}?${codeParam}${stateParam}` : localBridgeUrl;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Cafe24 OAuth</title>
  </head>
  <body>
    <p>${statusMessage}</p>
    <p>If you are not redirected, open this link:</p>
    <p><a href="${redirectTarget}">${redirectTarget}</a></p>
    <script>
      ${code ? `window.location.replace(${JSON.stringify(redirectTarget)});` : ""}
    </script>
  </body>
</html>`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const localBridgeUrl =
    process.env.CAFE24_OAUTH_LOCAL_BRIDGE_URL?.trim() || DEFAULT_LOCAL_BRIDGE_URL;

  const html = buildHtml({ code, state, error, localBridgeUrl });
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
