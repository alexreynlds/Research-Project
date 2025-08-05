"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginCard() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [page, setPage] = useState(1);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    router.push("/dashboard");
  }

  const handleCardChange = () => {
    if (page === 1) {
      setPage(2);
    } else {
      setPage(1);
    }
  }

  return (
    page === 1 ? (
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
              Don&apos;t have an account? <a onClick={handleCardChange} className="text-gray-800 font-bold hover:underline hover:text-blue-600 cursor-pointer">Register Now!</a>
            </span>
          </div>
        </form>
      </div>
    ) :
      (
        <div className="w-full h-full">
          <h1 className="text-xl font-bold">REGISTER</h1>
          <form className="flex flex-col w-full h-full" onSubmit={handleLogin}>
            <label className="text-sm text-gray-600">Username</label>
            <input placeholder="Username" className="border-2 p-2 rounded-sm mb-2" onChange={(e) => setUsername(e.target.value)} value={username} />
            <label className="text-sm text-gray-600">Password</label>
            <input type="password" placeholder="Password" className="border-2 p-2 rounded-sm mb-2" onChange={(e) => setPassword(e.target.value)} value={password} />
            <label className="text-sm text-gray-600">Confirm Password</label>
            <input type="password" placeholder="Confirm Password" className="border-2 p-2 rounded-sm mb-2" onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} />
            <button type="submit" className="bg-[#70b664] py-1 px-4 rounded-sm text-white hover:bg-[#5a9b52] transition-colors duration-300 cursor-pointer">
              Register
            </button>
            <div className="mt-auto mb-4 flex justify-center w-full">
              <span className="text-sm text-gray-600">
                Already have an account? <a onClick={handleCardChange} className="text-gray-800 font-bold hover:underline hover:text-blue-600 cursor-pointer">Login instead!</a>
              </span>
            </div>
          </form>
        </div>
      )
  )
}
