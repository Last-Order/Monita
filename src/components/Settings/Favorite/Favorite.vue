<template>
  <v-container>
    <v-dialog v-model="showAddFavoritePanel">
      <add-favorite-form @added="handleNewFavoriteAdded"></add-favorite-form>
    </v-dialog>
    <v-dialog v-model="showExportDialog">
      <export-favorite @close="showExportDialog = false" />
    </v-dialog>
    <v-dialog v-model="showImportDialog">
      <import-favorite @close="showImportDialog = false" />
    </v-dialog>
    <v-toolbar flat color="white">
      <v-text-field v-model="keyword" append-icon="search" label="搜索" single-line hide-details></v-text-field>
      <v-spacer></v-spacer>
      <v-btn small color="primary" dark class="mb-2" @click="showAddFavoritePanel = true">添加</v-btn>
      <v-btn small dark class="mb-2" @click="showExportDialog = true">导出</v-btn>
      <v-btn small dark class="mb-2" @click="showImportDialog = true">导入</v-btn>
    </v-toolbar>
    <v-data-table :headers="headers" :items="favorites" rows-per-page-text="每页数量" :rows-per-page-items="[10, 20]" :search="keyword">
      <template v-slot:items="props">
        <td>{{ props.item.channelName }}</td>
        <td>{{ props.item.pageUrl }}</td>
        <td><channel-status :status="props.item.status" /></td>
        <td>
          <v-btn flat small color="error" @click="deleteItem(props.item)">删除</v-btn>
        </td>
      </template>
    </v-data-table>
  </v-container>
</template>
<script>
import ImportFavorite from './Import';
import ExportFavorite from './Export';
import AddFavoriteForm from './AddFavoriteForm';
import ChannelStatus from '../../Common/ChannelStatus';
import { mapState } from 'vuex';
export default {
  data() {
    return {
      showAddFavoritePanel: false,
      keyword: "",
      headers: [
        {
          text: "频道名",
          value: "channelName"
        },
        {
          text: "地址",
          value: "pageUrl"
        },
        {
          text: "状态",
          value: "status"
        },
        {
          text: "操作",
          value: "name",
          sortable: false
        }
      ],
      showExportDialog: false,
      showImportDialog: false,
    };
  },
  computed: {
    ...mapState({
      favorites: state => state.favorites
    })
  },
  methods: {
    deleteItem(item) {
      this.$store.dispatch('deleteFavorite', item);
    },
    handleNewFavoriteAdded(channelName, pageUrl) {
      this.$store.dispatch('addFavorite', {
        channelName,
        pageUrl,
        status: 'unknown',
      });
      this.showAddFavoritePanel = false;
    }
  },
  components: {
    AddFavoriteForm,
    ChannelStatus,
    ImportFavorite,
    ExportFavorite
  }
};
</script>
