import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

export const signUp = async (email: string, password: string, name?: string, profileImageUrl?: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    await updateProfile(user, {
      displayName: name || '',
      photoURL: profileImageUrl || '',
    });
    
    // Also save to Firestore for additional data
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      name: name || '',
      profileImageUrl: profileImageUrl || '',
      role: "user", 
      createdAt: serverTimestamp(),
    });

    return { user, role: "user" };
  } catch (error: any) {
    console.error("Sign up error:", error);
    throw new Error(error.message || "Failed to sign up");
  }
};

// LOGIN: Fetches Auth User + Their Role
export const login = async (email: string, password: string) => {
  try {
    // 1. Login with Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2. Fetch their Role from Firestore
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    let role = "user"; // Default fallback
    if (userDoc.exists()) {
      role = userDoc.data()?.role || "user";
    }

    return { user, role };
  } catch (error: any) {
    console.error("Login error:", error);
    throw new Error(error.message || "Failed to login");
  }
};

// Get user role by UID
export const getUserRole = async (uid: string): Promise<string> => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    return userDoc.exists() ? userDoc.data()?.role || "user" : "user";
  } catch (error) {
    console.error("Error fetching user role:", error);
    return "user";
  }
};

// Update user profile (name and photo)
export const updateUserProfile = async (uid: string, name: string, photoURL: string) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");
    await updateProfile(user, {
      displayName: name,
      photoURL: photoURL,
    });

    const userDocRef = doc(db, "users", uid);
    await updateDoc(userDocRef, {
      name: name,
      profileImageUrl: photoURL,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Update profile error:", error);
    throw new Error(error.message || "Failed to update profile");
  }
};