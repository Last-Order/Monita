<template>
  <v-card>
    <v-card-title>
      <span class="headline">导入收藏</span>
    </v-card-title>
    <v-card-text>
      <v-form ref="form">
        <v-layout>
          <v-flex>
            <v-textarea
              ref="textarea"
              :rules="favoritesRules"
              label="将别人分享的收藏内容粘贴 / 本操作不会删除你已经添加过的收藏 / 导入内容将和当前内容合理合并"
              v-model="favorites"
            ></v-textarea>
          </v-flex>
        </v-layout>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer/>
      <v-btn flat color="primary" @click="handleClose">放弃</v-btn>
      <v-btn flat color="primary" @click="handleApply">应用</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      favorites: "",
      favoritesRules: [
        v => {
          try {
            const favorites = JSON.parse(decodeURI(atob(v)));
            if (!Array.isArray(favorites)) {
              return "无效的收藏设置";
            }
            for (const fav of favorites) {
              if (!fav.channelName || !fav.pageUrl || !fav.status) {
                return "无效的收藏设置";
              }
            }
          } catch (e) {
            return "无效的收藏设置";
          }
          return true;
        }
      ]
    };
  },
  methods: {
    handleClose() {
      this.$emit("close");
    },
    handleApply() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const nowFavorites = this.$store.state.favorites;
      const newFavorites = JSON.parse(decodeURI(atob(this.favorites)));
      for (const fav of newFavorites) {
        if (nowFavorites.some(i => i.pageUrl === fav.pageUrl)) {
          // 跳过已经添加的
          continue;
        }
        this.$store.dispatch("addFavorite", fav);
      }
      this.$emit("close");
    }
  }
};
</script>
