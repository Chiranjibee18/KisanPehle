import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

export type BottleneckSeverity = 'NORMAL' | 'WATCH' | 'WARNING' | 'CRITICAL';

export interface CapacitySimulationDto {
  centerId?: string;
  counters: number;
  avgProcessingMinutes: number;
  dailyCapacityQuintals?: number;
  operatingHours?: number;
  expectedArrivals?: number;
  avgQuintalsPerFarmer?: number;
}

@Injectable()
export class IntelligenceService {
  private readonly logger = new Logger(IntelligenceService.name);

  // Configurable Administrative Thresholds
  private thresholds = {
    targetWaitMinutes: 30,
    watchWaitMinutes: 40,
    warningWaitMinutes: 50,
    criticalWaitMinutes: 60,
    normalUtilizationPercent: 75,
    warningUtilizationPercent: 85,
    criticalUtilizationPercent: 95,
  };

  constructor(private prisma: PrismaService) {}

  /**
   * 1. Operational Bottleneck Detection
   * Evaluates queue length, arrival vs processing rate, wait times, and capacity.
   */
  async getBottlenecks(district = 'Balasore') {
    const centersData = [
      {
        centerId: 'c1',
        centerCode: 'OD-BAL-001',
        centerName: 'Balasore RMC Central Mandi',
        district: 'Balasore',
        currentQueue: 18,
        activeCounters: 4,
        avgProcessingMinutes: 8,
        targetWaitMinutes: 30,
        arrivalRatePerHour: 8.5,
        processingRatePerHour: 12.0,
        completedToday: 42,
        cancelledToday: 2,
        noShowsToday: 4,
        dailySlotCapacity: 200,
        dailyCapacityQuintals: 500,
        trend: 'STABLE' as const,
      },
      {
        centerId: 'c2',
        centerCode: 'OD-BAL-002',
        centerName: 'Remuna Large Procurement Center',
        district: 'Balasore',
        currentQueue: 12,
        activeCounters: 3,
        avgProcessingMinutes: 9,
        targetWaitMinutes: 30,
        arrivalRatePerHour: 5.0,
        processingRatePerHour: 9.5,
        completedToday: 31,
        cancelledToday: 1,
        noShowsToday: 3,
        dailySlotCapacity: 150,
        dailyCapacityQuintals: 350,
        trend: 'DECREASING' as const,
      },
      {
        centerId: 'c3',
        centerCode: 'OD-BAL-003',
        centerName: 'Basta Block Direct Purchase Depo',
        district: 'Balasore',
        currentQueue: 48,
        activeCounters: 2,
        avgProcessingMinutes: 12,
        targetWaitMinutes: 30,
        arrivalRatePerHour: 14.2,
        processingRatePerHour: 6.8,
        completedToday: 25,
        cancelledToday: 3,
        noShowsToday: 8,
        dailySlotCapacity: 100,
        dailyCapacityQuintals: 250,
        trend: 'INCREASING' as const,
      },
      {
        centerId: 'c4',
        centerCode: 'OD-BAL-004',
        centerName: 'Jaleswar Border Mandi Terminal',
        district: 'Balasore',
        currentQueue: 22,
        activeCounters: 3,
        avgProcessingMinutes: 9,
        targetWaitMinutes: 30,
        arrivalRatePerHour: 7.2,
        processingRatePerHour: 8.5,
        completedToday: 20,
        cancelledToday: 0,
        noShowsToday: 3,
        dailySlotCapacity: 120,
        dailyCapacityQuintals: 300,
        trend: 'STABLE' as const,
      },
    ];

    return centersData.map((c) => {
      // Estimated wait calculation (Queue * avgProcessing / counters)
      const estimatedWaitMinutes = Math.round((c.currentQueue * c.avgProcessingMinutes) / Math.max(1, c.activeCounters));
      const totalBookings = c.completedToday + c.currentQueue + c.noShowsToday + c.cancelledToday;
      const utilizationPercent = Math.min(100, Math.round((totalBookings / c.dailySlotCapacity) * 100));
      const noShowRatePercent = totalBookings > 0 ? Math.round((c.noShowsToday / totalBookings) * 100) : 0;

      const reasons: Array<{ code: string; title: string; description: string }> = [];
      let severity: BottleneckSeverity = 'NORMAL';

      // Rule 1: Wait Time Thresholds
      if (estimatedWaitMinutes >= this.thresholds.criticalWaitMinutes) {
        severity = 'CRITICAL';
        reasons.push({
          code: 'RISING_WAIT_TIME',
          title: 'Critical Wait Time Exceeded',
          description: `Estimated waiting time of ${estimatedWaitMinutes}m exceeds critical statutory limit (${this.thresholds.criticalWaitMinutes}m).`,
        });
      } else if (estimatedWaitMinutes >= this.thresholds.warningWaitMinutes) {
        severity = 'WARNING';
        reasons.push({
          code: 'RISING_WAIT_TIME',
          title: 'Elevated Wait Time',
          description: `Estimated waiting time is ${estimatedWaitMinutes}m, approaching upper tolerance limit.`,
        });
      } else if (estimatedWaitMinutes >= this.thresholds.watchWaitMinutes) {
        severity = 'WATCH';
        reasons.push({
          code: 'RISING_WAIT_TIME',
          title: 'Moderate Queue Delay',
          description: `Wait time (${estimatedWaitMinutes}m) is slightly above target (${c.targetWaitMinutes}m).`,
        });
      }

      // Rule 2: Capacity Overload
      if (utilizationPercent >= this.thresholds.criticalUtilizationPercent) {
        severity = 'CRITICAL';
        reasons.push({
          code: 'CAPACITY_OVERLOAD',
          title: 'Severe Slot Capacity Saturation',
          description: `Center is operating at ${utilizationPercent}% of daily registered capacity.`,
        });
      } else if (utilizationPercent >= this.thresholds.warningUtilizationPercent) {
        if (severity !== 'CRITICAL') severity = 'WARNING';
        reasons.push({
          code: 'CAPACITY_OVERLOAD',
          title: 'High Capacity Utilization',
          description: `Slot bookings are at ${utilizationPercent}% capacity. Counter buffer is minimal.`,
        });
      }

      // Rule 3: Arrival vs Processing Rate Imbalance
      if (c.arrivalRatePerHour > c.processingRatePerHour * 1.3) {
        if (severity !== 'CRITICAL') severity = 'WARNING';
        reasons.push({
          code: 'LOW_PROCESSING_RATE',
          title: 'Arrival Rate Exceeds Counter Throughput',
          description: `Arrival rate (${c.arrivalRatePerHour} farmers/hr) outpaces weighing throughput (${c.processingRatePerHour} farmers/hr) by ${Math.round(((c.arrivalRatePerHour - c.processingRatePerHour) / c.processingRatePerHour) * 100)}%.`,
        });
      }

      // Rule 4: High Queue Length
      if (c.currentQueue >= 40) {
        severity = 'CRITICAL';
        reasons.push({
          code: 'HIGH_QUEUE',
          title: 'Extreme Yard Congestion',
          description: `${c.currentQueue} farmers physically waiting in mandi yard. Spillover risk detected.`,
        });
      }

      if (reasons.length === 0) {
        reasons.push({
          code: 'OPERATIONAL_NORMAL',
          title: 'Optimal Procurement Flow',
          description: `Yard operations are running smoothly with ${c.activeCounters} active counters.`,
        });
      }

      return {
        centerId: c.centerId,
        centerCode: c.centerCode,
        centerName: c.centerName,
        district: c.district,
        severity,
        reasons,
        metrics: {
          currentQueue: c.currentQueue,
          activeCounters: c.activeCounters,
          avgProcessingMinutes: c.avgProcessingMinutes,
          estimatedWaitMinutes,
          targetWaitMinutes: c.targetWaitMinutes,
          utilizationPercent,
          arrivalRatePerHour: c.arrivalRatePerHour,
          processingRatePerHour: c.processingRatePerHour,
          completedToday: c.completedToday,
          noShowRatePercent,
        },
        trend: c.trend,
      };
    });
  }

