<template>
  <v-container>
    <v-dialog v-model="showImportDialog">
      <import-layout @close="showImportDialog = false" />
    </v-dialog>
    <v-dialog v-model="showExportDialog">
      <export-layout @close="showExportDialog = false" />
    </v-dialog>
    <v-form>
      <v-container>
        <v-toolbar flat color="white">
          <v-spacer/>
          <v-btn small dark class="mb-2" @click="showExportDialog = true">导出</v-btn>
          <v-btn small dark class="mb-2" @click="showImportDialog = true">导入</v-btn>
        </v-toolbar>
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
import ImportLayout from './Import';
import ExportLayout from './Export';
export default {
  data() {
    return {
      showImportDialog: false,
      showExportDialog: false
    };
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
  },
  components: {
    ExportLayout,
    ImportLayout
  }
};
</script>
