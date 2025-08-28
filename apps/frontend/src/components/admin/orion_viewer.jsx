"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { IoIosRefresh } from "react-icons/io";

export default function OrionViewerPage() {
  const [endpoint, setEndpoint] = useState("/api/orion/proxy/v2/entities");
  const [limit, setLimit] = useState(25);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch data from the selected endpoint (Default entities)
  async function fetchNow() {
    setLoading(true);
    setError("");
    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE}${endpoint}?limit=${limit}`;
      const res = await fetch(url, {
        credentials: "include",
        cache: "no-store",
      });
      const text = await res.text();
      let body;
      try {
        body = JSON.parse(text);
      } catch {
        body = text;
      }
      setData(body);
      if (!res.ok) {
        setError(typeof body === "string" ? body : JSON.stringify(body));
      }
    } catch (e) {
      setError(String(e));
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNow();
  }, [endpoint, limit]);

  return (
    <main className="w-full h-full flex flex-col gap-3 ">
      <h1 className="text-3xl mb-3 underline">Orion Viewer</h1>

      {/* Controls */}
      <div className="flex">
        <div className="flex flex-col md:flex-row items-center gap-3 w-full">
          {/* Let the user select from the main endpoints */}
          <div className="flex flex-row w-full gap-3">
            <Label>Endpoint</Label>
            <Select value={endpoint} onValueChange={setEndpoint}>
              <SelectTrigger>
                <SelectValue placeholder="Select endpoint" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="/api/orion/proxy/version">
                  /version
                </SelectItem>
                <SelectItem value="/api/orion/proxy/v2/entities">
                  /v2/entities
                </SelectItem>
                <SelectItem value="/api/orion/proxy/v2/subscriptions">
                  /v2/subscriptions
                </SelectItem>
                <SelectItem value="/api/orion/proxy/v2/registrations">
                  /v2/registrations
                </SelectItem>
                <SelectItem value="/api/orion/proxy/v2/types">
                  /v2/types
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-row w-full gap-3">
            <Label>Limit</Label>
            <Input
              type="number"
              min={1}
              max={1000}
              value={limit}
              className="w-20"
              onChange={(e) => setLimit(Number(e.target.value || 25))}
            />
          </div>

          <Button
            onClick={fetchNow}
            disabled={loading}
            className="w-full md:w-auto"
          >
            Refresh
            <IoIosRefresh className="ml-2" />
          </Button>
        </div>
      </div>

      {/* Display the results */}
      <pre className="p-3 rounded border bg-muted/30 overflow-auto text-sm min-h-48">
        {loading
          ? "Loading…"
          : error
            ? `Error:\n${error}`
            : typeof data === "string"
              ? data
              : JSON.stringify(data, null, 2)}
      </pre>
    </main>
  );
}
