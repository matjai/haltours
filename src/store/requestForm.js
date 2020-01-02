import dbInstance from './db';
import requestForm from './models/requestForm';

import {
    REQUEST_FORM_ERROR, REQUEST_FORM_FETCHED,
    REQUEST_FORM_ADDED, REQUEST_FORM_UPDATED,
    REQUEST_FORM_REMOVED, REQUEST_FORM_INIT
} from '../../constant';


const COLLECTION = 'requestForms';

export default {
    namespaced: true,
    state: {
        loading: false,
        data: [],
        error: false,
        errorMessage: ''
    },
    mutations: {
        REQUEST_FORM_INIT(state, payload) {
            state.loading = true;
            state.error = false;
            state.errorMessage = '';
        },
        REQUEST_FORM_FETCHED(state, payload) {
            state.data = payload.data;
            state.loading = false;
            state.error = false;
            state.errorMessage = '';
        },
        REQUEST_FORM_ADDED(state, payload) {
            state.data.push(payload.data);
            state.loading = false;
            state.error = false;
            state.errorMessage = '';
        },
        REQUEST_FORM_UPDATED(state, payload) {
            const { data } = payload;
            state.data = [...state.data, ...data];
            state.loading = false;
            state.error = false;
            state.errorMessage = '';;
        },
        REQUEST_FORM_REMOVED(state, payload) {
            const { data } = payload;
            const itemIndex = state.data.indexOf(data);
            state.data.splice(itemIndex, 1);
            state.loading = false;
            state.error = false;
            state.errorMessage = '';

        },
        REQUEST_FORM_ERROR(state, payload) {
            state.error = true;
            state.loading = false;
            state.errorMessage = payload.error;
        },
    },
    actions: {
        fetch({ commit, rootState, dispatch }) {
            commit(REQUEST_FORM_INIT);
            const attractions = dbInstance.db().collection(COLLECTION).get();
            const data = [];
            attractions.then((querySnapshot) => {
                querySnapshot.forEach((doc) => {

                    const id = doc.id;
                    const _m = Object.assign({}, { ...doc.data(), id });
                    data.push(requestForm(_m));
                });
                commit(REQUEST_FORM_FETCHED, { data });
            })
                .catch(error => {
                    commit(REQUEST_FORM_ERROR, { error });
                });
        },

        getById({ commit, rootState, dispatch }, id) {
            commit(REQUEST_FORM_INIT);
            const attractions = dbInstance.db()
                .collection(COLLECTION)
                .where('uuid', '==', id);


            const data = [];
            attractions.then((querySnapshot) => {
                querySnapshot.forEach((doc) => {

                    const id = doc.id;
                    const _m = Object.assign({}, { ...doc.data(), id });
                    data.push(requestForm(_m));
                });
                commit(REQUEST_FORM_FETCHED, { data });
            })
                .catch(error => {
                    commit(REQUEST_FORM_ERROR, { error });
                });
        },

        store({ commit, rootState, dispatch }, payload) {
            commit(REQUEST_FORM_INIT);
            return new Promise((resolve, reject) => {
                dbInstance.db().collection(COLLECTION)
                    .add(payload.data)
                    .then(docRef => {
                        const data = { id: docRef.id, ...payload };
                        resolve({ data });
                        commit(REQUEST_FORM_ADDED, { data });
                    })
                    .catch(error => {
                        reject({ error });
                        commit(REQUEST_FORM_ERROR, { error });
                    });
            });

        },
        update({ commit, rootState, dispatch }, payload) {
            commit(REQUEST_FORM_INIT);

            return new Promise((resolve, reject) => {

                console.log(payload);
                dbInstance.db().collection(COLLECTION).doc(payload.id)
                    .set(payload.data)
                    .then(result => {
                        const data = payload;
                        resolve(data);
                        commit(REQUEST_FORM_UPDATED, { data });
                    })
                    .catch(error => {
                        reject(error);

                        commit(REQUEST_FORM_ERROR, { error });
                    });
            });
        },
        remove({ commit, rootState, dispatch }, payload) {
            commit(REQUEST_FORM_INIT);
            dbInstance.db().collection(COLLECTION).doc(payload.id).delete()
                .then(result => {
                    commit(REQUEST_FORM_REMOVED, { data: payload });
                })
                .catch(error => {
                    commit(REQUEST_FORM_ERROR, { error });
                });
        },
    },
    getters: {
        requestForms: () => state => state.data
    }
};