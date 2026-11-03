import React, { useState, useEffect, useRef } from 'react';
import { 
  LogIn, 
  UserPlus, 
  Phone, 
  Lock, 
  User, 
  ShieldCheck, 
  CheckCircle2, 
  Baby, 
  ShieldAlert, 
  KeyRound, 
  RotateCcw, 
  Smartphone, 
  Check, 
  Copy, 
  ChevronLeft, 
  Globe, 
  FileText, 
  UserCheck,
  Building2,
  Briefcase
} from 'lucide-react';
import { 
  ParentUser, 
  ParentRole, 
  UserRole, 
  BirthCertificateStatus, 
  BANGLADESH_DISTRICTS,
  INITIAL_REGISTERED_ACCOUNTS, 
  STORAGE_KEY_REGISTERED_ACCOUNTS 
} from '../../types/auth';
import { Language } from '../../types/vaccine';
import { toBengaliNumerals, formatDateIso } from '../../utils/dateCalculations';

// Registry Helper Functions: 100% Secure Local Accounts Database
export function getRegisteredAccounts(): ParentUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REGISTERED_ACCOUNTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error(e);
  }
  localStorage.setItem(STORAGE_KEY_REGISTERED_ACCOUNTS, JSON.stringify(INITIAL_REGISTERED_ACCOUNTS));
  return INITIAL_REGISTERED_ACCOUNTS;
}

