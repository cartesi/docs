# Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`namespace `[`cartesi`](#namespacecartesi) | 
`namespace `[`test_client`](#namespacetest__client) | 
`class `[`is_template_base_of`](#classis__template__base__of) | SFINAE test if class is derived from from a base template class.
`class `[`MachineClient`](#class_machine_client) | 
`class `[`MachineServiceImpl`](#class_machine_service_impl) | 
`class `[`cartesi::logged_state_access::scoped_note`](#classcartesi_1_1logged__state__access_1_1scoped__note) | Adds annotations to the state, bracketing a scope.
`struct `[`cartesi::pma_memory::callocd`](#structcartesi_1_1pma__memory_1_1callocd) | Calloc'd range data (just a tag).
`struct `[`Context`](#struct_context) | 
`struct `[`cartesi::pma_entry::flags`](#structcartesi_1_1pma__entry_1_1flags) | < Exploded flags for PMA entry.
`struct `[`cartesi::pma_memory::mmapd`](#structcartesi_1_1pma__memory_1_1mmapd) | Mmap'd range data (shared or not).
`struct `[`pma`](#structpma) | 
`struct `[`pma_ext_hdr`](#structpma__ext__hdr) | 
`struct `[`cartesi::merkle_tree::proof_type`](#structcartesi_1_1merkle__tree_1_1proof__type) | Storage for the proof of a word value.
`struct `[`cartesi::merkle_tree::tree_node`](#structcartesi_1_1merkle__tree_1_1tree__node) | Merkle tree node structure.

# namespace `cartesi` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`enum `[`access_type`](#access-log_8h_1a5b2dcf7c7a46db7c7c78a0256bff45b4)            | Type of state access.
`enum `[`bracket_type`](#bracket-note_8h_1aea6e9de496553fd9ecfd2321240e1f52)            | Bracket type.
`enum `[`clint_csr`](#clint_8h_1a08669f7548e2d22b4833f76edd5b833a)            | Mapping between CSRs and their relative addresses in CLINT memory.
`enum `[`HTIF_constants`](#htif_8h_1a015aeab4064a1957db0a4500f9b8b4cb)            | HTIF constants.
`enum `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)            | Instruction fetch status code.
`enum `[`fetch_status`](#interpret_8cpp_1a795403770b7df9a4eb0e1d9ae305946e)            | Instruction fetch status code.
`enum `[`interpreter_status`](#interpret_8h_1a1f82faa5b381ff7131252c5727171661)            | Interpreter status code.
`enum `[`FLASH_constants`](#machine-config_8h_1a0d179949541cf729afb1b4aae0dd687a)            | FLASH constants.
`enum `[`TLB_constants`](#machine-state_8h_1a47b2a91c4fe3a52a28e1487f639a6417)            | TLB constants.
`enum `[`PMA_ranges`](#pma-constants_8h_1a3781ac3458a5523dcaec4fbc9bf7d25e)            | Fixed PMA ranges.
`enum `[`PMA_constants`](#pma-constants_8h_1a0a610b6325789bc7cc5b3381d884ea3e)            | PMA constants.
`enum `[`PMA_ISTART_shifts`](#pma-constants_8h_1a2095cec4c138df101787ad6c1d4f086d)            | PMA istart shifts.
`enum `[`PMA_ISTART_masks`](#pma-constants_8h_1af14ca322423bf6650b9f734f906e65cc)            | PMA istart masks.
`enum `[`PMA_ISTART_DID`](#pma-constants_8h_1af1653605bf791b39ada81f1dbd923571)            | PMA device ids.
`enum `[`RISCV_constants`](#riscv-constants_8h_1a7f26eb51589ee4f65d575c73a22d5a2a)            | Global RISC-V constants.
`enum `[`MIP_shifts`](#riscv-constants_8h_1afcc01af5e41ef6315d3c7239f7aaafeb)            | MIP shifts.
`enum `[`MIP_masks`](#riscv-constants_8h_1abf908966a63f0e5f4b57b6bb9980ad2e)            | MIP masks.
`enum `[`MCAUSE_constants`](#riscv-constants_8h_1a059155cc240db2d1118797a8f91ec401)            | mcause for exceptions
`enum `[`PRV_constants`](#riscv-constants_8h_1a3b8d8c64da1874f748fb746c016c3017)            | Privilege modes.
`enum `[`MISA_shifts`](#riscv-constants_8h_1a280bd9c3388e0e34f81f2653af7ff55f)            | misa shifts
`enum `[`MISA_masks`](#riscv-constants_8h_1adb92d3986b1f9479215883562cd5e9d1)            | misa masks
`enum `[`MISA_constants`](#riscv-constants_8h_1a8d477dc78728679ba79544384f101c14)            | misa constants
`enum `[`MSTATUS_shifts`](#riscv-constants_8h_1a082a8d3bc76a150635f3eeddc86c9304)            | mstatus shifts
`enum `[`MSTATUS_masks`](#riscv-constants_8h_1ad0788252eff92d037bc60fdfa7748187)            | mstatus masks
`enum `[`MSTATUS_RW_masks`](#riscv-constants_8h_1a8b17c6d980c0cfda1fd67c7fa2f24803)            | mstatus read-write masks
`enum `[`SSTATUS_rw_masks`](#riscv-constants_8h_1ad53ea2058ce79e47cdc57327d4588689)            | sstatus read/write masks
`enum `[`PTE_shifts`](#riscv-constants_8h_1ae09bc78417b5af6003dd598557f8363a)            | Page-table entry shifts.
`enum `[`PTE_masks`](#riscv-constants_8h_1a76431016f33ca494fbbea747a1ab2f9b)            | Page-table entry masks.
`enum `[`PAGE_shifts`](#riscv-constants_8h_1a04d57eac8ecf294858b5eb60a3f64d36)            | Paging shifts.
`enum `[`PAGE_masks`](#riscv-constants_8h_1a7d110348a2e0dd6ea2aaf2716cba05b5)            | Paging masks.
`enum `[`MCOUNTEREN_shifts`](#riscv-constants_8h_1a3d2525fb2a8bd04673f1fe06c47b135f)            | mcounteren shifts
`enum `[`MCOUNTEREN_masks`](#riscv-constants_8h_1af6f3ac2bd3ead67d26d755375bd62d53)            | mcounteren masks
`enum `[`COUNTEREN_rw_masks`](#riscv-constants_8h_1afa1054f547e0ce4c31d26f87be15b72d)            | counteren write masks
`enum `[`IFLAGS_shifts`](#riscv-constants_8h_1a2f5f64c73b5665d588134837f2f2f8a9)            | Cartesi-specific iflags shifts.
`enum `[`CARTESI_init`](#riscv-constants_8h_1a51e248e4a772e38e07105e32968a5533)            | Initial values for Cartesi machines.
`enum `[`CSR_address`](#riscv-constants_8h_1a0def04ee38a93e6cc26834eb9be26767)            | Mapping between CSR names and addresses.
`enum `[`insn_opcode`](#riscv-constants_8h_1abeac12053ba5411ee4e8406b832d42f1)            | Names for instruction opcode field.
`enum `[`insn_branch_funct3`](#riscv-constants_8h_1a79cdf5b1743a939f25c8ce1a5a545420)            | Names for branch instructions funct3 field.
`enum `[`insn_load_funct3`](#riscv-constants_8h_1a4352488743034e000964932bf410a7c0)            | Names for load instructions funct3 field.
`enum `[`insn_store_funct3`](#riscv-constants_8h_1a8f050a68517d0c84f7aadfee7c251523)            | Names for store instructions funct3 field.
`enum `[`insn_arithmetic_immediate_funct3`](#riscv-constants_8h_1ad26d7899de06983877b7dfe3055afed5)            | Names for arithmetic-immediate instructions funct3 field.
`enum `[`insn_shift_right_immediate_funct6`](#riscv-constants_8h_1ad9504d9bf4567ae712be5005be8daaeb)            | Names for shift-right immediate instructions funct6 field.
`enum `[`insn_arithmetic_funct3_funct7`](#riscv-constants_8h_1af28da1960f09cbc3de91e5091a8ca5fa)            | Names for arithmetic instructions concatenated funct3 and funct7 fields.
`enum `[`insn_env_trap_int_group_insn`](#riscv-constants_8h_1a1b1a6e08d7eea9a8224bebf8f9e15fc5)            | Names for env, trap, and int instructions.
`enum `[`insn_csr_env_trap_int_mm_funct3`](#riscv-constants_8h_1ab5be6b9fbd2abbb211b22ef89a7ee20e)            | Names for csr, env, trap, int, mm instructions funct3 field.
`enum `[`insn_arithmetic_immediate_32_funct3`](#riscv-constants_8h_1a4d452885f034de2fa41e01b44296067c)            | Names for 32-bit arithmetic immediate instructions funct3 field.
`enum `[`insn_shift_right_immediate_32_funct7`](#riscv-constants_8h_1afe962fa38af0e646a6958df6538f183d)            | Names for 32-bit shift-right immediate instructions funct7 field.
`enum `[`insn_arithmetic_32_funct3_funct7`](#riscv-constants_8h_1adc802724e4dd29eed233fc5c7084a65b)            | Names for 32-bit arithmetic instructions concatenated funct3 and funct7 fields.
`enum `[`insn_atomic_funct3_funct5`](#riscv-constants_8h_1ac644aff3deceae43520690cc491b5267)            | Names for atomic instructions concatenated funct3 and funct5 fields.
`enum `[`RTC_constants`](#rtc_8h_1af609a9e754e1870ba4910ce134f6b67c)            | RTC constants.
`enum `[`shadow_csr`](#shadow_8h_1aa4c10e5d31db8a49eb0b1845da3750e6)            | Mapping between CSRs and their relative addresses in shadow memory.
`public uint64_t `[`clint_get_csr_rel_addr`](#clint_8cpp_1af9da895e8af0a44f00b725eeb699c0f0)`(`[`clint_csr`](#clint_8h_1a08669f7548e2d22b4833f76edd5b833a)` reg)`            | Obtains the relative address of a CSR in HTIF memory.
`public static bool `[`clint_read_msip`](#clint_8cpp_1a7e7d9ed30d9838915bcc78683f5742d6)`(`[`i_virtual_state_access`](#classcartesi_1_1i__virtual__state__access)` * a,uint64_t * val,int size_log2)`            | 
`public static bool `[`clint_read_mtime`](#clint_8cpp_1ab6908929b61aa5c851dd04cf41628585)`(`[`i_virtual_state_access`](#classcartesi_1_1i__virtual__state__access)` * a,uint64_t * val,int size_log2)`            | 
`public static bool `[`clint_read_mtimecmp`](#clint_8cpp_1ae17ff3c50e2391984dbf583fca8225e7)`(`[`i_virtual_state_access`](#classcartesi_1_1i__virtual__state__access)` * a,uint64_t * val,int size_log2)`            | 
`public static bool `[`clint_read`](#clint_8cpp_1abcd23e7708183f4ece30ceff3141b1ba)`(const `[`pma_entry`](#classcartesi_1_1pma__entry)` & pma,`[`i_virtual_state_access`](#classcartesi_1_1i__virtual__state__access)` * a,uint64_t offset,uint64_t * val,int size_log2)`            | CLINT device read callback. See ::pma_read.
`public static bool `[`clint_write`](#clint_8cpp_1a28879251a603328970340919b179e552)`(const `[`pma_entry`](#classcartesi_1_1pma__entry)` & pma,`[`i_virtual_state_access`](#classcartesi_1_1i__virtual__state__access)` * a,uint64_t offset,uint64_t val,int size_log2)`            | CLINT device read callback. See ::pma_write.
`public static bool `[`clint_peek`](#clint_8cpp_1ae2b40a4cdfaf5b45854360e4fb9de0b3)`(const `[`pma_entry`](#classcartesi_1_1pma__entry)` & pma,uint64_t page_offset,const unsigned char ** page_data,unsigned char * scratch)`            | CLINT device peek callback. See ::pma_peek.
`public void `[`clint_register_mmio`](#clint_8cpp_1a583fc0f9a310b70d00dcbb0bec12a32b)`(`[`machine`](#classcartesi_1_1machine)` & m,uint64_t start,uint64_t length)`            | Registers a CLINT device with the machine.
`public static void `[`set_nonblocking`](#htif_8cpp_1a94d66fdc0eed42b70072b88637bb7541)`(int fd)`            | Sets descriptor to non-blocking mode.
`public static void `[`set_blocking`](#htif_8cpp_1a4046877c574ae0e8b5848e9d9aa80dcb)`(int fd)`            | Sets descriptor to blocking mode.
`public static bool `[`htif_read`](#htif_8cpp_1a1f9e77a1865e0838293de018b98f5035)`(const `[`pma_entry`](#classcartesi_1_1pma__entry)` & pma,`[`i_virtual_state_access`](#classcartesi_1_1i__virtual__state__access)` * a,uint64_t offset,uint64_t * pval,int size_log2)`            | HTIF device read callback. See ::pma_read.
`public static bool `[`htif_peek`](#htif_8cpp_1a126af465c557b41cd043e7cc2145ee9e)`(const `[`pma_entry`](#classcartesi_1_1pma__entry)` & pma,uint64_t page_offset,const unsigned char ** page_data,unsigned char * scratch)`            | HTIF device peek callback. See ::pma_peek.
`public static bool `[`htif_write_getchar`](#htif_8cpp_1afb59e2974fe200a5666bf660964faafc)`(`[`i_virtual_state_access`](#classcartesi_1_1i__virtual__state__access)` * a,`[`htif`](#classcartesi_1_1htif)` * h,uint64_t payload)`            | 
`public static bool `[`htif_write_putchar`](#htif_8cpp_1ab37f14163a66be819a969b410311bf4a)`(`[`i_virtual_state_access`](#classcartesi_1_1i__virtual__state__access)` * a,`[`htif`](#classcartesi_1_1htif)` * h,uint64_t payload)`            | 
`public static bool `[`htif_write_halt`](#htif_8cpp_1ae4c7005cfccf7681572621f8b90b0fbc)`(`[`i_virtual_state_access`](#classcartesi_1_1i__virtual__state__access)` * a,`[`htif`](#classcartesi_1_1htif)` * h,uint64_t payload)`            | 
`public static bool `[`htif_write_tohost`](#htif_8cpp_1ac3bf58be48302bb75528d39318c69ff6)`(`[`i_virtual_state_access`](#classcartesi_1_1i__virtual__state__access)` * a,`[`htif`](#classcartesi_1_1htif)` * h,uint64_t tohost)`            | 
`public static bool `[`htif_write_fromhost`](#htif_8cpp_1a5cf1d096af8d91342aaa6d550fcc8765)`(`[`i_virtual_state_access`](#classcartesi_1_1i__virtual__state__access)` * a,`[`htif`](#classcartesi_1_1htif)` * h,uint64_t val)`            | 
`public static bool `[`htif_write`](#htif_8cpp_1ac677ac703c05ddc85f54e71928206bc9)`(const `[`pma_entry`](#classcartesi_1_1pma__entry)` & pma,`[`i_virtual_state_access`](#classcartesi_1_1i__virtual__state__access)` * a,uint64_t offset,uint64_t val,int size_log2)`            | HTIF device write callback. See ::pma_write.
`public static void `[`print_uint64_t`](#interpret_8cpp_1a9728ba30df1ea1b12837a7984a6c7e12)`(uint64_t a)`            | 
`public void `[`dump_regs`](#interpret_8cpp_1a1fc7ee6553c9664f270e05b3c5c94564)`(const `[`machine_state`](#structcartesi_1_1machine__state)` & s)`            | 
`public template<>`  <br/>`static `[`pma_entry`](#classcartesi_1_1pma__entry)` & `[`find_pma_entry`](#interpret_8cpp_1a179c26c1622de5d0e530acec2ec3db23)`(STATE_ACCESS & a,uint64_t paddr)`            | Obtain PMA entry overlapping with target physical address.
`public template<>`  <br/>`inline static bool `[`write_ram_uint64`](#interpret_8cpp_1af19e713c2f0a7a011b6070741198e3f6)`(STATE_ACCESS & a,uint64_t paddr,uint64_t val)`            | Write an aligned word to memory.
`public template<>`  <br/>`inline static bool `[`read_ram_uint64`](#interpret_8cpp_1af2ba80982fd5083b8f7ba173bb67912f)`(STATE_ACCESS & a,uint64_t paddr,uint64_t * pval)`            | Read an aligned word from memory.
`public template<>`  <br/>`static bool `[`translate_virtual_address`](#interpret_8cpp_1a11b1f08de4cab1a9aa9014f6ebcd4f56)`(STATE_ACCESS & a,uint64_t * ppaddr,uint64_t vaddr,int xwr_shift)`            | Walk the page table and translate a virtual address to the corresponding physical address.
`public static void `[`tlb_mark_dirty_page`](#interpret_8cpp_1ac573284642614fde66498dda837f4e65)`(`[`tlb_entry`](#structcartesi_1_1tlb__entry)` & tlb)`            | Mark TLB entry as dirty in dirty page map.
`public inline static unsigned char * `[`tlb_replace_read`](#interpret_8cpp_1a2c9ac085b35c0fd63cfc5cf7719cd478)`(`[`pma_entry`](#classcartesi_1_1pma__entry)` & pma,uint64_t vaddr,uint64_t paddr,`[`tlb_entry`](#structcartesi_1_1tlb__entry)` & tlb)`            | Replaces an entry in the TLB with a new one when reading.
`public inline static unsigned char * `[`tlb_replace_write`](#interpret_8cpp_1abe2665b83f94efb4fdd5dac1b8c6f4f5)`(`[`pma_entry`](#classcartesi_1_1pma__entry)` & pma,uint64_t vaddr,uint64_t paddr,`[`tlb_entry`](#structcartesi_1_1tlb__entry)` & tlb)`            | Replaces an entry in the TLB with a new one when writing.
`public template<>`  <br/>`inline static bool `[`tlb_hit`](#interpret_8cpp_1a0ae4214748bd42ee1dc49d906ec7491e)`(const `[`tlb_entry`](#structcartesi_1_1tlb__entry)` & tlb,uint64_t vaddr)`            | Checks for a TLB hit.
`public static void `[`tlb_flush_all`](#interpret_8cpp_1adc1bffc5f869fe08c7023405311d6404)`(`[`machine_state`](#structcartesi_1_1machine__state)` & s)`            | Invalidates all TLB entries.
`public static void `[`tlb_flush_vaddr`](#interpret_8cpp_1a2657383d6e55a10019fc4ebc50959d2c)`(`[`machine_state`](#structcartesi_1_1machine__state)` & s,uint64_t vaddr)`            | Invalidates a specific mapping.
`public inline static bool `[`csr_is_read_only`](#interpret_8cpp_1a620fbbb527350f442b1b58ae2a6e8792)`(`[`CSR_address`](#riscv-constants_8h_1a0def04ee38a93e6cc26834eb9be26767)` csraddr)`            | Checks if CSR is read-only.
`public inline static uint32_t `[`csr_priv`](#interpret_8cpp_1a49df1726f5030b51c8721ccd3b4ae290)`(`[`CSR_address`](#riscv-constants_8h_1a0def04ee38a93e6cc26834eb9be26767)` csr)`            | Extract privilege level from CSR address.
`public template<>`  <br/>`static void `[`set_priv`](#interpret_8cpp_1aff0f7b117159b9a1da540fcbe95a53b2)`(STATE_ACCESS & a,int previous_prv,int new_prv)`            | Changes privilege level.
`public template<>`  <br/>`static void `[`raise_exception`](#interpret_8cpp_1a61a6dd5b4e9a5bc9c6421596bffba17c)`(STATE_ACCESS & a,uint64_t cause,uint64_t tval)`            | Raise an exception (or interrupt).
`public template<>`  <br/>`inline static uint32_t `[`get_pending_irq_mask`](#interpret_8cpp_1a9c33502d6cdd30918d7a889cd1fd183d)`(STATE_ACCESS & a)`            | Obtains a mask of pending and enabled interrupts.
`public inline static uint32_t `[`ilog2`](#interpret_8cpp_1affefadda9e839e479a320e213bbaa89e)`(uint32_t v)`            | 
`public template<>`  <br/>`static void `[`raise_interrupt_if_any`](#interpret_8cpp_1ae484ba062c44919695174366cbed3f0c)`(STATE_ACCESS & a)`            | Raises an interrupt if any are enabled and pending.
`public inline static uint32_t `[`insn_get_rd`](#interpret_8cpp_1af8912ebe46192d9a9be94f5f80ed24d9)`(uint32_t insn)`            | Obtains the RD field from an instruction.
`public inline static uint32_t `[`insn_get_rs1`](#interpret_8cpp_1a7e4902622bd153d58251a135f2c14ff5)`(uint32_t insn)`            | Obtains the RS1 field from an instruction.
`public inline static uint32_t `[`insn_get_rs2`](#interpret_8cpp_1a649371ca7f8886679a4d38dd42e32146)`(uint32_t insn)`            | Obtains the RS2 field from an instruction.
`public inline static int32_t `[`insn_I_get_imm`](#interpret_8cpp_1a5bd833d1fbc3fea2fd242a4ee60e7307)`(uint32_t insn)`            | Obtains the immediate value from a I-type instruction.
`public inline static uint32_t `[`insn_I_get_uimm`](#interpret_8cpp_1acbf0b6409f3755a0a71ca4650d0307e4)`(uint32_t insn)`            | Obtains the unsigned immediate value from a I-type instruction.
`public inline static int32_t `[`insn_U_get_imm`](#interpret_8cpp_1a029c25f1e6aa0bac065f1099a293d673)`(uint32_t insn)`            | Obtains the immediate value from a U-type instruction.
`public inline static int32_t `[`insn_B_get_imm`](#interpret_8cpp_1a70a9de9fd16bf8efb2b5c81fdd9549de)`(uint32_t insn)`            | Obtains the immediate value from a B-type instruction.
`public inline static int32_t `[`insn_J_get_imm`](#interpret_8cpp_1afc5a990fb8865e75e31eb30b095b3da6)`(uint32_t insn)`            | Obtains the immediate value from a J-type instruction.
`public inline static int32_t `[`insn_S_get_imm`](#interpret_8cpp_1a3c5cde9af69c0d1f2d41cefa24f59bf5)`(uint32_t insn)`            | Obtains the immediate value from a S-type instruction.
`public inline static uint32_t `[`insn_get_opcode`](#interpret_8cpp_1ac7e08427224cd117fc5a957b7b6a3e2e)`(uint32_t insn)`            | Obtains the opcode field from an instruction.
`public inline static uint32_t `[`insn_get_funct3`](#interpret_8cpp_1a2abbb08c9fd2a71010f14cc9cd93dd7e)`(uint32_t insn)`            | Obtains the funct3 field from an instruction.
`public inline static uint32_t `[`insn_get_funct3_funct7`](#interpret_8cpp_1aed612287c92285b55d0cf47a590e90ee)`(uint32_t insn)`            | Obtains the concatanation of funct3 and funct7 fields from an instruction.
`public inline static uint32_t `[`insn_get_funct3_funct5`](#interpret_8cpp_1a4b835012b6628464a039d2d59b83319e)`(uint32_t insn)`            | Obtains the concatanation of funct3 and funct5 fields from an instruction.
`public inline static uint32_t `[`insn_get_funct7`](#interpret_8cpp_1a05f7442af5651bff7ca5f61441c1a61c)`(uint32_t insn)`            | Obtains the funct7 field from an instruction.
`public inline static uint32_t `[`insn_get_funct6`](#interpret_8cpp_1a6ab72cffda23553134c5f7de19bbfed5)`(uint32_t insn)`            | Obtains the funct6 field from an instruction.
`public template<>`  <br/>`inline static bool `[`read_virtual_memory`](#interpret_8cpp_1aaddb4b76b27c86bad050e507da0c7646)`(STATE_ACCESS & a,uint64_t vaddr,T * pval)`            | Read an aligned word from virtual memory.
`public template<>`  <br/>`inline static bool `[`write_virtual_memory`](#interpret_8cpp_1adf657803f1577bb3682a2df1762d9dee)`(STATE_ACCESS & a,uint64_t vaddr,uint64_t val64)`            | Writes an aligned word to virtual memory.
`public static void `[`dump_insn`](#interpret_8cpp_1a0de28761d3a6ecaa26414b7b424759d2)`(`[`machine`](#classcartesi_1_1machine)` & m,uint64_t pc,uint32_t insn,const char * name)`            | 
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`raise_illegal_insn_exception`](#interpret_8cpp_1abca3016f84550caba3af108946dc96eb)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Raises an illegal instruction exception.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`raise_misaligned_fetch_exception`](#interpret_8cpp_1ae8f0f1ccff9e31318e26b746ae54142e)`(STATE_ACCESS & a,uint64_t pc)`            | Raises an misaligned-fetch exception.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`advance_to_raised_exception`](#interpret_8cpp_1adf6e4ee8dc24dc5286d9f4ae2fcb2671)`(STATE_ACCESS & a)`            | Returns from execution due to raised exception.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`advance_to_next_insn`](#interpret_8cpp_1a81b6ba272791648b5c95b08f6db7fa10)`(STATE_ACCESS & a,uint64_t pc)`            | Advances pc to the next instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_jump`](#interpret_8cpp_1addef54a74e7e75b0f15b711e08ee8e00)`(STATE_ACCESS & a,uint64_t pc)`            | Changes pc arbitrarily, potentially causing a jump.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_LR`](#interpret_8cpp_1a51506a4a9b5c17a8e67404bc0bb745dd)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Execute the LR instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SC`](#interpret_8cpp_1a8d69759d63313d8a064ca76e1ef8785f)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Execute the SC instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_LR_W`](#interpret_8cpp_1a7ca3b9b14937b97cd86edaa2d6098059)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the LR.W instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SC_W`](#interpret_8cpp_1a2d51ed396a7e62ef102194bdef5e8d56)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the SC.W instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_AMO`](#interpret_8cpp_1ab3a386481b0684c3821b5ba595c6e79f)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn,const F & f)`            | 
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_AMOSWAP_W`](#interpret_8cpp_1ad289ed9ab0b2b45e0348f001faf6b688)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the AMOSWAP.W instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_AMOADD_W`](#interpret_8cpp_1ac75574c2af1542fbca0808541c42f587)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the AMOADD.W instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_AMOXOR_W`](#interpret_8cpp_1afa3f6b45a82c5e68088c7522a2159497)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | 
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_AMOAND_W`](#interpret_8cpp_1ac228a2894e815cdcd310e8284a8be325)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the AMOAND.W instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_AMOOR_W`](#interpret_8cpp_1a05fcb5473d7e89df0efbfb9117e5ff10)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the AMOOR.W instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_AMOMIN_W`](#interpret_8cpp_1ab905a0bb2c758efa6d392598cddf4ac1)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the AMOMIN.W instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_AMOMAX_W`](#interpret_8cpp_1ac4e2062d0641f84a1eb58f9fc65b3d82)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the AMOMAX.W instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_AMOMINU_W`](#interpret_8cpp_1a3fa13eb10b7dd5c8dc2c726d68292bff)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the AMOMINU.W instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_AMOMAXU_W`](#interpret_8cpp_1ac569cd449a45ec1a6e5be131635d67ef)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the AMOMAXU.W instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_LR_D`](#interpret_8cpp_1aa076532586be1a1ebde5aa74a4544611)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the LR.D instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SC_D`](#interpret_8cpp_1adf6e18968320c1e362e6750cd4d572ee)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the SC.D instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_AMOSWAP_D`](#interpret_8cpp_1a810a46b0b6a34ed33656e06c9765554c)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the AMOSWAP.D instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_AMOADD_D`](#interpret_8cpp_1a9c6b6bd384c7e66a85bb67a99b8c2fe8)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the AMOADD.D instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_AMOXOR_D`](#interpret_8cpp_1a6a1abca117ac7838e223961616c56e90)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | 
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_AMOAND_D`](#interpret_8cpp_1a7c2d19d9d5d9a08be2892102bd511926)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the AMOAND.D instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_AMOOR_D`](#interpret_8cpp_1a4b5a54c467ab6ba6483097d0ca252c79)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the AMOOR.D instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_AMOMIN_D`](#interpret_8cpp_1adf8d4e807ee85b82b046f7ee2fa5410a)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the AMOMIN.D instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_AMOMAX_D`](#interpret_8cpp_1a579d18767ba75dbef087d847d9108779)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the AMOMAX.D instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_AMOMINU_D`](#interpret_8cpp_1a01420a0fb74873616f5f1ec650dcdfe4)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the AMOMINU.D instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_AMOMAXU_D`](#interpret_8cpp_1a82ba4e12a184fdce042147193f88c027)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the AMOMAXU.D instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_ADDW`](#interpret_8cpp_1a83d455f9c0d47e320f52e4619af57a09)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the ADDW instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SUBW`](#interpret_8cpp_1ad6287939e2cd9f3b6fb6430788ee4519)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the SUBW instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SLLW`](#interpret_8cpp_1aac1d8370562b8e55af3e56d98c703324)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the SLLW instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SRLW`](#interpret_8cpp_1a900f2c0961c71345af73c8660eb92cf5)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the SRLW instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SRAW`](#interpret_8cpp_1a0d569949ce8da2adc42604f4dff761c0)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the SRAW instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_MULW`](#interpret_8cpp_1a97be3784401bc596761c249b0ea7b245)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the MULW instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_DIVW`](#interpret_8cpp_1ad77c1c7749c5183bca498e6da58dbecd)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the DIVW instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_DIVUW`](#interpret_8cpp_1a65b339a6b8c39c1b0a7c54b8e133d7ab)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the DIVUW instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_REMW`](#interpret_8cpp_1aee484c7038904e9d4efe616ffeae762a)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the REMW instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_REMUW`](#interpret_8cpp_1a9820fd61a78f1057220b9b9f26c6ea85)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the REMUW instruction.
`public inline static uint64_t `[`read_csr_fail`](#interpret_8cpp_1ab2f2f30c37a3a21ce89c096706b545e0)`(bool * status)`            | 
`public inline static uint64_t `[`read_csr_success`](#interpret_8cpp_1ad981c8cb7fcf74cb4a731f074b519fd6)`(uint64_t val,bool * status)`            | 
`public template<>`  <br/>`inline static bool `[`rdcounteren`](#interpret_8cpp_1a3604a336a8a41456a5c2e98990be823a)`(STATE_ACCESS & a,`[`CSR_address`](#riscv-constants_8h_1a0def04ee38a93e6cc26834eb9be26767)` csraddr)`            | 
`public template<>`  <br/>`inline static uint64_t `[`read_csr_cycle`](#interpret_8cpp_1a63cf226f08cecd8c9696c9039b6e25e3)`(STATE_ACCESS & a,`[`CSR_address`](#riscv-constants_8h_1a0def04ee38a93e6cc26834eb9be26767)` csraddr,bool * status)`            | 
`public template<>`  <br/>`inline static uint64_t `[`read_csr_instret`](#interpret_8cpp_1a5b89f64ac5cdb39f2d31366ebc7b03f1)`(STATE_ACCESS & a,`[`CSR_address`](#riscv-constants_8h_1a0def04ee38a93e6cc26834eb9be26767)` csraddr,bool * status)`            | 
`public template<>`  <br/>`inline static uint64_t `[`read_csr_time`](#interpret_8cpp_1aad0f1ef51be44d09f1957a9b1213401a)`(STATE_ACCESS & a,`[`CSR_address`](#riscv-constants_8h_1a0def04ee38a93e6cc26834eb9be26767)` csraddr,bool * status)`            | 
`public template<>`  <br/>`inline static uint64_t `[`read_csr_sstatus`](#interpret_8cpp_1a4a8c8d5d7f2f8c55f1c772a5f528f423)`(STATE_ACCESS & a,bool * status)`            | 
`public template<>`  <br/>`inline static uint64_t `[`read_csr_sie`](#interpret_8cpp_1abf145a98358ce01bf256ac252ff3bc5e)`(STATE_ACCESS & a,bool * status)`            | 
`public template<>`  <br/>`inline static uint64_t `[`read_csr_stvec`](#interpret_8cpp_1a58f4c9177b81567444a40c3fb8193995)`(STATE_ACCESS & a,bool * status)`            | 
`public template<>`  <br/>`inline static uint64_t `[`read_csr_scounteren`](#interpret_8cpp_1abecbcd5fa30c63d9431e1dffdc3d43e1)`(STATE_ACCESS & a,bool * status)`            | 
`public template<>`  <br/>`inline static uint64_t `[`read_csr_sscratch`](#interpret_8cpp_1ada593abaa42b0df41e8a6d35e1906613)`(STATE_ACCESS & a,bool * status)`            | 
`public template<>`  <br/>`inline static uint64_t `[`read_csr_sepc`](#interpret_8cpp_1a2908b044f7b49811cfdd753d94ec203b)`(STATE_ACCESS & a,bool * status)`            | 
`public template<>`  <br/>`inline static uint64_t `[`read_csr_scause`](#interpret_8cpp_1a4313bfb3fc3b2c615dd37d20b436fa67)`(STATE_ACCESS & a,bool * status)`            | 
`public template<>`  <br/>`inline static uint64_t `[`read_csr_stval`](#interpret_8cpp_1a1fdda2d04a4c46dd12b8729907929dc9)`(STATE_ACCESS & a,bool * status)`            | 
`public template<>`  <br/>`inline static uint64_t `[`read_csr_sip`](#interpret_8cpp_1a749bea876612c5c6c6ce613b1a0346b5)`(STATE_ACCESS & a,bool * status)`            | 
`public template<>`  <br/>`inline static uint64_t `[`read_csr_satp`](#interpret_8cpp_1ad98c68fba8b4b1a085c5b592787c4bf4)`(STATE_ACCESS & a,bool * status)`            | 
`public template<>`  <br/>`inline static uint64_t `[`read_csr_mstatus`](#interpret_8cpp_1a04891d973974f2c12536a6840e9a993a)`(STATE_ACCESS & a,bool * status)`            | 
`public template<>`  <br/>`inline static uint64_t `[`read_csr_misa`](#interpret_8cpp_1abc17218919621498d0e920fd1fe8b751)`(STATE_ACCESS & a,bool * status)`            | 
`public template<>`  <br/>`inline static uint64_t `[`read_csr_medeleg`](#interpret_8cpp_1a1e7c62ca4edbc5d87208f7ec9b796386)`(STATE_ACCESS & a,bool * status)`            | 
`public template<>`  <br/>`inline static uint64_t `[`read_csr_mideleg`](#interpret_8cpp_1afbc675696c8671b8d34aa346078c1da5)`(STATE_ACCESS & a,bool * status)`            | 
`public template<>`  <br/>`inline static uint64_t `[`read_csr_mie`](#interpret_8cpp_1afdb3c472970a121e6b50e60fa7624968)`(STATE_ACCESS & a,bool * status)`            | 
`public template<>`  <br/>`inline static uint64_t `[`read_csr_mtvec`](#interpret_8cpp_1a8ad9a3d0fd0f1d9f975a2f8f315451b4)`(STATE_ACCESS & a,bool * status)`            | 
`public template<>`  <br/>`inline static uint64_t `[`read_csr_mcounteren`](#interpret_8cpp_1a5e62927b23b0752ed3a790e8251c5f01)`(STATE_ACCESS & a,bool * status)`            | 
`public template<>`  <br/>`inline static uint64_t `[`read_csr_mscratch`](#interpret_8cpp_1a0433d8506b0083d28c30ac84f17203ce)`(STATE_ACCESS & a,bool * status)`            | 
`public template<>`  <br/>`inline static uint64_t `[`read_csr_mepc`](#interpret_8cpp_1a0fc705369d3c6c5bac3145e7ea17f3dc)`(STATE_ACCESS & a,bool * status)`            | 
`public template<>`  <br/>`inline static uint64_t `[`read_csr_mcause`](#interpret_8cpp_1a9ab1d31310377a250a6d271647a23a75)`(STATE_ACCESS & a,bool * status)`            | 
`public template<>`  <br/>`inline static uint64_t `[`read_csr_mtval`](#interpret_8cpp_1ae2a67a0a26cf04d4f8938ce3dc5bb7cb)`(STATE_ACCESS & a,bool * status)`            | 
`public template<>`  <br/>`inline static uint64_t `[`read_csr_mip`](#interpret_8cpp_1a890dedf6631483414ee92cdd7e779d14)`(STATE_ACCESS & a,bool * status)`            | 
`public template<>`  <br/>`inline static uint64_t `[`read_csr_mcycle`](#interpret_8cpp_1a395156c5f8da978ec85d3b0e320a54d1)`(STATE_ACCESS & a,bool * status)`            | 
`public template<>`  <br/>`inline static uint64_t `[`read_csr_minstret`](#interpret_8cpp_1a33679282481d0138c8bf80786876e402)`(STATE_ACCESS & a,bool * status)`            | 
`public template<>`  <br/>`inline static uint64_t `[`read_csr_mvendorid`](#interpret_8cpp_1a7b1a7d67b3a814f6aa4f153d2dd76966)`(STATE_ACCESS & a,bool * status)`            | 
`public template<>`  <br/>`inline static uint64_t `[`read_csr_marchid`](#interpret_8cpp_1ad3a082b6221360566ad6a60bcd831fd1)`(STATE_ACCESS & a,bool * status)`            | 
`public template<>`  <br/>`inline static uint64_t `[`read_csr_mimpid`](#interpret_8cpp_1a042a64b5da639a2de6009e8e0496f51a)`(STATE_ACCESS & a,bool * status)`            | 
`public template<>`  <br/>`static uint64_t `[`read_csr`](#interpret_8cpp_1a08574282105a263c6271e8d903acfbd1)`(STATE_ACCESS & a,`[`CSR_address`](#riscv-constants_8h_1a0def04ee38a93e6cc26834eb9be26767)` csraddr,bool * status)`            | Reads the value of a CSR given its address.
`public template<>`  <br/>`static bool `[`write_csr_sstatus`](#interpret_8cpp_1a205a1a6d411581c84e8a6477319cab29)`(STATE_ACCESS & a,uint64_t val)`            | 
`public template<>`  <br/>`static bool `[`write_csr_sie`](#interpret_8cpp_1ad70f7ceff2bf2f408ed0bc6768e9ffb8)`(STATE_ACCESS & a,uint64_t val)`            | 
`public template<>`  <br/>`static bool `[`write_csr_stvec`](#interpret_8cpp_1ae9a31aaeeaefa139148347c762cc1bcc)`(STATE_ACCESS & a,uint64_t val)`            | 
`public template<>`  <br/>`static bool `[`write_csr_scounteren`](#interpret_8cpp_1a62962f0659c8de021a2666056dd1e7dd)`(STATE_ACCESS & a,uint64_t val)`            | 
`public template<>`  <br/>`static bool `[`write_csr_sscratch`](#interpret_8cpp_1a47c9220be9498047522c92d42b8d9a4e)`(STATE_ACCESS & a,uint64_t val)`            | 
`public template<>`  <br/>`static bool `[`write_csr_sepc`](#interpret_8cpp_1a521389f1a9f0a20cd5132eccf03b7acd)`(STATE_ACCESS & a,uint64_t val)`            | 
`public template<>`  <br/>`static bool `[`write_csr_scause`](#interpret_8cpp_1ada90baa4a0145d93a3fad27401fa0e3c)`(STATE_ACCESS & a,uint64_t val)`            | 
`public template<>`  <br/>`static bool `[`write_csr_stval`](#interpret_8cpp_1a003c71110703bec3baa5e6d8a700225a)`(STATE_ACCESS & a,uint64_t val)`            | 
`public template<>`  <br/>`static bool `[`write_csr_sip`](#interpret_8cpp_1aab68cb56fdb7e6b52e0149074a09f1b9)`(STATE_ACCESS & a,uint64_t val)`            | 
`public template<>`  <br/>`static bool `[`write_csr_satp`](#interpret_8cpp_1a9edd20f873ef67048483e03025df52ee)`(STATE_ACCESS & a,uint64_t val)`            | 
`public template<>`  <br/>`static bool `[`write_csr_mstatus`](#interpret_8cpp_1a56b9516e99ef5aff551158129f767710)`(STATE_ACCESS & a,uint64_t val)`            | 
`public template<>`  <br/>`static bool `[`write_csr_medeleg`](#interpret_8cpp_1aec32288317da0f077428fe25478ac5df)`(STATE_ACCESS & a,uint64_t val)`            | 
`public template<>`  <br/>`static bool `[`write_csr_mideleg`](#interpret_8cpp_1a8bcdd9a300776314f4384aa1d731c8f0)`(STATE_ACCESS & a,uint64_t val)`            | 
`public template<>`  <br/>`static bool `[`write_csr_mie`](#interpret_8cpp_1aefedf5f7f8015188ef7198ac928a375e)`(STATE_ACCESS & a,uint64_t val)`            | 
`public template<>`  <br/>`static bool `[`write_csr_mtvec`](#interpret_8cpp_1ab3a200469f0277545a8a48aef35a9192)`(STATE_ACCESS & a,uint64_t val)`            | 
`public template<>`  <br/>`static bool `[`write_csr_mcounteren`](#interpret_8cpp_1ae20e72d55a3f54ddbd4a3024aa4a7c62)`(STATE_ACCESS & a,uint64_t val)`            | 
`public template<>`  <br/>`static bool `[`write_csr_minstret`](#interpret_8cpp_1aedbf2bdf3ad2a6937177f873051065f7)`(STATE_ACCESS & a,uint64_t val)`            | 
`public template<>`  <br/>`static bool `[`write_csr_mcycle`](#interpret_8cpp_1a5ae9e6771ebad43fa90f686671e3962f)`(STATE_ACCESS & a,uint64_t val)`            | 
`public template<>`  <br/>`static bool `[`write_csr_mscratch`](#interpret_8cpp_1a3929a04c0a3677847a5e9727014079c9)`(STATE_ACCESS & a,uint64_t val)`            | 
`public template<>`  <br/>`static bool `[`write_csr_mepc`](#interpret_8cpp_1ad8d490a34af34e57d269248fb81a5072)`(STATE_ACCESS & a,uint64_t val)`            | 
`public template<>`  <br/>`static bool `[`write_csr_mcause`](#interpret_8cpp_1a46d05d967d5ca82d3456a696a2364739)`(STATE_ACCESS & a,uint64_t val)`            | 
`public template<>`  <br/>`static bool `[`write_csr_mtval`](#interpret_8cpp_1aaa7259c6b1c1b277b83181467fc13965)`(STATE_ACCESS & a,uint64_t val)`            | 
`public template<>`  <br/>`static bool `[`write_csr_mip`](#interpret_8cpp_1acdf0a60917f339095cc9f2b52d174247)`(STATE_ACCESS & a,uint64_t val)`            | 
`public template<>`  <br/>`static bool `[`write_csr`](#interpret_8cpp_1a0deab0da97762f266b1d21a531bfdc22)`(STATE_ACCESS & a,`[`CSR_address`](#riscv-constants_8h_1a0def04ee38a93e6cc26834eb9be26767)` csraddr,uint64_t val)`            | Writes a value to a CSR given its address.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_csr_RW`](#interpret_8cpp_1a752df39226d9e8197160a98c9e82d66b)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn,const RS1VAL & rs1val)`            | 
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_CSRRW`](#interpret_8cpp_1a56660b9433686d4c43f666e0c616c67b)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the CSRRW instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_CSRRWI`](#interpret_8cpp_1a46cc9afd85a2b295be75b60e957221b8)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the CSRRWI instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_csr_SC`](#interpret_8cpp_1a06daa91d7bf839fa34f1705ebe318e31)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn,const F & f)`            | 
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_CSRRS`](#interpret_8cpp_1a5797e2fb1fa2c3fceaf2e5ec72aa74c4)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the CSRRS instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_CSRRC`](#interpret_8cpp_1aa5979e6025fa7a4c08b842c1ecfc6caf)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the CSRRC instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_csr_SCI`](#interpret_8cpp_1abafe3263d8831692b2b2cb31ca1dcfcb)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn,const F & f)`            | 
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_CSRRSI`](#interpret_8cpp_1a15c77b98bad6f0902ced9bd90069dac3)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the CSRRSI instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_CSRRCI`](#interpret_8cpp_1a6f9cae3c77c3b9b2a5021d4e07e94d2f)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the CSRRCI instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_ECALL`](#interpret_8cpp_1a2415d5d7865b8e9341700d7c1897c57d)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the ECALL instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_EBREAK`](#interpret_8cpp_1abd3b40a91ab13d28787b9bb4637d954c)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the EBREAK instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_URET`](#interpret_8cpp_1a1c3f3d32c10deb4f47ab6ac6a65996c9)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the URET instruction. // no U-mode traps.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SRET`](#interpret_8cpp_1ad9a0cf345f65dddd1fd30595bcce54ad)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the SRET instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_MRET`](#interpret_8cpp_1a00ca30742e7edc6a1c2271601909abfd)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the MRET instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_WFI`](#interpret_8cpp_1a4c53dbc90528e6b0138eee8927249602)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the WFI instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_FENCE`](#interpret_8cpp_1afcaa403dd5bc1fb805e9d7c289555069)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the FENCE instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_FENCE_I`](#interpret_8cpp_1aad7bf2d3ee32bf79841ed14bcb529d47)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the FENCE.I instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_arithmetic`](#interpret_8cpp_1a73aabd6f875cafb1deb5af1869775e58)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn,const F & f)`            | 
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_ADD`](#interpret_8cpp_1a725438c4795ad4b159c7ab00de762592)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the ADD instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SUB`](#interpret_8cpp_1af1dc1c78c8c6fdc98c37896b9ffa431a)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the SUB instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SLL`](#interpret_8cpp_1aa92a840115f700a882ef0646eadae699)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the SLL instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SLT`](#interpret_8cpp_1a9bbfb2fda4506bd7f9d79065ba636d2d)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the SLT instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SLTU`](#interpret_8cpp_1af5367e253bafe6ae9efb4ff18d60f07e)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the SLTU instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_XOR`](#interpret_8cpp_1a87b24da8d91a4ebfe572b71e7969a8e2)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the XOR instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SRL`](#interpret_8cpp_1a8a6e851ec035efa73a28d499f1693c20)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the SRL instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SRA`](#interpret_8cpp_1a4d5cc106d3eda32e978a36170e5b50c4)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the SRA instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_OR`](#interpret_8cpp_1a44dd6ccd01023170685c36994108854b)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the OR instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_AND`](#interpret_8cpp_1a7539563144d5a0aa75ff09b406bc3351)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the AND instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_MUL`](#interpret_8cpp_1a49b59a7167b9991b67bdafcf6978b37f)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the MUL instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_MULH`](#interpret_8cpp_1ac3a2f5dc15b97b249c6200f0cff9eae4)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the MULH instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_MULHSU`](#interpret_8cpp_1ab4c3d9c236452db059644673c0fbb357)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the MULHSU instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_MULHU`](#interpret_8cpp_1a07b7d4f0bb5187507245eaf9464d68e1)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the MULHU instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_DIV`](#interpret_8cpp_1a4e4f387d111b709846206f73de90b58c)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the DIV instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_DIVU`](#interpret_8cpp_1a7d5038bcf6da80dd431a5c8e9846c826)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the DIVU instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_REM`](#interpret_8cpp_1a3e16b9df4f74d79ed51ef0e4011f6296)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the REM instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_REMU`](#interpret_8cpp_1aab39f5066cebffb96c7213f96ee98846)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the REMU instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_arithmetic_immediate`](#interpret_8cpp_1a91acd3bea1b0de7bcb1e43f0aac5a5f9)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn,const F & f)`            | 
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SRLI`](#interpret_8cpp_1a27889aeb5539e91b198daf95c3ca98ad)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the SRLI instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SRAI`](#interpret_8cpp_1aeab764039df2350707d8dcff1b8f393e)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the SRAI instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_ADDI`](#interpret_8cpp_1a67c74220fceb51a601673f8e584f5600)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the ADDI instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SLTI`](#interpret_8cpp_1ac2584e46313f991bd793cf853957f1c9)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the SLTI instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SLTIU`](#interpret_8cpp_1a0d768fcff5a589109aa0c05f260acaeb)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the SLTIU instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_XORI`](#interpret_8cpp_1a146527cab2edc7776239286017b15ad9)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the XORI instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_ORI`](#interpret_8cpp_1a7e5e2431b270182bebc98a9e5a11211e)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the ORI instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_ANDI`](#interpret_8cpp_1ad57bf3e8486d027324184b8f5a5562a1)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the ANDI instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SLLI`](#interpret_8cpp_1a7a1501e5850150d060f2fabc7d07ac6a)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the SLLI instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_ADDIW`](#interpret_8cpp_1aac30de662377ad6e447404615a96dd60)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the ADDIW instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SLLIW`](#interpret_8cpp_1a8aa1275cb3ab13edeea47a4b57b68f94)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the SLLIW instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SRLIW`](#interpret_8cpp_1a1b9e09bbc1ba7360802df5f320c0d601)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the SRLIW instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SRAIW`](#interpret_8cpp_1a8a48ce17e41a3fd66e610c7f3fefe6a5)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the SRAIW instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_S`](#interpret_8cpp_1aef0b2d8bcdff28c87e61d6863e22180c)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | 
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SB`](#interpret_8cpp_1abdce19cf6cd36a7f840c72685195bcf7)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the SB instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SH`](#interpret_8cpp_1a1f4d40955ca5f14739942046ca94445d)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the SH instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SW`](#interpret_8cpp_1affe971ffb5f5bea6a4f487cb2dc8b484)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the SW instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SD`](#interpret_8cpp_1ab70eef21449fd8c921d870511afe0cd8)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the SD instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_L`](#interpret_8cpp_1a69f8e66af497808f5e7219064a1a6057)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | 
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_LB`](#interpret_8cpp_1a57b6e5711a8b6042821b8d1443a8f884)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the LB instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_LH`](#interpret_8cpp_1a680d13bcbcbf9ca8db61526eded5bc2c)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the LH instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_LW`](#interpret_8cpp_1a5fb6c700f103a584b6113f8a9ad6a954)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the LW instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_LD`](#interpret_8cpp_1aac60c52e226f802b103a15dcb928d16a)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the LD instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_LBU`](#interpret_8cpp_1a8eb6ea51f457ca42aa7125f7d87e762a)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the LBU instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_LHU`](#interpret_8cpp_1ae33b1cd779e71a3a1b1b5b4328a532be)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the LHU instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_LWU`](#interpret_8cpp_1a0df76a8c3b4a1a4b60d6873d89f29698)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the LWU instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_branch`](#interpret_8cpp_1a8a3759213af4ecf1358ec4ee3d12962c)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn,const F & f)`            | 
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_BEQ`](#interpret_8cpp_1a90b20f52ded2cfdee219c6fdb98bf829)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the BEQ instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_BNE`](#interpret_8cpp_1ada986d37ba2d6700ed9191956070697a)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the BNE instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_BLT`](#interpret_8cpp_1a386cab571a702139214f4133844742aa)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the BLT instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_BGE`](#interpret_8cpp_1a0006742270a879e3fd92a9cce8fafc1e)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the BGE instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_BLTU`](#interpret_8cpp_1aab6ef351c49444bdc04d824bae680811)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the BLTU instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_BGEU`](#interpret_8cpp_1aca6fd1bcd5e47393c004643f2cdb3bd4)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the BGEU instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_LUI`](#interpret_8cpp_1a885b867db6b67c332beaf631da5f59bf)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the LUI instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_AUIPC`](#interpret_8cpp_1ac18ffeed1a8516a5e55bf9b4b9ae8629)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the AUIPC instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_JAL`](#interpret_8cpp_1a191cdf5a6e651dac71cff4ce241cf2bc)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the JAL instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_JALR`](#interpret_8cpp_1af8894188a545c8a0bbed321cf12a1933)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the JALR instruction.
`public template<>`  <br/>`static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SFENCE_VMA`](#interpret_8cpp_1adcb7ff88c7316ec7dbe0ca386f7825af)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Implementation of the SFENCE.VMA instruction.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_atomic_group`](#interpret_8cpp_1ae0ebaf522ee988988fffcf7b4ddf15bf)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Executes an instruction of the atomic group.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_arithmetic_32_group`](#interpret_8cpp_1a8f47c6481c2260538b68731753e167f7)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Executes an instruction of the arithmetic-32 group.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_shift_right_immediate_32_group`](#interpret_8cpp_1af72e035993e07a0801c988f7e9e1f987)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Executes an instruction of the shift-rightimmediate-32 group.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_arithmetic_immediate_32_group`](#interpret_8cpp_1a58de234562c3a4562e6d6ad0b0543d2d)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Executes an instruction of the arithmetic-immediate-32 group.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_env_trap_int_mm_group`](#interpret_8cpp_1ac2a9acd967e7ab599884198e846374aa)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Executes an instruction of the environment, trap, interrupt, or memory management groups.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_csr_env_trap_int_mm_group`](#interpret_8cpp_1a744deaf84bd59f985afcf1cfd131fd87)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Executes an instruction of the CSR, environment, trap, interrupt, or memory management groups.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_fence_group`](#interpret_8cpp_1ab65378a2a33c70f8048427367566f617)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Executes an instruction of the fence group.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_shift_right_immediate_group`](#interpret_8cpp_1a8cd6215617de593a7063b501c6f3acc2)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Executes an instruction of the shift-right-immediate group.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_arithmetic_group`](#interpret_8cpp_1acb4fca0288e18607ac43f1a0a26b74d1)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Executes an instruction of the arithmetic group.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_arithmetic_immediate_group`](#interpret_8cpp_1a03e03f4572621380cc80cccab718fcf5)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Executes an instruction of the arithmetic-immediate group.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_store_group`](#interpret_8cpp_1a36ec0c71b6670f4502098d2c30b7d367)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Executes an instruction of the store group.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_load_group`](#interpret_8cpp_1a2ebf10abe8eff1480b2cdefb9774d0b7)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Executes an instruction of the load group.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_branch_group`](#interpret_8cpp_1a7ea1455b3410877d58840eb78832c1b5)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Executes an instruction of the branch group.
`public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_insn`](#interpret_8cpp_1a34cd23e9863abb69ace7085b8907031f)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)`            | Decodes and executes an instruction.
`public template<>`  <br/>`static `[`fetch_status`](#interpret_8cpp_1a795403770b7df9a4eb0e1d9ae305946e)` `[`fetch_insn`](#interpret_8cpp_1a0d5c6cab87b83f7816828130736d657a)`(STATE_ACCESS & a,uint64_t * pc,uint32_t * pinsn)`            | Loads the next instruction.
`public template<>`  <br/>[`interpreter_status`](#interpret_8h_1a1f82faa5b381ff7131252c5727171661)` `[`interpret`](#interpret_8cpp_1a5b20ffb18b95f5d72c922c4c0d746b15)`(STATE_ACCESS & a,uint64_t mcycle_end)`            | Tries to run the interpreter until mcycle hits a target.
`public template `[`interpreter_status`](#interpret_8h_1a1f82faa5b381ff7131252c5727171661)` `[`interpret`](#interpret_8cpp_1a19fe651c1a86fdc75d2c9dbba3a6ad62)`(`[`state_access`](#classcartesi_1_1state__access)` & a,uint64_t mcycle_end)`            | 
`public template `[`interpreter_status`](#interpret_8h_1a1f82faa5b381ff7131252c5727171661)` `[`interpret`](#interpret_8cpp_1a3b963be8fff538222ecf55892c8c1a6c)`(`[`logged_state_access`](#classcartesi_1_1logged__state__access)` & a,uint64_t mcycle_end)`            | 
`public std::string `[`get_name`](#machine_8cpp_1a56f7637149a7015acb94caa9bbfa2489)`(void)`            | Returns a string describing the implementation.
`public template<>`  <br/>`inline static `[`pma_entry`](#classcartesi_1_1pma__entry)` & `[`naked_find_pma_entry`](#machine_8cpp_1abfe71e81237d2b0e74ff6d9d1c54a701)`(`[`machine_state`](#structcartesi_1_1machine__state)` & s,uint64_t paddr)`            | Obtain PMA entry overlapping with target physical address.
`public template<>`  <br/>`inline static const `[`pma_entry`](#classcartesi_1_1pma__entry)` & `[`naked_find_pma_entry`](#machine_8cpp_1a48d72531ab018a1fee5101dbdbf4b3b7)`(const `[`machine_state`](#structcartesi_1_1machine__state)` & s,uint64_t paddr)`            | 
`public static bool `[`memory_peek`](#machine_8cpp_1ad9634db0b53491b99f02b7b2630a1437)`(const `[`pma_entry`](#classcartesi_1_1pma__entry)` & pma,uint64_t page_address,const unsigned char ** page_data,unsigned char * scratch)`            | Memory range peek callback. See ::pma_peek.
`public static double `[`now`](#machine_8cpp_1ab3cf0bb4b769293af3b5f3e468704a7a)`(void)`            | 
`public static void `[`roll_hash_up_tree`](#machine_8cpp_1a6323ffbd6304924931439a712e8ca268)`(`[`merkle_tree::hasher_type`](#classcartesi_1_1merkle__tree_1ab88eba46f371bddad3dee241d42a1661)` & hasher,const `[`merkle_tree::proof_type`](#structcartesi_1_1merkle__tree_1_1proof__type)` & proof,`[`merkle_tree::hash_type`](#classcartesi_1_1merkle__tree_1aecbed850344d160b6c9fc4bac0202a31)` & rolling_hash)`            | 
`public static void `[`get_word_hash`](#machine_8cpp_1a221367aa0c099b5e170707afbdff1a11)`(`[`merkle_tree::hasher_type`](#classcartesi_1_1merkle__tree_1ab88eba46f371bddad3dee241d42a1661)` & hasher,const uint64_t & word,`[`merkle_tree::hash_type`](#classcartesi_1_1merkle__tree_1aecbed850344d160b6c9fc4bac0202a31)` & word_hash)`            | 
`public std::ostream & `[`operator<<`](#merkle-tree_8cpp_1a13802c1357244304ac5f69a39715db35)`(std::ostream & out,const `[`merkle_tree::hash_type`](#classcartesi_1_1merkle__tree_1aecbed850344d160b6c9fc4bac0202a31)` & hash)`            | 
`public template<>`  <br/>`constexpr auto `[`to_underlying`](#meta_8h_1a24e8be7260a0ac0a293fbd843947e099)`(E e) noexcept`            | Converts a strongly typed constant to its underlying integer type.
`public bool `[`pma_write_error`](#pma_8cpp_1ab71911c598c43a97fb7932a4a2537e41)`(const `[`pma_entry`](#classcartesi_1_1pma__entry)` &,`[`i_virtual_state_access`](#classcartesi_1_1i__virtual__state__access)` *,uint64_t,uint64_t,int)`            | Default device write callback issues error on write.
`public bool `[`pma_read_error`](#pma_8cpp_1a487865e134840d5c18231bec39f5043b)`(const `[`pma_entry`](#classcartesi_1_1pma__entry)` &,`[`i_virtual_state_access`](#classcartesi_1_1i__virtual__state__access)` *,uint64_t,uint64_t *,int)`            | Default device read callback issues error on reads.
`public bool `[`pma_peek_error`](#pma_8cpp_1a6abaeb08a0456339e98d690b9b01ffe6)`(const `[`pma_entry`](#classcartesi_1_1pma__entry)` &,uint64_t,const unsigned char **,unsigned char *)`            | Default device peek callback issues error on peeks.
`public void `[`rom_init`](#rom_8cpp_1a79137bbada10d0f3efdf52e2500fd820)`(const `[`machine_config`](#structcartesi_1_1machine__config)` & c,unsigned char * rom_start,uint64_t length)`            | Initializes PMA extension metadata on ROM.
`public inline static uint64_t `[`rtc_cycle_to_time`](#rtc_8h_1ae27ec63cef95b87dc06ed18df16ac7d5)`(uint64_t cycle)`            | Converts from cycle count to time count.
`public inline static uint64_t `[`rtc_time_to_cycle`](#rtc_8h_1a5b36caac3460a527e0f7dd1740cd01df)`(uint64_t time)`            | Converts from time count to cycle count.
`public uint64_t `[`shadow_get_csr_rel_addr`](#shadow_8cpp_1af168a8a5b1f363427d60f57ed18f5ab3)`(`[`shadow_csr`](#shadow_8h_1aa4c10e5d31db8a49eb0b1845da3750e6)` reg)`            | Obtains the relative address of a CSR in shadow memory.
`public uint64_t `[`shadow_get_register_rel_addr`](#shadow_8cpp_1ad1227f3da3c676d409f95326735fbceb)`(int reg)`            | Obtains the relative address of a general purpose register in shadow memory.
`public uint64_t `[`shadow_get_pma_rel_addr`](#shadow_8cpp_1a39f823e0cd214e282adaf9b9faf1394e)`(int p)`            | Obtains the relative address of a PMA entry in shadow memory.
`public static bool `[`shadow_peek`](#shadow_8cpp_1ada74b99b5a598b7d995a2add1d6a2d33)`(const `[`pma_entry`](#classcartesi_1_1pma__entry)` & pma,uint64_t page_offset,const unsigned char ** page_data,unsigned char * shadow)`            | Shadow device peek callback. See ::pma_peek.
`public static bool `[`shadow_read`](#shadow_8cpp_1a6893b0d5fcb534bbc2f2e778a46a8a9d)`(const `[`pma_entry`](#classcartesi_1_1pma__entry)` & pma,`[`i_virtual_state_access`](#classcartesi_1_1i__virtual__state__access)` * a,uint64_t offset,uint64_t * pval,int size_log2)`            | Shadow device read callback. See ::pma_read.
`public void `[`shadow_register_mmio`](#shadow_8cpp_1a9df22eafca23b007a586d821a5bf8433)`(`[`machine`](#classcartesi_1_1machine)` & m,uint64_t start,uint64_t length)`            | Registers a shadow device with the machine.
`public template<>`  <br/>`inline static void `[`aliased_aligned_write`](#strict-aliasing_8h_1ace4c7a80f4d0947d1f41a062e8edcb7f)`(void * p,T v)`            | Writes a value to memory.
`public template<>`  <br/>`inline static T `[`aliased_aligned_read`](#strict-aliasing_8h_1a05769c3ea8d5475b7ce7003cebddcdde)`(const void * p)`            | Reads a value from memory.
`public template<>`  <br/>`inline static unique_calloc_ptr< T > `[`unique_calloc`](#unique-c-ptr_8h_1a394fdb09ada49e0e05a9683b5a95c3d3)`(size_t nmemb,size_t size)`            | 
`public template<>`  <br/>`inline static unique_calloc_ptr< T > `[`unique_calloc`](#unique-c-ptr_8h_1a979cd3b81665d36e0257da125b8b01b0)`(void)`            | 
`public template<>`  <br/>`inline static unique_calloc_ptr< T > `[`unique_calloc`](#unique-c-ptr_8h_1acae913b1b88e4f3a341a8250d03b0928)`(size_t nmemb,size_t size,const std::nothrow_t & tag)`            | 
`public template<>`  <br/>`inline static unique_calloc_ptr< T > `[`unique_calloc`](#unique-c-ptr_8h_1a9a77a1ecb7e2c6ece82b6902803855b7)`(const std::nothrow_t & tag)`            | 
`public inline static unique_file_ptr `[`unique_fopen`](#unique-c-ptr_8h_1a2b55d612acfecc627e06d2712afd7342)`(const char * pathname,const char * mode)`            | 
`public inline static unique_file_ptr `[`unique_fopen`](#unique-c-ptr_8h_1a11ade5d99496efb99489b5b200eaf232)`(const char * pathname,const char * mode,const std::nothrow_t & tag)`            | 
`class `[`cartesi::access_log`](#classcartesi_1_1access__log) | Log of state accesses.
`class `[`cartesi::cryptopp_keccak_256_hasher`](#classcartesi_1_1cryptopp__keccak__256__hasher) | 
`class `[`cartesi::htif`](#classcartesi_1_1htif) | Host-Target interface implementation.
`class `[`cartesi::i_hasher`](#classcartesi_1_1i__hasher) | 
`class `[`cartesi::i_state_access`](#classcartesi_1_1i__state__access) | Interface for machine state access.
`class `[`cartesi::i_virtual_state_access`](#classcartesi_1_1i__virtual__state__access) | 
`class `[`cartesi::logged_state_access`](#classcartesi_1_1logged__state__access) | 
`class `[`cartesi::machine`](#classcartesi_1_1machine) | 
`class `[`cartesi::manager_client`](#classcartesi_1_1manager__client) | 
`class `[`cartesi::merkle_tree`](#classcartesi_1_1merkle__tree) | Merkle tree implementation.
`class `[`cartesi::pma_device`](#classcartesi_1_1pma__device) | Data for IO ranges.
`class `[`cartesi::pma_entry`](#classcartesi_1_1pma__entry) | Physical Memory Attribute entry.
`class `[`cartesi::pma_memory`](#classcartesi_1_1pma__memory) | Data for memory ranges.
`class `[`cartesi::remove_cvref`](#structcartesi_1_1remove__cvref) | Provides a member typedef type with reference and topmost cv-qualifiers removed.
`class `[`cartesi::size_log2`](#structcartesi_1_1size__log2) | Provides an int member value with the log2 of size of `T`.
`class `[`cartesi::state_access`](#classcartesi_1_1state__access) | The [state_access](#classcartesi_1_1state__access) class implements fast, direct access to the machine state. No logs are kept.
`class `[`cartesi::virtual_state_access`](#classcartesi_1_1virtual__state__access) | 
`class `[`cartesi::xkcp_keccak_256_hasher`](#classcartesi_1_1xkcp__keccak__256__hasher) | 
`struct `[`cartesi::avoid_tlb`](#structcartesi_1_1avoid__tlb) | Type-trait selecting the use of TLB while accessing memory in the state.
`struct `[`cartesi::avoid_tlb< logged_state_access >`](#structcartesi_1_1avoid__tlb_3_01logged__state__access_01_4) | Type-trait preventing the use of TLB while accessing memory in the state.
`struct `[`cartesi::bracket_note`](#structcartesi_1_1bracket__note) | Bracket note.
`struct `[`cartesi::clint_config`](#structcartesi_1_1clint__config) | 
`struct `[`cartesi::flash_config`](#structcartesi_1_1flash__config) | 
`struct `[`cartesi::htif_config`](#structcartesi_1_1htif__config) | 
`struct `[`cartesi::machine_config`](#structcartesi_1_1machine__config) | 
`struct `[`cartesi::machine_state`](#structcartesi_1_1machine__state) | Machine state.
`struct `[`cartesi::pma_driver`](#structcartesi_1_1pma__driver) | Driver for device ranges.
`struct `[`cartesi::pma_empty`](#structcartesi_1_1pma__empty) | Data for empty memory ranges (nothing, really)
`struct `[`cartesi::processor_config`](#structcartesi_1_1processor__config) | 
`struct `[`cartesi::ram_config`](#structcartesi_1_1ram__config) | 
`struct `[`cartesi::rom_config`](#structcartesi_1_1rom__config) | 
`struct `[`cartesi::tlb_entry`](#structcartesi_1_1tlb__entry) | Translation Lookaside Buffer entry.
`struct `[`cartesi::word_access`](#structcartesi_1_1word__access) | Records access to a word in the machine state.

## Members

#### `enum `[`access_type`](#access-log_8h_1a5b2dcf7c7a46db7c7c78a0256bff45b4) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
read            | Read operation.
write            | Write operation.

Type of state access.

#### `enum `[`bracket_type`](#bracket-note_8h_1aea6e9de496553fd9ecfd2321240e1f52) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
begin            | Start of scope.
end            | End of scope.
invalid            | Invalid.

Bracket type.

#### `enum `[`clint_csr`](#clint_8h_1a08669f7548e2d22b4833f76edd5b833a) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
msip0            | 
mtimecmp            | 
mtime            | 

Mapping between CSRs and their relative addresses in CLINT memory.

#### `enum `[`HTIF_constants`](#htif_8h_1a015aeab4064a1957db0a4500f9b8b4cb) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
HTIF_INTERACT_DIVISOR            | Proportion of interacts to ignore.
HTIF_CONSOLE_BUF_SIZE            | Number of characters in console input buffer.

HTIF constants.

#### `enum `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
illegal            | Illegal instruction: exception raised.
retired            | Instruction was retired: exception may or may not have been raised.

Instruction fetch status code.

#### `enum `[`fetch_status`](#interpret_8cpp_1a795403770b7df9a4eb0e1d9ae305946e) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
exception            | Instruction fetch failed: exception raised.
success            | Instruction fetch succeeded: proceed to execute.

Instruction fetch status code.

#### `enum `[`interpreter_status`](#interpret_8h_1a1f82faa5b381ff7131252c5727171661) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
brk            | brk is set, indicating the tight loop was broken
success            | mcycle reached target value

Interpreter status code.

#### `enum `[`FLASH_constants`](#machine-config_8h_1a0d179949541cf729afb1b4aae0dd687a) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
FLASH_MAX            | Maximum number of flash drives.

FLASH constants.

#### `enum `[`TLB_constants`](#machine-state_8h_1a47b2a91c4fe3a52a28e1487f639a6417) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
TLB_SIZE            | Number of entries in TLB.

TLB constants.

#### `enum `[`PMA_ranges`](#pma-constants_8h_1a3781ac3458a5523dcaec4fbc9bf7d25e) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
PMA_SHADOW_START            | Start of shadow range.
PMA_SHADOW_LENGTH            | Length of shadow range.
PMA_ROM_START            | Start of ROM range.
PMA_ROM_LENGTH            | Length of ROM range.
PMA_CLINT_START            | Start of CLINT range.
PMA_CLINT_LENGTH            | Length of CLINT range.
PMA_HTIF_START            | Start of HTIF range.
PMA_HTIF_LENGTH            | Length of HTIF range.
PMA_RAM_START            | Start of RAM range.

Fixed PMA ranges.

#### `enum `[`PMA_constants`](#pma-constants_8h_1a0a610b6325789bc7cc5b3381d884ea3e) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
PMA_PAGE_SIZE_LOG2            | log2 of physical memory page size.
PMA_PAGE_SIZE            | Physical memory page size.
PMA_WORD_SIZE            | Physical memory word size.
PMA_MAX            | Maximum number of PMAs.
PMA_BOARD_SHADOW_START            | Base of board shadow, where PMAs start.

PMA constants.

#### `enum `[`PMA_ISTART_shifts`](#pma-constants_8h_1a2095cec4c138df101787ad6c1d4f086d) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
PMA_ISTART_M_SHIFT            | 
PMA_ISTART_IO_SHIFT            | 
PMA_ISTART_E_SHIFT            | 
PMA_ISTART_R_SHIFT            | 
PMA_ISTART_W_SHIFT            | 
PMA_ISTART_X_SHIFT            | 
PMA_ISTART_IR_SHIFT            | 
PMA_ISTART_IW_SHIFT            | 
PMA_ISTART_DID_SHIFT            | 

PMA istart shifts.

#### `enum `[`PMA_ISTART_masks`](#pma-constants_8h_1af14ca322423bf6650b9f734f906e65cc) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
PMA_ISTART_M_MASK            | Memory range.
PMA_ISTART_IO_MASK            | Device range.
PMA_ISTART_E_MASK            | Empty range.
PMA_ISTART_R_MASK            | Readable.
PMA_ISTART_W_MASK            | Writable.
PMA_ISTART_X_MASK            | Executable.
PMA_ISTART_IR_MASK            | Idempotent reads.
PMA_ISTART_IW_MASK            | Idempotent writes.
PMA_ISTART_DID_MASK            | Device id.

PMA istart masks.

#### `enum `[`PMA_ISTART_DID`](#pma-constants_8h_1af1653605bf791b39ada81f1dbd923571) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
memory            | DID for memory.
shadow            | DID for shadow device.
drive            | DID for drive device.
CLINT            | DID for CLINT device.
HTIF            | DID for HTIF device.

PMA device ids.

#### `enum `[`RISCV_constants`](#riscv-constants_8h_1a7f26eb51589ee4f65d575c73a22d5a2a) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
XLEN            | Maximum XLEN.

Global RISC-V constants.

#### `enum `[`MIP_shifts`](#riscv-constants_8h_1afcc01af5e41ef6315d3c7239f7aaafeb) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
MIP_USIP_SHIFT            | 
MIP_SSIP_SHIFT            | 
MIP_MSIP_SHIFT            | 
MIP_UTIP_SHIFT            | 
MIP_STIP_SHIFT            | 
MIP_MTIP_SHIFT            | 
MIP_UEIP_SHIFT            | 
MIP_SEIP_SHIFT            | 
MIP_MEIP_SHIFT            | 

MIP shifts.

#### `enum `[`MIP_masks`](#riscv-constants_8h_1abf908966a63f0e5f4b57b6bb9980ad2e) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
MIP_USIP_MASK            | User software interrupt.
MIP_SSIP_MASK            | Supervisor software interrupt.
MIP_MSIP_MASK            | Machine software interrupt.
MIP_UTIP_MASK            | User timer interrupt.
MIP_STIP_MASK            | Supervisor timer interrupt.
MIP_MTIP_MASK            | Machine timer interrupt.
MIP_UEIP_MASK            | User external interrupt.
MIP_SEIP_MASK            | Supervisor external interrupt.
MIP_MEIP_MASK            | Machine external interrupt.

MIP masks.

#### `enum `[`MCAUSE_constants`](#riscv-constants_8h_1a059155cc240db2d1118797a8f91ec401) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
MCAUSE_INSN_ADDRESS_MISALIGNED            | Instruction address misaligned.
MCAUSE_INSN_ACCESS_FAULT            | Instruction access fault.
MCAUSE_ILLEGAL_INSN            | Illegal instruction.
MCAUSE_BREAKPOINT            | Breakpoint.
MCAUSE_LOAD_ADDRESS_MISALIGNED            | Load address misaligned.
MCAUSE_LOAD_ACCESS_FAULT            | Load access fault.
MCAUSE_STORE_AMO_ADDRESS_MISALIGNED            | Store/AMO address misaligned.
MCAUSE_STORE_AMO_ACCESS_FAULT            | Store/AMO access fault.
MCAUSE_ECALL_BASE            | Environment call (+0: from U-mode, +1: from S-mode, +3: from M-mode)
MCAUSE_FETCH_PAGE_FAULT            | Instruction page fault.
MCAUSE_LOAD_PAGE_FAULT            | Load page fault.
MCAUSE_STORE_AMO_PAGE_FAULT            | Store/AMO page fault.
MCAUSE_INTERRUPT_FLAG            | Interrupt flag.

mcause for exceptions

#### `enum `[`PRV_constants`](#riscv-constants_8h_1a3b8d8c64da1874f748fb746c016c3017) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
PRV_U            | User mode.
PRV_S            | Supervisor mode.
PRV_H            | Reserved.
PRV_M            | Machine mode.

Privilege modes.

#### `enum `[`MISA_shifts`](#riscv-constants_8h_1a280bd9c3388e0e34f81f2653af7ff55f) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
MISA_EXT_S_SHIFT            | 
MISA_EXT_U_SHIFT            | 
MISA_EXT_I_SHIFT            | 
MISA_EXT_M_SHIFT            | 
MISA_EXT_A_SHIFT            | 
MISA_EXT_F_SHIFT            | 
MISA_EXT_D_SHIFT            | 
MISA_EXT_C_SHIFT            | 
MISA_MXL_SHIFT            | 

misa shifts

#### `enum `[`MISA_masks`](#riscv-constants_8h_1adb92d3986b1f9479215883562cd5e9d1) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
MISA_EXT_S_MASK            | Supervisor mode implemented.
MISA_EXT_U_MASK            | User mode implemented.
MISA_EXT_I_MASK            | RV32I/64I/128I base ISA.
MISA_EXT_M_MASK            | Integer Multiply/Divide extension.
MISA_EXT_A_MASK            | Atomic extension.
MISA_EXT_F_MASK            | Single-precision floating-point extension.
MISA_EXT_D_MASK            | Double-precision floating-point extension.
MISA_EXT_C_MASK            | Compressed extension.

misa masks

#### `enum `[`MISA_constants`](#riscv-constants_8h_1a8d477dc78728679ba79544384f101c14) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
MISA_MXL_VALUE            | 

misa constants

#### `enum `[`MSTATUS_shifts`](#riscv-constants_8h_1a082a8d3bc76a150635f3eeddc86c9304) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
MSTATUS_UIE_SHIFT            | 
MSTATUS_SIE_SHIFT            | 
MSTATUS_MIE_SHIFT            | 
MSTATUS_UPIE_SHIFT            | 
MSTATUS_SPIE_SHIFT            | 
MSTATUS_MPIE_SHIFT            | 
MSTATUS_SPP_SHIFT            | 
MSTATUS_MPP_SHIFT            | 
MSTATUS_FS_SHIFT            | 
MSTATUS_XS_SHIFT            | 
MSTATUS_MPRV_SHIFT            | 
MSTATUS_SUM_SHIFT            | 
MSTATUS_MXR_SHIFT            | 
MSTATUS_TVM_SHIFT            | 
MSTATUS_TW_SHIFT            | 
MSTATUS_TSR_SHIFT            | 
MSTATUS_UXL_SHIFT            | 
MSTATUS_SXL_SHIFT            | 
MSTATUS_SD_SHIFT            | 

mstatus shifts

#### `enum `[`MSTATUS_masks`](#riscv-constants_8h_1ad0788252eff92d037bc60fdfa7748187) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
MSTATUS_UIE_MASK            | 
MSTATUS_SIE_MASK            | 
MSTATUS_MIE_MASK            | 
MSTATUS_UPIE_MASK            | 
MSTATUS_SPIE_MASK            | 
MSTATUS_MPIE_MASK            | 
MSTATUS_SPP_MASK            | 
MSTATUS_MPP_MASK            | 
MSTATUS_FS_MASK            | 
MSTATUS_XS_MASK            | 
MSTATUS_MPRV_MASK            | 
MSTATUS_SUM_MASK            | 
MSTATUS_MXR_MASK            | 
MSTATUS_TVM_MASK            | 
MSTATUS_TW_MASK            | 
MSTATUS_TSR_MASK            | 
MSTATUS_UXL_MASK            | 
MSTATUS_SXL_MASK            | 
MSTATUS_SD_MASK            | 

mstatus masks

#### `enum `[`MSTATUS_RW_masks`](#riscv-constants_8h_1a8b17c6d980c0cfda1fd67c7fa2f24803) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
MSTATUS_W_MASK            | Write mask for mstatus.
MSTATUS_R_MASK            | Read mask for mstatus.

mstatus read-write masks

#### `enum `[`SSTATUS_rw_masks`](#riscv-constants_8h_1ad53ea2058ce79e47cdc57327d4588689) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
SSTATUS_W_MASK            | Write mask for sstatus.
SSTATUS_R_MASK            | Read mask for sstatus.

sstatus read/write masks

#### `enum `[`PTE_shifts`](#riscv-constants_8h_1ae09bc78417b5af6003dd598557f8363a) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
PTE_XWR_R_SHIFT            | 
PTE_XWR_W_SHIFT            | 
PTE_XWR_C_SHIFT            | 
PTE_V_SHIFT            | 
PTE_R_SHIFT            | 
PTE_W_SHIFT            | 
PTE_X_SHIFT            | 
PTE_U_SHIFT            | 
PTE_G_SHIFT            | 
PTE_A_SHIFT            | 
PTE_D_SHIFT            | 

Page-table entry shifts.

#### `enum `[`PTE_masks`](#riscv-constants_8h_1a76431016f33ca494fbbea747a1ab2f9b) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
PTE_V_MASK            | Valid.
PTE_R_MASK            | Readable.
PTE_W_MASK            | Writable.
PTE_X_MASK            | Executable.
PTE_U_MASK            | Accessible to user mode.
PTE_G_MASK            | Global mapping.
PTE_A_MASK            | Accessed.
PTE_D_MASK            | Dirty.

Page-table entry masks.

#### `enum `[`PAGE_shifts`](#riscv-constants_8h_1a04d57eac8ecf294858b5eb60a3f64d36) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
PAGE_NUMBER_SHIFT            | 

Paging shifts.

#### `enum `[`PAGE_masks`](#riscv-constants_8h_1a7d110348a2e0dd6ea2aaf2716cba05b5) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
PAGE_OFFSET_MASK            | 

Paging masks.

#### `enum `[`MCOUNTEREN_shifts`](#riscv-constants_8h_1a3d2525fb2a8bd04673f1fe06c47b135f) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
MCOUNTEREN_CY_SHIFT            | 
MCOUNTEREN_TM_SHIFT            | 
MCOUNTEREN_IR_SHIFT            | 

mcounteren shifts

#### `enum `[`MCOUNTEREN_masks`](#riscv-constants_8h_1af6f3ac2bd3ead67d26d755375bd62d53) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
MCOUNTEREN_CY_MASK            | Enable rdcycle.
MCOUNTEREN_TM_MASK            | Enable rdtime.
MCOUNTEREN_IR_MASK            | Enable rdinstret.

mcounteren masks

#### `enum `[`COUNTEREN_rw_masks`](#riscv-constants_8h_1afa1054f547e0ce4c31d26f87be15b72d) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
MCOUNTEREN_RW_MASK            | 
SCOUNTEREN_RW_MASK            | 

counteren write masks

#### `enum `[`IFLAGS_shifts`](#riscv-constants_8h_1a2f5f64c73b5665d588134837f2f2f8a9) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
IFLAGS_H_SHIFT            | 
IFLAGS_I_SHIFT            | 
IFLAGS_PRV_SHIFT            | 

Cartesi-specific iflags shifts.

#### `enum `[`CARTESI_init`](#riscv-constants_8h_1a51e248e4a772e38e07105e32968a5533) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
PC_INIT            | Initial value for pc.
MVENDORID_INIT            | Initial value for mvendorid.
MARCHID_INIT            | Initial value for marchid.
MIMPID_INIT            | Initial value for mimpid.
MCYCLE_INIT            | Initial value for mcycle.
MINSTRET_INIT            | Initial value for minstret.
MSTATUS_INIT            | Initial value for mstatus.
MTVEC_INIT            | Initial value for mtvec.
MSCRATCH_INIT            | Initial value for mscratch.
MEPC_INIT            | Initial value for mepc.
MCAUSE_INIT            | Initial value for mcause.
MTVAL_INIT            | Initial value for mtval.
MISA_INIT            | Initial value for misa.
MIE_INIT            | Initial value for mie.
MIP_INIT            | Initial value for mip.
MEDELEG_INIT            | Initial value for medeleg.
MIDELEG_INIT            | Initial value for mideleg.
MCOUNTEREN_INIT            | Initial value for mcounteren.
STVEC_INIT            | Initial value for stvec.
SSCRATCH_INIT            | Initial value for sscratch.
SEPC_INIT            | Initial value for sepc.
SCAUSE_INIT            | Initial value for scause.
STVAL_INIT            | Initial value for stval.
SATP_INIT            | Initial value for satp.
SCOUNTEREN_INIT            | Initial value for scounteren.
ILRSC_INIT            | Initial value for ilrsc.
IFLAGS_INIT            | Initial value for iflags.

Initial values for Cartesi machines.

#### `enum `[`CSR_address`](#riscv-constants_8h_1a0def04ee38a93e6cc26834eb9be26767) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
ustatus            | 
uie            | 
utvec            | 
uscratch            | 
uepc            | 
ucause            | 
utval            | 
uip            | 
ucycle            | 
utime            | 
uinstret            | 
ucycleh            | 
utimeh            | 
uinstreth            | 
sstatus            | 
sedeleg            | 
sideleg            | 
sie            | 
stvec            | 
scounteren            | 
sscratch            | 
sepc            | 
scause            | 
stval            | 
sip            | 
satp            | 
mvendorid            | 
marchid            | 
mimpid            | 
mhartid            | 
mstatus            | 
misa            | 
medeleg            | 
mideleg            | 
mie            | 
mtvec            | 
mcounteren            | 
mscratch            | 
mepc            | 
mcause            | 
mtval            | 
mip            | 
mcycle            | 
minstret            | 
mcycleh            | 
minstreth            | 
tselect            | 
tdata1            | 
tdata2            | 
tdata3            | 

Mapping between CSR names and addresses.

#### `enum `[`insn_opcode`](#riscv-constants_8h_1abeac12053ba5411ee4e8406b832d42f1) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
LUI            | 
AUIPC            | 
JAL            | 
JALR            | 
branch_group            | 
load_group            | 
store_group            | 
arithmetic_immediate_group            | 
arithmetic_group            | 
fence_group            | 
csr_env_trap_int_mm_group            | 
arithmetic_immediate_32_group            | 
arithmetic_32_group            | 
atomic_group            | 

Names for instruction opcode field.

#### `enum `[`insn_branch_funct3`](#riscv-constants_8h_1a79cdf5b1743a939f25c8ce1a5a545420) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
BEQ            | 
BNE            | 
BLT            | 
BGE            | 
BLTU            | 
BGEU            | 

Names for branch instructions funct3 field.

#### `enum `[`insn_load_funct3`](#riscv-constants_8h_1a4352488743034e000964932bf410a7c0) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
LB            | 
LH            | 
LW            | 
LD            | 
LBU            | 
LHU            | 
LWU            | 

Names for load instructions funct3 field.

#### `enum `[`insn_store_funct3`](#riscv-constants_8h_1a8f050a68517d0c84f7aadfee7c251523) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
SB            | 
SH            | 
SW            | 
SD            | 

Names for store instructions funct3 field.

#### `enum `[`insn_arithmetic_immediate_funct3`](#riscv-constants_8h_1ad26d7899de06983877b7dfe3055afed5) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
ADDI            | 
SLTI            | 
SLTIU            | 
XORI            | 
ORI            | 
ANDI            | 
SLLI            | 
shift_right_immediate_group            | 

Names for arithmetic-immediate instructions funct3 field.

#### `enum `[`insn_shift_right_immediate_funct6`](#riscv-constants_8h_1ad9504d9bf4567ae712be5005be8daaeb) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
SRLI            | 
SRAI            | 

Names for shift-right immediate instructions funct6 field.

#### `enum `[`insn_arithmetic_funct3_funct7`](#riscv-constants_8h_1af28da1960f09cbc3de91e5091a8ca5fa) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
ADD            | 
SUB            | 
SLL            | 
SLT            | 
SLTU            | 
XOR            | 
SRL            | 
SRA            | 
OR            | 
AND            | 
MUL            | 
MULH            | 
MULHSU            | 
MULHU            | 
DIV            | 
DIVU            | 
REM            | 
REMU            | 

Names for arithmetic instructions concatenated funct3 and funct7 fields.

#### `enum `[`insn_env_trap_int_group_insn`](#riscv-constants_8h_1a1b1a6e08d7eea9a8224bebf8f9e15fc5) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
ECALL            | 
EBREAK            | 
URET            | 
SRET            | 
MRET            | 
WFI            | 

Names for env, trap, and int instructions.

#### `enum `[`insn_csr_env_trap_int_mm_funct3`](#riscv-constants_8h_1ab5be6b9fbd2abbb211b22ef89a7ee20e) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
CSRRW            | 
CSRRS            | 
CSRRC            | 
CSRRWI            | 
CSRRSI            | 
CSRRCI            | 
env_trap_int_mm_group            | 

Names for csr, env, trap, int, mm instructions funct3 field.

#### `enum `[`insn_arithmetic_immediate_32_funct3`](#riscv-constants_8h_1a4d452885f034de2fa41e01b44296067c) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
ADDIW            | 
SLLIW            | 
shift_right_immediate_32_group            | 

Names for 32-bit arithmetic immediate instructions funct3 field.

#### `enum `[`insn_shift_right_immediate_32_funct7`](#riscv-constants_8h_1afe962fa38af0e646a6958df6538f183d) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
SRLIW            | 
SRAIW            | 

Names for 32-bit shift-right immediate instructions funct7 field.

#### `enum `[`insn_arithmetic_32_funct3_funct7`](#riscv-constants_8h_1adc802724e4dd29eed233fc5c7084a65b) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
ADDW            | 
SUBW            | 
SLLW            | 
SRLW            | 
SRAW            | 
MULW            | 
DIVW            | 
DIVUW            | 
REMW            | 
REMUW            | 

Names for 32-bit arithmetic instructions concatenated funct3 and funct7 fields.

#### `enum `[`insn_atomic_funct3_funct5`](#riscv-constants_8h_1ac644aff3deceae43520690cc491b5267) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
LR_W            | 
SC_W            | 
AMOSWAP_W            | 
AMOADD_W            | 
AMOXOR_W            | 
AMOAND_W            | 
AMOOR_W            | 
AMOMIN_W            | 
AMOMAX_W            | 
AMOMINU_W            | 
AMOMAXU_W            | 
LR_D            | 
SC_D            | 
AMOSWAP_D            | 
AMOADD_D            | 
AMOXOR_D            | 
AMOAND_D            | 
AMOOR_D            | 
AMOMIN_D            | 
AMOMAX_D            | 
AMOMINU_D            | 
AMOMAXU_D            | 

Names for atomic instructions concatenated funct3 and funct5 fields.

#### `enum `[`RTC_constants`](#rtc_8h_1af609a9e754e1870ba4910ce134f6b67c) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
RTC_FREQ_DIV            | Clock divisor is set stone in whitepaper.

RTC constants.

#### `enum `[`shadow_csr`](#shadow_8h_1aa4c10e5d31db8a49eb0b1845da3750e6) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
pc            | 
mvendorid            | 
marchid            | 
mimpid            | 
mcycle            | 
minstret            | 
mstatus            | 
mtvec            | 
mscratch            | 
mepc            | 
mcause            | 
mtval            | 
misa            | 
mie            | 
mip            | 
medeleg            | 
mideleg            | 
mcounteren            | 
stvec            | 
sscratch            | 
sepc            | 
scause            | 
stval            | 
satp            | 
scounteren            | 
ilrsc            | 
iflags            | 

Mapping between CSRs and their relative addresses in shadow memory.

#### `public uint64_t `[`clint_get_csr_rel_addr`](#clint_8cpp_1af9da895e8af0a44f00b725eeb699c0f0)`(`[`clint_csr`](#clint_8h_1a08669f7548e2d22b4833f76edd5b833a)` reg)` 

Obtains the relative address of a CSR in HTIF memory.

#### Parameters
* `reg` CSR name. 

#### Returns
The address.

#### `public static bool `[`clint_read_msip`](#clint_8cpp_1a7e7d9ed30d9838915bcc78683f5742d6)`(`[`i_virtual_state_access`](#classcartesi_1_1i__virtual__state__access)` * a,uint64_t * val,int size_log2)` 

#### `public static bool `[`clint_read_mtime`](#clint_8cpp_1ab6908929b61aa5c851dd04cf41628585)`(`[`i_virtual_state_access`](#classcartesi_1_1i__virtual__state__access)` * a,uint64_t * val,int size_log2)` 

#### `public static bool `[`clint_read_mtimecmp`](#clint_8cpp_1ae17ff3c50e2391984dbf583fca8225e7)`(`[`i_virtual_state_access`](#classcartesi_1_1i__virtual__state__access)` * a,uint64_t * val,int size_log2)` 

#### `public static bool `[`clint_read`](#clint_8cpp_1abcd23e7708183f4ece30ceff3141b1ba)`(const `[`pma_entry`](#classcartesi_1_1pma__entry)` & pma,`[`i_virtual_state_access`](#classcartesi_1_1i__virtual__state__access)` * a,uint64_t offset,uint64_t * val,int size_log2)` 

CLINT device read callback. See ::pma_read.

#### `public static bool `[`clint_write`](#clint_8cpp_1a28879251a603328970340919b179e552)`(const `[`pma_entry`](#classcartesi_1_1pma__entry)` & pma,`[`i_virtual_state_access`](#classcartesi_1_1i__virtual__state__access)` * a,uint64_t offset,uint64_t val,int size_log2)` 

CLINT device read callback. See ::pma_write.

#### `public static bool `[`clint_peek`](#clint_8cpp_1ae2b40a4cdfaf5b45854360e4fb9de0b3)`(const `[`pma_entry`](#classcartesi_1_1pma__entry)` & pma,uint64_t page_offset,const unsigned char ** page_data,unsigned char * scratch)` 

CLINT device peek callback. See ::pma_peek.

#### `public void `[`clint_register_mmio`](#clint_8cpp_1a583fc0f9a310b70d00dcbb0bec12a32b)`(`[`machine`](#classcartesi_1_1machine)` & m,uint64_t start,uint64_t length)` 

Registers a CLINT device with the machine.

#### Parameters
* `m` Associated machine. 

* `start` Start address for memory range. 

* `length` Length of memory range.

#### `public static void `[`set_nonblocking`](#htif_8cpp_1a94d66fdc0eed42b70072b88637bb7541)`(int fd)` 

Sets descriptor to non-blocking mode.

#### Parameters
* `fd` File descritor.

#### `public static void `[`set_blocking`](#htif_8cpp_1a4046877c574ae0e8b5848e9d9aa80dcb)`(int fd)` 

Sets descriptor to blocking mode.

#### Parameters
* `fd` File descritor.

#### `public static bool `[`htif_read`](#htif_8cpp_1a1f9e77a1865e0838293de018b98f5035)`(const `[`pma_entry`](#classcartesi_1_1pma__entry)` & pma,`[`i_virtual_state_access`](#classcartesi_1_1i__virtual__state__access)` * a,uint64_t offset,uint64_t * pval,int size_log2)` 

HTIF device read callback. See ::pma_read.

#### `public static bool `[`htif_peek`](#htif_8cpp_1a126af465c557b41cd043e7cc2145ee9e)`(const `[`pma_entry`](#classcartesi_1_1pma__entry)` & pma,uint64_t page_offset,const unsigned char ** page_data,unsigned char * scratch)` 

HTIF device peek callback. See ::pma_peek.

#### `public static bool `[`htif_write_getchar`](#htif_8cpp_1afb59e2974fe200a5666bf660964faafc)`(`[`i_virtual_state_access`](#classcartesi_1_1i__virtual__state__access)` * a,`[`htif`](#classcartesi_1_1htif)` * h,uint64_t payload)` 

#### `public static bool `[`htif_write_putchar`](#htif_8cpp_1ab37f14163a66be819a969b410311bf4a)`(`[`i_virtual_state_access`](#classcartesi_1_1i__virtual__state__access)` * a,`[`htif`](#classcartesi_1_1htif)` * h,uint64_t payload)` 

#### `public static bool `[`htif_write_halt`](#htif_8cpp_1ae4c7005cfccf7681572621f8b90b0fbc)`(`[`i_virtual_state_access`](#classcartesi_1_1i__virtual__state__access)` * a,`[`htif`](#classcartesi_1_1htif)` * h,uint64_t payload)` 

#### `public static bool `[`htif_write_tohost`](#htif_8cpp_1ac3bf58be48302bb75528d39318c69ff6)`(`[`i_virtual_state_access`](#classcartesi_1_1i__virtual__state__access)` * a,`[`htif`](#classcartesi_1_1htif)` * h,uint64_t tohost)` 

#### `public static bool `[`htif_write_fromhost`](#htif_8cpp_1a5cf1d096af8d91342aaa6d550fcc8765)`(`[`i_virtual_state_access`](#classcartesi_1_1i__virtual__state__access)` * a,`[`htif`](#classcartesi_1_1htif)` * h,uint64_t val)` 

#### `public static bool `[`htif_write`](#htif_8cpp_1ac677ac703c05ddc85f54e71928206bc9)`(const `[`pma_entry`](#classcartesi_1_1pma__entry)` & pma,`[`i_virtual_state_access`](#classcartesi_1_1i__virtual__state__access)` * a,uint64_t offset,uint64_t val,int size_log2)` 

HTIF device write callback. See ::pma_write.

#### `public static void `[`print_uint64_t`](#interpret_8cpp_1a9728ba30df1ea1b12837a7984a6c7e12)`(uint64_t a)` 

#### `public void `[`dump_regs`](#interpret_8cpp_1a1fc7ee6553c9664f270e05b3c5c94564)`(const `[`machine_state`](#structcartesi_1_1machine__state)` & s)` 

#### `public template<>`  <br/>`static `[`pma_entry`](#classcartesi_1_1pma__entry)` & `[`find_pma_entry`](#interpret_8cpp_1a179c26c1622de5d0e530acec2ec3db23)`(STATE_ACCESS & a,uint64_t paddr)` 

Obtain PMA entry overlapping with target physical address.

#### Parameters
* `STATE_ACCESS` Class of machine state accessor object. 

#### Parameters
* `a` Machine state accessor object. 

* `paddr` Target physical address. 

#### Returns
Corresponding entry if found, or the sentinel empty entry.

This is the same as ::naked_find_pma_entry, except it does not perform naked accesses to the machine state. Rather, it goes through the state accessor object so all accesses can be recorded if need be.

#### `public template<>`  <br/>`inline static bool `[`write_ram_uint64`](#interpret_8cpp_1af19e713c2f0a7a011b6070741198e3f6)`(STATE_ACCESS & a,uint64_t paddr,uint64_t val)` 

Write an aligned word to memory.

#### Parameters
* `STATE_ACCESS` Class of machine state accessor object. 

#### Parameters
* `a` Machine state accessor object. 

* `paddr` Physical address of word. 

* `val` Value to write. 

#### Returns
True if succeeded, false otherwise.

#### `public template<>`  <br/>`inline static bool `[`read_ram_uint64`](#interpret_8cpp_1af2ba80982fd5083b8f7ba173bb67912f)`(STATE_ACCESS & a,uint64_t paddr,uint64_t * pval)` 

Read an aligned word from memory.

#### Parameters
* `STATE_ACCESS` Class of machine state accessor object. 

#### Parameters
* `a` Machine state accessor object. 

* `paddr` Physical address of word. 

* `pval` Pointer to word. 

#### Returns
True if succeeded, false otherwise.

#### `public template<>`  <br/>`static bool `[`translate_virtual_address`](#interpret_8cpp_1a11b1f08de4cab1a9aa9014f6ebcd4f56)`(STATE_ACCESS & a,uint64_t * ppaddr,uint64_t vaddr,int xwr_shift)` 

Walk the page table and translate a virtual address to the corresponding physical address.

#### Parameters
* `STATE_ACCESS` Class of machine state accessor object. 

#### Parameters
* `a` Machine state accessor object. 

* `vaddr` Virtual address 

* `ppaddr` Pointer to physical address. 

* `xwr_shift` Encodes the access mode by the shift to the XWR triad (PTE_XWR_R_SHIFT, PTE_XWR_R_SHIFT, or PTE_XWR_R_SHIFT) 

#### Returns
True if succeeded, false otherwise.

#### `public static void `[`tlb_mark_dirty_page`](#interpret_8cpp_1ac573284642614fde66498dda837f4e65)`(`[`tlb_entry`](#structcartesi_1_1tlb__entry)` & tlb)` 

Mark TLB entry as dirty in dirty page map.

#### Parameters
* `tlb` TLB entry to mark.

#### `public inline static unsigned char * `[`tlb_replace_read`](#interpret_8cpp_1a2c9ac085b35c0fd63cfc5cf7719cd478)`(`[`pma_entry`](#classcartesi_1_1pma__entry)` & pma,uint64_t vaddr,uint64_t paddr,`[`tlb_entry`](#structcartesi_1_1tlb__entry)` & tlb)` 

Replaces an entry in the TLB with a new one when reading.

#### Parameters
* `pma` PMA entry for range. 

* `vaddr` Target virtual address. 

* `paddr` Target physical address. 

* `tlb` TLB entry to replace. 

#### Returns
Pointer to page start in host memory.

#### `public inline static unsigned char * `[`tlb_replace_write`](#interpret_8cpp_1abe2665b83f94efb4fdd5dac1b8c6f4f5)`(`[`pma_entry`](#classcartesi_1_1pma__entry)` & pma,uint64_t vaddr,uint64_t paddr,`[`tlb_entry`](#structcartesi_1_1tlb__entry)` & tlb)` 

Replaces an entry in the TLB with a new one when writing.

#### Parameters
* `pma` PMA entry for range. 

* `vaddr` Target virtual address. 

* `paddr` Target physical address. 

* `tlb` TLB entry to replace. 

#### Returns
Pointer to page start in host memory.

#### `public template<>`  <br/>`inline static bool `[`tlb_hit`](#interpret_8cpp_1a0ae4214748bd42ee1dc49d906ec7491e)`(const `[`tlb_entry`](#structcartesi_1_1tlb__entry)` & tlb,uint64_t vaddr)` 

Checks for a TLB hit.

#### Parameters
* `T` Type of access needed (uint8_t, uint16_t, uint32_t, uint64_t). 

#### Parameters
* `tlb` TLB entry to check. 

* `vaddr` Target virtual address. 

#### Returns
True on hit, false otherwise.

#### `public static void `[`tlb_flush_all`](#interpret_8cpp_1adc1bffc5f869fe08c7023405311d6404)`(`[`machine_state`](#structcartesi_1_1machine__state)` & s)` 

Invalidates all TLB entries.

#### Parameters
* `s` Pointer to machine state.

#### `public static void `[`tlb_flush_vaddr`](#interpret_8cpp_1a2657383d6e55a10019fc4ebc50959d2c)`(`[`machine_state`](#structcartesi_1_1machine__state)` & s,uint64_t vaddr)` 

Invalidates a specific mapping.

#### Parameters
* `s` Pointer to machine state. 

* `vaddr` Target virtual address.

#### `public inline static bool `[`csr_is_read_only`](#interpret_8cpp_1a620fbbb527350f442b1b58ae2a6e8792)`(`[`CSR_address`](#riscv-constants_8h_1a0def04ee38a93e6cc26834eb9be26767)` csraddr)` 

Checks if CSR is read-only.

#### Parameters
* `CSR_address` Address of CSR in file. 

#### Returns
true if read-only, false otherwise.

#### `public inline static uint32_t `[`csr_priv`](#interpret_8cpp_1a49df1726f5030b51c8721ccd3b4ae290)`(`[`CSR_address`](#riscv-constants_8h_1a0def04ee38a93e6cc26834eb9be26767)` csr)` 

Extract privilege level from CSR address.

#### Parameters
* `CSR_address` Address of CSR in file. 

#### Returns
Privilege level.

#### `public template<>`  <br/>`static void `[`set_priv`](#interpret_8cpp_1aff0f7b117159b9a1da540fcbe95a53b2)`(STATE_ACCESS & a,int previous_prv,int new_prv)` 

Changes privilege level.

#### Parameters
* `a` Machine state accessor object. 

* `previous_prv` Previous privilege level. 

* `new_prv` New privilege level.

#### `public template<>`  <br/>`static void `[`raise_exception`](#interpret_8cpp_1a61a6dd5b4e9a5bc9c6421596bffba17c)`(STATE_ACCESS & a,uint64_t cause,uint64_t tval)` 

Raise an exception (or interrupt).

#### Parameters
* `a` Machine state accessor object. 

* `cause` Exception (or interrupt) mcause (or scause). 

* `tval` Associated tval.

#### `public template<>`  <br/>`inline static uint32_t `[`get_pending_irq_mask`](#interpret_8cpp_1a9c33502d6cdd30918d7a889cd1fd183d)`(STATE_ACCESS & a)` 

Obtains a mask of pending and enabled interrupts.

#### Parameters
* `a` Machine state accessor object. 

#### Returns
The mask.

#### `public inline static uint32_t `[`ilog2`](#interpret_8cpp_1affefadda9e839e479a320e213bbaa89e)`(uint32_t v)` 

#### `public template<>`  <br/>`static void `[`raise_interrupt_if_any`](#interpret_8cpp_1ae484ba062c44919695174366cbed3f0c)`(STATE_ACCESS & a)` 

Raises an interrupt if any are enabled and pending.

#### Parameters
* `a` Machine state accessor object.

#### `public inline static uint32_t `[`insn_get_rd`](#interpret_8cpp_1af8912ebe46192d9a9be94f5f80ed24d9)`(uint32_t insn)` 

Obtains the RD field from an instruction.

#### Parameters
* `insn` Instruction.

#### `public inline static uint32_t `[`insn_get_rs1`](#interpret_8cpp_1a7e4902622bd153d58251a135f2c14ff5)`(uint32_t insn)` 

Obtains the RS1 field from an instruction.

#### Parameters
* `insn` Instruction.

#### `public inline static uint32_t `[`insn_get_rs2`](#interpret_8cpp_1a649371ca7f8886679a4d38dd42e32146)`(uint32_t insn)` 

Obtains the RS2 field from an instruction.

#### Parameters
* `insn` Instruction.

#### `public inline static int32_t `[`insn_I_get_imm`](#interpret_8cpp_1a5bd833d1fbc3fea2fd242a4ee60e7307)`(uint32_t insn)` 

Obtains the immediate value from a I-type instruction.

#### Parameters
* `insn` Instruction.

#### `public inline static uint32_t `[`insn_I_get_uimm`](#interpret_8cpp_1acbf0b6409f3755a0a71ca4650d0307e4)`(uint32_t insn)` 

Obtains the unsigned immediate value from a I-type instruction.

#### Parameters
* `insn` Instruction.

#### `public inline static int32_t `[`insn_U_get_imm`](#interpret_8cpp_1a029c25f1e6aa0bac065f1099a293d673)`(uint32_t insn)` 

Obtains the immediate value from a U-type instruction.

#### Parameters
* `insn` Instruction.

#### `public inline static int32_t `[`insn_B_get_imm`](#interpret_8cpp_1a70a9de9fd16bf8efb2b5c81fdd9549de)`(uint32_t insn)` 

Obtains the immediate value from a B-type instruction.

#### Parameters
* `insn` Instruction.

#### `public inline static int32_t `[`insn_J_get_imm`](#interpret_8cpp_1afc5a990fb8865e75e31eb30b095b3da6)`(uint32_t insn)` 

Obtains the immediate value from a J-type instruction.

#### Parameters
* `insn` Instruction.

#### `public inline static int32_t `[`insn_S_get_imm`](#interpret_8cpp_1a3c5cde9af69c0d1f2d41cefa24f59bf5)`(uint32_t insn)` 

Obtains the immediate value from a S-type instruction.

#### Parameters
* `insn` Instruction.

#### `public inline static uint32_t `[`insn_get_opcode`](#interpret_8cpp_1ac7e08427224cd117fc5a957b7b6a3e2e)`(uint32_t insn)` 

Obtains the opcode field from an instruction.

#### Parameters
* `insn` Instruction.

#### `public inline static uint32_t `[`insn_get_funct3`](#interpret_8cpp_1a2abbb08c9fd2a71010f14cc9cd93dd7e)`(uint32_t insn)` 

Obtains the funct3 field from an instruction.

#### Parameters
* `insn` Instruction.

#### `public inline static uint32_t `[`insn_get_funct3_funct7`](#interpret_8cpp_1aed612287c92285b55d0cf47a590e90ee)`(uint32_t insn)` 

Obtains the concatanation of funct3 and funct7 fields from an instruction.

#### Parameters
* `insn` Instruction.

#### `public inline static uint32_t `[`insn_get_funct3_funct5`](#interpret_8cpp_1a4b835012b6628464a039d2d59b83319e)`(uint32_t insn)` 

Obtains the concatanation of funct3 and funct5 fields from an instruction.

#### Parameters
* `insn` Instruction.

#### `public inline static uint32_t `[`insn_get_funct7`](#interpret_8cpp_1a05f7442af5651bff7ca5f61441c1a61c)`(uint32_t insn)` 

Obtains the funct7 field from an instruction.

#### Parameters
* `insn` Instruction.

#### `public inline static uint32_t `[`insn_get_funct6`](#interpret_8cpp_1a6ab72cffda23553134c5f7de19bbfed5)`(uint32_t insn)` 

Obtains the funct6 field from an instruction.

#### Parameters
* `insn` Instruction.

I.e., the first 6 bits.

#### `public template<>`  <br/>`inline static bool `[`read_virtual_memory`](#interpret_8cpp_1aaddb4b76b27c86bad050e507da0c7646)`(STATE_ACCESS & a,uint64_t vaddr,T * pval)` 

Read an aligned word from virtual memory.

#### Parameters
* `T` uint8_t, uint16_t, uint32_t, or uint64_t. 

* `STATE_ACCESS` Class of machine state accessor object. 

#### Parameters
* `a` Machine state accessor object. 

* `vaddr` Virtual address for word. 

* `pval` Pointer to word receiving value. 

#### Returns
True if succeeded, false otherwise.

#### `public template<>`  <br/>`inline static bool `[`write_virtual_memory`](#interpret_8cpp_1adf657803f1577bb3682a2df1762d9dee)`(STATE_ACCESS & a,uint64_t vaddr,uint64_t val64)` 

Writes an aligned word to virtual memory.

#### Parameters
* `T` uint8_t, uint16_t, uint32_t, or uint64_t. 

* `STATE_ACCESS` Class of machine state accessor object. 

#### Parameters
* `a` Machine state accessor object. 

* `vaddr` Virtual address for word. 

* `val` Value to write. 

#### Returns
True if succeeded, false if exception raised.

#### `public static void `[`dump_insn`](#interpret_8cpp_1a0de28761d3a6ecaa26414b7b424759d2)`(`[`machine`](#classcartesi_1_1machine)` & m,uint64_t pc,uint32_t insn,const char * name)` 

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`raise_illegal_insn_exception`](#interpret_8cpp_1abca3016f84550caba3af108946dc96eb)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Raises an illegal instruction exception.

#### Parameters
* `STATE_ACCESS` Class of machine state accessor object. 

#### Parameters
* `a` Machine state accessor object. 

* `pc` Current pc. 

* `insn` Instruction. 

#### Returns
execute_status::illegal

This function is tail-called whenever the caller decoded enough of the instruction to identify it as illegal.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`raise_misaligned_fetch_exception`](#interpret_8cpp_1ae8f0f1ccff9e31318e26b746ae54142e)`(STATE_ACCESS & a,uint64_t pc)` 

Raises an misaligned-fetch exception.

#### Parameters
* `STATE_ACCESS` Class of machine state accessor object. 

#### Parameters
* `a` Machine state accessor object. 

* `pc` Current pc. 

* `insn` Instruction. 

#### Returns
execute_status::retired

This function is tail-called whenever the caller identified that the next value of pc is misaligned.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`advance_to_raised_exception`](#interpret_8cpp_1adf6e4ee8dc24dc5286d9f4ae2fcb2671)`(STATE_ACCESS & a)` 

Returns from execution due to raised exception.

#### Parameters
* `STATE_ACCESS` Class of machine state accessor object. 

#### Parameters
* `a` Machine state accessor object. 

* `insn` Instruction. 

#### Returns
execute_status::retired

This function is tail-called whenever the caller identified a raised exception.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`advance_to_next_insn`](#interpret_8cpp_1a81b6ba272791648b5c95b08f6db7fa10)`(STATE_ACCESS & a,uint64_t pc)` 

Advances pc to the next instruction.

#### Parameters
* `STATE_ACCESS` Class of machine state accessor object. 

#### Parameters
* `a` Machine state accessor object. 

* `pc` Current pc. 

* `insn` Instruction. 

#### Returns
execute_status::retired

This function is tail-called whenever the caller wants move to the next instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_jump`](#interpret_8cpp_1addef54a74e7e75b0f15b711e08ee8e00)`(STATE_ACCESS & a,uint64_t pc)` 

Changes pc arbitrarily, potentially causing a jump.

#### Parameters
* `STATE_ACCESS` Class of machine state accessor object. 

#### Parameters
* `a` Machine state accessor object. 

* `pc` Current pc. 

* `insn` Instruction. 

#### Returns
execute_status::retired

This function is tail-called whenever the caller wants to jump.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_LR`](#interpret_8cpp_1a51506a4a9b5c17a8e67404bc0bb745dd)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Execute the LR instruction.

#### Parameters
* `STATE_ACCESS` Class of machine state accessor object. 

#### Parameters
* `a` Machine state accessor object. 

* `pc` Current pc. 

* `insn` Instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SC`](#interpret_8cpp_1a8d69759d63313d8a064ca76e1ef8785f)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Execute the SC instruction.

#### Parameters
* `STATE_ACCESS` Class of machine state accessor object. 

#### Parameters
* `a` Machine state accessor object. 

* `pc` Current pc. 

* `insn` Instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_LR_W`](#interpret_8cpp_1a7ca3b9b14937b97cd86edaa2d6098059)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the LR.W instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SC_W`](#interpret_8cpp_1a2d51ed396a7e62ef102194bdef5e8d56)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the SC.W instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_AMO`](#interpret_8cpp_1ab3a386481b0684c3821b5ba595c6e79f)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn,const F & f)` 

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_AMOSWAP_W`](#interpret_8cpp_1ad289ed9ab0b2b45e0348f001faf6b688)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the AMOSWAP.W instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_AMOADD_W`](#interpret_8cpp_1ac75574c2af1542fbca0808541c42f587)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the AMOADD.W instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_AMOXOR_W`](#interpret_8cpp_1afa3f6b45a82c5e68088c7522a2159497)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_AMOAND_W`](#interpret_8cpp_1ac228a2894e815cdcd310e8284a8be325)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the AMOAND.W instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_AMOOR_W`](#interpret_8cpp_1a05fcb5473d7e89df0efbfb9117e5ff10)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the AMOOR.W instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_AMOMIN_W`](#interpret_8cpp_1ab905a0bb2c758efa6d392598cddf4ac1)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the AMOMIN.W instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_AMOMAX_W`](#interpret_8cpp_1ac4e2062d0641f84a1eb58f9fc65b3d82)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the AMOMAX.W instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_AMOMINU_W`](#interpret_8cpp_1a3fa13eb10b7dd5c8dc2c726d68292bff)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the AMOMINU.W instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_AMOMAXU_W`](#interpret_8cpp_1ac569cd449a45ec1a6e5be131635d67ef)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the AMOMAXU.W instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_LR_D`](#interpret_8cpp_1aa076532586be1a1ebde5aa74a4544611)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the LR.D instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SC_D`](#interpret_8cpp_1adf6e18968320c1e362e6750cd4d572ee)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the SC.D instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_AMOSWAP_D`](#interpret_8cpp_1a810a46b0b6a34ed33656e06c9765554c)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the AMOSWAP.D instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_AMOADD_D`](#interpret_8cpp_1a9c6b6bd384c7e66a85bb67a99b8c2fe8)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the AMOADD.D instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_AMOXOR_D`](#interpret_8cpp_1a6a1abca117ac7838e223961616c56e90)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_AMOAND_D`](#interpret_8cpp_1a7c2d19d9d5d9a08be2892102bd511926)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the AMOAND.D instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_AMOOR_D`](#interpret_8cpp_1a4b5a54c467ab6ba6483097d0ca252c79)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the AMOOR.D instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_AMOMIN_D`](#interpret_8cpp_1adf8d4e807ee85b82b046f7ee2fa5410a)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the AMOMIN.D instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_AMOMAX_D`](#interpret_8cpp_1a579d18767ba75dbef087d847d9108779)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the AMOMAX.D instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_AMOMINU_D`](#interpret_8cpp_1a01420a0fb74873616f5f1ec650dcdfe4)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the AMOMINU.D instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_AMOMAXU_D`](#interpret_8cpp_1a82ba4e12a184fdce042147193f88c027)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the AMOMAXU.D instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_ADDW`](#interpret_8cpp_1a83d455f9c0d47e320f52e4619af57a09)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the ADDW instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SUBW`](#interpret_8cpp_1ad6287939e2cd9f3b6fb6430788ee4519)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the SUBW instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SLLW`](#interpret_8cpp_1aac1d8370562b8e55af3e56d98c703324)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the SLLW instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SRLW`](#interpret_8cpp_1a900f2c0961c71345af73c8660eb92cf5)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the SRLW instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SRAW`](#interpret_8cpp_1a0d569949ce8da2adc42604f4dff761c0)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the SRAW instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_MULW`](#interpret_8cpp_1a97be3784401bc596761c249b0ea7b245)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the MULW instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_DIVW`](#interpret_8cpp_1ad77c1c7749c5183bca498e6da58dbecd)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the DIVW instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_DIVUW`](#interpret_8cpp_1a65b339a6b8c39c1b0a7c54b8e133d7ab)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the DIVUW instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_REMW`](#interpret_8cpp_1aee484c7038904e9d4efe616ffeae762a)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the REMW instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_REMUW`](#interpret_8cpp_1a9820fd61a78f1057220b9b9f26c6ea85)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the REMUW instruction.

#### `public inline static uint64_t `[`read_csr_fail`](#interpret_8cpp_1ab2f2f30c37a3a21ce89c096706b545e0)`(bool * status)` 

#### `public inline static uint64_t `[`read_csr_success`](#interpret_8cpp_1ad981c8cb7fcf74cb4a731f074b519fd6)`(uint64_t val,bool * status)` 

#### `public template<>`  <br/>`inline static bool `[`rdcounteren`](#interpret_8cpp_1a3604a336a8a41456a5c2e98990be823a)`(STATE_ACCESS & a,`[`CSR_address`](#riscv-constants_8h_1a0def04ee38a93e6cc26834eb9be26767)` csraddr)` 

#### `public template<>`  <br/>`inline static uint64_t `[`read_csr_cycle`](#interpret_8cpp_1a63cf226f08cecd8c9696c9039b6e25e3)`(STATE_ACCESS & a,`[`CSR_address`](#riscv-constants_8h_1a0def04ee38a93e6cc26834eb9be26767)` csraddr,bool * status)` 

#### `public template<>`  <br/>`inline static uint64_t `[`read_csr_instret`](#interpret_8cpp_1a5b89f64ac5cdb39f2d31366ebc7b03f1)`(STATE_ACCESS & a,`[`CSR_address`](#riscv-constants_8h_1a0def04ee38a93e6cc26834eb9be26767)` csraddr,bool * status)` 

#### `public template<>`  <br/>`inline static uint64_t `[`read_csr_time`](#interpret_8cpp_1aad0f1ef51be44d09f1957a9b1213401a)`(STATE_ACCESS & a,`[`CSR_address`](#riscv-constants_8h_1a0def04ee38a93e6cc26834eb9be26767)` csraddr,bool * status)` 

#### `public template<>`  <br/>`inline static uint64_t `[`read_csr_sstatus`](#interpret_8cpp_1a4a8c8d5d7f2f8c55f1c772a5f528f423)`(STATE_ACCESS & a,bool * status)` 

#### `public template<>`  <br/>`inline static uint64_t `[`read_csr_sie`](#interpret_8cpp_1abf145a98358ce01bf256ac252ff3bc5e)`(STATE_ACCESS & a,bool * status)` 

#### `public template<>`  <br/>`inline static uint64_t `[`read_csr_stvec`](#interpret_8cpp_1a58f4c9177b81567444a40c3fb8193995)`(STATE_ACCESS & a,bool * status)` 

#### `public template<>`  <br/>`inline static uint64_t `[`read_csr_scounteren`](#interpret_8cpp_1abecbcd5fa30c63d9431e1dffdc3d43e1)`(STATE_ACCESS & a,bool * status)` 

#### `public template<>`  <br/>`inline static uint64_t `[`read_csr_sscratch`](#interpret_8cpp_1ada593abaa42b0df41e8a6d35e1906613)`(STATE_ACCESS & a,bool * status)` 

#### `public template<>`  <br/>`inline static uint64_t `[`read_csr_sepc`](#interpret_8cpp_1a2908b044f7b49811cfdd753d94ec203b)`(STATE_ACCESS & a,bool * status)` 

#### `public template<>`  <br/>`inline static uint64_t `[`read_csr_scause`](#interpret_8cpp_1a4313bfb3fc3b2c615dd37d20b436fa67)`(STATE_ACCESS & a,bool * status)` 

#### `public template<>`  <br/>`inline static uint64_t `[`read_csr_stval`](#interpret_8cpp_1a1fdda2d04a4c46dd12b8729907929dc9)`(STATE_ACCESS & a,bool * status)` 

#### `public template<>`  <br/>`inline static uint64_t `[`read_csr_sip`](#interpret_8cpp_1a749bea876612c5c6c6ce613b1a0346b5)`(STATE_ACCESS & a,bool * status)` 

#### `public template<>`  <br/>`inline static uint64_t `[`read_csr_satp`](#interpret_8cpp_1ad98c68fba8b4b1a085c5b592787c4bf4)`(STATE_ACCESS & a,bool * status)` 

#### `public template<>`  <br/>`inline static uint64_t `[`read_csr_mstatus`](#interpret_8cpp_1a04891d973974f2c12536a6840e9a993a)`(STATE_ACCESS & a,bool * status)` 

#### `public template<>`  <br/>`inline static uint64_t `[`read_csr_misa`](#interpret_8cpp_1abc17218919621498d0e920fd1fe8b751)`(STATE_ACCESS & a,bool * status)` 

#### `public template<>`  <br/>`inline static uint64_t `[`read_csr_medeleg`](#interpret_8cpp_1a1e7c62ca4edbc5d87208f7ec9b796386)`(STATE_ACCESS & a,bool * status)` 

#### `public template<>`  <br/>`inline static uint64_t `[`read_csr_mideleg`](#interpret_8cpp_1afbc675696c8671b8d34aa346078c1da5)`(STATE_ACCESS & a,bool * status)` 

#### `public template<>`  <br/>`inline static uint64_t `[`read_csr_mie`](#interpret_8cpp_1afdb3c472970a121e6b50e60fa7624968)`(STATE_ACCESS & a,bool * status)` 

#### `public template<>`  <br/>`inline static uint64_t `[`read_csr_mtvec`](#interpret_8cpp_1a8ad9a3d0fd0f1d9f975a2f8f315451b4)`(STATE_ACCESS & a,bool * status)` 

#### `public template<>`  <br/>`inline static uint64_t `[`read_csr_mcounteren`](#interpret_8cpp_1a5e62927b23b0752ed3a790e8251c5f01)`(STATE_ACCESS & a,bool * status)` 

#### `public template<>`  <br/>`inline static uint64_t `[`read_csr_mscratch`](#interpret_8cpp_1a0433d8506b0083d28c30ac84f17203ce)`(STATE_ACCESS & a,bool * status)` 

#### `public template<>`  <br/>`inline static uint64_t `[`read_csr_mepc`](#interpret_8cpp_1a0fc705369d3c6c5bac3145e7ea17f3dc)`(STATE_ACCESS & a,bool * status)` 

#### `public template<>`  <br/>`inline static uint64_t `[`read_csr_mcause`](#interpret_8cpp_1a9ab1d31310377a250a6d271647a23a75)`(STATE_ACCESS & a,bool * status)` 

#### `public template<>`  <br/>`inline static uint64_t `[`read_csr_mtval`](#interpret_8cpp_1ae2a67a0a26cf04d4f8938ce3dc5bb7cb)`(STATE_ACCESS & a,bool * status)` 

#### `public template<>`  <br/>`inline static uint64_t `[`read_csr_mip`](#interpret_8cpp_1a890dedf6631483414ee92cdd7e779d14)`(STATE_ACCESS & a,bool * status)` 

#### `public template<>`  <br/>`inline static uint64_t `[`read_csr_mcycle`](#interpret_8cpp_1a395156c5f8da978ec85d3b0e320a54d1)`(STATE_ACCESS & a,bool * status)` 

#### `public template<>`  <br/>`inline static uint64_t `[`read_csr_minstret`](#interpret_8cpp_1a33679282481d0138c8bf80786876e402)`(STATE_ACCESS & a,bool * status)` 

#### `public template<>`  <br/>`inline static uint64_t `[`read_csr_mvendorid`](#interpret_8cpp_1a7b1a7d67b3a814f6aa4f153d2dd76966)`(STATE_ACCESS & a,bool * status)` 

#### `public template<>`  <br/>`inline static uint64_t `[`read_csr_marchid`](#interpret_8cpp_1ad3a082b6221360566ad6a60bcd831fd1)`(STATE_ACCESS & a,bool * status)` 

#### `public template<>`  <br/>`inline static uint64_t `[`read_csr_mimpid`](#interpret_8cpp_1a042a64b5da639a2de6009e8e0496f51a)`(STATE_ACCESS & a,bool * status)` 

#### `public template<>`  <br/>`static uint64_t `[`read_csr`](#interpret_8cpp_1a08574282105a263c6271e8d903acfbd1)`(STATE_ACCESS & a,`[`CSR_address`](#riscv-constants_8h_1a0def04ee38a93e6cc26834eb9be26767)` csraddr,bool * status)` 

Reads the value of a CSR given its address.

#### Parameters
* `a` Machine state accessor object. 

* `csraddr` Address of CSR in file. 

* `status` Returns the status of the operation (true for success, false otherwise). 

#### Returns
Register value.

#### `public template<>`  <br/>`static bool `[`write_csr_sstatus`](#interpret_8cpp_1a205a1a6d411581c84e8a6477319cab29)`(STATE_ACCESS & a,uint64_t val)` 

#### `public template<>`  <br/>`static bool `[`write_csr_sie`](#interpret_8cpp_1ad70f7ceff2bf2f408ed0bc6768e9ffb8)`(STATE_ACCESS & a,uint64_t val)` 

#### `public template<>`  <br/>`static bool `[`write_csr_stvec`](#interpret_8cpp_1ae9a31aaeeaefa139148347c762cc1bcc)`(STATE_ACCESS & a,uint64_t val)` 

#### `public template<>`  <br/>`static bool `[`write_csr_scounteren`](#interpret_8cpp_1a62962f0659c8de021a2666056dd1e7dd)`(STATE_ACCESS & a,uint64_t val)` 

#### `public template<>`  <br/>`static bool `[`write_csr_sscratch`](#interpret_8cpp_1a47c9220be9498047522c92d42b8d9a4e)`(STATE_ACCESS & a,uint64_t val)` 

#### `public template<>`  <br/>`static bool `[`write_csr_sepc`](#interpret_8cpp_1a521389f1a9f0a20cd5132eccf03b7acd)`(STATE_ACCESS & a,uint64_t val)` 

#### `public template<>`  <br/>`static bool `[`write_csr_scause`](#interpret_8cpp_1ada90baa4a0145d93a3fad27401fa0e3c)`(STATE_ACCESS & a,uint64_t val)` 

#### `public template<>`  <br/>`static bool `[`write_csr_stval`](#interpret_8cpp_1a003c71110703bec3baa5e6d8a700225a)`(STATE_ACCESS & a,uint64_t val)` 

#### `public template<>`  <br/>`static bool `[`write_csr_sip`](#interpret_8cpp_1aab68cb56fdb7e6b52e0149074a09f1b9)`(STATE_ACCESS & a,uint64_t val)` 

#### `public template<>`  <br/>`static bool `[`write_csr_satp`](#interpret_8cpp_1a9edd20f873ef67048483e03025df52ee)`(STATE_ACCESS & a,uint64_t val)` 

#### `public template<>`  <br/>`static bool `[`write_csr_mstatus`](#interpret_8cpp_1a56b9516e99ef5aff551158129f767710)`(STATE_ACCESS & a,uint64_t val)` 

#### `public template<>`  <br/>`static bool `[`write_csr_medeleg`](#interpret_8cpp_1aec32288317da0f077428fe25478ac5df)`(STATE_ACCESS & a,uint64_t val)` 

#### `public template<>`  <br/>`static bool `[`write_csr_mideleg`](#interpret_8cpp_1a8bcdd9a300776314f4384aa1d731c8f0)`(STATE_ACCESS & a,uint64_t val)` 

#### `public template<>`  <br/>`static bool `[`write_csr_mie`](#interpret_8cpp_1aefedf5f7f8015188ef7198ac928a375e)`(STATE_ACCESS & a,uint64_t val)` 

#### `public template<>`  <br/>`static bool `[`write_csr_mtvec`](#interpret_8cpp_1ab3a200469f0277545a8a48aef35a9192)`(STATE_ACCESS & a,uint64_t val)` 

#### `public template<>`  <br/>`static bool `[`write_csr_mcounteren`](#interpret_8cpp_1ae20e72d55a3f54ddbd4a3024aa4a7c62)`(STATE_ACCESS & a,uint64_t val)` 

#### `public template<>`  <br/>`static bool `[`write_csr_minstret`](#interpret_8cpp_1aedbf2bdf3ad2a6937177f873051065f7)`(STATE_ACCESS & a,uint64_t val)` 

#### `public template<>`  <br/>`static bool `[`write_csr_mcycle`](#interpret_8cpp_1a5ae9e6771ebad43fa90f686671e3962f)`(STATE_ACCESS & a,uint64_t val)` 

#### `public template<>`  <br/>`static bool `[`write_csr_mscratch`](#interpret_8cpp_1a3929a04c0a3677847a5e9727014079c9)`(STATE_ACCESS & a,uint64_t val)` 

#### `public template<>`  <br/>`static bool `[`write_csr_mepc`](#interpret_8cpp_1ad8d490a34af34e57d269248fb81a5072)`(STATE_ACCESS & a,uint64_t val)` 

#### `public template<>`  <br/>`static bool `[`write_csr_mcause`](#interpret_8cpp_1a46d05d967d5ca82d3456a696a2364739)`(STATE_ACCESS & a,uint64_t val)` 

#### `public template<>`  <br/>`static bool `[`write_csr_mtval`](#interpret_8cpp_1aaa7259c6b1c1b277b83181467fc13965)`(STATE_ACCESS & a,uint64_t val)` 

#### `public template<>`  <br/>`static bool `[`write_csr_mip`](#interpret_8cpp_1acdf0a60917f339095cc9f2b52d174247)`(STATE_ACCESS & a,uint64_t val)` 

#### `public template<>`  <br/>`static bool `[`write_csr`](#interpret_8cpp_1a0deab0da97762f266b1d21a531bfdc22)`(STATE_ACCESS & a,`[`CSR_address`](#riscv-constants_8h_1a0def04ee38a93e6cc26834eb9be26767)` csraddr,uint64_t val)` 

Writes a value to a CSR given its address.

#### Parameters
* `a` Machine state accessor object. 

* `csraddr` Address of CSR in file. 

* `val` New register value. 

#### Returns
The status of the operation (true for success, false otherwise).

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_csr_RW`](#interpret_8cpp_1a752df39226d9e8197160a98c9e82d66b)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn,const RS1VAL & rs1val)` 

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_CSRRW`](#interpret_8cpp_1a56660b9433686d4c43f666e0c616c67b)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the CSRRW instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_CSRRWI`](#interpret_8cpp_1a46cc9afd85a2b295be75b60e957221b8)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the CSRRWI instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_csr_SC`](#interpret_8cpp_1a06daa91d7bf839fa34f1705ebe318e31)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn,const F & f)` 

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_CSRRS`](#interpret_8cpp_1a5797e2fb1fa2c3fceaf2e5ec72aa74c4)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the CSRRS instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_CSRRC`](#interpret_8cpp_1aa5979e6025fa7a4c08b842c1ecfc6caf)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the CSRRC instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_csr_SCI`](#interpret_8cpp_1abafe3263d8831692b2b2cb31ca1dcfcb)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn,const F & f)` 

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_CSRRSI`](#interpret_8cpp_1a15c77b98bad6f0902ced9bd90069dac3)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the CSRRSI instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_CSRRCI`](#interpret_8cpp_1a6f9cae3c77c3b9b2a5021d4e07e94d2f)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the CSRRCI instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_ECALL`](#interpret_8cpp_1a2415d5d7865b8e9341700d7c1897c57d)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the ECALL instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_EBREAK`](#interpret_8cpp_1abd3b40a91ab13d28787b9bb4637d954c)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the EBREAK instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_URET`](#interpret_8cpp_1a1c3f3d32c10deb4f47ab6ac6a65996c9)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the URET instruction. // no U-mode traps.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SRET`](#interpret_8cpp_1ad9a0cf345f65dddd1fd30595bcce54ad)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the SRET instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_MRET`](#interpret_8cpp_1a00ca30742e7edc6a1c2271601909abfd)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the MRET instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_WFI`](#interpret_8cpp_1a4c53dbc90528e6b0138eee8927249602)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the WFI instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_FENCE`](#interpret_8cpp_1afcaa403dd5bc1fb805e9d7c289555069)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the FENCE instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_FENCE_I`](#interpret_8cpp_1aad7bf2d3ee32bf79841ed14bcb529d47)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the FENCE.I instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_arithmetic`](#interpret_8cpp_1a73aabd6f875cafb1deb5af1869775e58)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn,const F & f)` 

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_ADD`](#interpret_8cpp_1a725438c4795ad4b159c7ab00de762592)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the ADD instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SUB`](#interpret_8cpp_1af1dc1c78c8c6fdc98c37896b9ffa431a)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the SUB instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SLL`](#interpret_8cpp_1aa92a840115f700a882ef0646eadae699)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the SLL instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SLT`](#interpret_8cpp_1a9bbfb2fda4506bd7f9d79065ba636d2d)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the SLT instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SLTU`](#interpret_8cpp_1af5367e253bafe6ae9efb4ff18d60f07e)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the SLTU instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_XOR`](#interpret_8cpp_1a87b24da8d91a4ebfe572b71e7969a8e2)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the XOR instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SRL`](#interpret_8cpp_1a8a6e851ec035efa73a28d499f1693c20)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the SRL instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SRA`](#interpret_8cpp_1a4d5cc106d3eda32e978a36170e5b50c4)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the SRA instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_OR`](#interpret_8cpp_1a44dd6ccd01023170685c36994108854b)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the OR instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_AND`](#interpret_8cpp_1a7539563144d5a0aa75ff09b406bc3351)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the AND instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_MUL`](#interpret_8cpp_1a49b59a7167b9991b67bdafcf6978b37f)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the MUL instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_MULH`](#interpret_8cpp_1ac3a2f5dc15b97b249c6200f0cff9eae4)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the MULH instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_MULHSU`](#interpret_8cpp_1ab4c3d9c236452db059644673c0fbb357)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the MULHSU instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_MULHU`](#interpret_8cpp_1a07b7d4f0bb5187507245eaf9464d68e1)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the MULHU instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_DIV`](#interpret_8cpp_1a4e4f387d111b709846206f73de90b58c)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the DIV instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_DIVU`](#interpret_8cpp_1a7d5038bcf6da80dd431a5c8e9846c826)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the DIVU instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_REM`](#interpret_8cpp_1a3e16b9df4f74d79ed51ef0e4011f6296)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the REM instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_REMU`](#interpret_8cpp_1aab39f5066cebffb96c7213f96ee98846)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the REMU instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_arithmetic_immediate`](#interpret_8cpp_1a91acd3bea1b0de7bcb1e43f0aac5a5f9)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn,const F & f)` 

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SRLI`](#interpret_8cpp_1a27889aeb5539e91b198daf95c3ca98ad)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the SRLI instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SRAI`](#interpret_8cpp_1aeab764039df2350707d8dcff1b8f393e)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the SRAI instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_ADDI`](#interpret_8cpp_1a67c74220fceb51a601673f8e584f5600)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the ADDI instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SLTI`](#interpret_8cpp_1ac2584e46313f991bd793cf853957f1c9)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the SLTI instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SLTIU`](#interpret_8cpp_1a0d768fcff5a589109aa0c05f260acaeb)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the SLTIU instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_XORI`](#interpret_8cpp_1a146527cab2edc7776239286017b15ad9)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the XORI instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_ORI`](#interpret_8cpp_1a7e5e2431b270182bebc98a9e5a11211e)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the ORI instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_ANDI`](#interpret_8cpp_1ad57bf3e8486d027324184b8f5a5562a1)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the ANDI instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SLLI`](#interpret_8cpp_1a7a1501e5850150d060f2fabc7d07ac6a)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the SLLI instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_ADDIW`](#interpret_8cpp_1aac30de662377ad6e447404615a96dd60)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the ADDIW instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SLLIW`](#interpret_8cpp_1a8aa1275cb3ab13edeea47a4b57b68f94)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the SLLIW instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SRLIW`](#interpret_8cpp_1a1b9e09bbc1ba7360802df5f320c0d601)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the SRLIW instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SRAIW`](#interpret_8cpp_1a8a48ce17e41a3fd66e610c7f3fefe6a5)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the SRAIW instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_S`](#interpret_8cpp_1aef0b2d8bcdff28c87e61d6863e22180c)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SB`](#interpret_8cpp_1abdce19cf6cd36a7f840c72685195bcf7)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the SB instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SH`](#interpret_8cpp_1a1f4d40955ca5f14739942046ca94445d)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the SH instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SW`](#interpret_8cpp_1affe971ffb5f5bea6a4f487cb2dc8b484)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the SW instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SD`](#interpret_8cpp_1ab70eef21449fd8c921d870511afe0cd8)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the SD instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_L`](#interpret_8cpp_1a69f8e66af497808f5e7219064a1a6057)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_LB`](#interpret_8cpp_1a57b6e5711a8b6042821b8d1443a8f884)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the LB instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_LH`](#interpret_8cpp_1a680d13bcbcbf9ca8db61526eded5bc2c)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the LH instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_LW`](#interpret_8cpp_1a5fb6c700f103a584b6113f8a9ad6a954)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the LW instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_LD`](#interpret_8cpp_1aac60c52e226f802b103a15dcb928d16a)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the LD instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_LBU`](#interpret_8cpp_1a8eb6ea51f457ca42aa7125f7d87e762a)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the LBU instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_LHU`](#interpret_8cpp_1ae33b1cd779e71a3a1b1b5b4328a532be)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the LHU instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_LWU`](#interpret_8cpp_1a0df76a8c3b4a1a4b60d6873d89f29698)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the LWU instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_branch`](#interpret_8cpp_1a8a3759213af4ecf1358ec4ee3d12962c)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn,const F & f)` 

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_BEQ`](#interpret_8cpp_1a90b20f52ded2cfdee219c6fdb98bf829)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the BEQ instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_BNE`](#interpret_8cpp_1ada986d37ba2d6700ed9191956070697a)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the BNE instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_BLT`](#interpret_8cpp_1a386cab571a702139214f4133844742aa)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the BLT instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_BGE`](#interpret_8cpp_1a0006742270a879e3fd92a9cce8fafc1e)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the BGE instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_BLTU`](#interpret_8cpp_1aab6ef351c49444bdc04d824bae680811)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the BLTU instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_BGEU`](#interpret_8cpp_1aca6fd1bcd5e47393c004643f2cdb3bd4)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the BGEU instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_LUI`](#interpret_8cpp_1a885b867db6b67c332beaf631da5f59bf)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the LUI instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_AUIPC`](#interpret_8cpp_1ac18ffeed1a8516a5e55bf9b4b9ae8629)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the AUIPC instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_JAL`](#interpret_8cpp_1a191cdf5a6e651dac71cff4ce241cf2bc)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the JAL instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_JALR`](#interpret_8cpp_1af8894188a545c8a0bbed321cf12a1933)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the JALR instruction.

#### `public template<>`  <br/>`static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_SFENCE_VMA`](#interpret_8cpp_1adcb7ff88c7316ec7dbe0ca386f7825af)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Implementation of the SFENCE.VMA instruction.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_atomic_group`](#interpret_8cpp_1ae0ebaf522ee988988fffcf7b4ddf15bf)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Executes an instruction of the atomic group.

#### Parameters
* `STATE_ACCESS` Class of machine state accessor object. 

#### Parameters
* `a` Machine state accessor object. 

* `pc` Current pc. 

* `insn` Instruction. 

#### Returns
Returns true if the execution completed, false if it caused an exception. In that case, raise the exception.

See [Load-Reserved/Store-Conditional Instructions](riscv-spec-v2.2.pdf#section.7.2) and [Atomic Memory Operations](riscv-spec-v2.2.pdf#section.7.3).

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_arithmetic_32_group`](#interpret_8cpp_1a8f47c6481c2260538b68731753e167f7)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Executes an instruction of the arithmetic-32 group.

#### Parameters
* `STATE_ACCESS` Class of machine state accessor object. 

#### Parameters
* `a` Machine state accessor object. 

* `pc` Current pc. 

* `insn` Instruction. 

#### Returns
Returns true if the execution completed, false if it caused an exception. In that case, raise the exception.

See [Integer Computational Instructions](riscv-spec-v2.2.pdf#section.2.4).

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_shift_right_immediate_32_group`](#interpret_8cpp_1af72e035993e07a0801c988f7e9e1f987)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Executes an instruction of the shift-rightimmediate-32 group.

#### Parameters
* `STATE_ACCESS` Class of machine state accessor object. 

#### Parameters
* `a` Machine state accessor object. 

* `pc` Current pc. 

* `insn` Instruction. 

#### Returns
Returns true if the execution completed, false if it caused an exception. In that case, raise the exception.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_arithmetic_immediate_32_group`](#interpret_8cpp_1a58de234562c3a4562e6d6ad0b0543d2d)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Executes an instruction of the arithmetic-immediate-32 group.

#### Parameters
* `STATE_ACCESS` Class of machine state accessor object. 

#### Parameters
* `a` Machine state accessor object. 

* `pc` Current pc. 

* `insn` Instruction. 

#### Returns
Returns true if the execution completed, false if it caused an exception. In that case, raise the exception.

See [Integer Computational Instructions](riscv-spec-v2.2.pdf#section.2.4).

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_env_trap_int_mm_group`](#interpret_8cpp_1ac2a9acd967e7ab599884198e846374aa)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Executes an instruction of the environment, trap, interrupt, or memory management groups.

#### Parameters
* `STATE_ACCESS` Class of machine state accessor object. 

#### Parameters
* `a` Machine state accessor object. 

* `pc` Current pc. 

* `insn` Instruction. 

#### Returns
Returns true if the execution completed, false if it caused an exception. In that case, raise the exception.

See [Environment Call and Breakpoints](riscv-spec-v2.2.pdf#section.2.9), [Machine-Mode Privileged Instructions](riscv-privileged-v1.10.pdf#section.3.2), and [Supervisor Instructions](riscv-privileged-v1.10.pdf#section.4.2).

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_csr_env_trap_int_mm_group`](#interpret_8cpp_1a744deaf84bd59f985afcf1cfd131fd87)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Executes an instruction of the CSR, environment, trap, interrupt, or memory management groups.

#### Parameters
* `STATE_ACCESS` Class of machine state accessor object. 

#### Parameters
* `a` Machine state accessor object. 

* `pc` Current pc. 

* `insn` Instruction. 

#### Returns
Returns true if the execution completed, false if it caused an exception. In that case, raise the exception.

See [Control and Status Register Instructions](riscv-spec-v2.2.pdf#section.2.8), [Environment Call and Breakpoints](riscv-spec-v2.2.pdf#section.2.9), [Machine-Mode Privileged Instructions](riscv-privileged-v1.10.pdf#section.3.2), and [Supervisor Instructions](riscv-privileged-v1.10.pdf#section.4.2).

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_fence_group`](#interpret_8cpp_1ab65378a2a33c70f8048427367566f617)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Executes an instruction of the fence group.

#### Parameters
* `STATE_ACCESS` Class of machine state accessor object. 

#### Parameters
* `a` Machine state accessor object. 

* `pc` Current pc. 

* `insn` Instruction. 

#### Returns
Returns true if the execution completed, false if it caused an exception. In that case, raise the exception. See [Memory Model](riscv-spec-v2.2.pdf#section.2.7).

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_shift_right_immediate_group`](#interpret_8cpp_1a8cd6215617de593a7063b501c6f3acc2)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Executes an instruction of the shift-right-immediate group.

#### Parameters
* `STATE_ACCESS` Class of machine state accessor object. 

#### Parameters
* `a` Machine state accessor object. 

* `pc` Current pc. 

* `insn` Instruction. 

#### Returns
Returns true if the execution completed, false if it caused an exception. In that case, raise the exception.

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_arithmetic_group`](#interpret_8cpp_1acb4fca0288e18607ac43f1a0a26b74d1)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Executes an instruction of the arithmetic group.

#### Parameters
* `STATE_ACCESS` Class of machine state accessor object. 

#### Parameters
* `a` Machine state accessor object. 

* `pc` Current pc. 

* `insn` Instruction. 

#### Returns
Returns true if the execution completed, false if it caused an exception. In that case, raise the exception. See [Integer Computational Instructions](riscv-spec-v2.2.pdf#section.2.4).

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_arithmetic_immediate_group`](#interpret_8cpp_1a03e03f4572621380cc80cccab718fcf5)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Executes an instruction of the arithmetic-immediate group.

#### Parameters
* `STATE_ACCESS` Class of machine state accessor object. 

#### Parameters
* `a` Machine state accessor object. 

* `pc` Current pc. 

* `insn` Instruction. 

#### Returns
Returns true if the execution completed, false if it caused an exception. In that case, raise the exception. See [Integer Computational Instructions](riscv-spec-v2.2.pdf#section.2.4).

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_store_group`](#interpret_8cpp_1a36ec0c71b6670f4502098d2c30b7d367)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Executes an instruction of the store group.

#### Parameters
* `STATE_ACCESS` Class of machine state accessor object. 

#### Parameters
* `a` Machine state accessor object. 

* `pc` Current pc. 

* `insn` Instruction. 

#### Returns
Returns true if the execution completed, false if it caused an exception. In that case, raise the exception.

See [Load and Store Instructions](riscv-spec-v2.2.pdf#section.2.6).

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_load_group`](#interpret_8cpp_1a2ebf10abe8eff1480b2cdefb9774d0b7)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Executes an instruction of the load group.

#### Parameters
* `STATE_ACCESS` Class of machine state accessor object. 

#### Parameters
* `a` Machine state accessor object. 

* `pc` Current pc. 

* `insn` Instruction. 

#### Returns
Returns true if the execution completed, false if it caused an exception. In that case, raise the exception.

See [Load and Store Instructions](riscv-spec-v2.2.pdf#section.2.6).

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_branch_group`](#interpret_8cpp_1a7ea1455b3410877d58840eb78832c1b5)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Executes an instruction of the branch group.

#### Parameters
* `STATE_ACCESS` Class of machine state accessor object. 

#### Parameters
* `a` Machine state accessor object. 

* `pc` Current pc. 

* `insn` Instruction. 

#### Returns
Returns true if the execution completed, false if it caused an exception. In that case, raise the exception.

See [Control Transfer Instructions](riscv-spec-v2.2.pdf#section.2.5).

#### `public template<>`  <br/>`inline static `[`execute_status`](#interpret_8cpp_1a6bfded7f22fa6d9c108c0a8e12bb4841)` `[`execute_insn`](#interpret_8cpp_1a34cd23e9863abb69ace7085b8907031f)`(STATE_ACCESS & a,uint64_t pc,uint32_t insn)` 

Decodes and executes an instruction.

#### Parameters
* `STATE_ACCESS` Class of machine state accessor object. 

#### Parameters
* `a` Machine state accessor object. 

* `pc` Current pc. 

* `insn` Instruction. 

#### Returns
execute_status::illegal if and illegal instruction exception was raised, or execute_status::retired otherwise (Note that some other exception may or may not have been raised)

The execute_insn function decodes the instruction in multiple levels. When we know for sure that the instruction could only be a \<FOO\>, a function with the name execute_\<FOO\> will be called. See [RV32/64G Instruction Set Listings](riscv-spec-v2.2.pdf#chapter.19) and [Instruction listings for RISC-V](riscv-spec-v2.2.pdf#table.19.2).

#### `public template<>`  <br/>`static `[`fetch_status`](#interpret_8cpp_1a795403770b7df9a4eb0e1d9ae305946e)` `[`fetch_insn`](#interpret_8cpp_1a0d5c6cab87b83f7816828130736d657a)`(STATE_ACCESS & a,uint64_t * pc,uint32_t * pinsn)` 

Loads the next instruction.

#### Parameters
* `STATE_ACCESS` Class of machine state accessor object. 

#### Parameters
* `a` Machine state accessor object. 

* `pc` Receives current pc. 

* `pinsn` Receives fetched instruction. 

#### Returns
Returns fetch_status::success if load succeeded, fetch_status::exception if it caused an exception.

#### `public template<>`  <br/>[`interpreter_status`](#interpret_8h_1a1f82faa5b381ff7131252c5727171661)` `[`interpret`](#interpret_8cpp_1a5b20ffb18b95f5d72c922c4c0d746b15)`(STATE_ACCESS & a,uint64_t mcycle_end)` 

Tries to run the interpreter until mcycle hits a target.

#### Parameters
* `STATE_ACCESS` Class of machine state accessor object. 

#### Parameters
* `a` Machine state accessor object. 

* `mcycle_end` Target value for mcycle. 

#### Returns
Returns a status code that tells if the loop hit the target mcycle or stopped early.

The interpret may stop early if the machine halts permanently or becomes temporarily idle (waiting for interrupts).

#### `public template `[`interpreter_status`](#interpret_8h_1a1f82faa5b381ff7131252c5727171661)` `[`interpret`](#interpret_8cpp_1a19fe651c1a86fdc75d2c9dbba3a6ad62)`(`[`state_access`](#classcartesi_1_1state__access)` & a,uint64_t mcycle_end)` 

#### `public template `[`interpreter_status`](#interpret_8h_1a1f82faa5b381ff7131252c5727171661)` `[`interpret`](#interpret_8cpp_1a3b963be8fff538222ecf55892c8c1a6c)`(`[`logged_state_access`](#classcartesi_1_1logged__state__access)` & a,uint64_t mcycle_end)` 

#### `public std::string `[`get_name`](#machine_8cpp_1a56f7637149a7015acb94caa9bbfa2489)`(void)` 

Returns a string describing the implementation.

#### `public template<>`  <br/>`inline static `[`pma_entry`](#classcartesi_1_1pma__entry)` & `[`naked_find_pma_entry`](#machine_8cpp_1abfe71e81237d2b0e74ff6d9d1c54a701)`(`[`machine_state`](#structcartesi_1_1machine__state)` & s,uint64_t paddr)` 

Obtain PMA entry overlapping with target physical address.

#### Parameters
* `s` Pointer to machine state. 

* `paddr` Target physical address. 

#### Returns
Corresponding entry if found, or a sentinel entry for an empty range. 

#### Parameters
* `T` Type used for memory access

#### `public template<>`  <br/>`inline static const `[`pma_entry`](#classcartesi_1_1pma__entry)` & `[`naked_find_pma_entry`](#machine_8cpp_1a48d72531ab018a1fee5101dbdbf4b3b7)`(const `[`machine_state`](#structcartesi_1_1machine__state)` & s,uint64_t paddr)` 

#### `public static bool `[`memory_peek`](#machine_8cpp_1ad9634db0b53491b99f02b7b2630a1437)`(const `[`pma_entry`](#classcartesi_1_1pma__entry)` & pma,uint64_t page_address,const unsigned char ** page_data,unsigned char * scratch)` 

Memory range peek callback. See ::pma_peek.

#### `public static double `[`now`](#machine_8cpp_1ab3cf0bb4b769293af3b5f3e468704a7a)`(void)` 

#### `public static void `[`roll_hash_up_tree`](#machine_8cpp_1a6323ffbd6304924931439a712e8ca268)`(`[`merkle_tree::hasher_type`](#classcartesi_1_1merkle__tree_1ab88eba46f371bddad3dee241d42a1661)` & hasher,const `[`merkle_tree::proof_type`](#structcartesi_1_1merkle__tree_1_1proof__type)` & proof,`[`merkle_tree::hash_type`](#classcartesi_1_1merkle__tree_1aecbed850344d160b6c9fc4bac0202a31)` & rolling_hash)` 

#### `public static void `[`get_word_hash`](#machine_8cpp_1a221367aa0c099b5e170707afbdff1a11)`(`[`merkle_tree::hasher_type`](#classcartesi_1_1merkle__tree_1ab88eba46f371bddad3dee241d42a1661)` & hasher,const uint64_t & word,`[`merkle_tree::hash_type`](#classcartesi_1_1merkle__tree_1aecbed850344d160b6c9fc4bac0202a31)` & word_hash)` 

#### `public std::ostream & `[`operator<<`](#merkle-tree_8cpp_1a13802c1357244304ac5f69a39715db35)`(std::ostream & out,const `[`merkle_tree::hash_type`](#classcartesi_1_1merkle__tree_1aecbed850344d160b6c9fc4bac0202a31)` & hash)` 

#### `public template<>`  <br/>`constexpr auto `[`to_underlying`](#meta_8h_1a24e8be7260a0ac0a293fbd843947e099)`(E e) noexcept` 

Converts a strongly typed constant to its underlying integer type.

#### `public bool `[`pma_write_error`](#pma_8cpp_1ab71911c598c43a97fb7932a4a2537e41)`(const `[`pma_entry`](#classcartesi_1_1pma__entry)` &,`[`i_virtual_state_access`](#classcartesi_1_1i__virtual__state__access)` *,uint64_t,uint64_t,int)` 

Default device write callback issues error on write.

Default write callback issues error on write.

#### `public bool `[`pma_read_error`](#pma_8cpp_1a487865e134840d5c18231bec39f5043b)`(const `[`pma_entry`](#classcartesi_1_1pma__entry)` &,`[`i_virtual_state_access`](#classcartesi_1_1i__virtual__state__access)` *,uint64_t,uint64_t *,int)` 

Default device read callback issues error on reads.

Default read callback issues error on reads.

#### `public bool `[`pma_peek_error`](#pma_8cpp_1a6abaeb08a0456339e98d690b9b01ffe6)`(const `[`pma_entry`](#classcartesi_1_1pma__entry)` &,uint64_t,const unsigned char **,unsigned char *)` 

Default device peek callback issues error on peeks.

Default peek callback issues error on peeks.

#### `public void `[`rom_init`](#rom_8cpp_1a79137bbada10d0f3efdf52e2500fd820)`(const `[`machine_config`](#structcartesi_1_1machine__config)` & c,unsigned char * rom_start,uint64_t length)` 

Initializes PMA extension metadata on ROM.

#### Parameters
* `c` Machine configuration. 

* `rom_start` Pointer to start of ROM contiguous range in host memory 

* `length` Maximum amount of ROM to use from start.

#### `public inline static uint64_t `[`rtc_cycle_to_time`](#rtc_8h_1ae27ec63cef95b87dc06ed18df16ac7d5)`(uint64_t cycle)` 

Converts from cycle count to time count.

#### Parameters
* `cycle` Cycle count 

#### Returns
Time count

#### `public inline static uint64_t `[`rtc_time_to_cycle`](#rtc_8h_1a5b36caac3460a527e0f7dd1740cd01df)`(uint64_t time)` 

Converts from time count to cycle count.

#### Parameters
* `time` Time count 

#### Returns
Cycle count

#### `public uint64_t `[`shadow_get_csr_rel_addr`](#shadow_8cpp_1af168a8a5b1f363427d60f57ed18f5ab3)`(`[`shadow_csr`](#shadow_8h_1aa4c10e5d31db8a49eb0b1845da3750e6)` reg)` 

Obtains the relative address of a CSR in shadow memory.

#### Parameters
* `reg` CSR name. 

#### Returns
The address.

#### `public uint64_t `[`shadow_get_register_rel_addr`](#shadow_8cpp_1ad1227f3da3c676d409f95326735fbceb)`(int reg)` 

Obtains the relative address of a general purpose register in shadow memory.

#### Parameters
* `reg` Register index in 0...31, for x0...x31, respectively. 

#### Returns
The address.

#### `public uint64_t `[`shadow_get_pma_rel_addr`](#shadow_8cpp_1a39f823e0cd214e282adaf9b9faf1394e)`(int p)` 

Obtains the relative address of a PMA entry in shadow memory.

#### Parameters
* `p` Index of desired shadow PMA entry, in 0..31. 

#### Returns
The address.

#### `public static bool `[`shadow_peek`](#shadow_8cpp_1ada74b99b5a598b7d995a2add1d6a2d33)`(const `[`pma_entry`](#classcartesi_1_1pma__entry)` & pma,uint64_t page_offset,const unsigned char ** page_data,unsigned char * shadow)` 

Shadow device peek callback. See ::pma_peek.

#### `public static bool `[`shadow_read`](#shadow_8cpp_1a6893b0d5fcb534bbc2f2e778a46a8a9d)`(const `[`pma_entry`](#classcartesi_1_1pma__entry)` & pma,`[`i_virtual_state_access`](#classcartesi_1_1i__virtual__state__access)` * a,uint64_t offset,uint64_t * pval,int size_log2)` 

Shadow device read callback. See ::pma_read.

#### `public void `[`shadow_register_mmio`](#shadow_8cpp_1a9df22eafca23b007a586d821a5bf8433)`(`[`machine`](#classcartesi_1_1machine)` & m,uint64_t start,uint64_t length)` 

Registers a shadow device with the machine.

#### Parameters
* `m` Associated machine. 

* `start` Start address for memory range. 

* `length` Length of memory range.

#### `public template<>`  <br/>`inline static void `[`aliased_aligned_write`](#strict-aliasing_8h_1ace4c7a80f4d0947d1f41a062e8edcb7f)`(void * p,T v)` 

Writes a value to memory.

#### Parameters
* `T` Type of value. 

#### Parameters
* `p` Where to write. Must be aligned to sizeof(T). 

* `v` Value to write.

#### `public template<>`  <br/>`inline static T `[`aliased_aligned_read`](#strict-aliasing_8h_1a05769c3ea8d5475b7ce7003cebddcdde)`(const void * p)` 

Reads a value from memory.

#### Parameters
* `T` Type of value. 

#### Parameters
* `p` Where to find value. Must be aligned to sizeof(T). 

#### Returns
Value.

#### `public template<>`  <br/>`inline static unique_calloc_ptr< T > `[`unique_calloc`](#unique-c-ptr_8h_1a394fdb09ada49e0e05a9683b5a95c3d3)`(size_t nmemb,size_t size)` 

#### `public template<>`  <br/>`inline static unique_calloc_ptr< T > `[`unique_calloc`](#unique-c-ptr_8h_1a979cd3b81665d36e0257da125b8b01b0)`(void)` 

#### `public template<>`  <br/>`inline static unique_calloc_ptr< T > `[`unique_calloc`](#unique-c-ptr_8h_1acae913b1b88e4f3a341a8250d03b0928)`(size_t nmemb,size_t size,const std::nothrow_t & tag)` 

#### `public template<>`  <br/>`inline static unique_calloc_ptr< T > `[`unique_calloc`](#unique-c-ptr_8h_1a9a77a1ecb7e2c6ece82b6902803855b7)`(const std::nothrow_t & tag)` 

#### `public inline static unique_file_ptr `[`unique_fopen`](#unique-c-ptr_8h_1a2b55d612acfecc627e06d2712afd7342)`(const char * pathname,const char * mode)` 

#### `public inline static unique_file_ptr `[`unique_fopen`](#unique-c-ptr_8h_1a11ade5d99496efb99489b5b200eaf232)`(const char * pathname,const char * mode,const std::nothrow_t & tag)` 

# class `cartesi::access_log` 

Log of state accesses.

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline void `[`clear`](#classcartesi_1_1access__log_1a12be5bd8ff2b52be049947a836514352)`(void)` | Clear the log.
`public inline void `[`push_bracket`](#classcartesi_1_1access__log_1ae1217d05b9321ecf6bc7e362ad3f5595)`(`[`bracket_type`](#bracket-note_8h_1aea6e9de496553fd9ecfd2321240e1f52)` type,const char * text)` | Adds a bracket annotation to the log.
`public inline void `[`push_access`](#classcartesi_1_1access__log_1ae3a2cc4fb97545bf44bb9b2b00806db6)`(const `[`word_access`](#structcartesi_1_1word__access)` & access,const char * text)` | Adds a new access to the log.
`public inline const std::vector< std::string > & `[`get_notes`](#classcartesi_1_1access__log_1a997183fb77682861159e1b42b75b96ed)`(void) const` | Returns the array of notes.
`public inline const std::vector< `[`word_access`](#structcartesi_1_1word__access)` > & `[`get_accesses`](#classcartesi_1_1access__log_1a826414c809fe6f3b593b7ca1253d4a65)`(void) const` | Returns the array of accesses.
`public inline const std::vector< `[`bracket_note`](#structcartesi_1_1bracket__note)` > & `[`get_brackets`](#classcartesi_1_1access__log_1a4527524c74f4a31d270e64510008c871)`(void) const` | Returns the array of brackets.

## Members

#### `public inline void `[`clear`](#classcartesi_1_1access__log_1a12be5bd8ff2b52be049947a836514352)`(void)` 

Clear the log.

#### `public inline void `[`push_bracket`](#classcartesi_1_1access__log_1ae1217d05b9321ecf6bc7e362ad3f5595)`(`[`bracket_type`](#bracket-note_8h_1aea6e9de496553fd9ecfd2321240e1f52)` type,const char * text)` 

Adds a bracket annotation to the log.

#### Parameters
* `type` Bracket type 

* `text` Annotation contents

#### `public inline void `[`push_access`](#classcartesi_1_1access__log_1ae3a2cc4fb97545bf44bb9b2b00806db6)`(const `[`word_access`](#structcartesi_1_1word__access)` & access,const char * text)` 

Adds a new access to the log.

#### Parameters
* `access` Word access 

* `text` Annotation contents

#### `public inline const std::vector< std::string > & `[`get_notes`](#classcartesi_1_1access__log_1a997183fb77682861159e1b42b75b96ed)`(void) const` 

Returns the array of notes.

#### Returns
Constant reference to array

#### `public inline const std::vector< `[`word_access`](#structcartesi_1_1word__access)` > & `[`get_accesses`](#classcartesi_1_1access__log_1a826414c809fe6f3b593b7ca1253d4a65)`(void) const` 

Returns the array of accesses.

#### Returns
Constant reference to array

#### `public inline const std::vector< `[`bracket_note`](#structcartesi_1_1bracket__note)` > & `[`get_brackets`](#classcartesi_1_1access__log_1a4527524c74f4a31d270e64510008c871)`(void) const` 

Returns the array of brackets.

#### Returns
Constant reference to array

# class `cartesi::cryptopp_keccak_256_hasher` 

```
class cartesi::cryptopp_keccak_256_hasher
  : public cartesi::i_hasher< cryptopp_keccak_256_hasher, CryptoPP::Keccak_256::DIGESTSIZE >
```  

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public  `[`cryptopp_keccak_256_hasher`](#classcartesi_1_1cryptopp__keccak__256__hasher_1ac69d9ca6de311d775a8ef1d29cca2533)`(void) = default` | Default constructor.

## Members

#### `public  `[`cryptopp_keccak_256_hasher`](#classcartesi_1_1cryptopp__keccak__256__hasher_1ac69d9ca6de311d775a8ef1d29cca2533)`(void) = default` 

Default constructor.

# class `cartesi::htif` 

Host-Target interface implementation.

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public  `[`htif`](#classcartesi_1_1htif_1a6b06edb34d17ecd2086506eb21fddf24)`(void) = delete` | No default constructor.
`public  `[`htif`](#classcartesi_1_1htif_1aac70fc14cdff80efc0bb68664b35dd7a)`(const `[`htif`](#classcartesi_1_1htif)` &) = delete` | No copy constructor.
`public  `[`htif`](#classcartesi_1_1htif_1a15f49061604996a54d5bcb75d99d93fb)`(`[`htif`](#classcartesi_1_1htif)` &&) = delete` | No move constructor.
`public `[`htif`](#classcartesi_1_1htif)` & `[`operator=`](#classcartesi_1_1htif_1a986da585091e4bea3f23deb8ce84c1f4)`(const `[`htif`](#classcartesi_1_1htif)` &) = delete` | No copy assignment.
`public `[`htif`](#classcartesi_1_1htif)` & `[`operator=`](#classcartesi_1_1htif_1aee5da3d7efe4f1cc565c9da282230aac)`(`[`htif`](#classcartesi_1_1htif)` &&) = delete` | No move assignment.
`public  `[`htif`](#classcartesi_1_1htif_1a9ce44013b72933032da4a02e2c2c6f4f)`(`[`machine`](#classcartesi_1_1machine)` & m,bool interactive)` | Constructor.
`public void `[`register_mmio`](#classcartesi_1_1htif_1aadc0673cd829c5ff857192cfe058f020)`(uint64_t start,uint64_t length)` | Registers device with the machine.
`public void `[`interact`](#classcartesi_1_1htif_1a1b386ce30007582b91c5f6f6b3ee5635)`(void)` | Interact with the hosts's terminal.
`public  `[`~htif`](#classcartesi_1_1htif_1ae7295516db717aec14e8d47549500bc2)`()` | Destructor.
`public void `[`reset_fromhost_pending`](#classcartesi_1_1htif_1a6a85cebaf1dbaf9bd9e11614cc43ebd3)`(void)` | Resets the fromhost pending flag.
`public bool `[`fromhost_pending`](#classcartesi_1_1htif_1abe09e4f2e744d3d2e7b0e3bf3347abc8)`(void) const` | Checks the fromhost pending flag.
`public bool `[`is_interactive`](#classcartesi_1_1htif_1ac8ecec42747386581dea952931e5576b)`(void) const` | Checks the if HTIF is interactive.
`public const `[`machine`](#classcartesi_1_1machine)` & `[`get_machine`](#classcartesi_1_1htif_1ab207deebbdeebbf063f46cee806819f6)`(void) const` | Returns the associated machine.
`public void `[`poll_console`](#classcartesi_1_1htif_1a74ac8ea27ef87fa259cda689a0068d71)`(void)` | Checks if there is input available from console.
`enum `[`csr`](#classcartesi_1_1htif_1ae44c0f2d28adf484cc4fb508d61459c2) | Mapping between CSRs and their relative addresses in HTIF memory.

## Members

#### `public  `[`htif`](#classcartesi_1_1htif_1a6b06edb34d17ecd2086506eb21fddf24)`(void) = delete` 

No default constructor.

#### `public  `[`htif`](#classcartesi_1_1htif_1aac70fc14cdff80efc0bb68664b35dd7a)`(const `[`htif`](#classcartesi_1_1htif)` &) = delete` 

No copy constructor.

#### `public  `[`htif`](#classcartesi_1_1htif_1a15f49061604996a54d5bcb75d99d93fb)`(`[`htif`](#classcartesi_1_1htif)` &&) = delete` 

No move constructor.

#### `public `[`htif`](#classcartesi_1_1htif)` & `[`operator=`](#classcartesi_1_1htif_1a986da585091e4bea3f23deb8ce84c1f4)`(const `[`htif`](#classcartesi_1_1htif)` &) = delete` 

No copy assignment.

#### `public `[`htif`](#classcartesi_1_1htif)` & `[`operator=`](#classcartesi_1_1htif_1aee5da3d7efe4f1cc565c9da282230aac)`(`[`htif`](#classcartesi_1_1htif)` &&) = delete` 

No move assignment.

#### `public  `[`htif`](#classcartesi_1_1htif_1a9ce44013b72933032da4a02e2c2c6f4f)`(`[`machine`](#classcartesi_1_1machine)` & m,bool interactive)` 

Constructor.

#### Parameters
* `s` Associated machine. 

* `interactive` This is an interactive session with terminal support.

The constructor for the associated machine is typically done yet when the constructor for the HTIF device is invoked.

#### `public void `[`register_mmio`](#classcartesi_1_1htif_1aadc0673cd829c5ff857192cfe058f020)`(uint64_t start,uint64_t length)` 

Registers device with the machine.

#### Parameters
* `start` Start address for memory range. 

* `length` Length of memory range.

#### `public void `[`interact`](#classcartesi_1_1htif_1a1b386ce30007582b91c5f6f6b3ee5635)`(void)` 

Interact with the hosts's terminal.

#### Parameters
* `htif` Pointer to HTIF state

#### `public  `[`~htif`](#classcartesi_1_1htif_1ae7295516db717aec14e8d47549500bc2)`()` 

Destructor.

#### `public void `[`reset_fromhost_pending`](#classcartesi_1_1htif_1a6a85cebaf1dbaf9bd9e11614cc43ebd3)`(void)` 

Resets the fromhost pending flag.

#### `public bool `[`fromhost_pending`](#classcartesi_1_1htif_1abe09e4f2e744d3d2e7b0e3bf3347abc8)`(void) const` 

Checks the fromhost pending flag.

#### `public bool `[`is_interactive`](#classcartesi_1_1htif_1ac8ecec42747386581dea952931e5576b)`(void) const` 

Checks the if HTIF is interactive.

#### `public const `[`machine`](#classcartesi_1_1machine)` & `[`get_machine`](#classcartesi_1_1htif_1ab207deebbdeebbf063f46cee806819f6)`(void) const` 

Returns the associated machine.

#### `public void `[`poll_console`](#classcartesi_1_1htif_1a74ac8ea27ef87fa259cda689a0068d71)`(void)` 

Checks if there is input available from console.

#### `enum `[`csr`](#classcartesi_1_1htif_1ae44c0f2d28adf484cc4fb508d61459c2) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
tohost            | 
fromhost            | 

Mapping between CSRs and their relative addresses in HTIF memory.

# class `cartesi::i_hasher` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline void `[`begin`](#classcartesi_1_1i__hasher_1a7d0721a626052580c51919a505394bef)`(void)` | 
`public inline void `[`add_data`](#classcartesi_1_1i__hasher_1a4b2adb3666700236a326bda780fe50b2)`(const unsigned char * data,size_t length)` | 
`public inline void `[`end`](#classcartesi_1_1i__hasher_1a1dfbb4cba5d1346174a4b30ba761fb63)`(hash_type & hash)` | 
`typedef `[`hash_type`](#classcartesi_1_1i__hasher_1acc333035fc12ee6324900aa840c7e48d) | 

## Members

#### `public inline void `[`begin`](#classcartesi_1_1i__hasher_1a7d0721a626052580c51919a505394bef)`(void)` 

#### `public inline void `[`add_data`](#classcartesi_1_1i__hasher_1a4b2adb3666700236a326bda780fe50b2)`(const unsigned char * data,size_t length)` 

#### `public inline void `[`end`](#classcartesi_1_1i__hasher_1a1dfbb4cba5d1346174a4b30ba761fb63)`(hash_type & hash)` 

#### `typedef `[`hash_type`](#classcartesi_1_1i__hasher_1acc333035fc12ee6324900aa840c7e48d) 

# class `cartesi::i_state_access` 

Interface for machine state access.

#### Parameters
* `DERIVED` Derived class implementing the interface. (An example of CRTP.)

The final "step" function must log all read and write accesses to the state. The "run" function does not need a log, and must be as fast as possible. Both functions share the exact same implementation of what it means to advance the machine state by one cycle. In this common implementation, all state accesses go through a class that implements the [i_state_access](#classcartesi_1_1i__state__access) interface. When looging is needed, a [logged_state_access](#classcartesi_1_1logged__state__access) class is used. When no logging is needed, a [state_access](#classcartesi_1_1state__access) class is used.

In a typical design, [i_state_access](#classcartesi_1_1i__state__access) would be pure virtual. For speed, we avoid virtual methods and instead use templates. State access classes inherit from [i_state_access](#classcartesi_1_1i__state__access), and declare it as friend. They then implement all private do_* methods. Clients call the methods without the do_ prefix, which are inherited from the [i_state_access](#classcartesi_1_1i__state__access) interface and simply forward the call to the methods with do_ prefix implemented by the derived class. This is a form of "static polymorphism" that incurs no runtime cost

Methods are provided to read and write each state component.

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline `[`machine`](#classcartesi_1_1machine)` & `[`get_naked_machine`](#classcartesi_1_1i__state__access_1aefe98ae966f648b3da6f22741854eeb1)`(void)` | Returns associated machine.
`public inline const `[`machine`](#classcartesi_1_1machine)` & `[`get_naked_machine`](#classcartesi_1_1i__state__access_1a3cdd665f2206f36fc30390a3926b5bf3)`(void) const` | Returns associated machine for read-only access.
`public inline `[`machine_state`](#structcartesi_1_1machine__state)` & `[`get_naked_state`](#classcartesi_1_1i__state__access_1ac0a46cf13094556375574c63020f5e58)`(void)` | Returns machine state for direct access.
`public inline const `[`machine_state`](#structcartesi_1_1machine__state)` & `[`get_naked_state`](#classcartesi_1_1i__state__access_1a7a4b68d0f03222d35e0168bca6507291)`(void) const` | Returns machine state for direct read-only access.
`public inline void `[`push_bracket`](#classcartesi_1_1i__state__access_1a370aa6c3433a99343022a7936fc37d5c)`(`[`bracket_type`](#bracket-note_8h_1aea6e9de496553fd9ecfd2321240e1f52)` type,const char * text)` | Adds an annotation bracket to the log.
`public inline auto `[`make_scoped_note`](#classcartesi_1_1i__state__access_1a358d39a666bfd4bf075c74704dea6248)`(const char * text)` | Adds annotations to the state, bracketing a scope.
`public inline uint64_t `[`read_x`](#classcartesi_1_1i__state__access_1a620f4e800e1915443d514c604fa6ed33)`(int reg)` | Reads from general-purpose register.
`public inline void `[`write_x`](#classcartesi_1_1i__state__access_1ae4649a55c7632c84351afc29d46cb59d)`(int reg,uint64_t val)` | Writes register to general-purpose register.
`public inline uint64_t `[`read_pc`](#classcartesi_1_1i__state__access_1ad9c33ede59db7b367b34bd087272f416)`(void)` | Reads the program counter.
`public inline void `[`write_pc`](#classcartesi_1_1i__state__access_1affd237223f5334b5982192b0b8f15cec)`(uint64_t val)` | Writes the program counter.
`public inline uint64_t `[`read_minstret`](#classcartesi_1_1i__state__access_1afd1b479bb081b5bc0f3c491e21e68ba3)`(void)` | Reads CSR minstret.
`public inline void `[`write_minstret`](#classcartesi_1_1i__state__access_1ac46298d7ea9b250f9f6e5fc67f925fbd)`(uint64_t val)` | Writes CSR minstret.
`public inline uint64_t `[`read_mvendorid`](#classcartesi_1_1i__state__access_1a8994889cf9205d2986b4a9b1634f4956)`(void)` | Reads CSR mvendorid.
`public inline void `[`write_mvendorid`](#classcartesi_1_1i__state__access_1a9d1935afb324f21219cdfa90c170cdbe)`(uint64_t val)` | Writes CSR mvendorid.
`public inline uint64_t `[`read_marchid`](#classcartesi_1_1i__state__access_1a51c0415d0fe835342296e6d65d8dad06)`(void)` | Reads CSR marchid.
`public inline void `[`write_marchid`](#classcartesi_1_1i__state__access_1a00753a881f30295673bc39ed5a8ecbd6)`(uint64_t val)` | Writes CSR marchid.
`public inline uint64_t `[`read_mimpid`](#classcartesi_1_1i__state__access_1a00dee8c0c1a2dcba2185cf701cac5a2a)`(void)` | Reads CSR mimpid.
`public inline void `[`write_mimpid`](#classcartesi_1_1i__state__access_1a30b4e5eb2450609364cc1de5f2f04c90)`(uint64_t val)` | Writes CSR mimpid.
`public inline uint64_t `[`read_mcycle`](#classcartesi_1_1i__state__access_1a0f56ac1a3519c30c13dff60910ab468c)`(void)` | Reads CSR mcycle.
`public inline void `[`write_mcycle`](#classcartesi_1_1i__state__access_1a49888e524d7745c7c94cbfb143ebc087)`(uint64_t val)` | Writes CSR mcycle.
`public inline uint64_t `[`read_mstatus`](#classcartesi_1_1i__state__access_1a37fd1ac26870ffe4ba5538f24522b006)`(void)` | Reads CSR mstatus.
`public inline void `[`write_mstatus`](#classcartesi_1_1i__state__access_1aac6e989e19aa0d6da2dfa5ae0078f510)`(uint64_t val)` | Writes CSR mstatus.
`public inline uint64_t `[`read_mtvec`](#classcartesi_1_1i__state__access_1af80f64a9ab5358ae5966b3c454a457bd)`(void)` | Reads CSR mtvec.
`public inline void `[`write_mtvec`](#classcartesi_1_1i__state__access_1af05e296b4d11f42ab962018f92790bc8)`(uint64_t val)` | Writes CSR mtvec.
`public inline uint64_t `[`read_mscratch`](#classcartesi_1_1i__state__access_1a85fb0977ac6ff4d82a2fbf15869bd2ed)`(void)` | Reads CSR mscratch.
`public inline void `[`write_mscratch`](#classcartesi_1_1i__state__access_1ae151e15a436e4c922689e81e5100fe56)`(uint64_t val)` | Writes CSR mscratch.
`public inline uint64_t `[`read_mepc`](#classcartesi_1_1i__state__access_1a96d7238f6c390b3d31ceff78351a5007)`(void)` | Reads CSR mepc.
`public inline void `[`write_mepc`](#classcartesi_1_1i__state__access_1ab17d48df49d2654386fe70240732a25a)`(uint64_t val)` | Writes CSR mepc.
`public inline uint64_t `[`read_mcause`](#classcartesi_1_1i__state__access_1aaab6b0cacb4a845dbe9a5741d051eb88)`(void)` | Reads CSR mcause.
`public inline void `[`write_mcause`](#classcartesi_1_1i__state__access_1a73f1632dfe4da45bd93a46f375044815)`(uint64_t val)` | Writes CSR mcause.
`public inline uint64_t `[`read_mtval`](#classcartesi_1_1i__state__access_1a08e6073ce6e0a5128e5e47eb9d599405)`(void)` | Reads CSR mtval.
`public inline void `[`write_mtval`](#classcartesi_1_1i__state__access_1a5cc781a61749d768a2fc788356a48e3f)`(uint64_t val)` | Writes CSR mtval.
`public inline uint64_t `[`read_misa`](#classcartesi_1_1i__state__access_1adbfe7c1a27ea6fa851e8ba6c4a184921)`(void)` | Reads CSR misa.
`public inline void `[`write_misa`](#classcartesi_1_1i__state__access_1a5b4d58e112bc0440a32dcad455af9c1f)`(uint64_t val)` | Writes CSR misa.
`public inline uint64_t `[`read_mie`](#classcartesi_1_1i__state__access_1aed06676bbeeecba17eec8deb772c3416)`(void)` | Reads CSR mie.
`public inline void `[`write_mie`](#classcartesi_1_1i__state__access_1a5dffff6b4500ec5e165b226e1a5ee471)`(uint64_t val)` | Writes CSR mie.
`public inline uint64_t `[`read_mip`](#classcartesi_1_1i__state__access_1aa0b65284a900ae6ffd227be1ecd33aeb)`(void)` | Reads CSR mip.
`public inline void `[`write_mip`](#classcartesi_1_1i__state__access_1a5360f5fade2241d0214a356fc4043d57)`(uint64_t val)` | Writes CSR mip.
`public inline uint64_t `[`read_medeleg`](#classcartesi_1_1i__state__access_1a2c464e4b5e0d08eab47f546bcfc6f45f)`(void)` | Reads CSR medeleg.
`public inline void `[`write_medeleg`](#classcartesi_1_1i__state__access_1a7b775e17d24dfd3b4c69755713660f59)`(uint64_t val)` | Writes CSR medeleg.
`public inline uint64_t `[`read_mideleg`](#classcartesi_1_1i__state__access_1a21d832d9cd5fcdf904cf20d553bee1af)`(void)` | Reads CSR mideleg.
`public inline void `[`write_mideleg`](#classcartesi_1_1i__state__access_1a2863cce7e0925011d893018d286615c5)`(uint64_t val)` | Writes CSR mideleg.
`public inline uint64_t `[`read_mcounteren`](#classcartesi_1_1i__state__access_1a7af6f557326aedd7ddb7d245f38273a5)`(void)` | Reads CSR mcounteren.
`public inline void `[`write_mcounteren`](#classcartesi_1_1i__state__access_1ae06bd467c52beb8facf1be1c822a80a1)`(uint64_t val)` | Writes CSR mcounteren.
`public inline uint64_t `[`read_stvec`](#classcartesi_1_1i__state__access_1aa22ceb20b54244f4a47926faf292f2fc)`(void)` | Reads CSR stvec.
`public inline void `[`write_stvec`](#classcartesi_1_1i__state__access_1ab913ae5ae5803e6bd5b02e0b1f53fc03)`(uint64_t val)` | Writes CSR stvec.
`public inline uint64_t `[`read_sscratch`](#classcartesi_1_1i__state__access_1a1c13d2bc5454c90cd5fb3f6642f82934)`(void)` | Reads CSR sscratch.
`public inline void `[`write_sscratch`](#classcartesi_1_1i__state__access_1aed02b3af21d5be10ce5d4546ad619e9f)`(uint64_t val)` | Writes CSR sscratch.
`public inline uint64_t `[`read_sepc`](#classcartesi_1_1i__state__access_1a5c864a4db55a20673d07192735b7e998)`(void)` | Reads CSR sepc.
`public inline void `[`write_sepc`](#classcartesi_1_1i__state__access_1a4de75bb9a76389392359ae932634840c)`(uint64_t val)` | Writes CSR sepc.
`public inline uint64_t `[`read_scause`](#classcartesi_1_1i__state__access_1a40bcfec836aff087a37d90070c12f3b0)`(void)` | Reads CSR scause.
`public inline void `[`write_scause`](#classcartesi_1_1i__state__access_1abcd100e283078a84fb310e51527dbfe9)`(uint64_t val)` | Writes CSR scause.
`public inline uint64_t `[`read_stval`](#classcartesi_1_1i__state__access_1ab275a065ea0a28280aa880dba3050c05)`(void)` | Reads CSR stval.
`public inline void `[`write_stval`](#classcartesi_1_1i__state__access_1aea2c55cae9cd25944c28fd50eb679399)`(uint64_t val)` | Writes CSR stval.
`public inline uint64_t `[`read_satp`](#classcartesi_1_1i__state__access_1a9369639712eb588f41c6e6005ec74760)`(void)` | Reads CSR satp.
`public inline void `[`write_satp`](#classcartesi_1_1i__state__access_1a5cf535113bd59dd7a66580f747a9f98c)`(uint64_t val)` | Writes CSR satp.
`public inline uint64_t `[`read_scounteren`](#classcartesi_1_1i__state__access_1a1a11aa52a9790ce86b19adb1ec94fb84)`(void)` | Reads CSR scounteren.
`public inline void `[`write_scounteren`](#classcartesi_1_1i__state__access_1a9f7f123d8387b0c9feddca808d79b6bf)`(uint64_t val)` | Writes CSR scounteren.
`public inline uint64_t `[`read_ilrsc`](#classcartesi_1_1i__state__access_1ad36a43a5658ecf0b823e4b20b703821e)`(void)` | Reads CSR ilrsc.
`public inline void `[`write_ilrsc`](#classcartesi_1_1i__state__access_1a1978f1f5e96a2cbd6e62e0b12916c31b)`(uint64_t val)` | Writes CSR ilrsc.
`public inline void `[`set_iflags_H`](#classcartesi_1_1i__state__access_1a30184ea79af004e0023ee1dbfabb8a28)`(void)` | Sets the iflags_H flag.
`public inline bool `[`read_iflags_H`](#classcartesi_1_1i__state__access_1af12d73d3c17a274d0b732f96b87411e7)`(void)` | Reads the iflags_H flag.
`public inline void `[`set_iflags_I`](#classcartesi_1_1i__state__access_1a3847e6c5ae6d5c17dac2011138acde03)`(void)` | Sets the iflags_I flag.
`public inline void `[`reset_iflags_I`](#classcartesi_1_1i__state__access_1a86e90cac8294cd5a2f0c8a09eeb7d96b)`(void)` | Resets the iflags_I flag.
`public inline bool `[`read_iflags_I`](#classcartesi_1_1i__state__access_1afba6e26ae2cf6a2bc75b0303cd35b752)`(void)` | Reads the iflags_I flag.
`public inline uint8_t `[`read_iflags_PRV`](#classcartesi_1_1i__state__access_1ab822566cda9b4f8475de3d8e69fbe36c)`(void)` | Reads the current privilege mode from iflags_PRV.
`public inline void `[`write_iflags_PRV`](#classcartesi_1_1i__state__access_1a93e1ad2f54d6a4ba6cad685da277821c)`(uint8_t val)` | Changes the privilege mode in iflags_PRV.
`public inline uint64_t `[`read_clint_mtimecmp`](#classcartesi_1_1i__state__access_1a2fa72a700ba28bb2a52afa7ca21c21cb)`(void)` | Reads CLINT's mtimecmp.
`public inline void `[`write_clint_mtimecmp`](#classcartesi_1_1i__state__access_1aeb70d28e4914224649b700ee29aea80e)`(uint64_t val)` | Writes CLINT's mtimecmp.
`public inline uint64_t `[`read_htif_fromhost`](#classcartesi_1_1i__state__access_1aadfe08f16dd428d95fca71b1f7a8241f)`(void)` | Reads HTIF's fromhost.
`public inline void `[`write_htif_fromhost`](#classcartesi_1_1i__state__access_1aacf1b183fa639d2ad9d864a5c26fd86c)`(uint64_t val)` | Writes HTIF's fromhost.
`public inline uint64_t `[`read_htif_tohost`](#classcartesi_1_1i__state__access_1ae7b5aee57ad58858a80ad7f93d667a1e)`(void)` | Reads HTIF's tohost.
`public inline void `[`write_htif_tohost`](#classcartesi_1_1i__state__access_1a6c00e4e8253483bbc1ecc1fc8a65bdb8)`(uint64_t val)` | Writes HTIF's tohost.
`public inline void `[`read_pma`](#classcartesi_1_1i__state__access_1aa57a080fa2cc7eda22cb6f103db9a974)`(const `[`pma_entry`](#classcartesi_1_1pma__entry)` & pma,int i)` | Reads PMA at a given index.
`public inline uint64_t `[`read_pma_istart`](#classcartesi_1_1i__state__access_1a508985959fa58b8d76b3f7dc8d183c73)`(int p)` | Reads the istart field of a PMA entry.
`public inline uint64_t `[`read_pma_ilength`](#classcartesi_1_1i__state__access_1a9b9d33952191a2a643eaddbaebac9ae7)`(int p)` | Reads the ilength field of a PMA entry.
`public template<>`  <br/>`inline void `[`read_memory`](#classcartesi_1_1i__state__access_1a5a088611ddf1588e3eeef575ab260672)`(uint64_t paddr,const unsigned char * hpage,uint64_t hoffset,T * pval)` | Read from memory.
`public template<>`  <br/>`inline void `[`write_memory`](#classcartesi_1_1i__state__access_1a3d8ff3cb8d0a9dc57bf270d9c8cb5e25)`(uint64_t paddr,unsigned char * hpage,uint64_t hoffset,T val)` | Write to memory.

## Members

#### `public inline `[`machine`](#classcartesi_1_1machine)` & `[`get_naked_machine`](#classcartesi_1_1i__state__access_1aefe98ae966f648b3da6f22741854eeb1)`(void)` 

Returns associated machine.

#### `public inline const `[`machine`](#classcartesi_1_1machine)` & `[`get_naked_machine`](#classcartesi_1_1i__state__access_1a3cdd665f2206f36fc30390a3926b5bf3)`(void) const` 

Returns associated machine for read-only access.

#### `public inline `[`machine_state`](#structcartesi_1_1machine__state)` & `[`get_naked_state`](#classcartesi_1_1i__state__access_1ac0a46cf13094556375574c63020f5e58)`(void)` 

Returns machine state for direct access.

#### `public inline const `[`machine_state`](#structcartesi_1_1machine__state)` & `[`get_naked_state`](#classcartesi_1_1i__state__access_1a7a4b68d0f03222d35e0168bca6507291)`(void) const` 

Returns machine state for direct read-only access.

#### `public inline void `[`push_bracket`](#classcartesi_1_1i__state__access_1a370aa6c3433a99343022a7936fc37d5c)`(`[`bracket_type`](#bracket-note_8h_1aea6e9de496553fd9ecfd2321240e1f52)` type,const char * text)` 

Adds an annotation bracket to the log.

#### Parameters
* `type` Type of bracket 

* `text` String with the text for the annotation

#### `public inline auto `[`make_scoped_note`](#classcartesi_1_1i__state__access_1a358d39a666bfd4bf075c74704dea6248)`(const char * text)` 

Adds annotations to the state, bracketing a scope.

#### Parameters
* `text` String with the text for the annotation 

#### Returns
An object that, when constructed and destroyed issues an annonation.

#### `public inline uint64_t `[`read_x`](#classcartesi_1_1i__state__access_1a620f4e800e1915443d514c604fa6ed33)`(int reg)` 

Reads from general-purpose register.

#### Parameters
* `reg` Register index. 

#### Returns
Register value.

#### `public inline void `[`write_x`](#classcartesi_1_1i__state__access_1ae4649a55c7632c84351afc29d46cb59d)`(int reg,uint64_t val)` 

Writes register to general-purpose register.

#### Parameters
* `reg` Register index. 

* `val` New register value.

Writes to register zero *break* the machine. There is an assertion to catch this, but NDEBUG will let the value pass through.

#### `public inline uint64_t `[`read_pc`](#classcartesi_1_1i__state__access_1ad9c33ede59db7b367b34bd087272f416)`(void)` 

Reads the program counter.

#### Returns
Register value.

#### `public inline void `[`write_pc`](#classcartesi_1_1i__state__access_1affd237223f5334b5982192b0b8f15cec)`(uint64_t val)` 

Writes the program counter.

#### Parameters
* `val` New register value.

#### `public inline uint64_t `[`read_minstret`](#classcartesi_1_1i__state__access_1afd1b479bb081b5bc0f3c491e21e68ba3)`(void)` 

Reads CSR minstret.

#### Returns
Register value.

#### `public inline void `[`write_minstret`](#classcartesi_1_1i__state__access_1ac46298d7ea9b250f9f6e5fc67f925fbd)`(uint64_t val)` 

Writes CSR minstret.

#### Parameters
* `val` New register value.

#### `public inline uint64_t `[`read_mvendorid`](#classcartesi_1_1i__state__access_1a8994889cf9205d2986b4a9b1634f4956)`(void)` 

Reads CSR mvendorid.

#### Returns
Register value.

#### `public inline void `[`write_mvendorid`](#classcartesi_1_1i__state__access_1a9d1935afb324f21219cdfa90c170cdbe)`(uint64_t val)` 

Writes CSR mvendorid.

#### Parameters
* `val` New register value.

#### `public inline uint64_t `[`read_marchid`](#classcartesi_1_1i__state__access_1a51c0415d0fe835342296e6d65d8dad06)`(void)` 

Reads CSR marchid.

#### Returns
Register value.

#### `public inline void `[`write_marchid`](#classcartesi_1_1i__state__access_1a00753a881f30295673bc39ed5a8ecbd6)`(uint64_t val)` 

Writes CSR marchid.

#### Parameters
* `val` New register value.

#### `public inline uint64_t `[`read_mimpid`](#classcartesi_1_1i__state__access_1a00dee8c0c1a2dcba2185cf701cac5a2a)`(void)` 

Reads CSR mimpid.

#### Returns
Register value.

#### `public inline void `[`write_mimpid`](#classcartesi_1_1i__state__access_1a30b4e5eb2450609364cc1de5f2f04c90)`(uint64_t val)` 

Writes CSR mimpid.

#### Parameters
* `val` New register value.

#### `public inline uint64_t `[`read_mcycle`](#classcartesi_1_1i__state__access_1a0f56ac1a3519c30c13dff60910ab468c)`(void)` 

Reads CSR mcycle.

#### Returns
Register value.

#### `public inline void `[`write_mcycle`](#classcartesi_1_1i__state__access_1a49888e524d7745c7c94cbfb143ebc087)`(uint64_t val)` 

Writes CSR mcycle.

#### Parameters
* `val` New register value.

#### `public inline uint64_t `[`read_mstatus`](#classcartesi_1_1i__state__access_1a37fd1ac26870ffe4ba5538f24522b006)`(void)` 

Reads CSR mstatus.

#### Returns
Register value.

#### `public inline void `[`write_mstatus`](#classcartesi_1_1i__state__access_1aac6e989e19aa0d6da2dfa5ae0078f510)`(uint64_t val)` 

Writes CSR mstatus.

#### Parameters
* `val` New register value.

#### `public inline uint64_t `[`read_mtvec`](#classcartesi_1_1i__state__access_1af80f64a9ab5358ae5966b3c454a457bd)`(void)` 

Reads CSR mtvec.

#### Returns
Register value.

#### `public inline void `[`write_mtvec`](#classcartesi_1_1i__state__access_1af05e296b4d11f42ab962018f92790bc8)`(uint64_t val)` 

Writes CSR mtvec.

#### Parameters
* `val` New register value.

#### `public inline uint64_t `[`read_mscratch`](#classcartesi_1_1i__state__access_1a85fb0977ac6ff4d82a2fbf15869bd2ed)`(void)` 

Reads CSR mscratch.

#### Returns
Register value.

#### `public inline void `[`write_mscratch`](#classcartesi_1_1i__state__access_1ae151e15a436e4c922689e81e5100fe56)`(uint64_t val)` 

Writes CSR mscratch.

#### Parameters
* `val` New register value.

#### `public inline uint64_t `[`read_mepc`](#classcartesi_1_1i__state__access_1a96d7238f6c390b3d31ceff78351a5007)`(void)` 

Reads CSR mepc.

#### Returns
Register value.

#### `public inline void `[`write_mepc`](#classcartesi_1_1i__state__access_1ab17d48df49d2654386fe70240732a25a)`(uint64_t val)` 

Writes CSR mepc.

#### Parameters
* `val` New register value.

#### `public inline uint64_t `[`read_mcause`](#classcartesi_1_1i__state__access_1aaab6b0cacb4a845dbe9a5741d051eb88)`(void)` 

Reads CSR mcause.

#### Returns
Register value.

#### `public inline void `[`write_mcause`](#classcartesi_1_1i__state__access_1a73f1632dfe4da45bd93a46f375044815)`(uint64_t val)` 

Writes CSR mcause.

#### Parameters
* `val` New register value.

#### `public inline uint64_t `[`read_mtval`](#classcartesi_1_1i__state__access_1a08e6073ce6e0a5128e5e47eb9d599405)`(void)` 

Reads CSR mtval.

#### Returns
Register value.

#### `public inline void `[`write_mtval`](#classcartesi_1_1i__state__access_1a5cc781a61749d768a2fc788356a48e3f)`(uint64_t val)` 

Writes CSR mtval.

#### Parameters
* `val` New register value.

#### `public inline uint64_t `[`read_misa`](#classcartesi_1_1i__state__access_1adbfe7c1a27ea6fa851e8ba6c4a184921)`(void)` 

Reads CSR misa.

#### Returns
Register value.

#### `public inline void `[`write_misa`](#classcartesi_1_1i__state__access_1a5b4d58e112bc0440a32dcad455af9c1f)`(uint64_t val)` 

Writes CSR misa.

#### Parameters
* `val` New register value.

#### `public inline uint64_t `[`read_mie`](#classcartesi_1_1i__state__access_1aed06676bbeeecba17eec8deb772c3416)`(void)` 

Reads CSR mie.

#### Returns
Register value.

#### `public inline void `[`write_mie`](#classcartesi_1_1i__state__access_1a5dffff6b4500ec5e165b226e1a5ee471)`(uint64_t val)` 

Writes CSR mie.

#### Parameters
* `val` New register value.

#### `public inline uint64_t `[`read_mip`](#classcartesi_1_1i__state__access_1aa0b65284a900ae6ffd227be1ecd33aeb)`(void)` 

Reads CSR mip.

#### Returns
Register value.

#### `public inline void `[`write_mip`](#classcartesi_1_1i__state__access_1a5360f5fade2241d0214a356fc4043d57)`(uint64_t val)` 

Writes CSR mip.

#### Parameters
* `val` New register value.

#### `public inline uint64_t `[`read_medeleg`](#classcartesi_1_1i__state__access_1a2c464e4b5e0d08eab47f546bcfc6f45f)`(void)` 

Reads CSR medeleg.

#### Returns
Register value.

#### `public inline void `[`write_medeleg`](#classcartesi_1_1i__state__access_1a7b775e17d24dfd3b4c69755713660f59)`(uint64_t val)` 

Writes CSR medeleg.

#### Parameters
* `val` New register value.

#### `public inline uint64_t `[`read_mideleg`](#classcartesi_1_1i__state__access_1a21d832d9cd5fcdf904cf20d553bee1af)`(void)` 

Reads CSR mideleg.

#### Returns
Register value.

#### `public inline void `[`write_mideleg`](#classcartesi_1_1i__state__access_1a2863cce7e0925011d893018d286615c5)`(uint64_t val)` 

Writes CSR mideleg.

#### Parameters
* `val` New register value.

#### `public inline uint64_t `[`read_mcounteren`](#classcartesi_1_1i__state__access_1a7af6f557326aedd7ddb7d245f38273a5)`(void)` 

Reads CSR mcounteren.

#### Returns
Register value.

#### `public inline void `[`write_mcounteren`](#classcartesi_1_1i__state__access_1ae06bd467c52beb8facf1be1c822a80a1)`(uint64_t val)` 

Writes CSR mcounteren.

#### Parameters
* `val` New register value.

#### `public inline uint64_t `[`read_stvec`](#classcartesi_1_1i__state__access_1aa22ceb20b54244f4a47926faf292f2fc)`(void)` 

Reads CSR stvec.

#### Returns
Register value.

#### `public inline void `[`write_stvec`](#classcartesi_1_1i__state__access_1ab913ae5ae5803e6bd5b02e0b1f53fc03)`(uint64_t val)` 

Writes CSR stvec.

#### Parameters
* `val` New register value.

#### `public inline uint64_t `[`read_sscratch`](#classcartesi_1_1i__state__access_1a1c13d2bc5454c90cd5fb3f6642f82934)`(void)` 

Reads CSR sscratch.

#### Returns
Register value.

#### `public inline void `[`write_sscratch`](#classcartesi_1_1i__state__access_1aed02b3af21d5be10ce5d4546ad619e9f)`(uint64_t val)` 

Writes CSR sscratch.

#### Parameters
* `val` New register value.

#### `public inline uint64_t `[`read_sepc`](#classcartesi_1_1i__state__access_1a5c864a4db55a20673d07192735b7e998)`(void)` 

Reads CSR sepc.

#### Returns
Register value.

#### `public inline void `[`write_sepc`](#classcartesi_1_1i__state__access_1a4de75bb9a76389392359ae932634840c)`(uint64_t val)` 

Writes CSR sepc.

#### Parameters
* `val` New register value.

#### `public inline uint64_t `[`read_scause`](#classcartesi_1_1i__state__access_1a40bcfec836aff087a37d90070c12f3b0)`(void)` 

Reads CSR scause.

#### Returns
Register value.

#### `public inline void `[`write_scause`](#classcartesi_1_1i__state__access_1abcd100e283078a84fb310e51527dbfe9)`(uint64_t val)` 

Writes CSR scause.

#### Parameters
* `val` New register value.

#### `public inline uint64_t `[`read_stval`](#classcartesi_1_1i__state__access_1ab275a065ea0a28280aa880dba3050c05)`(void)` 

Reads CSR stval.

#### Returns
Register value.

#### `public inline void `[`write_stval`](#classcartesi_1_1i__state__access_1aea2c55cae9cd25944c28fd50eb679399)`(uint64_t val)` 

Writes CSR stval.

#### Parameters
* `val` New register value.

#### `public inline uint64_t `[`read_satp`](#classcartesi_1_1i__state__access_1a9369639712eb588f41c6e6005ec74760)`(void)` 

Reads CSR satp.

#### Returns
Register value.

#### `public inline void `[`write_satp`](#classcartesi_1_1i__state__access_1a5cf535113bd59dd7a66580f747a9f98c)`(uint64_t val)` 

Writes CSR satp.

#### Parameters
* `val` New register value.

#### `public inline uint64_t `[`read_scounteren`](#classcartesi_1_1i__state__access_1a1a11aa52a9790ce86b19adb1ec94fb84)`(void)` 

Reads CSR scounteren.

#### Returns
Register value.

#### `public inline void `[`write_scounteren`](#classcartesi_1_1i__state__access_1a9f7f123d8387b0c9feddca808d79b6bf)`(uint64_t val)` 

Writes CSR scounteren.

#### Parameters
* `val` New register value.

#### `public inline uint64_t `[`read_ilrsc`](#classcartesi_1_1i__state__access_1ad36a43a5658ecf0b823e4b20b703821e)`(void)` 

Reads CSR ilrsc.

#### Returns
Register value.

This is Cartesi-specific.

#### `public inline void `[`write_ilrsc`](#classcartesi_1_1i__state__access_1a1978f1f5e96a2cbd6e62e0b12916c31b)`(uint64_t val)` 

Writes CSR ilrsc.

#### Parameters
* `val` New register value.

This is Cartesi-specific.

#### `public inline void `[`set_iflags_H`](#classcartesi_1_1i__state__access_1a30184ea79af004e0023ee1dbfabb8a28)`(void)` 

Sets the iflags_H flag.

This is Cartesi-specific.

#### `public inline bool `[`read_iflags_H`](#classcartesi_1_1i__state__access_1af12d73d3c17a274d0b732f96b87411e7)`(void)` 

Reads the iflags_H flag.

#### Returns
The flag value.

This is Cartesi-specific.

#### `public inline void `[`set_iflags_I`](#classcartesi_1_1i__state__access_1a3847e6c5ae6d5c17dac2011138acde03)`(void)` 

Sets the iflags_I flag.

This is Cartesi-specific.

#### `public inline void `[`reset_iflags_I`](#classcartesi_1_1i__state__access_1a86e90cac8294cd5a2f0c8a09eeb7d96b)`(void)` 

Resets the iflags_I flag.

This is Cartesi-specific.

#### `public inline bool `[`read_iflags_I`](#classcartesi_1_1i__state__access_1afba6e26ae2cf6a2bc75b0303cd35b752)`(void)` 

Reads the iflags_I flag.

#### Returns
The flag value.

This is Cartesi-specific.

#### `public inline uint8_t `[`read_iflags_PRV`](#classcartesi_1_1i__state__access_1ab822566cda9b4f8475de3d8e69fbe36c)`(void)` 

Reads the current privilege mode from iflags_PRV.

This is Cartesi-specific. 
#### Returns
Current privilege mode.

#### `public inline void `[`write_iflags_PRV`](#classcartesi_1_1i__state__access_1a93e1ad2f54d6a4ba6cad685da277821c)`(uint8_t val)` 

Changes the privilege mode in iflags_PRV.

This is Cartesi-specific.

#### `public inline uint64_t `[`read_clint_mtimecmp`](#classcartesi_1_1i__state__access_1a2fa72a700ba28bb2a52afa7ca21c21cb)`(void)` 

Reads CLINT's mtimecmp.

#### Returns
Register value.

#### `public inline void `[`write_clint_mtimecmp`](#classcartesi_1_1i__state__access_1aeb70d28e4914224649b700ee29aea80e)`(uint64_t val)` 

Writes CLINT's mtimecmp.

#### Parameters
* `val` New register value.

#### `public inline uint64_t `[`read_htif_fromhost`](#classcartesi_1_1i__state__access_1aadfe08f16dd428d95fca71b1f7a8241f)`(void)` 

Reads HTIF's fromhost.

#### Returns
Register value.

#### `public inline void `[`write_htif_fromhost`](#classcartesi_1_1i__state__access_1aacf1b183fa639d2ad9d864a5c26fd86c)`(uint64_t val)` 

Writes HTIF's fromhost.

#### Parameters
* `val` New register value.

#### `public inline uint64_t `[`read_htif_tohost`](#classcartesi_1_1i__state__access_1ae7b5aee57ad58858a80ad7f93d667a1e)`(void)` 

Reads HTIF's tohost.

#### Returns
Register value.

#### `public inline void `[`write_htif_tohost`](#classcartesi_1_1i__state__access_1a6c00e4e8253483bbc1ecc1fc8a65bdb8)`(uint64_t val)` 

Writes HTIF's tohost.

#### Parameters
* `val` New register value.

#### `public inline void `[`read_pma`](#classcartesi_1_1i__state__access_1aa57a080fa2cc7eda22cb6f103db9a974)`(const `[`pma_entry`](#classcartesi_1_1pma__entry)` & pma,int i)` 

Reads PMA at a given index.

#### Parameters
* `pma` PMA entry. 

* `i` Index of PMA index.

#### `public inline uint64_t `[`read_pma_istart`](#classcartesi_1_1i__state__access_1a508985959fa58b8d76b3f7dc8d183c73)`(int p)` 

Reads the istart field of a PMA entry.

#### Parameters
* `p` Index of PMA

#### `public inline uint64_t `[`read_pma_ilength`](#classcartesi_1_1i__state__access_1a9b9d33952191a2a643eaddbaebac9ae7)`(int p)` 

Reads the ilength field of a PMA entry.

#### Parameters
* `p` Index of PMA

#### `public template<>`  <br/>`inline void `[`read_memory`](#classcartesi_1_1i__state__access_1a5a088611ddf1588e3eeef575ab260672)`(uint64_t paddr,const unsigned char * hpage,uint64_t hoffset,T * pval)` 

Read from memory.

#### Parameters
* `T` Type of word to read. 

#### Parameters
* `paddr` Target physical address. 

* `hpage` Pointer to page start in host memory. 

* `hoffset` Offset in page (must be aligned to sizeof(T)). 

* `pval` Pointer to word receiving value.

#### `public template<>`  <br/>`inline void `[`write_memory`](#classcartesi_1_1i__state__access_1a3d8ff3cb8d0a9dc57bf270d9c8cb5e25)`(uint64_t paddr,unsigned char * hpage,uint64_t hoffset,T val)` 

Write to memory.

#### Parameters
* `T` Type of word to write. 

#### Parameters
* `paddr` Target physical address. 

* `hpage` Pointer to page start in host memory. 

* `hoffset` Offset in page (must be aligned to sizeof(T)). 

* `val` Value to be written.

# class `cartesi::i_virtual_state_access` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline virtual  `[`~i_virtual_state_access`](#classcartesi_1_1i__virtual__state__access_1ac1cc8460df436133627546b5d4299cf6)`(void)` | Virtual destructor.
`public inline void `[`set_mip`](#classcartesi_1_1i__virtual__state__access_1a61b4bcf6a9d149fd0a1b7c8e1bc48919)`(uint32_t mask)` | Set bits in mip.
`public inline void `[`reset_mip`](#classcartesi_1_1i__virtual__state__access_1a1fa223061dab5e099dd0c6c80abacc96)`(uint32_t mask)` | Resets bits in mip.
`public inline uint32_t `[`read_mip`](#classcartesi_1_1i__virtual__state__access_1aa4b6efe10bb37a9d738292eb8cdfaf91)`(void)` | Reads the value of the mip register.
`public inline uint64_t `[`read_mcycle`](#classcartesi_1_1i__virtual__state__access_1aefb88ea0a7f7586235bcbc17abb6fcc9)`(void)` | Reads CSR mcycle.
`public inline void `[`set_iflags_H`](#classcartesi_1_1i__virtual__state__access_1aa83bcc414fca6b07a35734fe7031812a)`(void)` | Sets the iflags_H flag.
`public inline uint64_t `[`read_clint_mtimecmp`](#classcartesi_1_1i__virtual__state__access_1a64ebd1b6013ff7e062e8aff5d5024fa4)`(void)` | Reads CLINT's mtimecmp.
`public inline void `[`write_clint_mtimecmp`](#classcartesi_1_1i__virtual__state__access_1a4d58a5e755b955a139cabcd596631f45)`(uint64_t val)` | Writes CLINT's mtimecmp.
`public inline uint64_t `[`read_htif_fromhost`](#classcartesi_1_1i__virtual__state__access_1a9dd4d3d07eb03198c820c1b1708573eb)`(void)` | Reads HTIF's fromhost.
`public inline void `[`write_htif_fromhost`](#classcartesi_1_1i__virtual__state__access_1aeea85c69ad82c068692cbcc4ecfaee9b)`(uint64_t val)` | Writes HTIF's fromhost.
`public inline uint64_t `[`read_htif_tohost`](#classcartesi_1_1i__virtual__state__access_1afa1a05989878cd02917903fa6a1d458a)`(void)` | Reads HTIF's tohost.
`public inline void `[`write_htif_tohost`](#classcartesi_1_1i__virtual__state__access_1a118af747531c7db4d94d3ec60e9f1110)`(uint64_t val)` | Writes HTIF's tohost.
`public inline uint64_t `[`read_pma_istart`](#classcartesi_1_1i__virtual__state__access_1a3195c28d285f118097b050b327154d0d)`(int p)` | Reads the istart field of a PMA entry.
`public inline uint64_t `[`read_pma_ilength`](#classcartesi_1_1i__virtual__state__access_1a4ee43bbf518a234ba509e69493450cf1)`(int p)` | Reads the ilength field of a PMA entry.

## Members

#### `public inline virtual  `[`~i_virtual_state_access`](#classcartesi_1_1i__virtual__state__access_1ac1cc8460df436133627546b5d4299cf6)`(void)` 

Virtual destructor.

#### `public inline void `[`set_mip`](#classcartesi_1_1i__virtual__state__access_1a61b4bcf6a9d149fd0a1b7c8e1bc48919)`(uint32_t mask)` 

Set bits in mip.

See ::processor_set_mip.

#### `public inline void `[`reset_mip`](#classcartesi_1_1i__virtual__state__access_1a1fa223061dab5e099dd0c6c80abacc96)`(uint32_t mask)` 

Resets bits in mip.

See ::processor_reset_mip.

#### `public inline uint32_t `[`read_mip`](#classcartesi_1_1i__virtual__state__access_1aa4b6efe10bb37a9d738292eb8cdfaf91)`(void)` 

Reads the value of the mip register.

See ::processor_read_mip.

#### `public inline uint64_t `[`read_mcycle`](#classcartesi_1_1i__virtual__state__access_1aefb88ea0a7f7586235bcbc17abb6fcc9)`(void)` 

Reads CSR mcycle.

#### Returns
Register value.

#### `public inline void `[`set_iflags_H`](#classcartesi_1_1i__virtual__state__access_1aa83bcc414fca6b07a35734fe7031812a)`(void)` 

Sets the iflags_H flag.

This is Cartesi-specific.

#### `public inline uint64_t `[`read_clint_mtimecmp`](#classcartesi_1_1i__virtual__state__access_1a64ebd1b6013ff7e062e8aff5d5024fa4)`(void)` 

Reads CLINT's mtimecmp.

#### Returns
Register value.

#### `public inline void `[`write_clint_mtimecmp`](#classcartesi_1_1i__virtual__state__access_1a4d58a5e755b955a139cabcd596631f45)`(uint64_t val)` 

Writes CLINT's mtimecmp.

#### Parameters
* `val` New register value.

#### `public inline uint64_t `[`read_htif_fromhost`](#classcartesi_1_1i__virtual__state__access_1a9dd4d3d07eb03198c820c1b1708573eb)`(void)` 

Reads HTIF's fromhost.

#### Returns
Register value.

#### `public inline void `[`write_htif_fromhost`](#classcartesi_1_1i__virtual__state__access_1aeea85c69ad82c068692cbcc4ecfaee9b)`(uint64_t val)` 

Writes HTIF's fromhost.

#### Parameters
* `val` New register value.

#### `public inline uint64_t `[`read_htif_tohost`](#classcartesi_1_1i__virtual__state__access_1afa1a05989878cd02917903fa6a1d458a)`(void)` 

Reads HTIF's tohost.

#### Returns
Register value.

#### `public inline void `[`write_htif_tohost`](#classcartesi_1_1i__virtual__state__access_1a118af747531c7db4d94d3ec60e9f1110)`(uint64_t val)` 

Writes HTIF's tohost.

#### Parameters
* `val` New register value.

#### `public inline uint64_t `[`read_pma_istart`](#classcartesi_1_1i__virtual__state__access_1a3195c28d285f118097b050b327154d0d)`(int p)` 

Reads the istart field of a PMA entry.

#### Parameters
* `p` Index of PMA

#### `public inline uint64_t `[`read_pma_ilength`](#classcartesi_1_1i__virtual__state__access_1a4ee43bbf518a234ba509e69493450cf1)`(int p)` 

Reads the ilength field of a PMA entry.

#### Parameters
* `p` Index of PMA

# class `cartesi::logged_state_access` 

```
class cartesi::logged_state_access
  : public cartesi::i_state_access< logged_state_access >
```  

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  explicit `[`logged_state_access`](#classcartesi_1_1logged__state__access_1a6bb5a23f0ee54ce838afa32736e6cce7)`(`[`machine`](#classcartesi_1_1machine)` & m)` | Constructor from machine state and Merkle tree.
`public  `[`logged_state_access`](#classcartesi_1_1logged__state__access_1aedbd67d838e173b34dd3e6227efff4c7)`(const `[`logged_state_access`](#classcartesi_1_1logged__state__access)` &) = delete` | No copy constructor.
`public  `[`logged_state_access`](#classcartesi_1_1logged__state__access_1a25d41bbdf8ac4e47257a4c05c4f4713d)`(`[`logged_state_access`](#classcartesi_1_1logged__state__access)` &&) = delete` | No move constructor.
`public `[`logged_state_access`](#classcartesi_1_1logged__state__access)` & `[`operator=`](#classcartesi_1_1logged__state__access_1a32d9fe4be183fcbf2363e311df3976cf)`(const `[`logged_state_access`](#classcartesi_1_1logged__state__access)` &) = delete` | No copy assignment.
`public `[`logged_state_access`](#classcartesi_1_1logged__state__access)` & `[`operator=`](#classcartesi_1_1logged__state__access_1a607e895234bf54d756c04329ba9cdc88)`(`[`logged_state_access`](#classcartesi_1_1logged__state__access)` &&) = delete` | No move assignment.
`public inline std::shared_ptr< const `[`access_log`](#classcartesi_1_1access__log)` > `[`get_log`](#classcartesi_1_1logged__state__access_1a80bad19110c5db175dfd56f1747c4983)`(void) const` | Returns const pointer to access log.
`public inline std::shared_ptr< `[`access_log`](#classcartesi_1_1access__log)` > `[`get_log`](#classcartesi_1_1logged__state__access_1aea4d5684c953edfc414a149e99470469)`(void)` | Returns pointer to access log.

## Members

#### `public inline  explicit `[`logged_state_access`](#classcartesi_1_1logged__state__access_1a6bb5a23f0ee54ce838afa32736e6cce7)`(`[`machine`](#classcartesi_1_1machine)` & m)` 

Constructor from machine state and Merkle tree.

#### Parameters
* `s` Pointer to machine state.

#### `public  `[`logged_state_access`](#classcartesi_1_1logged__state__access_1aedbd67d838e173b34dd3e6227efff4c7)`(const `[`logged_state_access`](#classcartesi_1_1logged__state__access)` &) = delete` 

No copy constructor.

#### `public  `[`logged_state_access`](#classcartesi_1_1logged__state__access_1a25d41bbdf8ac4e47257a4c05c4f4713d)`(`[`logged_state_access`](#classcartesi_1_1logged__state__access)` &&) = delete` 

No move constructor.

#### `public `[`logged_state_access`](#classcartesi_1_1logged__state__access)` & `[`operator=`](#classcartesi_1_1logged__state__access_1a32d9fe4be183fcbf2363e311df3976cf)`(const `[`logged_state_access`](#classcartesi_1_1logged__state__access)` &) = delete` 

No copy assignment.

#### `public `[`logged_state_access`](#classcartesi_1_1logged__state__access)` & `[`operator=`](#classcartesi_1_1logged__state__access_1a607e895234bf54d756c04329ba9cdc88)`(`[`logged_state_access`](#classcartesi_1_1logged__state__access)` &&) = delete` 

No move assignment.

#### `public inline std::shared_ptr< const `[`access_log`](#classcartesi_1_1access__log)` > `[`get_log`](#classcartesi_1_1logged__state__access_1a80bad19110c5db175dfd56f1747c4983)`(void) const` 

Returns const pointer to access log.

#### `public inline std::shared_ptr< `[`access_log`](#classcartesi_1_1access__log)` > `[`get_log`](#classcartesi_1_1logged__state__access_1aea4d5684c953edfc414a149e99470469)`(void)` 

Returns pointer to access log.

# class `cartesi::machine` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public  explicit `[`machine`](#classcartesi_1_1machine_1a648ed9f776140f36d050d4e2e764cfd7)`(const `[`machine_config`](#structcartesi_1_1machine__config)` & c)` | Constructor from machine configuration.
`public  `[`machine`](#classcartesi_1_1machine_1ab59d65bb708a9b84bedc4cdb0fcb49df)`(void) = delete` | No default constructor.
`public  `[`machine`](#classcartesi_1_1machine_1aea302ea5f631a689a409eebf554584a6)`(const `[`machine`](#classcartesi_1_1machine)` & other) = delete` | No copy constructor.
`public  `[`machine`](#classcartesi_1_1machine_1a10838be4acf321a508a5d400f916e24e)`(`[`machine`](#classcartesi_1_1machine)` && other) = delete` | No move constructor.
`public `[`machine`](#classcartesi_1_1machine)` & `[`operator=`](#classcartesi_1_1machine_1a22a463b672d071261539ace899883495)`(const `[`machine`](#classcartesi_1_1machine)` & other) = delete` | No copy assignment.
`public `[`machine`](#classcartesi_1_1machine)` & `[`operator=`](#classcartesi_1_1machine_1a476d69215e9b32bfba0242887468e2ef)`(`[`machine`](#classcartesi_1_1machine)` && other) = delete` | No move assignment.
`public void `[`run`](#classcartesi_1_1machine_1adfe6c0fdc9cbf35f1855b70cf8818a1c)`(uint64_t mcycle_end)` | Runs the machine until mcycle reaches mcycle_end or the machine halts.
`public void `[`step`](#classcartesi_1_1machine_1af0feb11f3ba35916f06d4f11b81dadc1)`(`[`access_log`](#classcartesi_1_1access__log)` & log)` | Runs the machine for one cycle logging all accesses to the state.
`public bool `[`verify_access_log`](#classcartesi_1_1machine_1aa070bf7bfc3a9ebba342ed63c62ad2ae)`(const `[`access_log`](#classcartesi_1_1access__log)` & log) const` | Checks the integrity of an access log.
`public inline `[`machine_state`](#structcartesi_1_1machine__state)` & `[`get_state`](#classcartesi_1_1machine_1a5f571af02dea977e56c0f1472b01806a)`(void)` | Returns machine state for direct access.
`public inline const `[`machine_state`](#structcartesi_1_1machine__state)` & `[`get_state`](#classcartesi_1_1machine_1a66f741d71dd5e6bb7e4309fddf18e7bf)`(void) const` | Returns machine state for direct read-only access.
`public  `[`~machine`](#classcartesi_1_1machine_1a794d23aeeb8c136fce6ab56aa083893a)`()` | Destructor.
`public const `[`merkle_tree`](#classcartesi_1_1merkle__tree)` & `[`get_merkle_tree`](#classcartesi_1_1machine_1a1b7838dc06630591453fa2bed92ee9a8)`(void) const` | Returns the associated Merkle tree.
`public `[`merkle_tree`](#classcartesi_1_1merkle__tree)` & `[`get_merkle_tree`](#classcartesi_1_1machine_1a2297d0fb99cb9406685f6cbb404442b4)`(void)` | Returns the associated Merkle tree.
`public bool `[`update_merkle_tree`](#classcartesi_1_1machine_1ac045825dae9751e3e4f91de7b2d1f77f)`(void)` | Update the Merkle tree so it matches the contents of the machine state.
`public bool `[`update_merkle_tree_page`](#classcartesi_1_1machine_1a823224b8276cd88134571e440b188561)`(uint64_t address)` | Update the Merkle tree after a page has been modified in the machine state.
`public bool `[`get_proof`](#classcartesi_1_1machine_1a9b9649d505dcf822f05c3011dbe95549)`(uint64_t address,int log2_size,`[`merkle_tree::proof_type`](#structcartesi_1_1merkle__tree_1_1proof__type)` & proof) const` | Obtains the proof for a node in the Merkle tree.
`public bool `[`read_word`](#classcartesi_1_1machine_1a2a17b439dbda3dce02ef1964adbae26d)`(uint64_t word_address,uint64_t & word_value) const` | Read the value of a word in the machine state.
`public uint64_t `[`read_x`](#classcartesi_1_1machine_1a29c513320bc19d0e04b2706ec9eb09e5)`(int i) const` | Reads the value of a general-purpose register.
`public void `[`write_x`](#classcartesi_1_1machine_1ae53ff4994926027b852b59c708b9c7b6)`(int i,uint64_t val)` | Writes the value of a general-purpose register.
`public uint64_t `[`read_pc`](#classcartesi_1_1machine_1a8a1297ce7f43b26071e423737339c36e)`(void) const` | Reads the value of the pc register.
`public void `[`write_pc`](#classcartesi_1_1machine_1ad297cae105889165316b55929bbc4121)`(uint64_t val)` | Reads the value of the pc register.
`public uint64_t `[`read_mvendorid`](#classcartesi_1_1machine_1a336fa27ea167d0b379212143f8fdd2b4)`(void) const` | Reads the value of the mvendorid register.
`public void `[`write_mvendorid`](#classcartesi_1_1machine_1a14e948256cdccc0487fabb634649ae88)`(uint64_t val)` | Reads the value of the mvendorid register.
`public uint64_t `[`read_marchid`](#classcartesi_1_1machine_1a28043d081c1d93381b3dc4a8b119ca11)`(void) const` | Reads the value of the marchid register.
`public void `[`write_marchid`](#classcartesi_1_1machine_1a0d5e31b87e12ca93b7c82fd7d0a0118a)`(uint64_t val)` | Reads the value of the marchid register.
`public uint64_t `[`read_mimpid`](#classcartesi_1_1machine_1a6ea8439f2652bfbb9cc2ab17525abdda)`(void) const` | Reads the value of the mimpid register.
`public void `[`write_mimpid`](#classcartesi_1_1machine_1a67619659250c0542d939339610a9b4d6)`(uint64_t val)` | Reads the value of the mimpid register.
`public uint64_t `[`read_mcycle`](#classcartesi_1_1machine_1a9b5d0592d140149c37fd0fb6600cc10a)`(void) const` | Reads the value of the mcycle register.
`public void `[`write_mcycle`](#classcartesi_1_1machine_1a3fa32fcd6d334284a7922d842c743fe8)`(uint64_t val)` | Writes the value of the mcycle register.
`public uint64_t `[`read_minstret`](#classcartesi_1_1machine_1a937af1cbc995d220e26e9305637e521c)`(void) const` | Reads the value of the minstret register.
`public void `[`write_minstret`](#classcartesi_1_1machine_1a14555c48ffd4e7799327b43dfb46516b)`(uint64_t val)` | Writes the value of the minstret register.
`public uint64_t `[`read_mstatus`](#classcartesi_1_1machine_1a51e8c1f17863bc53505a02cd49e096ab)`(void) const` | Reads the value of the mstatus register.
`public void `[`write_mstatus`](#classcartesi_1_1machine_1a7f31655ec9dce18ac5886901d61623bc)`(uint64_t val)` | Writes the value of the mstatus register.
`public uint64_t `[`read_mtvec`](#classcartesi_1_1machine_1abb121159556f58e5f089b55b933ca931)`(void) const` | Reads the value of the mtvec register.
`public void `[`write_mtvec`](#classcartesi_1_1machine_1a486fd18c29cda15f73b1294a57ccd8b9)`(uint64_t val)` | Writes the value of the mtvec register.
`public uint64_t `[`read_mscratch`](#classcartesi_1_1machine_1ae031adad66383b624d93cdfb22d35366)`(void) const` | Reads the value of the mscratch register.
`public void `[`write_mscratch`](#classcartesi_1_1machine_1a2edb35b8ac7130ea165a29e42b4593d5)`(uint64_t val)` | Writes the value of the mscratch register.
`public uint64_t `[`read_mepc`](#classcartesi_1_1machine_1afddfa9b5dc1dc5d97cab34ada968e2a5)`(void) const` | Reads the value of the mepc register.
`public void `[`write_mepc`](#classcartesi_1_1machine_1aa8a61644485ca3f44a9caec11802adec)`(uint64_t val)` | Writes the value of the mepc register.
`public uint64_t `[`read_mcause`](#classcartesi_1_1machine_1ab14f473ab534f880271aee6a231920c4)`(void) const` | Reads the value of the mcause register.
`public void `[`write_mcause`](#classcartesi_1_1machine_1aed93bb50d300db65a9294c71dd59a39c)`(uint64_t val)` | Writes the value of the mcause register.
`public uint64_t `[`read_mtval`](#classcartesi_1_1machine_1ab74072377ad077df79c988fdc4aee24b)`(void) const` | Reads the value of the mtval register.
`public void `[`write_mtval`](#classcartesi_1_1machine_1a96f7320be55e999aad73466d466bb050)`(uint64_t val)` | Writes the value of the mtval register.
`public uint64_t `[`read_misa`](#classcartesi_1_1machine_1af87da936d1b1672ae77f52be4823c66f)`(void) const` | Reads the value of the misa register.
`public void `[`write_misa`](#classcartesi_1_1machine_1a0f54c58efcf2f769e0b0f3bf4f41ad2a)`(uint64_t val)` | Writes the value of the misa register.
`public uint64_t `[`read_mie`](#classcartesi_1_1machine_1a9de73dfc4f7425e2192335a2b200ba41)`(void) const` | Reads the value of the mie register.
`public void `[`write_mie`](#classcartesi_1_1machine_1aed9fa5457fa4b76f80105c6d1b0a2817)`(uint64_t val)` | Reads the value of the mie register.
`public uint64_t `[`read_mip`](#classcartesi_1_1machine_1a5179379a789b594f4bd65f5c9fab8091)`(void) const` | Reads the value of the mip register.
`public void `[`write_mip`](#classcartesi_1_1machine_1ac4de18a37afba412e1738fcfc345f7f3)`(uint64_t val)` | Reads the value of the mip register.
`public uint64_t `[`read_medeleg`](#classcartesi_1_1machine_1a2d3123fc44f9253f1af9acd32e34a314)`(void) const` | Reads the value of the medeleg register.
`public void `[`write_medeleg`](#classcartesi_1_1machine_1ab00aea7467678481b5d7f1f91b180d09)`(uint64_t val)` | Writes the value of the medeleg register.
`public uint64_t `[`read_mideleg`](#classcartesi_1_1machine_1a6baf2a43b1edba4971230df5365936f6)`(void) const` | Reads the value of the mideleg register.
`public void `[`write_mideleg`](#classcartesi_1_1machine_1a5c0ed5d06b07a734d7f5d761b02aaad1)`(uint64_t val)` | Writes the value of the mideleg register.
`public uint64_t `[`read_mcounteren`](#classcartesi_1_1machine_1afc4748192243a0a00c1c3c611d02a1eb)`(void) const` | Reads the value of the mcounteren register.
`public void `[`write_mcounteren`](#classcartesi_1_1machine_1a8f00593569ec71babcedef26555a4f12)`(uint64_t val)` | Writes the value of the mcounteren register.
`public uint64_t `[`read_stvec`](#classcartesi_1_1machine_1ae83369589fd14dd80add9b2462863786)`(void) const` | Reads the value of the stvec register.
`public void `[`write_stvec`](#classcartesi_1_1machine_1a2fe3941a2bf267185098e6fc0778f3f8)`(uint64_t val)` | Writes the value of the stvec register.
`public uint64_t `[`read_sscratch`](#classcartesi_1_1machine_1aafd5c8d839d67f90774145ecc962b545)`(void) const` | Reads the value of the sscratch register.
`public void `[`write_sscratch`](#classcartesi_1_1machine_1ad1de45ed27911a2881294d4be79d6e98)`(uint64_t val)` | Writes the value of the sscratch register.
`public uint64_t `[`read_sepc`](#classcartesi_1_1machine_1a1cfbf79e5d4cfce0d061ca8d14a8979e)`(void) const` | Reads the value of the sepc register.
`public void `[`write_sepc`](#classcartesi_1_1machine_1a8d56517eaf58b141de0dc3981f3c170d)`(uint64_t val)` | Writes the value of the sepc register.
`public uint64_t `[`read_scause`](#classcartesi_1_1machine_1a20cdb0dfe5641c820506dfad0381e481)`(void) const` | Reads the value of the scause register.
`public void `[`write_scause`](#classcartesi_1_1machine_1a9400f05eb485acc0cf4eca24eea8b9eb)`(uint64_t val)` | Writes the value of the scause register.
`public uint64_t `[`read_stval`](#classcartesi_1_1machine_1ad0f3c7092c748c2c5593afdf5309429d)`(void) const` | Reads the value of the stval register.
`public void `[`write_stval`](#classcartesi_1_1machine_1a71746ea4bc37a9a4b271c451e86e0ff7)`(uint64_t val)` | Writes the value of the stval register.
`public uint64_t `[`read_satp`](#classcartesi_1_1machine_1aea8a170ed8b0929b4761fafc95fe88a9)`(void) const` | Reads the value of the satp register.
`public void `[`write_satp`](#classcartesi_1_1machine_1a7b2dfb070b282acd55cbc41717bc78e1)`(uint64_t val)` | Writes the value of the satp register.
`public uint64_t `[`read_scounteren`](#classcartesi_1_1machine_1acd19cfec764fb69489809b75bcd9c280)`(void) const` | Reads the value of the scounteren register.
`public void `[`write_scounteren`](#classcartesi_1_1machine_1af442798d823d5f2a63ce444291ebb1ec)`(uint64_t val)` | Writes the value of the scounteren register.
`public uint64_t `[`read_ilrsc`](#classcartesi_1_1machine_1a1bdfd3698c21933ce128f018845b8732)`(void) const` | Reads the value of the ilrsc register.
`public void `[`write_ilrsc`](#classcartesi_1_1machine_1aa43a0c586a64d6894bec39e1c27a469c)`(uint64_t val)` | Writes the value of the ilrsc register.
`public uint64_t `[`read_iflags`](#classcartesi_1_1machine_1abea08584ece2894d001d302e16a5306a)`(void) const` | Reads the value of the iflags register.
`public uint64_t `[`packed_iflags`](#classcartesi_1_1machine_1a76dc871cc289a9c7ea5cb395fcac37bc)`(int PRV,int I,int H)` | Returns packed iflags from its component fields.
`public void `[`write_iflags`](#classcartesi_1_1machine_1a43351322cdc86ed1ee7a735558911c38)`(uint64_t val)` | Reads the value of the iflags register.
`public uint64_t `[`read_htif_tohost`](#classcartesi_1_1machine_1a8418ee35cb7b9d3daa44b3a03d5ec200)`(void) const` | Returns the maximum XLEN for the machine.
`public void `[`write_htif_tohost`](#classcartesi_1_1machine_1ae1a469b822f920c55febaa3507decccc)`(uint64_t val)` | Writes the value of HTIF's tohost register.
`public uint64_t `[`read_htif_fromhost`](#classcartesi_1_1machine_1a2a7757b65a3542f440d2d9dc1302604f)`(void) const` | Reads the value of HTIF's fromhost register.
`public void `[`write_htif_fromhost`](#classcartesi_1_1machine_1a87e179a6c53822b52c35139198bee519)`(uint64_t val)` | Writes the value of HTIF's fromhost register.
`public uint64_t `[`read_clint_mtimecmp`](#classcartesi_1_1machine_1a6acd2bb210aeaceab452295182ee89d5)`(void) const` | Reads the value of CLINT's mtimecmp register.
`public void `[`write_clint_mtimecmp`](#classcartesi_1_1machine_1a042057277c56e0ecb03409fb3c624cdc)`(uint64_t val)` | Writes the value of CLINT's mtimecmp register.
`public bool `[`read_iflags_I`](#classcartesi_1_1machine_1a28157f3242e39fc0a5b6b8c58fb58fae)`(void) const` | Checks the value of the iflags_I flag.
`public void `[`reset_iflags_I`](#classcartesi_1_1machine_1abb56755bacd36bb8ba84b5f0d3d7b06a)`(void)` | Resets the value of the iflags_I flag.
`public void `[`set_mip`](#classcartesi_1_1machine_1aa18318318a7f98b2d50abdc3ffb26268)`(uint32_t mask)` | Sets bits in mip.
`public void `[`reset_mip`](#classcartesi_1_1machine_1a0a0aa97634025935eda06bc95b937eb1)`(uint32_t mask)` | Resets bits in mip.
`public bool `[`read_iflags_H`](#classcartesi_1_1machine_1a171cb41a93a7beb4a7e2f582877f2616)`(void) const` | Checks the value of the iflags_H flag.
`public uint8_t `[`read_iflags_PRV`](#classcartesi_1_1machine_1ad9cb6c6b9850d1e6ad8fdae7a688abef)`(void) const` | Checks the value of the iflags_PRV field.
`public void `[`set_iflags_H`](#classcartesi_1_1machine_1ad307e681bee8dea81162bd03e5709af8)`(void)` | Sets the iflags_H flag.
`public unsigned char * `[`get_host_memory`](#classcartesi_1_1machine_1a3da5ccf35e110318f28db62278d9a43f)`(uint64_t paddr)` | Obtain a pointer into the host memory corresponding to the target memory at a given address.
`public `[`pma_entry`](#classcartesi_1_1pma__entry)` & `[`register_flash`](#classcartesi_1_1machine_1a2a2c631539fc3f5c8704b7f201f32c69)`(uint64_t start,uint64_t length,const char * path,bool shared)` | Register a new flash drive.
`public void `[`register_mmio`](#classcartesi_1_1machine_1a81463067aab320d004319d9173d71989)`(uint64_t start,uint64_t length,pma_peek peek,void * context,const `[`pma_driver`](#structcartesi_1_1pma__driver)` * driver,`[`PMA_ISTART_DID`](#pma-constants_8h_1af1653605bf791b39ada81f1dbd923571)` DID)` | Register a new memory-mapped IO device.
`public void `[`register_shadow`](#classcartesi_1_1machine_1a02fbc7dd18511b6006473b1e524e0836)`(uint64_t start,uint64_t length,pma_peek peek,void * context,const `[`pma_driver`](#structcartesi_1_1pma__driver)` * driver)` | Register a new shadow device.
`public void `[`dump`](#classcartesi_1_1machine_1a8f19e42ed383fa637d005ae05022551a)`(void) const` | Dump all memory ranges to files in current working directory.
`public const boost::container::static_vector< `[`pma_entry`](#classcartesi_1_1pma__entry)`, PMA_MAX > & `[`get_pmas`](#classcartesi_1_1machine_1a6fe196f9a797747cf43f979d32f95a38)`(void) const` | Get read-only access to container with all PMA entries.
`public void `[`interact`](#classcartesi_1_1machine_1af31c77a7fe1ea7cc08acfa387fca2942)`(void)` | Interact with console.
`public bool `[`verify_dirty_page_maps`](#classcartesi_1_1machine_1a64f3b453d4ccc8d350627e98ebcd3476)`(void) const` | Verify if dirty page maps are consistent.

## Members

#### `public  explicit `[`machine`](#classcartesi_1_1machine_1a648ed9f776140f36d050d4e2e764cfd7)`(const `[`machine_config`](#structcartesi_1_1machine__config)` & c)` 

Constructor from machine configuration.

#### `public  `[`machine`](#classcartesi_1_1machine_1ab59d65bb708a9b84bedc4cdb0fcb49df)`(void) = delete` 

No default constructor.

#### `public  `[`machine`](#classcartesi_1_1machine_1aea302ea5f631a689a409eebf554584a6)`(const `[`machine`](#classcartesi_1_1machine)` & other) = delete` 

No copy constructor.

#### `public  `[`machine`](#classcartesi_1_1machine_1a10838be4acf321a508a5d400f916e24e)`(`[`machine`](#classcartesi_1_1machine)` && other) = delete` 

No move constructor.

#### `public `[`machine`](#classcartesi_1_1machine)` & `[`operator=`](#classcartesi_1_1machine_1a22a463b672d071261539ace899883495)`(const `[`machine`](#classcartesi_1_1machine)` & other) = delete` 

No copy assignment.

#### `public `[`machine`](#classcartesi_1_1machine)` & `[`operator=`](#classcartesi_1_1machine_1a476d69215e9b32bfba0242887468e2ef)`(`[`machine`](#classcartesi_1_1machine)` && other) = delete` 

No move assignment.

#### `public void `[`run`](#classcartesi_1_1machine_1adfe6c0fdc9cbf35f1855b70cf8818a1c)`(uint64_t mcycle_end)` 

Runs the machine until mcycle reaches mcycle_end or the machine halts.

#### `public void `[`step`](#classcartesi_1_1machine_1af0feb11f3ba35916f06d4f11b81dadc1)`(`[`access_log`](#classcartesi_1_1access__log)` & log)` 

Runs the machine for one cycle logging all accesses to the state.

#### Parameters
* `log` Receives log of all state accesses.

#### `public bool `[`verify_access_log`](#classcartesi_1_1machine_1aa070bf7bfc3a9ebba342ed63c62ad2ae)`(const `[`access_log`](#classcartesi_1_1access__log)` & log) const` 

Checks the integrity of an access log.

#### Parameters
* `log` State access log to be verified.

#### `public inline `[`machine_state`](#structcartesi_1_1machine__state)` & `[`get_state`](#classcartesi_1_1machine_1a5f571af02dea977e56c0f1472b01806a)`(void)` 

Returns machine state for direct access.

#### `public inline const `[`machine_state`](#structcartesi_1_1machine__state)` & `[`get_state`](#classcartesi_1_1machine_1a66f741d71dd5e6bb7e4309fddf18e7bf)`(void) const` 

Returns machine state for direct read-only access.

#### `public  `[`~machine`](#classcartesi_1_1machine_1a794d23aeeb8c136fce6ab56aa083893a)`()` 

Destructor.

#### `public const `[`merkle_tree`](#classcartesi_1_1merkle__tree)` & `[`get_merkle_tree`](#classcartesi_1_1machine_1a1b7838dc06630591453fa2bed92ee9a8)`(void) const` 

Returns the associated Merkle tree.

#### `public `[`merkle_tree`](#classcartesi_1_1merkle__tree)` & `[`get_merkle_tree`](#classcartesi_1_1machine_1a2297d0fb99cb9406685f6cbb404442b4)`(void)` 

Returns the associated Merkle tree.

#### `public bool `[`update_merkle_tree`](#classcartesi_1_1machine_1ac045825dae9751e3e4f91de7b2d1f77f)`(void)` 

Update the Merkle tree so it matches the contents of the machine state.

#### Returns
true if succeeded, false otherwise.

#### `public bool `[`update_merkle_tree_page`](#classcartesi_1_1machine_1a823224b8276cd88134571e440b188561)`(uint64_t address)` 

Update the Merkle tree after a page has been modified in the machine state.

#### Parameters
* `address` Any address inside modified page. 

#### Returns
true if succeeded, false otherwise.

#### `public bool `[`get_proof`](#classcartesi_1_1machine_1a9b9649d505dcf822f05c3011dbe95549)`(uint64_t address,int log2_size,`[`merkle_tree::proof_type`](#structcartesi_1_1merkle__tree_1_1proof__type)` & proof) const` 

Obtains the proof for a node in the Merkle tree.

#### Parameters
* `address` Address of target node. Must be aligned to a 2log2_size boundary. 

* `log2_size` log2 of size subintended by target node. Must be between 3 (for a word) and 64 (for the entire address space), inclusive. 

* `proof` Receives the proof. 

#### Returns
true if succeeded, false otherwise.

#### `public bool `[`read_word`](#classcartesi_1_1machine_1a2a17b439dbda3dce02ef1964adbae26d)`(uint64_t word_address,uint64_t & word_value) const` 

Read the value of a word in the machine state.

#### Parameters
* `word_address` Word address (aligned to 64-bit boundary). 

* `word_value` Receives word value. 

#### Returns
true if succeeded, false otherwise. 

The current implementation of this function is very slow!

#### `public uint64_t `[`read_x`](#classcartesi_1_1machine_1a29c513320bc19d0e04b2706ec9eb09e5)`(int i) const` 

Reads the value of a general-purpose register.

#### Parameters
* `i` Register index. 

#### Returns
The value of the register.

#### `public void `[`write_x`](#classcartesi_1_1machine_1ae53ff4994926027b852b59c708b9c7b6)`(int i,uint64_t val)` 

Writes the value of a general-purpose register.

#### Parameters
* `i` Register index. 

* `val` New register value.

#### `public uint64_t `[`read_pc`](#classcartesi_1_1machine_1a8a1297ce7f43b26071e423737339c36e)`(void) const` 

Reads the value of the pc register.

#### Returns
The value of the register.

#### `public void `[`write_pc`](#classcartesi_1_1machine_1ad297cae105889165316b55929bbc4121)`(uint64_t val)` 

Reads the value of the pc register.

#### Parameters
* `val` New register value.

#### `public uint64_t `[`read_mvendorid`](#classcartesi_1_1machine_1a336fa27ea167d0b379212143f8fdd2b4)`(void) const` 

Reads the value of the mvendorid register.

#### Returns
The value of the register.

#### `public void `[`write_mvendorid`](#classcartesi_1_1machine_1a14e948256cdccc0487fabb634649ae88)`(uint64_t val)` 

Reads the value of the mvendorid register.

#### Parameters
* `val` New register value.

#### `public uint64_t `[`read_marchid`](#classcartesi_1_1machine_1a28043d081c1d93381b3dc4a8b119ca11)`(void) const` 

Reads the value of the marchid register.

#### Returns
The value of the register.

#### `public void `[`write_marchid`](#classcartesi_1_1machine_1a0d5e31b87e12ca93b7c82fd7d0a0118a)`(uint64_t val)` 

Reads the value of the marchid register.

#### Parameters
* `val` New register value.

#### `public uint64_t `[`read_mimpid`](#classcartesi_1_1machine_1a6ea8439f2652bfbb9cc2ab17525abdda)`(void) const` 

Reads the value of the mimpid register.

#### Returns
The value of the register.

#### `public void `[`write_mimpid`](#classcartesi_1_1machine_1a67619659250c0542d939339610a9b4d6)`(uint64_t val)` 

Reads the value of the mimpid register.

#### Parameters
* `val` New register value.

#### `public uint64_t `[`read_mcycle`](#classcartesi_1_1machine_1a9b5d0592d140149c37fd0fb6600cc10a)`(void) const` 

Reads the value of the mcycle register.

#### Returns
The value of the register.

#### `public void `[`write_mcycle`](#classcartesi_1_1machine_1a3fa32fcd6d334284a7922d842c743fe8)`(uint64_t val)` 

Writes the value of the mcycle register.

#### Parameters
* `val` New register value.

#### `public uint64_t `[`read_minstret`](#classcartesi_1_1machine_1a937af1cbc995d220e26e9305637e521c)`(void) const` 

Reads the value of the minstret register.

#### Returns
The value of the register.

#### `public void `[`write_minstret`](#classcartesi_1_1machine_1a14555c48ffd4e7799327b43dfb46516b)`(uint64_t val)` 

Writes the value of the minstret register.

#### Parameters
* `val` New register value.

#### `public uint64_t `[`read_mstatus`](#classcartesi_1_1machine_1a51e8c1f17863bc53505a02cd49e096ab)`(void) const` 

Reads the value of the mstatus register.

#### Returns
The value of the register.

#### `public void `[`write_mstatus`](#classcartesi_1_1machine_1a7f31655ec9dce18ac5886901d61623bc)`(uint64_t val)` 

Writes the value of the mstatus register.

#### Parameters
* `val` New register value.

#### `public uint64_t `[`read_mtvec`](#classcartesi_1_1machine_1abb121159556f58e5f089b55b933ca931)`(void) const` 

Reads the value of the mtvec register.

#### Returns
The value of the register.

#### `public void `[`write_mtvec`](#classcartesi_1_1machine_1a486fd18c29cda15f73b1294a57ccd8b9)`(uint64_t val)` 

Writes the value of the mtvec register.

#### Parameters
* `val` New register value.

#### `public uint64_t `[`read_mscratch`](#classcartesi_1_1machine_1ae031adad66383b624d93cdfb22d35366)`(void) const` 

Reads the value of the mscratch register.

#### Returns
The value of the register.

#### `public void `[`write_mscratch`](#classcartesi_1_1machine_1a2edb35b8ac7130ea165a29e42b4593d5)`(uint64_t val)` 

Writes the value of the mscratch register.

#### Parameters
* `val` New register value.

#### `public uint64_t `[`read_mepc`](#classcartesi_1_1machine_1afddfa9b5dc1dc5d97cab34ada968e2a5)`(void) const` 

Reads the value of the mepc register.

#### Returns
The value of the register.

#### `public void `[`write_mepc`](#classcartesi_1_1machine_1aa8a61644485ca3f44a9caec11802adec)`(uint64_t val)` 

Writes the value of the mepc register.

#### Parameters
* `val` New register value.

#### `public uint64_t `[`read_mcause`](#classcartesi_1_1machine_1ab14f473ab534f880271aee6a231920c4)`(void) const` 

Reads the value of the mcause register.

#### Returns
The value of the register.

#### `public void `[`write_mcause`](#classcartesi_1_1machine_1aed93bb50d300db65a9294c71dd59a39c)`(uint64_t val)` 

Writes the value of the mcause register.

#### Parameters
* `val` New register value.

#### `public uint64_t `[`read_mtval`](#classcartesi_1_1machine_1ab74072377ad077df79c988fdc4aee24b)`(void) const` 

Reads the value of the mtval register.

#### Returns
The value of the register.

#### `public void `[`write_mtval`](#classcartesi_1_1machine_1a96f7320be55e999aad73466d466bb050)`(uint64_t val)` 

Writes the value of the mtval register.

#### Parameters
* `val` New register value.

#### `public uint64_t `[`read_misa`](#classcartesi_1_1machine_1af87da936d1b1672ae77f52be4823c66f)`(void) const` 

Reads the value of the misa register.

#### Returns
The value of the register.

#### `public void `[`write_misa`](#classcartesi_1_1machine_1a0f54c58efcf2f769e0b0f3bf4f41ad2a)`(uint64_t val)` 

Writes the value of the misa register.

#### Parameters
* `val` New register value.

#### `public uint64_t `[`read_mie`](#classcartesi_1_1machine_1a9de73dfc4f7425e2192335a2b200ba41)`(void) const` 

Reads the value of the mie register.

#### Returns
The value of the register.

#### `public void `[`write_mie`](#classcartesi_1_1machine_1aed9fa5457fa4b76f80105c6d1b0a2817)`(uint64_t val)` 

Reads the value of the mie register.

#### Parameters
* `val` New register value.

#### `public uint64_t `[`read_mip`](#classcartesi_1_1machine_1a5179379a789b594f4bd65f5c9fab8091)`(void) const` 

Reads the value of the mip register.

#### Returns
The value of the register.

#### `public void `[`write_mip`](#classcartesi_1_1machine_1ac4de18a37afba412e1738fcfc345f7f3)`(uint64_t val)` 

Reads the value of the mip register.

#### Parameters
* `val` New register value.

#### `public uint64_t `[`read_medeleg`](#classcartesi_1_1machine_1a2d3123fc44f9253f1af9acd32e34a314)`(void) const` 

Reads the value of the medeleg register.

#### Returns
The value of the register.

#### `public void `[`write_medeleg`](#classcartesi_1_1machine_1ab00aea7467678481b5d7f1f91b180d09)`(uint64_t val)` 

Writes the value of the medeleg register.

#### Parameters
* `val` New register value.

#### `public uint64_t `[`read_mideleg`](#classcartesi_1_1machine_1a6baf2a43b1edba4971230df5365936f6)`(void) const` 

Reads the value of the mideleg register.

#### Returns
The value of the register.

#### `public void `[`write_mideleg`](#classcartesi_1_1machine_1a5c0ed5d06b07a734d7f5d761b02aaad1)`(uint64_t val)` 

Writes the value of the mideleg register.

#### Parameters
* `val` New register value.

#### `public uint64_t `[`read_mcounteren`](#classcartesi_1_1machine_1afc4748192243a0a00c1c3c611d02a1eb)`(void) const` 

Reads the value of the mcounteren register.

#### Returns
The value of the register.

#### `public void `[`write_mcounteren`](#classcartesi_1_1machine_1a8f00593569ec71babcedef26555a4f12)`(uint64_t val)` 

Writes the value of the mcounteren register.

#### Parameters
* `val` New register value.

#### `public uint64_t `[`read_stvec`](#classcartesi_1_1machine_1ae83369589fd14dd80add9b2462863786)`(void) const` 

Reads the value of the stvec register.

#### Returns
The value of the register.

#### `public void `[`write_stvec`](#classcartesi_1_1machine_1a2fe3941a2bf267185098e6fc0778f3f8)`(uint64_t val)` 

Writes the value of the stvec register.

#### Parameters
* `val` New register value.

#### `public uint64_t `[`read_sscratch`](#classcartesi_1_1machine_1aafd5c8d839d67f90774145ecc962b545)`(void) const` 

Reads the value of the sscratch register.

#### Returns
The value of the register.

#### `public void `[`write_sscratch`](#classcartesi_1_1machine_1ad1de45ed27911a2881294d4be79d6e98)`(uint64_t val)` 

Writes the value of the sscratch register.

#### Parameters
* `val` New register value.

#### `public uint64_t `[`read_sepc`](#classcartesi_1_1machine_1a1cfbf79e5d4cfce0d061ca8d14a8979e)`(void) const` 

Reads the value of the sepc register.

#### Returns
The value of the register.

#### `public void `[`write_sepc`](#classcartesi_1_1machine_1a8d56517eaf58b141de0dc3981f3c170d)`(uint64_t val)` 

Writes the value of the sepc register.

#### Parameters
* `val` New register value.

#### `public uint64_t `[`read_scause`](#classcartesi_1_1machine_1a20cdb0dfe5641c820506dfad0381e481)`(void) const` 

Reads the value of the scause register.

#### Returns
The value of the register.

#### `public void `[`write_scause`](#classcartesi_1_1machine_1a9400f05eb485acc0cf4eca24eea8b9eb)`(uint64_t val)` 

Writes the value of the scause register.

#### Parameters
* `val` New register value.

#### `public uint64_t `[`read_stval`](#classcartesi_1_1machine_1ad0f3c7092c748c2c5593afdf5309429d)`(void) const` 

Reads the value of the stval register.

#### Returns
The value of the register.

#### `public void `[`write_stval`](#classcartesi_1_1machine_1a71746ea4bc37a9a4b271c451e86e0ff7)`(uint64_t val)` 

Writes the value of the stval register.

#### Parameters
* `val` New register value.

#### `public uint64_t `[`read_satp`](#classcartesi_1_1machine_1aea8a170ed8b0929b4761fafc95fe88a9)`(void) const` 

Reads the value of the satp register.

#### Returns
The value of the register.

#### `public void `[`write_satp`](#classcartesi_1_1machine_1a7b2dfb070b282acd55cbc41717bc78e1)`(uint64_t val)` 

Writes the value of the satp register.

#### Parameters
* `val` New register value.

#### `public uint64_t `[`read_scounteren`](#classcartesi_1_1machine_1acd19cfec764fb69489809b75bcd9c280)`(void) const` 

Reads the value of the scounteren register.

#### Returns
The value of the register.

#### `public void `[`write_scounteren`](#classcartesi_1_1machine_1af442798d823d5f2a63ce444291ebb1ec)`(uint64_t val)` 

Writes the value of the scounteren register.

#### Parameters
* `val` New register value.

#### `public uint64_t `[`read_ilrsc`](#classcartesi_1_1machine_1a1bdfd3698c21933ce128f018845b8732)`(void) const` 

Reads the value of the ilrsc register.

#### Returns
The value of the register.

#### `public void `[`write_ilrsc`](#classcartesi_1_1machine_1aa43a0c586a64d6894bec39e1c27a469c)`(uint64_t val)` 

Writes the value of the ilrsc register.

#### Parameters
* `val` New register value.

#### `public uint64_t `[`read_iflags`](#classcartesi_1_1machine_1abea08584ece2894d001d302e16a5306a)`(void) const` 

Reads the value of the iflags register.

#### Returns
The value of the register.

#### `public uint64_t `[`packed_iflags`](#classcartesi_1_1machine_1a76dc871cc289a9c7ea5cb395fcac37bc)`(int PRV,int I,int H)` 

Returns packed iflags from its component fields.

#### Returns
The value of the register.

#### `public void `[`write_iflags`](#classcartesi_1_1machine_1a43351322cdc86ed1ee7a735558911c38)`(uint64_t val)` 

Reads the value of the iflags register.

#### Parameters
* `val` New register value.

#### `public uint64_t `[`read_htif_tohost`](#classcartesi_1_1machine_1a8418ee35cb7b9d3daa44b3a03d5ec200)`(void) const` 

Returns the maximum XLEN for the machine.

#### Returns
The value for XLEN. Reads the value of HTIF's tohost register. 

#### Returns
The value of the register.

#### `public void `[`write_htif_tohost`](#classcartesi_1_1machine_1ae1a469b822f920c55febaa3507decccc)`(uint64_t val)` 

Writes the value of HTIF's tohost register.

#### Parameters
* `val` New register value.

#### `public uint64_t `[`read_htif_fromhost`](#classcartesi_1_1machine_1a2a7757b65a3542f440d2d9dc1302604f)`(void) const` 

Reads the value of HTIF's fromhost register.

#### Returns
The value of the register.

#### `public void `[`write_htif_fromhost`](#classcartesi_1_1machine_1a87e179a6c53822b52c35139198bee519)`(uint64_t val)` 

Writes the value of HTIF's fromhost register.

#### Parameters
* `val` New register value.

#### `public uint64_t `[`read_clint_mtimecmp`](#classcartesi_1_1machine_1a6acd2bb210aeaceab452295182ee89d5)`(void) const` 

Reads the value of CLINT's mtimecmp register.

#### Returns
The value of the register.

#### `public void `[`write_clint_mtimecmp`](#classcartesi_1_1machine_1a042057277c56e0ecb03409fb3c624cdc)`(uint64_t val)` 

Writes the value of CLINT's mtimecmp register.

#### Parameters
* `val` New register value.

#### `public bool `[`read_iflags_I`](#classcartesi_1_1machine_1a28157f3242e39fc0a5b6b8c58fb58fae)`(void) const` 

Checks the value of the iflags_I flag.

#### Returns
The flag value.

#### `public void `[`reset_iflags_I`](#classcartesi_1_1machine_1abb56755bacd36bb8ba84b5f0d3d7b06a)`(void)` 

Resets the value of the iflags_I flag.

#### `public void `[`set_mip`](#classcartesi_1_1machine_1aa18318318a7f98b2d50abdc3ffb26268)`(uint32_t mask)` 

Sets bits in mip.

#### Parameters
* `mask` Bits set in `mask` will also be set in mip

#### `public void `[`reset_mip`](#classcartesi_1_1machine_1a0a0aa97634025935eda06bc95b937eb1)`(uint32_t mask)` 

Resets bits in mip.

#### Parameters
* `mask` Bits set in `mask` will also be reset in mip

#### `public bool `[`read_iflags_H`](#classcartesi_1_1machine_1a171cb41a93a7beb4a7e2f582877f2616)`(void) const` 

Checks the value of the iflags_H flag.

#### Returns
The flag value.

#### `public uint8_t `[`read_iflags_PRV`](#classcartesi_1_1machine_1ad9cb6c6b9850d1e6ad8fdae7a688abef)`(void) const` 

Checks the value of the iflags_PRV field.

#### Returns
The field value.

#### `public void `[`set_iflags_H`](#classcartesi_1_1machine_1ad307e681bee8dea81162bd03e5709af8)`(void)` 

Sets the iflags_H flag.

#### `public unsigned char * `[`get_host_memory`](#classcartesi_1_1machine_1a3da5ccf35e110318f28db62278d9a43f)`(uint64_t paddr)` 

Obtain a pointer into the host memory corresponding to the target memory at a given address.

#### Parameters
* `paddr` Physical memory address in target. 

#### Returns
Pointer to host memory corresponding to `paddr`, or nullptr if no memory range covers `paddr`

#### `public `[`pma_entry`](#classcartesi_1_1pma__entry)` & `[`register_flash`](#classcartesi_1_1machine_1a2a2c631539fc3f5c8704b7f201f32c69)`(uint64_t start,uint64_t length,const char * path,bool shared)` 

Register a new flash drive.

#### Parameters
* `start` Start of physical memory range in the target address space on which to map the flash drive. 

* `length` Length of physical memory range in the target address space on which to map the flash drive. 

* `path` Pointer to a string containing the filename for the backing file in the host with the contents of the flash drive. 

* `shared` Whether target modifications to the flash drive are reflected in the host's backing file.

`length` must match the size of the backing file. 
#### Returns
Reference to corresponding entry in machine state.

#### `public void `[`register_mmio`](#classcartesi_1_1machine_1a81463067aab320d004319d9173d71989)`(uint64_t start,uint64_t length,pma_peek peek,void * context,const `[`pma_driver`](#structcartesi_1_1pma__driver)` * driver,`[`PMA_ISTART_DID`](#pma-constants_8h_1af1653605bf791b39ada81f1dbd923571)` DID)` 

Register a new memory-mapped IO device.

#### Parameters
* `start` Start of physical memory range in the target address space on which to map the device. 

* `length` Length of physical memory range in the target address space on which to map the device. 

* `peek` Peek callback for the range. 

* `context` Pointer to context to be passed to callbacks. 

* `driver` Pointer to driver with callbacks. 

* `DID` PMA device id.

#### `public void `[`register_shadow`](#classcartesi_1_1machine_1a02fbc7dd18511b6006473b1e524e0836)`(uint64_t start,uint64_t length,pma_peek peek,void * context,const `[`pma_driver`](#structcartesi_1_1pma__driver)` * driver)` 

Register a new shadow device.

#### Parameters
* `start` Start of physical memory range in the target address space on which to map the shadow device. 

* `length` Length of physical memory range in the target address space on which to map the shadow device. 

* `peek` Peek callback for the range. 

* `context` Pointer to context to be passed to callbacks. 

* `driver` Pointer to driver with callbacks.

#### `public void `[`dump`](#classcartesi_1_1machine_1a8f19e42ed383fa637d005ae05022551a)`(void) const` 

Dump all memory ranges to files in current working directory.

#### Returns
true if successful, false otherwise.

#### `public const boost::container::static_vector< `[`pma_entry`](#classcartesi_1_1pma__entry)`, PMA_MAX > & `[`get_pmas`](#classcartesi_1_1machine_1a6fe196f9a797747cf43f979d32f95a38)`(void) const` 

Get read-only access to container with all PMA entries.

#### Returns
The container.

#### `public void `[`interact`](#classcartesi_1_1machine_1af31c77a7fe1ea7cc08acfa387fca2942)`(void)` 

Interact with console.

#### `public bool `[`verify_dirty_page_maps`](#classcartesi_1_1machine_1a64f3b453d4ccc8d350627e98ebcd3476)`(void) const` 

Verify if dirty page maps are consistent.

#### Returns
true if they are, false if there is an error.

# class `cartesi::manager_client` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public  `[`manager_client`](#classcartesi_1_1manager__client_1affd147567be5fd563f14dce68b124c6e)`()` | 
`public void `[`register_on_manager`](#classcartesi_1_1manager__client_1a3b39320532dc84dc0869c43c828839f2)`(std::string & session_id,std::string & address,std::string & manager_address)` | Register the address to connect to an emulator grpc server on the core manager.

## Members

#### `public  `[`manager_client`](#classcartesi_1_1manager__client_1affd147567be5fd563f14dce68b124c6e)`()` 

#### `public void `[`register_on_manager`](#classcartesi_1_1manager__client_1a3b39320532dc84dc0869c43c828839f2)`(std::string & session_id,std::string & address,std::string & manager_address)` 

Register the address to connect to an emulator grpc server on the core manager.

#### Parameters
* `session_id` Session id of the emulator grpc server 

* `address` Address to connect to the emulator grpc server 

* `manager_address` Address of manager to register on

# class `cartesi::merkle_tree` 

Merkle tree implementation.

The [merkle_tree](#classcartesi_1_1merkle__tree) class implements a Merkle tree covering LOG2_TREE_SIZE bits of address space.

Upon creation, the memory is *pristine*, i.e., completely filled with zeros.

To optimize for space, subtrees corresponding to pristine memory are represented by `nullptr` nodes. Additionaly, the tree is truncated below *page* nodes subintending LOG2_PAGE_SIZE bits of address space. The trees corresponding to pages are rebuilt from the original data whenever needed and never stored. Pages are divided into *words* that cover LOG2_WORD_SIZE bits of address space. Tree leaves contain Keccak-256 hashes of individual words.

Tree contents are updated page-by-page using calls to [merkle_tree::begin_update](#classcartesi_1_1merkle__tree_1abafe32c55ab560aaac11c9a4c5f2290f), merkle_tree::update_page, ..., merkle_tree::update_page, [merkle_tree::end_update](#classcartesi_1_1merkle__tree_1a3a1601d930772e8d057ed2995d23505e).

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public bool `[`verify_tree`](#classcartesi_1_1merkle__tree_1ad32cae5b4c66f099e581267ef178f4be)`(void) const` | Verifies the entire Merkle tree.
`public  `[`merkle_tree`](#classcartesi_1_1merkle__tree_1a5d53a99259c4d68a933b13a5b526c12f)`(void)` | Default constructor.
`public  `[`merkle_tree`](#classcartesi_1_1merkle__tree_1acb6af6256ecc3c49b48751c71d558b17)`(const `[`merkle_tree`](#classcartesi_1_1merkle__tree)` &) = delete` | No copy constructor.
`public `[`merkle_tree`](#classcartesi_1_1merkle__tree)` & `[`operator=`](#classcartesi_1_1merkle__tree_1a2eb0469d82f0624042ef62791a103382)`(const `[`merkle_tree`](#classcartesi_1_1merkle__tree)` &) = delete` | No copy assignment.
`public  `[`merkle_tree`](#classcartesi_1_1merkle__tree_1a26e85630161847c47d8cf5ab2b3b6551)`(`[`merkle_tree`](#classcartesi_1_1merkle__tree)` &&) = delete` | No move constructor.
`public `[`merkle_tree`](#classcartesi_1_1merkle__tree)` & `[`operator=`](#classcartesi_1_1merkle__tree_1a416233b0480c49c9fb45f697d48f37ad)`(`[`merkle_tree`](#classcartesi_1_1merkle__tree)` &&) = delete` | No move assignment.
`public  `[`~merkle_tree`](#classcartesi_1_1merkle__tree_1aa8ffee79b8c42af0a5ae9109fec2d01c)`()` | Destructor.
`public bool `[`get_root_hash`](#classcartesi_1_1merkle__tree_1ad7b83d2e8312255827ee2c466de7fe25)`(`[`hash_type`](#classcartesi_1_1merkle__tree_1aecbed850344d160b6c9fc4bac0202a31)` & hash) const` | Returns the root hash.
`public bool `[`begin_update`](#classcartesi_1_1merkle__tree_1abafe32c55ab560aaac11c9a4c5f2290f)`(void)` | Start tree update.
`public bool `[`update_page_node_hash`](#classcartesi_1_1merkle__tree_1aa8f36449913512efc0c729a2fe368acc)`(address_type page_index,const `[`hash_type`](#classcartesi_1_1merkle__tree_1aecbed850344d160b6c9fc4bac0202a31)` & hash)` | Update tree with new hash for a page node.
`public bool `[`end_update`](#classcartesi_1_1merkle__tree_1a3a1601d930772e8d057ed2995d23505e)`(`[`hasher_type`](#classcartesi_1_1merkle__tree_1ab88eba46f371bddad3dee241d42a1661)` & h)` | End tree update.
`public bool `[`get_proof`](#classcartesi_1_1merkle__tree_1afa2f8be5ae16d0f73dc9d538e0456f30)`(address_type address,int log2_size,const unsigned char * page_data,`[`proof_type`](#structcartesi_1_1merkle__tree_1_1proof__type)` & proof) const` | Returns the proof for a node in the tree.
`public void `[`get_page_node_hash`](#classcartesi_1_1merkle__tree_1a9cc6b9c0760971266fad66939726a4a8)`(`[`hasher_type`](#classcartesi_1_1merkle__tree_1ab88eba46f371bddad3dee241d42a1661)` & h,const unsigned char * page_data,`[`hash_type`](#classcartesi_1_1merkle__tree_1aecbed850344d160b6c9fc4bac0202a31)` & hash) const` | Recursively builds hash for page node from contiguous memory.
`public const `[`hash_type`](#classcartesi_1_1merkle__tree_1aecbed850344d160b6c9fc4bac0202a31)` & `[`get_pristine_hash`](#classcartesi_1_1merkle__tree_1ab5143f3ace9762f72dd73497b3bc8edf)`(int log2_size) const` | Returns the hash for a log2_size pristine node.
`public void `[`get_page_node_hash`](#classcartesi_1_1merkle__tree_1af9bf90e0facdeb5c8799a04e99248b7b)`(address_type page_index,`[`hash_type`](#classcartesi_1_1merkle__tree_1aecbed850344d160b6c9fc4bac0202a31)` & hash) const` | Gets currently stored hash for page node.
`typedef `[`word_type`](#classcartesi_1_1merkle__tree_1aec736cd2d55fee169de631b102020302) | 
`typedef `[`address_type`](#classcartesi_1_1merkle__tree_1a4fb4aacd1874de00959f199a106bc500) | 
`typedef `[`hasher_type`](#classcartesi_1_1merkle__tree_1ab88eba46f371bddad3dee241d42a1661) | Hasher class.
`typedef `[`hash_type`](#classcartesi_1_1merkle__tree_1aecbed850344d160b6c9fc4bac0202a31) | Storage for a hash.
`typedef `[`siblings_type`](#classcartesi_1_1merkle__tree_1a8514be6b601f2364a90181876025d0ff) | Storage for the hashes of the siblings of all nodes along the path from the root to target node.

## Members

#### `public bool `[`verify_tree`](#classcartesi_1_1merkle__tree_1ad32cae5b4c66f099e581267ef178f4be)`(void) const` 

Verifies the entire Merkle tree.

#### Returns
True if tree is consistent, false otherwise.

#### `public  `[`merkle_tree`](#classcartesi_1_1merkle__tree_1a5d53a99259c4d68a933b13a5b526c12f)`(void)` 

Default constructor.

Initializes memory to zero.

#### `public  `[`merkle_tree`](#classcartesi_1_1merkle__tree_1acb6af6256ecc3c49b48751c71d558b17)`(const `[`merkle_tree`](#classcartesi_1_1merkle__tree)` &) = delete` 

No copy constructor.

#### `public `[`merkle_tree`](#classcartesi_1_1merkle__tree)` & `[`operator=`](#classcartesi_1_1merkle__tree_1a2eb0469d82f0624042ef62791a103382)`(const `[`merkle_tree`](#classcartesi_1_1merkle__tree)` &) = delete` 

No copy assignment.

#### `public  `[`merkle_tree`](#classcartesi_1_1merkle__tree_1a26e85630161847c47d8cf5ab2b3b6551)`(`[`merkle_tree`](#classcartesi_1_1merkle__tree)` &&) = delete` 

No move constructor.

#### `public `[`merkle_tree`](#classcartesi_1_1merkle__tree)` & `[`operator=`](#classcartesi_1_1merkle__tree_1a416233b0480c49c9fb45f697d48f37ad)`(`[`merkle_tree`](#classcartesi_1_1merkle__tree)` &&) = delete` 

No move assignment.

#### `public  `[`~merkle_tree`](#classcartesi_1_1merkle__tree_1aa8ffee79b8c42af0a5ae9109fec2d01c)`()` 

Destructor.

Releases all used memory

#### `public bool `[`get_root_hash`](#classcartesi_1_1merkle__tree_1ad7b83d2e8312255827ee2c466de7fe25)`(`[`hash_type`](#classcartesi_1_1merkle__tree_1aecbed850344d160b6c9fc4bac0202a31)` & hash) const` 

Returns the root hash.

#### Parameters
* `hash` Receives the hash. 

#### Returns
True.

#### `public bool `[`begin_update`](#classcartesi_1_1merkle__tree_1abafe32c55ab560aaac11c9a4c5f2290f)`(void)` 

Start tree update.

#### Returns
True.

This method is not thread safe, so be careful when using parallelization to compute Merkle trees

#### `public bool `[`update_page_node_hash`](#classcartesi_1_1merkle__tree_1aa8f36449913512efc0c729a2fe368acc)`(address_type page_index,const `[`hash_type`](#classcartesi_1_1merkle__tree_1aecbed850344d160b6c9fc4bac0202a31)` & hash)` 

Update tree with new hash for a page node.

#### Parameters
* `page_index` Page index for node. 

* `hash` New hash for node. 

#### Returns
True if succeeded, false otherwise.

This method is not thread safe, so be careful when using parallelization to compute Merkle trees

#### `public bool `[`end_update`](#classcartesi_1_1merkle__tree_1a3a1601d930772e8d057ed2995d23505e)`(`[`hasher_type`](#classcartesi_1_1merkle__tree_1ab88eba46f371bddad3dee241d42a1661)` & h)` 

End tree update.

#### Parameters
* `h` Hasher object. 

#### Returns
True if succeeded, false otherwise.

This method is not thread safe, so be careful when using parallelization to compute Merkle trees

#### `public bool `[`get_proof`](#classcartesi_1_1merkle__tree_1afa2f8be5ae16d0f73dc9d538e0456f30)`(address_type address,int log2_size,const unsigned char * page_data,`[`proof_type`](#structcartesi_1_1merkle__tree_1_1proof__type)` & proof) const` 

Returns the proof for a node in the tree.

#### Parameters
* `address` Address of target node. Must be aligned to a 2log2_size boundary. 

* `log2_size` log2 of size subintended by target node. Must be between LOG2_WORD_SIZE and LOG2_TREE_SIZE, inclusive. 

* `page_data` When log2_size smaller than LOG2_PAGE_SIZE, `page_data` must point to start of contiguous page containing the node, or nullptr if is the page is pristine (i.e., filled with zeros). 

* `proof` Receives proof. 

#### Returns
True if succeeded, false otherwise.

#### `public void `[`get_page_node_hash`](#classcartesi_1_1merkle__tree_1a9cc6b9c0760971266fad66939726a4a8)`(`[`hasher_type`](#classcartesi_1_1merkle__tree_1ab88eba46f371bddad3dee241d42a1661)` & h,const unsigned char * page_data,`[`hash_type`](#classcartesi_1_1merkle__tree_1aecbed850344d160b6c9fc4bac0202a31)` & hash) const` 

Recursively builds hash for page node from contiguous memory.

#### Parameters
* `h` Hasher object. 

* `page_data` Pointer to start of contiguous page data. 

* `hash` Receives the hash.

#### `public const `[`hash_type`](#classcartesi_1_1merkle__tree_1aecbed850344d160b6c9fc4bac0202a31)` & `[`get_pristine_hash`](#classcartesi_1_1merkle__tree_1ab5143f3ace9762f72dd73497b3bc8edf)`(int log2_size) const` 

Returns the hash for a log2_size pristine node.

#### Parameters
* `log2_size` log2 of size subintended by node. 

#### Returns
Reference to precomputed hash.

#### `public void `[`get_page_node_hash`](#classcartesi_1_1merkle__tree_1af9bf90e0facdeb5c8799a04e99248b7b)`(address_type page_index,`[`hash_type`](#classcartesi_1_1merkle__tree_1aecbed850344d160b6c9fc4bac0202a31)` & hash) const` 

Gets currently stored hash for page node.

#### Parameters
* `h` Hasher object. 

* `page_index` Page index for node. 

* `hash` Receives the hash.

#### `typedef `[`word_type`](#classcartesi_1_1merkle__tree_1aec736cd2d55fee169de631b102020302) 

#### `typedef `[`address_type`](#classcartesi_1_1merkle__tree_1a4fb4aacd1874de00959f199a106bc500) 

#### `typedef `[`hasher_type`](#classcartesi_1_1merkle__tree_1ab88eba46f371bddad3dee241d42a1661) 

Hasher class.

#### `typedef `[`hash_type`](#classcartesi_1_1merkle__tree_1aecbed850344d160b6c9fc4bac0202a31) 

Storage for a hash.

#### `typedef `[`siblings_type`](#classcartesi_1_1merkle__tree_1a8514be6b601f2364a90181876025d0ff) 

Storage for the hashes of the siblings of all nodes along the path from the root to target node.

# class `cartesi::pma_device` 

Data for IO ranges.

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`pma_device`](#classcartesi_1_1pma__device_1acae8401c9184d9820dcd05ed7fcee585)`(void * context,const `[`pma_driver`](#structcartesi_1_1pma__driver)` * driver)` | Constructor from entries.
`public inline void * `[`get_context`](#classcartesi_1_1pma__device_1a378a91cce0b8429b69fd72ce75afadce)`(void)` | Returns context to pass to callbacks.
`public inline void * `[`get_context`](#classcartesi_1_1pma__device_1a5329cd2811bd2f1e49352445b689e889)`(void) const` | Returns context to pass to callbacks.
`public inline const `[`pma_driver`](#structcartesi_1_1pma__driver)` * `[`get_driver`](#classcartesi_1_1pma__device_1a3e3e9a45e2ab80d14b310ba30b5165ee)`(void) const` | Returns driver with callbacks.

## Members

#### `public inline  `[`pma_device`](#classcartesi_1_1pma__device_1acae8401c9184d9820dcd05ed7fcee585)`(void * context,const `[`pma_driver`](#structcartesi_1_1pma__driver)` * driver)` 

Constructor from entries.

#### Parameters
* `context` [Context](#struct_context) to pass to callbacks. 

* `driver` Driver with callbacks.

#### `public inline void * `[`get_context`](#classcartesi_1_1pma__device_1a378a91cce0b8429b69fd72ce75afadce)`(void)` 

Returns context to pass to callbacks.

#### `public inline void * `[`get_context`](#classcartesi_1_1pma__device_1a5329cd2811bd2f1e49352445b689e889)`(void) const` 

Returns context to pass to callbacks.

#### `public inline const `[`pma_driver`](#structcartesi_1_1pma__driver)` * `[`get_driver`](#classcartesi_1_1pma__device_1a3e3e9a45e2ab80d14b310ba30b5165ee)`(void) const` 

Returns driver with callbacks.

# class `cartesi::pma_entry` 

Physical Memory Attribute entry.

The target's physical memory layout is described by an array of PMA entries.

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public  `[`pma_entry`](#classcartesi_1_1pma__entry_1ad5075a8560228727ae9e55eac26ace92)`(const `[`pma_entry`](#classcartesi_1_1pma__entry)` &) = delete` | No copy constructor.
`public `[`pma_entry`](#classcartesi_1_1pma__entry)` & `[`operator=`](#classcartesi_1_1pma__entry_1a3d5529d52f7a03fa2097f39f5a923a64)`(const `[`pma_entry`](#classcartesi_1_1pma__entry)` &) = delete` | No copy assignment.
`public  `[`pma_entry`](#classcartesi_1_1pma__entry_1a30c6e36cde6f53458479ab2246fbf7df)`(`[`pma_entry`](#classcartesi_1_1pma__entry)` &&) = default` | Default move constructor.
`public `[`pma_entry`](#classcartesi_1_1pma__entry)` & `[`operator=`](#classcartesi_1_1pma__entry_1a3cf772863f6a4d87fb14d8e389e359e3)`(`[`pma_entry`](#classcartesi_1_1pma__entry)` &&) = default` | Default move assignment.
`public inline  `[`pma_entry`](#classcartesi_1_1pma__entry_1a46ad52a38fe0be455249e713e4ab49cf)`(uint64_t start,uint64_t length)` | Constructor for empty entry.
`public inline  `[`pma_entry`](#classcartesi_1_1pma__entry_1a35afc9636bb69f506fe140af5c9b4683)`(void)` | Default constructor creates an empty entry spanning an empty range.
`public inline  explicit `[`pma_entry`](#classcartesi_1_1pma__entry_1a34d8ca223c28db7d4b17f49c2efb12b3)`(uint64_t start,uint64_t length,`[`pma_memory`](#classcartesi_1_1pma__memory)` && memory,pma_peek peek)` | Constructor for memory entry.
`public inline  explicit `[`pma_entry`](#classcartesi_1_1pma__entry_1a561e267be105367637baa76f30afc059)`(uint64_t start,uint64_t length,`[`pma_device`](#classcartesi_1_1pma__device)` && device,pma_peek peek)` | Constructor for device entry.
`public inline `[`pma_entry`](#classcartesi_1_1pma__entry)` & `[`set_flags`](#classcartesi_1_1pma__entry_1a53d423ce5aac101d625af07d536a23ac)`(`[`flags`](#structcartesi_1_1pma__entry_1_1flags)` f)` | Set flags for lvalue references \params f New flags.
`public inline `[`pma_entry`](#classcartesi_1_1pma__entry)` && `[`set_flags`](#classcartesi_1_1pma__entry_1a164cd943536d95db623cc915606dc6e1)`(`[`flags`](#structcartesi_1_1pma__entry_1_1flags)` f)` | Set flags for rvalue references \params f New flags.
`public inline pma_peek `[`get_peek`](#classcartesi_1_1pma__entry_1a3ee525f01ec67887172571f334da462c)`(void) const` | Returns the peek callback for the range.
`public inline const `[`pma_empty`](#structcartesi_1_1pma__empty)` & `[`get_empty`](#classcartesi_1_1pma__entry_1a734e7f7540858806d8ecd31c513641fa)`(void) const` | \Returns data specific to E ranges
`public inline `[`pma_empty`](#structcartesi_1_1pma__empty)` & `[`get_empty`](#classcartesi_1_1pma__entry_1a6e8018ec514bcfc3d007f281ee4c8404)`(void)` | \Returns data specific to E ranges
`public inline const `[`pma_memory`](#classcartesi_1_1pma__memory)` & `[`get_memory`](#classcartesi_1_1pma__entry_1a47d943dbb6c0151ac739375eb0cc5123)`(void) const` | \Returns data specific to M ranges
`public inline `[`pma_memory`](#classcartesi_1_1pma__memory)` & `[`get_memory`](#classcartesi_1_1pma__entry_1a36bcfa13d3644c8692e8bbae9e35e5f6)`(void)` | \Returns data specific to M ranges
`public inline const `[`pma_device`](#classcartesi_1_1pma__device)` & `[`get_device`](#classcartesi_1_1pma__entry_1abc233d67fba914d02fa066fb58436569)`(void) const` | \Returns data specific to IO ranges
`public inline `[`pma_device`](#classcartesi_1_1pma__device)` & `[`get_device`](#classcartesi_1_1pma__entry_1aed90b9ba338b03faa8b012d79c3445b3)`(void)` | \Returns data specific to IO ranges
`public uint64_t `[`get_istart`](#classcartesi_1_1pma__entry_1acef109301cbc89c8d6a62abe08a26afa)`(void) const` | Returns packed PMA istart field as per whitepaper.
`public inline uint64_t `[`get_start`](#classcartesi_1_1pma__entry_1a2e759f32d7b19a50fbb4eca402f5d65b)`(void) const` | Returns start of physical memory range in target.
`public inline uint64_t `[`get_length`](#classcartesi_1_1pma__entry_1ad03992ded16b4e1d6f58f77b382afe94)`(void) const` | Returns length of physical memory range in target.
`public uint64_t `[`get_ilength`](#classcartesi_1_1pma__entry_1ad8e0a1f72f14bd7f02c42932f6e01a30)`(void) const` | Returns encoded PMA ilength field as per whitepaper.
`public inline bool `[`get_istart_M`](#classcartesi_1_1pma__entry_1a8fecd044a51a8ab8e9af0f2feba168d7)`(void) const` | Tells if PMA is a memory range.
`public inline bool `[`get_istart_IO`](#classcartesi_1_1pma__entry_1abc4f7e62b4e612c0617b80d2d8fe8c34)`(void) const` | Tells if PMA is a device range.
`public inline bool `[`get_istart_E`](#classcartesi_1_1pma__entry_1a15eec7c747f7ed933adf3552948f6eab)`(void) const` | Tells if PMA is an empty range.
`public inline bool `[`get_istart_R`](#classcartesi_1_1pma__entry_1aa192661fe92e8121ea11e40a8ccc9139)`(void) const` | Tells if PMA range is readable.
`public inline bool `[`get_istart_W`](#classcartesi_1_1pma__entry_1afa2ebcbf79e81cddbdb1e40bc57e2a79)`(void) const` | Tells if PMA range is writable.
`public inline bool `[`get_istart_X`](#classcartesi_1_1pma__entry_1a9a9db2a86cc4550d69019ecd4fa6fad8)`(void) const` | Tells if PMA range is executable.
`public inline bool `[`get_istart_IR`](#classcartesi_1_1pma__entry_1adccd8b75e0213e6001ecca778e9618c6)`(void) const` | Tells if reads to PMA range are idempotent.
`public inline bool `[`get_istart_IW`](#classcartesi_1_1pma__entry_1a255b2a60fde792bf39a9c7a3324444f9)`(void) const` | Tells if writes to PMA range are idempotent.
`public inline `[`PMA_ISTART_DID`](#pma-constants_8h_1af1653605bf791b39ada81f1dbd923571)` `[`get_istart_DID`](#classcartesi_1_1pma__entry_1ac8e4d047188a767cfd67eeb4fd52e17d)`(void) const` | Returns the id of the device that owns the range.
`public inline void `[`mark_dirty_page`](#classcartesi_1_1pma__entry_1a9ec8cab8dc34ef51026ec38d14ee6bbd)`(uint64_t address_in_range)` | Mark a given page as dirty.
`public inline void `[`mark_clean_page`](#classcartesi_1_1pma__entry_1a7363e761540535d9f9719cc4b5384386)`(uint64_t address_in_range)` | Mark a given page as clean.
`public inline bool `[`is_page_marked_dirty`](#classcartesi_1_1pma__entry_1a8746b70b69800473f5070b8c6964a95e)`(uint64_t address_in_range) const` | Checks if a given page is marked dirty.
`public inline void `[`mark_pages_clean`](#classcartesi_1_1pma__entry_1a09224480bc6ef03a0b77093286d568cc)`(void)` | Marks all pages in range as clean.

## Members

#### `public  `[`pma_entry`](#classcartesi_1_1pma__entry_1ad5075a8560228727ae9e55eac26ace92)`(const `[`pma_entry`](#classcartesi_1_1pma__entry)` &) = delete` 

No copy constructor.

#### `public `[`pma_entry`](#classcartesi_1_1pma__entry)` & `[`operator=`](#classcartesi_1_1pma__entry_1a3d5529d52f7a03fa2097f39f5a923a64)`(const `[`pma_entry`](#classcartesi_1_1pma__entry)` &) = delete` 

No copy assignment.

#### `public  `[`pma_entry`](#classcartesi_1_1pma__entry_1a30c6e36cde6f53458479ab2246fbf7df)`(`[`pma_entry`](#classcartesi_1_1pma__entry)` &&) = default` 

Default move constructor.

#### `public `[`pma_entry`](#classcartesi_1_1pma__entry)` & `[`operator=`](#classcartesi_1_1pma__entry_1a3cf772863f6a4d87fb14d8e389e359e3)`(`[`pma_entry`](#classcartesi_1_1pma__entry)` &&) = default` 

Default move assignment.

#### `public inline  `[`pma_entry`](#classcartesi_1_1pma__entry_1a46ad52a38fe0be455249e713e4ab49cf)`(uint64_t start,uint64_t length)` 

Constructor for empty entry.

#### `public inline  `[`pma_entry`](#classcartesi_1_1pma__entry_1a35afc9636bb69f506fe140af5c9b4683)`(void)` 

Default constructor creates an empty entry spanning an empty range.

#### `public inline  explicit `[`pma_entry`](#classcartesi_1_1pma__entry_1a34d8ca223c28db7d4b17f49c2efb12b3)`(uint64_t start,uint64_t length,`[`pma_memory`](#classcartesi_1_1pma__memory)` && memory,pma_peek peek)` 

Constructor for memory entry.

#### `public inline  explicit `[`pma_entry`](#classcartesi_1_1pma__entry_1a561e267be105367637baa76f30afc059)`(uint64_t start,uint64_t length,`[`pma_device`](#classcartesi_1_1pma__device)` && device,pma_peek peek)` 

Constructor for device entry.

#### `public inline `[`pma_entry`](#classcartesi_1_1pma__entry)` & `[`set_flags`](#classcartesi_1_1pma__entry_1a53d423ce5aac101d625af07d536a23ac)`(`[`flags`](#structcartesi_1_1pma__entry_1_1flags)` f)` 

Set flags for lvalue references \params f New flags.

#### `public inline `[`pma_entry`](#classcartesi_1_1pma__entry)` && `[`set_flags`](#classcartesi_1_1pma__entry_1a164cd943536d95db623cc915606dc6e1)`(`[`flags`](#structcartesi_1_1pma__entry_1_1flags)` f)` 

Set flags for rvalue references \params f New flags.

#### `public inline pma_peek `[`get_peek`](#classcartesi_1_1pma__entry_1a3ee525f01ec67887172571f334da462c)`(void) const` 

Returns the peek callback for the range.

#### `public inline const `[`pma_empty`](#structcartesi_1_1pma__empty)` & `[`get_empty`](#classcartesi_1_1pma__entry_1a734e7f7540858806d8ecd31c513641fa)`(void) const` 

\Returns data specific to E ranges

#### `public inline `[`pma_empty`](#structcartesi_1_1pma__empty)` & `[`get_empty`](#classcartesi_1_1pma__entry_1a6e8018ec514bcfc3d007f281ee4c8404)`(void)` 

\Returns data specific to E ranges

#### `public inline const `[`pma_memory`](#classcartesi_1_1pma__memory)` & `[`get_memory`](#classcartesi_1_1pma__entry_1a47d943dbb6c0151ac739375eb0cc5123)`(void) const` 

\Returns data specific to M ranges

#### `public inline `[`pma_memory`](#classcartesi_1_1pma__memory)` & `[`get_memory`](#classcartesi_1_1pma__entry_1a36bcfa13d3644c8692e8bbae9e35e5f6)`(void)` 

\Returns data specific to M ranges

#### `public inline const `[`pma_device`](#classcartesi_1_1pma__device)` & `[`get_device`](#classcartesi_1_1pma__entry_1abc233d67fba914d02fa066fb58436569)`(void) const` 

\Returns data specific to IO ranges

#### `public inline `[`pma_device`](#classcartesi_1_1pma__device)` & `[`get_device`](#classcartesi_1_1pma__entry_1aed90b9ba338b03faa8b012d79c3445b3)`(void)` 

\Returns data specific to IO ranges

#### `public uint64_t `[`get_istart`](#classcartesi_1_1pma__entry_1acef109301cbc89c8d6a62abe08a26afa)`(void) const` 

Returns packed PMA istart field as per whitepaper.

#### `public inline uint64_t `[`get_start`](#classcartesi_1_1pma__entry_1a2e759f32d7b19a50fbb4eca402f5d65b)`(void) const` 

Returns start of physical memory range in target.

#### `public inline uint64_t `[`get_length`](#classcartesi_1_1pma__entry_1ad03992ded16b4e1d6f58f77b382afe94)`(void) const` 

Returns length of physical memory range in target.

#### `public uint64_t `[`get_ilength`](#classcartesi_1_1pma__entry_1ad8e0a1f72f14bd7f02c42932f6e01a30)`(void) const` 

Returns encoded PMA ilength field as per whitepaper.

#### `public inline bool `[`get_istart_M`](#classcartesi_1_1pma__entry_1a8fecd044a51a8ab8e9af0f2feba168d7)`(void) const` 

Tells if PMA is a memory range.

#### `public inline bool `[`get_istart_IO`](#classcartesi_1_1pma__entry_1abc4f7e62b4e612c0617b80d2d8fe8c34)`(void) const` 

Tells if PMA is a device range.

#### `public inline bool `[`get_istart_E`](#classcartesi_1_1pma__entry_1a15eec7c747f7ed933adf3552948f6eab)`(void) const` 

Tells if PMA is an empty range.

#### `public inline bool `[`get_istart_R`](#classcartesi_1_1pma__entry_1aa192661fe92e8121ea11e40a8ccc9139)`(void) const` 

Tells if PMA range is readable.

#### `public inline bool `[`get_istart_W`](#classcartesi_1_1pma__entry_1afa2ebcbf79e81cddbdb1e40bc57e2a79)`(void) const` 

Tells if PMA range is writable.

#### `public inline bool `[`get_istart_X`](#classcartesi_1_1pma__entry_1a9a9db2a86cc4550d69019ecd4fa6fad8)`(void) const` 

Tells if PMA range is executable.

#### `public inline bool `[`get_istart_IR`](#classcartesi_1_1pma__entry_1adccd8b75e0213e6001ecca778e9618c6)`(void) const` 

Tells if reads to PMA range are idempotent.

#### `public inline bool `[`get_istart_IW`](#classcartesi_1_1pma__entry_1a255b2a60fde792bf39a9c7a3324444f9)`(void) const` 

Tells if writes to PMA range are idempotent.

#### `public inline `[`PMA_ISTART_DID`](#pma-constants_8h_1af1653605bf791b39ada81f1dbd923571)` `[`get_istart_DID`](#classcartesi_1_1pma__entry_1ac8e4d047188a767cfd67eeb4fd52e17d)`(void) const` 

Returns the id of the device that owns the range.

#### `public inline void `[`mark_dirty_page`](#classcartesi_1_1pma__entry_1a9ec8cab8dc34ef51026ec38d14ee6bbd)`(uint64_t address_in_range)` 

Mark a given page as dirty.

#### Parameters
* `address_in_range` Any address within page in range

#### `public inline void `[`mark_clean_page`](#classcartesi_1_1pma__entry_1a7363e761540535d9f9719cc4b5384386)`(uint64_t address_in_range)` 

Mark a given page as clean.

#### Parameters
* `address_in_range` Any address within page in range

#### `public inline bool `[`is_page_marked_dirty`](#classcartesi_1_1pma__entry_1a8746b70b69800473f5070b8c6964a95e)`(uint64_t address_in_range) const` 

Checks if a given page is marked dirty.

#### Parameters
* `address_in_range` Any address within page in range \regurns true if dirty, false if clean

#### `public inline void `[`mark_pages_clean`](#classcartesi_1_1pma__entry_1a09224480bc6ef03a0b77093286d568cc)`(void)` 

Marks all pages in range as clean.

# class `cartesi::pma_memory` 

Data for memory ranges.

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public  `[`pma_memory`](#classcartesi_1_1pma__memory_1af500b141f805aef0c54484ee1e115be6)`(uint64_t length,const std::string & path,const `[`mmapd`](#structcartesi_1_1pma__memory_1_1mmapd)` & m)` | Constructor for mmap'd ranges.
`public  `[`pma_memory`](#classcartesi_1_1pma__memory_1ae32a5c83ce6328bfbd52ee22c66f61cb)`(uint64_t length,const std::string & path,const `[`callocd`](#structcartesi_1_1pma__memory_1_1callocd)` & c)` | Constructor for calloc'd ranges.
`public  `[`pma_memory`](#classcartesi_1_1pma__memory_1a396e321b679f45fff6060de164b97506)`(uint64_t length,const `[`callocd`](#structcartesi_1_1pma__memory_1_1callocd)` & c)` | Constructor for calloc'd ranges.
`public  `[`pma_memory`](#classcartesi_1_1pma__memory_1a27bd4dd3951dbe245325b068b67818aa)`(const `[`pma_memory`](#classcartesi_1_1pma__memory)` &) = delete` | No copy constructor.
`public `[`pma_memory`](#classcartesi_1_1pma__memory)` & `[`operator=`](#classcartesi_1_1pma__memory_1a299e10cf736e18a248bd1924901ebee3)`(const `[`pma_memory`](#classcartesi_1_1pma__memory)` &) = delete` | No copy assignment.
`public  `[`pma_memory`](#classcartesi_1_1pma__memory_1a890f6ae6ecadcae0453c0af0c72041c6)`(`[`pma_memory`](#classcartesi_1_1pma__memory)` &&)` | Move assignment.
`public `[`pma_memory`](#classcartesi_1_1pma__memory)` & `[`operator=`](#classcartesi_1_1pma__memory_1a4a6a7d3d373058943b92814d958f7973)`(`[`pma_memory`](#classcartesi_1_1pma__memory)` &&)` | Move constructor.
`public  `[`~pma_memory`](#classcartesi_1_1pma__memory_1aec462d202f8e6a3286f4d9cb652fc35e)`(void)` | Destructor.
`public inline unsigned char * `[`get_host_memory`](#classcartesi_1_1pma__memory_1aa5484807e0e313958fca67c9a4e53525)`(void)` | Returns start of associated memory region in host.
`public inline const unsigned char * `[`get_host_memory`](#classcartesi_1_1pma__memory_1a32300cb12d7d04fa73fae1120e479c92)`(void) const` | Returns start of associated memory region in host.
`public inline int `[`get_backing_file`](#classcartesi_1_1pma__memory_1ab273a95fd63a1f03249e9e1c27ea6e70)`(void) const` | Returns file descryptor for mmaped memory.
`public inline int `[`get_length`](#classcartesi_1_1pma__memory_1a9ad5d321bba1979451d3cd4fcb7ff6f1)`(void) const` | Returns copy of PMA length field (needed for munmap).

## Members

#### `public  `[`pma_memory`](#classcartesi_1_1pma__memory_1af500b141f805aef0c54484ee1e115be6)`(uint64_t length,const std::string & path,const `[`mmapd`](#structcartesi_1_1pma__memory_1_1mmapd)` & m)` 

Constructor for mmap'd ranges.

#### Parameters
* `length` of range. 

* `path` Path for backing file. 

* `m` Mmap'd range data (shared or not).

#### `public  `[`pma_memory`](#classcartesi_1_1pma__memory_1ae32a5c83ce6328bfbd52ee22c66f61cb)`(uint64_t length,const std::string & path,const `[`callocd`](#structcartesi_1_1pma__memory_1_1callocd)` & c)` 

Constructor for calloc'd ranges.

#### Parameters
* `length` of range. 

* `path` Path for backing file. 

* `c` Calloc'd range data (just a tag).

#### `public  `[`pma_memory`](#classcartesi_1_1pma__memory_1a396e321b679f45fff6060de164b97506)`(uint64_t length,const `[`callocd`](#structcartesi_1_1pma__memory_1_1callocd)` & c)` 

Constructor for calloc'd ranges.

#### Parameters
* `length` of range. 

* `c` Calloc'd range data (just a tag).

#### `public  `[`pma_memory`](#classcartesi_1_1pma__memory_1a27bd4dd3951dbe245325b068b67818aa)`(const `[`pma_memory`](#classcartesi_1_1pma__memory)` &) = delete` 

No copy constructor.

#### `public `[`pma_memory`](#classcartesi_1_1pma__memory)` & `[`operator=`](#classcartesi_1_1pma__memory_1a299e10cf736e18a248bd1924901ebee3)`(const `[`pma_memory`](#classcartesi_1_1pma__memory)` &) = delete` 

No copy assignment.

#### `public  `[`pma_memory`](#classcartesi_1_1pma__memory_1a890f6ae6ecadcae0453c0af0c72041c6)`(`[`pma_memory`](#classcartesi_1_1pma__memory)` &&)` 

Move assignment.

#### `public `[`pma_memory`](#classcartesi_1_1pma__memory)` & `[`operator=`](#classcartesi_1_1pma__memory_1a4a6a7d3d373058943b92814d958f7973)`(`[`pma_memory`](#classcartesi_1_1pma__memory)` &&)` 

Move constructor.

#### `public  `[`~pma_memory`](#classcartesi_1_1pma__memory_1aec462d202f8e6a3286f4d9cb652fc35e)`(void)` 

Destructor.

#### `public inline unsigned char * `[`get_host_memory`](#classcartesi_1_1pma__memory_1aa5484807e0e313958fca67c9a4e53525)`(void)` 

Returns start of associated memory region in host.

#### `public inline const unsigned char * `[`get_host_memory`](#classcartesi_1_1pma__memory_1a32300cb12d7d04fa73fae1120e479c92)`(void) const` 

Returns start of associated memory region in host.

#### `public inline int `[`get_backing_file`](#classcartesi_1_1pma__memory_1ab273a95fd63a1f03249e9e1c27ea6e70)`(void) const` 

Returns file descryptor for mmaped memory.

#### `public inline int `[`get_length`](#classcartesi_1_1pma__memory_1a9ad5d321bba1979451d3cd4fcb7ff6f1)`(void) const` 

Returns copy of PMA length field (needed for munmap).

# class `cartesi::remove_cvref` 

Provides a member typedef type with reference and topmost cv-qualifiers removed.

(This is directly available in C++20.)

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`typedef `[`type`](#structcartesi_1_1remove__cvref_1ad0ba8f087217eae691089b75d16d58a9) | 

## Members

#### `typedef `[`type`](#structcartesi_1_1remove__cvref_1ad0ba8f087217eae691089b75d16d58a9) 

# class `cartesi::size_log2` 

Provides an int member value with the log2 of size of `T`.

#### Parameters
* `T` Type from which the size is needed.

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------

## Members

# class `cartesi::state_access` 

```
class cartesi::state_access
  : public cartesi::i_state_access< state_access >
```  

The [state_access](#classcartesi_1_1state__access) class implements fast, direct access to the machine state. No logs are kept.

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  explicit `[`state_access`](#classcartesi_1_1state__access_1abade270e3de785714c02d83c9fa1f5ea)`(`[`machine`](#classcartesi_1_1machine)` & m)` | Constructor from machine state.
`public  `[`state_access`](#classcartesi_1_1state__access_1a3243950ca02b507be95fba55d58f040a)`(const `[`state_access`](#classcartesi_1_1state__access)` &) = delete` | No copy constructor.
`public `[`state_access`](#classcartesi_1_1state__access)` & `[`operator=`](#classcartesi_1_1state__access_1ac71175e3624788a92047be56f955d86f)`(const `[`state_access`](#classcartesi_1_1state__access)` &) = delete` | No copy assignment.
`public  `[`state_access`](#classcartesi_1_1state__access_1a88ec074302278f621f806878a421b946)`(`[`state_access`](#classcartesi_1_1state__access)` &&) = delete` | No move constructor.
`public `[`state_access`](#classcartesi_1_1state__access)` & `[`operator=`](#classcartesi_1_1state__access_1a56fc0e7c67fd098ee79b0f037f9447da)`(`[`state_access`](#classcartesi_1_1state__access)` &&) = delete` | No move assignment.

## Members

#### `public inline  explicit `[`state_access`](#classcartesi_1_1state__access_1abade270e3de785714c02d83c9fa1f5ea)`(`[`machine`](#classcartesi_1_1machine)` & m)` 

Constructor from machine state.

#### Parameters
* `s` Pointer to machine state.

#### `public  `[`state_access`](#classcartesi_1_1state__access_1a3243950ca02b507be95fba55d58f040a)`(const `[`state_access`](#classcartesi_1_1state__access)` &) = delete` 

No copy constructor.

#### `public `[`state_access`](#classcartesi_1_1state__access)` & `[`operator=`](#classcartesi_1_1state__access_1ac71175e3624788a92047be56f955d86f)`(const `[`state_access`](#classcartesi_1_1state__access)` &) = delete` 

No copy assignment.

#### `public  `[`state_access`](#classcartesi_1_1state__access_1a88ec074302278f621f806878a421b946)`(`[`state_access`](#classcartesi_1_1state__access)` &&) = delete` 

No move constructor.

#### `public `[`state_access`](#classcartesi_1_1state__access)` & `[`operator=`](#classcartesi_1_1state__access_1a56fc0e7c67fd098ee79b0f037f9447da)`(`[`state_access`](#classcartesi_1_1state__access)` &&) = delete` 

No move assignment.

# class `cartesi::virtual_state_access` 

```
class cartesi::virtual_state_access
  : public cartesi::i_virtual_state_access
```  

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  explicit `[`virtual_state_access`](#classcartesi_1_1virtual__state__access_1ade04acc7601c4ff5b7d40967fa3d3d14)`(STATE_ACCESS & a)` | 
`public  `[`virtual_state_access`](#classcartesi_1_1virtual__state__access_1a44ab41dc896e957b4a1b480ed9cb3866)`(const `[`virtual_state_access`](#classcartesi_1_1virtual__state__access)` &) = delete` | No copy constructor.
`public `[`virtual_state_access`](#classcartesi_1_1virtual__state__access)` & `[`operator=`](#classcartesi_1_1virtual__state__access_1a2116917a3e6adeef5c36d30d5084086c)`(const `[`virtual_state_access`](#classcartesi_1_1virtual__state__access)` &) = delete` | No copy assignment.
`public  `[`virtual_state_access`](#classcartesi_1_1virtual__state__access_1a9e8e0dfdf6aa693c1359b945b4c3f417)`(`[`virtual_state_access`](#classcartesi_1_1virtual__state__access)` &&) = delete` | No move constructor.
`public `[`virtual_state_access`](#classcartesi_1_1virtual__state__access)` & `[`operator=`](#classcartesi_1_1virtual__state__access_1a3d5e6fa5ec2f8deb870a2ae9aa64d396)`(`[`virtual_state_access`](#classcartesi_1_1virtual__state__access)` &&) = delete` | No move assignment.

## Members

#### `public inline  explicit `[`virtual_state_access`](#classcartesi_1_1virtual__state__access_1ade04acc7601c4ff5b7d40967fa3d3d14)`(STATE_ACCESS & a)` 

#### `public  `[`virtual_state_access`](#classcartesi_1_1virtual__state__access_1a44ab41dc896e957b4a1b480ed9cb3866)`(const `[`virtual_state_access`](#classcartesi_1_1virtual__state__access)` &) = delete` 

No copy constructor.

#### `public `[`virtual_state_access`](#classcartesi_1_1virtual__state__access)` & `[`operator=`](#classcartesi_1_1virtual__state__access_1a2116917a3e6adeef5c36d30d5084086c)`(const `[`virtual_state_access`](#classcartesi_1_1virtual__state__access)` &) = delete` 

No copy assignment.

#### `public  `[`virtual_state_access`](#classcartesi_1_1virtual__state__access_1a9e8e0dfdf6aa693c1359b945b4c3f417)`(`[`virtual_state_access`](#classcartesi_1_1virtual__state__access)` &&) = delete` 

No move constructor.

#### `public `[`virtual_state_access`](#classcartesi_1_1virtual__state__access)` & `[`operator=`](#classcartesi_1_1virtual__state__access_1a3d5e6fa5ec2f8deb870a2ae9aa64d396)`(`[`virtual_state_access`](#classcartesi_1_1virtual__state__access)` &&) = delete` 

No move assignment.

# class `cartesi::xkcp_keccak_256_hasher` 

```
class cartesi::xkcp_keccak_256_hasher
  : public cartesi::i_hasher< xkcp_keccak_256_hasher, 32 >
```  

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public  `[`xkcp_keccak_256_hasher`](#classcartesi_1_1xkcp__keccak__256__hasher_1a357147c450cbbd27cffb7c1e9f755445)`(void) = default` | Default constructor.

## Members

#### `public  `[`xkcp_keccak_256_hasher`](#classcartesi_1_1xkcp__keccak__256__hasher_1a357147c450cbbd27cffb7c1e9f755445)`(void) = default` 

Default constructor.

# struct `cartesi::avoid_tlb` 

Type-trait selecting the use of TLB while accessing memory in the state.

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------

## Members

# struct `cartesi::avoid_tlb< logged_state_access >` 

Type-trait preventing the use of TLB while accessing memory in the state.

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------

## Members

# struct `cartesi::bracket_note` 

Bracket note.

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public `[`bracket_type`](#bracket-note_8h_1aea6e9de496553fd9ecfd2321240e1f52)` `[`type`](#structcartesi_1_1bracket__note_1ad822ade7d43021bbddbc929491ea9cd4) | Bracket type.
`public size_t `[`where`](#structcartesi_1_1bracket__note_1a394463718d934cc2e46cc40a25c5cad9) | Where it points to in the log.
`public std::string `[`text`](#structcartesi_1_1bracket__note_1a546bbaa1f6b02dfd82b65d5aef22054c) | Note text.

## Members

#### `public `[`bracket_type`](#bracket-note_8h_1aea6e9de496553fd9ecfd2321240e1f52)` `[`type`](#structcartesi_1_1bracket__note_1ad822ade7d43021bbddbc929491ea9cd4) 

Bracket type.

#### `public size_t `[`where`](#structcartesi_1_1bracket__note_1a394463718d934cc2e46cc40a25c5cad9) 

Where it points to in the log.

#### `public std::string `[`text`](#structcartesi_1_1bracket__note_1a546bbaa1f6b02dfd82b65d5aef22054c) 

Note text.

# struct `cartesi::clint_config` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public uint64_t `[`mtimecmp`](#structcartesi_1_1clint__config_1a1d9aa504059f5dc37defd481f8aa2ba6) | 
`public std::string `[`backing`](#structcartesi_1_1clint__config_1a7ba36028feaaadc0d3153f6c58c83bda) | 

## Members

#### `public uint64_t `[`mtimecmp`](#structcartesi_1_1clint__config_1a1d9aa504059f5dc37defd481f8aa2ba6) 

#### `public std::string `[`backing`](#structcartesi_1_1clint__config_1a7ba36028feaaadc0d3153f6c58c83bda) 

# struct `cartesi::flash_config` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public uint64_t `[`start`](#structcartesi_1_1flash__config_1a7b61166ee29c649cf4ffe613af7e3fa5) | 
`public uint64_t `[`length`](#structcartesi_1_1flash__config_1a46517fc03f0b7b7701ed9461e314f8be) | 
`public bool `[`shared`](#structcartesi_1_1flash__config_1aa824e792a54bf8e3e453a3500b778274) | 
`public std::string `[`backing`](#structcartesi_1_1flash__config_1a78bdbe4d1d82e42b72bc1c5711de8411) | 

## Members

#### `public uint64_t `[`start`](#structcartesi_1_1flash__config_1a7b61166ee29c649cf4ffe613af7e3fa5) 

#### `public uint64_t `[`length`](#structcartesi_1_1flash__config_1a46517fc03f0b7b7701ed9461e314f8be) 

#### `public bool `[`shared`](#structcartesi_1_1flash__config_1aa824e792a54bf8e3e453a3500b778274) 

#### `public std::string `[`backing`](#structcartesi_1_1flash__config_1a78bdbe4d1d82e42b72bc1c5711de8411) 

# struct `cartesi::htif_config` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public uint64_t `[`fromhost`](#structcartesi_1_1htif__config_1a962a6bf6f52d0251d4b110e2e0e36717) | 
`public uint64_t `[`tohost`](#structcartesi_1_1htif__config_1ace126ba64bea99019148df915e701c8a) | 
`public std::string `[`backing`](#structcartesi_1_1htif__config_1a329aced776de1568e8d5c7032a472559) | 

## Members

#### `public uint64_t `[`fromhost`](#structcartesi_1_1htif__config_1a962a6bf6f52d0251d4b110e2e0e36717) 

#### `public uint64_t `[`tohost`](#structcartesi_1_1htif__config_1ace126ba64bea99019148df915e701c8a) 

#### `public std::string `[`backing`](#structcartesi_1_1htif__config_1a329aced776de1568e8d5c7032a472559) 

# struct `cartesi::machine_config` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public `[`processor_config`](#structcartesi_1_1processor__config)` `[`processor`](#structcartesi_1_1machine__config_1adc3efc96376c6cb1e434278575608acc) | 
`public `[`ram_config`](#structcartesi_1_1ram__config)` `[`ram`](#structcartesi_1_1machine__config_1a1a1b4343385e9b82aec22f217a75b4b5) | 
`public `[`rom_config`](#structcartesi_1_1rom__config)` `[`rom`](#structcartesi_1_1machine__config_1ace6855cc16edb0abd682f171acf006d7) | 
`public boost::container::static_vector< `[`flash_config`](#structcartesi_1_1flash__config)`, FLASH_MAX > `[`flash`](#structcartesi_1_1machine__config_1a426c3301c477a3411532aec528936f90) | 
`public `[`clint_config`](#structcartesi_1_1clint__config)` `[`clint`](#structcartesi_1_1machine__config_1ad0f3107ec8faea87110adb1015a40891) | 
`public `[`htif_config`](#structcartesi_1_1htif__config)` `[`htif`](#structcartesi_1_1machine__config_1ac8b501496138e3c896751ab64726bf0f) | 
`public bool `[`interactive`](#structcartesi_1_1machine__config_1a86feef03523d9f6f630edae54ff3721b) | 

## Members

#### `public `[`processor_config`](#structcartesi_1_1processor__config)` `[`processor`](#structcartesi_1_1machine__config_1adc3efc96376c6cb1e434278575608acc) 

#### `public `[`ram_config`](#structcartesi_1_1ram__config)` `[`ram`](#structcartesi_1_1machine__config_1a1a1b4343385e9b82aec22f217a75b4b5) 

#### `public `[`rom_config`](#structcartesi_1_1rom__config)` `[`rom`](#structcartesi_1_1machine__config_1ace6855cc16edb0abd682f171acf006d7) 

#### `public boost::container::static_vector< `[`flash_config`](#structcartesi_1_1flash__config)`, FLASH_MAX > `[`flash`](#structcartesi_1_1machine__config_1a426c3301c477a3411532aec528936f90) 

#### `public `[`clint_config`](#structcartesi_1_1clint__config)` `[`clint`](#structcartesi_1_1machine__config_1ad0f3107ec8faea87110adb1015a40891) 

#### `public `[`htif_config`](#structcartesi_1_1htif__config)` `[`htif`](#structcartesi_1_1machine__config_1ac8b501496138e3c896751ab64726bf0f) 

#### `public bool `[`interactive`](#structcartesi_1_1machine__config_1a86feef03523d9f6f630edae54ff3721b) 

# struct `cartesi::machine_state` 

Machine state.

The [machine_state](#structcartesi_1_1machine__state) structure contains the entire state of a Cartesi machine.

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public uint64_t `[`pc`](#structcartesi_1_1machine__state_1aed6f64a53cb795e76f68428a821f574f) | Program counter.
`public uint64_t `[`x`](#structcartesi_1_1machine__state_1a1e3540c1e33ff8588667e924603449b4) | Register file.
`public uint64_t `[`minstret`](#structcartesi_1_1machine__state_1accf8e08300332540dde10e261a51a625) | CSR minstret.
`public uint64_t `[`mcycle`](#structcartesi_1_1machine__state_1a3a12d23355afd44a9dd9e89990a28b4a) | 
`public uint64_t `[`mvendorid`](#structcartesi_1_1machine__state_1aae216e846149075bd0a14f6e4844c93c) | CSR mvendorid;.
`public uint64_t `[`marchid`](#structcartesi_1_1machine__state_1affb38f977c5139f3014b2743d80ae289) | CSR marchid;.
`public uint64_t `[`mimpid`](#structcartesi_1_1machine__state_1acff7bf7cb72c088e191689878ca18884) | CSR mimpid;.
`public uint64_t `[`mstatus`](#structcartesi_1_1machine__state_1ab85abe5d9617ca00fb6bf8e663480e87) | CSR mstatus.
`public uint64_t `[`mtvec`](#structcartesi_1_1machine__state_1a6873753fa5396026df7f666d832b75d6) | CSR mtvec.
`public uint64_t `[`mscratch`](#structcartesi_1_1machine__state_1a476638ffa9f827dd510a6b631a4e9e62) | CSR mscratch.
`public uint64_t `[`mepc`](#structcartesi_1_1machine__state_1ac233852ffd9d45a631fd421a843326ee) | CSR mepc.
`public uint64_t `[`mcause`](#structcartesi_1_1machine__state_1aef7091980465c55b6648f22eb702c151) | CSR mcause.
`public uint64_t `[`mtval`](#structcartesi_1_1machine__state_1a5ebe73378c5ad67a9a9bcbc58efda519) | CSR mtval.
`public uint64_t `[`misa`](#structcartesi_1_1machine__state_1ad3f731b29bafe33f6b3fe6a90f7a9953) | CSR misa.
`public uint64_t `[`mie`](#structcartesi_1_1machine__state_1a3d32b50632b40bb984528d4f38ef2d90) | CSR mie.
`public uint64_t `[`mip`](#structcartesi_1_1machine__state_1a2e8c3016dbfa9300747d6ad6131a3d58) | CSR mip.
`public uint64_t `[`medeleg`](#structcartesi_1_1machine__state_1a07595bd18cb5d0967da8087d6fe79c92) | CSR medeleg.
`public uint64_t `[`mideleg`](#structcartesi_1_1machine__state_1a118c3839cfb28b44305d4c9cc12c06ee) | CSR mideleg.
`public uint64_t `[`mcounteren`](#structcartesi_1_1machine__state_1ae91f4f316ec8e3940f72ee11d293245f) | CSR mcounteren.
`public uint64_t `[`stvec`](#structcartesi_1_1machine__state_1aedeafa7bcca7fd9651aa2503f1476767) | CSR stvec.
`public uint64_t `[`sscratch`](#structcartesi_1_1machine__state_1a8fae28a09f4613be0dad8368eb53aadc) | CSR sscratch.
`public uint64_t `[`sepc`](#structcartesi_1_1machine__state_1a854acdaae12026df0413015ce246e986) | CSR sepc.
`public uint64_t `[`scause`](#structcartesi_1_1machine__state_1ad588191507ad1bbf40d8ffa1e69f5255) | CSR scause.
`public uint64_t `[`stval`](#structcartesi_1_1machine__state_1aa21754cc960e609dbb612d88b15f3915) | CSR stval.
`public uint64_t `[`satp`](#structcartesi_1_1machine__state_1adc42c8aeaf93b1be11e6baaa494d9d91) | CSR satp.
`public uint64_t `[`scounteren`](#structcartesi_1_1machine__state_1a91002c31d2e085888507dc317d8800ab) | CSR scounteren.
`public uint64_t `[`ilrsc`](#structcartesi_1_1machine__state_1a198c9be7e55de230d4b8899ccac309ff) | Cartesi-specific CSR ilrsc (For LR/SC instructions).
`public uint8_t `[`PRV`](#structcartesi_1_1machine__state_1a7ecb5e2d561a3630a4626ffd166d1196) | Privilege level.
`public bool `[`I`](#structcartesi_1_1machine__state_1a742395ce1fc835636c85f9f76335125b) | CPU is idle (waiting for interrupts).
`public bool `[`H`](#structcartesi_1_1machine__state_1a185f819ad495d88b2e382cdd8be77d8a) | CPU has been permanently halted.
`public struct cartesi::machine_state::@0 `[`iflags`](#structcartesi_1_1machine__state_1ae072941bfe30634c24070e012cbc4283) | Cartesi-specific unpacked CSR iflags.
`public uint64_t `[`mtimecmp`](#structcartesi_1_1machine__state_1a021e8829ed3ec508b45a26ea814c77f9) | CSR mtimecmp.
`public struct cartesi::machine_state::@1 `[`clint`](#structcartesi_1_1machine__state_1a94b45dda03da1b9c199d97957f2349fc) | CLINT state.
`public uint64_t `[`tohost`](#structcartesi_1_1machine__state_1a8ddc6e996dc3bf84919970790878e0c7) | CSR tohost.
`public uint64_t `[`fromhost`](#structcartesi_1_1machine__state_1a50e1636781b006c57b1c8753d4a24d4e) | CSR fromhost.
`public struct cartesi::machine_state::@2 `[`htif`](#structcartesi_1_1machine__state_1a6e6a4860f0ee67b80eccabcfa952bc4e) | HTIF state.
`public boost::container::static_vector< `[`pma_entry`](#classcartesi_1_1pma__entry)`, PMA_MAX > `[`pmas`](#structcartesi_1_1machine__state_1a8ce4f590d78bd66427b03507545e2080) | Map of physical memory ranges.
`public `[`pma_entry`](#classcartesi_1_1pma__entry)` `[`empty_pma`](#structcartesi_1_1machine__state_1a62c383bbadcfe03d46d92abd08731d7f) | fallback to PMA for empty range
`public bool `[`brk`](#structcartesi_1_1machine__state_1a9e0bb12dc70137e7144e9ad1d758ab7f) | Flag set when the tight loop must be broken.
`public `[`tlb_entry`](#structcartesi_1_1tlb__entry)` `[`tlb_read`](#structcartesi_1_1machine__state_1a529190ddeabc81c630022348681de55a) | Read TLB.
`public `[`tlb_entry`](#structcartesi_1_1tlb__entry)` `[`tlb_write`](#structcartesi_1_1machine__state_1aeb7c848ffc68c99c3841a23519d2b54f) | Write TLB.
`public `[`tlb_entry`](#structcartesi_1_1tlb__entry)` `[`tlb_code`](#structcartesi_1_1machine__state_1aab488846f14a2acfd115b81fe8c07213) | Code TLB.
`public inline  `[`~machine_state`](#structcartesi_1_1machine__state_1a5be1cadf020621afdbdb5d2e31e95aa6)`()` | 
`public  `[`machine_state`](#structcartesi_1_1machine__state_1ac56322f7efd83b784464cc1eb56411c8)`(const `[`machine_state`](#structcartesi_1_1machine__state)` & other) = delete` | No copy or move constructor or assignment.
`public  `[`machine_state`](#structcartesi_1_1machine__state_1ae0a302e3c7a05633e271e1926c1867ed)`(`[`machine_state`](#structcartesi_1_1machine__state)` && other) = delete` | 
`public `[`machine_state`](#structcartesi_1_1machine__state)` & `[`operator=`](#structcartesi_1_1machine__state_1a85baa12f3109b47dec907b8d75847e43)`(const `[`machine_state`](#structcartesi_1_1machine__state)` & other) = delete` | 
`public `[`machine_state`](#structcartesi_1_1machine__state)` & `[`operator=`](#structcartesi_1_1machine__state_1a573176b5f620bd049191ff2e1521d7b6)`(`[`machine_state`](#structcartesi_1_1machine__state)` && other) = delete` | 
`public inline void `[`set_brk_from_mip_mie`](#structcartesi_1_1machine__state_1a2c6001266e2b7e9f4f071991ed5e885b)`(void)` | Updates the brk flag from changes in mip and mie registers.
`public inline void `[`set_brk_from_iflags_H`](#structcartesi_1_1machine__state_1afe3a920bdfa8dcd87cbff383758f304b)`(void)` | Updates the brk flag from changes in the iflags_H flag.
`public inline uint64_t `[`read_iflags`](#structcartesi_1_1machine__state_1a87b2df157a5635941ee9dcfaf38a5d6d)`(void) const` | Reads the value of the iflags register.
`public inline void `[`write_iflags`](#structcartesi_1_1machine__state_1ad26caaeca772071f798e36d3cae8d4ef)`(uint64_t val)` | Reads the value of the iflags register.
`public inline void `[`init_tlb`](#structcartesi_1_1machine__state_1a1a5872eca4272af9e113efb21304c583)`(void)` | Initializes all TLBs with invalid entries.

## Members

#### `public uint64_t `[`pc`](#structcartesi_1_1machine__state_1aed6f64a53cb795e76f68428a821f574f) 

Program counter.

#### `public uint64_t `[`x`](#structcartesi_1_1machine__state_1a1e3540c1e33ff8588667e924603449b4) 

Register file.

#### `public uint64_t `[`minstret`](#structcartesi_1_1machine__state_1accf8e08300332540dde10e261a51a625) 

CSR minstret.

#### `public uint64_t `[`mcycle`](#structcartesi_1_1machine__state_1a3a12d23355afd44a9dd9e89990a28b4a) 

#### `public uint64_t `[`mvendorid`](#structcartesi_1_1machine__state_1aae216e846149075bd0a14f6e4844c93c) 

CSR mvendorid;.

#### `public uint64_t `[`marchid`](#structcartesi_1_1machine__state_1affb38f977c5139f3014b2743d80ae289) 

CSR marchid;.

#### `public uint64_t `[`mimpid`](#structcartesi_1_1machine__state_1acff7bf7cb72c088e191689878ca18884) 

CSR mimpid;.

#### `public uint64_t `[`mstatus`](#structcartesi_1_1machine__state_1ab85abe5d9617ca00fb6bf8e663480e87) 

CSR mstatus.

#### `public uint64_t `[`mtvec`](#structcartesi_1_1machine__state_1a6873753fa5396026df7f666d832b75d6) 

CSR mtvec.

#### `public uint64_t `[`mscratch`](#structcartesi_1_1machine__state_1a476638ffa9f827dd510a6b631a4e9e62) 

CSR mscratch.

#### `public uint64_t `[`mepc`](#structcartesi_1_1machine__state_1ac233852ffd9d45a631fd421a843326ee) 

CSR mepc.

#### `public uint64_t `[`mcause`](#structcartesi_1_1machine__state_1aef7091980465c55b6648f22eb702c151) 

CSR mcause.

#### `public uint64_t `[`mtval`](#structcartesi_1_1machine__state_1a5ebe73378c5ad67a9a9bcbc58efda519) 

CSR mtval.

#### `public uint64_t `[`misa`](#structcartesi_1_1machine__state_1ad3f731b29bafe33f6b3fe6a90f7a9953) 

CSR misa.

#### `public uint64_t `[`mie`](#structcartesi_1_1machine__state_1a3d32b50632b40bb984528d4f38ef2d90) 

CSR mie.

#### `public uint64_t `[`mip`](#structcartesi_1_1machine__state_1a2e8c3016dbfa9300747d6ad6131a3d58) 

CSR mip.

#### `public uint64_t `[`medeleg`](#structcartesi_1_1machine__state_1a07595bd18cb5d0967da8087d6fe79c92) 

CSR medeleg.

#### `public uint64_t `[`mideleg`](#structcartesi_1_1machine__state_1a118c3839cfb28b44305d4c9cc12c06ee) 

CSR mideleg.

#### `public uint64_t `[`mcounteren`](#structcartesi_1_1machine__state_1ae91f4f316ec8e3940f72ee11d293245f) 

CSR mcounteren.

#### `public uint64_t `[`stvec`](#structcartesi_1_1machine__state_1aedeafa7bcca7fd9651aa2503f1476767) 

CSR stvec.

#### `public uint64_t `[`sscratch`](#structcartesi_1_1machine__state_1a8fae28a09f4613be0dad8368eb53aadc) 

CSR sscratch.

#### `public uint64_t `[`sepc`](#structcartesi_1_1machine__state_1a854acdaae12026df0413015ce246e986) 

CSR sepc.

#### `public uint64_t `[`scause`](#structcartesi_1_1machine__state_1ad588191507ad1bbf40d8ffa1e69f5255) 

CSR scause.

#### `public uint64_t `[`stval`](#structcartesi_1_1machine__state_1aa21754cc960e609dbb612d88b15f3915) 

CSR stval.

#### `public uint64_t `[`satp`](#structcartesi_1_1machine__state_1adc42c8aeaf93b1be11e6baaa494d9d91) 

CSR satp.

#### `public uint64_t `[`scounteren`](#structcartesi_1_1machine__state_1a91002c31d2e085888507dc317d8800ab) 

CSR scounteren.

#### `public uint64_t `[`ilrsc`](#structcartesi_1_1machine__state_1a198c9be7e55de230d4b8899ccac309ff) 

Cartesi-specific CSR ilrsc (For LR/SC instructions).

#### `public uint8_t `[`PRV`](#structcartesi_1_1machine__state_1a7ecb5e2d561a3630a4626ffd166d1196) 

Privilege level.

#### `public bool `[`I`](#structcartesi_1_1machine__state_1a742395ce1fc835636c85f9f76335125b) 

CPU is idle (waiting for interrupts).

#### `public bool `[`H`](#structcartesi_1_1machine__state_1a185f819ad495d88b2e382cdd8be77d8a) 

CPU has been permanently halted.

#### `public struct cartesi::machine_state::@0 `[`iflags`](#structcartesi_1_1machine__state_1ae072941bfe30634c24070e012cbc4283) 

Cartesi-specific unpacked CSR iflags.

#### `public uint64_t `[`mtimecmp`](#structcartesi_1_1machine__state_1a021e8829ed3ec508b45a26ea814c77f9) 

CSR mtimecmp.

#### `public struct cartesi::machine_state::@1 `[`clint`](#structcartesi_1_1machine__state_1a94b45dda03da1b9c199d97957f2349fc) 

CLINT state.

#### `public uint64_t `[`tohost`](#structcartesi_1_1machine__state_1a8ddc6e996dc3bf84919970790878e0c7) 

CSR tohost.

#### `public uint64_t `[`fromhost`](#structcartesi_1_1machine__state_1a50e1636781b006c57b1c8753d4a24d4e) 

CSR fromhost.

#### `public struct cartesi::machine_state::@2 `[`htif`](#structcartesi_1_1machine__state_1a6e6a4860f0ee67b80eccabcfa952bc4e) 

HTIF state.

#### `public boost::container::static_vector< `[`pma_entry`](#classcartesi_1_1pma__entry)`, PMA_MAX > `[`pmas`](#structcartesi_1_1machine__state_1a8ce4f590d78bd66427b03507545e2080) 

Map of physical memory ranges.

#### `public `[`pma_entry`](#classcartesi_1_1pma__entry)` `[`empty_pma`](#structcartesi_1_1machine__state_1a62c383bbadcfe03d46d92abd08731d7f) 

fallback to PMA for empty range

#### `public bool `[`brk`](#structcartesi_1_1machine__state_1a9e0bb12dc70137e7144e9ad1d758ab7f) 

Flag set when the tight loop must be broken.

#### `public `[`tlb_entry`](#structcartesi_1_1tlb__entry)` `[`tlb_read`](#structcartesi_1_1machine__state_1a529190ddeabc81c630022348681de55a) 

Read TLB.

#### `public `[`tlb_entry`](#structcartesi_1_1tlb__entry)` `[`tlb_write`](#structcartesi_1_1machine__state_1aeb7c848ffc68c99c3841a23519d2b54f) 

Write TLB.

#### `public `[`tlb_entry`](#structcartesi_1_1tlb__entry)` `[`tlb_code`](#structcartesi_1_1machine__state_1aab488846f14a2acfd115b81fe8c07213) 

Code TLB.

#### `public inline  `[`~machine_state`](#structcartesi_1_1machine__state_1a5be1cadf020621afdbdb5d2e31e95aa6)`()` 

#### `public  `[`machine_state`](#structcartesi_1_1machine__state_1ac56322f7efd83b784464cc1eb56411c8)`(const `[`machine_state`](#structcartesi_1_1machine__state)` & other) = delete` 

No copy or move constructor or assignment.

#### `public  `[`machine_state`](#structcartesi_1_1machine__state_1ae0a302e3c7a05633e271e1926c1867ed)`(`[`machine_state`](#structcartesi_1_1machine__state)` && other) = delete` 

#### `public `[`machine_state`](#structcartesi_1_1machine__state)` & `[`operator=`](#structcartesi_1_1machine__state_1a85baa12f3109b47dec907b8d75847e43)`(const `[`machine_state`](#structcartesi_1_1machine__state)` & other) = delete` 

#### `public `[`machine_state`](#structcartesi_1_1machine__state)` & `[`operator=`](#structcartesi_1_1machine__state_1a573176b5f620bd049191ff2e1521d7b6)`(`[`machine_state`](#structcartesi_1_1machine__state)` && other) = delete` 

#### `public inline void `[`set_brk_from_mip_mie`](#structcartesi_1_1machine__state_1a2c6001266e2b7e9f4f071991ed5e885b)`(void)` 

Updates the brk flag from changes in mip and mie registers.

#### `public inline void `[`set_brk_from_iflags_H`](#structcartesi_1_1machine__state_1afe3a920bdfa8dcd87cbff383758f304b)`(void)` 

Updates the brk flag from changes in the iflags_H flag.

#### `public inline uint64_t `[`read_iflags`](#structcartesi_1_1machine__state_1a87b2df157a5635941ee9dcfaf38a5d6d)`(void) const` 

Reads the value of the iflags register.

#### Returns
The value of the register.

#### `public inline void `[`write_iflags`](#structcartesi_1_1machine__state_1ad26caaeca772071f798e36d3cae8d4ef)`(uint64_t val)` 

Reads the value of the iflags register.

#### Parameters
* `val` New register value.

#### `public inline void `[`init_tlb`](#structcartesi_1_1machine__state_1a1a5872eca4272af9e113efb21304c583)`(void)` 

Initializes all TLBs with invalid entries.

# struct `cartesi::pma_driver` 

Driver for device ranges.

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public const char * `[`name`](#structcartesi_1_1pma__driver_1a10e384fd4193b1208e86e0759d8ce10f) | Driver name.
`public pma_read `[`read`](#structcartesi_1_1pma__driver_1ab709f33dc45f43970c63dbbdb6934c3c) | Callback for read operations.
`public pma_write `[`write`](#structcartesi_1_1pma__driver_1a34842808bfc6076f9756ab22474e88f6) | Callback for write operations.

## Members

#### `public const char * `[`name`](#structcartesi_1_1pma__driver_1a10e384fd4193b1208e86e0759d8ce10f) 

Driver name.

#### `public pma_read `[`read`](#structcartesi_1_1pma__driver_1ab709f33dc45f43970c63dbbdb6934c3c) 

Callback for read operations.

#### `public pma_write `[`write`](#structcartesi_1_1pma__driver_1a34842808bfc6076f9756ab22474e88f6) 

Callback for write operations.

# struct `cartesi::pma_empty` 

Data for empty memory ranges (nothing, really)

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------

## Members

# struct `cartesi::processor_config` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public uint64_t `[`x`](#structcartesi_1_1processor__config_1ad42e9eae3fb92889e7041b941f92ff01) | 
`public uint64_t `[`pc`](#structcartesi_1_1processor__config_1a4431bc1f519fbb53fe0b55536068a21b) | 
`public uint64_t `[`mvendorid`](#structcartesi_1_1processor__config_1a6c272390aec34f2433ebb3e5d8a332ec) | 
`public uint64_t `[`marchid`](#structcartesi_1_1processor__config_1a7867e4755cff2348d4d34b7acc6ef074) | 
`public uint64_t `[`mimpid`](#structcartesi_1_1processor__config_1aa0f41e79c17e62d5005a4f14f2a11cbc) | 
`public uint64_t `[`mcycle`](#structcartesi_1_1processor__config_1a037c430d49a3c5b573f97575a78e66a9) | 
`public uint64_t `[`minstret`](#structcartesi_1_1processor__config_1a664765d231ba2268bb20a615fc27c9c8) | 
`public uint64_t `[`mstatus`](#structcartesi_1_1processor__config_1a9539d0038c30e271ade795e4342be12e) | 
`public uint64_t `[`mtvec`](#structcartesi_1_1processor__config_1a77c841b6bc8d1ab6e0883ac1899e85c6) | 
`public uint64_t `[`mscratch`](#structcartesi_1_1processor__config_1afb2588b42a7a33320fffaea4b8f24092) | 
`public uint64_t `[`mepc`](#structcartesi_1_1processor__config_1a422279dbfe014f492b099ea362e1981f) | 
`public uint64_t `[`mcause`](#structcartesi_1_1processor__config_1a6da1ce226910295e2118a514d151a577) | 
`public uint64_t `[`mtval`](#structcartesi_1_1processor__config_1a546207b338174e0c3575c87752e90586) | 
`public uint64_t `[`misa`](#structcartesi_1_1processor__config_1a42eb4baeb289e608b8ccfe39d7a7b163) | 
`public uint64_t `[`mie`](#structcartesi_1_1processor__config_1a32749ad737c5f764d87c7d2f81da54b6) | 
`public uint64_t `[`mip`](#structcartesi_1_1processor__config_1abcc4b1c621b84af854528e95341b3e51) | 
`public uint64_t `[`medeleg`](#structcartesi_1_1processor__config_1a978450de4bf32fee274716ac7c9fdfe2) | 
`public uint64_t `[`mideleg`](#structcartesi_1_1processor__config_1a7922f378e0fb432bf7434fef1649cac3) | 
`public uint64_t `[`mcounteren`](#structcartesi_1_1processor__config_1af1000ae93507df44d9fa4af3e02cb13c) | 
`public uint64_t `[`stvec`](#structcartesi_1_1processor__config_1acd67717def5021f072f2e79a7cafd300) | 
`public uint64_t `[`sscratch`](#structcartesi_1_1processor__config_1a3fbe3978c666bd4efcc24d25742cd438) | 
`public uint64_t `[`sepc`](#structcartesi_1_1processor__config_1a430b9a0019f5e8b5d7b032b03340cd20) | 
`public uint64_t `[`scause`](#structcartesi_1_1processor__config_1a2035ebcc0de3a6bb3849f227bf73f49c) | 
`public uint64_t `[`stval`](#structcartesi_1_1processor__config_1ab650055e4d198368936e91f6374efbf1) | 
`public uint64_t `[`satp`](#structcartesi_1_1processor__config_1abd54fac9c21b2028c5c49762cf0f7d7a) | 
`public uint64_t `[`scounteren`](#structcartesi_1_1processor__config_1ad7ec8a56d907615f04941096fb467f2a) | 
`public uint64_t `[`ilrsc`](#structcartesi_1_1processor__config_1a3458fc2da692b44595cc74afc53fabc8) | 
`public uint64_t `[`iflags`](#structcartesi_1_1processor__config_1a487004fbe08caaf4b44531dbfe3ba6e3) | 
`public std::string `[`backing`](#structcartesi_1_1processor__config_1a374e53a3c9fe1342636b856caade80b9) | 

## Members

#### `public uint64_t `[`x`](#structcartesi_1_1processor__config_1ad42e9eae3fb92889e7041b941f92ff01) 

#### `public uint64_t `[`pc`](#structcartesi_1_1processor__config_1a4431bc1f519fbb53fe0b55536068a21b) 

#### `public uint64_t `[`mvendorid`](#structcartesi_1_1processor__config_1a6c272390aec34f2433ebb3e5d8a332ec) 

#### `public uint64_t `[`marchid`](#structcartesi_1_1processor__config_1a7867e4755cff2348d4d34b7acc6ef074) 

#### `public uint64_t `[`mimpid`](#structcartesi_1_1processor__config_1aa0f41e79c17e62d5005a4f14f2a11cbc) 

#### `public uint64_t `[`mcycle`](#structcartesi_1_1processor__config_1a037c430d49a3c5b573f97575a78e66a9) 

#### `public uint64_t `[`minstret`](#structcartesi_1_1processor__config_1a664765d231ba2268bb20a615fc27c9c8) 

#### `public uint64_t `[`mstatus`](#structcartesi_1_1processor__config_1a9539d0038c30e271ade795e4342be12e) 

#### `public uint64_t `[`mtvec`](#structcartesi_1_1processor__config_1a77c841b6bc8d1ab6e0883ac1899e85c6) 

#### `public uint64_t `[`mscratch`](#structcartesi_1_1processor__config_1afb2588b42a7a33320fffaea4b8f24092) 

#### `public uint64_t `[`mepc`](#structcartesi_1_1processor__config_1a422279dbfe014f492b099ea362e1981f) 

#### `public uint64_t `[`mcause`](#structcartesi_1_1processor__config_1a6da1ce226910295e2118a514d151a577) 

#### `public uint64_t `[`mtval`](#structcartesi_1_1processor__config_1a546207b338174e0c3575c87752e90586) 

#### `public uint64_t `[`misa`](#structcartesi_1_1processor__config_1a42eb4baeb289e608b8ccfe39d7a7b163) 

#### `public uint64_t `[`mie`](#structcartesi_1_1processor__config_1a32749ad737c5f764d87c7d2f81da54b6) 

#### `public uint64_t `[`mip`](#structcartesi_1_1processor__config_1abcc4b1c621b84af854528e95341b3e51) 

#### `public uint64_t `[`medeleg`](#structcartesi_1_1processor__config_1a978450de4bf32fee274716ac7c9fdfe2) 

#### `public uint64_t `[`mideleg`](#structcartesi_1_1processor__config_1a7922f378e0fb432bf7434fef1649cac3) 

#### `public uint64_t `[`mcounteren`](#structcartesi_1_1processor__config_1af1000ae93507df44d9fa4af3e02cb13c) 

#### `public uint64_t `[`stvec`](#structcartesi_1_1processor__config_1acd67717def5021f072f2e79a7cafd300) 

#### `public uint64_t `[`sscratch`](#structcartesi_1_1processor__config_1a3fbe3978c666bd4efcc24d25742cd438) 

#### `public uint64_t `[`sepc`](#structcartesi_1_1processor__config_1a430b9a0019f5e8b5d7b032b03340cd20) 

#### `public uint64_t `[`scause`](#structcartesi_1_1processor__config_1a2035ebcc0de3a6bb3849f227bf73f49c) 

#### `public uint64_t `[`stval`](#structcartesi_1_1processor__config_1ab650055e4d198368936e91f6374efbf1) 

#### `public uint64_t `[`satp`](#structcartesi_1_1processor__config_1abd54fac9c21b2028c5c49762cf0f7d7a) 

#### `public uint64_t `[`scounteren`](#structcartesi_1_1processor__config_1ad7ec8a56d907615f04941096fb467f2a) 

#### `public uint64_t `[`ilrsc`](#structcartesi_1_1processor__config_1a3458fc2da692b44595cc74afc53fabc8) 

#### `public uint64_t `[`iflags`](#structcartesi_1_1processor__config_1a487004fbe08caaf4b44531dbfe3ba6e3) 

#### `public std::string `[`backing`](#structcartesi_1_1processor__config_1a374e53a3c9fe1342636b856caade80b9) 

# struct `cartesi::ram_config` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public uint64_t `[`length`](#structcartesi_1_1ram__config_1a2dd0b6353cb11f699a5ff4f5ba6a0fa5) | 
`public std::string `[`backing`](#structcartesi_1_1ram__config_1afb24455186343cbd211709e9e3bd4b37) | 

## Members

#### `public uint64_t `[`length`](#structcartesi_1_1ram__config_1a2dd0b6353cb11f699a5ff4f5ba6a0fa5) 

#### `public std::string `[`backing`](#structcartesi_1_1ram__config_1afb24455186343cbd211709e9e3bd4b37) 

# struct `cartesi::rom_config` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public std::string `[`bootargs`](#structcartesi_1_1rom__config_1a1c06a77ab37d9e38db9a26dd075f03d2) | 
`public std::string `[`backing`](#structcartesi_1_1rom__config_1af18299c2291ede25bdcfe6f93ad03345) | 

## Members

#### `public std::string `[`bootargs`](#structcartesi_1_1rom__config_1a1c06a77ab37d9e38db9a26dd075f03d2) 

#### `public std::string `[`backing`](#structcartesi_1_1rom__config_1af18299c2291ede25bdcfe6f93ad03345) 

# struct `cartesi::tlb_entry` 

Translation Lookaside Buffer entry.

The TLB is a small cache used to speed up translation between virtual target addresses and the corresponding memory address in the host.

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public `[`pma_entry`](#classcartesi_1_1pma__entry)` * `[`pma`](#structcartesi_1_1tlb__entry_1ada890d132469a76660e6985e26acbe5c) | PMA entry for corresponding range.
`public uint64_t `[`paddr_page`](#structcartesi_1_1tlb__entry_1a03143e15e67a849c718ca82118d23de2) | Target physical address of page start.
`public uint64_t `[`vaddr_page`](#structcartesi_1_1tlb__entry_1a20435e7d1c705c13a48cc8d44677fc90) | Target virtual address of page start.
`public unsigned char * `[`hpage`](#structcartesi_1_1tlb__entry_1ad376d6318e8227033f6d05587d2df0fd) | Pointer to page start in host memory.

## Members

#### `public `[`pma_entry`](#classcartesi_1_1pma__entry)` * `[`pma`](#structcartesi_1_1tlb__entry_1ada890d132469a76660e6985e26acbe5c) 

PMA entry for corresponding range.

#### `public uint64_t `[`paddr_page`](#structcartesi_1_1tlb__entry_1a03143e15e67a849c718ca82118d23de2) 

Target physical address of page start.

#### `public uint64_t `[`vaddr_page`](#structcartesi_1_1tlb__entry_1a20435e7d1c705c13a48cc8d44677fc90) 

Target virtual address of page start.

#### `public unsigned char * `[`hpage`](#structcartesi_1_1tlb__entry_1ad376d6318e8227033f6d05587d2df0fd) 

Pointer to page start in host memory.

# struct `cartesi::word_access` 

Records access to a word in the machine state.

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public `[`access_type`](#access-log_8h_1a5b2dcf7c7a46db7c7c78a0256bff45b4)` `[`type`](#structcartesi_1_1word__access_1a184cfcbf10cbd4d841d3782a4c088939) | Type of state access.
`public uint64_t `[`read`](#structcartesi_1_1word__access_1acb1303d8a374e031cfba87bc8797324e) | Word value before access.
`public uint64_t `[`written`](#structcartesi_1_1word__access_1acdd7e2ddce4229bc3c07a011f406154a) | Word value after access (if writing)
`public `[`merkle_tree::proof_type`](#structcartesi_1_1merkle__tree_1_1proof__type)` `[`proof`](#structcartesi_1_1word__access_1a30c43d521369abc27a71a026884022f4) | Proof of word value before access.

## Members

#### `public `[`access_type`](#access-log_8h_1a5b2dcf7c7a46db7c7c78a0256bff45b4)` `[`type`](#structcartesi_1_1word__access_1a184cfcbf10cbd4d841d3782a4c088939) 

Type of state access.

#### `public uint64_t `[`read`](#structcartesi_1_1word__access_1acb1303d8a374e031cfba87bc8797324e) 

Word value before access.

#### `public uint64_t `[`written`](#structcartesi_1_1word__access_1acdd7e2ddce4229bc3c07a011f406154a) 

Word value after access (if writing)

#### `public `[`merkle_tree::proof_type`](#structcartesi_1_1merkle__tree_1_1proof__type)` `[`proof`](#structcartesi_1_1word__access_1a30c43d521369abc27a71a026884022f4) 

Proof of word value before access.

# namespace `test_client` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public def `[`make_new_machine_request`](#test__client_8py_1a4e138e3862cc7b90dd2af9112e510be6)`()`            | 
`public def `[`address`](#test__client_8py_1a76cb3f5847c1ee8a626bfa143f416204)`(add)`            | 
`public def `[`port_number`](#test__client_8py_1a3c9941d17d9b7b40c119543c3d92c2b4)`(port)`            | 
`public def `[`get_args`](#test__client_8py_1aa7ca991daea4ed6ca47b6af2ea09ee93)`()`            | 
`public def `[`run`](#test__client_8py_1abcc4e740452b48b77d4d6e081f3bd914)`()`            | 

## Members

#### `public def `[`make_new_machine_request`](#test__client_8py_1a4e138e3862cc7b90dd2af9112e510be6)`()` 

#### `public def `[`address`](#test__client_8py_1a76cb3f5847c1ee8a626bfa143f416204)`(add)` 

#### `public def `[`port_number`](#test__client_8py_1a3c9941d17d9b7b40c119543c3d92c2b4)`(port)` 

#### `public def `[`get_args`](#test__client_8py_1aa7ca991daea4ed6ca47b6af2ea09ee93)`()` 

#### `public def `[`run`](#test__client_8py_1abcc4e740452b48b77d4d6e081f3bd914)`()` 

# class `is_template_base_of` 

SFINAE test if class is derived from from a base template class.

#### Parameters
* `BASE` Base template. 

* `DERIVED` Derived class.

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------

## Members

# class `MachineClient` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`MachineClient`](#class_machine_client_1a00f0c890eb9818c397dc0f38ddfc705a)`(std::string address)` | 
`public inline void `[`Inc`](#class_machine_client_1a98e03352576d33d5e7e32933e43c9f2c)`(void)` | 
`public inline void `[`Print`](#class_machine_client_1a1f5e1f09ca91ddf140893015b408e6bc)`(void)` | 
`public inline void `[`Snapshot`](#class_machine_client_1aaa88ddc771b289723a8710c5a879f0b8)`(void)` | 
`public inline void `[`Rollback`](#class_machine_client_1a2ece94b407e8ef6f94c968ead8d4d370)`(void)` | 
`public inline void `[`Shutdown`](#class_machine_client_1abbb2a8706ccea39e50348171aeeb74ed)`(void)` | 
`public inline void `[`Machine`](#class_machine_client_1a9d7c71a4eec3579e6a36bca90f4c29de)`(void)` | 

## Members

#### `public inline  `[`MachineClient`](#class_machine_client_1a00f0c890eb9818c397dc0f38ddfc705a)`(std::string address)` 

#### `public inline void `[`Inc`](#class_machine_client_1a98e03352576d33d5e7e32933e43c9f2c)`(void)` 

#### `public inline void `[`Print`](#class_machine_client_1a1f5e1f09ca91ddf140893015b408e6bc)`(void)` 

#### `public inline void `[`Snapshot`](#class_machine_client_1aaa88ddc771b289723a8710c5a879f0b8)`(void)` 

#### `public inline void `[`Rollback`](#class_machine_client_1a2ece94b407e8ef6f94c968ead8d4d370)`(void)` 

#### `public inline void `[`Shutdown`](#class_machine_client_1abbb2a8706ccea39e50348171aeeb74ed)`(void)` 

#### `public inline void `[`Machine`](#class_machine_client_1a9d7c71a4eec3579e6a36bca90f4c29de)`(void)` 

# class `MachineServiceImpl` 

```
class MachineServiceImpl
  : public Service
```  

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`MachineServiceImpl`](#class_machine_service_impl_1a5a0fe4c3992475fe518e1985c157dfe7)`(`[`Context`](#struct_context)` & context)` | 
`public inline  `[`~MachineServiceImpl`](#class_machine_service_impl_1ac141a649d39c2a54e1b3c82f8548595a)`()` | 
`public inline void `[`set_server`](#class_machine_service_impl_1a38cfbfb83c0852bdd85a942e238f672a)`(Server * s)` | 
`public inline BreakReason `[`reason`](#class_machine_service_impl_1a44dd12b2669663f43b2f51852d45e28c)`(void) const` | 

## Members

#### `public inline  `[`MachineServiceImpl`](#class_machine_service_impl_1a5a0fe4c3992475fe518e1985c157dfe7)`(`[`Context`](#struct_context)` & context)` 

#### `public inline  `[`~MachineServiceImpl`](#class_machine_service_impl_1ac141a649d39c2a54e1b3c82f8548595a)`()` 

#### `public inline void `[`set_server`](#class_machine_service_impl_1a38cfbfb83c0852bdd85a942e238f672a)`(Server * s)` 

#### `public inline BreakReason `[`reason`](#class_machine_service_impl_1a44dd12b2669663f43b2f51852d45e28c)`(void) const` 

# class `cartesi::logged_state_access::scoped_note` 

Adds annotations to the state, bracketing a scope.

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`scoped_note`](#classcartesi_1_1logged__state__access_1_1scoped__note_1a4d556af8c920d62264e1d54a1825115b)`(std::shared_ptr< `[`access_log`](#classcartesi_1_1access__log)` > log,const char * text)` | Constructor adds the "begin" bracketting note.
`public  `[`scoped_note`](#classcartesi_1_1logged__state__access_1_1scoped__note_1a92e39500c73b4b62d6da26d667877e3e)`(const `[`scoped_note`](#classcartesi_1_1logged__state__access_1_1scoped__note)` &) = delete` | No copy constructors.
`public `[`scoped_note`](#classcartesi_1_1logged__state__access_1_1scoped__note)` & `[`operator=`](#classcartesi_1_1logged__state__access_1_1scoped__note_1a9f9f1eaf87b95ad879daa36bf89ba7da)`(const `[`scoped_note`](#classcartesi_1_1logged__state__access_1_1scoped__note)` &) = delete` | No copy assignment.
`public  `[`scoped_note`](#classcartesi_1_1logged__state__access_1_1scoped__note_1aef88e06d630226fc1608d4c77545480e)`(`[`scoped_note`](#classcartesi_1_1logged__state__access_1_1scoped__note)` &&) = default` | Default move constructor \detail This is OK because the shared_ptr to log will be empty afterwards and we explicitly test for this condition before writing the "end" bracketting note.
`public `[`scoped_note`](#classcartesi_1_1logged__state__access_1_1scoped__note)` & `[`operator=`](#classcartesi_1_1logged__state__access_1_1scoped__note_1a7bfd384a47b27543c8be1f6fb37ade6b)`(`[`scoped_note`](#classcartesi_1_1logged__state__access_1_1scoped__note)` &&) = default` | Default move assignment \detail This is OK because the shared_ptr to log will be empty afterwards and we explicitly test for this condition before writing the "end" bracketting note.
`public inline  `[`~scoped_note`](#classcartesi_1_1logged__state__access_1_1scoped__note_1ae470ac201a91dbeb31f91724c9091afb)`()` | Destructor adds the "end" bracketting note if the log shared_ptr is not empty.

## Members

#### `public inline  `[`scoped_note`](#classcartesi_1_1logged__state__access_1_1scoped__note_1a4d556af8c920d62264e1d54a1825115b)`(std::shared_ptr< `[`access_log`](#classcartesi_1_1access__log)` > log,const char * text)` 

Constructor adds the "begin" bracketting note.

#### Parameters
* `log` Pointer to access log receiving annotations 

* `text` Pointer to annotation text

A note is added at the moment of construction

#### `public  `[`scoped_note`](#classcartesi_1_1logged__state__access_1_1scoped__note_1a92e39500c73b4b62d6da26d667877e3e)`(const `[`scoped_note`](#classcartesi_1_1logged__state__access_1_1scoped__note)` &) = delete` 

No copy constructors.

#### `public `[`scoped_note`](#classcartesi_1_1logged__state__access_1_1scoped__note)` & `[`operator=`](#classcartesi_1_1logged__state__access_1_1scoped__note_1a9f9f1eaf87b95ad879daa36bf89ba7da)`(const `[`scoped_note`](#classcartesi_1_1logged__state__access_1_1scoped__note)` &) = delete` 

No copy assignment.

#### `public  `[`scoped_note`](#classcartesi_1_1logged__state__access_1_1scoped__note_1aef88e06d630226fc1608d4c77545480e)`(`[`scoped_note`](#classcartesi_1_1logged__state__access_1_1scoped__note)` &&) = default` 

Default move constructor \detail This is OK because the shared_ptr to log will be empty afterwards and we explicitly test for this condition before writing the "end" bracketting note.

#### `public `[`scoped_note`](#classcartesi_1_1logged__state__access_1_1scoped__note)` & `[`operator=`](#classcartesi_1_1logged__state__access_1_1scoped__note_1a7bfd384a47b27543c8be1f6fb37ade6b)`(`[`scoped_note`](#classcartesi_1_1logged__state__access_1_1scoped__note)` &&) = default` 

Default move assignment \detail This is OK because the shared_ptr to log will be empty afterwards and we explicitly test for this condition before writing the "end" bracketting note.

#### `public inline  `[`~scoped_note`](#classcartesi_1_1logged__state__access_1_1scoped__note_1ae470ac201a91dbeb31f91724c9091afb)`()` 

Destructor adds the "end" bracketting note if the log shared_ptr is not empty.

# struct `cartesi::pma_memory::callocd` 

Calloc'd range data (just a tag).

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------

## Members

# struct `Context` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public int `[`value`](#struct_context_1a7a02b0912106f2079fdda04b2a19b79b) | 
`public std::string `[`address`](#struct_context_1ad7415638de9c18f85634d8e2c0f083c2) | 
`public std::string `[`manager_address`](#struct_context_1ab641c5dd01b7584f8d01212d6da2c7de) | 
`public std::string `[`session_id`](#struct_context_1a95861df276c5a5fccbd95bfb42eb5c7a) | 
`public bool `[`auto_port`](#struct_context_1a4337d5e7fd3af200400cca6eb6fd259d) | 
`public bool `[`report_to_manager`](#struct_context_1a77a84cc37e2dbd7bea972e510b219f6a) | 
`public bool `[`forked`](#struct_context_1a1fd820b77157b1ec881d6d30c0f25139) | 
`public std::unique_ptr< `[`machine`](#classcartesi_1_1machine)` > `[`cartesimachine`](#struct_context_1a029fcba77464d9922702f7447262c43e) | 
`public inline  `[`Context`](#struct_context_1a5dd483a8c3183056682ebaa945acdc6d)`(void)` | 

## Members

#### `public int `[`value`](#struct_context_1a7a02b0912106f2079fdda04b2a19b79b) 

#### `public std::string `[`address`](#struct_context_1ad7415638de9c18f85634d8e2c0f083c2) 

#### `public std::string `[`manager_address`](#struct_context_1ab641c5dd01b7584f8d01212d6da2c7de) 

#### `public std::string `[`session_id`](#struct_context_1a95861df276c5a5fccbd95bfb42eb5c7a) 

#### `public bool `[`auto_port`](#struct_context_1a4337d5e7fd3af200400cca6eb6fd259d) 

#### `public bool `[`report_to_manager`](#struct_context_1a77a84cc37e2dbd7bea972e510b219f6a) 

#### `public bool `[`forked`](#struct_context_1a1fd820b77157b1ec881d6d30c0f25139) 

#### `public std::unique_ptr< `[`machine`](#classcartesi_1_1machine)` > `[`cartesimachine`](#struct_context_1a029fcba77464d9922702f7447262c43e) 

#### `public inline  `[`Context`](#struct_context_1a5dd483a8c3183056682ebaa945acdc6d)`(void)` 

# struct `cartesi::pma_entry::flags` 

< Exploded flags for PMA entry.

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public bool `[`R`](#structcartesi_1_1pma__entry_1_1flags_1a76a1f18304f191f7a74a92f53a2d36a8) | 
`public bool `[`W`](#structcartesi_1_1pma__entry_1_1flags_1a64b3b76a83747dfaf6db1f29a59c502d) | 
`public bool `[`X`](#structcartesi_1_1pma__entry_1_1flags_1a04064032ee284de2cde73dca92917cb0) | 
`public bool `[`IR`](#structcartesi_1_1pma__entry_1_1flags_1ab692f6d1bcea85b947d9b79d965792b6) | 
`public bool `[`IW`](#structcartesi_1_1pma__entry_1_1flags_1a951177d0487ace88ba2d4da53838e385) | 
`public `[`PMA_ISTART_DID`](#pma-constants_8h_1af1653605bf791b39ada81f1dbd923571)` `[`DID`](#structcartesi_1_1pma__entry_1_1flags_1a51c19fb1d22d324ea537afcd52b1eab5) | 

## Members

#### `public bool `[`R`](#structcartesi_1_1pma__entry_1_1flags_1a76a1f18304f191f7a74a92f53a2d36a8) 

#### `public bool `[`W`](#structcartesi_1_1pma__entry_1_1flags_1a64b3b76a83747dfaf6db1f29a59c502d) 

#### `public bool `[`X`](#structcartesi_1_1pma__entry_1_1flags_1a04064032ee284de2cde73dca92917cb0) 

#### `public bool `[`IR`](#structcartesi_1_1pma__entry_1_1flags_1ab692f6d1bcea85b947d9b79d965792b6) 

#### `public bool `[`IW`](#structcartesi_1_1pma__entry_1_1flags_1a951177d0487ace88ba2d4da53838e385) 

#### `public `[`PMA_ISTART_DID`](#pma-constants_8h_1af1653605bf791b39ada81f1dbd923571)` `[`DID`](#structcartesi_1_1pma__entry_1_1flags_1a51c19fb1d22d324ea537afcd52b1eab5) 

# struct `cartesi::pma_memory::mmapd` 

Mmap'd range data (shared or not).

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public bool `[`shared`](#structcartesi_1_1pma__memory_1_1mmapd_1a2b29f1b013f9cedcbadbb6e44affac53) | 

## Members

#### `public bool `[`shared`](#structcartesi_1_1pma__memory_1_1mmapd_1a2b29f1b013f9cedcbadbb6e44affac53) 

# struct `pma` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public uint64_t `[`istart`](#structpma_1a5921a3589e255ebf9b8f4d29e0c95cd6) | 
`public uint64_t `[`ilength`](#structpma_1a1dfa620b31089a7be6c6e3dae53bf4ff) | 

## Members

#### `public uint64_t `[`istart`](#structpma_1a5921a3589e255ebf9b8f4d29e0c95cd6) 

#### `public uint64_t `[`ilength`](#structpma_1a1dfa620b31089a7be6c6e3dae53bf4ff) 

# struct `pma_ext_hdr` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public uint64_t `[`version`](#structpma__ext__hdr_1a203f68e71d1df65e267c039d79ba3e4f) | 
`public char `[`bootargs`](#structpma__ext__hdr_1a8616f962ae192f333eef05ffb796626b) | 

## Members

#### `public uint64_t `[`version`](#structpma__ext__hdr_1a203f68e71d1df65e267c039d79ba3e4f) 

#### `public char `[`bootargs`](#structpma__ext__hdr_1a8616f962ae192f333eef05ffb796626b) 

# struct `cartesi::merkle_tree::proof_type` 

Storage for the proof of a word value.

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public address_type `[`address`](#structcartesi_1_1merkle__tree_1_1proof__type_1a1f0125c361c1a1c2e1db85d0db25f7ae) | Address of target node.
`public int `[`log2_size`](#structcartesi_1_1merkle__tree_1_1proof__type_1ab806627888193159c30ebc6ed067de3d) | log2 of size subintended by target node.
`public `[`hash_type`](#classcartesi_1_1merkle__tree_1aecbed850344d160b6c9fc4bac0202a31)` `[`target_hash`](#structcartesi_1_1merkle__tree_1_1proof__type_1ad4a3acda23106bcde187e43a11c63b5c) | Hash of target node.
`public `[`siblings_type`](#classcartesi_1_1merkle__tree_1a8514be6b601f2364a90181876025d0ff)` `[`sibling_hashes`](#structcartesi_1_1merkle__tree_1_1proof__type_1afbe4fb622116fe334323f00d57e6287a) | Hashes of siblings.
`public `[`hash_type`](#classcartesi_1_1merkle__tree_1aecbed850344d160b6c9fc4bac0202a31)` `[`root_hash`](#structcartesi_1_1merkle__tree_1_1proof__type_1a1bccf60d6964d73fd9bea0130c419674) | Hash of root node.

## Members

#### `public address_type `[`address`](#structcartesi_1_1merkle__tree_1_1proof__type_1a1f0125c361c1a1c2e1db85d0db25f7ae) 

Address of target node.

#### `public int `[`log2_size`](#structcartesi_1_1merkle__tree_1_1proof__type_1ab806627888193159c30ebc6ed067de3d) 

log2 of size subintended by target node.

#### `public `[`hash_type`](#classcartesi_1_1merkle__tree_1aecbed850344d160b6c9fc4bac0202a31)` `[`target_hash`](#structcartesi_1_1merkle__tree_1_1proof__type_1ad4a3acda23106bcde187e43a11c63b5c) 

Hash of target node.

#### `public `[`siblings_type`](#classcartesi_1_1merkle__tree_1a8514be6b601f2364a90181876025d0ff)` `[`sibling_hashes`](#structcartesi_1_1merkle__tree_1_1proof__type_1afbe4fb622116fe334323f00d57e6287a) 

Hashes of siblings.

#### `public `[`hash_type`](#classcartesi_1_1merkle__tree_1aecbed850344d160b6c9fc4bac0202a31)` `[`root_hash`](#structcartesi_1_1merkle__tree_1_1proof__type_1a1bccf60d6964d73fd9bea0130c419674) 

Hash of root node.

# struct `cartesi::merkle_tree::tree_node` 

Merkle tree node structure.

A node is known to be an inner-node or a page-node implicitly based on its height in the tree.

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public `[`hash_type`](#classcartesi_1_1merkle__tree_1aecbed850344d160b6c9fc4bac0202a31)` `[`hash`](#structcartesi_1_1merkle__tree_1_1tree__node_1a7c1af403b9c9a7e31f0f2e70aeddf2db) | Hash of subintended data.
`public `[`tree_node`](#structcartesi_1_1merkle__tree_1_1tree__node)` * `[`parent`](#structcartesi_1_1merkle__tree_1_1tree__node_1a2df16045df1192929ea8a66928ec16e1) | Pointer to parent node (nullptr for root).
`public `[`tree_node`](#structcartesi_1_1merkle__tree_1_1tree__node)` * `[`child`](#structcartesi_1_1merkle__tree_1_1tree__node_1a2d7ed0a2ef57be7c7703f90a4c15d5b8) | Children nodes.
`public uint64_t `[`mark`](#structcartesi_1_1merkle__tree_1_1tree__node_1a9c7ac50b1742677b2aa7520db4ced52a) | Helper for traversal algorithms.

## Members

#### `public `[`hash_type`](#classcartesi_1_1merkle__tree_1aecbed850344d160b6c9fc4bac0202a31)` `[`hash`](#structcartesi_1_1merkle__tree_1_1tree__node_1a7c1af403b9c9a7e31f0f2e70aeddf2db) 

Hash of subintended data.

#### `public `[`tree_node`](#structcartesi_1_1merkle__tree_1_1tree__node)` * `[`parent`](#structcartesi_1_1merkle__tree_1_1tree__node_1a2df16045df1192929ea8a66928ec16e1) 

Pointer to parent node (nullptr for root).

#### `public `[`tree_node`](#structcartesi_1_1merkle__tree_1_1tree__node)` * `[`child`](#structcartesi_1_1merkle__tree_1_1tree__node_1a2d7ed0a2ef57be7c7703f90a4c15d5b8) 

Children nodes.

#### `public uint64_t `[`mark`](#structcartesi_1_1merkle__tree_1_1tree__node_1a9c7ac50b1742677b2aa7520db4ced52a) 

Helper for traversal algorithms.

Generated by [Moxygen](https://sourcey.com/moxygen)