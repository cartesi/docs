---
title: Creating the Hello machine
---

Now we are going to build a Cartesi Machine around the DApp code by creating a Docker image that contains:

- Everything that the Cartesi-provided `cartesi/machine-emulator` image contains,
- Our `hellofs.ext2` filesystem, which contains our `hello_world.sh` reproducible computation, and
- Additional code for teaching the machine emulator about `hellofs.ext2` and what to do with it.

The resulting Docker image, which will be referred to as `hello-dapp` below, will _be_ a Cartesi Machine. Since it is a Docker image, it carries all of its software dependencies within it, so you can just give the image to anybody and they will be able to easily use your machine to reproduce and verify any computation that uses that same machine.

## Create a Dockerfile for the Hello World app image

Create a text file called `Dockerfile` in your project directory and put the following in it:

```
# Start with Cartesi's machine emulator image
#
#   (Replace the ":#.#.#" image tag below with the specific
#    version that you want to use)

FROM cartesi/machine-emulator:0.1.0

# Create the directory "/opt/cartesi/hello" to be the default
#  directory for every file that we will copy into the image.

WORKDIR /opt/cartesi/hello

# Download the binary files required by the emulator to run Linux.
# They will be placed in the WORKDIR.
#
#   (Replace "/v#.#.#/" below with the specific version of
#    each component that you want to use)

RUN apt-get update
RUN apt-get -y install wget
RUN wget https://github.com/cartesi/image-kernel/releases/download/v0.2.0/kernel.bin
RUN wget https://github.com/cartesi/machine-emulator-rom/releases/download/v0.2.0/rom.bin
RUN wget https://github.com/cartesi/image-rootfs/releases/download/v0.2.0/rootfs.ext2

# Copy the filesystem file we created with our application code
#  into our machine image.

COPY hellofs.ext2 .

# We start up a Lua language interpreter when we run this image.
# The Lua interpreter is already included in the image.

ENTRYPOINT [ "/opt/cartesi/bin/luapp5.3" ]

# The first argument passed to the Lua interpreter is the Lua script code to
#   be run. We will run "cartesi-machine.lua", which is the Cartesi Machine
#   launching script file that's already included in the image.
# The following arguments are passed to the script. They are how the emulator
#   will get to know how to run our Hello World application.

CMD [ "/opt/cartesi/lib/luapp/5.3/cartesi-machine.lua", "--dapp-backing=hellofs.ext2", "--cmdline=-- /mnt/dapp/hello_world.sh" ]
```

A `Dockerfile` is a file used by Docker to build an image. Docker knows how to build an image based on another image, and that is what the first command in the file, `FROM cartesi/machine-emulator`, does. Essentially, we are taking the standard Cartesi Machine Emulator image, which contains only the machine emulator and what it needs to run, and adding our application to it.

We begin customizing our new, derived machine emulation image, with the command `WORKDIR /opt/cartesi/hello`, which creates that directory inside of the image, and sets it as the default (current) working directory for the following commands. All of our application files will be placed in that directory within the image.

