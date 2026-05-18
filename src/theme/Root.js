import React from 'react';

/**
 * Visually-hidden LLM discovery directive, rendered into every page's HTML body.
 *
 * - Links to /llms.txt so agents scanning the DOM find the documentation index.
 * - Mentions .md URL support so agents know how to fetch raw markdown.
 * - Uses the standard SR-only clip pattern: visible to parsers, invisible to users.
 * - Server-rendered by Docusaurus SSG — present in static HTML, not JS-injected.
 */
const srOnly = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0,0,0,0)',
  whiteSpace: 'nowrap',
  border: 0,
};

export default function Root({ children }) {
  return (
    <>
      <div style={srOnly}>
        <a href="/llms.txt">llms.txt — complete Cartesi documentation index</a>
        {'. '}
        Append <code>.md</code> to any page URL for raw Markdown (e.g.{' '}
        <a href="/cartesi-rollups/2.0/development/building-an-application.md">
          /cartesi-rollups/2.0/development/building-an-application.md
        </a>
        ).
      </div>
      {children}
    </>
  );
}
