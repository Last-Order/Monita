const util = require('util');
const path = require('path');
const exec = util.promisify(require('child_process').exec);

(async () => {
    console.log('Contents of build directory:');
    try {
        await exec(`ls -a ${path.resolve(__dirname, '../../dist_electron')}`);
    } catch (e) {
        //
    }
    if (process.platform === "win32") {
        for (const ext of ['exe', 'msi']) {
            try {
                await exec(`copy ${path.resolve(__dirname, '../../dist_electron/*.' + ext)} ${path.resolve(__dirname, '../../dist_binary/')}`);
            }  catch (e) {
                // 
            }
        }
    } else {
        for (const ext of ['dmg', 'zip', 'appImage', 'deb', 'rpm']) {
            try {
                console.log(`mv ${path.resolve(__dirname, '../../dist_electron/*.' + ext)} ${path.resolve(__dirname, '../../dist_binary/')}`);
                await exec(`mv ${path.resolve(__dirname, '../../dist_electron/*.' + ext)} ${path.resolve(__dirname, '../../dist_binary/')}`);
            } catch (e) {
                //
            }
        }
    }
})()