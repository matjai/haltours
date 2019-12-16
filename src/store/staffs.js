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
            state.data = payload.data
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
                querySnapshot.data().forEach((doc) => {
                    data.push(staff(doc.data()))
                })
            })
                .then(() => commit('SUCCESS', { data }))
                .catch(error => {
                    commit('ERROR', { error });
                })
        },

        store({ commit, rootState, dispatch }, payload) {
            commit('INIT');
            dbInstance.db().collection('staffs').add(payload)
                .then(result => {
                    const data = result.data()

                    commit('SUCCESS', { data })
                })
                .catch(error => {
                    commit('ERROR', { error });
                });

        },
        update({ commit, rootState, dispatch }, payload) {
            commit('INIT');
            dbInstance.db().collection('staffs').doc(payload.id).set(payload)
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
            dbInstance.db().collection('staffs').doc(payload.id).delete(payload)
                .then(result => {
                    commit('SUCCESS', { staff })
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