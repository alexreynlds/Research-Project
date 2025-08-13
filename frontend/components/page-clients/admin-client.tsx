"use client";

import ServerConnectionTest from "../backend/server-connection-test";
import { useAuth } from "../lib/useAuth";
import { useRouter } from "next/navigation";

export default function AdminClient() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) return <div>Loading…</div>;

  if (!user || user.account_type !== "admin") {
    // should rarely hit due to middleware, but guard anyway
    router.replace("/dashboard");
    return null;
  }

  return (
    user.account_type === "admin" && (
      <div className="flex flex-col h-full justify-between gap-5">
        <div className="flex flex-col border-2 p-5 rounded-xl h-full shadow-md"></div>
        <ServerConnectionTest />
      </div>
    )
  );
}
