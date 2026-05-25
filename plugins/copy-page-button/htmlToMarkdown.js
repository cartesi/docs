const TEXT_NODE = 3;
const ELEMENT_NODE = 1;
const DOCUMENT_NODE = 9;
const DOCUMENT_FRAGMENT_NODE = 11;

const SELECTORS_TO_REMOVE = [
  ".theme-edit-this-page",
  ".theme-last-updated",
  ".pagination-nav",
  ".theme-doc-breadcrumbs",
  ".theme-doc-footer",
  "button",
  ".copy-code-button",
  ".buttonGroup",
  ".clean-btn",
  ".theme-code-block-title",
  ".line-number",
];

const RAW_TEXT_TAGS = new Set(["script", "style", "textarea", "title"]);
const VOID_TAGS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

const cleanText = (text = "") => {
  return text
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\u00A0/g, " ")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\u00e2\u20ac\u2039/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

const decodeHtmlEntities = (value = "") => {
  return String(value).replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (entity, code) => {
    const lowerCode = code.toLowerCase();
    if (lowerCode === "amp") return "&";
    if (lowerCode === "lt") return "<";
    if (lowerCode === "gt") return ">";
    if (lowerCode === "quot") return '"';
    if (lowerCode === "apos") return "'";
    if (lowerCode === "nbsp") return " ";

    if (lowerCode.startsWith("#x")) {
      const codePoint = parseInt(lowerCode.slice(2), 16);
      try {
        return Number.isNaN(codePoint)
          ? entity
          : String.fromCodePoint(codePoint);
      } catch (error) {
        return entity;
      }
    }
    if (lowerCode.startsWith("#")) {
      const codePoint = parseInt(lowerCode.slice(1), 10);
      try {
        return Number.isNaN(codePoint)
          ? entity
          : String.fromCodePoint(codePoint);
      } catch (error) {
        return entity;
      }
    }
    return entity;
  });
};

const appendTextNode = (parent, data) => {
  if (!data) return;
  parent.children.push({
    type: "text",
    data: decodeHtmlEntities(data),
    parent,
  });
};

const parseAttributes = (source = "") => {
  const attrs = {};
  const attrPattern =
    /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let match;

  while ((match = attrPattern.exec(source))) {
    attrs[match[1]] = decodeHtmlEntities(
      match[2] ?? match[3] ?? match[4] ?? ""
    );
  }

  return attrs;
};

const parseTag = (source) => {
  const match = source.match(/^<\/?\s*([a-zA-Z][\w:-]*)\s*([\s\S]*?)\/?\s*>$/);
  if (!match) return null;

  const tagName = match[1].toLowerCase();
  const attrSource = match[2] || "";
  return {
    tagName,
    attrs: parseAttributes(attrSource),
    selfClosing: /\/\s*>$/.test(source) || VOID_TAGS.has(tagName),
  };
};

