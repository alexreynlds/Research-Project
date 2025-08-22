import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FaRegCopy } from "react-icons/fa";

function CodeRow({ code, onDeleteCode }) {
  return (
    <div className="rounded-lg border p-4 bg-white/70 backdrop-blur h-fit">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="font-semibold">{code.code}</div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(code.code);
                toast.success("Code copied to clipboard!");
              }}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
              title="Copy to clipboard"
            >
              <FaRegCopy />
            </button>
          </div>
          <div className="text-xs text-gray-600">
            id: {code.id} • {code.created_at}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onDeleteCode(code)}
          className="text-red-700 border border-red-300 px-3 py-1 rounded hover:bg-red-50 cursor-pointer"
        >
          Delete code
        </button>
      </div>
    </div>
  );
}

export default function InviteCodesPage() {
  const [loading, setLoading] = useState(true);
  const [codes, setCodes] = useState([]);

  const fetchCodes = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/admin/invite_codes`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch invite codes");
      }

      const codesJson = await response.json();

      const data = codesJson.codes || [];

      setCodes(data);
    } catch (error) {
      console.error("Error fetching codes:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCodes();
  }, []);

  const onGenerateCode = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/admin/invite_codes`,
        {
          method: "POST",
          credentials: "include",
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to generate code");
      }

      const codeJson = await response.json();

      const newCode = codeJson.code;

      fetchCodes();
      toast.success(`Code ${newCode} generated successfully.`);
    } catch (error) {
      console.error("Error generating code:", error);
      toast.error("Failed to generate code.");
    }
  };

  const onDeleteCode = async (code) => {
    if (!confirm(`Are you sure you want to delete code ${code}?`)) {
      return;
    }

    const prev = structuredClone(codes);
    setCodes(codes.filter((u) => u.id !== code.id));

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/admin/invite_codes/${code.id}`,
        {
          method: "DELETE",
          credentials: "include",
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete code");
      }
      toast.success(`Code ${code} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting code:", error);
      toast.error(`Failed to delete code ${code}.`);
      setCodes(prev);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <h2 className="text-3xl underline">Invite Codes</h2>

      <div className="w-full h-fit border-1 rounded p-2 flex gap-2 justify-center items-center ">
        <h3 className="">Generate new invite code:</h3>
        <button
          className="border-1 p-1 rounded cursor-pointer"
          onClick={onGenerateCode}
        >
          Generate Code
        </button>
      </div>

      {loading ? (
        <p>loading codes...</p>
      ) : codes.length ? (
        codes.map((code) => (
          <CodeRow key={code.id} code={code} onDeleteCode={onDeleteCode} />
        ))
      ) : (
        <p className="text-gray-500">No codes found</p>
      )}
    </div>
  );
}
