// @ts-check
'use strict';

/**
 * Docusaurus plugin: serve-markdown
 *
 * Makes every documentation page available as raw Markdown in two ways:
 *   1. Appending .md to a URL
 *        /cartesi-rollups/2.0/development/building-an-application.md
 *   2. Sending Accept: text/markdown header
 *        → server returns Markdown instead of HTML
 *
 * Also generates .md files alongside HTML during `docusaurus build`,
 * so the static build supports .md URL access too.
 *
 * Additionally serves and generates llms-full.txt — a single file containing
 * all documentation pages concatenated, for LLM consumption.
 *
 * Docusaurus v3 lifecycle used:
 *   - allContentLoaded  – receives allContent from every plugin; used to build
 *                         the permalink → source-file map.
 *   - configureWebpack  – attaches Express middleware to the webpack-dev-server.
 *                         webpack-merge v5 chains functions, so Docusaurus's own
 *                         setupMiddlewares (HMR / eval-source-map) is preserved.
 *   - postBuild         – writes .md files and llms-full.txt into the output dir.
 */

const path = require('path');
const fs = require('fs');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Resolve a Docusaurus "@site/" source path to an absolute filesystem path.
 *
 * @param {string} siteDir
 * @param {string} source   e.g. "@site/docs/foo.md"
 * @returns {string}
 */
function resolveSource(siteDir, source) {
  if (source.startsWith('@site/')) {
    return path.join(siteDir, source.slice('@site/'.length));
  }
  return source;
}

/**
 * Walk the allContent object and collect every { permalink → absFilePath }
 * pair from all @docusaurus/plugin-content-docs instances.
 *
 * allContent shape in Docusaurus v3:
 *   allContent[pluginName][pluginId] = plugin.content
 *
 * For plugin-content-docs, plugin.content is:
 *   { loadedVersions: [ { docs: [ { permalink, source, … } ] } ] }
 *
 * @param {Record<string, Record<string, any>>} allContent
 * @param {string} siteDir
 * @returns {Map<string, string>}  permalink → absolute source path
 */
function buildUrlMap(allContent, siteDir) {
  const map = new Map();

  for (const instancesById of Object.values(allContent)) {
    for (const pluginContent of Object.values(instancesById)) {
      const versions = pluginContent?.loadedVersions;
      if (!Array.isArray(versions)) continue;

      for (const version of versions) {
        const docs = version?.docs;
        if (!Array.isArray(docs)) continue;

        for (const doc of docs) {
          const { permalink, source } = doc;
          if (!permalink || !source) continue;
          // Normalize: always store with trailing slash so toPermalink lookups
          // are consistent regardless of how Docusaurus emits the permalink.
          const normalised = permalink.endsWith('/') ? permalink : permalink + '/';
          map.set(normalised, resolveSource(siteDir, source));
        }
      }
    }
  }

  return map;
}

/**
 * Determine the permalink to look up for this request, or return null if
 * this request should not be handled by the markdown plugin.
 *
 * @param {string}  reqPath        e.g. "/some/page.md" or "/some/page/"
 * @param {boolean} wantsMarkdown  true when Accept: text/markdown was sent
 * @returns {string|null}
 */
function toPermalink(reqPath, wantsMarkdown) {
  if (reqPath.endsWith('.md')) {
    // /some/page.md  →  /some/page/
    // /some/dir/.md  →  /some/dir/  (don't double the trailing slash)
    const stripped = reqPath.slice(0, -'.md'.length);
    return stripped.endsWith('/') ? stripped : stripped + '/';
  }
  if (wantsMarkdown) {
    return reqPath.endsWith('/') ? reqPath : reqPath + '/';
  }
  return null;
}

