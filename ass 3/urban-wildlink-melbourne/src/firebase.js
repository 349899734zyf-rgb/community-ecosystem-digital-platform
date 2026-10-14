/**
 * firebase.js
 * BR (D.1): External Authentication with Firebase Auth
 * 
 * Standard Firebase SDK initialization for FIT5032.
 * Uses student's verified project credentials (fit5032-ca055).
 */

import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAWAzNgjaf6yi988q2IQ9ow_dJbZV3icPA",
  authDomain: "fit5032-ca055.firebaseapp.com",
  projectId: "fit5032-ca055",
  storageBucket: "fit5032-ca055.firebasestorage.app",
  messagingSenderId: "1003232417828",
  appId: "1:1003232417828:web:9872da205712f089fea0b1"
}

// Initialize Firebase app singleton
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

// Export Firebase Authentication & Firestore
export const auth = getAuth(app)
export const db = getFirestore(app)
export default app
