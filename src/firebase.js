import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDt7l-eG3igvQBm0pPtvBPTeMT82h6xjTw",
  authDomain: "gorillaadmin-7ea78.firebaseapp.com",
  projectId: "gorillaadmin-7ea78",
  storageBucket: "gorillaadmin-7ea78.firebasestorage.app",
  messagingSenderId: "257223447614",
  appId: "1:257223447614:web:441d3d5ce0b5d03a9aad6f"
};



const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

export { auth, storage, db };
