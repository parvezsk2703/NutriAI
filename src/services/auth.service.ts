import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  User
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useAppStore } from '../store/appStore';
import { UserProfile } from '../types/user.types';

const googleProvider = new GoogleAuthProvider();

export const authService = {
  init() {
    console.log("Initializing Auth Service...");
    const { setUser, setProfile, setLoading } = useAppStore.getState();
    
    // Safety timeout to prevent infinite loading if Firebase hangs
    const timeout = setTimeout(() => {
      console.warn("Auth initialization timed out. Proceeding as unauthenticated.");
      setLoading(false);
    }, 10000);

    return onAuthStateChanged(auth, async (user) => {
      clearTimeout(timeout);
      console.log("Auth state changed:", user ? `User logged in: ${user.uid}` : "No user logged in");
      
      setUser(user);
      
      if (user) {
        try {
          const profile = await this.getProfile(user.uid);
          setProfile(profile);
        } catch (err) {
          console.error("Failed to load user profile:", err);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    }, (error) => {
      clearTimeout(timeout);
      console.error("Auth initialization error:", error);
      setLoading(false);
    });
  },

  async login() {
    try {
      console.log("Starting sign-in with popup...");
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Sign-in successful, user:", result.user.uid);
      return result.user;
    } catch (error: any) {
      console.error("Detailed Login Error:", error);
      
      if (error.code === 'auth/popup-closed-by-user') {
        alert("The login window was closed before finishing. Please make sure your browser isn't blocking popups or third-party cookies.");
      } else if (error.code === 'auth/unauthorized-domain') {
        alert("Domain Error: This URL is not yet authorized in your Firebase console under Authentication > Settings > Authorized Domains.");
      } else {
        alert(`Login failed: ${error.message}`);
      }
      throw error;
    }
  },

  async logout() {
    await signOut(auth);
  },

  async getProfile(uid: string): Promise<UserProfile | null> {
    const docRef = doc(db, 'users', uid, 'profile', 'main');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        ...data,
        created_at: data.created_at.toDate(),
        updated_at: data.updated_at.toDate(),
      } as UserProfile;
    }
    return null;
  },

  async updateProfile(uid: string, profile: Partial<UserProfile>) {
    const docRef = doc(db, 'users', uid, 'profile', 'main');
    await setDoc(docRef, {
      ...profile,
      uid,
      updated_at: serverTimestamp(),
    }, { merge: true });
    
    const updated = await this.getProfile(uid);
    if (updated) {
      useAppStore.getState().setProfile(updated);
    }
  }
};
