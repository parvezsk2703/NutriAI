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
    const { isSigningIn, setSigningIn } = useAppStore.getState();
    
    if (isSigningIn) {
      console.log("Sign-in already in progress, ignoring second request.");
      return null;
    }

    try {
      setSigningIn(true);
      console.log("Starting sign-in with popup for domain:", window.location.hostname);
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Sign-in successful, user:", result.user.uid);
      return result.user;
    } catch (error: any) {
      console.error("Detailed Login Error Object:", error);
      
      const domain = window.location.hostname;
      
      if (error.code === 'auth/popup-closed-by-user') {
        alert(`LOGIN FAILED:\n\n1. Check if your browser blocked a popup.\n2. Ensure "${domain}" is added to "Authorized Domains" in your Firebase Auth settings.`);
      } else if (error.code === 'auth/cancelled-popup-request') {
        console.warn("Popup request was cancelled (likely double click).");
      } else if (error.code === 'auth/unauthorized-domain') {
        alert(`DOMAIN ERROR:\n\nYou must add "${domain}" to your Firebase Authorized Domains.\n\nGo to: Firebase Console > Auth > Settings > Authorized Domains.`);
      } else if (error.code === 'auth/internal-error' && error.message.includes('popup')) {
        alert("Browser Error: Your browser blocked the login popup. Please allow popups for this site.");
      } else {
        alert(`Login failed (${error.code}): ${error.message}`);
      }
      return null;
    } finally {
      setSigningIn(false);
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
