import { useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router"
import { createBooking } from "../../services/bookingService"
import { useToast } from "./ui/use-toast"
import { getCurrentUser } from "../../services/authService"
import { SalonService } from "@/SalonFinder/services/salon-service"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { createPayment, verifyPayment, loadRazorpayScript } from "../../services/paymentService"
import type { RazorpayOptions } from "../../services/paymentService"

// Types for state passed via navigate
interface ServiceItem {
  serviceId?: string
  name: string
  price: number
  durationMinutes?: number
}

interface CheckoutState {
  salonId: string
  salonName?: string
  salonImageUrl?: string
  services: ServiceItem[]
  appointmentTimeISO: string
  notes?: string
}

export function BookingCheckout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const state = (location.state || {}) as Partial<CheckoutState>

  const [fullName, setFullName] = useState<string>(() => {
    try {
      const u = localStorage.getItem("trimora_user")
      if (u) return JSON.parse(u).name || ""
    } catch {}
    return ""
  })
  const [email, setEmail] = useState<string>(() => {
    try {
      const u = localStorage.getItem("trimora_user")
      if (u) return JSON.parse(u).email || ""
    } catch {}
    return ""
  })
  const [phone, setPhone] = useState<string>(() => {
    try {
      const u = localStorage.getItem("trimora_user")
      if (u) {
        const ju = JSON.parse(u)
        return (
          ju.phone ||
          ju.mobile ||
          ju.mobileNumber ||
          ju.phoneNumber ||
          ju.contactNumber ||
          ""
        )
      }
    } catch {}
    return ""
  })
  const [submitting, setSubmitting] = useState(false)
  const [serverSalonName, setServerSalonName] = useState<string>("")
  const [serverSalonImage, setServerSalonImage] = useState<string>("")
  const [serverSalonRating, setServerSalonRating] = useState<number | null>(null)
  const [serverSalonAddress, setServerSalonAddress] = useState<string>("")
  const [showPayment, setShowPayment] = useState(false)
  const [dialogStage, setDialogStage] = useState<"payment" | "confirmed">("payment")
  const [createdBooking, setCreatedBooking] = useState<any | null>(null)
  const [paidLocally, setPaidLocally] = useState<boolean>(false)
  const [paymentLoading, setPaymentLoading] = useState<boolean>(false)
  const [currentPayment, setCurrentPayment] = useState<any | null>(null)

  const isValidPhone = (p: string) => /^\d{10}$/.test((p || "").trim())

  // Prefill from backend (user + salon)
  useEffect(() => {
    let isMounted = true
    ;(async () => {
      try {
        // Fetch current user details
        const me = await getCurrentUser().catch(() => null as any)
        if (isMounted && me) {
          const name = me.name || me.user?.name
          const emailAddr = me.email || me.user?.email
          const phoneNo = me.phoneNumber || me.user?.phoneNumber
          if (name) setFullName((prev) => prev || name)
          if (emailAddr) setEmail((prev) => prev || emailAddr)
          if (phoneNo) setPhone((prev) => prev || String(phoneNo))
        }

        // Fetch salon details by ID
        if (state.salonId) {
          const salon = await SalonService.getSalonById(state.salonId)
          if (isMounted && salon) {
            setServerSalonName(String((salon as any)?.name || ""))
            const img = (salon as any)?.image?.[0] || (salon as any)?.images?.[0] || ""
            setServerSalonImage(typeof img === "string" ? img : (img?.url || ""))
            // Try multiple possible paths for rating
            const rRaw =
              (salon as any)?.rating ??
              (salon as any)?.averageRating ??
              (salon as any)?.avgRating ??
              (salon as any)?.ratings?.average ??
              (salon as any)?.reviewsAverage ??
              null
            const rNum = typeof rRaw === "number" ? rRaw : Number(rRaw)
            if (!Number.isNaN(rNum) && Number.isFinite(rNum)) {
              setServerSalonRating(Math.max(0, Math.min(5, Math.round(rNum * 10) / 10)))
            }
            const addrParts = [
              (salon as any)?.address,
              (salon as any)?.location,
              (salon as any)?.city,
              (salon as any)?.state,
              (salon as any)?.pincode,
            ].filter(Boolean)
            setServerSalonAddress(addrParts.join(", "))
          }
        }
      } catch {}
    })()
    return () => { isMounted = false }
  }, [state.salonId])

  const total = useMemo(() => (state.services || []).reduce((s, it) => s + (Number(it.price) || 0), 0), [state.services])

  if (!state.salonId || !state.appointmentTimeISO || !state.services || state.services.length === 0) {
    return (
      <div className="container mx-auto max-w-5xl py-8">
        <div className="rounded-md border p-6 bg-white shadow-sm">
          <div className="text-lg font-semibold">Checkout</div>
          <p className="mt-2 text-sm text-gray-600">Checkout details are missing. Please start your booking again.</p>
          <button className="mt-4 inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-white" onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </div>
    )
  }

  const onConfirm = async () => {
    // Validate first, then open payment slide
    if (!fullName || !email) {
      toast({ title: "Enter your details", description: "Full name and email are required", variant: "destructive" as any })
      return
    }
    if (!isValidPhone(phone)) {
      toast({ title: "Invalid mobile number", description: "Enter a valid 10-digit mobile number.", variant: "destructive" as any })
      return
    }
    setShowPayment(true)
  }

  const onPayNow = async () => {
    try {
      setPaymentLoading(true)
      setSubmitting(true)

      // First create the booking
      const bookingRes = await createBooking({
        salonId: state.salonId!,
        services: state.services!.map(s => ({
          ...s,
          durationMinutes: s.durationMinutes || 0
        })),
        appointmentTime: state.appointmentTimeISO!,
        notes: state.notes,
      })

      const booking = (bookingRes as any)?.booking || bookingRes
      setCreatedBooking(booking)

      // Create payment order
      const paymentRes = await createPayment({
        bookingId: booking._id || booking.id,
        paymentMethod: 'razorpay'
      })

      setCurrentPayment(paymentRes.payment)

      // Load Razorpay script
      const isRazorpayLoaded = await loadRazorpayScript()
      if (!isRazorpayLoaded) {
        throw new Error('Failed to load Razorpay SDK')
      }

      // Configure Razorpay options
      const options: RazorpayOptions = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_your_key_id',
        // Use order amount from backend (already in paise) to avoid mismatch
        amount: (paymentRes as any)?.razorpayOrder?.amount || (paymentRes.payment.amount * 100),
        currency: paymentRes.payment.currency,
        name: displaySalonName,
        description: `Booking at ${displaySalonName}`,
        order_id: paymentRes.payment.razorpayOrderId!,
        handler: async (response: any) => {
          try {
            // Verify payment
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              paymentId: paymentRes.payment.id
            })

            setDialogStage("confirmed")
            setPaidLocally(true)
            toast({ title: "Payment successful", description: "Your booking is confirmed." })
          } catch (error: any) {
            toast({ title: "Payment verification failed", description: error.message, variant: "destructive" as any })
          }
        },
        prefill: {
          name: fullName,
          email: email,
          contact: phone
        },
        theme: {
          color: '#dc2626' // Red theme matching your app
        },
        modal: {
          ondismiss: () => {
            toast({ title: "Payment cancelled", description: "You can try again or choose pay on visit.", variant: "destructive" as any })
          }
        }
      }

      // Initialize Razorpay
      const rzp = new (window as any).Razorpay(options)
      // Handle gateway failure with better UX
      if (typeof rzp.on === 'function') {
        rzp.on('payment.failed', (resp: any) => {
          const reason = resp?.error?.description || resp?.error?.reason || 'Payment was not completed.'
          toast({ title: 'Payment failed', description: reason, variant: 'destructive' as any })
        })
      }
      rzp.open()

    } catch (e: any) {
      toast({ title: "Payment failed", description: e?.message || "Try again.", variant: "destructive" as any })
    } finally {
      setSubmitting(false)
      setPaymentLoading(false)
    }
  }

  const onPayOnVisit = async () => {
    try {
      setSubmitting(true)
      const res = await createBooking({
        salonId: state.salonId!,
        services: state.services!.map(s => ({
          ...s,
          durationMinutes: s.durationMinutes || 0
        })),
        appointmentTime: state.appointmentTimeISO!,
        notes: state.notes ? `${state.notes} | Payment: Pay on visit` : `Payment: Pay on visit`,
      })
      setCreatedBooking((res as any)?.booking || res)
      setDialogStage("confirmed")
      toast({ title: "Booking confirmed", description: "Pay at salon during your visit." })
      setPaidLocally(false)
    } catch (e: any) {
      toast({ title: "Booking failed", description: e?.message || "Try again.", variant: "destructive" as any })
    } finally {
      setSubmitting(false)
    }
  }

  const displaySalonName = state.salonName || serverSalonName || "Salon"
  const displaySalonImage = state.salonImageUrl || serverSalonImage || ""
  const displaySalonRating = serverSalonRating != null ? `${serverSalonRating.toFixed(1)}★` : "Rating: N/A"
  const displaySalonAddress = serverSalonAddress

  return (
    <div className="container mx-auto max-w-6xl mt-16 md:mt-24 py-6 grid grid-cols-1 gap-6 md:grid-cols-3">
      <div className="md:col-span-2">
        <div className="rounded-md border bg-white p-6 shadow-sm">
          <div className="mb-1 text-lg font-semibold">1. Enter your details</div>
          <div className="mb-4 text-sm text-gray-600">Booking at: <span className="font-medium text-gray-900">{displaySalonName}</span></div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Full Name</label>
              <input className="h-10 rounded-md border px-3" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Email Address</label>
              <input className="h-10 rounded-md border px-3" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <label className="text-sm font-medium">Mobile Number</label>
              <input
                type="tel"
                className={"h-10 rounded-md border px-3"}
                placeholder="e.g. 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                inputMode="numeric"
                maxLength={10}
                pattern="\\d{10}"
                autoComplete="tel"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button className="inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-white" disabled={submitting} onClick={onConfirm}>
              {submitting ? "Confirming..." : "Confirm Booking"}
            </button>
          </div>
        </div>
      </div>

      <div className="md:col-span-1">
        <div className="rounded-md border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            {displaySalonImage && <img src={displaySalonImage} alt={displaySalonName} className="h-14 w-14 rounded object-cover" />}
            <div>
              <div className="font-semibold text-gray-900">{displaySalonName}</div>
              <div className="text-xs text-gray-600">{displaySalonRating}</div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {(state.services || []).map((s, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>{s.name}</span>
                <span>₹{Number(s.price || 0)}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 border-t pt-3 text-sm">
            <div className="flex justify-between">
              <span>Date & time</span>
              <span>{new Date(state.appointmentTimeISO!).toLocaleString()}</span>
            </div>
          </div>
          <div className="mt-3 border-t pt-3 text-base font-semibold flex justify-between">
            <span>Payable Amount</span>
            <span>₹{total}</span>
          </div>
        </div>
      </div>

      {/* Payment Slide/Modal */}
      <Dialog open={showPayment} onOpenChange={(open) => { setShowPayment(open); if (!open) { setDialogStage("payment"); setCreatedBooking(null) } }}>
        <DialogContent className="sm:max-w-md">
          {dialogStage === "payment" ? (
            <>
              <DialogHeader>
                <DialogTitle>Choose payment option</DialogTitle>
                <DialogDescription>
                  Select how you want to pay for your booking at {displaySalonName}.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-2 space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Date & time</span>
                  <span>{new Date(state.appointmentTimeISO!).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base font-semibold">
                  <span>Amount payable</span>
                  <span>₹{total}</span>
                </div>
              </div>
              <div className="mt-4 grid gap-2">
                <button
                  className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-white disabled:opacity-60"
                  onClick={onPayOnVisit}
                  disabled={submitting}
                >
                  {submitting ? "Confirming..." : "Pay on visit"}
                </button>
                <button
                  className="inline-flex items-center justify-center rounded-md border px-4 py-2 disabled:opacity-60"
                  onClick={onPayNow}
                  disabled={submitting || paymentLoading}
                >
                  {paymentLoading ? "Loading Payment..." : submitting ? "Processing..." : "Pay online"}
                </button>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <button className="inline-flex items-center rounded-md px-4 py-2">Cancel</button>
                </DialogClose>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-green-600">Great! Your booking is confirmed.</DialogTitle>
                <DialogDescription>
                  You will soon receive an email confirmation{email ? ` on ${email}` : ""}.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-2 space-y-5 text-sm">
                <div>
                  <button onClick={() => window.print()} className="inline-flex items-center rounded-md border px-3 py-1.5 text-xs">Print</button>
                </div>
                <div className="flex items-start gap-3">
                  {displaySalonImage && (
                    <img src={displaySalonImage} alt={displaySalonName} className="h-12 w-12 rounded object-cover" />
                  )}
                  <div>
                    <div className="font-semibold text-gray-900">{displaySalonName}</div>
                    <div className="text-xs text-gray-600">{displaySalonRating}</div>
                    {displaySalonAddress && (
                      <div className="text-xs text-gray-600 mt-1">{displaySalonAddress}</div>
                    )}
                  </div>
                </div>
                <div className="grid gap-1">
                  <div className="flex justify-between"><span>Booking ID</span><span className="font-medium">{createdBooking?.bookingId || "—"}</span></div>
                  <div className="flex justify-between"><span>Booked by</span><span>{fullName} on {new Date().toLocaleDateString()}</span></div>
                </div>
                <div className="grid gap-1 border-t pt-2">
                  <div className="flex justify-between"><span>Appointment</span><span>{new Date(state.appointmentTimeISO!).toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>Guest</span><span>{fullName}</span></div>
                  <div className="flex justify-between"><span>Mobile</span><span>{phone}</span></div>
                  <div className="flex justify-between"><span>Email</span><span>{email}</span></div>
                  <div className="flex justify-between"><span>Payment</span><span>{(paidLocally || createdBooking?.paymentStatus === "Paid") ? "Paid" : (currentPayment?.paymentMethod || createdBooking?.paymentMethod || "Pay on visit")}</span></div>
                </div>
                <div className="border-t pt-2 space-y-1">
                  {(state.services || []).map((s, i) => (
                    <div key={i} className="flex justify-between">
                      <span>{s.name}</span>
                      <span>₹{Number(s.price || 0)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-semibold pt-1"><span>Total payable amount</span><span>₹{createdBooking?.totalPrice ?? total}</span></div>
                  {createdBooking && (createdBooking.status || createdBooking.paymentStatus) && (
                    <div className="text-xs text-gray-600">Status: {createdBooking.status || createdBooking.paymentStatus}</div>
                  )}
                </div>
                <div className="border rounded-md p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Payment Details</div>
                    <div className="text-base font-semibold">₹{createdBooking?.totalPrice ?? total}</div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {paidLocally ? "Payment completed." : "Your payment option is 'Pay on visit'. You may be contacted to confirm your appointment."}
                  </p>
                  {!paidLocally && (
                    <div className="mt-3 flex justify-end">
                      <button
                        className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-white"
                        onClick={() => setPaidLocally(true)}
                      >
                        Pay Now
                      </button>
                    </div>
                  )}
                </div>
                {createdBooking?.bookingId && (
                  <div className="text-xs text-gray-600">Booking ID: {createdBooking.bookingId}</div>
                )}
                <div className="border-t pt-3 text-xs text-gray-600 space-y-1">
                  <div className="font-medium text-gray-800">Things to know</div>
                  <p>Your payment option is "Pay on visit" unless already paid. You may receive a confirmation call from the salon.</p>
                  <p>For changes or cancellations, visit My Bookings.</p>
                  <div>
                    <button
                      className="text-red-600 underline"
                      onClick={() => { setShowPayment(false); navigate("/bookings") }}
                    >
                      Cancel Booking
                    </button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <button
                  className="inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-white"
                  onClick={() => { setShowPayment(false); setDialogStage("payment"); setCreatedBooking(null); navigate("/bookings") }}
                >
                  View My Bookings
                </button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
