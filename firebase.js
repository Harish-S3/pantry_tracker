// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDGo6wN4TSXAr_Rj_qm4t2-PQ5CRKi-p8M",
  authDomain: "inventory-management-51230.firebaseapp.com",
  projectId: "inventory-management-51230",
  storageBucket: "inventory-management-51230.appspot.com",
  messagingSenderId: "956646192258",
  appId: "1:956646192258:web:d60f31b190e00365e2709b",
  measurementId: "G-PV1MHY180G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore}