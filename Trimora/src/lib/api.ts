export const API_BASE_URL = "http://localhost:5000/api/v1";

function getToken(): string | null {
  try {
    // Read from localStorage so it works with AuthContext as well
    return localStorage.getItem("trimora_token");
  } catch {
    return null;
  }
}

export async function apiFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const token = getToken();
  const headers: HeadersInit = {
    ...(init.headers || {}),
  };
  if (!("Authorization" in (headers as any)) && token) {
    (headers as any)["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE_URL}${input}`, {
    ...init,
    headers,
    credentials: "include",
  });
  return res;
}
