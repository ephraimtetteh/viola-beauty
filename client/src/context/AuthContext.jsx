import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);
const API = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    () => localStorage.getItem("viola_token") || "",
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${API}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setUser(data);
        } else {
          // ── Token invalid — clear only if not admin ──
          // If token exists but /me fails, don't wipe an admin session
          // silently. Instead clear and let them re-login.
          clearSession();
        }
      })
      .catch(() => {
        // ── Network error — keep token, don't log out ──
        // Admin stays logged in if backend is temporarily unreachable.
        // User object will be null but token is preserved so next
        // successful request will restore the session.
        setLoading(false);
      })
      .finally(() => setLoading(false));
  }, []);

  const clearSession = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("viola_token");
  };

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem("viola_token", userToken);
  };

  // ── Intentional logout — only way session is cleared ──
  const logout = () => {
    clearSession();
  };

  const updateUser = (data) => setUser((prev) => ({ ...prev, ...data }));

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        updateUser,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
