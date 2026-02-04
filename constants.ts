
export const HOURLY_RATE = 500; // RWF
export const CURRENCY = 'RWF';
export const TOTAL_SLOTS = 24;

export const INITIAL_SLOTS = Array.from({ length: TOTAL_SLOTS }, (_, i) => ({
  id: `slot-${i + 1}`,
  number: i + 1,
  status: 'AVAILABLE' as any,
}));
