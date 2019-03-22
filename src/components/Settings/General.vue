<template>
  <v-container>
    <v-form>
      <v-container>
        <v-layout>
          <v-flex>
            <v-text-field v-model="watchInterval" label="频道监控刷新间隔(毫秒)"></v-text-field>
          </v-flex>
        </v-layout>
        <v-divider />
        <v-layout>
          <v-flex>
            <v-btn flat color="error" @click="resetAllSettings">重置全部设置</v-btn>
            <v-btn flat color="primary" @click="clearBackground">清除背景</v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-form>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      
    };
  },
  computed: {
    watchInterval: {
      get() {
        return this.$store.state.settings.general.watchInterval;
      },
      set(watchInterval) {
        this.$store.commit('updateWatchInterval', watchInterval);
      }
    }
  },
  methods: {
    clearBackground() {
      localStorage.removeItem('background');
      document.getElementById('app').style.backgroundImage = '';
    },
    resetAllSettings() {
      localStorage.removeItem('settings');
    }
  }
};
</script>
