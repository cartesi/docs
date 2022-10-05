module.exports.run = async function() {
    await generateOutput(__dirname, "tutorials.gpg-verify.run-valid");
    await generateOutput(__dirname, "tutorials.gpg-verify.run-invalid");
    const store = await generateOutput(__dirname, "tutorials.gpg-verify.store");
    const hash = findHash(store, "0");
    replacements["tutorials.gpg-verify.hash-full"] = hash;
    replacements["tutorials.gpg-verify.hash-trunc"] = truncateHash(hash);
}
