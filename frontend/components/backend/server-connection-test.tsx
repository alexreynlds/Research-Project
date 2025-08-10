"use client";

import { useEffect, useState } from "react";

export default function ServerConnectionTest() {
  const [status, setStatus] = useState("Checking...");

  async function checkServerConnection() {
    setStatus("Checking...");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/health`, {});

      if (response.ok) {
        const data = await response.json();
        console.log("Server response:", data);

        setStatus(data?.status === "ok" ? "Connected to server" : "Failed to connect to server");
      }
      else {
        setStatus("Failed to connect to server");
      }
    }
    catch (error) {
      console.log("Error connecting to the server: ", error);
      setStatus("Failed to connect to server");
    }
  }

  useEffect(() => {
    checkServerConnection();

    const id = setInterval(checkServerConnection, 15000);
    return () => clearInterval(id);
  }, []);

  const label = status === "Connected to server" ? "bg-green-500" : "bg-red-500";

  return (
    <div className="border-2 rounded-lg p-4 w-full bg-cyan-200 flex flex-col items-center gap-3">
      <h2><b>Server Connection Status:</b></h2>
      <p className={`${label} text-white p-2 rounded-md`}>
        {status}
      </p>
    </div >
  )
}
