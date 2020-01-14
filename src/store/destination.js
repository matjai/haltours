import { firestoreAction, firebaseAction } from "vuexfire";
import { uuid } from 'vue-uuid';
import _ from 'lodash';
export default {
  state: {
    companyInfo: null,
    companyDesitnation: [],
    destination: null
  },
  mutations: {},
  actions: {
    companyInfo: firestoreAction(async (context, payload) => {
      // context contains all original properties like commit, state, etc
      // and adds `bindFirestoreRef` and `unbindFirestoreRef`
      // we return the promise returned by `bindFirestoreRef` that will
      // resolve once data is ready
      let query = await context.rootState.db
        .collection("companies")
        .doc(payload);

      return context.bindFirestoreRef("companyInfo", query);
    }),

    saveDestinations: firestoreAction(async (context, payload) => {
      // let query =  await context.rootState.db
      //   .collection("destinations").doc(payload[0]).set(payload[1])
      let colluid = null;

      console.log(payload[2]);
      console.log();


      if (payload[3] == true) {
        colluid = payload[4];
      } else {
        colluid = uuid.v1();
      }

      if (payload[2].type == 'image/jpeg' == true) {
        const storageRef = await context.rootState.fs.ref(`destinations/${payload[0]}/${colluid}.jpeg`).put(payload[2]);
        storageRef.ref.getDownloadURL().then(async downloadURL => {
          _.assign(payload[1], { fileUrl: downloadURL });
          let query = await context.rootState.db
            .collection("destinations").doc(payload[0]).set({ [colluid]: payload[1] }, { merge: true });
        });
      } else {
        let query = await context.rootState.db
          .collection("destinations").doc(payload[0]).set({ [colluid]: payload[1] }, { merge: true });
      }
    }),

    getListDestinationByCompany: firestoreAction(async (context, payload) => {
      let query = await context.rootState.db
        .collection("destinations")
        .doc(payload);
      return query.get();
    }),
    getDestinationInfo: firestoreAction(async (context, payload) => {
      let query = await context.rootState.db
        .collection("destinations")
        .doc(`${payload[0]}`);

      return query.get();
    }),

    // This is for copying only
    // copyDataToNewDoc:firestoreAction( async (context, payload) => {
    //   let query =  await context.rootState.db
    //   .collection("destinations")
    //   .doc(payload[0]).get();

    //   await context.rootState.db
    //   .collection("destinations").doc(payload[1]).set(query.data());

    // }),

    getAllDestinations: firestoreAction(async (context) => {
      const snapshot = await context.rootState.db.collection("destinations").get();

      return snapshot.docs.map(doc => doc.data());
    }),
  },

  getters: {}
};
