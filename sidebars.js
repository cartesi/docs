/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  docs: [
    "intro",
    {
      type: "category",
      label: "Cartesi Machine",
      items: [
        "machine/intro",
        {
          type: "category",
          label: "Host perspective",
          items: [
            "machine/host/overview",
            "machine/host/cmdline",
            "machine/host/lua",
          ],
        },
        {
          type: "category",
          label: "Target perspective",
          items: [
              "machine/target/overview",
              "machine/target/linux",
              "machine/target/architecture",
          ],
        },
        {
          type: "category",
          label: "Blockchain perspective",
          items: [
              "machine/blockchain/intro",
              "machine/blockchain/hash",
              "machine/blockchain/vg",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Descartes SDK",
      items: [
        "descartes/overview",
        "descartes/how",
        "descartes/architecture",
        "descartes/wallet",
        "descartes/timeline",
        "descartes/machine-offchain",
        "descartes/machine-onchain",
        "descartes/api",
        "descartes/instantiate",
        "descartes/drives",
        "descartes/provider",
        "descartes/logger_drive",
        "descartes/off-chain-api",
        "descartes/workflow",
        "descartes/topologies",
        "descartes/services",
      ],
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
            "tutorials/requirements/general",
            "tutorials/requirements/descartes-env"
          ],
        },
        {
          type: "category",
          label: "Hello World DApp",
          items: [
            "tutorials/helloworld/cartesi-machine",
            "tutorials/helloworld/create-project",
            "tutorials/helloworld/instantiate",
            "tutorials/helloworld/getresult",
            "tutorials/helloworld/running"
          ]
        }
      ],
    },
  ],
};
