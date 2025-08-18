"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

const AuthContext = createContext(null);

export default function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      // Attempt to fetch the user data from the API
      // If successful, set the user state
      // If it fails, set the user state to null
      try {
        const me = await api.get("/auth/me");
        setUser(me?.user || null);
      } catch (error) {
        // If the error is not a 401 (unauthorized), log it
        // Otherwise, ignore and dont log anything - just means the user isnt logged in
        // And this would be expected
        if (error.status !== 401) {
          console.error("Failed to fetch user:", error);
        } else {
        }
        setUser(null);
      }
      setReady(true);
    })();
  }, []);

  const signIn = async (email, password) => {
    const res = await api("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    if (res?.user) setUser(res.user);
    return res;
  };

  const register = async (email, password) => {
    const res = await api("/auth/register", {
      method: "POST",
      body: { email, password },
    });

    if (res?.user) setUser(res.user);
    return res;
  };

  const signOut = async () => {
    await api("/auth/logout", { method: "POST" });
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        ready,
        signIn,
        register,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
