/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  docs: {
    "Getting Started": ["intro", "architecture"],
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
    ]
  },
};
