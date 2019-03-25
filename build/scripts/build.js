const util = require('util');
const exec = util.promisify(require('child_process').exec);

(async () => {
    try {
        if (process.platform === 'win32') {
            // Windows
            await exec(`yarn electron:build-win`);
        } else if (process.platform === 'darwin'){
            // macOS
            await exec(`yarn electron:build-macos`);
        } else {
            // Linux
            // await exec(`sudo apt-get install rpm -y`);
            console.log(await exec(`yarn electron:build-linux`));
        }
    } catch (e) {
        console.log(e);
    }
})()