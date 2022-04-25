#!/bin/bash
cartesi-machine \
    --max-mcycle=0 \
    --initial-hash \
    --store=stored_machine \
    --flash-drive="label:input,length:1<<12" \
    --flash-drive="label:output,length:1<<12" \
    -- $'dd status=none if=$(flashdrive input) | lua -e \'print((string.unpack("z",  io.read("a"))))\' | bc | dd status=none of=$(flashdrive output)' \
    2>&1

rm -r stored_machine
