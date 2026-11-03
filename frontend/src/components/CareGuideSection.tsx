import React from 'react';
import { 
  HeartHandshake, 
  CheckCircle2, 
  XCircle, 
  AlertOctagon, 
  PhoneCall, 
  ExternalLink,
  ShieldAlert,
  Thermometer,
  Droplet
} from 'lucide-react';
import { Language } from '../types/vaccine';
import { BANGLADESH_HELPLINES } from '../data/bangladeshEpiData';

interface CareGuideSectionProps {
  language: Language;
}

export const CareGuideSection: React.FC<CareGuideSectionProps> = ({ language }) => {
  return (
    <section id="care-guide-section" className="py-12 bg-slate-50 border-t border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 uppercase tracking-wider">
            <HeartHandshake className="w-4 h-4" />
            <span>{language === 'bn' ? 'টিকা পরবর্তী যত্ন ও পরামর্শ' : 'Post-Vaccination Pediatric Care'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {language === 'bn' ? 'টিকা দেওয়ার পর করণীয় ও সতর্কতা' : 'What To Do & Avoid After Vaccination'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {language === 'bn'
              ? 'টিকা দেওয়ার পর সামান্য জ্বর বা ব্যথা স্বাভাবিক রোগ প্রতিরোধী প্রতিক্রিয়ার অংশ। সঠিক নিয়ম মেনে শিশুকে আরাম দিন।'
              : 'Mild soreness or low fever indicates the immune system is building protection. Follow safe pediatric practices.'}
          </p>
        </div>

        {/* 2-Column: What To Do vs What NOT To Do */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: What to DO (করণীয়) */}
          <div className="bg-white border border-emerald-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {language === 'bn' ? 'যা করবেন (করণীয়)' : 'Safe Recommended Care'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'bn' ? 'শিশুকে আরামদায়ক ও শান্ত রাখতে' : 'Keep your baby calm and comfortable'}
                </p>
              </div>
            </div>

            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>
                  <strong className="font-semibold text-slate-900">
                    {language === 'bn' ? 'ঠান্ডা পানির সেক:' : 'Cool Damp Compress:'}
                  </strong>{' '}
                  {language === 'bn'
                    ? 'টিকার স্থানে ব্যথা বা ফোলা থাকলে পরিষ্কার নরম সুতি কাপড় সাধারণ ঠান্ডা পানিতে ভিজিয়ে নিংড়ে আলতো করে সেক দিন।'
                    : 'Gently apply a clean cloth soaked in cool tap water to ease localized injection discomfort.'}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>
                  <strong className="font-semibold text-slate-900">
                    {language === 'bn' ? 'বেশি বেশি বুকের দুধ:' : 'Frequent Breastfeeding:'}
                  </strong>{' '}
                  {language === 'bn'
                    ? 'শিশুকে বারবার বুকের দুধ অথবা ৬ মাসের বেশি হলে পর্যাপ্ত তরল খাবার দিন যাতে পানিশূন্যতা না হয়।'
                    : 'Offer breast milk frequently to keep infant hydrated and comforted.'}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>
                  <strong className="font-semibold text-slate-900">
                    {language === 'bn' ? 'হালকা সুতি পোশাক:' : 'Light Cotton Clothing:'}
                  </strong>{' '}
                  {language === 'bn'
                    ? 'শরীরে বাতাস চলাচলের সুবিধার্থে ঢিলেঢালা সুতি পোশাক পরিয়ে রাখুন।'
                    : 'Dress in loose, breathable lightweight cotton clothes.'}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>
                  <strong className="font-semibold text-slate-900">
                    {language === 'bn' ? 'ডাক্তারের পরামর্শে প্যারাসিটামল:' : 'Pediatric Paracetamol:'}
                  </strong>{' '}
                  {language === 'bn'
                    ? 'জ্বর ১০০°F বা তার বেশি হলে বা অতিরিক্ত কান্নাকাটি করলে স্বাস্থ্যকর্মী বা চিকিৎসকের নির্দেশিত ডোজে ড্রপ/সিরাপ দিতে পারেন।'
                    : 'Administer pediatric paracetamol drops only if temperature reaches 100°F+ as prescribed.'}
                </span>
              </li>
            </ul>
          </div>

          {/* Card 2: What NOT to do (বর্জনীয়) */}
          <div className="bg-white border border-rose-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
                <XCircle className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {language === 'bn' ? 'যা করবেন না (বর্জনীয়)' : 'Strictly Avoid'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'bn' ? 'ভুল পদক্ষেপে সংক্রমণের ঝুঁকি বাড়ে' : 'Prevent infections and harmful mistakes'}
                </p>
              </div>
            </div>

            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                <span>
                  <strong className="font-semibold text-slate-900">
                    {language === 'bn' ? 'টিকার স্থানে মালিশ বা ঘষাঘষি নয়:' : 'Never Rub or Massage:'}
                  </strong>{' '}
                  {language === 'bn'
                    ? 'টিকা দেওয়ার স্থানে কোনো অবস্থাতেই হাত দিয়ে ডলাডলি, মালিশ বা চাপাচাপি করবেন না।'
                    : 'Do not rub, massage, or apply pressure to the puncture site.'}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                <span>
                  <strong className="font-semibold text-slate-900">
                    {language === 'bn' ? 'সরাসরি বরফ বা গরম সেক নিষেধ:' : 'No Ice or Hot Compress:'}
                  </strong>{' '}
                  {language === 'bn'
                    ? 'সরাসরি চামড়ায় বরফ ঘষা যাবে না এবং গরম কাপড় বা হিটার দিয়ে সেক দেওয়া কঠোরভাবে নিষিদ্ধ।'
                    : 'Never apply ice cubes directly to delicate infant skin or use hot compresses.'}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                <span>
                  <strong className="font-semibold text-slate-900">
                    {language === 'bn' ? 'বিসিজির ফোস্কা ফাটাবেন না:' : 'Do Not Burst BCG Blister:'}
                  </strong>{' '}
                  {language === 'bn'
                    ? 'বিসিজি টিকার ২-৩ সপ্তাহ পর হওয়া ফুসকুড়ি বা পুঁজযুক্ত ফোস্কা কখনোই সুই দিয়ে গলানো বা কোনো মলম লাগানো যাবে না। এটি প্রাকৃতিকভাবে শুকিয়ে দাগ বসবে।'
                    : 'The small papule or blister following BCG is completely normal. Never squeeze, pierce, or bandage it.'}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                <span>
                  <strong className="font-semibold text-slate-900">
                    {language === 'bn' ? 'অপ্রয়োজনীয় অ্যান্টিবায়োটিক নয়:' : 'No Unprescribed Antibiotics:'}
                  </strong>{' '}
                  {language === 'bn'
                    ? 'টিকার স্বাভাবিক প্রতিক্রিয়ার জন্য নিজ থেকে অ্যান্টিবায়োটিক বা ব্যথানাশক ওষুধ খাওয়াবেন না।'
                    : 'Never give adult painkillers, aspirin, or antibiotics without pediatrician orders.'}
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Emergency Red Flags Callout */}
        <div className="bg-amber-500/10 border border-amber-300 rounded-3xl p-6 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base sm:text-lg font-bold text-slate-900">
                {language === 'bn' ? '🚨 কখন অবিলম্বে ডাক্তারের কাছে যাবেন?' : '🚨 When to Seek Emergency Medical Attention'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-2xl">
                {language === 'bn'
                  ? 'যদি শিশুর টানা ৩ ঘণ্টার বেশি অবিরাম কান্নাকাটি থাকে, তীব্র জ্বর (১০৪°F বা বেশি), শরীর খিঁচুনি দেয়, শ্বাস নিতে কষ্ট হয় বা শিশু নিস্তেজ হয়ে পড়ে—তাহলে দেরি না করে অবিলম্বে নিকটস্থ হাসপাতালে যান।'
                  : 'If infant cries continuously for >3 hours, has high fever (>104°F) that does not respond to paracetamol, seizure, rapid breathing, or unusual lethargy, rush to hospital immediately.'}
              </p>
            </div>
          </div>

          <a
            href="tel:16263"
            className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-2xl shadow-sm transition-all whitespace-nowrap active:scale-95 shrink-0"
          >
            <PhoneCall className="w-4 h-4" />
            <span>{language === 'bn' ? '১৬২৬৩ স্বাস্থ্য বাতায়নে কল' : 'Call 16263 Shastho Batayan'}</span>
          </a>
        </div>

        {/* Bangladesh Emergency & Health Helplines Strip */}
        <div id="helpline-section" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">
              {language === 'bn' ? '📞 জরুরি স্বাস্থ্য ও সরকারি সেবা হেল্পলাইন' : '📞 Bangladesh Emergency & Health Helplines'}
            </h3>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              {language === 'bn' ? 'সরাসরি কল করতে ট্যাপ করুন' : 'Tap to dial directly'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {BANGLADESH_HELPLINES.map((hl) => (
              <a
                key={hl.number}
                href={`tel:${hl.number}`}
                className="p-4 bg-white border border-slate-200 rounded-2xl hover:border-teal-400 hover:shadow-xs transition-all flex flex-col justify-between space-y-2 group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-extrabold text-teal-700 font-mono group-hover:text-teal-800">
                      {hl.number}
                    </span>
                    <PhoneCall className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-1">
                    {language === 'bn' ? hl.nameBn : hl.nameEn}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    {language === 'bn' ? hl.descBn : hl.descEn}
                  </p>
                </div>
                <div className="text-[11px] font-semibold text-teal-700 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span>{language === 'bn' ? 'টোল-ফ্রি কল করুন' : 'Direct Call'}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </div>
              </a>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
