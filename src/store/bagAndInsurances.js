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

    fetchBagAndInsuranceByPackageID:firestoreAction( async (context, payload) => {

        const snapshot =   await context.rootState.db
        .collection("bagAndInsurances")
        .where("packageID", "==", payload).get();

        return snapshot.docs.map(doc => doc.data());

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
