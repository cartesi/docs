.PHONY: build-playground run-playground

PLAYGROUND_IMG:=cartesi/playground

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