const parseHtmlToTree = (html) => {
  const root = {
    type: "root",
    children: [],
    parent: null,
  };
  const stack = [root];
  let index = 0;

  while (index < html.length) {
    const openIndex = html.indexOf("<", index);
    if (openIndex === -1) {
      appendTextNode(stack[stack.length - 1], html.slice(index));
      break;
    }

    appendTextNode(stack[stack.length - 1], html.slice(index, openIndex));

    if (html.startsWith("<!--", openIndex)) {
      const closeIndex = html.indexOf("-->", openIndex + 4);
      index = closeIndex === -1 ? html.length : closeIndex + 3;
      continue;
    }

    const closeIndex = html.indexOf(">", openIndex + 1);
    if (closeIndex === -1) {
      appendTextNode(stack[stack.length - 1], html.slice(openIndex));
      break;
    }

    const tagSource = html.slice(openIndex, closeIndex + 1);
    if (/^<\s*[!?]/.test(tagSource)) {
      index = closeIndex + 1;
      continue;
    }

    if (/^<\s*\//.test(tagSource)) {
      const closingTag = tagSource.match(/^<\s*\/\s*([a-zA-Z][\w:-]*)/);
      if (closingTag) {
        const tagName = closingTag[1].toLowerCase();
        for (let i = stack.length - 1; i > 0; i--) {
          if (stack[i].name === tagName) {
            stack.length = i;
            break;
          }
        }
      }
      index = closeIndex + 1;
      continue;
    }

    const parsedTag = parseTag(tagSource);
    if (!parsedTag) {
      appendTextNode(stack[stack.length - 1], tagSource);
      index = closeIndex + 1;
      continue;
    }

    const parent = stack[stack.length - 1];
    const node = {
      type: "tag",
      name: parsedTag.tagName,
      attribs: parsedTag.attrs,
      children: [],
      parent,
    };
    parent.children.push(node);

    if (RAW_TEXT_TAGS.has(parsedTag.tagName)) {
      const closingTag = `</${parsedTag.tagName}>`;
      const rawCloseIndex = html
        .toLowerCase()
        .indexOf(closingTag, closeIndex + 1);
      if (rawCloseIndex === -1) {
        appendTextNode(node, html.slice(closeIndex + 1));
        break;
      }
      appendTextNode(node, html.slice(closeIndex + 1, rawCloseIndex));
      index = rawCloseIndex + closingTag.length;
      continue;
    }

    if (!parsedTag.selfClosing) {
      stack.push(node);
    }
    index = closeIndex + 1;
  }

  return root;
};

const parseHtml = (html) => {
  if (typeof DOMParser !== "undefined") {
    return {
      root: new DOMParser().parseFromString(html, "text/html"),
      context: {},
    };
  }

  return {
    root: parseHtmlToTree(html),
    context: {},
  };
};

const normalizeInput = (input) => {
  if (typeof input === "string") {
    return parseHtml(input);
  }

  return {
    root: input,
    context: {},
  };
};

const isTextNode = (node) => {
  return node?.nodeType === TEXT_NODE || node?.type === "text";
};

const isElementNode = (node) => {
  return node?.nodeType === ELEMENT_NODE || node?.type === "tag";
};

const isContainerNode = (node) => {
  return (
    node?.nodeType === DOCUMENT_NODE ||
    node?.nodeType === DOCUMENT_FRAGMENT_NODE ||
    node?.type === "root"
  );
};

const getChildNodes = (node) => {
  return Array.from(node?.childNodes || node?.children || []);
};

const getTagName = (node) => {
  return (node?.tagName || node?.name || "").toLowerCase();
};

const getAttribute = (node, name) => {
  if (!node) return null;
  if (typeof node.getAttribute === "function") {
    return node.getAttribute(name);
  }
  return node.attribs?.[name] || null;
};

const getClassName = (node) => {
  const className = node?.className;
  if (typeof className === "string") {
    return className;
  }
  if (typeof className?.baseVal === "string") {
    return className.baseVal;
  }
  return getAttribute(node, "class") || "";
};

const textContentOf = (node) => {
  if (!node) return "";
  if (typeof node.textContent === "string") {
    return node.textContent;
  }
  if (isTextNode(node)) {
    return node.data || "";
  }
  return getChildNodes(node).map(textContentOf).join("");
};

const queryAll = (node, selector, context = {}) => {
  if (!node) return [];
  if (typeof node.querySelectorAll === "function") {
    return Array.from(node.querySelectorAll(selector));
  }
  if (context.$) {
    return context.$(node).find(selector).toArray();
  }
  return queryTree(node, selector);
};

const queryOne = (node, selector, context = {}) => {
  if (!node) return null;
  if (typeof node.querySelector === "function") {
    return node.querySelector(selector);
  }
  if (context.$) {
    return context.$(node).find(selector).get(0) || null;
  }
  return queryTree(node, selector)[0] || null;
};

