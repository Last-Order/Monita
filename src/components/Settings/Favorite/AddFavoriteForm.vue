<template>
  <v-card>
    <v-card-title class="headline">添加收藏</v-card-title>
    <v-card-text>
      <v-container>
        <v-form v-model="valid" ref="form">
          <v-layout>
            <v-flex lg6 xs12>
              <v-text-field label="频道名" required :rules="channelNameRules" v-model="channelName"></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex lg6 xs12>
              <v-text-field label="页面地址" required :rules="pageUrlRules" v-model="pageUrl"></v-text-field>
            </v-flex>
          </v-layout>
        </v-form>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn flat color="primary" @click="addFavorite">添加</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  data() {
    return {
      valid: false,
      channelName: "",
      channelNameRules: [v => !!v || "频道名是必须的"],
      pageUrl: "",
      pageUrlRules: [
        v => !!v || "地址是必须的",
        v => !!v && !!v.startsWith("http") || "地址不合法"
      ]
    };
  },
  methods: {
      addFavorite() {
          if (!this.$refs.form.validate()) {
              return;
          }
          this.$emit('added', this.channelName, this.pageUrl);
          this.$refs.form.reset();
      }
  }
};
</script>
