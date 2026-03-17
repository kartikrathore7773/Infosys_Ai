import { getAuthToken } from "../utils/authStorage";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export async function analyzeContent(text) {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Authentication required");
  }

  const res = await fetch(`${BASE_URL}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) throw new Error("Analysis failed");
  return res.json();
}
