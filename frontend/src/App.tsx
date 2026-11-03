import React, { useState, useEffect, useMemo } from 'react';
import { BabyProfile, Language, VaccineStatus, VaccineInfo, AdministeredRecord } from './types/vaccine';
import { BabySavingsAccount, SavingsGoal, SavingsTransaction } from './types/savings';
import { CommunityPost, BloodRequest, GrowthRecord, BabyMilestoneItem, PostCategory } from './types/community';
import { BANGLADESH_VACCINES, BANGLADESH_EPI_MILESTONES } from './data/bangladeshEpiData';
import { getDefaultSavingsAccount } from './data/savingsData';
import { 
  INITIAL_COMMUNITY_POSTS, 
  INITIAL_BLOOD_REQUESTS, 
  DEFAULT_MILESTONES, 
  INITIAL_GROWTH_RECORDS 
} from './data/communityData';
import { calculateDueDate, getVaccineStatus, formatDateIso } from './utils/dateCalculations';
import { Header, MainAppTab } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { MetricSummary } from './components/MetricSummary';
import { VaccineList } from './components/VaccineList';
import { VaccineDetailModal } from './components/VaccineDetailModal';
import { BabyProfileModal } from './components/BabyProfileModal';
import { EpiCardView } from './components/EpiCardView';


// Savings Bank Components
import { SavingsDashboard } from './components/SavingsBank/SavingsDashboard';
import { DepositModal } from './components/SavingsBank/DepositModal';
import { WithdrawModal } from './components/SavingsBank/WithdrawModal';
import { GoalModal } from './components/SavingsBank/GoalModal';
import { FutureCalculatorModal } from './components/SavingsBank/FutureCalculatorModal';

// Community & Growth Components
import { CommunityFeed } from './components/Community/CommunityFeed';
import { CreatePostModal } from './components/Community/CreatePostModal';
import { BloodRequestBoard } from './components/Community/BloodRequestBoard';
import { GrowthTracker } from './components/Growth/GrowthTracker';
import { NutritionGuide } from './components/Nutrition/NutritionGuide';
import { MemoryScrapbook } from './components/Scrapbook/MemoryScrapbook';

// Video Hub Components
import { VideoGuideHub } from './components/VideoGuides/VideoGuideHub';
import { VideoPlayerModal } from './components/VideoGuides/VideoPlayerModal';
import { PediatricVideo } from './types/video';
import { ServicesHub } from './components/Services/ServicesHub';

// Parent Auth & Modals
import { ParentUser, DEMO_PARENTS } from './types/auth';
import { AuthModal, getRegisteredAccounts } from './components/Auth/AuthModal';
import { AdminPinModal } from './components/AdminPinModal';
import { HealthAssistantModal } from './components/HealthAssistantModal';
import { AllRegistrationsModal } from './components/Admin/AllRegistrationsModal';

import { Syringe, PiggyBank, Users, TrendingUp, Utensils, Droplet, Camera, Sparkles, Video as VideoIcon, HeartPulse } from 'lucide-react';

const STORAGE_KEY_BABIES = 'bd_vaccine_tracker_babies_v1';
const STORAGE_KEY_CURRENT_ID = 'bd_vaccine_tracker_current_id_v1';
const STORAGE_KEY_LANG = 'bd_vaccine_tracker_lang_v1';
const STORAGE_KEY_SAVINGS = 'bd_vaccine_savings_accounts_v1';
const STORAGE_KEY_POSTS = 'bd_community_posts_v1';
const STORAGE_KEY_BLOOD = 'bd_blood_requests_v1';
const STORAGE_KEY_GROWTH = 'bd_growth_records_v1';
const STORAGE_KEY_MILESTONES = 'bd_milestones_v1';
const STORAGE_KEY_PARENT_USER = 'bd_current_parent_user_v1';
const STORAGE_KEY_ADMIN_AUTH = 'bd_admin_authenticated_v1';

