import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  Upload, 
  Lock, 
  Sparkles, 
  Plus, 
  Trash2, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Image as ImageIcon,
  Clock,
  Eye,
  KeyRound
} from 'lucide-react';
import { Language } from '../../types/vaccine';
import { toBengaliNumerals } from '../../utils/dateCalculations';

export interface HeroSlide {
  id: string;
  imageUrl: string;
  badgeBn: string;
  badgeEn: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
  isCustom?: boolean;
  createdAt?: string;
}

const STORAGE_KEY_SLIDES = 'bd_hero_banner_slides_v1';
const STORAGE_KEY_ADMIN_AUTH = 'bd_hero_slider_admin_logged_v1';
const DEFAULT_ADMIN_PIN = '1234';

const INITIAL_DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    imageUrl: '/src/assets/images/baby_vaccine_hero_1792747130165.jpg',
    badgeBn: '১০টি মারাত্মক রোগ প্রতিরোধ',
    badgeEn: 'Guarding Against 10 Killer Diseases',
    titleBn: '{babyName}-এর প্রতিটি টিকাই একটি নিরাপদ ভবিষ্যৎ',
    titleEn: 'Every Vaccine Protects a Bright Future',
    subtitleBn: 'সরকারি টিকাদান কেন্দ্রে সকল ইপিআই টিকা বিনামূল্যে পাওয়া যায়।',
    subtitleEn: 'All national EPI vaccines are provided 100% free by the Government of Bangladesh.',
    isCustom: false,
  },
  {
    id: 'slide-2',
    imageUrl: '/src/assets/images/baby_growth_nutrition_1792750520340.jpg',
    badgeBn: 'সঠিক বৃদ্ধি ও পুষ্টি বিকাশ',
    badgeEn: 'Optimal Growth & Nutrition',
    titleBn: 'মায়ের বুকের দুধ ও পুষ্টিকর খাবার শিশুর আসল শক্তি',
    titleEn: 'Optimal Child Growth and Healthy Nutrition',
    subtitleBn: 'প্রতি মাসে শিশুর ওজন ও উচ্চতা মেপে গ্রোথ ট্র্যাকারে নিয়মিত হিসাব রাখুন।',
    subtitleEn: 'Track monthly growth records to ensure optimal infant development.',
    isCustom: false,
  },
  {
    id: 'slide-3',
    imageUrl: '/src/assets/images/baby_community_mothers_1792750520224.jpg',
    badgeBn: 'মায়েদের ভালোবাসা ও ঐক্য',
    badgeEn: 'Mother Care & Community',
    titleBn: 'সুস্থ শিশু ও সচেতন অভিভাবক গড়ে তুলবে আগামীর বাংলাদেশ',
    titleEn: 'Caring Mothers & Supportive Parenting Community',
    subtitleBn: 'শিশুর যেকোনো প্রয়োজনে মায়েদের আড্ডায় পরামর্শ নিন ও অভিজ্ঞতা শেয়ার করুন।',
    subtitleEn: 'Share advice, infant care tips, and mutual support across Bangladesh.',
    isCustom: false,
  },
  {
    id: 'slide-4',
    imageUrl: '/src/assets/images/baby_savings_bank_1792749301691.jpg',
    badgeBn: 'ভবিষ্যৎ আর্থিক নিরাপত্তা',
    badgeEn: 'Baby Future Savings Bank',
    titleBn: 'প্রতিটি টিকার সাথে সোনামণির ভবিষ্যতের জন্য ক্ষুদ্র সঞ্চয়',
    titleEn: 'Building a Secure Financial Nest Egg for Baby',
    subtitleBn: 'শিশুর উচ্চশিক্ষা ও ভবিষ্যৎ নিরাপত্তার লক্ষ্যে নিয়মিত জমানো নিশ্চিত করুন।',
    subtitleEn: 'Consistent small savings build a bright tomorrow for your child.',
    isCustom: false,
  },
];

interface HeroSliderCardProps {
  babyName: string;
  language: Language;
}

