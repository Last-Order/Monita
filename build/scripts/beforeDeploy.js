const util = require('util');
const path = require('path');
const exec = util.promisify(require('child_process').exec);

(async () => {
    for (const ext of ['dmg', 'zip', 'appImage', 'deb', 'rpm', 'msi']) {
        try {
            await exec(`mv ${path.resolve(__dirname, '../../dist_electron/*.' + ext)} ${path.resolve(__dirname, '../../dist_binary/')}`);
        } catch (e) {
            //
        }
    }
})()