/**
 * Inject an llms.txt discovery directive into a markdown string.
 * Mirrors the HTML <link rel="alternate" type="text/plain" href="/llms.txt"> pattern
 * so that agents parsing raw markdown can discover the site index.
 *
 * The directive is inserted as an HTML comment immediately after the YAML
 * frontmatter block (if one exists) or at the very top of the file.
 *
 * @param {string} content   raw markdown source
 * @param {string} siteUrl   e.g. "https://docs.cartesi.io"
 * @returns {string}
 */
function injectLlmsDirective(content, siteUrl) {
  const directive = `> For the complete documentation index, see [llms.txt](${siteUrl}/llms.txt)`;
  // If the file starts with YAML frontmatter, insert after the closing ---
  if (content.startsWith('---')) {
    const end = content.indexOf('\n---', 3);
    if (end !== -1) {
      const afterFrontmatter = end + 4; // past the closing ---
      return content.slice(0, afterFrontmatter) + '\n\n' + directive + '\n' + content.slice(afterFrontmatter);
    }
  }
  return directive + '\n\n' + content;
}

/**
 * Permalinks whose .md form should serve llms.txt instead of their own page
 * content.  Agents hitting these routes get a full navigation index rather
 * than a single page.
 *
 * '/'                      — site root; no doc source exists anyway.
 * '/cartesi-rollups/2.0/'  — versioned docs entry point; the overview page
 *                            is still reachable via the SECTION_ALIASES alias
 *                            at /cartesi-rollups/overview.md.
 */
const LLMS_INDEX_ROUTES = new Set(['/', '/cartesi-rollups/2.0/']);

/**
 * Virtual .md aliases: a permalink that has no real Docusaurus route but
 * should serve the content of another permalink's source file.
 *
 * '/cartesi-rollups/overview/' → '/cartesi-rollups/2.0/'
 *   Gives agents a stable URL for the v2.0 overview page now that
 *   /cartesi-rollups/2.0.md is reserved for the llms.txt index.
 */
const SECTION_ALIASES = new Map([
  ['/cartesi-rollups/overview/', '/cartesi-rollups/2.0/'],
]);

/**
 * Build the Express request handler that serves raw Markdown for individual pages.
 *
 * @param {Map<string, string>} urlMap
 * @param {string} siteDir
 * @param {string} siteUrl
 * @returns {import('express').RequestHandler}
 */
function makeMarkdownHandler(urlMap, siteDir, siteUrl) {
  return function markdownHandler(req, res, next) {
    const wantsMarkdown = (req.headers['accept'] ?? '').includes('text/markdown');
    const permalink = toPermalink(req.path, wantsMarkdown);
    if (!permalink) return next();

    // Permalinks in LLMS_INDEX_ROUTES serve llms.txt (with host rewriting)
    // so agents get a navigation index rather than a single page.
    if (LLMS_INDEX_ROUTES.has(permalink)) {
      try {
        let content = fs.readFileSync(path.join(siteDir, 'static', 'llms.txt'), 'utf8');
        const reqOrigin = `${req.protocol}://${req.headers['host']}`;
        if (reqOrigin && reqOrigin !== siteUrl) {
          content = content.split(siteUrl).join(reqOrigin);
        }
        res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        return res.send(content);
      } catch {
        return next();
      }
    }

    // Virtual aliases: resolve to the source file of another permalink.
    const aliasTarget = SECTION_ALIASES.get(permalink);
    const sourceFile = aliasTarget
      ? urlMap.get(aliasTarget)
      : urlMap.get(permalink);

    if (!sourceFile) return next();

    let content;
    try {
      content = fs.readFileSync(sourceFile, 'utf8');
    } catch {
      return next();
    }

    const reqOrigin = `${req.protocol}://${req.headers['host']}`;
    content = injectLlmsDirective(content, reqOrigin || siteUrl);

    res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    return res.send(content);
  };
}

/**
 * Concatenate all documentation pages into a single string for llms-full.txt.
 * Pages are sorted by permalink for consistent ordering.
 * Each page is preceded by a URL header so LLMs can anchor content to its source.
 *
 * @param {Map<string, string>} urlMap
 * @param {string} siteUrl   e.g. "https://docs.cartesi.io"
 * @returns {string}
 */
