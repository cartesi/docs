/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  docs: [
    "intro",
    "architecture",
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
        "descartes/workflow",
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
        "descartes/topologies",
        "descartes/services",
        "descartes/configurations",
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
          ]
        },
        {
          type: "category",
          label: "Descartes SDK",
          items: [
            "tutorials/descartes/hello",
            "tutorials/descartes/dodgecoin_hash",
            "tutorials/descartes/certificate_verification"
          ]
        }
      ],
    },
  ],
};
