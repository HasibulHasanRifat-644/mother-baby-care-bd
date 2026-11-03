import React from 'react';
import { X, Play, Clock, CheckCircle2, AlertTriangle, ExternalLink, ShieldCheck } from 'lucide-react';
import { PediatricVideo } from '../../types/video';
import { Language } from '../../types/vaccine';

interface VideoPlayerModalProps {
  video: PediatricVideo | null;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  video,
  isOpen,
  onClose,
  language,
}) => {
  if (!isOpen || !video) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="video-modal-title"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-teal-900 to-slate-900 text-white flex items-center justify-between">
          <div className="space-y-1 pr-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-800/80 text-amber-300 text-[11px] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{video.source}</span>
            </div>
            <h3 id="video-modal-title" className="text-base sm:text-lg font-bold leading-snug">
              {language === 'bn' ? video.titleBn : video.titleEn}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Player Embed (Autoplay Disabled) */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center">
          {video.videoUrl ? (
            <video
              src={video.videoUrl}
              controls
              autoPlay={false}
              className="w-full h-full object-contain"
            />
          ) : video.youtubeId ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=0&rel=0`}
              title={video.titleBn}
              className="w-full h-full border-0"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              {language === 'bn' ? 'ভিডিও ফাইল বা উৎস পাওয়া যায়নি' : 'No video file or source available'}
            </div>
          )}
        </div>

        {/* Video Summary & Key Points */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[45vh] overflow-y-auto bg-slate-50/50">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-200">
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-teal-700" />
              <span>{language === 'bn' ? `ভিডিও দৈর্ঘ্য: ${video.duration}` : `Duration: ${video.duration}`}</span>
            </span>
            {video.youtubeId && (
              <a
                href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-700 hover:text-teal-900 font-semibold inline-flex items-center gap-1 hover:underline"
              >
                <span>{language === 'bn' ? 'ইউটিউবে সরাসরি দেখুন' : 'Watch on YouTube'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
              {language === 'bn' ? 'ভিডিও বিবরণ' : 'Description'}
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {video.descriptionBn}
            </p>
          </div>

          {/* Key practical takeaways */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4">
            <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5 mb-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{language === 'bn' ? 'মা-বাবার জন্য মূল পালনীয় বিষয়সমূহ:' : 'Key Practical Steps for Parents:'}</span>
            </h4>
            <ul className="space-y-1.5">
              {video.keyPointsBn.map((point, idx) => (
                <li key={idx} className="text-xs text-emerald-900 flex items-start gap-2 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency Safety Alert */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold">জরুরি সতর্কতা: </span>
              বাচ্চা খুব বেশি নিস্তেজ হয়ে পড়লে, খিঁচুনি দিলে বা খাবার টানতে না পারলে শুধুমাত্র ভিডিও দেখে সময় নষ্ট করবেন না। অবিলম্বে নিকটস্থ হাসপাতালে যান অথবা <strong>১৬২৬৩</strong> স্বাস্থ্য হেল্পলাইনে ফ্রি কল করুন।
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold transition-all shadow-sm"
          >
            {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
