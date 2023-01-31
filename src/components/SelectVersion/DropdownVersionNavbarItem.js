import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import {
  isRegexpStringMatch,
  useCollapsible,
  Collapsible,
} from "@docusaurus/theme-common";
import {
  isSamePath,
  useLocalPathname,
} from "@docusaurus/theme-common/internal";
import NavbarNavLink from "@theme/NavbarItem/NavbarNavLink";
import NavbarItem from "@theme/NavbarItem";

function DropdownNavbarItemDesktop({
  items,
  position,
  className,
  onClick,
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [dropdownRef]);
  return (
    <div
      ref={dropdownRef}
      className={clsx(
        "navbar__item",
        "dropdown",
        "dropdown--hoverable",
        "navbar__item--version",
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
        href={props.to ? undefined : "#"}
        className={clsx("navbar__link", className)}
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
            onKeyDown={(e) => {
              if (i === items.length - 1 && e.key === "Tab") {
                e.preventDefault();
                setShowDropdown(false);
                const nextNavbarItem = dropdownRef.current.nextElementSibling;
                if (nextNavbarItem) {
                  const targetItem =
                    nextNavbarItem instanceof HTMLAnchorElement
                      ? nextNavbarItem
                      : // Next item is another dropdown; focus on the inner
                        // anchor element instead so there's outline
                        nextNavbarItem.querySelector("a");
                  targetItem.focus();
                }
              }
            }}
            activeClassName="dropdown__link--active"
            {...childItemProps}
            key={i}
          />
        ))}
      </ul>
    </div>
  );
}

export default function DropdownVersionNavbarItem({
  mobile = false,
  ...props
}) {
  return <DropdownNavbarItemDesktop {...props} />;
}
