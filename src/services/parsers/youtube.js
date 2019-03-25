import axios from 'axios';
export default async function parse(url) {
    return new Promise(async (resolve) => {
        let videoId;
        if (url.includes('youtu.be')) {
            videoId = url.match(/\/(.+)/)[1];
        } else if (url.includes('channel')) {
            // get later
        } else {
            videoId = url.match(/\?v=(.+)/)[1];
        }
        const page = await axios.get(url);
        const isLiveContent = page.data.match(/"isLiveContent":(.+?)}/)[1] === 'true';
        const title = page.data.match(/"title":"(.+?)"/)[1];
        try {
            const hlsUrl = page.data.match(/"hlsManifestUrl\\":\\"(.+?)\\"/)[1].replace(/\\\//ig, '/');
            resolve({
                streams: [{
                    name: '默认',
                    url: hlsUrl
                }],
                title,
                status: 'playing',
                type: 'hls'
            });
        } catch (e) {
            // Use embed player
            if (url.includes('channel')) {
                videoId = page.data.match(/{\\"videoId\\":\\"(.+?)\\"/)[1];
            }
            if (!isLiveContent) {
                resolve({
                    status: 'playing',
                    title,
                    streams: [{
                        name: '默认',
                        url: `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0`
                    }],
                    type: 'youtube'
                });
            } else {
                const isLive = page.data.match(/"isLive":(.+?)}/)[1] === 'true';
                resolve({
                    status: isLive ? 'playing' : 'wait',
                    title,
                    streams: [{
                        name: '默认',
                        url: `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0`
                    }],
                    type: 'youtube'
                });
            }
        }
        
    });
}