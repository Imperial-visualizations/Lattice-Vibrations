import Vue from 'vue';
import ImpVis from '@impvis/components';
import '@impvis/components/dist/impvis-components.css';
import one_dimensional from './One Dimensional.vue';


Vue.use(ImpVis);


new Vue({
    render: h => h(one_dimensional),
  }).$mount('#app')
  