import React from "react";

export default function Navbar() {
  return (
    <nav className="border-2 p-3 rounded-2xl w-[80%] flex justify-between">
      <h1 className="flex items-center gap-4 text-3xl font-medium">
        <a href="/" title="agrids home page">
          <img
            src="/img/agrids_logo_transparent_crop.png"
            alt="agrids logo"
            className="h-10 mt-[-5px]"
          />
        </a>
        Agrids Map
      </h1>
      <ul className="flex gap-4 text-lg font-medium items-center">
        <li className="bg-[#70b664] py-1 px-4 rounded-xl text-white hover:bg-[#5a9b52] transition-colors duration-300">
          <a href="">home</a>
        </li>
        <li className="bg-[#70b664] py-1 px-4 rounded-xl text-white hover:bg-[#5a9b52] transition-colors duration-300">
          <a href="">login</a>
        </li>
        <li className="bg-[#70b664] py-1 px-4 rounded-xl text-white hover:bg-[#5a9b52] transition-colors duration-300">
          <a href="">register</a>
        </li>
      </ul>
    </nav>
  );
}

