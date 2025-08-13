"use client";

import ServerConnectionTest from "../backend/server-connection-test";
import { useAuth } from "../lib/useAuth";

export default function DashboardClient() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading…</div>;

  if (!user) {
    // should rarely hit due to middleware, but guard anyway
    // router.replace("/login");
    return null;
  }

  return (
    <div className="flex flex-col h-full justify-between gap-5">
      <div className="flex flex-col border-2 p-5 rounded-xl h-full shadow-md">
        <h1>DASHBOARD</h1>
        <p>Logged in as: {user.email}</p>
        {user.account_type == "admin" && (
          <p className="text-red-500">
            You are logged in as an admin. Please use the admin dashboard for
            administrative tasks.
          </p>
        )}
        <p>Welcome to the dashboard for AGRIDS Map!</p>
      </div>
      <ServerConnectionTest />
    </div>
  );
}
