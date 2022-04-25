---
title: Generic Script machine
---

:::note Section Goal
- learn how to build a Cartesi Machine with a customized root file-system
- build a machine that executes a generic script, triggering the appropriate interpreter
:::


## Cartesi Machine with custom root file-system

In the [previous section](../custom-rootfs), we generated a `rootfs-python-jwt.ext2` file specifying a custom root file-system that includes the Python3 interpreter and the PyJWT library. With that ready, we can now try it out with a Cartesi Machine by using the `cartesi/playground` Docker image.

First, let's create a test input script written in Python. Create a file named `input.py` in the `generic-script/cartesi-machine` directory and place the following contents into it:

```python
#!/usr/bin/python3
import jwt
payload = jwt.decode(b'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzb21lIjoicGF5bG9hZCJ9.Joh1R2dYzkRvDkqv3sygm5YyK8Gi4ShZqbhK2gxcs2U', 'secret', algorithms=['HS256'])
print(payload)
```

This script will load the PyJWT library and use it to decode a specific JWT token using key `secret` and the `HS256` algorithm. It will then print the resulting decoded payload to standard output.

Now, let's run the playground Docker image in interactive mode, mapping the current working directory:

```bash
docker run -it --rm \
  -e USER=$(id -u -n) \
  -e GROUP=$(id -g -n) \
  -e UID=$(id -u) \
  -e GID=$(id -g) \
  -v `pwd`:/home/$(id -u -n) \
  -w /home/$(id -u -n) \
  cartesi/playground:0.3.0 /bin/bash
```

Inside the playground, let's run the truncate tool to ensure the input file has an adequate size, as we did before for the [Calculator Cartesi Machine](../../calculator/cartesi-machine#performing-calculations-with-a-cartesi-machine):

```bash
truncate -s 4K input.py
```

At this point, we can run a Cartesi Machine that uses the customized root file-system and executes the test script using the `python3` interpreter:

```bash
cartesi-machine \
  --flash-drive="label:root,filename:rootfs-python-jwt.ext2" \
  --flash-drive="label:input,length:1<<12,filename:input.py" \
  -- $'dd status=none if=$(flashdrive input) | lua -e \'print((string.unpack("z",  io.read("a"))))\' | python3'
```

In the machine above, the `rootfs-python-jwt.ext2` file is mapped to the `root` drive (and hence mounted as `/mnt/root`). The final command line will read the input script from file `input.py`, use a tiny Lua script to ensure data is read as a null-terminated string, and pipe that string into the `python3` interpreter, producing the following output:

```
%tutorials.generic-script.run
```

Where `{'some': 'payload'}` is the actual payload encoded in the JWT token described in the input script. This assures us that the machine is now indeed capable of running arbitrary Python scripts, thanks to our customized root file-system.

We can now exit the playground Docker by typing:

```bash
exit
```

## Final Cartesi Machine implementation

Now that we have learned how to run a Python script inside a Cartesi Machine, we can write a full implementation that is capable of interpreting an initial *shebang line* to fire the adequate interpreter, be it `python3`, `lua`, or anything else. Aside from that, we also need to change our machine so that it writes the script's result to an output drive, rather than printing to the console.

As such, repeating the approach of the [previous tutorials](../../helloworld/cartesi-machine#cartesi-machine-for-the-hello-world-dapp), we'll create a bash script that can build our final machine's *template specification* and store it in the appropriate directory within our [development environment](../../descartes-env).

First, create a `build-cartesi-machine.sh` file in the `cartesi-machine` directory:

```bash
touch build-cartesi-machine.sh
chmod +x build-cartesi-machine.sh
```

Then, add the following contents:

```bash
#!/bin/bash

# general definitions
MACHINES_DIR=.
MACHINE_TEMP_DIR=__temp_machine
CARTESI_PLAYGROUND_DOCKER=cartesi/playground:0.3.0

# set machines directory to specified path if provided
if [ $1 ]; then
  MACHINES_DIR=$1
fi

# removes machine temp store directory if it exists
if [ -d "$MACHINE_TEMP_DIR" ]; then
  rm -r $MACHINE_TEMP_DIR
fi

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
    --store="$MACHINE_TEMP_DIR" \
    --flash-drive="label:root,filename:rootfs-python-jwt.ext2" \
    --flash-drive="label:input,length:1<<12" \
    --flash-drive="label:output,length:1<<12" \
    -- $'dd status=none if=$(flashdrive input) | lua -e \'print((string.unpack("z",  io.read("a"))))\' > /input_script ; chmod +x /input_script ; /input_script | dd status=none of=$(flashdrive output)'

# defines target directory as being within $MACHINES_DIR and named after the stored machine's hash
MACHINE_TARGET_DIR=$MACHINES_DIR/$(docker run \
  -e USER=$(id -u -n) \
  -e GROUP=$(id -g -n) \
  -e UID=$(id -u) \
  -e GID=$(id -g) \
  -v `pwd`:/home/$(id -u -n) \
  -h playground \
  -w /home/$(id -u -n) \
  --rm $CARTESI_PLAYGROUND_DOCKER cartesi-machine-stored-hash $MACHINE_TEMP_DIR/)

# moves stored machine to the target directory
if [ -d "$MACHINE_TARGET_DIR" ]; then
  rm -r $MACHINE_TARGET_DIR
fi
mv $MACHINE_TEMP_DIR $MACHINE_TARGET_DIR
```

As in our previous test, we specify the `rootfs-python-jwt.ext2` file as the root file-system, along with an input drive. This time, however, we also define an output drive, where the resulting data should be written to. Moreover, the input drive is  no longer mapped to the `input.py` file, since Descartes will take care of inserting data into it, as well as retrieving data from the output drive. Aside from that, we changed the command line to save the input script to a file, make that file executable, and then run it using the Linux shell. The shell will automatically interpret the first *shebang line* and fire the appropriate interpreter by itself.

Now we can build the machine template and store it by executing:

```bash
./build-cartesi-machine.sh ../../descartes-env/machines
```

The output of which should be something like this:

```
%tutorials.generic-script.store
```

It is important to note here that, contrary to our previous tutorials, the resulting template hash produced will be different from the one presented above, even though the machine specification and input contents are apparently the same. This happens because the hash captures the *complete initial state* of the machine, and the process of generating a customized `rootfs-python-jwt.ext2` will always lead to a slightly different file.

As such, to get the exact same result you will need to download the very same `ext2` file that was used to build the machine when this tutorial was written, which is actually [available in the Descartes Tutorials GitHub repo](https://github.com/cartesi/descartes-tutorials). Thus, we can finish off this section by executing the following commands to retrieve that file and then rebuild the machine template using it:

```bash
rm rootfs-python-jwt.ext2
wget https://github.com/cartesi/descartes-tutorials/releases/download/v1.1.0/rootfs-python-jwt.ext2
./build-cartesi-machine.sh ../../descartes-env/machines
```

Which should now yield the exact same output as above.

With the correct machine template appropriately stored, the template hash `%tutorials.generic-script.hash-trunc...`  can now be used as its identifier when instantiating this Generic Script computation from a smart contract. We will implement such a contract in the next section, but before that let's switch back to the `generic-script` home directory:

```bash
cd ..
```
