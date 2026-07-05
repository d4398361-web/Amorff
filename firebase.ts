import { initializeApp } from 'firebase/app';
import { getAuth, sendEmailVerification, onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, serverTimestamp, onSnapshot, collection, query, where, updateDoc, deleteDoc, getDocs, orderBy, limit, addDoc, Timestamp } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export { sendEmailVerification, onAuthStateChanged, signOut, doc, getDoc, setDoc, serverTimestamp, onSnapshot, collection, query, where, updateDoc, deleteDoc, getDocs, orderBy, limit, addDoc, Timestamp };
export type { FirebaseUser };
