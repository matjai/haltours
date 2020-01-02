import { firestoreAction } from "vuexfire";

export default {
  state: {
    companyInfo:null
  },
  mutations: {},
  actions: {
    fetchCompany: firestoreAction( async (context) => {

      return context.bindFirestoreRef("companyInfo", await context.rootState.db
          .collection("companies"));
          
    }),

    fetchCompanyByID:firestoreAction( async (context, payload) => {
      
      return await context.rootState.db
      .collection("companies")
      .doc(payload).get();

    }),
  
    fetchCompanyByCountryID:firestoreAction( async (context, payload) => {
      
      return await context.rootState.db
      .collection("companies")
      .where("countryID", "==", payload).get();

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
