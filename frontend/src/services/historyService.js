import { getAuthToken } from "../utils/authStorage";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function getHeaders(custom = {}) {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...custom,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: options.method || "GET",
    headers: getHeaders(options.headers),
    body: options.body,
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => null);
    throw new Error(payload?.error || "History request failed");
  }

  return res.json();
}

export function fetchHistory() {
  return request("/history", { method: "GET" });
}

export function createChat(payload) {
  return request("/history", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function appendMessage(chatId, message) {
  return request(`/history/${chatId}/messages`, {
    method: "POST",
    body: JSON.stringify(message),
  });
}

export function updateTitle(chatId, title) {
  return request(`/history/${chatId}/title`, {
    method: "PUT",
    body: JSON.stringify({ title }),
  });
}

export function deleteChat(chatId) {
  return request(`/history/${chatId}`, { method: "DELETE" });
}
