<template>
  <v-app>
    <!-- <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Monita</span>
      </v-toolbar-title>
    </v-toolbar> -->

    <v-content>
      <Index/>
    </v-content>
  </v-app>
</template>

<script>
import Index from './components/Index'

export default {
  name: 'App',
  components: {
    Index
  },
  data () {
    return {
      //
    }
  }
}
</script>
