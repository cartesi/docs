# Base images
FROM cartesi/machine-emulator:0.4.0 as emulator-image
FROM cartesi/toolchain:0.2.0 as toolchain-image

# Final images
FROM ubuntu:18.04

LABEL maintainer="Victor Fusco <victor@cartesi.io>"

RUN apt-get update && apt-get install -y \
    make git vim wget genext2fs e2tools \
    ca-certificates libreadline7 openssl \
    libboost-program-options1.65.1 \
    libboost-serialization1.65.1 \
    && rm -rf /var/lib/apt/lists/*

ENV PATH="/opt/cartesi/bin:/opt/riscv/riscv64-unknown-linux-gnu/bin:${PATH}"

WORKDIR /opt/cartesi

# Setup su-exec
COPY --from=toolchain-image /usr/local/bin/su-exec /usr/local/bin/su-exec
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Copy emulator, toolchain and buildroot
COPY --from=emulator-image /opt/cartesi /opt/cartesi
COPY --from=toolchain-image /opt/riscv /opt/riscv

# Download emulator binary images
RUN \
    wget https://github.com/cartesi/machine-emulator-rom/releases/download/v0.2.0/rom.bin && \
    wget https://github.com/cartesi/image-kernel/releases/download/v0.4.0/kernel.bin && \
    wget https://github.com/cartesi/image-rootfs/releases/download/v0.3.0/rootfs.ext2


ENTRYPOINT [ "/usr/local/bin/entrypoint.sh" ]

