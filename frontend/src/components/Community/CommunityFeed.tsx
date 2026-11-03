import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Sparkles, 
  PlusCircle, 
  Search, 
  Send, 
  Users, 
  HelpCircle,
  Camera,
  CheckCircle2
} from 'lucide-react';
import { CommunityPost, PostCategory } from '../../types/community';
import { Language } from '../../types/vaccine';
import { toBengaliNumerals } from '../../utils/dateCalculations';

interface CommunityFeedProps {
  posts: CommunityPost[];
  language: Language;
  onOpenCreatePostModal: () => void;
  onReactPost: (postId: string, reactionType: 'like' | 'love' | 'prayer') => void;
  onAddComment: (postId: string, text: string) => void;
}

export const CommunityFeed: React.FC<CommunityFeedProps> = ({
  posts,
  language,
  onOpenCreatePostModal,
  onReactPost,
  onAddComment,
}) => {
  const [activeCategory, setActiveCategory] = useState<PostCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState<Record<string, string>>({});

  const communityBanner = '/src/assets/images/baby_community_mothers_1792750520224.jpg';

  const filteredPosts = posts.filter(p => {
    if (activeCategory !== 'all' && p.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return p.content.toLowerCase().includes(q) || p.authorName.toLowerCase().includes(q);
    }
    return true;
  });

  const handleSendComment = (postId: string) => {
    const text = (commentInput[postId] || '').trim();
    if (!text) return;
    onAddComment(postId, text);
    setCommentInput(prev => ({ ...prev, [postId]: '' }));
  };

  const categoryLabels: Record<string, { labelBn: string; labelEn: string }> = {
    advice: { labelBn: '❓ প্রশ্ন ও পরামর্শ', labelEn: 'Advice & Query' },
    milestone: { labelBn: '📸 মিষ্টি মুহূর্ত', labelEn: 'Milestones' },
    food: { labelBn: '🥣 খাবার ও পুষ্টি', labelEn: 'Food & Nutrition' },
    general: { labelBn: '💬 সাধারণ আড্ডা', labelEn: 'General Chit-Chat' },
    emergency: { labelBn: '🚨 জরুরি সাহায্য', labelEn: 'Emergency' },
  };

  return (
    <div className="space-y-8">
      
      {/* Community Hero Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-3xl overflow-hidden shadow-md text-white border border-teal-700/60">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 space-y-5">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-700/60 text-teal-200 text-xs font-semibold border border-teal-600/50">
                <Users className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'মায়েদের নিরাপদ আড্ডা ও সহায়তা অঙ্গন' : 'Safe Mothers Community Hub'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white text-balance">
                {language === 'bn' ? 'মায়েদের ভালোবাসা ও অভিজ্ঞতার আড্ডা' : 'Motherhood Connections & Real Support'}
              </h2>
              <p className="text-xs sm:text-sm text-teal-100 leading-relaxed max-w-xl">
                {language === 'bn'
                  ? 'বাচ্চার লালন-পালন, প্রথম খাবার, মিষ্টি স্মৃতি কিংবা যেকোনো দুশ্চিন্তা—এখানে শেয়ার করুন হাজারো মমতাময়ী মায়ের সাথে।'
                  : 'Share baby milestones, ask pediatric questions, and get heartfelt advice from experienced mothers across Bangladesh.'}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap pt-1">
              <button
                type="button"
                onClick={onOpenCreatePostModal}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95"
              >
                <PlusCircle className="w-4 h-4 text-slate-950" />
                <span>{language === 'bn' ? 'পোস্ট বা প্রশ্ন করুন' : 'Post or Ask Question'}</span>
              </button>

              <span className="text-xs text-teal-200/80">
                {language === 'bn' ? 'মমতাময়ী মায়েদের উন্মুক্ত ফোরাম' : 'Open caring parenting forum'}
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 h-full p-4 sm:p-6 lg:p-8 flex justify-center">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-teal-600/50 max-w-sm w-full group">
              <img
                src={communityBanner}
                alt="Bangladeshi mothers sharing stories and baby care tips"
                className="w-full h-60 sm:h-64 object-cover object-center group-hover:scale-102 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'মায়েরা এবং শিশুরা - আমাদের ভালোবাসা' : 'Caring Together'}</span>
                </div>
                <p className="text-[11px] text-slate-200 mt-0.5">
                  {language === 'bn' ? 'একে অপরকে পরামর্শ দিয়ে পাশে থাকার নির্ভরযোগ্য প্ল্যাটফর্ম।' : 'Lifting each other through parenting journey.'}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-50 p-2 sm:p-2.5 rounded-2xl border border-slate-200">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 ${
              activeCategory === 'all'
                ? 'bg-teal-700 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            {language === 'bn' ? 'সব আলোচনা' : 'All Posts'}
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('advice')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 ${
              activeCategory === 'advice'
                ? 'bg-teal-700 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            {language === 'bn' ? '❓ প্রশ্ন ও পরামর্শ' : 'Advice'}
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('milestone')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 ${
              activeCategory === 'milestone'
                ? 'bg-teal-700 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            {language === 'bn' ? '📸 মিষ্টি মুহূর্ত' : 'Milestones'}
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('food')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 ${
              activeCategory === 'food'
                ? 'bg-teal-700 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            {language === 'bn' ? '🥣 খাবার ও পুষ্টি' : 'Food'}
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('general')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 ${
              activeCategory === 'general'
                ? 'bg-teal-700 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            {language === 'bn' ? '💬 সাধারণ আড্ডা' : 'General'}
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-56">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery ?? ''}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'bn' ? 'পোস্ট বা বিষয় খুঁজুন...' : 'Search discussions...'}
            className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>

      </div>

      {/* Feed Cards Stream */}
      <div className="space-y-6">
        {filteredPosts.map((post) => {
          const isCommenting = activeCommentPostId === post.id;
          const currentInput = commentInput[post.id] || '';

          return (
            <div
              key={post.id}
              className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-all space-y-4"
            >
              {/* Author Row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    {post.authorName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {post.authorName}
                    </h4>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <span>{post.authorRole}</span>
                      <span aria-hidden="true">·</span>
                      <span>{post.authorCity}</span>
                    </div>
                  </div>
                </div>

                {/* Category Tag */}
                <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 border border-teal-200/70 px-2.5 py-1 rounded-lg shrink-0">
                  {categoryLabels[post.category]?.labelBn || post.category}
                </span>
              </div>

              {/* Content Body */}
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                {post.content}
              </p>

              {/* Attached Photo */}
              {post.imageUrl && (
                <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 aspect-video max-h-80 w-full">
                  <img
                    src={post.imageUrl}
                    alt="Post attachment"
                    className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Reaction & Action Strip */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                
                {/* Reactions */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => onReactPost(post.id, 'love')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors"
                  >
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-50" />
                    <span className="font-semibold text-[11px] font-mono tabular-nums">
                      {language === 'bn' ? toBengaliNumerals(post.lovesCount) : post.lovesCount}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onReactPost(post.id, 'prayer')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-teal-50 text-slate-600 hover:text-teal-700 transition-colors"
                    title="দোয়া"
                  >
                    <span>🤲</span>
                    <span className="font-semibold text-[11px] font-mono tabular-nums">
                      {language === 'bn' ? toBengaliNumerals(post.prayersCount) : post.prayersCount}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveCommentPostId(isCommenting ? null : post.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-slate-500" />
                    <span className="font-semibold text-[11px] font-mono tabular-nums">
                      {language === 'bn' ? toBengaliNumerals(post.comments.length) : post.comments.length}
                    </span>
                    <span className="hidden sm:inline text-slate-500">
                      {language === 'bn' ? 'মতামত' : 'Comments'}
                    </span>
                  </button>
                </div>

                <div className="text-[11px] text-slate-400">
                  {language === 'bn' ? 'সবার জন্য উন্মুক্ত' : 'Public Mother Post'}
                </div>
              </div>

              {/* Comments Section (Expandable) */}
              <div className="space-y-3 pt-2 border-t border-slate-50">
                
                {/* Existing comments */}
                {post.comments.length > 0 && (
                  <div className="space-y-2.5 bg-slate-50/70 p-3.5 rounded-2xl">
                    {post.comments.map((c) => (
                      <div key={c.id} className="text-xs space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{c.authorName}</span>
                          {c.babyAgeText && (
                            <span className="text-[10px] text-teal-700 font-medium">({c.babyAgeText})</span>
                          )}
                          <span className="text-[10px] text-slate-400">· {c.authorCity}</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed text-[11px] pl-1">
                          {c.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Inline Comment Input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={currentInput ?? ''}
                    onChange={(e) => setCommentInput({ ...commentInput, [post.id]: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSendComment(post.id);
                      }
                    }}
                    placeholder={language === 'bn' ? 'মতামত বা পরামর্শ লিখুন...' : 'Write supportive advice...'}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleSendComment(post.id)}
                    className="p-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white shadow-xs transition-all active:scale-95"
                    title="Send"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
