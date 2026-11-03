export type Language = 'bn' | 'en';

export type VaccineStatus = 'done' | 'due-soon' | 'overdue' | 'upcoming';

export interface VaccineInfo {
  id: string;
  code: string;
  nameBn: string;
  nameEn: string;
  diseasesBn: string[];
  diseasesEn: string[];
  doseTextBn: string;
  doseTextEn: string;
  routeBn: string;
  routeEn: string;
  siteBn: string;
  siteEn: string;
  ageMilestoneId: string;
  dayOffset: number; // calculated from birth date
  isCoreEpi: boolean; // Bangladesh Government Free EPI
  importanceNotesBn: string;
  importanceNotesEn: string;
}

export interface Milestone {
  id: string;
  titleBn: string;
  titleEn: string;
  ageBn: string;
  ageEn: string;
  approxDays: number;
  descriptionBn: string;
  descriptionEn: string;
  vaccineIds: string[];
}

export interface AdministeredRecord {
  vaccineId: string;
  isGiven: boolean;
  dateGiven?: string; // YYYY-MM-DD
  centerName?: string; // e.g. ঢাকা মেডিকেল / ইপিআই কেন্দ্র
  batchNumber?: string;
  reactionNotes?: string;
  givenBy?: string;
}

export interface BabyProfile {
  id: string;
  name: string;
  nameBn?: string;
  dateOfBirth: string; // YYYY-MM-DD
  gender: 'boy' | 'girl' | 'other';
  childOrder?: number;
  bloodGroup?: string;
  birthWeightKg?: string;
  epiCardNumber?: string;
  hospitalOfBirth?: string;
  records: Record<string, AdministeredRecord>; // vaccineId -> record
  birthRegistrationNumber?: string;
  hasBirthCertificate?: 'yes' | 'no' | 'applied';
  photoUrl?: string;
  passportPhotoUrl?: string;
  babyPassportNumber?: string;
  parentIdType?: 'nid' | 'birth_certificate';
  parentIdNumber?: string;
  parentIdFrontPhoto?: string;
  parentIdBackPhoto?: string;
  motherName?: string;
  fatherName?: string;
  motherIdType?: 'nid' | 'birth_certificate';
  motherIdNumber?: string;
  motherIdFrontPhoto?: string;
  motherIdBackPhoto?: string;
  fatherIdType?: 'nid' | 'birth_certificate';
  fatherIdNumber?: string;
  fatherIdFrontPhoto?: string;
  fatherIdBackPhoto?: string;
  healthAssistantName?: string;
  healthAssistantPhone?: string;
  healthAssistantDesignation?: string;
  division?: string;
  district?: string;
  upazila?: string;
  unionPourashava?: string;
  village?: string;
  ward?: string;
  epiCenterName?: string;
  createdAt: string;
}

export interface HealthHelpline {
  number: string;
  nameBn: string;
  nameEn: string;
  descBn: string;
  descEn: string;
  isEmergency?: boolean;
}