The following `RUN` commands will install [wget](https://en.wikipedia.org/wiki/Wget) and then download the `kernel.bin`, `rom.bin` and `rootfs.ext2` components from their respective Cartesi GitHub repository release pages, and put them in the image's `WORKDIR` directory that we have specified.

The `COPY hellofs.ext2 .` command will copy the application filesystem file we have created in the previous tutorial step, which is sitting in your current directory of your local machine as `hellofs.ext2`, to the `.` (current) directory in the image (i.e. the `WORKDIR` we specified).

> **NOTE:** The Dockerfile command `COPY`'s first argument is always relative to your current directory in your machine, and the second argument is always relative to the virtual `WORKDIR` directory within the image that is being created.

Now we have all the four basic input data files needed to run our application. However, we still need to actually call the emulator executable and pass it all of the configuration it requires to start up and run what we need it to run. The `cartesi-machine.lua` tool, which is already included in the `cartesi/machine-emulator` base image, will help us do that.

Then, we have the `ENTRYPOINT [ "/opt/cartesi/bin/luapp5.3" ]` command. The `ENTRYPOINT` command is how Docker knows what to tell a container to run when you invoke `docker run MY-IMAGE-NAME`. So, when we run that image that we are creating here, Docker will create a container (process) with the `cartesi/machine-emulator` image's filesystem plus our custom `/opt/cartesi/hello` directory that contains our `hellofs.ext2` addition, and then run the file `/opt/cartesi/bin/luapp5.3` inside the container, which happens to be a binary Linux executable (an interpreter for the Lua programming language, version 5.3).

The `CMD` command, when used after an `ENTRYPOINT` command, specifies an array of command-line options to the `ENTRYPOINT`. So, the array of strings we are passing to `CMD` are the command-line options we are passing to the Lua interpreter by default. That is, if we just run `docker run MY-IMAGE-NAME` to run our image, Docker will launch a container process that will run a command string that is the whitespace-separated concatenation of the `ENTRYPOINT` string and the `CMD` string array.

The first argument passed to the Lua interpreter is `/opt/cartesi/lib/luapp/5.3/cartesi-machine.lua`, which is the full path to the `cartesi-machine.lua` tool that is in the emulator docker image. It is a script that knows how to configure and start up the Cartesi machine emulator for simple use cases.

The `cartesi-machine.lua` emulator launcher is not aware of our "Hello, World!" application by default. So, we need to give it some command-line arguments that tell it where our application is. Fortunately, all of the remaining arguments specified in the `CMD` array are options forwarded to the `cartesi-machine.lua` command-line tool itself, and we will use those to tell the launcher about our application.

The first launcher argument is `--dapp-backing=hellofs.ext2`, which specifies the filesystem file that contains our application. The launcher actually understands any argument in the form of `--YYY-backing=XXX`, where `YYY` is the name of the emulated flash drive (device) that will be mounted from the `XXX` device backing file. Thus, we are choosing `dapp` as the name of the device to be mounted within the emulator. Devices are mounted under `/mnt`, so the files within our `hellofs.ext2` filesystem will become available under the `/mnt/dapp/` path inside the emulator.

The `--cmdline=XXX` argument to `cartesi-machine.lua` specifies what command-line arguments to pass on to the emulator executable itself. The full path to an executable that the emulator should run, if any, is always the last argument passed to the emulator. For the emulator to understand it, you must prefix it with a `--` (two dashes) argument, and then enter the path to the executable that the emulator should run as a following argument. For our application, the executable is the `hello_world.sh` script that can be found as `/mnt/dapp/hello_world.sh` inside of the emulated Linux OS.

And that should be sufficient to launch our "Hello, World!" application inside of our Cartesi Machine.

## Build the Hello World app image

The following command will instruct Docker to build an image named `hello-dapp` from the instructions contained in an input file named `Dockerfile` in the current directory.

```
docker build . -t hello-dapp
```

This will take a few minutes, as Docker has to download and install a few pieces of software, as we have specified in our `Dockerfile`.

> **NOTE:** The section with all of the `RUN` commands in the `Dockerfile` can be replaced by `COPY` commands for the Kernel, ROM and RootFS assets, if the user is required to download these assets themselves prior to running `docker build`. That makes the image building step faster, but slightly less convenient.

If all went well, that should successfully build the Hello World app image, and assign it the `hello-dapp` name and the `latest` version tag. Our custom Cartesi Machine is finally built!

## Run the Hello World app

Let's check that our Cartesi Machine is working. The following command will tell Docker to run our application's image inside of a new container.

```
docker run hello-dapp
```

The emulator should run for a few seconds, and return control to your shell. The tail end of the emulator output should look something like this:

```
[    0.020000] 1 cmdlinepart partitions found on MTD device flash.0
[    0.020000] Creating 1 MTD partitions on "flash.0":
[    0.020000] 0x000000000000-0x000003c00000 : "root"
[    0.020000] 1 cmdlinepart partitions found on MTD device flash.1
[    0.020000] Creating 1 MTD partitions on "flash.1":
[    0.020000] 0x000000000000-0x000000100000 : "dapp"
[    0.020000] NET: Registered protocol family 17
[    0.020000] VFS: Mounted root (ext2 filesystem) on device 31:0.
[    0.020000] devtmpfs: mounted
[    0.020000] Freeing unused kernel memory: 144K
[    0.020000] This architecture does not have kernel memory protection.
[    0.020000] Run /sbin/init as init process
Hello, World!
[    0.040000] reboot: Power down
```

Tha "Hello, World!" line there is the output of our app, `hello_world.sh`, from within the emulator! It is printed as a side-effect of Docker running `cartesi-machine.lua`, and `cartesi-machine.lua` properly starting the emulator, and instructing it to run `hello_world.sh` (from the `hellofs.ext2` application input drive that is correctly mounted inside of the emulator thanks to `cartesi-machine.lua`'s interaction with the machine emulator's Lua scripting API) while redirecting the emulated application's output to its own standard output, which is captured by Docker, which finally ends up on your screen.

Our application always does the same thing, taking no input and producing no verifiable output based on that input. The "Hello, World!" line that is printed by the emulator does not count as verifiable output, and the application code itself (that is, `hello_world.sh`) does not really count as "user input," as it is not determined at run-time by the intended user, but rather the developer. Useful computations will take at least one input file (an input device for the emulator) that is provided by the application's intended user at run time, and produce at least one output file (an output device for the emulator) that is read by the application's user after the emulator finishes.

It would be great if our "Hello, World!" application could take someone's name as input, and output a `Greetings, YOUR-NAME!` message not only in the emulator's standard output, but in an actual machine output file whose contents will be deterministic given the same inputs to the machine. Fortunately, the `cartesi-machine.lua` emulator launcher can also mount binary input and output files directly, as raw devices. Next, we will use that feature to implement a greeter app that outputs a customized message for an input name determined by the user at runtime.
