export default {
    state: {
        isLoggedIn: localStorage.getItem('isLoggedIn') || false,
        token: localStorage.getItem('token') || null
    },
    mutations: {
        setToken(state, payload) {
            localStorage.setItem('token', payload)
            state.token = payload
        },
        removeToken(state) {
            localStorage.removeItem('token')
            state.token = null
        },
        login(state) {
            localStorage.setItem('isLoggedIn', true)
            state.isLoggedIn = true
        },
        logout(state) {
            localStorage.removeItem('isLoggedIn')
            state.isLoggedIn = false
        }
    },
    actions: {
        logout({ commit, rootState, dispatch }) {
            rootState.auth.signOut()
                .then(() => {
                    //commit('removeToken')
                    commit('logout')
                    dispatch('unbindUser')
                })
                .catch(err => {
                    console.log('error logging out..')
                });
        },
        login({ commit, dispatch, rootState }, payload) {
            return new Promise((resolve, reject) => {
                rootState.auth.signInWithEmailAndPassword(payload.email, payload.password)
                    .then(result => {
                        dispatch('bindUser', { userId: result.user.uid })
                    })
                    .catch(err => reject(err))
            })
        },
        postlogin() {

        }
    },
    getters: {
        isLoggedIn(state) { return state.isLoggedIn },
        getToken(state) { return state.token }
    }
}