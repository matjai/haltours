import dbInstance from './db';
import staff from './models/staff';
import { SUCCESS } from '../../constant';

export default {
    state: {
        loading: false,
        data: [],
        error: false,
        errorMessage: ''
    },
    mutations: {
        INIT(state, payload) {
            state.loading = true
            state.error = false;
            state.errorMessage = '';
        },
        SUCCESS(state, payload) {
            state.data = payload.data;
            state.loading = false;
            state.error = false;
            state.errorMessage = '';
        },
        ADD_SUCCESS(state, payload) {
            state.data.push(payload.data);
            state.loading = false;
            state.error = false;
            state.errorMessage = '';

        },
        UPDATED(state, payload) {
            const { data } = payload;
            state.data = [...state.data, ...data]
            state.loading = false;
            state.error = false;
            state.errorMessage = '';

        },
        REMOVED(state, payload) {

            const itemIndex = state.data.indexof(payload)
            state.data = state.data.splice(itemIndex, 1)

            state.loading = false;
            state.error = false;
            state.errorMessage = '';

        },
        ERROR(state, payload) {
            state.error = true;
            state.loading = false;
            state.errorMessage = payload.error
        },
    },
    actions: {
        fetch({ commit, rootState, dispatch }) {
            commit('INIT');
            const staffs = dbInstance.db().collection('staffs').get();
            const data = []
            staffs.then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const id = doc.id;
                    const _m = Object.assign({}, { ...doc.data(), id })
                    data.push(staff(_m))
                })
                commit('SUCCESS', { data })
            })
                .catch(error => {
                    commit('ERROR', { error });
                })
        },

        store({ commit, rootState, dispatch }, payload) {
            commit('INIT');
            dbInstance.db().collection('staffs').add(payload)
                .then(docRef => {
                    const data = { id: docRef.id, ...payload };
                    commit('ADD_SUCCESS', { data })
                })
                .catch(error => {
                    commit('ERROR', { error });
                });

        },
        update({ commit, rootState, dispatch }, payload) {
            commit('INIT');
            console.log(payload)
            dbInstance.db().collection('staffs').doc(payload.id).set(payload)
                .then(result => {
                    const data = payload
                    commit('UPDATED', { data })
                })
                .catch(error => {
                    commit('ERROR', { error });
                });
        },
        remove({ commit, rootState, dispatch }, payload) {
            commit('INIT');
            dbInstance.db().collection('staffs').doc(payload.id).delete()
                .then(result => {
                    commit('REMOVED', { data: payload })
                })
                .catch(error => {
                    commit('ERROR', { error });
                });
        },
    },
    getters: {
        staffs: () => state => state.data
    }
}