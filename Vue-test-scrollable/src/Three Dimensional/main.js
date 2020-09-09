import Vue from 'vue';
import ImpVis from '@impvis/components';
import '@impvis/components/dist/impvis-components.css';
import three_dimensional from './Three Dimensional.vue';


Vue.use(ImpVis);


new Vue({
    render: h => h(three_dimensional),
  }).$mount('#app')
  