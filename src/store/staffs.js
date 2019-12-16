import dbInstance from './db';

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
            state.data = payload.staff;
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
            const staffs = dbInstance.db().collection('staffs');
            commit('SUCCESS', staffs);
        },

        store({ commit, rootState, dispatch }, payload) {
            commit('INIT');
            dbInstance.db().collection('staffs').doc().set(payload)
                .then(result => {
                    commit('SUCCESS', { staff })
                })
                .catch(error => {
                    commit('ERROR', { error });
                });

        },
        update({ commit, rootState, dispatch }, payload) {
            commit('INIT');
            dbInstance.db().collection('staffs').doc(payload.id).set(payload)
                .then(result => {
                    commit('SUCCESS', { staff })
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