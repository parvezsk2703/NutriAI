import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp,
  updateDoc,
  deleteDoc,
  arrayUnion,
  increment
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { DiaryEntry, DayLog } from '../types/nutrition.types';
import { format } from 'date-fns';

export const diaryService = {
  async getDailyLog(uid: string, date: Date): Promise<DayLog | null> {
    const dateStr = format(date, 'yyyy-MM-dd');
    const docRef = doc(db, 'users', uid, 'diary', dateStr);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as DayLog;
    }
    return null;
  },

  async addEntry(uid: string, date: Date, entry: Omit<DiaryEntry, 'id' | 'time'>) {
    const dateStr = format(date, 'yyyy-MM-dd');
    const docRef = doc(db, 'users', uid, 'diary', dateStr);
    
    const newEntry: DiaryEntry = {
      ...entry,
      id: crypto.randomUUID(),
      time: new Date()
    };

    const log = await this.getDailyLog(uid, date);
    
    if (!log) {
      const initialLog: DayLog = {
        date: dateStr,
        entries: [newEntry],
        totals: {
          calories: entry.calories,
          protein_g: entry.protein_g || 0,
          carbs_g: entry.carbs_g || 0,
          fat_g: entry.fat_g || 0,
          fiber_g: entry.fiber_g || 0
        },
        water_ml: 0,
        streak_day: 1 // Simplified: logic for streak could be more complex
      };
      await setDoc(docRef, initialLog);
    } else {
      await updateDoc(docRef, {
        entries: arrayUnion(newEntry),
        'totals.calories': increment(entry.calories),
        'totals.protein_g': increment(entry.protein_g || 0),
        'totals.carbs_g': increment(entry.carbs_g || 0),
        'totals.fat_g': increment(entry.fat_g || 0),
        'totals.fiber_g': increment(entry.fiber_g || 0),
      });
    }
  }
};
