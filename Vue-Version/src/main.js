import Vue from 'vue'
//import Page from './Page1.vue'
//import Page from './Page2.vue'
import Page from './Page3.vue'
//import Page from './Page4.vue'

import ImpVis from "@impvis/components";
import "@impvis/components/dist/impvis-components.css";

Vue.config.productionTip = false
Vue.use(ImpVis);

new Vue({
  render: h => h(Page),
}).$mount('#app')
