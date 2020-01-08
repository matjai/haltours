import { firestoreAction } from "vuexfire";

export default {
    state: {
        hotels: null,
    },
    mutations: {},
    actions: {

        fetchHotels: firestoreAction(async (context) => {

            return context.bindFirestoreRef("hotels", await context.rootState.db
                .collection("hotels"));

        }),

        fetchHotelsRooms: firestoreAction(async (context, payload) => {
            return context.bindFirestoreRef("hotels", await context.rootState.db
                .collection("hotels").doc(payload).collection('rooms'));

        }),

        storeHotelRooms: firestoreAction(async (context, payload) => {

            return context.bindFirestoreRef("hotels", await context.rootState.db
                .collection("hotels").doc(payload.hotelId).collection('rooms').add(payload.data));

        }),

        updateHotelRooms: firestoreAction(async (context, payload) => {
            return context.bindFirestoreRef("hotels", await context.rootState.db
                .collection("hotels").doc(payload.hotelId).collection('rooms').doc(payload.data.id).set(payload.data));

        }),

        deleteHotelRooms: firestoreAction(async (context, payload) => {
            return context.bindFirestoreRef("hotels", await context.rootState.db
                .collection("hotels").doc(payload.hotelId).collection('rooms').doc(payload.data.id).delete());

        }),

        fetchHotelByID: firestoreAction(async (context, payload) => {
            return await context.rootState.db
                .collection("hotels")
                .doc(payload).get();
        }),


        storeHotels: firestoreAction(async (context, payload) => {
            await context.rootState.db
                .collection("hotels").add(payload);

        }),

        updateHotels: firestoreAction(async (context, payload) => {
            await context.rootState.db
                .collection("hotels").doc(payload.id).set(payload);

        }),

        deleteHotels: firestoreAction(async (context, payload) => {
            await context.rootState.db
                .collection("hotels").doc(payload.id).delete();

        }),


    },

    getters: {

    }
};
