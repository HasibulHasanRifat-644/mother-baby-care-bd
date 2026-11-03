import React, { useState } from 'react';
import { X, Check, AlertTriangle, ShieldCheck } from 'lucide-react';
import { PaymentMethod, SavingsGoal, SavingsTransaction } from '../../types/savings';
import { Language } from '../../types/vaccine';
import { formatDateIso, toBengaliNumerals } from '../../utils/dateCalculations';

interface WithdrawModalProps {
  isOpen: boolean;
  goals: SavingsGoal[];
  currentBalance: number;
  babyName: string;
  language: Language;
  onClose: () => void;
  onWithdraw: (transaction: Omit<SavingsTransaction, 'id' | 'createdAt'>) => void;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  goals,
  currentBalance,
  babyName,
  language,
  onClose,
  onWithdraw,
}) => {
  const [amount, setAmount] = useState<string>('');
  const [goalId, setGoalId] = useState<string>(goals[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bkash');
  const [withdrawnBy, setWithdrawnBy] = useState<string>('আম্মু');
  const [reason, setReason] = useState<string>('');
  const [date, setDate] = useState<string>(formatDateIso(new Date()));

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    if (numAmount > currentBalance) {
      alert(language === 'bn' ? 'দুঃখিত, পর্যাপ্ত ব্যালেন্স নেই!' : 'Insufficient balance!');
      return;
    }

    onWithdraw({
      babyId: goals[0]?.babyId || '',
      goalId: goalId || undefined,
      type: 'withdrawal',
      amount: numAmount,
      date,
      paymentMethod,
      note: reason.trim() || (language === 'bn' ? 'জরুরি প্রয়োজনে খরচ' : 'Emergency child expense'),
      contributorName: withdrawnBy.trim(),
    });
    onClose();
  };

  const parsedAmount = parseFloat(amount) || 0;
  const remaining = currentBalance - parsedAmount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-5 bg-rose-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center text-white">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {language === 'bn' ? 'ফান্ড থেকে জরুরি খরচ / উত্তোলন' : 'Emergency Child Expense'}
              </h3>
              <p className="text-xs text-rose-200">
                {babyName} · {language === 'bn' ? 'বর্তমান ব্যালেন্স:' : 'Current Balance:'} ৳{language === 'bn' ? toBengaliNumerals(currentBalance) : currentBalance}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-rose-200 hover:text-white hover:bg-rose-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning Callout */}
        <div className="bg-amber-50 p-4 border-b border-amber-200/80 text-xs text-amber-950 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p>
            {language === 'bn'
              ? 'সঞ্চয় ফান্ডটি শিশুর সুন্দর ভবিষ্যতের জন্য। শুধুমাত্র অপরিহার্য চিকিৎসা, ঔষধ বা বাচ্চার জরুরি প্রয়োজনে খরচ করার পরামর্শ দেওয়া হচ্ছে।'
              : 'This fund is for your child\'s secure future. Withdraw only for necessary pediatric medical or essential needs.'}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          
          {/* Amount */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              {language === 'bn' ? 'উত্তোলনের পরিমাণ (টাকা / ৳):' : 'Amount to Withdraw (BDT ৳):'} *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-lg">৳</span>
              <input
                type="number"
                min="10"
                max={currentBalance}
                step="10"
                required
                value={amount ?? ''}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="500"
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl pl-10 pr-4 py-3 text-2xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:bg-white transition-all font-mono"
              />
            </div>
            {parsedAmount > 0 && (
              <div className="text-xs flex justify-between font-medium pt-1">
                <span className="text-slate-500">{language === 'bn' ? 'অবশিষ্ট ব্যালেন্স থাকবে:' : 'Remaining balance:'}</span>
                <span className={remaining < 0 ? 'text-rose-600 font-bold' : 'text-slate-800 font-bold'}>
                  ৳{language === 'bn' ? toBengaliNumerals(Math.max(0, remaining)) : Math.max(0, remaining)}
                </span>
              </div>
            )}
          </div>

          {/* Reason / Purpose */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              {language === 'bn' ? 'খরচের কারণ / বিবরণ:' : 'Purpose / Expense Reason:'} *
            </label>
            <input
              type="text"
              required
              value={reason ?? ''}
              onChange={(e) => setReason(e.target.value)}
              placeholder={language === 'bn' ? 'যেমন: শিশু বিশেষজ্ঞ ডাক্তারের ফি ও রক্ত পরীক্ষা' : 'e.g. Pediatrician consultation & tests'}
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-600"
            />
          </div>

          {/* Goal allocation */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              {language === 'bn' ? 'কোন তহবিল থেকে নিচ্ছেন?' : 'Deduct From Goal:'}
            </label>
            <select
              value={goalId ?? ''}
              onChange={(e) => setGoalId(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-600"
            >
              <option value="">{language === 'bn' ? 'সাধারণ ওয়ালেট' : 'General Wallet'}</option>
              {goals.map((g) => (
                <option key={g.id} value={g.id}>
                  {language === 'bn' ? g.titleBn : g.title}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              {language === 'bn' ? 'তারিখ:' : 'Date:'}
            </label>
            <input
              type="date"
              required
              value={date ?? ''}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-600"
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
              disabled={parsedAmount <= 0 || parsedAmount > currentBalance}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-sm transition-all"
            >
              <Check className="w-4 h-4" />
              <span>{language === 'bn' ? 'উত্তোলন নিশ্চিত করুন' : 'Confirm Withdrawal'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
