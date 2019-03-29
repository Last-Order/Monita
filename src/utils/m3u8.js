import CommonUtils from './common';
export class Playlist {
    constructor(content, url, title = "") {
        this.content = content;
        this.url = url;
        this.chunkLists = [];
        this.title = title;
        this.parse();
    }
    parse() {
        const lines = this.content.split('\n');
        lines.forEach((line, index) => {
            if (line.startsWith('#EXT-X-STREAM-INF')) {
                const chunkList = {};
                if (line.match(/BANDWIDTH=(\d+)/) !== null) {
                    chunkList.bandwidth = line.match(/BANDWIDTH=(\d+)/)[1];
                }
                if (line.match(/RESOLUTION=(.+)(\n|$)/) !== null) {
                    chunkList.resolution = {
                        x: line.match(/RESOLUTION=(.+)(\n|$)/)[1].split('x')[0],
                        y: line.match(/RESOLUTION=(.+)(\n|$)/)[1].split('x')[1]
                    }
                }
                chunkList.url = CommonUtils.buildFullUrl(this.url, lines[index + 1]);
                this.chunkLists.push(chunkList);
            }
        });
    }
}