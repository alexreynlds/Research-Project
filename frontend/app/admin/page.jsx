"use client";

import useAuth from "@/components/auth/auth-context";
import MainLayout from "@/components/layouts/main-layout";
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
    <MainLayout>
      <h1>ADMIN</h1>
      {user && (
        <p>
          Welcome, {user.email}, {user.account_type}
        </p>
      )}
    </MainLayout>
  );
}
