---
title: Creating the Greetings application
---

Now, we are going to create a new machine that features I/O (input and output).

The "Hello World" machine already takes inputs, in that it boots up with four files that are mapped to its memory addressing space: the ROM, Kernel, RootFS, and our own "Hello World File System" (let's call it "HelloFS"). What we are going to do in this section is create a new machine that features a third _flash drive_ that contains user input, and a fourth one to save our application's response to user input. These latter devices will be "raw" devices, that is, their backing files are not read by the emulator as a description of a filesystem to be mounted, but rather as a generic, flat byte array that can be read from or written to directly.

> **NOTE:** The ROM and Kernel files are not mounted as drives: they are just copied into the emulated machine's memory. The RootFS and HelloFS files are mounted by the emulated Linux OS as "flash drives" (I/O devices). The root file system is mounted at `/`, and all other flash drives are mounted as `/mnt/DEVICE-NAME`.

We are going to create a new Greetings application as a shell script that reads a raw input drive that is preloaded with a null-terminated ASCII string that is encoded in at most 4,096 bytes, and writes a null-terminated ASCII string that says "Greetings, XXX!", where "XXX" is the input string, to the beginning of a raw output drive that has a backing file that we can inspect after the emulator exits.

## Coding the Greetings app

Create a new project directory (e.g. `~\greetings-machine`) and enter it.

Save the following in a file named `flashdevicebylabel`. It is a handy shell script that translates a flash drive name to its mounted path inside of the emulator.

```
#!/bin/sh                                                                       
for t in /dev/mtdblock*; do
        name=$(cat /sys/block/$(basename $t)/device/name)
        if [ "$name" = $1 ]; then
                echo $t
                exit 0
        fi
done
exit 1
```

Save the following in a file named `greetings.sh`. This is our application code that reads application data from an input drive and writes the result data to an output drive.

```
#!/bin/sh

# The emulator runs Linux as root, so the default directory is "/root".
# The command below gets us into the same directory that this script is
#   in, and also where the "flashdevicebylabel" helper script -- which
#   we will reference below -- is also in.

cd $(dirname $0)

# Create some helper text files.

echo "Greetings, " > /tmp/prefix
echo "!" > /tmp/suffix

# Copy 4,096 bytes from the beginning of the "dappin" flash device into a
#   "/tmp/name" file.

dd status=none if=$(./flashdevicebylabel dappin) of=/tmp/name bs=4k count=1

# Remove the zeroed-out padding from the "name" file and write the resulting
#   "trimmed_name" file, which should be much smaller, containing only the
#   actual, useful characters from the user's input name.

cat /tmp/name | tr -d '\0' > /tmp/trimmed_name

# Concatenate our "prefix", "trimmed_name" and "suffix" files and place the 
#   resulting greeting message into a new "/tmp/message" file.

cat /tmp/prefix /tmp/trimmed_name | tr -d '\n' > /tmp/message
cat /tmp/suffix >> /tmp/message

# Write the contents of the "/tmp/message" file to the beginning of the
#   "dappout" flash device (which should start as 4,096 zeroed-out bytes).

dd status=none if=/tmp/message of=$(./flashdevicebylabel dappout) bs=4k count=1
```

As you see, our application code can still be written with shell scripts. Your production application, however, can be written in anything that is ultimately runnable by Cartesi's RISC-V-based machine. For example, the `rootfs.ext2` filesystem we are using, which is loaded inside of the emulator, already includes a Lua interpreter, so you can write your applications in Lua (use `#!/usr/bin/lua` as the first line of your executable script file).

## Packaging the Greetings app

Assemble the `greetfs.ext2` application flash drive:

```
mkdir fs
```
```
mv greetings.sh flashdevicebylabel fs
```
```
toolchain_exec.sh genext2fs -f -b 64 -d fs greetfs.ext2
```

The resulting `greetfs.ext2` file should be 64 kilobytes in size, which is already a multiple of the 4,096-byte page size, so we are good on that front.

Next, we will assemble the Cartesi machine.