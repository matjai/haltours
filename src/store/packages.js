import { firestoreAction } from "vuexfire";

export default {
  state: {
    packageInfo:null
  },
  mutations: {},
  actions: {

    fetchPackage: firestoreAction( async (context) => {

        return context.bindFirestoreRef("packageInfo", await context.rootState.db
        .collection("packages"));
          
    }),

    fetchPackageByID:firestoreAction( async (context, payload) => {
        
        return await context.rootState.db
        .collection("packages")
        .doc(payload).get();

    }),
    
    fetchPackageByDestinationID:firestoreAction( async (context, payload) => {
        
        return context.bindFirestoreRef("packageInfo", await context.rootState.db
        .collection("packages")
        .where("destinationID", "==", payload));

    }),

    fetchPackageByCompanyID:firestoreAction( async (context, payload) => {

        return context.bindFirestoreRef("packageInfo", await context.rootState.db
        .collection("packages")
        .where("companyID", "==", payload));

  }),

    storePackage: firestoreAction( async (context, payload) => {

        await context.rootState.db
        .collection("packages").add(payload)
    
    }),

    updatePackage: firestoreAction( async (context, payload) => {

        await context.rootState.db
        .collection("packages").doc(payload.id).set(payload)

    }),

    deletePackage: firestoreAction( async (context, payload) => {

        await context.rootState.db
        .collection("packages").doc(payload).delete()

    }),

      
  },

  getters: {
      
  }
};
