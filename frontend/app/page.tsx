"use client";

import Navbar from "@/components/navigation/Navbar";
import { useState } from "react";


export default function home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Username:", username);
    console.log("Password:", password);
  }

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 relative">
      <div className="bg-[url(/img/field.jpg)] bg-cover blur-xs w-full h-full absolute" />
      <main className="flex flex-col gap-[24px] row-start-2 items-center border-3 w-[25%] min-w-[350px] h-[100%] rounded-xl p-4 shadow-xl z-10 bg-white/70 backdrop-blur-md">
        <img
          src="/img/agrids_logo_transparent_crop.png"
          alt="agrids logo"
          className="h-10"
        />
        <h1 className="text-xl font-bold">LOGIN</h1>
        <form className="flex flex-col  w-full h-full" onSubmit={handleLogin}>
          <label className="text-sm text-gray-600">Username</label>
          <input placeholder="Username" className="border-2 p-2 rounded-sm mb-2" onChange={(e) => setUsername(e.target.value)} value={username} />
          <label className="text-sm text-gray-600">Password</label>
          <input type="password" placeholder="Password" className="border-2 p-2 rounded-sm mb-2" onChange={(e) => setPassword(e.target.value)} value={password} />
          <div className="flex items-center justify-between mt-2 mb-4">
            <div className="flex items-center">
              <input type="checkbox" id="remember" className="mr-2" />
              <label htmlFor="remember" className="text-sm text-gray-600">Remember me</label>
            </div>
            <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
          </div>
          <button type="submit" className="mt-auto bg-[#70b664] py-1 px-4 rounded-sm text-white hover:bg-[#5a9b52] transition-colors duration-300 cursor-pointer">
            Login
          </button>
        </form>
      </main>

    </div>
  );
}
