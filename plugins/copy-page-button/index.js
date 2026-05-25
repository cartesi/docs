const path = require("path");
const basePlugin = require("docusaurus-plugin-copy-page-button");

/**
 * Local wrapper around docusaurus-plugin-copy-page-button.
 * Uses a vendored client bundle that opens serve-markdown .md URLs
 * instead of in-browser blob URLs.
 */
module.exports = function copyPageButtonPlugin(context, options) {
  const plugin = basePlugin(context, options);

  return {
    ...plugin,
    getClientModules() {
      return [path.resolve(__dirname, "client.js")];
    },
  };
};
