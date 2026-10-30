import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import {
  useActivePlugin,
  useDocVersionSuggestions,
  useDocsPreferredVersion,
  useDocsVersion,
} from "@docusaurus/plugin-content-docs/client";
import { ThemeClassNames } from "@docusaurus/theme-common";

function UnreleasedVersionLabel({ versionLabel }) {
  return (
    <>
      This documentation is for Cartesi Rollups <b>{versionLabel}</b> release.
      We recommend using this version for up-to-date documentation.
    </>
  );
}

function UnmaintainedVersionLabel({ versionLabel }) {
  return (
    <>
      This is documentation for Cartesi Rollups <b>{versionLabel}</b>, which is
      no longer actively maintained.
    </>
  );
}

const BannerLabelComponents = {
  unreleased: UnreleasedVersionLabel,
  unmaintained: UnmaintainedVersionLabel,
};

function LatestVersionSuggestionLabel({ versionLabel, to, onClick }) {
  return (
    <>
      For up-to-date documentation, see the{" "}
      <b>
        <Link to={to} onClick={onClick}>
          latest version
        </Link>
      </b>{" "}
      ({versionLabel}).
    </>
  );
}

function DocVersionBannerEnabled({ className, versionMetadata }) {
  const { pluginId } = useActivePlugin({ failfast: true });
  const { savePreferredVersionName } = useDocsPreferredVersion(pluginId);
  const { latestDocSuggestion, latestVersionSuggestion } =
    useDocVersionSuggestions(pluginId);

  const getVersionMainDoc = (version) =>
    version.docs.find((doc) => doc.id === version.mainDocId);

  const latestVersionSuggestedDoc =
    latestDocSuggestion ?? getVersionMainDoc(latestVersionSuggestion);

  const BannerLabel = BannerLabelComponents[versionMetadata.banner];

  return (
    <div
      className={clsx(
        className,
        ThemeClassNames.docs.docVersionBanner,
        "alert alert--warning margin-bottom--md"
      )}
      role="alert"
    >
      <div>
        <BannerLabel versionLabel={versionMetadata.label} />
      </div>
      {!versionMetadata.isLast && (
        <div className="margin-top--md">
          <LatestVersionSuggestionLabel
            versionLabel={latestVersionSuggestion.label}
            to={latestVersionSuggestedDoc.path}
            onClick={() =>
              savePreferredVersionName(latestVersionSuggestion.name)
            }
          />
        </div>
      )}
    </div>
  );
}

export default function DocVersionBanner({ className }) {
  const versionMetadata = useDocsVersion();
  if (versionMetadata.banner) {
    return (
      <DocVersionBannerEnabled
        className={className}
        versionMetadata={versionMetadata}
      />
    );
  }
  return null;
}
