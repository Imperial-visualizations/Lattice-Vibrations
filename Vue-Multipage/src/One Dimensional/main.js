import Vue from 'vue';
import ImpVis from '@impvis/components';
import '@impvis/components/dist/impvis-components.css';
import one_dimensional from './One Dimensional.vue';
import ImpVisKatex from '@impvis/components-katex';

Vue.use(ImpVis);
Vue.use(ImpVisKatex);

new Vue({
    render: h => h(one_dimensional),
  }).$mount('#app')
  