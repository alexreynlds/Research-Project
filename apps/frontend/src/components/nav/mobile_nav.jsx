"use client";

import React from "react";
import Link from "next/link";
import useAuth from "../auth/auth_context";
import { Button } from "../ui/button";
import LogoutButton from "./logout_button";

import { CiMenuBurger } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { FaChevronDown } from "react-icons/fa";
import { Separator } from "../ui/separator";

export default function MobileNav() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [open, setOpen] = React.useState({
    import: false,
    create: false,
    admin: false,
  });
  const { user } = useAuth();

  function toggleMenu() {
    setMenuOpen((v) => !v);
    setOpen({ import: false, create: false, admin: false });
  }

  function closeAll() {
    setMenuOpen(false);
    setOpen({ import: false, create: false, admin: false });
  }

  function toggleSub(key) {
    setOpen((current) => {
      const isOpening = !current[key];
      return {
        import: false,
        create: false,
        admin: false,
        [key]: isOpening,
      };
    });
  }

  function SubLink({ href, children }) {
    return (
      <li>
        <Link
          href={href}
          className="block py-2 px-2 text-base"
          onClick={closeAll}
        >
          {children}
        </Link>
      </li>
    );
  }

  return (
    <nav className="fixed inset-x-0 top-0 md:hidden bg-white z-500 max-w-screen">
      <div className="fixed inset-x-0 top-0 z-500 bg-white h-[72px] max-w-screen shadow-md px-4 flex items-center justify-between">
        {/* Logo */}
        <h1 className="flex items-center gap-4 text-3xl font-medium">
          <Link href="/" title="agrids home page" onClick={closeAll}>
            <img
              src="/img/agrids_logo_transparent_crop.png"
              alt="agrids logo"
              className="h-10 mt-[-5px]"
            />
          </Link>
        </h1>

        {/* Menu Toggle */}
        <Button
          className="h-10 bg-brand-green"
          onClick={toggleMenu}
          title="Toggle menu"
        >
          {menuOpen ? (
            <IoMdClose className="text-white size-full" />
          ) : (
            <CiMenuBurger className="text-white size-full" />
          )}
        </Button>
      </div>

      {/* Menu */}
      <div
        className={`max-w-screen fixed inset-x-0 top-[72px] z-50 bg-white transition-transform duration-300 ${
          menuOpen ? "translate-y-0 shadow-md" : "-translate-y-full shadow-none"
        }`}
      >
        <ul className="flex flex-col p-4 space-y-2 max-h-[calc(100vh-72px)] overflow-y-auto">
          <li>
            <Link
              href="/"
              className="text-lg font-medium block py-2"
              onClick={closeAll}
            >
              View
            </Link>
          </li>

          <li>
            <Separator />
          </li>

          <li>
            <button
              type="button"
              aria-expanded={open.import}
              aria-controls="submenu-import"
              onClick={() => toggleSub("import")}
              className="w-full text-left text-lg font-medium flex items-center justify-between py-2"
              title="Toggle import submenu"
            >
              Import
              <FaChevronDown
                className={`ml-2 transition-transform ${
                  open.import ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>
            <div
              id="submenu-import"
              role="region"
              className={`overflow-hidden transition-[max-height,opacity] duration-300 ${
                open.import ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
              }`}
              title="Import submenu"
            >
              <ul className="mt-1 mb-2 rounded-md border bg-white">
                <SubLink href="/?tab=import_labelled_csv">Labelled CSV</SubLink>
                <SubLink href="/?tab=import_unlabelled_csv">
                  Unlabelled CSV
                </SubLink>
                <SubLink href="/?tab=import_vines_csv">Vines CSV</SubLink>
                <SubLink href="/?tab=import_geojson">Geojson</SubLink>
                <SubLink href="/?tab=import_outfields_geojson">
                  Outfields Geojson
                </SubLink>
                <SubLink href="/?tab=import_shapefile">Shapefile</SubLink>
              </ul>
            </div>
          </li>

          <li>
            <Separator />
          </li>

          <li>
            <button
              type="button"
              aria-expanded={open.create}
              aria-controls="submenu-create"
              onClick={() => toggleSub("create")}
              className="w-full text-left text-lg font-medium flex items-center justify-between py-2"
              title="Toggle create submenu"
            >
              Create
              <FaChevronDown
                className={`ml-2 transition-transform ${
                  open.create ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>
            <div
              id="submenu-create"
              role="region"
              className={`overflow-hidden transition-[max-height,opacity] duration-300 ${
                open.create ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <ul className="mt-1 mb-2 rounded-md border bg-white">
                <SubLink href="/?tab=create_map">Create Map</SubLink>
                <SubLink href="/?tab=edit_map">Edit Map</SubLink>
              </ul>
            </div>
          </li>

          {user.role === "admin" && (
            <>
              <li>
                <Separator />
              </li>
              <li>
                <button
                  type="button"
                  aria-expanded={open.admin}
                  aria-controls="submenu-admin"
                  onClick={() => toggleSub("admin")}
                  className="w-full text-left text-lg font-medium flex items-center justify-between py-2"
                  title="Toggle admin submenu"
                >
                  Admin
                  <FaChevronDown
                    className={`ml-2 transition-transform ${
                      open.admin ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>
                <div
                  id="submenu-admin"
                  role="region"
                  className={`overflow-hidden transition-[max-height,opacity] duration-300 ${
                    open.admin ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <ul className="mt-1 mb-2 rounded-md border bg-white">
                    <SubLink href="/admin?tab=users">Users</SubLink>
                    <SubLink href="/admin?tab=invite_codes">
                      Invite Codes
                    </SubLink>
                    <SubLink href="/admin?tab=delete_entity">
                      Delete Entity
                    </SubLink>
                    <SubLink href="/admin?tab=api_keys">API Keys</SubLink>
                    <SubLink href="/admin?tab=orion_viewer">
                      Orion Viewer
                    </SubLink>
                  </ul>
                </div>
              </li>
              <li className="mt-2 items-right flex justify-end">
                <LogoutButton />
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Backdrop to darken background content and close menu on click */}
      <button
        aria-label="Close menu backdrop"
        className={`fixed inset-0 z-30 bg-black/40 ${
          menuOpen ? "block" : "hidden"
        }`}
        onClick={closeAll}
      />
    </nav>
  );
}
