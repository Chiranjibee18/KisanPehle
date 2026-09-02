import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

export interface IVRRequestDto {
  callerNumber: string;
  step?: string; // "LANGUAGE", "MAIN_MENU", "TOKEN_QUERY", "QUEUE_QUERY"
  dtmfDigit?: string;
  language?: string;
}

@Injectable()
export class IvrService {
  private readonly logger = new Logger(IvrService.name);

  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async handleCall(dto: IVRRequestDto) {
    const caller = dto.callerNumber || '9876543210';
    const step = dto.step || 'LANGUAGE';
    let lang = dto.language || 'hi';
    let responseText = '';
    let nextStep = '';
    let options: Array<{ digit: string; label: string }> = [];

    // Step 1: Language Selection Prompt or Transition
    if (step === 'LANGUAGE') {
      if (!dto.dtmfDigit) {
        // Initial greeting
        responseText =
          'किसान पहले हेल्पलाइन में आपका स्वागत है। हिंदी के लिए 1 दबाएं। ଓଡ଼ିଆ ପାଇଁ 2 ଦବାନ୍ତୁ। For English press 3.';
        nextStep = 'LANGUAGE';
        options = [
          { digit: '1', label: 'हिन्दी (Hindi)' },
          { digit: '2', label: 'ଓଡ଼ିଆ (Odia)' },
          { digit: '3', label: 'English' },
        ];

        return { callerNumber: caller, step: nextStep, language: lang, responseText, options, isEnded: false };
      }

      // User selected language: 1 = Hindi, 2 = Odia, 3 = English
      if (dto.dtmfDigit === '1') lang = 'hi';
      else if (dto.dtmfDigit === '2') lang = 'or';
      else if (dto.dtmfDigit === '3') lang = 'en';

      nextStep = 'MAIN_MENU';

      if (lang === 'hi') {
        responseText =
          'किसान पहले सेवा में आपका स्वागत है। अपने वर्तमान टोकन की स्थिति के लिए 1 दबाएं। मंडी में लाइव कतार जानने के लिए 2 दबाएं। नजदीकी केंद्र की स्थिति के लिए 3 दबाएं।';
        options = [
          { digit: '1', label: '1 - टोकन स्थिति (Token Status)' },
          { digit: '2', label: '2 - लाइव कतार (Live Queue)' },
          { digit: '3', label: '3 - केंद्र स्थिति (Center Status)' },
        ];
      } else if (lang === 'or') {
        responseText =
          'କିସାନ ପେହେଲେ ସେବାକୁ ସ୍ଵାଗତ। ଆପଣଙ୍କ ଟୋକନ୍ ସ୍ଥିତି ପାଇଁ 1 ଦବାନ୍ତୁ। ଲାଇଭ୍ ଧାଡ଼ି ଜାଣିବା ପାଇଁ 2 ଦବାନ୍ତୁ। ମଣ୍ଡି କେନ୍ଦ୍ର ସ୍ଥିତି ପାଇଁ 3 ଦବାନ୍ତୁ।';
        options = [
          { digit: '1', label: '1 - ଟୋକନ୍ ସ୍ଥିତି' },
          { digit: '2', label: '2 - ଲାଇଭ୍ ଧାଡ଼ି' },
          { digit: '3', label: '3 - କେନ୍ଦ୍ର ସ୍ଥିତି' },
        ];
      } else {
        responseText =
          'Welcome to Kisan Pehele Helpline. Press 1 for your Token status. Press 2 for Live Queue status. Press 3 for Mandi Center status.';
        options = [
          { digit: '1', label: '1 - Token Status' },
          { digit: '2', label: '2 - Live Queue' },
          { digit: '3', label: '3 - Center Status' },
        ];
      }

      return { callerNumber: caller, step: nextStep, language: lang, responseText, options, isEnded: false };
    }

    // Step 2: Main Menu Choice Handling
    if (step === 'MAIN_MENU' || step === 'MAIN_MENU_CHOICE') {
      if (!dto.dtmfDigit) {
        if (lang === 'hi') {
          responseText =
            'किसान पहले सेवा। टोकन स्थिति के लिए 1 दबाएं। लाइव कतार के लिए 2 दबाएं। केंद्र स्थिति के लिए 3 दबाएं।';
          options = [
            { digit: '1', label: '1 - टोकन स्थिति' },
            { digit: '2', label: '2 - लाइव कतार' },
            { digit: '3', label: '3 - केंद्र स्थिति' },
          ];
        } else if (lang === 'or') {
          responseText =
            'କିସାନ ପେହେଲେ ସେବା। ଟୋକନ୍ ସ୍ଥିତି ପାଇଁ 1 ଦବାନ୍ତୁ। ଲାଇଭ୍ ଧାଡ଼ି ପାଇଁ 2 ଦବାନ୍ତୁ। କେନ୍ଦ୍ର ସ୍ଥିତି ପାଇଁ 3 ଦବାନ୍ତୁ।';
          options = [
            { digit: '1', label: '1 - ଟୋକନ୍ ସ୍ଥିତି' },
            { digit: '2', label: '2 - ଲାଇଭ୍ ଧାଡ଼ି' },
            { digit: '3', label: '3 - କେନ୍ଦ୍ର ସ୍ଥିତି' },
          ];
        } else {
          responseText =
            'Welcome to Kisan Pehele. Press 1 for Token status. Press 2 for Live Queue. Press 3 for Center status.';
          options = [
            { digit: '1', label: '1 - Token Status' },
            { digit: '2', label: '2 - Live Queue' },
            { digit: '3', label: '3 - Center Status' },
          ];
        }
        nextStep = 'MAIN_MENU';
      } else {
        nextStep = 'CALL_ENDED';
        let smsMessage = '';

        if (dto.dtmfDigit === '1') {
          // Token Status Query
          if (lang === 'hi') {
            responseText =
              'नमस्ते रमेश जी। आपका टोकन A-102 है। केंद्र: बालेश्वर आरएमसी मुख्य मंडी। अनुशंसित समय: सुबह 09:00 बजे। अनुमानित प्रतीक्षा समय लगभग 20 मिनट है। किसान पहले — पहले पता, फिर मंडी।';
            smsMessage = 'किसान पहले: टोकन A-102 बालेश्वर मंडी में 09:00 AM पर पुष्टि है। अनुमानित प्रतीक्षा 20 मिनट।';
          } else if (lang === 'or') {
            responseText =
              'ନମସ୍କାର ରମେଶ ଜୀ। ଆପଣଙ୍କ ଟୋକନ୍ A-102 ଅଟେ। କେନ୍ଦ୍ର: ବାଲେଶ୍ଵର ଆରଏମସି କେନ୍ଦ୍ରୀୟ ମଣ୍ଡି। ଆନୁମାନିକ ସମୟ: ସକାଳ 09:00। ଅପେକ୍ଷା ସମୟ ପ୍ରାୟ 20 ମିନିଟ୍। କିସାନ ପେହେଲେ — ପେହେଲେ ପତା, ଫିର୍ ମଣ୍ଡି।';
            smsMessage = 'କିସାନ ପେହେଲେ: ଟୋକନ୍ A-102 ବାଲେଶ୍ଵର ମଣ୍ଡିରେ 09:00 AM ପାଇଁ ନିଶ୍ଚିତ। ଅପେକ୍ଷା ସମୟ 20 ମିନିଟ୍।';
          } else {
            responseText =
              'Hello Ramesh ji. Your token is A-102 at Balasore RMC Central Mandi. Recommended arrival: 09:00 AM. Estimated wait: ~20 mins. Kisan Pehele — Know Before You Go.';
            smsMessage = 'Kisan Pehele: Token A-102 at Balasore Mandi is confirmed for 09:00 AM. Estimated wait ~20 mins.';
          }

          this.notificationsService.addSmsLog({
            mobile: caller,
            name: 'Ramesh Patel',
            title: `IVR Token Query: A-102`,
            message: smsMessage,
            language: lang,
          });
        } else if (dto.dtmfDigit === '2') {
          // Live Queue Query
          if (lang === 'hi') {
            responseText =
              'बालेश्वर आरएमसी मुख्य मंडी में इस समय 7 किसान कतार में हैं। 3 तौल कांटे चालू हैं। औसत प्रतीक्षा 25 मिनट है।';
            smsMessage = 'किसान पहले कतार अलर्ट: बालेश्वर मंडी में 7 किसान कतार में हैं। 3 तौल कांटे सक्रिय हैं।';
          } else if (lang === 'or') {
            responseText =
              'ବାଲେଶ୍ଵର ଆରଏମସି ମଣ୍ଡିରେ ବର୍ତ୍ତମାନ 7 ଜଣ ଚାଷୀ ଧାଡ଼ିରେ ଅଛନ୍ତି। 3ଟି ଓଜନ କାଣ୍ଟା ଚାଲୁ ଅଛି। ହାରାହାରି ଅପେକ୍ଷା 25 ମିନିଟ୍।';
            smsMessage = 'କିସାନ ପେହେଲେ ଲାଇଭ୍ ଧାଡ଼ି: ବାଲେଶ୍ଵର ମଣ୍ଡିରେ 7 ଜଣ ଚାଷୀ ଧାଡ଼ିରେ ଅଛନ୍ତି। 3ଟି କାଉଣ୍ଟର ଚାଲୁ ଅଛି।';
          } else {
            responseText =
              'Balasore RMC Central Mandi currently has 7 farmers in queue with 3 active weighing counters. Average wait time is 25 minutes.';
            smsMessage = 'Kisan Pehele Live Queue: 7 farmers in queue at Balasore Mandi with 3 active weighbridges. Avg wait: 25m.';
          }

          this.notificationsService.addSmsLog({
            mobile: caller,
            name: 'Ramesh Patel',
            title: `IVR Queue Enquiry`,
            message: smsMessage,
            language: lang,
          });
        } else if (dto.dtmfDigit === '3') {
          // Center Status Query
          if (lang === 'hi') {
            responseText =
              'बालेश्वर आरएमसी मुख्य मंडी खुली है। कार्य समय सुबह 8:00 बजे से शाम 5:00 बजे तक है। सभी 4 तौल कांटे सक्रिय हैं।';
            smsMessage = 'किसान पहले: बालेश्वर मुख्य मंडी खुली है (08:00 AM - 05:00 PM)। 4 कांटे सक्रिय हैं।';
          } else if (lang === 'or') {
            responseText =
              'ବାଲେଶ୍ଵର ଆରଏମସି କେନ୍ଦ୍ରୀୟ ମଣ୍ଡି ଖୋଲା ଅଛି। କାର୍ଯ୍ୟ ସମୟ ସକାଳ 8:00 ରୁ ସନ୍ଧ୍ୟା 5:00 ପର୍ଯ୍ୟନ୍ତ। ସମସ୍ତ 4ଟି କାଉଣ୍ଟର କାର୍ଯ୍ୟକ୍ଷମ।';
            smsMessage = 'କିସାନ ପେହେଲେ: ବାଲେଶ୍ଵର ମୁଖ୍ୟ ମଣ୍ଡି ଖୋଲା ଅଛି (08:00 AM - 05:00 PM)। ସମସ୍ତ କାଉଣ୍ଟର ସକ୍ରିୟ।';
          } else {
            responseText =
              'Balasore RMC Central Mandi is OPEN. Operating hours: 8:00 AM to 5:00 PM. All 4 weighing counters are operational.';
            smsMessage = 'Kisan Pehele: Balasore RMC Central Mandi is OPEN (08:00 AM - 05:00 PM). All 4 counters operational.';
          }

          this.notificationsService.addSmsLog({
            mobile: caller,
            name: 'Ramesh Patel',
            title: `IVR Center Status`,
            message: smsMessage,
            language: lang,
          });
        }
      }
    }

    try {
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
    } catch {}

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
    try {
      const logs = await this.prisma.iVRCallLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20,
      });
      if (logs && logs.length > 0) return logs;
    } catch {}

    return [
      {
        id: 'ivr-001',
        callerNumber: '9876543210',
        language: 'hi',
        selectedOption: '1',
        intentDetected: 'TOKEN_QUERY',
        responseText: 'नमस्ते रमेश जी। आपका टोकन A-102 है।',
        createdAt: new Date().toISOString(),
      },
    ];
  }
}
