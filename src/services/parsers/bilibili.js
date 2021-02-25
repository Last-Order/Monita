import axios from "axios";
const QnMap = {
    10000: "原画",
    800: "4K",
    401: "蓝光(杜比)",
    400: "蓝光",
    250: "超清",
    150: "高清",
    80: "流畅",
};
export default async function parse(url) {
    return new Promise(async (resolve, reject) => {
        try {
            if (!url.match(/live.bilibili.com\/(\d+)/)) {
                throw new Error("地址不合法");
            }
            const page = (
                await axios.get(url, {
                    headers: {
                        Accept:
                            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                    },
                })
            ).data;
            const parser = new DOMParser();
            const doc = parser.parseFromString(page, "text/html");
            const roomInfo = JSON.parse(
                doc
                    .getElementsByClassName("script-requirement")[0]
                    .children[0].innerHTML.match(
                        /window.__NEPTUNE_IS_MY_WAIFU__=(.+)/
                    )[1]
            );
            if (roomInfo.roomInitRes.data.live_status === 1) {
                const streams =
                    roomInfo.roomInitRes.data.playurl_info.playurl.stream;
                const flvStream = streams.find(
                    (stream) => stream.protocol_name === "http_stream"
                );
                if (!flvStream) {
                    throw new Error("解析失败");
                }
                const formats = flvStream.format.filter(
                    (format) => format.format_name === "flv"
                );
                const finalStreams = [];
                for (const format of formats) {
                    const codecs = format.codec;
                    for (const codec of codecs) {
                        finalStreams.push({
                            name: QnMap[codec.current_qn],
                            url: `${codec.url_info[0].host}${codec.base_url}${codec.url_info[0].extra}`
                        })
                    }
                }
                resolve({
                    status: "playing",
                    type: "flv",
                    streams: finalStreams,
                    title: roomInfo.roomInfoRes.data.room_info.title,
                });
            } else {
                resolve({
                    status: "wait",
                    type: "flv",
                    streams: [],
                    title: roomInfo.roomInfoRes.data.room_info.title,
                });
            }
        } catch (e) {
            console.log(e);
            reject(e);
        }
    });
}
