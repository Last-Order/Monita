<template>
  <v-card>
    <v-card-title>
      <span class="headline">选择流</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-form>
          <v-radio-group v-model="form.url">
            <template v-for="stream in streams">
              <v-radio :key="stream.name" :label="stream.name" :value="stream.url"></v-radio>
            </template>
          </v-radio-group>
        </v-form>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" flat :loading="form.loading" @click="handleApply">应用</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  props: ["streams"],
  data() {
    return {
      form: {
        loading: false,
        url: ""
      }
    };
  },
  mounted() {

  },
  methods: {
      handleApply() {
          this.$emit('selected', this.form.url);
      }
  }
};
</script>
