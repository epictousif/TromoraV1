import { apiFetch } from "../lib/api";

export type Booking = {
  _id: string;
  bookingId?: string;
  salonId?: string;
  salonName?: string;
  service?: string; // first service name for list view
  services?: Array<{ name: string; price: number; durationMinutes?: number }>; // raw services
  totalPrice?: number;
  appointmentTime?: string; // ISO
  date?: string; // formatted from appointmentTime
  time?: string; // formatted from appointmentTime
  notes?: string;
  status?: string;
  createdAt?: string;
};

export async function getBookings(customerId: string) : Promise<Booking[]> {
  const res = await apiFetch(`/bookings?customerId=${encodeURIComponent(customerId)}`);
  if (res.status === 404) return [];
  if (!res.ok) {
    // Try to parse JSON error, else fallback
    const txt = await res.text();
    // If backend returns HTML (like 404 page), treat as empty list
    if (/<\/?(html|body|pre|head)/i.test(txt)) return [];
    throw new Error(txt || `Failed to load bookings (${res.status})`);
  }
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return [];
  const data = await res.json();
  const raw: any[] = Array.isArray(data) ? data : (data.bookings ?? []);
  // Normalize backend docs to UI Booking type
  const mapped: Booking[] = raw.map((b: any) => {
    const appt = b.appointmentTime ? new Date(b.appointmentTime) : null;
    const firstServiceName = Array.isArray(b.services) && b.services.length > 0 ? b.services[0]?.name : undefined;
    const salonName = b.salonName || b.salon?.name || b.salonId?.name || b.salon_title || undefined;
    return {
      _id: String(b._id || b.id || b.bookingId || Math.random()),
      bookingId: b.bookingId,
      salonId: b.salonId ? String(b.salonId) : undefined,
      salonName: salonName,
      service: firstServiceName,
      services: Array.isArray(b.services) ? b.services.map((s: any) => ({ name: s.name, price: Number(s.price) || 0, durationMinutes: s.durationMinutes })) : undefined,
      totalPrice: typeof b.totalPrice === 'number' ? b.totalPrice : (Array.isArray(b.services) ? b.services.reduce((s: number, it: any) => s + (Number(it.price)||0), 0) : undefined),
      appointmentTime: b.appointmentTime,
      date: appt ? appt.toLocaleDateString() : undefined,
      time: appt ? appt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
      notes: b.notes,
      status: b.status || b.bookingStatus || undefined,
      createdAt: b.createdAt,
    } as Booking;
  });
  return mapped;
}

export type CreateBookingInput = {
  salonId: string;
  services: Array<{ serviceId?: string; name: string; price: number; durationMinutes?: number }>;
  appointmentTime: string; // ISO string
  notes?: string;
};

export async function createBooking(input: CreateBookingInput) {
  const res = await apiFetch(`/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const j = await res.json().catch(() => ({} as any));
    throw new Error(j.message || `Failed to create booking (${res.status})`);
  }
  return res.json();
}

export async function getSalonBookings(salonId: string) {
  const res = await apiFetch(`/owner/bookings/${encodeURIComponent(salonId)}`);
  if (!res.ok) {
    const j = await res.json().catch(() => ({} as any));
    throw new Error(j.message || `Failed to load salon bookings (${res.status})`);
  }
  return res.json();
}
