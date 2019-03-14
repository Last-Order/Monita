<template>
  <v-container>
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
      >
        <template v-if="item.url">
          <player :url="item.url"/>
        </template>
        <template v-else>
          <div class="add-video">
            <v-dialog v-model="showAddVideoDialog" max-width="600px">
              <template v-slot:activator="{ on }">
                <v-btn color="info" v-on="on">+</v-btn>
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
                  <v-btn color="blue darken-1" flat @click="dialog = false">添加</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </template>
      </grid-item>
    </grid-layout>
  </v-container>
</template>

<script>
import "./Index.css";
import VueGridLayout from "vue-grid-layout";
import Player from "./Player/Index";
import VideoParser from "../services/VideoParser";
export default {
  data() {
    return {
      showAddVideoDialog: false,
      form: {
        newVideoUrl: ""
      },
      layout: [
        {
          x: 0,
          y: 0,
          w: 1,
          h: 1,
          i: "1",
          url: ""
        },
        {
          x: 0,
          y: 1,
          w: 1,
          h: 1,
          i: "2",
          url: ""
        },
        {
          x: 1,
          y: 0,
          w: 1,
          h: 1,
          i: "3",
          url: ""
        },
        {
          x: 1,
          y: 1,
          w: 1,
          h: 1,
          i: "4",
          url: ""
        }
      ],
      layoutConfig: {
        cols: 2,
        rows: 2,
        rowHeight: 150
      }
    };
  },
  methods: {
    addVideo(index) {}
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
