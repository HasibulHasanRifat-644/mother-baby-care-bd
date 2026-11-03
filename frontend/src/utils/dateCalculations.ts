import { VaccineStatus } from '../types/vaccine';

const BENGALI_NUMERALS: Record<string, string> = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

const BENGALI_MONTHS = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
];

const ENGLISH_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export function toBengaliNumerals(input: string | number): string {
  const str = String(input);
  return str.replace(/[0-9]/g, (digit) => BENGALI_NUMERALS[digit] || digit);
}

/**
 * Calculates due date for a vaccine based on baby's birth date and days offset
 */
export function calculateDueDate(dobString: string, dayOffset: number): Date {
  const [year, month, day] = dobString.split('-').map(Number);
  const birthDate = new Date(year, month - 1, day);
  const dueDate = new Date(birthDate);
  dueDate.setDate(dueDate.getDate() + dayOffset);
  return dueDate;
}

/**
 * Formats a Date object to YYYY-MM-DD
 */
export function formatDateIso(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Human readable date format in Bengali or English
 */
export function formatFriendlyDate(dateString: string | Date, lang: 'bn' | 'en' = 'bn'): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  if (isNaN(date.getTime())) return '-';

  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  if (lang === 'bn') {
    return `${toBengaliNumerals(day)} ${BENGALI_MONTHS[monthIndex]} ${toBengaliNumerals(year)}`;
  }
  return `${day} ${ENGLISH_MONTHS[monthIndex]} ${year}`;
}

/**
 * Calculates baby's current age from DOB
 */
export function calculateAge(dobString: string, lang: 'bn' | 'en' = 'bn'): string {
  if (!dobString) return '';
  const [y, m, d] = dobString.split('-').map(Number);
  const birthDate = new Date(y, m - 1, d);
  const now = new Date();

  if (birthDate > now) {
    return lang === 'bn' ? 'অনাগত' : 'Due soon';
  }

  const diffTime = Math.abs(now.getTime() - birthDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const months = Math.floor(diffDays / 30.4375);
  const remainingDays = Math.floor(diffDays % 30.4375);

  if (diffDays === 0) {
    return lang === 'bn' ? 'আজ জন্ম' : 'Born today';
  }

  if (diffDays < 30) {
    return lang === 'bn' 
      ? `${toBengaliNumerals(diffDays)} দিন` 
      : `${diffDays} days old`;
  }

  if (months < 12) {
    if (remainingDays === 0) {
      return lang === 'bn' 
        ? `${toBengaliNumerals(months)} মাস` 
        : `${months} months old`;
    }
    return lang === 'bn'
      ? `${toBengaliNumerals(months)} মাস ${toBengaliNumerals(remainingDays)} দিন`
      : `${months}m ${remainingDays}d old`;
  }

  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  return lang === 'bn'
    ? `${toBengaliNumerals(years)} বছর ${toBengaliNumerals(remMonths)} মাস`
    : `${years}y ${remMonths}m old`;
}

/**
 * Determines vaccine status
 */
export function getVaccineStatus(
  dueDate: Date,
  isGiven: boolean
): VaccineStatus {
  if (isGiven) {
    return 'done';
  }

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  const diffDays = Math.round((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return 'overdue';
  } else if (diffDays <= 14) {
    return 'due-soon';
  }
  return 'upcoming';
}

/**
 * Calculates remaining days from now to target date
 */
export function getDaysDiff(targetDate: Date): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Generate iCalendar (.ics) file content for upcoming vaccine reminders
 */
export function generateIcsCalendar(
  babyName: string,
  events: Array<{ title: string; date: Date; description: string }>
): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const formatIcsDate = (date: Date) => {
    return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;
  };

  let ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Bangladesh EPI Child Vaccine Tracker//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${babyName} Vaccine Reminders`,
  ];

  events.forEach((ev, idx) => {
    const dt = formatIcsDate(ev.date);
    ics.push('BEGIN:VEVENT');
    ics.push(`UID:vaccine-${idx}-${dt}@epitracker.bd`);
    ics.push(`DTSTAMP:${dt}T000000Z`);
    ics.push(`DTSTART;VALUE=DATE:${dt}`);
    ics.push(`SUMMARY:${ev.title}`);
    ics.push(`DESCRIPTION:${ev.description.replace(/\n/g, '\\n')}`);
    ics.push('BEGIN:VALARM');
    ics.push('TRIGGER:-P1D');
    ics.push('ACTION:DISPLAY');
    ics.push(`DESCRIPTION:Reminder: ${ev.title}`);
    ics.push('END:VALARM');
    ics.push('END:VEVENT');
  });

  ics.push('END:VCALENDAR');
  return ics.join('\r\n');
}

/**
 * Downloads a text content as a file in browser
 */
export function triggerFileDownload(content: string, filename: string, mimeType: string = 'text/calendar') {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
