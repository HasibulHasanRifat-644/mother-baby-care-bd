import React from 'react';
import { Calendar, User, Edit3, Plus, ShieldCheck, HeartHandshake, Baby, Download, Sparkles, Lock, Unlock, Users, PhoneCall } from 'lucide-react';
import { BabyProfile, Language } from '../types/vaccine';
import { calculateAge, formatFriendlyDate, toBengaliNumerals } from '../utils/dateCalculations';
import { HeroSliderCard } from './HeroSlider/HeroSliderCard';
import { ParentUser } from '../types/auth';

interface HeroBannerProps {
  currentBaby: BabyProfile;
  allBabies: BabyProfile[];
  language: Language;
  isAdminMode?: boolean;
  currentUser?: ParentUser | null;
  onSelectBaby: (babyId: string) => void;
  onEditBaby: () => void;
  onAddNewBaby: () => void;
  onDobChange: (newDob: string) => void;
  onOpenCardModal?: () => void;
  onOpenAdminPinModal?: () => void;
  onOpenHealthAssistantModal?: () => void;
  onOpenAllRegistrationsModal?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  currentBaby,
  allBabies,
  language,
  isAdminMode = false,
  currentUser,
  onSelectBaby,
  onEditBaby,
  onAddNewBaby,
  onDobChange,
  onOpenCardModal,
  onOpenAdminPinModal,
  onOpenHealthAssistantModal,
  onOpenAllRegistrationsModal,
}) => {
  const ageDisplay = calculateAge(currentBaby.dateOfBirth, language);

  return (
    <section className="relative overflow-hidden bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        
        {/* Super Admin Executive Dashboard Banner (Exclusive to Super Admin) */}
        {currentUser?.userRole === 'super_admin' && (
          <div className="mb-6 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200 border-2 border-amber-400 shadow-lg text-amber-950">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-slate-950 text-amber-300 flex items-center justify-center font-black text-2xl shadow-md shrink-0">
                  👑
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-slate-950 text-amber-300 uppercase tracking-wider">
                      {language === 'bn' ? '🛡️ সুপার এডমিন কনসোল' : 'Super Admin Console'}
                    </span>
                    <span className="text-xs font-bold text-amber-950">
                      {currentUser.fullName} · আইডি: <span className="font-mono">{currentUser.loginId || 'admin'}</span>
                    </span>
                  </div>
                  <h1 className="text-lg sm:text-xl font-extrabold text-slate-950 mt-1">
                    {language === 'bn' ? 'জাতীয় ইপিআই টিকাদান কেন্দ্রীয় প্রশাসনিক ড্যাশবোর্ড' : 'National EPI Central Administration Dashboard'}
                  </h1>
                  <p className="text-xs text-amber-950 font-semibold mt-0.5">
                    {language === 'bn' 
                      ? `মোট ${toBengaliNumerals(allBabies.length)} জন নিবন্ধিত শিশু এবং সকল অভিভাবক ও স্বাস্থ্য সহকারীর তথ্য পরিবর্তন ও নজরদারি করুন।`
                      : `Managing ${allBabies.length} registered babies, parents, and healthcare personnel.`}
                  </p>
                </div>
              </div>

              {/* High-Visibility "সব রেজিস্ট্রেশন" (All Registrations) Button */}
              {onOpenAllRegistrationsModal && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={onOpenAllRegistrationsModal}
                    className="w-full sm:w-auto px-5 py-3 bg-slate-950 hover:bg-slate-900 text-amber-300 hover:text-amber-200 font-black text-sm rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2.5 border-2 border-amber-400 cursor-pointer"
                  >
                    <Users className="w-5 h-5 text-amber-400 shrink-0" />
                    <span>{language === 'bn' ? '📋 সব রেজিস্ট্রেশন (শিশু, অভিভাবক ও সহকারী)' : 'All Registrations & Records'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          
          {/* Left Column: Baby Name as Main Heading & Side-by-Side Vital Information */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Top Bar: EPI Status Tag & Multi-Child Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 tracking-wide">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="bg-teal-50 text-teal-900 border border-teal-200/80 px-2.5 py-0.5 rounded-full font-bold">
                  {language === 'bn' ? 'বাংলাদেশ ইপিআই তালিকাভুক্ত শিশু' : 'Bangladesh EPI Enrolled'}
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="text-slate-600 font-medium">{language === 'bn' ? 'জন্ম থেকে ১৫ মাস' : 'Birth to 15 Months'}</span>
              </div>

              {/* Multiple Children Switcher */}
              {allBabies.length > 1 && (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                    {language === 'bn' ? 'বাচ্চা নির্বাচন:' : 'Child:'}
                  </span>
                  {allBabies.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => onSelectBaby(b.id)}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                        b.id === currentBaby.id
                          ? 'bg-teal-700 text-white shadow-xs ring-2 ring-teal-600/30'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {b.name || (language === 'bn' ? 'শিশু' : 'Baby')}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={onAddNewBaby}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold text-teal-700 hover:text-teal-800 bg-teal-50 border border-teal-200 rounded-lg whitespace-nowrap"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{language === 'bn' ? 'নতুন যোগ' : 'Add'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* MAIN CARD: Baby Name Header with Vital Info Beside It (পাশে তথ্য) */}
            <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-900 rounded-3xl p-5 sm:p-6 text-white shadow-lg border border-teal-700/50">
              
              {/* Header: Baby Avatar, Name, Edit Profile Button & Download Card Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-teal-700/50">
                <div className="flex items-center gap-3.5">
                  <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-3xl sm:text-4xl shadow-inner shrink-0 overflow-hidden">
                    {currentBaby.photoUrl ? (
                      <img src={currentBaby.photoUrl} alt={currentBaby.name} className="w-full h-full object-cover" />
                    ) : (
                      currentBaby.gender === 'girl' ? '👧' : '👶'
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-teal-200 text-xs font-bold uppercase tracking-wider mb-0.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>{language === 'bn' ? 'শিশুর পরিচিতি ও প্রোফাইল' : 'Child Health Profile'}</span>
                    </div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white drop-shadow-xs">
                        {currentBaby.name || (language === 'bn' ? 'নাম নির্ধারণ করুন' : 'Unnamed Baby')}
                      </h1>
                      <button
                        type="button"
                        onClick={onEditBaby}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-teal-950 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-xl shadow-sm transition-all"
                        title={language === 'bn' ? 'শিশুর সম্পূর্ণ প্রোফাইল ও তথ্য দেখুন' : 'View Child Profile & Details'}
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>{language === 'bn' ? 'প্রোফাইল' : 'Profile'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Instant Card Download Button */}
                {onOpenCardModal && (
                  <button
                    type="button"
                    onClick={onOpenCardModal}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-white text-teal-950 hover:bg-amber-300 font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 shrink-0 whitespace-nowrap"
                  >
                    <Download className="w-4 h-4 text-teal-700" />
                    <span>{language === 'bn' ? '📥 ডিজিটাল কার্ড ডাউনলোড' : 'Download Card'}</span>
                  </button>
                )}
              </div>

              {/* PAASE TOTTHO: Side-by-Side Vital Information Grid (পাশে শিশুর তথ্য) */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 text-slate-900">
                
                {/* 1. Age */}
                <div className="bg-white rounded-2xl p-2.5 sm:p-3 shadow-xs border border-white/60">
                  <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">
                    {language === 'bn' ? 'বর্তমান বয়স' : 'Current Age'}
                  </span>
                  <p className="text-xs sm:text-sm font-black text-teal-950 mt-0.5 truncate">
                    {ageDisplay || (language === 'bn' ? 'হিসাবকৃত' : 'Calculated')}
                  </p>
                </div>

                {/* 2. Date of Birth */}
                <div className="bg-white rounded-2xl p-2.5 sm:p-3 shadow-xs border border-white/60">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    {language === 'bn' ? 'জন্ম তারিখ' : 'Date of Birth'}
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 truncate">
                    {formatFriendlyDate(currentBaby.dateOfBirth, language)}
                  </p>
                </div>

                {/* 3. Gender & Child Order */}
                <div className="bg-white rounded-2xl p-2.5 sm:p-3 shadow-xs border border-white/60">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    {language === 'bn' ? 'লিঙ্গ ও সন্তান ক্রম' : 'Gender & Order'}
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 truncate">
                    {currentBaby.gender === 'boy' 
                      ? (language === 'bn' ? '👦 ছেলে' : 'Boy')
                      : currentBaby.gender === 'girl' 
                        ? (language === 'bn' ? '👧 মেয়ে' : 'Girl') 
                        : (language === 'bn' ? '👶 অন্যান্য' : 'Other')}
                    {currentBaby.childOrder ? ` (${['১ম', '২য়', '৩য়', '৪র্থ', '৫ম', '৬ষ্ঠ', '৭ম', '৮ম', '৯ম', '১০ম'][currentBaby.childOrder - 1] || `${currentBaby.childOrder}ম`})` : ''}
                  </p>
                </div>

                {/* 4. Blood Group */}
                <div className="bg-white rounded-2xl p-2.5 sm:p-3 shadow-xs border border-white/60">
                  <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block">
                    {language === 'bn' ? 'রক্তের গ্রুপ' : 'Blood Group'}
                  </span>
                  <p className="text-xs sm:text-sm font-black text-rose-700 mt-0.5">
                    {currentBaby.bloodGroup || (language === 'bn' ? 'নির্ধারণ করা নেই' : 'N/A')}
                  </p>
                </div>

                {/* 5. EPI Card Number */}
                <div className="bg-white rounded-2xl p-2.5 sm:p-3 shadow-xs border border-white/60">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    {language === 'bn' ? 'ইপিআই কার্ড নং' : 'EPI Card No'}
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 font-mono truncate">
                    {currentBaby.epiCardNumber 
                      ? (language === 'bn' ? toBengaliNumerals(currentBaby.epiCardNumber) : currentBaby.epiCardNumber) 
                      : (language === 'bn' ? 'নিবন্ধিত' : 'Registered')}
                  </p>
                </div>

                {/* 6. Birth Weight */}
                <div className="bg-white rounded-2xl p-2.5 sm:p-3 shadow-xs border border-white/60">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    {language === 'bn' ? 'জন্মের ওজন' : 'Birth Weight'}
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
                    {currentBaby.birthWeightKg 
                      ? (language === 'bn' ? `${toBengaliNumerals(currentBaby.birthWeightKg)} কেজি` : `${currentBaby.birthWeightKg} kg`) 
                      : (language === 'bn' ? '৩.২ কেজি' : '3.2 kg')}
                  </p>
                </div>

                {/* 7. Birth Hospital */}
                <div className="bg-white rounded-2xl p-2.5 sm:p-3 shadow-xs border border-white/60">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    {language === 'bn' ? 'জন্মস্থান / হাসপাতাল' : 'Birth Place'}
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 truncate">
                    {currentBaby.hospitalOfBirth || (language === 'bn' ? 'ঢাকা মেডিকেল কলেজ হাসপাতাল' : 'Health Center')}
                  </p>
                </div>

                {/* 8. Designated Health Assistant Interactive Card */}
                <div 
                  onClick={onOpenHealthAssistantModal}
                  className="bg-teal-50/90 hover:bg-teal-100 rounded-2xl p-2.5 sm:p-3 shadow-xs border border-teal-200 transition-all cursor-pointer group"
                  title={language === 'bn' ? 'স্বাস্থ্য সহকারীর নাম, ফোন নম্বর ও কেন্দ্র দেখতে ক্লিক করুন' : 'Click to view health assistant details and call'}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block">
                      {language === 'bn' ? '🩺 স্বাস্থ্য সহকারী' : 'Health Assistant'}
                    </span>
                    <span className="text-[10px] text-teal-700 font-bold group-hover:underline flex items-center gap-1">
                      <PhoneCall className="w-2.5 h-2.5" />
                      <span>{language === 'bn' ? 'যোগাযোগ' : 'Contact'}</span>
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-teal-950 mt-0.5 truncate">
                    {currentBaby.healthAssistantName || (language === 'bn' ? 'মোছাঃ নাজমুন নাহার' : 'Health Worker')}
                  </p>
                  <p className="text-[10px] text-teal-800 font-mono font-bold mt-0.5">
                    {currentBaby.healthAssistantPhone || '০১৭১২-৩৪৫৬৭৮'}
                  </p>
                </div>

              </div>
            </div>

            {/* Quick Interactive DOB Bar (Role-Based: Locked for Parents, Editable for Admin) */}
            {isAdminMode ? (
              <div className="bg-amber-50/80 border border-amber-300 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-700 shrink-0" />
                  <span className="font-bold text-amber-950">
                    {language === 'bn' ? '🩺 এডমিন মোড — শিশুর জন্ম তারিখ পরিবর্তন করুন:' : 'Admin Mode — Adjust Child Date of Birth:'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={currentBaby?.dateOfBirth ?? ''}
                    onChange={(e) => onDobChange(e.target.value)}
                    className="bg-white border border-amber-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={onAddNewBaby}
                    className="px-2.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold flex items-center gap-1 transition-colors whitespace-nowrap shadow-xs active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'নতুন শিশু যোগ' : 'Add Child'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-teal-700 shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">
                        {language === 'bn' ? 'নিবন্ধিত জন্ম তারিখ:' : 'Registered Date of Birth:'}
                      </span>
                      <span className="font-extrabold text-teal-900 text-sm">
                        {formatFriendlyDate(currentBaby.dateOfBirth, language)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {language === 'bn'
                        ? '🔒 নিরাপত্তার স্বার্থে অভিভাবক সরাসরি তথ্য পরিবর্তন করতে পারবেন না। সংশোধনের জন্য স্বাস্থ্য সহকারীর সাথে যোগাযোগ করুন।'
                        : '🔒 Protected: Child birth date and records can only be updated by authorized personnel.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Crucial Bangladesh EPI Advisory & Reassurance */}
            <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 text-xs sm:text-sm text-amber-950 space-y-2">
              <div className="flex items-start gap-2.5">
                <HeartHandshake className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1 leading-relaxed">
                  <p className="font-semibold text-amber-900">
                    {language === 'bn' ? 'অভিভাবকদের জন্য বিশেষ বার্তা:' : 'Important Parent Advisory:'}
                  </p>
                  <p className="text-amber-900/90 text-xs">
                    {language === 'bn' 
                      ? 'এই app শুধু reminder-এর জন্য, ডাক্তারের পরামর্শের বিকল্প নয়। Schedule: Bangladesh EPI (সূত্র: জাগো নিউজ, ১ এপ্রিল ২০২৬)। কোনো টিকা বাদ পড়লে ভয় পাবেন না, দ্রুত নিকটস্থ টিকাকেন্দ্রে যোগাযোগ করুন। Schedule বদলাতে পারে, তাই EPI কার্ড ও স্বাস্থ্যকর্মীর কথা অনুসরণ করুন।'
                      : 'This app is intended as an informational reminder only and is not a substitute for professional medical advice. Bangladesh EPI Schedule guidelines apply. If any dose was missed, do not worry—visit your local immunization center promptly. Always follow your official EPI card and healthcare provider guidance.'}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Automated Multi-Photo Slider with Admin-Only Upload System */}
          <div className="lg:col-span-5">
            <HeroSliderCard
              babyName={currentBaby.name}
              language={language}
            />
          </div>

        </div>
      </div>
    </section>
  );
};
