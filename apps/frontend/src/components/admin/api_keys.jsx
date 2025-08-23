import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

export default function ApiKeysPage() {
  return (
    <div className="w-full h-full">
      <h2 className="text-3xl mb-3 underline">Manage API Keys</h2>
      <Button className="cursor-pointer">Generate New API Key</Button>
    </div>
  );
}
