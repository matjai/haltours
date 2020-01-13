import { firestoreAction } from "vuexfire";

export default {
  state: {
    tourLeaderInfo:null
  },
  mutations: {},
  actions: {

    fetchTourLeader: firestoreAction( async (context) => {

        return context.bindFirestoreRef("tourLeaderInfo", await context.rootState.db
        .collection("tourLeaders"));
          
    }),

    fetchTourLeaderByID:firestoreAction( async (context, payload) => {
        
        return await context.rootState.db
        .collection("tourLeaders")
        .doc(payload).get();

    }),
    
    fetchTourLeaderByDestinationID:firestoreAction( async (context, payload) => {
        
        return context.bindFirestoreRef("tourLeaderInfo", await context.rootState.db
        .collection("tourLeaders")
        .where("destinationID", "==", payload));

    }),

    fetchTourLeaderByPackageID:firestoreAction( async (context, payload) => {

        const snapshot =   await context.rootState.db
        .collection("tourLeaders")
        .where("packageID", "==", payload).get();

        return snapshot.docs.map(doc => doc.data());

    }),

    fetchTourLeaderByCompanyID:firestoreAction( async (context, payload) => {

        return context.bindFirestoreRef("tourLeaderInfo", await context.rootState.db
        .collection("tourLeaders")
        .where("companyID", "==", payload));

  }),

    storeTourLeader: firestoreAction( async (context, payload) => {

        await context.rootState.db
        .collection("tourLeaders").add(payload)
    
    }),

    updateTourLeader: firestoreAction( async (context, payload) => {

        await context.rootState.db
        .collection("tourLeaders").doc(payload.id).set(payload)

    }),

    deleteTourLeader: firestoreAction( async (context, payload) => {

        await context.rootState.db
        .collection("tourLeaders").doc(payload.id).delete()

    }),

      
  },

  getters: {
      
  }
};
