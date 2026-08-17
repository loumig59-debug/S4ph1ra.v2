import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, collection, collectionGroup, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit, serverTimestamp, increment } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export { signInWithPopup, signOut, onAuthStateChanged, collection, collectionGroup, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit, serverTimestamp, increment };

export async function currentUserProfile(user) {
  if (!user) return null;
  const snap = await getDoc(doc(db, "users", user.uid));
  return snap.exists() ? { id: user.uid, ...snap.data() } : null;
}
export function requireUser(callback) { return onAuthStateChanged(auth, callback); }