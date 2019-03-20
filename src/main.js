import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import store from './store/index';

Vue.config.productionTip = false
document.title = 'Monita';

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
