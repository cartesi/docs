import React from "react";
import clsx from "clsx";
import TOCItems from "@theme/TOCItems";
import styles from "./styles.module.css";
import Resources from "@site/src/components/Resources";

import { useDoc } from "@docusaurus/plugin-content-docs/client";
// Using a custom className
// This prevents TOCInline/TOCCollapsible getting highlighted by mistake
const LINK_CLASS_NAME = "table-of-contents__link toc-highlight";
const LINK_ACTIVE_CLASS_NAME = "table-of-contents__link--active";
export default function TOC({ className, ...props }) {
  const { toc, frontMatter } = useDoc();
  return (
    <div className={clsx(styles.tableOfContents, "thin-scrollbar", className)}>
      <h3 className="mt-4 block text-[.8rem]">On this page</h3>
      <TOCItems
        {...props}
        linkClassName={LINK_CLASS_NAME}
        linkActiveClassName={LINK_ACTIVE_CLASS_NAME}
      />
      {frontMatter.resources && <Resources resources={frontMatter.resources} />}
    </div>
  );
}
