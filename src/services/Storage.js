export default class Storage {
    static getSetting(name, defaultValue) {
        const settings = localStorage.getItem('settings') ?
            JSON.parse(localStorage.getItem('settings')) : {};
        return settings[name] === undefined ? defaultValue : settings[name];
    }
    static setSetting(name, value) {
        const settings = localStorage.getItem('settings') ?
            JSON.parse(localStorage.getItem('settings')) : {};
        settings[name] = value;
        localStorage.setItem('settings', JSON.stringify(settings));
    }
    static deleteSetting(name) {
        const settings = localStorage.getItem('settings') ?
            JSON.parse(localStorage.getItem('settings')) : {};
        if (Object.keys(settings).includes(name)) {
            delete settings[name];
            localStorage.setItem('settings', JSON.stringify(settings));
        }
    }
}