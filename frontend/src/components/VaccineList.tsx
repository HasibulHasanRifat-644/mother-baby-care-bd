import React, { useState, useMemo } from 'react';
import { 
  Check, 
  Clock, 
  AlertTriangle, 
  Calendar, 
  Search, 
  Download, 
  Info, 
  CheckCircle, 
  Syringe, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  Eye, 
  ChevronDown, 
  ChevronUp, 
  Building2 
} from 'lucide-react';
import { BabyProfile, Language, VaccineStatus, VaccineInfo } from '../types/vaccine';
import { BANGLADESH_EPI_MILESTONES, BANGLADESH_VACCINES } from '../data/bangladeshEpiData';
import { 
  calculateDueDate, 
  formatFriendlyDate, 
  getVaccineStatus, 
  getDaysDiff, 
  toBengaliNumerals, 
  generateIcsCalendar, 
  triggerFileDownload 
} from '../utils/dateCalculations';
import { AdminPinModal } from './AdminPinModal';

interface VaccineListProps {
  currentBaby: BabyProfile;
  language: Language;
  activeFilter: VaccineStatus | 'all';
  isAdminMode?: boolean;
  onFilterChange: (filter: VaccineStatus | 'all') => void;
  onOpenRecordModal: (vaccine: VaccineInfo, isAlreadyGiven: boolean) => void;
  onQuickToggleVaccine: (vaccineId: string) => void;
  onMarkMilestoneAllDone: (milestoneId: string) => void;
  onToggleAdminMode?: (admin: boolean) => void;
  onOpenAdminPinModal?: () => void;
}

