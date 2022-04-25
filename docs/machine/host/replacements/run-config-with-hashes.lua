-- Load the Cartesi module
local cartesi = require"cartesi"

-- Writes formatted text to stderr
local function stderr(fmt, ...)
    io.stderr:write(string.format(fmt, ...))
end

-- Converts hash from binary to hexadecimal string
local function hexhash(hash)
    return (string.gsub(hash, ".", function(c)
        return string.format("%02x", string.byte(c))
    end))
end

-- Instantiate machine from configuration
stderr("Building machine: please wait\n")
local machine = cartesi.machine(require(arg[1]))

-- Print the initial hash
machine:update_merkle_tree()
stderr("%u: %s\n", machine:read_mcycle(), hexhash(machine:get_root_hash()))

-- Run machine until it halts
while not machine:read_iflags_H() do
    machine:run(math.maxinteger)
end

-- Print cycle count
stderr("\n\nCycles: %u\n", machine:read_mcycle())

-- Print the final hash
machine:update_merkle_tree()
stderr("%u: %s\n", machine:read_mcycle(), hexhash(machine:get_root_hash()))
