.PHONY: build push run share

IMG:=cartesi/docs
PLAYGROUND_IMG:=cartesi/playground

build-server:
	docker build -t $(IMG) server

push-server: build-server
	docker push $(IMG)

pull-server:
	docker pull $(IMG)

run:
	docker run \
		 -e USER=$$(id -u -n) \
		 -e GROUP=$$(id -g -n) \
		 -e UID=$$(id -u) \
		 -e GID=$$(id -g) \
		 -v `pwd`:/home/$$(id -u -n) \
		 -p 3000:3000 \
		 -it \
		 -w /home/$$(id -u -n) \
		 --rm $(IMG)

run-server:
	docker run \
		 -e USER=$$(id -u -n) \
		 -e GROUP=$$(id -g -n) \
		 -e UID=$$(id -u) \
		 -e GID=$$(id -g) \
		 -v `pwd`:/home/$$(id -u -n) \
		 -p 3000:3000 \
		 -it \
		 -w /home/$$(id -u -n) \
		 --rm $(IMG) yarn start --no-open --host 0.0.0.0

build-playground:
	docker build -t $(PLAYGROUND_IMG) playground

run-playground:
	@docker run \
		 -e USER=$$(id -u -n) \
		 -e GROUP=$$(id -g -n) \
		 -e UID=$$(id -u) \
		 -e GID=$$(id -g) \
		 -v `pwd`:/home/$$(id -u -n) \
		 -it \
		 -h cartesi-sdk \
		 -w /home/$$(id -u -n) \
		 --rm $(PLAYGROUND_IMG) /bin/bash

