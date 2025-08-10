import React from "react";
import NavbarButton from "./navbar-button";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-2 p-3 rounded-2xl w-[80%] h-[5rem] flex justify-between">
      <h1 className="flex items-center gap-4 text-3xl font-medium">
        <Link href="/" title="agrids home page">
          {/* Switch to next/image at somepoint if you can be bothered - sizing is annoying */}
          <img
            src="/img/agrids_logo_transparent_crop.png"
            alt="agrids logo"
            className="h-10 mt-[-5px]"
          />
        </Link>
        Agrids Map
      </h1>
      <ul className="flex gap-2 text-lg font-medium items-center">
        <NavbarButton href="/">Home</NavbarButton>
        <NavbarButton href="login">View Vineyard</NavbarButton>
        <NavbarButton href="register">Import</NavbarButton>
        <NavbarButton href="register">Create</NavbarButton>
        <NavbarButton href="register">Robotics</NavbarButton>
        <NavbarButton href="register">Admin Development</NavbarButton>
        <NavbarButton href="register">Logout</NavbarButton>
      </ul>
    </nav>
  );
}

