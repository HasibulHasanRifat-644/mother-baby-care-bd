import { BabySavingsAccount, SavingsGoal, SavingsTransaction } from '../types/savings';
import { formatDateIso } from '../utils/dateCalculations';

export const INITIAL_SAVINGS_GOALS: SavingsGoal[] = [
  {
    id: 'goal-health',
    babyId: 'baby-initial-1',
    title: 'Emergency Health & Medical Fund',
    titleBn: 'জরুরি শিশু স্বাস্থ্য ও চিকিৎসা তহবিল',
    category: 'medical',
    targetAmount: 20000,
    targetDate: '2027-12-31',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'goal-education',
    babyId: 'baby-initial-1',
    title: 'School Admission & Future Education',
    titleBn: 'স্কুল ভর্তি ও ভবিষ্যৎ শিক্ষা সঞ্চয়',
    category: 'education',
    targetAmount: 50000,
    targetDate: '2030-01-01',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'goal-birthday',
    babyId: 'baby-initial-1',
    title: '1st Birthday Celebration & Memories',
    titleBn: 'প্রথম জন্মদিন ও স্মৃতির তহবিল',
    category: 'birthday',
    targetAmount: 15000,
    targetDate: '2027-08-15',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'goal-gold',
    babyId: 'baby-initial-1',
    title: 'Baby Gold & Long-Term DPS',
    titleBn: 'শিশুর স্বর্ণ ও দীর্ঘমেয়াদী ডিপিএস',
    category: 'gold',
    targetAmount: 100000,
    targetDate: '2036-12-31',
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_TRANSACTIONS: SavingsTransaction[] = [
  {
    id: 'tx-1',
    babyId: 'baby-initial-1',
    goalId: 'goal-birthday',
    type: 'deposit',
    amount: 5000,
    date: formatDateIso(new Date(Date.now() - 40 * 24 * 60 * 60 * 1000)),
    paymentMethod: 'cash_piggybank',
    note: 'জন্মের পর নানার দেওয়া ভালোবাসার সালামি ও উপহার',
    contributorName: 'নানু',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-2',
    babyId: 'baby-initial-1',
    goalId: 'goal-health',
    type: 'deposit',
    amount: 3000,
    date: formatDateIso(new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)),
    paymentMethod: 'bkash',
    note: 'আম্মুর প্রথম মাসের গৃহকোণ সঞ্চয়',
    contributorName: 'আম্মু',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-3',
    babyId: 'baby-initial-1',
    goalId: 'goal-education',
    type: 'deposit',
    amount: 5000,
    date: formatDateIso(new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)),
    paymentMethod: 'bank',
    note: 'আব্বুর বেতন থেকে ভবিষ্যৎ ডিপিএস সঞ্চয়',
    contributorName: 'আব্বু',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-4',
    babyId: 'baby-initial-1',
    goalId: 'goal-health',
    type: 'withdrawal',
    amount: 1500,
    date: formatDateIso(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)),
    paymentMethod: 'bkash',
    note: 'জরুরি শিশু বিশেষজ্ঞ ডাক্তারের ফি ও প্যারাসিটামল',
    contributorName: 'আম্মু',
    createdAt: new Date().toISOString(),
  },
];

export function getDefaultSavingsAccount(babyId: string): BabySavingsAccount {
  return {
    babyId,
    accountNumber: `BD-KID-${Math.floor(100000 + Math.random() * 900000)}`,
    monthlyTarget: 2000,
    goals: INITIAL_SAVINGS_GOALS.map(g => ({ ...g, babyId })),
    transactions: INITIAL_TRANSACTIONS.map(t => ({ ...t, babyId })),
  };
}
