<template>
  <v-container class="main-container" ref="mainContainer">
    <div class="control-panel-container">
      <v-icon small @click="showSettingPanelDialog = true">settings</v-icon>
      <v-icon small @click="refresh">refresh</v-icon>
    </div>
    <v-dialog v-model="showSettingPanelDialog">
      <v-card>
        <v-card-title>
          <span class="headline">设置</span>
        </v-card-title>
        <v-card-text>
          <setting-panel></setting-panel>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showAddVideoDialog">
      <add-video-form @added="handleVideoAdded" @error="showErrorMessage"/>
    </v-dialog>
    <v-dialog v-model="showSelectStreamsDialog">
      <select-stream-form :streams="streamsToSelect" @selected="handleStreamSelected"/>
    </v-dialog>
    <grid-layout
      :layout.sync="layout"
      :col-num="layoutConfig.cols"
      :max-rows="layoutConfig.rows"
      :row-height="layoutConfig.rowHeight"
      :is-draggable="true"
      :is-resizable="true"
      :is-mirrored="false"
      :auto-size="true"
      :vertical-compact="true"
      :margin="[10, 10]"
      :use-css-transforms="true"
    >
      <grid-item
        v-for="item in layout"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        :key="item.i"
        @mouseenter.native="item.gridActionPanelOpacity = 0.7"
        @mouseleave.native="item.gridActionPanelOpacity = 0"
      >
        <div class="grid-actions-container" :style="{ opacity: item.gridActionPanelOpacity }">
          <!-- Grid Actions Overlay -->
          <v-icon small @click="closeVideo(item)">close</v-icon>
          <v-icon small @click="refreshVideo(item)">refresh</v-icon>
          <v-icon small @click="selectStream(item)">menu</v-icon>
        </div>
        <template v-if="item.video.status === 'playing'">
          <player
            :type="item.video.type"
            :url="item.video.nowPlayingStream"
            :title="item.video.title"
            :item="item"
            @error="handlePlayerError"
          />
        </template>
        <template v-else-if="item.video.status === 'wait'">
          <div class="grid-wait">
            <div>{{ item.video.title }}</div>
            <div>正在等待</div>
          </div>
        </template>
        <template v-else-if="item.video.status === 'error'">
          <div class="grid-error">
            <span>视频播放发生错误</span>
          </div>
        </template>
        <template v-else-if="item.video.status === 'empty'">
          <div class="add-video">
            <v-btn
              flat
              color="info"
              @click="activeGridIndex = item.i, showAddVideoDialog = true"
              style="z-index: 27"
            >+</v-btn>
          </div>
        </template>
      </grid-item>
    </grid-layout>
    <v-snackbar v-model="error.show" color="error" :top="true" :timeout="5000">
      {{ error.message }}
      <v-btn dark flat @click="error.show = false">×</v-btn>
    </v-snackbar>
    <v-snackbar v-model="notice.show" :top="true">
      {{ notice.message }}
      <v-btn dark flat @click="notice.show = false">×</v-btn>
    </v-snackbar>
  </v-container>
</template>
<script>
import "./Index.css";
import VueGridLayout from "vue-grid-layout";
import VideoParser from "../services/VideoParser";
import Storage from "../services/Storage";
import Player from "./Player/Player";
import SettingPanel from "./Settings/Index";
import AddVideoForm from "./Home/AddVideoForm";
import SelectStreamForm from "./Home/SelectStreamForm";
import { mapState } from "vuex";

const videoItemTemplate = {
  type: "raw",
  pageUrl: "",
  streams: [],
  nowPlayingStream: "",
  title: "",
  status: "empty",
  channelName: ""
};

const gridItemTemplate = {
  gridActionPanelOpacity: 0
};

