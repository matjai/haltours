import Vue from "vue";
import Router from "vue-router";
import Login from "./views/Login";
import Home from "./views/Home";
import Staff from "./views/Staff";
import Company from "./views/Company";
import Attraction from "./views/Attraction";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    { path: "/", name: "home", component: Home },
    { path: "/login", name: "login", component: Login },
    { path: "/main", name: "main", component: () => import("./views/Main.vue") },
    { path: "/staffs", name: "staffs", component: Staff },
    { path: "/companies", name: "companies", component: Company },
    { path: "/attractions", name: "attractions", component: Attraction },
  ]
});
