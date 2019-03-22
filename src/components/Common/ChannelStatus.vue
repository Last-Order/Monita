<template>
  <span :style="{ color: textColor }">{{ text }}</span>
</template>
<script>
export default {
  props: ["status"],
  computed: {
    textColor() {
      const colorMap = {
        playing: "#3b8d41",
        wait: "#aaa",
        unknown: "#aaa"
      };
      return colorMap[this.status] || "#aaa";
    },
    text() {
      const textMap = {
        playing: "直播中",
        wait: "空闲中",
        unknown: "未知"
      };
      return textMap[this.status] || "未知";
    }
  }
};
</script>
