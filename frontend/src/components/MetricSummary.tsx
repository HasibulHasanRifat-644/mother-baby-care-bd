import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, CalendarDays, ArrowRight } from 'lucide-react';
import { Language, VaccineStatus } from '../types/vaccine';
import { toBengaliNumerals } from '../utils/dateCalculations';

interface MetricSummaryProps {
  stats: {
    done: number;
    dueSoon: number;
    overdue: number;
    upcoming: number;
    total: number;
  };
  language: Language;
  onFilterClick: (status: VaccineStatus | 'all') => void;
  activeFilter: VaccineStatus | 'all';
}

export const MetricSummary: React.FC<MetricSummaryProps> = ({
  stats,
  language,
  onFilterClick,
  activeFilter,
}) => {
  const completionPercentage = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  return (
    <section className="bg-slate-50 border-b border-slate-200 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          
          {/* 1. Done */}
          <button
            type="button"
            onClick={() => onFilterClick('done')}
            className={`text-left p-4 sm:p-5 rounded-2xl transition-all border ${
              activeFilter === 'done'
                ? 'bg-emerald-50/90 border-emerald-400 ring-2 ring-emerald-500/20 shadow-sm'
                : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-700">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {language === 'bn' ? 'সম্পন্ন (Done)' : 'Done'}
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tabular-nums">
                {language === 'bn' ? toBengaliNumerals(stats.done) : stats.done}
              </span>
              <span className="text-xs text-slate-500">
                / {language === 'bn' ? toBengaliNumerals(stats.total) : stats.total}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {language === 'bn' ? 'টিকা সম্পন্ন হয়েছে' : 'Doses completed'}
            </p>
          </button>

          {/* 2. Due Soon */}
          <button
            type="button"
            onClick={() => onFilterClick('due-soon')}
            className={`text-left p-4 sm:p-5 rounded-2xl transition-all border ${
              activeFilter === 'due-soon'
                ? 'bg-amber-50/90 border-amber-400 ring-2 ring-amber-500/20 shadow-sm'
                : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold text-amber-700">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                {language === 'bn' ? 'আসছে (Due soon)' : 'Due soon'}
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tabular-nums">
                {language === 'bn' ? toBengaliNumerals(stats.dueSoon) : stats.dueSoon}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {language === 'bn' ? 'আগামী ১৪ দিনের মধ্যে' : 'Within next 14 days'}
            </p>
          </button>

          {/* 3. Overdue */}
          <button
            type="button"
            onClick={() => onFilterClick('overdue')}
            className={`text-left p-4 sm:p-5 rounded-2xl transition-all border ${
              activeFilter === 'overdue'
                ? 'bg-rose-50/90 border-rose-400 ring-2 ring-rose-500/20 shadow-sm'
                : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold text-rose-700">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                {language === 'bn' ? 'সময় পার (Overdue)' : 'Overdue'}
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tabular-nums">
                {language === 'bn' ? toBengaliNumerals(stats.overdue) : stats.overdue}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {language === 'bn' ? 'তারিখ অতিক্রম করেছে' : 'Passed scheduled date'}
            </p>
          </button>

          {/* 4. Upcoming / Future */}
          <button
            type="button"
            onClick={() => onFilterClick('upcoming')}
            className={`text-left p-4 sm:p-5 rounded-2xl transition-all border ${
              activeFilter === 'upcoming'
                ? 'bg-teal-50/90 border-teal-400 ring-2 ring-teal-500/20 shadow-sm'
                : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4 text-slate-500" />
                {language === 'bn' ? 'অপেক্ষমাণ (Upcoming)' : 'Upcoming'}
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tabular-nums">
                {language === 'bn' ? toBengaliNumerals(stats.upcoming) : stats.upcoming}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {language === 'bn' ? 'পরবর্তী ধাপের জন্য' : 'Scheduled future doses'}
            </p>
          </button>

        </div>

        {/* Progress Bar & Reassurance */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-2/3 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>{language === 'bn' ? 'মোট টিকাদান অগ্রগতি (Immunization Progress)' : 'Overall Immunization Progress'}</span>
              <span className="font-mono tabular-nums text-teal-700">
                {language === 'bn' ? `${toBengaliNumerals(completionPercentage)}% সম্পন্ন` : `${completionPercentage}% Completed`}
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-600 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          <div className="w-full sm:w-auto flex items-center justify-end gap-3 text-xs">
            {stats.overdue > 0 ? (
              <div className="flex items-center gap-2 text-rose-800 font-medium bg-rose-50 border border-rose-200 px-3 py-2 rounded-xl">
                <span>{language === 'bn' ? 'নিকটস্থ টিকাকেন্দ্রে দ্রুত যোগাযোগ করুন' : 'Visit clinic for overdue vaccines'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            ) : stats.dueSoon > 0 ? (
              <div className="flex items-center gap-2 text-amber-800 font-medium bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl">
                <span>{language === 'bn' ? 'আসন্ন টিকার প্রস্তুতি নিন' : 'Prepare for upcoming session'}</span>
              </div>
            ) : stats.done === stats.total && stats.total > 0 ? (
              <div className="flex items-center gap-2 text-emerald-800 font-semibold bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{language === 'bn' ? 'সকল ইপিআই টিকা সম্পন্ন!' : 'All EPI vaccines completed!'}</span>
              </div>
            ) : (
              <div className="text-slate-500">
                {language === 'bn' ? 'সময়সূচি অনুযায়ী টিকা প্রদান করুন' : 'Follow national schedule timeline'}
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
