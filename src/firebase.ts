import { initializeApp } from "firebase/app";
// import "firebase/database"
import { getStorage } from "firebase/storage"
const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DB_URL,
    storageBucket: process.env.STORAGE_BUCKET_URL
};
const firebaseApp = initializeApp(firebaseConfig);

const storage = getStorage(firebaseApp, "gs://voicereg-f04dc.appspot.com/");
// const storage = firebaseApp.storage()
export default storage;