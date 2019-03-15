import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'

Vue.config.productionTip = false
document.title = 'Monita';
new Vue({
  render: h => h(App),
}).$mount('#app')
