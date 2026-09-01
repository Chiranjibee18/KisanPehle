import { VoiceService } from './voice.service';

describe('VoiceService (Voice Intent & AI Safety)', () => {
  let voiceService: VoiceService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      predictionLog: {
        create: jest.fn().mockResolvedValue({ id: 'log-v1' }),
      },
    };
    voiceService = new VoiceService(mockPrisma as any);
  });

  it('should extract BOOK_CROP intent and Paddy crop from Hindi speech', async () => {
    const result = await voiceService.parseIntent({
      transcript: 'मुझे धान बेचना है',
      language: 'hi',
    });

    expect(result.intent).toBe('BOOK_CROP');
    expect(result.crop).toBe('धान / Paddy');
    expect(result.confidence).toBeGreaterThan(0.85);
    // Mandatory AI Safety Rule: Must require human confirmation before action
    expect(result.needsConfirmation).toBe(true);
    expect(result.confirmationPrompt).toContain('धान');
  });

  it('should extract CHECK_TOKEN intent from user query', async () => {
    const result = await voiceService.parseIntent({
      transcript: 'मेरा टोकन नंबर क्या है',
      language: 'hi',
    });

    expect(result.intent).toBe('CHECK_TOKEN');
    expect(result.needsConfirmation).toBe(true);
    expect(result.actionRecommendation).toBe('NAVIGATE_TOKEN');
  });

  it('should extract CHECK_QUEUE intent from queue inquiry', async () => {
    const result = await voiceService.parseIntent({
      transcript: 'मंडी में कितनी भीड़ है और कितना इंतजार करना पड़ेगा',
      language: 'hi',
    });

    expect(result.intent).toBe('CHECK_QUEUE');
    expect(result.actionRecommendation).toBe('NAVIGATE_QUEUE');
  });
});
