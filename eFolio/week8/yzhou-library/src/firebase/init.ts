// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAWAzNgjaf6yi988q2IQ9ow_dJbZV3icPA",
  authDomain: "fit5032-ca055.firebaseapp.com",
  projectId: "fit5032-ca055",
  storageBucket: "fit5032-ca055.firebasestorage.app",
  messagingSenderId: "1003232417828",
  appId: "1:1003232417828:web:9872da205712f089fea0b1"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export default db
