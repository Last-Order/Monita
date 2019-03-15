import axios from 'axios';
export default async function parse(url) {
    return new Promise(async (resolve) => {
        if (!url.match(/live.bilibili.com\/(\d+)/)) {
            throw new Error('地址不合法')
        }
        const roomId = url.match(/live.bilibili.com\/(\d+)/)[1];
        const roomInfo = (await axios.get(`https://api.live.bilibili.com/room/v1/Room/playUrl?cid=${roomId}&otype=json&quality=0&platform=web`)).data;
        resolve({
            type: 'flv',
            url: roomInfo.data.durl[0].url,
            title: ''
        });
    })
}