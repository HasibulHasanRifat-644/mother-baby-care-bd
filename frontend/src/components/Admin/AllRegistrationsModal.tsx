import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  Baby, 
  Users, 
  UserCheck, 
  Edit3, 
  Eye, 
  Calendar, 
  Phone, 
  Building2, 
  MapPin, 
  CheckCircle2, 
  ShieldCheck, 
  Save, 
  ArrowLeft,
  Filter,
  Download
} from 'lucide-react';
import { BabyProfile, Language } from '../../types/vaccine';
import { BANGLADESH_DISTRICTS, ParentUser } from '../../types/auth';
import { getRegisteredAccounts } from '../Auth/AuthModal';
import { BANGLADESH_VACCINES } from '../../data/bangladeshEpiData';
import { toBengaliNumerals, formatFriendlyDate, calculateAge } from '../../utils/dateCalculations';

interface AllRegistrationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  allBabies: BabyProfile[];
  currentBabyId: string;
  onSelectBaby: (babyId: string) => void;
  onSaveBaby: (updatedBaby: BabyProfile) => void;
}

export const AllRegistrationsModal: React.FC<AllRegistrationsModalProps> = ({
  isOpen,
  onClose,
  language,
  allBabies,
  currentBabyId,
  onSelectBaby,
  onSaveBaby,
}) => {
  const [activeTab, setActiveTab] = useState<'babies' | 'parents' | 'assistants'>('babies');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBabyForEdit, setSelectedBabyForEdit] = useState<BabyProfile | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Form states when editing a baby
  const [editName, setEditName] = useState('');
  const [editDob, setEditDob] = useState('');
  const [editGender, setEditGender] = useState<'boy' | 'girl' | 'other'>('boy');
  const [editChildOrder, setEditChildOrder] = useState<number>(1);
  const [editBloodGroup, setEditBloodGroup] = useState('');
  const [editBirthWeight, setEditBirthWeight] = useState('');
  const [editBrn, setEditBrn] = useState('');
  const [editHospital, setEditHospital] = useState('');
  const [editMotherName, setEditMotherName] = useState('');
  const [editFatherName, setEditFatherName] = useState('');
  const [editCenterName, setEditCenterName] = useState('');
  const [editDistrict, setEditDistrict] = useState('ঢাকা');
  const [editUpazila, setEditUpazila] = useState('');
  const [editHaName, setEditHaName] = useState('');
  const [editHaPhone, setEditHaPhone] = useState('');

  // Get registered accounts from registry
  const registeredAccounts = useMemo(() => getRegisteredAccounts(), [isOpen]);
  const registeredParents = useMemo(() => registeredAccounts.filter(u => u.userRole === 'parent'), [registeredAccounts]);
  const registeredAssistants = useMemo(() => registeredAccounts.filter(u => u.userRole === 'health_assistant'), [registeredAccounts]);

  // Open edit view for a baby
  const handleOpenEditBaby = (baby: BabyProfile) => {
    setSelectedBabyForEdit(baby);
    setEditName(baby.name);
    setEditDob(baby.dateOfBirth);
    setEditGender(baby.gender);
    setEditChildOrder(baby.childOrder ?? 1);
    setEditBloodGroup(baby.bloodGroup ?? '');
    setEditBirthWeight(baby.birthWeightKg ?? '');
    setEditBrn(baby.birthRegistrationNumber ?? '');
    setEditHospital(baby.hospitalOfBirth ?? '');
    setEditMotherName(baby.motherName ?? '');
    setEditFatherName(baby.fatherName ?? '');
    setEditCenterName(baby.epiCenterName ?? '');
    setEditDistrict(baby.district ?? 'ঢাকা');
    setEditUpazila(baby.upazila ?? '');
    setEditHaName(baby.healthAssistantName ?? '');
    setEditHaPhone(baby.healthAssistantPhone ?? '');
    setSaveSuccessMsg(null);
  };

  // Save changes made by Super Admin
  const handleSaveBabyChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBabyForEdit) return;

    const updated: BabyProfile = {
      ...selectedBabyForEdit,
      name: editName.trim() || selectedBabyForEdit.name,
      dateOfBirth: editDob || selectedBabyForEdit.dateOfBirth,
      gender: editGender,
      childOrder: editChildOrder,
      bloodGroup: editBloodGroup.trim(),
      birthWeightKg: editBirthWeight.trim(),
      birthRegistrationNumber: editBrn.trim(),
      hospitalOfBirth: editHospital.trim(),
      motherName: editMotherName.trim(),
      fatherName: editFatherName.trim(),
      epiCenterName: editCenterName.trim(),
      district: editDistrict,
      upazila: editUpazila.trim(),
      healthAssistantName: editHaName.trim(),
      healthAssistantPhone: editHaPhone.trim(),
    };

    onSaveBaby(updated);
    setSelectedBabyForEdit(updated);
    setSaveSuccessMsg(language === 'bn' ? '✅ তথ্য সফলভাবে পরিবর্তন ও আপডেট করা হয়েছে!' : '✅ Baby details updated successfully!');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  // Filtered babies list
  const filteredBabies = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return allBabies;
    return allBabies.filter(b => 
      b.name.toLowerCase().includes(q) ||
      (b.motherName && b.motherName.toLowerCase().includes(q)) ||
      (b.fatherName && b.fatherName.toLowerCase().includes(q)) ||
      (b.epiCenterName && b.epiCenterName.toLowerCase().includes(q)) ||
      (b.district && b.district.toLowerCase().includes(q)) ||
      (b.birthRegistrationNumber && b.birthRegistrationNumber.includes(q))
    );
  }, [allBabies, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-5xl w-full overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-teal-900 p-4 sm:p-5 text-white relative shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title={language === 'bn' ? 'বন্ধ করুন' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pr-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner shrink-0">
                👑
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
                  {language === 'bn' ? 'সুপার এডমিন ও ডেভেলপার কন্ট্রোল কনসোল' : 'Super Admin & Developer Console'}
                </span>
                <h3 className="text-lg sm:text-xl font-black leading-tight mt-0.5">
                  {language === 'bn' ? '📋 সব রেজিস্ট্রেশন ও ডাটাবেজ নিয়ন্ত্রণ' : 'All Registrations & Database Control'}
                </h3>
              </div>
            </div>

            {/* Quick Stats Badges */}
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-1 bg-white/15 rounded-xl font-bold flex items-center gap-1">
                <Baby className="w-3.5 h-3.5 text-teal-300" />
                <span>{language === 'bn' ? `মোট শিশু: ${toBengaliNumerals(allBabies.length)} জন` : `Babies: ${allBabies.length}`}</span>
              </span>
              <span className="px-2.5 py-1 bg-white/15 rounded-xl font-bold flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-amber-300" />
                <span>{language === 'bn' ? `অভিভাবক: ${toBengaliNumerals(registeredParents.length)} জন` : `Parents: ${registeredParents.length}`}</span>
              </span>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          {!selectedBabyForEdit && (
            <div className="mt-4 flex items-center gap-2 border-b border-white/20 pb-0">
              <button
                type="button"
                onClick={() => setActiveTab('babies')}
                className={`pb-2 px-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all border-b-2 cursor-pointer ${
                  activeTab === 'babies'
                    ? 'border-amber-400 text-amber-300'
                    : 'border-transparent text-white/70 hover:text-white'
                }`}
              >
                <Baby className="w-4 h-4" />
                <span>{language === 'bn' ? `নিবন্ধিত সকল শিশু (${toBengaliNumerals(allBabies.length)})` : `All Babies (${allBabies.length})`}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('parents')}
                className={`pb-2 px-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all border-b-2 cursor-pointer ${
                  activeTab === 'parents'
                    ? 'border-amber-400 text-amber-300'
                    : 'border-transparent text-white/70 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>{language === 'bn' ? `নিবন্ধিত অভিভাবক (${toBengaliNumerals(registeredParents.length)})` : `Parents (${registeredParents.length})`}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('assistants')}
                className={`pb-2 px-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all border-b-2 cursor-pointer ${
                  activeTab === 'assistants'
                    ? 'border-amber-400 text-amber-300'
                    : 'border-transparent text-white/70 hover:text-white'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>{language === 'bn' ? `স্বাস্থ্য সহকারী (${toBengaliNumerals(registeredAssistants.length)})` : `Assistants (${registeredAssistants.length})`}</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* ================= EDIT / CHANGE DATA SUBVIEW ================= */}
          {selectedBabyForEdit ? (
            <div className="space-y-4 animate-in fade-in duration-200">
              
              {/* Top Back & Header */}
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBabyForEdit(null);
                    setSaveSuccessMsg(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{language === 'bn' ? 'সব শিশুর তালিকায় ফিরুন' : 'Back to All Babies'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-xl border border-purple-200">
                    👑 {language === 'bn' ? 'সুপার এডমিন ডাটা এডিটর' : 'Super Admin Editor'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectBaby(selectedBabyForEdit.id);
                      onClose();
                    }}
                    className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                  >
                    <span>💉 {language === 'bn' ? 'টিকা ট্র্যাকার খুলুন' : 'Open Tracker'}</span>
                  </button>
                </div>
              </div>

              {saveSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              {/* Edit Form */}
              <form onSubmit={handleSaveBabyChanges} className="space-y-4">
                
                {/* 1. Baby Core Info */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Baby className="w-4 h-4 text-teal-700" />
                    <span>{language === 'bn' ? '১. শিশুর প্রাথমিক তথ্য' : '1. Child Core Info'}</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        {language === 'bn' ? 'শিশুর পূর্ণ নাম' : 'Child Full Name'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600 font-bold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        {language === 'bn' ? 'জন্মতারিখ' : 'Date of Birth'} *
                      </label>
                      <input
                        type="date"
                        required
                        value={editDob}
                        onChange={(e) => setEditDob(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600 font-bold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        {language === 'bn' ? 'শিশুর লিঙ্গ' : 'Gender'} *
                      </label>
                      <div className="grid grid-cols-3 gap-1">
                        <button
                          type="button"
                          onClick={() => setEditGender('boy')}
                          className={`py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                            editGender === 'boy' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200'
                          }`}
                        >
                          👦 {language === 'bn' ? 'ছেলে' : 'Boy'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditGender('girl')}
                          className={`py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                            editGender === 'girl' ? 'bg-pink-600 text-white border-pink-600' : 'bg-white text-slate-700 border-slate-200'
                          }`}
                        >
                          👧 {language === 'bn' ? 'মেয়ে' : 'Girl'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditGender('other')}
                          className={`py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                            editGender === 'other' ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-slate-700 border-slate-200'
                          }`}
                        >
                          👶 {language === 'bn' ? 'অন্যান্য' : 'Other'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        {language === 'bn' ? 'কত নম্বর সন্তান (১-১০)?' : 'Child Order'}
                      </label>
                      <select
                        value={editChildOrder}
                        onChange={(e) => setEditChildOrder(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600 font-bold cursor-pointer"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                          <option key={n} value={n}>
                            {['১ম', '২য়', '৩য়', '৪র্থ', '৫ম', '৬ষ্ঠ', '৭ম', '৮ম', '৯ম', '১০ম'][n - 1]} সন্তান ({n})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        {language === 'bn' ? 'রক্তের গ্রুপ' : 'Blood Group'}
                      </label>
                      <input
                        type="text"
                        value={editBloodGroup}
                        onChange={(e) => setEditBloodGroup(e.target.value)}
                        placeholder="যেমন: B+, A+, O+"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        {language === 'bn' ? 'জন্মের ওজন (কেজি)' : 'Birth Weight (kg)'}
                      </label>
                      <input
                        type="text"
                        value={editBirthWeight}
                        onChange={(e) => setEditBirthWeight(e.target.value)}
                        placeholder="যেমন: ৩.২"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        {language === 'bn' ? '১৭ সংখ্যার জন্ম নিবন্ধন (BRN)' : '17-digit BRN'}
                      </label>
                      <input
                        type="text"
                        value={editBrn}
                        onChange={(e) => setEditBrn(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="১৭ ডিজিট নম্বর"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Parents Info */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-purple-700" />
                    <span>{language === 'bn' ? '২. মা ও বাবার তথ্য' : '2. Parents Information'}</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        {language === 'bn' ? 'মাতার নাম' : "Mother's Name"}
                      </label>
                      <input
                        type="text"
                        value={editMotherName}
                        onChange={(e) => setEditMotherName(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        {language === 'bn' ? 'পিতার নাম' : "Father's Name"}
                      </label>
                      <input
                        type="text"
                        value={editFatherName}
                        onChange={(e) => setEditFatherName(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        {language === 'bn' ? 'জন্মস্থান / হাসপাতাল' : 'Birth Hospital'}
                      </label>
                      <input
                        type="text"
                        value={editHospital}
                        onChange={(e) => setEditHospital(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Center & Health Worker Management */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-indigo-700" />
                    <span>{language === 'bn' ? '৩. টিকাকেন্দ্র ও স্বাস্থ্য সহকারী নির্ধারণ (Super Admin Only)' : '3. Center & Health Assistant'}</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        {language === 'bn' ? 'দায়িত্বপ্রাপ্ত ইপিআই টিকাকেন্দ্রের নাম' : 'Assigned EPI Center Name'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={editCenterName}
                        onChange={(e) => setEditCenterName(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        {language === 'bn' ? 'জেলা' : 'District'}
                      </label>
                      <select
                        value={editDistrict}
                        onChange={(e) => setEditDistrict(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600 cursor-pointer"
                      >
                        {BANGLADESH_DISTRICTS.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        {language === 'bn' ? 'স্বাস্থ্য সহকারীর নাম' : 'Health Assistant Name'}
                      </label>
                      <input
                        type="text"
                        value={editHaName}
                        onChange={(e) => setEditHaName(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        {language === 'bn' ? 'স্বাস্থ্য সহকারীর মোবাইল নম্বর' : 'Health Assistant Phone'}
                      </label>
                      <input
                        type="text"
                        value={editHaPhone}
                        onChange={(e) => setEditHaPhone(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedBabyForEdit(null)}
                    className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    {language === 'bn' ? 'বাতিল' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    <span>{language === 'bn' ? '💾 পরিবর্তন সংরক্ষণ করুন' : 'Save Changes'}</span>
                  </button>
                </div>

              </form>

            </div>
          ) : (

            /* ================= ALL REGISTRATIONS LIST VIEW ================= */
            <div className="space-y-4">
              
              {/* Search & Filter Toolbar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={language === 'bn' ? 'শিশুর নাম, অভিভাবক, ফোন বা কেন্দ্র দিয়ে খুঁজুন...' : 'Search by name, parent, phone, center...'}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <div className="text-xs font-bold text-slate-600 flex items-center gap-2 shrink-0">
                  <Filter className="w-4 h-4 text-purple-700" />
                  <span>{language === 'bn' ? `মোট পাওয়া গেছে: ${toBengaliNumerals(filteredBabies.length)} জন` : `Found: ${filteredBabies.length}`}</span>
                </div>
              </div>

              {/* TAB 1: ALL REGISTERED BABIES (LIST AKARE BY THE BY) */}
              {activeTab === 'babies' && (
                <div className="space-y-3">
                  {filteredBabies.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-slate-500 text-xs">
                      {language === 'bn' ? 'কোনো নিবন্ধিত শিশুর তথ্য পাওয়া যায়নি।' : 'No registered baby profiles found.'}
                    </div>
                  ) : (
                    filteredBabies.map((baby, idx) => {
                      const completedCount = Object.values(baby.records || {}).filter(r => r.isGiven).length;
                      const totalVaccines = Object.keys(BANGLADESH_VACCINES).length;
                      const percent = Math.round((completedCount / totalVaccines) * 100);
                      const isCurrent = baby.id === currentBabyId;

                      return (
                        <div
                          key={baby.id}
                          className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                            isCurrent
                              ? 'bg-purple-50/70 border-purple-300 ring-2 ring-purple-600/20 shadow-xs'
                              : 'bg-white border-slate-200 hover:border-purple-300 hover:shadow-sm'
                          }`}
                        >
                          {/* Left: Baby Details */}
                          <div className="flex items-start gap-3.5 min-w-0">
                            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 font-bold flex items-center justify-center shrink-0 text-base shadow-inner">
                              {baby.gender === 'girl' ? '👧' : baby.gender === 'other' ? '👶' : '👦'}
                            </div>

                            <div className="space-y-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-extrabold text-sm sm:text-base text-slate-900 truncate">
                                  #{idx + 1} {baby.name}
                                </span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-900">
                                  {['১ম', '২য়', '৩য়', '৪র্থ', '৫ম', '৬ষ্ঠ', '৭ম', '৮ম', '৯ম', '১০ম'][(baby.childOrder || 1) - 1]} সন্তান
                                </span>
                                {baby.gender && (
                                  <span className="text-[10px] font-semibold text-slate-600">
                                    • {baby.gender === 'boy' ? 'ছেলে' : baby.gender === 'girl' ? 'মেয়ে' : 'অন্যান্য'}
                                  </span>
                                )}
                                {isCurrent && (
                                  <span className="text-[9px] font-black bg-teal-600 text-white px-2 py-0.5 rounded-full">
                                    {language === 'bn' ? 'সক্রিয় প্রোফাইল' : 'Active in Tracker'}
                                  </span>
                                )}
                              </div>

                              {/* Dates & Parents */}
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                                <span className="flex items-center gap-1 font-medium">
                                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                  <span>{formatFriendlyDate(baby.dateOfBirth, language)}</span>
                                </span>

                                {(baby.motherName || baby.fatherName) && (
                                  <span className="flex items-center gap-1 text-slate-700 font-semibold">
                                    <Users className="w-3.5 h-3.5 text-purple-600" />
                                    <span>অভিভাবক: {baby.motherName || baby.fatherName}</span>
                                  </span>
                                )}

                                {baby.epiCenterName && (
                                  <span className="flex items-center gap-1 text-slate-500">
                                    <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                                    <span className="truncate max-w-[200px]">{baby.epiCenterName}</span>
                                  </span>
                                )}
                              </div>

                              {/* BRN */}
                              {baby.birthRegistrationNumber && (
                                <p className="text-[11px] text-slate-500 font-mono">
                                  BRN: {baby.birthRegistrationNumber}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Right: Progress & Super Admin Actions */}
                          <div className="flex flex-row md:flex-col lg:flex-row items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                            
                            {/* Dose Progress */}
                            <div className="text-left md:text-right">
                              <span className="text-[10px] font-bold text-slate-500 block uppercase">
                                {language === 'bn' ? 'টিকার অগ্রগতি' : 'EPI Progress'}
                              </span>
                              <span className="text-xs font-black text-purple-900">
                                {toBengaliNumerals(completedCount)}/{toBengaliNumerals(totalVaccines)} ডোজ ({toBengaliNumerals(percent)}%)
                              </span>
                            </div>

                            {/* Buttons */}
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEditBaby(baby)}
                                className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                                title={language === 'bn' ? 'সকল বিস্তারিত তথ্য দেখুন এবং ডাটা পরিবর্তন করুন' : 'View details and edit data'}
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>{language === 'bn' ? 'তথ্য পরিবর্তন' : 'Edit Data'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  onSelectBaby(baby.id);
                                  onClose();
                                }}
                                className="px-2.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                                title={language === 'bn' ? 'এই শিশুর টিকা ট্র্যাকার খুলুন' : 'Open tracker'}
                              >
                                <Eye className="w-3.5 h-3.5 text-teal-600" />
                                <span className="hidden sm:inline">{language === 'bn' ? 'ট্র্যাকার' : 'View'}</span>
                              </button>
                            </div>

                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* TAB 2: REGISTERED PARENTS LIST */}
              {activeTab === 'parents' && (
                <div className="space-y-3">
                  {registeredParents.map((parent, idx) => (
                    <div key={parent.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm shrink-0">
                          {parent.role === 'father' ? '👨' : parent.role === 'guardian' ? '🤝' : '👩'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm text-slate-900">
                              #{idx + 1} {parent.fullName}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-900">
                              {parent.role === 'father' ? 'বাবা' : parent.role === 'guardian' ? 'অভিভাবক' : 'মা'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                            লগইন আইডি / ফোন: {parent.loginId || parent.phoneOrEmail} · শিশু: {parent.babyName || 'নিবন্ধিত'}
                          </p>
                        </div>
                      </div>

                      <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline">
                        যোগদান: {parent.joinedDate}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: REGISTERED HEALTH ASSISTANTS LIST */}
              {activeTab === 'assistants' && (
                <div className="space-y-3">
                  {registeredAssistants.map((assistant, idx) => (
                    <div key={assistant.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm shrink-0">
                          💉
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm text-slate-900">
                              #{idx + 1} {assistant.fullName}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900">
                              {assistant.govtEmployeeId || 'HA-ID'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {assistant.designation || 'স্বাস্থ্য সহকারী'} · {assistant.centerName || 'ইপিআই টিকাকেন্দ্র'} ({assistant.phoneOrEmail})
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg">
                        অনুমোদিত কর্মী
                      </span>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-100 px-5 py-3 flex items-center justify-between">
          <p className="text-[11px] text-slate-500 font-medium">
            👑 {language === 'bn' ? 'সুপার এডমিন হিসেবে আপনি যেকোনো শিশুর ডাটা সরাসরি পরিবর্তন বা সংশোধন করতে পারেন।' : 'Super Admin data authority enabled.'}
          </p>
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
