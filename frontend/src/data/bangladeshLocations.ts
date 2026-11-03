export interface DivisionData {
  id: string;
  nameBn: string;
  nameEn: string;
  districts: DistrictData[];
}

export interface DistrictData {
  id: string;
  nameBn: string;
  nameEn: string;
  upazilas: string[];
}

export interface AddressPreset {
  division: string;
  district: string;
  upazila: string;
  unionPourashava: string;
  village: string;
  ward: string;
  epiCenterName: string;
}

// Complete 64 Districts of Bangladesh across 8 Divisions with Upazilas
export const BANGLADESH_DIVISIONS: DivisionData[] = [
  {
    id: 'dhaka',
    nameBn: 'ঢাকা',
    nameEn: 'Dhaka',
    districts: [
      {
        id: 'dhaka_dist',
        nameBn: 'ঢাকা',
        nameEn: 'Dhaka',
        upazilas: ['ধানমন্ডি', 'গুলশান', 'মিরপুর', 'উত্তরা', 'মোহাম্মদপুর', 'তেজগাঁও', 'মতিঝিল', 'সাভার', 'কেরানীগঞ্জ', 'ধামরাই', 'নবাবগঞ্জ', 'দোহার'],
      },
      {
        id: 'gazipur',
        nameBn: 'গাজীপুর',
        nameEn: 'Gazipur',
        upazilas: ['গাজীপুর সদর', 'টঙ্গী', 'শ্রীপুর', 'কালিয়াকৈর', 'কাপাসিয়া', 'কালীগঞ্জ'],
      },
      {
        id: 'narayanganj',
        nameBn: 'নারায়ণগঞ্জ',
        nameEn: 'Narayanganj',
        upazilas: ['নারায়ণগঞ্জ সদর', 'সিদ্ধিরগঞ্জ', 'ফতুল্লা', 'রূপগঞ্জ', 'সোনারগাঁও', 'আড়াইহাজার', 'বন্দর'],
      },
      {
        id: 'tangail',
        nameBn: 'টাঙ্গাইল',
        nameEn: 'Tangail',
        upazilas: ['টাঙ্গাইল সদর', 'মির্জাপুর', 'মধুপুর', 'ঘাটাইল', 'কালিহাতী', 'সখিপুর', 'গোপালপুর', 'বাসাইল', 'দেলদুয়ার', 'ভূঞাপুর', 'নাগরপুর', 'ধনবাড়ী'],
      },
      {
        id: 'narsingdi',
        nameBn: 'নরসিংদী',
        nameEn: 'Narsingdi',
        upazilas: ['নরসিংদী সদর', 'পলাশ', 'শিবপুর', 'বেলাব', 'মনোহরদী', 'রায়পুরা'],
      },
      {
        id: 'munshiganj',
        nameBn: 'মুন্সীগঞ্জ',
        nameEn: 'Munshiganj',
        upazilas: ['মুন্সীগঞ্জ সদর', 'শ্রীনগর', 'সিরাজদিখান', 'লৌহজং', 'গজারিয়া', 'টংগিবাড়ী'],
      },
      {
        id: 'manikganj',
        nameBn: 'মানিকগঞ্জ',
        nameEn: 'Manikganj',
        upazilas: ['মানিকগঞ্জ সদর', 'সিংগাইর', 'সাটুরিয়া', 'শিবালয়', 'ঘিওর', 'হরিরামপুর', 'দৌলতপুর'],
      },
      {
        id: 'faridpur',
        nameBn: 'ফরিদপুর',
        nameEn: 'Faridpur',
        upazilas: ['ফরিদপুর সদর', 'বোয়ালমারী', 'ভাঙ্গা', 'মধুখালী', 'নগরকান্দা', 'আলফাডাঙ্গা', 'সদরপুর', 'চরভদ্রাসন', 'সালথা'],
      },
      {
        id: 'gopalganj',
        nameBn: 'গোপালগঞ্জ',
        nameEn: 'Gopalganj',
        upazilas: ['গোপালগঞ্জ সদর', 'টুঙ্গিপাড়া', 'কোটালীপাড়া', 'কাশিয়ানী', 'মুকসুদপুর'],
      },
      {
        id: 'kishoreganj',
        nameBn: 'কিশোরগঞ্জ',
        nameEn: 'Kishoreganj',
        upazilas: ['কিশোরগঞ্জ সদর', 'ভৈরব', 'বাজিতপুর', 'কটিয়াদী', 'করিমগঞ্জ', 'হোসেনপুর', 'কুলিয়ারচর', 'তাড়াইল', 'পাকুন্দিয়া', 'অষ্টগ্রাম', 'নিকলী', 'ইটনা', 'মিঠামইন'],
      },
      {
        id: 'madaripur',
        nameBn: 'মাদারীপুর',
        nameEn: 'Madaripur',
        upazilas: ['মাদারীপুর সদর', 'শিবচর', 'কালকিনি', 'রাজৈর', 'ডাসার'],
      },
      {
        id: 'rajbari',
        nameBn: 'রাজবাড়ী',
        nameEn: 'Rajbari',
        upazilas: ['রাজবাড়ী সদর', 'গোয়ালন্দ', 'পাংশা', 'বালিয়াকান্দি', 'কালুখালী'],
      },
      {
        id: 'shariatpur',
        nameBn: 'শরীয়তপুর',
        nameEn: 'Shariatpur',
        upazilas: ['শরীয়তপুর সদর', 'নড়িয়া', 'জাজিরা', 'ডামুড্যা', 'ভেদরগঞ্জ', 'গোসাইরহাট'],
      },
    ],
  },
  {
    id: 'chattogram',
    nameBn: 'চট্টগ্রাম',
    nameEn: 'Chattogram',
    districts: [
      {
        id: 'chattogram_dist',
        nameBn: 'চট্টগ্রাম',
        nameEn: 'Chattogram',
        upazilas: ['কোতোয়ালী', 'পাঁচলাইশ', 'পাহাড়তলী', 'হালিশহর', 'পটিয়া', 'সীতাকুণ্ড', 'মীরসরাই', 'হাটহাজারী', 'রাঙ্গুনিয়া', 'বোয়ালখালী', 'আনোয়ারা', 'বাঁশখালী', 'চন্দনাইশ', 'ফটিকছড়ি', 'সন্দ্বীপ', 'সাতকানিয়া', 'লোহাগাড়া'],
      },
      {
        id: 'coxsbazar',
        nameBn: 'কক্সবাজার',
        nameEn: 'Cox\'s Bazar',
        upazilas: ['কক্সবাজার সদর', 'উখিয়া', 'টেকনাফ', 'রামু', 'চকরিয়া', 'পেকুয়া', 'মহেশখালী', 'কুতুবদিয়া', 'ঈদগাঁও'],
      },
      {
        id: 'cumilla',
        nameBn: 'কুমিল্লা',
        nameEn: 'Cumilla',
        upazilas: ['আদর্শ সদর', 'সদর দক্ষিণ', 'লাকসাম', 'দাউদকান্দি', 'চান্দিনা', 'দেবিদ্বার', 'হোমনা', 'বরুড়া', 'মুরাদনগর', 'চৌদ্দগ্রাম', 'ব্রাহ্মণপাড়া', 'বুড়িচং', 'তিতাস', 'মেঘনা', 'লালমাই'],
      },
      {
        id: 'brahmanbaria',
        nameBn: 'ব্রাহ্মণবাড়িয়া',
        nameEn: 'Brahmanbaria',
        upazilas: ['ব্রাহ্মণবাড়িয়া সদর', 'আশুগঞ্জ', 'সরাইল', 'কসবা', 'নবীনগর', 'বাঞ্ছারামপুর', 'নাসিরনগর', 'আখাউড়া', 'বিজয়নগর'],
      },
      {
        id: 'noakhali',
        nameBn: 'নোয়াখালী',
        nameEn: 'Noakhali',
        upazilas: ['নোয়াখালী সদর', 'বেগমগঞ্জ', 'চাটখিল', 'সোনাইমুড়ী', 'সেনবাগ', 'কোম্পানীগঞ্জ', 'হাতিয়া', 'সুবর্ণচর', 'কবিরহাট'],
      },
      {
        id: 'feni',
        nameBn: 'ফেনী',
        nameEn: 'Feni',
        upazilas: ['ফেনী সদর', 'দাগনভূঞা', 'সোনাগাজী', 'ছাগলনাইয়া', 'পরশুরাম', 'ফুলগাজী'],
      },
      {
        id: 'chandpur',
        nameBn: 'চাঁদপুর',
        nameEn: 'Chandpur',
        upazilas: ['চাঁদপুর সদর', 'হাজীগঞ্জ', 'কচুয়া', 'শাহরাস্তি', 'ফরিদগঞ্জ', 'মতলব উত্তর', 'মতলব দক্ষিণ', 'হাইমচর'],
      },
      {
        id: 'lakshmipur',
        nameBn: 'লক্ষ্মীপুর',
        nameEn: 'Lakshmipur',
        upazilas: ['লক্ষ্মীপুর সদর', 'রায়পুর', 'রামগঞ্জ', 'রামগতি', 'কমলনগর'],
      },
      {
        id: 'rangamati',
        nameBn: 'রাঙ্গামাটি',
        nameEn: 'Rangamati',
        upazilas: ['রাঙ্গামাটি সদর', 'বাঘাইছড়ি', 'বরকল', 'কাপ্তাই', 'রাজস্থলী', 'বিলাইছড়ি', 'জুরাছড়ি', 'নানিয়ারচর', 'কাউখালী', 'লংগদু'],
      },
      {
        id: 'khagrachhari',
        nameBn: 'খাগড়াছড়ি',
        nameEn: 'Khagrachhari',
        upazilas: ['খাগড়াছড়ি সদর', 'দীঘিনালা', 'পানছড়ি', 'মহালছড়ি', 'মাটিরাঙ্গা', 'মানিকছড়ি', 'রামগড়', 'লক্ষ্মীছড়ি', 'গুইমারা'],
      },
      {
        id: 'bandarban',
        nameBn: 'বান্দরবান',
        nameEn: 'Bandarban',
        upazilas: ['বান্দরবান সদর', 'রুমা', 'থানচি', 'রোয়াংছড়ি', 'লামা', 'আলীকদম', 'নাইক্ষ্যংছড়ি'],
      },
    ],
  },
  {
    id: 'rajshahi',
    nameBn: 'রাজশাহী',
    nameEn: 'Rajshahi',
    districts: [
      {
        id: 'rajshahi_dist',
        nameBn: 'রাজশাহী',
        nameEn: 'Rajshahi',
        upazilas: ['বোয়ালিয়া', 'মতিহার', 'রাজপাড়া', 'চন্দ্রিমা', 'পবা', 'বাঘা', 'চারঘাট', 'গোদাগাড়ী', 'তানোর', 'পুঠিয়া', 'বাগমারা', 'মোহনপুর', 'দুর্গাপুর'],
      },
      {
        id: 'bogura',
        nameBn: 'বগুড়া',
        nameEn: 'Bogura',
        upazilas: ['বগুড়া সদর', 'শেরপুর', 'শিবগঞ্জ', 'দুপচাঁচিয়া', 'গাবতলী', 'কাহালু', 'সারিয়াকান্দি', 'ধুনট', 'আদমদীঘি', 'নন্দীগ্রাম', 'সোনাতলা', 'শাজাহানপুর'],
      },
      {
        id: 'pabna',
        nameBn: 'পাবনা',
        nameEn: 'Pabna',
        upazilas: ['পাবনা সদর', 'ঈশ্বরদী', 'সাঁথিয়া', 'বেড়া', 'সুজানগর', 'চাটমোহর', 'ফরিদপুর', 'ভাঙ্গুড়া', 'আটঘরিয়া'],
      },
      {
        id: 'sirajganj',
        nameBn: 'সিরাজগঞ্জ',
        nameEn: 'Sirajganj',
        upazilas: ['সিরাজগঞ্জ সদর', 'শাহজাদপুর', 'উল্লাপাড়া', 'বেলকুচি', 'রায়গঞ্জ', 'কাজীপুর', 'তাড়াশ', 'কামারখন্দ', 'চৌহালী'],
      },
      {
        id: 'naogaon',
        nameBn: 'নওগাঁ',
        nameEn: 'Naogaon',
        upazilas: ['নওগাঁ সদর', 'মহাদেবপুর', 'মান্দা', 'পত্নীতলা', 'বদলগাছী', 'আত্রাই', 'রানীনগর', 'ধামইরহাট', 'নিয়ামতপুর', 'পোরশা', 'সাপাহার'],
      },
      {
        id: 'natore',
        nameBn: 'নাটোর',
        nameEn: 'Natore',
        upazilas: ['নাটোর সদর', 'সিংড়া', 'বড়াইগ্রাম', 'বাগাতিপাড়া', 'গুরুদাসপুর', 'লালপুর', 'নলডাঙ্গা'],
      },
      {
        id: 'chapainawabganj',
        nameBn: 'চাঁপাইনবাবগঞ্জ',
        nameEn: 'Chapainawabganj',
        upazilas: ['চাঁপাইনবাবগঞ্জ সদর', 'শিবগঞ্জ', 'গোমস্তাপুর', 'নাচোল', 'ভোলাহাট'],
      },
      {
        id: 'joypurhat',
        nameBn: 'জয়পুরহাট',
        nameEn: 'Joypurhat',
        upazilas: ['জয়পুরহাট সদর', 'পাঁচবিবি', 'কালাই', 'ক্ষেতলাল', 'আক্কেলপুর'],
      },
    ],
  },
  {
    id: 'khulna',
    nameBn: 'খুলনা',
    nameEn: 'Khulna',
    districts: [
      {
        id: 'khulna_dist',
        nameBn: 'খুলনা',
        nameEn: 'Khulna',
        upazilas: ['খুলনা সদর', 'দৌলতপুর', 'খালিশপুর', 'সোনাডাঙ্গা', 'ডুমুরিয়া', 'রূপসা', 'বটিয়াঘাটা', 'পাইকগাছা', 'তেরখাদা', 'ফুলতলা', 'দিঘলিয়া', 'কয়রা'],
      },
      {
        id: 'jashore',
        nameBn: 'যশোর',
        nameEn: 'Jashore',
        upazilas: ['যশোর সদর', 'ঝিকরগাছা', 'অভয়নগর', 'মণিরামপুর', 'কেশবপুর', 'শার্শা', 'চৌগাছা', 'বাঘারপাড়া'],
      },
      {
        id: 'kushtia',
        nameBn: 'কুষ্টিয়া',
        nameEn: 'Kushtia',
        upazilas: ['কুষ্টিয়া সদর', 'কুমারখালী', 'ভেড়ামারা', 'মিরপুর', 'খোকসা', 'দৌলতপুর'],
      },
      {
        id: 'bagerhat',
        nameBn: 'বাগেরহাট',
        nameEn: 'Bagerhat',
        upazilas: ['বাগেরহাট সদর', 'মোংলা', 'ফকিরহাট', 'কচুয়া', 'মোল্লাহাট', 'রামপাল', 'শরণখোলা', 'চিতলমারী', 'মোরেলগঞ্জ'],
      },
      {
        id: 'chuadanga',
        nameBn: 'চুয়াডাঙ্গা',
        nameEn: 'Chuadanga',
        upazilas: ['চুয়াডাঙ্গা সদর', 'আলমডাঙ্গা', 'দামুড়হুদা', 'জীবননগর'],
      },
      {
        id: 'jhenaidah',
        nameBn: 'ঝিনাইদহ',
        nameEn: 'Jhenaidah',
        upazilas: ['ঝিনাইদহ সদর', 'শৈলকূপা', 'হরিণাকুণ্ডু', 'কালীগঞ্জ', 'কোটচাঁদপুর', 'মহেশপুর'],
      },
      {
        id: 'magura',
        nameBn: 'মাগুরা',
        nameEn: 'Magura',
        upazilas: ['মাগুরা সদর', 'শ্রীপুর', 'মহম্মদপুর', 'শালিখা'],
      },
      {
        id: 'meherpur',
        nameBn: 'মেহেরপুর',
        nameEn: 'Meherpur',
        upazilas: ['মেহেরপুর সদর', 'গাংনী', 'মুজিবনগর'],
      },
      {
        id: 'narail',
        nameBn: 'নড়াইল',
        nameEn: 'Narail',
        upazilas: ['নড়াইল সদর', 'লোহাগড়া', 'কালিয়া'],
      },
      {
        id: 'satkhira',
        nameBn: 'সাতক্ষীরা',
        nameEn: 'Satkhira',
        upazilas: ['সাতক্ষীরা সদর', 'কলারোয়া', 'তালা', 'দেবহাটা', 'কালীগঞ্জ', 'আশাশুনি', 'শ্যামনগর'],
      },
    ],
  },
  {
    id: 'barishal',
    nameBn: 'বরিশাল',
    nameEn: 'Barishal',
    districts: [
      {
        id: 'barishal_dist',
        nameBn: 'বরিশাল',
        nameEn: 'Barishal',
        upazilas: ['কোতোয়ালী', 'এয়ারপোর্ট', 'কাউনিয়া', 'বন্দর', 'বাবুগঞ্জ', 'বাকেরগঞ্জ', 'উজিরপুর', 'গৌরনদী', 'মুলাদী', 'বানারীপাড়া', 'আগৈলঝাড়া', 'মেহেন্দীগঞ্জ', 'হিজলা'],
      },
      {
        id: 'patuakhali',
        nameBn: 'পটুয়াখালী',
        nameEn: 'Patuakhali',
        upazilas: ['পটুয়াখালী সদর', 'গলাচিপা', 'বাউফল', 'কলাপাড়া', 'দশমিনা', 'দুমকি', 'মির্জাগঞ্জ', 'রাঙ্গাবালী'],
      },
      {
        id: 'bhola',
        nameBn: 'ভোলা',
        nameEn: 'Bhola',
        upazilas: ['ভোলা সদর', 'বোরহানউদ্দিন', 'দৌলতখান', 'লালমোহন', 'চরফ্যাশন', 'তজুমদ্দিন', 'মনপুরা'],
      },
      {
        id: 'pirojpur',
        nameBn: 'পিরোজপুর',
        nameEn: 'Pirojpur',
        upazilas: ['পিরোজপুর সদর', 'মঠবাড়িয়া', 'ভান্ডারিয়া', 'নেছারাবাদ (স্বরূপকাঠি)', 'নাজিরপুর', 'কাউখালী', 'ইন্দুরকানী (জিয়ানগর)'],
      },
      {
        id: 'barguna',
        nameBn: 'বরগুনা',
        nameEn: 'Barguna',
        upazilas: ['বরগুনা সদর', 'আমতলী', 'বেতাগী', 'পাথরঘাটা', 'বামনা', 'তালতলী'],
      },
      {
        id: 'jhalokati',
        nameBn: 'ঝালকাঠি',
        nameEn: 'Jhalokati',
        upazilas: ['ঝালকাঠি সদর', 'নলছিটি', 'রাজাপুর', 'কাঁঠালিয়া'],
      },
    ],
  },
  {
    id: 'sylhet',
    nameBn: 'সিলেট',
    nameEn: 'Sylhet',
    districts: [
      {
        id: 'sylhet_dist',
        nameBn: 'সিলেট',
        nameEn: 'Sylhet',
        upazilas: ['সিলেট সদর', 'কোতোয়ালী', 'দক্ষিণ সুরমা', 'গোলাপগঞ্জ', 'বিয়ানীবাজার', 'জৈন্তাপুর', 'বিশ্বনাথ', 'ফেঞ্চুগঞ্জ', 'বালাগঞ্জ', 'কানাইঘাট', 'জকিগঞ্জ', 'গোয়াইনঘাট', 'কোম্পানীগঞ্জ', 'ওসমানীনগর'],
      },
      {
        id: 'moulvibazar',
        nameBn: 'মৌলভীবাজার',
        nameEn: 'Moulvibazar',
        upazilas: ['মৌলভীবাজার সদর', 'শ্রীমঙ্গল', 'কমলগঞ্জ', 'কুলাউড়া', 'বড়লেখা', 'রাজনগর', 'জুড়ী'],
      },
      {
        id: 'sunamganj',
        nameBn: 'সুনামগঞ্জ',
        nameEn: 'Sunamganj',
        upazilas: ['সুনামগঞ্জ সদর', 'ছাতক', 'জগন্নাথপুর', 'তাহিরপুর', 'দিরাই', 'ধর্মপাশা', 'জামালগঞ্জ', 'শাল্লা', 'দোয়ারাবাজার', 'বিশ্বম্ভরপুর', 'শান্তিগঞ্জ'],
      },
      {
        id: 'habiganj',
        nameBn: 'হবিগঞ্জ',
        nameEn: 'Habiganj',
        upazilas: ['হবিগঞ্জ সদর', 'মাধবপুর', 'চুনারুঘাট', 'বাহুবল', 'নবীগঞ্জ', 'বানিয়াচং', 'আজমিরীগঞ্জ', 'লাখাই', 'শায়েস্তাগঞ্জ'],
      },
    ],
  },
  {
    id: 'rangpur',
    nameBn: 'রংপুর',
    nameEn: 'Rangpur',
    districts: [
      {
        id: 'rangpur_dist',
        nameBn: 'রংপুর',
        nameEn: 'Rangpur',
        upazilas: ['রংপুর সদর', 'মিঠাপুকুর', 'পীরগঞ্জ', 'বদরগঞ্জ', 'কাউনিয়া', 'গঙ্গাচড়া', 'তারাগঞ্জ', 'পীরগাছা'],
      },
      {
        id: 'dinajpur',
        nameBn: 'দিনাজপুর',
        nameEn: 'Dinajpur',
        upazilas: ['দিনাজপুর সদর', 'বিরামপুর', 'ফুলবাড়ী', 'পার্বতীপুর', 'বীরগঞ্জ', 'বোচাগঞ্জ', 'চিরিরবন্দর', 'কাহারোল', 'খানসামা', 'ঘোড়াঘাট', 'নবাবগঞ্জ', 'হাকিমপুর', 'বিরল'],
      },
      {
        id: 'kurigram',
        nameBn: 'কুড়িগ্রাম',
        nameEn: 'Kurigram',
        upazilas: ['কুড়িগ্রাম সদর', 'উলিপুর', 'নাগেশ্বরী', 'ভুরুঙ্গামারী', 'চিলমারী', 'রৌমারী', 'রাজিবপুর', 'ফুলবাড়ী', 'রাজারহাট'],
      },
      {
        id: 'gaibandha',
        nameBn: 'গাইবান্ধা',
        nameEn: 'Gaibandha',
        upazilas: ['গাইবান্ধা সদর', 'গোবিন্দগঞ্জ', 'পলাশবাড়ী', 'সাঘাটা', 'সুন্দরগঞ্জ', 'সাদুল্লাপুর', 'ফুলছড়ি'],
      },
      {
        id: 'nilphamari',
        nameBn: 'নীলফামারী',
        nameEn: 'Nilphamari',
        upazilas: ['নীলফামারী সদর', 'সৈয়দপুর', 'ডোমার', 'ডিমলা', 'জলঢাকা', 'কিশোরগঞ্জ'],
      },
      {
        id: 'panchagarh',
        nameBn: 'পঞ্চগড়',
        nameEn: 'Panchagarh',
        upazilas: ['পঞ্চগড় সদর', 'তেঁতুলিয়া', 'বোদা', 'দেবীগঞ্জ', 'আটোয়ারী'],
      },
      {
        id: 'thakurgaon',
        nameBn: 'ঠাকুরগাঁও',
        nameEn: 'Thakurgaon',
        upazilas: ['ঠাকুরগাঁও সদর', 'পীরগঞ্জ', 'বালিয়াডাঙ্গী', 'রাণীশংকৈল', 'হরিপুর'],
      },
      {
        id: 'lalmonirhat',
        nameBn: 'লালমনিরহাট',
        nameEn: 'Lalmonirhat',
        upazilas: ['লালমনিরহাট সদর', 'হাতীবান্ধা', 'পাটগ্রাম', 'কালীগঞ্জ', 'আদিতমারী'],
      },
    ],
  },
  {
    id: 'mymensingh',
    nameBn: 'ময়মনসিংহ',
    nameEn: 'Mymensingh',
    districts: [
      {
        id: 'mymensingh_dist',
        nameBn: 'ময়মনসিংহ',
        nameEn: 'Mymensingh',
        upazilas: ['ময়মনসিংহ সদর', 'মুক্তাগাছা', 'ত্রিশাল', 'ভালুকা', 'গফরগাঁও', 'ফুলবাড়িয়া', 'ঈশ্বরগঞ্জ', 'হালুয়াঘাট', 'গৌরীপুর', 'ধোবাউড়া', 'নান্দাইল', 'ফুলপুর', 'তারাকান্দা'],
      },
      {
        id: 'jamalpur',
        nameBn: 'জামালপুর',
        nameEn: 'Jamalpur',
        upazilas: ['জামালপুর সদর', 'মেলান্দহ', 'মাদারগঞ্জ', 'ইসলামপুর', 'সরিষাবাড়ী', 'বকশীগঞ্জ', 'দেওয়ানগঞ্জ'],
      },
      {
        id: 'netrokona',
        nameBn: 'নেত্রকোণা',
        nameEn: 'Netrokona',
        upazilas: ['নেত্রকোণা সদর', 'মোহনগঞ্জ', 'কেন্দুয়া', 'কলমাকান্দা', 'দুর্গাপুর', 'পূর্বধলা', 'বারহাট্টা', 'আটপাড়া', 'মদন', 'খালিয়াজুড়ি'],
      },
      {
        id: 'sherpur',
        nameBn: 'শেরপুর',
        nameEn: 'Sherpur',
        upazilas: ['শেরপুর সদর', 'নকলা', 'নালিতাবাড়ী', 'শ্রীবরদী', 'ঝিনাইগাতী'],
      },
    ],
  },
];

