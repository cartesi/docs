#!/bin/bash
cartesi-machine \
  --flash-drive="label:dapp-data,filename:dapp-data-test.ext2" \
  -- $'date -s \'2100-01-01\' && gpg --trusted-key 0xA86D9CB964EB527E --import /mnt/dapp-data/descartes-pub.key && gpg --verify /mnt/dapp-data/signature /mnt/dapp-data/document-tampered ; echo $?' \
    2>&1
