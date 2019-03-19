<template>
  <v-container class="main-container">
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
        <div 
          class="grid-actions-container" 
          :style="{ opacity: item.gridActionPanelOpacity }"
        >
          <!-- Grid Actions Overlay -->
          <v-icon small @click="closeVideo(item)">close</v-icon>
          <v-icon small>refresh</v-icon>
        </div>
        <template v-if="item.video.status === 'playing'">
          <player :type="item.video.type" :url="item.video.url" :title="item.video.title"/>
        </template>
        <template v-else-if="item.video.status === 'empty'">
          <div class="add-video">
            <v-dialog v-model="showAddVideoDialog" max-width="600px">
              <template v-slot:activator="{ on }">
                <v-btn
                  flat
                  color="info"
                  v-on="on"
                  @click="form.index = item.i"
                  style="z-index: 27"
                >+</v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">添加视频</span>
                </v-card-title>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex>
                        <v-text-field v-model="form.newVideoUrl" label="输入视频地址" required></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" flat @click="addVideo" :loading="form.loading">添加</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </template>
      </grid-item>
    </grid-layout>
    <v-snackbar v-model="error.show" color="error" :top="true" :timeout="5000">
      {{ error.message }}
      <v-btn dark flat @click="error.show = false">×</v-btn>
    </v-snackbar>
  </v-container>
</template>
<script>
import "./Index.css";
import VueGridLayout from "vue-grid-layout";
import Player from "./Player/Player";
import VideoParser from "../services/VideoParser";

const videoItemTemplate = {
  type: "raw",
  url: "",
  title: "",
  status: "empty"
};

export default {
  data() {
    return {
      error: {
        show: false,
        message: ""
      },
      showAddVideoDialog: false,
      form: {
        index: "",
        newVideoUrl: "",
        loading: false
      },
      layout: [
        {
          x: 0,
          y: 0,
          w: 1,
          h: 1,
          i: "1",
          gridActionPanelOpacity: 0,
          video: {
            ...videoItemTemplate
          }
        },
        {
          x: 0,
          y: 1,
          w: 1,
          h: 1,
          i: "2",
          gridActionPanelOpacity: 0,
          video: {
            ...videoItemTemplate
          }
        },
        {
          x: 1,
          y: 0,
          w: 1,
          h: 1,
          i: "3",
          gridActionPanelOpacity: 0,
          video: {
            ...videoItemTemplate
          }
        },
        {
          x: 1,
          y: 1,
          w: 1,
          h: 1,
          i: "4",
          gridActionPanelOpacity: 0,
          video: {
            ...videoItemTemplate
          }
        }
      ],
      layoutConfig: {
        cols: 2,
        rows: 2,
        rowHeight: 300
      }
    };
  },
  mounted() {
    window.addEventListener("resize", this.resizeGrid);
    this.resizeGrid();
  },
  methods: {
    resizeGrid() {
      const viewportHeight = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
      );
      this.layoutConfig.rowHeight =
        (viewportHeight - (this.layoutConfig.rows + 1) * 10 - 10) /
        this.layoutConfig.rows;
    },
    async addVideo() {
      const url = this.form.newVideoUrl;
      if (!url) {
        this.showErrorMessage("视频地址不能为空");
        return;
      }
      if (url.endsWith(".m3u8")) {
        // Raw M3U8 URL, play directly.
        this.setVideoUrl("hls", url, "", "playing");
      }
      this.form.loading = true;
      try {
        const result = await VideoParser.parse(url);
        this.setVideoUrl(result.type, result.url, result.title, result.status);
        this.showAddVideoDialog = false;
        this.form.newVideoUrl = "";
      } catch (e) {
        this.showErrorMessage(e);
      }
      this.form.loading = false;
    },
    setVideoUrl(type, url, title, status) {
      for (const grid of this.layout) {
        if (grid.i === this.form.index) {
          grid.video.status = status;
          grid.video.type = type;
          grid.video.url = url;
          grid.video.title = title;
        }
      }
    },
    closeVideo(item) {
      item.video = {
        ...videoItemTemplate
      }
    },
    showErrorMessage(message) {
      this.error.show = true;
      this.error.message = message;
    }
  },
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    Player
  }
};
</script>

<style>
</style>
