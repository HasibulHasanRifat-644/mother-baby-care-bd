export type ParentRole = 'mother' | 'father' | 'guardian';

export type UserRole = 'super_admin' | 'health_assistant' | 'parent';

export type BirthCertificateStatus = 'yes' | 'no' | 'applied';

export interface ParentUser {
  id: string;
  loginId?: string;
  fullName: string;
  phoneOrEmail: string;
  role: ParentRole;
  userRole?: UserRole;
  designation?: string;
  govtEmployeeId?: string;
  centerId?: string;
  centerName?: string;
  district?: string;
  pinOrPassword?: string;
  avatarUrl?: string;
  babyName?: string;
  babyDob?: string;
  babyGender?: 'boy' | 'girl' | 'other';
  childOrder?: number;
  hasBirthCertificate?: BirthCertificateStatus;
  birthCertificateNumber?: string;
  preferredLanguage?: 'bn' | 'en';
  twoFactorEnabled?: boolean;
  joinedDate: string;
  createdAt?: string;
  upazila?: string;
  status?: 'active' | 'pending';
}

export const STORAGE_KEY_REGISTERED_ACCOUNTS = 'bd_registered_accounts_db_v1';

export const BANGLADESH_DISTRICTS = [
  'ঢাকা (Dhaka)',
  'চট্টগ্রাম (Chattogram)',
  'সিলেট (Sylhet)',
  'রাজশাহী (Rajshahi)',
  'খুলনা (Khulna)',
  'বরিশাল (Barishal)',
  'রংপুর (Rangpur)',
  'ময়মনসিংহ (Mymensingh)',
  'কুমিল্লা (Cumilla)',
  'গাজীপুর (Gazipur)',
  'নারায়ণগঞ্জ (Narayanganj)',
  'বগুড়া (Bogura)',
  'কক্সবাজার (Cox\'s Bazar)',
  'অন্যান্য জেলা (Other)',
];

export const INITIAL_REGISTERED_ACCOUNTS: ParentUser[] = [
  {
    id: 'super-admin-01',
    loginId: 'admin',
    fullName: 'সুপার এডমিন (App Developer)',
    phoneOrEmail: 'admin@babytika.gov.bd',
    role: 'guardian',
    userRole: 'super_admin',
    pinOrPassword: '1234',
    designation: 'প্রধান সিস্টেম অ্যাডমিনিস্ট্রেটর ও সফটওয়্যার ইঞ্জিনিয়ার',
    district: 'ঢাকা (জাতীয় ইপিআই সদর দফতর)',
    preferredLanguage: 'bn',
    twoFactorEnabled: true,
    joinedDate: '২০২৪-০১-০১',
    status: 'active',
  },
  {
    id: 'ha-nazmun-4819',
    loginId: 'HA-4819',
    fullName: 'মোছাঃ নাজমুন নাহার',
    phoneOrEmail: '01712-345678',
    role: 'guardian',
    userRole: 'health_assistant',
    pinOrPassword: '1234',
    govtEmployeeId: 'HA-4819',
    designation: 'স্বাস্থ্য সহকারী (ইপিআই টিকাদানকারী)',
    centerName: 'ধানমন্ডি ইপিআই টিকাকেন্দ্র',
    district: 'ঢাকা দক্ষিণ সিটি কর্পোরেশন',
    preferredLanguage: 'bn',
    twoFactorEnabled: true,
    joinedDate: '২০২৫-০৩-১৫',
    status: 'active',
  },
  {
    id: 'parent-sadia-01',
    loginId: '01700-123456',
    fullName: 'সাদিয়া সুলতানা',
    phoneOrEmail: '01700-123456',
    role: 'mother',
    userRole: 'parent',
    pinOrPassword: '1234',
    babyName: 'আরিয়ান ইসলাম',
    babyDob: '2026-01-10',
    babyGender: 'boy',
    childOrder: 1,
    hasBirthCertificate: 'yes',
    birthCertificateNumber: '20262692015004891',
    district: 'ঢাকা (Dhaka)',
    preferredLanguage: 'bn',
    twoFactorEnabled: true,
    joinedDate: '২০২৬-০১-১৫',
    status: 'active',
  },
];

export const DEMO_PARENTS: ParentUser[] = INITIAL_REGISTERED_ACCOUNTS;