  /**
   * 2. What-If Procurement Capacity Simulator
   * Allows authorities to adjust operational variables and view projected impact.
   */
  simulateCapacity(input: CapacitySimulationDto) {
    const currentCounters = 4;
    const currentProcessingMinutes = 9;
    const currentOperatingHours = 8;
    const currentDailyCapacityQuintals = 500;
    const expectedArrivals = input.expectedArrivals || 60;
    const avgQuintalsPerFarmer = input.avgQuintalsPerFarmer || 20;

    // Current State Calculations
    const currentServiceRatePerHour = (currentCounters * 60) / currentProcessingMinutes;
    const arrivalRatePerHour = expectedArrivals / currentOperatingHours;
    const currentTrafficIntensity = arrivalRatePerHour / Math.max(0.1, currentServiceRatePerHour);

    const currentWaitMinutes = Math.max(
      15,
      Math.round((expectedArrivals * currentProcessingMinutes) / (currentCounters * 2.2))
    );

    let currentQueuePressure: 'LOW' | 'MODERATE' | 'HIGH' | 'OVERLOAD' = 'LOW';
    if (currentTrafficIntensity >= 1.0) currentQueuePressure = 'OVERLOAD';
    else if (currentTrafficIntensity >= 0.85) currentQueuePressure = 'HIGH';
    else if (currentTrafficIntensity >= 0.6) currentQueuePressure = 'MODERATE';

    const currentThroughputFarmers = Math.min(expectedArrivals, Math.round(currentServiceRatePerHour * currentOperatingHours));
    const currentThroughputQuintals = currentThroughputFarmers * avgQuintalsPerFarmer;

    // Projected State Calculations (from input)
    const simCounters = Math.max(1, input.counters);
    const simProcessingMinutes = Math.max(3, input.avgProcessingMinutes);
    const simOperatingHours = input.operatingHours || currentOperatingHours;
    const simCapacityQuintals = input.dailyCapacityQuintals || currentDailyCapacityQuintals;

    const simServiceRatePerHour = (simCounters * 60) / simProcessingMinutes;
    const simTrafficIntensity = arrivalRatePerHour / Math.max(0.1, simServiceRatePerHour);

    // Dynamic queueing wait projection
    const projectedWaitMinutes = Math.max(
      8,
      Math.round((expectedArrivals * simProcessingMinutes) / (simCounters * 2.5))
    );

    let projectedQueuePressure: 'LOW' | 'MODERATE' | 'HIGH' | 'OVERLOAD' = 'LOW';
    if (simTrafficIntensity >= 1.0) projectedQueuePressure = 'OVERLOAD';
    else if (simTrafficIntensity >= 0.85) projectedQueuePressure = 'HIGH';
    else if (simTrafficIntensity >= 0.6) projectedQueuePressure = 'MODERATE';

    const projectedThroughputFarmers = Math.min(
      expectedArrivals,
      Math.round(simServiceRatePerHour * simOperatingHours)
    );
    const projectedThroughputQuintals = projectedThroughputFarmers * avgQuintalsPerFarmer;

    const waitDiff = projectedWaitMinutes - currentWaitMinutes;
    const farmersDiff = projectedThroughputFarmers - currentThroughputFarmers;
    const quintalsDiff = projectedThroughputQuintals - currentThroughputQuintals;

    return {
      current: {
        counters: currentCounters,
        avgProcessingMinutes: currentProcessingMinutes,
        operatingHours: currentOperatingHours,
        dailyCapacityQuintals: currentDailyCapacityQuintals,
        estimatedWaitMinutes: currentWaitMinutes,
        queuePressure: currentQueuePressure,
        throughputFarmersPerDay: currentThroughputFarmers,
        throughputQuintalsPerDay: currentThroughputQuintals,
      },
      projected: {
        counters: simCounters,
        avgProcessingMinutes: simProcessingMinutes,
        operatingHours: simOperatingHours,
        dailyCapacityQuintals: simCapacityQuintals,
        estimatedWaitMinutes: projectedWaitMinutes,
        queuePressure: projectedQueuePressure,
        throughputFarmersPerDay: projectedThroughputFarmers,
        throughputQuintalsPerDay: projectedThroughputQuintals,
      },
      delta: {
        waitMinutesDiff: waitDiff,
        throughputFarmersDiff: farmersDiff,
        throughputQuintalsDiff: quintalsDiff,
        pressureChange: `${currentQueuePressure} → ${projectedQueuePressure}`,
      },
      explanation:
        waitDiff < 0
          ? `Increasing counters to ${simCounters} and adjusting operational parameters reduces average farmer wait time by ${Math.abs(waitDiff)} minutes and expands daily capacity by ${farmersDiff} farmers.`
          : `Projected scenario shows ${waitDiff === 0 ? 'stable' : 'increased'} wait time. Ensure counter count matches peak arrivals.`,
    };
  }