function buildLlmsFullContent(urlMap, siteUrl) {
  const parts = [];
  const sortedEntries = [...urlMap.entries()].sort(([a], [b]) => a.localeCompare(b));

  for (const [permalink, sourcePath] of sortedEntries) {
    let content;
    try {
      content = fs.readFileSync(sourcePath, 'utf8');
    } catch {
      continue;
    }
    const pageUrl = siteUrl.replace(/\/$/, '') + permalink;
    parts.push(`\n\n---\n\nSource: ${pageUrl}\n\n${content.trim()}`);
  }

  return parts.join('');
}

/**
 * Build the Express request handler that serves /llms.txt dynamically in dev,
 * rewriting the hardcoded production domain to match the incoming request host.
 * This allows tools/scorers running against a tunnel or staging URL to discover
 * and test pages on that host rather than the production domain.
 *
 * @param {string} siteDir
 * @param {string} siteUrl   canonical production URL (e.g. "https://docs.cartesi.io")
 * @returns {import('express').RequestHandler}
 */
function makeLlmsTxtHandler(siteDir, siteUrl) {
  return function llmsTxtHandler(req, res, next) {
    if (req.path !== '/llms.txt') return next();

    let content;
    try {
      content = fs.readFileSync(path.join(siteDir, 'static', 'llms.txt'), 'utf8');
    } catch {
      return next();
    }

    // Rewrite the canonical domain to the host of this request so that
    // scanners/scorers (e.g. running against an ngrok tunnel) can follow
    // the links and test markdown serving on the correct origin.
    const reqOrigin = `${req.protocol}://${req.headers['host']}`;
    if (reqOrigin && reqOrigin !== siteUrl) {
      content = content.split(siteUrl).join(reqOrigin);
    }

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    return res.send(content);
  };
}

/**
 * Build the Express request handler that serves llms-full.txt dynamically in dev.
 *
 * @param {Map<string, string>} urlMap
 * @param {string} siteUrl
 * @returns {import('express').RequestHandler}
 */
function makeLlmsFullHandler(urlMap, siteUrl) {
  return function llmsFullHandler(req, res, next) {
    if (req.path !== '/llms-full.txt') return next();

    const content = buildLlmsFullContent(urlMap, siteUrl);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    return res.send(content);
  };
}

// ---------------------------------------------------------------------------
// Plugin factory
// ---------------------------------------------------------------------------

/**
 * @param {import('@docusaurus/types').LoadContext} context
 * @returns {import('@docusaurus/types').Plugin}
 */
