import React, { useState, useEffect } from 'react';
import { ShieldAlert, Lock, X, Check, KeyRound } from 'lucide-react';
import { Language } from '../types/vaccine';

interface AdminPinModalProps {
  isOpen: boolean;
  language: Language;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminPinModal: React.FC<AdminPinModalProps> = ({
  isOpen,
  language,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === '1234') {
      setError(false);
      onSuccess();
      onClose();
    } else {
      setError(true);
    }
  };

  const handleQuickDemoPin = () => {
    setPin('1234');
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        role="dialog" 
        aria-modal="true" 
        className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-slate-200 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-tight">
                {language === 'bn' ? 'স্বাস্থ্যকর্মী / এডমিন লগইন' : 'Health Worker / Admin Access'}
              </h3>
              <p className="text-[11px] text-teal-200">
                {language === 'bn' ? 'টিকা ব্যবস্থাপনা ও সম্পাদনা' : 'Vaccine Recording & Editing'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          <div className="text-xs text-slate-600 leading-relaxed bg-slate-50 border border-slate-200 p-3 rounded-2xl">
            <div className="flex items-start gap-2">
              <Lock className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <p>
                {language === 'bn'
                  ? 'টিকার তারিখ রেকর্ড, পরিবর্তন বা সম্পন্ন মার্ক করতে সঠিক ৪ ডিজিটের এডমিন পিন কোড দিন।'
                  : 'Enter the 4-digit health worker PIN code to edit, complete, or modify vaccination records.'}
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>{language === 'bn' ? 'এডমিন সিকিউরিটি পিন (PIN)' : 'Admin Security PIN'}</span>
              <button
                type="button"
                onClick={handleQuickDemoPin}
                className="text-[11px] text-teal-700 font-semibold hover:underline flex items-center gap-1"
              >
                <KeyRound className="w-3 h-3" />
                <span>{language === 'bn' ? 'ডেমো পিন: 1234' : 'Demo PIN: 1234'}</span>
              </button>
            </label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              autoFocus
              value={pin ?? ''}
              onChange={(e) => {
                setPin(e.target.value);
                if (error) setError(false);
              }}
              placeholder="••••"
              className="w-full text-center tracking-widest text-xl font-bold bg-white border border-slate-300 rounded-2xl py-2.5 px-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
            />
          </div>

          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium text-center animate-in fade-in">
              {language === 'bn'
                ? '⚠️ ভুল পিন কোড! অনুগ্রহ করে সঠিক পিন দিন (ডেমো পিন: 1234)।'
                : '⚠️ Incorrect PIN! Please enter the correct PIN (Demo: 1234).'}
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-3 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-3 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'আনলক করুন' : 'Unlock Admin'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
