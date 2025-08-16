"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminAPIPage() {
  const [apiKeys, setApiKeys] = useState([]);

  async function fetchApiKeys() {
    try {
      console.log("Fetching API keys...");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/api_keys`,
        {
          credentials: "include",
          cache: "no-store",
        },
      );

      if (!res.ok) {
        toast.error("Failed to fetch API keys");
        return;
      }
      const data = await res.json();
      console.log("API keys fetched:", data);
      setApiKeys(data.api_keys || data.apiKeys || []);
      toast.success("API keys fetched successfully");
    } catch (error) {
      toast.error(`Error fetching API keys: ${error.message}`);
    }
  }

  return (
    <div className="w-full h-full">
      <button
        onClick={fetchApiKeys}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Fetch API Keys
      </button>

      {apiKeys.length > 0 ? (
        <ul className="space-y-2">
          {apiKeys.map((keyStr) => (
            <li key={keyStr} className="p-4 border rounded bg-gray-50">
              <div className="flex justify-between items-center">
                <span className="font-semibold break-all">{keyStr}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No API keys found.</p>
      )}
    </div>
  );
}
