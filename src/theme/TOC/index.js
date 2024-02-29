import React from "react";
import clsx from "clsx";
import TOCItems from "@theme/TOCItems";
import styles from "./styles.module.css";
import { useDoc } from "@docusaurus/theme-common/internal";
// Using a custom className
// This prevents TOCInline/TOCCollapsible getting highlighted by mistake
const LINK_CLASS_NAME = "table-of-contents__link toc-highlight";
const LINK_ACTIVE_CLASS_NAME = "table-of-contents__link--active";
import Resources from "../../components/Resources";

export default function TOC({ className, ...props }) {
  const { frontMatter } = useDoc();
  return (
    <div className={clsx(styles.tableOfContents, "thin-scrollbar", className)}>
      <TOCItems
        {...props}
        linkClassName={LINK_CLASS_NAME}
        linkActiveClassName={LINK_ACTIVE_CLASS_NAME}
      />
      {frontMatter.resources && <Resources resources={frontMatter.resources} />}
    </div>
  );
}