// Division Presets for Instant 1-Click Auto-fill across all regions of Bangladesh
export const BANGLADESH_DIVISION_PRESETS: Record<string, AddressPreset> = {
  dhaka: {
    division: 'ঢাকা',
    district: 'ঢাকা',
    upazila: 'ধানমন্ডি',
    unionPourashava: 'ঢাকা দক্ষিণ সিটি কর্পোরেশন',
    village: 'ধানমন্ডি ২৭, বাড়ি # ১২/এ',
    ward: '১৫',
    epiCenterName: 'ধানমন্ডি মা ও শিশু কল্যাণ কেন্দ্র (EPI সেন্টার)',
  },
  chattogram: {
    division: 'চট্টগ্রাম',
    district: 'চট্টগ্রাম',
    upazila: 'পাঁচলাইশ',
    unionPourashava: 'চট্টগ্রাম সিটি কর্পোরেশন',
    village: 'প্রবর্তক মোড়, রোড # ০৪',
    ward: '০৮',
    epiCenterName: 'চট্টগ্রাম মা ও শিশু হাসপাতাল ইপিআই ক্যাম্প',
  },
  rajshahi: {
    division: 'রাজশাহী',
    district: 'রাজশাহী',
    upazila: 'বোয়ালিয়া',
    unionPourashava: 'রাজশাহী সিটি কর্পোরেশন',
    village: 'সাহেব বাজার, কাদিরগঞ্জ',
    ward: '০৩',
    epiCenterName: 'রাজশাহী সদর মাতৃমঙ্গল ও শিশু কল্যাণ কেন্দ্র (EPI)',
  },
  khulna: {
    division: 'খুলনা',
    district: 'খুলনা',
    upazila: 'সোনাডাঙ্গা',
    unionPourashava: 'খুলনা সিটি কর্পোরেশন',
    village: 'মজিদ সরণী, সোনাডাঙ্গা আবাসিক এলাকা',
    ward: '১৭',
    epiCenterName: 'সোনাডাঙ্গা নগর স্বাস্থ্য কেন্দ্র ও টিকাদান বুথ',
  },
  barishal: {
    division: 'বরিশাল',
    district: 'বরিশাল',
    upazila: 'কোতোয়ালী',
    unionPourashava: 'বরিশাল সিটি কর্পোরেশন',
    village: 'সদর রোড, বান্দ রোড',
    ward: '১০',
    epiCenterName: 'বরিশাল জেনারেল হাসপাতাল ইপিআই টিকাদান বুথ',
  },
  sylhet: {
    division: 'সিলেট',
    district: 'সিলেট',
    upazila: 'দক্ষিণ সুরমা',
    unionPourashava: 'সিলেট সিটি কর্পোরেশন',
    village: 'কদমতলী, স্টেশন রোড',
    ward: '২৬',
    epiCenterName: 'দক্ষিণ সুরমা উপজেলা স্বাস্থ্য কমপ্লেক্স ইপিআই কেন্দ্র',
  },
  rangpur: {
    division: 'রংপুর',
    district: 'রংপুর',
    upazila: 'রংপুর সদর',
    unionPourashava: 'রংপুর সিটি কর্পোরেশন',
    village: 'কাচারী বাজার, পায়রা চত্বর',
    ward: '০৫',
    epiCenterName: 'রংপুর মেডিকেল কলেজ হাসপাতাল ইপিআই টিকাদান কেন্দ্র',
  },
  mymensingh: {
    division: 'ময়মনসিংহ',
    district: 'ময়মনসিংহ',
    upazila: 'ময়মনসিংহ সদর',
    unionPourashava: 'ময়মনসিংহ সিটি কর্পোরেশন',
    village: 'চরপাড়া, মেডিকেল রোড',
    ward: '১২',
    epiCenterName: 'ময়মনসিংহ মা ও শিশু কল্যাণ কেন্দ্র (EPI টিকাদান কেন্দ্র)',
  },
};

// Default Demo Address (Dhaka)
export const DEMO_AUTOFILL_ADDRESS: AddressPreset = BANGLADESH_DIVISION_PRESETS.dhaka;

/**
 * Get sample preset for any division name (Bengali or English)
 */
export function getPresetForDivision(divisionName: string): AddressPreset {
  const norm = divisionName.trim().toLowerCase();
  for (const [key, preset] of Object.entries(BANGLADESH_DIVISION_PRESETS)) {
    if (
      preset.division === divisionName ||
      key === norm ||
      norm.includes(key)
    ) {
      return preset;
    }
  }
  return DEMO_AUTOFILL_ADDRESS;
}
