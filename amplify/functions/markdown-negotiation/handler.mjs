/**
 * Lambda handler for Accept: text/markdown content negotiation.
 *
 * CloudFront calls this Lambda via a Function URL as the distribution origin.
 * The Lambda:
 *   1. Inspects the Accept header.
 *   2. If Accept: text/markdown → rewrites the URI to the .md equivalent
 *      (same logic as the retired handler.js CloudFront Function).
 *   3. Fetches the resolved URI from the Amplify origin (AMPLIFY_ORIGIN env var).
 *   4. Returns the full response (status, headers, body) back to CloudFront.
 *
 * For all other requests the URI is forwarded to Amplify unchanged.
 *
 * URI rewrite logic mirrors plugins/serve-markdown.js exactly.
 * Keep in sync if LLMS_INDEX_ROUTES, SECTION_ALIASES, or toPermalink() change.
 *
 * Monitor this function:
 *   Logs:    CloudWatch → /aws/lambda/docs-markdown-negotiation
 *   Console: AWS Lambda → docs-markdown-negotiation → Monitor tab
 */

const AMPLIFY_ORIGIN = process.env.AMPLIFY_ORIGIN;

/**
 * Resolve the target URI for a request that wants Markdown.
 * Mirrors the rewrite logic in the retired handler.js CloudFront Function.
 *
 * Returns the original URI unchanged if no rewrite applies (pass-through cases).
 *
 * @param {string} uri
 * @returns {string}
 */
function resolveMarkdownUri(uri) {
  // Already a raw .md or .txt file — no rewrite needed.
  if (uri.endsWith('.md') || uri.endsWith('.txt')) {
    return uri;
  }

  // Content-addressed static assets and images — no Markdown equivalents.
  if (uri.includes('/assets/') || uri.includes('/img/')) {
    return uri;
  }

  // Well-known endpoints (MCP discovery, etc.) — not Markdown.
  if (uri.startsWith('/.well-known/')) {
    return uri;
  }

  // Common root-level static files with explicit extensions.
  const rootFiles = [
    '/sitemap.xml',
    '/robots.txt',
    '/opensearch.xml',
    '/favicon.ico',
    '/manifest.json',
  ];
  if (rootFiles.includes(uri)) {
    return uri;
  }

  // Any URI whose last segment contains a dot → has a file extension.
  const lastSegment = uri.split('/').at(-1) ?? '';
  if (lastSegment.includes('.')) {
    return uri;
  }

  // Site root → llms.txt (no .md file is written for the bare root in postBuild).
  if (uri === '/' || uri === '') {
    return '/llms.txt';
  }

  // Everything else: strip trailing slash, append .md.
  // Mirrors postBuild: path.join(outDir, relPath + '.md')
  return uri.endsWith('/') ? uri.slice(0, -1) + '.md' : uri + '.md';
}

/**
 * @param {import('aws-lambda').APIGatewayProxyEventV2} event
 * @returns {Promise<import('aws-lambda').APIGatewayProxyResultV2>}
 */
export const handler = async (event) => {
  const rawPath = event.rawPath || '/';
  const qs = event.rawQueryString ? `?${event.rawQueryString}` : '';
  const incomingHeaders = event.headers || {};
  const method = event.requestContext?.http?.method ?? 'GET';

  // Determine whether this request wants Markdown.
  const accept = incomingHeaders['accept'] || '';
  const wantsMarkdown = accept.includes('text/markdown');

  // Resolve the target path.
  const targetPath = wantsMarkdown ? resolveMarkdownUri(rawPath) : rawPath;

  // Fetch from Amplify.
  //
  // Host must be the Amplify origin domain — Amplify Hosting routes requests
  // by the Host header (SNI). Sending the viewer's host (docs.cartesi.io or
  // the CloudFront domain) would cause Amplify to return a 403.
  //
  // Accept-Encoding is set to identity so Amplify returns uncompressed bytes.
  // CloudFront applies its own compression layer; if Amplify compressed the
  // response, Lambda would base64-encode the compressed bytes and CloudFront
  // would serve a garbled response.
  const url = `https://${AMPLIFY_ORIGIN}${targetPath}${qs}`;
  let response;
  try {
    response = await fetch(url, {
      method,
      headers: {
        host: AMPLIFY_ORIGIN,
        accept: accept || '*/*',
        'accept-encoding': 'identity',
        'user-agent': incomingHeaders['user-agent'] || 'Lambda/MarkdownNegotiation',
      },
      // Do not auto-follow redirects — return them to CloudFront so the
      // viewer's client handles them normally.
      redirect: 'manual',
    });
  } catch (err) {
    console.error(JSON.stringify({ event: 'fetch_error', url, error: err.message }));
    return {
      statusCode: 502,
      headers: { 'content-type': 'text/plain' },
      body: 'Bad Gateway: upstream fetch failed',
      isBase64Encoded: false,
    };
  }

  // Forward most response headers. Strip hop-by-hop headers that must not
  // be forwarded (they are connection-level and invalid in HTTP/2+).
  const hopByHop = new Set([
    'connection', 'keep-alive', 'proxy-authenticate',
    'proxy-authorization', 'te', 'trailer', 'transfer-encoding', 'upgrade',
  ]);
  const responseHeaders = {};
  for (const [key, value] of response.headers.entries()) {
    if (!hopByHop.has(key.toLowerCase())) {
      responseHeaders[key] = value;
    }
  }

  // Determine whether the body is text or binary to decide on base64 encoding.
  const contentType = response.headers.get('content-type') || '';
  const isText =
    contentType.startsWith('text/') ||
    contentType.includes('application/json') ||
    contentType.includes('application/xml') ||
    contentType.includes('application/javascript') ||
    contentType.includes('+json') ||
    contentType.includes('+xml');

  let body;
  let isBase64Encoded;

  if (isText) {
    body = await response.text();
    isBase64Encoded = false;
  } else {
    const buffer = await response.arrayBuffer();
    body = Buffer.from(buffer).toString('base64');
    isBase64Encoded = true;
  }

  console.log(JSON.stringify({
    method,
    rawPath,
    targetPath,
    wantsMarkdown,
    status: response.status,
    contentType,
  }));

  return {
    statusCode: response.status,
    headers: responseHeaders,
    body,
    isBase64Encoded,
  };
};