  /**
   * 3. Farmer No-Show Intelligence
   */
  getNoShowAnalysis() {
    const bookedSlots = 142;
    const arrivedFarmers = 118;
    const completedProcurements = 112;
    const cancelledBookings = 6;
    const noShows = 18;
    const avgQuintalsPerSlot = 20;

    const noShowRatePercent = Math.round((noShows / bookedSlots) * 1000) / 10;
    const unusedCapacityQuintals = noShows * avgQuintalsPerSlot;
    const potentiallyRecoverableSlots = Math.round(noShows * 0.65); // 65% recoverable via dynamic re-allocation

    return {
      bookedSlots,
      arrivedFarmers,
      completedProcurements,
      cancelledBookings,
      noShows,
      noShowRatePercent,
      unusedCapacityQuintals,
      potentiallyRecoverableSlots,
      recommendation:
        '18 booked slots were not utilized today (360 Q unused capacity). Implementing a 90-minute digital SMS confirmation window would safely release an estimated 12 slots for waiting walk-in farmers without risk of overcrowding.',
    };
  }

  /**
   * 4. Queue Rebalancing Recommendations
   */
  getRebalancingRecommendations() {
    return [
      {
        id: 'reb-001',
        sourceCenter: {
          id: 'c3',
          code: 'OD-BAL-003',
          name: 'Basta Block Direct Purchase Depo',
          currentQueue: 48,
          estimatedWaitMinutes: 72,
          utilizationPercent: 88,
          severity: 'CRITICAL' as BottleneckSeverity,
        },
        targetCenter: {
          id: 'c2',
          code: 'OD-BAL-002',
          name: 'Remuna Large Procurement Center',
          currentQueue: 12,
          estimatedWaitMinutes: 18,
          utilizationPercent: 55,
          severity: 'NORMAL' as BottleneckSeverity,
          distanceKm: 8.4,
          supportedCrop: 'Paddy (Common & Grade A)',
          availableCapacitySlots: 38,
        },
        rationale:
          'Remuna Center is 8.4 km away, supports Paddy, has 45% available counter capacity, and current estimated wait is 54 minutes shorter than Basta Depo.',
        projectedImpact: {
          sourceWaitReductionMinutes: 28,
          sourceUtilizationNewPercent: 64,
          farmersRedirectable: 18,
        },
      },
      {
        id: 'reb-002',
        sourceCenter: {
          id: 'c4',
          code: 'OD-BAL-004',
          name: 'Jaleswar Border Mandi Terminal',
          currentQueue: 24,
          estimatedWaitMinutes: 38,
          utilizationPercent: 78,
          severity: 'WATCH' as BottleneckSeverity,
        },
        targetCenter: {
          id: 'c1',
          code: 'OD-BAL-001',
          name: 'Balasore RMC Central Mandi',
          currentQueue: 18,
          estimatedWaitMinutes: 22,
          utilizationPercent: 68,
          severity: 'NORMAL' as BottleneckSeverity,
          distanceKm: 12.1,
          supportedCrop: 'Paddy, Wheat, Ragi',
          availableCapacitySlots: 45,
        },
        rationale:
          'Balasore RMC Central has 4 high-speed weighbridges and 45 available slot windows for afternoon procurement.',
        projectedImpact: {
          sourceWaitReductionMinutes: 12,
          sourceUtilizationNewPercent: 66,
          farmersRedirectable: 10,
        },
      },
    ];
  }

