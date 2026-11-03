export type PostCategory = 'general' | 'advice' | 'milestone' | 'food' | 'emergency';

export interface Comment {
  id: string;
  authorName: string;
  authorCity?: string;
  babyAgeText?: string;
  text: string;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorRole: string; // e.g. "৭ মাসের মায়ের আইডি", "শিশু বিশেষজ্ঞ পরামর্শ"
  authorCity: string;
  category: PostCategory;
  content: string;
  imageUrl?: string;
  likesCount: number;
  prayersCount: number; // 🤲 দোয়া
  lovesCount: number;  // ❤️ ভালোবাসা
  comments: Comment[];
  isUserPost?: boolean;
  userReaction?: 'like' | 'love' | 'prayer' | null;
  createdAt: string;
}

export interface BloodRequest {
  id: string;
  patientName: string;
  ageText: string;
  bloodGroup: string; // e.g. 'O+', 'B+', 'AB-'
  hospitalName: string;
  hospitalLocation: string; // e.g. ঢাকা শিশু হাসপাতাল / চট্টগ্রাম মেডিকেল
  bagsNeeded: number;
  requiredDate: string;
  contactNumber: string;
  contactPerson: string;
  urgency: 'critical' | 'urgent' | 'moderate';
  details: string;
  createdAt: string;
}

export interface GrowthRecord {
  id: string;
  babyId: string;
  date: string; // YYYY-MM-DD
  ageMonths: number;
  weightKg: number;
  heightCm: number;
  headCircumferenceCm?: number;
  notes?: string;
}

export interface BabyMilestoneItem {
  id: string;
  titleBn: string;
  titleEn: string;
  targetMonth: number;
  category: 'motor' | 'cognitive' | 'speech' | 'social';
  isAchieved: boolean;
  achievedDate?: string;
  photoUrl?: string;
  note?: string;
}

export interface MemoryMoment {
  id: string;
  babyId: string;
  milestoneTitle: string;
  date: string;
  caption: string;
  photoUrl?: string;
  createdAt: string;
}
