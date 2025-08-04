"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginCard() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    router.push("/dashboard");
  }

  return (
    <div className="w-full h-full">
      <h1 className="text-xl font-bold">LOGIN</h1>
      <form className="flex flex-col w-full h-full" onSubmit={handleLogin}>
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
        <button type="submit" className="bg-[#70b664] py-1 px-4 rounded-sm text-white hover:bg-[#5a9b52] transition-colors duration-300 cursor-pointer">
          Login
        </button>
        <div className="mt-auto mb-4 flex justify-center w-full">
          <span className="text-sm text-gray-600">
            Don't have an account? <a href="/register" className="text-gray-800 font-bold hover:underline hover:text-blue-600">Register Now!</a>
          </span>
        </div>

      </form>
    </div>
  )
}
