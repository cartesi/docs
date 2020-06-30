---
title: Linux environment
---

:::note
The host perspective describes in detail the `cartesi-machine` command-line utility and the general structure of Cartesi Machines.
In order to avoid repetition, this section assumes familiarity with the material presented there.
:::

The most direct way for target developers to familiare themselves with the embedded Linux environment is to run the Cartesi Machine emulator in interactive mode.
The `cartesi/playground` Docker image comes pre-installed with the emulator and all its support files.
Inside the playground, the following command instructs the emulator to load the default machine configuration and run a shell in interactive mode

```bash
playground:~$ cartesi-machine -i -- sh
```
Once executed, the Cartesi Machine boots Linux and drops into an interactive shell (The `sh` argument in the command-line.)

```
Running in interactive mode!

         .
        / \
      /    \
\---/---\  /----\
 \       X       \
  \----/  \---/---\
       \    / CARTESI
        \ /   MACHINE
         '

cartesi-machine:/ # cd /bin
cartesi-machine:/bin # ls
arch           dmesg          linux32        netstat        setserial
ash            dnsdomainname  linux64        nice           sh
base64         dumpkmap       ln             nuke           sleep
busybox        echo           login          pidof          stty
cat            egrep          ls             ping           su
chattr         false          lsattr         pipe_progress  sync
chgrp          fdflush        lsblk          printenv       tar
chmod          fgrep          mk_cmds        ps             touch
chown          findmnt        mkdir          pwd            true
compile_et     getopt         mknod          resume         umount
cp             grep           mktemp         rm             uname
cpio           gunzip         more           rmdir          usleep
cttyhack       gzip           mount          run-parts      vi
date           hostname       mountpoint     sed            watch
dd             kill           mt             setarch        wdctl
df             link           mv             setpriv        zcat
cartesi-machine:/bin # cd /usr/bin
cartesi-machine:/usr/bin # ls
7zr                fdtget             lzdiff             strings
[                  fdtoverlay         lzegrep            svc
[[                 fdtput             lzfgrep            svok
ar                 filecap            lzgrep             tail
attr               fincore            lzip               taskset
awk                find               lzless             tee
basename           flock              lzma               telnet
bc                 fold               lzmadec            test
brotli             free               lzmainfo           tftp
bunzip2            fuser              lzmore             time
bzcat              genext2fs          lzop               top
bzcmp              getfattr           lzopcat            tr
bzdiff             getopt             make               traceroute
bzegrep            gpg                mcookie            truncate
bzfgrep            gpg-agent          md5sum             ts
bzgrep             gpg-connect-agent  mesg               tty
bzip2              gpg-error          microcom           ul
bzip2recover       gpg-wks-server     mkfifo             uname26
bzless             gpgconf            mkpasswd           uniq
bzmore             gpgparsemail       mpicalc            unix2dos
captest            gpgrt-config       namei              unlink
ccat               gpgscm             netcap             unlz4
ccdecrypt          gpgsm              newgrp             unlzma
ccencrypt          gpgtar             nl                 unlzop
ccguess            head               nohup              unrar
ccrypt             hexdump            nproc              unshare
choom              hexedit            npth-config        unxz
chrt               hmac256            nsenter            unzip
chvt               hostid             nslookup           uptime
cksum              id                 od                 utmpdump
clear              install            openvt             uudecode
cmp                ionice             passwd             uuencode
col                ipcmk              paste              uuidgen
colcrt             ipcrm              patch              uuidparse
colrm              ipcs               printf             vlock
column             isosize            prlimit            w
convert-dtsv0      jq                 pscap              wall
crontab            kbxutil            qjs                watchgnupg
cut                killall            readlink           wc
dc                 ksba-config        realpath           wget
deallocvt          last               rename             whereis
devio              lastb              renice             whetstone
dhrystone          ldd                reset              which
diff               less               resize             who
dirmngr            line               rev                whoami
dirmngr-client     linux32            script             write
dirname            linux64            scriptlive         xargs
dos2unix           logger             scriptreplay       xxd
dtc                logname            seq                xz
du                 look               setarch            xzcat
dumpsexp           lscpu              setfattr           xzcmp
e2cp               lsipc              setkeycodes        xzdec
e2ln               lslocks            setpriv            xzdiff
e2ls               lsns               setsid             xzegrep
e2mkdir            lsof               setterm            xzfgrep
e2mv               lspci              sha1sum            xzgrep
e2rm               lsscsi             sha256sum          xzless
e2tail             lsusb              sha3sum            xzmore
eject              lua                sha512sum          yes
em                 luac               shred              zip
env                lz4                sl                 zipcloak
expr               lz4c               sort               zipnote
factor             lz4cat             sqlite3            zipsplit
fallocate          lzcat              strace
fdtdump            lzcmp              strace-log-merge
cartesi-machine:/usr/bin # exit

Halted
Cycles: 21274478193
```
The session shows a user changing the the working directory to `/usr/bin/` and listing its contents.
The user then does the same with directory `/bin/`, before finally leaving the emulator with the `exit` command.
The point of the exercise is that, from the inside, the environment will be familiar to any regular Unix user.

