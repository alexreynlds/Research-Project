"use client";

import AdminButton from "@/components/admin/admin-button";
import View from "@/components/dashboard/pages/view";
import useAuth from "@/components/auth/auth-context";
import MainLayout from "@/components/layouts/main-layout";
import { useState } from "react";

export default function Page() {
  const { user } = useAuth();
  const [page, setPage] = useState(0);

  return (
    user && (
      <MainLayout pageTitle="Dashboard">
        <div className="border-2 w-full rounded-md p-3 flex flex-col gap-3 md:flex-row items-center justify-between">
          <ul className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3 w-full">
            <AdminButton page={0} currentPage={page} onClick={() => setPage(0)}>
              VIEW
            </AdminButton>
            <AdminButton page={1} currentPage={page} onClick={() => setPage(1)}>
              IMPORT
            </AdminButton>
            <AdminButton page={2} currentPage={page} onClick={() => setPage(2)}>
              CREATE
            </AdminButton>
          </ul>
          <p className="font-bold underline text-nowrap">
            Welcome, {user.email}
          </p>
        </div>
        <div className="border-2 w-full h-full rounded-md relative overflow-hidden">
          {page === 0 && <View />}
        </div>
      </MainLayout>
    )
  );
}
