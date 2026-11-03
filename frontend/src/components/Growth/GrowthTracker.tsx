import React, { useState } from 'react';
import { TrendingUp, Scale, Ruler, CheckCircle2, Award, Plus, Sparkles, AlertCircle } from 'lucide-react';
import { GrowthRecord, BabyMilestoneItem } from '../../types/community';
import { BabyProfile, Language } from '../../types/vaccine';
import { WHO_GROWTH_REFERENCE } from '../../data/communityData';
import { formatFriendlyDate, toBengaliNumerals, formatDateIso } from '../../utils/dateCalculations';

interface GrowthTrackerProps {
  currentBaby: BabyProfile;
  records: GrowthRecord[];
  milestones: BabyMilestoneItem[];
  language: Language;
  onAddRecord: (record: Omit<GrowthRecord, 'id'>) => void;
  onToggleMilestone: (milestoneId: string) => void;
}

export const GrowthTracker: React.FC<GrowthTrackerProps> = ({
  currentBaby,
  records,
  milestones,
  language,
  onAddRecord,
  onToggleMilestone,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [weightKg, setWeightKg] = useState('5.6');
  const [heightCm, setHeightCm] = useState('58.5');
  const [notes, setNotes] = useState('');
  const [recordDate, setRecordDate] = useState(formatDateIso(new Date()));

  const growthImage = '/src/assets/images/baby_growth_nutrition_1792750520340.jpg';

  // Latest record
  const latestRecord = records[records.length - 1];

  // WHO Reference comparison:
  // Approximate baby age in months from DOB
  const dob = new Date(currentBaby.dateOfBirth);
  const now = new Date();
  const diffDays = Math.max(0, Math.floor((now.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24)));
  const ageMonths = Math.min(15, Math.floor(diffDays / 30.4));

  // Determine median
  const isBoy = currentBaby.gender !== 'girl';
  const medianWeight = isBoy 
    ? (WHO_GROWTH_REFERENCE.boysWeightMedian[Math.min(ageMonths, 6)] || 7.0)
    : (WHO_GROWTH_REFERENCE.girlsWeightMedian[Math.min(ageMonths, 6)] || 6.5);

  const currentWeight = latestRecord?.weightKg || parseFloat(currentBaby.birthWeightKg || '3.2');
  
  // Weight status
  let statusTextBn = 'স্বাভাবিক ও চমৎকার ওজন বৃদ্ধি (Healthy)';
  let statusTextEn = 'Healthy Weight Growth';
  let statusColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';

  if (currentWeight < medianWeight * 0.8) {
    statusTextBn = 'ওজন কিছুটা কম (Underweight) - বাড়তি পুষ্টি দরকার';
    statusTextEn = 'Slightly Underweight - Nutrition Attention Needed';
    statusColor = 'text-amber-800 bg-amber-50 border-amber-300';
  } else if (currentWeight > medianWeight * 1.3) {
    statusTextBn = 'ওজন স্বাভাবিকের চেয়ে বেশি (Above Average)';
    statusTextEn = 'Above Average Weight';
    statusColor = 'text-blue-800 bg-blue-50 border-blue-200';
  }

  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weightKg);
    const h = parseFloat(heightCm);
    if (isNaN(w) || isNaN(h)) return;

    onAddRecord({
      babyId: currentBaby.id,
      date: recordDate,
      ageMonths,
      weightKg: w,
      heightCm: h,
      notes: notes.trim(),
    });

    setIsModalOpen(false);
  };

  const achievedMilestonesCount = milestones.filter(m => m.isAchieved).length;

  return (
    <div className="space-y-8">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-3xl overflow-hidden shadow-md text-white border border-teal-700/60">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-700/60 text-teal-200 text-xs font-semibold border border-teal-600/50">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'বিশ্ব স্বাস্থ্য সংস্থা (WHO) গ্রোথ ট্র্যাকার' : 'WHO Growth Standards Tracker'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
                {language === 'bn' ? `${currentBaby.name}-এর ওজন, উচ্চতা ও বিকাশ` : `${currentBaby.name}'s Growth & Development`}
              </h2>
              <p className="text-xs sm:text-sm text-teal-100 leading-relaxed max-w-xl">
                {language === 'bn'
                  ? 'প্রতি মাসে শিশুর সঠিক ওজন বৃদ্ধি সুস্থতার প্রধান লক্ষণ। নিয়মিত ওজন ও উচ্চতা ট্র্যাক করে শিশুর শারীরিক বিকাশ নিশ্চিত করুন।'
                  : 'Track monthly weight, height, and vital cognitive/motor milestones against international pediatric benchmarks.'}
              </p>
            </div>

            {/* Quick KPI Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-teal-950/60 border border-teal-600/40 rounded-2xl p-3.5">
                <span className="text-[11px] text-teal-300 flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5 text-teal-400" />
                  {language === 'bn' ? 'সর্বশেষ ওজন:' : 'Latest Weight:'}
                </span>
                <div className="text-2xl font-black text-amber-300 font-mono mt-0.5">
                  {language === 'bn' ? `${toBengaliNumerals(currentWeight)} কেজি` : `${currentWeight} kg`}
                </div>
              </div>

              <div className="bg-teal-950/60 border border-teal-600/40 rounded-2xl p-3.5">
                <span className="text-[11px] text-teal-300 flex items-center gap-1">
                  <Ruler className="w-3.5 h-3.5 text-teal-400" />
                  {language === 'bn' ? 'সর্বশেষ উচ্চতা:' : 'Latest Length:'}
                </span>
                <div className="text-2xl font-black text-teal-200 font-mono mt-0.5">
                  {latestRecord?.heightCm ? (language === 'bn' ? `${toBengaliNumerals(latestRecord.heightCm)} সেমি` : `${latestRecord.heightCm} cm`) : '৫০ সেমি'}
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 bg-teal-950/60 border border-teal-600/40 rounded-2xl p-3.5 flex flex-col justify-center">
                <span className="text-[11px] text-teal-300 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-300" />
                  {language === 'bn' ? 'মাইলস্টোন সম্পন্ন:' : 'Milestones:'}
                </span>
                <div className="text-lg font-bold text-white mt-0.5">
                  {language === 'bn' ? `${toBengaliNumerals(achievedMilestonesCount)}/${toBengaliNumerals(milestones.length)}` : `${achievedMilestonesCount}/${milestones.length}`}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95"
              >
                <Plus className="w-4 h-4 text-slate-950" />
                <span>{language === 'bn' ? 'নতুন পরিমাপ রেকর্ড করুন' : 'Add Measurement'}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 h-full p-4 sm:p-6 lg:p-8 flex justify-center">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-teal-600/50 max-w-sm w-full group">
              <img
                src={growthImage}
                alt="Baby nutrition bowl with khichuri and height chart"
                className="w-full h-64 object-cover object-center group-hover:scale-102 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

        </div>
      </div>

      {/* WHO Growth Status Callout */}
      <div className={`p-4 sm:p-5 rounded-2xl border ${statusColor} flex items-center justify-between gap-4`}>
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <div>
            <h4 className="text-sm font-bold">
              {language === 'bn' ? `বিশ্ব স্বাস্থ্য সংস্থা (WHO) মূল্যায়ন: ${statusTextBn}` : `WHO Evaluation: ${statusTextEn}`}
            </h4>
            <p className="text-xs opacity-90 mt-0.5">
              {language === 'bn'
                ? `এই বয়সে বিশ্ব স্বাস্থ্য সংস্থার নির্দেশিত গড় মানদণ্ড প্রায় ${toBengaliNumerals(medianWeight)} কেজি।`
                : `Reference median weight for this age group is ~${medianWeight} kg.`}
            </p>
          </div>
        </div>
      </div>

      {/* Milestones Checklist Grid */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs space-y-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">
            {language === 'bn' ? '🌟 শিশুর বিকাশের সোনালী মাইলস্টোন (Developmental Milestones)' : 'Child Developmental Milestones'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'bn'
              ? 'আপনার সোনামণি যখন যেটি অর্জন করবে, টিকচিহ্ন দিয়ে স্মৃতি হিসেবে সংরক্ষণ করুন।'
              : 'Check off milestones as your little one hits each developmental wonder.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {milestones.map((m) => (
            <div
              key={m.id}
              onClick={() => onToggleMilestone(m.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 select-none ${
                m.isAchieved
                  ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-400/40 shadow-xs'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100/60'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60">
                    {language === 'bn' ? `বয়স: ~${toBengaliNumerals(m.targetMonth)} মাস` : `~${m.targetMonth} months`}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1.5">
                    {language === 'bn' ? m.titleBn : m.titleEn}
                  </h4>
                </div>
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  m.isAchieved ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white'
                }`}>
                  {m.isAchieved && <CheckCircle2 className="w-4 h-4" />}
                </div>
              </div>

              {m.note && (
                <p className="text-[11px] text-slate-600 italic">
                  "{m.note}"
                </p>
              )}

              <div className="text-[11px] font-semibold pt-1 border-t border-slate-200/50 flex justify-between items-center">
                <span className={m.isAchieved ? 'text-emerald-700' : 'text-slate-400'}>
                  {m.isAchieved ? (language === 'bn' ? '✓ অর্জিত হয়েছে' : '✓ Achieved') : (language === 'bn' ? 'অপেক্ষিত' : 'Pending')}
                </span>
                {m.achievedDate && (
                  <span className="text-slate-500 font-mono text-[10px]">
                    {formatFriendlyDate(m.achievedDate, language)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Measurement History Logs */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">
            {language === 'bn' ? 'পরিমাপ ইতিহাস (Growth History Log)' : 'Measurement History Logs'}
          </h3>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="text-xs font-semibold text-teal-700 hover:underline"
          >
            {language === 'bn' ? '+ নতুন পরিমাপ' : '+ Add Record'}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">তারিখ</th>
                <th className="py-2.5 px-3">বয়স</th>
                <th className="py-2.5 px-3">ওজন (কেজি)</th>
                <th className="py-2.5 px-3">উচ্চতা (সেমি)</th>
                <th className="py-2.5 px-3">মন্তব্য / টিকাকেন্দ্র</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/60">
                  <td className="py-2.5 px-3 font-medium text-slate-700 whitespace-nowrap">
                    {formatFriendlyDate(r.date, language)}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    {language === 'bn' ? `${toBengaliNumerals(r.ageMonths)} মাস` : `${r.ageMonths}m`}
                  </td>
                  <td className="py-2.5 px-3 font-bold font-mono text-slate-900 whitespace-nowrap">
                    {language === 'bn' ? `${toBengaliNumerals(r.weightKg)} কেজি` : `${r.weightKg} kg`}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-700 whitespace-nowrap">
                    {language === 'bn' ? `${toBengaliNumerals(r.heightCm)} সেমি` : `${r.heightCm} cm`}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">
                    {r.notes || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Measurement Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {language === 'bn' ? 'সোনামণির ওজন ও উচ্চতা রেকর্ড' : 'Record Weight & Height'}
            </h3>

            <form onSubmit={handleSaveRecord} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">ওজন (কেজি) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={weightKg ?? ''}
                    onChange={(e) => setWeightKg(e.target.value)}
                    placeholder="5.6"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-mono font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">উচ্চতা / দৈর্ঘ্য (সেমি) *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={heightCm ?? ''}
                    onChange={(e) => setHeightCm(e.target.value)}
                    placeholder="58.5"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">পরিমাপের তারিখ</label>
                <input
                  type="date"
                  required
                  value={recordDate ?? ''}
                  onChange={(e) => setRecordDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">মন্তব্য (ঐচ্ছিক)</label>
                <input
                  type="text"
                  value={notes ?? ''}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="যেমন: টিকাকেন্দ্রে মাপা হয়েছে"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
