#!/bin/bash
wget https://github.com/cartesi/descartes-tutorials/releases/download/v1.1.0/rootfs-python-jwt.ext2 > /dev/null 2>&1

cp input.py input-trunc.py
truncate -s 4K input-trunc.py

cartesi-machine \
    --flash-drive="label:root,filename:rootfs-python-jwt.ext2" \
    --flash-drive="label:input,length:1<<12,filename:input-trunc.py" \
    -- $'dd status=none if=$(flashdrive input) | lua -e \'print((string.unpack("z",  io.read("a"))))\' | python3' \
    2>&1

rm rootfs-python-jwt.ext2
rm input-trunc.py
