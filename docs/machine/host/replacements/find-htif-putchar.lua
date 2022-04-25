local cartesi = require"cartesi"

local config = {
  processor = {
    mvendorid = -1,
    mimpid = -1,
    marchid = -1,
  },
  ram = {
    image_filename = "/opt/cartesi/share/images/linux.bin",
    length = 0x4000000,
  },
  rom = {
    image_filename = "/opt/cartesi/share/images/rom.bin",
    bootargs = "console=hvc0 rootfstype=ext2 root=/dev/mtdblock0 rw quiet mtdparts=flash.0:-(root)",
  },
  flash_drive = {
    {
      image_filename = "/opt/cartesi/share/images/rootfs.ext2",
      start = 0x8000000000000000,
      length = 0x3c00000,
    },
  },
}

local machine = cartesi.machine(config)

local mcycle = machine:read_mcycle()
local tohost = machine:read_htif_tohost()
local line = 0
while not machine:read_iflags_H() and not machine:read_iflags_Y() do
    machine:run(mcycle+1)
    local newtohost = machine:read_htif_tohost()
    if tohost ~= newtohost then
        tohost = newtohost
        if tohost & 0xff == 0x0a then
            line = line+1
            if line == 8 then
                io.stderr:write(mcycle)
                break
            end
        end
    end
    mcycle = machine:read_mcycle()
end
