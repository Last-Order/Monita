import axios from 'axios';
import { Playlist } from '@/utils/m3u8';
export default async function parse(url) {
    const userName = url.match(/https:\/\/twitcasting.tv\/(.+?)(\/|$)/);
    if (!userName) {
        throw new Error('不支持的链接');
    }
    const page = (await axios.get(url)).data;
    const parser = new DOMParser();
    const doc = parser.parseFromString(page, "text/html");
    const hlsMasterUrl = `https://twitcasting.tv/${userName[1]}/metastream.m3u8`;
    const hlsMaster = (await axios.get(hlsMasterUrl)).data;
    const title = doc.title;
    if (!hlsMaster) {
        return {
            title,
            status: 'wait',
            streams: [],
            type: 'hls'
        }
    }
    const playlist = new Playlist(hlsMaster, hlsMasterUrl);
    return {
        title,
        status: 'playing',
        streams: playlist.chunkLists.map(c => {
            return {
                name: `${c.bandwidth / 1000} kbps`,
                url: c.url
            }
        }),
        type: 'hls'
    }
}