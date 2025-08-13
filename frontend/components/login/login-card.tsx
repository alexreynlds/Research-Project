"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const API = process.env.NEXT_PUBLIC_API_BASE;

// Helper function to handle JSON response, or to return null
async function jsonOrNull(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export default function LoginCard() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [page, setPage] = useState(1);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await jsonOrNull(response);

      if (!response.ok) {
        toast.error(`Login failed: ${data?.error ?? response.statusText}`);
        return;
      }

      toast.success("Login successful");
      router.push("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      toast.error("An error occurred during login");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        },
      );

      interface APIResponse {
        error?: string;
        [key: string]: unknown;
      }

      let data: APIResponse | null = null;
      try {
        data = await resp.json();
      } catch {}

      if (!resp.ok) {
        toast.error(
          `Account creation failed: ${data?.error ?? resp.statusText}`,
        );
        return;
      }

      toast.success(`Account creation success`);
      handleCardChange();
    } catch (err) {
      toast.error(
        `An error occurred during account creation: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
      );
    }
  };

  const handleCardChange = () => {
    if (page === 1) {
      setPage(2);
    } else {
      setPage(1);
    }
  };

  return page === 1 ? (
    <div className="w-full h-full">
      <h1 className="text-xl font-bold">LOGIN</h1>
      <form className="flex flex-col w-full h-full" onSubmit={handleLogin}>
        <label className="text-sm text-gray-600">Email</label>
        <input
          placeholder="Email"
          className="border-2 p-2 rounded-sm mb-2"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <label className="text-sm text-gray-600">Password</label>
        <input
          type="password"
          placeholder="Password"
          className="border-2 p-2 rounded-sm mb-2"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <div className="flex items-center justify-between mt-2 mb-4">
          <div className="flex items-center">
            <input type="checkbox" id="remember" className="mr-2" />
            <label htmlFor="remember" className="text-sm text-gray-600">
              Remember me
            </label>
          </div>
          <a href="#" className="text-sm text-blue-600 hover:underline">
            Forgot password?
          </a>
        </div>
        <button
          type="submit"
          className="bg-[#70b664] py-1 px-4 rounded-sm text-white hover:bg-[#5a9b52] transition-colors duration-300 cursor-pointer"
        >
          Login
        </button>
        <div className="mt-auto mb-4 flex justify-center w-full">
          <span className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <a
              onClick={handleCardChange}
              className="text-gray-800 font-bold hover:underline hover:text-blue-600 cursor-pointer"
            >
              Register Now!
            </a>
          </span>
        </div>
      </form>
    </div>
  ) : (
    <div className="w-full h-full">
      <h1 className="text-xl font-bold">REGISTER</h1>
      <form className="flex flex-col w-full h-full" onSubmit={handleRegister}>
        <label className="text-sm text-gray-600">Email</label>
        <input
          placeholder="Email"
          className="border-2 p-2 rounded-sm mb-2"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <label className="text-sm text-gray-600">Password</label>
        <input
          type="password"
          placeholder="Password"
          className="border-2 p-2 rounded-sm mb-2"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <label className="text-sm text-gray-600">Confirm Password</label>
        <input
          type="password"
          placeholder="Confirm Password"
          className="border-2 p-2 rounded-sm mb-2"
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
        />
        <button
          type="submit"
          className="bg-[#70b664] py-1 px-4 rounded-sm text-white hover:bg-[#5a9b52] transition-colors duration-300 cursor-pointer"
        >
          Register
        </button>
        <div className="mt-auto mb-4 flex justify-center w-full">
          <span className="text-sm text-gray-600">
            Already have an account?{" "}
            <a
              onClick={handleCardChange}
              className="text-gray-800 font-bold hover:underline hover:text-blue-600 cursor-pointer"
            >
              Login instead!
            </a>
          </span>
        </div>
      </form>
    </div>
  );
}