module.exports = function serveMarkdownPlugin(context) {
  const { siteDir, siteConfig } = context;
  const siteUrl = siteConfig.url || 'https://docs.cartesi.io';

  // Shared mutable map populated in allContentLoaded and consumed in
  // configureWebpack + postBuild.  allContentLoaded always runs before both.
  const urlMap = new Map();

  return {
    name: 'docusaurus-plugin-serve-markdown',

    // ── 1. Build URL → source file map (Docusaurus v3 hook) ─────────────────
    //
    // In Docusaurus v3, allContent is available only in allContentLoaded, not
    // in contentLoaded.  allContentLoaded runs after every plugin's
    // contentLoaded, and before configureWebpack / postBuild.
    //
    async allContentLoaded({ allContent }) {
      const discovered = buildUrlMap(allContent, siteDir);
      for (const [permalink, absPath] of discovered) {
        urlMap.set(permalink, absPath);
      }
    },

    // ── 2. Dev server: intercept .md / Accept:text/markdown requests ─────────
    //
    // configureWebpack returns a partial webpack config that is merged with the
    // base config using webpack-merge.  In webpack-merge v5, functions are
    // CHAINED, so Docusaurus's own setupMiddlewares (which adds the HMR /
    // eval-source-map middleware) still runs alongside ours.
    //
    // We attach our handlers to devServer.app directly instead of pushing into
    // the middlewares array, which keeps ordering concerns simpler and avoids
    // any interference with Docusaurus's own middleware list.
    //
    configureWebpack(_config, isServer) {
      if (isServer) return {};

      const markdownHandler = makeMarkdownHandler(urlMap, siteDir, siteUrl);
      const llmsFullHandler = makeLlmsFullHandler(urlMap, siteUrl);
      const llmsTxtHandler = makeLlmsTxtHandler(siteDir, siteUrl);

      return {
        devServer: {
          setupMiddlewares(middlewares, devServer) {
            // devServer.app is the underlying Express application.
            // Middleware registered here runs before webpack-dev-server's
            // built-in static-file / HMR routes.
            devServer.app.use(llmsTxtHandler);   // dynamic /llms.txt (host-rewritten)
            devServer.app.use(llmsFullHandler);  // dynamic /llms-full.txt
            devServer.app.use(markdownHandler);  // .md URLs + Accept: text/markdown
            return middlewares; // leave existing middlewares untouched
          },
        },
      };
    },

    // ── 3. Production build: write .md files and llms-full.txt ───────────────
    async postBuild({ outDir }) {
      let written = 0;
      let skipped = 0;

      // Write individual .md files next to HTML pages
      for (const [permalink, sourcePath] of urlMap.entries()) {
        // /some/page/  →  outDir/some/page.md
        const relPath = permalink.replace(/^\//, '').replace(/\/$/, '');
        if (!relPath) continue; // skip the bare root

        const mdOutputPath = path.join(outDir, relPath + '.md');
        const outputDir = path.dirname(mdOutputPath);

        try {
          fs.mkdirSync(outputDir, { recursive: true });

          // LLMS_INDEX_ROUTES: write llms.txt content instead of the page.
          if (LLMS_INDEX_ROUTES.has(permalink)) {
            const llmsTxt = fs.readFileSync(path.join(siteDir, 'static', 'llms.txt'), 'utf8');
            fs.writeFileSync(mdOutputPath, llmsTxt, 'utf8');
            written++;
            continue;
          }

          if (!fs.existsSync(sourcePath)) { skipped++; continue; }
          const raw = fs.readFileSync(sourcePath, 'utf8');
          fs.writeFileSync(mdOutputPath, injectLlmsDirective(raw, siteUrl), 'utf8');
          written++;
        } catch {
          skipped++;
        }
      }

      // Write virtual alias .md files (e.g. cartesi-rollups/overview.md).
      for (const [aliasPermalink, realPermalink] of SECTION_ALIASES) {
        const sourcePath = urlMap.get(realPermalink);
        if (!sourcePath || !fs.existsSync(sourcePath)) continue;
        const relPath = aliasPermalink.replace(/^\//, '').replace(/\/$/, '');
        const mdOutputPath = path.join(outDir, relPath + '.md');
        try {
          fs.mkdirSync(path.dirname(mdOutputPath), { recursive: true });
          const raw = fs.readFileSync(sourcePath, 'utf8');
          fs.writeFileSync(mdOutputPath, injectLlmsDirective(raw, siteUrl), 'utf8');
        } catch {
          // Non-fatal: alias files are convenience routes
        }
      }

      // Write llms-full.txt — all documentation concatenated
      try {
        const llmsFullContent = buildLlmsFullContent(urlMap, siteUrl);
        fs.writeFileSync(path.join(outDir, 'llms-full.txt'), llmsFullContent, 'utf8');
      } catch {
        // Non-fatal: llms-full.txt is a convenience file
      }

      // Use Docusaurus's logger so the message integrates with build output
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const logger = require('@docusaurus/logger').default;
      logger.info(
        `[serve-markdown] wrote ${written} .md files and llms-full.txt to build output` +
          (skipped ? ` (${skipped} skipped)` : ''),
      );
    },
  };
};
