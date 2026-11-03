import React, { useState } from 'react';
import { Utensils, AlertTriangle, CheckCircle2, Sparkles, Heart, Apple, Info } from 'lucide-react';
import { Language } from '../../types/vaccine';

interface NutritionGuideProps {
  language: Language;
}

export const NutritionGuide: React.FC<NutritionGuideProps> = ({ language }) => {
  const [activeStage, setActiveStage] = useState<'0-6' | '6-9' | '9-12' | '12plus'>('6-9');

  const stages = [
    { id: '0-6', label: '০ - ৬ মাস', title: 'শুধু মায়ের দুধ (Exclusive Breastfeeding)' },
    { id: '6-9', label: '৬ - ৯ মাস', title: 'প্রথম বাড়তি খাবার ও খিচুড়ি (Weaning Stage)' },
    { id: '9-12', label: '৯ - ১২ মাস', title: 'নরম পারিবারিক খাবার (Self-feeding)' },
    { id: '12plus', label: '১ বছর+', title: 'পারিবারিক পুষ্টিকর খাবার (Family Table)' },
  ];

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 sm:p-8 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
          <Utensils className="w-3.5 h-3.5 text-amber-700" />
          <span>{language === 'bn' ? 'শিশুর পুষ্টি ও পরিপূরক খাদ্য নির্দেশিকা' : 'Pediatric Nutrition & Weaning Guide'}</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {language === 'bn' ? 'সোনামণির পুষ্টি চার্ট ও ঘরে তৈরি স্বাস্থ্যকর রেসিপি' : 'Wholesome Baby Nutrition & Homemade Recipes'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
          {language === 'bn'
            ? 'শিশুর সঠিক শারীরিক ও মানসিক বিকাশের জন্য সময়মতো সঠিক পুষ্টিকর খাবার দেওয়া অপরিহার্য। ৬ মাস পর্যন্ত কেবল বুকের দুধ এবং ৬ মাস পর মায়ের দুধের পাশাপাশি নিরাপদ ঘরে তৈরি পুষ্টিকর খাবার নিশ্চিত করুন।'
            : 'Evidence-based pediatric nutrition guide tailored for Bangladeshi infants.'}
        </p>
      </div>

      {/* Stage Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {stages.map((st) => (
          <button
            key={st.id}
            type="button"
            onClick={() => setActiveStage(st.id as any)}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-2xl transition-all whitespace-nowrap shrink-0 border ${
              activeStage === st.id
                ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {st.label}
          </button>
        ))}
      </div>

      {/* Stage Details Content */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        
        {activeStage === '0-6' && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                🍼
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">
                  {language === 'bn' ? '০ থেকে ৬ মাস: শুধু মায়ের দুধের অমৃত সুধা' : '0-6 Months: Exclusive Breastfeeding'}
                </h4>
                <p className="text-xs text-teal-800 font-semibold">
                  {language === 'bn' ? 'এই বয়সে ১ ফোঁটা অতিরিক্ত পানিরও প্রয়োজন নেই!' : 'No water or outside formula required!'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-700 pt-2">
              <div className="bg-teal-50/70 p-4 rounded-2xl border border-teal-200 space-y-1.5">
                <span className="font-bold text-teal-900">শালদুধের গুরুত্ব:</span>
                <p className="leading-relaxed">
                  জন্মের ১ ঘণ্টার মধ্যে শিশুকে মায়ের প্রথম হলুদ গাঢ় শালদুধ (Colostrum) খাওয়ান। এটি শিশুর জীবনের প্রথম প্রাকৃতিক টিকা।
                </p>
              </div>
              <div className="bg-teal-50/70 p-4 rounded-2xl border border-teal-200 space-y-1.5">
                <span className="font-bold text-teal-900">পানির শূন্যতা নেই:</span>
                <p className="leading-relaxed">
                  মায়ের দুধে ৮৮% বিশুদ্ধ পানি থাকে। তাই প্রচণ্ড গরমেও ৬ মাসের আগে শিশুকে বাড়তি পানি, মধু বা মিষ্টি পানি দেওয়ার কোনো দরকার নেই।
                </p>
              </div>
              <div className="bg-teal-50/70 p-4 rounded-2xl border border-teal-200 space-y-1.5">
                <span className="font-bold text-teal-900">ঘন ঘন দুধ পান:</span>
                <p className="leading-relaxed">
                  ২৪ ঘণ্টায় কমপক্ষে ৮ থেকে ১২ বার কিংবা শিশুর চাহিদা অনুযায়ী যখনই সে ক্ষুধার্ত থাকে তখনই বুকের দুধ দিন।
                </p>
              </div>
            </div>
          </div>
        )}

        {activeStage === '6-9' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                🥣
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">
                  {language === 'bn' ? '৬ থেকে ৯ মাস: প্রথম শক্ত খাবার ও আদর্শ পুষ্টিকর খিচুড়ি' : '6-9 Months: First Complementary Weaning'}
                </h4>
                <p className="text-xs text-slate-500">
                  {language === 'bn' ? 'মুখেভাতের পর দিনে ২-৩ বার অল্প অল্প নরম পুষ্টিকর খাবার' : 'Small soft nutrient-rich meals 2-3 times daily'}
                </p>
              </div>
            </div>

            {/* Recipe Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  {language === 'bn' ? 'ঘরোয়া আদর্শ পুষ্টিকর নরম ডিম-সবজি খিচুড়ি রেসিপি' : 'Standard Pediatric Khichuri Recipe'}
                </span>
                <span className="text-[11px] font-semibold text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
                  {language === 'bn' ? 'সেরা খাবার' : 'Best Choice'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
                <div className="space-y-2">
                  <span className="font-bold text-slate-900">{language === 'bn' ? 'উপকরণসমূহ:' : 'Ingredients:'}</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                    <li>ভাতের সাধারণ চাল (২ চা চামচ)</li>
                    <li>হালকা ভাজা মুগ ডাল বা মসুর ডাল (১ চা চামচ)</li>
                    <li>মিষ্টি কুমড়া, গাজর ও পেঁপে কুচি (১ টেবিল চামচ)</li>
                    <li>সয়াবিন বা সরিষার খাঁটি তেল (আধা চা চামচ)</li>
                    <li>সেদ্ধ ডিমের কুসুমের অর্ধেক (প্রথম দিকে কুসুম দিয়ে শুরু)</li>
                    <li>এক চিমটি হলুদ গুঁড়া (লবণ ও চিনি ছাড়া)</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-slate-900">{language === 'bn' ? 'রান্নার সহজ নিয়ম:' : 'Preparation Method:'}</span>
                  <p className="leading-relaxed text-slate-600">
                    চাল ও ডাল ভালো করে ধুয়ে সবজিসহ পর্যাপ্ত পানিতে সেদ্ধ করে নরম জাউ বানান। নামানোর আগে তেল ও ডিমের কুসুম মিশিয়ে চামচ দিয়ে ভালো করে চটকে নিন। ব্লেন্ডার ব্যবহারের চেয়ে কাঁটা চামচ দিয়ে চটকে দেওয়া বাচ্চার চিবানোর অভ্যাস তৈরির জন্য বেশি উপকারী।
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeStage === '9-12' && (
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-slate-900">
              {language === 'bn' ? '৯ থেকে ১২ মাস: নরম পারিবারিক খাবার ও ফিঙ্গার ফুড' : '9-12 Months: Finger Foods & Family Meals'}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              এই বয়সে শিশুর মুখে দাঁত ওঠা শুরু হয় এবং সে নিজে হাতে খাবার ধরে মুখে দেওয়ার চেষ্টা করে। দিনে ৩ বার মূল খাবার এবং ১-২ বার পুষ্টিকর হালকা নাস্তা দিন।
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700 pt-2">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="font-bold text-slate-900">মাছ ও মুরগির নরম মাংস:</span>
                <p>কাঁটাহীন সেদ্ধ মাছ ও নরম মুরগির মাংস খিচুড়ির সাথে চটকে দেওয়া যাবে।</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="font-bold text-slate-900">ফিঙ্গার ফুড (হাতে খাবার):</span>
                <p>সেদ্ধ গাজরের লম্বা টুকরো, পাকা কলা বা মিষ্টি কদু বাচ্চার হাতে দিন যাতে সে নিজে খাওয়ার আনন্দ পায়।</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="font-bold text-slate-900">টকদই ও পুডিং:</span>
                <p>ঘরে পাতা মিষ্টিহীন নরম দই ও সুজি দিয়ে তৈরি পাতলা পুডিং পেটের জন্য খুব ভালো।</p>
              </div>
            </div>
          </div>
        )}

        {activeStage === '12plus' && (
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-slate-900">
              {language === 'bn' ? '১ বছর পূর্ণ হলে: পারিবারিক খাবার' : '12+ Months: Family Table Foods'}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              এক বছর পর শিশু পরিবারের অন্য সবার মতো স্বাভাবিক ভাত, মাছ, ডাল, সবজি অল্প ঝালে খেতে পারবে। এখন গরুর ফুটিয়ে নেওয়া দুধও পরিমিত পরিমাণে দেওয়া যায়।
            </p>
          </div>
        )}

      </div>

      {/* Crucial Forbidden Foods Before 1 Year Callout */}
      <div className="bg-rose-50 border-2 border-rose-200 rounded-3xl p-6 sm:p-7 space-y-3">
        <div className="flex items-center gap-2.5 text-rose-800 font-bold text-sm">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
          <span>{language === 'bn' ? '⚠️ ১ বছরের আগে শিশুকে যা দেওয়া কঠোরভাবে নিষেধ:' : 'Strictly Avoid Before 1 Year:'}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-1">
          <div className="bg-white p-3 rounded-2xl border border-rose-200">
            <span className="font-bold text-rose-900 block">১. কাঁচা লবণ</span>
            <p className="text-slate-600 text-[11px] mt-0.5">শিশুর অপরিপক্ব কিডনির ওপর মারাত্মক চাপ ফেলে।</p>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-rose-200">
            <span className="font-bold text-rose-900 block">২. চিনি ও মিষ্টি</span>
            <p className="text-slate-600 text-[11px] mt-0.5">দাঁতের ক্ষতি করে ও খাবারে অনীহা তৈরি করে।</p>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-rose-200">
            <span className="font-bold text-rose-900 block">৩. মধু</span>
            <p className="text-slate-600 text-[11px] mt-0.5">শিশু বোটুলিজম (Infant Botulism) নামক বিষক্রিয়া হতে পারে।</p>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-rose-200">
            <span className="font-bold text-rose-900 block">৪. গরুর তরল দুধ</span>
            <p className="text-slate-600 text-[11px] mt-0.5">পেটে রক্তক্ষরণ ও এলার্জি বা রক্তশূন্যতা সৃষ্টি করতে পারে।</p>
          </div>
        </div>
      </div>

    </div>
  );
};
