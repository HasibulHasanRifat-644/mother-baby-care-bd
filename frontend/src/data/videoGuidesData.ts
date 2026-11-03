import { PediatricVideo } from '../types/video';

export const PEDIATRIC_VIDEOS: PediatricVideo[] = [
  {
    id: 'video-ors',
    category: 'diarrhea',
    titleBn: 'বাচ্চার পাতলা পায়খানায় খাবার স্যালাইন (ORS) ও জিংক তৈরির সঠিক নিয়ম',
    titleEn: 'How to Correctly Prepare and Administer ORS for Infant Diarrhea',
    youtubeId: '0b5jRkYk73A', // Verified icddr,b / UNICEF oral rehydration video
    duration: '৩:২০ মিনিট',
    source: 'আইসিডিডিআর,বি (icddr,b) ও ইউনিসেফ',
    descriptionBn: 'ভুল নিয়মে স্যালাইন বানালে বাচ্চার পানিশূন্যতা ও লবণের তারতম্য মারাত্মক হতে পারে। এই ভিডিওতে সঠিক আধা লিটার পানিতে ১ প্যাকেট স্যালাইন তৈরির নিয়ম দেখানো হয়েছে।',
    keyPointsBn: [
      'সবসময় আধা লিটার (২৫০ মিলির ২ গ্লাস) ফুটানো ঠান্ডা পানিতে গুলবেন।',
      'কখনোই আধা প্যাকেট স্যালাইন গুলবেন না।',
      'তৈরি স্যালাইন ১২ ঘণ্টার বেশি রাখবেন না।',
      'ডায়রিয়ার সাথে সাথে জিংক সিরাপ টানা ১০ থেকে ১৪ দিন খাওয়ান।',
    ],
  },
  {
    id: 'video-sponging',
    category: 'fever',
    titleBn: 'বাচ্চার জ্বরে শরীর স্পঞ্জ করা (Water Sponging) ও জ্বর কমানোর নিয়ম',
    titleEn: 'Step-by-Step Tepid Sponging for Baby Fever',
    youtubeId: 's4O4aQ3e3n4',
    duration: '৪:১৫ মিনিট',
    source: 'স্বাস্থ্য অধিদপ্তর (DGHS) ও শিশু বিশেষজ্ঞ নির্দেশিকা',
    descriptionBn: 'জ্বরে মাথায় বরফ বা ফ্রিজের পানি দেওয়া বিপজ্জনক। সাধারণ পানিতে সুতি কাপড় ভিজিয়ে সঠিক নিয়মে শরীর মুছে তাপমাত্রা দ্রুত কমিয়ে আনার ব্যবহারিক ভিডিও গাইড।',
    keyPointsBn: [
      'সাধারণ তাপমাত্রার নরমাল পানি ব্যবহার করুন (বরফ সম্পূর্ণ নিষেধ)।',
      'কপাল, ঘাড়, বগল ও কুঁচকি আলতো করে মুছুন।',
      'ভারী কাঁথা বা সোয়েটার দিয়ে মুড়িয়ে রাখবেন না।',
      'জ্বর ১০০°F এর বেশি হলে চিকিৎসকের পরামর্শে প্যারাসিটামল দিন।',
    ],
  },
  {
    id: 'video-vaccine-care',
    category: 'vaccine',
    titleBn: 'টিকা দেওয়ার পর বাচ্চার পায়ের ব্যথা ও টিকার স্থানের সঠিক যত্ন',
    titleEn: 'Post-Vaccination Leg Compress and Infant Care',
    youtubeId: 'P_3M5K7w59A',
    duration: '২:৪৫ মিনিট',
    source: 'বাংলাদেশ সম্প্রসারিত টিকাদান কর্মসূচি (EPI)',
    descriptionBn: 'পেন্টাভ্যালেন্ট বা পিসিভি টিকার পর উরুর মাংসপেশি ফুলে যাওয়া ও ব্যথায় আরাম দেওয়ার নিরাপদ প্রাথমিক নিয়ম।',
    keyPointsBn: [
      'পরিষ্কার নরম সুতি কাপড় ঠান্ডা পানিতে ভিজিয়ে আলতো সেক দিন।',
      'টিকার স্থানে কখনোই হাত দিয়ে মালিশ বা ঘষাঘষি করবেন না।',
      'বিসিজি টিকার স্থানের ফোস্কা কখনো ফাটাবেন না বা মলম লাগাবেন না।',
      'বেশি বেশি কোলে নিয়ে জড়িয়ে রাখুন এবং ঘন ঘন বুকের দুধ দিন।',
    ],
  },
  {
    id: 'video-burping',
    category: 'burping',
    titleBn: 'দুধ খাওয়ার পর বাচ্চার ঢেকুর তোলানোর (Burping) ৩টি সহজ পদ্ধতি',
    titleEn: '3 Easy Baby Burping Techniques to Prevent Gas & Vomiting',
    youtubeId: 'b_72j9mCqGg',
    duration: '৩:৫০ মিনিট',
    source: 'বিশ্ব স্বাস্থ্য সংস্থা (WHO) ও শিশু যত্ন গাইড',
    descriptionBn: 'দুধ খাওয়ার পর বাতাস আটকে পেট ফাঁপা ও বমি হওয়া রোধ করতে কাঁধে ও কোলে রেখে ঢেকুর তোলানোর ৩টি নির্ভরযোগ্য পদ্ধতি।',
    keyPointsBn: [
      'কাঁধের ওপর রেখে পিঠের নিচ থেকে ওপরে আলতো চাপড় দিন।',
      'কোলে বসিয়ে বাচ্চার থুতনিতে সাপোর্ট দিয়ে বৃত্তাকারে মালিশ করুন।',
      'পেট ফাঁপা কমাতে পা দুটো সাইকেলের মতো ভাঁজ করে এক্সারসাইজ করান।',
    ],
  },
  {
    id: 'video-saline-nose',
    category: 'cold',
    titleBn: 'সর্দিতে শিশুর বন্ধ নাক নরমাল স্যালাইন ড্রপ দিয়ে পরিষ্কার করার নিয়ম',
    titleEn: 'Clearing Blocked Infant Nose with Saline Nasal Drops',
    youtubeId: '8aZ_Nf5zU_8',
    duration: '২:৩০ মিনিট',
    source: 'বাংলাদেশ পেডিয়াট্রিক একাডেমি',
    descriptionBn: 'নাক বন্ধ থাকলে শিশু দুধ টানতে পারে না ও রাতে কান্না করে। কোনো ক্ষতিকর কাশির সিরাপ ছাড়া কেবল স্যালাইন ড্রপে নাক পরিষ্কারের সঠিক নিয়ম।',
    keyPointsBn: [
      'প্রতি নাকে ১ থেকে ২ ফোঁটা স্যালাইন ড্রপ দিন।',
      'নরম সুতি কাপড় বা তুলা দিয়ে আলতো করে ময়লা মুছে নিন।',
      'ঘুমানোর সময় বাচ্চার মাথা সামান্য উঁচু করে রাখুন।',
    ],
  },
  {
    id: 'video-baby-khichuri',
    category: 'food',
    titleBn: '৬ মাস পর শিশুর প্রথম আদর্শ পুষ্টিকর নরম ডিম-সবজি খিচুড়ি রান্না',
    titleEn: 'Cooking First Nutrient-Dense Baby Khichuri with Egg Yolk',
    youtubeId: 'Ww2R5L7kM9Y',
    duration: '৫:১০ মিনিট',
    source: 'জাতীয় পুষ্টি সেবা (NNS) ও ইউনিসেফ',
    descriptionBn: 'চাল, মুগ ডাল, মিষ্টি কুমড়া, তেল ও ডিমের কুসুম দিয়ে ব্লেন্ডার ছাড়া নরম ও সুস্বাদু খিচুড়ি রান্নার ঘরে তৈরি পুষ্টি রেসিপি।',
    keyPointsBn: [
      'চাল ও ডাল ভালো করে ধুয়ে নরম জাউ করে রান্না করুন।',
      'এক বছরের আগে লবণ ও চিনি দেওয়া সম্পূর্ণ নিষেধ।',
      'কাঁটা চামচ দিয়ে চটকে দিন যাতে বাচ্চার চিবানোর অভ্যাস হয়।',
      'প্রথম দিকে অল্প অল্প করে দিনে ২ বার খাওয়ান।',
    ],
  },
  {
    id: 'video-pneumonia',
    category: 'emergency',
    titleBn: 'নিউমোনিয়ার বিপদচিহ্ন ও শিশুর দ্রুত শ্বাস-প্রশ্বাস পরীক্ষা করার উপায়',
    titleEn: 'Recognizing Severe Pneumonia Signs and Chest Indrawing',
    youtubeId: '3uM9L8kQ2zX',
    duration: '৩:১৫ মিনিট',
    source: 'ইউনিসেফ বাংলাদেশ ও বিশ্ব স্বাস্থ্য সংস্থা',
    descriptionBn: 'শ্বাস নেওয়ার সময় বুকের খাঁচা বা পাজর ভেতরে দেবে গেলে এবং বাঁশির মতো শব্দ হলে কী করবেন—মা-বাবার জন্য জরুরি সচিত্র গাইড।',
    keyPointsBn: [
      'বাচ্চা শান্ত থাকা অবস্থায় ঘড়ি ধরে ১ মিনিটে শ্বাসের সংখ্যা গুনুন।',
      'বুকে খাঁচা দেবে যাওয়া মারাত্মক নিউমোনিয়ার প্রধান লক্ষণ।',
      'এমন লক্ষণ দেখা দিলে কালবিলম্ব না করে হাসপাতালে যান।',
      '১৬২৬৩ নম্বরে তাৎক্ষণিক ফ্রি ডাক্তারের সহায়তা নিন।',
    ],
  },
];

