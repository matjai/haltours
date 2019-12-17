import dbInstance from './db';
import company from './models/company';
import {
    COMPANY_ERROR, COMPANY_FETCHED,
    COMPANY_ADDED, COMPANY_UPDATED,
    COMPANY_REMOVED, COMPANY_INIT
} from '../../constant';


const COLLECTION = 'companies';

export default {
    state: {
        loading: false,
        data: [],
        error: false,
        errorMessage: ''
    },
    mutations: {
        COMPANY_INIT(state, payload) {
            state.loading = true
            state.error = false;
            state.errorMessage = '';
        },
        COMPANY_FETCHED(state, payload) {
            state.data = payload.data
            state.loading = false;
            state.error = false;
            state.errorMessage = '';
        },
        COMPANY_ADDED(state, payload) {
            state.data.push(payload.data);
            state.loading = false;
            state.error = false;
            state.errorMessage = '';
        },
        COMPANY_UPDATED(state, payload) {
            const { data } = payload;
            state.data = [...state.data, ...data]
            state.loading = false;
            state.error = false;
            state.errorMessage = '';;
        },
        COMPANY_REMOVED(state, payload) {
            const { data } = payload;
            const itemIndex = state.data.indexOf(data)
            state.data.splice(itemIndex, 1)
            state.loading = false;
            state.error = false;
            state.errorMessage = '';

        },
        COMPANY_ERROR(state, payload) {
            state.error = true;
            state.loading = false;
            state.errorMessage = payload.error
        },
    },
    actions: {
        fetch({ commit, rootState, dispatch }) {
            commit(COMPANY_INIT);
            const companies = dbInstance.db().collection(COLLECTION).get();
            const data = []
            companies.then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const id = doc.id;
                    const _m = Object.assign({}, { ...doc.data(), id })
                    data.push(company(_m))
                })
                commit(COMPANY_FETCHED, { data })
            })
                .catch(error => {
                    commit(COMPANY_ERROR, { error });
                })
        },

        store({ commit, rootState, dispatch }, payload) {
            commit(COMPANY_INIT);
            dbInstance.db().collection(COLLECTION).add(payload)
                .then(docRef => {
                    const data = { id: docRef.id, ...payload };
                    commit(COMPANY_ADDED, { data })
                })
                .catch(error => {
                    commit(COMPANY_ERROR, { error });
                });

        },
        update({ commit, rootState, dispatch }, payload) {
            commit(COMPANY_INIT);
            dbInstance.db().collection(COLLECTION).doc(payload.id).set(payload)
                .then(result => {
                    const data = payload
                    commit(COMPANY_UPDATED, { data })
                })
                .catch(error => {
                    commit(COMPANY_ERROR, { error });
                });
        },
        remove({ commit, rootState, dispatch }, payload) {
            commit(COMPANY_INIT);
            dbInstance.db().collection(COLLECTION).doc(payload.id).delete()
                .then(result => {
                    commit(COMPANY_REMOVED, { data: payload })
                })
                .catch(error => {
                    commit(COMPANY_ERROR, { error });
                });
        },
    },
    getters: {
        companies: () => state => state.data
    }
}