const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3008";

async function request(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Error en la solicitud");
  }
  return data;
}

export function apiGet(endpoint: string, token?: string) {
  return request(endpoint, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export function apiPost(endpoint: string, body: unknown, token?: string) {
  return request(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export function apiPut(endpoint: string, body: unknown, token?: string) {
  return request(endpoint, {
    method: "PUT",
    body: JSON.stringify(body),
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export function apiDelete(endpoint: string, token?: string) {
  return request(endpoint, {
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}
