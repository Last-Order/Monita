<template>
  <v-container>
    <v-form>
      <v-container>
        <!-- <v-layout>
          <v-flex>
            <v-text-field v-model="form.timeout" label="全局超时阈值"></v-text-field>
          </v-flex>
        </v-layout> -->
        <v-layout>
          <v-flex>
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
      form: {
        timeout: 5000
      }
    };
  },
  methods: {
    clearBackground() {
      localStorage.removeItem('background');
      document.getElementById('app').style.backgroundImage = '';
    }
  }
};
</script>
