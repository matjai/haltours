import login from "@/store/login";
import user from "@/store/user";
import staffs from "@/store/staffs";
import companies from "@/store/companies";
import attractions from "@/store/attractions";
import roles from "@/store/roles";
import requestForms from "@/store/requestForm";

import Vue from "vue";
import Vuex from "vuex";
import { vuexfireMutations } from 'vuexfire';

import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import config from "./firebase";
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
Vue.use(Vuex);

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
  companies: null,
  roles: null,
  attractions,
  requestForms,

};

export default new Vuex.Store({
  plugins: [logger],
  state,
  mutations: vuexfireMutations,
  modules: {
    login,
    user,
    staffs,
    companies,
    roles,
    attractions,
    requestForms
  }
});
