"use client";

import React from "react";
import NavbarButton from "./navbar_button";
import LogoutButton from "./logout_button";
import Link from "next/link";
import useAuth from "../auth/auth_context";

export default function DesktopNavbar({ pageTitle = "" }) {
  const { user } = useAuth();
  return (
    <nav className="border-2 p-4 rounded-2xl w-full h-[72px] justify-between shadow-md hidden md:flex mt-3">
      <h1 className="flex items-center gap-4 text-3xl font-medium">
        <Link href="/" title="agrids home page">
          {/* Switch to next/image at somepoint if you can be bothered - sizing is annoying */}
          <img
            src="/img/agrids_logo_transparent_crop.png"
            alt="agrids logo"
            className="h-10 mt-[-5px]"
          />
        </Link>
        Agrids Map - {pageTitle}
      </h1>
      <ul className="flex gap-2 text-lg font-medium items-center">
        <li>
          <NavbarButton href="/" name="Home">
            Home
          </NavbarButton>
        </li>
        {user && user.role === "admin" && (
          <li>
            <NavbarButton href="/admin" name="Admin Dashboard">
              Admin
            </NavbarButton>
          </li>
        )}
        <li>
          <LogoutButton />
        </li>
      </ul>
    </nav>
  );
}
