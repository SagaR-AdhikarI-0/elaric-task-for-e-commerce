
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig'; 

export const signUp = async (email:string, password:string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      role: "user", 
      createdAt: new Date().toISOString(),
    });

    return { user, role: "user" };
  } catch (error) {
    throw error;
  }
};

// LOGIN: Fetches Auth User + Their Role
export const login = async (email:string, password:string) => {
  try {
    // 1. Login with Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2. Fetch their Role from Firestore
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    let role = "user"; // Default fallback
    if (userDoc.exists()) {
      role = userDoc.data().role;
    }

    return { user, role };
  } catch (error) {
    throw error;
  }
};