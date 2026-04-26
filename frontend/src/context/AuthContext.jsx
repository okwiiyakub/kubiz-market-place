import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";
import getCsrfToken from "../utils/getCsrfToken";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const checkCustomer = async () => {
    try {
      const response = await api.get("accounts/me/");
      setCustomer(response.data);
    } catch {
      setCustomer(null);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    checkCustomer();
  }, []);

  const logoutCustomer = async () => {
    try {
      await api.get("csrf/");
      const csrfToken = getCsrfToken();

      await api.post(
        "accounts/logout/",
        {},
        {
          headers: {
            "X-CSRFToken": csrfToken,
          },
        }
      );

      setCustomer(null);
      window.location.href = "/";
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        customer,
        setCustomer,
        authLoading,
        checkCustomer,
        logoutCustomer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}