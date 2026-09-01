import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

export interface IVRRequestDto {
  callerNumber: string;
  step?: string; // "LANGUAGE", "MAIN_MENU", "TOKEN_QUERY", "QUEUE_QUERY"
  dtmfDigit?: string;
  language?: string;
}

@Injectable()
export class IvrService {
  private readonly logger = new Logger(IvrService.name);

  constructor(private prisma: PrismaService) {}

  async handleCall(dto: IVRRequestDto) {
    const caller = dto.callerNumber || '9876543210';
    let step = dto.step || 'LANGUAGE';
    let lang = dto.language || 'hi';
    let responseText = '';
    let nextStep = '';
    let options: Array<{ digit: string; label: string }> = [];

    // Step 1: Language Selection
    if (step === 'LANGUAGE') {
      if (dto.dtmfDigit) {
        if (dto.dtmfDigit === '1') lang = 'hi';
        else if (dto.dtmfDigit === '2') lang = 'or';
        else if (dto.dtmfDigit === '3') lang = 'en';

        step = 'MAIN_MENU';
      } else {
        responseText =
          'किसान पहले हेल्पलाइन में आपका स्वागत है। हिंदी के लिए 1 दबाएं। ଓଡ଼ିଆ ପାଇଁ 2 ଦବାନ୍ତୁ। For English press 3.';
        nextStep = 'LANGUAGE';
        options = [
          { digit: '1', label: 'हिन्दी (Hindi)' },
          { digit: '2', label: 'ଓଡ଼ିଆ (Odia)' },
          { digit: '3', label: 'English' },
        ];

        return { step: nextStep, language: lang, responseText, options };
      }
    }

    // Step 2: Main Menu
    if (step === 'MAIN_MENU') {
      if (!dto.dtmfDigit) {
        if (lang === 'hi') {
          responseText =
            'किसान पहले सेवा। अपने वर्तमान टोकन की स्थिति के लिए 1 दबाएं। मंडी में लाइव कतार जानने के लिए 2 दबाएं। नजदीकी केंद्र की स्थिति के लिए 3 दबाएं।';
          options = [
            { digit: '1', label: '1 - टोकन स्थिति (Token Status)' },
            { digit: '2', label: '2 - लाइव कतार (Live Queue)' },
            { digit: '3', label: '3 - केंद्र स्थिति (Center Status)' },
          ];
        } else if (lang === 'or') {
          responseText =
            'କିସାନ ପେହେଲେ ସେବା। ଆପଣଙ୍କ ଟୋକନ୍ ସ୍ଥିତି ପାଇଁ 1 ଦବାନ୍ତୁ। ଲାଇଭ୍ ଧାଡ଼ି ଜାଣିବା ପାଇଁ 2 ଦବାନ୍ତୁ। କେନ୍ଦ୍ର ସ୍ଥିତି ପାଇଁ 3 ଦବାନ୍ତୁ।';
          options = [
            { digit: '1', label: '1 - ଟୋକନ୍ ସ୍ଥିତି' },
            { digit: '2', label: '2 - ଲାଇଭ୍ ଧାଡ଼ି' },
            { digit: '3', label: '3 - କେନ୍ଦ୍ର ସ୍ଥିତି' },
          ];
        } else {
          responseText =
            'Welcome to Kisan Pehele. Press 1 for your Token status. Press 2 for Live Queue status. Press 3 for Procurement Center status.';
          options = [
            { digit: '1', label: '1 - Token Status' },
            { digit: '2', label: '2 - Live Queue' },
            { digit: '3', label: '3 - Center Status' },
          ];
        }
        nextStep = 'MAIN_MENU_CHOICE';
      } else {
        // Handle choice
        if (dto.dtmfDigit === '1') {
          // Look up caller's token
          const user = await this.prisma.user.findUnique({
            where: { mobile: caller },
            include: {
              bookings: {
                where: { status: 'CONFIRMED' },
                include: { token: true, center: true, crop: true },
                orderBy: { createdAt: 'desc' },
                take: 1,
              },
            },
          });

          const activeBooking = user?.bookings[0];
          if (activeBooking && activeBooking.token) {
            const token = activeBooking.token;
            const center = activeBooking.center;
            responseText =
              lang === 'hi'
                ? `नमस्ते ${user.name} जी। आपका टोकन ${token.tokenNumber} है। केंद्र: ${center.name}। अनुशंसित समय: ${token.recommendedArrival}। अनुमानित प्रतीक्षा समय लगभग ${token.estimatedWaitMinutes} मिनट है। किसान पहले — पहले पता, फिर मंडी।`
                : `Hello ${user.name}. Your token is ${token.tokenNumber} at ${center.name}. Recommended arrival: ${token.recommendedArrival}. Estimated wait: ~${token.estimatedWaitMinutes} mins.`;
          } else {
            responseText =
              lang === 'hi'
                ? 'आपके इस मोबाइल नंबर पर आज कोई सक्रिय टोकन दर्ज नहीं है। नया स्लॉट बुक करने के लिए कृपया किसान पहले पोर्टल पर जाएं।'
                : 'No active token found for this mobile number today.';
          }
          nextStep = 'CALL_ENDED';
        } else if (dto.dtmfDigit === '2') {
          const center = await this.prisma.procurementCenter.findFirst({
            where: { currentStatus: 'ACTIVE' },
            include: {
              tokens: { where: { status: { in: ['ISSUED', 'ARRIVED', 'CALLED', 'SERVING'] } } },
            },
          });
          const queueCount = center?.tokens.length || 6;
          responseText =
            lang === 'hi'
              ? `${center?.name || 'बालासोर मंडी'} में इस समय ${queueCount} किसान कतार में हैं। ${center?.activeCounters || 3} तौल कांटे चालू हैं। औसत प्रतीक्षा 30 मिनट है।`
              : `${center?.name || 'Balasore Mandi'} currently has ${queueCount} farmers in queue with ${center?.activeCounters || 3} active weighing counters.`;
          nextStep = 'CALL_ENDED';
        } else if (dto.dtmfDigit === '3') {
          const center = await this.prisma.procurementCenter.findFirst({
            where: { currentStatus: 'ACTIVE' },
          });
          responseText =
            lang === 'hi'
              ? `${center?.name || 'बालासोर मुख्य मंडी'} खुली है। कार्य समय सुबह 8 बजे से शाम 5 बजे तक है।`
              : `${center?.name || 'Balasore Mandi'} is OPEN. Operating hours: 8:00 AM to 5:00 PM.`;
          nextStep = 'CALL_ENDED';
        }
      }
    }

    // Log IVR Interaction
    await this.prisma.iVRCallLog.create({
      data: {
        callerNumber: caller,
        language: lang,
        selectedOption: dto.dtmfDigit || '0',
        intentDetected: step,
        responseText,
        callDurationSeconds: 28,
      },
    });

    return {
      callerNumber: caller,
      step: nextStep || step,
      language: lang,
      responseText,
      options,
      isEnded: nextStep === 'CALL_ENDED',
    };
  }

  async getRecentLogs() {
    return this.prisma.iVRCallLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }
}
