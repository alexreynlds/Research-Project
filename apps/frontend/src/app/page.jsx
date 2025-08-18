"use client";

import MenuButton from "@/components/nav/menu-button";

import useAuth from "@/components/auth/auth-context";
import MainLayout from "@/components/layouts/main-layout";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const { user } = useAuth();
  const [page, setPage] = useState(0);

  return (
    user && (
      <MainLayout pageTitle="Dashboard">
        <div className="border-2 w-full rounded-md p-3 flex flex-col gap-6 md:flex-row items-center justify-between">
          <ul className="grid grid-cols-2 gap-2 sm:flex sm:gap-3 w-fit">
            <MenuButton page={0} currentPage={page} onClick={() => setPage(0)}>
              VIEW
            </MenuButton>
            <MenuButton
              page={[1, 2, 3, 4, 5, 6]}
              currentPage={page}
              onClick={() => setPage(1)}
            >
              IMPORT
            </MenuButton>
            <MenuButton
              page={[7, 8]}
              currentPage={page}
              onClick={() => setPage(7)}
            >
              CREATE
            </MenuButton>
          </ul>
          {page >= 1 && page <= 6 && (
            <>
              <Separator
                orientation="vertical"
                className="mx-2 border-1 border-gray-400 h-full rounded-xl"
              />
              <ul className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3 w-full">
                <MenuButton
                  page={1}
                  currentPage={page}
                  onClick={() => setPage(1)}
                  variant="small"
                >
                  LABELLED CSV
                </MenuButton>
                <MenuButton
                  page={2}
                  currentPage={page}
                  onClick={() => setPage(2)}
                  variant="small"
                >
                  UNLABELLED CSV
                </MenuButton>
                <MenuButton
                  page={3}
                  currentPage={page}
                  onClick={() => setPage(3)}
                  variant="small"
                >
                  VINES CSV
                </MenuButton>
                <MenuButton
                  page={4}
                  currentPage={page}
                  onClick={() => setPage(4)}
                  variant="small"
                >
                  GEOJSON
                </MenuButton>
                <MenuButton
                  page={5}
                  currentPage={page}
                  onClick={() => setPage(5)}
                  variant="small"
                >
                  OUTFIELDS GEOJSON
                </MenuButton>
                <MenuButton
                  page={6}
                  currentPage={page}
                  onClick={() => setPage(6)}
                  variant="small"
                >
                  SHAPEFILE
                </MenuButton>
              </ul>
            </>
          )}
          {(page === 7 || page === 8) && (
            <>
              <Separator
                orientation="vertical"
                className="mx-2 border-1 border-gray-400 h-full rounded-xl"
              />
              <ul className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3 w-full">
                <MenuButton
                  page={7}
                  currentPage={page}
                  onClick={() => setPage(7)}
                  variant="small"
                >
                  CREATE MAP
                </MenuButton>
                <MenuButton
                  page={8}
                  currentPage={page}
                  onClick={() => setPage(8)}
                  variant="small"
                >
                  EDIT MAP
                </MenuButton>
              </ul>
            </>
          )}

          <p className="font-bold underline text-nowrap">
            Welcome, {user.email}
          </p>
        </div>
        <div className="border-2 w-full rounded-md relative flex-1 h-auto"></div>
      </MainLayout>
    )
  );
}
