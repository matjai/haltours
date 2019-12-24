import dbInstance from './db';
import staff from './models/staff';
import {
    STAFF_INIT, STAFF_FETCHED,
    STAFF_ERROR,
    STAFF_REMOVED,
    STAFF_UPDATED,
    STAFF_ADDED
} from '../../constant';


const COLLECTION = 'staffs';

export default {
    namespaced: true,
    state: {
        loading: false,
        data: [],
        error: false,
        errorMessage: ''
    },
    mutations: {
        STAFF_INIT(state, payload) {
            state.loading = true
            state.error = false;
            state.errorMessage = '';
        },
        STAFF_FETCHED(state, payload) {
            state.data = payload.data;
            state.loading = false;
            state.error = false;
            state.errorMessage = '';
        },
        STAFF_ADDED(state, payload) {
            state.data.push(payload.data);
            state.loading = false;
            state.error = false;
            state.errorMessage = '';

        },
        STAFF_UPDATED(state, payload) {
            const { data } = payload;
            state.data = [...state.data, ...data]
            state.loading = false;
            state.error = false;
            state.errorMessage = '';

        },
        STAFF_REMOVED(state, payload) {
            const { data } = payload;
            const itemIndex = state.data.indexOf(data)
            state.data.splice(itemIndex, 1)
            state.loading = false;
            state.error = false;
            state.errorMessage = '';

        },
        STAFF_ERROR(state, payload) {
            state.error = true;
            state.loading = false;
            state.errorMessage = payload.error
        },
    },
    actions: {
        fetch({ commit, rootState, dispatch }) {
            commit(STAFF_INIT);
            const staffs = dbInstance.db().collection(COLLECTION).get();
            const data = []
            staffs.then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const id = doc.id;
                    const _m = Object.assign({}, { ...doc.data(), id })
                    data.push(staff(_m))
                })
                commit(STAFF_FETCHED, { data })
            })
                .catch(error => {
                    commit(STAFF_ERROR, { error });
                })
        },

        store({ commit, rootState, dispatch }, payload) {
            commit(STAFF_INIT);
            dbInstance.db().collection(COLLECTION).add(payload)
                .then(docRef => {
                    const data = { id: docRef.id, ...payload };
                    commit(STAFF_ADDED, { data })
                })
                .catch(error => {
                    commit(STAFF_ERROR, { error });
                });

        },
        update({ commit, rootState, dispatch }, payload) {
            commit(STAFF_INIT);
            dbInstance.db().collection(COLLECTION).doc(payload.id).set(payload)
                .then(result => {
                    const data = payload
                    commit(STAFF_UPDATED, { data })
                })
                .catch(error => {
                    commit(STAFF_ERROR, { error });
                });
        },
        remove({ commit, rootState, dispatch }, payload) {
            commit(STAFF_INIT);
            dbInstance.db().collection(COLLECTION).doc(payload.id).delete()
                .then(result => {
                    commit(STAFF_REMOVED, { data: payload })
                })
                .catch(error => {
                    commit(STAFF_ERROR, { error });
                });
        },
    },
    getters: {
        staffs: () => state => state.data
    }
}