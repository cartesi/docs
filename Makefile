.PHONY: build push run share

IMG:=cartesi/docs

build:
	docker build -t $(IMG) docker

push: build
	docker push $(IMG)

pull:
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
