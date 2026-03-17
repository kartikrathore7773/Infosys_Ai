const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const request = async (path, body) => {
  const response = await fetch(`${BASE_URL}/auth${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body || {}),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.error || "Authentication failed");
  }

  return response.json();
};

export const register = (payload) => request("/register", payload);
export const login = (payload) => request("/login", payload);
