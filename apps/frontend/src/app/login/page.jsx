"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/components/auth/auth_context";
import { toast } from "sonner";

export default function Page() {
  const router = useRouter();
  const { signIn, register } = useAuth();

  const [page, setPage] = useState(0);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  const [error, setError] = useState("");

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      toast.success("Login successful!");
      router.replace("/");
    } catch (e) {
      console.log(e);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Require matching passwords
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Require minimum password length
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    // Require invite code
    if (!inviteCode) {
      toast.error("Invite code is required for registration.");
      return;
    }

    // Validate invite code
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/admin/invite_codes/${inviteCode}`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        },
      ).then((res) => {
        if (!res.ok) {
          throw new Error("Invalid invite code.");
        }
      });
    } catch (e) {
      toast.error(e.message);
      return;
    }

    // Attempt registration
    try {
      await register(email, password, inviteCode);
      console.log("Registration successful for:", email);
    } catch (e) {
      toast.error(`Registration failed: ${e.message}`);
      console.log(error);
    }

    toast.success("Registration successful! You can now log in.");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setPage(0);
  };

  const handleCardChange = () => {
    setPage((prevPage) => (prevPage === 0 ? 1 : 0));
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 relative">
      <div className="bg-[url(/img/field.jpg)] bg-cover blur-xs w-full h-full absolute" />
      <main className="flex flex-col gap-[24px] row-start-2 items-center  w-[25%] min-w-[375px] h-[100%] rounded-xl p-4 shadow-xl z-10 bg-white/70 backdrop-blur-md">
        <img
          src="/img/agrids_logo_transparent_crop.png"
          alt="agrids logo"
          className="h-10"
        />

        <div className="w-full h-full">
          {page === 0 ? (
            <div className="w-full h-full">
              <h1 className="text-xl font-bold">LOGIN</h1>
              <form
                className="flex flex-col w-full h-full"
                onSubmit={handleLogin}
              >
                <label className="text-sm text-gray-600">Email</label>
                <input
                  placeholder="Email"
                  type="email"
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
              <form
                className="flex flex-col w-full h-full"
                onSubmit={handleRegister}
              >
                <label className="text-sm text-gray-600">Email</label>
                <input
                  placeholder="Email"
                  type="email"
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
                <label className="text-sm text-gray-600">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="border-2 p-2 rounded-sm mb-2"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                />
                <label className="text-sm text-gray-600">Invite Code</label>
                <input
                  type="text"
                  value={inviteCode}
                  placeholder="Invite Code"
                  className="border-2 p-2 rounded-sm mb-2"
                  onChange={(e) => setInviteCode(e.target.value)}
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
                      Login instead
                    </a>
                  </span>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
