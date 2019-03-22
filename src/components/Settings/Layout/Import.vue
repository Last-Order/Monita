<template>
  <v-card>
    <v-card-title>
      <span class="headline">导入布局</span>
    </v-card-title>
    <v-card-text>
      <v-form ref="form">
        <v-layout>
          <v-flex>
            <v-textarea
              ref="textarea"
              :rules="layoutRules"
              label="将别人分享的布局信息粘贴 / 将会覆盖当前布局 / 刷新生效"
              v-model="layout"
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
import Storage from '../../../services/Storage';
export default {
  data() {
    return {
      layout: "",
      layoutRules: [
        v => {
          try {
            const layout = JSON.parse(decodeURI(atob(v)));
            for (const grid of layout) {
              if (
                grid.x === undefined ||
                grid.y === undefined ||
                grid.w === undefined ||
                grid.h === undefined ||
                grid.i === undefined
              ) {
                return "无效的布局信息";
              }
            }
          } catch (e) {
            return "无效的布局信息";
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
      try {
        const layout = JSON.parse(decodeURI(atob(v)));
        Storage.setSetting('layout', JSON.stringify(layout));
      } catch (e) {
        this.$emit("error", e);
      }
      this.$emit("close");
    }
  }
};
</script>
