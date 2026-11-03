import React, { useState, useRef, useEffect } from 'react';
import { 
  PhoneCall, 
  Globe, 
  Sparkles, 
  Video as VideoIcon, 
  LogIn, 
  User, 
  LogOut, 
  ChevronDown, 
  ShieldCheck,
  Baby,
  HeartPulse,
  Users
} from 'lucide-react';
import { Language } from '../types/vaccine';
import { ParentUser } from '../types/auth';

export type MainAppTab = 'vaccines' | 'services' | 'videoguides' | 'savings' | 'community' | 'scrapbook' | 'growth' | 'nutrition' | 'blood';

interface HeaderProps {
  language: Language;
  activeMainTab: MainAppTab;
  onSelectMainTab: (tab: MainAppTab) => void;
  onToggleLanguage: () => void;
  onPrintCard: () => void;
  onScrollTo: (sectionId: string) => void;
  currentUser?: ParentUser | null;
  onOpenAuthModal: (mode?: 'login' | 'register') => void;
  onLogout: () => void;
  healthAssistantName?: string;
  healthAssistantPhone?: string;
  onOpenHealthAssistantModal: () => void;
  onOpenAllRegistrationsModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  activeMainTab,
  onSelectMainTab,
  onToggleLanguage,
  onPrintCard,
  onScrollTo,
  currentUser,
  onOpenAuthModal,
  onLogout,
  healthAssistantName,
  healthAssistantPhone,
  onOpenHealthAssistantModal,
  onOpenAllRegistrationsModal,
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRoleLabel = (user?: ParentUser | null) => {
    if (!user) return language === 'bn' ? 'মা' : 'Mother';
    if (user.userRole === 'super_admin') return language === 'bn' ? '👑 সুপার এডমিন' : '👑 Super Admin';
    if (user.userRole === 'health_assistant') return language === 'bn' ? '💉 স্বাস্থ্য সহকারী' : '💉 Health Assistant';
    if (user.role === 'father') return language === 'bn' ? '👨 বাবা' : 'Father';
    if (user.role === 'guardian') return language === 'bn' ? '🤝 অভিভাবক' : 'Guardian';
    return language === 'bn' ? '👩 মা' : 'Mother';
  };

  const getRoleEmoji = (user?: ParentUser | null) => {
    if (!user) return '👩';
    if (user.userRole === 'super_admin') return '🛡️';
    if (user.userRole === 'health_assistant') return '💉';
    if (user.role === 'father') return '👨';
    if (user.role === 'guardian') return '🤝';
    return '👩';
  };

