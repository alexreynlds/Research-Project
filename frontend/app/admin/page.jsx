"use client";

import AdminButton from "@/components/admin/admin-button";
import AdminUsersPage from "@/components/admin/pages/users";
import useAuth from "@/components/auth/auth-context";
import MainLayout from "@/components/layouts/main-layout";
import { useState } from "react";

export default function Page() {
  const { user } = useAuth();
  const [page, setPage] = useState(0);

  return (
    user && (
      <MainLayout pageTitle="Admin Dashboard">
        <div className="border-2 w-full rounded-md p-3 flex flex-col gap-3 md:flex-row items-center justify-between">
          <ul className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
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
            <p className="font-bold underline">Welcome, {user.email}</p>
          </div>
        </div>
        <div className="border-2 p-3 w-full h-full rounded-md">
          {page == 0 && <AdminUsersPage />}
        </div>
      </MainLayout>
    )
  );
}
