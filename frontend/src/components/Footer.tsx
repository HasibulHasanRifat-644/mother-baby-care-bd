import React from 'react';
import { PhoneCall, ShieldCheck, Heart } from 'lucide-react';
import { Language } from '../types/vaccine';

interface FooterProps {
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5 text-white font-bold text-base">
              <span className="text-xl">👶</span>
              <span>{language === 'bn' ? 'বাংলাদেশ শিশু টিকা ট্র্যাকার' : 'Bangladesh Baby Vaccine Tracker'}</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              {language === 'bn'
                ? 'সম্প্রসারিত টিকাদান কর্মসূচি (EPI), স্বাস্থ্য অধিদপ্তর, স্বাস্থ্য ও পরিবার কল্যাণ মন্ত্রণালয়, বাংলাদেশ সরকার কর্তৃক নির্ধারিত জাতীয় টিকাদান ক্যালেন্ডার অনুযায়ী প্রণীত।'
                : 'Formulated in accordance with the National Immunization Schedule by the Expanded Programme on Immunization (EPI), DGHS, Bangladesh.'}
            </p>
            <div className="flex items-center gap-2 text-teal-400 font-medium text-xs">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>{language === 'bn' ? 'সরকারি ইপিআই টিকা ১০০% বিনামূল্যে' : 'All Government EPI Vaccines are 100% Free'}</span>
            </div>
          </div>

          {/* Legal & Medical Disclaimer (Exact requested advisory) */}
          <div className="md:col-span-7 space-y-2 bg-slate-800/60 p-4 sm:p-5 rounded-2xl border border-slate-700/60 text-slate-300">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {language === 'bn' ? 'গুরুত্বপূর্ণ সচেতনতা ও উৎস:' : 'Important Advisory & Sources:'}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {language === 'bn'
                ? 'এই app শুধু reminder-এর জন্য, ডাক্তারের পরামর্শের বিকল্প নয়। Schedule: Bangladesh EPI (সূত্র: জাগো নিউজ, ১ এপ্রিল ২০২৬; ইপিআই নির্দেশিকা)। কোনো টিকা বাদ পড়লে ভয় পাবেন না, দ্রুত নিকটস্থ টিকাকেন্দ্রে যোগাযোগ করুন। Schedule বদলাতে পারে, তাই EPI কার্ড ও স্বাস্থ্যকর্মীর কথা অনুসরণ করুন।'
                : 'This application is designed solely as an informational reminder and does not replace medical counsel. Schedule: Bangladesh EPI. If any dose is missed, do not panic—contact your nearest healthcare clinic promptly. Schedule parameters may be updated; always consult official EPI cards and registered health workers.'}
            </p>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div className="flex items-center gap-1">
            <span>{language === 'bn' ? 'শিশুদের সুস্থ ভবিষ্যতের জন্য নিবেদিত' : 'Dedicated to every child\'s healthy future'}</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 ml-1 inline" />
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="tel:16263" 
              className="text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1"
            >
              <PhoneCall className="w-3 h-3" />
              <span>স্বাস্থ্য বাতায়ন ১৬২৬৩</span>
            </a>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span>© 2026 Bangladesh EPI Tracker</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
