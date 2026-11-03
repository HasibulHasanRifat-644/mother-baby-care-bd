export type VideoCategory = 'diarrhea' | 'fever' | 'vaccine' | 'cold' | 'burping' | 'food' | 'emergency';

export interface PediatricVideo {
  id: string;
  category: VideoCategory;
  titleBn: string;
  titleEn: string;
  youtubeId?: string;
  videoUrl?: string; // Direct video file (data URL / object URL / MP4 link)
  duration: string; // e.g. "৩:৪৫ মিনিট"
  source: string; // e.g. "স্বাস্থ্য সহকারী", "উপজেলা স্বাস্থ্য কমপ্লেক্স", "ইপিআই"
  descriptionBn: string;
  keyPointsBn: string[];
  thumbnailUrl?: string;
  uploadedBy?: string;
  uploadedAt?: string;
}
