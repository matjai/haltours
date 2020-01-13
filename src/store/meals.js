import { firestoreAction } from "vuexfire";

export default {
  state: {
    mealInfo:null
  },
  mutations: {},
  actions: {

    fetchMeal: firestoreAction( async (context) => {

        return context.bindFirestoreRef("mealInfo", await context.rootState.db
        .collection("meals"));
          
    }),

    fetchMealByID:firestoreAction( async (context, payload) => {
        
        return await context.rootState.db
        .collection("meals")
        .doc(payload).get();

    }),

    fetchMealByPackageID:firestoreAction( async (context, payload) => {
        const snapshot =   await context.rootState.db
        .collection("meals")
        .where("packageID", "==", payload).get();

        return snapshot.docs.map(doc => doc.data());
    }),
    
    fetchMealByCompanyID:firestoreAction( async (context, payload) => {

        return context.bindFirestoreRef("mealInfo", await context.rootState.db
        .collection("meals")
        .where("companyID", "==", payload));

    }),

    storeMeal: firestoreAction( async (context, payload) => {

        await context.rootState.db
        .collection("meals").add(payload)
    
    }),

    updateMeal: firestoreAction( async (context, payload) => {

        await context.rootState.db
        .collection("meals").doc(payload.id).set(payload)

    }),

    deleteMeal: firestoreAction( async (context, payload) => {

        await context.rootState.db
        .collection("meals").doc(payload.id).delete()

    }),

      
  },

  getters: {
      
  }
};
