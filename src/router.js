import Vue from "vue";
import Router from "vue-router";
import Login from "./views/Login";
import Home from "./views/Home";
<<<<<<< HEAD
import Destinations from "./views/Destinations.vue";
import CreateDestination from "./views/CreateDestination.vue";
import Countrylookup from "./views/Countrylookup.vue";
=======
import Staff from "./views/Staff";
import Company from "./views/Company";
import Attraction from "./views/Attraction";
>>>>>>> origin/master

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
<<<<<<< HEAD
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
=======
    { path: "/", name: "home", component: Home },
    { path: "/login", name: "login", component: Login },
    { path: "/main", name: "main", component: () => import("./views/Main.vue") },
    { path: "/staffs", name: "staffs", component: Staff },
    { path: "/companies", name: "companies", component: Company },
    { path: "/attractions", name: "attractions", component: Attraction },
>>>>>>> origin/master
  ]
});
