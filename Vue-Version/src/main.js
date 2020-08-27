import Vue from 'vue'
//import Page1 from './Page1.vue'
import Page2 from './Page2.vue'
//import Page3 from './Page3.vue'
//import Page4 from './Page4.vue'

import ImpVis from "@impvis/components";
import "@impvis/components/dist/impvis-components.css";

Vue.config.productionTip = false
Vue.use(ImpVis);

new Vue({
  render: h => h(Page2),
}).$mount('#app')
