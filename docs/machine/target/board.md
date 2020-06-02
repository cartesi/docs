---
title: Board
---

The interaction between board and processor happens through interrupts and the memory bus. Devices are mapped to the processor's physical address space.
The mapping can be seen in the following table:

<center>
<table>
<tr>
  <th> Physical address </th>
  <th> Mapping </th>
</tr>
<tr>
  <td> <tt>0x00000000&ndash;0x000003ff</tt> </td>
  <td> Processor shadow </td>
</tr>
<tr>
  <td> <tt>0x00000800&ndash;0x00000Bff</tt> </td>
  <td> Board shadow </td>
</tr>
<tr>
  <td> <tt>0x00001000&ndash;0x00010fff</tt> </td>
  <td> ROM (Bootstrap &amp; Devicetree) </td>
</tr>
<tr>
  <td> <tt>0x02000000&ndash;0x020bffff</tt> </td>
  <td> Core Local Interruptor </td>
</tr>
<tr>
  <td> <tt>0x40000000&ndash;0x40007fff</tt> </td>
  <td> Host-Target Interface </td>
</tr>
<tr>
  <td> <tt>0x80000000&ndash;</tt><i>configurable</i> </td>
  <td> RAM </td>
</tr>
<tr>
  <td> <i> configurable </i> </td>
  <td> Flash drive 0 </td>
</tr>
<tr>
  <td> &hellip;</td>
  <td> &hellip;</td>
</tr>
<tr>
  <td> <i> configurable </i> </td>
  <td> Flash drive 7 </td>
</tr>
</table>
</center>

There are 64KiB of ROM starting at address&nbsp;<tt>0x1000</tt>,
where execution starts.  The amount of RAM is
user-configurable, but always starts at address&nbsp;<tt>0x80000000</tt>.
Finally, a number of additional physical memory ranges can
be set aside for flash-memory devices.  These will typically
be preloaded with file-system images, but can also hold raw
data.

The board maps two non-memory devices to the physical address space: CLINT and
HTIF.

### CLINT

The Core Local Interruptor (or CLINT) controls the timer interrupt.
The active addresses are&nbsp;<tt>0x0200bff8</tt>&nbsp;(<tt>mtime</tt>) and&nbsp;<tt>0x02004000</tt>&nbsp;(<tt>mtimecmp</tt>). The CLINT issues a hardware interrupt whenever&nbsp;<tt>mtime</tt> equals&nbsp;<tt>mtimecmp</tt>.
Since Cartesi Machines must ensure reproducibility, the processor's clock and the timer are locked by a constant frequency divisor of&nbsp;<tt>100</tt>.
In other words, <tt>mtime</tt> is incremented once for every 100 increments of&nbsp;<tt>mcycle</tt>.
There is no notion of wall-clock time.

### HTIF


The Host-Target Interface (HTIF) mediates communication with the external world.
It is mapped to a physical memory starting at `0x40000000`, where registers can be accessed at the following offsets:

<center>
<table>
<tr>
  <th>Offset</th>             <th>Register</th>
</tr>
<tr>
  <td><tt>0x000</tt></td>     <td><tt>tohost</tt></td>
</tr>
<tr>
  <td><tt>0x008</tt></td>     <td><tt>fromhost</tt></td>
</tr>
<tr>
  <td><tt>0x010</tt></td>     <td><tt>ihalt</tt></td>
</tr>
<tr>
  <td><tt>0x018</tt></td>     <td><tt>iconsole</tt></td>
</tr>
<tr>
  <td><tt>0x020</tt></td>     <td><tt>iyield</tt></td>
</tr>
<tr>
  <td><tt>0x028</tt></td>     <td><i>Reserved</i></td>
</tr>
<tr>
  <td><tt>&hellip;</tt></td>     <td><tt>&hellip;</tt></td>
</tr>
<tr>
  <td><tt>0x218</tt></td>     <td><i>Reserved</i></td>
</tr>
</table>
</center>

The format of CSRs `tohost` and `fromhost` are as follows: <p></p>
<center>
<table>
<tr>
  <th> Bits </th>
  <td><tt>63&ndash;56</tt></td>
  <td><tt>55&ndash;48</tt></td>
  <td><tt>47&ndash;0</tt></td>
