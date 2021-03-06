import login from "@/store/login";
import user from "@/store/user";
import lookup from "@/store/lookup";
import destination from "@/store/destination";
import staffs from "@/store/staffs";
import companies from "@/store/companies";
import attractions from "@/store/attractions";
import packages from "@/store/packages";
import flights from "@/store/flights";
import roles from "@/store/roles";
import requestForms from "@/store/requestForm";
import hotels from "@/store/hotels";
import grounds from "@/store/grounds";
import tourLeaders from "@/store/tourLeaders";
import bagAndInsurances from "@/store/bagAndInsurances";
import meals from "@/store/meals";
import mealtypes from "@/store/mealtypes";

import Vue from "vue";
import Vuex from "vuex";
import { vuexfireMutations } from 'vuexfire';

import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import config from "./firebase";
import UUID from 'vue-uuid';
import createLogger from 'vuex/dist/logger';


//debug logger for browser console 
//in case you are not using vue dev tools
const logger = createLogger({
  collapsed: false,
  filter(mutation, stateBefore, stateAfter) {
    return mutation.type !== "aBlacklistedMutation";
  },
  transformer(state) {
    return state.subTree;
  },
  mutationTransformer(mutation) {
    return mutation.type;
  },
  logger: console,
});

firebase.initializeApp(config);
Vue.use(Vuex, UUID);

const fstore = firebase.firestore();
const fauth = firebase.auth();
const fbucket = firebase.storage();
const fieldValue = firebase.firestore.FieldValue;
const fsTimestamp = firebase.firestore.Timestamp;

const state = {
  db: fstore,
  auth: fauth,
  fs: fbucket,
  fieldValue: fieldValue,
  fsTimestamp: fsTimestamp,
  user: null,
  staffs: null,
  flights: null,
  companies: null,
  roles: null,
  attractions: null,
  packages: null,
  grounds:null,
  tourLeaders:null,
  bagAndInsurances: null,
  meals: null,
  requestForms,
  hotels,
  mealtypes

};

export default new Vuex.Store({
  plugins: [logger],
  state,
  mutations: vuexfireMutations,
  modules: {
    login,
    user,
    lookup,
    destination,
    staffs,
    flights,
    companies,
    roles,
    attractions,
    packages,
    requestForms,
    hotels,
    grounds,
    tourLeaders,
    bagAndInsurances,
    meals,
    mealtypes

  }
});
