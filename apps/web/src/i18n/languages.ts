export interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  script: string;
  speechCode: string;
}

export const ALL_22_INDIAN_LANGUAGES: LanguageInfo[] = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', script: 'Devanagari', speechCode: 'hi-IN' },
  { code: 'en', name: 'English', nativeName: 'English', script: 'Latin', speechCode: 'en-IN' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', script: 'Odia', speechCode: 'or-IN' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', script: 'Bengali', speechCode: 'bn-IN' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', script: 'Gurmukhi', speechCode: 'pa-IN' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', script: 'Devanagari', speechCode: 'mr-IN' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', script: 'Gujarati', speechCode: 'gu-IN' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', script: 'Telugu', speechCode: 'te-IN' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', script: 'Tamil', speechCode: 'ta-IN' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', script: 'Kannada', speechCode: 'kn-IN' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', script: 'Malayalam', speechCode: 'ml-IN' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', script: 'Bengali', speechCode: 'as-IN' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', script: 'Perso-Arabic', speechCode: 'ur-IN' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', script: 'Devanagari', speechCode: 'ne-NP' },
  { code: 'kok', name: 'Konkani', nativeName: 'कोंकणी', script: 'Devanagari', speechCode: 'kok-IN' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली', script: 'Devanagari', speechCode: 'mai-IN' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', script: 'Devanagari', speechCode: 'sa-IN' },
  { code: 'ks', name: 'Kashmiri', nativeName: 'कॉशुर', script: 'Perso-Arabic', speechCode: 'ks-IN' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي', script: 'Perso-Arabic', speechCode: 'sd-IN' },
  { code: 'mni', name: 'Manipuri', nativeName: 'ꯃꯤꯇꯩꯂꯣꯟ', script: 'Meetei Mayek', speechCode: 'mni-IN' },
  { code: 'brx', name: 'Bodo', nativeName: 'बड़ो', script: 'Devanagari', speechCode: 'brx-IN' },
  { code: 'sat', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', script: 'Ol Chiki', speechCode: 'sat-IN' },
];
