import React, { createContext, useState, useEffect } from "react";
import API from "../api/axios";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      delete API.defaults.headers.common.Authorization;
    }
  }, [token]);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const loginSessionEngine = async (phone, password) => {
    const res = await API.post("/auth/login", {
      phone,
      password,
    });

    if (res.data?.token) {
      login(res.data.user, res.data.token);
      return res.data;
    }

    throw new Error("Invalid credentials.");
  };

  const registerSellerSessionEngine = async (payload) => {
    const res = await API.post("/auth/register/seller", payload);
    if (res.data?.token) {
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    }
    return res.data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        loginSessionEngine,
        registerSellerSessionEngine,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;