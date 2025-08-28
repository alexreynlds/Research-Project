"use client";

import MenuButton from "@/components/nav/menu_button";

import useAuth from "@/components/auth/auth_context";
import MainLayout from "@/components/layouts/main_layout";
import { Suspense, useState, useMemo, useEffect, useCallback } from "react";

import ImportLabelledEndPostsCsv from "@/components/dashboard/import/labelled_end_posts_csv";
import ImportUnlabelledEndPostsCsv from "@/components/dashboard/import/unlabelled_end_posts_csv";
import ImportVinesCsv from "@/components/dashboard/import/vines_csv";
import ImportGeoJson from "@/components/dashboard/import/geojson";
import ImportOutfieldsGeoJson from "@/components/dashboard/import/outfields_geojson";
import ImportShapefile from "@/components/dashboard/import/shapefile";

import ViewPage from "@/components/dashboard/view";
import EditMapPage from "@/components/dashboard/edit_map";

import CreateMapPage from "@/components/dashboard/create_map";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const TAB_MAP = {
  view: 0,
  import_labelled_csv: 1,
  import_unlabelled_csv: 2,
  import_vines_csv: 3,
  import_geojson: 4,
  import_outfields_geojson: 5,
  import_shapefile: 6,
  create_map: 7,
  edit_map: 8,
};

const INDEX_TO_TAB = Object.fromEntries(
  Object.entries(TAB_MAP).map(([key, value]) => [value, key]),
);

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading admin…</div>}>
      <DashboardInner />
    </Suspense>
  );
}

function DashboardInner() {
  const { user } = useAuth();
  const [page, setPage] = useState(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();
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
      next.delete("view");
      next.delete("import_labelled_csv");
      next.delete("import_unlabelled_csv");
      next.delete("import_vines_csv");
      next.delete("import_geojson");
      next.delete("import_outfields_geojson");
      next.delete("import_shapefile");
      next.delete("create_map");
      next.delete("edit_map");
      next.set("tab", key);
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
      setPage(TAB_MAP[key] ?? 0);
    },
    [pathname, router, searchParams],
  );

  return (
    user && (
      <MainLayout pageTitle="Dashboard">
        <div className="border-2 w-full rounded-md p-3  flex-col gap-6 md:flex-row items-center justify-between hidden md:flex">
          <ul className="grid grid-cols-2 gap-2 sm:flex sm:gap-3 w-full sm:w-fit">
            <li>
              <MenuButton
                page={0}
                currentPage={page}
                onClick={() => go("view")}
              >
                VIEW
              </MenuButton>
            </li>
            <li>
              <MenuButton
                page={[1, 2, 3, 4, 5, 6]}
                currentPage={page}
                onClick={() => go("import_labelled_csv")}
              >
                IMPORT
              </MenuButton>
            </li>
            <li>
              <MenuButton
                page={[7, 8]}
                currentPage={page}
                onClick={() => go("create_map")}
              >
                CREATE
              </MenuButton>
            </li>
          </ul>
          {page >= 1 && page <= 6 && (
            <>
              <div className="hidden sm:flex mx-1 self-stretch w-[2px] bg-border" />
              <ul className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3 w-full">
                <li>
                  <MenuButton
                    page={1}
                    currentPage={page}
                    onClick={() => go("import_labelled_csv")}
                    variant="small"
                  >
                    LABELLED CSV
                  </MenuButton>
                </li>
                <li>
                  <MenuButton
                    page={2}
                    currentPage={page}
                    onClick={() => go("import_unlabelled_csv")}
                    variant="small"
                  >
                    UNLABELLED CSV
                  </MenuButton>
                </li>
                <li>
                  <MenuButton
                    page={3}
                    currentPage={page}
                    onClick={() => go("import_vines_csv")}
                    variant="small"
                  >
                    VINES CSV
                  </MenuButton>
                </li>
                <li>
                  <MenuButton
                    page={4}
                    currentPage={page}
                    onClick={() => go("import_geojson")}
                    variant="small"
                  >
                    GEOJSON
                  </MenuButton>
                </li>
                <li>
                  <MenuButton
                    page={5}
                    currentPage={page}
                    onClick={() => go("import_outfields_geojson")}
                    variant="small"
                  >
                    OUTFIELDS GEOJSON
                  </MenuButton>
                </li>
                <li>
                  <MenuButton
                    page={6}
                    currentPage={page}
                    onClick={() => go("import_shapefile")}
                    variant="small"
                  >
                    SHAPEFILE
                  </MenuButton>
                </li>
              </ul>
            </>
          )}
          {(page === 7 || page === 8) && (
            <>
              <div className="hidden sm:flex mx-1 self-stretch w-[2px] bg-border" />
              <ul className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3 w-full">
                <li>
                  <MenuButton
                    page={7}
                    currentPage={page}
                    onClick={() => go("create_map")}
                    variant="small"
                  >
                    CREATE MAP
                  </MenuButton>
                </li>
                <li>
                  <MenuButton
                    page={8}
                    currentPage={page}
                    onClick={() => go("edit_map")}
                    variant="small"
                  >
                    EDIT MAP
                  </MenuButton>
                </li>
              </ul>
            </>
          )}
          <p className="font-bold underline text-nowrap">
            Welcome, {user.email}
          </p>
        </div>
        <div className="md:border-2 w-full rounded-md relative flex-1 p-3 flex justify-center">
          {page === 0 && <ViewPage />}
          {page === 1 && <ImportLabelledEndPostsCsv />}
          {page === 2 && <ImportUnlabelledEndPostsCsv />}
          {page === 3 && <ImportVinesCsv />}
          {page === 4 && <ImportGeoJson />}
          {page === 5 && <ImportOutfieldsGeoJson />}
          {page === 6 && <ImportShapefile />}
          {page === 7 && <CreateMapPage />}
          {page === 8 && <EditMapPage />}
        </div>
      </MainLayout>
    )
  );
}
