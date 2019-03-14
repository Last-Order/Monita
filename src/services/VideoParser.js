export default class Parser {
    static parser(url) {
        return new Promise(async (resolve) => {
            switch(new URL(url).host) {
                case 'www.showroom-live.com': {
                    const parser = await import('./parsers/showroom');
                    resolve(await parser.default(url));
                }
            }
        })
    }
}