// Calculate realistic default birth date: ~2 months prior to current date
function getDefaultInitialBaby(): BabyProfile {
  const defaultDob = new Date();
  defaultDob.setDate(defaultDob.getDate() - 55);

  return {
    id: 'baby-initial-1',
    name: 'আরিয়ান ইসলাম',
    dateOfBirth: formatDateIso(defaultDob),
    gender: 'boy',
    bloodGroup: 'B+',
    birthWeightKg: '3.2',
    epiCardNumber: 'EPI-2026-DH-4819',
    hospitalOfBirth: 'ঢাকা মেডিকেল কলেজ হাসপাতাল',
    records: {
      bcg: {
        vaccineId: 'bcg',
        isGiven: true,
        dateGiven: formatDateIso(defaultDob),
        centerName: 'ঢাকা মেডিকেল কলেজ হাসপাতাল',
        reactionNotes: 'স্বাভাবিক দাগ তৈরি হয়েছে',
      },
      penta1: {
        vaccineId: 'penta1',
        isGiven: true,
        dateGiven: formatDateIso(new Date(defaultDob.getTime() + 42 * 24 * 60 * 60 * 1000)),
        centerName: 'উপজেলা স্বাস্থ্য কমপ্লেক্স',
      },
      pcv1: {
        vaccineId: 'pcv1',
        isGiven: true,
        dateGiven: formatDateIso(new Date(defaultDob.getTime() + 42 * 24 * 60 * 60 * 1000)),
        centerName: 'উপজেলা স্বাস্থ্য কমপ্লেক্স',
      },
      bopv1: {
        vaccineId: 'bopv1',
        isGiven: true,
        dateGiven: formatDateIso(new Date(defaultDob.getTime() + 42 * 24 * 60 * 60 * 1000)),
        centerName: 'উপজেলা স্বাস্থ্য কমপ্লেক্স',
      },
      fipv1: {
        vaccineId: 'fipv1',
        isGiven: true,
        dateGiven: formatDateIso(new Date(defaultDob.getTime() + 42 * 24 * 60 * 60 * 1000)),
        centerName: 'উপজেলা স্বাস্থ্য কমপ্লেক্স',
      },
    },
    hasBirthCertificate: 'yes',
    birthRegistrationNumber: '20242692015004891',
    motherName: 'সাদিয়া সুলতানা',
    fatherName: 'রফিকুল ইসলাম',
    motherIdType: 'nid',
    motherIdNumber: '19922692015000123',
    fatherIdType: 'nid',
    fatherIdNumber: '19892692015000789',
    healthAssistantName: 'মোছাঃ নাজমুন নাহার',
    healthAssistantPhone: '০১৭১২-৩৪৫৬৭৮',
    healthAssistantDesignation: 'স্বাস্থ্য সহকারী (ইপিআই টিকাদানকারী)',
    parentIdType: 'nid',
    parentIdNumber: '19922692015000123',
    division: 'ঢাকা',
    district: 'ঢাকা',
    upazila: 'ধানমন্ডি',
    unionPourashava: 'ঢাকা দক্ষিণ সিটি কর্পোরেশন',
    village: 'ধানমন্ডি ২৭, বাড়ি # ১২/এ',
    ward: '১৫',
    epiCenterName: 'ধানমন্ডি মা ও শিশু কল্যাণ কেন্দ্র (EPI সেন্টার)',
    createdAt: new Date().toISOString(),
  };
}

