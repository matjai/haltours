import dbInstance from './db';
import roles from './models/roles';
import {
    ROLES_INIT,
    ROLES_FETCHED,
    ROLES_ERROR,
    ROLES_REMOVED,
    ROLES_UPDATED,
    ROLES_ADDED
} from '../../constant';


const COLLECTION = 'roles';
const fixturedState = [
    {
        id: 1,
        name: 'Administrator / HQ',
        codeType: 'ADMIN',
        description: 'Admistratrator'
    },
    {
        id: 2,
        name: 'Company / Branch',
        codeType: 'COMPANY',
        description: 'Companies'
    },
    {
        id: 3,
        name: 'Agent',
        codeType: 'AGENT',
        description: 'Agents'
    },

];

export default {
    state: {
        loading: false,
        //temporary loaded our local dummy state
        data: fixturedState,
        error: false,
        errorMessage: ''
    },
    mutations: {
        ROLES_INIT(state, payload) {
            state.loading = true
            state.error = false;
            state.errorMessage = '';
        },
        ROLES_FETCHED(state, payload) {
            //state.data = payload.data;
            state.loading = false;
            state.error = false;
            state.errorMessage = '';
        },
        ROLES_ADDED(state, payload) {
            state.data.push(payload.data);
            state.loading = false;
            state.error = false;
            state.errorMessage = '';
        },
        ROLES_UPDATED(state, payload) {
            const { data } = payload;
            //state.data = [...state.data, ...data]
            state.loading = false;
            state.error = false;
            state.errorMessage = '';
        },
        ROLES_REMOVED(state, payload) {
            const { data } = payload;
            const itemIndex = state.data.indexOf(data)
            //state.data.splice(itemIndex, 1)
            state.loading = false;
            state.error = false;
            state.errorMessage = '';
        },
        ROLES_ERROR(state, payload) {
            state.error = true;
            state.loading = false;
            state.errorMessage = payload.error
        },
    },
    actions: {
        fetch({ commit, rootState, dispatch }) {
            commit(ROLES_INIT);
            const ROLESs = dbInstance.db().collection(COLLECTION).get();
            const data = []
            ROLESs.then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const id = doc.id;
                    const _m = Object.assign({}, { ...doc.data(), id })
                    data.push(roles(_m))
                })
                commit(ROLES_FETCHED, { data })
            })
                .catch(error => {
                    commit(ROLES_ERROR, { error });
                })
        },
        store({ commit, rootState, dispatch }, payload) {
            commit(ROLES_INIT);
            dbInstance.db().collection(COLLECTION).add(payload)
                .then(docRef => {
                    const data = { id: docRef.id, ...payload };
                    commit(ROLES_ADDED, { data })
                })
                .catch(error => {
                    commit(ROLES_ERROR, { error });
                });

        },
        update({ commit, rootState, dispatch }, payload) {
            commit(ROLES_INIT);
            dbInstance.db().collection(COLLECTION).doc(payload.id).set(payload)
                .then(result => {
                    const data = payload
                    commit(ROLES_UPDATED, { data })
                })
                .catch(error => {
                    commit(ROLES_ERROR, { error });
                });
        },
        remove({ commit, rootState, dispatch }, payload) {
            commit(ROLES_INIT);
            dbInstance.db().collection(COLLECTION).doc(payload.id).delete()
                .then(result => {
                    commit(ROLES_REMOVED, { data: payload })
                })
                .catch(error => {
                    commit(ROLES_ERROR, { error });
                });
        },
    },
    getters: {
        getAllRoles: state => state.data
    }
}