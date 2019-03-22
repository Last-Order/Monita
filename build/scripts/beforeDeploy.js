const util = require('util');
const path = require('path');
const exec = util.promisify(require('child_process').exec);

(async () => {
    await exec(`ls -a ${path.resolve(__dirname, '../../dist_electron')}`);
    for (const ext of ['dmg', 'zip', 'appImage', 'deb', 'rpm', 'msi']) {
        try {
            console.log(`mv ${path.resolve(__dirname, '../../dist_electron/*.' + ext)} ${path.resolve(__dirname, '../../dist_binary/')}`);
            await exec(`mv ${path.resolve(__dirname, '../../dist_electron/*.' + ext)} ${path.resolve(__dirname, '../../dist_binary/')}`);
        } catch (e) {
            //
        }
    }
})()