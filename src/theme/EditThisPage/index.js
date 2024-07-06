import React from "react";
import Translate from "@docusaurus/Translate";
import { ThemeClassNames } from "@docusaurus/theme-common";
import IconEdit from "@theme/Icon/Edit";
export default function EditThisPage({ editUrl }) {
  return (
    <a
      href="https://github.com/cartesi/docs/issues/new"
      target="_blank"
      rel="noreferrer noopener"
      className={ThemeClassNames.common.editThisPage}
    >
      <IconEdit />
      <Translate
        id="theme.common.editThisPage"
        description="The link label to edit the current page"
      >
        Report an error
      </Translate>
    </a>
  );
}
