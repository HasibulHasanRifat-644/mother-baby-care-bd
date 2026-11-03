import React, { useState } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  Utensils, 
  Droplet, 
  HeartHandshake, 
  PhoneCall, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Info,
  Calendar,
  Baby
} from 'lucide-react';
import { BabyProfile, Language } from '../../types/vaccine';
import { GrowthRecord, BloodRequest, BabyMilestoneItem } from '../../types/community';
import { GrowthTracker } from '../Growth/GrowthTracker';
import { NutritionGuide } from '../Nutrition/NutritionGuide';
import { BloodRequestBoard } from '../Community/BloodRequestBoard';
import { BANGLADESH_HELPLINES } from '../../data/bangladeshEpiData';

export type ServiceSubTab = 'growth' | 'nutrition' | 'blood' | 'care' | 'helpline';

interface ServicesHubProps {
  currentBaby: BabyProfile;
  language: Language;
  growthRecords: GrowthRecord[];
  milestones: BabyMilestoneItem[];
  onAddGrowthRecord: (record: Omit<GrowthRecord, 'id'>) => void;
  onToggleMilestone: (milestoneId: string) => void;
  bloodRequests: BloodRequest[];
  onAddBloodRequest: (req: Omit<BloodRequest, 'id' | 'createdAt'>) => void;
  onOpenVideoHub?: () => void;
  initialSubTab?: ServiceSubTab;
}