export default {
  data() {
    return {
      error: {
        show: false,
        message: ""
      },
      notice: {
        show: false,
        message: ""
      },
      showAddVideoDialog: false,
      showSettingPanelDialog: false,
      showSelectStreamsDialog: false,
      settingPanelTab: 0,
      activeGridIndex: "",
      streamsToSelect: [],
      layout: [],
      layoutConfig: {
        cols: this.$store.state.settings.layout.cols,
        rows: this.$store.state.settings.layout.rows,
        rowHeight: 300
      }
    };
  },
  computed: {
    ...mapState({
      rows: state => state.settings.layout.rows,
      cols: state => state.settings.layout.cols
    })
  },
  watch: {
    rows() {
      this.layoutConfig.rows = this.rows;
      this.resetGrid();
    },
    cols() {
      this.layoutConfig.cols = this.cols;
      this.resetGrid();
    },
    layout: {
      handler: layout => {
        Storage.setSetting("layout", JSON.stringify(layout));
      },
      deep: true
    }
  },
  mounted() {
    window.addEventListener("resize", this.resizeGrid);
    if (Storage.getSetting("layout")) {
      this.layout = JSON.parse(Storage.getSetting("layout"));
    } else {
      this.resetGrid();
    }
    this.resizeGrid();

    // Drop to set background
    if (localStorage.getItem("background")) {
      document.getElementById(
        "app"
      ).style.backgroundImage = `url(${localStorage.getItem("background")})`;
    }
    this.$refs.mainContainer.addEventListener("dragover", e => {
      e.preventDefault();
      e.stopPropagation();
    });
    this.$refs.mainContainer.addEventListener("dragover", e => {
      e.preventDefault();
      e.stopPropagation();
    });
    this.$refs.mainContainer.addEventListener("drop", e => {
      if (e.dataTransfer) {
        if (e.dataTransfer.files.length) {
          e.preventDefault();
          e.stopPropagation();
          const fileReader = new FileReader();
          if (e.dataTransfer.files[0].size > 1024 * 1024 * 5) {
            return this.showErrorMessage("图片过大，不能作为背景");
          }
          fileReader.readAsDataURL(e.dataTransfer.files[0]);
          fileReader.onloadend = () => {
            localStorage.setItem("background", fileReader.result);
            document.getElementById("app").style.backgroundImage = `url(${
              fileReader.result
            })`;
          };
        }
      }
    });

    // Init fav watching
    this.$store.dispatch("initFavoritesTimers");
  },
  methods: {
    resetGrid() {
      const newLayout = [];
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          newLayout.push({
            x: j,
            y: i,
            w: 1,
            h: 1,
            i: j.toString() + "-" + i.toString(),
            ...gridItemTemplate,
            video: {
              ...videoItemTemplate
            }
          });
        }
      }
      this.layout = newLayout;
      this.resizeGrid();
    },
    resizeGrid() {
      const viewportHeight = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
      );
      this.layoutConfig.rowHeight =
        (viewportHeight - (this.layoutConfig.rows + 1) * 10 - 10) /
        this.layoutConfig.rows;
    },
    async handleVideoAdded(video) {
      this.setVideoUrl(this.activeGridIndex, {
        ...video
      });
      this.showAddVideoDialog = false;
    },
    setVideoUrl(index, videoInfo) {
      for (const grid of this.layout) {
        if (grid.i === index) {
          grid.video = {
            ...grid.video,
            nowPlayingStream:
              videoInfo.nowPlayingStream ||
              (videoInfo.status === "playing" ? videoInfo.streams[0].url : ""),
            ...videoInfo
          };
        }
      }
      if (status === "wait") {
        // Listen on wait status
        const timer = setInterval(async () => {
          const videoInfo = await VideoParser.parse(videoInfo.pageUrl);
          if (videoInfo.status === "playing") {
            clearInterval(timer);
            this.setVideoUrl(index, {
              ...videoInfo,
              pageUrl,
              nowPlayingStream: videoInfo.streams[0].url
            });
          }
        }, this.$store.state.settings.general.watchInterval);
      }
    },
    closeVideo(item) {
      item.video = {
        ...videoItemTemplate
      };
    },
    async refreshVideo(item) {
      if (!item.video.pageUrl) {
        return;
      }
      this.showNotice("正在刷新");
      try {
        const result = await VideoParser.parse(item.video.pageUrl);
        this.setVideoUrl(item.i, {
          ...result,
          pageUrl: item.video.pageUrl
        });
      } catch (e) {
        this.showErrorMessage(e);
      }
      this.hideNotice();
    },
    selectStream(item) {
      if (item.video.status !== "playing") {
        return this.showErrorMessage("没有更多流可以切换");
      }
      this.activeGridIndex = item.i;
      this.showSelectStreamsDialog = true;
      this.streamsToSelect = item.video.streams;
    },
    handleStreamSelected(url) {
      this.setVideoUrl(this.activeGridIndex, {
        nowPlayingStream: url
      });
      this.showSelectStreamsDialog = false;
    },
    refresh() {
      location.reload();
    },
    handlePlayerError(item, e) {
      item.video.status = "error";
    },
    showErrorMessage(message) {
      this.error.show = true;
      this.error.message = message;
    },
    showNotice(message) {
      this.notice.show = true;
      this.notice.message = message;
    },
    hideNotice() {
      this.notice.show = false;
    }
  },
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    Player,
    SettingPanel,
    AddVideoForm,
    SelectStreamForm
  }
};
</script>

<style>
</style>
