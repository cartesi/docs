module.exports.run = async function() {
    const store = await generateOutput(__dirname, "tutorials.calculator.store");
    const hash = findHash(store, "0");
    replacements["tutorials.calculator.hash-full"] = hash;
    replacements["tutorials.calculator.hash-trunc"] = truncateHash(hash);
}
