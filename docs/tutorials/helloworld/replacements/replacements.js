module.exports.run = async function() {
    await generateOutput(__dirname, "tutorials.helloworld.run");
    const store = await generateOutput(__dirname, "tutorials.helloworld.store");
    const hash = findHash(store, "0");
    await generateOutput(__dirname, "tutorials.helloworld.dir");
    replacements["tutorials.helloworld.hash-full"] = hash;
    replacements["tutorials.helloworld.hash-trunc"] = truncateHash(hash);
}
