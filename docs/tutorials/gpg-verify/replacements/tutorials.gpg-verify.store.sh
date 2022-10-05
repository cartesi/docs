#!/bin/bash
wget https://github.com/cartesi/descartes-tutorials/raw/master/gpg-verify/cartesi-machine/dapp-data.ext2 > /dev/null 2>&1

cartesi-machine \
    --max-mcycle=0 \
    --initial-hash \
    --store=stored_machine \
    --flash-drive="label:dapp-data,filename:dapp-data.ext2" \
    --flash-drive="label:document,length:1<<22" \
    --flash-drive="label:signature,length:1<<12" \
    --flash-drive="label:output,length:1<<12" \
    -- $'date -s \'2100-01-01\' && /mnt/dapp-data/gpg-verify.sh' \
    2>&1

rm dapp-data.ext2
rm -r stored_machine
