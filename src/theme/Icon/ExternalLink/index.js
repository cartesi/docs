import React from "react";
import styles from "./styles.module.css";
export default function IconExternalLink({ width = 13.5, height = 13.5 }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.iconExternalLink}
    >
      <g clip-path="url(#clip0_1_4)">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M4.22876 11.7712C3.96841 11.5109 3.96841 11.0888 4.22876 10.8284L10.8284 4.22876C11.0888 3.96841 11.5109 3.96841 11.7712 4.22876C12.0316 4.48911 12.0316 4.91122 11.7712 5.17157L5.17157 11.7712C4.91122 12.0316 4.48911 12.0316 4.22876 11.7712Z"
          fill="currentColor"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M11.2998 4.0335C11.668 4.0335 11.9665 4.33198 11.9665 4.70017L11.9665 10.357C11.9665 10.7252 11.668 11.0237 11.2998 11.0237C10.9316 11.0237 10.6332 10.7252 10.6332 10.357L10.6332 4.70017C10.6332 4.33198 10.9316 4.0335 11.2998 4.0335Z"
          fill="currentColor"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M4.97631 4.70017C4.97631 4.33198 5.27479 4.0335 5.64298 4.0335L11.2998 4.0335C11.668 4.0335 11.9665 4.33198 11.9665 4.70017C11.9665 5.06836 11.668 5.36684 11.2998 5.36684L5.64298 5.36684C5.27479 5.36684 4.97631 5.06836 4.97631 4.70017Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_1_4">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
