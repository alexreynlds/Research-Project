import { Button } from "../ui/button";
import { useState } from "react";
import { toast } from "sonner";

export default function ApiKeysPage() {
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState(null);

  async function generateApiKey() {
    setLoading(true);
    // Call the backend to generate a new API key
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/generate_key`,
      {
        method: "GET",
      },
    );

    if (!response.ok) {
      toast.error("Failed to generate API key");
      setLoading(false);
      return;
    }

    const data = await response.json();
    toast.success(`New API Key: ${data.api_key}. Please store it securely!`);
    setApiKey(data.api_key);
    setLoading(false);
  }

  return (
    <div className="w-full h-full flex flex-col gap-3">
      <h2 className="text-3xl mb-3 underline">Manage API Keys</h2>
      <Button className="cursor-pointer" onClick={generateApiKey}>
        Generate New API Key
      </Button>
      <div className="border rounded p-2">
        {loading && <p>Generating API key...</p>}
        {apiKey && !loading && (
          <p>
            New API Key: <strong>{apiKey}</strong> (Please store it securely!)
          </p>
        )}
        {!apiKey && !loading && (
          <p>Click the button above to generate a new API key.</p>
        )}
      </div>
    </div>
  );
}
