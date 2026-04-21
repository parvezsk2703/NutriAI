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
    return onAuthStateChanged(auth, async (user) => {
      const { setUser, setProfile, setLoading } = useAppStore.getState();
      setUser(user);
      
      if (user) {
        const profile = await this.getProfile(user.uid);
        setProfile(profile);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
  },

  async login() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error("Login failed:", error);
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
