<template>
  <v-container>
    <v-form>
      <v-container>
        <v-layout>
          <v-flex lg12 md12 xs12>
            <v-alert :value="true" type="error">注意：修改布局将会清空当前栅格内容</v-alert>
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex lg6 md6 xs12>
            <v-text-field type="number" v-model="rows" label="行数"></v-text-field>
          </v-flex>
          <v-flex lg6 md6 xs12>
            <v-text-field type="number" v-model="cols" label="列数"></v-text-field>
          </v-flex>
        </v-layout>
      </v-container>
    </v-form>
  </v-container>
</template>
<script>
export default {
  data() {
    return {};
  },
  computed: {
    rows: {
      get() {
        return this.$store.state.settings.layout.rows;
      },
      set(rows) {
        this.$store.commit("updateLayoutRows", rows);
      }
    },
    cols: {
      get() {
        return this.$store.state.settings.layout.cols;
      },
      set(cols) {
        this.$store.commit("updateLayoutCols", cols);
      }
    }
  }
};
</script>
