// =================================================================
// Kisan Pehele — Shared TypeScript Domain Types & Enums
// "Pehle pata, phir mandi."
// =================================================================

export enum UserRole {
  FARMER = 'FARMER',
  TRUSTED_HELPER = 'TRUSTED_HELPER',
  OFFICER = 'OFFICER',
  DISTRICT_ADMIN = 'DISTRICT_ADMIN',
  STATE_ADMIN = 'STATE_ADMIN',
  AUDITOR = 'AUDITOR',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum CenterStatus {
  ACTIVE = 'ACTIVE',
  LIMITED_CAPACITY = 'LIMITED_CAPACITY',
  PAUSED = 'PAUSED',
  CLOSED = 'CLOSED',
}

export enum ScheduleStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  PAUSED = 'PAUSED',
  CLOSED = 'CLOSED',
}

export enum BookingStatus {
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  RESCHEDULED = 'RESCHEDULED',
  COMPLETED = 'COMPLETED',
  NO_SHOW = 'NO_SHOW',
}

export enum TokenStatus {
  ISSUED = 'ISSUED',
  ARRIVED = 'ARRIVED',
  CALLED = 'CALLED',
  SERVING = 'SERVING',
  COMPLETED = 'COMPLETED',
  EXPIRED = 'EXPIRED',
  SKIPPED = 'SKIPPED',
}

export enum ProcurementStatus {
  REGISTERED = 'REGISTERED',
  SCHEDULED = 'SCHEDULED',
  ARRIVED = 'ARRIVED',
  VERIFICATION = 'VERIFICATION',
  INSPECTION = 'INSPECTION',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  PROCUREMENT_COMPLETED = 'PROCUREMENT_COMPLETED',
  PAYMENT_PROCESSING = 'PAYMENT_PROCESSING',
  PAID = 'PAID',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
}

export enum CropGrade {
  GRADE_A = 'GRADE_A',
  GRADE_B = 'GRADE_B',
  GRADE_C = 'GRADE_C',
  FAQ_STANDARD = 'FAQ_STANDARD',
  BELOW_STANDARD = 'BELOW_STANDARD',
}

export enum NotificationChannel {
  IN_APP = 'IN_APP',
  SMS = 'SMS',
  IVR = 'IVR',
  PUSH = 'PUSH',
}

export enum VoiceIntentType {
  BOOK_CROP = 'BOOK_CROP',
  FIND_CENTER = 'FIND_CENTER',
  CHECK_TOKEN = 'CHECK_TOKEN',
  CHECK_QUEUE = 'CHECK_QUEUE',
  CHECK_STATUS = 'CHECK_STATUS',
  CHECK_PAYMENT = 'CHECK_PAYMENT',
  CANCEL_BOOKING = 'CANCEL_BOOKING',
  RESCHEDULE_BOOKING = 'RESCHEDULE_BOOKING',
  HELP = 'HELP',
  UNKNOWN = 'UNKNOWN',
}

export interface VoiceInterpretationResult {
  intent: VoiceIntentType;
  crop?: string;
  quantityQuintals?: number;
  centerName?: string;
  preferredDate?: string;
  confidence: number;
  spokenText: string;
  language: string;
  needsConfirmation: boolean;
  confirmationPrompt: string;
}

export interface WaitTimePrediction {
  centerId: string;
  estimatedMinutes: number;
  queueLength: number;
  activeCounters: number;
  confidence: number;
  modelVersion: string;
  generatedAt: string;
  fallbackUsed: boolean;
}

export interface DemandForecast {
  centerId: string;
  cropId: string;
  date: string;
  expectedBags: number;
  expectedFarmers: number;
  confidence: number;
  modelVersion: string;
}

export interface CenterRecommendation {
  centerId: string;
  centerName: string;
  distanceKm: number;
  queueWaitMinutes: number;
  availableCapacityPercentage: number;
  score: number;
  recommendationReason: string;
  status: CenterStatus;
}

// State Machine Transition Rule Map
export const VALID_PROCUREMENT_TRANSITIONS: Record<ProcurementStatus, ProcurementStatus[]> = {
  [ProcurementStatus.REGISTERED]: [ProcurementStatus.SCHEDULED],
  [ProcurementStatus.SCHEDULED]: [ProcurementStatus.ARRIVED, ProcurementStatus.REJECTED],
  [ProcurementStatus.ARRIVED]: [ProcurementStatus.VERIFICATION, ProcurementStatus.REJECTED],
  [ProcurementStatus.VERIFICATION]: [ProcurementStatus.INSPECTION, ProcurementStatus.REJECTED],
  [ProcurementStatus.INSPECTION]: [ProcurementStatus.ACCEPTED, ProcurementStatus.REJECTED],
  [ProcurementStatus.ACCEPTED]: [ProcurementStatus.PROCUREMENT_COMPLETED],
  [ProcurementStatus.REJECTED]: [],
  [ProcurementStatus.PROCUREMENT_COMPLETED]: [ProcurementStatus.PAYMENT_PROCESSING],
  [ProcurementStatus.PAYMENT_PROCESSING]: [ProcurementStatus.PAID, ProcurementStatus.PAYMENT_FAILED],
  [ProcurementStatus.PAID]: [],
  [ProcurementStatus.PAYMENT_FAILED]: [ProcurementStatus.PAYMENT_PROCESSING],
};

export function isValidProcurementTransition(current: ProcurementStatus, next: ProcurementStatus): boolean {
  const allowed = VALID_PROCUREMENT_TRANSITIONS[current];
  return allowed ? allowed.includes(next) : false;
}

export interface SupportedLanguage {
  code: string;
  name: string;
  nativeName: string;
  script: string;
  direction: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', script: 'Devanagari', direction: 'ltr' },
  { code: 'en', name: 'English', nativeName: 'English', script: 'Latin', direction: 'ltr' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', script: 'Odia', direction: 'ltr' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', script: 'Bengali', direction: 'ltr' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', script: 'Gurmukhi', direction: 'ltr' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', script: 'Devanagari', direction: 'ltr' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', script: 'Gujarati', direction: 'ltr' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', script: 'Telugu', direction: 'ltr' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', script: 'Tamil', direction: 'ltr' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', script: 'Kannada', direction: 'ltr' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', script: 'Malayalam', direction: 'ltr' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', script: 'Bengali', direction: 'ltr' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', script: 'Perso-Arabic', direction: 'rtl' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', script: 'Devanagari', direction: 'ltr' },
  { code: 'kok', name: 'Konkani', nativeName: 'कोंकणी', script: 'Devanagari', direction: 'ltr' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली', script: 'Devanagari', direction: 'ltr' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', script: 'Devanagari', direction: 'ltr' },
  { code: 'ks', name: 'Kashmiri', nativeName: 'कॉशुर', script: 'Perso-Arabic', direction: 'rtl' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي', script: 'Perso-Arabic', direction: 'rtl' },
  { code: 'mni', name: 'Manipuri', nativeName: 'ꯃꯤꯇꯩꯂꯣꯟ', script: 'Meetei Mayek', direction: 'ltr' },
  { code: 'brx', name: 'Bodo', nativeName: 'बड़ो', script: 'Devanagari', direction: 'ltr' },
  { code: 'sat', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', script: 'Ol Chiki', direction: 'ltr' },
];
