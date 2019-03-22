<template>
  <v-card>
    <v-card-title>
      <span class="headline">导出布局</span>
    </v-card-title>
    <v-card-text>
      <v-layout>
        <v-flex>
          <v-textarea ref="textarea" label="复制下列内容分享给别人" :value="layout"></v-textarea>
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-card-actions>
      <v-spacer/>
      <v-btn flat color="primary" @click="handleCopy">复制</v-btn>
      <v-btn flat color="primary" @click="handleClose">关闭</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { mapState } from "vuex";
import Storage from "../../../services/Storage";
export default {
  data() {
    return {
      layout: ""
    };
  },
  mounted() {
    this.layout = btoa(encodeURI(Storage.getSetting("layout")));
  },
  methods: {
    handleCopy() {
      this.layout = btoa(
        encodeURI(Storage.getSetting("layout"))
      );
      this.$nextTick(() => {
        this.$refs.textarea.$el.getElementsByTagName("textarea")[0].select();
        document.execCommand("copy");
      });
    },
    handleClose() {
      this.$emit("close");
    }
  }
};
</script>
