import { firestoreAction } from "vuexfire";

export default {
  state: {
    data:null
  },
  mutations: {},
  actions: {
    fetchCompanyByID:firestoreAction( async (context, payload) => {
        
        return await context.rootState.db
        .collection("companies")
        .doc(payload).get();

      }),

    fetchCompany: firestoreAction( async (context) => {

        return context.bindFirestoreRef("data", await context.rootState.db
            .collection("companies"));
            
    }),

    storeCompany: firestoreAction( async (context, payload) => {

        await context.rootState.db
        .collection("companies").add(payload[1])
    
    }),

    updateCompany: firestoreAction( async (context, payload) => {

        await context.rootState.db
        .collection("companies").doc(payload[0]).set(payload[1])

    }),

    deleteCompany: firestoreAction( async (context, payload) => {

        await context.rootState.db
        .collection("companies").doc(payload).delete()

    }),

      
  },

  getters: {
  }
};
