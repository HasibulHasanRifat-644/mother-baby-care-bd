import React, { useRef, useState } from 'react';
import { Camera, Image as ImageIcon, Trash2, Upload, Sparkles, Check } from 'lucide-react';
import { Language } from '../../types/vaccine';
import { compressAndConvertImage, PRESET_BABY_PHOTOS } from '../../utils/imageUtils';

interface PhotoUploadPickerProps {
  selectedPhotoUrl: string | undefined;
  onChangePhoto: (url: string | undefined) => void;
  language: Language;
  labelBn?: string;
  labelEn?: string;
}

export const PhotoUploadPicker: React.FC<PhotoUploadPickerProps> = ({
  selectedPhotoUrl,
  onChangePhoto,
  language,
  labelBn = 'ছবি যুক্ত করুন (ঐচ্ছিক):',
  labelEn = 'Add Photo (Optional):',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      const compressedDataUrl = await compressAndConvertImage(file, 800, 0.75);
      onChangePhoto(compressedDataUrl);
    } catch (err) {
      console.error('Image compression failed:', err);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
          <Camera className="w-3.5 h-3.5 text-teal-700" />
          <span>{language === 'bn' ? labelBn : labelEn}</span>
        </label>

        <button
          type="button"
          onClick={() => setShowPresets(!showPresets)}
          className="text-[11px] font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 transition-colors"
        >
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>{showPresets ? (language === 'bn' ? 'নমুনা ছবি লুকান' : 'Hide Presets') : (language === 'bn' ? 'নমুনা ছবি বেছে নিন' : 'Choose Sample Photo')}</span>
        </button>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Selected Image Preview Box */}
      {selectedPhotoUrl ? (
        <div className="relative rounded-2xl overflow-hidden border-2 border-teal-600/40 bg-slate-900 group aspect-video sm:aspect-[21/9] max-h-52">
          <img
            src={selectedPhotoUrl}
            alt="Uploaded Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-900 text-xs font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'অন্য ছবি দিন' : 'Change Photo'}</span>
            </button>
            <button
              type="button"
              onClick={() => onChangePhoto(undefined)}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'মুছে ফেলুন' : 'Remove'}</span>
            </button>
          </div>
          <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
            <Check className="w-3 h-3 text-emerald-400" />
            <span>{language === 'bn' ? 'ছবি যুক্ত হয়েছে' : 'Photo Attached'}</span>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-2xl p-4 sm:p-5 text-center cursor-pointer bg-slate-50 hover:bg-teal-50/50 transition-all flex flex-col items-center justify-center gap-1.5"
        >
          <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center">
            {isProcessing ? (
              <div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-5 h-5" />
            )}
          </div>
          <p className="text-xs font-bold text-slate-800">
            {language === 'bn' ? 'মোবাইল বা কম্পিউটার থেকে ছবি আপলোড করুন' : 'Click to Upload from Device / Camera'}
          </p>
          <p className="text-[10px] text-slate-500">
            {language === 'bn' ? 'JPG, PNG, WEBP (স্বয়ংক্রিয়ভাবে সাইজ অপ্টিমাইজ হবে)' : 'JPG, PNG, WEBP supported'}
          </p>
        </div>
      )}

      {/* Preset Photo Grid (Expandable) */}
      {showPresets && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-2">
          <p className="text-[11px] font-bold text-slate-600">
            {language === 'bn' ? 'বাচ্চাদের রেডিমেড মিষ্টি ছবি থেকে বেছে নিন:' : 'Pick an Adorable Preset:'}
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {PRESET_BABY_PHOTOS.map((preset) => {
              const isSelected = selectedPhotoUrl === preset.url;
              return (
                <div
                  key={preset.id}
                  onClick={() => {
                    onChangePhoto(preset.url);
                    setShowPresets(false);
                  }}
                  className={`relative rounded-xl overflow-hidden cursor-pointer aspect-square border-2 transition-all group ${
                    isSelected ? 'border-teal-600 ring-2 ring-teal-500/30' : 'border-slate-200 hover:border-teal-400'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.titleBn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-end p-1">
                    <span className="text-[9px] text-white font-bold truncate">
                      {preset.titleBn}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-teal-600 text-white flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
