import axios from 'axios';
export default async function parse(url) {
    return new Promise(async (resolve, reject) => {
        try {
            const parser = new DOMParser();
            const page = await axios.get(url);
            const doc = parser.parseFromString(page.data, "text/html");
            const videoInfo = JSON.parse(doc.getElementById('js-initial-data').dataset.json);
            const roomId = videoInfo.roomId;
            const streamingInfoUrl = `https://www.showroom-live.com/api/live/streaming_url?room_id=${roomId}`;
            const streamingInfo = (await axios.get(streamingInfoUrl)).data;
            if (!streamingInfo.streaming_url_list) {
                resolve({
                    status: 'wait',
                    type: 'hls',
                    streams: [],
                    title: doc.title
                });
            } else {
                // const playlistUrl = streamingInfo.streaming_url_list.find(p => p.is_default === true).url;
                // console.log(playlistUrl)
                resolve({
                    status: 'playing',
                    type: 'hls',
                    streams: streamingInfo.streaming_url_list.filter(p => p.is_default === true).map(i => {
                        return {
                            name: i.label,
                            url: i.url
                        }
                    }),
                    title: doc.title
                });
            }            
        } catch (e) {
            reject(e);
        }
    })
}