const matchesSimpleSelector = (node, selector) => {
  if (!isElementNode(node)) return false;

  const attrMatch = selector.match(/^([a-zA-Z][\w:-]*)?\[([^\]=]+)(?:=([^\]]+))?\]$/);
  if (attrMatch) {
    const tagName = attrMatch[1];
    const attrName = attrMatch[2];
    if (tagName && getTagName(node) !== tagName.toLowerCase()) {
      return false;
    }
    return getAttribute(node, attrName) !== null;
  }

  const classMatch = selector.match(/^([a-zA-Z][\w:-]*)?\.([\w-]+)$/);
  if (classMatch) {
    const tagName = classMatch[1];
    const className = classMatch[2];
    if (tagName && getTagName(node) !== tagName.toLowerCase()) {
      return false;
    }
    return hasClass(node, className);
  }

  if (selector.startsWith(".")) {
    return hasClass(node, selector.slice(1));
  }

  return getTagName(node) === selector.toLowerCase();
};

const matchesSelectorChain = (node, selector) => {
  const parts = selector.split(/\s+/).filter(Boolean);
  let current = node;

  for (let i = parts.length - 1; i >= 0; i--) {
    if (i === parts.length - 1) {
      if (!matchesSimpleSelector(current, parts[i])) {
        return false;
      }
      current = current.parent;
      continue;
    }

    while (current && !matchesSimpleSelector(current, parts[i])) {
      current = current.parent;
    }
    if (!current) {
      return false;
    }
    current = current.parent;
  }

  return true;
};

const queryTree = (node, selector) => {
  const selectors = selector
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const results = [];

  const visit = (current) => {
    getChildNodes(current).forEach((child) => {
      if (
        isElementNode(child) &&
        selectors.some((item) => matchesSelectorChain(child, item))
      ) {
        results.push(child);
      }
      visit(child);
    });
  };

  visit(node);
  return results;
};

const cloneTree = (node, parent = null) => {
  if (isTextNode(node)) {
    return {
      type: "text",
      data: node.data || "",
      parent,
    };
  }

  const clone = {
    type: node.type,
    name: node.name,
    attribs: { ...(node.attribs || {}) },
    children: [],
    parent,
  };
  clone.children = getChildNodes(node).map((child) => cloneTree(child, clone));
  return clone;
};

const cloneNode = (node, context = {}) => {
  if (!node) return null;
  if (typeof node.cloneNode === "function") {
    return node.cloneNode(true);
  }
  if (context.$) {
    return context.$(node).clone().get(0) || null;
  }
  return cloneTree(node);
};

const removeNode = (node, context = {}) => {
  if (!node) return;
  if (typeof node.remove === "function") {
    node.remove();
    return;
  }
  if (context.$) {
    context.$(node).remove();
    return;
  }
  const siblings = node.parent?.children;
  if (Array.isArray(siblings)) {
    const index = siblings.indexOf(node);
    if (index !== -1) {
      siblings.splice(index, 1);
    }
  }
};

const hasClass = (node, className) => {
  if (node?.classList?.contains(className)) {
    return true;
  }
  return getClassName(node).split(/\s+/).includes(className);
};

const hasUserSelectNone = (node) => {
  if (node?.style?.userSelect === "none") {
    return true;
  }
  return /(?:^|;)\s*user-select\s*:\s*none\s*(?:;|$)/i.test(
    getAttribute(node, "style") || ""
  );
};

const joinChildren = (childResults) => {
  let children = "";
  for (let i = 0; i < childResults.length; i++) {
    const current = childResults[i];
    const previous = i > 0 ? childResults[i - 1] : "";

    if (current) {
      if (
        previous &&
        !previous.match(/[\s\n]$/) &&
        !current.match(/^[\s\n]/) &&
        previous.trim() &&
        current.trim()
      ) {
        children += " ";
      }
      children += current;
    }
  }

  return children;
};

