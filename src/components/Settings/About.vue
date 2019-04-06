<template>
  <v-container>
    <v-layout>
      <v-flex>
        <div>
          Monita {{ version }}
          <a
            href="https://github.com/Last-Order/Monita"
            target="_blank"
          >https://github.com/Last-Order/Monita</a>
        </div>
        <div>Open-sourced under GPLv3. © 2018-2019, Eridanus Sora, member of MeowSound Idols.</div>
      </v-flex>
    </v-layout>
    <v-layout>
        <v-flex>
            <v-btn color="error" flat @click="openDevTools">打开开发者工具</v-btn>
        </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import { remote } from 'electron'
import Version from "@/services/Version";
export default {
  data() {
    return {
      version: ""
    };
  },
  mounted() {
    this.version = Version.getLocalVersion();
  },
  methods: {
      openDevTools() {
          remote.BrowserWindow.getFocusedWindow().webContents.openDevTools()
      }
  }
};
</script>
