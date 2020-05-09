FROM node:14.2.0

#WORKDIR /app/website

env BUILD_BASE=/tmp/build

ENV DEBIAN_FRONTEND=noninteractive

# Install workaround to run as current user
# ----------------------------------------------------
COPY entrypoint.sh /usr/local/bin/entrypoint.sh

RUN \
    chmod +x /usr/local/bin/entrypoint.sh

RUN \
    apt-get update && \
    apt-get install --no-install-recommends -y \
        git net-tools make ca-certificates wget vim wget curl \
        zip unzip lynx && \
    rm -rf /var/lib/apt/lists/*

RUN \
    mkdir -p $BUILD_BASE && \
    cd $BUILD_BASE && \
    git clone --branch v0.2 --depth 1 https://github.com/ncopa/su-exec.git && \
    cd su-exec && \
    if [ `git rev-parse --verify HEAD` != 'f85e5bde1afef399021fbc2a99c837cf851ceafa' ]; then exit 1; fi && \
    make && \
    cp su-exec /usr/local/bin/ && \
    cd .. && \
    \rm -rf su-exec

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

EXPOSE 3000

CMD ["/bin/bash", "-l"]
