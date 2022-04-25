#!/bin/bash
wget https://github.com/cartesi/descartes-tutorials/raw/master/dogecoin-hash/cartesi-machine/scrypt-hash.ext2 > /dev/null 2>&1

echo "0000000212aca0938fe1fb786c9e0e4375900e8333123de75e240abd3337d1b411d14ebe31757c266102d1bee62ef2ff8438663107d64bdd5d9d9173421ec25fb2a814de52fd869d1b267eeb84214800" | xxd -r -p > input-doge100000.raw
truncate -s 4K input-doge100000.raw
truncate -s 4K output.raw

cartesi-machine \
    --flash-drive="label:scrypt-hash,filename:scrypt-hash.ext2" \
    --flash-drive="label:input,length:1<<12,filename:input-doge100000.raw" \
    --flash-drive="label:output,length:1<<12,filename:output.raw,shared" \
    -- $'cd /mnt/scrypt-hash ; ./scrypt-hash $(flashdrive input) $(flashdrive output)' \
    2>&1


rm input-doge100000.raw
rm output.raw
rm scrypt-hash.ext2
