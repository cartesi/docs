---
title: Creating the Greetings machine
---

Now we are going to build the Greetings application's Cartesi machine.

## Create a Dockerfile for the Greetings app image

As with the [preceding Hello World exercise](hello-machine#create-a-dockerfile-for-the-hello-world-app-image), we are going to create a Docker image that contains both the Cartesi machine emulator and our application to be run by the emulator.

Create a file named `Dockerfile` in your project directory, and put these instructions in it:

```
FROM cartesi/machine-emulator:0.1.0

WORKDIR /opt/cartesi/greetings

RUN apt-get update
RUN apt-get -y install wget
RUN wget https://github.com/cartesi/image-kernel/releases/download/v0.2.0/kernel.bin
RUN wget https://github.com/cartesi/machine-emulator-rom/releases/download/v0.2.0/rom.bin
RUN wget https://github.com/cartesi/image-rootfs/releases/download/v0.2.0/rootfs.ext2

COPY greetfs.ext2 .

ENTRYPOINT [ "/opt/cartesi/bin/luapp5.3" ]

CMD [ "/opt/cartesi/lib/luapp/5.3/cartesi-machine.lua", "--dapp-backing=greetfs.ext2", "--dappin-backing=vol/infile", "--dappout-backing=vol/outfile", "--dappout-shared", "--cmdline=-- /mnt/dapp/greetings.sh" ]
```

The only differences from the Hello World application's `Dockerfile` are the change in the application filesystem file (which we are calling `greetfs.ext2` now) and the arguments passed to `cartesi-machine.lua`.

The argument `--dappin-backing=vol/infile` will end up telling the emulator to mount an additional input device named `dappin` whose contents will be drawn from a file which can be found at the `vol/infile` location. However, that location, which is relative to the `WORKDIR` and so resolves to `/opt/cartesi/greetings/vol/infile` within the image, _does not yet exist_. In fact, after the Docker image is created, if you inspect the filesystem that is created inside of the image, there will be _no_ directory called `/opt/cartesi/greetings/vol/`, at all. So where will that directory come from, and when will it be made accessible to our running Docker container that we will spawn from our Greetings application image?

We mentioned before, when showing how to use the `cartesi/toolchain` image, that Docker has a support for _volumes_. A Docker volume is a directory mounted (created) inside of a running container that was not present in the image used to create that container. That is, you can start with an image and the filesystem that it describes, and when you start a Docker container from that image, you can _add_ directories to it at runtime. Thus, you can add input data for your Docker application at `docker run` time which you did not have available at `docker build` time. That is done using Docker volumes.

That makes sense for us: we want our application, which takes someone's name as input, to take a different name from every person that's going to use our application. The `vol/infile` backing binary file for the input drive is there to contain the application user's name, which is determined at run time. Anyone running our application image on their machine must be able to provide their own `infile`, and thus their own names for the Greetings app.

Similarly, the argument `--dappout-backing=vol/outfile` will emulate a device named `dappout` with `vol/outfile` as its backing file. When the emulator is started by `cartesi-machine.lua`, the `outfile` must already exist, just like the `infile`, but it will be a zeroed-out file, representing a blank device that is ready to receive data. Then, our application within the emulator will write to the output drive, which the emulator will translate to writing to the `vol/outfile` that backs it. The customized `"Greetings, XXX!"` message that is the output of our application will thus appear in the user's filesystem, as a null-terminated ASCII string at the beginning of `outfile`, when the user runs our application's Docker image.

Finally, the `--dappout-shared` argument tells the emulator that the backing file of the `dappout` device (that is, `vol/outfile`) is to be memory-mapped in the emulator in such a way that writes to the device within the emulator are reflected into the backing file. In other words, `dappout` will be both an input and an output file to the emulator. The emulator understands any `--YYY-shared` option, where `YYY` is the device to enable shared-mode for (i.e. make its backing file writable by the emulator). Devices are not shared by default, meaning that the emulator will apply copy-on-write semantics to them. In other words, writes to non-shared devices are applied to a copy of the backing file's data that is made by the running emulator, not to the backing file itself. That means non-shared devices are, effectively, read-only devices as far as the world outside of the emulator is concerned.

We will see how to create the missing Docker volume, and both `infile` and `outfile`, when we get to running the application image below.

## Build the Greetings app image

The command below should build our application's image.

```
docker build . -t greetings-dapp
```

As with the "Hello World" application's Docker image, it should spend a couple minutes downloading the latest binary assets that the emulator needs.

## Create the application's input and output files

Inside your application project's directory, create a subdirectory `vol`, and move into it.

```
mkdir vol ; cd vol
```

Create a text file with an input name to our Greetings application.

```
echo "Rene Descartes" > infile
```

The created `infile` should be very small (one byte per ASCII character, plus a new-line byte), but the emulator expects flash drives to have a 4,096-byte page size. So we need to extend `infile` with zeroes by using the `truncate` utility.

```
toolchain_exec.sh truncate -s %4096 infile
```

Finally, the following command creates a 4Kb "empty" (i.e. zeroed-out) file named `outfile`, provided that `outfile` doesn't already exist (if it already exists, then you must delete it first):

```
toolchain_exec.sh truncate -s 4096 outfile
```

Now, go back to your project directory.

```
cd ..
```

You should now have a `vol` subdirectory, under your current (project) directory,  which contains both an input and an output drive backing file in it, named `infile` and `outfile` respectively, both of which are 4,096 bytes long. A null-terminated ASCII string can be read starting from the beginning of `infile`, while `outfile` is completely zeroed-out.

## Run the Greetings app

You can run the application with the following command (make sure you are in your project directory, otherwise it won't work, because we are using the `` `pwd` `` command below to substitute for your current directory):

```
docker run -v `pwd`/vol:/opt/cartesi/greetings/vol greetings-dapp
```

The ``-v `pwd`/vol:/opt/cartesi/greetings/vol`` argument to `docker run` creates a volume mapping for the running container. It mirrors the directory in your host machine that is at `` `pwd`/vol`` (that is, the `vol` subdirectory under your current directory, where the `infile` is) to the `/opt/cartesi/greetings/vol` directory inside of the running container. Thus, the container process is now able to see the binary `infile` we have just created at the absolute path `/opt/cartesi/greetings/vol/infile`.

Our application code should have read the input name from `vol/infile`, and written a customized greeting message to the beginning of the `vol/outfile` shared backing file. You can check it out by executing the following command from within your project directory:

```
cat vol/outfile
```

You should then see something similar to the following in your terminal:

```
Greetings, Rene Descartes!
```

Like `infile`, the `outfile` has ASCII string data in its beginning, and is padded with thousands of zeroed-out bytes. Although the `cat` utility that we used just ignores that padding for us, you must remember that the flash drives of your Cartesi machines are binary files which are often padded to the 4 kilobyte page size, and thus handle them with the proper care. Make sure they have enough space to contain your data, and make sure to handle the padding properly. For each one of your emulated flash devices, you can choose to back it with either a raw file or a filesystem file. For filesystem mounting support, all you have to do is make sure that the backing file for the device you're creating is in a filesystem format that the emulator understands, such as the `ext2` volumes we have used in these tutorials for the Hello and the Greetings applications code drives.

Congratulations! You have successfully created your first Cartesi machine with inputs and outputs!

## Conclusion

A Cartesi machine expresses an application-specific computation. The inputs to the Cartesi machine are the inputs to the computation to be performed, and its outputs are deterministic and reproducible, given the same inputs. Cartesi allows on-chain DApps to mathematically ensure that, given the same starting machine state (such as a Linux OS loaded with some application code) and the same application inputs (such as the parameters for a specific round of computation), that the application output values can be given, and proven, to that on-chain DApp, as long as there is at least one party to the computation that is interested in computing that correct output value and disputing any incorrect results reported by other participants.

In following tutorials, we will show how to write complete blockchain DApps that use the Cartesi machines that you have just learned to build and run.