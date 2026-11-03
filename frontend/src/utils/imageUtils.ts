/**
 * Client-side image processing utility to resize and compress photos
 * so they fit comfortably in LocalStorage and render fast.
 */

export async function compressAndConvertImage(file: File, maxWidth = 800, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxWidth) {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(readerEvent.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
      img.src = readerEvent.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

export interface PresetPhoto {
  id: string;
  titleBn: string;
  url: string;
  category: string;
}

export const PRESET_BABY_PHOTOS: PresetPhoto[] = [
  {
    id: 'preset-smile',
    titleBn: 'মিষ্টি হাসি',
    url: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=700&q=80',
    category: 'smile'
  },
  {
    id: 'preset-sleep',
    titleBn: 'শান্তিময় ঘুম',
    url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=700&q=80',
    category: 'sleep'
  },
  {
    id: 'preset-food',
    titleBn: 'মুখেভাত ও খাবার',
    url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=700&q=80',
    category: 'food'
  },
  {
    id: 'preset-feet',
    titleBn: 'ছোট্ট পায়ের ছাপ',
    url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=700&q=80',
    category: 'milestone'
  },
  {
    id: 'preset-play',
    titleBn: 'খেলনা দিয়ে খেলা',
    url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=700&q=80',
    category: 'play'
  },
  {
    id: 'preset-mother',
    titleBn: 'মায়ের কোল',
    url: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=700&q=80',
    category: 'mother'
  }
];
