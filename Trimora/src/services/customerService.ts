import { apiFetch } from "../lib/api";

export type Customer = {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  phoneNumber?: string;
  dob?: string | null; // ISO string or null
};

export async function getCustomer(id: string): Promise<Customer> {
  const res = await apiFetch(`/user/${encodeURIComponent(id)}`);
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || `Failed to load profile (${res.status})`);
  }
  const data = await res.json();
  const u = data.user ?? data;
  return {
    name: u.name ?? "",
    email: u.email ?? "",
    phoneNumber: u.phoneNumber ?? u.phone ?? "",
    dob: u.dob ?? null,
    id: u.id ?? u._id,
    _id: u._id,
  };
}

export async function updateCustomer(
  id: string,
  payload: { name: string; email: string; phoneNumber?: string; dob?: string | null }
) {
  const res = await apiFetch(`/user/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || `Failed to update profile (${res.status})`);
  }
  return res.json();
}
