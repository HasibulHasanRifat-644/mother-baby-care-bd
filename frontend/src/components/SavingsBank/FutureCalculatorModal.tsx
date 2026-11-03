import React, { useState } from 'react';
import { X, Calculator, TrendingUp, Sparkles, Award } from 'lucide-react';
import { Language } from '../../types/vaccine';
import { toBengaliNumerals } from '../../utils/dateCalculations';

interface FutureCalculatorModalProps {
  isOpen: boolean;
  language: Language;
  onClose: () => void;
}

export const FutureCalculatorModal: React.FC<FutureCalculatorModalProps> = ({
  isOpen,
  language,
  onClose,
}) => {
  const [monthlyAmount, setMonthlyAmount] = useState<number>(1000);
  const [years, setYears] = useState<number>(10);
  const [rate, setRate] = useState<number>(8); // 8% average DPS profit in BD

  if (!isOpen) return null;

  // Compound interest calculation for monthly recurring deposit (DPS):
  // Formula: M = P * [ ( (1 + r/n)^(nt) - 1 ) / (r/n) ] * (1 + r/n)
  const monthlyRate = rate / 100 / 12;
  const totalMonths = years * 12;
  const totalDeposited = monthlyAmount * totalMonths;
  
  const futureValue = monthlyAmount * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);
  const totalProfit = Math.max(0, futureValue - totalDeposited);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-5 bg-teal-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {language === 'bn' ? 'সোনামণির ভবিষ্যৎ ডিপিএস ক্যালকুলেটর' : 'Child Future DPS Savings Calculator'}
              </h3>
              <p className="text-xs text-teal-200">
                {language === 'bn' ? 'প্রতিদিনের ছোট সঞ্চয় কীভাবে ভবিষ্যতে বড় সম্পদে পরিণত হয়' : 'How small daily savings compound into a fortune'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-teal-200 hover:text-white hover:bg-teal-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Controls */}
          <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            
            {/* Monthly amount */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>{language === 'bn' ? 'প্রতি মাসে জমা (টাকা):' : 'Monthly Deposit (BDT):'}</span>
                <span className="font-bold text-teal-800 font-mono text-sm">
                  ৳{language === 'bn' ? toBengaliNumerals(monthlyAmount.toLocaleString()) : monthlyAmount.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="200"
                max="10000"
                step="100"
                value={monthlyAmount}
                onChange={(e) => setMonthlyAmount(Number(e.target.value))}
                className="w-full accent-teal-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>৳২০০</span>
                <span>৳৫,০০০</span>
                <span>৳১০,০০০</span>
              </div>
            </div>

            {/* Time period */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>{language === 'bn' ? 'সময়কাল (বছর):' : 'Duration (Years):'}</span>
                <span className="font-bold text-teal-800 font-mono text-sm">
                  {language === 'bn' ? `${toBengaliNumerals(years)} বছর` : `${years} Years`}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[3, 5, 10, 15].map((y) => (
                  <button
                    key={y}
                    type="button"
                    onClick={() => setYears(y)}
                    className={`py-1.5 text-xs font-bold rounded-xl border transition-all ${
                      years === y
                        ? 'bg-teal-700 text-white border-teal-700'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {language === 'bn' ? `${toBengaliNumerals(y)} বছর` : `${y} Yrs`}
                  </button>
                ))}
              </div>
            </div>

            {/* Profit rate */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-600">
                <span>{language === 'bn' ? 'ব্যাংক বা সঞ্চয় মুনাফার হার:' : 'Estimated Annual Profit Rate:'}</span>
                <span className="font-bold text-slate-800 font-mono">{rate}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="12"
                step="0.5"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full accent-teal-600"
              />
            </div>

          </div>

          {/* Results Summary Box */}
          <div className="bg-gradient-to-br from-teal-900 to-slate-900 text-white rounded-3xl p-5 sm:p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between text-xs text-teal-300 font-semibold border-b border-teal-800/80 pb-3">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-300" />
                {language === 'bn' ? `${toBengaliNumerals(years)} বছর পর সোনামণি পাবে:` : `After ${years} Years Baby Receives:`}
              </span>
              <span className="bg-teal-800/80 px-2 py-0.5 rounded text-[11px] font-mono">
                {totalMonths} {language === 'bn' ? 'মাসিক কিস্তি' : 'months'}
              </span>
            </div>

            {/* Big Future Value */}
            <div className="text-center py-2 space-y-1">
              <span className="text-xs text-teal-200 uppercase tracking-wider font-semibold">
                {language === 'bn' ? 'মোট আনুমানিক তহবিল' : 'Total Estimated Maturity Fund'}
              </span>
              <div className="text-3xl sm:text-4xl font-black text-amber-300 font-mono tracking-tight">
                ৳{language === 'bn' ? toBengaliNumerals(Math.round(futureValue).toLocaleString()) : Math.round(futureValue).toLocaleString()}
              </div>
            </div>

            {/* Breakdown row */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-teal-800/80 text-xs">
              <div className="bg-teal-950/60 p-2.5 rounded-xl border border-teal-800/50">
                <span className="text-teal-300 block text-[11px]">
                  {language === 'bn' ? 'আপনার মূল জমা:' : 'Your Total Deposit:'}
                </span>
                <span className="font-bold text-white font-mono text-sm">
                  ৳{language === 'bn' ? toBengaliNumerals(totalDeposited.toLocaleString()) : totalDeposited.toLocaleString()}
                </span>
              </div>
              <div className="bg-teal-950/60 p-2.5 rounded-xl border border-teal-800/50">
                <span className="text-teal-300 block text-[11px]">
                  {language === 'bn' ? 'প্রত্যাশিত অতিরিক্ত মুনাফা:' : 'Estimated Extra Return:'}
                </span>
                <span className="font-bold text-emerald-400 font-mono text-sm">
                  +৳{language === 'bn' ? toBengaliNumerals(Math.round(totalProfit).toLocaleString()) : Math.round(totalProfit).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Inspirational Child Milestones */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-950 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-emerald-900">
              <Award className="w-4 h-4 text-emerald-700" />
              <span>{language === 'bn' ? 'মায়ের এই সঞ্চয় শিশুর কী উপকারে আসবে?' : 'How this empowers your child:'}</span>
            </div>
            <p className="leading-relaxed">
              {years <= 5 
                ? (language === 'bn' ? 'বাচ্চার প্লে-স্কুল, কিন্ডারগার্টেন ভর্তি, চমৎকার খেলনা ও পুষ্টিকর খাবারের জোগান নিশ্চিত করবে।' : 'Secures early kindergarten admission, wholesome nutrition, and memorable childhood experiences.')
                : (language === 'bn' ? 'সন্তানের ক্যাডেট বা স্বনামধন্য স্কুলের ভর্তি ফি, ল্যাপটপ/কম্পিউটার এবং উচ্চশিক্ষার মজবুত ভিত্তি গড়ে তুলবে।' : 'Funds premier school entrance, education tech, and solid college foundation without financial stress.')}
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-teal-800 hover:bg-teal-900 rounded-xl transition-all"
          >
            {language === 'bn' ? 'ঠিক আছে' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
