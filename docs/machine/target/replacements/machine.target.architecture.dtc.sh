#!/bin/bash
cartesi-machine -- "dtc -I dtb -O dts /sys/firmware/fdt" 2>&1
