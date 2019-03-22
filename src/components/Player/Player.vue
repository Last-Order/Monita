<template>
  <div class="player-container" @wheel="handleWheel">
    <div class="video-info">
      <span class="video-info-title">{{ title }}</span>
      <span class="video-info-volume">音量：{{ this.volume }}%</span>
    </div>
    <div class="video-container">
      <video :volume="volume" ref="player"></video>
    </div>
  </div>
</template>
<script>
import HLS from "hls.js";
import FLV from "flv.js";
import "./Player.css";
export default {
  props: ["url", "type", "title", "item"],
  data() {
    return {
      volume: 100,
      player: undefined
    };
  },
  methods: {
    initPlayer() {
      if (this.type === "hls") {
        this.player = new HLS();
        const playerNode = this.$refs.player;
        this.player.loadSource(this.url);
        this.player.attachMedia(playerNode);
        this.player.on(HLS.Events.ERROR, this.handleError);
        this.player.on(HLS.Events.MANIFEST_PARSED, () => {
          playerNode.play();
        });
      } else if (this.type === "flv") {
        const playerNode = this.$refs.player;
        this.player = FLV.createPlayer({
          type: "flv",
          url: this.url
        });
        this.player.attachMediaElement(playerNode);
        this.player.load();
        this.player.on(FLV.Events.ERROR, this.handleError);
        this.player.play();
      }
    },
    destroyPlayer() {
      this.player.destroy();
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
    },
    handleError(error, errorType, errorDetail) {
      this.$emit('error', this.item, error, errorType, errorDetail);
    }
  },
  watch: {
    volume() {
      this.$refs.player.volume = this.volume / 100;
    },
    url() {
      this.destroyPlayer();
      this.initPlayer();
    }
  },
  mounted() {
    if (this.url) {
      this.initPlayer();
    }
  },
};
</script>
