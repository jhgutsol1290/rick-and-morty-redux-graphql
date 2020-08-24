import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import config from "./config.json";

let firebaseConfig = {
  apiKey: config.firebaseCred.apiKey,
  authDomain: config.firebaseCred.authDomain,
  databaseURL: config.firebaseCred.databaseURL,
  projectId: config.firebaseCred.projectId,
  storageBucket: config.firebaseCred.storageBucket,
  messagingSenderId: config.firebaseCred.messagingSenderId,
  appId: config.firebaseCred.appId,
  measurementId: config.firebaseCred.measurementId,
};

firebase.initializeApp(firebaseConfig);

// export function loginWithGoogle() {
//   let provider = new firebase.auth.GoogleAuthProvider();
//   return firebase
//     .auth()
//     .signInWithPopup(provider)
//     .then((snap) => snap.user);
// }

const db = firebase.firestore().collection("favs");

export function updateDB(array, uid) {
  return db.doc(uid).set({ array });
}

export async function getFavs(uid) {
  // return db
  //   .doc(uid)
  //   .get()
  //   .then((snap) => {
  //     return snap.data().array;
  //   });
  try {
    const snap = await db.doc(uid).get();
    return snap.data().array;
  } catch (error) {
    console.log(error);
  }
}

export async function loginWithGoogle() {
  let provider = new firebase.auth.GoogleAuthProvider();
  const snap = await firebase.auth().signInWithPopup(provider);
  return snap.user;
}

export function signOutGoogle() {
  firebase.auth().signOut();
}
