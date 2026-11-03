import React, { useState } from 'react';
import { X, Check, Target, Calendar } from 'lucide-react';
import { GoalCategory, SavingsGoal } from '../../types/savings';
import { Language } from '../../types/vaccine';
import { toBengaliNumerals } from '../../utils/dateCalculations';

interface GoalModalProps {
  isOpen: boolean;
  babyId: string;
  language: Language;
  onClose: () => void;
  onSaveGoal: (goal: Omit<SavingsGoal, 'id' | 'createdAt'>) => void;
}

export const GoalModal: React.FC<GoalModalProps> = ({
  isOpen,
  babyId,
  language,
  onClose,
  onSaveGoal,
}) => {
  const [titleBn, setTitleBn] = useState('');
  const [targetAmount, setTargetAmount] = useState('25000');
  const [category, setCategory] = useState<GoalCategory>('education');
  const [targetDate, setTargetDate] = useState('2028-12-31');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(targetAmount);
    if (!titleBn.trim() || isNaN(amount) || amount <= 0) return;

    onSaveGoal({
      babyId,
      title: titleBn.trim(),
      titleBn: titleBn.trim(),
      category,
      targetAmount: amount,
      targetDate,
    });
    onClose();
  };

  const sampleGoals = [
    { title: 'স্কুল ভর্তি ও কিন্ডারগার্টেন ফি', cat: 'education', amt: '30000' },
    { title: 'শিশুর স্বর্ণের অলংকার সঞ্চয়', cat: 'gold', amt: '75000' },
    { title: 'জরুরি শিশু আইসিইউ ও স্বাস্থ্য তহবিল', cat: 'medical', amt: '50000' },
    { title: '২য় জন্মদিন ও বিশেষ উপহার', cat: 'birthday', amt: '20000' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-5 bg-teal-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {language === 'bn' ? 'নতুন সঞ্চয় লক্ষ্য তৈরি' : 'Create New Savings Goal'}
              </h3>
              <p className="text-xs text-teal-200">
                {language === 'bn' ? 'নির্দিষ্ট লক্ষ্যের জন্য জমানোর আনন্দ' : 'Set dedicated targets for baby milestones'}
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
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          
          {/* Quick Ideas */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">
              {language === 'bn' ? 'জনপ্রিয় সঞ্চয় ধারণা থেকে বেছে নিন:' : 'Popular Goal Ideas:'}
            </span>
            <div className="grid grid-cols-2 gap-2">
              {sampleGoals.map((sg, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setTitleBn(sg.title);
                    setCategory(sg.cat as GoalCategory);
                    setTargetAmount(sg.amt);
                  }}
                  className="p-2 text-left bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-xl transition-all"
                >
                  <div className="text-xs font-semibold text-slate-800 truncate">{sg.title}</div>
                  <div className="text-[10px] text-teal-700">৳{language === 'bn' ? toBengaliNumerals(sg.amt) : sg.amt}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Goal Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              {language === 'bn' ? 'লক্ষ্যের নাম:' : 'Goal Name:'} *
            </label>
            <input
              type="text"
              required
              value={titleBn ?? ''}
              onChange={(e) => setTitleBn(e.target.value)}
              placeholder={language === 'bn' ? 'যেমন: কিন্ডারগার্টেন ও স্কুল ভর্তি তহবিল' : 'e.g. School Admission Fund'}
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          {/* Target Amount */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              {language === 'bn' ? 'লক্ষ্যমাত্রা (টাকা / BDT ৳):' : 'Target Amount (BDT ৳):'} *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">৳</span>
              <input
                type="number"
                min="500"
                step="500"
                required
                value={targetAmount ?? ''}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="25000"
                className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3.5 py-2 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 font-mono"
              />
            </div>
          </div>

          {/* Category & Target Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                {language === 'bn' ? 'ক্যাটাগরি:' : 'Category:'}
              </label>
              <select
                value={category ?? 'education'}
                onChange={(e) => setCategory(e.target.value as GoalCategory)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
              >
                <option value="education">{language === 'bn' ? '🎓 শিক্ষা ও স্কুল' : 'Education'}</option>
                <option value="medical">{language === 'bn' ? '🏥 স্বাস্থ্য ও চিকিৎসা' : 'Medical'}</option>
                <option value="birthday">{language === 'bn' ? '🎂 জন্মদিন ও স্মৃতি' : 'Birthday'}</option>
                <option value="gold">{language === 'bn' ? '🪙 স্বর্ণ ও ভবিষ্যৎ ডিপিএস' : 'Gold & DPS'}</option>
                <option value="general">{language === 'bn' ? '🌱 সাধারণ সঞ্চয়' : 'General'}</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                {language === 'bn' ? 'অর্জনের সময়কাল (ঐচ্ছিক):' : 'Target Date:'}
              </label>
              <input
                type="date"
                value={targetDate ?? ''}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-6 py-2.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-sm transition-all"
            >
              <Check className="w-4 h-4" />
              <span>{language === 'bn' ? 'লক্ষ্য সংরক্ষণ করুন' : 'Save Goal'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
