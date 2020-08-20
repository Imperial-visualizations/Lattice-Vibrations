import Vue from 'vue'
import Page1 from './Page1.vue'

import ImpVis from "@impvis/components";
import "@impvis/components/dist/impvis-components.css";

Vue.config.productionTip = false
Vue.use(ImpVis);

new Vue({
  render: h => h(Page1),
}).$mount('#app')
