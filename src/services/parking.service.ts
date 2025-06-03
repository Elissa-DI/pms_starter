/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "@/lib/apiClient";
import type { CarEntry, EntryReport, OutgoingReport, User } from "@/lib/types";

export const getAllParkings = async () => {
  const res = await apiClient.get("/admin/parking");
  return res.data;
};

export const createParking = (data: any) => apiClient.post("/admin/parking", data);

export const deleteParking = (code: string) => apiClient.delete(`/admin/parking/${code}`);

export const updateParking = async (parking: {
  code: string;
  parkingName: string;
  nbrAvailableSpaces: number;
  location: string;
  chargingFeePerHour: number;
}) => {
  const response = await fetch(`/api/parkings/${parking.code}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parking),
  });
  if (!response.ok) {
    throw new Error("Failed to update parking");
  }
  return response.json();
};

export const getUsers = async (): Promise<User[]> => {
  const response = await apiClient.get('/users');
  return response.data.users || [];
};

export const getUserById = async (id: string): Promise<User> => {
  const response = await apiClient.get(`/users/${id}`);
  return response.data.user;
};

export const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
  const response = await apiClient.patch(`/users/${id}`, userData);
  return response.data.user;
};

export const deleteUser = async (id: string): Promise<void> => {
  await apiClient.delete(`/users/${id}`);
};

export const getOutgoingCarsReport = (startDate: string, endDate: string): Promise<OutgoingReport> =>
  apiClient
    .get(`/admin/reports/entries?from=${startDate}&to=${endDate}`)
    .then(res => {
      const data: CarEntry[] = res.data;
      return {
        totalOutgoingCars: data.length,
        totalAmountCharged: data.reduce((sum, entry) => sum + entry.chargedAmount, 0),
        details: data,
      };
    });

export const getEnteredCarsReport = (startDate: string, endDate: string): Promise<EntryReport> =>
  apiClient
    .get(`/admin/reports/entries?from=${startDate}&to=${endDate}`)
    .then(res => ({
      totalEntries: res.data.length,
      entries: res.data,
    }));