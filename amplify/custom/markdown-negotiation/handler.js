// CloudFront Function — runtime: cloudfront-js-2.0
//
// Purpose: Accept: text/markdown content negotiation for docs.cartesi.io.
//
// In production, Amplify Hosting serves static files from S3 through a
// managed CloudFront distribution that does not expose edge-function hooks.
// This function runs on a SECOND CloudFront distribution that sits in front
// of the Amplify origin.  When a request carries `Accept: text/markdown`,
// the URI is rewritten to the pre-built `.md` file that serve-markdown.js
// writes at build time (see plugins/serve-markdown.js → postBuild).
//
// The rewrite logic here is a direct mirror of:
//   • toPermalink()       in serve-markdown.js  (URI → permalink mapping)
//   • LLMS_INDEX_ROUTES   in serve-markdown.js  (root → llms.txt redirect)
//   • SECTION_ALIASES     in serve-markdown.js  (virtual alias URLs)
//
// If the plugin's URL-handling logic changes, this file MUST be updated to
// match.  See amplify/custom/markdown-negotiation/README.md for details.

function handler(event) {
  var request = event.request;
  var uri = request.uri;
  var headers = request.headers;

  // ── 1. Only intercept requests that explicitly want Markdown ────────────────
  //
  // Mirrors makeMarkdownHandler() in serve-markdown.js:
  //   const wantsMarkdown = (req.headers['accept'] ?? '').includes('text/markdown');
  //
  // CloudFront Functions represent headers as objects: { value: '...' }.
  // Guard against a missing Accept header before reading .value.
  var accept = (headers['accept'] && headers['accept'].value) || '';
  if (accept.indexOf('text/markdown') === -1) {
    return request;
  }

  // ── 2. Pass through: paths that are already direct file requests ────────────
  //
  // These should never be rewritten regardless of the Accept header.  All
  // checks are ordered cheapest-first (string operations before iteration).

  // (a) Already a raw .md or .txt file — client is requesting the file directly.
  //     No rewrite needed; the file already exists at this path in the build.
  if (uri.endsWith('.md') || uri.endsWith('.txt')) {
    return request;
  }

  // (b) Content-addressed static assets and image directories.
  //     These files have no Markdown equivalents.
  //     Mirrors the customHttp.yml patterns for **/assets/** and common /img/.
  if (uri.indexOf('/assets/') !== -1 || uri.indexOf('/img/') !== -1) {
    return request;
  }

  // (c) Agent-facing well-known endpoints (MCP discovery, etc.).
  //     These are JSON/text endpoints; rewriting them to .md would be wrong.
  //     The URI-extension check below wouldn't catch /.well-known/mcp (no ext),
  //     so we handle the whole prefix explicitly.
  if (uri.startsWith('/.well-known/')) {
    return request;
  }

  // (d) Common root-level static files (all have extensions, but named explicitly
  //     for clarity and future-proofing if the extension check ever changes).
  var rootFiles = [
    '/sitemap.xml',
    '/robots.txt',
    '/opensearch.xml',
    '/favicon.ico',
    '/manifest.json',
  ];
  for (var i = 0; i < rootFiles.length; i++) {
    if (uri === rootFiles[i]) {
      return request;
    }
  }

  // (e) Any URI whose last path segment contains a dot → has a file extension.
  //     e.g. /js/main.abc123.js, /style.d3f2a.css, /logo.svg, /data.json
  //     Split on '/' and inspect the final segment (which may be empty if the
  //     URI ends with '/'; in that case lastSegment is '' which has no dot,
  //     so this check correctly falls through to the rewrite logic below).
  var segments = uri.split('/');
  var lastSegment = segments[segments.length - 1];
  if (lastSegment.indexOf('.') !== -1) {
    return request;
  }

  // ── 3. Site root: rewrite to /llms.txt ──────────────────────────────────────
  //
  // Mirrors LLMS_INDEX_ROUTES in serve-markdown.js:
  //   const LLMS_INDEX_ROUTES = new Set(['/', '/cartesi-rollups/2.0/']);
  //
  // '/' has no .md file in the build output — postBuild skips the bare root:
  //   const relPath = permalink.replace(/^\//, '').replace(/\/$/, '');
  //   if (!relPath) continue;  // ← root is skipped here
  //
  // Agents hitting the root with Accept: text/markdown receive the full
  // navigation index (llms.txt) rather than a missing-file error.
  //
  // '/cartesi-rollups/2.0/' IS written as cartesi-rollups/2.0.md (with
  // llms.txt content — it's also in LLMS_INDEX_ROUTES), so the normal
  // path-append rewrite in step 4 handles it correctly without a special case.
  if (uri === '/' || uri === '') {
    request.uri = '/llms.txt';
    return request;
  }

  // ── 4. Everything else: append .md ──────────────────────────────────────────
  //
  // Mirrors toPermalink() in serve-markdown.js (the wantsMarkdown branch) and
  // the postBuild file-layout convention:
  //
  //   postBuild:
  //     const relPath = permalink.replace(/^\//, '').replace(/\/$/, '');
  //     const mdOutputPath = path.join(outDir, relPath + '.md');
  //
  //   toPermalink (wantsMarkdown):
  //     return reqPath.endsWith('/') ? reqPath : reqPath + '/';
  //     → then the server reads urlMap.get(permalink)
  //
  // The .md files live at outDir/<segments-without-slashes>.md, so:
  //   /foo/bar/  →  outDir/foo/bar.md  →  served at /foo/bar.md
  //   /foo/bar   →  outDir/foo/bar.md  →  served at /foo/bar.md
  //
  // Strip a trailing slash before appending .md so both forms map to the
  // same file path.
  //
  // SECTION_ALIASES note: /cartesi-rollups/overview/ has a real file at
  // cartesi-rollups/overview.md (written by the SECTION_ALIASES loop in
  // postBuild), so the normal rewrite here → /cartesi-rollups/overview.md
  // hits that file without any special case needed.
  if (uri.endsWith('/')) {
    request.uri = uri.slice(0, -1) + '.md';
  } else {
    request.uri = uri + '.md';
  }

  return request;
}
