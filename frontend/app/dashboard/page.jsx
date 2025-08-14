"use client";

import useAuth from "@/components/auth/auth-context";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

export default function Page() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      router.replace("/login");
    } catch (e) {
      console.error("Logout failed", e);
    }
  }, [signOut, router]);

  return (
    <div>
      <h1>DASHBOARD</h1>
      {user && (
        <p>
          Welcome, {user.email}, {user.account_type}
        </p>
      )}
      <button
        onClick={handleSignOut}
        className="p-2 border-2 rounded-md bg-white hover:bg-gray-200 transition-all duration-300 cursor-pointer"
      >
        Sign Out
      </button>
    </div>
  );
}
