# Markdown Negotiation — CloudFront Content Negotiation Layer

## What this does and why

Docusaurus builds `.md` files alongside every HTML page at build time
(`plugins/serve-markdown.js → postBuild`).  Accessing `/foo/bar.md`
already works in production.  What does NOT work is the `Accept: text/markdown`
convention — sending that header to `docs.cartesi.io/foo/bar` should return
the Markdown source instead of the HTML page, but Amplify Hosting's managed
CloudFront distribution exposes no hooks where we can intercept and rewrite
the request.

This construct inserts a second CloudFront distribution in front of the
Amplify origin.  A CloudFront Function runs at **viewer-request** — before
the cache lookup and before the request reaches the origin — and rewrites the
URI to the `.md` path when the request carries `Accept: text/markdown`.
Everything else passes through untouched.

The function logic is a direct mirror of `toPermalink()`, `LLMS_INDEX_ROUTES`,
and the `postBuild` file layout in `plugins/serve-markdown.js`.  Production
behavior after this deploy matches dev-server behavior exactly.

## Request flow

```
browser / agent
    │
    ▼  HTTPS — docs.cartesi.io (DNS CNAME → this distribution)
┌────────────────────────────────────────┐
│  Our CloudFront distribution           │
│                                        │
│  viewer-request CloudFront Function:   │
│    Accept: text/markdown?              │
│      yes → rewrite URI to .md path    │
│      no  → pass through               │
└────────────────────────────────────────┘
    │
    ▼  HTTPS — main.<id>.amplifyapp.com
┌────────────────────────────────────────┐
│  Amplify-managed CloudFront + S3       │
│  (pre-built static files)              │
└────────────────────────────────────────┘
```

## Environment variables

Set these in **Amplify Console → App Settings → Environment Variables** before
the first deploy.  The build will fail loudly at CDK synthesis if any are
missing.

| Variable | Example value | Description |
|---|---|---|
| `AMPLIFY_DEFAULT_DOMAIN` | `main.d3fvsd1wbz3mbt.amplifyapp.com` | Amplify default domain (no `https://`) — the origin this distribution proxies |
| `DOCS_CERT_ARN` | `arn:aws:acm:us-east-1:123456789012:certificate/abc-…` | ARN of the ACM certificate covering `DOCS_DOMAIN`; **must be in us-east-1** |
| `DOCS_DOMAIN` | `docs.cartesi.io` | Public hostname served by this distribution |

## One-time human operations

These steps happen outside the repo and are performed once, before the first
deploy.

### 1. Request the ACM certificate (us-east-1)

CloudFront requires ACM certificates in `us-east-1` regardless of where the
rest of your infrastructure lives.

1. Open **AWS Certificate Manager → us-east-1**.
2. Request a public certificate for `docs.cartesi.io` (and optionally
   `*.docs.cartesi.io`).
3. Use DNS validation.  Add the CNAME records ACM provides to your DNS zone.
4. Wait for the certificate status to reach **Issued**.
5. Copy the certificate ARN → set as `DOCS_CERT_ARN` in Amplify Console.

### 2. Set environment variables in Amplify Console

Add the three variables from the table above under
**App Settings → Environment Variables**.
Variables set here are available during CDK synthesis and are not committed to
the repo.

### 3. Push and let the Amplify pipeline deploy

After setting the env vars, push a commit (or trigger a manual rebuild).
Amplify will run `npx ampx pipeline-deploy` (or equivalent) to synthesise and
deploy the CDK stack alongside the Docusaurus build.

At the end of a successful deploy, the CloudFormation output
`markdownNegotiationDistributionDomain` contains the new CloudFront domain
name (e.g. `d1abc123xyz.cloudfront.net`).  This is the value your DNS CNAME
must point to.

### 4. Detach the current Amplify custom domain (optional interim step)

If `docs.cartesi.io` is currently configured as a custom domain directly in
Amplify Console, Amplify manages the DNS CNAME itself.  Before cutting over to
the new distribution you must either:

- Remove the custom domain from Amplify Console so you can point the CNAME
  manually, **or**
