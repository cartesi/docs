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
      label: "Cartesi Machine",
      items: [
        "machine/intro",
        "machine/host",
        "machine/target",
        "machine/blockchain"
      ],
    },
    {
      type: "category",
      label: "Descartes SDK",
      items: [
        "descartes/introduction",
        "descartes/instantiate",
        "descartes/integer_drive",
        "descartes/logger_drive"
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
