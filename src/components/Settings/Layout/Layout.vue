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
        <v-layout>
          <v-flex>
            <v-btn flat color="red" @click.stop="showResetConfirmDialog = true">重置布局</v-btn>
          </v-flex>
          <v-dialog v-model="showResetConfirmDialog" max-width="290">
            <v-card>
              <v-card-title>
                <span class="headline">确认操作</span>
              </v-card-title>
              <v-card-text>
                确定要重置布局吗，本操作不可逆
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn flat>取消</v-btn>
                <v-btn flat color="red" @click="resetLayout">确认</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-layout>
      </v-container>
    </v-form>
  </v-container>
</template>
<script>
import ImportLayout from './Import';
import ExportLayout from './Export';
import Storage from '@/services/Storage';
export default {
  data() {
    return {
      showImportDialog: false,
      showExportDialog: false,
      showResetConfirmDialog: false
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
  methods: {
    resetLayout() {
      Storage.deleteSetting('layout');
      location.reload();
    },
  },
  components: {
    ExportLayout,
    ImportLayout
  }
};
</script>
