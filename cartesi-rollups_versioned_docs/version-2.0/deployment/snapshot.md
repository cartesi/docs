---
id: snapshot
title: Public snapshot
---

A Cartesi snapshot is a compressed representation of your application's machine state that can be deployed to rollups nodes. This process involves:

1. Building your application with the Cartesi CLI
2. Creating a compressed snapshot archive
3. Generating checksums for verification
4. Publishing releases with snapshot artifacts

Public snapshots are crucial for applications developed with the Cartesi Rollups framework because they enable **anyone to validate the respective application**. This transparency is fundamental to the trustless nature of blockchain applications.

### Validation Process

When a snapshot is public, validators can:

1. Download the snapshot from the release
2. Verify the checksum, which only shows that the download matches what the publisher uploaded
3. Extract and inspect the machine state
4. Reproduce the build process locally
5. Compute the machine's root hash themselves and compare it with the application's template hash

This process ensures that the application behaves exactly as intended and hasn't been tampered with during deployment.

:::danger
**Note**: Always download snapshots from verified public GitHub releases, never from local builds or private sources.
:::

:::warning What a validator must check
The checksum published next to the tarball comes from the publisher, so on its own it proves nothing about the machine. A validator must compute the machine's root hash independently, either by loading the snapshot in the Cartesi Machine emulator or by rebuilding the application reproducibly from source, and compare it with the template hash stored in the application contract:

```shell
cast call <application-address> "getTemplateHash()(bytes32)" --rpc-url <RPC-URL>
```

A hash read from the snapshot's own files, such as the root hash stored in `hash_tree.sht`, is not recomputed from the machine data, so it does not show that the data is unmodified.
:::

### Snapshot requirements

- **Emulator version.** Build the snapshot with the Cartesi Machine emulator line of the node release that will run it: 0.22.x for rollups-node v2.0.0-alpha.14. A node cannot load a snapshot built with another emulator line. The SDK image that `cartesi build` runs, which you can set with the top-level `sdk` key of `cartesi.toml`, determines the emulator version.
- **Final hash.** The snapshot must be stored with its final hash, which `cartesi build` does. The node CLI reads the template hash from it when deploying, and a node cannot run an application whose snapshot lacks it.

## Prerequisites

Before building snapshots, ensure you have:

- Cartesi CLI: An easy-to-use tool for developing and deploying your dApps.

- Docker Desktop 4.x: The required tool to distribute the Cartesi Rollups framework and its dependencies.

- Node and NPM: A JavaScript runtime needed to install Cartesi CLI and run various scripts. We recommend installing the LTS version to ensure best compatibility.

For more details about the installation process for each of these tools, please refer to the [this section](../development/installation.md).

## GitHub Actions Workflow

The following workflow automates the snapshot building and release process:

```yaml
name: build-and-release

on:
  push:
    tags:
      - "*"
  pull_request:
    branches: [main]
  workflow_dispatch:

jobs:
  build:
    name: build
    runs-on: ubuntu-24.04

    permissions:
      contents: read
      packages: write
      attestations: write
      id-token: write

    env:
      REGISTRY: ghcr.io

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4.4.0
        with:
          submodules: recursive

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3.12.0

      - name: Set up QEMU
        uses: docker/setup-qemu-action@v3.7.0

      - name: Set up Node.js
        uses: actions/setup-node@v4.4.0
        with:
          node-version: 24.14.0

      - name: Install Cartesi CLI
        run: npm install -g @cartesi/cli@2.0.0-alpha.41

      - name: Log in to GHCR
        if: startsWith(github.ref, 'refs/tags/')
        uses: docker/login-action@v3.7.0
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build Docker image and Cartesi snapshot
        run: cartesi build
        env:
          DOCKER_BUILDKIT: 1
          BUILDKIT_INLINE_CACHE: 1

      - name: Create compressed snapshot
        if: startsWith(github.ref, 'refs/tags/')
        run: |
          tar -czf snapshot.tar.gz -C .cartesi/image .
          sha256sum snapshot.tar.gz > snapshot.tar.gz.sha256

      - name: Upload snapshot artifacts
        if: startsWith(github.ref, 'refs/tags/')
        uses: actions/upload-artifact@v4.6.2
        with:
          name: snapshot
          path: |
            snapshot.tar.gz
            snapshot.tar.gz.sha256

  release:
    name: release
    if: startsWith(github.ref, 'refs/tags/v')
    needs: build
    runs-on: ubuntu-24.04

    permissions:
      contents: write

    steps:
      - name: Download snapshot artifacts
        uses: actions/download-artifact@v4.3.0
        with:
          path: artifacts

      - name: Prepare release assets
        run: |
          mkdir -p release-assets
          find artifacts -name "*.tar.gz" -exec cp {} release-assets/ \;
          find artifacts -name "*.sha256" -exec cp {} release-assets/ \;

      - name: Publish GitHub release
        uses: softprops/action-gh-release@v2.6.2
        with:
          files: release-assets/*
          prerelease: ${{ contains(github.ref, '-rc') }}
          fail_on_unmatched_files: true
```

## Workflow Breakdown

### Triggers

The workflow is triggered by:

- **Tag pushes**: Any tag push triggers a build
- **Pull requests**: Builds on PRs to main branch
- **Manual dispatch**: Manual workflow execution

### Build Job

The build job sets up the environment with Docker Buildx, QEMU, and Node.js, installs the Cartesi CLI globally, and uses `cartesi build` to create the Cartesi machine snapshot. It then compresses the snapshot as `snapshot.tar.gz`, generates a SHA256 checksum for verification, and uploads the artifacts for the release job.

Pin the Cartesi CLI version, and the SDK image through the `sdk` key of `cartesi.toml`, to versions that build with the emulator line of the node release that will run the application (see [Snapshot requirements](#snapshot-requirements)). For rollups-node v2.0.0-alpha.14, the workflow above installs Cartesi CLI 2.0.0-alpha.41, and the project's `cartesi.toml` must set `sdk = "cartesi/sdk:0.12.0-alpha.45"`: the CLI's default SDK builds with emulator 0.21.0, which that node cannot load. The SHA256 checksum only protects the download; validators still need to compare the machine's root hash with the application's template hash.

### Release Job

The release job downloads the build artifacts, prepares the release assets, and creates a GitHub release with the tag. It attaches the snapshot files and checksums, marking the release as prerelease if the tag contains `-rc`.

## Release Management

### Creating Releases

1. **Tag your release**:

   ```shell
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **Prereleases**: Use tags like `v1.0.0-rc` for release candidates

3. **Release artifacts** will include:

   - `snapshot.tar.gz` - Compressed snapshot
   - `snapshot.tar.gz.sha256` - Checksum file