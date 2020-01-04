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

        fetchStaffByCompanyID:firestoreAction( async (context, payload) => {
      
            const snapshot =   await context.rootState.db
            .collection("staffs")
            .where("companyId", "==", payload).get();

            return snapshot.docs.map(doc => doc.data());
      
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
