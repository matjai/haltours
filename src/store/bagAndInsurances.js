import { firestoreAction } from "vuexfire";

export default {
  state: {
    bagAndInsuranceInfo:null
  },
  mutations: {},
  actions: {

    fetchBagAndInsurance: firestoreAction( async (context) => {

        return context.bindFirestoreRef("bagAndInsuranceInfo", await context.rootState.db
        .collection("bagAndInsurances"));
          
    }),

    fetchBagAndInsuranceByID:firestoreAction( async (context, payload) => {
        
        return await context.rootState.db
        .collection("bagAndInsurances")
        .doc(payload).get();

    }),

    fetchBagAndInsuranceByCompanyID:firestoreAction( async (context, payload) => {

        return context.bindFirestoreRef("bagAndInsuranceInfo", await context.rootState.db
        .collection("bagAndInsurances")
        .where("companyID", "==", payload));

  }),

    storeBagAndInsurance: firestoreAction( async (context, payload) => {

        await context.rootState.db
        .collection("bagAndInsurances").add(payload)
    
    }),

    updateBagAndInsurance: firestoreAction( async (context, payload) => {

        await context.rootState.db
        .collection("bagAndInsurances").doc(payload.id).set(payload)

    }),

    deleteBagAndInsurance: firestoreAction( async (context, payload) => {

        await context.rootState.db
        .collection("bagAndInsurances").doc(payload.id).delete()

    }),

      
  },

  getters: {
      
  }
};
