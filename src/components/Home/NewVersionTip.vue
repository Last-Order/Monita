<template>
  <v-card>
    <v-card-title>
      <span class="headline">版本更新提示</span>
    </v-card-title>
    <v-card-text>
      <div>新版本：{{ version && version.tag_name }} 可供更新</div>
      <div>
        更新内容：
        <br>
        {{ version && version.body }}
      </div>
    </v-card-text>
    <v-card-actions>
      <v-spacer/>
      <v-btn flat color="#aaa" @click="remindLater">稍后提醒</v-btn>
      <v-btn flat color="#aaa" @click="skipVersion">跳过本版本</v-btn>
      <v-btn flat color="primary" @click="downloadNewVersion">下载新版本</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import Storage from "@/services/Storage";
export default {
  props: ["version"],
  methods: {
    skipVersion() {
      if (this.version) {
        const skippedVersions = Storage.getSetting("skippedVersions") || [];
        if (!skippedVersions.includes(this.version.tag_name)) {
            skippedVersions.push(this.version.tag_name);
        }
        Storage.setSetting("skippedVersions", skippedVersions);
      }
      this.$emit("close");
    },
    remindLater() {
      this.$emit("close");
    },
    downloadNewVersion() {
      window.open("https://github.com/Last-Order/Monita/releases");
    }
  }
};
</script>