</tr>
<tr>
  <th> Field </th>
  <td><tt>DEV</tt></td>
  <td><tt>CMD</tt></td>
  <td><tt>DATA</tt></td>
</tr>
</table>
</center>

Interactions with Cartesi's HTIF device follow the following protocol:
<ol>
<li> start by writing 0 to <tt>fromhost</tt>; </li>
<li> write the <i>request</i> to <tt>tohost</tt>; </li>
<li> read the <i>response</i> from <tt>fromhost</tt>. </li>
</ol>
Cartesi's HTIF supports 3 subdevices:
<ul>
  <li>Halt (<tt>DEV</tt>=0) &mdash; To halt the machine, request <tt>CMD</tt>=0, and <tt>DATA</tt> containing bit 0 set to&nbsp;1.
(Bits 47&ndash;1 can be set to an arbitrary exit code.) This will permanently set bit <tt>H</tt> in <tt>iflags</tt> and return control back to the host. </li>
  <li>Console (<tt>DEV</tt>=1) &mdash; To output a character <tt>ch</tt> to console, request <tt>CMD</tt>=1, with <tt>DATA</tt>=<tt>ch</tt>. To input a  character from console (in interactive sessions), request <tt>CMD</tt>=0, <tt>DATA</tt>=0, then read response <tt>CMD</tt>=0, <tt>DATA</tt>=ch+1. (<tt>DATA</tt>=0 means no character was available; </li>
  <li>Yield (<tt>DEV</tt>=2) &mdash; This is a
Cartesi-specific subdevice. To yield control back
to the host and report progress <tt>permil</tt>, request <tt>CMD</tt>=0 and <tt>DATA</tt>=<tt>permil</tt>. This will set bit <tt>Y</tt> in <tt>iflags</tt> until the emulator is resumed. </li>
</ul>

Registers `ihalt`, `iconsole`, and `iyield` are bit masks specifying the which
commands are available for the respective devices.

### PMAs

The physical memory mapping is described by Physical Memory Attribute records (PMAs) that start at address <tt>0x00000800</tt> (the <i>board shadow</i>) .
Each PMA consists of 2 64-bit words.
The first word gives the start of a range and the second word its length.
Since the ranges must be aligned to 4KiB page boundaries,
the lowest 12-bits of each word are available for attributes.
The meaning of each attribute field is as follows:
<center>
<table>
<tr>
  <th> Bits </th>
  <td><tt>63&ndash;12</tt></td>
  <td><tt>11&ndash;8</tt></td>
  <td><tt>7</tt></td>
  <td><tt>6</tt></td>
  <td><tt>5</tt></td>
  <td><tt>4</tt></td>
  <td><tt>3</tt></td>
  <td><tt>2</tt></td>
  <td><tt>1</tt></td>
  <td><tt>0</tt></td>
</tr>
<tr>
  <th> Field </th>
  <td><tt>start</tt></td>
  <td><tt>DID</tt></td>
  <td><tt>IW</tt></td>
  <td><tt>IR</tt></td>
  <td><tt>X</tt></td>
  <td><tt>W</tt></td>
  <td><tt>R</tt></td>
  <td><tt>E</tt></td>
  <td><tt>IO</tt></td>
  <td><tt>M</tt></td>
</tr>
<tr> <td colspan="11"> </td> </tr>
<tr>
  <th> Bits </th>
  <td><tt>63&ndash;12</tt></td>
  <td colspan="9"><tt>11&ndash;0</tt></td>
</tr>
<tr>
  <th> Field </th>
  <td><tt>length</tt></td>
  <td colspan="9"><i>Reserved (=0)</i></td>
</tr>
</table>
</center>

The <tt>M</tt>, <tt>IO</tt>, and <tt>E</tt> bits are mutually exclusive, and respectively mark the range as memory, I/O mapped, or excluded.
Bits <tt>R</tt>, <tt>W</tt>, and&nbsp;<tt>X</tt> mark read, write, and execute permissions, respectively.
The <tt>IR</tt> and&nbsp;<tt>IW</tt> bits mark the range as idempotent for reads and writes, respectively.
Finally, the <tt>DID</tt> gives the device id
(0 for memory ranges, 1 for the shadows, 2 for a flash drive, 3 for CLINT, and 3 for HTIF).

The list of PMA records ends with an invalid PMA entry for
which <tt>length</tt>=0.
