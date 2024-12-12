/**
 * @typedef {import('mdast').Code} Code
 * @typedef {import('mdast').InlineCode} InlineCode
 * @typedef {import('mdast').Root} Root
 * @typedef {import('mdast').Text} Text
 * @typedef {import('unified').Plugin} Plugin
 *
 * @typedef Options
 *   Configuration (optional).
 * @property {string} [prefix]
 *   Some option.
 */

import { visit } from "unist-util-visit";

import escapeStringRegexp from "escape-string-regexp";

//const plugin: Plugin<[Options], Root> = (options) => {
/** @type {import('unified').Plugin<[Options?], Root>} */
const plugin = (options) => {
  const replacements = require("../../replacements.json");
  const prefix = options?.prefix ?? "%";

  // Attaches prefix to the start of the string.
  const attachPrefix = (str) => (prefix || "") + str;

  // Removes prefix from the start of the string.
  const stripPrefix = (str) =>
    prefix ? str.replace(RegExp(`^${prefix}`), "") : str;

  // RegExp to find any replacement keys.
  const regexp = RegExp(
    "(" +
      Object.keys(replacements)
        .map((key) => escapeStringRegexp(attachPrefix(key)))
        .join("|") +
      ")",
    "g"
  );

  const replacer = (_match, name) => replacements[stripPrefix(name)];
  const replace = (str) => str.replace(regexp, replacer);
  return async (tree) =>
    visit(tree, ["text", "inlineCode", "code"], (node) => {
      node.value = replace(node.value);
    });
};

export default plugin;
