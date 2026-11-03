import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  PhoneCall, 
  User, 
  RefreshCw, 
  AlertTriangle,
  ShieldCheck,
  Play,
  Clock,
  Video as VideoIcon,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { BabyProfile, Language } from '../../types/vaccine';
import { PediatricVideo } from '../../types/video';
import { calculateAge } from '../../utils/dateCalculations';
import { generatePediatricAdvice } from '../../utils/pediatricAdvisor';
import { findMatchingVideos } from '../../data/videoGuidesData';
import { VideoPlayerModal } from '../VideoGuides/VideoPlayerModal';

interface Message {
  id: string;
  sender: 'user' | 'doctor';
  text: string;
  timestamp: string;
  matchingVideos?: PediatricVideo[];
}

interface DoctorApaChatProps {
  currentBaby: BabyProfile;
  language: Language;
  onOpenVideoHub?: () => void;
}

export const DoctorApaChat: React.FC<DoctorApaChatProps> = ({
  currentBaby,
  language,
  onOpenVideoHub,
}) => {
  const babyAgeText = calculateAge(currentBaby.dateOfBirth, language);

  const initialGreeting: Message = {
    id: 'msg-welcome',
    sender: 'doctor',
    text: language === 'bn'
      ? `আসসালামু আলাইকুম! আমি **ডাক্তার**, আপনার ও আপনার সোনামণি **${currentBaby.name || 'সোনামণি'}**-এর সার্বক্ষণিক স্বাস্থ্য ও যত্ন সহকারী।\n\nবাচ্চার পাতলা পায়খানা, গা গরম/জ্বর, টিকা পরবর্তী ব্যথা, সর্দি-কাশি, খাবার খিচুড়ি বা যেকোনো অসুস্থতায় প্রশ্ন করুন। আমি আপনাকে সুনির্দিষ্ট নিয়ম ও প্রাসঙ্গিক **ব্যবহারিক ভিডিও ডেমোসহ** সঠিক পরামর্শ দেব।`
      : `Hello! I am your pediatric AI **Doctor** for **${currentBaby.name || 'Baby'}** (${babyAgeText}). Ask me anything about vaccines, fever, diarrhea, weaning food, or cold—I will provide guidance with practical video demos!`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  const [messages, setMessages] = useState<Message[]>([initialGreeting]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeVideoModal, setActiveVideoModal] = useState<PediatricVideo | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const quickQuestions = [
    { bn: 'বাচ্চার পাতলা পায়খানা হলে স্যালাইন ও জিংক কীভাবে দেব?', en: 'How to give ORS & Zinc for baby diarrhea?' },
    { bn: 'জ্বর হলে শরীর কীভাবে স্পঞ্জ করে তাপমাত্রা কমাব?', en: 'How to sponge baby for fever?' },
    { bn: 'টিকা দেওয়ার পর পা ফুলে গেলে বা ব্যথা হলে কী করব?', en: 'What to do for leg swelling after vaccine?' },
    { bn: 'সর্দিতে বাচ্চার নাক বন্ধ থাকলে স্যালাইন ড্রপ কীভাবে দেব?', en: 'How to give saline drops for blocked nose?' },
    { bn: 'দুধ খাওয়ার পর বাচ্চার ঢেকুর তোলানোর সঠিক নিয়ম কী?', en: 'How to burp baby properly after feeding?' },
    { bn: 'বাচ্চাকে প্রথম খিচুড়ি কীভাবে রান্না করে দেব?', en: 'How to prepare first baby khichuri?' },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    try {
      const history = messages.slice(-4).map(m => ({
        role: m.sender === 'user' ? ('user' as const) : ('model' as const),
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history,
          babyContext: {
            name: currentBaby.name,
            age: babyAgeText,
            gender: currentBaby.gender,
            birthWeight: currentBaby.birthWeightKg,
          },
        }),
      });

      const data = await res.json();
      const replyText = data.reply || data.fallback || generatePediatricAdvice(text, {
        name: currentBaby.name,
        age: babyAgeText,
        gender: currentBaby.gender,
        birthWeight: currentBaby.birthWeightKg,
      });

      // Find matching video demonstrations based on user query and response context
      const matched = findMatchingVideos(`${text} ${replyText}`);

      const doctorMessage: Message = {
        id: `doc-${Date.now()}`,
        sender: 'doctor',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        matchingVideos: matched.length > 0 ? matched : undefined,
      };

      setMessages(prev => [...prev, doctorMessage]);
    } catch (err) {
      console.warn('Backend fetch failed, using built-in pediatric knowledge engine:', err);
      const fallbackAdvice = generatePediatricAdvice(text, {
        name: currentBaby.name,
        age: babyAgeText,
        gender: currentBaby.gender,
        birthWeight: currentBaby.birthWeightKg,
      });

      const matched = findMatchingVideos(`${text} ${fallbackAdvice}`);

      const doctorMessage: Message = {
        id: `doc-${Date.now()}`,
        sender: 'doctor',
        text: fallbackAdvice,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        matchingVideos: matched.length > 0 ? matched : undefined,
      };
      setMessages(prev => [...prev, doctorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([initialGreeting]);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md border border-teal-700/60 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold text-2xl shadow-sm shrink-0">
            🩺
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-700/60 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'স্বয়ংক্রিয় এআই শিশু বিশেষজ্ঞ ও ভিডিও গাইড' : '24/7 AI Pediatric Care & Video Demos'}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {language === 'bn' ? 'ডাক্তার (Doctor AI) - সার্বক্ষণিক পরামর্শক' : 'Doctor AI - Instant Pediatric Care Guide'}
            </h3>
            <p className="text-xs sm:text-sm text-teal-100 max-w-2xl leading-relaxed">
              {language === 'bn'
                ? `সোনামণি ${currentBaby.name} (${babyAgeText})-এর বয়স অনুযায়ী জ্বর, পাতলা পায়খানা, সর্দি, বা টিকার ব্যথা সংক্রান্ত যেকোনো প্রশ্নে নির্ভরযোগ্য সমাধান ও ব্যবহারিক ভিডিও ডেমো পান।`
                : `Instant evidence-based medical advice and video demonstrations tailored to ${currentBaby.name} (${babyAgeText}).`}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {onOpenVideoHub && (
            <button
              type="button"
              onClick={onOpenVideoHub}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95 whitespace-nowrap border border-teal-500/50"
            >
              <VideoIcon className="w-4 h-4 text-amber-300" />
              <span>ভিডিও লাইব্রেরি</span>
            </button>
          )}

          <a
            href="tel:16263"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95 whitespace-nowrap"
          >
            <PhoneCall className="w-4 h-4 text-slate-950" />
            <span>১৬২৬৩ স্বাস্থ্য বাতায়ন</span>
          </a>
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs flex flex-col h-[700px]">
        
        {/* Chat Sub-Header */}
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-xs text-slate-600">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-slate-900">🩺 ডাক্তার সক্রিয়</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>শিশুর বয়স: <strong className="text-teal-700">{babyAgeText}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClearChat}
              className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 hover:bg-slate-200/50 px-2 py-1 rounded-lg transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{language === 'bn' ? 'নতুন আলোচনা' : 'Reset Chat'}</span>
            </button>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-50/40">
          {messages.map((msg) => {
            const isDoctor = msg.sender === 'doctor';

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isDoctor ? 'justify-start' : 'justify-end'}`}
              >
                {isDoctor && (
                  <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs mt-1">
                    🩺
                  </div>
                )}

                <div
                  className={`max-w-[92%] sm:max-w-[80%] rounded-3xl p-4 sm:p-5 shadow-xs space-y-2.5 ${
                    isDoctor
                      ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'
                      : 'bg-teal-700 text-white rounded-tr-sm'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 pb-1.5 border-b border-black/5 text-[10px] opacity-75">
                    <span className="font-semibold">
                      {isDoctor ? 'ডাক্তার (পরামর্শ ও গাইড)' : currentBaby.name ? `${currentBaby.name}-এর অভিভাবক` : 'মা / বাবা'}
                    </span>
                    <span className="font-mono">{msg.timestamp}</span>
                  </div>

                  <div className={`text-xs sm:text-sm leading-relaxed whitespace-pre-line ${isDoctor ? 'text-slate-800' : 'text-white'}`}>
                    {msg.text}
                  </div>

                  {/* Matching Video Demonstration Cards */}
                  {isDoctor && msg.matchingVideos && msg.matchingVideos.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-teal-800">
                        <VideoIcon className="w-4 h-4 text-teal-600" />
                        <span>প্রাসঙ্গিক ব্যবহারিক ভিডিও গাইড:</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {msg.matchingVideos.map((video) => (
                          <div
                            key={video.id}
                            onClick={() => setActiveVideoModal(video)}
                            className="bg-teal-50/70 hover:bg-teal-100/70 border border-teal-200 rounded-2xl p-2.5 cursor-pointer transition-all flex items-center gap-3 group"
                          >
                            <div className="relative w-16 h-12 bg-slate-900 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                              <img
                                src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                                alt={video.titleBn}
                                className="w-full h-full object-cover"
                                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                                <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center">
                                  <Play className="w-3 h-3 fill-white ml-0.5" />
                                </div>
                              </div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <h5 className="text-xs font-bold text-slate-900 truncate group-hover:text-teal-900">
                                {video.titleBn}
                              </h5>
                              <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                                <span className="text-teal-700 font-semibold">{video.source.split(' ')[0]}</span>
                                <span>•</span>
                                <span>{video.duration}</span>
                              </div>
                            </div>

                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700 transition-colors shrink-0" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {!isDoctor && (
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs shrink-0 shadow-xs mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                🩺
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-4 text-xs text-slate-500 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-teal-600 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-teal-600 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-teal-600 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 text-slate-600 font-medium">ডাক্তার সঠিক গাইড ও ভিডিও খুঁজছেন...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <span className="text-[11px] text-slate-400 font-semibold whitespace-nowrap mr-1">
            {language === 'bn' ? 'সচরাচর প্রশ্ন:' : 'Quick:'}
          </span>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => handleSendMessage(language === 'bn' ? q.bn : q.en)}
              className="px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-white hover:bg-teal-50 hover:text-teal-900 border border-slate-200 hover:border-teal-300 rounded-lg whitespace-nowrap transition-all shrink-0"
            >
              {language === 'bn' ? q.bn : q.en}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText ?? ''}
              disabled={isLoading}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={language === 'bn' ? 'বাচ্চার পাতলা পায়খানা, জ্বর, সর্দি, টিকার ব্যথা বা খাবার নিয়ে ডাক্তারকে লিখুন...' : 'Ask Doctor any baby care or health question...'}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="px-5 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95 flex items-center gap-1.5 shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">{language === 'bn' ? 'পরামর্শ নিন' : 'Send'}</span>
            </button>
          </form>

          <p className="text-[10px] text-slate-400 text-center mt-2">
            {language === 'bn' 
              ? '⚠️ এটি নির্ভরযোগ্য স্বাস্থ্য সহকারী। জরুরি বিপদচিহ্ন দেখা দিলে দেরি না করে সরাসরি শিশু বিশেষজ্ঞ বা ১৬২৬৩ নম্বরে যোগাযোগ করুন।'
              : '⚠️ AI pediatric advisor for guidance. In severe emergencies, consult an in-person pediatrician or call 16263.'}
          </p>
        </div>

      </div>

      {/* Video Player Modal */}
      <VideoPlayerModal
        video={activeVideoModal}
        isOpen={!!activeVideoModal}
        onClose={() => setActiveVideoModal(null)}
        language={language}
      />

    </div>
  );
};

export const DoctorSahebChat = DoctorApaChat;
