import { isValidProcurementTransition, ProcurementStatus, VALID_PROCUREMENT_TRANSITIONS } from '@kisan-pehele/shared-types';

describe('Procurement State Machine (Kisan Pehele)', () => {
  it('should allow valid sequential lifecycle transitions', () => {
    expect(isValidProcurementTransition(ProcurementStatus.REGISTERED, ProcurementStatus.SCHEDULED)).toBe(true);
    expect(isValidProcurementTransition(ProcurementStatus.SCHEDULED, ProcurementStatus.ARRIVED)).toBe(true);
    expect(isValidProcurementTransition(ProcurementStatus.ARRIVED, ProcurementStatus.VERIFICATION)).toBe(true);
    expect(isValidProcurementTransition(ProcurementStatus.VERIFICATION, ProcurementStatus.INSPECTION)).toBe(true);
    expect(isValidProcurementTransition(ProcurementStatus.INSPECTION, ProcurementStatus.ACCEPTED)).toBe(true);
    expect(isValidProcurementTransition(ProcurementStatus.ACCEPTED, ProcurementStatus.PROCUREMENT_COMPLETED)).toBe(true);
    expect(isValidProcurementTransition(ProcurementStatus.PROCUREMENT_COMPLETED, ProcurementStatus.PAYMENT_PROCESSING)).toBe(true);
    expect(isValidProcurementTransition(ProcurementStatus.PAYMENT_PROCESSING, ProcurementStatus.PAID)).toBe(true);
  });

  it('should reject invalid / out-of-order state transitions', () => {
    // Cannot skip inspection straight to paid
    expect(isValidProcurementTransition(ProcurementStatus.SCHEDULED, ProcurementStatus.PAID)).toBe(false);
    // Cannot skip verification straight to completed
    expect(isValidProcurementTransition(ProcurementStatus.ARRIVED, ProcurementStatus.PROCUREMENT_COMPLETED)).toBe(false);
    // Cannot transition from terminal PAID state
    expect(isValidProcurementTransition(ProcurementStatus.PAID, ProcurementStatus.SCHEDULED)).toBe(false);
  });

  it('should allow rejection at inspection stage', () => {
    expect(isValidProcurementTransition(ProcurementStatus.INSPECTION, ProcurementStatus.REJECTED)).toBe(true);
    expect(isValidProcurementTransition(ProcurementStatus.REJECTED, ProcurementStatus.ACCEPTED)).toBe(false);
  });
});
