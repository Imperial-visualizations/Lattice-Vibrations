import Vue from 'vue';
import ImpVis from '@impvis/components';
import '@impvis/components/dist/impvis-components.css';
import introduction from './Introduction.vue';


Vue.use(ImpVis);


new Vue({
    render: h => h(introduction),
  }).$mount('#app')
  