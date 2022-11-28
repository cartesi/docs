#!/bin/bash
wget https://github.com/cartesi/descartes-tutorials/raw/master/dogecoin-hash/cartesi-machine/scrypt-hash.ext2

cartesi-machine \
    --max-mcycle=0 \
    --initial-hash \
    --append-rom-bootargs="single=yes" \
    --store=stored_machine \
    --flash-drive="label:scrypt-hash,filename:scrypt-hash.ext2" \
    --flash-drive="label:input,length:1<<12" \
    --flash-drive="label:output,length:1<<12" \
    -- $'cd /mnt/scrypt-hash ; ./scrypt-hash $(flashdrive input) $(flashdrive output)' \
    2>&1

rm scrypt-hash.ext2
rm -r stored_machine
