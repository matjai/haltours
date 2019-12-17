import firebase from 'firebase/firebase'
import config from './firebase';
const firebaseInstance = firebase.initializeApp(config)
const db = () => firebase.firestore();
const storage = () => firebase.storage();

export default {
    firebaseInstance,
    db,
    storage
}