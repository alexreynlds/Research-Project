"use client";

import useAuth from "@/components/auth/auth_context";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import MainLayout from "@/components/layouts/main_layout";
import MenuButton from "@/components/nav/menu_button";
import UsersPage from "@/components/admin/users";
import InviteCodesPage from "@/components/admin/invite_codes";
import ApiKeysPage from "@/components/admin/api_keys";
import DeleteEntitiesPage from "@/components/admin/delete_entities";
import OrionViewerPage from "@/components/admin/orion_viewer";

// map the tab names to page indexes
const TAB_MAP = {
  users: 0,
  invite_codes: 1,
  delete_entity: 2,
  api_keys: 3,
  orion_viewer: 4,
};

const INDEX_TO_TAB = Object.fromEntries(
  Object.entries(TAB_MAP).map(([key, value]) => [value, key]),
);

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading admin…</div>}>
      <AdminInner />
    </Suspense>
  );
}

function AdminInner() {
  const { user } = useAuth();
  const [page, setPage] = useState(0);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const urlPage = useMemo(() => {
    // Get the tab value from the url
    const tab = searchParams.get("tab");
    // Map it to the page index, default to 0
    if (tab && tab in TAB_MAP) return TAB_MAP[tab];
    return 0;
  }, [searchParams]);

  // Set the page to the url
  useEffect(() => {
    setPage(urlPage);
  }, [urlPage]);

  // Navigate to a tab by its name or index
  const go = useCallback(
    (keyOrIndex) => {
      const key =
        typeof keyOrIndex === "number"
          ? (INDEX_TO_TAB[keyOrIndex] ?? "users")
          : keyOrIndex;
      const next = new URLSearchParams(searchParams.toString());
      next.delete("users");
      next.delete("invite_codes");
      next.delete("delete_entity");
      next.delete("api_keys");
      next.delete("orion_viewer");
      next.set("tab", key);
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
      setPage(TAB_MAP[key] ?? 0);
    },
    [pathname, router, searchParams],
  );

  return (
    user && (
      <MainLayout pageTitle="Admin Dashboard">
        <div className="border-2 w-full rounded-md p-3 flex-col gap-3 md:flex-row items-center justify-between hidden md:flex">
          <ul className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
            <li>
              <MenuButton
                page={0}
                currentPage={page}
                onClick={() => go("users")}
              >
                USERS
              </MenuButton>
            </li>
            <li>
              <MenuButton
                page={1}
                currentPage={page}
                onClick={() => go("invite_codes")}
              >
                INVITE CODES
              </MenuButton>
            </li>
            <li>
              <MenuButton
                page={2}
                currentPage={page}
                onClick={() => go("delete_entity")}
              >
                DELETE ENTITY
              </MenuButton>
            </li>
            <li>
              <MenuButton
                page={3}
                currentPage={page}
                onClick={() => go("api_keys")}
              >
                GENERATE API KEYS
              </MenuButton>
            </li>
            <li>
              <MenuButton
                page={4}
                currentPage={page}
                onClick={() => go("orion_viewer")}
              >
                ORION DATA VIEWER
              </MenuButton>
            </li>
          </ul>
          <div>
            <p className="font-bold underline">Welcome, {user.email}</p>
          </div>
        </div>
        <div className="md:border-2 p-8 w-full h-full rounded-md">
          {page === 0 && <UsersPage />}
          {page === 1 && <InviteCodesPage />}
          {page === 2 && <DeleteEntitiesPage />}
          {page === 3 && <ApiKeysPage />}
          {page === 4 && <OrionViewerPage />}
        </div>
      </MainLayout>
    )
  );
}