export const ServicesHub: React.FC<ServicesHubProps> = ({
  currentBaby,
  language,
  growthRecords,
  milestones,
  onAddGrowthRecord,
  onToggleMilestone,
  bloodRequests,
  onAddBloodRequest,
  onOpenVideoHub,
  initialSubTab = 'growth',
}) => {
  const [activeSubTab, setActiveSubTab] = useState<ServiceSubTab>(initialSubTab);

  const serviceTabs = [
    {
      id: 'growth' as ServiceSubTab,
      labelBn: '📈 গ্রোথ ও বিকাশ',
      labelEn: 'Growth Tracker',
      descBn: 'ওজন, উচ্চতা ও বিকাশ মাইলফলক ট্র্যাকিং',
      descEn: 'Weight, height & developmental milestones',
      color: 'blue',
      badgeBn: 'বৃদ্ধি গ্রাফ',
      badgeEn: 'Growth Chart',
    },
    {
      id: 'nutrition' as ServiceSubTab,
      labelBn: '🥣 খাবার ও পুষ্টি',
      labelEn: 'Nutrition Guide',
      descBn: 'বয়স অনুযায়ী পুষ্টিকর খাবার ও রেসিপি গাইড',
      descEn: 'Age-appropriate diet & weaning meal plans',
      color: 'emerald',
      badgeBn: 'পুষ্টি চার্ট',
      badgeEn: 'Diet Chart',
    },
    {
      id: 'blood' as ServiceSubTab,
      labelBn: '🩸 জরুরি রক্ত',
      labelEn: 'Emergency Blood',
      descBn: 'জরুরি রক্তের অনুরোধ ও স্বেচ্ছাসেবী ডোনার',
      descEn: 'Emergency blood donation & donor requests',
      color: 'rose',
      badgeBn: 'ডোনার বোর্ড',
      badgeEn: 'Donor Board',
    },
    {
      id: 'care' as ServiceSubTab,
      labelBn: '🩹 টিকা পরবর্তী যত্ন',
      labelEn: 'Post-Vaccine Care',
      descBn: 'টিকার পর জ্বর ও ব্যথায় করণীয় ও সতর্কতা',
      descEn: 'Post-vaccination side effects, fever & comfort',
      color: 'teal',
      badgeBn: 'জরুরি গাইড',
      badgeEn: 'Care Guide',
    },
    {
      id: 'helpline' as ServiceSubTab,
      labelBn: '📞 জরুরি হেল্পলাইন',
      labelEn: 'Emergency Helpline',
      descBn: '১৬২৬৩, ৩৩৩, ৯৯৯ সরকারি জরুরি সেবা নম্বর',
      descEn: '16263, 333, 999 Government Emergency Lines',
      color: 'sky',
      badgeBn: 'টোল-ফ্রি কল',
      badgeEn: 'Direct Call',
    },
  ];

  return (
    <div className="py-6 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      
      {/* 1. Header Hero Card */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 rounded-3xl p-5 sm:p-7 text-white shadow-lg border border-teal-700/50 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-teal-200 text-xs font-bold backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>{language === 'bn' ? 'সমন্বিত মা ও শিশু স্বাস্থ্য সেবা' : 'Integrated Maternal & Child Health Services'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {language === 'bn' ? '🏥 মা ও শিশু সুরক্ষা সেবা কেন্দ্র' : 'Mother & Baby Health Services'}
            </h1>
            <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
              {language === 'bn' 
                ? 'গ্রোথ ও বিকাশ ট্র্যাকার, পুষ্টিকর খাবার গাইড, রক্তের অনুরোধ, টিকা পরবর্তী যত্ন ও স্বাস্থ্য সহকারী হেল্পলাইন—সব সেবা এক ঠিকানায়।'
                : 'Growth Milestones, Nutrition Guide, Blood Requests, Post-Vaccine Care & Health Assistant Helplines.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-600/80 flex items-center justify-center text-lg shadow-sm">
                👶
              </div>
              <div>
                <p className="font-bold text-white text-sm">{currentBaby.name || (language === 'bn' ? 'শিশু' : 'Baby')}</p>
                <p className="text-[11px] text-teal-200">
                  {language === 'bn' ? 'বয়স: ' : 'Age: '}
                  {currentBaby.dateOfBirth ? (language === 'bn' ? 'নিবন্ধিত' : 'Registered') : ''}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. Touch-Friendly Service Selector (5 Cards / Pills) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
        {serviceTabs.map((tab) => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id)}
              className={`p-3 rounded-2xl text-left transition-all border relative flex flex-col justify-between min-h-[96px] active:scale-95 ${
                isActive
                  ? 'bg-white border-teal-600 shadow-md ring-2 ring-teal-600/20'
                  : 'bg-white border-slate-200 hover:border-teal-300 hover:bg-slate-50 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between gap-1 w-full">
                <span className="text-sm sm:text-base font-extrabold truncate text-slate-900">
                  {language === 'bn' ? tab.labelBn : tab.labelEn}
                </span>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-teal-600 shrink-0" />
                )}
              </div>

              <p className="text-[10px] text-slate-500 line-clamp-2 mt-1 leading-snug">
                {language === 'bn' ? tab.descBn : tab.descEn}
              </p>

              <div className="pt-2 flex items-center justify-between text-[10px] font-bold">
                <span className={`px-2 py-0.5 rounded-md ${
                  isActive ? 'bg-teal-100 text-teal-900' : 'bg-slate-100 text-slate-600'
                }`}>
                  {language === 'bn' ? tab.badgeBn : tab.badgeEn}
                </span>
                <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-teal-700' : 'text-slate-400'}`} />
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Active Service View Container */}
      <div className="transition-all">

        {/* TAB 2: 📈 গ্রোথ ও বিকাশ */}
        {activeSubTab === 'growth' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-teal-600" />
                  <span>{language === 'bn' ? '📈 শিশুর বৃদ্ধি ও বিকাশ ট্র্যাকার' : 'Child Growth & Developmental Milestones'}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'bn' ? 'বিশ্ব স্বাস্থ্য সংস্থা (WHO) গ্রাফ অনুযায়ী উচ্চতা, ওজন ও মাইলফলক পর্যবেক্ষণ' : 'Track height, weight, and developmental milestones based on WHO standards'}
                </p>
              </div>
            </div>
            <GrowthTracker
              currentBaby={currentBaby}
              records={growthRecords}
              milestones={milestones}
              language={language}
              onAddRecord={onAddGrowthRecord}
              onToggleMilestone={onToggleMilestone}
            />
          </div>
        )}

        {/* TAB 3: 🥣 খাবার ও পুষ্টি */}
        {activeSubTab === 'nutrition' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-amber-500" />
                  <span>{language === 'bn' ? '🥣 বয়স অনুযায়ী পুষ্টি ও খাবার রেসিপি' : 'Child Nutrition & Healthy Meal Recipes'}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'bn' ? '৬ মাস থেকে ৫ বছর বয়সী শিশুর পুষ্টিকর খিচুড়ি, ডিম ও ঘরের তৈরি সহজ খাবারের তালিকা' : 'Age-by-age nutritious diet charts, khichuri recipes & feeding guidelines'}
                </p>
              </div>
            </div>
            <NutritionGuide language={language} />
          </div>
        )}

        {/* TAB 4: 🩸 রক্ত কর্নার */}
        {activeSubTab === 'blood' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Droplet className="w-5 h-5 text-rose-600 fill-rose-600" />
                  <span>{language === 'bn' ? '🩸 জরুরি রক্ত ও ডোনার সহায়তা বোর্ড' : 'Emergency Blood Request & Donor Support'}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'bn' ? 'জরুরি প্রয়োজনে রক্তের আবেদন করুন অথবা স্বেচ্ছাসেবী রক্তদাতা হিসেবে যুক্ত হোন' : 'Post urgent blood requests or connect with volunteer donors in your area'}
                </p>
              </div>
            </div>
            <BloodRequestBoard
              requests={bloodRequests}
              language={language}
              onAddRequest={onAddBloodRequest}
            />
          </div>
        )}

        {/* TAB 5: 🩹 টিকা পরবর্তী যত্ন ও পরামর্শ */}
        {activeSubTab === 'care' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between px-1">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <HeartHandshake className="w-5 h-5 text-teal-600" />
                  <span>{language === 'bn' ? '🩹 টিকা পরবর্তী যত্ন ও পরামর্শ' : 'Post-Vaccination Pediatric Care & Safety'}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'bn' ? 'টিকা দেওয়ার পর শিশুর আরাম ও নিরাপত্তা নিশ্চিত করার সহজ নির্দেশিকা' : 'Essential guidelines to keep your baby safe and comfortable after vaccination'}
                </p>
              </div>
            </div>

            {/* Do's and Don'ts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* করণীয় */}
              <div className="bg-white border border-emerald-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-3.5">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      {language === 'bn' ? 'যা করবেন (করণীয়)' : 'What to Do'}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {language === 'bn' ? 'শিশুর স্বাভাবিক আরাম নিশ্চিত করতে' : 'Safe care practices'}
                    </p>
                  </div>
                </div>

                <ul className="space-y-3 text-xs text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✔</span>
                    <span>
                      <strong className="text-slate-900">{language === 'bn' ? 'ঠান্ডা পানির সেক:' : 'Cold Compress:'}</strong>{' '}
                      {language === 'bn' ? 'টিকার স্থানে ব্যথা বা ফোলা থাকলে পরিষ্কার নরম কাপড় সাধারণ ঠান্ডা পানিতে ভিজিয়ে হালকা সেক দিন।' : 'Apply a clean cloth soaked in cool water to ease injection site discomfort.'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✔</span>
                    <span>
                      <strong className="text-slate-900">{language === 'bn' ? 'বেশি বেশি বুকের দুধ:' : 'Frequent Breastfeeding:'}</strong>{' '}
                      {language === 'bn' ? 'শিশুকে বারবার বুকের দুধ অথবা তরল খাবার দিন যাতে পানিশূন্যতা না হয়।' : 'Keep baby well-hydrated with frequent breastfeeding or fluids.'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✔</span>
                    <span>
                      <strong className="text-slate-900">{language === 'bn' ? 'প্যারাসিটামল ড্রপ:' : 'Paracetamol Drops:'}</strong>{' '}
                      {language === 'bn' ? '১০০°F এর বেশি জ্বর বা অতিরিক্ত কান্নাকাটি হলে ডাক্তারের পরামর্শ অনুযায়ী প্যারাসিটামল ড্রপ দিন।' : 'Give pediatric paracetamol drops if fever exceeds 100°F as advised by doctor.'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✔</span>
                    <span>
                      <strong className="text-slate-900">{language === 'bn' ? 'হালকা ও ঢিলেঢালা পোশাক:' : 'Loose Cotton Clothing:'}</strong>{' '}
                      {language === 'bn' ? 'শিশুকে আরামদায়ক সুতি কাপড় পরান, অতিরিক্ত গরম লাগতে দেবেন না।' : 'Dress in soft, loose cotton clothing to prevent overheating.'}
                    </span>
                  </li>
                </ul>
              </div>

              {/* বর্জনীয় */}
              <div className="bg-white border border-rose-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-3.5">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
                    <XCircle className="w-5 h-5 text-rose-600" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      {language === 'bn' ? 'যা করবেন না (বর্জনীয়)' : 'What NOT to Do'}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {language === 'bn' ? 'মারাত্মক পার্শ্বপ্রতিক্রিয়া এড়াতে' : 'Dangerous practices to avoid'}
                    </p>
                  </div>
                </div>

                <ul className="space-y-3 text-xs text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">✖</span>
                    <span>
                      <strong className="text-slate-900">{language === 'bn' ? 'টিকার স্থানে ম্যাসাজ বা মালিশ:' : 'Do Not Massage:'}</strong>{' '}
                      {language === 'bn' ? 'টিকার স্থানে ভুলেও তেল, বরফ সরাসরি বা কোনো মলম ঘষবেন না।' : 'Never rub or massage oils, balms, or direct ice on the injection site.'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">✖</span>
                    <span>
                      <strong className="text-slate-900">{language === 'bn' ? 'বিসিজি টিকার ঘা ফোটানো:' : 'Do Not Pinch BCG Sore:'}</strong>{' '}
                      {language === 'bn' ? 'বাম বাহুর বিসিজি টিকার ফোসকা বা ঘা স্বাভাবিক, এতে নখ বা সুঁই ছোঁয়াবেন না।' : 'BCG vaccine scab is normal; do not scratch, pop, or apply ointment to it.'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">✖</span>
                    <span>
                      <strong className="text-slate-900">{language === 'bn' ? 'অতিরিক্ত ওষুধ পরিহার:' : 'Avoid Over-Medicating:'}</strong>{' '}
                      {language === 'bn' ? 'ডাক্তারের পরামর্শ ছাড়া কোনো অ্যান্টিবায়োটিক বা ব্যথানাশক বড়ি খাওয়াবেন না।' : 'Never give unprescribed antibiotics, aspirin, or painkillers.'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">✖</span>
                    <span>
                      <strong className="text-slate-900">{language === 'bn' ? 'মোটা কম্বল চাপা:' : 'Do Not Overwrap:'}</strong>{' '}
                      {language === 'bn' ? 'জ্বর থাকলে শিশুকে অতিরিক্ত চাদর বা কম্বল দিয়ে মুড়িয়ে রাখবেন না।' : 'Do not wrap a feverish baby in heavy blankets.'}
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Emergency Warning Card */}
            <div className="bg-amber-50 border border-amber-300 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-950">
                    {language === 'bn' ? '🚨 কখন অবিলম্বে ডাক্তারের কাছে যাবেন?' : '🚨 When to Seek Emergency Care'}
                  </h4>
                  <p className="text-xs text-amber-900 leading-relaxed max-w-2xl mt-0.5">
                    {language === 'bn'
                      ? 'টানা ৩ ঘণ্টার বেশি তীব্র কান্না, ১০৪°F বা বেশি জ্বর, খিঁচুনি, শ্বাসকষ্ট বা শিশু নিস্তেজ হয়ে পড়লে বিলম্ব না করে অবিলম্বে নিকটস্থ হাসপাতালে যান বা ১৬২৬৩ তে কল করুন।'
                      : 'If baby cries continuously for >3 hours, has high fever (>104°F), seizures, difficulty breathing, or extreme lethargy, seek hospital care immediately.'}
                  </p>
                </div>
              </div>
              <a
                href="tel:16263"
                className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center gap-2 shrink-0 active:scale-95 transition-all shadow-xs"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{language === 'bn' ? '১৬২৬৩ কল করুন' : 'Call 16263'}</span>
              </a>
            </div>
          </div>
        )}

        {/* TAB 6: 📞 জরুরি স্বাস্থ্য ও সরকারি সেবা হেল্পলাইন */}
        {activeSubTab === 'helpline' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between px-1">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <PhoneCall className="w-5 h-5 text-teal-700" />
                  <span>{language === 'bn' ? '📞 স্বাস্থ্য সহকারী ও সরকারি জরুরি হেল্পলাইন' : 'Health Assistant & Emergency Helplines'}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'bn' ? 'দায়িত্বপ্রাপ্ত স্বাস্থ্য সহকারী এবং সরকারি জরুরি সেবায় সরাসরি কল করার যোগাযোগ তালিকা' : 'Direct contact details for authorized Health Assistant and government emergency hotlines'}
                </p>
              </div>
            </div>

            {/* 🌟 1. Primary Health Assistant Direct Card (স্বাস্থ্য সহকারীর নাম ও ফোন নম্বর) */}
            <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 text-white rounded-3xl p-5 sm:p-7 shadow-md border border-teal-600/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-700/80 text-emerald-300 text-xs font-bold border border-teal-500/40">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{language === 'bn' ? 'দায়িত্বপ্রাপ্ত সরকারি ইপিআই স্বাস্থ্য সহকারী' : 'Authorized EPI Health Assistant'}</span>
                </div>
                <div>
                  <h4 className="text-xl sm:text-2xl font-black text-white">
                    {currentBaby.healthAssistantName || (language === 'bn' ? 'মোছাঃ নাসরিন আক্তার' : 'Mst. Nasrin Akhter')}
                  </h4>
                  <p className="text-xs text-teal-200 mt-0.5">
                    {currentBaby.healthAssistantDesignation || (language === 'bn' ? 'স্বাস্থ্য সহকারী (ইপিআই ও পরিবার কল্যাণ)' : 'Health Assistant (EPI & Family Welfare)')}
                    {' • '}
                    <span className="text-emerald-300 font-medium">
                      {currentBaby.epiCenterName || (language === 'bn' ? 'উপজেলা স্বাস্থ্য কমপ্লেক্স / টিকাদান কেন্দ্র' : 'Upazila Health Complex / Clinic')}
                    </span>
                  </p>
                </div>
                <p className="text-xs text-teal-100/90 leading-relaxed max-w-xl">
                  {language === 'bn'
                    ? 'টিকা সংক্রান্ত পরামর্শ, কেন্দ্র পরিবর্তনের তথ্য বা যেকোনো জরুরি প্রশ্নে সরাসরি আপনার এলাকার স্বাস্থ্য সহকারীর সাথে কথা বলুন।'
                    : 'Contact your designated field health assistant directly for EPI immunization advice, center shifts, and queries.'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full sm:w-auto">
                <a
                  href={`tel:${currentBaby.healthAssistantPhone || '01712-345678'}`}
                  className="px-5 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2.5 shadow-md active:scale-95 transition-all"
                >
                  <PhoneCall className="w-4 h-4 fill-slate-950" />
                  <span>{currentBaby.healthAssistantPhone || '01712-345678'} এ কল করুন</span>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {BANGLADESH_HELPLINES.map((hl) => (
                <a
                  key={hl.number}
                  href={`tel:${hl.number}`}
                  className="p-5 bg-white border border-slate-200 rounded-3xl hover:border-teal-500 hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-teal-700 font-mono group-hover:text-teal-800">
                        {hl.number}
                      </span>
                      <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
                        <PhoneCall className="w-4 h-4" />
                      </div>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-2">
                      {language === 'bn' ? hl.nameBn : hl.nameEn}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {language === 'bn' ? hl.descBn : hl.descEn}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-700">
                    <span>{language === 'bn' ? 'সরাসরি কল করতে ট্যাপ করুন' : 'Tap to dial now'}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-700" />
                  </div>
                </a>
              ))}
            </div>

            {/* Additional Emergency Info Card */}
            <div className="p-4 bg-teal-50 border border-teal-200 rounded-3xl flex items-center gap-3 text-xs text-teal-950">
              <Info className="w-5 h-5 text-teal-700 shrink-0" />
              <p className="leading-relaxed">
                <strong>{language === 'bn' ? 'জরুরি পরামর্শ:' : 'Emergency Notice:'}</strong>{' '}
                {language === 'bn'
                  ? '১৬২৬৩ স্বাস্থ্য বাতায়নে ২৪ ঘণ্টা সরকারি এমবিবিএস ডাক্তার বিনামূল্যে স্বাস্থ্য পরামর্শ প্রদান করেন। জরুরি অ্যাম্বুলেন্স বা পুলিশ সহায়তার জন্য ৯৯৯ ডায়াল করুন।'
                  : '16263 Shastho Batayan offers 24/7 free consultations with certified medical doctors. Dial 999 for emergency ambulance or police services.'}
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
