<template>
    <div class="player-container">
        <video ref="player"></video>
    </div>
</template>
<style>
    .player-container {
        width: 100%;
        height: 100%;
    }
    .player-container video {
        width: 100%;
        height: 100%;
    }
</style>

<script>
import HLS from 'hls.js';
export default {
    props: ['url'],
    data() {
        return {};
    },
    methods: {
        initPlayer() {
            const player = new HLS();
            const playerNode = this.$refs.player;
            player.loadSource(this.url);
            player.attachMedia(playerNode);
            player.on(HLS.Events.MANIFEST_PARSED, () => {
                playerNode.play();
            });
        }
    },
    mounted() {
        if (this.url) {
            this.initPlayer();
        }
    }
}
</script>
