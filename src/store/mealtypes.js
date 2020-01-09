import { firestoreAction } from "vuexfire";

export default {
    state: {
        mealTypes: null
    },
    mutations: {},
    actions: {
        fetchMealtype: firestoreAction(async (context) => {
            return context.bindFirestoreRef("mealTypes", await context.rootState.db
                .collection("mealtypes"));
        }),

        fetchMealtypeByID: firestoreAction(async (context, payload) => {
            return await context.rootState.db
                .collection("mealtypes")
                .doc(payload).get();
        }),

        fetchMealtypeByCountryID: firestoreAction(async (context, payload) => {
            return await context.rootState.db
                .collection("mealtypes")
                .where("countryID", "==", payload).get();
        }),

        storeMealtype: firestoreAction(async (context, payload) => {
            await context.rootState.db
                .collection("mealtypes").add(payload);
        }),

        updateMealtype: firestoreAction(async (context, payload) => {
            await context.rootState.db
                .collection("mealtypes").doc(payload.id).set(payload);
        }),

        deleteMealtype: firestoreAction(async (context, payload) => {
            await context.rootState.db
                .collection("mealtypes").doc(payload.id).delete();
        }),


    },

    getters: {

    }
};
