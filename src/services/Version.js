import axios from 'axios';
const electron = require('electron');
export default class Version {
    static async getLatestVersion() {
        return (await axios.get('https://api.github.com/repos/Last-Order/Monita/releases/latest')).data;
    }
    static getLocalVersion() {
        return electron.remote.app.getVersion();
    }
}