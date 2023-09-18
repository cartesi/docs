import React from "react";
import { Tooltip as _Tooltip } from "react-tooltip";

export default function Tooltip({ children, content }) {
  return (
    <>
      <span data-tooltip-id="tooltip" data-tooltip-content={content}>
        {children}
      </span>
      <_Tooltip id="tooltip" />
    </>
  );
}

// Usage inside MDX: <Tooltip content="Tooltip content">Tooltip</Tooltip>
