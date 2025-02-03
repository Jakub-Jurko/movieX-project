import firebase from "firebase/app"
import "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyAqvcBP5ee_KMVGvRtoPuCLDM5CjRcP9Jc",
    authDomain: "moviex-ce171.firebaseapp.com",
    projectId: "moviex-ce171",
    storageBucket: "moviex-ce171.firebasestorage.app",
    messagingSenderId: "1085255562619",
    appId: "1:1085255562619:web:e9851207515ebc8094b9de"
  };

firebase.initializeApp(firebaseConfig)

const projectFirestore = firebase.firestore()

export { projectFirestore }