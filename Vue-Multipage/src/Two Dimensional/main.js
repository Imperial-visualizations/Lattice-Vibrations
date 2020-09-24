import Vue from 'vue';
import ImpVis from '@impvis/components';
import ImpVisKatex from '@impvis/components-katex';
import '@impvis/components/dist/impvis-components.css';
import two_dimensional from './Two Dimensional.vue';

Vue.use(ImpVis);
Vue.use(ImpVisKatex);

new Vue({
    render: h => h(two_dimensional),
  }).$mount('#app')
  