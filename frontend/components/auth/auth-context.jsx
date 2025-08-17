"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

// This file provides authentication context for use across the app.
const AuthContext = createContext({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
  register: async () => {},
});

// The app is wrapped in this provider in the root layout, giving access to auth state
// and methods throughout the app.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const triedRefresh = useRef(false);
  const pathname = usePathname();

  // Define paths that do not need user data to be fectched
  const AUTH_FREE = new Set(["/login"]);
  const shouldFetch = !AUTH_FREE.has(pathname);

  // If the current path is not in AUTH_FREE (login was giving errors when it was)
  // then we need to fetch the user data from the backend, including their email and account type
  const fetchUser = async ({ silent = false } = {}) => {
    try {
      let res = await fetch(`/api/me`, {
        credentials: "include",
      });

      if (res.ok) {
        setUser(await res.json());
        triedRefresh.current = false;
        return;
      }

      if (res.status === 401) {
        if (!triedRefresh.current) {
          triedRefresh.current = true;
          const r = await fetch(`/api/refresh`, {
            method: "POST",
            credentials: "include",
          });
          if (r.ok) {
            res = await fetch(`/api/me`, {
              credentials: "include",
            });
            if (res.ok) {
              setUser(await res.json());
              return;
            }
          }
        }
        setUser(null);
        return;
      }

      if (!silent) console.warn("Unexpected /api/me status:", res.status);
    } catch (e) {
      if (!silent) console.warn("Network error fetching user:", e);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // If the current path is not in AUTH_FREE, fetch the user data
  useEffect(() => {
    if (shouldFetch) fetchUser();
    else setLoading(false);
  }, [shouldFetch]);

  useEffect(() => {
    if (!user) return;
    const onFocus = () => fetchUser({ silent: true });
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [user]);

  // Sign the user in with email and password
  // Checking the backend for a valid user
  // if successful it then fetches the user data
  const signIn = async (email, password) => {
    const res = await fetch(`/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      let msg = "Login failed";
      try {
        msg = (await res.json())?.error || msg;
      } catch {}
      throw new Error(msg);
    }
    await fetchUser({ silent: true });
  };

  const register = async (email, password) => {
    const res = await fetch(`/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      let msg = "Registration failed";
      try {
        msg = (await res.json())?.error || msg;
      } catch {}
      throw new Error(msg);
    }
  };

  // Sign the user out
  const signOut = async () => {
    try {
      await fetch(`/api/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export default function useAuth() {
  return useContext(AuthContext);
}
