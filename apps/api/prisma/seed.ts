import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌾 Starting Kisan Pehele Database Seeding ("Pehle pata, phir mandi.")...');

  // Clear existing records in proper dependency order
  await prisma.iVRCallLog.deleteMany();
  await prisma.predictionLog.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.paymentRecord.deleteMany();
  await prisma.inspection.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.procurementCase.deleteMany();
  await prisma.queueEvent.deleteMany();
  await prisma.token.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.procurementSchedule.deleteMany();
  await prisma.centerCropSupport.deleteMany();
  await prisma.procurementCenter.deleteMany();
  await prisma.crop.deleteMany();
  await prisma.trustedHelper.deleteMany();
  await prisma.farmerProfile.deleteMany();
  await prisma.user.deleteMany();

  const defaultPasswordHash = await bcrypt.hash('kisan123', 10);

  // 1. Seed Farmers
  const farmerRamesh = await prisma.user.create({
    data: {
      mobile: '9876543210',
      name: 'Ramesh Patel',
      passwordHash: defaultPasswordHash,
      role: 'FARMER',
      preferredLanguage: 'hi',
      state: 'Odisha',
      district: 'Balasore',
      farmerProfile: {
        create: {
          aadhaarLast4: '8821',
          landHoldingAcres: 3.5,
          kisanCreditCard: 'KCC-OD-7560-9921',
          village: 'Kalyanpur',
          pincode: '756001',
        },
      },
    },
  });

  const farmerSuresh = await prisma.user.create({
    data: {
      mobile: '9876543211',
      name: 'Suresh Jena',
      passwordHash: defaultPasswordHash,
      role: 'FARMER',
      preferredLanguage: 'or',
      state: 'Odisha',
      district: 'Balasore',
      farmerProfile: {
        create: {
          aadhaarLast4: '4192',
          landHoldingAcres: 2.0,
          kisanCreditCard: 'KCC-OD-7560-3342',
          village: 'Remuna Block',
          pincode: '756019',
        },
      },
    },
  });

  const farmerManoj = await prisma.user.create({
    data: {
      mobile: '9876543212',
      name: 'Manoj Mohapatra',
      passwordHash: defaultPasswordHash,
      role: 'FARMER',
      preferredLanguage: 'or',
      state: 'Odisha',
      district: 'Balasore',
      farmerProfile: {
        create: {
          aadhaarLast4: '6743',
          landHoldingAcres: 4.8,
          kisanCreditCard: 'KCC-OD-7560-1188',
          village: 'Basta Block',
          pincode: '756029',
        },
      },
    },
  });

  const farmerPriya = await prisma.user.create({
    data: {
      mobile: '9876543213',
      name: 'Priya Nayak',
      passwordHash: defaultPasswordHash,
      role: 'FARMER',
      preferredLanguage: 'hi',
      state: 'Odisha',
      district: 'Balasore',
      farmerProfile: {
        create: {
          aadhaarLast4: '3319',
          landHoldingAcres: 2.2,
          kisanCreditCard: 'KCC-OD-7560-5512',
          village: 'Jaleswar',
          pincode: '756032',
        },
      },
    },
  });

  const farmerAnanya = await prisma.user.create({
    data: {
      mobile: '9876543214',
      name: 'Ananya Sahoo',
      passwordHash: defaultPasswordHash,
      role: 'FARMER',
      preferredLanguage: 'or',
      state: 'Odisha',
      district: 'Balasore',
      farmerProfile: {
        create: {
          aadhaarLast4: '9901',
          landHoldingAcres: 5.5,
          kisanCreditCard: 'KCC-OD-7560-8804',
          village: 'Soro Rural',
          pincode: '756045',
        },
      },
    },
  });

  const farmerBikram = await prisma.user.create({
    data: {
      mobile: '9876543215',
      name: 'Bikram Rout',
      passwordHash: defaultPasswordHash,
      role: 'FARMER',
      preferredLanguage: 'or',
      state: 'Odisha',
      district: 'Balasore',
      farmerProfile: {
        create: {
          aadhaarLast4: '5562',
          landHoldingAcres: 3.0,
          kisanCreditCard: 'KCC-OD-7560-7733',
          village: 'Nilagiri',
          pincode: '756040',
        },
      },
    },
  });

  // Seed Trusted Helpers for Ramesh Patel
  const helperRahul = await prisma.user.create({
    data: {
      mobile: '9876543220',
      name: 'Rahul Patel',
      passwordHash: defaultPasswordHash,
      role: 'TRUSTED_HELPER',
      preferredLanguage: 'hi',
      state: 'Odisha',
      district: 'Balasore',
    },
  });

  const helperSunita = await prisma.user.create({
    data: {
      mobile: '9876543221',
      name: 'Sunita Patel',
      passwordHash: defaultPasswordHash,
      role: 'TRUSTED_HELPER',
      preferredLanguage: 'hi',
      state: 'Odisha',
      district: 'Balasore',
    },
  });

  await prisma.trustedHelper.create({
    data: {
      farmerId: farmerRamesh.id,
      helperUserId: helperRahul.id,
      relationship: 'Son',
      permissions: 'VIEW_BOOK_AND_TRACK',
      consentGiven: true,
      isRevoked: false,
    },
  });

  await prisma.trustedHelper.create({
    data: {
      farmerId: farmerRamesh.id,
      helperUserId: helperSunita.id,
      relationship: 'Spouse',
      permissions: 'VIEW_AND_BOOK',
      consentGiven: true,
      isRevoked: false,
    },
  });

  // Officers, Admins & Auditor
  const officerRajesh = await prisma.user.create({
    data: {
      mobile: '9876543230',
      name: 'Rajesh Sharma (Procurement Officer)',
      passwordHash: defaultPasswordHash,
      role: 'OFFICER',
      preferredLanguage: 'hi',
      state: 'Odisha',
      district: 'Balasore',
    },
  });

  const adminCollector = await prisma.user.create({
    data: {
      mobile: '9876543240',
      name: 'Dr. Pradeep Mohanty (District Admin)',
      passwordHash: defaultPasswordHash,
      role: 'DISTRICT_ADMIN',
      preferredLanguage: 'en',
      state: 'Odisha',
      district: 'Balasore',
    },
  });

  const auditorArvind = await prisma.user.create({
    data: {
      mobile: '9876543260',
      name: 'Arvind Trivedi (Chief Procurement Auditor)',
      passwordHash: defaultPasswordHash,
      role: 'AUDITOR',
      preferredLanguage: 'en',
      state: 'Odisha',
      district: 'Balasore',
    },
  });

  // 2. Seed Crops
  const cropPaddy = await prisma.crop.create({
    data: {
      code: 'CROP-PAD-01',
      nameEn: 'Paddy (Common)',
      nameHi: 'धान (साधारण)',
      nameRegional: 'ଧାନ (ସାଧାରଣ)',
      category: 'CEREAL',
      minSupportPrice: 2183.0,
    },
  });

  const cropWheat = await prisma.crop.create({
    data: {
      code: 'CROP-WHT-01',
      nameEn: 'Wheat (Sharbati)',
      nameHi: 'गेहूं (शरबती)',
      nameRegional: 'ଗହମ (ଶରବତୀ)',
      category: 'CEREAL',
      minSupportPrice: 2275.0,
    },
  });

  const cropMustard = await prisma.crop.create({
    data: {
      code: 'CROP-MUS-01',
      nameEn: 'Mustard Seed (Sarson)',
      nameHi: 'सरसों',
      nameRegional: 'ସୋରିଷ',
      category: 'OILSEED',
      minSupportPrice: 5650.0,
    },
  });

  const cropChana = await prisma.crop.create({
    data: {
      code: 'CROP-CHN-01',
      nameEn: 'Gram / Chana (Bengal Gram)',
      nameHi: 'चना',
      nameRegional: 'ଚଣା',
      category: 'PULSE',
      minSupportPrice: 5440.0,
    },
  });

  // 3. Seed Procurement Centers
  const centerBalasore = await prisma.procurementCenter.create({
    data: {
      code: 'PC-OD-BAL-001',
      name: 'Balasore Main APMC Mandi',
      district: 'Balasore',
      state: 'Odisha',
      address: 'APMC Market Yard, Station Road, Balasore',
      lat: 21.4934,
      lng: 86.9332,
      operatingHours: '08:00 AM - 05:00 PM',
      maxDailyCapacityQuintals: 600.0,
      currentStatus: 'ACTIVE',
      statusReason: 'Smooth electronic weighbridge queue operations',
      activeCounters: 3,
      contactNumber: '+91 6782-262100',
      officerInChargeId: officerRajesh.id,
    },
  });

  const centerRemuna = await prisma.procurementCenter.create({
    data: {
      code: 'PC-OD-BAL-002',
      name: 'Remuna PACCS Primary Depot',
      district: 'Balasore',
      state: 'Odisha',
      address: 'Remuna Bazaar Chowk, Balasore',
      lat: 21.5245,
      lng: 86.8712,
      operatingHours: '08:30 AM - 04:30 PM',
      maxDailyCapacityQuintals: 350.0,
      currentStatus: 'ACTIVE',
      statusReason: 'Fast-track queue active',
      activeCounters: 2,
      contactNumber: '+91 6782-271040',
    },
  });

  const centerNilagiri = await prisma.procurementCenter.create({
    data: {
      code: 'PC-OD-BAL-003',
      name: 'Nilagiri Sub-Divisional Mandi',
      district: 'Balasore',
      state: 'Odisha',
      address: 'Mandi Road, Nilagiri',
      lat: 21.4589,
      lng: 86.7621,
      operatingHours: '09:00 AM - 04:00 PM',
      maxDailyCapacityQuintals: 250.0,
      currentStatus: 'LIMITED_CAPACITY',
      statusReason: 'High grain inflow, slot allocation capped at 75%',
      activeCounters: 2,
      contactNumber: '+91 6782-233150',
    },
  });

  const centerSoro = await prisma.procurementCenter.create({
    data: {
      code: 'PC-OD-BAL-004',
      name: 'Soro Regional Procurement Hub',
      district: 'Balasore',
      state: 'Odisha',
      address: 'NH-16 Bypass, Soro, Balasore',
      lat: 21.2890,
      lng: 86.6890,
      operatingHours: '08:00 AM - 05:00 PM',
      maxDailyCapacityQuintals: 500.0,
      currentStatus: 'ACTIVE',
      statusReason: 'Full operational capacity',
      activeCounters: 3,
      contactNumber: '+91 6782-244220',
    },
  });

  // Link Crop Support for all centers
  for (const center of [centerBalasore, centerRemuna, centerNilagiri, centerSoro]) {
    for (const crop of [cropPaddy, cropWheat, cropMustard, cropChana]) {
      await prisma.centerCropSupport.create({
        data: {
          centerId: center.id,
          cropId: crop.id,
          isActive: true,
        },
      });
    }
  }

  // 4. Seed Today's Procurement Schedule
  const todayStr = new Date().toISOString().split('T')[0];
  const scheduleTodayBalasore = await prisma.procurementSchedule.create({
    data: {
      centerId: centerBalasore.id,
      cropId: cropPaddy.id,
      date: todayStr,
      startTime: '08:00',
      endTime: '17:00',
      totalSlots: 36,
      slotDurationMinutes: 15,
      capacityPerSlotQuintals: 30.0,
      status: 'PUBLISHED',
    },
  });

  // 5. Seed Real-time Queue and Rich Incoming Tokens
  // Token 1: Completed & DBT Paid
  const booking1 = await prisma.booking.create({
    data: {
      bookingNumber: 'BK-BAL-2026-001',
      idempotencyKey: 'idem-key-001',
      farmerId: farmerSuresh.id,
      centerId: centerBalasore.id,
      scheduleId: scheduleTodayBalasore.id,
      cropId: cropPaddy.id,
      estimatedQuantityQuintals: 22.5,
      slotTime: '08:00 AM - 08:20 AM',
      status: 'COMPLETED',
      vehicleType: 'TRACTOR_TROLLEY',
      vehicleNumber: 'OD-01-M-5544',
    },
  });

  const token1 = await prisma.token.create({
    data: {
      tokenNumber: 'A-101',
      bookingId: booking1.id,
      centerId: centerBalasore.id,
      sequenceNumber: 1,
      status: 'COMPLETED',
      recommendedArrival: '07:50 AM',
      estimatedWaitMinutes: 0,
      calledAt: new Date(Date.now() - 7200000),
      servingAt: new Date(Date.now() - 6000000),
      completedAt: new Date(Date.now() - 3600000),
    },
  });

  const case1 = await prisma.procurementCase.create({
    data: {
      caseNumber: 'PC-CASE-2026-001',
      bookingId: booking1.id,
      farmerId: farmerSuresh.id,
      centerId: centerBalasore.id,
      cropId: cropPaddy.id,
      currentStatus: 'PAID',
    },
  });

  await prisma.verification.create({
    data: {
      procurementCaseId: case1.id,
      officerId: officerRajesh.id,
      isVerified: true,
      verificationNotes: 'Farmer Aadhaar, KCC & Land Record verified successfully.',
      farmerPhotoVerified: true,
      landRecordMatched: true,
    },
  });

  await prisma.inspection.create({
    data: {
      procurementCaseId: case1.id,
      officerId: officerRajesh.id,
      measuredMoisturePercent: 14.2,
      foreignMatterPercent: 0.6,
      qualityGrade: 'GRADE_A',
      weighedQuantityQuintals: 22.5,
      deductionQuintals: 0.0,
      netProcuredQuantityQuintals: 22.5,
      inspectionNotes: 'Clean grain sample, well within standard moisture threshold (<17%).',
    },
  });

  await prisma.paymentRecord.create({
    data: {
      procurementCaseId: case1.id,
      mspRatePerQuintal: 2183.0,
      grossAmountRupees: 49117.50,
      deductionsRupees: 0.0,
      netPayableRupees: 49117.50,
      paymentStatus: 'PAID',
      transactionReference: 'DBT-PFMS-OD20260824-99120',
      bankAccountMasked: 'XXXX-XXXX-4192',
      ifscMasked: 'SBIN0001234',
      processedAt: new Date(),
    },
  });

  // Token 2: Currently Serving at Weighbridge
  const booking2 = await prisma.booking.create({
    data: {
      bookingNumber: 'BK-BAL-2026-002',
      farmerId: farmerSuresh.id,
      centerId: centerBalasore.id,
      scheduleId: scheduleTodayBalasore.id,
      cropId: cropPaddy.id,
      estimatedQuantityQuintals: 22.5,
      slotTime: '08:30 AM - 08:50 AM',
      status: 'CONFIRMED',
      vehicleType: 'TRACTOR_TROLLEY',
      vehicleNumber: 'OD-01-N-1122',
    },
  });

  const token2 = await prisma.token.create({
    data: {
      tokenNumber: 'A-102',
      bookingId: booking2.id,
      centerId: centerBalasore.id,
      sequenceNumber: 2,
      status: 'SERVING',
      recommendedArrival: '08:20 AM',
      estimatedWaitMinutes: 5,
      calledAt: new Date(Date.now() - 900000),
      servingAt: new Date(Date.now() - 300000),
    },
  });

  const case2 = await prisma.procurementCase.create({
    data: {
      caseNumber: 'PC-CASE-2026-002',
      bookingId: booking2.id,
      farmerId: farmerSuresh.id,
      centerId: centerBalasore.id,
      cropId: cropPaddy.id,
      currentStatus: 'INSPECTION',
    },
  });

  await prisma.verification.create({
    data: {
      procurementCaseId: case2.id,
      officerId: officerRajesh.id,
      isVerified: true,
      verificationNotes: 'Gate entry verified. Weighbridge pass issued.',
    },
  });

  // Token 3: ARRIVED (Gate pass scanned, waiting for verification)
  const booking3 = await prisma.booking.create({
    data: {
      bookingNumber: 'BK-BAL-2026-003',
      farmerId: farmerManoj.id,
      centerId: centerBalasore.id,
      scheduleId: scheduleTodayBalasore.id,
      cropId: cropWheat.id,
      estimatedQuantityQuintals: 30.0,
      slotTime: '08:50 AM - 09:10 AM',
      status: 'CONFIRMED',
      vehicleType: 'MINI_TRUCK',
      vehicleNumber: 'OD-01-P-8899',
    },
  });

  const token3 = await prisma.token.create({
    data: {
      tokenNumber: 'A-103',
      bookingId: booking3.id,
      centerId: centerBalasore.id,
      sequenceNumber: 3,
      status: 'ARRIVED',
      recommendedArrival: '08:40 AM',
      estimatedWaitMinutes: 10,
    },
  });

  const case3 = await prisma.procurementCase.create({
    data: {
      caseNumber: 'PC-CASE-2026-003',
      bookingId: booking3.id,
      farmerId: farmerManoj.id,
      centerId: centerBalasore.id,
      cropId: cropWheat.id,
      currentStatus: 'ARRIVED',
    },
  });

  // Token 4: CALLED (Called to Counter 2 for verification)
  const booking4 = await prisma.booking.create({
    data: {
      bookingNumber: 'BK-BAL-2026-004',
      farmerId: farmerPriya.id,
      centerId: centerBalasore.id,
      scheduleId: scheduleTodayBalasore.id,
      cropId: cropMustard.id,
      estimatedQuantityQuintals: 15.0,
      slotTime: '09:10 AM - 09:30 AM',
      status: 'CONFIRMED',
      vehicleType: 'TRACTOR_TROLLEY',
      vehicleNumber: 'OD-01-Q-3344',
    },
  });

  const token4 = await prisma.token.create({
    data: {
      tokenNumber: 'A-104',
      bookingId: booking4.id,
      centerId: centerBalasore.id,
      sequenceNumber: 4,
      status: 'CALLED',
      recommendedArrival: '09:00 AM',
      estimatedWaitMinutes: 15,
      calledAt: new Date(Date.now() - 120000),
    },
  });

  const case4 = await prisma.procurementCase.create({
    data: {
      caseNumber: 'PC-CASE-2026-004',
      bookingId: booking4.id,
      farmerId: farmerPriya.id,
      centerId: centerBalasore.id,
      cropId: cropMustard.id,
      currentStatus: 'VERIFICATION',
    },
  });

  // Token 5: ISSUED (En route to mandi)
  const booking5 = await prisma.booking.create({
    data: {
      bookingNumber: 'BK-BAL-2026-005',
      farmerId: farmerAnanya.id,
      centerId: centerBalasore.id,
      scheduleId: scheduleTodayBalasore.id,
      cropId: cropPaddy.id,
      estimatedQuantityQuintals: 40.0,
      slotTime: '09:30 AM - 09:50 AM',
      status: 'CONFIRMED',
      vehicleType: 'TRACTOR_TROLLEY',
      vehicleNumber: 'OD-01-R-7788',
    },
  });

  const token5 = await prisma.token.create({
    data: {
      tokenNumber: 'A-105',
      bookingId: booking5.id,
      centerId: centerBalasore.id,
      sequenceNumber: 5,
      status: 'ISSUED',
      recommendedArrival: '09:15 AM',
      estimatedWaitMinutes: 25,
    },
  });

  const case5 = await prisma.procurementCase.create({
    data: {
      caseNumber: 'PC-CASE-2026-005',
      bookingId: booking5.id,
      farmerId: farmerAnanya.id,
      centerId: centerBalasore.id,
      cropId: cropPaddy.id,
      currentStatus: 'SCHEDULED',
    },
  });

  // Token 6: ISSUED (Farmer Ramesh Patel's active token A-142)
  const bookingRamesh = await prisma.booking.create({
    data: {
      bookingNumber: 'BK-BAL-2026-142',
      idempotencyKey: 'idem-ramesh-001',
      farmerId: farmerRamesh.id,
      centerId: centerBalasore.id,
      scheduleId: scheduleTodayBalasore.id,
      cropId: cropPaddy.id,
      estimatedQuantityQuintals: 25.0,
      slotTime: '09:50 AM - 10:10 AM',
      status: 'CONFIRMED',
      vehicleType: 'TRACTOR_TROLLEY',
      vehicleNumber: 'OD-01-AB-1234',
    },
  });

  const tokenRamesh = await prisma.token.create({
    data: {
      tokenNumber: 'A-142',
      bookingId: bookingRamesh.id,
      centerId: centerBalasore.id,
      sequenceNumber: 6,
      status: 'ISSUED',
      recommendedArrival: '09:35 AM',
      estimatedWaitMinutes: 35,
    },
  });

  const caseRamesh = await prisma.procurementCase.create({
    data: {
      caseNumber: 'PC-CASE-2026-142',
      bookingId: bookingRamesh.id,
      farmerId: farmerRamesh.id,
      centerId: centerBalasore.id,
      cropId: cropPaddy.id,
      currentStatus: 'SCHEDULED',
    },
  });

  // Token 7: ISSUED (Bikram Rout)
  const booking7 = await prisma.booking.create({
    data: {
      bookingNumber: 'BK-BAL-2026-007',
      farmerId: farmerBikram.id,
      centerId: centerBalasore.id,
      scheduleId: scheduleTodayBalasore.id,
      cropId: cropChana.id,
      estimatedQuantityQuintals: 20.0,
      slotTime: '10:10 AM - 10:30 AM',
      status: 'CONFIRMED',
      vehicleType: 'BULLOCK_CART',
      vehicleNumber: 'CART-OD-01-99',
    },
  });

  const token7 = await prisma.token.create({
    data: {
      tokenNumber: 'A-107',
      bookingId: booking7.id,
      centerId: centerBalasore.id,
      sequenceNumber: 7,
      status: 'ISSUED',
      recommendedArrival: '09:55 AM',
      estimatedWaitMinutes: 45,
    },
  });

  const case7 = await prisma.procurementCase.create({
    data: {
      caseNumber: 'PC-CASE-2026-007',
      bookingId: booking7.id,
      farmerId: farmerBikram.id,
      centerId: centerBalasore.id,
      cropId: cropChana.id,
      currentStatus: 'SCHEDULED',
    },
  });

  // Notifications for Ramesh & others
  await prisma.notification.createMany({
    data: [
      {
        userId: farmerRamesh.id,
        channel: 'SMS',
        title: 'Slot Confirmed: Token A-142',
        message: 'Namaskar Ramesh Patel ji, your slot at Balasore Main APMC Mandi is confirmed. Token: A-142. Arrive at 09:35 AM. Pehle pata, phir mandi.',
        language: 'hi',
        deliveryStatus: 'DELIVERED',
      },
      {
        userId: farmerRamesh.id,
        channel: 'SMS',
        title: 'Trusted Helper Authorized: Rahul Patel',
        message: 'Your son Rahul Patel (+91-9876543220) has been authorized as your trusted helper for crop drop-off. DBT payment remains locked to your Aadhaar-linked bank account.',
        language: 'hi',
        deliveryStatus: 'DELIVERED',
      },
      {
        userId: farmerManoj.id,
        channel: 'SMS',
        title: 'Gate Pass Validated: Token A-103',
        message: 'Gate entry pass recorded. Please proceed to Electronic Weighbridge #2.',
        language: 'or',
        deliveryStatus: 'DELIVERED',
      },
      {
        userId: farmerSuresh.id,
        channel: 'SMS',
        title: 'DBT Payment Credited ₹49,117.50',
        message: 'Govt of Odisha: ₹49,117.50 credited via PFMS DBT for 22.5 Q Paddy at Balasore APMC. Ref: DBT-PFMS-OD20260824-99120.',
        language: 'or',
        deliveryStatus: 'DELIVERED',
      },
    ],
  });

  // 6. Seed Rich Immutable Statutory Audit Logs
  const sampleAuditLogs = [
    {
      actorId: officerRajesh.id,
      actorRole: 'OFFICER',
      action: 'PFMS_DBT_PAYMENT_SETTLED',
      entityName: 'ProcurementCase',
      entityId: case1.id,
      previousStateJson: JSON.stringify({ status: 'ACCEPTED', gross: 49117.50 }),
      newStateJson: JSON.stringify({ status: 'PAID', utr: 'DBT-PFMS-OD20260824-99120', amount: 49117.50 }),
      reason: '100% PFMS direct DBT transfer executed to farmer Aadhaar-linked bank account.',
      ipAddress: '192.168.1.45',
    },
    {
      actorId: officerRajesh.id,
      actorRole: 'OFFICER',
      action: 'QUALITY_INSPECTION_RECORDED',
      entityName: 'Inspection',
      entityId: case1.id,
      previousStateJson: JSON.stringify({ status: 'VERIFICATION' }),
      newStateJson: JSON.stringify({ measuredMoisturePercent: 14.2, foreignMatterPercent: 0.6, qualityGrade: 'GRADE_A', isAccepted: true }),
      reason: 'Standard moisture sensor test passed (<17%). Electronic weighbridge weight recorded.',
      ipAddress: '192.168.1.45',
    },
    {
      actorId: officerRajesh.id,
      actorRole: 'OFFICER',
      action: 'FARMER_RECORD_PHYSICALLY_VERIFIED',
      entityName: 'Verification',
      entityId: case1.id,
      previousStateJson: JSON.stringify({ isVerified: false }),
      newStateJson: JSON.stringify({ isVerified: true, aadhaarMatched: true, landQuotaAcres: 2.0 }),
      reason: 'Farmer physical biometric and land records matched against revenue database.',
      ipAddress: '192.168.1.45',
    },
    {
      actorId: officerRajesh.id,
      actorRole: 'OFFICER',
      action: 'GATE_ENTRY_RECORDED',
      entityName: 'Token',
      entityId: token3.id,
      previousStateJson: JSON.stringify({ status: 'ISSUED' }),
      newStateJson: JSON.stringify({ status: 'ARRIVED', vehicleNumber: 'OD-01-P-8899', arrivalTime: '08:40 AM' }),
      reason: 'QR Code scanned at Mandi Security Gate #1.',
      ipAddress: '192.168.1.12',
    },
    {
      actorId: officerRajesh.id,
      actorRole: 'OFFICER',
      action: 'TOKEN_CALLED_TO_COUNTER',
      entityName: 'Token',
      entityId: token4.id,
      previousStateJson: JSON.stringify({ status: 'ARRIVED' }),
      newStateJson: JSON.stringify({ status: 'CALLED', counterNumber: 2 }),
      reason: 'Automated queue algorithm summoned next farmer to Counter 2.',
      ipAddress: '192.168.1.20',
    },
    {
      actorId: farmerRamesh.id,
      actorRole: 'FARMER',
      action: 'TRUSTED_HELPER_ADDED',
      entityName: 'TrustedHelper',
      entityId: helperRahul.id,
      previousStateJson: JSON.stringify({ helperCount: 0 }),
      newStateJson: JSON.stringify({ helperName: 'Rahul Patel', relationship: 'Son', permissions: 'VIEW_BOOK_AND_TRACK' }),
      reason: 'Farmer delegated helper permissions with explicit consent under SIH26032 guidelines.',
      ipAddress: '192.168.1.101',
    },
    {
      actorId: farmerRamesh.id,
      actorRole: 'FARMER',
      action: 'SLOT_BOOKING_CREATED',
      entityName: 'Booking',
      entityId: bookingRamesh.id,
      previousStateJson: JSON.stringify({}),
      newStateJson: JSON.stringify({ bookingNumber: 'BK-BAL-2026-142', tokenNumber: 'A-142', crop: 'Paddy', qtyQuintals: 25.0 }),
      reason: 'AI capacity reservation confirmed for 09:50 AM slot at Balasore APMC.',
      ipAddress: '192.168.1.101',
    },
    {
      actorId: adminCollector.id,
      actorRole: 'DISTRICT_ADMIN',
      action: 'CENTER_STATUS_UPDATED',
      entityName: 'ProcurementCenter',
      entityId: centerBalasore.id,
      previousStateJson: JSON.stringify({ activeCounters: 2 }),
      newStateJson: JSON.stringify({ activeCounters: 3, status: 'ACTIVE', reason: 'Fast-track weighbridge active' }),
      reason: 'District collector scaled weighbridge capacity to prevent farmer queuing bottlenecks.',
      ipAddress: '192.168.1.5',
    },
    {
      actorId: auditorArvind.id,
      actorRole: 'AUDITOR',
      action: 'STATUTORY_COMPLIANCE_AUDIT_VERIFIED',
      entityName: 'ProcurementCase',
      entityId: case1.id,
      previousStateJson: JSON.stringify({ auditStatus: 'PENDING_REVIEW' }),
      newStateJson: JSON.stringify({ auditStatus: 'COMPLIANT', signature: 'SHA256-VALID-0x89A4B', discrepancy: '0.00%' }),
      reason: 'Automated cross-reconciliation between MSP rate, weighment slip, and bank UTR.',
      ipAddress: '192.168.1.88',
    },
    {
      actorId: auditorArvind.id,
      actorRole: 'AUDITOR',
      action: 'TAMPER_EVIDENT_HASH_VERIFIED',
      entityName: 'Inspection',
      entityId: case1.id,
      previousStateJson: JSON.stringify({}),
      newStateJson: JSON.stringify({ hashMatch: true, algorithm: 'SHA-256' }),
      reason: 'Cryptographic hash verified against central audit registry.',
      ipAddress: '192.168.1.88',
    },
  ];

  for (const log of sampleAuditLogs) {
    await prisma.auditLog.create({ data: log });
  }

  console.log('✅ Kisan Pehele Database Seeding Completed Successfully!');
  console.log('🌾 Demo Credentials:');
  console.log('   Farmer Ramesh: 9876543210 / kisan123 (Token: A-142)');
  console.log('   Officer Rajesh: 9876543230 / kisan123 (Balasore Center)');
  console.log('   Admin Collector: 9876543240 / kisan123 (District Balasore)');
  console.log('   Auditor Arvind: 9876543260 / kisan123 (Audit Trail)');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
