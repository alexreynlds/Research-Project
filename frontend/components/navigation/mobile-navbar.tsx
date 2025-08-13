"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { useAuth } from "../lib/useAuth";
import LogoutButton from "./logout-button";

export default function MobileNavbar() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  // Ensure the menu closes when clicking outside
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => firstLinkRef.current?.focus(), 10);
      return () => clearTimeout(t);
    } else {
      buttonRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <nav className="relative md:hidden">
      {/* Top bar - logo and menu button */}
      <div className="border-2 p-3 rounded-2xl w-full h-[5rem] flex justify-between items-center shadow-md bg-white">
        <h1 className="flex items-center gap-3 text-2xl font-semibold">
          <Link
            href="/dashboard"
            title="AGRIDs home page"
            className="flex items-center gap-3"
          >
            <img
              src="/img/agrids_logo_transparent_crop.png"
              alt="AGRIDs logo"
              className="h-10 -mt-[2px] select-none"
              draggable={false}
            />
            <span className="sr-only">AGRIDs</span>
          </Link>
        </h1>

        {/* Menu Toggle */}
        <button
          ref={buttonRef}
          onClick={toggleMenu}
          className="w-11 h-11 inline-flex items-center justify-center rounded-xl border border-gray-200 hover:border-gray-300 active:scale-[0.98] transition-transform"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? (
            <AiOutlineClose className="w-6 h-6" />
          ) : (
            <AiOutlineMenu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Background overlay -- closes when pressed */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity duration-100 
        ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} 
        motion-reduce:transition-none`}
        onClick={closeMenu}
      />

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        className={`absolute w-full z-50 rounded-2xl bg-white shadow-lg  top-0
        overflow-hidden transition-all duration-100 will-change-transform
        ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3 pointer-events-none"} 
        motion-reduce:transition-none`}
      >
        <div className={`duration-200 ${isOpen ? "p-2" : "p-0"}`}>
          <ul className="flex flex-col gap-1 p-1 text-lg font-medium relative">
            <li className="border-b-2 pb-2 mb-2">
              <div
                className={`
                    block rounded-xl px-4 py-3
                    motion-reduce:transition-none relative h-[52px] underline
                  `}
              >
                <p className="text-xl font-semibold">AGRIDs MENU</p>
                <button
                  ref={buttonRef}
                  onClick={closeMenu}
                  className="w-fit text-left px-4 py-3 rounded-xl hover:bg-gray-100 active:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors motion-reduce:transition-none absolute right-0 bg-red-500 top-0"
                >
                  <AiOutlineClose className="inline-block w-6 h-6" />
                </button>
              </div>
            </li>
            {[{ href: "/dashboard", label: "Dashboard" }].map((item, i) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  ref={i === 0 ? firstLinkRef : null}
                  onClick={closeMenu}
                  className={`
                    block rounded-xl px-4 py-3
                    hover:bg-gray-100 active:bg-gray-200
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                    transition-colors
                    motion-reduce:transition-none
                  `}
                >
                  {item.label}
                </Link>
              </li>
            ))}

            <li className="">
              <LogoutButton className="w-full h-[52px]" />
            </li>
          </ul>

          {user && (
            <div className="px-4 py-2 text-sm text-gray-500 border-t mt-2">
              Signed in as <span className="font-semibold">{user.email}</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
