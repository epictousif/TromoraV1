"use client"

import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { getBookings, type Booking } from "../services/bookingsService"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"

export default function MyBookings() {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selected, setSelected] = useState<Booking | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const customerId = useMemo(() => user?.id, [user])

  useEffect(() => {
    let ignore = false
    async function load() {
      if (!customerId || !token) return
      setLoading(true)
      setError(null)
      try {
        const data = await getBookings(customerId)
        if (!ignore) setBookings(data)
      } catch (e: any) {
        if (!ignore) setError(e?.message || "Failed to load bookings")
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    load()
    return () => { ignore = true }
  }, [customerId, token])

  return (
    <div className="max-w-4xl mx-auto px-4 pt-28 pb-12">
      <h1 className="text-2xl font-bold mb-6">Booking History</h1>

      {!token && (
        <div className="p-4 rounded-lg border border-yellow-200 bg-yellow-50 text-yellow-800 mb-4">
          Please login to view your bookings.
        </div>
      )}

      {loading && <div className="text-gray-600">Loading bookings…</div>}
      {error && (
        <div className="p-4 rounded-lg border border-red-200 bg-red-50 text-red-700 mb-4">{error}</div>
      )}

      {!loading && !error && bookings.length === 0 && (
        <div className="rounded-lg border border-gray-200 p-6 text-center">
          <p className="text-gray-700 mb-4">You have no bookings yet.</p>
          <button
            className="inline-flex items-center px-5 py-2.5 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700"
            onClick={() => navigate("/")}
          >
            Book Now
          </button>
        </div>
      )}

      {!loading && !error && bookings.length > 0 && (
        <ul className="space-y-4">
          {bookings.map((b) => (
            <li key={b._id} className="rounded-lg border bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold text-gray-900 truncate">{b.salonName ?? "Salon"}</div>
                  <div className="text-xs text-gray-600">{b.date ?? ""}{b.date && b.time ? " • " : ""}{b.time ?? ""}</div>
                  <div className="text-xs text-gray-600">{b.service ?? (b.services && b.services[0]?.name) ?? "Service"}</div>
                  {b.bookingId && <div className="text-xs text-gray-500 mt-1">ID: {b.bookingId}</div>}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-xs uppercase tracking-wide px-2 py-1 rounded bg-gray-100 text-gray-700">{b.status ?? "pending"}</span>
                  <button
                    className="text-red-600 text-sm underline"
                    onClick={() => { setSelected(b); setShowDetails(true) }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>See the full details of your booking.</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <div className="font-medium">{selected.salonName ?? "Salon"}</div>
                <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">{selected.status ?? "pending"}</span>
              </div>
              {selected.bookingId && (
                <div className="text-xs text-gray-600">Booking ID: {selected.bookingId}</div>
              )}
              <div className="grid gap-1">
                <div className="flex justify-between"><span>Date & Time</span><span>{selected.date ?? "--"}{selected.time ? ` • ${selected.time}` : ""}</span></div>
                <div className="flex justify-between"><span>Services</span><span>{selected.services?.map(s => s.name).join(", ") || selected.service || "--"}</span></div>
                <div className="flex justify-between"><span>Total</span><span>₹{selected.totalPrice ?? (selected.services ? selected.services.reduce((s, it) => s + (it.price||0), 0) : "--")}</span></div>
                {selected.notes && <div className="flex justify-between"><span>Notes</span><span className="text-right max-w-[60%] truncate" title={selected.notes}>{selected.notes}</span></div>}
              </div>
              <div className="text-xs text-gray-600 border-t pt-2">
                Need help? Contact support.
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <button className="inline-flex items-center rounded-md border px-4 py-2">Close</button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

