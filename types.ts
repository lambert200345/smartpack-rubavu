
export enum SlotStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  MAINTENANCE = 'MAINTENANCE'
}

export interface ParkingSlot {
  id: string;
  number: number;
  status: SlotStatus;
}

export interface ParkingSession {
  id: string;
  slotId: string;
  plateNumber: string;
  driverName: string;
  phoneNumber: string;
  entryTime: Date;
  exitTime?: Date;
  durationMinutes?: number;
  totalFee?: number;
  status: 'ACTIVE' | 'COMPLETED';
}

export interface DailyReport {
  date: string;
  totalRevenue: number;
  totalCars: number;
  averageDuration: number;
  peakHour: string;
}
