const find = require('find');
const fs = require('fs');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

global.generateOutput = async function(dir, key, params) {
    console.log(`Generating replacement: ${key}...`);

    // changes working directory to provided dir
    const cwd = process.cwd();
    process.chdir(dir);

    // executes corresponding script (uses sed to remove terminal color encodings)
    const script = path.resolve(key+".sh");
    const { stdout } = await exec(`${script} ${params} | sed -r 's/\\x1B\\[([0-9]{1,3}(;[0-9]{1,2})?)?[mGK]//g'`);

    // removes '\r' sequences
    const result = stdout.replace(new RegExp("\r", "g"),"");

    // stores result
    replacements[key] = result;

    // restores working directory and returns result
    process.chdir(cwd);
    return result;
}

global.findCycles = function(output) {
    return output.match("Cycles: (\\d+)")[1];
}

global.findHash = function(output, key) {
    return output.match(`\"*${key}\"*: \"*(\\w+)`)[1];
}

global.truncateHash = function(hash) {
    return hash.substr(0,8)
}

global.findLuaValue = function(output, key) {
    return output.match(`\"*${key}\"* = \"*(\\w+)`)[1];
}

global.replacements = {};

async function main() {

    // looks by default for any replacements scripts under '../docs' directory
    let targetDir = `${__dirname}/../docs`;
    let filter = ""
    if (process.argv[2]) {
        targetDir = process.argv[2];
    }
    if (process.argv[3]) {
        filter = process.argv[3];
    }
    // retrieves 'replacements/replacements.js' scripts under target directory
    const scripts = find.fileSync(new RegExp(`${filter}.*replacements\/replacements\.js$`), targetDir);

    // executes each script
    for (script of scripts) {
        console.log(`Opening script: ${script}`);
        const s = require(script);
        await s.run();
    }

    // writes resulting replacements JSON content-mapping
    fs.writeFileSync("replacements.json", JSON.stringify(global.replacements, null, 2) + "\n");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
