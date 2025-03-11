import React, { useState, useRef, useEffect } from "react";
import {
  useActiveDocContext,
  useVersions,
} from "@docusaurus/plugin-content-docs/client";
import { useLocation } from "@docusaurus/router";
import useGlobalData from "@docusaurus/useGlobalData";

import clsx from "clsx";

import NavbarNavLink from "@theme/NavbarItem/NavbarNavLink";
import NavbarItem from "@theme/NavbarItem";

const useVersionsForDropdown = () => {
  const global = useGlobalData();
  const location = useLocation();
  const sidebars = Object.keys(global["docusaurus-plugin-content-docs"]);

  const docsPluginId = sidebars.find((sidebar) => {
    const path = location.pathname.split("/")[1];
    return sidebar.includes(path);
  });

  const versions = useVersions(docsPluginId);
  const activeDocContext = useActiveDocContext(docsPluginId);

  return {
    versions,
    activeVersion: {
      label: activeDocContext.activeVersion.label,
      to: activeDocContext.activeVersion.to,
    },
  };
};

function DropdownNavbarItemDesktop({
  position,
  className,
  onClick,
  items,
  ...props
}) {
  const dropdownRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!dropdownRef.current || dropdownRef.current.contains(event.target)) {
        return;
      }
      setShowDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("focusin", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("focusin", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div
      ref={dropdownRef}
      className={clsx(
        "navbar__item",
        "dropdown",
        "dropdown--hoverable",
        "dropdown-version",
        {
          "dropdown--right": position === "right",
          "dropdown--show": showDropdown,
        }
      )}
    >
      <NavbarNavLink
        aria-haspopup="true"
        aria-expanded={showDropdown}
        role="button"
        // # hash permits to make the <a> tag focusable in case no link target
        // See https://github.com/facebook/docusaurus/pull/6003
        // There's probably a better solution though...
        href={props.to ? undefined : "#"}
        className={clsx("navbar__link", "navbar__item--version", className)}
        {...props}
        onClick={props.to ? undefined : (e) => e.preventDefault()}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            setShowDropdown(!showDropdown);
          }
        }}
      >
        {props.children ?? props.label}
      </NavbarNavLink>
      <ul className="dropdown__menu">
        {items.map((childItemProps, i) => (
          <NavbarItem
            isDropdownItem
            activeClassName="dropdown__link--active"
            {...childItemProps}
            key={i}
          />
        ))}
      </ul>
    </div>
  );
}

export default function DropdownVersion({ mobile = "false" }) {
  const { versions, activeVersion } = useVersionsForDropdown();

  const props = {
    label: `Version ${activeVersion.label}`,
    items: versions.map((version) => ({
      to: version.path,
      label: version.label,
    })),
    mobile,

    to: undefined,
  };
  return <DropdownNavbarItemDesktop {...props} />;
}
