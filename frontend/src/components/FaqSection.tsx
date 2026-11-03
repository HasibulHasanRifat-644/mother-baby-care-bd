import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { Language } from '../types/vaccine';
import { FREQUENTLY_ASKED_QUESTIONS } from '../data/bangladeshEpiData';

interface FaqSectionProps {
  language: Language;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ language }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <section id="faq-section" className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>{language === 'bn' ? 'সচরাচর জিজ্ঞাসা' : 'Frequently Asked Questions'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {language === 'bn' ? 'মা-বাবাদের সাধারণ প্রশ্ন ও সমাধান' : 'Common Parent Questions & Expert Answers'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'bn' 
              ? 'বাংলাদেশ ইপিআই ও বিশ্ব স্বাস্থ্য সংস্থার নিয়মাবলি অনুযায়ী নির্ভরযোগ্য সমাধান।'
              : 'Reliable guidance based on DGHS Bangladesh and WHO immunization protocols.'}
          </p>
        </div>

        <div className="divide-y divide-slate-200 border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
          {FREQUENTLY_ASKED_QUESTIONS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="bg-white">
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full py-4 sm:py-5 px-5 sm:px-6 text-left flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900">
                    {language === 'bn' ? faq.questionBn : faq.questionEn}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-600">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/50 border-t border-slate-100">
                    {language === 'bn' ? faq.answerBn : faq.answerEn}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
