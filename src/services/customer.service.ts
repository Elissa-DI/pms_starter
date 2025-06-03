
import apiClient from "@/lib/apiClient";
import type { CarEntry, EntryTicket, ExitBill, ParkingLot } from "@/lib/types";

export const getAvailableParkingSpaces = (): Promise<ParkingLot[]> =>
  apiClient.get("/customer/spaces").then(res => res.data);

export const registerCarEntry = (plateNumber: string, parkingCode: string): Promise<CarEntry> =>
  apiClient.post("/customer/entry", { plateNumber, parkingCode }).then(res => res.data);

export const registerCarExit = (entryId: string): Promise<CarEntry> =>
  apiClient.post(`/customer/exit/${entryId}/bill`).then(res => res.data);

export const getEntryTicket = (entryId: string): Promise<EntryTicket> =>
  apiClient.get(`/customer/entry/${entryId}/ticket`).then(res => {
    const ticket = res.data;
    return {
      entryId,
      id: entryId,
      plateNumber: ticket.plateNumber,
      entryDateTime: ticket.entryDateTime,
      parkingCode: ticket.parkingCode,
      chargingFeePerHour: 0, // Possibly fetched elsewhere
      ticketType: ticket.ticketType,
      parkingName: ticket.parkingName,
      location: ticket.location,
    };
  });

  
  export async function getExitBill(entryId: string): Promise<ExitBill> {
  try {
    const response = await apiClient.get(`/customer/exit/${entryId}/bill`);
    return response.data;
  } catch (error) {
    console.error("Error getting exit bill:", error);
    throw new Error("Failed to retrieve exit bill");
  }
}

