/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  docs: [
    {
      type: "category",
      label: "Overview",
      items: ["intro", "architecture", "node"],
    },
    {
      type: "category",
      label: "SDK",
      items: [
        "sdk/introduction",
        {
          type: "category",
          label: "Cartesi Machine",
          items: [
            "sdk/machine",
            "sdk/machine/emulator",
            "sdk/machine/rom",
            "sdk/machine/toolchain",
            "sdk/machine/kernel",
            "sdk/machine/rootfs",
            "sdk/machine/sdk",
            "sdk/machine/solidity",
            "sdk/machine-manager",
          ],
        },
        {
          type: "category",
          label: "Dispatcher",
          items: [
            "sdk/dispatcher/intro",
            "sdk/dispatcher/architecture",
            "sdk/dispatcher/contracts",
            "sdk/dispatcher/services",
            "sdk/dispatcher/configuration",
            "sdk/dispatcher/http"
          ]
        },
        "sdk/arbitration",
        "sdk/logger",
        "sdk/tournament",
      ],
    },
    {
      type: "category",
      label: "Examples",
      items: ["example/introduction", "example/creepts", "example/hello_world"],
    },
    {
      type: "category",
      label: "Tutorials",
      items: [
        "tutorials/introduction",
        {
          type: "category",
          label: "Requirements",
          items: [
            "tutorials/1/cartesi-sdk",
            "tutorials/1/install-docker",
            "tutorials/1/try-docker",
            "tutorials/1/docker-compose",
          ],
        },
        {
          type: "category",
          label: "Cartesi Machines",
          items: [
            "tutorials/2/introduction",
            "tutorials/2/setup",
            "tutorials/2/hello-app",
            "tutorials/2/hello-machine",
            "tutorials/2/greetings-app",
            "tutorials/2/greetings-machine",
          ],
        },
        {
          type: "category",
          label: "Tournament API",
          items: ["tutorials/3/introduction"],
        },
        {
          type: "category",
          label: "Core API: Agreement",
          items: [],
        },
        {
          type: "category",
          label: "Core API: Disputes",
          items: [],
        },
      ],
    },
  ],
};
