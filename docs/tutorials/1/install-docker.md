---
title: Installing Docker
---

Developing with Cartesi tools implies frequent use of and interaction with [Docker](https://docker.io). If you already have installed Docker, and knows what Docker is, you can skip this page. If you don't, read on; we got your back!

## What is Docker?

Docker (which we are about to install on your machine) acts as a kind of virtual machine service. That is, a _service_, as in a program that starts up when your machine boots up (so that it is always there to serve your needs), and a _virtual machine_ service, in that the service awaits commands from you that tell it to fire up and manage multiple virtual machines running on top of your local ("host") operating system and hardware.

By "virtual machine" here, we mean virtual machines in a conceptual sense. Docker does not do the kind of virtualization that VMWare or VirtualBox do, which is what we think about when we refer to "virtual machines" these days. While these offer more isolation from the host's system and from other running processes, they are much slower to use (we have to boot up an entire guest OS every time we start a VMWare or VirtualBox VM), and can end up using up much more RAM and storage space than Docker does.

Docker runs programs written for the _same_ operating system that is already installed on your machine, but it runs these programs inside of a _container_. What that means is that these _containerized_ application processes (which we refer to as "docker containers") are both running inside of a _sandboxed_ (protected, isolated) environment, while also running as fast as any other regular, non-containerized program ([usually](https://stackoverflow.com/a/26149994/6854799)).

And the killer feature of Docker is that a containerized process started with Docker gets its own private file system! What that means is that if you run some program with Docker in your own machine, and you want a friend to run the exact same Docker program in the exact same installation environment, all they have to do is download the _Docker image file_ that you used to run your program. The Docker image file contains not only your application data files, but the _entire_ file system that your program sees, which means it only runs in your machine (and anybody else's) if you have really put _all_ of the dependencies and configurations in the image file. Thus, your friend will not need to spend any time resolving package installation or configuration problems: the Docker image you gave them is guaranteed to have _everything_ they need to run your program on their machine! (Of course, your application can still behave differently and fail if your container reads anything that's not included in its image file, but most of the set-up nonsense required to get software running on a different machine will be gone).

So, if you want to create, say, an SDK for other developers, you can simply distribute Docker images of your development environment to the users of your SDK, which includes the SDK and all of its dependencies -- and modern software development stacks usually have lots and lots of dependencies! We at Cartesi love Docker for that reason, and we bet you're going to love it too!

## Installing Docker

To install Docker, you can follow the [official Docker Engine installation instructions from the Docker website](https://docs.docker.com/install/).

However, as we mentioned earlier, The Cartesi Tutorials will provide _every single command_ that you need to run in your shell to turn an Ubuntu machine into a fully-fledged Cartesi development environment.

Thus, we begin by reproducing, below, the Docker installation steps that we have verified as working for a fresh Ubuntu installation. That is, if you are starting with a fresh copy of the latest Ubuntu LTS installed in your machine, you should never need to leave this tutorial for an external website to get something installed. And if some tutorial step doesn't work for you, and you have tried it in a clean Ubuntu LTS installation, then that could be a bug in the tutorials, and you can discuss it in our [Discord channel](learning-resources#public-support-chat)).

So, let's begin the [Docker Engine installation for Ubuntu](https://docs.docker.com/install/linux/docker-ce/ubuntu/). Unfortunately, Ubuntu's own distribution of Docker packages (from the official, built-in Ubuntu software repositories) are outdated and don't work, at least in what is the latest Ubuntu LTS version at the time of this writing (Ubuntu 18.04). So we begin by teaching your local Ubuntu installation about Docker's own software repository, so that we can always get the latest and greatest version of Docker directly from its creators:

```
sudo apt-get update
```
```
sudo apt-get install apt-transport-https ca-certificates curl gnupg-agent software-properties-common
```
```
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
```
```
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
```

And now we are going to install Docker directly from Docker's own repository:

```
sudo apt-get update
```
```
sudo apt-get install docker-ce docker-ce-cli containerd.io
```

And now we are going to download and run a "Hello, World!" Docker application, to check that our Docker installation is working properly:

```
sudo docker run hello-world
```

It should ask you to enter your sudo (i.e. `root` user account) password, and then print something like this:

```
[sudo] password for user: 
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
1b930d010525: Pull complete 
Digest: sha256:d1668a9a1f5b42ed3f46b70b9cb7c88fd8bdc8a2d73509bb0041cf436018fbf5
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/
```

The "docker client" mentioned above is the `docker` command you just executed (it's the "docker" in `sudo docker run hello-world`), and the "docker daemon" mentioned above is the Docker service.

The "docker image" mentioned above is a file that completely describes the "Hello World" command-line application that you have executed.

The [Docker Hub](https://hub.docker.com/) is a "Docker registry," which is a place where people can upload Docker images to, and download theirs or other people's Docker images. The Docker Hub is, in practice, the registry that everyone uses, since it is maintained by the company behind the Docker software. The Docker client is configured to search the Docker Hub by default when you run something like `sudo docker run hello-world`, which is a command to create a Docker container process from a Docker image file named `hello-world`. Since you just installed Docker and had no images installed locally, the client asked Docker Hub and found a public image named `hello-world`. Your Docker client downloaded it from Docker Hub and started a Docker container (a running process) based on the filesystem and program execution instructions bundled inside of the `hello-world` image file.

## Run `docker` as a non-root user

Before we continue, let's get rid of that `sudo`.

First, add your username (what the `$USER` shell variable contains) to the `docker` group:

```
sudo usermod -aG docker $USER
```

For that change to take effect, you need to fully log out of your current user session and then log back in. Meanwhile, just type this in your current shell to activate changes to group membership, so we can continue for now (remember to log out or reboot later):

```
newgrp docker
```

And you should now be able to run `docker` without `sudo`:

```
docker run hello-world
```

Ah, that's much better!

That concludes Docker installation. In the next section we will learn to list installed images and running containers. 