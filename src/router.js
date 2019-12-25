import Vue from "vue";
import Router from "vue-router";
import Login from "./views/Login";
import Home from "./views/Home";
import Destinations from "./views/Destinations.vue";
import CreateDestination from "./views/CreateDestination.vue";
import Countrylookup from "./views/Countrylookup.vue";
import Staff from "./views/Staff";
import Company from "./views/Company";
import Attraction from "./views/Attraction";
import RequestForm from "./views/RequestForm";
import RequestFormCreate from "./views/subviews/RequestFormCreate";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      // View Destination created
      path: "/destinations/:companyId",
      name: "destinations",
      component: Destinations
    },
    {
      // View create Destination
      path: "/destinations/:companyId/:action/:destinationId",
      name: "createDestination",
      component: CreateDestination
    },
    {
      path: "/lookup/country",
      name: "countrylookup",
      component: Countrylookup
    },
    { path: "/", name: "home", component: Home },
    { path: "/login", name: "login", component: Login },
    { path: "/main", name: "main", component: () => import("./views/Main.vue") },
    { path: "/staffs", name: "staffs", component: Staff },
    { path: "/companies", name: "companies", component: Company },
    { path: "/attractions", name: "attractions", component: Attraction },
    {
      path: "/requestForms", name: "requestForms", component: RequestForm
    },
    {
      path: "/requestForms/forms/:company", name: "requestFormsNew", component: RequestFormCreate
    }
  ]
});
