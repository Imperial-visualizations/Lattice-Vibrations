import Vue from 'vue';
import ImpVis from '@impvis/components';
import '@impvis/components/dist/impvis-components.css';
import two_dimensional from './Two Dimensional.vue';


Vue.use(ImpVis);


new Vue({
    render: h => h(two_dimensional),
  }).$mount('#app')
  