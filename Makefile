.PHONY: build-replacements replacements build-server install-server push-server pull-server run-server

PLAYGROUND_IMG:=cartesi/playground
REPLACEMENTS_IMG:=cartesi/docs-replacements
SERVER_IMG:=cartesi/docs-server

build-replacements:
	docker build -t $(REPLACEMENTS_IMG) replacements

replacements: build-replacements
	touch replacements.json
	docker run \
		 -e USER=$$(id -u -n) \
		 -e GROUP=$$(id -g -n) \
		 -e UID=$$(id -u) \
		 -e GID=$$(id -g) \
		 -v `pwd`:/home/$$(id -u -n) \
		 -w /home/$$(id -u -n) \
		 --rm $(REPLACEMENTS_IMG) node /opt/cartesi/docs-replacements/replacements.js ~/docs $$REPLACEMENTS_FILTER

build-server:
	docker build -t $(SERVER_IMG) server

install-server: build-server
	docker run \
		 -e USER=$$(id -u -n) \
		 -e GROUP=$$(id -g -n) \
		 -e UID=$$(id -u) \
		 -e GID=$$(id -g) \
		 -v `pwd`:/outside \
		 -w /outside \
		 --rm $(SERVER_IMG) yarn install --non-interactive

push-server: build-server
	docker push $(SERVER_IMG)

pull-server:
	docker pull $(SERVER_IMG)

run-server:
	docker run \
		 -e USER=$$(id -u -n) \
		 -e GROUP=$$(id -g -n) \
		 -e UID=$$(id -u) \
		 -e GID=$$(id -g) \
		 -v `pwd`:/outside \
		 -w /outside \
		 -p 3000:3000 \
         -it \
		 --rm $(SERVER_IMG)
