<template>
  <v-card>
    <!-- <v-card-title>
      <span class="headline">添加视频</span>
    </v-card-title> -->
    <v-card-text>
      <v-container grid-list-md>
        <v-layout>
          <v-flex>
            <span class="section-title">输入链接添加</span>
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex>
            <v-text-field v-model="form.newVideoUrl" label="输入视频地址" required></v-text-field>
          </v-flex>
        </v-layout>
        <v-divider/>
        <v-layout>
          <v-flex>
            <span class="section-title">从收藏列表添加</span>
          </v-flex>
        </v-layout>
        <v-toolbar flat color="white">
          <v-spacer/>
          <v-text-field
            v-model="form.keyword"
            append-icon="search"
            label="搜索"
            single-line
            hide-details
          ></v-text-field>
        </v-toolbar>
        <v-layout>
          <v-flex>
            <v-data-table
              :headers="headers"
              :items="favorites"
              rows-per-page-text="每页数量"
              :rows-per-page-items="[10, 20]"
              :pagination.sync="pagination"
              :custom-sort="sort"
              :search="form.keyword"
              no-results-text="无匹配结果"
            >
              <template v-slot:items="props">
                <td>{{ props.item.channelName }}</td>
                <td>
                  <channel-status :status="props.item.status"/>
                </td>
                <td>
                  <v-btn flat color="primary" @click="addFromFavorites(props.item)">看这个</v-btn>
                </td>
              </template>
            </v-data-table>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" flat @click="addVideo" :loading="form.loading">添加</v-btn>
    </v-card-actions>
  </v-card>
</template>
<style>
.section-title {
  margin: 7px 0;
  font-size: larger;
  font-weight: bold;
  display: block;
}
</style>
<script>
import VideoParser from "@/services/VideoParser";
import ChannelStatus from "../Common/ChannelStatus";
import { mapState } from "vuex";
export default {
  props: ["index"],
  data() {
    return {
      form: {
        loading: false,
        newVideoUrl: "",
        keyword: ""
      },
      pagination: {
        sortBy: "status",
        descending: true
      },
      headers: [
        {
          text: "频道名",
          value: "channelName"
        },
        {
          text: "状态",
          value: "status"
        },
        {
          text: "操作",
          value: "name",
          sortable: false
        }
      ],
      sort: (items, index, isDescending) => {
        const priority = {
          playing: 3,
          wait: 2,
          unknown: 1
        };
        return items.sort((a, b) =>
          isDescending
            ? priority[b.status] - priority[a.status]
            : priority[a.status] - priority[b.status]
        );
      }
    };
  },
  computed: {
    ...mapState({
      favorites: state => state.favorites
    })
  },
  methods: {
    async addVideo() {
      const url = this.form.newVideoUrl;
      if (!url) {
        this.$emit("error", "视频地址不能为空");
        return;
      }
      if (url.endsWith(".m3u8")) {
        // Raw M3U8 URL, play directly.
        this.$emit("added", {
          type: "hls",
          url,
          title: "",
          status: "playing",
          pageUrl: url
        });
      }
      this.form.loading = true;
      try {
        const result = await VideoParser.parse(url);
        this.$emit("added", {
          ...result,
          pageUrl: url
        });
        this.form.newVideoUrl = "";
      } catch (e) {
        this.$emit("error", e);
      }
      this.form.loading = false;
    },
    addFromFavorites(channel) {
      this.form.newVideoUrl = channel.pageUrl;
      this.addVideo();
    }
  },
  components: {
    ChannelStatus
  }
};
</script>