  const isServicesActive = activeMainTab === 'services' || activeMainTab === 'growth' || activeMainTab === 'nutrition' || activeMainTab === 'blood';

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-teal-700 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            👶
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
              {language === 'bn' ? 'মা ও শিশু সুরক্ষা অঙ্গন' : 'Mother & Baby Care'}
            </span>
            <span className="text-[11px] text-teal-700 font-medium hidden sm:inline whitespace-nowrap">
              {language === 'bn' ? 'টিকা, সেবা কেন্দ্র, ভিডিও গাইড ও সঞ্চয়' : 'Vaccine, Services Hub, Videos & Savings'}
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Streamlined, responsive, single-line) */}
        <nav className="hidden lg:flex items-center gap-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => onSelectMainTab('vaccines')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              activeMainTab === 'vaccines' ? 'bg-teal-700 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {language === 'bn' ? '💉 টিকা' : 'Vaccines'}
          </button>

          <button
            type="button"
            onClick={() => onSelectMainTab('services')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              isServicesActive ? 'bg-teal-700 text-white shadow-xs font-bold' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <HeartPulse className={`w-3.5 h-3.5 ${isServicesActive ? 'text-amber-300' : 'text-teal-600'}`} />
            <span>{language === 'bn' ? '🏥 সেবা' : 'Services'}</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectMainTab('videoguides')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeMainTab === 'videoguides' ? 'bg-teal-700 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <VideoIcon className={`w-3.5 h-3.5 ${activeMainTab === 'videoguides' ? 'text-teal-200' : 'text-teal-600'}`} />
            <span>{language === 'bn' ? '🎥 ভিডিও গাইড' : 'Video Demos'}</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectMainTab('savings')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              activeMainTab === 'savings' ? 'bg-teal-700 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {language === 'bn' ? '🪙 সঞ্চয় ব্যাংক' : 'Baby Bank'}
          </button>

          <button
            type="button"
            onClick={() => onSelectMainTab('community')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              activeMainTab === 'community' ? 'bg-teal-700 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {language === 'bn' ? '📸 আড্ডা ফিড' : 'Community'}
          </button>

          <button
            type="button"
            onClick={() => onSelectMainTab('scrapbook')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              activeMainTab === 'scrapbook' ? 'bg-teal-700 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {language === 'bn' ? '📖 স্মৃতি' : 'Memories'}
          </button>
        </nav>

        {/* Zone 3: Actions, Emergency Dial & Authentication Button */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          
          {/* Health Assistant Interactive Trigger (Opens full profile with name & phone) */}
          <button
            type="button"
            onClick={onOpenHealthAssistantModal}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-200/90 rounded-xl transition-all shadow-2xs cursor-pointer active:scale-95"
            title={language === 'bn' ? `স্বাস্থ্য সহকারী: ${healthAssistantName || 'মোছাঃ নাজমুন নাহার'} (${healthAssistantPhone || '০১৭১২-৩৪৫৬৭৮'}) — ক্লিক করে বিস্তারিত দেখুন ও সরাসরি কল করুন` : 'Click to view health assistant contact details'}
          >
            <PhoneCall className="w-3.5 h-3.5 text-teal-700 animate-pulse shrink-0" />
            <span className="hidden xl:inline">{language === 'bn' ? 'স্বাস্থ্য সহকারী:' : 'Health Assistant:'} {healthAssistantName || (language === 'bn' ? 'মোছাঃ নাজমুন নাহার' : 'Health Worker')}</span>
            <span className="font-mono text-teal-950 font-extrabold text-[11px] sm:text-xs">{healthAssistantPhone || '০১৭১২-৩৪৫৬৭৮'}</span>
          </button>

          {/* Super Admin "সব রেজিস্ট্রেশন" (All Registrations) Quick Access Button */}
          {currentUser?.userRole === 'super_admin' && onOpenAllRegistrationsModal && (
            <button
              type="button"
              onClick={onOpenAllRegistrationsModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-amber-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-xl transition-all shadow-sm active:scale-95 border border-amber-400 cursor-pointer"
              title="সকল নিবন্ধিত শিশু, অভিভাবক ও স্বাস্থ্য সহকারী তালিকা দেখুন ও তথ্য পরিবর্তন করুন"
            >
              <Users className="w-3.5 h-3.5 text-amber-950 shrink-0" />
              <span className="hidden sm:inline">{language === 'bn' ? '📋 সব রেজিস্ট্রেশন' : 'All Registrations'}</span>
              <span className="sm:hidden">{language === 'bn' ? 'রেজিস্ট্রেশন' : 'Registry'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onToggleLanguage}
            className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-semibold text-slate-700 hover:text-teal-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
            title="বাংলা / English"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>{language === 'bn' ? 'EN' : 'বাং'}</span>
          </button>

          {/* Profile Menu if logged in, or Login/Register button if logged out */}
          {currentUser ? (
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="inline-flex items-center gap-1.5 py-1 px-2.5 bg-teal-50 border border-teal-200 hover:bg-teal-100/80 rounded-xl transition-all shadow-xs cursor-pointer"
                title="ব্যবহারকারী প্রোফাইল"
              >
                <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center text-sm shadow-xs">
                  {getRoleEmoji(currentUser)}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[120px]">
                    {currentUser.fullName}
                  </p>
                  <p className="text-[10px] text-teal-700 leading-none">
                    {getRoleLabel(currentUser)}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile Dropdown */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="pb-3 border-b border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center text-xl">
                      {getRoleEmoji(currentUser)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{currentUser.fullName}</p>
                      <p className="text-[11px] text-teal-700 font-medium">
                        {getRoleLabel(currentUser)} · {currentUser.district || 'বাংলাদেশ'}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">{currentUser.phoneOrEmail}</p>
                    </div>
                  </div>

                  {/* Super Admin Hub Option in Profile Dropdown */}
                  {currentUser.userRole === 'super_admin' && onOpenAllRegistrationsModal && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onOpenAllRegistrationsModal();
                      }}
                      className="w-full text-left px-2.5 py-2 mt-2 text-xs text-amber-950 bg-amber-50 hover:bg-amber-100 rounded-xl flex items-center gap-2 font-bold border border-amber-200 transition-colors"
                    >
                      <Users className="w-4 h-4 text-amber-700" />
                      <span>{language === 'bn' ? '📋 সব রেজিস্ট্রেশন ও পরিবর্তন' : 'All Registrations Console'}</span>
                    </button>
                  )}

                  {/* 2FA Security Status Badge */}
                  <div className="my-1.5 py-1 px-2 bg-emerald-50 rounded-lg text-[10px] text-emerald-800 font-semibold flex items-center justify-between border border-emerald-200">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{language === 'bn' ? '২-ধাপ যাচাইকরণ:' : '2FA Security:'}</span>
                    </span>
                    <span className="bg-emerald-600 text-white px-1.5 py-0.5 rounded text-[9px] font-bold">
                      {language === 'bn' ? 'সুরক্ষিত' : 'Active'}
                    </span>
                  </div>

                  {currentUser.babyName && (
                    <div className="py-1.5 text-[11px] text-slate-600 flex items-center gap-1.5 border-b border-slate-50">
                      <Baby className="w-3.5 h-3.5 text-teal-600" />
                      <span>{language === 'bn' ? `সন্তান: ${currentUser.babyName}` : `Baby: ${currentUser.babyName}`}</span>
                    </div>
                  )}

                  <div className="pt-2 space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onOpenAuthModal('login');
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-2 font-medium"
                    >
                      <LogIn className="w-3.5 h-3.5 text-teal-600" />
                      <span>{language === 'bn' ? 'অন্য একাউন্টে পরিবর্তন / লগইন' : 'Switch / Login Account'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-600" />
                      <span>{language === 'bn' ? 'লগআউট ও সেশন সাফ করুন' : 'Sign Out & Clear Session'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onOpenAuthModal('login')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 active:scale-95 rounded-xl transition-all shadow-xs cursor-pointer whitespace-nowrap"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'লগইন / নিবন্ধন' : 'Login / Register'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
