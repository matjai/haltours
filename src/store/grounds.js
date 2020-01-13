import { firestoreAction } from "vuexfire";

export default {
  state: {
    groundInfo:null
  },
  mutations: {},
  actions: {

    fetchGround: firestoreAction( async (context) => {

        return context.bindFirestoreRef("groundInfo", await context.rootState.db
        .collection("grounds"));
          
    }),

    fetchGroundByID:firestoreAction( async (context, payload) => {
        
        return await context.rootState.db
        .collection("grounds")
        .doc(payload).get();

    }),
    
    fetchGroundByDestinationID:firestoreAction( async (context, payload) => {
        
        return context.bindFirestoreRef("groundInfo", await context.rootState.db
        .collection("grounds")
        .where("destinationID", "==", payload));

    }),

    fetchGroundByPackageID:firestoreAction( async (context, payload) => {
      
        const snapshot =   await context.rootState.db
        .collection("grounds")
        .where("packageID", "==", payload).get();

        return snapshot.docs.map(doc => doc.data());

    }),

    fetchGroundByCompanyID:firestoreAction( async (context, payload) => {

        return context.bindFirestoreRef("groundInfo", await context.rootState.db
        .collection("grounds")
        .where("companyID", "==", payload));

  }),

    storeGround: firestoreAction( async (context, payload) => {

        await context.rootState.db
        .collection("grounds").add(payload)
    
    }),

    updateGround: firestoreAction( async (context, payload) => {

        await context.rootState.db
        .collection("grounds").doc(payload.id).set(payload)

    }),

    deleteGround: firestoreAction( async (context, payload) => {

        await context.rootState.db
        .collection("grounds").doc(payload.id).delete()

    }),

      
  },

  getters: {
      
  }
};
