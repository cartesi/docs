#!/bin/bash
wget https://github.com/cartesi/descartes-tutorials/releases/download/v1.1.0/rootfs-python-jwt.ext2 > /dev/null 2>&1

cartesi-machine \
    --max-mcycle=0 \
    --initial-hash \
    --store=stored_machine \
    --flash-drive="label:root,filename:rootfs-python-jwt.ext2" \
    --flash-drive="label:input,length:1<<12" \
    --flash-drive="label:output,length:1<<12" \
    -- $'dd status=none if=$(flashdrive input) | lua -e \'print((string.unpack("z",  io.read("a"))))\' > /input_script ; chmod +x /input_script ; /input_script | dd status=none of=$(flashdrive output)' \
    2>&1

rm rootfs-python-jwt.ext2
rm -r stored_machine
