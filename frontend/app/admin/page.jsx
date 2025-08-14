"use client";

import AdminButton from "@/components/admin/admin-button";
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
        <div className="border-2 w-auto rounded-md p-3 flex flex-row justify-center">
          <ul className="flex gap-5 ">
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
        </div>
        <div>
          {page}
          <h1>ADMIN</h1>
          <p>
            Welcome, {user.email}, {user.account_type}
          </p>
        </div>
      </MainLayout>
    )
  );
}
