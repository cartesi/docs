import React from "react";
import clsx from "clsx";
import Translate from "@docusaurus/Translate";
import AdmonitionLayout from "@theme/Admonition/Layout";
import IconTroubleshoot from "@theme/Admonition/Icon/Troubleshoot";
const infimaClassName = "alert alert--troubleshoot";
const defaultProps = {
  icon: <IconTroubleshoot />,
  title: (
    <Translate
      id="theme.admonition.troubleshoot"
      description="The default label used for the Troubleshoot admonition (:::troubleshoot)"
    >
      troubleshoot
    </Translate>
  ),
};
// TODO remove before v4: Caution replaced by Warning
// see https://github.com/facebook/docusaurus/issues/7558
export default function AdmonitionTypeTroubleshoot(props) {
  return (
    <AdmonitionLayout
      {...defaultProps}
      {...props}
      className={clsx(infimaClassName, props.className)}
    >
      {props.children}
    </AdmonitionLayout>
  );
}
