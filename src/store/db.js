import firebase from 'firebase/firebase'
import config from './firebase';
const firebaseInstance = firebase.initializeApp(config)
const db = () => firebase.firestore();
export default { firebaseInstance, db }