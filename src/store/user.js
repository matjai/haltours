import { firestoreAction } from "vuexfire";

export default {
  state: {
    currentUser: null
  },
  mutations: {},
  actions: {
    bindUser: firestoreAction((context, payload) => {
      // context contains all original properties like commit, state, etc
      // and adds `bindFirestoreRef` and `unbindFirestoreRef`
      // we return the promise returned by `bindFirestoreRef` that will
      // resolve once data is ready
      let query = context.rootState.db
        .collection("profile")
        .doc(payload.userId);
      return context.bindFirestoreRef("currentUser", query);
    }),
    unbindUser: firestoreAction(({ unbindFirestoreRef }) => {
      unbindFirestoreRef("currentUser");
    })
  },
  getters: {}
};
