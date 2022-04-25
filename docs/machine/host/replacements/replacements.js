const fs = require('fs');

module.exports.run = async function() {

    // overview
    await generateOutput(__dirname, "machine.host.overview.help");
    await generateOutput(__dirname, "machine.host.overview.md5-linux");
    await generateOutput(__dirname, "machine.host.overview.md5-rom");
    await generateOutput(__dirname, "machine.host.overview.md5-rootfs");
    
    // cmdline
    await generateOutput(__dirname, "machine.host.cmdline.ls");
    await generateOutput(__dirname, "machine.host.cmdline.nothing");
    await generateOutput(__dirname, "machine.host.cmdline.flash");
    await generateOutput(__dirname, "machine.host.cmdline.persistent-flash");
    
    
    // cmdline limit exec and state hashes
    const cyclesLimitExec = await generateOutput(__dirname, "machine.host.cmdline.cycles-limit-exec");
    await generateOutput(__dirname, "machine.host.cmdline.limit-exec", cyclesLimitExec);
    
    const stateHashesLimitExec = await generateOutput(__dirname, "machine.host.cmdline.state-hashes-limit-exec", cyclesLimitExec);
    replacements["machine.host.cmdline.state-hashes-initial"] = truncateHash(findHash(stateHashesLimitExec, "0"));
    replacements["machine.host.cmdline.state-hashes-final-limit-exec"] = truncateHash(findHash(stateHashesLimitExec, cyclesLimitExec));
    
    const stateHashesNoLimit = await generateOutput(__dirname, "machine.host.cmdline.state-hashes-no-limit");
    const stateHashesCyclesNoLimit = findCycles(stateHashesNoLimit);
    replacements["machine.host.cmdline.state-hashes-cycles-no-limit"] = stateHashesCyclesNoLimit;
    replacements["machine.host.cmdline.state-hashes-final-no-limit"] = truncateHash(findHash(stateHashesNoLimit, stateHashesCyclesNoLimit));
    
    await generateOutput(__dirname, "machine.host.cmdline.persistent-machine", cyclesLimitExec);
    await generateOutput(__dirname, "machine.host.cmdline.persistent-stored-hash", cyclesLimitExec);


    // cmdline templates
    await generateOutput(__dirname, "machine.host.cmdline.templates-run");
    await generateOutput(__dirname, "machine.host.cmdline.templates-store");
    const templatesHash = await generateOutput(__dirname, "machine.host.cmdline.templates-hash");
    replacements["machine.host.cmdline.templates-trunc-hash"] = truncateHash(templatesHash);

    // cmdline proofs
    await generateOutput(__dirname, "machine.host.cmdline.proofs-pristine-run");
    await generateOutput(__dirname, "machine.host.cmdline.proofs-pristine-json");
    const proofsInput = await generateOutput(__dirname, "machine.host.cmdline.proofs-input-json");
    replacements["machine.host.cmdline.proofs-input-roothash"] = truncateHash(findHash(proofsInput, "root_hash"));
    const proofsOutputRun = await generateOutput(__dirname, "machine.host.cmdline.proofs-output-run");
    const proofsOutputRunCycles = findCycles(proofsOutputRun);
    const proofsOutput = await generateOutput(__dirname, "machine.host.cmdline.proofs-output-json");
    replacements["machine.host.cmdline.proofs-output-roothash"] = truncateHash(findHash(proofsOutput, "root_hash"));

    // cmdline rarely
    await generateOutput(__dirname, "machine.host.cmdline.rarely-append-bootargs");
    const periodicInitialCycle = proofsOutputRunCycles - 10;
    replacements["machine.host.cmdline.rarely-periodic-initial-cycle"] = periodicInitialCycle
    await generateOutput(__dirname, "machine.host.cmdline.rarely-periodic-hashes", periodicInitialCycle);
    await generateOutput(__dirname, "machine.host.cmdline.rarely-step", cyclesLimitExec);
    

    // lua
    const dumpConfigNothing = await generateOutput(__dirname, "machine.host.lua.config-dump-nothing");
    const configNothing = dumpConfigNothing.replace("machine_config = {", "return {").replace("Cycles: 0\n","");
    const mvendorid = findLuaValue(dumpConfigNothing, "mvendorid");
    const mimpid = findLuaValue(dumpConfigNothing, "mimpid");
    const marchid = findLuaValue(dumpConfigNothing, "marchid");
    replacements["machine.host.lua.config-mvendorid"] = mvendorid;
    replacements["machine.host.lua.config-mimpid"] = mimpid;
    replacements["machine.host.lua.config-marchid"] = marchid;
    
    fs.writeFileSync(`${__dirname}/config-nothing-to-do.lua`, configNothing);
    await generateOutput(__dirname, "machine.host.lua.state-hashes-lua", "config-nothing-to-do");
    await generateOutput(__dirname, "machine.host.lua.state-hashes-utility");
    await generateOutput(__dirname, "machine.host.lua.state-transition-dump-step", `config-nothing-to-do ${cyclesLimitExec}`);
    fs.unlinkSync(`${__dirname}/config-nothing-to-do.lua`);
}

