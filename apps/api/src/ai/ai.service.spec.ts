import { AiService } from './ai.service';

describe('AiService (Explainable Queue Intelligence)', () => {
  let aiService: AiService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      procurementCenter: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
      },
      predictionLog: {
        create: jest.fn().mockResolvedValue({ id: 'log-1' }),
      },
    };
    aiService = new AiService(mockPrisma as any);
  });

  it('should accurately calculate estimated wait time based on queue length and active counters', async () => {
    mockPrisma.procurementCenter.findUnique.mockResolvedValue({
      id: 'center-1',
      name: 'Balasore Mandi',
      activeCounters: 3,
      tokens: [
        { id: 't1' }, { id: 't2' }, { id: 't3' },
        { id: 't4' }, { id: 't5' }, { id: 't6' },
      ],
    });

    const result = await aiService.predictWaitTime('center-1');
    expect(result.centerId).toBe('center-1');
    expect(result.queueLength).toBe(6);
    expect(result.activeCounters).toBe(3);
    // (6 tokens / 3 counters) * 14.5 mins = ~29 mins
    expect(result.estimatedMinutes).toBeGreaterThanOrEqual(25);
    expect(result.confidence).toBeGreaterThan(0.75);
    expect(result.fallbackUsed).toBe(false);
  });

  it('should apply fallback estimator gracefully if center record is missing', async () => {
    mockPrisma.procurementCenter.findUnique.mockResolvedValue(null);

    const result = await aiService.predictWaitTime('missing-center');
    expect(result.fallbackUsed).toBe(true);
    expect(result.estimatedMinutes).toBe(20);
    expect(result.confidence).toBe(0.5);
  });
});
