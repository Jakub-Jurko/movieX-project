import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth"; 

const firebaseConfig = {
  apiKey: "AIzaSyAqvcBP5ee_KMVGvRtoPuCLDM5CjRcP9Jc",
  authDomain: "moviex-ce171.firebaseapp.com",
  projectId: "moviex-ce171",
  storageBucket: "moviex-ce171.firebasestorage.app",
  messagingSenderId: "1085255562619",
  appId: "1:1085255562619:web:e9851207515ebc8094b9de"
};

firebase.initializeApp(firebaseConfig);

const projectFirestore = firebase.firestore();
const projectAuth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider()

export { projectFirestore, projectAuth, googleProvider };
