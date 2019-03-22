<template>
  <v-tabs v-model="settingPanelTab">
    <v-tab :key="1">通用</v-tab>
    <v-tab-item :key="1">
        <general-setting></general-setting>
    </v-tab-item>
    <v-tab :key="2">布局</v-tab>
    <v-tab-item :key="2">
      <layout-setting></layout-setting>
    </v-tab-item>
    <v-tab :key="3">收藏</v-tab>
    <v-tab-item :key="3">
      <favorite-setting></favorite-setting>
    </v-tab-item>
  </v-tabs>
</template>
<script>
import GeneralSetting from './General';
import LayoutSetting from './Layout/Layout';
import FavoriteSetting from './Favorite/Favorite';
export default {
  data() {
      return {
          settingPanelTab: 0
      }
  },
  components: {
      GeneralSetting,
      LayoutSetting,
      FavoriteSetting
  }
};
</script>
