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
