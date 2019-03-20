<template>
  <v-container>
    <v-form>
      <v-text-field v-model="form.timeout" label="全局超时阈值"></v-text-field>
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
      }
  }
};
</script>
