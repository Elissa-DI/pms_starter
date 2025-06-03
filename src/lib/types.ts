export type UserRole = 'CUSTOMER' | 'ADMIN';

export type User = {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  role: UserRole;
};

export interface CarEntry {
  id: string;          // This is the property name according to the OpenAPI spec
  plateNumber: string;
  parkingCode: string;
  entryDateTime: string;
  exitDateTime?: string | null;
  chargedAmount: number;
}

export interface OutgoingReport {
  totalOutgoingCars: number;
  totalAmountCharged: number;
  details: CarEntry[];
}

export interface EntryReport {
  totalEntries: number;
  entries: CarEntry[];
}

export interface ParkingLot {
  id?: string;
  code: string;
  parkingName: string;
  nbrAvailableSpaces: number;
  totalSpaces?: number;
  location: string;
  chargingFeePerHour: number;
  status?: "AVAILABLE" | "OCCUPIED" | "UNAVAILABLE" | "FULL";
  createdAt?: string;
  updatedAt?: string;
}


export interface EntryTicket {
  entryId: string;     // We'll keep this as entryId for backward compatibility
  id: string;          // Adding the id property to fix the error
  plateNumber: string;
  entryDateTime: string;
  parkingCode: string;
  chargingFeePerHour: number;
  // Additional fields from OpenAPI spec
  ticketType?: string;
  parkingName?: string;
  location?: string;
}

export interface ExitBill {
  entryId: string;
  id: string;          // Adding the id property to fix the error
  plateNumber: string;
  entryDateTime: string;
  exitDateTime: string;
  parkingCode: string;
  durationHours: number;
  chargingFeePerHour: number;
  totalCharged: number;
}

export interface OutgoingReport {
  totalOutgoingCars: number;
  totalAmountCharged: number;
  details: CarEntry[];
}