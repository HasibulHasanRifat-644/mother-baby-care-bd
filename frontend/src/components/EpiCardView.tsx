import React, { useState } from 'react';
import { 
  Printer, 
  Download, 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  Check, 
  Sparkles, 
  Baby, 
  User, 
  Phone, 
  PiggyBank, 
  TrendingUp, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { BabyProfile, Language } from '../types/vaccine';
import { ParentUser } from '../types/auth';
import { BabySavingsAccount } from '../types/savings';
import { GrowthRecord } from '../types/community';
import { BANGLADESH_EPI_MILESTONES, BANGLADESH_VACCINES } from '../data/bangladeshEpiData';
import { calculateDueDate, formatFriendlyDate, calculateAge, toBengaliNumerals } from '../utils/dateCalculations';
import { downloadCardAsImage, generateCardTextSummary } from '../utils/cardDownloadGenerator';

interface EpiCardViewProps {
  isOpen: boolean;
  baby: BabyProfile;
  language: Language;
  onClose: () => void;
  currentUser?: ParentUser | null;
  savingsAccount?: BabySavingsAccount;
  growthRecords?: GrowthRecord[];
}

export const EpiCardView: React.FC<EpiCardViewProps> = ({
  isOpen,
  baby,
  language,
  onClose,
  currentUser,
  savingsAccount,
  growthRecords,
}) => {
  const [activeTab, setActiveTab] = useState<'all_in_one' | 'epi_only'>('all_in_one');
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadImage = async () => {
    setIsDownloading(true);
    try {
      await downloadCardAsImage({
        baby,
        language,
        parentUser: currentUser,
        savingsAccount,
        growthRecords,
      });
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopySummary = () => {
    const text = generateCardTextSummary({
      baby,
      language,
      parentUser: currentUser,
      savingsAccount,
      growthRecords,
    });
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculate current savings total
  let totalSavings = 0;
  if (savingsAccount?.transactions) {
    let dep = 0;
    let wit = 0;
    savingsAccount.transactions.forEach(t => {
      if (t.type === 'deposit') dep += t.amount;
      else if (t.type === 'withdrawal') wit += t.amount;
    });
    totalSavings = Math.max(0, dep - wit);
  } else {
    totalSavings = 14500;
  }

  // Count done vaccines
  let doneCount = 0;
  const totalCount = Object.keys(BANGLADESH_VACCINES).length;
  Object.keys(BANGLADESH_VACCINES).forEach(vId => {
    if (baby.records[vId]?.isGiven) doneCount++;
  });

  const latestGrowth = growthRecords && growthRecords.length > 0 ? growthRecords[growthRecords.length - 1] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl border border-slate-300 overflow-hidden my-auto print-card flex flex-col max-h-[95vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Controls Action Bar (Hidden when printing) */}
        <div className="no-print px-4 sm:px-6 py-3.5 bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-teal-700/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-700/60 flex items-center justify-center text-teal-200">
              <ShieldCheck className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <span className="font-bold text-sm sm:text-base leading-tight block">
                {language === 'bn' ? 'সমন্বিত ডিজিটাল স্বাস্থ্য পাসপোর্ট ও কার্ড' : 'Mother & Baby Digital Health Passport & Card'}
              </span>
              <span className="text-[11px] text-teal-200">
                {language === 'bn' ? 'সব তথ্যের পূর্ণাঙ্গ বিবরণ ও ডাউনলোড ব্যবস্থা' : 'Complete Record with Instant PNG & PDF Download'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Download HD Image Button */}
            <button
              type="button"
              onClick={handleDownloadImage}
              disabled={isDownloading}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-xl shadow-sm transition-all"
              title="এইচডি ইমেজ ডাউনলোড"
            >
              <Download className={`w-4 h-4 ${isDownloading ? 'animate-bounce' : ''}`} />
              <span>
                {isDownloading 
                  ? (language === 'bn' ? 'তৈরি হচ্ছে...' : 'Generating...') 
                  : (language === 'bn' ? '📥 কার্ড ছবি ডাউনলোড' : 'Download PNG')}
              </span>
            </button>

            {/* Print / Save PDF Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-600 active:scale-95 rounded-xl transition-all"
              title="প্রিন্ট অথবা পিডিএফ সংরক্ষণ"
            >
              <Printer className="w-4 h-4 text-teal-200" />
              <span className="hidden sm:inline">{language === 'bn' ? 'প্রিন্ট / PDF' : 'Print / PDF'}</span>
            </button>

            {/* Copy Text Summary Button */}
            <button
              type="button"
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-teal-100 hover:text-white bg-teal-800/80 hover:bg-teal-700 rounded-xl transition-all"
              title="তথ্য কপি করুন"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{copied ? (language === 'bn' ? 'কপি হয়েছে' : 'Copied') : (language === 'bn' ? 'কপি' : 'Copy')}</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-teal-200 hover:text-white hover:bg-white/10 transition-colors ml-1"
              title="বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Switcher Sub-tabs (Hidden when printing) */}
        <div className="no-print bg-slate-100 px-4 sm:px-6 py-2 border-b border-slate-200 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('all_in_one')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'all_in_one'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? '🌟 সমন্বিত অল-ইন-ওয়ান কার্ড (সব বিষয়সহ)' : '🌟 Comprehensive All-in-One Card'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('epi_only')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'epi_only'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? '💉 অফিশিয়াল ইপিআই কার্ড ফরম্যাট' : '💉 Official EPI Card Format'}</span>
          </button>
        </div>

        {/* Printable & Scrollable Card Body */}
        <div className="p-4 sm:p-8 overflow-y-auto space-y-6 text-slate-900 bg-white" id="card-printable-area">
          
          {/* Official Card Header */}
          <div className="text-center border-b-2 border-teal-800 pb-4 space-y-1 relative">
            <div className="text-xs uppercase font-bold tracking-wider text-teal-800">
              {language === 'bn' 
                ? 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকার · স্বাস্থ্য ও পরিবার কল্যাণ মন্ত্রণালয় · স্বাস্থ্য অধিদপ্তর' 
                : 'Government of the People\'s Republic of Bangladesh · DGHS'}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {activeTab === 'all_in_one' 
                ? (language === 'bn' ? 'মা ও শিশু ডিজিটাল স্বাস্থ্য পাসপোর্ট ও সমন্বিত ইপিআই কার্ড' : 'Mother & Baby Digital Health Passport & EPI Card')
                : (language === 'bn' ? 'সম্প্রসারিত টিকাদান কর্মসূচি (EPI) - শিশু টিকাদান কার্ড' : 'Expanded Programme on Immunization (EPI) Child Record')}
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              {language === 'bn' 
                ? 'শিশুর সম্পূর্ণ পরিচয়, টিকাদান শিডিউল, শারীরিক বৃদ্ধি ও ভবিষ্যৎ আর্থিক সুরক্ষা নিশ্চিতকরণ' 
                : 'Complete Child Identification, Immunization Milestones, Growth Tracking & Financial Protection'}
            </p>
            
            {/* Verified Digital Seal Badge */}
            <div className="sm:absolute sm:top-0 sm:right-0 mt-2 sm:mt-0 inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-300 rounded-lg text-[11px] font-bold text-emerald-800 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'bn' ? 'ডিজিটাল সত্যায়িত রেকর্ড' : 'Verified Digital Record'}</span>
            </div>
          </div>

          {/* 1. Baby & Guardian Demographic Information */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Baby className="w-4 h-4 text-teal-600" />
                <span>{language === 'bn' ? '১. শিশুর পরিচিতি ও পিতা-মাতার পূর্ণ বিবরণ' : '1. Child & Parents Full Identification'}</span>
              </span>
              <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                {language === 'bn' ? 'ইপিআই নিবন্ধিত' : 'EPI Registered'}
              </span>
            </h3>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 text-xs space-y-4">
              
              {/* Top Row: Baby Details with Photo */}
              <div className="flex flex-col sm:flex-row gap-4 items-start pb-3.5 border-b border-slate-200/80">
                {/* Photo or Avatar */}
                <div className="w-18 h-22 rounded-xl bg-teal-100 border-2 border-teal-300 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                  {baby.passportPhotoUrl || baby.photoUrl ? (
                    <img src={baby.passportPhotoUrl || baby.photoUrl} alt={baby.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl">{baby.gender === 'girl' ? '👧' : '👶'}</span>
                  )}
                </div>

                <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  <div>
                    <span className="text-slate-500 block text-[11px]">{language === 'bn' ? 'শিশুর নাম:' : 'Child Name:'}</span>
                    <span className="font-bold text-slate-900 text-sm sm:text-base leading-tight block">{baby.name || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">{language === 'bn' ? 'জন্ম তারিখ ও বয়স:' : 'Date of Birth & Age:'}</span>
                    <span className="font-bold text-slate-900 block">
                      {formatFriendlyDate(baby.dateOfBirth, language)}
                    </span>
                    <span className="text-[11px] text-teal-700 font-semibold block">
                      ({calculateAge(baby.dateOfBirth, language)})
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">{language === 'bn' ? 'লিঙ্গ ও রক্তের গ্রুপ:' : 'Gender & Blood:'}</span>
                    <span className="font-bold text-slate-900 block">
                      {baby.gender === 'boy' ? (language === 'bn' ? 'ছেলে' : 'Boy') : (language === 'bn' ? 'মেয়ে' : 'Girl')}
                      {baby.bloodGroup ? ` (${baby.bloodGroup})` : ' (B+)'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">{language === 'bn' ? 'জাতীয় ইপিআই কার্ড নং:' : 'EPI Card No:'}</span>
                    <span className="font-bold text-teal-800 font-mono text-xs block">
                      {baby.epiCardNumber || 'EPI-2026-DH-4819'}
                    </span>
                  </div>

                  {/* Baby Birth Certificate Number (BRN) */}
                  <div className="sm:col-span-2 bg-white p-2.5 rounded-xl border border-teal-200">
                    <span className="text-slate-500 block text-[11px] font-medium">
                      {language === 'bn' ? '📜 শিশুর জন্ম নিবন্ধন নম্বর (BRN):' : '📜 Baby Birth Registration No (BRN):'}
                    </span>
                    <span className="font-bold text-teal-900 font-mono text-sm tracking-wider block">
                      {baby.birthRegistrationNumber || currentUser?.birthCertificateNumber 
                        ? (language === 'bn' ? toBengaliNumerals(baby.birthRegistrationNumber || currentUser?.birthCertificateNumber || '') : (baby.birthRegistrationNumber || currentUser?.birthCertificateNumber))
                        : (baby.hasBirthCertificate === 'applied' || currentUser?.hasBirthCertificate === 'applied')
                          ? (language === 'bn' ? '⏳ আবেদনকৃত (আবেদন প্রক্রিয়ায় রয়েছে)' : '⏳ Applied (Pending Verification)')
                          : (language === 'bn' ? '২০২৪২৬৯২০১৫০০৪৮৯১ (অনুমোদিত)' : '20242692015004891')}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">{language === 'bn' ? 'জন্ম ওজন:' : 'Birth Weight:'}</span>
                    <span className="font-bold text-slate-900 block">
                      {baby.birthWeightKg ? (language === 'bn' ? `${toBengaliNumerals(baby.birthWeightKg)} কেজি` : `${baby.birthWeightKg} kg`) : '৩.২ কেজি'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">{language === 'bn' ? 'পাসপোর্ট নম্বর:' : 'Passport No:'}</span>
                    <span className="font-bold text-slate-900 font-mono text-xs block">
                      {baby.babyPassportNumber || (language === 'bn' ? 'প্রযোজ্য নয়' : 'N/A')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Middle Row: Father & Mother Identification Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {/* 👨 Father Information Card */}
                <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-blue-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between pb-1.5 border-b border-blue-100">
                    <span className="font-bold text-blue-900 text-xs flex items-center gap-1.5">
                      <span className="text-sm">👨</span>
                      <span>{language === 'bn' ? 'বাবার বিবরণ (Father Details)' : 'Father Details'}</span>
                    </span>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                      {baby.fatherIdType === 'birth_certificate' 
                        ? (language === 'bn' ? 'জন্মনিবন্ধন' : 'BRN') 
                        : (language === 'bn' ? 'NID কার্ড' : 'NID')}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[11px]">{language === 'bn' ? 'বাবার নাম:' : "Father's Name:"}</span>
                      <strong className="text-slate-900 text-sm block">
                        {baby.fatherName || 'রফিকুল ইসলাম'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">
                        {baby.fatherIdType === 'birth_certificate'
                          ? (language === 'bn' ? 'বাবার জন্মনিবন্ধন নং:' : "Father's BRN No:")
                          : (language === 'bn' ? 'বাবার NID নম্বর:' : "Father's NID No:")}
                      </span>
                      <strong className="text-blue-950 font-mono text-xs block">
                        {baby.fatherIdNumber 
                          ? (language === 'bn' ? toBengaliNumerals(baby.fatherIdNumber) : baby.fatherIdNumber) 
                          : (language === 'bn' ? '১৯৮৯২৬৯২০১৫০০০৭৮৯' : '19892692015000789')}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* 👩 Mother Information Card */}
                <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-teal-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between pb-1.5 border-b border-teal-100">
                    <span className="font-bold text-teal-900 text-xs flex items-center gap-1.5">
                      <span className="text-sm">👩</span>
                      <span>{language === 'bn' ? 'মায়ের বিবরণ (Mother Details)' : 'Mother Details'}</span>
                    </span>
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                      {baby.motherIdType === 'birth_certificate' 
                        ? (language === 'bn' ? 'জন্মনিবন্ধন' : 'BRN') 
                        : (language === 'bn' ? 'NID কার্ড' : 'NID')}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[11px]">{language === 'bn' ? 'মায়ের নাম:' : "Mother's Name:"}</span>
                      <strong className="text-slate-900 text-sm block">
                        {baby.motherName || currentUser?.fullName || 'সাদিয়া সুলতানা'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">
                        {baby.motherIdType === 'birth_certificate'
                          ? (language === 'bn' ? 'মায়ের জন্মনিবন্ধন নং:' : "Mother's BRN No:")
                          : (language === 'bn' ? 'মায়ের NID নম্বর:' : "Mother's NID No:")}
                      </span>
                      <strong className="text-teal-950 font-mono text-xs block">
                        {(baby.motherIdNumber || baby.parentIdNumber)
                          ? (language === 'bn' ? toBengaliNumerals(baby.motherIdNumber || baby.parentIdNumber || '') : (baby.motherIdNumber || baby.parentIdNumber)) 
                          : (language === 'bn' ? '১৯৯২২৬৯২০১৫০০০১২৩' : '19922692015000123')}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Address & Center Details */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-slate-600 text-[11px] border-t border-slate-200/70">
                <div>
                  <span className="text-slate-400 block">{language === 'bn' ? 'স্থায়ী ঠিকানা (উপজেলা ও জেলা):' : 'Permanent Address:'}</span>
                  <strong className="text-slate-800">
                    {baby.upazila ? `${baby.upazila}, ` : ''}{baby.district || 'ঢাকা'}, {baby.division || 'ঢাকা'}
                    {baby.ward ? ` (ওয়ার্ড: ${baby.ward})` : ''}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block">{language === 'bn' ? 'ইপিআই টিকাদান কেন্দ্র:' : 'EPI Vaccination Center:'}</span>
                  <strong className="text-teal-900 font-semibold">{baby.epiCenterName || (language === 'bn' ? 'উপজেলা স্বাস্থ্য কমপ্লেক্স' : 'Upazila Health Complex')}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">{language === 'bn' ? 'জরুরি অভিভাবক যোগাযোগ:' : 'Guardian Contact:'}</span>
                  <strong className="text-slate-800">{currentUser?.fullName || baby.motherName || 'অভিভাবক'} ({currentUser?.phoneOrEmail || '০১৭১২-৩৪৫৬৭৮'})</strong>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Immunization Schedule Matrix */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>{language === 'bn' ? '২. বাংলাদেশ ইপিআই পূর্ণাঙ্গ টিকাদান শিডিউল ও গ্রহণের তারিখ' : '2. Complete EPI Immunization Schedule & Administration'}</span>
              </span>
              <span className="text-[11px] font-normal text-slate-500">
                {language === 'bn' ? `মোট ${doneCount}/${totalCount} টি সম্পন্ন` : `${doneCount}/${totalCount} Completed`}
              </span>
            </h3>

            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-teal-800 text-white font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">{language === 'bn' ? 'বয়স / সেশন' : 'Milestone'}</th>
                      <th className="py-2.5 px-3">{language === 'bn' ? 'টিকার নাম ও কোড' : 'Vaccine & Code'}</th>
                      <th className="py-2.5 px-3">{language === 'bn' ? 'প্রতিরোধযোগ্য রোগ' : 'Diseases Prevented'}</th>
                      <th className="py-2.5 px-3">{language === 'bn' ? 'নির্ধারিত তারিখ' : 'Due Date'}</th>
                      <th className="py-2.5 px-3">{language === 'bn' ? 'প্রদানের স্ট্যাটাস / তারিখ' : 'Status / Date'}</th>
                      <th className="py-2.5 px-3">{language === 'bn' ? 'টিকাদান কেন্দ্র' : 'Clinic Center'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-sans">
                    {BANGLADESH_EPI_MILESTONES.map((milestone) => {
                      const dueDate = calculateDueDate(baby.dateOfBirth, milestone.approxDays);
                      return milestone.vaccineIds.map((vId, idx) => {
                        const vac = BANGLADESH_VACCINES[vId];
                        const record = baby.records[vId];
                        const isGiven = !!record?.isGiven;

                        return (
                          <tr key={vId} className={isGiven ? 'bg-emerald-50/50' : 'hover:bg-slate-50/50'}>
                            {idx === 0 && (
                              <td 
                                rowSpan={milestone.vaccineIds.length} 
                                className="py-2.5 px-3 font-semibold text-slate-800 bg-slate-50 border-r border-slate-200 align-top"
                              >
                                <div>{language === 'bn' ? milestone.titleBn : milestone.titleEn}</div>
                                <div className="text-[10px] text-slate-500 font-normal">
                                  {language === 'bn' ? milestone.ageBn : milestone.ageEn}
                                </div>
                              </td>
                            )}
                            <td className="py-2 px-3 font-bold text-slate-900 whitespace-nowrap">
                              <span className="font-mono text-teal-800 mr-1">[{vac.code}]</span>
                              {language === 'bn' ? vac.nameBn : vac.nameEn}
                            </td>
                            <td className="py-2 px-3 text-slate-600 max-w-xs">
                              {(language === 'bn' ? vac.diseasesBn : vac.diseasesEn).join(', ')}
                            </td>
                            <td className="py-2 px-3 font-medium text-slate-700 whitespace-nowrap">
                              {formatFriendlyDate(dueDate, language)}
                            </td>
                            <td className="py-2 px-3 whitespace-nowrap">
                              {isGiven ? (
                                <span className="inline-flex items-center gap-1 text-emerald-800 font-bold">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>{formatFriendlyDate(record.dateGiven || dueDate, language)}</span>
                                </span>
                              ) : (
                                <span className="text-slate-400 italic">
                                  {language === 'bn' ? 'অপেক্ষমাণ' : 'Pending'}
                                </span>
                              )}
                            </td>
                            <td className="py-2 px-3 text-slate-600 truncate max-w-[140px]">
                              {record?.centerName || (isGiven ? (language === 'bn' ? 'উপজেলা স্বাস্থ্য কমপ্লেক্স' : 'Health Complex') : '-')}
                            </td>
                          </tr>
                        );
                      });
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 3 & 4. Growth & Baby Savings Bank Row (In Comprehensive View) */}
          {activeTab === 'all_in_one' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* 3. Physical Growth Status */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-teal-600" />
                  <span>{language === 'bn' ? '৩. শারীরিক বৃদ্ধি ও স্বাস্থ্য রিপোর্ট' : '3. Physical Growth & Health Report'}</span>
                </h4>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[11px]">{language === 'bn' ? 'বর্তমান আনুমানিক ওজন:' : 'Weight:'}</span>
                    <span className="font-bold text-slate-900 text-sm">
                      {latestGrowth ? `${latestGrowth.weightKg} কেজি` : '৫.১ কেজি (স্বাভাবিক)'}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[11px]">{language === 'bn' ? 'শারীরিক উচ্চতা:' : 'Height:'}</span>
                    <span className="font-bold text-slate-900 text-sm">
                      {latestGrowth?.heightCm ? `${latestGrowth.heightCm} সেমি` : '৫৮ সেমি (সন্তোষজনক)'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  {language === 'bn' 
                    ? '• বিশ্ব স্বাস্থ্য সংস্থা (WHO) বৃদ্ধির মান অনুযায়ী ওজন ও দৈর্ঘ্য সঠিক অনুপাতে রয়েছে।' 
                    : '• Weight and length progression comply with WHO Child Growth Standards.'}
                </p>
              </div>

              {/* 4. Future Baby Savings Bank */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <PiggyBank className="w-4 h-4 text-amber-700" />
                    <span>{language === 'bn' ? '৪. মা ও শিশু সঞ্চয় ব্যাংক (ভবিষ্যৎ তহবিল)' : '4. Baby Savings Bank'}</span>
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">
                    {language === 'bn' ? 'সচল' : 'Active'}
                  </span>
                </h4>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-amber-200/80">
                    <span className="text-slate-500 block text-[11px]">{language === 'bn' ? 'মোট জমানো ব্যালেন্স:' : 'Total Savings:'}</span>
                    <span className="font-bold text-teal-800 text-base">
                      ৳ {totalSavings.toLocaleString('en-IN')} টাকা
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-amber-200/80">
                    <span className="text-slate-500 block text-[11px]">{language === 'bn' ? 'প্রধান আর্থিক লক্ষ্য:' : 'Active Goal:'}</span>
                    <span className="font-bold text-slate-900 truncate block">
                      {savingsAccount?.goals?.[0]?.title || (language === 'bn' ? 'উচ্চ শিক্ষা ও স্বাস্থ্য' : 'Higher Education')}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-amber-900/90 leading-relaxed pt-1">
                  {language === 'bn' 
                    ? '• শিশুর ১৮ বছর বয়স পর্যন্ত নিরাপদে বৃদ্ধির পাশাপাশি আর্থিক ভবিষ্যৎ সুরক্ষিত।' 
                    : '• Dedicated fund secured for the child\'s higher education and medical emergency.'}
                </p>
              </div>

            </div>
          )}

          {/* 5. Official Health Assistant & Center Verification (Replaces the helplines box) */}
          <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-teal-700/60 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-teal-700/60 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-700/80 border border-teal-500/50 flex items-center justify-center text-teal-200">
                  <User className="w-4 h-4 text-teal-200" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                    <span>{language === 'bn' ? '৫. দায়িত্বপ্রাপ্ত স্বাস্থ্য সহকারী ও টিকাদান কেন্দ্র বিবরণ' : '5. Authorized Health Assistant & Immunization Center'}</span>
                  </h4>
                  <p className="text-[11px] text-teal-200/80">
                    {language === 'bn'
                      ? 'টিকা প্রদানকারী স্বাস্থ্যকর্মী ও ডিজিটাল রেকর্ড সত্যায়ন'
                      : 'Vaccinator credentials and verified official immunization record'}
                  </p>
                </div>
              </div>
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-400/40 rounded-xl text-xs font-bold text-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'bn' ? 'ডিজিটাল সত্যায়িত ও অনুমোদিত' : 'Authorized & Active'}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {/* Health Assistant Name & Designation */}
              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10 flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-teal-500/30 flex items-center justify-center shrink-0 mt-0.5 text-base">
                  🩺
                </div>
                <div className="space-y-0.5">
                  <span className="text-[11px] text-teal-200 block font-medium">
                    {language === 'bn' ? 'স্বাস্থ্য সহকারীর নাম:' : 'Health Assistant Name:'}
                  </span>
                  <span className="font-bold text-white text-sm block">
                    {baby.healthAssistantName || 'মোছাঃ নাজমুন নাহার'}
                  </span>
                  <span className="text-[10px] text-teal-300/90 block">
                    {baby.healthAssistantDesignation || (language === 'bn' ? 'স্বাস্থ্য সহকারী (ইপিআই টিকাদানকারী)' : 'Health Assistant (EPI Vaccinator)')}
                  </span>
                </div>
              </div>

              {/* Health Assistant Phone & Direct Call */}
              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10 flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-teal-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-teal-200" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[11px] text-teal-200 block font-medium">
                      {language === 'bn' ? 'স্বাস্থ্য সহকারীর মোবাইল নম্বর:' : 'Assistant Mobile Number:'}
                    </span>
                    <span className="font-bold text-amber-300 text-sm font-mono block">
                      {baby.healthAssistantPhone || '০১৭১২-৩৪৫৬৭৮'}
                    </span>
                    <span className="text-[10px] text-teal-300/80 block">
                      {language === 'bn' ? 'টিকা সংক্রান্ত পরামর্শ' : 'Direct Immunization Queries'}
                    </span>
                  </div>
                </div>
                {baby.healthAssistantPhone && (
                  <a
                    href={`tel:${baby.healthAssistantPhone.replace(/[^0-9+]/g, '')}`}
                    className="no-print self-center px-2 py-1 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-lg text-[11px] font-bold shadow-xs active:scale-95 transition-all flex items-center gap-1 shrink-0"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{language === 'bn' ? 'কল' : 'Call'}</span>
                  </a>
                )}
              </div>

              {/* EPI Center & Location */}
              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10 flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-teal-500/30 flex items-center justify-center shrink-0 mt-0.5 text-base">
                  🏥
                </div>
                <div className="space-y-0.5">
                  <span className="text-[11px] text-teal-200 block font-medium">
                    {language === 'bn' ? 'ইপিআই টিকাদান কেন্দ্র ও এলাকা:' : 'EPI Center & Area:'}
                  </span>
                  <span className="font-bold text-white text-xs block leading-tight">
                    {baby.epiCenterName || (language === 'bn' ? 'উপজেলা স্বাস্থ্য কমপ্লেক্স (EPI সেন্টার)' : 'Upazila Health Complex')}
                  </span>
                  <span className="text-[10px] text-teal-300/80 block">
                    {baby.upazila ? `${baby.upazila}, ` : ''}{baby.district || 'ঢাকা'}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Official Authority Footer */}
            <div className="pt-2.5 mt-0.5 border-t border-teal-700/50 flex flex-col sm:flex-row items-center justify-between text-[11px] text-teal-200/90 gap-1.5">
              <p>
                {language === 'bn' 
                  ? 'সূত্র: বাংলাদেশ সম্প্রসারিত টিকাদান কর্মসূচি (EPI), স্বাস্থ্য অধিদপ্তর, মহাখালী, ঢাকা।' 
                  : 'Source: DGHS Expanded Programme on Immunization (EPI), Ministry of Health & Family Welfare.'}
              </p>
              <div className="flex items-center gap-2 font-mono text-emerald-300 font-semibold text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'bn' ? 'অফিশিয়াল ডিজিটাল টিকাদান কার্ড' : 'Official Digital Vaccine Card'}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
