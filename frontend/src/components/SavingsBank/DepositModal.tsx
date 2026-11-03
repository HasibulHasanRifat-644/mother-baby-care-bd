import React, { useState } from 'react';
import { X, Check, Wallet, Heart, Sparkles, Building2 } from 'lucide-react';
import { PaymentMethod, SavingsGoal, SavingsTransaction } from '../../types/savings';
import { Language } from '../../types/vaccine';
import { formatDateIso, toBengaliNumerals } from '../../utils/dateCalculations';

interface DepositModalProps {
  isOpen: boolean;
  goals: SavingsGoal[];
  babyName: string;
  language: Language;
  onClose: () => void;
  onDeposit: (transaction: Omit<SavingsTransaction, 'id' | 'createdAt'>) => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  goals,
  babyName,
  language,
  onClose,
  onDeposit,
}) => {
  const [amount, setAmount] = useState<string>('1000');
  const [goalId, setGoalId] = useState<string>(goals[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bkash');
  const [contributorName, setContributorName] = useState<string>('আম্মু');
  const [note, setNote] = useState<string>('');
  const [date, setDate] = useState<string>(formatDateIso(new Date()));

  if (!isOpen) return null;

  const quickAmounts = [200, 500, 1000, 2000, 5000];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    onDeposit({
      babyId: goals[0]?.babyId || '',
      goalId: goalId || undefined,
      type: 'deposit',
      amount: numAmount,
      date,
      paymentMethod,
      note: note.trim() || (language === 'bn' ? `${contributorName}-এর ভালোবাসার সঞ্চয়` : `Savings by ${contributorName}`),
      contributorName: contributorName.trim(),
    });
    onClose();
  };

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
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {language === 'bn' ? 'সোনামণির ফান্ডে টাকা জমা' : 'Deposit to Baby Fund'}
              </h3>
              <p className="text-xs text-teal-200">
                {babyName} · {language === 'bn' ? 'ভবিষ্যতের জন্য ভালোবাসার সঞ্চয়' : "Loving savings for child's future"}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          
          {/* Amount Input & Quick Chips */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">
              {language === 'bn' ? 'জমার পরিমাণ (টাকা / BDT ৳):' : 'Deposit Amount (BDT ৳):'} *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-lg">৳</span>
              <input
                type="number"
                min="10"
                step="10"
                required
                value={amount ?? ''}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="1000"
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl pl-10 pr-4 py-3 text-2xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all font-mono"
              />
            </div>

            {/* Quick Chips */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[11px] text-slate-400 mr-1">{language === 'bn' ? 'দ্রুত নির্বাচন:' : 'Quick:'}</span>
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setAmount(String(q))}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${
                    amount === String(q)
                      ? 'bg-teal-700 text-white border-teal-700'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  ৳{language === 'bn' ? toBengaliNumerals(q) : q}
                </button>
              ))}
            </div>
          </div>

          {/* Target Goal Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              {language === 'bn' ? 'কোন তহবিলের জন্য জমা করবেন?' : 'Allocate to Savings Goal:'}
            </label>
            <select
              value={goalId}
              onChange={(e) => setGoalId(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              <option value="">{language === 'bn' ? 'সাধারণ সঞ্চয় ফান্ড' : 'General Savings Wallet'}</option>
              {goals.map((g) => (
                <option key={g.id} value={g.id}>
                  {language === 'bn' ? g.titleBn : g.title} (লক্ষ্য: ৳{language === 'bn' ? toBengaliNumerals(g.targetAmount) : g.targetAmount})
                </option>
              ))}
            </select>
          </div>

          {/* Payment Method / মাধ্যম */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              {language === 'bn' ? 'টাকা রাখার / জমার মাধ্যম:' : 'Payment or Storage Method:'}
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {[
                { id: 'bkash', label: 'বিকাশ', sub: 'bKash' },
                { id: 'nagad', label: 'নগদ', sub: 'Nagad' },
                { id: 'rocket', label: 'রকেট', sub: 'Rocket' },
                { id: 'bank', label: 'ব্যাংক', sub: 'Bank' },
                { id: 'cash_piggybank', label: 'মাটির ব্যাংক', sub: 'Piggybank' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                  className={`p-2 rounded-xl text-center border transition-all ${
                    paymentMethod === m.id
                      ? 'bg-teal-50 border-teal-600 text-teal-900 ring-1 ring-teal-600 font-bold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 text-xs'
                  }`}
                >
                  <div className="text-xs font-semibold">{m.label}</div>
                  <div className="text-[10px] text-slate-400">{m.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Contributor Name & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                {language === 'bn' ? 'কে দিচ্ছেন? (Contributor):' : 'Saved By:'}
              </label>
              <input
                type="text"
                list="contributors-list"
                value={contributorName ?? ''}
                onChange={(e) => setContributorName(e.target.value)}
                placeholder={language === 'bn' ? 'যেমন: আম্মু / নানু / আব্বু' : 'e.g. Mother / Grandfather'}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
              <datalist id="contributors-list">
                <option value="আম্মু" />
                <option value="আব্বু" />
                <option value="নানু" />
                <option value="দাদু" />
                <option value="খালামনি" />
                <option value="মামা" />
              </datalist>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                {language === 'bn' ? 'জমার তারিখ:' : 'Date:'}
              </label>
              <input
                type="date"
                required
                value={date ?? ''}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
          </div>

          {/* Blessing Note */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              <span>{language === 'bn' ? 'দোয়া, উপলক্ষ বা বার্তা (ঐচ্ছিক):' : 'Blessing Note / Purpose:'}</span>
            </label>
            <input
              type="text"
              value={note ?? ''}
              onChange={(e) => setNote(e.target.value)}
              placeholder={language === 'bn' ? 'যেমন: ঈদের সালামির টাকা / নানার শুভকামনা' : 'e.g. Eid gift money / Monthly home savings'}
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
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
              className="inline-flex items-center gap-1.5 px-6 py-2.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-sm transition-all active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>{language === 'bn' ? 'টাকা জমা নিশ্চিত করুন' : 'Confirm Deposit'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
