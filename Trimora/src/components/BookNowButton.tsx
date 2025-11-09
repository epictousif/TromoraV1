import { useState } from "react";
import { createBooking, type CreateBookingInput } from "../services/bookingsService";

type Props = {
  salonId: string;
  services: Array<{ serviceId?: string; name: string; price: number; durationMinutes?: number }>;
  appointmentTime: Date; // JS Date chosen by user
  notes?: string;
  onCreated?: (booking: any) => void;
};

export default function BookNowButton({ salonId, services, appointmentTime, notes, onCreated }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<null | { bookingId: string; totalPrice: number; appointmentTime: string }>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    setConfirmation(null);
    try {
      const payload: CreateBookingInput = {
        salonId,
        services,
        appointmentTime: appointmentTime.toISOString(),
        notes,
      };
      const res = await createBooking(payload);
      setConfirmation(res.confirmation);
      if (onCreated) onCreated(res.booking);
    } catch (e: any) {
      setError(e.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="inline-flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-white font-semibold hover:bg-red-700 disabled:opacity-60"
      >
        {loading ? "Booking..." : "Book Now"}
      </button>
      {error && <div className="text-sm text-red-600">{error}</div>}
      {confirmation && (
        <div className="text-sm rounded-md border border-gray-200 p-3 bg-white shadow-sm">
          <div className="font-semibold text-gray-900">Booking Confirmed</div>
          <div className="text-gray-700">ID: {confirmation.bookingId}</div>
          <div className="text-gray-700">Date/Time: {new Date(confirmation.appointmentTime).toLocaleString()}</div>
          <div className="text-gray-700">Total: ₹{confirmation.totalPrice}</div>
        </div>
      )}
    </div>
  );
}