export default function App() {
  // Main view tab
  const [activeMainTab, setActiveMainTab] = useState<MainAppTab>('vaccines');

  // Language state
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LANG);
    return (saved === 'en' || saved === 'bn') ? saved : 'bn';
  });

  // Babies state
  const [babies, setBabies] = useState<BabyProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BABIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return [getDefaultInitialBaby()];
  });

  // Current active baby ID
  const [currentBabyId, setCurrentBabyId] = useState<string>(() => {
    const savedId = localStorage.getItem(STORAGE_KEY_CURRENT_ID);
    if (savedId) return savedId;
    return babies[0]?.id || 'baby-initial-1';
  });

  // Savings Accounts state (per baby)
  const [savingsAccounts, setSavingsAccounts] = useState<Record<string, BabySavingsAccount>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SAVINGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return { 'baby-initial-1': getDefaultSavingsAccount('baby-initial-1') };
  });

  // Community Posts state
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_POSTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_COMMUNITY_POSTS;
  });

  // Blood Requests state
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BLOOD);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_BLOOD_REQUESTS;
  });

  // Growth Records state
  const [growthRecords, setGrowthRecords] = useState<GrowthRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_GROWTH);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_GROWTH_RECORDS;
  });

  // Milestones state
  const [milestones, setMilestones] = useState<BabyMilestoneItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MILESTONES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_MILESTONES;
  });

  // Vaccine filter state
  const [activeFilter, setActiveFilter] = useState<VaccineStatus | 'all'>('all');

  // Modals state
  const [isBabyModalOpen, setIsBabyModalOpen] = useState(false);
  const [isNewBabyModal, setIsNewBabyModal] = useState(false);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState<VaccineInfo | null>(null);
  const [isEpiCardModalOpen, setIsEpiCardModalOpen] = useState(false);

  // Savings Modals state
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isCalculatorModalOpen, setIsCalculatorModalOpen] = useState(false);
  // Video Modal state
  const [selectedVideoForModal, setSelectedVideoForModal] = useState<PediatricVideo | null>(null);

  // Community Modal
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);

  // User Auth State (Preserves active session across page reloads until explicitly logged out)
  const [currentUser, setCurrentUser] = useState<ParentUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PARENT_USER);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  // Admin & Health Worker Mode state (Session & Role based)
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY_PARENT_USER);
      if (savedUser) {
        const u = JSON.parse(savedUser);
        if (u.userRole === 'super_admin' || u.userRole === 'health_assistant') return true;
      }
      return sessionStorage.getItem(STORAGE_KEY_ADMIN_AUTH) === 'true';
    } catch (e) {
      return false;
    }
  });

  // Auth Modal State: Strictly open on first install/launch until completed!
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY_PARENT_USER);
      const savedAdmin = sessionStorage.getItem(STORAGE_KEY_ADMIN_AUTH);
      if (savedUser || savedAdmin === 'true') return false;
    } catch (e) {
      console.error(e);
    }
    return true;
  });
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isAdminPinModalOpen, setIsAdminPinModalOpen] = useState(false);

  // Health Assistant Contact Modal & Super Admin All Registrations Modal
  const [isHealthAssistantModalOpen, setIsHealthAssistantModalOpen] = useState(false);
  const [isAllRegistrationsModalOpen, setIsAllRegistrationsModalOpen] = useState(false);

  // Sync registered babies from accounts registry so Super Admin and users see all registered babies
  useEffect(() => {
    try {
      const registered = getRegisteredAccounts();
      const parentAccountsWithBabies = registered.filter(u => u.userRole === 'parent' && u.babyName);
      
      setBabies(prevBabies => {
        const updated = [...prevBabies];
        let changed = false;

        parentAccountsWithBabies.forEach(p => {
          const existing = updated.find(b => 
            (b.birthRegistrationNumber && p.birthCertificateNumber && b.birthRegistrationNumber === p.birthCertificateNumber) ||
            (b.name === p.babyName && (b.motherName === p.fullName || b.fatherName === p.fullName))
          );

          if (!existing && p.babyName) {
            const newB: BabyProfile = {
              id: `baby-parent-${p.id}`,
              name: p.babyName,
              dateOfBirth: p.babyDob || formatDateIso(new Date()),
              gender: (p.babyGender as 'boy' | 'girl' | 'other') || 'boy',
              childOrder: p.childOrder || 1,
              bloodGroup: 'B+',
              birthWeightKg: '3.1',
              epiCardNumber: `EPI-2026-${(p.district || 'DH').slice(0, 2).toUpperCase()}-${p.id.slice(-4)}`,
              hospitalOfBirth: `${p.district || 'সদর'} হাসপাতাল`,
              hasBirthCertificate: p.hasBirthCertificate || 'yes',
              birthRegistrationNumber: p.birthCertificateNumber || `2024${Math.floor(1000000000000 + Math.random() * 9000000000000)}`,
              motherName: p.role === 'mother' ? p.fullName : 'মোছাঃ সুমি আক্তার',
              fatherName: p.role === 'father' ? p.fullName : 'মোঃ রফিকুল ইসলাম',
              epiCenterName: p.centerName || 'উপজেলা স্বাস্থ্য কমপ্লেক্স (EPI টিকাদান কেন্দ্র)',
              district: p.district || 'ঢাকা',
              upazila: p.upazila || 'সদর',
              records: {},
              healthAssistantName: 'মোছাঃ নাজমুন নাহার',
              healthAssistantPhone: '০১৭১২-৩৪৫৬৭৮',
              healthAssistantDesignation: 'স্বাস্থ্য সহকারী (ইপিআই টিকাদানকারী)',
              createdAt: p.createdAt || new Date().toISOString(),
            };
            updated.push(newB);
            changed = true;
          }
        });

        return changed ? updated : prevBabies;
      });
    } catch (e) {
      console.error('Error syncing babies from accounts registry:', e);
    }
  }, [currentUser]);

  // Enforce authentication gatekeeper: if not authenticated, modal must remain open
  useEffect(() => {
    if (!currentUser && !isAdminMode) {
      setIsAuthModalOpen(true);
    }
  }, [currentUser, isAdminMode]);

  const handleToggleAdminMode = (admin: boolean) => {
    setIsAdminMode(admin);
    try {
      if (admin) {
        sessionStorage.setItem(STORAGE_KEY_ADMIN_AUTH, 'true');
      } else {
        sessionStorage.removeItem(STORAGE_KEY_ADMIN_AUTH);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Sync state to LocalStorage
  useEffect(() => { localStorage.setItem(STORAGE_KEY_LANG, language); }, [language]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_BABIES, JSON.stringify(babies)); }, [babies]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_CURRENT_ID, currentBabyId); }, [currentBabyId]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_SAVINGS, JSON.stringify(savingsAccounts)); }, [savingsAccounts]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(communityPosts)); }, [communityPosts]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_BLOOD, JSON.stringify(bloodRequests)); }, [bloodRequests]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_GROWTH, JSON.stringify(growthRecords)); }, [growthRecords]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_MILESTONES, JSON.stringify(milestones)); }, [milestones]);
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY_PARENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY_PARENT_USER);
    }
  }, [currentUser]);

  // Current Baby reference
  const currentBaby = useMemo(() => {
    const found = babies.find(b => b.id === currentBabyId);
    return found || babies[0] || getDefaultInitialBaby();
  }, [babies, currentBabyId]);

  // Current Savings Account reference
  const currentSavingsAccount = useMemo(() => {
    if (savingsAccounts[currentBaby.id]) return savingsAccounts[currentBaby.id];
    return getDefaultSavingsAccount(currentBaby.id);
  }, [savingsAccounts, currentBaby.id]);

  // Current savings balance
  const currentBalance = useMemo(() => {
    let dep = 0;
    let wit = 0;
    currentSavingsAccount.transactions.forEach(t => {
      if (t.type === 'deposit') dep += t.amount;
      else if (t.type === 'withdrawal') wit += t.amount;
    });
    return Math.max(0, dep - wit);
  }, [currentSavingsAccount.transactions]);

  // Compute stats for current baby
  const stats = useMemo(() => {
    let done = 0;
    let dueSoon = 0;
    let overdue = 0;
    let upcoming = 0;
    const total = Object.keys(BANGLADESH_VACCINES).length;

    Object.values(BANGLADESH_VACCINES).forEach(vac => {
      const dueDate = calculateDueDate(currentBaby.dateOfBirth, vac.dayOffset);
      const isGiven = !!currentBaby.records[vac.id]?.isGiven;
      const status = getVaccineStatus(dueDate, isGiven);

      if (status === 'done') done++;
      else if (status === 'overdue') overdue++;
      else if (status === 'due-soon') dueSoon++;
      else upcoming++;
    });

    return { done, dueSoon, overdue, upcoming, total };
  }, [currentBaby]);

  // Handlers
  const handleToggleLanguage = () => {
    setLanguage(prev => (prev === 'bn' ? 'en' : 'bn'));
  };

  const handleDobChange = (newDob: string) => {
    if (!newDob) return;
    setBabies(prev =>
      prev.map(b => (b.id === currentBaby.id ? { ...b, dateOfBirth: newDob } : b))
    );
  };

  const handleSaveBabyProfile = (updatedProfile: BabyProfile) => {
    setBabies(prev => {
      const exists = prev.some(b => b.id === updatedProfile.id);
      if (exists) return prev.map(b => (b.id === updatedProfile.id ? updatedProfile : b));
      return [...prev, updatedProfile];
    });

    if (!savingsAccounts[updatedProfile.id]) {
      setSavingsAccounts(prev => ({
        ...prev,
        [updatedProfile.id]: getDefaultSavingsAccount(updatedProfile.id),
      }));
    }

    setCurrentBabyId(updatedProfile.id);
  };

  const handleDeleteBabyProfile = (babyId: string) => {
    setBabies(prev => {
      const filtered = prev.filter(b => b.id !== babyId);
      if (filtered.length === 0) {
        const resetBaby = getDefaultInitialBaby();
        setCurrentBabyId(resetBaby.id);
        return [resetBaby];
      }
      setCurrentBabyId(filtered[0].id);
      return filtered;
    });
  };

  const handleOpenAddBabyModal = () => {
    setIsNewBabyModal(true);
    setIsBabyModalOpen(true);
  };

  const handleOpenEditBabyModal = () => {
    setIsNewBabyModal(false);
    setIsBabyModalOpen(true);
  };

  const handleQuickToggleVaccine = (vaccineId: string) => {
    const isCurrentlyGiven = !!currentBaby.records[vaccineId]?.isGiven;

    setBabies(prev =>
      prev.map(b => {
        if (b.id !== currentBaby.id) return b;
        const newRecords = { ...b.records };
        if (isCurrentlyGiven) {
          delete newRecords[vaccineId];
        } else {
          newRecords[vaccineId] = {
            vaccineId,
            isGiven: true,
            dateGiven: formatDateIso(new Date()),
            centerName: 'ইপিআই টিকাকেন্দ্র',
          };
        }
        return { ...b, records: newRecords };
      })
    );
  };

  const handleMarkMilestoneAllDone = (milestoneId: string) => {
    const milestone = BANGLADESH_EPI_MILESTONES.find(m => m.id === milestoneId);
    if (!milestone) return;

    setBabies(prev =>
      prev.map(b => {
        if (b.id !== currentBaby.id) return b;
        const newRecords = { ...b.records };
        const todayStr = formatDateIso(new Date());

        milestone.vaccineIds.forEach(vId => {
          if (!newRecords[vId]?.isGiven) {
            newRecords[vId] = {
              vaccineId: vId,
              isGiven: true,
              dateGiven: todayStr,
              centerName: 'ইপিআই টিকাকেন্দ্র',
            };
          }
        });
        return { ...b, records: newRecords };
      })
    );
  };

  const handleOpenRecordModal = (vaccine: VaccineInfo) => {
    setSelectedVaccine(vaccine);
    setIsRecordModalOpen(true);
  };

  const handleSaveVaccineRecord = (record: AdministeredRecord) => {
    setBabies(prev =>
      prev.map(b => {
        if (b.id !== currentBaby.id) return b;
        return {
          ...b,
          records: { ...b.records, [record.vaccineId]: record },
        };
      })
    );
  };

  const handleDeleteVaccineRecord = (vaccineId: string) => {
    setBabies(prev =>
      prev.map(b => {
        if (b.id !== currentBaby.id) return b;
        const newRecords = { ...b.records };
        delete newRecords[vaccineId];
        return { ...b, records: newRecords };
      })
    );
  };

  // Savings Handlers
  const handleDeposit = (data: Omit<SavingsTransaction, 'id' | 'createdAt'>) => {
    const newTx: SavingsTransaction = {
      ...data,
      id: `tx-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setSavingsAccounts(prev => {
      const acc = prev[currentBaby.id] || getDefaultSavingsAccount(currentBaby.id);
      return {
        ...prev,
        [currentBaby.id]: {
          ...acc,
          transactions: [newTx, ...acc.transactions],
        },
      };
    });
  };

  const handleWithdraw = (data: Omit<SavingsTransaction, 'id' | 'createdAt'>) => {
    const newTx: SavingsTransaction = {
      ...data,
      id: `tx-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setSavingsAccounts(prev => {
      const acc = prev[currentBaby.id] || getDefaultSavingsAccount(currentBaby.id);
      return {
        ...prev,
        [currentBaby.id]: {
          ...acc,
          transactions: [newTx, ...acc.transactions],
        },
      };
    });
  };

  const handleSaveGoal = (goalData: Omit<SavingsGoal, 'id' | 'createdAt'>) => {
    const newGoal: SavingsGoal = {
      ...goalData,
      id: `goal-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setSavingsAccounts(prev => {
      const acc = prev[currentBaby.id] || getDefaultSavingsAccount(currentBaby.id);
      return {
        ...prev,
        [currentBaby.id]: {
          ...acc,
          goals: [...acc.goals, newGoal],
        },
      };
    });
  };

  const handleDeleteTransaction = (txId: string) => {
    setSavingsAccounts(prev => {
      const acc = prev[currentBaby.id] || getDefaultSavingsAccount(currentBaby.id);
      return {
        ...prev,
        [currentBaby.id]: {
          ...acc,
          transactions: acc.transactions.filter(t => t.id !== txId),
        },
      };
    });
  };

  // Community Handlers
  const handleCreatePost = (data: { authorName: string; authorCity: string; category: PostCategory; content: string; imageUrl?: string }) => {
    const roleLabel = currentUser ? (currentUser.role === 'father' ? 'বাবা' : currentUser.role === 'guardian' ? 'অভিভাবক' : 'মা') : 'মা';
    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      authorName: data.authorName,
      authorRole: `${currentBaby.name}-এর ${roleLabel}`,
      authorCity: data.authorCity,
      category: data.category,
      content: data.content,
      imageUrl: data.imageUrl,
      likesCount: 1,
      lovesCount: 2,
      prayersCount: 5,
      comments: [],
      createdAt: new Date().toISOString(),
    };
    setCommunityPosts(prev => [newPost, ...prev]);
  };

  const handleReactPost = (postId: string, reactionType: 'like' | 'love' | 'prayer') => {
    setCommunityPosts(prev =>
      prev.map(p => {
        if (p.id !== postId) return p;
        if (reactionType === 'love') return { ...p, lovesCount: p.lovesCount + 1 };
        if (reactionType === 'prayer') return { ...p, prayersCount: p.prayersCount + 1 };
        return { ...p, likesCount: p.likesCount + 1 };
      })
    );
  };

  const handleAddComment = (postId: string, text: string) => {
    const roleLabel = currentUser ? (currentUser.role === 'father' ? 'বাবা' : currentUser.role === 'guardian' ? 'অভিভাবক' : 'মা') : 'অভিভাবক';
    const newComment = {
      id: `c-${Date.now()}`,
      authorName: currentUser ? `${currentUser.fullName} (${roleLabel})` : `${currentBaby.name}-এর অভিভাবক`,
      authorCity: currentUser?.district || 'বাংলাদেশ',
      text,
      createdAt: new Date().toISOString(),
    };
    setCommunityPosts(prev =>
      prev.map(p => {
        if (p.id !== postId) return p;
        return { ...p, comments: [...p.comments, newComment] };
      })
    );
  };

  // Blood Request Handler
  const handleAddBloodRequest = (req: Omit<BloodRequest, 'id' | 'createdAt'>) => {
    const newReq: BloodRequest = {
      ...req,
      id: `blood-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setBloodRequests(prev => [newReq, ...prev]);
  };

  // Growth & Milestones Handlers
  const handleAddGrowthRecord = (rec: Omit<GrowthRecord, 'id'>) => {
    const newRec: GrowthRecord = {
      ...rec,
      id: `gr-${Date.now()}`,
    };
    setGrowthRecords(prev => [...prev, newRec]);
  };

  const handleToggleMilestone = (mId: string) => {
    setMilestones(prev =>
      prev.map(m => {
        if (m.id !== mId) return m;
        const nextState = !m.isAchieved;
        return {
          ...m,
          isAchieved: nextState,
          achievedDate: nextState ? formatDateIso(new Date()) : undefined,
        };
      })
    );
  };

  const handleScrollTo = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = (user: ParentUser) => {
    setCurrentUser(user);
    if (user.userRole === 'super_admin' || user.userRole === 'health_assistant') {
      handleToggleAdminMode(true);
    } else {
      handleToggleAdminMode(false);
    }
    setIsAuthModalOpen(false);
    if (user.preferredLanguage) {
      setLanguage(user.preferredLanguage);
    }
    if ((user.babyName || user.babyDob || user.babyGender || user.hasBirthCertificate || user.birthCertificateNumber) && babies.length >= 1) {
      setBabies(prev =>
        prev.map((b, idx) => {
          if (b.id === currentBabyId || (prev.length === 1 && idx === 0)) {
            return {
              ...b,
              name: user.babyName?.trim() || b.name,
              dateOfBirth: user.babyDob || b.dateOfBirth,
              gender: user.babyGender || b.gender,
              childOrder: user.childOrder || b.childOrder || 1,
              hasBirthCertificate: user.hasBirthCertificate || b.hasBirthCertificate,
              birthRegistrationNumber: user.birthCertificateNumber || b.birthRegistrationNumber,
            };
          }
          return b;
        })
      );
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem(STORAGE_KEY_PARENT_USER);
      sessionStorage.removeItem(STORAGE_KEY_ADMIN_AUTH);
    } catch (e) {
      console.error(e);
    }
    setCurrentUser(null);
    setIsAdminMode(false);
    setIsAuthModalOpen(true);
    setAuthModalMode('login');
  };

  const handleSaveBabyFromAdmin = (updatedBaby: BabyProfile) => {
    setBabies(prev => prev.map(b => b.id === updatedBaby.id ? updatedBaby : b));
  };

  const newBabyTemplate: BabyProfile = {
    id: `baby-${Date.now()}`,
    name: '',
    dateOfBirth: formatDateIso(new Date()),
    gender: 'boy',
    records: {},
    createdAt: new Date().toISOString(),
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      
      {/* 1. Header (Top Bar Contract) */}
      <Header
        language={language}
        activeMainTab={activeMainTab}
        onSelectMainTab={setActiveMainTab}
        onToggleLanguage={handleToggleLanguage}
        onPrintCard={() => setIsEpiCardModalOpen(true)}
        onScrollTo={handleScrollTo}
        currentUser={currentUser}
        onOpenAuthModal={handleOpenAuth}
        onLogout={handleLogout}
        healthAssistantName={currentBaby.healthAssistantName}
        healthAssistantPhone={currentBaby.healthAssistantPhone}
        onOpenHealthAssistantModal={() => setIsHealthAssistantModalOpen(true)}
        onOpenAllRegistrationsModal={() => setIsAllRegistrationsModalOpen(true)}
      />

      {/* Welcome & Login Notification Prompt (Prominent for new or unauthenticated parents) */}
      {!currentUser && (
        <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-800 text-white px-4 py-2.5 text-xs shadow-inner">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <span className="text-base">👩‍👧‍👦</span>
              <p className="font-medium text-teal-50">
                <strong className="text-white font-bold">{language === 'bn' ? 'মা ও বাবাদের জন্য একাউন্ট:' : 'Parent Account:'}</strong>{' '}
                {language === 'bn' 
                  ? 'আপনার শিশুর ভ্যাকসিন ট্র্যাক করতে, সঞ্চয় ব্যাংক চালাতে এবং মায়েদের আড্ডায় যুক্ত হতে লগইন করুন।'
                  : 'Sign in to track vaccinations, manage savings, and share memories.'}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleOpenAuth('login')}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-teal-900 bg-amber-400 hover:bg-amber-300 transition-all shadow-sm active:scale-95"
              >
                {language === 'bn' ? '🔑 লগইন করুন' : 'Sign In'}
              </button>
            </div>
          </div>
        </div>
      )}

      <main className={`flex-1 transition-all ${!currentUser && !isAdminMode ? 'pointer-events-none select-none filter blur-[2px]' : ''}`}>
        {/* 2. Hero Banner with Baby Selector & Quick DOB edit */}
        <HeroBanner
          currentBaby={currentBaby}
          allBabies={babies}
          language={language}
          isAdminMode={isAdminMode}
          currentUser={currentUser}
          onSelectBaby={setCurrentBabyId}
          onEditBaby={handleOpenEditBabyModal}
          onAddNewBaby={handleOpenAddBabyModal}
          onDobChange={handleDobChange}
          onOpenCardModal={() => setIsEpiCardModalOpen(true)}
          onOpenAdminPinModal={() => setIsAdminPinModalOpen(true)}
          onOpenHealthAssistantModal={() => setIsHealthAssistantModalOpen(true)}
          onOpenAllRegistrationsModal={() => setIsAllRegistrationsModalOpen(true)}
        />

        {/* 3. Horizontal Module Switcher Bar (Mobile & Desktop Touch Ergonomic) */}
        <div className="bg-slate-100/90 border-b border-slate-200 py-2.5 px-4 sticky top-16 z-20 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex items-center justify-start gap-1.5 overflow-x-auto scrollbar-none">
            
            <button
              type="button"
              onClick={() => setActiveMainTab('vaccines')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                activeMainTab === 'vaccines'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Syringe className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? '💉 টিকা ট্র্যাকার' : 'Vaccine Tracker'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMainTab('services')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                activeMainTab === 'services' || activeMainTab === 'growth' || activeMainTab === 'nutrition' || activeMainTab === 'blood'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <HeartPulse className="w-3.5 h-3.5 text-amber-300" />
              <span>{language === 'bn' ? '🏥 সেবা' : 'Services'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMainTab('videoguides')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                activeMainTab === 'videoguides'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <VideoIcon className="w-3.5 h-3.5 text-teal-600" />
              <span>{language === 'bn' ? '🎥 ভিডিও গাইড' : 'Video Demos'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMainTab('savings')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                activeMainTab === 'savings'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <PiggyBank className="w-3.5 h-3.5 text-amber-300" />
              <span>{language === 'bn' ? '🪙 সঞ্চয় ব্যাংক' : 'Baby Bank'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMainTab('community')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                activeMainTab === 'community'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-emerald-300" />
              <span>{language === 'bn' ? '📸 মায়েদের আড্ডা' : 'Mothers Community'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMainTab('scrapbook')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                activeMainTab === 'scrapbook'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-amber-300" />
              <span>{language === 'bn' ? '📖 স্মৃতি অ্যালবাম' : 'Memory Scrapbook'}</span>
            </button>
          </div>
        </div>

        {/* 4. Tab Views Content */}
        {activeMainTab === 'vaccines' && (
          <>
            <MetricSummary
              stats={stats}
              language={language}
              onFilterClick={setActiveFilter}
              activeFilter={activeFilter}
            />

            <VaccineList
              currentBaby={currentBaby}
              language={language}
              activeFilter={activeFilter}
              isAdminMode={isAdminMode}
              onToggleAdminMode={handleToggleAdminMode}
              onOpenAdminPinModal={() => setIsAdminPinModalOpen(true)}
              onFilterChange={setActiveFilter}
              onOpenRecordModal={handleOpenRecordModal}
              onQuickToggleVaccine={handleQuickToggleVaccine}
              onMarkMilestoneAllDone={handleMarkMilestoneAllDone}
            />
          </>
        )}

        {(activeMainTab === 'services' || activeMainTab === 'growth' || activeMainTab === 'nutrition' || activeMainTab === 'blood') && (
          <ServicesHub
            currentBaby={currentBaby}
            language={language}
            growthRecords={growthRecords}
            milestones={milestones}
            onAddGrowthRecord={handleAddGrowthRecord}
            onToggleMilestone={handleToggleMilestone}
            bloodRequests={bloodRequests}
            onAddBloodRequest={handleAddBloodRequest}
            onOpenVideoHub={() => setActiveMainTab('videoguides')}
            initialSubTab={
              activeMainTab === 'growth' ? 'growth' :
              activeMainTab === 'nutrition' ? 'nutrition' :
              activeMainTab === 'blood' ? 'blood' : 'growth'
            }
          />
        )}

        {activeMainTab === 'videoguides' && (
          <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <VideoGuideHub
              language={language}
              isAdminMode={isAdminMode}
              onOpenAdminPinModal={() => setIsAdminPinModalOpen(true)}
              onOpenVideo={(video) => setSelectedVideoForModal(video)}
              healthAssistantName={currentBaby.healthAssistantName}
              healthAssistantPhone={currentBaby.healthAssistantPhone}
            />
          </div>
        )}

        {activeMainTab === 'savings' && (
          <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SavingsDashboard
              currentBaby={currentBaby}
              account={currentSavingsAccount}
              language={language}
              onOpenDepositModal={() => setIsDepositModalOpen(true)}
              onOpenWithdrawModal={() => setIsWithdrawModalOpen(true)}
              onOpenGoalModal={() => setIsGoalModalOpen(true)}
              onOpenCalculatorModal={() => setIsCalculatorModalOpen(true)}
              onDeleteTransaction={handleDeleteTransaction}
            />
          </div>
        )}

        {activeMainTab === 'community' && (
          <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <CommunityFeed
              posts={communityPosts}
              language={language}
              onOpenCreatePostModal={() => setIsCreatePostModalOpen(true)}
              onReactPost={handleReactPost}
              onAddComment={handleAddComment}
            />
          </div>
        )}

        {activeMainTab === 'scrapbook' && (
          <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <MemoryScrapbook
              currentBaby={currentBaby}
              language={language}
            />
          </div>
        )}
      </main>

      {/* MODALS */}

      {/* Baby Profile Add/Edit Modal */}
      {isBabyModalOpen && (
        <BabyProfileModal
          isOpen={isBabyModalOpen}
          isNew={isNewBabyModal}
          babyProfile={isNewBabyModal ? newBabyTemplate : currentBaby}
          language={language}
          isAdminMode={isAdminMode}
          onClose={() => setIsBabyModalOpen(false)}
          onSave={handleSaveBabyProfile}
          onDelete={handleDeleteBabyProfile}
          onUnlockAdmin={() => setIsAdminPinModalOpen(true)}
        />
      )}

      {/* Detailed Vaccine Administration Modal */}
      {isRecordModalOpen && selectedVaccine && (
        <VaccineDetailModal
          vaccine={selectedVaccine}
          currentRecord={currentBaby.records[selectedVaccine.id]}
          calculatedDueDate={calculateDueDate(currentBaby.dateOfBirth, selectedVaccine.dayOffset)}
          language={language}
          isAdminMode={isAdminMode}
          onUnlockAdmin={() => setIsAdminPinModalOpen(true)}
          onClose={() => {
            setIsRecordModalOpen(false);
            setSelectedVaccine(null);
          }}
          onSaveRecord={handleSaveVaccineRecord}
          onDeleteRecord={handleDeleteVaccineRecord}
        />
      )}

      {/* Admin PIN Unlock Modal */}
      {isAdminPinModalOpen && (
        <AdminPinModal
          isOpen={isAdminPinModalOpen}
          language={language}
          onClose={() => setIsAdminPinModalOpen(false)}
          onSuccess={() => handleToggleAdminMode(true)}
        />
      )}

      {/* Official Bangladesh EPI Immunization Card & Print View */}
      {isEpiCardModalOpen && (
        <EpiCardView
          isOpen={isEpiCardModalOpen}
          baby={currentBaby}
          language={language}
          onClose={() => setIsEpiCardModalOpen(false)}
          currentUser={currentUser}
          savingsAccount={currentSavingsAccount}
          growthRecords={growthRecords}
        />
      )}

      {/* Mother & Baby Savings Modals */}
      {isDepositModalOpen && (
        <DepositModal
          isOpen={isDepositModalOpen}
          goals={currentSavingsAccount.goals}
          babyName={currentBaby.name}
          language={language}
          onClose={() => setIsDepositModalOpen(false)}
          onDeposit={handleDeposit}
        />
      )}

      {isWithdrawModalOpen && (
        <WithdrawModal
          isOpen={isWithdrawModalOpen}
          goals={currentSavingsAccount.goals}
          currentBalance={currentBalance}
          babyName={currentBaby.name}
          language={language}
          onClose={() => setIsWithdrawModalOpen(false)}
          onWithdraw={handleWithdraw}
        />
      )}

      {isGoalModalOpen && (
        <GoalModal
          isOpen={isGoalModalOpen}
          babyId={currentBaby.id}
          language={language}
          onClose={() => setIsGoalModalOpen(false)}
          onSaveGoal={handleSaveGoal}
        />
      )}

      {isCalculatorModalOpen && (
        <FutureCalculatorModal
          isOpen={isCalculatorModalOpen}
          language={language}
          onClose={() => setIsCalculatorModalOpen(false)}
        />
      )}

      {/* Community Post Modal */}
      {isCreatePostModalOpen && (
        <CreatePostModal
          isOpen={isCreatePostModalOpen}
          language={language}
          onClose={() => setIsCreatePostModalOpen(false)}
          onSubmitPost={handleCreatePost}
          initialAuthorName={currentUser ? `${currentUser.fullName} (${currentUser.role === 'father' ? 'বাবা' : 'মা'})` : undefined}
          initialCity={currentUser?.district}
        />
      )}

      {/* Pediatric Practical Video Player Modal */}
      {selectedVideoForModal && (
        <VideoPlayerModal
          video={selectedVideoForModal}
          isOpen={!!selectedVideoForModal}
          onClose={() => setSelectedVideoForModal(null)}
          language={language}
        />
      )}

      {/* Parent Login & Registration Modal */}
      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => {
            if (currentUser || isAdminMode) {
              setIsAuthModalOpen(false);
            }
          }}
          onLoginSuccess={handleLoginSuccess}
          language={language}
          onLanguageChange={setLanguage}
          initialMode={authModalMode}
        />
      )}

      {/* Health Assistant Details Modal (Name, Phone, Direct Call, WhatsApp & EPI Center) */}
      <HealthAssistantModal
        isOpen={isHealthAssistantModalOpen}
        onClose={() => setIsHealthAssistantModalOpen(false)}
        language={language}
        healthAssistantName={currentBaby.healthAssistantName}
        healthAssistantPhone={currentBaby.healthAssistantPhone}
        healthAssistantDesignation={currentBaby.healthAssistantDesignation}
        centerName={currentBaby.epiCenterName}
        district={currentBaby.district || 'ঢাকা'}
        upazila={currentBaby.upazila || 'ধানমন্ডি'}
      />

      {/* Super Admin Central Hub: "সব রেজিস্ট্রেশন" (All Registrations & Records Management) */}
      <AllRegistrationsModal
        isOpen={isAllRegistrationsModalOpen}
        onClose={() => setIsAllRegistrationsModalOpen(false)}
        language={language}
        allBabies={babies}
        currentBabyId={currentBabyId}
        onSelectBaby={(id) => {
          setCurrentBabyId(id);
          setIsAllRegistrationsModalOpen(false);
        }}
        onSaveBaby={handleSaveBabyFromAdmin}
      />

    </div>
  );
}
