---
title: Computing scrypt using C
---

:::note Section Goal
- learn how to cross-compile C code, including 3rd-party libraries, so that it can be used in a Cartesi Machine
- implement a program in C using the libscrypt library to validate Dogecoin and Litecoin block headers
:::


## Libscrypt C library

As discussed in the [technical background](../create-project/#technical-background), the Dogecoin/Litecoin proof-of-work hash must be computed using the `scrypt` algorithm. In this tutorial, we will implement this computation in C, making use of the well-established [libscrypt](https://github.com/technion/libscrypt) library.

Before we begin, let's first switch to the `dogecoin-hash/cartesi-machine` directory:

```bash
cd cartesi-machine
```

Now, download the library source code into a subdirectory called `libscrypt`. The easiest way to do that is by cloning the library's GitHub repository using `git`. In case you don't already have `git` installed, run:

```bash
sudo apt-get update
sudo apt-get install git
```

And then, download the library's source code by typing:

```bash
git clone https://github.com/technion/libscrypt.git
```

As explained in detail by the [Cartesi Machine target perspective section](../../../machine/target/linux/), to generate binary executables from C code that can run inside a Cartesi Machine we need to *cross-compile* that code targeting the machine's RISC-V architecture. This can be done using tools available in the `cartesi/playground` Docker image.

As such, let's start by jumping into the playground, making sure to map the current directory:

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

As usual for C projects, the `libscrypt` library is intended to be built using the `make` command, which will follow the specifications layed out in its `Makefile`. In this context, we need to set up some changes to the environment, so that the library is built with the intended cross-compiler for RISC-V, using adequate parameters:

```bash
export CC=riscv64-cartesi-linux-gnu-gcc
export CFLAGS_EXTRA="-Wl,-rpath=. -O2 -Wall -g"
export PATH=$PATH:~/
```

The `CC` environment variable above stands for "C compiler", and is actually used inside the `Makefile` to allow a specific compiler to be configured instead of the standard `gcc` tool. In this context, `riscv64-cartesi-linux-gnu-gcc` is the name of the appropriate cross-compiler available in the playground, which is capable of producing output targeting the Cartesi Machine's RISC-V architecture.
Aside from that, we also define the `CFLAGS_EXTRA` variable exactly as it is already specified in `libscrypt`'s Makefile, but removing the unsupported flag "-fstack-protector". Finally, we set the `PATH` to include the playground's home directory, which is mapped to the `dogecoin-hash/cartesi-machine` directory outside of the playground Docker.

The `PATH` setting is actually done just to help us work around a limitation in `libscrypt`'s Makefile, which unfortunately does not provide an environment variable to configure which *archiver* tool to use. Since the `Makefile` forcibly always uses the command `ar`, we will fix this limitation by creating an executable script called `ar` in the current home directory (now included in the `PATH`) that simply calls the appropriate RISC-V utility instead.

As such, first create the `ar` file and make it executable:

```
touch ar
chmod +x ar
```

And now place the following contents into it:

```bash
#!/bin/bash
/opt/riscv/riscv64-cartesi-linux-gnu/bin/riscv64-cartesi-linux-gnu-ar "$@"
```

With that set, we are at last ready to build the library. This can now be done by simply switching into the `libscrypt` directory and running the `make` command:

```bash
cd libscrypt
make
```

After the command completes, the appropriate shared library `libscrypt.so.0` will have been generated.

Finally, move back to the playground's home directory by typing:

```bash
cd ..
```

## Dogecoin/Litecoin scrypt computation

Now that the `libscrypt` library has been built, we can implement our application-specific code. Namely, this code will read input data for a block header and call the library to compute the appropriate `scrypt` hash using the parameters defined by the [Dogecoin/Litecoin specification](https://litecoin.info/index.php/Block_hashing_algorithm) and discussed in the [technical background](../create-project/#technical-background).

In the playground's home directory (mapped to `dogecoin-hash/cartesi-machine/`), create a file called `scrypt-hash.c` with the following contents:

```c
#include <stdlib.h>
#include <string.h>
#include <stdio.h>
#include <errno.h>

#include "libscrypt/libscrypt.h"


/**
 * Swaps bytes of a given buffer, effectively performing a big-endian to/from little-endian conversion
 */
void swap_bytes(uint8_t *buf, int buf_size)
{
    for (int i = 0; i < buf_size/2; i++)
    {
        uint8_t temp = buf[i];
        buf[i] = buf[buf_size-i-1];
        buf[buf_size-i-1] = temp;
    }
}


int main(int argc, char *argv[])
{
    // general definitions for scrypt hash, as defined by the Litecoin specification
    // ref: https://litecoin.info/index.php/Block_hashing_algorithm
    const int INPUT_SIZE = 80;   // block header data: concatenation of Version, Prev Hash, Merkle Root, Timestamp, Bits, Nonce
    const int OUTPUT_SIZE = 32;  // hash output size
    const int N = 1024;
    const int r = 1;
    const int p = 1;

    // reads input/output args
    if (argc != 3)
    {
        fprintf(stderr, "ERROR: expected 2 arguments, one for input and another for output, but received %d.\n", argc-1);
        exit(1);
    }
    char *inputFilename = argv[1];
    char *outputFilename = argv[2];

    // defines input and output buffers
    uint8_t input[INPUT_SIZE];
    uint8_t output[OUTPUT_SIZE];

    // reads input data
    printf("Reading input data...\n");
    FILE *inputFile = fopen(inputFilename, "rb");
    if (inputFile == NULL)
    {
        fprintf(stderr, "ERROR: could not open input file '%s' reading.\n", inputFilename);
        exit(2);
    }
    int freadRet = fread(input, sizeof(uint8_t), INPUT_SIZE, inputFile);
    fclose(inputFile);
    if (freadRet < INPUT_SIZE)
    {
        fprintf(stderr, "ERROR: could only read %d bytes from input file '%s' - should have read %d bytes.\n", freadRet, inputFilename, INPUT_SIZE);
        exit(3);
    }

    // converts input from big-endian to little-endian, considering each sub-part
    // - Version (4 bytes)
    // - Previous hash (32 bytes)
    // - Merkle root (32 bytes)
    // - Timestamp (4 bytes)
    // - Bits (target in compact form) (4 bytes)
    // - Nonce (4 bytes)
    swap_bytes(input, 4);
    swap_bytes(input+4, 32);
    swap_bytes(input+36, 32);
    swap_bytes(input+68, 4);
    swap_bytes(input+72, 4);
    swap_bytes(input+76, 4);


    // COMPUTES HASH USING SCRYPT
    printf("Computing scrypt hash...\n");
    int retval = libscrypt_scrypt(input, INPUT_SIZE, input, INPUT_SIZE, N, r, p, output, OUTPUT_SIZE);
    if(retval != 0)
    {
        fprintf(stderr, "ERROR COMPUTING SCRYPT HASH: return value is %d", retval);
        exit(retval);
    }


    // converts output from little-endian to big-endian
    swap_bytes(output, OUTPUT_SIZE);

    // writes output data
    printf("Writing computed scrypt hash to output...\n");
    FILE *outputFile = fopen(outputFilename, "wb");
    if (outputFile == NULL)
    {
        fprintf(stderr, "ERROR: could not open output file '%s' for writing.\n", outputFilename);
        exit(2);
    }
    int fwriteRet = fwrite(output, sizeof(uint8_t), OUTPUT_SIZE, outputFile);
    fclose(outputFile);
    if (fwriteRet < OUTPUT_SIZE)
    {
        fprintf(stderr, "ERROR: could only write %d bytes to output file '%s' - should have written %d bytes.\n", fwriteRet, outputFilename, OUTPUT_SIZE);
        exit(4);
    }

    printf("DONE!\n");
    return 0;
}
```

In general terms, the above code will do the following:

1. Read 80 bytes from the input file specified by the program's first argument
2. Convert the input bytes from big-endian (used in Solidity) to little-endian (used in most processor architectures, including x86 and RISC-V)
3. Effectively run the `scrypt` algorithm using the `libscrypt` library
4. Convert the result back from little-endian to big-endian
5. Write the final 32 bytes output to the file specified by the program's second argument

In effect, the core of the program is the following line, which calls the `libscrypt` library with the appropriate data and parameters:

```c
int retval = libscrypt_scrypt(input, INPUT_SIZE, input, INPUT_SIZE, N, r, p, output, OUTPUT_SIZE)
```

As documented in file `libscrypt/libscrypt.h`, the above method call passes the input data, the "salt" (defined in the [Litecoin specification](https://litecoin.info/index.php/Scrypt) as being equal to the input), the pre-defined `N`, `r` and `p` parameters, and finally the output buffer where the resulting hash should be stored.

Once the code is ready, we can finally *cross-compile* it to the RISC-V target architecture, linking it to the `libscrypt` shared library:

```bash
riscv64-cartesi-linux-gnu-gcc -O2 -o scrypt-hash scrypt-hash.c -Wl,-rpath=. -Llibscrypt -lscrypt
```

The above command will generate an executable file called `scrypt-hash` in the current directory. However, since it has been built for the RISC-V architecture, this program *cannot* be executed directly from the command line, but rather from inside a Cartesi Machine, as we'll see in the [next section](../cartesi-machine).

As a curiosity, we can actually check out some interesting information about the generated file by typing:

```bash
file scrypt-hash
```

Which should give us the following output, confirming that the executable has been generated for the RISC-V architecture:

```bash
scrypt-hash: ELF 64-bit LSB executable, UCB RISC-V, version 1 (SYSV), dynamically linked, interpreter /lib/ld-linux-riscv64-lp64.so.1, for GNU/Linux 5.5.19, with debug_info, not stripped
```

:::note
In practice, C code development would normally take place in the user's native environment, making use of resources such as integrated development environments (IDEs), debuggers, profilers and whatnot. Only when the code is ready and tested would it typically be the time to cross-compile it to the target architecture.
:::