One of the key differences is that, unlike stand-alone systems, most embedded systems are not self-hosting.
None of the utilities visible inside the `/usr/bin/` and `/bin/` directores were built with a compiler that ran inside a Cartesi Machine.
They were built in a separate host system, on which a cross-compiling toolchain for the target architecture has been installed.
In the case of Linux, the key elements in the toolchain are the GNU Compiler Collection and the GNU C Library.
Support for RISC-V is upstream in the official [GCC compiler collection](https://gcc.gnu.org/).
Nevertheless, building a cross-compiler is time-consuming, even with the help of specialized tools such as [crosstool-ng](https://crosstool-ng.github.io/).
The [Emulator SDK](https://github.com/cartesi/machine-emulator-sdk) includes a Docker image `cartesi/toolchain` with the toolchain pre-installed.
The same toolchain is available in the `cartesi/playground` Docker image.

## Target "Hello world!"

Other than using a cross-compiler in the host to create executables for a different target platform, cross-development is not that different from hosted development.
As an example, consider the simple task of compiling the ubiquitous &ldquo;Hello world!&rdquo; program in the C++ programming language to run in the target. (Printing 5 lines, to at least offer a taste of the programming language.)
```c++ title="hello.cpp"
#include <iostream>

int main(int argc, char *argv[]) {
    for (int i = 0; i < 5; i++) {
        printf("%d: Hello world from C++!\n", i+1);
    }
    return 0;
}
```

To produce the binary in the playground, run
```bash
playground:~$ riscv64-unknown-linux-gnu-g++ -O2 -o hello-cpp hello.cpp
```
Note the prefix `riscv64-unknown-linux-gnu-` to the typical `g++` command.
This prefix identifies the cross-compiler.
The resulting file is a RISC-V executable suitable for running on the target:

```bash
playground:~$ file hello-cpp
hello: ELF 64-bit LSB executable, UCB RISC-V, version 1 (SYSV), dynamically linked, interpreter /lib/ld-linux-riscv64-lp64.so.1, for GNU/Linux 4.20.8, with debug_info, not stripped
```
If the bare `gcc` command was used instead, the resulting binary would be suitable for running on the host.

The executable can now be placed inside a new `hello.ext2` file-system:

```bash
playground:~$ mkdir hello
playground:~$ cp hello-cpp hello
playground:~$ genext2fs -b 1024 -d hello hello.ext2
```
The `hello-cpp` program can then be run from using the `cartesi-machine`
command-line utility as follows:

```bash
playground:~$ cartesi-machine \
    --flash-drive=label:hello,filename:hello.ext2 \
    -- /mnt/hello/hello-cpp
```

The output is

```

         .
        / \
      /    \
\---/---\  /----\
 \       X       \
  \----/  \---/---\
       \    / CARTESI
        \ /   MACHINE
         '

1: Hello world from C++!
2: Hello world from C++!
3: Hello world from C++!
4: Hello world from C++!
5: Hello world from C++!

Halted
Cycles: 74465415
```

One of the advantages of running Linux is the large number of well-established software development tools available.
By default, the `rootfs.ext2` root file-system includes the `ash` shell, and a Lua interpreter, both of which can be used for scripting.

For example, to run the shell script version of the &ldquo;Hello world!&rdquo; program:

```bash title="hello.sh"
#!/bin/sh

for i in $(seq 1 5); do
    echo "$i: Hello world from sh!"
done
```

```bash
playground:~$ cp hello.sh hello
playground:~$ chmod +x hello/hello.sh
playground:~$ genext2fs -b 1024 -d hello hello.ext2
playground:~$ cartesi-machine \
    --flash-drive=label:hello,filename:hello.ext2 \
    -- /mnt/hello/hello.sh
```

Running these commands produce an output that is very similar to the C++ version.

## The root file-system

The `fs/` submodule in the [Emulator SDK](https://github.com/cartesi/machine-emulator-sdk) uses the [Buildroot](https://buildroot.org/) tool to create the root file-system `rootfs.ext2` (mounted as `/`).
Buildroot is a highly configurable tool, and an explanation of how to use it to its full potential is beyond the scope of this documentation.
Please refer its [manual](https://buildroot.org/downloads/manual/manual.html).

Even relative to other embedded Linux root file-systems, the Cartesi-provided `rootfs.ext2` is very simple.
The only significant customization is the Cartesi-provided `/sbin/init` script, which performs a few initialization tasks before handing control to the application chosen by the developer to run inside the Cartesi Machine, and shutdown tasks after the application exits.

As is typical in the field, `rootfs.ext2` uses [BusyBox](https://busybox.net/) to consolidate tiny versions of many common UNIX utilities (`ls`, `cd`, `rm`, etc) into a single binary.
It also includes, a variety of typical command-line utilities, as can be seen in the listings of directories `/bin/` and `/usr/bin/` above.

Using Buildroot, it is rather easy to add new packages, or to remove unecessary ones.
Hundreds of packages are available for installation.
To that end, from inside the Emulator SDK, change into the `fs/` directory and run `make config`.
This will bring up a textual menu interface, from which the option `Target packages` can be selected.

For example, additional scripting languages are available from the `Interpreter languages and scripting` section.
After selecting the options for `4th`, `lua`, `qjs`, `perl`, `php`, `python3`, `ruby`, and `tcl` and replacing the old `rootfs.ext2` with the freshly generated one, all these scripting languages become available for use inside the Cartesi Machine.

Here are &ldquo;Hello world!&rdquo; programs for each of these languages:

```4th title="hello.4th"
6 1 do i <# # #> type ." : Hello world from Forth!" cr loop
```

```js title="hello.js"
#!/usr/bin/env qjs

for (var i = 0; i < 5; i++) {
    console.log((i+1) + ": Hello world!")
}
```

```lua title="hello.lua"
#!/usr/bin/env lua

for i = 1, 5 do
    print(i .. ": Hello world from Lua!")
end
```

```perl title="hello.pl"
#!/usr/bin/env perl

for my $i (1..5){
	print("$i: Hello from Perl!\n");
}
```

```php title="hello.php"
#!/usr/bin/env php
<?php
for ($i = 1; $i <= 5; $i++) {
    print "$i: Hello world from PHP!\n";
}
?>
```

```python title="hello.py"
#!/usr/bin/env python3

for i in range(0,5):
    print("{}: Hello world from Python3".format(i+1))
```

```ruby title="hello.rb"
#!/usr/bin/env ruby

for i in 1..5 do
    puts "%d: Hello world from Ruby!" % i
end
```

```tcl title="hello.tcl"
#!/usr/bin/env tclsh

for {set i 1} {$i <= 5} {incr i} {
    puts "$i: Hello world from TCL!"
}
```

The following shell script invokes all of them:
```bash title="all.sh"
#!/bin/sh

cd $(dirname $0)

./hello-cpp
4th cxq hello.4th
./hello.lua
./hello.js
./hello.pl
./hello.php
./hello.py
./hello.rb
./hello.sh
./hello.tcl
```

After adding all these files to `hello.ext2` (with *execute* permissions), the result of the command line
```bash
playground:~$ cartesi-machine \
    --flash-drive=label:hello,filename:hello.ext2 \
    -- "/mnt/hello/all.sh"
```
is as follows:
```

         .
        / \
      /    \
\---/---\  /----\
 \       X       \
  \----/  \---/---\
       \    / CARTESI
        \ /   MACHINE
         '

1: Hello world from C++!
2: Hello world from C++!
3: Hello world from C++!
4: Hello world from C++!
5: Hello world from C++!
1: Hello world from Forth!
2: Hello world from Forth!
3: Hello world from Forth!
4: Hello world from Forth!
5: Hello world from Forth!
1: Hello world from Lua!
2: Hello world from Lua!
3: Hello world from Lua!
4: Hello world from Lua!
5: Hello world from Lua!
1: Hello world from JavaScript!
2: Hello world from JavaScript!
3: Hello world from JavaScript!
4: Hello world from JavaScript!
5: Hello world from JavaScript!
1: Hello world from Perl!
2: Hello world from Perl!
3: Hello world from Perl!
4: Hello world from Perl!
5: Hello world from Perl!
1: Hello world from PHP!
2: Hello world from PHP!
3: Hello world from PHP!
4: Hello world from PHP!
5: Hello world from PHP!
1: Hello world from Python3
2: Hello world from Python3
3: Hello world from Python3
4: Hello world from Python3
5: Hello world from Python3
1: Hello world from Ruby!
2: Hello world from Ruby!
3: Hello world from Ruby!
4: Hello world from Ruby!
5: Hello world from Ruby!
1: Hello world from sh!
2: Hello world from sh!
3: Hello world from sh!
4: Hello world from sh!
5: Hello world from sh!
1: Hello world from TCL!
2: Hello world from TCL!
3: Hello world from TCL!
4: Hello world from TCL!
5: Hello world from TCL!

Halted
Cycles: 205939605
```
The take-away message is that developers can use the tools they are most familiar with to accomplish the task at hand.

:::note
Note that your cycle count may vary, since your new `rootfs.ext2` may differ from the one used to produce the results above.
:::

## Flash drives

Flash drives are simply regions of physical memory under the control of Linux's `mtd-ram` driver.
The flash drives 0&ndash;8 receive device names `flash.0`&ndash;`flash.7`, and the drives makes them accessible as block devices `/dev/mtdblock0`&ndash;`/dev/mtdblock7`.

The kernel command-line parameters `rootfstype=ext2 root=/dev/mtdblock0 rw` instruct that the root file-system is of type `ext2`, that it resides in device `/dev/mtdblock0`, i.e., flash drive 0, and that it should be mounted read-write.
Partitioning information for flash drives and, in particular, custom labels can be specified with the `mtdparts` parameter in the Linux kernel command line.
The format for the parameter is documented in the [source-code](https://elixir.bootlin.com/linux/v5.5.19/source/drivers/mtd/parsers/cmdlinepart.c) for the kernel module reponsible for parsing it.
For example, the parameter `mtdparts=flash.0:-(root)` specifies a single partition with label `root` for `flash.0`.

A flash drive holds whatever data is made available by the emulator in the corresponding target physical memory region.
The data can come from an image file specified during machine instantiation, from an image file specified after instantiation via the `machine:replace_flash()`, or through external state access method `machine:write_memory()`.

The Cartesi-provided `/sbin/init` script scans flash drives 1&ndash;7 for valid file-systems.
When a valid file-system is detected, the script automatically mounts the file-system at `/mnt/<label>`, using the corresponding `<label>` from the `mtdparts` kernel parameter.
In this fashion, file-systems present in all flash drives are available for use right after Linux boots.

This was the case with the command
```bash
playground:~$ cartesi-machine \
    --flash-drive=label:hello,filename:hello.ext2 \
    -- "/mnt/hello/all.sh"
```
The `cartesi-machine` command-line utility instructed the emulator to add a new flash drive, initialized with the contents of the `hello.ext2` image file.
It gave the label `hello` to that flash drive using the kernel command-line parameter `mtdparts=flash.0:-(root);flash.1:-(hello)`.
The `/sbin/init` script identified a valid file-system in device, and used its label to mount it at `/mnt/hello`.
It then executed the command `/mnt/hello/all.sh`, causing all the &ldquo;Hello world!&rdquo; messages to be printed to screen.

### Raw flash drives

Raw flash drives, i.e., flash drives containing free-format data, are not mounted.
Instead, the data in raw flash drives are read from/written to by directly accessing the underlying block device.
The layout and contents of data written to raw flash drives is completely up to application developers.

Depending on the layout and contents, it may be simple or difficult to to read from/write to raw flash drives from the command line.
The most popular tool for reading and writing block devices is the `dd` command-line utility.
Another alternative is the `devio` tool.
Some scripting languages, like the Lua programming language, have packing and unpacking libraries that can be very helpful.

For example, consider the previously discussed Cartesi Machine that operates as an arbitrary-precision calculator
```bash
playground:~$ \rm -f output.raw
playground:~$ truncate -s 4K output.raw
playground:~$ echo "6*2^1024 + 3*2^512" > input.raw
playground:~$ truncate -s 4K input.raw
playground:~$ cartesi-machine \
    --flash-drive="label:input,length:1<<12,filename:input.raw" \
    --flash-drive="label:output,length:1<<12,filename:output.raw,shared" \
    -- $'dd status=none if=$(flashdrive input) | lua -e \'print((string.unpack("z", io.read("a"))))\' | bc | dd status=none of=$(flashdrive output)'
playground:~$ luapp5.3 -e 'print((string.unpack("z", io.read("a"))))' < output.raw
```
The input is a null-terminated string containing the expression to be evaluated.
This string is stored inside a raw flash drive with label `input`.
The output is once again a null-terminated string with the result, this time stored inside a raw flash drive with label `output`.

The command executed inside the machine is
```bash
dd status=none if=$(flashdrive input) | \
    lua -e 'print((string.unpack("z", io.read("a"))))' | \
    bc | \
    dd status=none of=$(flashdrive output)
```
The `flashdrive` command-line utility produces the device corresponding to a given label.
In this case, `flashdrive input` is `/dev/mtdblock1` and `flashdrive output` is `/dev/mtdblock2` (recall `/dev/mtdblock0` is the root file-system, defined by default to load the `rootfs.ext2` image).

The first command, `dd status=none if=$(flashdrive input)` reads the entire 4KiB of the raw input flash drive and sends it to the standard output.
The second command, `lua -e 'print((string.unpack("z", io.read("a"))))'` extracts the firest null-terminated string and prints it to standard out.
This is the meaning of the format `"z"` to the `string.unpack()` function.
There are a variety of other formats available, including reading integers of different sizes, big- or little-endian etc.
Please see the [documentation for the `string.unpack()`](https://www.lua.org/manual/5.3/manual.html#6.4.2) function for more details.
The string is received by the `bc` command-line utility.
In the example, that string is `6*2^1024 + 3*2^512\n`.
The `bc` command-line utility computes the value of the expression and sends it to standard out.
This is finally received by the last command, `dd status=none of=$(flashdrive output)`, which writes it to the raw output flash drive.
(No need to null-terminate, since the drive is already completely filled with zeros.)

## Initialization

By default, a Cartesi Machine starts its execution from the image loaded into ROM.
In order to boot Linux, the Cartesi-provided `rom.bin` image first builds a [<i>devicetree</i>](http://devicetree.org/) describing the hardware.
The organization of a Cartesi Machine is defined during machine instantiation from its configuration.
This includes the number, starts, and lengths of all flash drives, and the amount of RAM.
The `rom.bin` program reads a Cartesi-specific low-level description of this organization from special machine registers and translates it into a devicetree that Linux can understand.
The configuration also includes the initial contents of ROM, RAM, all flash drives, all registers, and the command-line parameters to be passed to the Linux kernel.
The latter is also added to the devicetree.

Once the devicetree is ready, `rom.bin` to the image loaded into RAM, passing the address of the devicetree (which resides at the end of RAM) in a register.
The Cartesi-provided `linux.bin` image is composed of the Linux kernel linked with the Berkeley Boot Loader (BBL).
BBL is a thin abstraction layer that isolates Linux from details of the particular RISC-V machine on which it is running.
The abstraction layer gives Linux the ability to perform tasks such as powering the machine down and outputing a character to the console.
Once this functionality has been installed, BBL jumps to the kernel entrypoint.
The Linux kernel reads the devicetree to find out about the machine organization, loads the appropriate drivers, and performs its own initialization.

When the kernel initialization is complete, it tries to mount a root file-system.
The information of where this root file-system resides comes from the kernel command-line parameter.
In normal situations, this will reside in `/dev/mtdblock0`.
Once the root file-system is mounted, the kernel executes `/sbin/init`.

The Cartesi-provided `/sbin/init` script in `rootfs.ext2` sets up a basic Linux environment on which applications can run.
In particular, it goes over the available flash drive devices (`/dev/mtdblock1`&ndash;`/dev/mtdblock7`) looking for valid file-systems, and mounting them at the appropriate `/mnt/<label>` mount points.
The Linux kernel passes to `/sbin/init`, unmodified, everything after the separator `--` in its own command-line.
Once its initialization tasks are complete, the Cartesi-proviced `/sbin/init` concatenates all its arguments into a string and executes them in a shell.

This is how the commands passed to `cartesi-machine` come to be executed in the Linux environment that runs inside the Cartesi Machine.
Given a proper `rootfs.ext2` and an appropriate command-line, the applications can run any general computation, consuming input from any flash drives, and writing outputs to any flash drives.
Once the application exists, control returns to `/sbin/init`.
The script then unmount all file-systems and gracefully halts the machine.
