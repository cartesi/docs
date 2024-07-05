import React from "react";
import clsx from "clsx";
import { translate } from "@docusaurus/Translate";
import { useThemeConfig } from "@docusaurus/theme-common";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";
export default function Heading({ as: As, id, ...props }) {
  const {
    navbar: { hideOnScroll },
  } = useThemeConfig();
  // H1 headings do not need an id because they don't appear in the TOC.
  if (As === "h1" || !id) {
    return <As {...props} id={undefined} />;
  }
  const anchorTitle = translate(
    {
      id: "theme.common.headingLinkTitle",
      message: "Direct link to {heading}",
      description: "Title for link to heading",
    },
    {
      heading: typeof props.children === "string" ? props.children : id,
    }
  );

  const copyToClipboard = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(e.target.href);
  };

  const onClick = (e) => {
    e.preventDefault();
    console.log("click");
    copyToClipboard(e);
  };

  return (
    <>
      <As
        {...props}
        className={clsx(
          "anchor",
          hideOnScroll
            ? styles.anchorWithHideOnScrollNavbar
            : styles.anchorWithStickyNavbar,
          props.className
        )}
        id={id}
      >
        {props.children}
        <Link
          className="hash-link"
          to={`#${id}`}
          aria-label={anchorTitle}
          title={anchorTitle}
          onClick={onClick}
        >
          &#8203;
        </Link>
      </As>
    </>
  );
}
