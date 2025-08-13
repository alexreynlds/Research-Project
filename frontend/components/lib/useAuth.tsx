"use client";

import useSWR from "swr";
import authFetch from "./authFetch";

type User = { id: number | string; email: string; account_type: string } | null;

const fetcher = async (path: string): Promise<User> => {
  const res = await authFetch(path);
  if (!res.ok) return null;
  return res.json();
};

export function useAuth() {
  const { data, error, isLoading, mutate } = useSWR<User>("/api/me", fetcher);
  return { user: data, isLoading, error, refreshUser: () => mutate() };
}
