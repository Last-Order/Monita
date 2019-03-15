import axios from 'axios';
export default async function parse(url) {
    return new Promise(async (resolve) => {
        const parser = new DOMParser();
        const page = await axios.get(url);
        const doc = parser.parseFromString(page.data, "text/html");
        const videoInfo = JSON.parse(doc.getElementById('js-initial-data').dataset.json);
        resolve({
            type: 'hls',
            url: videoInfo.streamingUrlHls,
            title: doc.title
        });
    })
}