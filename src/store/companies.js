import dbInstance from './db';
import company from './models/company';
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
            state.data = payload.data
            state.loading = false;
            state.error = false;
            state.errorMessage = '';
        },
        ADD_SUCCESS(state, payload) {
            console.log(payload)
            state.data.push(payload.data);
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

            const companies = dbInstance.db().collection('companies').get();
            const data = []


            companies.then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    data.push(company(doc.data()))
                })
            })
                .then(() => commit('SUCCESS', { data }))
                .catch(error => {
                    commit('ERROR', { error });
                })
        },

        store({ commit, rootState, dispatch }, payload) {
            commit('INIT');
            dbInstance.db().collection('companies').add(payload)
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
            dbInstance.db().collection('companies').doc(payload.id).set(payload)
                .then(result => {
                    const data = result.doc()
                    commit('SUCCESS', { data })
                })
                .catch(error => {
                    commit('ERROR', { error });
                });
        },
        remove({ commit, rootState, dispatch }, payload) {
            commit('INIT');
            dbInstance.db().collection('companies').doc(payload.id).delete(payload)
                .then(result => {
                    commit('SUCCESS', { company })
                })
                .catch(error => {
                    commit('ERROR', { error });
                });
        },
    },
    getters: {
        companies: () => state => state.data
    }
}