const processNode = (node, context = {}) => {
  if (isTextNode(node)) {
    return cleanText(textContentOf(node));
  }

  if (isContainerNode(node)) {
    return joinChildren(getChildNodes(node).map((child) => processNode(child, context)));
  }

  if (isElementNode(node)) {
    const tag = getTagName(node);
    const childResults = getChildNodes(node).map((child) =>
      processNode(child, context)
    );
    const children = joinChildren(childResults);

    switch (tag) {
      case "h1":
        return `\n# ${children.trim()}\n\n`;
      case "h2":
        return `\n## ${children.trim()}\n\n`;
      case "h3":
        return `\n### ${children.trim()}\n\n`;
      case "h4":
        return `\n#### ${children.trim()}\n\n`;
      case "h5":
        return `\n##### ${children.trim()}\n\n`;
      case "h6":
        return `\n###### ${children.trim()}\n\n`;
      case "p":
        return children.trim() ? `${children.trim()}\n\n` : "\n";
      case "strong":
      case "b":
        return `**${children}**`;
      case "em":
      case "i":
        return `*${children}*`;
      case "code":
        if (getTagName(node.parentElement || node.parent) === "pre") {
          return children;
        }
        return `\`${children
          .replace(/[\u200B-\u200D\uFEFF]/g, "")
          .replace(/\u00A0/g, " ")
          .trim()}\``;
      case "pre": {
        const codeElement = queryOne(node, "code", context);
        if (codeElement) {
          const codeClassName = getClassName(codeElement);
          const preClassName = getClassName(node);
          const language =
            (codeClassName.match(/language-(\w+)/) ||
              preClassName.match(/language-(\w+)/) ||
              codeClassName.match(/hljs-(\w+)/) ||
              codeClassName.match(/prism-(\w+)/) ||
              [])[1] || "";

          let codeContent = "";

          try {
            const originalContent =
              getAttribute(codeElement, "data-code") ||
              getAttribute(node, "data-code") ||
              getAttribute(codeElement, "data-raw");

            if (originalContent) {
              codeContent = originalContent;
            } else {
              const codeLines = queryAll(
                codeElement,
                "span[data-line], .token-line, .code-line, .highlight-line",
                context
              );
              if (codeLines.length > 0) {
                codeContent = codeLines.map(textContentOf).join("\n");
              } else {
                const codeLineDivs = queryAll(codeElement, "div", context);
                if (codeLineDivs.length > 0) {
                  codeContent = codeLineDivs
                    .map((lineDiv) => {
                      const lineClassName = getClassName(lineDiv);
                      if (
                        lineClassName.includes("codeLineNumber") ||
                        lineClassName.includes("LineNumber") ||
                        lineClassName.includes("line-number") ||
                        hasUserSelectNone(lineDiv)
                      ) {
                        return null;
                      }
                      return textContentOf(lineDiv);
                    })
                    .filter((line) => line !== null)
                    .join("\n");
                } else {
                  let rawText = textContentOf(codeElement);
                  rawText = rawText.replace(/^\d+\s+/gm, "");
                  rawText = rawText.replace(/^Copy$/gm, "");
                  rawText = rawText.replace(/^Copied!$/gm, "");
                  rawText = rawText.replace(/^\s*Copy to clipboard\s*$/gm, "");

                  codeContent = rawText;
                }
              }
            }

            codeContent = codeContent
              .replace(/[\u200B-\u200D\uFEFF]/g, "")
              .replace(/\u00A0/g, " ")
              .trim();
            codeContent = codeContent.replace(/^\n+|\n+$/g, "");
          } catch (error) {
            codeContent = textContentOf(codeElement);
          }

          return `\n\`\`\`${language}\n${codeContent}\n\`\`\`\n\n`;
        }
        return `\n\`\`\`\n${children}\n\`\`\`\n\n`;
      }
      case "ul":
        return `\n${children}`;
      case "ol": {
        const items = queryAll(node, "li", context);
        return (
          "\n" +
          items
            .map(
              (item, index) =>
                `${index + 1}. ${processNode(item, context)
                  .replace(/^- /, "")
                  .trim()}\n`
            )
            .join("")
        );
      }
      case "li":
        return `- ${children.trim()}\n`;
      case "a": {
        const href = getAttribute(node, "href");
        if (href && !href.startsWith("#") && children.trim()) {
          return `[${children.trim()}](${href})`;
        }
        return children;
      }
      case "br":
        return "\n";
      case "blockquote":
        return `\n> ${children.trim()}\n\n`;
      case "table":
        return `\n${children}\n`;
      case "tr":
        return `${children}\n`;
      case "th":
      case "td":
        return `| ${children.trim()} `;
      case "img": {
        const src = getAttribute(node, "src");
        const alt = getAttribute(node, "alt") || "";
        return src ? `![${alt}](${src})` : "";
      }
      case "div":
      case "section":
      case "article":
        if (hasClass(node, "admonition")) {
          const type =
            getClassName(node)
              .split(/\s+/)
              .find((cls) => cls.startsWith("alert--"))
              ?.replace("alert--", "") || "note";
          return `\n> **${type.toUpperCase()}**: ${children.trim()}\n\n`;
        }
        return `${children}\n`;
      default:
        return children;
    }
  }

  return "";
};

