import React, { useState } from 'react';
import { Droplet, PhoneCall, MapPin, Share2, AlertCircle, PlusCircle, Calendar, Hospital, Check } from 'lucide-react';
import { BloodRequest } from '../../types/community';
import { Language } from '../../types/vaccine';
import { formatDateIso, toBengaliNumerals } from '../../utils/dateCalculations';

interface BloodRequestBoardProps {
  requests: BloodRequest[];
  language: Language;
  onAddRequest: (req: Omit<BloodRequest, 'id' | 'createdAt'>) => void;
}

export const BloodRequestBoard: React.FC<BloodRequestBoardProps> = ({
  requests,
  language,
  onAddRequest,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [ageText, setAgeText] = useState('৮ মাস');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [hospitalName, setHospitalName] = useState('');
  const [hospitalLocation, setHospitalLocation] = useState('ঢাকা');
  const [bagsNeeded, setBagsNeeded] = useState(1);
  const [requiredDate, setRequiredDate] = useState(formatDateIso(new Date()));
  const [contactNumber, setContactNumber] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [details, setDetails] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !hospitalName.trim() || !contactNumber.trim()) return;

    onAddRequest({
      patientName: patientName.trim(),
      ageText: ageText.trim(),
      bloodGroup,
      hospitalName: hospitalName.trim(),
      hospitalLocation: hospitalLocation.trim(),
      bagsNeeded,
      requiredDate,
      contactNumber: contactNumber.trim(),
      contactPerson: contactPerson.trim() || 'অভিভাবক',
      urgency: 'urgent',
      details: details.trim() || 'জরুরি রক্তের প্রয়োজন। স্বেচ্ছাসেবী ভাইদের এগিয়ে আসার বিনীত অনুরোধ।',
    });

    setPatientName('');
    setHospitalName('');
    setContactNumber('');
    setIsModalOpen(false);
  };

  const handleShare = (req: BloodRequest) => {
    const text = `🚨 জরুরি রক্ত প্রয়োজন! 🚨\nরোগী: ${req.patientName} (${req.ageText})\nরক্তের গ্রুপ: ${req.bloodGroup} (${req.bagsNeeded} ব্যাগ)\nহাসপাতাল: ${req.hospitalName}, ${req.hospitalLocation}\nতারিখ: ${req.requiredDate}\nযোগাযোগ: ${req.contactNumber} (${req.contactPerson})\nবিবরণ: ${req.details}\n(বাংলাদেশ শিশু সুরক্ষা ও ব্লাড নেটওয়ার্ক)`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(req.id);
      setTimeout(() => setCopiedId(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Alert Header */}
      <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Droplet className="w-6 h-6 fill-white" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900">
              {language === 'bn' ? '🩸 জরুরি রক্তের সন্ধান ও শিশু সহায়তা কর্নার' : 'Emergency Pediatric Blood Support'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
              {language === 'bn'
                ? 'থ্যালাসেমিয়া, নবজাতকের অসুস্থতা বা প্রসূতি মায়ের জরুরি রক্তের প্রয়োজনে সরাসরি পোস্ট দিন এবং ফেসবুক ও হোয়াটসঅ্যাপে শেয়ার করুন।'
                : 'Emergency blood appeals for infants, pediatric surgeries, and thalassemia transfusions.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95 whitespace-nowrap shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{language === 'bn' ? 'রক্তের অনুরোধ পোস্ট করুন' : 'Post Blood Request'}</span>
        </button>
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {requests.map((req) => (
          <div
            key={req.id}
            className="bg-white border-2 border-rose-100 hover:border-rose-300 rounded-3xl p-5 shadow-xs transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Top Row: Group Badge + Hospital */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-rose-700 text-white flex flex-col items-center justify-center font-black text-xl shadow-xs">
                    <span>{req.bloodGroup}</span>
                    <span className="text-[10px] font-normal tracking-tight opacity-90">{language === 'bn' ? 'রক্ত' : 'Blood'}</span>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 leading-snug">
                      {req.patientName}
                    </h4>
                    <span className="text-xs text-rose-800 font-semibold">
                      {req.ageText} · {language === 'bn' ? `${toBengaliNumerals(req.bagsNeeded)} ব্যাগ প্রয়োজন` : `${req.bagsNeeded} Bag(s) needed`}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                  {req.urgency === 'critical' ? (language === 'bn' ? 'অতীব জরুরি' : 'Critical') : (language === 'bn' ? 'জরুরি' : 'Urgent')}
                </span>
              </div>

              {/* Location & Details */}
              <div className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 font-semibold text-slate-900">
                  <Hospital className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span className="truncate">{req.hospitalName}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{req.hospitalLocation}</span>
                  <span aria-hidden="true">·</span>
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{req.requiredDate}</span>
                </div>
                <p className="text-[11px] text-slate-600 italic pt-1 leading-relaxed">
                  "{req.details}"
                </p>
              </div>
            </div>

            {/* Bottom Contact Actions */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <a
                href={`tel:${req.contactNumber}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'সরাসরি কল' : 'Call Directly'}</span>
              </a>

              <button
                type="button"
                onClick={() => handleShare(req)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs transition-all"
              >
                {copiedId === req.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copiedId === req.id ? (language === 'bn' ? 'কপি হয়েছে!' : 'Copied!') : (language === 'bn' ? 'শেয়ার কার্ড কপি' : 'Share Appeal')}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-rose-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplet className="w-5 h-5 fill-white" />
                <h3 className="text-base font-bold">
                  {language === 'bn' ? 'জরুরি রক্তের অনুরোধ ফর্ম' : 'Emergency Blood Request Form'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-white hover:opacity-80"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">রোগীর নাম *</label>
                  <input
                    type="text"
                    required
                    value={patientName ?? ''}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="যেমন: আরিয়ান"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">রোগীর বয়স</label>
                  <input
                    type="text"
                    value={ageText ?? ''}
                    onChange={(e) => setAgeText(e.target.value)}
                    placeholder="যেমন: ৮ মাস"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">রক্তের গ্রুপ *</label>
                  <select
                    value={bloodGroup ?? 'O+'}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-bold"
                  >
                    {bloodGroups.map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">কত ব্যাগ প্রয়োজন?</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={bagsNeeded ?? 1}
                    onChange={(e) => setBagsNeeded(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">হাসপাতালের নাম *</label>
                <input
                  type="text"
                  required
                  value={hospitalName ?? ''}
                  onChange={(e) => setHospitalName(e.target.value)}
                  placeholder="যেমন: ঢাকা শিশু হাসপাতাল, শ্যামলী"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">যোগাযোগের মোবাইল নম্বর *</label>
                  <input
                    type="tel"
                    required
                    value={contactNumber ?? ''}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">যোগাযোগকারীর নাম ও সম্পর্ক</label>
                  <input
                    type="text"
                    value={contactPerson ?? ''}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="যেমন: পিতা / চাচা"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">অসুস্থতা বা জরুরি বিবরণ</label>
                <textarea
                  rows={2}
                  value={details ?? ''}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="যেমন: সার্জারির জন্য জরুরি রক্ত প্রয়োজন..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl"
                >
                  পোস্ট প্রকাশ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
