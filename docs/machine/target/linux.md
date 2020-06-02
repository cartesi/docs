---
title: Linux
---

Setting up a Linux system from scratch involves a variety of steps.
Unlike stand-alone systems, embedded systems are not usually self-hosting.
Instead, components are built in a separate host system, on which a cross-compiling toolchain for the target architecture has been installed.
The key components are the GNU Compiler Collection and the GNU C Library.
Support for RISC-V is upstream in the official [GCC compiler collection](https://gcc.gnu.org/).
The Emulator SDK includes a Docker image with the [toolchain](machine/toolchain.md) pre-installed.
The toolchain is used to cross-compile the ROM image, the
RAM image, and the root file-system.

Before control reaches the RAM image (and ultimately the Linux kernel), a small program residing in ROM builds a [<i>devicetree</i>](http://devicetree.org/) describing the hardware.
To do so, it goes over the PMA entries identifying the devices and their locations in the physical address space.
It also looks for a null-terminated string containing the command-line for the Linux kernel starting at the last 4k of the ROM region.
Once the devicetree is ready, the ROM program sets register&nbsp;<tt>x10</tt> to 0 (the value of&nbsp;<tt>mhartid</tt>), <tt>x11</tt> to point to the devicetree, and then jumps to RAM-base at&nbsp;<tt>0x80000000</tt>.
This is where the entry point of the RAM image is expected to reside.
The Emulator SDK includes a repository that uses toolchain to build the [ROM image](machine/ROM.md).

Linux support for RISC-V is upstream in the [Linux kernel archives](https://www.kernel.org/).
The kernel runs in supervisor mode, on top of a Supervisor Binary Interface (SBI) provided by a machine-mode shim: the Berkeley Boot Loader (BBL).
BBL can be found in the [RISC-V Proxy Kernel repository](https://github.com/riscv/riscv-pk).
The BBL is linked against the Linux kernel and this resulting RAM image is preloaded into RAM.
The SBI provides a simple interface through which the kernel interacts with CLINT and HTIF.
Besides implementing the SBI, the BBL also installs a trap that catches invalid instruction exceptions.
This mechanism can be used, for example, to emulate floating-point instructions, although it is more efficient to setup the target toolchain to replace floating point instructions with calls to a soft-float implementation instead.
After installing the trap, BBL switches to supervisor mode and cedes control to the kernel entry point.
The Emulator SDK includes a Docker image that automates the building of a RAM image with the [Linux kernel](machine/kernel.md).

The final step is the creation of a root file-system.
This process starts with a skeleton directory in the host system containing a few subdirectories (<tt>sbin</tt>, <tt>lib</tt>, <tt>var</tt>, etc) and text files (<tt>sbin/init</tt>, <tt>etc/fstab</tt>, <tt>etc/passwd</tt> etc).
Tiny versions of many common UNIX utilities (<tt>ls</tt>, <tt>cd</tt>, <tt>rm</tt>, etc) can be combined into a single binary using [BusyBox](https://busybox.net/).
Target executables often depend on shared libraries provided by the toolchain (<tt>lib/libm.so</tt>, <tt>lib/ld.so</tt>, and <tt>lib/libc.so</tt>).
Naturally, these libraries must be copied to the root file-system.
Once the root directory is ready, it is copied into an actual file-system image (e.g., using <tt>gene2fs</tt>).
This process can be automated with tool for creating
embedded Linux distributions, such as
[Buildroot](https://buildroot.org/), which enables developers to customize the root file-system according to the needs of their applications.
Thousands of packages are available for installation.
The Emulator SDK includes a Docker image that automates the building of a [root file-system](machine/rootfs.md) using Buildroot.

The root file-system image is installed as a flash drive.
Additional flash devices can be used to store the inputs to the computation, or to receive its outputs.
The devicetree created by the ROM program is used to inform Linux of the location of each flash device, the amount of RAM, and any kernel boot parameters.
Here is an excerpt: <a name="devicetree"> </a>

```
memory@80000000 {
  device_type = "memory";
  reg = <0x0 0x80000000 0x0 0x8000000>;
};

flash@8000000000 {
  #address-cells = <0x2>;
  #size-cells = <0x2>;
  compatible = "mtd-ram";
  bank-width = <0x4>;
  reg = <0x80 0x0 0x0 0x4000000>;
  linux,mtd-name = "flash.0";
};

chosen {
  bootargs = "console=hvc0 rootfstype=ext2 root=/dev/mtdblock0 rw mtdparts=flash.0:-(root)";
};
```

The first section specifies 128MiB of RAM starting at the 2GiB boundary.
The middle section adds a 64MiB flash device, starting at the 512GiB boundary.
The &ldquo;<tt>mtd-ram</tt>&rdquo; driver exposes the device as <tt>/dev/mtdblock0</tt> under Linux's virtual file-system.
The last section, giving the kernel parameters&nbsp;<tt>bootargs</tt>, specifies the device to be mounted as root and the associated partition label.

After completing its own initialization, the kernel eventually cedes control to&nbsp;<tt>/sbin/init</tt>.
The root file-system provided by the Cartesi Emulator SDK includes a simple init script that mounts the flash drives that contain valid file-systems and either drops into a shell (when in interactive mode) or executes a custom DApp script.
The kernel passes to <tt>/sbin/init</tt> as command-line parameters all arguments after the separator&nbsp;<tt>--</tt>&nbsp;in <tt>bootargs</tt>.
Cartesi's init script checks if the first argument executable and, if so, assumes this is the custom DApp script.
It executes this script, passing the additional parameters unchanged.
The custom DApp script typically invokes the appropriate sequence of commands for performing the desired computation.
Upon completion, <tt>/sbin/init</tt> halts the machine.
The DApp script can alternatively use HTIF to halt the machine with an optional exit code that can be used as part of the computation output.
Arbitrarily complex inputs, parameters, and outputs can be passed as flash devices.



