<template>
  <div class="player-container" @wheel="handleWheel">
    <div class="video-info">
      <span>{{ title }} / 音量：{{ this.volume }}%</span>
    </div>
    <div>
      <video :volume="volume" ref="player"></video>
    </div>
  </div>
</template>
<script>
import HLS from "hls.js";
import FLV from "flv.js";
import "./Player.css";
export default {
  props: ["url", "type", "title"],
  data() {
    return {
      volume: 100
    };
  },
  methods: {
    initPlayer() {
      if (this.type === "hls") {
        const player = new HLS();
        const playerNode = this.$refs.player;
        player.loadSource(this.url);
        player.attachMedia(playerNode);
        player.on(HLS.Events.MANIFEST_PARSED, () => {
          playerNode.play();
        });
      } else if (this.type === "flv") {
        const playerNode = this.$refs.player;
        const flvPlayer = FLV.createPlayer({
          type: "flv",
          url: this.url
        });
        flvPlayer.attachMediaElement(playerNode);
        flvPlayer.load();
        flvPlayer.play();
      }
    },
    handleWheel(e) {
      e.preventDefault();
      e.stopPropagation();
      if (e.deltaY > 0) {
        if (this.volume > 0) {
          this.volume = this.volume - 10;
        }
      } else {
        if (this.volume < 100) {
          this.volume = this.volume + 10;
        }
      }
    }
  },
  watch: {
    volume() {
      this.$refs.player.volume = this.volume / 100;
    }
  },
  mounted() {
    if (this.url) {
      this.initPlayer();
    }
  }
};
</script>
