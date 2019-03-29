export default class Parser {
    static parse(url) {
        return new Promise(async (resolve, reject) => {
            try {
                switch(new URL(url).host) {
                    case 'www.showroom-live.com': {
                        const parser = await import('./parsers/showroom');
                        resolve(await parser.default(url));
                        break;
                    }
                    case 'live.bilibili.com': {
                        const parser = await import('./parsers/bilibili');
                        resolve(await parser.default(url));
                        break;
                    }
                    case 'www.youtube.com': {
                        const parser = await import('./parsers/youtube');
                        resolve(await parser.default(url));
                        break;
                    }
                    case 'twitcasting.tv': {
                        const parser = await import('./parsers/twitcasting');
                        resolve(await parser.default(url));
                        break;
                    }
                    default: {
                        reject('不受支持的网站');
                    }
                }
            } catch (e) {
                reject('解析失败');
            }
        })
    }
    static getStatus(url) {
        return new Promise(async (resolve, reject) => {
            try {
                const parseResult = await Parser.parse(url);
                resolve(parseResult.status);
            } catch (e) {
                reject(e);
            }
        })
    }
}