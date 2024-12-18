import React from "react";
import clsx from "clsx";
import EditThisPage from "@theme/EditThisPage";
import LastUpdated from "@theme/LastUpdated";
import styles from "./styles.module.css";
export default function EditMetaRow({
  className,
  editUrl,
  lastUpdatedAt,
  lastUpdatedBy,
}) {
  return (
    <div className={clsx("flex flex-col", className)}>
      <div className={clsx("", styles.lastUpdated)}>
        {(lastUpdatedAt || lastUpdatedBy) && (
          <LastUpdated
            lastUpdatedAt={lastUpdatedAt}
            lastUpdatedBy={lastUpdatedBy}
          />
        )}
      </div>
      <div className="">{editUrl && <EditThisPage editUrl={editUrl} />}</div>
    </div>
  );
}
