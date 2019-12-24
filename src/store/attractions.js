import dbInstance from './db';
import attraction from './models/attraction';
import {
    ATTRACTION_ERROR, ATTRACTION_FETCHED,
    ATTRACTION_ADDED, ATTRACTION_UPDATED,
    ATTRACTION_REMOVED, ATTRACTION_INIT
} from '../../constant';


const COLLECTION = 'attractions';

export default {
    namespaced: true,
    state: {
        loading: false,
        data: [],
        error: false,
        errorMessage: ''
    },
    mutations: {
        ATTRACTION_INIT(state, payload) {
            state.loading = true;
            state.error = false;
            state.errorMessage = '';
        },
        ATTRACTION_FETCHED(state, payload) {
            state.data = payload.data;
            state.loading = false;
            state.error = false;
            state.errorMessage = '';
        },
        ATTRACTION_ADDED(state, payload) {
            state.data.push(payload.data);
            state.loading = false;
            state.error = false;
            state.errorMessage = '';
        },
        ATTRACTION_UPDATED(state, payload) {
            const { data } = payload;
            state.data = [...state.data, ...data];
            state.loading = false;
            state.error = false;
            state.errorMessage = '';;
        },
        ATTRACTION_REMOVED(state, payload) {
            const { data } = payload;
            const itemIndex = state.data.indexOf(data);
            state.data.splice(itemIndex, 1);
            state.loading = false;
            state.error = false;
            state.errorMessage = '';

        },
        ATTRACTION_ERROR(state, payload) {
            state.error = true;
            state.loading = false;
            state.errorMessage = payload.error;
        },
    },
    actions: {
        fetch({ commit, rootState, dispatch }) {
            commit(ATTRACTION_INIT);
            const attractions = dbInstance.db().collection(COLLECTION).get();
            const data = [];
            attractions.then((querySnapshot) => {
                querySnapshot.forEach((doc) => {

                    const id = doc.id;
                    const _m = Object.assign({}, { ...doc.data(), id });
                    data.push(attraction(_m));
                });
                commit(ATTRACTION_FETCHED, { data });
            })
                .catch(error => {
                    commit(ATTRACTION_ERROR, { error });
                });
        },

        store({ commit, rootState, dispatch }, payload) {
            commit(ATTRACTION_INIT);
            dbInstance.db().collection(COLLECTION).add(payload)
                .then(docRef => {
                    const data = { id: docRef.id, ...payload };
                    commit(ATTRACTION_ADDED, { data });
                })
                .catch(error => {
                    commit(ATTRACTION_ERROR, { error });
                });

        },
        update({ commit, rootState, dispatch }, payload) {
            commit(ATTRACTION_INIT);
            dbInstance.db().collection(COLLECTION).doc(payload.id).set(payload)
                .then(result => {
                    const data = payload;
                    commit(ATTRACTION_UPDATED, { data });
                })
                .catch(error => {
                    commit(ATTRACTION_ERROR, { error });
                });
        },
        remove({ commit, rootState, dispatch }, payload) {
            commit(ATTRACTION_INIT);
            dbInstance.db().collection(COLLECTION).doc(payload.id).delete()
                .then(result => {
                    commit(ATTRACTION_REMOVED, { data: payload });
                })
                .catch(error => {
                    commit(ATTRACTION_ERROR, { error });
                });
        },
    },
    getters: {
        attractions: () => state => state.data
    }
};