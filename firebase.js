// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFireStore} from  "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDRFqxWECtK3bd_oHyNY7opyKVpgc521AY",
  authDomain: "my-first-firebase-73f16.firebaseapp.com",
  projectId: "my-first-firebase-73f16",
  storageBucket: "my-first-firebase-73f16.appspot.com",
  messagingSenderId: "832461598511",
  appId: "1:832461598511:web:8c5038da9ecec458a93bda",
  measurementId: "G-RJJ7GG87CC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFireStore(app);

export {firestore}