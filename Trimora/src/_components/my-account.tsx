"use client"

import { useEffect, useMemo, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { getCustomer, updateCustomer, type Customer as SvcCustomer } from "../services/customerService"

type Customer = {
  id?: string
  _id?: string
  name: string
  email: string
  phone?: string
  dob?: string // yyyy-MM-dd string for UI convenience
}

export default function MyAccount() {
  const { user, token } = useAuth()
  const customerId = useMemo(() => user?.id, [user])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [form, setForm] = useState<Customer>({ name: "", email: "", phone: "", dob: "" })
  const showForm = false // set to true to show editable form at top
  const showSummaryValues = true // set to true to display actual values in the boxes
  const [editMode, setEditMode] = useState(false)
  const [lastSaved, setLastSaved] = useState<Customer | null>(null)

  useEffect(() => {
    let ignore = false
    async function load() {
      if (!customerId || !token) { setLoading(false); return }
      setLoading(true)
      setError(null)
      try {
        const u: SvcCustomer = await getCustomer(customerId)
        if (!ignore) {
          const populated: Customer = {
            name: u.name ?? "",
            email: u.email ?? "",
            phone: (u as any).phoneNumber ?? (u as any).phone ?? "",
            // Normalize to yyyy-MM-dd for date input if present
            dob: u.dob ? new Date(u.dob as any).toISOString().slice(0, 10) : "",
            id: u.id ?? u._id,
            _id: u._id,
          }
          setForm(populated)
          setLastSaved(populated)
        }
      } catch (e: any) {
        if (!ignore) setError(e?.message || "Failed to load profile")
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    load()
    return () => { ignore = true }
  }, [customerId, token])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!customerId || !token) return
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const data = await updateCustomer(customerId, { name: form.name, email: form.email, phoneNumber: form.phone, dob: form.dob || null })
      const u = (data as any).user ?? {}
      setSuccess("Profile updated successfully")
      // If name/email changed, reflect in local Auth user as well
      try {
        const ls = localStorage.getItem("trimora_user")
        if (ls) {
          const cur = JSON.parse(ls)
          const updated = { ...cur, name: u.name ?? form.name, email: u.email ?? form.email }
          localStorage.setItem("trimora_user", JSON.stringify(updated))
        }
      } catch {}
      // Update lastSaved snapshot and exit edit mode
      setLastSaved({ ...form })
      setEditMode(false)
    } catch (e: any) {
      setError(e?.message || "Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 pt-28 pb-12">
      <h1 className="text-2xl font-bold mb-6">My Account</h1>

      {!token && (
        <div className="p-4 rounded-lg border border-yellow-200 bg-yellow-50 text-yellow-800 mb-4">
          Please login to view your account.
        </div>
      )}

      {loading && <div className="text-gray-600">Loading profile…</div>}
      {error && (
        <div className="p-4 rounded-lg border border-red-200 bg-red-50 text-red-700 mb-4">{error}</div>
      )}
      {success && (
        <div className="p-4 rounded-lg border border-green-200 bg-green-50 text-green-700 mb-4">{success}</div>
      )}

      {showForm && !loading && !error && (
        <form onSubmit={onSubmit} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={form.phone ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="Optional"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-5 py-2.5 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </form>
      )}

      {/* Read-only account details below */}
      {!loading && (
        <div className="mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Edit profile</h2>
                <button
                  type="button"
                  onClick={() => setEditMode((v) => !v)}
                  className="text-gray-500 hover:text-gray-700"
                  title={editMode ? "Close" : "Edit"}
                >
                  ✎
                </button>
              </div>

              {!editMode && (
                <dl className="space-y-4 text-sm">
                  <div>
                    <dt className="text-gray-500">Full Name</dt>
                    <dd className="text-gray-900 font-medium break-words">{showSummaryValues ? (form.name || "—") : "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Phone Number</dt>
                    <dd className="text-gray-900 font-medium break-words">{showSummaryValues ? (form.phone || "—") : "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Email Address</dt>
                    <dd className="text-gray-900 font-medium break-words">{showSummaryValues ? (form.email || "—") : "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Date of Birth</dt>
                    <dd className="text-gray-900 font-medium break-words">{showSummaryValues ? (form.dob || "—") : "—"}</dd>
                  </div>
                </dl>
              )}

              {editMode && (
                <form onSubmit={onSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                      value={form.phone ?? ""}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                      value={form.dob ?? ""}
                      onChange={(e) => setForm((f) => ({ ...f, dob: e.target.value }))}
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-60"
                    >
                      {saving ? "Saving…" : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setEditMode(false); if (lastSaved) setForm(lastSaved) }}
                      className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
            <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Change password</h2>
                <span className="text-gray-400">✎</span>
              </div>
              <div className="text-sm">
                <div className="text-gray-500 mb-2">Current Password</div>
                <div className="tracking-widest select-none">••••••••</div>
                <button
                  disabled
                  className="mt-4 inline-flex items-center px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium cursor-not-allowed"
                  title="Coming soon"
                >
                  Change Password (coming soon)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
