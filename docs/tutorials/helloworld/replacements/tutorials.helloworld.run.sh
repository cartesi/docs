#!/bin/bash
cartesi-machine \
    --append-rom-bootargs="single=yes" \
    -- $'echo Hello World!' \
    2>&1
