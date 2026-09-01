import { TranslationKey } from '../i18n/translations';

export interface CropLike {
  id?: string;
  code?: string;
  nameEn?: string;
  nameHi?: string;
  nameRegional?: string;
}

export function getCropDisplayName(
  crop: CropLike | null | undefined,
  language: string,
  t: (key: TranslationKey, params?: Record<string, string | number>) => string
): { primary: string; secondary: string } {
  if (!crop) return { primary: 'Paddy', secondary: '' };

  const code = (crop.code || '').toLowerCase();
  
  // Check translation key for crop if available
  let localizedName = '';
  if (code.includes('pad') || code.includes('paddy') || crop.nameEn?.toLowerCase().includes('paddy')) {
    localizedName = t('crop.paddy');
  } else if (code.includes('wht') || code.includes('wheat') || crop.nameEn?.toLowerCase().includes('wheat')) {
    localizedName = t('crop.wheat');
  } else if (code.includes('mus') || code.includes('mustard') || crop.nameEn?.toLowerCase().includes('mustard')) {
    localizedName = t('crop.mustard');
  } else if (code.includes('chn') || code.includes('chana') || crop.nameEn?.toLowerCase().includes('chana') || crop.nameEn?.toLowerCase().includes('gram')) {
    localizedName = t('crop.chana');
  } else if (code.includes('maize') || crop.nameEn?.toLowerCase().includes('maize')) {
    localizedName = t('crop.maize');
  } else if (code.includes('cotton') || crop.nameEn?.toLowerCase().includes('cotton')) {
    localizedName = t('crop.cotton');
  } else if (code.includes('soy') || crop.nameEn?.toLowerCase().includes('soybean')) {
    localizedName = t('crop.soybean');
  }

  if (language === 'en') {
    return {
      primary: crop.nameEn || localizedName || 'Crop',
      secondary: crop.nameHi || crop.nameRegional || '',
    };
  }

  if (language === 'hi') {
    return {
      primary: crop.nameHi || localizedName || crop.nameEn || 'फसल',
      secondary: crop.nameEn || '',
    };
  }

  if (language === 'or') {
    return {
      primary: crop.nameRegional || localizedName || crop.nameHi || crop.nameEn || 'ଫସଲ',
      secondary: crop.nameEn || crop.nameHi || '',
    };
  }

  return {
    primary: localizedName || crop.nameHi || crop.nameEn || 'Crop',
    secondary: crop.nameEn || '',
  };
}
