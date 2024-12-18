import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "_versioned_docs/version-0.9/api/rollup/cartesi-rollup-http-api",
    },
    {
      type: "category",
      label: "UNTAGGED",
      items: [
        {
          type: "doc",
          id: "_versioned_docs/version-0.9/api/rollup/finish",
          label: "Finish and get next request",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "_versioned_docs/version-0.9/api/rollup/add-voucher",
          label: "Add a new voucher",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "_versioned_docs/version-0.9/api/rollup/add-notice",
          label: "Add a new notice",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "_versioned_docs/version-0.9/api/rollup/add-report",
          label: "Add a new report",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "_versioned_docs/version-0.9/api/rollup/register-exception",
          label: "Register an exception",
          className: "api-method post",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
