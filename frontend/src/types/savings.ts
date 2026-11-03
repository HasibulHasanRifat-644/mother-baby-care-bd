export type PaymentMethod = 'bkash' | 'nagad' | 'rocket' | 'bank' | 'cash_piggybank';

export type GoalCategory = 'emergency' | 'medical' | 'education' | 'birthday' | 'general' | 'gold';

export interface SavingsGoal {
  id: string;
  babyId: string;
  title: string;
  titleBn: string;
  category: GoalCategory;
  targetAmount: number; // in BDT
  targetDate?: string;
  isCompleted?: boolean;
  createdAt: string;
}

export interface SavingsTransaction {
  id: string;
  babyId: string;
  goalId?: string;
  type: 'deposit' | 'withdrawal';
  amount: number; // in BDT
  date: string; // YYYY-MM-DD
  paymentMethod: PaymentMethod;
  note?: string; // e.g. "ঈদের সালামি", "নানার উপহার", "টিকার টেস্ট ও ডাক্তারের ফি"
  contributorName?: string; // e.g. "আম্মু", "আব্বু", "নানু", "দাদু", "খালামনি"
  createdAt: string;
}

export interface BabySavingsAccount {
  babyId: string;
  accountNumber: string; // e.g. BD-BABY-84920
  monthlyTarget: number;
  transactions: SavingsTransaction[];
  goals: SavingsGoal[];
}
