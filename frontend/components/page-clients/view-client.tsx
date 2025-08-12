"use client";

import ServerConnectionTest from "../backend/server-connection-test";
import { useAuth } from "../lib/useAuth";
import { useRouter } from "next/navigation";

export default function ViewClient() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) return <div>Loading…</div>;

  if (!user) {
    // should rarely hit due to middleware, but guard anyway
    // router.replace("/login");
    return null;
  }

  return (
    <div>
      <h1>VIEW</h1>
      <ServerConnectionTest />
    </div>
  );
}
