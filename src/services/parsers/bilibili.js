import axios from 'axios';
export default async function parse(url) {
    return new Promise(async (resolve, reject) => {
        try {
            if (!url.match(/live.bilibili.com\/(\d+)/)) {
                throw new Error('地址不合法')
            }
            const page = (await axios.get(url, {
                headers: { 
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
                }
            })).data;
            const parser = new DOMParser();
            const doc = parser.parseFromString(page, 'text/html');
            const roomInfo = JSON.parse(
                doc.getElementsByClassName('script-requirement')[0].children[0].innerHTML.match(/window.__NEPTUNE_IS_MY_WAIFU__=(.+)/)[1]
            );
            resolve({
                status: roomInfo.roomInitRes.data.live_status === 1 ? 'playing' : 'wait',
                type: 'flv',
                url: roomInfo.playUrlRes.data.durl[0].url,
                title: roomInfo.baseInfoRes.data.title
            });
        } catch (e) {
            reject(e);
        }
    })
}