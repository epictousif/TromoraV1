"use client"

import { useState } from "react"
import { apiFetch } from "../lib/api"

type Faq = { q: string; a: string }

const faqs: Faq[] = [
  { q: "How do I view my bookings?", a: "Go to My Booking from the user menu. You'll see upcoming and past bookings. If none, click 'Book Now' to start." },
  { q: "How can I update my account details?", a: "Open My Account from the user menu. Click the edit icon to modify your name, phone or email, then Save." },
  { q: "I'm not receiving emails.", a: "Check your spam folder and ensure your email in My Account is correct. If issues persist, contact support below." },
]

export default function Help() {
  const [open, setOpen] = useState<number | null>(0)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setResult(null)
    setError(null)
    // simple client-side validation
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill out all fields.")
      return
    }
    const emailOk = /.+@.+\..+/.test(email)
    if (!emailOk) {
      setError("Please enter a valid email address.")
      return
    }
    setSending(true)
    try {
      const res = await apiFetch(`/support/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, source: "help_page" }),
      })
      if (!res.ok) {
        // graceful fallback if endpoint isn't available
        setResult(null)
        setError("We couldn't submit your request right now. Please email support@trimora.app or call +91-80000-00000.")
      } else {
        setResult("Thanks! Your message has been sent. We'll get back to you shortly.")
        setName("")
        setEmail("")
        setMessage("")
      }
    } catch (e: any) {
      setError("Network error. Please try again later or email support@trimora.app.")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 pt-28 pb-12">
      <h1 className="text-2xl font-bold mb-6">Help & Support</h1>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">Frequently Asked Questions</h2>
        <div className="divide-y divide-gray-200 border border-gray-200 rounded-lg bg-white/70 backdrop-blur-sm">
          {faqs.map((f, idx) => (
            <div key={idx}>
              <button
                type="button"
                className="w-full text-left px-4 py-3 font-medium hover:bg-gray-50 flex justify-between items-center"
                onClick={() => setOpen(open === idx ? null : idx)}
              >
                <span>{f.q}</span>
                <span className="text-gray-500">{open === idx ? "−" : "+"}</span>
              </button>
              {open === idx && (
                <div className="px-4 pb-4 text-gray-700 text-sm">{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Contact Support</h2>
        <p className="text-gray-600 mb-4">Prefer email or phone? support@trimora.app · +91-80000-00000</p>
        {result && (
          <div className="p-3 mb-3 rounded-lg border border-green-200 bg-green-50 text-green-700">{result}</div>
        )}
        {error && (
          <div className="p-3 mb-3 rounded-lg border border-red-200 bg-red-50 text-red-700">{error}</div>
        )}
        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 max-w-xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[120px]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={sending}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-60"
          >
            {sending ? "Sending…" : "Send Message"}
          </button>
        </form>
      </section>
    </div>
  )
}