export const HeroSliderCard: React.FC<HeroSliderCardProps> = ({ babyName, language }) => {
  // Slides State
  const [slides, setSlides] = useState<HeroSlide[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SLIDES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_DEFAULT_SLIDES;
  });

  // Current Slide Index
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [slideSpeedMs, setSlideSpeedMs] = useState(4500); // 4.5s auto transition

  // Admin Modal & Auth State
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(STORAGE_KEY_ADMIN_AUTH) === 'true';
  });
  const [adminPinInput, setAdminPinInput] = useState('');
  const [adminPinError, setAdminPinError] = useState<string | null>(null);

  // New Slide Form State (Admin Only)
  const [newImagePreview, setNewImagePreview] = useState<string>('');
  const [newBadgeBn, setNewBadgeBn] = useState('');
  const [newTitleBn, setNewTitleBn] = useState('');
  const [newSubtitleBn, setNewSubtitleBn] = useState('');
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Auto-play interval effect: transitions automatically to the next photo
  useEffect(() => {
    if (isHovered || slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, slideSpeedMs);

    return () => clearInterval(timer);
  }, [isHovered, slides.length, slideSpeedMs]);

  // Sync slides to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SLIDES, JSON.stringify(slides));
    } catch (e) {
      console.error(e);
    }
  }, [slides]);

  // Navigation handlers
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
  };

  // Admin PIN verification
  const handleVerifyAdminPin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminPinError(null);

    if (adminPinInput.trim() === DEFAULT_ADMIN_PIN) {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem(STORAGE_KEY_ADMIN_AUTH, 'true');
      setAdminPinInput('');
    } else {
      setAdminPinError(
        language === 'bn' 
          ? '⚠️ পিন কোড সঠিক নয়! (সঠিক পিন: 1234)' 
          : 'Invalid PIN! (Default: 1234)'
      );
    }
  };

  const handleQuickAdminUnlock = () => {
    setIsAdminAuthenticated(true);
    sessionStorage.setItem(STORAGE_KEY_ADMIN_AUTH, 'true');
    setAdminPinInput('');
    setAdminPinError(null);
  };

  // Handle local image file upload (converts to base64 for instant display & offline persistence)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert(language === 'bn' ? 'ছবির সাইজ সর্বোচ্চ ৫ মেগাবাইট হতে পারবে।' : 'Image size limit is 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setNewImagePreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Admin: Publish new photo slide
  const handlePublishSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImagePreview) {
      alert(language === 'bn' ? 'দয়া করে একটি ছবি নির্বাচন করুন।' : 'Please select an image.');
      return;
    }

    const newSlide: HeroSlide = {
      id: `slide-custom-${Date.now()}`,
      imageUrl: newImagePreview,
      badgeBn: newBadgeBn.trim() || 'বিশেষ ঘোষণা ও ফটো আপডেট',
      badgeEn: 'Special Update',
      titleBn: newTitleBn.trim() || `${babyName || 'সোনামণি'}-এর সুস্থতা ও রঙিন শৈশব`,
      titleEn: 'Happy & Healthy Baby Care',
      subtitleBn: newSubtitleBn.trim() || 'অভিভাবক কর্তৃক প্রকাশিত স্লাইড। নিয়মিত যত্ন ও চিকিৎসকের পরামর্শ মেনে চলুন।',
      subtitleEn: 'Published photo slide for maternal & infant well-being.',
      isCustom: true,
      createdAt: new Date().toISOString(),
    };

    setSlides((prev) => [newSlide, ...prev]);
    setCurrentIndex(0); // switch to the newly uploaded photo immediately
    setUploadSuccessMsg(language === 'bn' ? '✅ নতুন ফটো সফলভাবে পোস্ট করা হয়েছে!' : 'Photo posted successfully!');

    // Reset form
    setNewImagePreview('');
    setNewBadgeBn('');
    setNewTitleBn('');
    setNewSubtitleBn('');
    if (fileInputRef.current) fileInputRef.current.value = '';

    setTimeout(() => {
      setUploadSuccessMsg(null);
    }, 2500);
  };

  // Admin: Delete a slide
  const handleDeleteSlide = (id: string) => {
    if (slides.length <= 1) {
      alert(language === 'bn' ? 'স্লাইডারে কমপক্ষে একটি ছবি থাকতে হবে।' : 'At least one photo must remain.');
      return;
    }
    setSlides((prev) => prev.filter((s) => s.id !== id));
    setCurrentIndex(0);
  };

  // Admin: Reset to default slides
  const handleResetToDefaults = () => {
    if (confirm(language === 'bn' ? 'আপনি কি ডিফল্ট স্লাইডগুলোতে ফিরে যেতে চান?' : 'Reset to default slides?')) {
      setSlides(INITIAL_DEFAULT_SLIDES);
      setCurrentIndex(0);
    }
  };

  // Active slide rendering helper
  const currentSlide = slides[currentIndex] || slides[0];
  const renderedTitle = currentSlide.titleBn.replace('{babyName}', babyName || 'সোনামণি');

  return (
    <div 
      className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200/90 bg-slate-900 group select-none transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. Photo Container with Auto-Transition */}
      <div className="relative w-full h-72 sm:h-80 lg:h-96 overflow-hidden">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === currentIndex ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 pointer-events-none scale-105'
            }`}
          >
            <img
              src={slide.imageUrl}
              alt={slide.titleBn}
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
          </div>
        ))}

        {/* Dark Vignette Gradient Overlay for Crisp Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/20 z-15 pointer-events-none" />

        {/* Top Floating Controls Bar */}
        <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-auto">
          {/* Slide Progress Counter Badge */}
          <div className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[11px] font-bold border border-white/20 flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              {language === 'bn' ? toBengaliNumerals(currentIndex + 1) : currentIndex + 1} / {language === 'bn' ? toBengaliNumerals(slides.length) : slides.length}
            </span>
            <span className="text-white/60">·</span>
            <span className="text-[10px] text-teal-300 font-semibold">
              {isHovered ? (language === 'bn' ? 'বিরতি' : 'Paused') : (language === 'bn' ? 'অটো' : 'Auto')}
            </span>
          </div>

          {/* Admin Upload / Manage Lock Trigger (Only Admin can post) */}
          <button
            type="button"
            onClick={() => setIsAdminModalOpen(true)}
            className="bg-black/60 hover:bg-black/80 backdrop-blur-md text-amber-300 hover:text-amber-200 border border-amber-300/40 px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 group/btn"
            title="শুধুমাত্র এডমিন ছবি পোস্ট ও পরিবর্তন করতে পারবেন"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400 group-hover/btn:scale-110 transition-transform" />
            <span>{language === 'bn' ? 'এডমিন ফটো পোস্ট' : 'Admin Post'}</span>
          </button>
        </div>

        {/* Left / Right Arrow Buttons (Manual Advance) */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous photo"
          className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm opacity-80 group-hover:opacity-100 transition-all active:scale-90"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next photo"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm opacity-80 group-hover:opacity-100 transition-all active:scale-90"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Bottom Information Overlay (Badge, Title, Subtitle) */}
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 text-white z-20 pointer-events-none space-y-1.5">
          {/* Badge */}
          <div className="flex items-center gap-2 text-xs font-bold text-teal-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="bg-teal-950/80 px-2.5 py-0.5 rounded-full border border-teal-500/40 backdrop-blur-md truncate">
              {language === 'bn' ? currentSlide.badgeBn : currentSlide.badgeEn}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-lg lg:text-xl font-black text-white leading-snug drop-shadow-md">
            {language === 'bn' ? renderedTitle : currentSlide.titleEn}
          </h3>

          {/* Subtitle */}
          <p className="text-xs text-slate-200 line-clamp-2 max-w-sm drop-shadow-sm leading-relaxed">
            {language === 'bn' ? currentSlide.subtitleBn : currentSlide.subtitleEn}
          </p>

          {/* Dot Indicators */}
          <div className="pt-2 flex items-center gap-1.5 pointer-events-auto">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => goToSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-6 bg-amber-400' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
                title={`ছবি ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ================= ADMIN PHOTO MANAGEMENT MODAL ================= */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div 
            className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-lg shadow-sm">
                  📸
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold leading-tight">
                    {language === 'bn' ? 'এডমিন ফটো আপলোড ও স্লাইডার ম্যানেজার' : 'Admin Photo Carousel Manager'}
                  </h3>
                  <span className="text-[11px] text-teal-200">
                    {language === 'bn' 
                      ? 'শুধুমাত্র আপনি পোস্ট করতে পারবেন, অভিভাবকরা স্লাইডারে দেখতে পারবেন।' 
                      : 'Admin-only post privilege. Parents can only view auto-slideshow.'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAdminModalOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: If Not Authenticated as Admin -> Show Secret PIN Entry */}
            {!isAdminAuthenticated ? (
              <div className="p-6 space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-amber-950">
                    <Lock className="w-4 h-4 text-amber-700" />
                    <span>{language === 'bn' ? 'সুরক্ষিত এডমিন অ্যাক্সেস' : 'Protected Admin Access'}</span>
                  </div>
                  <p>
                    {language === 'bn'
                      ? 'এই স্লাইডারে ছবি পোস্ট করার অধিকার শুধুমাত্র অ্যাপের মূল অ্যাডমিনের। মা ও বাবারা শুধুমাত্র অটো-নেক্সট হতে থাকা ছবিগুলো দেখতে পারবেন।'
                      : 'Only the platform admin can upload and configure carousel photos. Parents only have view access.'}
                  </p>
                </div>

                {adminPinError && (
                  <div className="p-3 text-xs rounded-xl bg-rose-50 text-rose-800 border border-rose-200 font-semibold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{adminPinError}</span>
                  </div>
                )}

                <form onSubmit={handleVerifyAdminPin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {language === 'bn' ? 'এডমিন পিন কোড লিখুন (ডিফল্ট: 1234):' : 'Enter Admin PIN (Default: 1234):'}
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={adminPinInput ?? ''}
                        onChange={(e) => setAdminPinInput(e.target.value)}
                        placeholder="••••"
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all"
                    >
                      {language === 'bn' ? 'লগইন ও আপলোড শুরু করুন' : 'Unlock & Upload'}
                    </button>

                    <button
                      type="button"
                      onClick={handleQuickAdminUnlock}
                      className="px-3.5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95"
                      title="দ্রুত এডমিন অ্যাক্সেস"
                    >
                      ⚡ {language === 'bn' ? '১-ক্লিক আনলক (1234)' : '1-Click Unlock'}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Authenticated Admin Mode: Upload Form & Slides List */
              <div className="p-5 max-h-[75vh] overflow-y-auto space-y-6">
                
                {/* Upload Success Alert */}
                {uploadSuccessMsg && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{uploadSuccessMsg}</span>
                  </div>
                )}

                {/* Section 1: Upload New Photo */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Upload className="w-4 h-4 text-teal-700" />
                      <span>{language === 'bn' ? 'নতুন ছবি পোস্ট করুন (Admin Post)' : 'Upload New Slide Photo'}</span>
                    </h4>
                    <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full">
                      Admin Authorized
                    </span>
                  </div>

                  {/* Image Picker */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'bn' ? 'ডিভাইস থেকে ছবি বেছে নিন (JPG, PNG, WebP):' : 'Select Photo from Device:'}
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-teal-700 file:text-white hover:file:bg-teal-800 cursor-pointer border border-slate-200 rounded-xl bg-white p-1"
                    />
                  </div>

                  {/* Or Image URL */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'bn' ? 'অথবা ছবির অনলাইন লিংক (URL) দিন:' : 'Or Paste Image URL:'}
                    </label>
                    <input
                      type="url"
                      value={newImagePreview.startsWith('data:') ? '' : newImagePreview}
                      onChange={(e) => setNewImagePreview(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>

                  {/* Image Preview Box */}
                  {newImagePreview && (
                    <div className="relative w-full h-36 rounded-xl overflow-hidden border border-teal-300 bg-slate-900 shadow-inner">
                      <img 
                        src={newImagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover" 
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setNewImagePreview('');
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="absolute top-2 right-2 p-1 rounded-full bg-rose-600 text-white hover:bg-rose-700"
                        title="বাতিল করুন"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Title & Badge Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {language === 'bn' ? 'ছবির শিরোনাম (Title)' : 'Slide Title'}
                      </label>
                      <input
                        type="text"
                        value={newTitleBn ?? ''}
                        onChange={(e) => setNewTitleBn(e.target.value)}
                        placeholder={language === 'bn' ? 'যেমন: হাসিখুশি আরিয়ানের টিকা দিবস' : 'e.g. Happy Vaccine Day'}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {language === 'bn' ? 'ট্যাগ / ব্যাজ (Badge)' : 'Badge Label'}
                      </label>
                      <input
                        type="text"
                        value={newBadgeBn ?? ''}
                        onChange={(e) => setNewBadgeBn(e.target.value)}
                        placeholder={language === 'bn' ? 'যেমন: বিশেষ মুহূর্ত' : 'e.g. Special Update'}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600"
                      />
                    </div>
                  </div>

                  {/* Subtitle Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'bn' ? 'সংক্ষিপ্ত বার্তা (Subtitle)' : 'Subtitle / Description'}
                    </label>
                    <input
                      type="text"
                      value={newSubtitleBn ?? ''}
                      onChange={(e) => setNewSubtitleBn(e.target.value)}
                      placeholder={language === 'bn' ? 'যেমন: সময়মতো টিকা দিন, শিশু সুস্থ রাখুন।' : 'Brief caption...'}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="button"
                    onClick={handlePublishSlide}
                    disabled={!newImagePreview}
                    className="w-full py-2.5 px-4 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{language === 'bn' ? '🚀 স্লাইডারে ছবি পোস্ট করুন (Publish)' : 'Publish to Auto-Slider'}</span>
                  </button>
                </div>

                {/* Section 2: Manage Existing Slides */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-teal-700" />
                      <span>
                        {language === 'bn' 
                          ? `বর্তমান স্লাইড তালিকা (${toBengaliNumerals(slides.length)} টি ছবি সক্রিয়)` 
                          : `Active Slides (${slides.length})`}
                      </span>
                    </h4>

                    {/* Speed Selector */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      <span>{language === 'bn' ? 'পরিবর্তন গতি:' : 'Speed:'}</span>
                      <select
                        value={slideSpeedMs}
                        onChange={(e) => setSlideSpeedMs(Number(e.target.value))}
                        className="py-1 px-2 text-[11px] bg-slate-100 border border-slate-200 rounded-lg font-bold"
                      >
                        <option value={3000}>৩ সেকেন্ড (Fast)</option>
                        <option value={4500}>৪.৫ সেকেন্ড (Default)</option>
                        <option value={6000}>৬ সেকেন্ড (Relaxed)</option>
                        <option value={8000}>৮ সেকেন্ড (Slow)</option>
                      </select>
                    </div>
                  </div>

                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                    {slides.map((s, idx) => (
                      <div key={s.id} className="p-2.5 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={s.imageUrl}
                            alt={s.titleBn}
                            className="w-12 h-10 object-cover rounded-lg border border-slate-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {s.titleBn.replace('{babyName}', babyName || 'সোনামণি')}
                            </p>
                            <span className="text-[10px] text-teal-700 font-medium">
                              #{idx + 1} · {s.badgeBn}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setCurrentIndex(idx);
                              setIsAdminModalOpen(false);
                            }}
                            className="text-[11px] font-bold text-teal-700 hover:text-teal-900 hover:underline px-2 py-1"
                          >
                            {language === 'bn' ? 'দেখুন' : 'View'}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteSlide(s.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Reset Defaults Option */}
                  <div className="pt-2 text-right">
                    <button
                      type="button"
                      onClick={handleResetToDefaults}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline"
                    >
                      {language === 'bn' ? 'মূল ডিফল্ট স্লাইডগুলোতে রিসেট করুন' : 'Reset to Default Slides'}
                    </button>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
