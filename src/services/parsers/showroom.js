import axios from 'axios';
export default async function parse(url) {
    return new Promise(async (resolve, reject) => {
        try {
            const parser = new DOMParser();
            const page = await axios.get(url);
            const doc = parser.parseFromString(page.data, "text/html");
            const videoInfo = JSON.parse(doc.getElementById('js-initial-data').dataset.json);
            if (!videoInfo.streamingUrlHls) {
                resolve({
                    status: 'wait',
                    type: 'hls',
                    streams: [],
                    title: doc.title
                })
            } else {
                resolve({
                    status: 'playing',
                    type: 'hls',
                    streams: [{
                        name: '默认',
                        url: videoInfo.streamingUrlHls
                    }],
                    title: doc.title
                });
            }
            
        } catch (e) {
            reject(e);
        }
    })
}