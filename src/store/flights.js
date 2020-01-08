import { firestoreAction } from "vuexfire";

export default {
  state: {
    flightInfo:null
  },
  mutations: {},
  actions: {

    fetchFlight: firestoreAction( async (context) => {

        return context.bindFirestoreRef("flightInfo", await context.rootState.db
        .collection("flights"));
          
    }),

    fetchFlightByID:firestoreAction( async (context, payload) => {
        
        return await context.rootState.db
        .collection("flights")
        .doc(payload).get();

    }),
    
    fetchFlightByPackageID:firestoreAction( async (context, payload) => {
        // const snapshot =  await context.rootState.db
        // .collection("flights")
        // .where("packageID", "==", payload).get();

        // return snapshot.docs.map(doc => doc.data());
        return context.bindFirestoreRef("flightInfo", await context.rootState.db
        .collection("flights")
        .where("packageID", "==", payload));

    }),
    fetchFlightByCompanyID:firestoreAction( async (context, payload) => {
        // const snapshot =  await context.rootState.db
        // .collection("flights")
        // .where("companyID", "==", payload).get();

        // return snapshot.docs.map(doc => doc.data());
        return context.bindFirestoreRef("flightInfo", await context.rootState.db
        .collection("flights")
        .where("companyID", "==", payload));

    }),


    storeFlight: firestoreAction( async (context, payload) => {

        await context.rootState.db
        .collection("flights").add(payload)
    
    }),

    updateFlight: firestoreAction( async (context, payload) => {

        await context.rootState.db
        .collection("flights").doc(payload.id).set(payload)

    }),

    deleteFlight: firestoreAction( async (context, payload) => {

        await context.rootState.db
        .collection("flights").doc(payload.id).delete()

    }),

      
  },

  getters: {
      
  }
};
