import Css from './assets/css.css'
import Vue from 'vue';
import App from './components/App.vue';
const a=[1,2,3];
const c = a.map(i => i+5);
console.log(`${c[0]}`);
console.log(Vue);


// new Vue({
//     el:'#app',
//     component:{ App },
//     template:"<App/>"
// })
new Vue({
    render: h => h(App)
  }).$mount("#app")