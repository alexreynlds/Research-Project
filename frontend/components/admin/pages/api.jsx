"use client";

import { useEffect, useState } from "react";
import { FaCopy } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast } from "sonner";

export default function AdminAPIPage() {
  const [apiKeys, setApiKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newKey, setNewKey] = useState("");

  async function fetchApiKeys() {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/api_keys`, {
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) {
        toast.error("Failed to fetch API keys");
        return;
      }
      const data = await res.json();
      setApiKeys(data.api_keys || data.apiKeys || []);
    } catch (error) {
      toast.error(`Error fetching API keys: ${error.message}`);
    }
    setIsLoading(false);
  }

  async function generateAPIKey() {
    try {
      const res = await fetch(`/api/api_keys`, {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to generate API key");

      setNewKey(data.api_key || data.apiKey || "");
      toast.success("New API key generated successfully");
      await fetchApiKeys();
    } catch (error) {
      toast.error(`Error generating API key: ${error.message}`);
    }
  }

  async function deleteAPIKey(key) {
    if (!confirm("Are you sure you want to delete this API key?")) return;

    try {
      const res = await fetch(`/api/api_keys/${key}`, {
        method: "DELETE",
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete API key");
      toast.success("API key deleted successfully");
      await fetchApiKeys();
    } catch (error) {
      toast.error(`Error deleting API key: ${error.message}`);
    }
  }

  useEffect(() => {
    fetchApiKeys();
  }, []);

  return (
    <div className="w-full h-full">
      <div className="flex gap-3">
        <button
          onClick={fetchApiKeys}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
        >
          Fetch API Keys
        </button>

        <button
          onClick={generateAPIKey}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
        >
          Generate new API Key
        </button>
      </div>

      {newKey && (
        <div className="p-4 border rounded bg-yellow-50 mb-2">
          <p className="font-semibold mb-1">
            Copy your new API key (shown only once):
          </p>
          <code className="break-all">{newKey}</code>
          <div className="mt-2">
            <button
              onClick={() => copy(newKey)}
              className="px-3 py-1 border rounded hover:bg-yellow-100 cursor-pointer"
            >
              Copy key
            </button>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center h-16">
          <span className="text-gray-500">Loading API keys...</span>
        </div>
      )}

      {apiKeys.length > 0 ? (
        <ul className="space-y-2">
          {apiKeys.map((keyStr) => (
            <li key={keyStr} className="p-4 border rounded bg-gray-50">
              <div className="flex flex-col sm:flex-row justify-between items-center relative gap-4 sm:justify-between w-full">
                <span className="font-semibold break-all">{keyStr}</span>
                <div className="flex w-full sm:w-auto">
                  <button
                    onClick={() => copy(keyStr)}
                    title="Copy API Key"
                    className="px-3 py-1 border rounded hover:bg-gray-100 cursor-pointer w-full sm:w-auto"
                  >
                    <FaCopy />
                  </button>
                  <button
                    onClick={() => deleteAPIKey(keyStr)}
                    title="Delete API Key"
                    className="ml-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer w-full sm:w-auto"
                  >
                    <MdDelete />
                  </button>
                </div>
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
