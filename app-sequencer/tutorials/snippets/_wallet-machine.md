```toml title="Cross.toml"
[target.riscv64gc-unknown-linux-musl]
image = "ghcr.io/cross-rs/riscv64gc-unknown-linux-musl@sha256:f5a375283c54578efcc6e61c78ea7661392c2e9b2e108afe89938d2f7b8b489d"
```

```toml title="cartesi.toml"
sdk = "cartesi/sdk:0.12.0-alpha.41"

[machine]
ram_length = "128Mi"
entrypoint = "/dapp/dapp"
use_docker_workdir = true

[drives.root]
builder = "docker"
dockerfile = "machine/Dockerfile"
format = "ext2"
```

```dockerfile title="machine/Dockerfile"
# Stage 1 obtains cartesi-init from the machine guest tools package.
FROM riscv64/debian:stable-slim AS extractor

ARG MACHINE_GUEST_TOOLS_VERSION=0.17.2
ARG TOOLS_SHA512="4af9911a5a76738d526bfc2b5462cf96c9dee98ec8b23f3ca91ac4849d5761765f471b5e2e8779809bc4a26d2799f8e744622864fa549ada5941e21d999ff4be"

ADD https://github.com/cartesi/machine-guest-tools/releases/download/v${MACHINE_GUEST_TOOLS_VERSION}/machine-guest-tools_riscv64.deb /tmp/tools.deb

RUN echo "${TOOLS_SHA512}  /tmp/tools.deb" | sha512sum -c - \
    && dpkg -x /tmp/tools.deb /tmp/out

# Stage 2 creates the root file system used by the Cartesi Machine.
FROM riscv64/alpine@sha256:372839ff152f938e12282226fb5f9ddaef72f9662dcadbf9dd0de5ce287c694e

ARG ALPINE_MAIN_REPOSITORY=https://dl-cdn.alpinelinux.org/alpine/v3.22/main
ARG LIBGCC_VERSION=14.2.0-r6

RUN apk add --no-cache \
    --repository="${ALPINE_MAIN_REPOSITORY}" \
    "libgcc=${LIBGCC_VERSION}"

COPY --from=extractor --chmod=755 \
    /tmp/out/usr/sbin/cartesi-init \
    /usr/sbin/cartesi-init

RUN adduser -h /dapp -D dapp
ENV PATH="/dapp:${PATH}"
WORKDIR /dapp
COPY --chown=dapp:dapp --chmod=755 machine/out/dapp .

USER dapp
ENTRYPOINT ["dapp"]
```
