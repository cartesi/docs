#!/bin/bash
cartesi-machine \
    --append-rom-bootargs="single=yes" \
    --flash-drive="label:dapp-data,filename:dapp-data-test.ext2" \
    -- $'date -s \'2100-01-01\' && gpg --trusted-key 0xA86D9CB964EB527E --import /mnt/dapp-data/compute-pub.key && gpg --verify /mnt/dapp-data/signature /mnt/dapp-data/document ; echo $?' \
    2>&1
