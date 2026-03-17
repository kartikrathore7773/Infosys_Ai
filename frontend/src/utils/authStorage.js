const AUTH_TOKEN_KEY = "authToken";
const CURRENT_USER_KEY = "user";
const LOGGED_IN_FLAG = "isLoggedIn";

export const getAuthToken = () => localStorage.getItem(AUTH_TOKEN_KEY);
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
};

export const getCurrentUser = () => {
  const stored = localStorage.getItem(CURRENT_USER_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error("Failed to parse current user", error);
    return null;
  }
};

export const setCurrentUser = (user) => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

export const markLoggedIn = () => localStorage.setItem(LOGGED_IN_FLAG, "true");
export const markLoggedOut = () => localStorage.removeItem(LOGGED_IN_FLAG);

export const clearAuth = () => {
  setAuthToken(null);
  setCurrentUser(null);
  markLoggedOut();
};

export const isAuthenticated = () => Boolean(getAuthToken());
