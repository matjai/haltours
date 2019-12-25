import { firestoreAction } from "vuexfire";

export default {
  state: {
    countryList: 0
  },
  mutations: {},
  actions: {
    actiontoListCountry: firestoreAction( async (context, payload) => {
        // context contains all original properties like commit, state, etc
        // and adds `bindFirestoreRef` and `unbindFirestoreRef`
        // we return the promise returned by `bindFirestoreRef` that will
        // resolve once data is ready
        console.log(payload)
        await context.rootState.db
          .collection("lookup")
          .doc("countries").set(payload,{merge: true})
      }),
      bindCountry: firestoreAction( async (context) => {
          
      // context contains all original properties like commit, state, etc
      // and adds `bindFirestoreRef` and `unbindFirestoreRef`
      // we return the promise returned by `bindFirestoreRef` that will
      // resolve once data is ready
 
      let query = await context.rootState.db
      .collection("lookup")
      .doc("countries")

    return context.bindFirestoreRef("countryList", query);
  
    }),
  },
  getters: {}
};