export const VaccineList: React.FC<VaccineListProps> = ({
  currentBaby,
  language,
  activeFilter,
  isAdminMode = false,
  onFilterChange,
  onOpenRecordModal,
  onQuickToggleVaccine,
  onMarkMilestoneAllDone,
  onToggleAdminMode,
  onOpenAdminPinModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});
  const [isInternalPinModalOpen, setIsInternalPinModalOpen] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedNotes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOpenPinModal = () => {
    if (onOpenAdminPinModal) {
      onOpenAdminPinModal();
    } else {
      setIsInternalPinModalOpen(true);
    }
  };

  const handlePinSuccess = () => {
    if (onToggleAdminMode) {
      onToggleAdminMode(true);
    }
  };

  const handleExitAdmin = () => {
    if (onToggleAdminMode) {
      onToggleAdminMode(false);
    }
  };

  // Pre-calculate status for all vaccines
  const vaccineStatusMap = useMemo(() => {
    const map: Record<string, { dueDate: Date; status: VaccineStatus; daysDiff: number }> = {};
    Object.values(BANGLADESH_VACCINES).forEach(vac => {
      const dueDate = calculateDueDate(currentBaby.dateOfBirth, vac.dayOffset);
      const isGiven = !!currentBaby.records[vac.id]?.isGiven;
      const status = getVaccineStatus(dueDate, isGiven);
      const daysDiff = getDaysDiff(dueDate);
      map[vac.id] = { dueDate, status, daysDiff };
    });
    return map;
  }, [currentBaby.dateOfBirth, currentBaby.records]);

  // Overall statistics for parents to easily see total doses and progress
  const doseStats = useMemo(() => {
    const totalDoses = Object.keys(BANGLADESH_VACCINES).length;
    const completedDoses = Object.values(BANGLADESH_VACCINES).filter(
      v => !!currentBaby.records[v.id]?.isGiven
    ).length;
    const remainingDoses = totalDoses - completedDoses;
    return { totalDoses, completedDoses, remainingDoses };
  }, [currentBaby.records]);

  // Handle Export Reminders
  const handleExportCalendar = () => {
    const events: Array<{ title: string; date: Date; description: string }> = [];

    BANGLADESH_EPI_MILESTONES.forEach(milestone => {
      const milestoneDueDate = calculateDueDate(currentBaby.dateOfBirth, milestone.approxDays);
      const milestoneVaccines = milestone.vaccineIds.map(id => BANGLADESH_VACCINES[id]);
      
      const unadministered = milestoneVaccines.filter(v => !currentBaby.records[v.id]?.isGiven);
      if (unadministered.length > 0) {
        const vaccineNames = unadministered.map(v => `${v.nameBn} (${v.code})`).join(', ');
        const desc = `Baby: ${currentBaby.name}\nMilestone: ${milestone.titleBn}\nVaccines: ${vaccineNames}\nEPI Center: Nearest Government Upazila Health Complex / Clinic.\nNational Health Helpline: 16263`;
        events.push({
          title: `👶 EPI Vaccine: ${currentBaby.name} - ${milestone.titleEn}`,
          date: milestoneDueDate,
          description: desc,
        });
      }
    });

    if (events.length === 0) {
      alert(language === 'bn' ? 'সকল টিকা ইতিমধ্যে সম্পন্ন হয়েছে!' : 'All vaccines are already marked as done!');
      return;
    }

    const icsContent = generateIcsCalendar(currentBaby.name, events);
    triggerFileDownload(icsContent, `${currentBaby.name || 'baby'}-vaccine-reminders.ics`);
  };

  // Filter logic
  const filteredMilestones = useMemo(() => {
    return BANGLADESH_EPI_MILESTONES.map(milestone => {
      const matchedVaccines = milestone.vaccineIds
        .map(id => BANGLADESH_VACCINES[id])
        .filter(v => {
          if (!v) return false;
          const { status } = vaccineStatusMap[v.id];

          // Filter by status tab
          if (activeFilter !== 'all' && status !== activeFilter) {
            return false;
          }

          // Filter by search query
          if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            const nameMatch = v.nameBn.toLowerCase().includes(query) || v.nameEn.toLowerCase().includes(query) || v.code.toLowerCase().includes(query);
            const diseaseMatch = v.diseasesBn.some(d => d.toLowerCase().includes(query)) || v.diseasesEn.some(d => d.toLowerCase().includes(query));
            return nameMatch || diseaseMatch;
          }

          return true;
        });

      return {
        ...milestone,
        vaccines: matchedVaccines,
      };
    }).filter(m => m.vaccines.length > 0);
  }, [activeFilter, searchQuery, vaccineStatusMap]);

  return (
    <section id="tracker-section" className="py-8 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Admin Clinical Mode Banner (Only rendered in Admin Mode - completely removed for parents) */}
        {isAdminMode && (
          <div className="p-3.5 sm:p-4 rounded-2xl border bg-amber-500/10 border-amber-300 text-amber-950 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-bold flex items-center justify-center shrink-0">
                <Unlock className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                    {language === 'bn' ? '🩺 স্বাস্থ্যকর্মী / এডমিন মোড সক্রিয়' : 'Admin Clinical Mode'}
                  </span>
                  <span className="text-xs text-slate-600 font-medium hidden md:inline">
                    {language === 'bn' 
                      ? `মোট ডোজ: ${toBengaliNumerals(doseStats.totalDoses)}টি · সম্পন্ন: ${toBengaliNumerals(doseStats.completedDoses)}টি · বাকি: ${toBengaliNumerals(doseStats.remainingDoses)}টি`
                      : `Total: ${doseStats.totalDoses} · Completed: ${doseStats.completedDoses} · Pending: ${doseStats.remainingDoses}`}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  {language === 'bn'
                    ? 'আপনি স্বাস্থ্যকর্মী হিসেবে যেকোনো টিকার দেওয়ার তারিখ, কেন্দ্র বা নোট সম্পাদন ও সেশন সম্পন্ন করতে পারেন।'
                    : 'You are in Admin Mode. Full clinical editing, session completion, and record modifications are enabled.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleExitAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-all shadow-xs shrink-0"
            >
              <Lock className="w-3.5 h-3.5 text-slate-600" />
              <span>{language === 'bn' ? 'এডমিন মোড বন্ধ করুন' : 'Exit Admin'}</span>
            </button>
          </div>
        )}

        {/* Section Header & Interactive Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {language === 'bn' ? 'ইপিআই টিকা সময়সূচি ও অগ্রগতি' : 'EPI Immunization Schedule & Status'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {language === 'bn'
                ? 'জন্ম তারিখ অনুযায়ী স্বয়ংক্রিয়ভাবে হিসাবকৃত প্রতিটি টিকার বিস্তারিত ডোজ, সম্পন্ন তারিখ ও পরবর্তী শিডিউল।'
                : 'Automated milestone schedule dates calculated from birth date with dose instructions.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleExportCalendar}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200/80 rounded-xl transition-colors shadow-xs"
              title="Download .ics for Google Calendar or iPhone"
            >
              <Download className="w-4 h-4 text-teal-600" />
              <span>{language === 'bn' ? 'ক্যালেন্ডারে রিমাইন্ডার এক্সপোর্ট (.ics)' : 'Export to Calendar (.ics)'}</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-50 p-2 sm:p-2.5 rounded-2xl border border-slate-200">
          
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none p-1">
            <button
              type="button"
              onClick={() => onFilterChange('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 ${
                activeFilter === 'all'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'bn' ? 'সকল টিকা (All)' : 'All'}
            </button>
            <button
              type="button"
              onClick={() => onFilterChange('overdue')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 ${
                activeFilter === 'overdue'
                  ? 'bg-rose-100 text-rose-900 shadow-sm border border-rose-300'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'bn' ? 'সময় পার (Overdue)' : 'Overdue'}
            </button>
            <button
              type="button"
              onClick={() => onFilterChange('due-soon')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 ${
                activeFilter === 'due-soon'
                  ? 'bg-amber-100 text-amber-900 shadow-sm border border-amber-300'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'bn' ? 'আসন্ন (Due soon)' : 'Due soon'}
            </button>
            <button
              type="button"
              onClick={() => onFilterChange('upcoming')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 ${
                activeFilter === 'upcoming'
                  ? 'bg-teal-100 text-teal-900 shadow-sm border border-teal-300'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'bn' ? 'অপেক্ষমাণ (Upcoming)' : 'Upcoming'}
            </button>
            <button
              type="button"
              onClick={() => onFilterChange('done')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 ${
                activeFilter === 'done'
                  ? 'bg-emerald-100 text-emerald-900 shadow-sm border border-emerald-300'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'bn' ? 'সম্পন্ন (Done)' : 'Done'}
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery ?? ''}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'bn' ? 'টিকা বা রোগের নাম খুঁজুন...' : 'Search vaccine or disease...'}
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3.5 py-1.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
            />
          </div>

        </div>

        {/* Empty State */}
        {filteredMilestones.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-8 space-y-3">
            <Info className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-base font-semibold text-slate-800">
              {language === 'bn' ? 'কোনো টিকা পাওয়া যায়নি' : 'No matching vaccines found'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {language === 'bn' 
                ? 'নির্বাচিত ফিল্টার বা অনুসন্ধান শব্দ পরিবর্তন করে পুনরায় চেষ্টা করুন।' 
                : 'Try adjusting your search criteria or switching the status filter.'}
            </p>
            <button
              type="button"
              onClick={() => { onFilterChange('all'); setSearchQuery(''); }}
              className="text-xs font-semibold text-teal-700 hover:underline"
            >
              {language === 'bn' ? 'সকল ফিল্টার রিসেট করুন' : 'Reset all filters'}
            </button>
          </div>
        )}

        {/* Milestone Groups */}
        <div className="space-y-8">
          {filteredMilestones.map((milestone) => {
            const milestoneDueDate = calculateDueDate(currentBaby.dateOfBirth, milestone.approxDays);
            const daysDiff = getDaysDiff(milestoneDueDate);
            
            // Milestone level completion status
            const allDosesInMilestone = milestone.vaccines.length;
            const completedDoses = milestone.vaccines.filter(v => currentBaby.records[v.id]?.isGiven).length;
            const isMilestoneFullyComplete = completedDoses === allDosesInMilestone && allDosesInMilestone > 0;

            // Automatically determine next milestone and scheduled due date (e.g., BCG -> 6w -> 10w -> 14w -> 9m MR1 -> 15m MR2)
            const milestoneIndex = BANGLADESH_EPI_MILESTONES.findIndex(m => m.id === milestone.id);
            const nextMilestone = milestoneIndex >= 0 && milestoneIndex < BANGLADESH_EPI_MILESTONES.length - 1
              ? BANGLADESH_EPI_MILESTONES[milestoneIndex + 1]
              : null;
            const nextMilestoneDueDate = nextMilestone ? calculateDueDate(currentBaby.dateOfBirth, nextMilestone.approxDays) : null;
            const nextMilestoneVaccines = nextMilestone
              ? nextMilestone.vaccineIds.map(id => BANGLADESH_VACCINES[id]).filter(Boolean)
              : [];

            return (
              <div
                key={milestone.id}
                className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs space-y-5"
              >
                {/* Milestone Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <span className="font-semibold text-slate-700">{language === 'bn' ? milestone.ageBn : milestone.ageEn}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-teal-700 font-semibold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {language === 'bn' ? 'নির্ধারিত তারিখ:' : 'Due Date:'} {formatFriendlyDate(milestoneDueDate, language)}
                      </span>
                      {daysDiff !== 0 && !isMilestoneFullyComplete && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className={daysDiff < 0 ? 'text-rose-600 font-semibold' : 'text-slate-600'}>
                            {daysDiff < 0 
                              ? (language === 'bn' ? `${toBengaliNumerals(Math.abs(daysDiff))} দিন আগে পার হয়েছে` : `${Math.abs(daysDiff)} days overdue`)
                              : (language === 'bn' ? `${toBengaliNumerals(daysDiff)} দিন বাকি` : `${daysDiff} days left`)}
                          </span>
                        </>
                      )}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                      {language === 'bn' ? milestone.titleBn : milestone.titleEn}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {language === 'bn' ? milestone.descriptionBn : milestone.descriptionEn}
                    </p>
                  </div>

                  {/* Milestone Action Strip (Admins can mark session done; Parents only see clear completion summary) */}
                  <div className="flex items-center gap-3 shrink-0">
                    {isAdminMode ? (
                      !isMilestoneFullyComplete ? (
                        <button
                          type="button"
                          onClick={() => onMarkMilestoneAllDone(milestone.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl transition-colors whitespace-nowrap active:scale-95"
                        >
                          <Check className="w-3.5 h-3.5 text-teal-600" />
                          <span>{language === 'bn' ? 'এই সেশনের সব টিকাদান সম্পন্ন' : 'Mark Session as Done'}</span>
                        </button>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{language === 'bn' ? 'সেশন সম্পন্ন' : 'Session Completed'}</span>
                        </div>
                      )
                    ) : (
                      /* Parent Read-Only Summary Badge */
                      isMilestoneFullyComplete ? (
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-200">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{language === 'bn' ? `সব টিকা সম্পন্ন (${toBengaliNumerals(completedDoses)}/${toBengaliNumerals(allDosesInMilestone)})` : `All Given (${completedDoses}/${allDosesInMilestone})`}</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-50 px-3.5 py-1.5 rounded-xl border border-amber-200">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>
                            {language === 'bn'
                              ? `অগ্রগতি: ${toBengaliNumerals(completedDoses)}/${toBengaliNumerals(allDosesInMilestone)} ডোজ সম্পন্ন`
                              : `Progress: ${completedDoses}/${allDosesInMilestone} doses done`}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Unified Single Box for All Vaccine Doses in This Milestone */}
                <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs divide-y divide-slate-100 overflow-hidden">
                  {milestone.vaccines.map((vaccine) => {
                    const record = currentBaby.records[vaccine.id];
                    const isGiven = !!record?.isGiven;
                    const { status, dueDate } = vaccineStatusMap[vaccine.id];
                    const daysRemaining = getDaysDiff(dueDate);

                    return (
                      <div
                        key={vaccine.id}
                        className={`px-3 py-2 sm:px-4 sm:py-2.5 transition-colors flex flex-row items-center justify-between gap-2 sm:gap-4 w-full overflow-x-auto scrollbar-none ${
                          isGiven
                            ? 'bg-emerald-50/20 hover:bg-emerald-50/40'
                            : status === 'overdue'
                              ? 'bg-rose-50/25 hover:bg-rose-50/45'
                              : status === 'due-soon'
                                ? 'bg-amber-50/25 hover:bg-amber-50/45'
                                : 'hover:bg-slate-50/70'
                        }`}
                      >
                        {/* Left Side: Vaccine Code, Dose Badge & Vaccine Name (all on one line) */}
                        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 min-w-0">
                          <span className="text-[10px] font-bold font-mono text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200/70 shrink-0">
                            {vaccine.code}
                          </span>
                          <span className="text-[10px] font-semibold text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 shrink-0">
                            {language === 'bn' ? `ডোজ: ${vaccine.doseTextBn}` : `Dose: ${vaccine.doseTextEn}`}
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-slate-800 whitespace-nowrap">
                            {language === 'bn' ? vaccine.nameBn : vaccine.nameEn}
                          </span>
                        </div>

                        {/* Middle: Administration / Scheduled Date (on the same line) */}
                        <div className="flex items-center gap-1 text-[11px] font-medium shrink-0 ml-auto sm:ml-0">
                          {isGiven ? (
                            <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80 font-semibold text-[11px] whitespace-nowrap">
                              <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span>{language === 'bn' ? 'টিকা সম্পন্ন তারিখ:' : 'Date Given:'}</span>
                              <span className="font-bold underline decoration-emerald-500 underline-offset-2">
                                {formatFriendlyDate(record?.dateGiven || dueDate, language)}
                              </span>
                            </span>
                          ) : (
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-semibold whitespace-nowrap ${
                              status === 'overdue'
                                ? 'text-rose-800 bg-rose-50 border-rose-200'
                                : status === 'due-soon'
                                  ? 'text-amber-800 bg-amber-50 border-amber-200'
                                  : 'text-teal-800 bg-teal-50/70 border-teal-200/70'
                            }`}>
                              <Calendar className="w-3 h-3 text-teal-600 shrink-0" />
                              <span>{language === 'bn' ? 'নির্ধারিত তারিখ:' : 'Due Date:'}</span>
                              <span className="font-bold">
                                {formatFriendlyDate(dueDate, language)}
                              </span>
                              {daysRemaining < 0 && (
                                <span className="text-rose-600 font-bold ml-1">
                                  ({language === 'bn' ? `${toBengaliNumerals(Math.abs(daysRemaining))} দিন পার` : `${Math.abs(daysRemaining)}d overdue`})
                                </span>
                              )}
                            </span>
                          )}
                        </div>

                        {/* Right Side: Status Badge + Details ("বিস্তারিত") Button + Admin Actions (on the same line) */}
                        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                          {/* Status Badge */}
                          {isGiven ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded border border-emerald-200 whitespace-nowrap">
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                              <span>{language === 'bn' ? 'দেওয়া সম্পন্ন' : 'Given'}</span>
                            </span>
                          ) : status === 'overdue' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded border border-rose-200 whitespace-nowrap">
                              <AlertTriangle className="w-3 h-3 text-rose-600" />
                              <span>{language === 'bn' ? 'সময় পার' : 'Overdue'}</span>
                            </span>
                          ) : status === 'due-soon' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-200 whitespace-nowrap">
                              <Clock className="w-3 h-3 text-amber-600" />
                              <span>{language === 'bn' ? 'আসন্ন' : 'Due Soon'}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 whitespace-nowrap">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              <span>{language === 'bn' ? 'অপেক্ষমাণ' : 'Upcoming'}</span>
                            </span>
                          )}

                          {/* "বিস্তারিত" Details Button */}
                          <button
                            type="button"
                            onClick={() => onOpenRecordModal(vaccine, isGiven)}
                            className="text-[11px] font-semibold text-teal-900 bg-white hover:bg-teal-50 border border-teal-300 px-2 py-0.5 rounded-lg transition-all shadow-2xs flex items-center gap-1 active:scale-95 cursor-pointer whitespace-nowrap"
                            title={language === 'bn' ? 'বিস্তারিত তথ্য দেখুন' : 'View details'}
                          >
                            <Eye className="w-3 h-3 text-teal-700" />
                            <span>{language === 'bn' ? 'বিস্তারিত' : 'Details'}</span>
                          </button>

                          {/* Admin Controls */}
                          {isAdminMode && (
                            <div className="flex items-center gap-1 border-l border-slate-200 pl-1.5 ml-0.5">
                              <button
                                type="button"
                                onClick={() => onOpenRecordModal(vaccine, true)}
                                className="text-[10px] font-semibold text-slate-700 hover:text-slate-900 px-1.5 py-0.5 rounded border border-slate-300 bg-white hover:bg-slate-50 transition-colors whitespace-nowrap"
                              >
                                {language === 'bn' ? 'সম্পাদন' : 'Edit'}
                              </button>
                              <button
                                type="button"
                                onClick={() => onQuickToggleVaccine(vaccine.id)}
                                className="text-[10px] font-semibold text-rose-700 hover:text-rose-900 px-1.5 py-0.5 rounded hover:bg-rose-50 transition-colors whitespace-nowrap"
                                title="Cancel or Undo"
                              >
                                {language === 'bn' ? 'বাতিল' : 'Undo'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Automatic Next Vaccine Date Banner at bottom of the box */}
                  <div className="bg-slate-50/90 px-3 py-2.5 sm:px-4 sm:py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-200/80">
                    {nextMilestone && nextMilestoneDueDate ? (
                      <div className="flex items-center gap-2 flex-wrap text-xs">
                        <span className="inline-flex items-center gap-1.5 font-bold text-teal-800 bg-teal-100/90 px-2 py-0.5 rounded-md text-[11px] border border-teal-200">
                          <Calendar className="w-3.5 h-3.5 text-teal-700" />
                          <span>{language === 'bn' ? 'পরবর্তী টিকার সম্ভাব্য তারিখ:' : 'Next Vaccine Scheduled Date:'}</span>
                        </span>
                        <span className="font-black text-slate-900 underline decoration-teal-600 underline-offset-2 text-xs">
                          {formatFriendlyDate(nextMilestoneDueDate, language)}
                        </span>
                        <span className="text-[11px] text-slate-600 font-medium">
                          ({language === 'bn' ? nextMilestone.titleBn : nextMilestone.titleEn} - {nextMilestoneVaccines.map(v => v.code).join(', ')})
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>
                          {language === 'bn' 
                            ? '🎉 অভিনন্দন! এটি বাংলাদেশ ইপিআই শিডিউলের সর্বশেষ রুটিন ডোজ।' 
                            : '🎉 Congratulations! This is the final routine dose of Bangladesh EPI Schedule.'}
                        </span>
                      </div>
                    )}

                    {nextMilestone && nextMilestoneDueDate && (
                      <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 self-end sm:self-center shrink-0">
                        {getDaysDiff(nextMilestoneDueDate) > 0 ? (
                          <span className="text-teal-700 font-medium">
                            {language === 'bn' 
                              ? `⏳ আর প্রায় ${toBengaliNumerals(getDaysDiff(nextMilestoneDueDate))} দিন পর` 
                              : `⏳ In approx ${getDaysDiff(nextMilestoneDueDate)} days`}
                          </span>
                        ) : getDaysDiff(nextMilestoneDueDate) === 0 ? (
                          <span className="text-amber-700 font-bold">
                            {language === 'bn' ? '🚨 আজই পরবর্তী টিকার দিন' : '🚨 Next vaccine due today'}
                          </span>
                        ) : (
                          <span className="text-rose-700 font-bold">
                            {language === 'bn' 
                              ? `⚠️ নির্ধারিত সময় পার হয়েছে (${toBengaliNumerals(Math.abs(getDaysDiff(nextMilestoneDueDate)))} দিন আগে)` 
                              : `⚠️ Overdue by ${Math.abs(getDaysDiff(nextMilestoneDueDate))} days`}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Internal Fallback Admin PIN Modal */}
      <AdminPinModal
        isOpen={isInternalPinModalOpen}
        language={language}
        onClose={() => setIsInternalPinModalOpen(false)}
        onSuccess={handlePinSuccess}
      />
    </section>
  );
};
