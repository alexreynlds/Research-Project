"use client";

import useAuth from "@/components/auth/auth_context";
import { useState } from "react";

import MainLayout from "@/components/layouts/main_layout";
import MenuButton from "@/components/nav/menu_button";
import UsersPage from "@/components/admin/users";
import InviteCodesPage from "@/components/admin/invite_codes";
import ApiKeysPage from "@/components/admin/api_keys";
import DeleteEntitiesPage from "@/components/admin/delete_entities";

import { FaExternalLinkAlt } from "react-icons/fa";

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
              INVITE CODES
            </MenuButton>
            <MenuButton page={2} currentPage={page} onClick={() => setPage(2)}>
              DELETE ENTITY
            </MenuButton>
            <MenuButton page={3} currentPage={page} onClick={() => setPage(3)}>
              GENERATE API KEYS
            </MenuButton>
            <MenuButton href={`${process.env.NEXT_PUBLIC_ORION_BASE}`}>
              ORION DATA VIEWER{" "}
              <FaExternalLinkAlt className="inline mb-1 ml-1" />
            </MenuButton>
          </ul>
          <div>
            <p className="font-bold underline">Welcome, {user.email}</p>
          </div>
        </div>
        <div className="md:border-2 p-3 w-full h-full rounded-md">
          {page === 0 && <UsersPage />}
          {page === 1 && <InviteCodesPage />}
          {page === 2 && <DeleteEntitiesPage />}
          {page === 3 && (
            <div>
              <ApiKeysPage />
            </div>
          )}
          {page === 4 && <div>Orion Data Viewer Page</div>}
        </div>
      </MainLayout>
    )
  );
}
