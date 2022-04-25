---
title: Dogecoin Hash machine
---

:::note Section Goal
- verify scrypt hash computations in a Cartesi Machine for a real Dogecoin block header
- build a final machine for Dogecoin/Litecoin block validation
:::

## Building `ext2` file-system

With our RISC-V [scrypt-hash](../scrypt-c/#dogecoinlitecoin-scrypt-computation) program compiled, we must now pack it for usage within a Cartesi Machine. To do that, we will build an `ext2` file-system with the necessary contents, similar to what was done for the [GPG Verify tutorial](../../gpg-verify/ext2-gpg/#building-an-ext2-file-system).

To do that, first copy the `scrypt-hash` executable and the `libscrypt` shared library we compiled [before](../scrypt-c) to a directory called `ext2`:

```bash
mkdir ext2
cp scrypt-hash ext2
cp libscrypt/libscrypt.so.0 ext2
```

Then, still inside the playground, use the `genext2fs` tool to generate the file-system with those contents:

```bash
genext2fs -b 1024 -d ext2 scrypt-hash.ext2
```

As such, the generated `scrypt-hash.ext2` file now represents an `ext2` file-system containing our scrypt hashing program.

## Test data

At this point, to finally compute hashes using a Cartesi Machine, all we need is some data. We can start by grabbing the header for [Dogecoin block #100000](https://dogechain.info/block/100000), whose relevant field values in hexadecimal notation are the following:

- Version: `0x00000002`
- Previous hash: `0x12aca0938fe1fb786c9e0e4375900e8333123de75e240abd3337d1b411d14ebe`
- Merkle root: `0x31757c266102d1bee62ef2ff8438663107d64bdd5d9d9173421ec25fb2a814de`
- Timestamp: `0x52fd869d` (corresponds to datetime `2014-02-13 18:59:41 -0800`, or `1392346781` in decimal notation)
- Bits: `0x1b267eeb`
- Nonce: `0x84214800` (equivalent to `2216773632` in decimal notation)

As explained in the [technical background](../create-project/#technical-background), the hashing algorithm's input data can be derived by simply concatenating all those hexadecimal values. The resulting 80 bytes long hexadecimal string can then be written as a binary file with the following command, using the `xxd` tool:

```bash
echo "0000000212aca0938fe1fb786c9e0e4375900e8333123de75e240abd3337d1b411d14ebe31757c266102d1bee62ef2ff8438663107d64bdd5d9d9173421ec25fb2a814de52fd869d1b267eeb84214800" | xxd -r -p > input-doge100000.raw
```

We can also generate an adulterated invalid block header input, just to see how our hashing service behaves. Here, we will simply change the `Nonce` value from `0x84214800` to `0x84214801`, which corresponds to changing the last digit of the concatenated hex string, as follows:

```bash
echo "0000000212aca0938fe1fb786c9e0e4375900e8333123de75e240abd3337d1b411d14ebe31757c266102d1bee62ef2ff8438663107d64bdd5d9d9173421ec25fb2a814de52fd869d1b267eeb84214801" | xxd -r -p > input-doge100000-invalid.raw
```

Finally, as discussed in [other tutorials](../..//calculator/cartesi-machine/#performing-calculations-with-a-cartesi-machine) and in the [Cartesi Machine host perspective section](../../../machine/host/cmdline#flash-drives), we need to use the `truncate` tool to pad all drive files to 4K, which is the minimum required length for usage with Cartesi Machines:

```bash
truncate -s 4K input-doge100000.raw
truncate -s 4K input-doge100000-invalid.raw
truncate -s 4K output.raw
```

## Testing hash computation

Now that we have all of the necessary resources in place, let's perform some hash computations!

Still within the playground, execute the following command to run the hashing algorithm for the `input-doge100000.raw` data:

```bash
cartesi-machine \
  --flash-drive="label:scrypt-hash,filename:scrypt-hash.ext2" \
  --flash-drive="label:input,length:1<<12,filename:input-doge100000.raw" \
  --flash-drive="label:output,length:1<<12,filename:output.raw,shared" \
  -- $'cd /mnt/scrypt-hash ; ./scrypt-hash $(flashdrive input) $(flashdrive output)'
```

This should yield the following output, showing that our code is being successfully executed within the Cartesi Machine:

```bash
%tutorials.dogecoin-hash.run-valid
```

After the execution, we can use the `xxd` tool again to verify the result written to the first 32 bytes of the output drive:

```bash
xxd -p -l 32 -c 32 output.raw
00000000002647462b1abb10059b1f6f363acbc93f581cc256cc208e0895e5c7
```

Notice the leading zeros, which indicate a relatively small number. Recalling the explanation of the `Bits` field given in the [technical background](../create-project/#technical-background), the target hash value for a valid block header with the given `Bits` value of `0x1b267eeb` is given by:

```bash
target = 267eeb << 8*(1b - 3) = 
0000000000267eeb000000000000000000000000000000000000000000000000
```

Comparing this value to the computed hash above, we can observe that our result is indeed slightly smaller than the required target. This confirms that the given block header is indeed valid! Wow, such computation!

To make sure that our hashing algorithm implementation is really working, let's also run the machine for the adulterated version of the input data:

```bash
cartesi-machine \
  --flash-drive="label:scrypt-hash,filename:scrypt-hash.ext2" \
  --flash-drive="label:input,length:1<<12,filename:input-doge100000-invalid.raw" \
  --flash-drive="label:output,length:1<<12,filename:output.raw,shared" \
  -- $'cd /mnt/scrypt-hash ; ./scrypt-hash $(flashdrive input) $(flashdrive output)'
```

This time, checking the resulting hash leads to the following output:

```bash
xxd -p -l 32 -c 32 output.raw
3fc9f917be74f50bafc9bad28bf9ccda3e0c46b4af2e5bc78029926460f9100a
```

Which corresponds to a very high number, as should be expected when hashing random input data. This value is of course way higher than the required target, thus indicating that the given block header is invalid. We can now be sure to have a working Dogecoin block header validator running inside a Cartesi Machine!

Finally, now that we have completed our tests we can exit the playground by typing:

```bash
exit
```


## Full machine implementation

Following the same strategy used for the [other tutorials](../../helloworld/cartesi-machine#cartesi-machine-for-the-hello-world-dapp), we will finish off our Cartesi Machine implementation by producing a bash script that allows us to easily build and appropriately store the machine's *template specification*. This way, the machine will be available for Descartes to instantiate computations whenever a smart contract requests it.

It should also be noted that, as discussed in the [GPG Verify tutorial](../../gpg-verify/cartesi-machine/#full-machine-implementation), the process of creating `ext2` file-systems using the `genext2fs` tool is *not reproducible*. This means that each generated `ext2` file leads to a different Cartesi Machine template hash, even if the file-system's contents are identical. For this reason, to exactly reproduce this tutorial's results, you can download the actual [scrypt-hash.ext2](https://github.com/cartesi/descartes-tutorials/tree/master/dogecoin-hash/cartesi-machine) file used when writing this documentation. To do that, run the following command:

```bash
rm scrypt-hash.ext2
wget https://github.com/cartesi/descartes-tutorials/raw/master/dogecoin-hash/cartesi-machine/scrypt-hash.ext2
```

After that, let's create the `build-cartesi-machine.sh` file inside the `cartesi-machine` directory:

```bash
touch build-cartesi-machine.sh
chmod +x build-cartesi-machine.sh
```

Then, edit the file and insert the following contents:

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
    --flash-drive="label:scrypt-hash,filename:scrypt-hash.ext2" \
    --flash-drive="label:input,length:1<<12" \
    --flash-drive="label:output,length:1<<12" \
    -- $'cd /mnt/scrypt-hash ; ./scrypt-hash $(flashdrive input) $(flashdrive output)'

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

With this script ready, the final Cartesi Machine template can finally be built and stored in the appropriate location within the [Descartes SDK environment](../../descartes-env) by executing the following command:

```bash
./build-cartesi-machine.sh ../../descartes-env/machines
```

Running the above command should give you the following output, which includes the appropriate `templateHash` value to use when instantiating this computation from a smart contract:

```
%tutorials.dogecoin-hash.store
```

Finally, we can `cd` back to the `dogecoin-hash` home directory:

```bash
cd ..
```
