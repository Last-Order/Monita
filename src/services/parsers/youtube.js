import axios from 'axios';
export default async function parse(url) {
    return new Promise(async (resolve) => {
        let videoId;
        if (url.includes('youtu.be')) {
            videoId = url.match(/\/(.+)/)[1];
        } else if (url.includes('channel')) {
            // get later
        } else if (url.includes('user')) {
            // get later
        } else {
            videoId = url.match(/\?v=(.+)/)[1];
        }
        const page = await axios.get(url);
        const isLiveContent = page.data.match(/"isLiveContent":(.+?)}/)[1] === 'true';
        const title = page.data.match(/"title":"(.+?)"/)[1];
        try {
            const playabilityStatus = page.data.match(/"playabilityStatus":{"status":"(.+?)"/);
            if (playabilityStatus[1] === 'LIVE_STREAM_OFFLINE') {
                resolve({
                    title,
                    status: 'wait',
                    type: 'hls',
                    streams: []
                });
            } else if (playabilityStatus[1] === 'OK') {
                const hlsMasterUrl = page.data.match(/"hlsManifestUrl\\":\\"(.+?)\\"/)[1].replace(/\\\//ig, '/');
                const hlsPlaylists = (await axios.get(hlsMasterUrl)).data;
                const streams = [];
                for (const line of hlsPlaylists.split('\n')) {
                    if (line.startsWith('#EXT-X-STREAM-INF')) {
                        const resolution = line.match(/RESOLUTION=\d+x(\d+)/)[1];
                        const frameRate = line.match(/FRAME-RATE=(\d+)/)[1];
                        if (frameRate !== '30') {
                            streams.push({
                                name: `${resolution}p${frameRate}fps`
                            });
                        } else {
                            streams.push({
                                name: `${resolution}p`
                            });
                        }
                    } else if (!line.startsWith('#') && line !== '') {
                        streams[streams.length - 1].url = line;
                    }
                }
                resolve({
                    streams: streams.reverse(),
                    title,
                    status: 'playing',
                    type: 'hls'
                });
            } else {
                console.log(playabilityStatus);
                throw new Error();
            }
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