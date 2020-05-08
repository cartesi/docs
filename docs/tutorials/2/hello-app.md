---
title: Creating the Hello application
---

In this section, we will write a trivial "Hello, World!" application that takes no input and produces no output whatsoever, and package it. In the next section, we will build a Cartesi Machine with it.

## Coding the application

Open a shell (terminal window), and create and enter a clean working directory for this exercise (e.g. `~/hello_machine`).

Let's write our application:

```
echo "echo Hello, World!" > hello_world.sh 
```

The `hello_world.sh` executable shell script file that has just appeared in your current working directory is our entire business logic.

## Packaging the application

For our `hello_world.sh` file to appear inside of the emulator's filesystem, we must first package it inside an [ext2 filesystem](https://en.wikipedia.org/wiki/Ext2) file. To do that, we will use the `genext2fs` utility, which is included in the Cartesi RISC-V toolchain image [that you have just downloaded](setup).

First, we need to move our shell script into a subdirectory for the filesystem contents to be packaged into an `ext2` file. We will call that subdirectory `fs`, and put the `hello_world.sh` file in it:

```
mkdir fs
```
```
mv hello_world.sh fs
```

Enter the following command, which should create the `hellofs.ext2` filesystem file in your current directory, using the `fs` subdirectory we just created, and all files within it (i.e. the `hello_world.sh` application file) as the content of `hellofs.ext2`:

```
docker run --hostname toolchain-exec --rm -e USER=$(id -u -n) -e GROUP=$(id -g -n) -e UID=$(id -u) -e GID=$(id -g) -v `pwd`:/opt/cartesi/workdir -w /opt/cartesi/workdir cartesi/toolchain genext2fs -f -b 1024 -d fs hellofs.ext2
```

In the above `docker run` command, the `-v` argument creates a _Docker volume_ that allows the container to read and write files from its host machine. Thus, your current working directory (obtained through the `` `pwd` `` command above) is mapped (`:`) to `/opt/cartesi/workdir` inside of the running toolchain container. Thus, the `/opt/cartesi/workdir` directory inside of the toolchain container will mirror your current working directory in your machine, which should be your Hello World app project directory (which contains the `fs` subdirectory that we are interested in giving to `genext2fs` inside the container).

As for the `genext2fs` arguments, `-d fs` specifies the path to the subdirectory that will be read as input and packed inside of the `ext2` filesystem file that will be written. The `-w /opt/cartesi/workdir` argument to `docker run` sets the working directory inside of the container, so `-d fs` is relative to that working directory, and so `genext2fs` will expect that input `fs` directory at `/opt/cartesi/workdir/fs` inside the container. The output file (the generated `ext2` file) will be written in the same directory that `genext2fs` is invoked, which, inside the container will be the `/opt/cartesi/workdir` working directory which, as we have seen, maps to the current working directory in the host machine. 

The `-b 1024` argument to `genext2fs` specifies that an one-megabyte volume will be created. In the case of our "Hello World" application, that is overkill, but it important to remember to allow enough space for all the components when you are creating input data drives for your own DApps.

> **NOTE:** The emulator **_requires_** all filesystem files to have a size that is a multiple of 4,096 bytes (4 kilobytes). That is because 4 kilobytes is the page size of RISC-V, and all devices must be aligned to page boundaries and mapped to whole pages.

If all went well, you should have a binary `hellofs.ext2` file that has exactly 1,048,576 bytes in it. That is our application code, packaged into an `ext2` filesystem file.

## Debugging `ext2` files

Let's take a peek inside our "hellofs" filesystem. Give it to the interactive program `debugfs`:

```
debugfs hellofs.ext2 -R "ls -l"
```

You should see something like this:

```
2    40755 (0)      0      0    1024 31-Dec-1969 21:00 .
2    40755 (0)      0      0    1024 31-Dec-1969 21:00 ..
11   40700 (0)      0      0   52224 31-Dec-1969 21:00 lost+found
12  100755 (0)   1000   1000      19 16-Jan-2020 09:55 hello_world.sh
```

You can press the `q` key to exit the directory listing screen inside of `debugfs`.

Is that really our `hello_world.sh` file in there? Let's check:

```
debugfs hellofs.ext2 -R "cat hello_world.sh"
```

You should see something like this:

```
debugfs 1.44.1 (24-Mar-2018)
echo Hello, World!
```

Yep, that's our file! (The first line is just a `debugfs` greeting).

## Creating a toolchain helper script

Next, we will use the toolchain again to make sure our `hellofs.ext2` file is rounded up to a multiple of 4,096 bytes. But first, let's create a shell script to hide the complexity of invoking the toolchain image.

Create a `toolchain_exec.sh` file, and put the following line in it:

```
docker run --hostname toolchain-exec --rm -e USER=$(id -u -n) -e GROUP=$(id -g -n) -e UID=$(id -u) -e GID=$(id -g) -v `pwd`:/opt/cartesi/workdir -w /opt/cartesi/workdir cartesi/toolchain "$@"
```

Make that script file executable:

```
chmod a+x toolchain_exec.sh
```

Test our new script. The following command should list the contents of your machine's current directory (since the toolchain image has the `ls` command too).

```
./toolchain_exec.sh ls -l
```

Now, move the `toolchain_exec.sh` file to a location in your machine that is in your executable search path (i.e. your `$PATH` environment variable). If you do not already have such a location in your machine for storing useful executable scripts, now would be a good time to create it.

## Ensuring device files match the page size 

In case you create an `ext2` file whose size is not a multiple of 4,096 bytes (as **_required_** by the emulator), you can use the `truncate` utility as shown below to extend the file with zeroed-out bytes until its size is a multiple of 4,096 bytes:

```
toolchain_exec.sh truncate -s %4096 hellofs.ext2
```

> **NOTE:** The above command assumes that you have placed the `toolchain_exec.sh` script somewhere reachable by your `$PATH`. If it's still in the current directory, you will have to add the `./` prefix to it.

The above command will run the `truncate` utility to ensure that `hellofs.ext2` has a byte length that is a multiple of 4,096 bytes by appending zeroed-out bytes as needed to it. Since the file is exactly one megabyte long (1,048,576 bytes), nothing will be done to the file as its length is already a multiple of 4,096 bytes. Nevertheless, it may be a good idea to integrate `truncate` in your workflows to make sure all your device backing files will match what the emulator expects. 

