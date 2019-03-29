<template>
  <div class="player-container" @wheel="handleWheel">
    <div class="video-info">
      <span class="video-info-title">{{ title }}</span>
      <span class="video-info-volume">音量：{{ this.volume }}%</span>
    </div>
    <template v-if="type === 'youtube'">
      <div class="youtube-player-container">
        <div :id="'youtube-player-' + suffix"></div>
      </div>
      <!-- <iframe
        id="ytplayer"
        type="text/html"
        :src="url"
        width="98%"
        height="98%"
        frameborder="0"
        style="pointer-events: none"
      />-->
    </template>
    <template v-else>
      <div class="video-container">
        <video :volume="volume" ref="player"></video>
      </div>
    </template>
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
      player: undefined,
      suffix: ""
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
    async initYouTubePlayer() {
      this.suffix = new Date().valueOf().toString();
      await this.loadYouTubeDependencies();
      this.player = new YT.Player("youtube-player-" + this.suffix, {
        height: "98%",
        width: "98%",
        videoId: this.url.match(/embed\/(.+)/)[1],
        events: {
          // 'onReady': onPlayerReady,
          // 'onStateChange': onPlayerStateChange
        }
      });
    },
    async loadYouTubeDependencies() {
      if (window.YT) {
        return;
      }
      if (window.isYouTuebLoading) {
        while (!window.YT) {
          await (time => new Promise(resolve => setTimeout(resolve, time)))(
            200
          );
        }
        return;
      } else {
        window.isYouTuebLoading = true;
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        while (!window.YT) {
          await (time => new Promise(resolve => setTimeout(resolve, time)))(
            200
          );
        }
        return;
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
      if (error === "hlsError" && errorType.fatal === false) {
        // ignore
      } else {
        this.destroyPlayer();
        this.$emit("error", this.item, error, errorType, errorDetail);
      }
    }
  },
  watch: {
    volume() {
      if (this.type !== "youtube") {
        this.$refs.player.volume = this.volume / 100;
      } else {
        this.player.a.contentDocument.getElementsByTagName("video")[0].volume =
          this.volume / 100;
      }
    },
    url() {
      this.destroyPlayer();
      if (this.url) {
        this.initPlayer();
      }
    }
  },
  mounted() {
    if (this.url && this.type !== "youtube") {
      this.initPlayer();
    } else {
      this.initYouTubePlayer();
    }
  }
};
</script>
