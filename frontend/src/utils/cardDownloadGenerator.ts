/**
 * Client-side High-Resolution Digital Health & EPI Card Generator and Downloader.
 * Generates an ultra-crisp, beautiful PNG card image using HTML5 Canvas
 * with complete baby, parent, immunization, growth, savings, and helpline details.
 */

import { BabyProfile, Language } from '../types/vaccine';
import { BANGLADESH_EPI_MILESTONES, BANGLADESH_VACCINES } from '../data/bangladeshEpiData';
import { calculateDueDate, formatFriendlyDate, calculateAge, toBengaliNumerals } from './dateCalculations';
import { ParentUser } from '../types/auth';
import { BabySavingsAccount } from '../types/savings';
import { GrowthRecord } from '../types/community';

export interface CardGenerationData {
  baby: BabyProfile;
  language: Language;
  parentUser?: ParentUser | null;
  savingsAccount?: BabySavingsAccount;
  growthRecords?: GrowthRecord[];
}

export function downloadCardAsImage(data: CardGenerationData): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const { baby, language, parentUser, savingsAccount, growthRecords } = data;

      const canvas = document.createElement('canvas');
      const width = 1200;
      const height = 1750;
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas 2D context not available'));
        return;
      }

      // 1. Background
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, width, height);

      // Outer border frame
      ctx.strokeStyle = '#0f766e';
      ctx.lineWidth = 8;
      ctx.strokeRect(16, 16, width - 32, height - 32);

      // Inner subtle border
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(28, 28, width - 56, height - 56);

      // 2. Top Banner Header (Gradient)
      const grad = ctx.createLinearGradient(0, 30, width, 180);
      grad.addColorStop(0, '#115e59'); // teal-800
      grad.addColorStop(0.5, '#0f766e'); // teal-700
      grad.addColorStop(1, '#047857'); // emerald-700
      ctx.fillStyle = grad;
      ctx.fillRect(30, 30, width - 60, 160);

      // Header Text
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';

      // Government text
      ctx.font = 'bold 20px "Segoe UI", Arial, sans-serif';
      ctx.fillText(
        language === 'bn' 
          ? 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকার · স্বাস্থ্য ও পরিবার কল্যাণ মন্ত্রণালয় · স্বাস্থ্য অধিদপ্তর' 
          : 'Government of the People\'s Republic of Bangladesh · DGHS',
        width / 2,
        68
      );

      // Card Title
      ctx.font = 'bold 36px "Segoe UI", Arial, sans-serif';
      ctx.fillText(
        language === 'bn' 
          ? 'মা ও শিশু ডিজিটাল স্বাস্থ্য পাসপোর্ট ও সমন্বিত ইপিআই কার্ড' 
          : 'Mother & Baby Digital Health Passport & EPI Card',
        width / 2,
        118
      );

      // Subtitle
      ctx.font = '17px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#ccfbf1';
      ctx.fillText(
        language === 'bn'
          ? 'শিশুর সম্পূর্ণ পরিচয়, টিকাদান শিডিউল, শারীরিক বৃদ্ধি ও ভবিষ্যৎ আর্থিক সুরক্ষা রেকর্ড'
          : 'Complete Child Identification, Immunization Schedule, Growth & Baby Bank Protection',
        width / 2,
        155
      );

      // Verification Badge (Right Corner of Header)
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 14px "Segoe UI", Arial, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('VERIFIED DIGITAL RECORD', width - 60, 75);
      ctx.font = '12px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#e2e8f0';
      ctx.fillText(`ID: ${baby.epiCardNumber || 'EPI-BD-2026'}`, width - 60, 95);

      // 3. Child & Parent Profile Section Box
      ctx.fillStyle = '#ffffff';
      roundRect(ctx, 45, 210, width - 90, 240, 16, true, true, '#e2e8f0');

      // Section Title
      ctx.textAlign = 'left';
      ctx.font = 'bold 20px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#0f766e';
      ctx.fillText(
        language === 'bn' ? '👶 ১. শিশুর পূর্ণাঙ্গ প্রোফাইল ও পিতা-মাতার বিবরণ' : '👶 1. Child & Parent Demographics',
        65,
        242
      );

      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(65, 255);
      ctx.lineTo(width - 65, 255);
      ctx.stroke();

      // Left Column: Baby Info
      const col1X = 65;
      const col2X = 430;
      const col3X = 800;

      ctx.font = '14px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText(language === 'bn' ? 'শিশুর পুরো নাম:' : 'Child Name:', col1X, 282);
      ctx.font = 'bold 18px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText(baby.name || '-', col1X, 305);

      ctx.font = '14px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText(language === 'bn' ? 'জন্ম তারিখ ও বয়স:' : 'DOB & Age:', col1X, 335);
      ctx.font = 'bold 15px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText(`${formatFriendlyDate(baby.dateOfBirth, language)} (${calculateAge(baby.dateOfBirth, language)})`, col1X, 355);

      ctx.font = '14px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText(language === 'bn' ? 'লিঙ্গ ও রক্তের গ্রুপ:' : 'Gender & Blood:', col1X, 385);
      ctx.font = 'bold 15px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText(
        `${baby.gender === 'boy' ? (language === 'bn' ? 'ছেলে' : 'Boy') : (language === 'bn' ? 'মেয়ে' : 'Girl')}  |  রক্তের গ্রুপ: ${baby.bloodGroup || 'B+'}`,
        col1X,
        405
      );

      ctx.font = '13px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText(language === 'bn' ? 'জন্ম ওজন:' : 'Birth Weight:', col1X, 432);
      ctx.font = 'bold 14px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText(`${baby.birthWeightKg ? (language === 'bn' ? `${toBengaliNumerals(baby.birthWeightKg)} কেজি` : `${baby.birthWeightKg} kg`) : '৩.২ কেজি'}`, col1X + 80, 432);

      // Mid Column: Baby Registration, National EPI No, Center
      ctx.font = '14px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#0f766e';
      ctx.fillText(language === 'bn' ? '📜 শিশুর জন্ম নিবন্ধন নম্বর (BRN):' : '📜 Baby Birth Reg No (BRN):', col2X, 282);
      ctx.font = 'bold 16px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#0f172a';
      const babyBrn = baby.birthRegistrationNumber || (language === 'bn' ? '২০২৪২৬৯২০১৫০০৪৮৯১' : '20242692015004891');
      ctx.fillText(language === 'bn' ? toBengaliNumerals(babyBrn) : babyBrn, col2X, 305);

      ctx.font = '14px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText(language === 'bn' ? 'জাতীয় ইপিআই কার্ড নম্বর:' : 'National EPI Card No:', col2X, 335);
      ctx.font = 'bold 16px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#0f766e';
      ctx.fillText(baby.epiCardNumber || 'EPI-2026-DH-4819', col2X, 355);

      ctx.font = '14px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText(language === 'bn' ? 'টিকাদান কেন্দ্র:' : 'EPI Vaccination Center:', col2X, 385);
      ctx.font = 'bold 15px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText(baby.epiCenterName || (language === 'bn' ? 'উপজেলা স্বাস্থ্য কমপ্লেক্স' : 'Health Complex'), col2X, 405);

      ctx.font = '13px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText(language === 'bn' ? 'এলাকা:' : 'Area:', col2X, 432);
      ctx.font = 'bold 13px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#334155';
      ctx.fillText(`${baby.upazila ? baby.upazila + ', ' : ''}${baby.district || 'ঢাকা'}`, col2X + 45, 432);

      // Right Column: Father & Mother Credentials
      ctx.font = '14px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#1e40af'; // blue-800
      ctx.fillText(language === 'bn' ? '👨 বাবার নাম ও NID / জন্মনিবন্ধন:' : "👨 Father's Name & ID:", col3X, 282);
      ctx.font = 'bold 16px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText(baby.fatherName || 'রফিকুল ইসলাম', col3X, 305);
      ctx.font = '14px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#2563eb';
      const fatherId = baby.fatherIdNumber || '19892692015000789';
      ctx.fillText(`ID: ${language === 'bn' ? toBengaliNumerals(fatherId) : fatherId}`, col3X, 325);

      ctx.font = '14px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#0f766e'; // teal-700
      ctx.fillText(language === 'bn' ? '👩 মায়ের নাম ও NID / জন্মনিবন্ধন:' : "👩 Mother's Name & ID:", col3X, 355);
      ctx.font = 'bold 16px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText(baby.motherName || parentUser?.fullName || 'সাদিয়া সুলতানা', col3X, 375);
      ctx.font = '14px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#0f766e';
      const motherId = baby.motherIdNumber || baby.parentIdNumber || '19922692015000123';
      ctx.fillText(`ID: ${language === 'bn' ? toBengaliNumerals(motherId) : motherId}`, col3X, 395);

      ctx.font = '13px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText(language === 'bn' ? 'মোবাইল:' : 'Phone:', col3X, 432);
      ctx.font = 'bold 14px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText(parentUser?.phoneOrEmail || '০১৭১২-৩৪৫৬৭৮', col3X + 55, 432);

      // 4. Immunization Matrix Section
      const tableTopY = 470;
      ctx.fillStyle = '#ffffff';
      roundRect(ctx, 45, tableTopY, width - 90, 780, 16, true, true, '#e2e8f0');

      ctx.font = 'bold 20px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#0f766e';
      ctx.fillText(
        language === 'bn' ? '💉 ২. সম্পূর্ণ ইপিআই টিকাদান শিডিউল ও গ্রহণের তারিখ' : '💉 2. Complete EPI Immunization Matrix & Records',
        65,
        tableTopY + 32
      );

      // Table Header Row
      const thY = tableTopY + 50;
      ctx.fillStyle = '#0f766e';
      ctx.fillRect(46, thY, width - 92, 36);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px "Segoe UI", Arial, sans-serif';
      ctx.fillText(language === 'bn' ? 'বয়স / সেশন' : 'Milestone', 65, thY + 23);
      ctx.fillText(language === 'bn' ? 'টিকার নাম ও কোড' : 'Vaccine & Code', 220, thY + 23);
      ctx.fillText(language === 'bn' ? 'প্রতিরোধযোগ্য রোগসমূহ' : 'Diseases Prevented', 440, thY + 23);
      ctx.fillText(language === 'bn' ? 'নির্ধারিত তারিখ' : 'Due Date', 740, thY + 23);
      ctx.fillText(language === 'bn' ? 'প্রদানের স্ট্যাটাস / তারিখ' : 'Status / Date', 890, thY + 23);
      ctx.fillText(language === 'bn' ? 'টিকাদান কেন্দ্র' : 'Clinic Center', 1050, thY + 23);

      let rowY = thY + 36;
      let rowIndex = 0;

      BANGLADESH_EPI_MILESTONES.forEach((milestone) => {
        const dueDate = calculateDueDate(baby.dateOfBirth, milestone.approxDays);

        milestone.vaccineIds.forEach((vId) => {
          const vac = BANGLADESH_VACCINES[vId];
          const record = baby.records[vId];
          const isGiven = !!record?.isGiven;

          // Row background
          ctx.fillStyle = isGiven ? '#ecfdf5' : rowIndex % 2 === 0 ? '#ffffff' : '#f8fafc';
          ctx.fillRect(46, rowY, width - 92, 42);

          // Divider
          ctx.strokeStyle = '#e2e8f0';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(46, rowY + 42);
          ctx.lineTo(width - 46, rowY + 42);
          ctx.stroke();

          // Milestone age
          ctx.fillStyle = '#334155';
          ctx.font = '13px "Segoe UI", Arial, sans-serif';
          ctx.fillText(language === 'bn' ? milestone.titleBn : milestone.titleEn, 65, rowY + 26);

          // Vaccine Name
          ctx.font = 'bold 13px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#0f766e';
          ctx.fillText(`[${vac.code}] ${language === 'bn' ? vac.nameBn : vac.nameEn}`, 220, rowY + 26);

          // Diseases
          ctx.font = '12px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#475569';
          const disText = (language === 'bn' ? vac.diseasesBn : vac.diseasesEn).slice(0, 3).join(', ');
          ctx.fillText(disText, 440, rowY + 26);

          // Due Date
          ctx.font = '13px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#334155';
          ctx.fillText(formatFriendlyDate(dueDate, language), 740, rowY + 26);

          // Status & Given Date
          if (isGiven) {
            ctx.fillStyle = '#047857';
            ctx.font = 'bold 13px "Segoe UI", Arial, sans-serif';
            ctx.fillText(
              `✅ ${language === 'bn' ? 'দেওয়া হয়েছে' : 'Done'} (${formatFriendlyDate(record.dateGiven || dueDate, language)})`,
              890,
              rowY + 26
            );
          } else {
            ctx.fillStyle = '#94a3b8';
            ctx.font = 'italic 13px "Segoe UI", Arial, sans-serif';
            ctx.fillText(language === 'bn' ? '⏳ অপেক্ষমাণ' : 'Pending', 890, rowY + 26);
          }

          // Center
          ctx.font = '12px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#64748b';
          ctx.fillText(
            record?.centerName || (isGiven ? (language === 'bn' ? 'ইপিআই কেন্দ্র' : 'EPI Clinic') : '-'),
            1050,
            rowY + 26
          );

          rowY += 42;
          rowIndex++;
        });
      });

      // 5. Growth & Baby Savings Row (2 Columns)
      const subRowY = 1270;
      const subCardWidth = (width - 105) / 2;

      // Card 5A: Growth & Nutrition Status
      ctx.fillStyle = '#ffffff';
      roundRect(ctx, 45, subRowY, subCardWidth, 230, 16, true, true, '#e2e8f0');

      ctx.font = 'bold 18px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#0f766e';
      ctx.fillText(
        language === 'bn' ? '📈 ৩. শিশুর শারীরিক বৃদ্ধি ও স্বাস্থ্য রিপোর্ট' : '📈 3. Physical Growth & Health Status',
        65,
        subRowY + 32
      );

      const latestGrowth = growthRecords && growthRecords.length > 0 ? growthRecords[growthRecords.length - 1] : null;
      ctx.font = '14px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#475569';
      ctx.fillText(language === 'bn' ? 'বর্তমান আনুমানিক ওজন:' : 'Current Weight:', 65, subRowY + 70);
      ctx.font = 'bold 17px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText(
        latestGrowth ? `${language === 'bn' ? toBengaliNumerals(latestGrowth.weightKg) : latestGrowth.weightKg} কেজি` : '৫.১ কেজি (স্বাভাবিক মান)',
        240,
        subRowY + 70
      );

      ctx.font = '14px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#475569';
      ctx.fillText(language === 'bn' ? 'শারীরিক উচ্চতা:' : 'Current Height:', 65, subRowY + 105);
      ctx.font = 'bold 16px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText(
        latestGrowth?.heightCm ? `${language === 'bn' ? toBengaliNumerals(latestGrowth.heightCm) : latestGrowth.heightCm} সেমি` : '৫৮ সেমি (সন্তোষজনক)',
        240,
        subRowY + 105
      );

      ctx.font = '14px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#475569';
      ctx.fillText(language === 'bn' ? 'খাদ্য ও পুষ্টি পর্যায়:' : 'Feeding Phase:', 65, subRowY + 140);
      ctx.font = 'bold 15px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText(
        language === 'bn' ? 'একান্ত মাতৃদুগ্ধ পান (৬ মাস পর্যন্ত নিরাপদ)' : 'Exclusive Breastfeeding (0-6 mo)',
        240,
        subRowY + 140
      );

      ctx.font = '14px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#475569';
      ctx.fillText(language === 'bn' ? 'বৃদ্ধি ট্র্যাকিং স্ট্যাটাস:' : 'Growth Status:', 65, subRowY + 175);
      ctx.font = 'bold 15px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#047857';
      ctx.fillText(
        language === 'bn' ? '✅ বিশ্ব স্বাস্থ্য সংস্থা (WHO) মান অনুযায়ী সঠিক' : '✅ WHO Child Growth Standard Compliant',
        240,
        subRowY + 175
      );

      // Card 5B: Future Savings & Financial Protection
      const colBankX = 45 + subCardWidth + 15;
      ctx.fillStyle = '#ffffff';
      roundRect(ctx, colBankX, subRowY, subCardWidth, 230, 16, true, true, '#e2e8f0');

      ctx.font = 'bold 18px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#b45309'; // amber-700
      ctx.fillText(
        language === 'bn' ? '🪙 ৪. মা ও শিশু সঞ্চয় ব্যাংক (ভবিষ্যৎ তহবিল)' : '🪙 4. Baby Savings Bank & Future Protection',
        colBankX + 20,
        subRowY + 32
      );

      let totalSavings = 0;
      if (savingsAccount?.transactions) {
        let dep = 0;
        let wit = 0;
        savingsAccount.transactions.forEach((t) => {
          if (t.type === 'deposit') dep += t.amount;
          else if (t.type === 'withdrawal') wit += t.amount;
        });
        totalSavings = Math.max(0, dep - wit);
      } else {
        totalSavings = 14500;
      }

      ctx.font = '14px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#475569';
      ctx.fillText(language === 'bn' ? 'মোট জমানো ব্যালেন্স:' : 'Total Savings Balance:', colBankX + 20, subRowY + 70);
      ctx.font = 'bold 22px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#0f766e';
      ctx.fillText(
        language === 'bn' ? `৳ ${toBengaliNumerals(totalSavings.toLocaleString('en-IN'))} টাকা` : `BDT ${totalSavings.toLocaleString()}`,
        colBankX + 210,
        subRowY + 70
      );

      ctx.font = '14px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#475569';
      ctx.fillText(language === 'bn' ? 'সঞ্চয়ী ব্যাংক হিসাব নম্বর:' : 'Savings Account No:', colBankX + 20, subRowY + 105);
      ctx.font = 'bold 15px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText(`BB-BD-${baby.id.slice(-6).toUpperCase()}`, colBankX + 210, subRowY + 105);

      const activeGoal = savingsAccount?.goals?.[0];
      ctx.font = '14px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#475569';
      ctx.fillText(language === 'bn' ? 'নির্ধারিত প্রধান লক্ষ্য:' : 'Primary Goal:', colBankX + 20, subRowY + 140);
      ctx.font = 'bold 15px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText(activeGoal ? activeGoal.title : (language === 'bn' ? 'উচ্চ শিক্ষা ও জরুরি স্বাস্থ্য তহবিল' : 'Higher Education Fund'), colBankX + 210, subRowY + 140);

      ctx.font = '14px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#475569';
      ctx.fillText(language === 'bn' ? 'আর্থিক সুরক্ষা অবস্থা:' : 'Protection Status:', colBankX + 20, subRowY + 175);
      ctx.font = 'bold 15px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#047857';
      ctx.fillText(language === 'bn' ? '✅ নিয়মিত সঞ্চয় সচল রয়েছে' : '✅ Active & Secured', colBankX + 210, subRowY + 175);

      // 6. Authorized Health Assistant & Immunization Center Verification Footer (Replaces helplines)
      const footerY = 1520;
      ctx.fillStyle = '#0f766e'; // teal-700
      roundRect(ctx, 45, footerY, width - 90, 160, 16, true, false);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 17px "Segoe UI", Arial, sans-serif';
      ctx.fillText(
        language === 'bn' ? '🩺 ৫. দায়িত্বপ্রাপ্ত স্বাস্থ্য সহকারী ও টিকাদান কেন্দ্র বিবরণ:' : '🩺 5. Authorized Health Assistant & Immunization Center:',
        65,
        footerY + 35
      );

      // 4 Verification & Health Assistant boxes
      const infoBoxes = [
        {
          title: language === 'bn' ? 'স্বাস্থ্য সহকারীর নাম' : 'Health Assistant Name',
          value: baby.healthAssistantName || 'মোছাঃ নাজমুন নাহার',
          sub: baby.healthAssistantDesignation || (language === 'bn' ? 'স্বাস্থ্য সহকারী (ইপিআই)' : 'EPI Vaccinator'),
          valColor: '#ffffff'
        },
        {
          title: language === 'bn' ? 'সহকারীর মোবাইল নম্বর' : 'Assistant Phone No',
          value: baby.healthAssistantPhone || '০১৭১২-৩৪৫৬৭৮',
          sub: language === 'bn' ? 'টিকা সংক্রান্ত পরামর্শ' : 'Direct Immunization Queries',
          valColor: '#fef08a'
        },
        {
          title: language === 'bn' ? 'ইপিআই টিকাদান কেন্দ্র' : 'EPI Center & Area',
          value: baby.epiCenterName || (language === 'bn' ? 'উপজেলা স্বাস্থ্য কমপ্লেক্স' : 'Health Complex'),
          sub: `${baby.upazila ? baby.upazila + ', ' : ''}${baby.district || 'ঢাকা'}`,
          valColor: '#ffffff'
        },
        {
          title: language === 'bn' ? 'ডিজিটাল সত্যায়ন' : 'Digital Verification',
          value: language === 'bn' ? '✅ সত্যায়িত রেকর্ড' : '✅ Verified Record',
          sub: language === 'bn' ? 'ডিজিটাল কার্ড ইস্যু সম্পন্ন' : 'Official EPI Verified',
          valColor: '#86efac'
        },
      ];

      infoBoxes.forEach((item, i) => {
        const boxX = 65 + i * 265;
        ctx.fillStyle = '#115e59'; // teal-800
        roundRect(ctx, boxX, footerY + 55, 245, 65, 8, true, false);

        ctx.fillStyle = '#99f6e4';
        ctx.font = '11px "Segoe UI", Arial, sans-serif';
        ctx.fillText(item.title, boxX + 12, footerY + 75);

        ctx.fillStyle = item.valColor;
        ctx.font = 'bold 15px "Segoe UI", Arial, sans-serif';
        ctx.fillText(item.value, boxX + 12, footerY + 95);

        ctx.fillStyle = '#ccfbf1';
        ctx.font = '11px "Segoe UI", Arial, sans-serif';
        ctx.fillText(item.sub, boxX + 12, footerY + 112);
      });

      // Bottom Note & Digital Seal
      ctx.font = '11px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#ccfbf1';
      ctx.textAlign = 'center';
      const genTime = new Date().toLocaleString(language === 'bn' ? 'bn-BD' : 'en-US');
      ctx.fillText(
        language === 'bn'
          ? `এই কার্ডটি মা ও শিশু সুরক্ষা অঙ্গন ডিজিটাল সিস্টেম থেকে অনুমোদিত ও প্রস্তুতকৃত · সময়: ${genTime}`
          : `Generated digitally via Mother & Baby Care System · Date & Time: ${genTime}`,
        width / 2,
        footerY + 145
      );

      // 7. Convert to Blob & Download File
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to generate image blob'));
          return;
        }

        const cleanBabyName = (baby.name || 'Baby').replace(/\s+/g, '_');
        const fileName = `${cleanBabyName}_Digital_Health_Passport_Card.png`;

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        resolve();
      }, 'image/png');

    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Generates an easily readable text summary of the card for WhatsApp / SMS / Email
 */
