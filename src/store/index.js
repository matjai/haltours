import login from "@/store/login";
import user from "@/store/user";

import Vue from "vue";
import Vuex from "vuex";
import { vuexfireMutations } from 'vuexfire';

import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import config from "./firebase";

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
  user: null
};

export default new Vuex.Store({
  state,
  mutations: vuexfireMutations,
  modules: {
    login,
    user
  }
});