  /**
   * 5. Complete Farmer Procurement Journey Timeline
   */
  getJourneyTimeline(bookingId = 'bk-current') {
    return [
      {
        stepId: 'step-1',
        order: 1,
        title: 'Slot Booked & Schedule Assigned',
        description: 'Farmer self-scheduled procurement slot for Paddy (25 Q) before departing farm.',
        timestamp: '08:15 AM, 02 Sep 2026',
        actor: 'Ramesh Patel (Farmer)',
        actorRole: 'FARMER',
        channel: 'Kisan Pehele PWA',
        status: 'COMPLETED',
        metadata: { slotWindow: '09:00 AM - 09:20 AM', bookingRef: 'KP-20260902-8821' },
      },
      {
        stepId: 'step-2',
        order: 2,
        title: 'Digital Token Issued',
        description: 'Automated queue intelligence assigned sequential token A-102 with geofence arrival buffer.',
        timestamp: '08:16 AM, 02 Sep 2026',
        actor: 'Queue Orchestrator Engine',
        actorRole: 'SYSTEM',
        channel: 'Automated CPaaS SMS',
        status: 'COMPLETED',
        metadata: { tokenNumber: 'A-102', recommendedArrival: '08:45 AM', estimatedWait: '20 mins' },
      },
      {
        stepId: 'step-3',
        order: 3,
        title: 'Farmer Gate Arrival Recorded',
        description: 'Vehicle OD-01-AB-1234 (Tractor-Trolley) arrived at Balasore RMC gate. Security check-in certified.',
        timestamp: '08:48 AM, 02 Sep 2026',
        actor: 'Gate Supervisor (Biometric/QR)',
        actorRole: 'OFFICER',
        channel: 'Gate Scanner #1',
        status: 'COMPLETED',
        metadata: { vehicleNumber: 'OD-01-AB-1234', vehicleType: 'TRACTOR_TROLLEY' },
      },
      {
        stepId: 'step-4',
        order: 4,
        title: 'Queue Position Active',
        description: 'Token moved to Active Yard Queue. Assigned to Weighbridge Bay #2.',
        timestamp: '08:50 AM, 02 Sep 2026',
        actor: 'Yard Management System',
        actorRole: 'SYSTEM',
        channel: 'LED Display & IVR Chime',
        status: 'COMPLETED',
        metadata: { queuePosition: 2, bayAssigned: 'WB-02' },
      },
      {
        stepId: 'step-5',
        order: 5,
        title: 'Token Called to Weighbridge',
        description: 'Officer chime called token A-102 to Weighbridge Counter #2.',
        timestamp: '09:05 AM, 02 Sep 2026',
        actor: 'Rajesh Kumar (Mandi Officer)',
        actorRole: 'OFFICER',
        channel: 'Mandi Operations Console',
        status: 'COMPLETED',
        metadata: { counter: 'Counter 2' },
      },
      {
        stepId: 'step-6',
        order: 6,
        title: 'Digital Weighment Certified',
        description: 'Electronic weighbridge gross weight (28.4 Q) and tare weight (3.4 Q) recorded.',
        timestamp: '09:12 AM, 02 Sep 2026',
        actor: 'Rajesh Kumar (Mandi Officer)',
        actorRole: 'OFFICER',
        channel: 'Calibrated Load Cell (WB-02)',
        status: 'COMPLETED',
        metadata: {
          grossWeightQuintals: 28.4,
          tareWeightQuintals: 3.4,
          netWeightQuintals: 25.0,
          weighbridgeId: 'WB-02',
        },
      },
      {
        stepId: 'step-7',
        order: 7,
        title: 'Quality Assay & Moisture Analysis Approved',
        description: 'Moisture measured at 14.2% (under standard 17% threshold). Certified as FAQ Grade A.',
        timestamp: '09:18 AM, 02 Sep 2026',
        actor: 'S. N. Mohanty (Quality Inspector)',
        actorRole: 'OFFICER',
        channel: 'Digital Grain Moisture Meter',
        status: 'COMPLETED',
        metadata: {
          qualityGrade: 'FAQ_GRADE_A',
          moisturePercent: 14.2,
          foreignMatterPercent: 0.8,
          approvedMspRate: 2183,
        },
      },
      {
        stepId: 'step-8',
        order: 8,
        title: 'Direct Benefit Transfer (PFMS DBT) Initiated',
        description: 'Total MSP payment of ₹54,575 approved and transmitted to PFMS Aadhaar Payment Bridge.',
        timestamp: '09:25 AM, 02 Sep 2026',
        actor: 'PFMS Direct Payment Core',
        actorRole: 'SYSTEM',
        channel: 'PFMS API Gateway',
        status: 'COMPLETED',
        metadata: {
          amountRupees: 54575,
          pfmsBatchId: 'PFMS-OD-BAL-20260902-991',
          bankAccountMasked: 'SBI ****4921',
          paymentStatus: 'PAID',
        },
      },
    ];
  }
}
