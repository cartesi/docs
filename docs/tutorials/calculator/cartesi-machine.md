---
title: Calculator machine
---

:::note Section Goal
- build a Cartesi Machine that computes the result of an arbitrary mathematical expression
- use input drives to parameterize computations using user-defined data
:::


## Performing calculations with a Cartesi Machine

Now that we have the [basic project structure](../create-project) ready, let's focus on the main part of our DApp, which is the off-chain computation to be performed by the Cartesi Machine. 

First of all, let's `cd` into the `cartesi-machine` subdirectory:

```bash
cd cartesi-machine
```

For this computation, we will use the [Linux bc tool](https://www.gnu.org/software/bc/manual/html_mono/bc.html), which is capable of calculating the result of an arbitrary mathematical expression given as a string. This is illustrated in detail in the [Cartesi Machine host section](../../../machine/host/cmdline#cartesi-machine-templates). 

We can use the playground to help us configure and test an appropriate machine. To do that, let's run it in interactive mode:

```bash
docker run -it --rm cartesi/playground:0.3.0 /bin/bash
```

Now, let's create some test input data:

```bash
echo "2^71 + 36^12" > input.raw
```

As explained in the [Cartesi Machine section](../../../machine/host/cmdline#flash-drives), the underlying RISC-V technology requires all drives to have a size that is a multiple of 4KiB. Descartes normally takes care of this, but for our tests we will need to ensure it by using the handy `truncate` tool available within the playground. This tool will pad the file with zeros in case it is smaller than the specified size:

```bash
truncate -s 4K input.raw
truncate -s 4K output.raw
```

At this point, we can now exercise a machine execution that uses the `bc` tool to compute the result of the given input expression:

```bash
cartesi-machine \
  --flash-drive="label:input,length:1<<12,filename:input.raw" \
  --flash-drive="label:output,length:1<<12,filename:output.raw,shared" \
  -- $'dd status=none if=$(flashdrive input) | lua -e \'print((string.unpack("z",  io.read("a"))))\' | bc | dd status=none of=$(flashdrive output)'
```

Here, we have two `flash-drive` declarations, one for the input and one for the output, both with a specified size of 4KiB. The command to be executed will use the `dd` tool to read the raw data from the input drive, pipe it through a tiny Lua script to ensure it is read as a null-terminated string, give it as input to the `bc` tool, and finally write the result to the output drive. Additionally, we include `filename:input.raw` and `filename:output.raw,shared`, which instructs the machine to read from our test input file and write to the test output file in a persistent manner. Full details about these parameters and how to use them are given in the [Cartesi Machine host section](../../../machine/host/cmdline#flash-drives).

After executing the above command, we can inspect the results written to the `output.raw` file:

```bash
cat output.raw
2365921622773144223744
```

Which is indeed the result of computing `2^71 + 36^12`, as expected.

We can now exit the playground Docker by typing:

```bash
exit
```

## Final Cartesi Machine implementation

Having exercised how our machine will work, we can now turn to building a final version of it that will be used by the Descartes nodes in our [development environment](../../descartes-env).

Recalling the previous machine built for the [Hello World DApp](../../helloworld/cartesi-machine#cartesi-machine-for-the-hello-world-dapp), let's create a bash script called `build-cartesi-machine.sh` back in our `calculator/cartesi-machine` directory:

```bash
touch build-cartesi-machine.sh
chmod +x build-cartesi-machine.sh
```

Now, edit the file and place the following contents into it:

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
    --store="$MACHINE_TEMP_DIR" \
    --flash-drive="label:input,length:1<<12" \
    --flash-drive="label:output,length:1<<12" \
    -- $'dd status=none if=$(flashdrive input) | lua -e \'print((string.unpack("z",  io.read("a"))))\' | bc | dd status=none of=$(flashdrive output)'

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

As explained in more detail in the [Hello World tutorial](../../helloworld/cartesi-machine), this script will create a *template machine* to be executed upon request, and store its contents in a directory specified by the user. In order to do that, we have specified `max-mcycle=0`, so that the machine halts without running any cycles. Then, we added the parameter `--store="$MACHINE_TEMP_DIR"` to specify that the machine's specification should be stored in the specified directory. Finally, we have removed the `filename` configurations from the flash drives, since the input and output data will now be handled automatically by Descartes.

With all of this set, build the machine by executing:

```bash
./build-cartesi-machine.sh ../../descartes-env/machines
```

The output of the above command should then be:

```
%tutorials.calculator.store
```

After executing this command, the machine's specification will be stored in the appropriate directory within our Descartes environment. Moreover, we are informed that its initial template hash is `%tutorials.calculator.hash-trunc...`, which serves as an identifier of this machine and will thus be necessary to instantiate the computation from a smart contract, as will be explored in the next section.

Finally, move back to the `calculator` home directory:

```bash
cd ..
```
