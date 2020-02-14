/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  docs: {
      "Getting Started": [
          "intro",
          "architecture"
      ],
      "Development Guide": [
          {
              "type": "category",
              "label": "Cartesi Machine",
              "items": [
                  "machine",
                  "machine-emulator",
                  "machine-emulator-rom",
                  "machine-toolchain",
                  "machine-kernel",
                  "machine-rootfs",
                  "machine-emulator-sdk",
                  "machine-manager",
                  "machine-solidity"
              ]
          },
          "grpc",
          "arbitration-dlib",
          "dispatcher",
          "blockchain-node"
      ],
      "The Cartesi Tutorials" : [
          {
              "type": "category",
              "label": "1. Introduction",
              "items": [
                  "tut/1/welcome",
                  "tut/1/install-docker",
                  "tut/1/try-docker",
                  "tut/1/docker-compose"
              ]
          },
          {
              "type": "category",
              "label": "2. Creating Cartesi machines",
              "items": [
                  "tut/2/introduction",
                  "tut/2/setup",
                  "tut/2/hello-app",
                  "tut/2/hello-machine",
                  "tut/2/greetings-app",
                  "tut/2/greetings-machine",
              ]
          },
          {
              "type": "category",
              "label": "3. Cartesi Tournament API",
              "items": [
              ]
          },
          {
              "type": "category",
              "label": "4. Cartesi Core API, MVP",
              "items": [
              ]
          },
          {
              "type": "category",
              "label": "5. Cartesi Core API, MVP+VG",
              "items": [
              ]
          }
      ]
  },
};
