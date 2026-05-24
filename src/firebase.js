// src/firebase.js
import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
 apiKey: "AIzaSyBATPs8NbxyA228l1Ey2og2AXiaYOqZlkE",
  authDomain: "tournament-4f141.firebaseapp.com",
  databaseURL: "https://tournament-4f141-default-rtdb.firebaseio.com",
  projectId: "tournament-4f141",
  storageBucket: "tournament-4f141.firebasestorage.app",
  messagingSenderId: "543840121565",
  appId: "1:543840121565:web:78d4b55734a0561b776134",
  measurementId: "G-SK5NGSRV5R"
}

const app = initializeApp(firebaseConfig)
export const database = getDatabase(app)

