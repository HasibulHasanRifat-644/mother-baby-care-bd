import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  User, 
  Calendar, 
  Droplets, 
  Scale, 
  Building, 
  Hash, 
  Check, 
  Lock, 
  Unlock, 
  Camera, 
  Upload, 
  Trash2, 
  MapPin, 
  ShieldCheck, 
  Info, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  CreditCard,
  Image as ImageIcon
} from 'lucide-react';
import { BabyProfile, Language } from '../types/vaccine';
import { formatDateIso } from '../utils/dateCalculations';
import { 
  BANGLADESH_DIVISIONS, 
  DEMO_AUTOFILL_ADDRESS,
  BANGLADESH_DIVISION_PRESETS,
  getPresetForDivision 
} from '../data/bangladeshLocations';

interface BabyProfileModalProps {
  isOpen: boolean;
  isNew: boolean;
  babyProfile: BabyProfile;
  language: Language;
  isAdminMode?: boolean;
  onClose: () => void;
  onSave: (updatedProfile: BabyProfile) => void;
  onDelete?: (babyId: string) => void;
  onUnlockAdmin?: () => void;
}

export const BabyProfileModal: React.FC<BabyProfileModalProps> = ({
  isOpen,
  isNew,
  babyProfile,
  language,
  isAdminMode = false,
  onClose,
  onSave,
  onDelete,
  onUnlockAdmin,
}) => {
  const isLocked = !isNew && !isAdminMode;

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'baby' | 'parent' | 'photos' | 'address'>('baby');

  // Form states - Baby Info
  const [name, setName] = useState(babyProfile?.name ?? '');
  const [dateOfBirth, setDateOfBirth] = useState(babyProfile?.dateOfBirth ?? formatDateIso(new Date()));
  const [gender, setGender] = useState<'boy' | 'girl' | 'other'>(babyProfile?.gender ?? 'boy');
  const [childOrder, setChildOrder] = useState<number>(babyProfile?.childOrder ?? 1);
  const [hasBirthCertificate, setHasBirthCertificate] = useState<'yes' | 'no' | 'applied'>(babyProfile?.hasBirthCertificate ?? 'yes');
  const [birthRegistrationNumber, setBirthRegistrationNumber] = useState(babyProfile?.birthRegistrationNumber ?? '');
  const [birthWeightKg, setBirthWeightKg] = useState(babyProfile?.birthWeightKg ?? '');
  const [bloodGroup, setBloodGroup] = useState(babyProfile?.bloodGroup ?? '');
  const [photoUrl, setPhotoUrl] = useState(babyProfile?.photoUrl ?? '');

  // Form states - Mother Info & Documents
  const [motherName, setMotherName] = useState(babyProfile?.motherName ?? '');
  const [motherIdType, setMotherIdType] = useState<'nid' | 'birth_certificate'>(babyProfile?.motherIdType ?? babyProfile?.parentIdType ?? 'nid');
  const [motherIdNumber, setMotherIdNumber] = useState(babyProfile?.motherIdNumber ?? babyProfile?.parentIdNumber ?? '');
  const [motherIdFrontPhoto, setMotherIdFrontPhoto] = useState(babyProfile?.motherIdFrontPhoto ?? babyProfile?.parentIdFrontPhoto ?? '');
  const [motherIdBackPhoto, setMotherIdBackPhoto] = useState(babyProfile?.motherIdBackPhoto ?? babyProfile?.parentIdBackPhoto ?? '');

  // Form states - Father Info & Documents
  const [fatherName, setFatherName] = useState(babyProfile?.fatherName ?? '');
  const [fatherIdType, setFatherIdType] = useState<'nid' | 'birth_certificate'>(babyProfile?.fatherIdType ?? 'nid');
  const [fatherIdNumber, setFatherIdNumber] = useState(babyProfile?.fatherIdNumber ?? '');
  const [fatherIdFrontPhoto, setFatherIdFrontPhoto] = useState(babyProfile?.fatherIdFrontPhoto ?? '');
  const [fatherIdBackPhoto, setFatherIdBackPhoto] = useState(babyProfile?.fatherIdBackPhoto ?? '');

  // Form states - Health Assistant / Vaccinator Info
  const [healthAssistantName, setHealthAssistantName] = useState(babyProfile?.healthAssistantName ?? 'মোছাঃ নাজমুন নাহার');
  const [healthAssistantPhone, setHealthAssistantPhone] = useState(babyProfile?.healthAssistantPhone ?? '০১৭১২-৩৪৫৬৭৮');
  const [healthAssistantDesignation, setHealthAssistantDesignation] = useState(babyProfile?.healthAssistantDesignation ?? 'স্বাস্থ্য সহকারী (ইপিআই টিকাদানকারী)');

  // Active guardian sub-tab in Section 2
  const [activeParentSubTab, setActiveParentSubTab] = useState<'mother' | 'father'>('mother');

  // Form states - Passport & Photos
  const [passportPhotoUrl, setPassportPhotoUrl] = useState(babyProfile?.passportPhotoUrl ?? '');
  const [babyPassportNumber, setBabyPassportNumber] = useState(babyProfile?.babyPassportNumber ?? '');
  const [epiCardNumber, setEpiCardNumber] = useState(babyProfile?.epiCardNumber ?? '');
  const [hospitalOfBirth, setHospitalOfBirth] = useState(babyProfile?.hospitalOfBirth ?? '');

  // Form states - Address & Location Hierarchy
  const [division, setDivision] = useState(babyProfile?.division ?? 'ঢাকা');
  const [district, setDistrict] = useState(babyProfile?.district ?? 'ঢাকা');
  const [upazila, setUpazila] = useState(babyProfile?.upazila ?? 'ধানমন্ডি');
  const [unionPourashava, setUnionPourashava] = useState(babyProfile?.unionPourashava ?? 'ঢাকা দক্ষিণ সিটি কর্পোরেশন');
  const [village, setVillage] = useState(babyProfile?.village ?? '');
  const [ward, setWard] = useState(babyProfile?.ward ?? '');
  const [epiCenterName, setEpiCenterName] = useState(babyProfile?.epiCenterName ?? '');

  // Hidden file inputs
  const babyPhotoInputRef = useRef<HTMLInputElement>(null);
  const passportPhotoInputRef = useRef<HTMLInputElement>(null);
  const motherNidFrontInputRef = useRef<HTMLInputElement>(null);
  const motherNidBackInputRef = useRef<HTMLInputElement>(null);
  const fatherNidFrontInputRef = useRef<HTMLInputElement>(null);
  const fatherNidBackInputRef = useRef<HTMLInputElement>(null);

  // Sync state with babyProfile prop
  useEffect(() => {
    setName(babyProfile?.name ?? '');
    setDateOfBirth(babyProfile?.dateOfBirth ?? formatDateIso(new Date()));
    setGender(babyProfile?.gender ?? 'boy');
    setChildOrder(babyProfile?.childOrder ?? 1);
    setHasBirthCertificate(babyProfile?.hasBirthCertificate ?? 'yes');
    setBirthRegistrationNumber(babyProfile?.birthRegistrationNumber ?? '');
    setBirthWeightKg(babyProfile?.birthWeightKg ?? '');
    setBloodGroup(babyProfile?.bloodGroup ?? '');
    setPhotoUrl(babyProfile?.photoUrl ?? '');

    setMotherName(babyProfile?.motherName ?? '');
    setMotherIdType(babyProfile?.motherIdType ?? babyProfile?.parentIdType ?? 'nid');
    setMotherIdNumber(babyProfile?.motherIdNumber ?? babyProfile?.parentIdNumber ?? '');
    setMotherIdFrontPhoto(babyProfile?.motherIdFrontPhoto ?? babyProfile?.parentIdFrontPhoto ?? '');
    setMotherIdBackPhoto(babyProfile?.motherIdBackPhoto ?? babyProfile?.parentIdBackPhoto ?? '');

    setFatherName(babyProfile?.fatherName ?? '');
    setFatherIdType(babyProfile?.fatherIdType ?? 'nid');
    setFatherIdNumber(babyProfile?.fatherIdNumber ?? '');
    setFatherIdFrontPhoto(babyProfile?.fatherIdFrontPhoto ?? '');
    setFatherIdBackPhoto(babyProfile?.fatherIdBackPhoto ?? '');

    setHealthAssistantName(babyProfile?.healthAssistantName ?? 'মোছাঃ নাজমুন নাহার');
    setHealthAssistantPhone(babyProfile?.healthAssistantPhone ?? '০১৭১২-৩৪৫৬৭৮');
    setHealthAssistantDesignation(babyProfile?.healthAssistantDesignation ?? 'স্বাস্থ্য সহকারী (ইপিআই টিকাদানকারী)');

    setPassportPhotoUrl(babyProfile?.passportPhotoUrl ?? '');
    setBabyPassportNumber(babyProfile?.babyPassportNumber ?? '');
    setEpiCardNumber(babyProfile?.epiCardNumber ?? '');
    setHospitalOfBirth(babyProfile?.hospitalOfBirth ?? '');

    setDivision(babyProfile?.division ?? 'ঢাকা');
    setDistrict(babyProfile?.district ?? 'ঢাকা');
    setUpazila(babyProfile?.upazila ?? 'ধানমন্ডি');
    setUnionPourashava(babyProfile?.unionPourashava ?? 'ঢাকা দক্ষিণ সিটি কর্পোরেশন');
    setVillage(babyProfile?.village ?? '');
    setWard(babyProfile?.ward ?? '');
    setEpiCenterName(babyProfile?.epiCenterName ?? '');
  }, [babyProfile]);

  // Derived available districts and upazilas
  const currentDivisionObj = BANGLADESH_DIVISIONS.find(d => d.nameBn === division) || BANGLADESH_DIVISIONS[0];
  const availableDistricts = currentDivisionObj.districts;
  const currentDistrictObj = availableDistricts.find(d => d.nameBn === district) || availableDistricts[0];
  const availableUpazilas = currentDistrictObj ? currentDistrictObj.upazilas : [];

  // When division changes, auto-select first district & upazila
  const handleDivisionChange = (newDiv: string) => {
    setDivision(newDiv);
    const divObj = BANGLADESH_DIVISIONS.find(d => d.nameBn === newDiv) || BANGLADESH_DIVISIONS[0];
    const firstDist = divObj.districts[0];
    setDistrict(firstDist.nameBn);
    setUpazila(firstDist.upazilas[0] || '');
  };

  // When district changes, auto-select first upazila
  const handleDistrictChange = (newDist: string) => {
    setDistrict(newDist);
    const distObj = availableDistricts.find(d => d.nameBn === newDist);
    if (distObj && distObj.upazilas.length > 0) {
      setUpazila(distObj.upazilas[0]);
    }
  };

  // Quick Auto-fill Division Preset
  const handleApplyDivisionPreset = (presetKey: string) => {
    const preset = BANGLADESH_DIVISION_PRESETS[presetKey];
    if (!preset) return;
    setDivision(preset.division);
    setDistrict(preset.district);
    setUpazila(preset.upazila);
    setUnionPourashava(preset.unionPourashava);
    setVillage(preset.village);
    setWard(preset.ward);
    setEpiCenterName(preset.epiCenterName);
  };

  // Quick Auto-fill Random Bangladesh Address
  const handleAutoFillRandomBangladesh = () => {
    const keys = Object.keys(BANGLADESH_DIVISION_PRESETS);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    handleApplyDivisionPreset(randomKey);
  };

  // Quick Auto-fill Demo Address (uses current division or Dhaka)
  const handleAutoFillAddress = () => {
    const preset = getPresetForDivision(division);
    setDivision(preset.division);
    setDistrict(preset.district);
    setUpazila(preset.upazila);
    setUnionPourashava(preset.unionPourashava);
    setVillage(preset.village);
    setWard(preset.ward);
    setEpiCenterName(preset.epiCenterName);
  };

  // Quick Auto-fill Sample Documents & Numbers
  const handleAutoFillDemoDetails = () => {
    handleAutoFillAddress();
    if (!birthRegistrationNumber) {
      setBirthRegistrationNumber('20242692015004891');
    }
    if (!motherName) {
      setMotherName('সাদিয়া সুলতানা');
    }
    if (!motherIdNumber) {
      setMotherIdNumber('19922692015000123');
    }
    if (!fatherName) {
      setFatherName('রফিকুল ইসলাম');
    }
    if (!fatherIdNumber) {
      setFatherIdNumber('19892692015000789');
    }
    if (!healthAssistantName) {
      setHealthAssistantName('মোছাঃ নাজমুন নাহার');
    }
    if (!healthAssistantPhone) {
      setHealthAssistantPhone('০১৭১২-৩৪৫৬৭৮');
    }
    if (!birthWeightKg) {
      setBirthWeightKg('3.2');
    }
    if (!babyPassportNumber) {
      setBabyPassportNumber('BP-9821453');
    }
  };

  // Handle Image File Uploads
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (dataUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert(language === 'bn' ? 'ছবির সাইজ সর্বোচ্চ ৫ মেগাবাইট হতে হবে।' : 'Image size must be under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setter(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...babyProfile,
      name: isLocked ? babyProfile.name : (name.trim() || (language === 'bn' ? 'আমার সোনামণি' : 'My Baby')),
      dateOfBirth: isLocked ? babyProfile.dateOfBirth : dateOfBirth,
      gender,
      childOrder,
      hasBirthCertificate,
      birthRegistrationNumber: hasBirthCertificate === 'yes' ? birthRegistrationNumber.trim() : '',
      birthWeightKg: birthWeightKg.trim(),
      bloodGroup: bloodGroup.trim(),
      photoUrl,
      motherName: motherName.trim(),
      fatherName: fatherName.trim(),
      parentIdType: motherIdType,
      parentIdNumber: (motherIdNumber || fatherIdNumber).trim(),
      parentIdFrontPhoto: motherIdFrontPhoto || fatherIdFrontPhoto,
      parentIdBackPhoto: motherIdBackPhoto || fatherIdBackPhoto,
      motherIdType,
      motherIdNumber: motherIdNumber.trim(),
      motherIdFrontPhoto,
      motherIdBackPhoto,
      fatherIdType,
      fatherIdNumber: fatherIdNumber.trim(),
      fatherIdFrontPhoto,
      fatherIdBackPhoto,
      healthAssistantName: healthAssistantName.trim(),
      healthAssistantPhone: healthAssistantPhone.trim(),
      healthAssistantDesignation: healthAssistantDesignation.trim(),
      passportPhotoUrl,
      babyPassportNumber: babyPassportNumber.trim(),
      epiCardNumber: epiCardNumber.trim(),
      hospitalOfBirth: hospitalOfBirth.trim(),
      division,
      district,
      upazila,
      unionPourashava: unionPourashava.trim(),
      village: village.trim(),
      ward: ward.trim(),
      epiCenterName: epiCenterName.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div 
        className="bg-slate-50 rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh] my-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header Bar */}
        <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-teal-700 text-white flex items-center justify-center font-bold text-xl shadow-sm shrink-0">
              👶
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  {isNew 
                    ? (language === 'bn' ? 'নতুন শিশুর নিবন্ধন' : 'New Child Registration')
                    : (language === 'bn' ? 'শিশুর সম্পূর্ণ প্রোফাইল ও নথি' : 'Child Complete Profile & Records')}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
                  {language === 'bn' ? 'বাংলাদেশ ইপিআই' : 'Bangladesh EPI'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {language === 'bn' 
                  ? 'আপনার শিশুর তথ্য, পরিচয়পত্র এবং গুরুত্বপূর্ণ নথি আপলোড করুন' 
                  : 'Upload child information, identity documents, and verification files'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAutoFillDemoDetails}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl transition-all shadow-xs active:scale-95"
              title="নমুনা তথ্য ও ঠিকানা এক ক্লিকে পূর্ণ করুন"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{language === 'bn' ? '⚡ নমুনা ফিলআপ' : 'Quick Demo Fill'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stepper Navigation / Category Tabs */}
        <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between overflow-x-auto scrollbar-none gap-2 shrink-0">
          <div className="flex items-center gap-2 sm:gap-4 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('baby')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'baby'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                activeTab === 'baby' ? 'bg-white text-teal-900' : 'bg-slate-200 text-slate-700'
              }`}>1</span>
              <span>{language === 'bn' ? 'শিশুর তথ্য' : 'Baby Info'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('parent')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'parent'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                activeTab === 'parent' ? 'bg-white text-teal-900' : 'bg-slate-200 text-slate-700'
              }`}>2</span>
              <span>{language === 'bn' ? 'অভিভাবকের তথ্য ও NID' : 'Parent NID'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('photos')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'photos'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                activeTab === 'photos' ? 'bg-white text-teal-900' : 'bg-slate-200 text-slate-700'
              }`}>3</span>
              <span>{language === 'bn' ? 'পাসপোর্ট ও ছবি' : 'Passport & Photos'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('address')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'address'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                activeTab === 'address' ? 'bg-white text-teal-900' : 'bg-slate-200 text-slate-700'
              }`}>4</span>
              <span>{language === 'bn' ? 'ঠিকানা ও কেন্দ্র' : 'Address & Center'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleAutoFillAddress}
            className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 whitespace-nowrap px-2 py-1 rounded-lg hover:bg-teal-50"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'ঠিকানা অটো ফিলআপ' : 'Auto Fill Address'}</span>
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* SECTION 1: 👶 শিশুর তথ্য (Child Info) */}
              <div className={`bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5 transition-all ${
                activeTab === 'baby' ? 'ring-2 ring-teal-500/30' : ''
              }`}>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center text-base">
                      👶
                    </div>
                    <h4 className="text-base font-bold text-slate-900">
                      {language === 'bn' ? 'শিশুর তথ্য' : 'Child Information'}
                    </h4>
                  </div>
                  {isLocked && (
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg flex items-center gap-1">
                      <Lock className="w-3 h-3 text-amber-700" />
                      <span>{language === 'bn' ? 'নাম ও জন্মতারিখ সংরক্ষিত' : 'Name & DOB Locked'}</span>
                    </span>
                  )}
                </div>

                {/* Parent Lock Security Notice */}
                {isLocked ? (
                  <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-center justify-between gap-3 text-xs text-amber-950">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-amber-700 shrink-0" />
                      <p className="leading-tight">
                        <strong>{language === 'bn' ? 'সতর্কতা:' : 'Notice:'}</strong>{' '}
                        {language === 'bn'
                          ? 'ভ্যাকসিনের নির্ভুল শিডিউল নিশ্চিত করতে শিশুর নাম ও জন্মতারিখ শুধুমাত্র অ্যাডমিন পরিবর্তন করতে পারবেন।'
                          : 'Child name and birth date can only be changed by Admin/Health Officer.'}
                      </p>
                    </div>
                    {onUnlockAdmin && (
                      <button
                        type="button"
                        onClick={onUnlockAdmin}
                        className="px-2.5 py-1 text-[11px] font-bold text-teal-950 bg-amber-400 hover:bg-amber-300 rounded-lg whitespace-nowrap shadow-xs active:scale-95 shrink-0"
                      >
                        {language === 'bn' ? 'পিন আনলক' : 'Admin Unlock'}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="p-2.5 bg-teal-50 border border-teal-200 rounded-xl text-teal-950 text-xs flex items-center gap-2">
                    <Unlock className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                    <span className="font-semibold">
                      {language === 'bn' ? 'এডমিন মোড সক্রিয়: নাম ও জন্ম তারিখ সম্পাদনাযোগ্য।' : 'Admin Mode active: Name and DOB are editable.'}
                    </span>
                  </div>
                )}

                {/* Grid for Name, DOB and Baby Photo */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Name and DOB in 2 cols */}
                  <div className="md:col-span-2 space-y-4">
                    {/* Full Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        <span>{language === 'bn' ? 'শিশুর পূর্ণ নাম' : 'Child Full Name'}</span>
                        <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        disabled={isLocked}
                        readOnly={isLocked}
                        value={name ?? ''}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={language === 'bn' ? 'শিশুর নাম লিখুন' : 'Enter child full name'}
                        className={`w-full border rounded-xl px-3.5 py-2 text-sm focus:outline-none transition-all ${
                          isLocked 
                            ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed select-none font-semibold' 
                            : 'bg-white text-slate-800 border-slate-300 focus:ring-2 focus:ring-teal-600 focus:border-transparent'
                        }`}
                      />
                    </div>

                    {/* Date of Birth */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        <span>{language === 'bn' ? 'জন্মতারিখ' : 'Date of Birth'}</span>
                        <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        disabled={isLocked}
                        readOnly={isLocked}
                        value={dateOfBirth ?? ''}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        className={`w-full border rounded-xl px-3.5 py-2 text-sm font-semibold focus:outline-none transition-all ${
                          isLocked 
                            ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed select-none' 
                            : 'bg-white text-slate-800 border-slate-300 focus:ring-2 focus:ring-teal-600 focus:border-transparent'
                        }`}
                      />
                    </div>

                    {/* Gender Radio Options */}
                    <div className="space-y-1.5 pt-1">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        <span>{language === 'bn' ? 'লিঙ্গ' : 'Gender'}</span>
                        <span className="text-rose-500">*</span>
                      </label>
                      <div className="flex items-center gap-5">
                        <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                          <input
                            type="radio"
                            name="gender"
                            checked={gender === 'boy'}
                            onChange={() => setGender('boy')}
                            className="w-4 h-4 text-teal-600 focus:ring-teal-500 border-slate-300"
                          />
                          <span>{language === 'bn' ? 'ছেলে' : 'Boy'}</span>
                        </label>
                        <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                          <input
                            type="radio"
                            name="gender"
                            checked={gender === 'girl'}
                            onChange={() => setGender('girl')}
                            className="w-4 h-4 text-teal-600 focus:ring-teal-500 border-slate-300"
                          />
                          <span>{language === 'bn' ? 'মেয়ে' : 'Girl'}</span>
                        </label>
                        <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                          <input
                            type="radio"
                            name="gender"
                            checked={gender === 'other'}
                            onChange={() => setGender('other')}
                            className="w-4 h-4 text-teal-600 focus:ring-teal-500 border-slate-300"
                          />
                          <span>{language === 'bn' ? 'অন্যান্য' : 'Other'}</span>
                        </label>
                      </div>
                    </div>

                    {/* Child Order / কত নম্বর বেবি (1-10) */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        <span>{language === 'bn' ? 'কত নম্বর বেবি / কত তম সন্তান?' : 'Birth Order (Which child?)'}</span>
                        <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={childOrder}
                        onChange={(e) => setChildOrder(Number(e.target.value))}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all"
                      >
                        {[
                          { val: 1, bn: '১ম সন্তান (First Child)', en: '1st Child' },
                          { val: 2, bn: '২য় সন্তান (Second Child)', en: '2nd Child' },
                          { val: 3, bn: '৩য় সন্তান (Third Child)', en: '3rd Child' },
                          { val: 4, bn: '৪র্থ সন্তান (Fourth Child)', en: '4th Child' },
                          { val: 5, bn: '৫ম সন্তান (Fifth Child)', en: '5th Child' },
                          { val: 6, bn: '৬ষ্ঠ সন্তান (Sixth Child)', en: '6th Child' },
                          { val: 7, bn: '৭ম সন্তান (Seventh Child)', en: '7th Child' },
                          { val: 8, bn: '৮ম সন্তান (Eighth Child)', en: '8th Child' },
                          { val: 9, bn: '৯ম সন্তান (Ninth Child)', en: '9th Child' },
                          { val: 10, bn: '১০ম সন্তান (Tenth Child)', en: '10th Child' },
                        ].map((opt) => (
                          <option key={opt.val} value={opt.val}>
                            {language === 'bn' ? opt.bn : opt.en}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Baby Photo Upload Box (Matching Photo 2) */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>{language === 'bn' ? 'শিশুর ছবি (ঐচ্ছিক)' : 'Baby Photo (Optional)'}</span>
                      {photoUrl && (
                        <button
                          type="button"
                          onClick={() => setPhotoUrl('')}
                          className="text-rose-600 hover:text-rose-700 text-[10px] font-bold"
                        >
                          {language === 'bn' ? 'মুছুন' : 'Remove'}
                        </button>
                      )}
                    </label>

                    <div 
                      onClick={() => babyPhotoInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-2xl p-2.5 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-slate-50/70 hover:bg-teal-50/30 h-28 relative group"
                    >
                      {photoUrl ? (
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden shadow-xs border border-teal-200">
                          <img src={photoUrl} alt="Baby" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity">
                            {language === 'bn' ? 'পরিবর্তন' : 'Change'}
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                            <Camera className="w-4 h-4" />
                          </div>
                          <span className="text-[11px] font-bold text-teal-800">
                            {language === 'bn' ? 'ছবি আপলোড করুন' : 'Upload Photo'}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {language === 'bn' ? '(জেপিজি, পিএনজি)' : '(JPG, PNG)'}
                          </span>
                        </>
                      )}
                    </div>
                    <input 
                      ref={babyPhotoInputRef}
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => handleFileUpload(e, setPhotoUrl)}
                    />
                  </div>
                </div>

                {/* Birth Registration Question (3 options matching prompt & photo 2) */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <span>{language === 'bn' ? 'জন্মনিবন্ধন আছে কি?' : 'Has Birth Certificate?'}</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                    <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                      <input
                        type="radio"
                        name="hasBirthCertificate"
                        checked={hasBirthCertificate === 'yes'}
                        onChange={() => setHasBirthCertificate('yes')}
                        className="w-4 h-4 text-teal-600 focus:ring-teal-500 border-slate-300"
                      />
                      <span>{language === 'bn' ? 'আছে (Yes)' : 'Yes'}</span>
                    </label>
                    <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                      <input
                        type="radio"
                        name="hasBirthCertificate"
                        checked={hasBirthCertificate === 'no'}
                        onChange={() => setHasBirthCertificate('no')}
                        className="w-4 h-4 text-teal-600 focus:ring-teal-500 border-slate-300"
                      />
                      <span>{language === 'bn' ? 'নেই (No)' : 'No'}</span>
                    </label>
                    <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                      <input
                        type="radio"
                        name="hasBirthCertificate"
                        checked={hasBirthCertificate === 'applied'}
                        onChange={() => setHasBirthCertificate('applied')}
                        className="w-4 h-4 text-teal-600 focus:ring-teal-500 border-slate-300"
                      />
                      <span>{language === 'bn' ? 'আবেদন করা হয়েছে (Applied)' : 'Applied'}</span>
                    </label>
                  </div>
                </div>

                {/* Birth Registration Number & Birth Weight */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {hasBirthCertificate === 'yes' ? (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <span>{language === 'bn' ? 'জন্মনিবন্ধন নম্বর (১৭ ডিজিট)' : 'Birth Registration Number'}</span>
                          <span className="text-rose-500">*</span>
                        </span>
                        <span className="text-[10px] text-teal-700 font-bold">BRN</span>
                      </label>
                      <input
                        type="text"
                        maxLength={17}
                        value={birthRegistrationNumber ?? ''}
                        onChange={(e) => setBirthRegistrationNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder={language === 'bn' ? '১৭ ডিজিটের জন্মনিবন্ধন নম্বর লিখুন' : 'Enter 17 digit BRN'}
                        className="w-full bg-white border border-teal-300 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 font-mono tracking-wider"
                      />
                    </div>
                  ) : (
                    <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                      <Info className="w-4 h-4 text-slate-500 shrink-0" />
                      <span>
                        {hasBirthCertificate === 'applied' 
                          ? (language === 'bn' ? 'আবেদন নম্বর বা সনদ পাওয়ার পর নম্বর যুক্ত করতে পারবেন।' : 'You can enter BRN after issuance.') 
                          : (language === 'bn' ? 'জন্মনিবন্ধন ছাড়াও টিকা রেজিস্ট্রেশন চলবে।' : 'Vaccine schedule is active without BRN.')}
                      </span>
                    </div>
                  )}

                  {/* Birth Weight */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5 text-teal-600" />
                      <span>{language === 'bn' ? 'জন্মের সময়ের ওজন (ঐচ্ছিক)' : 'Birth Weight (Optional)'}</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={birthWeightKg ?? ''}
                        onChange={(e) => setBirthWeightKg(e.target.value)}
                        placeholder={language === 'bn' ? 'যেমন: ৩.২' : 'e.g. 3.2'}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 pr-12"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">
                        {language === 'bn' ? 'কেজি' : 'kg'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Blood Group */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-rose-500" />
                    <span>{language === 'bn' ? 'রক্তের গ্রুপ (ঐচ্ছিক)' : 'Blood Group (Optional)'}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                      <button
                        key={bg}
                        type="button"
                        onClick={() => setBloodGroup(bloodGroup === bg ? '' : bg)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          bloodGroup === bg
                            ? 'bg-rose-50 border-rose-500 text-rose-800 ring-2 ring-rose-200'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {bg}
                      </button>
                    ))}
                  </div>
                </div>
              </div>


              {/* SECTION 2: 💳 অভিভাবকের পরিচয়পত্র (মা ও বাবার NID / জন্মনিবন্ধন) */}
              <div className={`bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4 transition-all ${
                activeTab === 'parent' ? 'ring-2 ring-teal-500/30' : ''
              }`}>
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center text-base">
                      <CreditCard className="w-4 h-4 text-teal-700" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        {language === 'bn' ? 'অভিভাবকের পরিচয়পত্র (মা ও বাবার NID / জন্মনিবন্ধন)' : 'Parents ID (Mother & Father NID / BRN)'}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {language === 'bn' ? 'মা এবং বাবা উভয়ের জাতীয় পরিচয়পত্র নম্বর ও ফটো কপি' : 'National ID number and photos for both mother and father'}
                      </p>
                    </div>
                  </div>

                  {/* Mother / Father Switcher Buttons */}
                  <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setActiveParentSubTab('mother')}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        activeParentSubTab === 'mother'
                          ? 'bg-white text-teal-900 shadow-xs ring-1 ring-teal-600/30'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>👩</span>
                      <span>{language === 'bn' ? 'মায়ের তথ্য' : "Mother's ID"}</span>
                      {motherIdNumber && <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveParentSubTab('father')}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        activeParentSubTab === 'father'
                          ? 'bg-white text-blue-900 shadow-xs ring-1 ring-blue-600/30'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>👨</span>
                      <span>{language === 'bn' ? 'বাবার তথ্য' : "Father's ID"}</span>
                      {fatherIdNumber && <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />}
                    </button>
                  </div>
                </div>

                {/* MOTHER'S ID TAB */}
                {activeParentSubTab === 'mother' ? (
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                        {language === 'bn' ? 'মায়ের নাম ও পরিচয়পত্র নম্বর:' : "Mother's Name & ID Number:"}
                      </span>
                    </div>

                    {/* Mother Full Name */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                        <span>{language === 'bn' ? 'মায়ের পুরো নাম' : "Mother's Full Name"}</span>
                        <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={motherName ?? ''}
                        onChange={(e) => setMotherName(e.target.value)}
                        placeholder={language === 'bn' ? 'যেমন: সাদিয়া সুলতানা' : "Mother's Name"}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">
                          {language === 'bn' ? 'মায়ের পরিচয়পত্রের ধরন *' : 'Document Type *'}
                        </label>
                        <div className="flex items-center gap-4 pt-1">
                          <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-800">
                            <input
                              type="radio"
                              name="motherIdType"
                              checked={motherIdType === 'nid'}
                              onChange={() => setMotherIdType('nid')}
                              className="w-4 h-4 text-teal-600 focus:ring-teal-500 border-slate-300"
                            />
                            <span>{language === 'bn' ? 'জাতীয় পরিচয়পত্র (NID)' : 'National ID (NID)'}</span>
                          </label>
                          <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-800">
                            <input
                              type="radio"
                              name="motherIdType"
                              checked={motherIdType === 'birth_certificate'}
                              onChange={() => setMotherIdType('birth_certificate')}
                              className="w-4 h-4 text-teal-600 focus:ring-teal-500 border-slate-300"
                            />
                            <span>{language === 'bn' ? 'জন্মনিবন্ধন' : 'Birth Certificate'}</span>
                          </label>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                          <span>
                            {motherIdType === 'nid'
                              ? (language === 'bn' ? 'মায়ের NID নম্বর' : "Mother's NID")
                              : (language === 'bn' ? 'মায়ের জন্মনিবন্ধন নম্বর' : "Mother's BRN")}
                          </span>
                        </label>
                        <input
                          type="text"
                          value={motherIdNumber ?? ''}
                          onChange={(e) => setMotherIdNumber(e.target.value)}
                          placeholder={motherIdType === 'nid' ? 'যেমন: 19922692015000123' : '১৭ ডিজিট নম্বর'}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 font-mono"
                        />
                      </div>
                    </div>

                    {/* Mother Front & Back Photos - Compact Height */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-0.5">
                      {/* Mother Front Photo */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold text-slate-700">
                            {language === 'bn' ? 'মায়ের NID ছবি (সামনে)' : 'Front Photo'}
                          </label>
                          {motherIdFrontPhoto && (
                            <button
                              type="button"
                              onClick={() => setMotherIdFrontPhoto('')}
                              className="text-rose-600 hover:text-rose-700 text-[10px] font-bold"
                            >
                              {language === 'bn' ? 'মুছুন' : 'Remove'}
                            </button>
                          )}
                        </div>
                        <div 
                          onClick={() => motherNidFrontInputRef.current?.click()}
                          className="border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-2xl p-2 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-slate-50/70 hover:bg-teal-50/30 h-22 sm:h-24 relative group"
                        >
                          {motherIdFrontPhoto ? (
                            <div className="relative w-full h-18 rounded-xl overflow-hidden border border-teal-200">
                              <img src={motherIdFrontPhoto} alt="Mother NID Front" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity">
                                {language === 'bn' ? 'পরিবর্তন' : 'Change'}
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-0.5">
                                <Camera className="w-3.5 h-3.5" />
                              </div>
                              <span className="text-[11px] font-bold text-teal-800">
                                {language === 'bn' ? 'সামনের ছবি' : 'Front Photo'}
                              </span>
                              <span className="text-[9px] text-slate-400">
                                {language === 'bn' ? 'জেপিজি, পিএনজি' : 'JPG, PNG'}
                              </span>
                            </>
                          )}
                        </div>
                        <input 
                          ref={motherNidFrontInputRef}
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => handleFileUpload(e, setMotherIdFrontPhoto)}
                        />
                      </div>

                      {/* Mother Back Photo */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold text-slate-700">
                            {language === 'bn' ? 'মায়ের NID ছবি (পেছনে)' : 'Back Photo'}
                          </label>
                          {motherIdBackPhoto && (
                            <button
                              type="button"
                              onClick={() => setMotherIdBackPhoto('')}
                              className="text-rose-600 hover:text-rose-700 text-[10px] font-bold"
                            >
                              {language === 'bn' ? 'মুছুন' : 'Remove'}
                            </button>
                          )}
                        </div>
                        <div 
                          onClick={() => motherNidBackInputRef.current?.click()}
                          className="border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-2xl p-2 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-slate-50/70 hover:bg-teal-50/30 h-22 sm:h-24 relative group"
                        >
                          {motherIdBackPhoto ? (
                            <div className="relative w-full h-18 rounded-xl overflow-hidden border border-teal-200">
                              <img src={motherIdBackPhoto} alt="Mother NID Back" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity">
                                {language === 'bn' ? 'পরিবর্তন' : 'Change'}
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-0.5">
                                <Camera className="w-3.5 h-3.5" />
                              </div>
                              <span className="text-[11px] font-bold text-teal-800">
                                {language === 'bn' ? 'পেছনের ছবি' : 'Back Photo'}
                              </span>
                              <span className="text-[9px] text-slate-400">
                                {language === 'bn' ? 'জেপিজি, পিএনজি' : 'JPG, PNG'}
                              </span>
                            </>
                          )}
                        </div>
                        <input 
                          ref={motherNidBackInputRef}
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => handleFileUpload(e, setMotherIdBackPhoto)}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* FATHER'S ID TAB */
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                        {language === 'bn' ? 'বাবার নাম ও পরিচয়পত্র নম্বর:' : "Father's Name & ID Number:"}
                      </span>
                    </div>

                    {/* Father Full Name */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                        <span>{language === 'bn' ? 'বাবার পুরো নাম' : "Father's Full Name"}</span>
                        <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={fatherName ?? ''}
                        onChange={(e) => setFatherName(e.target.value)}
                        placeholder={language === 'bn' ? 'যেমন: রফিকুল ইসলাম' : "Father's Name"}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">
                          {language === 'bn' ? 'বাবার পরিচয়পত্রের ধরন *' : 'Document Type *'}
                        </label>
                        <div className="flex items-center gap-4 pt-1">
                          <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-800">
                            <input
                              type="radio"
                              name="fatherIdType"
                              checked={fatherIdType === 'nid'}
                              onChange={() => setFatherIdType('nid')}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                            />
                            <span>{language === 'bn' ? 'জাতীয় পরিচয়পত্র (NID)' : 'National ID (NID)'}</span>
                          </label>
                          <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-800">
                            <input
                              type="radio"
                              name="fatherIdType"
                              checked={fatherIdType === 'birth_certificate'}
                              onChange={() => setFatherIdType('birth_certificate')}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                            />
                            <span>{language === 'bn' ? 'জন্মনিবন্ধন' : 'Birth Certificate'}</span>
                          </label>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                          <span>
                            {fatherIdType === 'nid'
                              ? (language === 'bn' ? 'বাবার NID নম্বর' : "Father's NID")
                              : (language === 'bn' ? 'বাবার জন্মনিবন্ধন নম্বর' : "Father's BRN")}
                          </span>
                        </label>
                        <input
                          type="text"
                          value={fatherIdNumber ?? ''}
                          onChange={(e) => setFatherIdNumber(e.target.value)}
                          placeholder={fatherIdType === 'nid' ? 'যেমন: 19892692015000789' : '১৭ ডিজিট নম্বর'}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                        />
                      </div>
                    </div>

                    {/* Father Front & Back Photos - Compact Height */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-0.5">
                      {/* Father Front Photo */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold text-slate-700">
                            {language === 'bn' ? 'বাবার NID ছবি (সামনে)' : 'Front Photo'}
                          </label>
                          {fatherIdFrontPhoto && (
                            <button
                              type="button"
                              onClick={() => setFatherIdFrontPhoto('')}
                              className="text-rose-600 hover:text-rose-700 text-[10px] font-bold"
                            >
                              {language === 'bn' ? 'মুছুন' : 'Remove'}
                            </button>
                          )}
                        </div>
                        <div 
                          onClick={() => fatherNidFrontInputRef.current?.click()}
                          className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-2 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-slate-50/70 hover:bg-blue-50/30 h-22 sm:h-24 relative group"
                        >
                          {fatherIdFrontPhoto ? (
                            <div className="relative w-full h-18 rounded-xl overflow-hidden border border-blue-200">
                              <img src={fatherIdFrontPhoto} alt="Father NID Front" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity">
                                {language === 'bn' ? 'পরিবর্তন' : 'Change'}
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-0.5">
                                <Camera className="w-3.5 h-3.5" />
                              </div>
                              <span className="text-[11px] font-bold text-blue-800">
                                {language === 'bn' ? 'সামনের ছবি' : 'Front Photo'}
                              </span>
                              <span className="text-[9px] text-slate-400">
                                {language === 'bn' ? 'জেপিজি, পিএনজি' : 'JPG, PNG'}
                              </span>
                            </>
                          )}
                        </div>
                        <input 
                          ref={fatherNidFrontInputRef}
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => handleFileUpload(e, setFatherIdFrontPhoto)}
                        />
                      </div>

                      {/* Father Back Photo */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold text-slate-700">
                            {language === 'bn' ? 'বাবার NID ছবি (পেছনে)' : 'Back Photo'}
                          </label>
                          {fatherIdBackPhoto && (
                            <button
                              type="button"
                              onClick={() => setFatherIdBackPhoto('')}
                              className="text-rose-600 hover:text-rose-700 text-[10px] font-bold"
                            >
                              {language === 'bn' ? 'মুছুন' : 'Remove'}
                            </button>
                          )}
                        </div>
                        <div 
                          onClick={() => fatherNidBackInputRef.current?.click()}
                          className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-2 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-slate-50/70 hover:bg-blue-50/30 h-22 sm:h-24 relative group"
                        >
                          {fatherIdBackPhoto ? (
                            <div className="relative w-full h-18 rounded-xl overflow-hidden border border-blue-200">
                              <img src={fatherIdBackPhoto} alt="Father NID Back" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity">
                                {language === 'bn' ? 'পরিবর্তন' : 'Change'}
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-0.5">
                                <Camera className="w-3.5 h-3.5" />
                              </div>
                              <span className="text-[11px] font-bold text-blue-800">
                                {language === 'bn' ? 'পেছনের ছবি' : 'Back Photo'}
                              </span>
                              <span className="text-[9px] text-slate-400">
                                {language === 'bn' ? 'জেপিজি, পিএনজি' : 'JPG, PNG'}
                              </span>
                            </>
                          )}
                        </div>
                        <input 
                          ref={fatherNidBackInputRef}
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => handleFileUpload(e, setFatherIdBackPhoto)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>


              {/* SECTION 3: 🪪 পাসপোর্টের ছবি ও শিশুর পাসপোর্ট (Passport & Photos) */}
              <div className={`bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4 transition-all ${
                activeTab === 'photos' ? 'ring-2 ring-teal-500/30' : ''
              }`}>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center text-base">
                      🪪
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        {language === 'bn' ? 'পাসপোর্টের ছবি ও শিশুর পাসপোর্ট (ঐচ্ছিক)' : 'Passport Photo & Passport No.'}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {language === 'bn' ? 'শিশুর অফিশিয়াল পাসপোর্টের ছবি ও পাসপোর্ট নম্বর' : 'Child passport photo & international travel doc'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                  {/* Passport Photo Upload - Compact Height */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700">
                        {language === 'bn' ? 'পাসপোর্টের ছবি' : 'Passport Photo'}
                      </label>
                      {passportPhotoUrl && (
                        <button
                          type="button"
                          onClick={() => setPassportPhotoUrl('')}
                          className="text-rose-600 hover:text-rose-700 text-[10px] font-bold"
                        >
                          {language === 'bn' ? 'মুছুন' : 'Remove'}
                        </button>
                      )}
                    </div>

                    <div 
                      onClick={() => passportPhotoInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-2xl p-2.5 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-slate-50/70 hover:bg-teal-50/30 h-28 relative group"
                    >
                      {passportPhotoUrl ? (
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-teal-200 shadow-xs">
                          <img src={passportPhotoUrl} alt="Passport Photo" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity">
                            {language === 'bn' ? 'পরিবর্তন' : 'Change'}
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-1">
                            <Camera className="w-4 h-4" />
                          </div>
                          <span className="text-[11px] font-bold text-teal-800">
                            {language === 'bn' ? 'পাসপোর্টের ছবি আপলোড' : 'Upload Passport Photo'}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {language === 'bn' ? 'সাইজ: ৩.৫ x ৪.৫ সেমি' : 'Size: 3.5 x 4.5 cm'}
                          </span>
                        </>
                      )}
                    </div>
                    <input 
                      ref={passportPhotoInputRef}
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => handleFileUpload(e, setPassportPhotoUrl)}
                    />
                  </div>

                  {/* Passport Number & Hospital / EPI Info */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-teal-600" />
                        <span>{language === 'bn' ? 'শিশুর পাসপোর্ট নম্বর (যদি থাকে)' : 'Child Passport No. (Optional)'}</span>
                      </label>
                      <input
                        type="text"
                        value={babyPassportNumber ?? ''}
                        onChange={(e) => setBabyPassportNumber(e.target.value)}
                        placeholder="e.g. BP-8921471"
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 font-mono uppercase"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Hash className="w-3.5 h-3.5 text-teal-600" />
                        <span>{language === 'bn' ? 'ইপিআই কার্ড নম্বর (ঐচ্ছিক)' : 'EPI Card No. (Optional)'}</span>
                      </label>
                      <input
                        type="text"
                        value={epiCardNumber ?? ''}
                        onChange={(e) => setEpiCardNumber(e.target.value)}
                        placeholder="e.g. EPI-2026-9812"
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-teal-600" />
                        <span>{language === 'bn' ? 'জন্মস্থান / ক্লিনিক' : 'Birth Hospital / Clinic'}</span>
                      </label>
                      <input
                        type="text"
                        value={hospitalOfBirth ?? ''}
                        onChange={(e) => setHospitalOfBirth(e.target.value)}
                        placeholder={language === 'bn' ? 'যেমন: ঢাকা মেডিকেল কলেজ' : 'e.g. Dhaka Medical College'}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
                      />
                    </div>
                  </div>
                </div>
              </div>


              {/* SECTION 4: 📍 ঠিকানা ও লোকেশন নির্বাচন (বিভাগ, জেলা, উপজেলা, ইউনিয়ন, গ্রাম, ওয়ার্ড) */}
              <div className={`bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5 transition-all ${
                activeTab === 'address' ? 'ring-2 ring-teal-500/30' : ''
              }`}>
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center text-base">
                      <MapPin className="w-4 h-4 text-teal-700" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        {language === 'bn' ? 'ঠিকানা ও কেন্দ্র নির্বাচন (অটো ফিলআপ সহ)' : 'Address & Center (With Auto-Fill)'}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {language === 'bn' 
                          ? 'বিভাগ, জেলা, উপজেলা, ইউনিয়ন/পৌরসভা, গ্রাম ও ওয়ার্ড নির্বাচন করুন' 
                          : 'Select Division, District, Upazila, Union/Municipality, Village & Ward'}
                      </p>
                    </div>
                  </div>

                  {/* Auto-fill trigger button */}
                  <button
                    type="button"
                    onClick={handleAutoFillAddress}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-teal-900 bg-amber-400 hover:bg-amber-300 active:scale-95 transition-all rounded-xl shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? '⚡ স্বয়ংক্রিয় ঠিকানা ফিলআপ' : 'Auto Fill Address'}</span>
                  </button>
                </div>

                {/* 8-Division Quick Auto-fill Options across Bangladesh */}
                <div className="p-3.5 bg-teal-50/70 rounded-2xl border border-teal-100 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-teal-950 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>{language === 'bn' ? 'বাংলাদেশের বিভাগ অনুযায়ী ১-ক্লিকে ঠিকানা ও কেন্দ্র ফিলআপ:' : '1-Click Auto Fill by Bangladesh Division:'}</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleAutoFillRandomBangladesh}
                      className="text-[11px] font-bold text-teal-800 hover:text-teal-950 underline flex items-center gap-1"
                    >
                      <span>{language === 'bn' ? '🎲 যেকোনো জেলা ও কেন্দ্র' : '🎲 Random District'}</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {BANGLADESH_DIVISIONS.map((d) => {
                      const isCurrent = division === d.nameBn;
                      return (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => handleApplyDivisionPreset(d.id)}
                          className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all active:scale-95 ${
                            isCurrent
                              ? 'bg-teal-700 text-white shadow-xs'
                              : 'bg-white hover:bg-teal-100 text-teal-900 border border-teal-200 shadow-2xs'
                          }`}
                        >
                          ⚡ {d.nameBn}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Division, District, Upazila Cascade */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Division (বিভাগ) */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <span>{language === 'bn' ? 'বিভাগ (Division)' : 'Division'}</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={division}
                      onChange={(e) => handleDivisionChange(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600"
                    >
                      {BANGLADESH_DIVISIONS.map((d) => (
                        <option key={d.id} value={d.nameBn}>
                          {language === 'bn' ? d.nameBn : d.nameEn}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* District (জেলা) */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <span>{language === 'bn' ? 'জেলা (District)' : 'District'}</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={district}
                      onChange={(e) => handleDistrictChange(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600"
                    >
                      {availableDistricts.map((dst) => (
                        <option key={dst.id} value={dst.nameBn}>
                          {language === 'bn' ? dst.nameBn : dst.nameEn}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Upazila / Thana (উপজেলা / থানা) */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <span>{language === 'bn' ? 'উপজেলা / থানা' : 'Upazila / Thana'}</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={upazila}
                      onChange={(e) => setUpazila(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600"
                    >
                      {availableUpazilas.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Union/Pourashava, Village, Ward No */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Union / Pourashava / City Corp */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <span>{language === 'bn' ? 'ইউনিয়ন / পৌরসভা' : 'Union / Municipality'}</span>
                    </label>
                    <input
                      type="text"
                      value={unionPourashava ?? ''}
                      onChange={(e) => setUnionPourashava(e.target.value)}
                      placeholder={language === 'bn' ? 'ইউনিয়ন / পৌরসভার নাম' : 'Union or Pourashava'}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>

                  {/* Village / Area / Road */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <span>{language === 'bn' ? 'গ্রাম / মহল্লা / রাস্তা' : 'Village / Area / Road'}</span>
                    </label>
                    <input
                      type="text"
                      value={village ?? ''}
                      onChange={(e) => setVillage(e.target.value)}
                      placeholder={language === 'bn' ? 'গ্রাম বা বাসার নম্বর' : 'Village or street address'}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>

                  {/* Ward No */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <span>{language === 'bn' ? 'ওয়ার্ড নম্বর' : 'Ward No.'}</span>
                    </label>
                    <input
                      type="text"
                      value={ward ?? ''}
                      onChange={(e) => setWard(e.target.value)}
                      placeholder={language === 'bn' ? 'যেমন: ১৫ / ০৩' : 'e.g. 15'}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>
                </div>

                {/* EPI Vaccination Center Name */}
                <div className="space-y-1 pt-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-teal-600" />
                    <span>{language === 'bn' ? 'নিকটস্থ ইপিআই টিকাদান কেন্দ্র (Center)' : 'Nearest EPI Vaccination Center'}</span>
                  </label>
                  <input
                    type="text"
                    value={epiCenterName ?? ''}
                    onChange={(e) => setEpiCenterName(e.target.value)}
                    placeholder={language === 'bn' ? 'যেমন: ধানমন্ডি মা ও শিশু কল্যাণ কেন্দ্র / ইপিআই ক্যাম্প' : 'e.g. Upazila Health Complex / EPI Clinic'}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                {/* Health Assistant Info (For Digital Card Bottom) */}
                <div className="pt-3 border-t border-slate-100 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
                      <span>🩺</span>
                      <span>{language === 'bn' ? 'দায়িত্বপ্রাপ্ত স্বাস্থ্য সহকারী / টিকাদানকারী (ডিজিটাল কার্ডের জন্য):' : 'Assigned Health Assistant / Vaccinator:'}</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">
                        {language === 'bn' ? 'স্বাস্থ্য সহকারীর নাম' : 'Health Assistant Name'}
                      </label>
                      <input
                        type="text"
                        value={healthAssistantName ?? ''}
                        onChange={(e) => setHealthAssistantName(e.target.value)}
                        placeholder={language === 'bn' ? 'যেমন: মোছাঃ নাজমুন নাহার' : 'Health Assistant Name'}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">
                        {language === 'bn' ? 'স্বাস্থ্য সহকারীর মোবাইল নম্বর' : 'Phone Number'}
                      </label>
                      <input
                        type="tel"
                        value={healthAssistantPhone ?? ''}
                        onChange={(e) => setHealthAssistantPhone(e.target.value)}
                        placeholder={language === 'bn' ? 'যেমন: ০১৭১২-৩৪৫৬৭৮' : '017XXXXXXXX'}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* তথ্য নিরাপত্তা (Data Privacy Notice) - Placed at the very bottom as requested */}
              <div className="bg-slate-100 rounded-2xl p-4 border border-slate-200 text-slate-700 flex items-start gap-3 text-xs leading-relaxed">
                <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4 text-teal-700" />
                </div>
                <div>
                  <h6 className="font-bold text-slate-900 text-xs mb-0.5 flex items-center gap-1.5">
                    <span>{language === 'bn' ? 'তথ্য নিরাপত্তা' : 'Data Privacy'}</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-teal-200/60 text-teal-900 rounded font-semibold">এনক্রিপ্টেড</span>
                  </h6>
                  <p className="text-slate-600">
                    {language === 'bn' 
                      ? 'আপনার ব্যক্তিগত ও শিশুর তথ্য নিরাপদে সংরক্ষিত থাকবে। শুধুমাত্র অনুমোদিত স্বাস্থ্যকর্মী ও পিতা-মাতা এই তথ্য এক্সেস করতে পারেন।' 
                      : 'All child and family data is secured and encrypted. Only authorized personnel and parents have access.'}
                  </p>
                </div>
              </div>

          {/* Footer Actions */}
          <div className="mt-6 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            {!isNew && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm(language === 'bn' ? 'আপনি কি নিশ্চিতভাবে এই প্রোফাইল মুছে ফেলতে চান?' : 'Are you sure you want to delete this profile?')) {
                    onDelete(babyProfile.id);
                    onClose();
                  }
                }}
                className="text-xs font-semibold text-rose-700 hover:text-rose-800 hover:bg-rose-50 px-3 py-2 rounded-xl transition-colors"
              >
                {language === 'bn' ? 'প্রোফাইল মুছুন' : 'Delete Profile'}
              </button>
            ) : <div />}

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 active:scale-95 rounded-xl shadow-md transition-all"
              >
                <Check className="w-4 h-4" />
                <span>{language === 'bn' ? 'প্রোফাইল সংরক্ষণ করুন' : 'Save Profile'}</span>
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
