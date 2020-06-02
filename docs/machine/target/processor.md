---
title: Processor
---

Following RISC-V terminology, Cartesi Machines implement the
RV64IMASU ISA.  The letters after RV specify the extension
set.  This selection corresponds to a 64-bit machine,
Integer arithmetic with Multiplication and division, Atomic
operations, as well as the optional Supervisor and User
privilege levels.  In addition, Cartesi Machines support the
Sv39 mode of address translation and memory protection.
Sv39 provides a 39-bit protected virtual address space,
divided into 4KiB pages, organized by a three-level page
table.  This set of features creates a balanced compromise
between the simplicity demanded by a blockchain
implementation and the flexibility expected from off-chain
computations.

There are a total of 99 instructions, out of which 28 simply
narrow or widen, respectively, their 64-bit or 32-bit
counterparts.  This being a RISC ISA, most instructions are
very simple and can be simulated in a few lines of
high-level code.  In contrast, the x86 ISA defines at least
2000 (potentially complex) instructions.  In fact, the only
complex operation in RISC-V is the virtual-to-physical
address translation.  Instruction decoding is particularly
simple due to the reduced number of formats (only 4, all
taking 32-bits).

The entire processor state fits within 512&nbsp;bytes, which
are divided into 64 registers, each one holding 64-bits. It
consists of 32 general-purpose integer registers and 26
control and status registers (CSRs). Most of these registers
are defined by the RISC-V&nbsp;ISA; the remaining are
Cartesi-specific. The processor makes its entire state
available, externally and read-only, by mapping individual
registers to the lowest 512 bytes in the physical address space
(in the <i>processor shadow</i>). The adjacent&nbsp;1.5KiB are
reserved for future use. The entire mapping is given in the
following table:
<center>
<table>
<tr>
  <th>Offset</th>             <th>Register</th>
  <th>Offset</th>             <th>Register</th>
  <th>Offset</th>             <th>Register</th>
  <th>Offset</th>             <th>Register</th>
</tr>
<tr>
  <td><tt>0x000</tt></td>     <td><tt>x0 </tt></td>
  <td><tt>0x120</tt></td>     <td><tt>mcycle</tt></td>
  <td><tt>0x160</tt></td>     <td><tt>misa</tt></td>
  <td><tt>0x1a0</tt></td>     <td><tt>sepc</tt></td>
</tr>
<tr>
  <td><tt>0x008</tt></td>     <td><tt>x1 </tt></td>
  <td><tt>0x128</tt></td>     <td><tt>minstret</tt></td>
  <td><tt>0x168</tt></td>     <td><tt>mie</tt></td>
  <td><tt>0x1a8</tt></td>     <td><tt>scause</tt></td>
</tr>
<tr>
  <td><tt>&hellip;</tt></td> <td><tt>&hellip;</tt></td>
  <td><tt>0x130</tt></td>    <td><tt>mstatus</tt></td>
  <td><tt>0x170</tt></td>    <td><tt>mip</tt></td>
  <td><tt>0x1b0</tt></td>    <td><tt>stval</tt></td>
</tr>
<tr>
  <td><tt>0x0f8</tt></td>    <td><tt>x31</tt></td>
  <td><tt>0x138</tt></td>    <td><tt>mtvec</tt></td>
  <td><tt>0x178</tt></td>    <td><tt>medeleg</tt></td>
  <td><tt>0x1b8</tt></td>    <td><tt>satp</tt></td>
</tr>
<tr>
  <td><tt>0x100</tt></td>    <td><tt>pc</tt></td>
  <td><tt>0x140</tt></td>    <td><tt>mscratch</tt></td>
  <td><tt>0x180</tt></td>    <td><tt>mideleg</tt></td>
  <td><tt>0x1c0</tt></td>    <td><tt>scounteren</tt></td>
</tr>
<tr>
  <td><tt>0x108</tt></td>    <td><tt>mvendorid</tt></td>
  <td><tt>0x148</tt></td>    <td><tt>mepc</tt></td>
  <td><tt>0x188</tt></td>    <td><tt>mcounteren</tt></td>
  <td><tt>0x1c8</tt></td>    <td><tt>ilrsc</tt></td>
</tr>
<tr>
  <td><tt>0x110</tt></td>    <td><tt>marchid</tt></td>
  <td><tt>0x150</tt></td>    <td><tt>mcause</tt></td>
  <td><tt>0x190</tt></td>    <td><tt>stvec</tt></td>
  <td><tt>0x1d0</tt></td>    <td><tt>iflags </tt></td>
</tr>
<tr>
  <td><tt>0x118</tt></td>    <td><tt>mimpid</tt></td>
  <td><tt>0x158</tt></td>    <td><tt>mtval</tt></td>
  <td><tt>0x198</tt></td>    <td><tt>sscratch</tt></td>
  <td><tt></tt></td>         <td><tt></tt></td>
</tr>
</table>
</center>

The only particularly relevant standard register
is&nbsp;<tt>mcycle</tt>.  Since its value is advanced at
every CPU cycle, it can be used to identify a particular
step in the computation being performed by a Cartesi
Machine. This is a key component of the verification
process, and can also be used to bound the amount of
computation.

The registers whose names start with
&ldquo;<tt>i</tt>&rdquo; are Cartesi additions, and have the
following semantics:

* The layout for register&nbsp;<tt>iflags</tt> can be seen below:<p></p>
<center>
<table>
<tr>
  <th> Bits </th>
  <td><tt>63&ndash;5</tt></td>
  <td><tt>4&ndash;3</tt></td> 
  <td><tt>2</tt></td> 
  <td><tt>1</tt></td> 
  <td><tt>0</tt></td> 
</tr>
<tr>
  <th> Field </th>
  <td><i>Reserved</i></td>
  <td><tt>PRV</tt></td> 
  <td><tt>Y</tt></td> 
  <td><tt>I</tt></td> 
  <td><tt>H</tt></td> 
</tr>
</table>
</center>
<tt>PRV</tt> gives the current privilege level (0 for User, 1 for Supervisor, and 3 for Machine), bit <tt>Y</tt> is set to 1 when the processor has yielded control back to the host, bit <tt>I</tt> is set to 1 when the processor is idle (i.e., waiting for interrupts), bit <tt>H</tt> is set to 1 to signal the processor has been permanently halted.
* Register&nbsp;<tt>ilrsc</tt> holds the reservation address for the&nbsp;LR/SC atomic memory operations;

