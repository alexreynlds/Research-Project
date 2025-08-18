"use client";

import useAuth from "@/components/auth/auth-context";
import { useState } from "react";

import MainLayout from "@/components/layouts/main-layout";
import MenuButton from "@/components/nav/menu-button";

export default function Page() {
  const { user } = useAuth();
  const [page, setPage] = useState(0);

  return (
    user && (
      <MainLayout pageTitle="Admin Dashboard">
        <div className="border-2 w-full rounded-md p-3 flex flex-col gap-3 md:flex-row items-center justify-between">
          <ul className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
            <MenuButton page={0} currentPage={page} onClick={() => setPage(0)}>
              USERS
            </MenuButton>
            <MenuButton page={1} currentPage={page} onClick={() => setPage(1)}>
              DELETE ENTITY
            </MenuButton>
            <MenuButton page={2} currentPage={page} onClick={() => setPage(2)}>
              GENERATE API KEYS
            </MenuButton>
            <MenuButton page={3} currentPage={page} onClick={() => setPage(3)}>
              ORION DATA VIEWER
            </MenuButton>
          </ul>
          <div>
            <p className="font-bold underline">Welcome, {user.email}</p>
          </div>
        </div>
        <div className="border-2 p-3 w-full h-full rounded-md"></div>
      </MainLayout>
    )
  );
}