- Use a different subdomain for the new distribution during testing, only
  cutting over once verified.

### 5. Update DNS

Point the `docs.cartesi.io` CNAME to the new CloudFront distribution domain
(`d1abc123xyz.cloudfront.net`).  TTL changes propagate within your zone's
configured TTL (recommend 300 s during the cutover window).

## Verification checklist

Run these curl commands against the **new CloudFront domain** (before DNS
cutover) to validate the distribution, then again against `docs.cartesi.io`
after DNS cutover.

Replace `DIST_DOMAIN` with the value from the CloudFormation output.

```bash
DIST_DOMAIN=d1abc123xyz.cloudfront.net

# 1. HTML page — no Accept header → HTML, 200
curl -s -o /dev/null -w "%{http_code} %{content_type}\n" \
  "https://$DIST_DOMAIN/cartesi-rollups/2.0/development/building-an-application"

# 2. Markdown via Accept header — should return text/markdown, 200
curl -s -H "Accept: text/markdown" \
  "https://$DIST_DOMAIN/cartesi-rollups/2.0/development/building-an-application" \
  | head -5

# 3. Direct .md URL — must still work (no Accept header needed)
curl -s -I "https://$DIST_DOMAIN/cartesi-rollups/2.0/development/building-an-application.md" \
  | grep -i "content-type\|http/"

# 4. Site root with Accept: text/markdown → should return llms.txt content
curl -s -H "Accept: text/markdown" "https://$DIST_DOMAIN/" | head -3

# 5. /llms.txt direct — must pass through unchanged
curl -s -I "https://$DIST_DOMAIN/llms.txt" | grep -i "content-type\|http/"

# 6. Asset — must NOT be rewritten (Accept: text/markdown present, but /assets/ path)
curl -s -o /dev/null -w "%{http_code}\n" \
  -H "Accept: text/markdown" \
  "https://$DIST_DOMAIN/assets/js/main.abc123.js"

# 7. Cache header sanity — markdown response should have short TTL
curl -s -I -H "Accept: text/markdown" \
  "https://$DIST_DOMAIN/cartesi-rollups/2.0/development/building-an-application.md" \
  | grep -i "cache-control"
```

Expected outcomes:
- (1) `200 text/html`
- (2) First line is YAML frontmatter or `> For the complete documentation index…` directive
- (3) `content-type: text/markdown` (from customHttp.yml)
- (4) First line `# Cartesi Documentation` (llms.txt header)
- (5) `content-type: text/plain` and `200`
- (6) `200` (asset served, not rewritten to `.js.md`)
- (7) `cache-control: public, max-age=0, s-maxage=3500, must-revalidate`

## Rollback plan

The new distribution is additive — the Amplify-managed distribution and its
origin URL continue to work unchanged.

To roll back:

1. Repoint the DNS CNAME back to the Amplify custom domain CNAME
   (available in Amplify Console → Domain management).
2. DNS propagation takes effect within one TTL window (~5 min if you lowered
   TTL before cutover).
3. The CDK stack can be deleted afterwards via AWS Console → CloudFormation →
   `MarkdownNegotiationStack` → Delete.

No data is stored in the distribution.  Deletion has no permanent side-effects.

## Keeping handler.js in sync with serve-markdown.js

`handler.js` is a production mirror of the URL-handling logic in
`plugins/serve-markdown.js`.  Any change to the following in `serve-markdown.js`
requires a corresponding update to `handler.js`:

| serve-markdown.js | handler.js |
|---|---|
| `LLMS_INDEX_ROUTES` | step 3 (root → `/llms.txt`) |
| `SECTION_ALIASES` | step 4 comment; file created by postBuild so no code change needed unless a new alias has no postBuild file |
| `toPermalink()` URI normalisation | step 4 (strip trailing `/`, append `.md`) |
| `postBuild` file layout (`relPath + '.md'`) | step 4 (identical mapping) |

When in doubt: the test in the verification checklist above exercises the main
cases.  Run them against a staging deployment whenever either file changes.
