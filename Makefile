.PHONY: build push run share

IMG:=cartesi/docs
PLAYGROUND_IMG:=cartesi/playground

build-server:
	docker build -t $(IMG) server
	docker run \
		 -e USER=$$(id -u -n) \
		 -e GROUP=$$(id -g -n) \
		 -e UID=$$(id -u) \
		 -e GID=$$(id -g) \
		 -v `pwd`:/home/$$(id -u -n) \
		 -w /home/$$(id -u -n) \
		 --rm $(IMG) "yarn"

push-server: build-server
	docker push $(IMG)

pull-server:
	docker pull $(IMG)

run-server:
	docker run \
		 -e USER=$$(id -u -n) \
		 -e GROUP=$$(id -g -n) \
		 -e UID=$$(id -u) \
		 -e GID=$$(id -g) \
		 -v `pwd`:/home/$$(id -u -n) \
		 -p 3000:3000 \
		 -w /home/$$(id -u -n) \
		 --rm $(IMG)

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
		 -h playground \
		 -w /home/$$(id -u -n) \
		 --rm $(PLAYGROUND_IMG) /bin/bash

