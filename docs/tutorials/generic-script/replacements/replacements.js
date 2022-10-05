module.exports.run = async function() {
    await generateOutput(__dirname, "tutorials.generic-script.run");
    const store = await generateOutput(__dirname, "tutorials.generic-script.store");
    const hash = findHash(store, "0");
    replacements["tutorials.generic-script.hash-full"] = hash;
    replacements["tutorials.generic-script.hash-trunc"] = truncateHash(hash);
}
