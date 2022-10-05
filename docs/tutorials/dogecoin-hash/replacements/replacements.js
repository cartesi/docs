module.exports.run = async function() {
    await generateOutput(__dirname, "tutorials.dogecoin-hash.run-valid");
    const store = await generateOutput(__dirname, "tutorials.dogecoin-hash.store");
    const hash = findHash(store, "0");
    replacements["tutorials.dogecoin-hash.hash-full"] = hash;
    replacements["tutorials.dogecoin-hash.hash-trunc"] = truncateHash(hash);
}