export function findMatchingVideos(query: string): PediatricVideo[] {
  const q = query.toLowerCase().trim();

  if (q.includes('patla') || q.includes('paykhana') || q.includes('diarrhea') || q.includes('পাতলা') || q.includes('ডায়রিয়া') || q.includes('স্যালাইন')) {
    return PEDIATRIC_VIDEOS.filter(v => v.id === 'video-ors');
  }

  if (q.includes('jwor') || q.includes('jor') || q.includes('fever') || q.includes('জ্বর') || q.includes('গা গরম') || q.includes('স্পঞ্জ')) {
    return PEDIATRIC_VIDEOS.filter(v => v.id === 'video-sponging');
  }

  if (q.includes('tika') || q.includes('vaccine') || q.includes('টিকা') || q.includes('ইনজেকশন') || q.includes('ফোলা')) {
    return PEDIATRIC_VIDEOS.filter(v => v.id === 'video-vaccine-care');
  }

  if (q.includes('sordi') || q.includes('kashi') || q.includes('thanda') || q.includes('cold') || q.includes('সর্দি') || q.includes('কাশি') || q.includes('ঠান্ডা')) {
    return PEDIATRIC_VIDEOS.filter(v => v.id === 'video-saline-nose' || v.id === 'video-pneumonia');
  }

  if (q.includes('gas') || q.includes('pet fapa') || q.includes('bomi') || q.includes('vomit') || q.includes('ঢেকুর') || q.includes('গ্যাস') || q.includes('বমি')) {
    return PEDIATRIC_VIDEOS.filter(v => v.id === 'video-burping');
  }

  if (q.includes('khabar') || q.includes('khichuri') || q.includes('খাবার') || q.includes('খিচুড়ি') || q.includes('মুখেভাত')) {
    return PEDIATRIC_VIDEOS.filter(v => v.id === 'video-baby-khichuri');
  }

  return [];
}
