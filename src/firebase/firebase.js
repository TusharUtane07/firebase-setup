// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCII1hrhee0YrwYgAeurldQAE-Y9jYmQoY",
  authDomain: "something-52be2.firebaseapp.com",
  projectId: "something-52be2",
  storageBucket: "something-52be2.appspot.com",
  messagingSenderId: "123012831291",
  appId: "1:123012831291:web:9abc4ca7cb8be92492a41e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getFirestore(app);