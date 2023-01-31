import React from "react";
import {
  useVersions,
  useActiveDocContext,
} from "@docusaurus/plugin-content-docs/client";
import { useDocsPreferredVersion } from "@docusaurus/theme-common";
import { useDocsVersionCandidates } from "@docusaurus/theme-common/internal";
import useGlobalData from "@docusaurus/useGlobalData";
import { useLocation } from "@docusaurus/router";
import { useWindowSize } from "@docusaurus/theme-common";
import DropdownVersionNavbarItem from "./DropdownVersionNavbarItem";
const getVersionMainDoc = (version) =>
  version.docs.find((doc) => doc.id === version.mainDocId);
export default function DropdownVersion({ ...props }) {
  const dropdownActiveClassDisabled = true;
  const windowSize = useWindowSize();
  const mobile = windowSize === "desktop" || windowSize === "ssr";
  const global = useGlobalData();
  const location = useLocation();
  const sidebars = Object.keys(global["docusaurus-plugin-content-docs"]);
  const docsPluginId = sidebars.find((sidebar) => {
    const path = location.pathname.split("/")[1];
    return sidebar.includes(path);
  });

  const activeDocContext = useActiveDocContext(docsPluginId);
  const versions = useVersions(docsPluginId);
  const { savePreferredVersionName } = useDocsPreferredVersion(docsPluginId);
  const versionLinks = versions.map((version) => {
    // We try to link to the same doc, in another version
    // When not possible, fallback to the "main doc" of the version
    const versionDoc =
      activeDocContext.alternateDocVersions[version.name] ??
      getVersionMainDoc(version);
    return {
      label: version.label,
      to: versionDoc.path,
      isActive: () => version === activeDocContext.activeVersion,
      onClick: () => savePreferredVersionName(version.name),
    };
  });

  // console.log("versionLinks", versionLinks);
  const dropdownVersion = useDocsVersionCandidates(docsPluginId)[0];
  // Mobile dropdown is handled a bit differently
  const dropdownLabel = dropdownVersion.label;
  const dropdownTo =
    mobile && versionLinks.length > 1
      ? undefined
      : getVersionMainDoc(dropdownVersion).path;
  // We don't want to render a version dropdown with 0 or 1 item. If we build
  // the site with a single docs version (onlyIncludeVersions: ['1.0.0']),
  // We'd rather render a button instead of a dropdown
  if (versionLinks.length <= 1) {
    return null;
  }
  return (
    <div className="dropdown-version">
      <span className="dropdown-version__label">
        {props.selectversionlabel}
      </span>
      <DropdownVersionNavbarItem
        {...props}
        mobile={false}
        label={dropdownLabel}
        to={dropdownTo}
        position={props.position}
        items={versionLinks}
        isActive={dropdownActiveClassDisabled ? () => false : undefined}
      />
    </div>
  );
}
