import React, { useState } from 'react';
import { 
  Play, 
  Search, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  PhoneCall, 
  CheckCircle2, 
  Video as VideoIcon, 
  Plus,
  Trash2,
  X,
  Upload,
  Lock,
  Unlock,
  AlertCircle
} from 'lucide-react';
import { PediatricVideo, VideoCategory } from '../../types/video';
import { Language } from '../../types/vaccine';

interface VideoGuideHubProps {
  language: Language;
  isAdminMode: boolean;
  onOpenAdminPinModal: () => void;
  onOpenVideo: (video: PediatricVideo) => void;
  healthAssistantName?: string;
  healthAssistantPhone?: string;
}

const STORAGE_KEY_VIDEOS = 'bd_admin_uploaded_videos_v1';

export const VideoGuideHub: React.FC<VideoGuideHubProps> = ({
  language,
  isAdminMode,
  onOpenAdminPinModal,
  onOpenVideo,
  healthAssistantName,
  healthAssistantPhone,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Videos state: Only admin-uploaded videos. Auto YouTube videos are turned OFF.
  const [videos, setVideos] = useState<PediatricVideo[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_VIDEOS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load admin videos:', e);
    }
    return []; // Auto YouTube video is OFF by default
  });

  // Upload Form State
  const [videoTitle, setVideoTitle] = useState('');
  const [videoCategory, setVideoCategory] = useState<VideoCategory>('vaccine');
  const [videoSourceType, setVideoSourceType] = useState<'file' | 'url'>('file');
  const [videoFileUrl, setVideoFileUrl] = useState('');
  const [videoFileName, setVideoFileName] = useState('');
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [videoDuration, setVideoDuration] = useState('৩:৩০ মিনিট');
  const [videoSource, setVideoSource] = useState(healthAssistantName ? `স্বাস্থ্য সহকারী: ${healthAssistantName}` : 'উপজেলা স্বাস্থ্য সহকারী');
  const [videoDesc, setVideoDesc] = useState('');
  const [videoKeyPoint, setVideoKeyPoint] = useState('');
  const [uploadError, setUploadError] = useState('');

  const categories: { id: string; labelBn: string; labelEn: string; icon: string }[] = [
    { id: 'all', labelBn: 'সব ভিডিও', labelEn: 'All Videos', icon: '🎬' },
    { id: 'vaccine', labelBn: 'টিকার যত্ন ও পার্শ্বপ্রতিক্রিয়া', labelEn: 'Vaccine Care', icon: '💉' },
    { id: 'diarrhea', labelBn: 'ডায়রিয়া ও খাবার স্যালাইন', labelEn: 'ORS & Diarrhea', icon: '💧' },
    { id: 'fever', labelBn: 'জ্বর ও সঠিক স্পঞ্জিং', labelEn: 'Fever & Sponging', icon: '🌡️' },
    { id: 'cold', labelBn: 'সর্দি ও স্বাভাবিক যত্ন', labelEn: 'Cold & Saline Drops', icon: '🤧' },
    { id: 'food', labelBn: 'পুষ্টিকর খিচুড়ি ও পরিপূরক খাবার', labelEn: 'Baby Weaning Food', icon: '🥣' },
    { id: 'emergency', labelBn: 'বিপদচিহ্ন ও জরুরি প্রস্তুতি', labelEn: 'Emergency & Danger Signs', icon: '🚨' },
  ];

  const handleOpenUpload = () => {
    if (!isAdminMode) {
      onOpenAdminPinModal();
      return;
    }
    setUploadError('');
    setIsUploadModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setUploadError(language === 'bn' ? 'অনুগ্রহ করে একটি সঠিক ভিডিও ফাইল নির্বাচন করুন।' : 'Please choose a valid video file.');
      return;
    }

    // Limit to 40MB for localStorage safe storage
    if (file.size > 40 * 1024 * 1024) {
      setUploadError(language === 'bn' ? 'ভিডিও ফাইলটি ৪০ মেগাবাইটের কম হতে হবে।' : 'Video size must be less than 40MB.');
      return;
    }

    setVideoFileName(file.name);
    setUploadError('');

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setVideoFileUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const extractYoutubeId = (url: string): string => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };

  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle.trim()) {
      setUploadError(language === 'bn' ? 'ভিডিওর শিরোনাম আবশ্যক।' : 'Video title is required.');
      return;
    }

    let finalVideoUrl: string | undefined = undefined;
    let finalYoutubeId: string | undefined = undefined;

    if (videoSourceType === 'file') {
      if (!videoFileUrl) {
        setUploadError(language === 'bn' ? 'অনুগ্রহ করে ভিডিও ফাইলটি সিলেক্ট করুন।' : 'Please select a video file.');
        return;
      }
      finalVideoUrl = videoFileUrl;
    } else {
      if (!videoUrlInput.trim()) {
        setUploadError(language === 'bn' ? 'ভিডিও লিঙ্ক বা আইডি প্রদান করুন।' : 'Please enter video link or ID.');
        return;
      }
      const ytId = extractYoutubeId(videoUrlInput.trim());
      if (ytId) {
        finalYoutubeId = ytId;
      } else {
        finalVideoUrl = videoUrlInput.trim();
      }
    }

    const newVideo: PediatricVideo = {
      id: `vid-${Date.now()}`,
      category: videoCategory,
      titleBn: videoTitle.trim(),
      titleEn: videoTitle.trim(),
      duration: videoDuration.trim() || '৩:০০ মিনিট',
      source: videoSource.trim() || 'স্বাস্থ্য সহকারী',
      descriptionBn: videoDesc.trim() || 'দায়িত্বপ্রাপ্ত স্বাস্থ্য সহকারী কর্তৃক আপলোডকৃত ব্যবহারিক স্বাস্থ্য নির্দেশিকা।',
      keyPointsBn: [videoKeyPoint.trim() || 'স্বাস্থ্যকর্মীর পরামর্শ যথাযথভাবে অনুসরণ করুন।'],
      videoUrl: finalVideoUrl,
      youtubeId: finalYoutubeId,
      uploadedBy: 'Authorized Admin / Health Assistant',
      uploadedAt: new Date().toISOString(),
    };

    const updatedVideos = [newVideo, ...videos];
    setVideos(updatedVideos);
    try {
      localStorage.setItem(STORAGE_KEY_VIDEOS, JSON.stringify(updatedVideos));
    } catch (err) {
      console.warn('Could not persist to localStorage:', err);
    }

    // Reset Form
    setVideoTitle('');
    setVideoFileUrl('');
    setVideoFileName('');
    setVideoUrlInput('');
    setVideoDesc('');
    setVideoKeyPoint('');
    setIsUploadModalOpen(false);
  };

  const handleDeleteVideo = (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAdminMode) {
      onOpenAdminPinModal();
      return;
    }
    if (confirm(language === 'bn' ? 'আপনি কি এই ভিডিওটি মুছে ফেলতে চান?' : 'Are you sure you want to delete this video?')) {
      const updated = videos.filter(v => v.id !== videoId);
      setVideos(updated);
      localStorage.setItem(STORAGE_KEY_VIDEOS, JSON.stringify(updated));
    }
  };

  const filteredVideos = videos.filter((video) => {
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;

    const matchesQuery =
      video.titleBn.toLowerCase().includes(q) ||
      video.titleEn.toLowerCase().includes(q) ||
      video.descriptionBn.toLowerCase().includes(q) ||
      video.keyPointsBn.some(k => k.toLowerCase().includes(q));

    return matchesCategory && matchesQuery;
  });

  return (
    <div className="space-y-6">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md border border-teal-700/60 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-700/60 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'অ্যাডমিন পরিচালিত স্বাস্থ্য ভিডিও নির্দেশিকা' : 'Admin-Managed Clinical Video Library'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {language === 'bn' ? '🎥 শিশু যত্ন ও স্বাস্থ্য নির্দেশিকা ভিডিও' : 'Baby Health Care Video Demonstrations'}
          </h2>
          <p className="text-xs sm:text-sm text-teal-100 max-w-2xl leading-relaxed">
            {language === 'bn'
              ? 'শুধুমাত্র দায়িত্বপ্রাপ্ত স্বাস্থ্য সহকারী ও অ্যাডমিন কর্তৃক অনুমোদিত ও আপলোডকৃত ব্যবহারিক ভিডিও নির্দেশিকা। এখানে কোনো অপ্রাসঙ্গিক বা অটোমেটিক ভিডিও চালানো হয় না।'
              : 'Direct clinical demonstrations uploaded by authorized health personnel and administrators. No automatic playback.'}
          </p>
        </div>

        {/* Upload & Emergency Action Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleOpenUpload}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95 whitespace-nowrap"
          >
            <Upload className="w-4 h-4 text-slate-950" />
            <span>{language === 'bn' ? 'ভিডিও আপলোড করুন (অ্যাডমিন)' : 'Upload Video (Admin)'}</span>
            {!isAdminMode && <Lock className="w-3.5 h-3.5 text-slate-800 ml-0.5" />}
          </button>

          <a
            href={`tel:${healthAssistantPhone || '01712-345678'}`}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95 whitespace-nowrap"
          >
            <PhoneCall className="w-4 h-4 text-white" />
            <span>{healthAssistantPhone || '01712-345678'}</span>
          </a>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'bn' ? 'আপলোডকৃত ভিডিও খুঁজুন (যেমন: টিকা যত্ন, স্যালাইন, জ্বর, সর্দি)...' : 'Search uploaded videos (e.g. vaccine, ORS, fever)...'}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white bg-slate-50 transition-all"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                  isSelected
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{language === 'bn' ? cat.labelBn : cat.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Videos Grid */}
      {filteredVideos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group relative"
            >
              {/* Thumbnail / Video Preview Box */}
              <div 
                onClick={() => onOpenVideo(video)}
                className="relative aspect-video bg-slate-900 cursor-pointer overflow-hidden flex items-center justify-center group-hover:opacity-95 transition-all"
              >
                {video.youtubeId ? (
                  <img
                    src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                    alt={video.titleBn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : video.videoUrl ? (
                  <video
                    src={video.videoUrl}
                    className="w-full h-full object-cover opacity-80"
                    preload="metadata"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-teal-400 gap-2">
                    <VideoIcon className="w-10 h-10 opacity-70" />
                    <span className="text-xs font-medium text-slate-300">{video.source}</span>
                  </div>
                )}

                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                  <div className="w-13 h-13 rounded-full bg-teal-600 group-hover:bg-teal-500 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                </div>

                {/* Source & Duration Tag */}
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>{video.source}</span>
                </div>

                <div className="absolute bottom-3 right-3 bg-black/80 text-white text-[11px] font-mono px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-300" />
                  <span>{video.duration}</span>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md">
                      {video.uploadedBy || 'অনুমোদিত অ্যাডমিন'}
                    </span>
                    {isAdminMode && (
                      <button
                        type="button"
                        onClick={(e) => handleDeleteVideo(video.id, e)}
                        className="text-rose-600 hover:text-rose-800 p-1 rounded-lg hover:bg-rose-50 transition-colors"
                        title={language === 'bn' ? 'মুছে ফেলুন' : 'Delete'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <h3 
                    onClick={() => onOpenVideo(video)}
                    className="font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-teal-700 cursor-pointer transition-colors"
                  >
                    {language === 'bn' ? video.titleBn : video.titleEn}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {video.descriptionBn}
                  </p>
                </div>

                {/* Key Point Highlight */}
                {video.keyPointsBn?.[0] && (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-[11px] text-slate-700 space-y-1">
                    <div className="font-bold text-teal-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-teal-600" />
                      <span>{language === 'bn' ? 'জরুরি নির্দেশিকা:' : 'Key Note:'}</span>
                    </div>
                    <p className="line-clamp-1 italic text-slate-600">
                      "{video.keyPointsBn[0]}"
                    </p>
                  </div>
                )}

                {/* Watch Button */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenVideo(video)}
                    className="w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>{language === 'bn' ? 'ভিডিও নির্দেশিকা দেখুন' : 'Watch Demonstration'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Clean Empty State when no admin videos are uploaded yet */
        <div className="text-center py-12 px-6 bg-white rounded-3xl border border-dashed border-slate-300 space-y-4 max-w-xl mx-auto shadow-2xs">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center mx-auto text-2xl">
            🎥
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-slate-900">
              {language === 'bn' ? 'বর্তমানে কোনো স্বাস্থ্য নির্দেশিকা ভিডিও আপলোড করা নেই' : 'No Demonstration Videos Uploaded Yet'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {language === 'bn'
                ? 'অপ্রাসঙ্গিক ইউটিউব ভিডিও বন্ধ রাখা হয়েছে। শুধুমাত্র দায়িত্বপ্রাপ্ত স্বাস্থ্য সহকারী ও অনুমোদিত অ্যাডমিন এখানে স্থানীয় মা-বাবাদের জন্য প্রয়োজনীয় ভিডিও আপলোড করতে পারবেন।'
                : 'Automatic YouTube videos are turned off. Only authorized admins and health workers can upload verified practical guides.'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenUpload}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'bn' ? 'প্রথম ভিডিও আপলোড করুন (অ্যাডমিন)' : 'Upload First Video (Admin)'}</span>
            {!isAdminMode && <Lock className="w-3 h-3 text-teal-200" />}
          </button>
        </div>
      )}

      {/* ADMIN UPLOAD VIDEO MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div 
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-teal-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-700 flex items-center justify-center text-teal-200">
                  <Upload className="w-4 h-4 text-teal-200" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {language === 'bn' ? 'নতুন ভিডিও নির্দেশিকা আপলোড' : 'Upload Health Video Demo'}
                  </h3>
                  <p className="text-[11px] text-teal-200">
                    {language === 'bn' ? 'শুধুমাত্র অনুমোদিত স্বাস্থ্য সহকারী ও অ্যাডমিন কর্তৃক' : 'Authorized Health Assistant & Admin Only'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveVideo} className="p-5 sm:p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              {uploadError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Title */}
              <div className="space-y-1">
                <label className="font-bold text-slate-800">
                  {language === 'bn' ? 'ভিডিও শিরোনাম *' : 'Video Title *'}
                </label>
                <input
                  type="text"
                  required
                  value={videoTitle ?? ''}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder={language === 'bn' ? 'যেমন: টিকার ব্যথায় কোল্ড প্যাক দেওয়ার নিয়ম' : 'e.g. How to apply cold pack for vaccine soreness'}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="font-bold text-slate-800">
                  {language === 'bn' ? 'বিষয় / ক্যাটেগরি' : 'Category'}
                </label>
                <select
                  value={videoCategory ?? 'vaccine'}
                  onChange={(e) => setVideoCategory(e.target.value as VideoCategory)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  <option value="vaccine">{language === 'bn' ? 'টিকার যত্ন ও ব্যথা' : 'Vaccine Care'}</option>
                  <option value="diarrhea">{language === 'bn' ? 'ডায়রিয়া ও খাবার স্যালাইন' : 'ORS & Diarrhea'}</option>
                  <option value="fever">{language === 'bn' ? 'জ্বর ও সঠিক স্পঞ্জিং' : 'Fever & Sponging'}</option>
                  <option value="cold">{language === 'bn' ? 'সর্দি ও নাক পরিষ্কার' : 'Cold & Saline Drops'}</option>
                  <option value="food">{language === 'bn' ? 'পুষ্টিকর খিচুড়ি ও খাবার' : 'Baby Food & Weaning'}</option>
                  <option value="emergency">{language === 'bn' ? 'বিপদচিহ্ন ও জরুরি যত্ন' : 'Emergency & Danger Signs'}</option>
                </select>
              </div>

              {/* Source Type Toggle */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800">
                  {language === 'bn' ? 'ভিডিওর উৎস নির্বাচন করুন' : 'Video Source'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setVideoSourceType('file')}
                    className={`p-2.5 rounded-xl font-bold border transition-all text-center ${
                      videoSourceType === 'file'
                        ? 'bg-teal-50 border-teal-600 text-teal-900'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    📁 ভিডিও ফাইল আপলোড
                  </button>
                  <button
                    type="button"
                    onClick={() => setVideoSourceType('url')}
                    className={`p-2.5 rounded-xl font-bold border transition-all text-center ${
                      videoSourceType === 'url'
                        ? 'bg-teal-50 border-teal-600 text-teal-900'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    🔗 ভিডিও লিংক / আইডি
                  </button>
                </div>
              </div>

              {/* File Input */}
              {videoSourceType === 'file' ? (
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">
                    {language === 'bn' ? 'ভিডিও ফাইল নির্বাচন করুন (MP4/WebM) *' : 'Choose Video File (MP4/WebM) *'}
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileUpload}
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-800 hover:file:bg-teal-100 cursor-pointer border border-slate-200 rounded-xl p-2 bg-slate-50"
                  />
                  {videoFileName && (
                    <p className="text-[11px] text-teal-700 font-semibold">
                      ✓ নির্বাচিত ফাইল: {videoFileName}
                    </p>
                  )}
                </div>
              ) : (
                /* URL Input */
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">
                    {language === 'bn' ? 'ভিডিও লিংক বা ইউটিউব আইডি *' : 'Video Link or YouTube ID *'}
                  </label>
                  <input
                    type="text"
                    value={videoUrlInput ?? ''}
                    onChange={(e) => setVideoUrlInput(e.target.value)}
                    placeholder="https://youtu.be/... অথবা নির্দিষ্ট ভিডিও ইউআরএল"
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              )}

              {/* Presenter / Center Name & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">
                    {language === 'bn' ? 'উপস্থাপক / স্বাস্থ্য সহকারী' : 'Presenter / Assistant'}
                  </label>
                  <input
                    type="text"
                    value={videoSource ?? ''}
                    onChange={(e) => setVideoSource(e.target.value)}
                    placeholder="যেমন: নাসরিন আক্তার (স্বাস্থ্য সহকারী)"
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">
                    {language === 'bn' ? 'ভিডিওর সময়কাল' : 'Duration'}
                  </label>
                  <input
                    type="text"
                    value={videoDuration ?? ''}
                    onChange={(e) => setVideoDuration(e.target.value)}
                    placeholder="যেমন: ৩:৩০ মিনিট"
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="font-bold text-slate-800">
                  {language === 'bn' ? 'ভিডিও বিবরণ' : 'Description'}
                </label>
                <textarea
                  rows={2}
                  value={videoDesc ?? ''}
                  onChange={(e) => setVideoDesc(e.target.value)}
                  placeholder={language === 'bn' ? 'ভিডিওতে প্রদর্শিত বিষয় সংক্ষেপে লিখুন...' : 'Brief description of the instructions...'}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              {/* Key Note */}
              <div className="space-y-1">
                <label className="font-bold text-slate-800">
                  {language === 'bn' ? 'মা-বাবার জন্য মূল পালনীয় টিপস' : 'Key Tip for Parents'}
                </label>
                <input
                  type="text"
                  value={videoKeyPoint ?? ''}
                  onChange={(e) => setVideoKeyPoint(e.target.value)}
                  placeholder={language === 'bn' ? 'যেমন: টিকার স্থানে কোনো মালিশ বা সুঁই ছোঁয়াবেন না।' : 'e.g. Do not rub or apply balm on the injection site.'}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold shadow-xs transition-all active:scale-95"
                >
                  {language === 'bn' ? 'ভিডিও সংরক্ষণ ও প্রকাশ করুন' : 'Save & Publish Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
