import { apiFetch } from "../lib/api";

export interface BookingDetails {
  id: string;
  userName: string;
  userPhone: string;
  serviceName: string;
  salonName: string;
  salonPhone?: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: string;
  notes?: string;
  salonAddress?: string;
}

export interface CreateBookingRequest {
  salonId: string;
  services: Array<{
    serviceId?: string;
    name: string;
    price: number;
    durationMinutes: number;
  }>;
  appointmentTime: string;
  notes?: string;
}

export interface CreateBookingResponse {
  status: string;
  booking: any;
  confirmation: {
    bookingId: string;
    totalPrice: number;
    appointmentTime: string;
    discountApplied: boolean;
  };
}

export async function createBooking(bookingData: CreateBookingRequest): Promise<CreateBookingResponse> {
  const res = await apiFetch(`/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookingData),
  });
  
  if (!res.ok) {
    const j = await res.json().catch(() => ({} as any));
    throw new Error(j.message || `Booking creation failed (${res.status})`);
  }
  
  return res.json();
}

export async function getBookingDetails(bookingId: string): Promise<BookingDetails> {
  const res = await apiFetch(`/bookings/${bookingId}/details`);
  
  if (!res.ok) {
    const j = await res.json().catch(() => ({} as any));
    throw new Error(j.message || `Failed to fetch booking details (${res.status})`);
  }
  
  const response = await res.json();
  return response.booking;
}

export async function getUserBookings(): Promise<any[]> {
  const res = await apiFetch(`/bookings`);
  
  if (!res.ok) {
    const j = await res.json().catch(() => ({} as any));
    throw new Error(j.message || `Failed to fetch bookings (${res.status})`);
  }
  
  const response = await res.json();
  return response.bookings;
}
