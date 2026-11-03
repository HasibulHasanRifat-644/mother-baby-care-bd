import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Heart, 
  Plus, 
  Sparkles, 
  Calendar, 
  Printer, 
  Trash2, 
  X, 
  ZoomIn, 
  Image as ImageIcon 
} from 'lucide-react';
import { MemoryMoment } from '../../types/community';
import { BabyProfile, Language } from '../../types/vaccine';
import { formatFriendlyDate, formatDateIso } from '../../utils/dateCalculations';
import { PhotoUploadPicker } from '../Common/PhotoUploadPicker';

const STORAGE_KEY_MOMENTS = 'bd_baby_memories_v1';

interface MemoryScrapbookProps {
  currentBaby: BabyProfile;
  language: Language;
}

export const MemoryScrapbook: React.FC<MemoryScrapbookProps> = ({
  currentBaby,
  language,
}) => {
  const getDefaultMoments = (): MemoryMoment[] => [
    {
      id: 'mem-1',
      babyId: currentBaby.id,
      milestoneTitle: 'পৃথিবীতে প্রথম আগমনের মুহূর্ত',
      date: currentBaby.dateOfBirth,
      caption: 'আমাদের কোলজুড়ে এল পরম আশীর্বাদ। তোমার ছোট্ট হাতের স্পর্শে আমাদের জীবন পূর্ণ হলো।',
      photoUrl: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=700&q=80',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'mem-2',
      babyId: currentBaby.id,
      milestoneTitle: 'প্রথম মিষ্টি হাসি ও খিলখিলিয়ে তাকানো',
      date: formatDateIso(new Date(new Date(currentBaby.dateOfBirth).getTime() + 45 * 24 * 60 * 60 * 1000)),
      caption: 'আম্মুর ডাক শুনে প্রথম মিষ্টি হাসি দিল। সেই হাসির চেয়ে সুন্দর দৃশ্য দুনিয়ায় আর কিছু নেই!',
      photoUrl: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=700&q=80',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'mem-3',
      babyId: currentBaby.id,
      milestoneTitle: 'প্রথম শক্ত খাবার / মুখেভাত',
      date: formatDateIso(new Date(new Date(currentBaby.dateOfBirth).getTime() + 180 * 24 * 60 * 60 * 1000)),
      caption: 'নানু ও দাদুর দোয়ায় প্রথম নরম ডিম-সবজি খিচুড়ি মুখে নিল সোনামণি।',
      photoUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=700&q=80',
      createdAt: new Date().toISOString(),
    },
  ];

  const [moments, setMoments] = useState<MemoryMoment[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_MOMENTS}_${currentBaby.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load baby memories:', e);
    }
    return getDefaultMoments();
  });

  // Save to localStorage when moments change
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY_MOMENTS}_${currentBaby.id}`, JSON.stringify(moments));
    } catch (e) {
      console.error('Failed to save baby memories:', e);
    }
  }, [moments, currentBaby.id]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState(formatDateIso(new Date()));
  const [newCaption, setNewCaption] = useState('');
  const [newPhotoUrl, setNewPhotoUrl] = useState<string | undefined>(undefined);
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string | null>(null);

  const handleAddMoment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newMem: MemoryMoment = {
      id: `mem-${Date.now()}`,
      babyId: currentBaby.id,
      milestoneTitle: newTitle.trim(),
      date: newDate,
      caption: newCaption.trim() || (language === 'bn' ? 'অনাবিল সুখের এক সুন্দর মুহূর্ত।' : 'A joyful milestone moment.'),
      photoUrl: newPhotoUrl,
      createdAt: new Date().toISOString(),
    };

    setMoments(prev => [newMem, ...prev]);
    setNewTitle('');
    setNewCaption('');
    setNewPhotoUrl(undefined);
    setIsModalOpen(false);
  };

  const handleDeleteMoment = (id: string) => {
    setMoments(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5 border border-teal-700/60 shadow-md">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-800 text-amber-300 text-xs font-semibold">
            <Camera className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'সোনামণির ছবির ডায়েরি ও স্ক্র্যাপবুক' : 'Baby Photo Scrapbook & Keepsake'}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {language === 'bn' ? `${currentBaby.name}-এর সোনালী স্মৃতির অ্যালবাম` : `${currentBaby.name}'s Milestone Scrapbook`}
          </h3>
          <p className="text-xs sm:text-sm text-teal-100 max-w-xl leading-relaxed">
            {language === 'bn'
              ? 'শিশুর প্রথম কান্না, প্রথম হাসি, মুখেভাত বা প্রথম হাঁটার মতো অমূল্য মুহূর্তগুলো ছবি ও অনুভূতিসহ সাজিয়ে রাখুন। সন্তান বড় হলে এই ডায়েরি হবে জীবনের সেরা উপহার।'
              : 'Preserve cherished milestones with photos and stories from birth to first steps in a timeless memory diary.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95 whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>{language === 'bn' ? 'নতুন ছবির স্মৃতি যোগ করুন' : 'Add Photo Memory'}</span>
        </button>
      </div>

      {/* Moments Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {moments.map((m, idx) => (
          <div
            key={m.id}
            className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs hover:shadow-md hover:border-teal-300 transition-all flex flex-col justify-between group"
          >
            {/* Photo Section */}
            {m.photoUrl ? (
              <div 
                onClick={() => setPreviewPhotoUrl(m.photoUrl || null)}
                className="relative aspect-video w-full bg-slate-900 cursor-pointer overflow-hidden flex items-center justify-center group-hover:opacity-95"
              >
                <img
                  src={m.photoUrl}
                  alt={m.milestoneTitle}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center">
                    <ZoomIn className="w-5 h-5" />
                  </div>
                </div>
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Camera className="w-3 h-3 text-amber-300" />
                  <span>স্মৃতি #{idx + 1}</span>
                </div>
              </div>
            ) : (
              <div className="p-4 pb-0 flex items-center justify-between text-xs text-slate-400">
                <span className="w-7 h-7 rounded-full bg-teal-50 flex items-center justify-center text-teal-800 font-bold text-xs">
                  #{idx + 1}
                </span>
              </div>
            )}

            {/* Content Body */}
            <div className="p-5 sm:p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 text-teal-700 font-semibold">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatFriendlyDate(m.date, language)}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">
                    {currentBaby.name}
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900 leading-snug">
                  {m.milestoneTitle}
                </h4>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs text-slate-700 leading-relaxed italic">
                  "{m.caption}"
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-rose-500 font-semibold">
                  <Heart className="w-3.5 h-3.5 fill-rose-500" />
                  <span>{language === 'bn' ? 'ভালোবাসার মুহূর্ত' : 'Cherished'}</span>
                </span>

                <button
                  type="button"
                  onClick={() => handleDeleteMoment(m.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors"
                  title="স্মৃতি মুছে ফেলুন"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {moments.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-3">
          <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center mx-auto text-2xl">
            📷
          </div>
          <h4 className="text-base font-bold text-slate-800">
            {language === 'bn' ? 'এখনো কোনো স্মৃতি যোগ করা হয়নি' : 'No memories saved yet'}
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {language === 'bn' ? 'সোনামণির সুন্দর একটি ছবি ও অনুভূতি লিখে প্রথম স্মৃতিটি সেভ করুন।' : 'Upload a photo and write a sweet note to preserve the moment.'}
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-teal-700 text-white font-bold text-xs"
          >
            {language === 'bn' ? 'স্মৃতি যোগ করুন' : 'Add First Memory'}
          </button>
        </div>
      )}

      {/* Add Memory Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-teal-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-teal-200" />
                <h3 className="text-base font-bold">
                  {language === 'bn' ? 'সোনামণির নতুন ছবির স্মৃতি সংরক্ষণ' : 'Preserve New Baby Photo Memory'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-teal-200 hover:text-white hover:bg-teal-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMoment} className="p-6 overflow-y-auto space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  {language === 'bn' ? 'স্মৃতির শিরোনাম *' : 'Milestone Title *'}
                </label>
                <input
                  type="text"
                  required
                  value={newTitle ?? ''}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="যেমন: প্রথম মুক্ত পায়ে ৩ কদম হাঁটা / প্রথম মুখেভাত"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  {language === 'bn' ? 'তারিখ' : 'Date'}
                </label>
                <input
                  type="date"
                  required
                  value={newDate ?? ''}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              {/* Photo Upload Component */}
              <div className="pt-1">
                <PhotoUploadPicker
                  selectedPhotoUrl={newPhotoUrl}
                  onChangePhoto={setNewPhotoUrl}
                  language={language}
                  labelBn="সোনামণির ছবি যুক্ত করুন (গ্যালারি বা ক্যামেরা থেকে):"
                  labelEn="Attach Baby Photo (Gallery or Camera):"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  {language === 'bn' ? 'মায়ের অনুভূতির গল্প বা ক্যাপশন' : 'Mother\'s Story or Caption'}
                </label>
                <textarea
                  rows={3}
                  value={newCaption ?? ''}
                  onChange={(e) => setNewCaption(e.target.value)}
                  placeholder="সেই মুহূর্তের আনন্দ, ভালোলাগা বা ভালোবাসার অনুভূতি লিখে রাখুন..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs active:scale-95 transition-all"
                >
                  {language === 'bn' ? 'স্মৃতি ডায়েরিতে সেভ করুন' : 'Save to Scrapbook'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Photo Preview Modal */}
      {previewPhotoUrl && (
        <div 
          onClick={() => setPreviewPhotoUrl(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl">
            <img
              src={previewPhotoUrl}
              alt="Enlarged Memory Photo"
              className="w-full h-full object-contain max-h-[80vh] rounded-2xl shadow-2xl"
            />
            <button
              type="button"
              onClick={() => setPreviewPhotoUrl(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
