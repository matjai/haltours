import { firestoreAction } from "vuexfire";

export default {
    state: {
        staffs: null
    },
    mutations: {},
    actions: {
        fetchStaffByID: firestoreAction(async (context, payload) => {

            return await context.rootState.db
                .collection("staffs")
                .doc(payload).get();

        }),

        fetchStaff: firestoreAction(async (context) => {

            return context.bindFirestoreRef("staffs", await context.rootState.db
                .collection("staffs"));

        }),

        storeStaff: firestoreAction(async (context, payload) => {
            await context.rootState.db
                .collection("staffs").add(payload);

        }),

        updateStaff: firestoreAction(async (context, payload) => {

            await context.rootState.db
                .collection("staffs").doc(payload.id).set(payload);

        }),

        deleteStaff: firestoreAction(async (context, payload) => {

            await context.rootState.db
                .collection("staffs").doc(payload.id).delete();

        }),


    },

    getters: {
    }
};
