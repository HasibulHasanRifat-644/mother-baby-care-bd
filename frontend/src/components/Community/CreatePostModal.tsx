import React, { useState } from 'react';
import { X, Send, MessageSquareHeart } from 'lucide-react';
import { PostCategory } from '../../types/community';
import { Language } from '../../types/vaccine';
import { PhotoUploadPicker } from '../Common/PhotoUploadPicker';

interface CreatePostModalProps {
  isOpen: boolean;
  language: Language;
  onClose: () => void;
  onSubmitPost: (data: { authorName: string; authorCity: string; category: PostCategory; content: string; imageUrl?: string }) => void;
  initialAuthorName?: string;
  initialCity?: string;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  language,
  onClose,
  onSubmitPost,
  initialAuthorName,
  initialCity,
}) => {
  const [authorName, setAuthorName] = useState(initialAuthorName || 'আরিয়ানের আম্মু');
  const [authorCity, setAuthorCity] = useState(initialCity || 'ঢাকা');
  const [category, setCategory] = useState<PostCategory>('advice');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    onSubmitPost({
      authorName: authorName.trim() || (language === 'bn' ? 'একজন মা' : 'A Mother'),
      authorCity: authorCity.trim() || 'বাংলাদেশ',
      category,
      content: content.trim(),
      imageUrl,
    });
    setContent('');
    setImageUrl(undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        <div className="px-6 py-4 bg-teal-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <MessageSquareHeart className="w-5 h-5 text-teal-200" />
            <h3 className="text-base font-bold">
              {language === 'bn' ? 'মায়েদের আড্ডায় পোস্ট বা ছবি শেয়ার করুন' : 'Post or Share Photo in Mother\'s Community'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-teal-200 hover:text-white hover:bg-teal-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                {language === 'bn' ? 'আপনার নাম / পরিচয়:' : 'Your Name / Identity:'}
              </label>
              <input
                type="text"
                required
                value={authorName ?? ''}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="যেমন: আরিয়ানের আম্মু"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                {language === 'bn' ? 'শহর / জেলা:' : 'City / District:'}
              </label>
              <input
                type="text"
                value={authorCity ?? ''}
                onChange={(e) => setAuthorCity(e.target.value)}
                placeholder="যেমন: ঢাকা / চট্টগ্রাম"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              {language === 'bn' ? 'পোস্টের ধরন / বিষয়:' : 'Topic Category:'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'advice', label: '❓ প্রশ্ন ও পরামর্শ' },
                { id: 'milestone', label: '📸 মিষ্টি মুহূর্ত' },
                { id: 'food', label: '🥣 খাবার ও পুষ্টি' },
                { id: 'general', label: '💬 সাধারণ আড্ডা' },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id as PostCategory)}
                  className={`py-1.5 px-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                    category === c.id
                      ? 'bg-teal-700 text-white border-teal-700'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              {language === 'bn' ? 'আপনার কথা, প্রশ্ন বা অভিজ্ঞতা লিখুন:' : 'Your Post or Question:'} *
            </label>
            <textarea
              rows={3}
              required
              value={content ?? ''}
              onChange={(e) => setContent(e.target.value)}
              placeholder={language === 'bn' ? 'যেমন: আমার বাবুর বয়স ৭ মাস, সুন্দর মুহূর্তটি শেয়ার করলাম... অথবা কোনো স্বাস্থ্য প্রশ্ন লিখুন...' : 'Write your question or story here...'}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 resize-none"
            />
          </div>

          {/* Photo Uploader Component */}
          <div className="pt-2 border-t border-slate-100">
            <PhotoUploadPicker
              selectedPhotoUrl={imageUrl}
              onChangePhoto={setImageUrl}
              language={language}
              labelBn="মায়েদের আড্ডায় ছবি যোগ করুন:"
              labelEn="Attach Photo to Post:"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-xl transition-colors"
            >
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs active:scale-95 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'পোস্ট করুন' : 'Publish Post'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
