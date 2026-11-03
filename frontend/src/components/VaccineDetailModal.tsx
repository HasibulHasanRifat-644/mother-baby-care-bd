import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Building2, 
  Tag, 
  FileText, 
  Check, 
  Trash2, 
  Syringe, 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  Lock, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { VaccineInfo, AdministeredRecord, Language } from '../types/vaccine';
import { formatDateIso, formatFriendlyDate, getDaysDiff, toBengaliNumerals } from '../utils/dateCalculations';

interface VaccineDetailModalProps {
  vaccine: VaccineInfo | null;
  currentRecord?: AdministeredRecord;
  calculatedDueDate: Date;
  language: Language;
  isAdminMode?: boolean;
  onClose: () => void;
  onSaveRecord: (record: AdministeredRecord) => void;
  onDeleteRecord?: (vaccineId: string) => void;
  onUnlockAdmin?: () => void;
}

export const VaccineDetailModal: React.FC<VaccineDetailModalProps> = ({
  vaccine,
  currentRecord,
  calculatedDueDate,
  language,
  isAdminMode = false,
  onClose,
  onSaveRecord,
  onDeleteRecord,
  onUnlockAdmin,
}) => {
  const [dateGiven, setDateGiven] = useState<string>(
    currentRecord?.dateGiven || formatDateIso(new Date())
  );
  const [centerName, setCenterName] = useState<string>(
    currentRecord?.centerName || ''
  );
  const [batchNumber, setBatchNumber] = useState<string>(
    currentRecord?.batchNumber || ''
  );
  const [givenBy, setGivenBy] = useState<string>(
    currentRecord?.givenBy || ''
  );
  const [reactionNotes, setReactionNotes] = useState<string>(
    currentRecord?.reactionNotes || ''
  );

  useEffect(() => {
    if (currentRecord) {
      setDateGiven(currentRecord.dateGiven || formatDateIso(new Date()));
      setCenterName(currentRecord.centerName || '');
      setBatchNumber(currentRecord.batchNumber || '');
      setGivenBy(currentRecord.givenBy || '');
      setReactionNotes(currentRecord.reactionNotes || '');
    } else {
      setDateGiven(formatDateIso(new Date()));
      setCenterName('');
      setBatchNumber('');
      setGivenBy('');
      setReactionNotes('');
    }
  }, [vaccine, currentRecord]);

  if (!vaccine) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveRecord({
      vaccineId: vaccine.id,
      isGiven: true,
      dateGiven,
      centerName: centerName.trim(),
      batchNumber: batchNumber.trim(),
      givenBy: givenBy.trim(),
      reactionNotes: reactionNotes.trim(),
    });
    onClose();
  };

  const commonCenters = [
    'উপজেলা স্বাস্থ্য কমপ্লেক্স (Upazila Health Complex)',
    'ইউনিয়ন স্বাস্থ্য ও পরিবার কল্যাণ কেন্দ্র',
    'কমিউনিটি ক্লিনিক (Community Clinic)',
    'ঢাকা মেডিকেল কলেজ হাসপাতাল',
    'সূর্যের হাসি ক্লিনিক (Surjer Hashi)',
    'রেড ক্রিসেন্ট মাতৃসদন ও হাসপাতাল',
    'মাতৃ ও শিশু স্বাস্থ্য কেন্দ্র (MCH)',
    'পৌরসভা / সিটি কর্পোরেশন ইপিআই কেন্দ্র',
  ];

  const daysDiff = getDaysDiff(calculatedDueDate);
  const isGiven = !!currentRecord?.isGiven;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-teal-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-teal-300">
              <Syringe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-800/80 px-2 py-0.5 rounded text-teal-200">
                  {vaccine.code}
                </span>
                <span className="text-xs text-teal-200">
                  {language === 'bn' ? vaccine.doseTextBn : vaccine.doseTextEn}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                {language === 'bn' ? vaccine.nameBn : vaccine.nameEn}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ================= PARENT VIEW (READ-ONLY) ================= */}
        {!isAdminMode ? (
          <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
            
            {/* Status & Key Dates Card */}
            <div className={`p-4 rounded-2xl border space-y-3 ${
              isGiven 
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' 
                : daysDiff < 0 
                  ? 'bg-rose-50/70 border-rose-200 text-rose-950' 
                  : 'bg-amber-50/70 border-amber-200 text-amber-950'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider">
                  {language === 'bn' ? 'টিকা গ্রহণের বর্তমান স্থিতি' : 'Vaccination Status'}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold flex items-center gap-1 ${
                  isGiven 
                    ? 'bg-emerald-600 text-white' 
                    : daysDiff < 0 
                      ? 'bg-rose-600 text-white' 
                      : 'bg-amber-500 text-slate-950'
                }`}>
                  {isGiven ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                  <span>
                    {isGiven 
                      ? (language === 'bn' ? 'সম্পন্ন হয়েছে' : 'Completed') 
                      : daysDiff < 0 
                        ? (language === 'bn' ? 'সময় পার হয়েছে' : 'Overdue') 
                        : (language === 'bn' ? 'আসন্ন / অপেক্ষমাণ' : 'Upcoming')}
                  </span>
                </span>
              </div>

              {/* 1. KOY DATE A TIKA DISE (Given Date) */}
              {isGiven ? (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-semibold text-emerald-800 block">
                    {language === 'bn' ? '📅 টিকা দেওয়ার সম্পন্ন তারিখ:' : 'Date Administered:'}
                  </span>
                  <p className="text-base font-extrabold text-emerald-950">
                    {formatFriendlyDate(currentRecord?.dateGiven || calculatedDueDate, language)}
                  </p>
                  {currentRecord?.centerName && (
                    <p className="text-xs text-emerald-900 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>{language === 'bn' ? `কেন্দ্র: ${currentRecord.centerName}` : `Center: ${currentRecord.centerName}`}</span>
                    </p>
                  )}
                  {currentRecord?.givenBy && (
                    <p className="text-xs text-emerald-900">
                      🩺 {language === 'bn' ? `স্বাস্থ্যকর্মী: ${currentRecord.givenBy}` : `Administered by: ${currentRecord.givenBy}`}
                    </p>
                  )}
                  {currentRecord?.reactionNotes && (
                    <p className="text-xs italic bg-white/70 p-2 rounded-xl border border-emerald-200">
                      📝 "{currentRecord.reactionNotes}"
                    </p>
                  )}
                </div>
              ) : (
                /* 2. AGAMITE KOY DATE A TIKA PABE (Upcoming Due Date) */
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-semibold text-amber-800 block">
                    {language === 'bn' ? '🗓️ আগামীতে টিকা পাওয়ার নির্ধারিত তারিখ:' : 'Upcoming Scheduled Due Date:'}
                  </span>
                  <p className="text-base font-black text-amber-950">
                    {formatFriendlyDate(calculatedDueDate, language)}
                  </p>
                  <p className="text-xs font-bold text-amber-900">
                    {daysDiff < 0 
                      ? (language === 'bn' ? `⚠️ সময় পার হয়েছে (${toBengaliNumerals(Math.abs(daysDiff))} দিন আগে) - দ্রুত কেন্দ্রে যোগাযোগ করুন` : `Overdue by ${Math.abs(daysDiff)} days`)
                      : daysDiff === 0 
                        ? (language === 'bn' ? '🚨 আজই টিকা দেওয়ার দিন!' : 'Due today!')
                        : (language === 'bn' ? `⏳ আর ${toBengaliNumerals(daysDiff)} দিন বাকি` : `${daysDiff} days remaining`)}
                  </p>
                </div>
              )}
            </div>

            {/* 3. TIKA DEYAR DOJ KOYTA (Dose Information) */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-teal-600" />
                <span>{language === 'bn' ? 'টিকা দেওয়ার ডোজ বিবরণ (Dose Details)' : 'Dose Information'}</span>
              </span>
              <div className="text-xs text-slate-700 space-y-1.5">
                <p>
                  <strong>{language === 'bn' ? 'ডোজের সংখ্যা:' : 'Dose:'}</strong>{' '}
                  <span className="text-teal-900 font-bold">{language === 'bn' ? vaccine.doseTextBn : vaccine.doseTextEn}</span>
                </p>
                <p>
                  <strong>{language === 'bn' ? 'প্রয়োগের স্থান ও পদ্ধতি:' : 'Route & Site:'}</strong>{' '}
                  {language === 'bn' ? `${vaccine.routeBn} (${vaccine.siteBn})` : `${vaccine.routeEn} (${vaccine.siteEn})`}
                </p>
              </div>
            </div>

            {/* Diseases Prevented */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === 'bn' ? 'প্রতিরোধযোগ্য মারাত্মক রোগসমূহ' : 'Diseases Prevented'}</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(language === 'bn' ? vaccine.diseasesBn : vaccine.diseasesEn).map((d, i) => (
                  <span key={i} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800">
                    🛡️ {d}
                  </span>
                ))}
              </div>
            </div>

            {/* Importance / Care Advice */}
            <div className="bg-teal-50/50 border border-teal-200/80 rounded-2xl p-4 space-y-1.5 text-xs text-slate-700 leading-relaxed">
              <span className="font-bold text-teal-900 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-teal-700" />
                <span>{language === 'bn' ? 'টিকা পরবর্তী পরামর্শ ও সতর্কতা' : 'Care & Side-Effect Guidance'}</span>
              </span>
              <p>{language === 'bn' ? vaccine.importanceNotesBn : vaccine.importanceNotesEn}</p>
            </div>

            {/* Notice for Parents & Admin Unlock trigger */}
            <div className="bg-slate-100 rounded-2xl p-3 text-xs text-slate-600 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="text-[11px] leading-tight">
                  {language === 'bn' 
                    ? 'টিকা সম্পাদন শুধুমাত্র স্বাস্থ্যকর্মী/এডমিনের জন্য সংরক্ষিত।' 
                    : 'Editing is restricted to health worker / admin.'}
                </span>
              </div>
              {onUnlockAdmin && (
                <button
                  type="button"
                  onClick={onUnlockAdmin}
                  className="px-2.5 py-1 text-[11px] font-bold text-teal-800 bg-white hover:bg-teal-50 border border-slate-300 rounded-lg whitespace-nowrap transition-colors"
                >
                  {language === 'bn' ? 'স্বাস্থ্যকর্মী আনলক' : 'Admin Unlock'}
                </button>
              )}
            </div>

            {/* Close Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all"
              >
                {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>

          </div>
        ) : (

          /* ================= ADMIN / HEALTH WORKER EDITING FORM ================= */
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
            
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 flex items-center gap-2">
              <span className="font-bold">🩺 স্বাস্থ্যকর্মী / এডমিন মোড:</span>
              <span>আপনি এখন টিকা প্রদানের তারিখ ও তথ্য রেকর্ড/সম্পাদন করতে পারেন।</span>
            </div>

            {/* Recommended vs Given */}
            <div className="p-3 bg-teal-50/70 border border-teal-200/80 rounded-xl text-xs text-teal-900 space-y-1">
              <div className="flex justify-between">
                <span className="text-teal-700">{language === 'bn' ? 'নির্ধারিত সময়:' : 'Target Schedule:'}</span>
                <span className="font-semibold">{formatDateIso(calculatedDueDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-teal-700">{language === 'bn' ? 'প্রয়োগ পদ্ধতি ও স্থান:' : 'Route & Site:'}</span>
                <span className="font-semibold">{language === 'bn' ? `${vaccine.routeBn} (${vaccine.siteBn})` : `${vaccine.routeEn} (${vaccine.siteEn})`}</span>
              </div>
            </div>

            {/* Date Given */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-teal-600" />
                <span>{language === 'bn' ? 'টিকা দেওয়ার তারিখ (Date Administered)' : 'Date Administered'} *</span>
              </label>
              <input
                type="date"
                required
                value={dateGiven ?? ''}
                onChange={(e) => setDateGiven(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            {/* Health Center Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-teal-600" />
                <span>{language === 'bn' ? 'টিকাকেন্দ্র বা হাসপাতালের নাম' : 'Health Center / Clinic Name'}</span>
              </label>
              <input
                type="text"
                list="center-suggestions"
                value={centerName ?? ''}
                onChange={(e) => setCenterName(e.target.value)}
                placeholder={language === 'bn' ? 'যেমন: উপজেলা স্বাস্থ্য কমপ্লেক্স / ঢাকা মেডিকেল' : 'e.g. Upazila Health Complex'}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
              <datalist id="center-suggestions">
                {commonCenters.map((c, i) => (
                  <option key={i} value={c} />
                ))}
              </datalist>
            </div>

            {/* Batch Number & Health Worker Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  <span>{language === 'bn' ? 'টিকার ব্যাচ নং (Batch #)' : 'Lot / Batch Number'}</span>
                </label>
                <input
                  type="text"
                  value={batchNumber ?? ''}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  placeholder="e.g. PNT-8492"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>{language === 'bn' ? 'টিকাদানকারীর নাম / পদবি' : 'Administered By'}</span>
                </label>
                <input
                  type="text"
                  value={givenBy ?? ''}
                  onChange={(e) => setGivenBy(e.target.value)}
                  placeholder={language === 'bn' ? 'স্বাস্থ্য সহকারী / নার্স' : 'Health Assistant / Nurse'}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>

            {/* Reaction Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                {language === 'bn' ? 'পার্শ্বপ্রতিক্রিয়া বা কোনো পর্যবেক্ষণ (যদি থাকে):' : 'Reactions / Observation Notes:'}
              </label>
              <textarea
                rows={2}
                value={reactionNotes ?? ''}
                onChange={(e) => setReactionNotes(e.target.value)}
                placeholder={language === 'bn' ? 'যেমন: রাতে মৃদু জ্বর এসেছিল, পরদিন ভালো ছিল...' : 'e.g. Mild low-grade fever that settled next day...'}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
              {currentRecord?.isGiven && onDeleteRecord ? (
                <button
                  type="button"
                  onClick={() => {
                    onDeleteRecord(vaccine.id);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 hover:text-rose-800 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'রেকর্ড মুছুন' : 'Delete Record'}</span>
                </button>
              ) : <div />}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>{language === 'bn' ? 'সংরক্ষণ করুন' : 'Save Record'}</span>
                </button>
              </div>
            </div>

          </form>
        )}
      </div>
    </div>
  );
};
