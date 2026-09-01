import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

export interface ParseVoiceInputDto {
  transcript: string;
  language?: string; // hi, or, pa, bn, mr, te, ta, gu, kn, en
}

@Injectable()
export class VoiceService {
  private readonly logger = new Logger(VoiceService.name);

  constructor(private prisma: PrismaService) {}

  async parseIntent(dto: ParseVoiceInputDto) {
    const text = (dto.transcript || '').toLowerCase().trim();
    const lang = dto.language || 'hi';

    let intent = 'UNKNOWN';
    let crop: string | undefined = undefined;
    let confidence = 0.5;
    let confirmationPrompt = '';
    let actionRecommendation: string = 'SHOW_OPTIONS';

    // 1. Check for Book Slot / Sell Crop intent
    if (
      text.includes('bechna') ||
      text.includes('बेचना') ||
      text.includes('sell') ||
      text.includes('bikri') ||
      text.includes('ବିକ୍ରି') ||
      text.includes('vechna') ||
      text.includes('ਵੇਚਣਾ') ||
      text.includes('slot') ||
      text.includes('स्लॉट') ||
      text.includes('book') ||
      text.includes('बुक') ||
      text.includes('darj') ||
      text.includes('दर्ज') ||
      text.includes('becho') ||
      text.includes('बेचो') ||
      text.includes('vikayche') ||
      text.includes('विकायचे') ||
      text.includes('खरीद') ||
      text.includes('kharid')
    ) {
      intent = 'BOOK_CROP';
      confidence = 0.92;

      // Extract crop name if mentioned
      if (
        text.includes('dhan') ||
        text.includes('धान') ||
        text.includes('ଧାନ') ||
        text.includes('ਝੋਨਾ') ||
        text.includes('paddy') ||
        text.includes('dhaan') ||
        text.includes('chawal') ||
        text.includes('चावल')
      ) {
        crop = 'धान / Paddy';
      } else if (
        text.includes('gehun') ||
        text.includes('गेहूं') ||
        text.includes('wheat') ||
        text.includes('ਗਹਮ') ||
        text.includes('kanak') ||
        text.includes('कनक')
      ) {
        crop = 'गेहूं / Wheat';
      } else if (
        text.includes('sarson') ||
        text.includes('सरसों') ||
        text.includes('mustard') ||
        text.includes('ସୋରିଷ') ||
        text.includes('tori')
      ) {
        crop = 'सरसों / Mustard';
      } else if (
        text.includes('chana') ||
        text.includes('चना') ||
        text.includes('gram') ||
        text.includes('ଚଣା')
      ) {
        crop = 'चना / Chana';
      }

      confirmationPrompt = crop
        ? `क्या आप ${crop} बेचने के लिए निकटतम केंद्र में स्लॉट बुक करना चाहते हैं?`
        : `क्या आप आज अपनी फसल का स्लॉट बुक करना चाहते हैं?`;
      actionRecommendation = 'NAVIGATE_BOOKING';
    }
    // 2. Check for Token status
    else if (
      text.includes('token') ||
      text.includes('टोकन') ||
      text.includes('tokan') ||
      text.includes('ଟୋକନ୍') ||
      text.includes('ਟੋਕਨ') ||
      text.includes('number') ||
      text.includes('नंबर') ||
      text.includes('kramank') ||
      text.includes('क्रमांक') ||
      text.includes('rashid') ||
      text.includes('रसीद') ||
      text.includes('mera token') ||
      text.includes('मेरा टोकन')
    ) {
      intent = 'CHECK_TOKEN';
      confidence = 0.95;
      confirmationPrompt = 'क्या आप अपने वर्तमान टोकन की स्थिति देखना चाहते हैं?';
      actionRecommendation = 'NAVIGATE_TOKEN';
    }
    // 3. Check for Live Queue / Waiting / Crowd
    else if (
      text.includes('bheed') ||
      text.includes('भीड़') ||
      text.includes('queue') ||
      text.includes('कतार') ||
      text.includes('wait') ||
      text.includes('line') ||
      text.includes('लाइन') ||
      text.includes('intzar') ||
      text.includes('इंतजार') ||
      text.includes('इंतज़ार') ||
      text.includes('katta') ||
      text.includes('position') ||
      text.includes('ਧਾੜੀ') ||
      text.includes('ਧਾੜ')
    ) {
      intent = 'CHECK_QUEUE';
      confidence = 0.91;
      confirmationPrompt = 'क्या आप मंडी की लाइव कतार और अनुमानित प्रतीक्षा समय देखना चाहते हैं?';
      actionRecommendation = 'NAVIGATE_QUEUE';
    }
    // 4. Check for Center Discovery / Mandi Open
    else if (
      text.includes('kendra') ||
      text.includes('केंद्र') ||
      text.includes('mandi') ||
      text.includes('मंडी') ||
      text.includes('मण्डी') ||
      text.includes('center') ||
      text.includes('open') ||
      text.includes('khuli') ||
      text.includes('खुली') ||
      text.includes('pas') ||
      text.includes('पास') ||
      text.includes('nearby')
    ) {
      intent = 'FIND_CENTER';
      confidence = 0.88;
      confirmationPrompt = 'क्या आप अपने आसपास के सक्रिय खरीद केंद्रों की सूची देखना चाहते हैं?';
      actionRecommendation = 'NAVIGATE_CENTERS';
    }
    // 5. Check for Payment / DBT status
    else if (
      text.includes('payment') ||
      text.includes('पेमेंट') ||
      text.includes('paisa') ||
      text.includes('पैसा') ||
      text.includes('rupaye') ||
      text.includes('रुपये') ||
      text.includes('khata') ||
      text.includes('खाता') ||
      text.includes('dbt') ||
      text.includes('डीबीटी') ||
      text.includes('bhugtan') ||
      text.includes('भुगतान')
    ) {
      intent = 'CHECK_PAYMENT';
      confidence = 0.94;
      confirmationPrompt = 'क्या आप अपने बैंक खाते में भुगतान की स्थिति देखना चाहते हैं?';
      actionRecommendation = 'NAVIGATE_PAYMENT';
    }
    // 6. Help / Instructions
    else if (
      text.includes('help') ||
      text.includes('हेल्प') ||
      text.includes('madad') ||
      text.includes('मदद') ||
      text.includes('sahayata') ||
      text.includes('सहायता') ||
      text.includes('kaise') ||
      text.includes('कैसे')
    ) {
      intent = 'HELP';
      confidence = 0.9;
      confirmationPrompt = 'किसान पहले सहायता केंद्र में आपका स्वागत है। आप बोलकर स्लॉट, टोकन या कतार जांच सकते हैं।';
      actionRecommendation = 'SHOW_HELP';
    } else {
      intent = 'UNKNOWN';
      confidence = 0.4;
      confirmationPrompt = 'माफ़ कीजिए, हम समझ नहीं पाए। कृपया नीचे दिए गए विकल्पों में से चुनें।';
      actionRecommendation = 'SHOW_FALLBACK_MENU';
    }

    // Log AI Prediction
    await this.prisma.predictionLog.create({
      data: {
        predictionType: 'VOICE_INTENT',
        inputParametersJson: JSON.stringify({ transcript: dto.transcript, language: lang }),
        predictedValueJson: JSON.stringify({ intent, crop, confidence, actionRecommendation }),
        confidence,
        modelVersion: 'voice-nlp-v1.4',
        fallbackUsed: confidence < 0.6,
      },
    });

    return {
      transcript: dto.transcript,
      language: lang,
      intent,
      crop,
      confidence,
      needsConfirmation: true, // Always true to enforce AI safety principle
      confirmationPrompt,
      actionRecommendation,
      timestamp: new Date().toISOString(),
    };
  }
}
