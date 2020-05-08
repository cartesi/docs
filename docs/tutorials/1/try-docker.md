---
title: Trying out Docker
---

## Listing images

In the previous section, you have told Docker to run the `hello-world` image, and Docker downloaded it for you.

To list all of your locally-installed Docker images:

```
docker images
```

You can also type `docker image ls`, `docker image list` and `docker image images`. They all work the same.

Listing your images right now should print something like this:

```
REPOSITORY                 TAG                 IMAGE ID            CREATED             SIZE
hello-world                latest              fce289e99eb9        12 months ago       1.84kB
```

Docker images can be versioned, so when you executed `docker run hello-world`, you specified the `REPOSITORY` of the image, which can really mean an entire collection of actually different image files, all of them considered to be a "version" of some concept or application that we have called `hello-world`. The `TAG` specifies the version, and `latest` is not really a magical version; `latest` is just the default version name that the Docker client uses whenever you don't specify one.

Cartesi Docker files all have a repository (name) that looks like `cartesi/xxx`, where `xxx` is the name of one of the software components we have created. The Cartesi Project owns the `cartesi/` prefix on Docker Hub, so you can know any images from Docker Hub that have it as a repository (name) prefix are from us.

All image files in docker are identified by a secure cryptographic hash that's generated from their binary content. The `IMAGE ID` is the prefix of that secure hash, and it serves as an unique identifier of a specific image file that has a specific content. If you refer to an image by, say, `hello-world:latest`, you will get whatever actual image content that the owners of the `hello-world` repository (name) have associated with that repository and the `latest` version/tag name. But if you refer to that image as `fce289e99eb9`, you're guaranteed to get the exact same image, byte-by-byte, that we used to run this tutorial (assuming that you already have a copy of it, or that it's still available for download).

## Listing containers

Also as part of following the Docker installation instructions, you have told Docker to run the `hello-world` image, meaning that Docker created a container from that image and executed it as a containerized process in your machine.

To list currently running Docker containers:

```
docker ps
```

You can also type `docker container ps`.

It should show no containers, because the "Hello World" application has already exited:

```
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
```

To display all containers, including ones that have already finished, but that can still be inspected:

```
docker ps -all
```

Which should yield something like this:

```
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS                      PORTS               NAMES
8e959fcb616c        hello-world         "/hello"            10 minutes ago      Exited (0) 10 minutes ago                       vigilant_zhukovsky
```

Containers are referenced by their `CONTAINER ID`, which is essentially an unique (random) number generated for every container that is created.

We can now remove the container we created to run the `hello-world` image (replace `YOUR-CONTAINER-ID` below with the `CONTAINER ID` that was generated on your machine):

```
docker container rm YOUR-CONTAINER-ID
```

If you list all containers after that command, you should see that you have no containers left at all.

## Learning Docker

That was just a quick overview to get you started. Docker has many tutorials and other learning resources available online. You can get started with <https://docs.docker.com/>, which is Docker's own documentation hub. If you run into problems, some [StackOverflow](https://stackoverflow.com/questions/tagged/docker) user has probably suffered it already and posted a question about it online, and someone else has probably already posted an answer to that question. So, as a beginner, you will probably be able to solve most of your Docker issues with a bit of Googling.    

