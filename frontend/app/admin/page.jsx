"use client";

import AdminButton from "@/components/admin/admin-button";
import AdminUsersPage from "@/components/admin/pages/users";
import useAuth from "@/components/auth/auth-context";
import MainLayout from "@/components/layouts/main-layout";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [page, setPage] = useState(0);

  return (
    user && (
      <MainLayout>
        <div className="border-2 w-full rounded-md p-3 flex flex-row items-center justify-between">
          <ul className="flex gap-5">
            <AdminButton page={0} currentPage={page} onClick={() => setPage(0)}>
              USERS
            </AdminButton>
            <AdminButton page={1} currentPage={page} onClick={() => setPage(1)}>
              DELETE ENTITY
            </AdminButton>
            <AdminButton page={2} currentPage={page} onClick={() => setPage(2)}>
              GENERATE API KEYS
            </AdminButton>
            <AdminButton page={3} currentPage={page} onClick={() => setPage(3)}>
              ORION DATA VIEWER
            </AdminButton>
          </ul>
          <div>
            <p className="font-bold">Welcome, {user.email}</p>
          </div>
        </div>
        <div className="border-2 p-3 w-full h-full rounded-md">
          {page == 0 && <AdminUsersPage />}
        </div>
      </MainLayout>
    )
  );
}
