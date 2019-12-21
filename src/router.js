import Vue from "vue";
import Router from "vue-router";
import Login from "./views/Login";
import Home from "./views/Home";
import Destinations from "./views/Destinations.vue";
import CreateDestination from "./views/CreateDestination.vue";
import Countrylookup from "./views/Countrylookup.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/main",
      name: "main",
      component: () => import("./views/Main.vue")
    },
    {
      // View Destination created
      path: "/destinations/:companyId",
      name: "destinations",
      component: Destinations
    },
    {
      // View create Destination
      path: "/destinations/:companyId/create/1",
      name: "createDestination",
      component: CreateDestination
    },
    {
      path: "/lookup/country",
      name: "countrylookup",
      component: Countrylookup
    }
  ]
});
