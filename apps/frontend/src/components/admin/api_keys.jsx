import { Button } from "../ui/button";
import { useState } from "react";
import { toast } from "sonner";

export default function ApiKeysPage() {
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState(null);

  async function generateApiKey() {
    setLoading(true);
    // Call the backend to generate a new API key
    // Currently just returns a random uuid4 string
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/generate_key`,
      {
        method: "GET",
      },
    );

    // If theres an error, toast it
    if (!response.ok) {
      toast.error("Failed to generate API key");
      setLoading(false);
      return;
    }

    // If successful, set the new API key and toast it
    const data = await response.json();
    toast.success(`New API Key: ${data.api_key}. Please store it securely.`);
    setApiKey(data.api_key);
    setLoading(false);
  }

  return (
    <div className="w-full h-full flex flex-col gap-3 ">
      <h1 className="text-3xl mb-3 underline">Manage API Keys</h1>

      {/* Generate new key button */}
      <Button className="cursor-pointer" onClick={generateApiKey}>
        Generate New API Key
      </Button>

      {/* Display the new API key */}
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
