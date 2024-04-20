// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA9YWsnwuA7wITkO2DWh23vxT4Ms5TUTfQ",
  authDomain: "lahacks-8dda9.firebaseapp.com",
  projectId: "lahacks-8dda9",
  storageBucket: "lahacks-8dda9.appspot.com",
  messagingSenderId: "104273836783",
  appId: "1:104273836783:web:0248b6976981c28e42391a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };