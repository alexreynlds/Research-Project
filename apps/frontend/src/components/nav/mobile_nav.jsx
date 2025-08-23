"use client";

import React from "react";
import NavbarButton from "./navbar_button";
import Link from "next/link";
import useAuth from "../auth/auth_context";

export default function MobileNav({ pageTitle = "" }) {
  const { user } = useAuth();
  return (
    <nav className="border-2 p-4 rounded-2xl w-full h-[72px] justify-between shadow-md flex md:hidden mt-3"></nav>
  );
}
