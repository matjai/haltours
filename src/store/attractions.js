import { firestoreAction } from "vuexfire";

export default {
  state: {
    attractionInfo:null
  },
  mutations: {},
  actions: {

    fetchAttraction: firestoreAction( async (context) => {

        return context.bindFirestoreRef("attractionInfo", await context.rootState.db
        .collection("attractions"));
          
    }),

    fetchAttractionByID:firestoreAction( async (context, payload) => {
        
        return await context.rootState.db
        .collection("attractions")
        .doc(payload).get();

    }),
    
    fetchAttractionByDestinationID:firestoreAction( async (context, payload) => {
        
        return await context.rootState.db
        .collection("attractions")
        .where("destinationID", "==", payload).get();

    }),

    storeAttraction: firestoreAction( async (context, payload) => {

        await context.rootState.db
        .collection("attractions").add(payload)
    
    }),

    updateAttraction: firestoreAction( async (context, payload) => {

        await context.rootState.db
        .collection("attractions").doc(payload.id).set(payload)

    }),

    deleteAttraction: firestoreAction( async (context, payload) => {

        await context.rootState.db
        .collection("attractions").doc(payload).delete()

    }),

      
  },

  getters: {
      
  }
};
