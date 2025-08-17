"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

// Component to display a user's vineyards
function VineyardChip({ vineyard, onRemove }) {
  return (
    <span className="inline-flex items-center gap-4 px-3 py-1 rounded-full border-2">
      {vineyard.name}
      <button
        type="button"
        onClick={onRemove}
        className="px-2 bg-red-400 hover:bg-red-600 border-1 rounded-full cursor-pointer"
        aria-label={`Remove ${vineyard.name} vineyard`}
      >
        x
      </button>
    </span>
  );
}

// Component to display a user - containing their info and vineyards
function UserRow({
  user,
  vineyards,
  onAddVineyard,
  onRemoveVineyard,
  onDeleteUser,
}) {
  const [selected, setSelected] = useState("");

  return (
    <div className="rounded-lg border p-4 bg-white/70 backdrop-blur mb-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="font-semibold underline">{user.email}</div>
          <div className="text-xs text-gray-600">
            id: {user.id} • role: {user.account_type}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onDeleteUser(user)}
          className="text-red-700 border border-red-300 px-3 py-1 rounded hover:bg-red-50 cursor-pointer"
        >
          Delete user
        </button>
      </div>

      <div className="mt-3">
        <div className="text-sm font-medium mb-1 underline">Vineyards</div>
        <div className="flex flex-wrap">
          {user.vineyards?.length ? (
            user.vineyards.map((vineyard) => (
              <VineyardChip
                key={vineyard.id}
                vineyard={vineyard}
                onRemove={() => onRemoveVineyard(user, vineyard)}
              />
            ))
          ) : (
            <span className="text-sm text-gray-500">No vineyards</span>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 flex-col md:flex-row">
        <select
          className="border rounded px-2 py-1"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          <option value="">Select a vineyard…</option>
          {vineyards.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name} — {v.type}
            </option>
          ))}
        </select>
        <button
          type="button"
          disabled={!selected}
          onClick={() => {
            if (!selected) return;
            onAddVineyard(user, selected);
            setSelected("");
          }}
          className="border px-3 py-1 rounded hover:bg-gray-50 disabled:opacity-50"
        >
          Add to user
        </button>
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [vineyards, setVineyards] = useState([]);
  const [loading, setLoading] = useState(true);
  // TODO: implement filtering
  const [filter, setFilter] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [usersRes, vineyardsRes] = await Promise.all([
          fetch(`/api/admin/users`, {
            credentials: "include",
            cache: "no-store",
          }),

          fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/admin/vineyards`, {
            credentials: "include",
            cache: "no-store",
          }),
        ]);

        if (!usersRes.ok || !vineyardsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const [usersJson, vineyardsJson] = await Promise.all([
          usersRes.json(),
          vineyardsRes.json(),
        ]);
        setUsers(usersJson.users ?? usersJson);
        setVineyards(vineyardsJson.vineyards ?? vineyardsJson);
      } catch (error) {
        toast.error(`Failed to load users: ${error.message}`);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Function to update a user in the state
  const upsertUser = (updated) => {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  };

  // Function to add a vineyard to a user
  const onAddVineyard = async (user, vineyardId) => {
    console.log("Adding vineyard", vineyardId, "to user", user.email);
    const vineyard = vineyards.find(
      (vineyard) => String(vineyard.id) === String(vineyardId),
    );

    if (!vineyard) return;

    const prev = structuredClone(user);
    const next = {
      ...user,
      vineyards: [...(user.vineyards || []), vineyard],
    };
    upsertUser(next);

    try {
      const res = await fetch(`/api/admin/users/${user.id}/vineyards`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vineyardId }),
      });
      if (!res.ok) {
        throw new Error("Failed to add vineyard");
      }
      toast.success(`Added ${vineyard.name} to ${user.email}`);
    } catch (e) {
      upsertUser(prev);
      toast.error(`Failed to add vineyard: ${e.message}`);
    }
  };

  // Function to handle removing a vineyard from a user
  const onRemoveVineyard = async (user, vineyard) => {
    const prev = structuredClone(user);
    const next = {
      ...user,
      vineyards: user.vineyards.filter(
        (vineyard) => vineyard.id !== vineyard.id,
      ),
    };
    upsertUser(next);

    try {
      const res = await fetch(
        `/api/admin/users/${user.id}/vineyards/${vineyard.id}`,
        { method: "DELETE", credentials: "include" },
      );
      if (!res.ok) {
        throw new Error("Failed to remove vineyard");
      }
      toast.success(`Removed ${vineyard.name} from ${user.email}`);
    } catch (e) {
      upsertUser(prev);
      toast.error(`Failed to remove vineyard: ${e.message}`);
    }
  };

  // Function to delete a user - cant delete admins
  const onDeleteUser = async (user) => {
    if (!confirm(`Are you sure you want to delete user ${user.email}?`)) return;

    if (user.account_type === "admin") {
      toast.error("Cannot delete admin users");
      return;
    }

    const prev = structuredClone(user);
    setUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));

    try {
      const res = await fetch(`/api/admin/user/${user.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Failed to delete user");
      }
      toast.success(`Deleted user ${user.email}`);
    } catch (e) {
      setUsers((prevUsers) => [...prevUsers, prev]);
      toast.error(`Failed to delete user: ${e.message}`);
    }
  };

  return (
    <div className="w-full h-full">
      <h2 className="text-3xl mb-3 underline">Users List</h2>

      {loading ? (
        <p>loading users...</p>
      ) : users.length ? (
        users.map((user) => (
          <UserRow
            key={user.id}
            user={user}
            vineyards={vineyards}
            onAddVineyard={onAddVineyard}
            onRemoveVineyard={onRemoveVineyard}
            onDeleteUser={onDeleteUser}
          />
        ))
      ) : (
        <p className="text-gray-500">No users found</p>
      )}
    </div>
  );
}
