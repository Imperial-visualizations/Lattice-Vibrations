import Vue from 'vue';
import ImpVis from '@impvis/components';
import '@impvis/components/dist/impvis-components.css';
import three_dimensional from './Three Dimensional.vue';
import ImpVisKatex from '@impvis/components-katex';

Vue.use(ImpVis);
Vue.use(ImpVisKatex);

new Vue({
    render: h => h(three_dimensional),
  }).$mount('#app')
  