const convertToMarkdown = (input) => {
  const { root, context } = normalizeInput(input);
  if (!root) return "";

  return processNode(root, context)
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^\n+|\n+$/g, "")
    .trim();
};

const extractPageMarkdownFromRoot = (
  root,
  pageUrl,
  context = {},
  options = {}
) => {
  const mainContent =
    queryOne(root, "main article", context) ||
    queryOne(root, "main .markdown", context);
  if (options.requireDocContent && !mainContent) {
    return "";
  }

  const targetElement =
    mainContent ||
    queryOne(root, "main", context) ||
    queryOne(root, "article", context) ||
    queryOne(root, ".main-wrapper", context);

  if (!targetElement) return "";

  const clone = cloneNode(targetElement, context);
  if (!clone) return "";

  SELECTORS_TO_REMOVE.forEach((selector) => {
    queryAll(clone, selector, context).forEach((el) => removeNode(el, context));
  });

  const firstH1 = queryOne(clone, "h1", context);
  const title = firstH1 ? cleanText(textContentOf(firstH1)) : "Documentation Page";
  removeNode(firstH1, context);

  const content = convertToMarkdown(clone);
  return `# ${title}\n\nURL: ${pageUrl}\n\n${content}`;
};

const extractPageMarkdownFromDocument = (documentLike, pageUrl) => {
  return extractPageMarkdownFromRoot(documentLike, pageUrl);
};

const extractPageMarkdownFromHtml = (html, pageUrl, options = {}) => {
  const { root, context } = parseHtml(html);
  return extractPageMarkdownFromRoot(root, pageUrl, context, options);
};

const toMarkdownPathname = (pathname) => {
  let normalized = pathname || "/";
  if (normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }
  if (!normalized) {
    normalized = "/index";
  }
  if (normalized.endsWith(".md")) {
    return normalized;
  }

  const lastSegment = normalized.slice(normalized.lastIndexOf("/") + 1);
  if (lastSegment.includes(".")) {
    return normalized.replace(/\.[^/.]+$/, ".md");
  }
  return `${normalized}.md`;
};

const getMarkdownRouteUrl = (pageUrl) => {
  try {
    const url = new URL(pageUrl);
    url.hash = "";
    url.search = "";
    url.pathname = toMarkdownPathname(url.pathname);
    return url.toString();
  } catch (error) {
    const [withoutHash] = String(pageUrl).split("#");
    const [withoutSearch] = withoutHash.split("?");
    return toMarkdownPathname(withoutSearch);
  }
};

module.exports = {
  SELECTORS_TO_REMOVE,
  cleanText,
  convertToMarkdown,
  extractPageMarkdownFromDocument,
  extractPageMarkdownFromHtml,
  getMarkdownRouteUrl,
  toMarkdownPathname,
};
