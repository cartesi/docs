---
title: Hello World machine
---

:::note Section Goal
- build the Hello World Cartesi Machine using `cartesi/playground`
- build script to store machine and make it available to the Cartesi Compute nodes
:::


## Introduction

Now that we have [built our basic DApp project](../helloworld/create-project.md), we will shift our focus towards the off-chain part of the DApp.

As we said before, our DApp's goal is to instantiate an off-chain computation that simply returns "Hello World!". In this context, the first step we'll take is to specify this computation as a *[reproducible and verifiable Cartesi Machine template](/machine/intro)*, so that on-chain code can safely execute the off-chain computation. This process is described below.

## Cartesi Playground

In order to specify and test our Cartesi Machine, we will make use of the `cartesi/playground` Docker image already showcased in the [Cartesi Machine host perspective section](/machine/host/overview/). With the playground, we will take advantage of numerous [Cartesi Machine features available at the command line interface](/machine/host/cmdline/).

First of all, create a directory called `cartesi-machine` within the `helloworld` project home directory, and `cd` into it:

```bash
mkdir cartesi-machine
cd cartesi-machine
```

To illustrate how we are going to use the playground, try executing the following command:

```bash
docker run \
  --rm cartesi/playground:0.5.0 cartesi-machine \
    --append-rom-bootargs="single=yes" \
    -- $'echo Hello World!'
```

Step by step, this command will execute the following tasks:
1. First of all, it will download the `cartesi/playground` Docker image and instantiate a container for it;
2. Then, it will run the `cartesi-machine` command within the image, whose only argument specifies the computation as "echo Hello World!". As such, the command will spin up a Cartesi Machine, print "Hello World" to the console, and power down.

The result of such a command will look like this:

```
Running as root
%tutorials.helloworld.run
```

## Cartesi Machine for the Hello World DApp

The machine instantiated above runs fine, however in order to make it usable by on-chain code we'll need to make a couple of improvements.

First of all, instead of *executing* the computation, we must specify the Cartesi Machine as a computation *template*. In practice, this means that no actual computation is to take place at the moment. Rather, we want the *computation specification* to be stored in a way that can later be executed by a Cartesi Compute node, upon request.

Other than that, we must specify the machine in such a way that the computation output can be actually *read* by the Cartesi Compute node. This means that, instead of simply printing "Hello World!" to the screen, we need to specify that the string should be written to an *output drive*, from which the Cartesi Compute node will be able to pick it up.

With these ideas in mind, let us look at a full-fledged Cartesi Machine specification that can be used by our Cartesi Compute DApp:

```bash
docker run \
  -e USER=$(id -u -n) \
  -e GROUP=$(id -g -n) \
  -e UID=$(id -u) \
  -e GID=$(id -g) \
  -v `pwd`:/home/$(id -u -n) \
  -w /home/$(id -u -n) \
  --rm cartesi/playground:0.5.0 cartesi-machine \
    --max-mcycle=0 \
    --append-rom-bootargs="single=yes" \
    --initial-hash \
    --store=stored_machine \
    --flash-drive="label:output,length:1<<12" \
    -- $'echo Hello World! | dd status=none of=$(flashdrive output)'
```

Let's take a closer look at what this means. First of all, we run the Docker container adequately mapping the current user and group information, so as to ensure generated files have the expected owner. Aside from that, we map the current directory on the host to the home directory within the container, and set that as the current working directory within the Docker container. As such, programs running inside the container have access to the host filesystem and can write files to it.

The most interesting part is of course within the Cartesi Machine command itself, where a number of new arguments should be noted. First of all, we define `max-mcycle=0` to ensure the machine does not execute a single cycle at all. Then, `initial-hash` is specified just so that the machine's *initial template hash* is printed on screen, which is helpful to keep track of what is being generated. This hash actually works as an *identifier* for the specified computation.

A vital argument for our tutorial is the `store=stored_machine` parameter, which specifies a directory where the machine template definition will be written to disk. This *stored machine* is what the Cartesi Compute node will use to actually perform the computation later on. Note that, since we have mapped the current directory using the Docker `-v` argument, this directory will be written to the host filesystem.

Another essential argument is `flash-drive="label:output,length:1<<12"`, which specifies that the Cartesi Machine now has a 4KiB output drive. As such, we can use that in our final command line `$'echo Hello World! | dd status=none of=$(flashdrive output)'`, which now determines that the bytes of our "Hello World!" string should be written to the specified output drive.