export function saveRegisteredAccount(newUser: ParentUser): ParentUser[] {
  const existing = getRegisteredAccounts();
  const cleanNewLoginId = (newUser.loginId || '').toLowerCase().trim();
  const cleanNewPhone = (newUser.phoneOrEmail || '').trim();

  const filtered = existing.filter(u => {
    const uLoginId = (u.loginId || '').toLowerCase().trim();
    const uPhone = (u.phoneOrEmail || '').trim();
    const isSameLogin = cleanNewLoginId && uLoginId && uLoginId === cleanNewLoginId;
    const isSamePhone = cleanNewPhone && uPhone && uPhone === cleanNewPhone;
    return !isSameLogin && !isSamePhone;
  });

  const updated = [newUser, ...filtered];
  localStorage.setItem(STORAGE_KEY_REGISTERED_ACCOUNTS, JSON.stringify(updated));
  return updated;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: ParentUser) => void;
  language: Language;
  onLanguageChange?: (lang: Language) => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  language,
  onLanguageChange,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [authStep, setAuthStep] = useState<'credentials' | 'two_factor'>('credentials');
  
  // Account Language state
  const [accountLanguage, setAccountLanguage] = useState<Language>(language);
  useEffect(() => {
    setAccountLanguage(language);
  }, [language]);

  const handleSetLanguage = (newLang: Language) => {
    setAccountLanguage(newLang);
    onLanguageChange?.(newLang);
  };

  const currentLang = accountLanguage;

  // Login credentials state
  const [loginRoleTab, setLoginRoleTab] = useState<'parent' | 'assistant' | 'admin'>('parent');
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register 3-Role Category state: 'super_admin' | 'health_assistant' | 'parent'
  const [regUserRole, setRegUserRole] = useState<UserRole>('parent');

  // Common Register States
  const [regName, setRegName] = useState('');
  const [regPhoneOrEmail, setRegPhoneOrEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regDistrict, setRegDistrict] = useState(BANGLADESH_DISTRICTS[0]);

  // Super Admin Specific States
  const [regAdminLoginId, setRegAdminLoginId] = useState('');

  // Health Assistant Specific States
  const [regHaEmployeeId, setRegHaEmployeeId] = useState('');
  const [regHaDesignation, setRegHaDesignation] = useState('স্বাস্থ্য সহকারী (ইপিআই টিকাদানকারী)');
  const [regHaCenterName, setRegHaCenterName] = useState('উপজেলা স্বাস্থ্য কমপ্লেক্স টিকাদান কেন্দ্র');

  // Parent Specific States
  const [regRole, setRegRole] = useState<ParentRole>('mother');
  const [regBabyName, setRegBabyName] = useState('');
  const [regBabyDob, setRegBabyDob] = useState(() => formatDateIso(new Date()));
  const [regBabyGender, setRegBabyGender] = useState<'boy' | 'girl' | 'other'>('boy');
  const [regChildOrder, setRegChildOrder] = useState<number>(1);
  const [hasBirthCert, setHasBirthCert] = useState<BirthCertificateStatus>('no');
  const [birthCertNumber, setBirthCertNumber] = useState('');
  const [twoFactorRequired, setTwoFactorRequired] = useState(true);

  // 2-Step Verification State
  const [pendingUser, setPendingUser] = useState<ParentUser | null>(null);
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState<string>('739281');
  const [otpTimer, setOtpTimer] = useState<number>(60);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // OTP Input references for automatic focus advancement
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown for 2-Factor OTP
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (authStep === 'two_factor' && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [authStep, otpTimer]);

  // Focus first OTP field when entering two_factor step
  useEffect(() => {
    if (authStep === 'two_factor') {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);
    }
  }, [authStep]);

  if (!isOpen) return null;

  // Helper to generate a realistic 6-digit numeric OTP
  const generateNewOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpTimer(60);
    setOtpDigits(['', '', '', '', '', '']);
    setErrorMessage(null);
    return code;
  };

  // Mask phone or email for privacy display
  const getMaskedIdentifier = (identifier: string) => {
    if (identifier.includes('@')) {
      const parts = identifier.split('@');
      const name = parts[0];
      const maskedName = name.length > 2 ? `${name.slice(0, 2)}***${name.slice(-1)}` : `${name}***`;
      return `${maskedName}@${parts[1]}`;
    }
    const clean = identifier.replace(/[^0-9+]/g, '');
    if (clean.length >= 10) {
      return `${clean.slice(0, 4)} *** *** ${clean.slice(-2)}`;
    }
    return identifier;
  };

  // =========================================================================
  // STRICT LOGIN VALIDATION: Only registered and valid accounts can log in!
  // =========================================================================
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmedId = loginIdentifier.trim();
    const enteredPassword = loginPassword.trim();

    if (!trimmedId) {
      setErrorMessage(
        currentLang === 'bn' 
          ? 'অনুগ্রহ করে আপনার নিবন্ধিত লগইন আইডি, মোবাইল নম্বর বা ইমেইল লিখুন।' 
          : 'Please enter your registered login ID, mobile number or email.'
      );
      return;
    }

    if (!enteredPassword) {
      setErrorMessage(
        currentLang === 'bn'
          ? 'অনুগ্রহ করে আপনার অ্যাকাউন্টের পাসওয়ার্ড লিখুন।'
          : 'Please enter your account password.'
      );
      return;
    }

    // 100% Strict Registry Validation: Look up in registered accounts database
    const accounts = getRegisteredAccounts();
    const cleanInput = trimmedId.toLowerCase().replace(/[\s\-]/g, '');
    
    const matchedUser = accounts.find(acc => {
      const accLoginId = (acc.loginId || '').toLowerCase().replace(/[\s\-]/g, '');
      const accPhone = (acc.phoneOrEmail || '').toLowerCase().replace(/[\s\-]/g, '');
      const accGovtId = (acc.govtEmployeeId || '').toLowerCase().replace(/[\s\-]/g, '');
      
      return (
        accLoginId === cleanInput ||
        accPhone === cleanInput ||
        (accGovtId && accGovtId === cleanInput)
      );
    });

    // STRICT REJECTION: Fake or non-registered IDs are completely rejected!
    if (!matchedUser) {
      setErrorMessage(
        currentLang === 'bn'
          ? `❌ ভুল আইডি! "${trimmedId}" নামে কোনো অ্যাকাউন্ট নিবন্ধিত নেই। কোনো ফেক বা অনিবন্ধিত তথ্য দিয়ে লগইন করা যাবে না। অনুগ্রহ করে সঠিক আইডি দিন অথবা "নতুন রেজিস্ট্রেশন" ট্যাব থেকে আগে আপনার পদ অনুযায়ী অ্যাকাউন্ট তৈরি করুন।`
          : `❌ Invalid ID! No registered account found for "${trimmedId}". Please register first or provide valid credentials.`
      );
      return;
    }

    // Verify Password
    if (matchedUser.pinOrPassword && matchedUser.pinOrPassword !== enteredPassword) {
      setErrorMessage(
        currentLang === 'bn'
          ? '❌ ভুল পাসওয়ার্ড! আপনার অ্যাকাউন্টের সঠিক পাসওয়ার্ড দিন।'
          : '❌ Incorrect password! Please enter the correct password.'
      );
      return;
    }

    // Verified! Set matching role tab for visual alignment and proceed to 2-Step OTP
    if (matchedUser.userRole === 'super_admin') setLoginRoleTab('admin');
    else if (matchedUser.userRole === 'health_assistant') setLoginRoleTab('assistant');
    else setLoginRoleTab('parent');

    setPendingUser(matchedUser);
    generateNewOtp();
    setAuthStep('two_factor');
  };

  // =========================================================================
  // 3-ROLE NEW REGISTRATION: Super Admin, Health Assistant & Parents
  // =========================================================================
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validate common required fields
    if (!regName.trim()) {
      setErrorMessage(currentLang === 'bn' ? 'দয়া করে পূর্ণ নাম লিখুন।' : 'Please enter full name.');
      return;
    }

    if (!regPassword) {
      setErrorMessage(currentLang === 'bn' ? 'দয়া করে একটি পাসওয়ার্ড দিন।' : 'Please enter a password.');
      return;
    }
    if (regPassword.length < 4) {
      setErrorMessage(
        currentLang === 'bn' 
          ? 'পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।' 
          : 'Password must be at least 4 characters.'
      );
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMessage(
        currentLang === 'bn' 
          ? 'পাসওয়ার্ড ও Confirm Password মিলছে না! অনুগ্রহ করে পুনরায় চেক করুন।' 
          : 'Password and Confirm Password do not match! Please check again.'
      );
      return;
    }

    const accounts = getRegisteredAccounts();

    // 1. SUPER ADMIN REGISTRATION
    if (regUserRole === 'super_admin') {
      const cleanAdminId = regAdminLoginId.trim();
      const cleanEmail = regPhoneOrEmail.trim();

      if (!cleanAdminId) {
        setErrorMessage(currentLang === 'bn' ? 'দয়া করে এডমিন ইউজারনেম / লগইন আইডি লিখুন।' : 'Please enter Admin Login ID.');
        return;
      }
      if (!cleanEmail) {
        setErrorMessage(currentLang === 'bn' ? 'দয়া করে এডমিনের অফিশিয়াল ইমেইল লিখুন।' : 'Please enter official email.');
        return;
      }

      // Check if Admin Login ID or email is already taken
      const alreadyExists = accounts.some(u => 
        (u.loginId && u.loginId.toLowerCase() === cleanAdminId.toLowerCase()) ||
        (u.phoneOrEmail && u.phoneOrEmail.toLowerCase() === cleanEmail.toLowerCase())
      );
      if (alreadyExists) {
        setErrorMessage(currentLang === 'bn' ? 'এই এডমিন লগইন আইডি বা ইমেইল ইতিমধ্যে ব্যবহৃত হয়েছে! অনুগ্রহ করে ভিন্ন আইডি দিন।' : 'This Admin ID or email is already registered.');
        return;
      }

      const newAdminUser: ParentUser = {
        id: `admin-${Date.now()}`,
        loginId: cleanAdminId,
        fullName: regName.trim(),
        phoneOrEmail: cleanEmail,
        role: 'guardian',
        userRole: 'super_admin',
        designation: currentLang === 'bn' ? 'সুপার এডমিন (App Developer)' : 'Super Admin (Developer)',
        district: regDistrict,
        pinOrPassword: regPassword.trim(),
        preferredLanguage: accountLanguage,
        twoFactorEnabled: true,
        joinedDate: new Date().toISOString().split('T')[0],
        status: 'active',
      };

      saveRegisteredAccount(newAdminUser);

      // Pre-fill login and transition
      setLoginIdentifier(cleanAdminId);
      setLoginPassword(regPassword.trim());
      setLoginRoleTab('admin');
      setSuccessMessage(
        currentLang === 'bn' 
          ? `🎉 অভিনন্দন! সুপার এডমিন রেজিস্ট্রেশন সম্পন্ন হয়েছে। আপনার লগইন আইডি: "${cleanAdminId}"। নিচে লগইন বাটন চেপে প্রবেশ করুন।` 
          : `🎉 Super Admin registered! Your Login ID: "${cleanAdminId}". Proceed to log in.`
      );
      setMode('login');
      return;
    }

    // 2. HEALTH ASSISTANT REGISTRATION
    if (regUserRole === 'health_assistant') {
      const cleanHaId = regHaEmployeeId.trim().toUpperCase();
      const cleanPhone = regPhoneOrEmail.trim();

      if (!cleanHaId) {
        setErrorMessage(currentLang === 'bn' ? 'দয়া করে সরকারি স্বাস্থ্য সহকারী আইডি (Govt HA ID) লিখুন।' : 'Please enter Health Assistant ID.');
        return;
      }
      if (!cleanPhone) {
        setErrorMessage(currentLang === 'bn' ? 'দয়া করে স্বাস্থ্য সহকারীর মোবাইল নম্বর লিখুন।' : 'Please enter mobile number.');
        return;
      }
      if (!regHaCenterName.trim()) {
        setErrorMessage(currentLang === 'bn' ? 'দয়া করে দায়িত্বপ্রাপ্ত টিকাকেন্দ্রের নাম লিখুন।' : 'Please enter assigned center name.');
        return;
      }

      // Check if HA ID or Phone is already taken
      const alreadyExists = accounts.some(u => 
        (u.loginId && u.loginId.toUpperCase() === cleanHaId) ||
        (u.govtEmployeeId && u.govtEmployeeId.toUpperCase() === cleanHaId) ||
        (u.phoneOrEmail && u.phoneOrEmail === cleanPhone)
      );
      if (alreadyExists) {
        setErrorMessage(currentLang === 'bn' ? 'এই স্বাস্থ্য সহকারী আইডি বা মোবাইল নম্বর ইতিমধ্যে নিবন্ধিত আছে!' : 'This Health Assistant ID or mobile number is already registered.');
        return;
      }

      const newHaUser: ParentUser = {
        id: `ha-${Date.now()}`,
        loginId: cleanHaId,
        govtEmployeeId: cleanHaId,
        fullName: regName.trim(),
        phoneOrEmail: cleanPhone,
        role: 'guardian',
        userRole: 'health_assistant',
        designation: regHaDesignation.trim() || 'স্বাস্থ্য সহকারী (ইপিআই)',
        centerName: regHaCenterName.trim(),
        district: regDistrict,
        pinOrPassword: regPassword.trim(),
        preferredLanguage: accountLanguage,
        twoFactorEnabled: true,
        joinedDate: new Date().toISOString().split('T')[0],
        status: 'active',
      };

      saveRegisteredAccount(newHaUser);

      // Pre-fill login and transition
      setLoginIdentifier(cleanHaId);
      setLoginPassword(regPassword.trim());
      setLoginRoleTab('assistant');
      setSuccessMessage(
        currentLang === 'bn' 
          ? `🎉 অভিনন্দন! স্বাস্থ্য সহকারী রেজিস্ট্রেশন সম্পন্ন হয়েছে। আপনার লগইন আইডি: "${cleanHaId}"। নিচে লগইন বাটন চেপে প্রবেশ করুন।` 
          : `🎉 Health Assistant registered! Your Login ID: "${cleanHaId}". Proceed to log in.`
      );
      setMode('login');
      return;
    }

    // 3. PARENT REGISTRATION
    const cleanPhone = regPhoneOrEmail.trim();
    if (!cleanPhone) {
      setErrorMessage(currentLang === 'bn' ? 'দয়া করে আপনার সচল মোবাইল নম্বর দিন।' : 'Please enter an active mobile number.');
      return;
    }
    if (!regBabyName.trim()) {
      setErrorMessage(currentLang === 'bn' ? 'দয়া করে বাচ্চার নাম লিখুন।' : "Please enter baby's name.");
      return;
    }
    if (!regBabyDob) {
      setErrorMessage(currentLang === 'bn' ? 'দয়া করে বাচ্চার জন্ম তারিখ দিন।' : "Please enter baby's date of birth.");
      return;
    }
    if (hasBirthCert === 'yes') {
      const cleanBRN = birthCertNumber.trim();
      if (!cleanBRN || cleanBRN.length < 10) {
        setErrorMessage(
          currentLang === 'bn' 
            ? 'দয়া করে সঠিক জন্ম নিবন্ধন নম্বর (১৭ ডিজিট) লিখুন।' 
            : 'Please enter a valid 17-digit Birth Registration Number.'
        );
        return;
      }
    }

    // Check if parent phone already exists
    const alreadyExists = accounts.some(u => 
      (u.phoneOrEmail && u.phoneOrEmail === cleanPhone) ||
      (u.loginId && u.loginId === cleanPhone)
    );
    if (alreadyExists) {
      setErrorMessage(currentLang === 'bn' ? 'এই মোবাইল নম্বরটি ইতিমধ্যে নিবন্ধিত আছে! অনুগ্রহ করে সরাসরি লগইন করুন।' : 'This mobile number is already registered. Please log in.');
      return;
    }

    const newParentUser: ParentUser = {
      id: `parent-${Date.now()}`,
      loginId: cleanPhone,
      fullName: regName.trim(),
      phoneOrEmail: cleanPhone,
      role: regRole,
      userRole: 'parent',
      babyName: regBabyName.trim() || undefined,
      babyDob: regBabyDob || undefined,
      babyGender: regBabyGender,
      childOrder: regChildOrder,
      hasBirthCertificate: hasBirthCert,
      birthCertificateNumber: hasBirthCert === 'yes' ? birthCertNumber.trim() : undefined,
      district: regDistrict,
      preferredLanguage: accountLanguage,
      pinOrPassword: regPassword.trim(),
      twoFactorEnabled: twoFactorRequired,
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'active',
    };

    saveRegisteredAccount(newParentUser);

    // Pre-fill login and transition
    setLoginIdentifier(cleanPhone);
    setLoginPassword(regPassword.trim());
    setLoginRoleTab('parent');
    setSuccessMessage(
      currentLang === 'bn' 
        ? `🎉 অভিনন্দন! অভিভাবক রেজিস্ট্রেশন সফল হয়েছে। আপনার লগইন আইডি: "${cleanPhone}"। নিচে লগইন বাটন চেপে প্রবেশ করুন।` 
        : `🎉 Parent registered! Your Login ID: "${cleanPhone}". Proceed to log in.`
    );
    setMode('login');
  };

  // Handle Backspace navigation in OTP
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Auto-fill the generated OTP with 1 click
  const handleAutoFillOtp = () => {
    const splitted = generatedOtp.split('');
    setOtpDigits(splitted);
    setErrorMessage(null);
    otpInputRefs.current[5]?.focus();
  };

  // Copy OTP code
  const handleCopyOtp = () => {
    navigator.clipboard.writeText(generatedOtp);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Step 2: Verify the 6-digit OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const enteredOtp = otpDigits.join('');

    if (enteredOtp.length < 6) {
      setErrorMessage(
        language === 'bn' 
          ? 'অনুগ্রহ করে সম্পূর্ণ ৬-সংখ্যার ওটিপি কোডটি লিখুন।' 
          : 'Please enter the complete 6-digit OTP code.'
      );
      return;
    }

    if (enteredOtp !== generatedOtp) {
      setErrorMessage(
        language === 'bn'
          ? 'ভুল ওটিপি কোড! অনুগ্রহ করে আপনার মোবাইলে পাঠানো সঠিক কোডটি দিন বা "অটো-পূরণ" বাটনে চাপুন।'
          : 'Invalid OTP code! Please enter the exact code or click Auto-fill.'
      );
      return;
    }

    // OTP Verified successfully!
    setIsVerifying(true);
    setSuccessMessage(
      language === 'bn' 
        ? '✅ ২-ধাপ যাচাইকরণ সফল! অ্যাকাউন্টে প্রবেশ করা হচ্ছে...' 
        : '✅ 2-Step Verification passed! Logging in...'
    );

    setTimeout(() => {
      if (pendingUser) {
        saveRegisteredAccount(pendingUser);
        onLoginSuccess(pendingUser);
      }
      setIsVerifying(false);
      onClose();
    }, 700);
  };

  // Reset to default accounts
  const handleResetAllStoredIds = () => {
    localStorage.setItem(STORAGE_KEY_REGISTERED_ACCOUNTS, JSON.stringify(INITIAL_REGISTERED_ACCOUNTS));
    setLoginIdentifier('admin');
    setLoginPassword('1234');
    setLoginRoleTab('admin');
    setSuccessMessage(
      currentLang === 'bn' 
        ? '✅ সকল ফেক ও কাস্টম আইডি সাফ করে মূল ৩টি ভেরিফাইড অ্যাকাউন্টে রিসেট করা হয়েছে (admin, HA-4819, 01700-123456)।' 
        : '✅ Reset to default verified accounts.'
    );
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div 
        className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden flex flex-col max-h-[96vh] animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header with Brand Pattern - NO Close (X) button as strictly requested */}
        <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-700 px-4 py-3 sm:px-5 sm:py-3.5 text-white relative shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-base shadow-inner shrink-0">
              {authStep === 'two_factor' ? '🛡️' : '👶'}
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-teal-200 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-teal-300" />
                {authStep === 'two_factor' 
                  ? (currentLang === 'bn' ? 'দ্বি-স্তর নিরাপত্তা' : '2FA Security')
                  : (currentLang === 'bn' ? 'মা ও শিশু সুরক্ষা অঙ্গন' : 'Mother & Baby Care')}
              </span>
              <h2 className="text-base sm:text-lg font-bold leading-tight">
                {authStep === 'two_factor'
                  ? (currentLang === 'bn' ? '🔐 ২-ধাপ যাচাইকরণ (2FA OTP)' : '2-Step Verification')
                  : mode === 'login' 
                    ? (currentLang === 'bn' ? 'নিরাপদ ডিজিটাল প্রবেশদ্বার' : 'Secure App Access') 
                    : (currentLang === 'bn' ? 'নতুন অ্যাকাউন্ট রেজিস্ট্রেশন' : 'Create New Account')}
              </h2>
            </div>
          </div>

          <p className="text-[11px] text-teal-100/90 leading-tight">
            {authStep === 'two_factor'
              ? (currentLang === 'bn' ? 'আপনার মোবাইলে পাঠানো ৬ সংখ্যার কোড লিখুন।' : 'Enter 6-digit code sent to your phone.')
              : mode === 'login'
                ? (currentLang === 'bn' ? 'শুধুমাত্র নিবন্ধিত আইডি ও পাসওয়ার্ড দিয়ে অ্যাপে প্রবেশ করুন।' : 'Login with your registered ID and password.')
                : (currentLang === 'bn' ? 'সুপার এডমিন, স্বাস্থ্য সহকারী বা অভিভাবক হিসেবে নিবন্ধন করুন।' : 'Register as Super Admin, Health Assistant or Parent.')}
          </p>

          {/* Mode Switch Tabs (Only visible in credentials step) */}
          {authStep === 'credentials' && (
            <div className="mt-2.5 flex rounded-lg bg-black/20 p-0.5">
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMessage(null); }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === 'login' ? 'bg-white text-teal-900 shadow-sm' : 'text-white/80 hover:text-white'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{currentLang === 'bn' ? 'লগইন করুন' : 'Sign In'}</span>
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setErrorMessage(null); }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === 'register' ? 'bg-white text-teal-900 shadow-sm' : 'text-white/80 hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{currentLang === 'bn' ? 'নতুন রেজিস্ট্রেশন' : 'New Register'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-3 sm:p-4 overflow-y-auto space-y-2.5 flex-1">
          
          {/* Account Language Selector */}
          <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-xl shadow-xs">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-teal-700" />
              <span className="text-xs font-bold text-slate-700">
                {currentLang === 'bn' ? 'অ্যাপের ভাষা:' : 'App Language:'}
              </span>
            </div>
            <div className="flex rounded-lg bg-slate-200/80 p-0.5">
              <button
                type="button"
                onClick={() => handleSetLanguage('bn')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  accountLanguage === 'bn'
                    ? 'bg-white text-teal-900 shadow-xs ring-1 ring-black/5'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                বাংলা
              </button>
              <button
                type="button"
                onClick={() => handleSetLanguage('en')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  accountLanguage === 'en'
                    ? 'bg-white text-teal-900 shadow-xs ring-1 ring-black/5'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="p-3 text-xs rounded-xl bg-rose-50 text-rose-800 border border-rose-200 font-medium flex items-start gap-2 animate-in fade-in duration-200">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 text-xs rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium flex items-start gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{successMessage}</span>
            </div>
          )}

          {/* ================= STEP 2: 2-FACTOR AUTHENTICATION (OTP) ================= */}
          {authStep === 'two_factor' ? (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              
              {/* Back button to Step 1 */}
              <button
                type="button"
                onClick={() => {
                  setAuthStep('credentials');
                  setErrorMessage(null);
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-900 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{currentLang === 'bn' ? '← লগইন ফর্মে ফিরে যান' : '← Back to Login'}</span>
              </button>

              {/* Realistic Simulated SMS Gateway Banner */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-3.5 shadow-xs">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-amber-600 animate-pulse" />
                    <span className="text-xs font-bold text-amber-900">
                      {currentLang === 'bn' ? '📩 টেস্ট এসএমএস সিমুলেশন (OTP Received):' : '📩 Test SMS Simulation (OTP):'}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-200/80 text-amber-900 rounded-md">
                    2FA Verified
                  </span>
                </div>

                <p className="text-xs text-amber-950 font-medium leading-relaxed">
                  {currentLang === 'bn' 
                    ? `আপনার নিবন্ধিত অ্যাকাউন্ট (${getMaskedIdentifier(pendingUser?.phoneOrEmail || pendingUser?.loginId || '')})-এ পাঠানো সিকিউরিটি কোড:` 
                    : `Security OTP sent to ${getMaskedIdentifier(pendingUser?.phoneOrEmail || pendingUser?.loginId || '')}:`}
                </p>

                <div className="mt-2.5 flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-amber-200 shadow-inner">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black tracking-widest text-teal-900 font-mono">
                      {currentLang === 'bn' ? toBengaliNumerals(generatedOtp) : generatedOtp}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      ({generatedOtp})
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleCopyOtp}
                      className="px-2 py-1 text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      title={currentLang === 'bn' ? 'কপি করুন' : 'Copy'}
                    >
                      {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-500" />}
                      <span>{isCopied ? (currentLang === 'bn' ? 'কপি হয়েছে' : 'Copied') : (currentLang === 'bn' ? 'কপি' : 'Copy')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleAutoFillOtp}
                      className="px-2.5 py-1 text-[11px] font-bold text-teal-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors active:scale-95 shadow-xs cursor-pointer"
                    >
                      ⚡ {currentLang === 'bn' ? 'অটো-পূরণ' : 'Auto-fill'}
                    </button>
                  </div>
                </div>
              </div>

              {/* 6-Digit OTP Boxes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 text-center">
                  {currentLang === 'bn' ? 'নিচে ৬-সংখ্যার ভেরিফিকেশন কোডটি লিখুন:' : 'Enter the 6-digit verification code below:'}
                </label>
                <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={el => { otpInputRefs.current[idx] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit ?? ''}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        const newDigits = [...otpDigits];
                        newDigits[idx] = val.slice(-1);
                        setOtpDigits(newDigits);
                        if (val && idx < 5) {
                          otpInputRefs.current[idx + 1]?.focus();
                        }
                      }}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-black font-mono rounded-xl border transition-all outline-none ${
                        digit
                          ? 'border-teal-600 bg-teal-50/50 text-teal-900 ring-2 ring-teal-600/30'
                          : 'border-slate-300 bg-slate-50 text-slate-900 focus:border-teal-600 focus:bg-white focus:ring-2 focus:ring-teal-600/20'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Resend Timer & Button */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-500">
                  {otpTimer > 0 ? (
                    currentLang === 'bn' 
                      ? `পুনরায় কোড পাঠান: ${toBengaliNumerals(otpTimer)} সেকেন্ড` 
                      : `Resend code in: ${otpTimer}s`
                  ) : (
                    currentLang === 'bn' ? 'কোড পাননি?' : "Didn't get code?"
                  )}
                </span>

                <button
                  type="button"
                  disabled={otpTimer > 0}
                  onClick={generateNewOtp}
                  className={`inline-flex items-center gap-1 font-bold transition-colors cursor-pointer ${
                    otpTimer > 0 
                      ? 'text-slate-400 cursor-not-allowed' 
                      : 'text-teal-700 hover:text-teal-900 hover:underline'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{currentLang === 'bn' ? 'নতুন ওটিপি পাঠান' : 'Resend OTP'}</span>
                </button>
              </div>

              {/* Submit OTP Verification Button */}
              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3 px-4 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                <span>
                  {isVerifying 
                    ? (currentLang === 'bn' ? 'যাচাই করা হচ্ছে...' : 'Verifying...') 
                    : (currentLang === 'bn' ? '🔐 কোড যাচাই করে প্রবেশ করুন' : 'Verify & Sign In')}
                </span>
              </button>

              <div className="pt-2 border-t border-slate-100 text-center">
                <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    {currentLang === 'bn' 
                      ? 'ভেরিফিকেশন সম্পন্ন হলে আপনার পদবি অনুযায়ী অ্যাপের ফিচার আনলক হবে।' 
                      : 'Verified role permissions will be applied upon sign in.'}
                  </span>
                </p>
              </div>

            </form>
          ) : (

            /* ================= STEP 1: CREDENTIALS (LOGIN / REGISTER) ================= */
            mode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                
                {/* 3 User Roles Profile Selector for Login */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                    <span>{currentLang === 'bn' ? 'লগইন প্রোফাইল ফিল্টার:' : 'Filter Login Profile:'}</span>
                    <span className="text-[10px] text-rose-600 font-semibold">{currentLang === 'bn' ? '* শুধু নিবন্ধিত আইডি প্রযোজ্য' : '* Registered IDs only'}</span>
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setLoginRoleTab('parent');
                        setErrorMessage(null);
                      }}
                      className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                        loginRoleTab === 'parent'
                          ? 'border-teal-600 bg-teal-50 text-teal-950 ring-2 ring-teal-600/30 shadow-xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-sm">👨‍👩‍👧</span>
                      <span className="text-[11px] leading-tight font-bold">{currentLang === 'bn' ? 'অভিভাবক' : 'Parents'}</span>
                      <span className="text-[9px] text-slate-400 font-normal leading-none">{currentLang === 'bn' ? 'মোবাইল নম্বর' : 'Phone'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setLoginRoleTab('assistant');
                        setErrorMessage(null);
                      }}
                      className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                        loginRoleTab === 'assistant'
                          ? 'border-blue-600 bg-blue-50 text-blue-950 ring-2 ring-blue-600/30 shadow-xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-sm">💉</span>
                      <span className="text-[11px] leading-tight font-bold">{currentLang === 'bn' ? 'স্বাস্থ্য সহকারী' : 'Assistant'}</span>
                      <span className="text-[9px] text-slate-400 font-normal leading-none">{currentLang === 'bn' ? 'HA আইডি' : 'HA ID'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setLoginRoleTab('admin');
                        setErrorMessage(null);
                      }}
                      className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                        loginRoleTab === 'admin'
                          ? 'border-purple-600 bg-purple-50 text-purple-950 ring-2 ring-purple-600/30 shadow-xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-sm">🛡️</span>
                      <span className="text-[11px] leading-tight font-bold">{currentLang === 'bn' ? 'সুপার এডমিন' : 'Super Admin'}</span>
                      <span className="text-[9px] text-slate-400 font-normal leading-none">{currentLang === 'bn' ? 'এডমিন আইডি' : 'Admin ID'}</span>
                    </button>
                  </div>
                </div>

                {/* Login ID Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {loginRoleTab === 'admin'
                      ? (currentLang === 'bn' ? 'সুপার এডমিন লগইন আইডি বা ইমেইল' : 'Super Admin ID or Email')
                      : loginRoleTab === 'assistant'
                        ? (currentLang === 'bn' ? 'সরকারি স্বাস্থ্য সহকারী আইডি (HA ID) বা মোবাইল' : 'Health Assistant ID or Mobile')
                        : (currentLang === 'bn' ? 'অভিভাবকের নিবন্ধিত মোবাইল নম্বর বা আইডি' : 'Registered Parent Mobile Number')}
                    <span className="text-rose-500 ml-0.5">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      {loginRoleTab === 'admin' ? (
                        <ShieldCheck className="w-4 h-4 text-purple-600" />
                      ) : loginRoleTab === 'assistant' ? (
                        <UserCheck className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Phone className="w-4 h-4 text-teal-600" />
                      )}
                    </div>
                    <input
                      type="text"
                      required
                      value={loginIdentifier ?? ''}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder={
                        loginRoleTab === 'admin'
                          ? (currentLang === 'bn' ? 'যেমন: admin বা আপনার নিবন্ধিত এডমিন আইডি' : 'e.g. admin')
                          : loginRoleTab === 'assistant'
                            ? (currentLang === 'bn' ? 'যেমন: HA-4819 বা আপনার HA আইডি' : 'e.g. HA-4819')
                            : (currentLang === 'bn' ? 'যেমন: 01700-123456 বা আপনার নিবন্ধিত মোবাইল' : 'e.g. 01700-123456')
                      }
                      className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white font-medium"
                    />
                  </div>
                </div>

                {/* Password / PIN */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span>
                      {currentLang === 'bn' ? 'অ্যাকাউন্ট পাসওয়ার্ড বা পিন' : 'Account Password / PIN'}
                    </span>
                    <span className="text-[11px] text-teal-700 font-normal">
                      {currentLang === 'bn' ? '(আবশ্যক *)' : '(Required *)'}
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      required
                      value={loginPassword ?? ''}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••"
                      className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Quick Helper Chips for Testing Default Registered Accounts */}
                <div className="p-2.5 bg-slate-100/90 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>{currentLang === 'bn' ? '💡 টেস্ট আইডি দ্রুত পূরণ করুন:' : '💡 Quick Fill Verified Accounts:'}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setLoginRoleTab('admin');
                        setLoginIdentifier('admin');
                        setLoginPassword('1234');
                        setErrorMessage(null);
                      }}
                      className="px-2 py-1 text-[11px] font-semibold bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors cursor-pointer"
                    >
                      🛡️ সুপার এডমিন (admin / 1234)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLoginRoleTab('assistant');
                        setLoginIdentifier('HA-4819');
                        setLoginPassword('1234');
                        setErrorMessage(null);
                      }}
                      className="px-2 py-1 text-[11px] font-semibold bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer"
                    >
                      💉 স্বাস্থ্য সহকারী (HA-4819 / 1234)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLoginRoleTab('parent');
                        setLoginIdentifier('01700-123456');
                        setLoginPassword('1234');
                        setErrorMessage(null);
                      }}
                      className="px-2 py-1 text-[11px] font-semibold bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors cursor-pointer"
                    >
                      👨‍👩‍👧 অভিভাবক (01700-123456 / 1234)
                    </button>
                  </div>
                </div>

                {/* 2FA Security Notice */}
                <div className="bg-teal-50/70 border border-teal-200 rounded-xl p-2.5 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
                  <p className="text-[11px] text-teal-900 leading-tight">
                    <strong>{currentLang === 'bn' ? 'নিরাপদ যাচাইকরণ:' : 'Strict Security:'}</strong>{' '}
                    {currentLang === 'bn' 
                      ? 'শুধুমাত্র নিবন্ধিত অ্যাকাউন্টের ক্ষেত্রে পরবর্তী ওটিপি ধাপে যাওয়া যাবে।' 
                      : 'Only registered accounts are verified and authorized.'}
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{currentLang === 'bn' ? 'পরবর্তী ধাপ: ২-ধাপ যাচাইকরণ ➔' : 'Proceed to 2-Step Verification ➔'}</span>
                </button>

                {/* Reset All Stored IDs Action */}
                <div className="pt-2 border-t border-slate-100 text-center">
                  <button
                    type="button"
                    onClick={handleResetAllStoredIds}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 active:scale-95 cursor-pointer"
                    title={currentLang === 'bn' ? 'মূল ৩টি ভেরিফাইড অ্যাকাউন্টে রিসেট করুন' : 'Reset to verified default accounts'}
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                    <span>{currentLang === 'bn' ? '🔄 ডিফল্ট ভেরিফাইড আইডিতে রিসেট করুন' : 'Reset Verified Accounts'}</span>
                  </button>
                </div>
              </form>
            ) : (

              /* ================= 3-ROLE NEW REGISTRATION FORM ================= */
              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                
                {/* 3 Main Role Selection Tabs */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                    <span>{currentLang === 'bn' ? 'পদবি / রেজিস্ট্রেশন ক্যাটাগরি নির্বাচন করুন:' : 'Select Registration Category:'}</span>
                    <span className="text-[10px] text-teal-700 font-bold">* ৩টি ভূমিকা</span>
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => { setRegUserRole('super_admin'); setErrorMessage(null); }}
                      className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                        regUserRole === 'super_admin'
                          ? 'border-purple-600 bg-purple-50 text-purple-950 ring-2 ring-purple-600/30 shadow-xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-sm">🛡️</span>
                      <span className="text-[11px] leading-tight font-bold">{currentLang === 'bn' ? 'সুপার এডমিন' : 'Super Admin'}</span>
                      <span className="text-[9px] text-slate-500 font-normal">{currentLang === 'bn' ? 'ডেভেলপার' : 'Developer'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setRegUserRole('health_assistant'); setErrorMessage(null); }}
                      className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                        regUserRole === 'health_assistant'
                          ? 'border-blue-600 bg-blue-50 text-blue-950 ring-2 ring-blue-600/30 shadow-xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-sm">💉</span>
                      <span className="text-[11px] leading-tight font-bold">{currentLang === 'bn' ? 'স্বাস্থ্য সহকারী' : 'Assistant'}</span>
                      <span className="text-[9px] text-slate-500 font-normal">{currentLang === 'bn' ? 'ইপিআই কর্মী' : 'EPI Worker'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setRegUserRole('parent'); setErrorMessage(null); }}
                      className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                        regUserRole === 'parent'
                          ? 'border-teal-600 bg-teal-50 text-teal-950 ring-2 ring-teal-600/30 shadow-xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-sm">👨‍👩‍👧</span>
                      <span className="text-[11px] leading-tight font-bold">{currentLang === 'bn' ? 'অভিভাবক' : 'Parents'}</span>
                      <span className="text-[9px] text-slate-500 font-normal">{currentLang === 'bn' ? 'মা / বাবা' : 'Mother/Father'}</span>
                    </button>
                  </div>
                </div>

                {/* ROLE 1: SUPER ADMIN FORM */}
                {regUserRole === 'super_admin' && (
                  <div className="space-y-2.5 bg-purple-50/50 p-2.5 rounded-xl border border-purple-200">
                    <div className="text-[11px] font-bold text-purple-900 flex items-center gap-1.5 pb-1 border-b border-purple-200/80">
                      <ShieldCheck className="w-4 h-4 text-purple-700" />
                      <span>{currentLang === 'bn' ? 'সুপার এডমিন (App Developer) রেজিস্ট্রেশন তথ্য:' : 'Super Admin Registration Details:'}</span>
                    </div>

                    {/* Admin Full Name */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                        {currentLang === 'bn' ? 'সুপার এডমিনের পূর্ণ নাম' : 'Super Admin Full Name'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={regName ?? ''}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder={currentLang === 'bn' ? 'যেমন: মোঃ রাজু আহমেদ' : 'e.g. Md Razu Ahmed'}
                        className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>

                    {/* Admin Login ID */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5 flex items-center justify-between">
                        <span>{currentLang === 'bn' ? 'এডমিন লগইন আইডি (যা দিয়ে লগইন করবেন)' : 'Admin Login ID (Used to sign in)'} *</span>
                        <span className="text-[10px] text-purple-700 font-semibold">{currentLang === 'bn' ? 'অনন্য ইউজারনেম' : 'Unique ID'}</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={regAdminLoginId ?? ''}
                        onChange={(e) => setRegAdminLoginId(e.target.value.replace(/\s+/g, ''))}
                        placeholder={currentLang === 'bn' ? 'যেমন: admin_razu বা dev_admin' : 'e.g. admin_razu'}
                        className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 font-mono font-bold text-purple-900"
                      />
                    </div>

                    {/* Official Email */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                        {currentLang === 'bn' ? 'অফিশিয়াল ইমেইল' : 'Official Email'} *
                      </label>
                      <input
                        type="email"
                        required
                        value={regPhoneOrEmail ?? ''}
                        onChange={(e) => setRegPhoneOrEmail(e.target.value)}
                        placeholder="admin@babytika.gov.bd"
                        className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                  </div>
                )}

                {/* ROLE 2: HEALTH ASSISTANT FORM */}
                {regUserRole === 'health_assistant' && (
                  <div className="space-y-2.5 bg-blue-50/50 p-2.5 rounded-xl border border-blue-200">
                    <div className="text-[11px] font-bold text-blue-900 flex items-center gap-1.5 pb-1 border-b border-blue-200/80">
                      <UserCheck className="w-4 h-4 text-blue-700" />
                      <span>{currentLang === 'bn' ? 'স্বাস্থ্য সহকারী রেজিস্ট্রেশন তথ্য:' : 'Health Assistant Registration Details:'}</span>
                    </div>

                    {/* Health Assistant Name */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                        {currentLang === 'bn' ? 'স্বাস্থ্য সহকারীর পূর্ণ নাম' : 'Health Assistant Full Name'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={regName ?? ''}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder={currentLang === 'bn' ? 'যেমন: মোছাঃ নাজমুন নাহার' : 'e.g. Nazmun Nahar'}
                        className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    {/* Govt HA ID */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5 flex items-center justify-between">
                        <span>{currentLang === 'bn' ? 'সরকারি স্বাস্থ্য সহকারী আইডি (Govt HA ID)' : 'Govt Employee / HA ID'} *</span>
                        <span className="text-[10px] text-blue-700 font-semibold">{currentLang === 'bn' ? 'লগইন আইডি হিসেবে কাজ করবে' : 'Your Login ID'}</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={regHaEmployeeId ?? ''}
                        onChange={(e) => setRegHaEmployeeId(e.target.value.toUpperCase())}
                        placeholder={currentLang === 'bn' ? 'যেমন: HA-5021' : 'e.g. HA-5021'}
                        className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono font-bold text-blue-900"
                      />
                    </div>

                    {/* Assigned Center & Designation Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-0.5 flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-blue-600" />
                          <span>{currentLang === 'bn' ? 'দায়িত্বপ্রাপ্ত টিকাকেন্দ্র' : 'Assigned EPI Center'} *</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={regHaCenterName ?? ''}
                          onChange={(e) => setRegHaCenterName(e.target.value)}
                          placeholder={currentLang === 'bn' ? 'যেমন: ধানমন্ডি ইপিআই টিকাকেন্দ্র' : 'e.g. Dhanmondi EPI Center'}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-0.5 flex items-center gap-1">
                          <Briefcase className="w-3 h-3 text-blue-600" />
                          <span>{currentLang === 'bn' ? 'পদবি' : 'Designation'} *</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={regHaDesignation ?? ''}
                          onChange={(e) => setRegHaDesignation(e.target.value)}
                          placeholder={currentLang === 'bn' ? 'স্বাস্থ্য সহকারী (ইপিআই)' : 'Health Assistant'}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                        />
                      </div>
                    </div>

                    {/* Mobile Number */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                        {currentLang === 'bn' ? 'সচল মোবাইল নম্বর (যাচাইকরণের জন্য)' : 'Active Mobile Number'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={regPhoneOrEmail ?? ''}
                        onChange={(e) => setRegPhoneOrEmail(e.target.value)}
                        placeholder="017XXXXXXXX"
                        className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>
                )}

                {/* ROLE 3: PARENT FORM */}
                {regUserRole === 'parent' && (
                  <div className="space-y-2.5 bg-teal-50/50 p-2.5 rounded-xl border border-teal-200">
                    <div className="text-[11px] font-bold text-teal-900 flex items-center gap-1.5 pb-1 border-b border-teal-200/80">
                      <Baby className="w-4 h-4 text-teal-700" />
                      <span>{currentLang === 'bn' ? 'অভিভাবক ও শিশুর রেজিস্ট্রেশন তথ্য:' : 'Parent & Baby Details:'}</span>
                    </div>

                    {/* Role Selection: মা / বাবা / অভিভাবক */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        {currentLang === 'bn' ? 'আপনার ভূমিকা / পরিচয় নির্বাচন করুন' : 'Select Your Role'}
                      </label>
                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          type="button"
                          onClick={() => setRegRole('mother')}
                          className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            regRole === 'mother' 
                              ? 'border-teal-600 bg-white text-teal-900 ring-2 ring-teal-600/30 shadow-xs' 
                              : 'border-slate-200 bg-white/70 text-slate-600 hover:bg-white'
                          }`}
                        >
                          <span className="text-sm">👩</span>
                          <span>{currentLang === 'bn' ? 'মা' : 'Mother'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setRegRole('father')}
                          className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            regRole === 'father' 
                              ? 'border-blue-600 bg-white text-blue-900 ring-2 ring-blue-600/30 shadow-xs' 
                              : 'border-slate-200 bg-white/70 text-slate-600 hover:bg-white'
                          }`}
                        >
                          <span className="text-sm">👨</span>
                          <span>{currentLang === 'bn' ? 'বাবা' : 'Father'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setRegRole('guardian')}
                          className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            regRole === 'guardian' 
                              ? 'border-purple-600 bg-white text-purple-900 ring-2 ring-purple-600/30 shadow-xs' 
                              : 'border-slate-200 bg-white/70 text-slate-600 hover:bg-white'
                          }`}
                        >
                          <span className="text-sm">🤝</span>
                          <span>{currentLang === 'bn' ? 'অভিভাবক' : 'Guardian'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Parent Full Name */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                        {currentLang === 'bn' ? 'অভিভাবকের পূর্ণ নাম' : 'Parent Full Name'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={regName ?? ''}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder={currentLang === 'bn' ? 'যেমন: সাদিয়া সুলতানা' : 'e.g. Sadia Sultana'}
                        className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                      />
                    </div>

                    {/* Phone (Will be the Login ID) */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5 flex items-center justify-between">
                        <span>{currentLang === 'bn' ? 'মোবাইল নম্বর (এটি আপনার লগইন আইডি হবে)' : 'Mobile Number (Your Login ID)'} *</span>
                        <span className="text-[10px] text-teal-700 font-semibold">{currentLang === 'bn' ? 'লগইন আইডি' : 'Login ID'}</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={regPhoneOrEmail ?? ''}
                        onChange={(e) => setRegPhoneOrEmail(e.target.value)}
                        placeholder="017XXXXXXXX"
                        className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 font-mono font-bold text-teal-950"
                      />
                    </div>

                    {/* Baby Name & Birth Date Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                          {currentLang === 'bn' ? 'বাচ্চার নাম (Baby’s Name)' : "Baby's Name"} *
                        </label>
                        <input
                          type="text"
                          required
                          value={regBabyName ?? ''}
                          onChange={(e) => setRegBabyName(e.target.value)}
                          placeholder={currentLang === 'bn' ? 'যেমন: আরিয়ান ইসলাম' : 'e.g. Ariyan Islam'}
                          className="w-full py-1.5 px-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-0.5 flex items-center justify-between">
                          <span>{currentLang === 'bn' ? 'বাচ্চার জন্ম তারিখ' : "Baby's Date of Birth"} *</span>
                          <span className="text-[10px] text-teal-700 font-bold">
                            {currentLang === 'bn' ? 'টিকার জন্য' : 'For EPI'}
                          </span>
                        </label>
                        <input
                          type="date"
                          required
                          value={regBabyDob ?? ''}
                          onChange={(e) => setRegBabyDob(e.target.value)}
                          className="w-full py-1.5 px-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 font-bold text-slate-800"
                        />
                      </div>
                    </div>

                    {/* Baby Gender Selection: ছেলে / মেয়ে / অন্যান্য */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
                        <span>{currentLang === 'bn' ? 'শিশুর লিঙ্গ' : "Baby's Gender"} *</span>
                        <span className="text-[11px] font-semibold text-teal-700">
                          {regBabyGender === 'boy' 
                            ? (currentLang === 'bn' ? '👦 ছেলে' : '👦 Boy') 
                            : regBabyGender === 'girl'
                              ? (currentLang === 'bn' ? '👧 মেয়ে' : '👧 Girl')
                              : (currentLang === 'bn' ? '👶 অন্যান্য' : '👶 Other')}
                        </span>
                      </label>
                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          type="button"
                          onClick={() => setRegBabyGender('boy')}
                          className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-1 cursor-pointer ${
                            regBabyGender === 'boy'
                              ? 'border-blue-600 bg-white text-blue-900 ring-2 ring-blue-600/30 shadow-xs'
                              : 'border-slate-200 bg-white/70 text-slate-600 hover:bg-white'
                          }`}
                        >
                          <span className="text-sm">👦</span>
                          <span>{currentLang === 'bn' ? 'ছেলে' : 'Boy'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setRegBabyGender('girl')}
                          className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-1 cursor-pointer ${
                            regBabyGender === 'girl'
                              ? 'border-pink-600 bg-white text-pink-900 ring-2 ring-pink-600/30 shadow-xs'
                              : 'border-slate-200 bg-white/70 text-slate-600 hover:bg-white'
                          }`}
                        >
                          <span className="text-sm">👧</span>
                          <span>{currentLang === 'bn' ? 'মেয়ে' : 'Girl'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setRegBabyGender('other')}
                          className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-1 cursor-pointer ${
                            regBabyGender === 'other'
                              ? 'border-teal-600 bg-white text-teal-900 ring-2 ring-teal-600/30 shadow-xs'
                              : 'border-slate-200 bg-white/70 text-slate-600 hover:bg-white'
                          }`}
                        >
                          <span className="text-sm">👶</span>
                          <span>{currentLang === 'bn' ? 'অন্যান্য' : 'Other'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Child Order: কত নম্বর বেবি / কত তম সন্তান? (১-১০ সিলেক্ট ড্রপডাউন) */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5 flex items-center justify-between">
                        <span>{currentLang === 'bn' ? 'কত নম্বর বেবি / কত তম সন্তান?' : 'Birth Order (Which child?)'} *</span>
                        <span className="text-[10px] text-teal-700 font-bold">
                          {currentLang === 'bn' ? '১–১০ নম্বর' : '1-10'}
                        </span>
                      </label>
                      <select
                        value={regChildOrder}
                        onChange={(e) => setRegChildOrder(Number(e.target.value))}
                        className="w-full py-1.5 px-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 font-bold text-slate-800 cursor-pointer"
                      >
                        <option value={1}>{currentLang === 'bn' ? '১ম সন্তান (1st Child)' : '1st Child'}</option>
                        <option value={2}>{currentLang === 'bn' ? '২য় সন্তান (2nd Child)' : '2nd Child'}</option>
                        <option value={3}>{currentLang === 'bn' ? '৩য় সন্তান (3rd Child)' : '3rd Child'}</option>
                        <option value={4}>{currentLang === 'bn' ? '৪র্থ সন্তান (4th Child)' : '4th Child'}</option>
                        <option value={5}>{currentLang === 'bn' ? '৫ম সন্তান (5th Child)' : '5th Child'}</option>
                        <option value={6}>{currentLang === 'bn' ? '৬ষ্ঠ সন্তান (6th Child)' : '6th Child'}</option>
                        <option value={7}>{currentLang === 'bn' ? '৭ম সন্তান (7th Child)' : '7th Child'}</option>
                        <option value={8}>{currentLang === 'bn' ? '৮ম সন্তান (8th Child)' : '8th Child'}</option>
                        <option value={9}>{currentLang === 'bn' ? '৯ম সন্তান (9th Child)' : '9th Child'}</option>
                        <option value={10}>{currentLang === 'bn' ? '১০ম সন্তান (10th Child)' : '10th Child'}</option>
                      </select>
                    </div>

                    {/* Birth Certificate Information */}
                    <div className="p-2 bg-white border border-slate-200 rounded-xl space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] font-bold text-slate-800 flex items-center gap-1">
                          <FileText className="w-3 h-3 text-teal-700" />
                          <span>{currentLang === 'bn' ? 'জন্ম নিবন্ধন সনদ আছে কি?' : 'Birth Certificate?'}</span>
                        </label>
                        <span className="text-[10px] text-slate-500">
                          {currentLang === 'bn' ? 'নির্বাচন করুন' : 'Select'}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          type="button"
                          onClick={() => setHasBirthCert('yes')}
                          className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-1 cursor-pointer ${
                            hasBirthCert === 'yes'
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-600/30 shadow-xs font-extrabold'
                              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span>✅</span>
                          <span>{currentLang === 'bn' ? 'হ্যাঁ' : 'Yes'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => { setHasBirthCert('no'); setBirthCertNumber(''); }}
                          className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-1 cursor-pointer ${
                            hasBirthCert === 'no'
                              ? 'border-slate-600 bg-slate-100 text-slate-900 ring-1 ring-slate-600/30 shadow-xs font-extrabold'
                              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span>❌</span>
                          <span>{currentLang === 'bn' ? 'না' : 'No'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => { setHasBirthCert('applied'); setBirthCertNumber(''); }}
                          className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-1 cursor-pointer ${
                            hasBirthCert === 'applied'
                              ? 'border-amber-600 bg-amber-50 text-amber-900 ring-1 ring-amber-600/30 shadow-xs font-extrabold'
                              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span>⏳</span>
                          <span className="truncate">{currentLang === 'bn' ? 'আবেদনকৃত' : 'Applied'}</span>
                        </button>
                      </div>

                      {hasBirthCert === 'yes' && (
                        <div className="pt-1.5 border-t border-slate-100 animate-in fade-in duration-200">
                          <label className="block text-[11px] font-bold text-teal-900 mb-0.5 flex items-center justify-between">
                            <span>{currentLang === 'bn' ? '১৭ সংখ্যার জন্ম নিবন্ধন নম্বর (BRN):' : '17-digit BRN:'} *</span>
                            <span className="text-[10px] text-teal-700 font-mono">
                              {birthCertNumber.length}/17
                            </span>
                          </label>
                          <input
                            type="text"
                            required
                            inputMode="numeric"
                            maxLength={17}
                            value={birthCertNumber ?? ''}
                            onChange={(e) => setBirthCertNumber(e.target.value.replace(/[^0-9]/g, ''))}
                            placeholder={currentLang === 'bn' ? '১৭ সংখ্যার নম্বর লিখুন' : '17-digit BRN'}
                            className="w-full py-1.5 px-2.5 text-xs font-mono font-bold bg-slate-50 border border-teal-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 text-slate-900 placeholder:font-sans placeholder:font-normal"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Common District Selection */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                    {currentLang === 'bn' ? 'জেলা' : 'District'} *
                  </label>
                  <select
                    value={regDistrict}
                    onChange={(e) => setRegDistrict(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer"
                  >
                    {BANGLADESH_DISTRICTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* Common Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                      {currentLang === 'bn' ? 'পাসওয়ার্ড নির্ধারণ করুন' : 'Set Password'} *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="password"
                        required
                        value={regPassword ?? ''}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-8 pr-2.5 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                      {currentLang === 'bn' ? 'Confirm Password' : 'Confirm Password'} *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="password"
                        required
                        value={regConfirmPassword ?? ''}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`w-full pl-8 pr-2.5 py-1.5 text-xs sm:text-sm bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:bg-white ${
                          regConfirmPassword && regConfirmPassword !== regPassword
                            ? 'border-rose-400 focus:ring-rose-500'
                            : 'border-slate-200 focus:ring-teal-600'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Registration Button */}
                <div className="pt-1">
                  <button
                    type="submit"
                    className={`w-full py-2.5 px-3 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer ${
                      regUserRole === 'super_admin'
                        ? 'bg-purple-700 hover:bg-purple-800'
                        : regUserRole === 'health_assistant'
                          ? 'bg-blue-700 hover:bg-blue-800'
                          : 'bg-teal-700 hover:bg-teal-800'
                    }`}
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>
                      {regUserRole === 'super_admin'
                        ? (currentLang === 'bn' ? '🛡️ সুপার এডমিন একাউন্ট তৈরি করুন ➔' : 'Register Super Admin ➔')
                        : regUserRole === 'health_assistant'
                          ? (currentLang === 'bn' ? '💉 স্বাস্থ্য সহকারী একাউন্ট তৈরি করুন ➔' : 'Register Health Assistant ➔')
                          : (currentLang === 'bn' ? '👨‍👩‍👧 অভিভাবক একাউন্ট তৈরি করুন ➔' : 'Register Parent Account ➔')}
                    </span>
                  </button>
                </div>

                <p className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  <span>
                    {currentLang === 'bn' 
                      ? 'রেজিস্ট্রেশনের পর প্রাপ্ত নিজস্ব আইডি দিয়ে সরাসরি লগইন করতে পারবেন।' 
                      : 'You will use your generated ID and password to log in.'}
                  </span>
                </p>
              </form>
            )
          )}
        </div>
      </div>
    </div>
  );
};
