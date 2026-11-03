import React, { useState } from 'react';
import { 
  X, 
  PhoneCall, 
  MessageSquare, 
  Copy, 
  Check, 
  ShieldCheck, 
  Building2, 
  Clock, 
  MapPin, 
  HeartHandshake,
  UserCheck
} from 'lucide-react';
import { Language } from '../types/vaccine';

interface HealthAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  healthAssistantName?: string;
  healthAssistantPhone?: string;
  healthAssistantDesignation?: string;
  centerName?: string;
  district?: string;
  upazila?: string;
}

export const HealthAssistantModal: React.FC<HealthAssistantModalProps> = ({
  isOpen,
  onClose,
  language,
  healthAssistantName = 'মোছাঃ নাজমুন নাহার',
  healthAssistantPhone = '০১৭১২-৩৪৫৬৭৮',
  healthAssistantDesignation = 'স্বাস্থ্য সহকারী (ইপিআই টিকাদানকারী)',
  centerName = 'ধানমন্ডি মা ও শিশু কল্যাণ কেন্দ্র (EPI সেন্টার)',
  district = 'ঢাকা',
  upazila = 'ধানমন্ডি',
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const rawPhone = healthAssistantPhone.replace(/[^0-9+]/g, '');
  const cleanPhoneForDial = rawPhone.startsWith('+88') ? rawPhone : (rawPhone.startsWith('88') ? `+${rawPhone}` : `+88${rawPhone}`);
  const cleanWaNumber = rawPhone.replace(/^\+?88/, '');

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(healthAssistantPhone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-700 p-4 sm:p-5 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title={language === 'bn' ? 'বন্ধ করুন' : 'Close'}
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner shrink-0">
              💉
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
                {language === 'bn' ? 'সরকারি ইপিআই দায়িত্বপ্রাপ্ত টিকাদানকারী' : 'Assigned Govt EPI Vaccinator'}
              </span>
              <h3 className="text-base sm:text-lg font-bold leading-tight mt-0.5">
                {language === 'bn' ? 'স্বাস্থ্য সহকারীর তথ্য ও যোগাযোগ' : 'Health Assistant Contact'}
              </h3>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4">
          
          {/* Main Profile Card */}
          <div className="bg-gradient-to-b from-teal-50/70 to-emerald-50/40 border border-teal-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wide block">
                  {language === 'bn' ? 'নাম ও পদবি' : 'Name & Title'}
                </span>
                <h4 className="text-base sm:text-lg font-extrabold text-slate-900 mt-0.5">
                  {healthAssistantName}
                </h4>
                <p className="text-xs font-semibold text-teal-800 mt-0.5 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                  <span>{healthAssistantDesignation}</span>
                </p>
              </div>
              <span className="bg-teal-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                {language === 'bn' ? 'অনুমোদিত' : 'Verified'}
              </span>
            </div>

            {/* Center & Area */}
            <div className="pt-2.5 border-t border-teal-200/70 space-y-2 text-xs text-slate-700">
              <div className="flex items-start gap-2">
                <Building2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">{language === 'bn' ? 'দায়িত্বপ্রাপ্ত টিকাকেন্দ্র:' : 'Assigned Center:'}</span>
                  <span className="font-medium text-slate-700">{centerName}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-700 shrink-0" />
                <span className="font-medium text-slate-700">
                  {district}{upazila ? `, ${upazila}` : ''}
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="w-4 h-4 text-teal-700 shrink-0" />
                <span>{language === 'bn' ? 'সেবা সময়: সকাল ৮:০০ - দুপুর ২:৩০ (শুক্রবার ব্যতীত)' : 'Service Hours: 8:00 AM - 2:30 PM (Sun-Thu)'}</span>
              </div>
            </div>
          </div>

          {/* Phone Display Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">
                  {language === 'bn' ? 'মোবাইল নম্বর' : 'Phone Number'}
                </span>
                <span className="text-base sm:text-lg font-black text-slate-900 font-mono tracking-wider">
                  {healthAssistantPhone}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyPhone}
              className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? (language === 'bn' ? 'কপি হয়েছে' : 'Copied') : (language === 'bn' ? 'কপি' : 'Copy')}</span>
            </button>
          </div>

          {/* Action Buttons: Direct Call & WhatsApp */}
          <div className="grid grid-cols-2 gap-2.5">
            <a
              href={`tel:${cleanPhoneForDial}`}
              className="py-3 px-3 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md text-center"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{language === 'bn' ? 'সরাসরি কল করুন' : 'Direct Call'}</span>
            </a>

            <a
              href={`https://wa.me/88${cleanWaNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md text-center"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{language === 'bn' ? 'হোয়াটসঅ্যাপ চ্যাট' : 'WhatsApp'}</span>
            </a>
          </div>

          {/* Helpful Reassurance for Parents */}
          <div className="bg-amber-50 border border-amber-200/90 rounded-xl p-3 flex items-start gap-2 text-xs text-amber-950">
            <HeartHandshake className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {language === 'bn'
                ? 'টিকা সংক্রান্ত যেকোনো জিজ্ঞাসা, সেশন বা তারিখ নিশ্চিত করতে অথবা পার্শ্বপ্রতিক্রিয়া দেখা দিলে দ্বিধাহীনভাবে আপনার দায়িত্বপ্রাপ্ত স্বাস্থ্য সহকারীর সাথে কথা বলুন।'
                : 'Feel free to contact your assigned health assistant for session dates, questions, or after-vaccine care instructions.'}
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-100 px-5 py-3 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