The console output when running the above command should be:

```
%tutorials.helloworld.store
```

This informs us that the machine's initial template hash is `%tutorials.helloworld.hash-trunc...`, that it did not run any cycles, and that it stored the machine specification. Looking within the specified `stored_machine` directory, we can indeed verify that the machine's contents were stored there:

```
ls stored_machine/
0000000000001000-f000.bin  0000000080000000-4000000.bin  8000000000000000-3c00000.bin  9000000000000000-1000.bin  config  hash
```

## Final implementation

Now that we have defined what our Hello World Cartesi Machine looks like, all we need to do is make the generated stored machine available to the Cartesi Compute nodes running inside the [Cartesi Compute SDK Environment](../compute-env.md).

In order to do that, we'll code a handy shell script that wraps it all up, so that it's easy to make changes to the machine if desired. Inside our `cartesi-machine` subdirectory, create a file called `build-cartesi-machine.sh`, and make sure it is executable:

```bash
touch build-cartesi-machine.sh
chmod +x build-cartesi-machine.sh
```

Edit the file and place the following contents into it:

```bash
# general definitions
MACHINES_DIR=.
MACHINE_TEMP_DIR=__temp_machine
CARTESI_PLAYGROUND_DOCKER=cartesi/playground:0.5.0

# set machines directory to specified path if provided
if [ $1 ]; then
  MACHINES_DIR=$1
fi

# removes machine temp store directory if it exists
if [ -d "$MACHINE_TEMP_DIR" ]; then
  rm -r $MACHINE_TEMP_DIR
fi

# builds machine (running with 0 cycles)
# - initial (template) hash is printed on screen
# - machine is stored in temporary directory
docker run \
  -e USER=$(id -u -n) \
  -e GROUP=$(id -g -n) \
  -e UID=$(id -u) \
  -e GID=$(id -g) \
  -v `pwd`:/home/$(id -u -n) \
  -w /home/$(id -u -n) \
  --rm $CARTESI_PLAYGROUND_DOCKER cartesi-machine \
    --max-mcycle=0 \
    --initial-hash \
    --append-rom-bootargs="single=yes" \
    --store="$MACHINE_TEMP_DIR" \
    --flash-drive="label:output,length:1<<12" \
    -- $'echo Hello World! | dd status=none of=$(flashdrive output)'

# defines target directory as being within $MACHINES_DIR and named after the stored machine's hash
MACHINE_TARGET_DIR=$MACHINES_DIR/$(docker run \
  -e USER=$(id -u -n) \
  -e GROUP=$(id -g -n) \
  -e UID=$(id -u) \
  -e GID=$(id -g) \
  -v `pwd`:/home/$(id -u -n) \
  -h playground \
  -w /home/$(id -u -n) \
  --rm $CARTESI_PLAYGROUND_DOCKER cartesi-machine-stored-hash $MACHINE_TEMP_DIR/ | tail -n 1)

# moves stored machine to the target directory
if [ -d "$MACHINE_TARGET_DIR" ]; then
  rm -r $MACHINE_TARGET_DIR
fi
mv $MACHINE_TEMP_DIR $MACHINE_TARGET_DIR
```

This script accepts an optional parameter specifying where the stored machine contents should be moved to. This is useful to specify the directory where the Cartesi Compute nodes effectively read stored machines. Moreover, the nodes expect machine directories to be named after the machine's template hash, so the script makes use of the `cartesi-machine-stored-hash` tool, available within the playground Docker, to extract that hash from the stored contents and properly name the final directory name.

Finally, if the [Cartesi Compute SDK Environment](../compute-env.md) is running in a relative directory at `../compute-env`, we can build the Hello World machine and make it available to the Cartesi Compute nodes by running:

```bash
./build-cartesi-machine.sh ../../compute-env/machines
```

The output should be the same as before, but now the contents will be neatly stored in the expected form within the Cartesi Compute environment's `machines` directory:

```bash
ls ../../compute-env/machines
%tutorials.helloworld.hash-full

ls ../../compute-env/machines/%tutorials.helloworld.hash-full/
0000000000001000-f000.bin  0000000080000000-4000000.bin  8000000000000000-3c00000.bin  9000000000000000-1000.bin  config  hash
```

And that's it, we now have running Cartesi Compute nodes that are capable of performing our Hello World computation!

Let's finish off by returning to the `helloworld` home directory:

```bash
cd ..
```
