import React from "react";
import { Tooltip as _Tooltip } from "react-tooltip";

export default function Tooltip({ children, content }) {
  const id = content.replace(/\s+/g, "-").toLowerCase();
  return (
    <>
      <span
        data-tooltip-id={id}
        data-tooltip-content={content}
        style={{
          borderBottom: "1px dotted var(--ifm-font-color-base)",
        }}
      >
        {children}
      </span>
      <_Tooltip
        id={id}
        style={{
          fontSize: ".875rem",
          maxWidth: "20rem",
        }}
      />
    </>
  );
}

// Usage inside MDX: <Tooltip content="Tooltip content">Tooltip</Tooltip>
