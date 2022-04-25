---
title: Using ext2 files and GPG
---

:::note Section Goal
- learn how to build `ext2` file-systems and use them in a Cartesi Machine
- create test data and run a Cartesi Machine that uses GPG to verify a document signature
:::


## Test data

Before jumping into building a Cartesi Machine using GPG, it is a good idea to first generate some test data. This way, we will be able to effectively run a machine and understand how GPG can be used in it.

First of all, let's create our fictional document inside the `gpg-verify/cartesi-machine` directory :

```bash
echo "My public statement" > document
```

An appropriate signature for that document has been created using the tutorial's [private key](https://github.com/cartesi/descartes-tutorials/raw/master/gpg-verify/cartesi-machine/descartes-private.key). That signature can be directly downloaded from Github by typing:

```bash
wget https://github.com/cartesi/descartes-tutorials/raw/master/gpg-verify/cartesi-machine/signature
```

Alternatively, you can use the tutorial's [private key](https://github.com/cartesi/descartes-tutorials/raw/master/gpg-verify/cartesi-machine/descartes-private.key) and sign it yourself using the GnuPG `gpg` tool (the private key's passphrase is "Descartes rocks!").

:::note
Although not necessary, it may be fun to use the GnuPG tool to play around with your own keypairs and document signatures. If you do not already have it installed, you can do that in an Ubuntu distribution by typing:

```bash
sudo apt-get update
sudo apt-get install gnupg
```

You can then download and import the private key, and create a detached document signature by executing the following commands:

```bash
wget https://github.com/cartesi/descartes-tutorials/raw/master/gpg-verify/cartesi-machine/descartes-private.key
gpg --import descartes-private.key
gpg --detach-sig -u descartes --output signature document
```

Please refer to the [GnuPG manual](https://www.gnupg.org/gph/en/manual.html) for more information on how to use `gpg`, such as creating your own keypairs. 
:::

As a final touch, let's also produce a "tampered" version of our document, so that we can check if we are able to detect a "fraud":

```bash
echo "My public statement was tampered!" > document-tampered
```

## Building an `ext2` file-system

As thoroughly discussed in the [Cartesi Machine host perspective section](../../../machine/host/cmdline/#flash-drives), `ext2` is a file-system format that can be easily created and manipulated with command-line utilities available in Linux distributions. It is the preferred file-system type used in Cartesi Machines, and we have actually already used it when building our [custom root file-system](../../generic-script/custom-rootfs) for the Generic Script tutorial.

In the context of this project, we will thus build an `ext2` file that contains our public key, so as to make it available to our GPG signature verification Cartesi Machine. We can also conveniently include other pre-defined resources in this file-system, such as the test data we have just created.

To create this file, we'll take advantage of the `cartesi/playground` Docker image, which already contains the necessary tools. As such, run the playground mapping the current directory by typing:

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

Inside the playground, let's first create a directory with the files that should be included in the `ext2` file-system (i.e., the public key and the test data):

```bash
mkdir ext2-test
cp descartes-pub.key document document-tampered signature ext2-test/
```

Next, use the `genext2fs` tool to create the `ext2` file with the contents of that directory:

```bash
genext2fs -b 1024 -d ext2-test dapp-data-test.ext2
``` 

After the file is created, you can actually inspect its contents by running the following command, also available inside the playground:

```bash
e2ls dapp-data-test.ext2
```

## Cartesi Machine with GPG

With the file-system ready, we can finally build and run a Cartesi Machine that uses GPG to verify the signature of our test data.

Still inside the playground, execute the following command:

```bash
cartesi-machine \
  --flash-drive="label:dapp-data,filename:dapp-data-test.ext2" \
  -- $'date -s \'2100-01-01\' && gpg --trusted-key 0xA86D9CB964EB527E --import /mnt/dapp-data/descartes-pub.key && gpg --verify /mnt/dapp-data/signature /mnt/dapp-data/document ; echo $?'
```

Let's go over this in detail. To begin with, the `flash-drive` argument specifies that the `dapp-data-test.ext2` file-system we just created should be mounted as `/mnt/dapp-data`. After that, the command line to be executed consists of a sequence of four instructions.

First, we use the Linux `date` command to set the system clock to a value far in the future. This is needed due to the inconvenience that, for security reasons, the GPG tool rejects signatures whose creation timestamp is beyond the current system time. On the other hand, in order to be *reproducible*, the Cartesi Machine cannot have different conditions on each execution, and thus it has to always start with a fixed system clock value, which by default is set to timestamp `0` (1970-01-01 UTC). Therefore, using `date` to set the clock to such a future value ensures that the machine will always accept any newly created signatures.

After setting the date, the ensuing `gpg` command imports the `descartes-pub.key` file as a public key, and uses the key's LONG 64-bit identifier `0xA86D9CB964EB527E` to inform that it can be trusted (if you have `gpg` installed, you can check out the key's LONG id by running `gpg --keyid-format LONG descartes-pub.key`). Then, we use `gpg` again to perform the actual signature verification. Finally, the last `echo` command just prints the final exit status to the console.

The output of running this machine is the following:

```
%tutorials.gpg-verify.run-valid
```

As we can see, the output confirms that the date was set, the public key was marked as trusted and imported, and finally the signature was considered valid for the given document. The final `0` value printed just before halting the machine is the exit status for the `gpg` signature verification command, signaling that it has reported success.

We can then run the same machine for our `document-tampered` version:

```bash
cartesi-machine \
  --flash-drive="label:dapp-data,filename:dapp-data-test.ext2" \
  -- $'date -s \'2100-01-01\' && gpg --trusted-key 0xA86D9CB964EB527E --import /mnt/dapp-data/descartes-pub.key && gpg --verify /mnt/dapp-data/signature /mnt/dapp-data/document-tampered ; echo $?'
```

Which will yield the following output:

```
%tutorials.gpg-verify.run-invalid
```

This informs us that the signature is now invalid for the given document, and that the reported exit status is now `1`, indicating failure. We are now indeed capable of verifying document signatures with a Cartesi Machine!

Finally, you can exit the playground by typing:

```bash
exit
```