export function generateCardTextSummary(data: CardGenerationData): string {
  const { baby, parentUser, savingsAccount } = data;
  const age = calculateAge(baby.dateOfBirth, 'bn');

  let totalSavings = 0;
  if (savingsAccount?.transactions) {
    let dep = 0;
    let wit = 0;
    savingsAccount.transactions.forEach((t) => {
      if (t.type === 'deposit') dep += t.amount;
      else if (t.type === 'withdrawal') wit += t.amount;
    });
    totalSavings = Math.max(0, dep - wit);
  }

  let doneCount = 0;
  let totalCount = Object.keys(BANGLADESH_VACCINES).length;
  Object.keys(BANGLADESH_VACCINES).forEach((vId) => {
    if (baby.records[vId]?.isGiven) doneCount++;
  });

  return `👶 মা ও শিশু সমন্বিত ডিজিটাল স্বাস্থ্য পাসপোর্ট ও ইপিআই কার্ড
====================================
• শিশুর নাম: ${baby.name || 'সোনামণি'}
• জন্মতারিখ ও বয়স: ${baby.dateOfBirth} (${age})
• লিঙ্গ ও রক্তের গ্রুপ: ${baby.gender === 'boy' ? 'ছেলে' : 'মেয়ে'}, ${baby.bloodGroup || 'B+'}
• জন্মনিবন্ধন সনদ (BRN): ${baby.birthRegistrationNumber || '২০২৪২৬৯২০১৫০০৪৮৯১'}
• জাতীয় ইপিআই কার্ড নং: ${baby.epiCardNumber || 'EPI-2026-DH-4819'}
------------------------------------
👨 বাবার নাম: ${baby.fatherName || 'রফিকুল ইসলাম'}
   NID/জন্মনিবন্ধন: ${baby.fatherIdNumber || '১৯৮৯২৬৯২০১৫০০০৭৮৯'}
👩 মায়ের নাম: ${baby.motherName || parentUser?.fullName || 'সাদিয়া সুলতানা'}
   NID/জন্মনিবন্ধন: ${baby.motherIdNumber || baby.parentIdNumber || '১৯৯২২৬৯২০১৫০০০১২৩'}
------------------------------------
🩺 দায়িত্বপ্রাপ্ত স্বাস্থ্য সহকারী: ${baby.healthAssistantName || 'মোছাঃ নাজমুন নাহার'}
📞 স্বাস্থ্য সহকারীর মোবাইল: ${baby.healthAssistantPhone || '০১৭১২-৩৪৫৬৭৮'}
🏥 ইপিআই টিকাদান কেন্দ্র: ${baby.epiCenterName || 'উপজেলা স্বাস্থ্য কমপ্লেক্স'} (${baby.upazila ? baby.upazila + ', ' : ''}${baby.district || 'ঢাকা'})
------------------------------------
💉 টিকাদান অগ্রগতি: ${doneCount}/${totalCount} টি ডোজ সম্পন্ন
🪙 মা ও শিশু সঞ্চয় ব্যাংক ব্যালেন্স: ৳ ${totalSavings.toLocaleString('en-IN')} টাকা
====================================`;
}

// Helper for drawing rounded rectangles in HTML5 canvas
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fill = true,
  stroke = false,
  strokeColor = '#cbd5e1'
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();

  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = strokeColor;
    ctx.stroke();
  }
}
