"use client";

const API = process.env.NEXT_PUBLIC_API_BASE!;

export default async function authFetch(path: string, init: RequestInit = {}) {
  const opts: RequestInit = {
    credentials: "include",
    ...init,
    headers: { "Content-Type": "application/json", ...(init.headers || {}) },
  };

  let res = await fetch(`${API}${path}`, opts);
  if (res.status !== 401) return res;

  // try to refresh once
  const r = await fetch(`${API}/api/refresh`, {
    method: "POST",
    credentials: "include",
  });
  if (!r.ok) return res;

  return fetch(`${API}${path}`, opts);
}
