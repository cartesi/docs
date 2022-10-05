FROM cartesi/playground:0.5.0

RUN \
    apt-get update && \
    apt-get install --no-install-recommends -y \
        curl && \
    rm -rf /var/lib/apt/lists/*

RUN \
    curl -sL https://deb.nodesource.com/setup_14.x | bash - && \
    apt-get install -y nodejs

ENV BASE /opt/cartesi
WORKDIR $BASE/docs-replacements

COPY ./package.json ./package.json
COPY ./replacements.js ./replacements.js
RUN npm i
