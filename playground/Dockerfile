FROM ubuntu:18.04

LABEL maintainer="Victor Fusco <victor@cartesi.io>"

RUN apt-get update && apt-get install -y \
    make git vim wget genext2fs e2tools \
    ca-certificates libreadline7 openssl libgomp1 \
    libboost-program-options1.65.1 \
    libboost-serialization1.65.1 \
    && rm -rf /var/lib/apt/lists/*

ENV PATH="/opt/cartesi/bin:/opt/riscv/riscv64-unknown-linux-gnu/bin:${PATH}"

WORKDIR /opt/cartesi

# Setup su-exec
COPY --from=cartesi/toolchain:0.3.0 /usr/local/bin/su-exec /usr/local/bin/su-exec
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Copy emulator, toolchain, buildroot and kernel
COPY --from=cartesi/machine-emulator:0.5.0 /opt/cartesi /opt/cartesi
COPY --from=cartesi/toolchain:0.3.0 /opt/riscv /opt/riscv
COPY --from=cartesi/linux-kernel:0.5.0 /opt/riscv/kernel/artifacts/linux-5.5.19-ctsi-1.bin /opt/cartesi/share/images/
COPY --from=cartesi/rootfs:0.4.0 /opt/riscv/rootfs/artifacts/rootfs.ext2 /opt/cartesi/share/images/

# Download emulator binary images
RUN \
    wget -O /opt/cartesi/share/images/rom.bin https://github.com/cartesi/machine-emulator-rom/releases/download/v0.2.1/rom.bin && \
    cd /opt/cartesi/share/images && ln -s linux-5.5.19-ctsi-1.bin linux.bin


ENTRYPOINT [ "/usr/local/bin/entrypoint.sh" ]

