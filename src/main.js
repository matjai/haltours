import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/index";
import vuetify from './plugins/vuetify';
import axios from 'axios';
import VueAxios from 'vue-axios';

Vue.config.productionTip = false;

Vue.use(VueAxios, axios);
const LANDING_PAGE = '/companies'

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
  created() {
    store.state.auth.onAuthStateChanged(function (user) {
      if (user) {
        console.log('user logged in')
        store.dispatch('bindUser', { userId: user.uid })
          .then(() => {
            store.commit('login')
            if (router.currentRoute.name.toLowerCase() === 'login') router.push(LANDING_PAGE).catch(err => { })
          })
        //console.log(user) //REFACTOR function getUser
      } else {
        console.log('No active login.')
        router.push("/")
      }
    });
  }
}).$mount("#app");

//hosting at cikgumurnitravel-1c58c.web.app
