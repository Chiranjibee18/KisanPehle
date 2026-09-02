// =================================================================
// Kisan Pehele — Operational Intelligence & Transparency Types
// "Pehle pata, phir mandi."
// =================================================================

export type BottleneckSeverity = 'NORMAL' | 'WATCH' | 'WARNING' | 'CRITICAL';

export type BottleneckReasonCode =
  | 'HIGH_QUEUE'
  | 'LOW_PROCESSING_RATE'
  | 'CAPACITY_OVERLOAD'
  | 'RISING_WAIT_TIME'
  | 'HIGH_NO_SHOW_RATE'
  | 'SLOT_UNDERUTILIZATION'
  | 'OPERATIONAL_DELAY';

export interface BottleneckAnalysis {
  centerId: string;
  centerCode: string;
  centerName: string;
  district: string;
  severity: BottleneckSeverity;
  reasons: {
    code: BottleneckReasonCode;
    title: string;
    description: string;
  }[];
  metrics: {
    currentQueue: number;
    activeCounters: number;
    avgProcessingMinutes: number;
    estimatedWaitMinutes: number;
    targetWaitMinutes: number;
    utilizationPercent: number;
    arrivalRatePerHour: number;
    processingRatePerHour: number;
    completedToday: number;
    noShowRatePercent: number;
  };
  trend: 'STABLE' | 'INCREASING' | 'DECREASING';
}

export interface CapacitySimulationInput {
  centerId: string;
  counters: number;
  avgProcessingMinutes: number;
  dailyCapacityQuintals: number;
  operatingHours: number;
  expectedArrivals: number;
  avgQuintalsPerFarmer: number;
}

export interface CapacitySimulationResult {
  current: {
    counters: number;
    avgProcessingMinutes: number;
    operatingHours: number;
    dailyCapacityQuintals: number;
    estimatedWaitMinutes: number;
    queuePressure: 'LOW' | 'MODERATE' | 'HIGH' | 'OVERLOAD';
    throughputFarmersPerDay: number;
    throughputQuintalsPerDay: number;
  };
  projected: {
    counters: number;
    avgProcessingMinutes: number;
    operatingHours: number;
    dailyCapacityQuintals: number;
    estimatedWaitMinutes: number;
    queuePressure: 'LOW' | 'MODERATE' | 'HIGH' | 'OVERLOAD';
    throughputFarmersPerDay: number;
    throughputQuintalsPerDay: number;
  };
  delta: {
    waitMinutesDiff: number;
    throughputFarmersDiff: number;
    throughputQuintalsDiff: number;
    pressureChange: string;
  };
  explanation: string;
}

export interface NoShowMetrics {
  bookedSlots: number;
  arrivedFarmers: number;
  completedProcurements: number;
  cancelledBookings: number;
  noShows: number;
  noShowRatePercent: number;
  unusedCapacityQuintals: number;
  potentiallyRecoverableSlots: number;
  recommendation: string;
}

export interface QueueRebalanceRecommendation {
  id: string;
  sourceCenter: {
    id: string;
    code: string;
    name: string;
    currentQueue: number;
    estimatedWaitMinutes: number;
    utilizationPercent: number;
    severity: BottleneckSeverity;
  };
  targetCenter: {
    id: string;
    code: string;
    name: string;
    currentQueue: number;
    estimatedWaitMinutes: number;
    utilizationPercent: number;
    severity: BottleneckSeverity;
    distanceKm: number;
    supportedCrop: string;
    availableCapacitySlots: number;
  };
  rationale: string;
  projectedImpact: {
    sourceWaitReductionMinutes: number;
    sourceUtilizationNewPercent: number;
    farmersRedirectable: number;
  };
}

export interface ProcurementJourneyStep {
  stepId: string;
  order: number;
  title: string;
  description: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  channel?: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING' | 'FLAGGED';
  metadata?: Record<string, any>;
}

export interface GrievanceRecord {
  id: string;
  grievanceNumber: string;
  farmerId: string;
  farmerName: string;
  farmerMobile: string;
  bookingId: string;
  tokenNumber: string;
  centerId: string;
  centerName: string;
  cropName: string;
  issueType:
    | 'SLOT_ISSUE'
    | 'TOKEN_ISSUE'
    | 'EXCESSIVE_WAITING'
    | 'WEIGHMENT_DISPUTE'
    | 'QUALITY_GRADE_DISPUTE'
    | 'PAYMENT_DELAY'
    | 'OFFICER_CONDUCT';
  description: string;
  status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  resolutionNotes?: string;
  evidencePack: {
    compiledAt: string;
    bookingNumber: string;
    journeyTimeline: ProcurementJourneyStep[];
    weighmentReceipt?: {
      weighbridgeId: string;
      grossWeightQuintals: number;
      tareWeightQuintals: number;
      netWeightQuintals: number;
      moistureContentPercent: number;
      recordedAt: string;
      operatorName: string;
    };
    qualityAssay?: {
      inspectorName: string;
      qualityGrade: string;
      foreignMatterPercent: number;
      damagedGrainsPercent: number;
      approvedMspRatePerQuintal: number;
      assayNotes: string;
      inspectedAt: string;
    };
    paymentStatus?: {
      status: string;
      amountRupees: number;
      transactionRef: string;
      bankAccountMasked: string;
      processedAt: string;
    };
    officerActionsLog: Array<{
      actor: string;
      action: string;
      timestamp: string;
      notes: string;
    }>;
    cryptographicProofHash: string;
  };
}

export interface AuditChainBlock {
  blockNumber: number;
  id: string;
  actorId: string | null;
  actorRole: string;
  action: string;
  entityName: string;
  entityId: string;
  timestamp: string;
  reason: string | null;
  payloadSummary: string;
  previousHash: string;
  currentHash: string;
  isVerified?: boolean;
}

export interface AuditIntegrityReport {
  totalBlocks: number;
  isChainValid: boolean;
  tamperedBlockNumber?: number;
  verifiedAt: string;
  genesisHash: string;
  latestHash: string;
  message: string;
}
