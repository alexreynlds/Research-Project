import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function UserRow({
  user,
  // vineyards,
  // onAddVineyard,
  // onRemoveVineyard,
  onDeleteUser,
}) {
  const [selected, setSelected] = useState("");
  const [deleting, setDeleting] = useState(false);

  return (
    <div className="rounded-lg border p-4 bg-white/70 backdrop-blur mb-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="font-semibold underline">{user.email}</div>
          <div className="text-xs text-gray-600">
            id: {user.id} • role: {user.role}
          </div>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button type="button" variant="destructive" disabled={deleting}>
              Delete user
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete selected user?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. It will permanently remove{" "}
                <b>{user.email}</b>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setDeleting(true);
                  onDeleteUser(user);
                }}
                disabled={deleting}
              >
                {deleting ? "Deleting…" : "Confirm Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="mt-3">
        {/* <div className="text-sm font-medium mb-1 underline">Vineyards</div> */}
        {/* <div className="flex flex-wrap"> */}
        {/*   {user.vineyards?.length ? ( */}
        {/*     user.vineyards.map((vineyard) => ( */}
        {/*       <VineyardChip */}
        {/*         key={vineyard.id} */}
        {/*         vineyard={vineyard} */}
        {/*         onRemove={() => onRemoveVineyard(user, vineyard)} */}
        {/*       /> */}
        {/*     )) */}
        {/*   ) : ( */}
        {/*     <span className="text-sm text-gray-500">No vineyards</span> */}
        {/*   )} */}
        {/* </div> */}
      </div>

      {/* <div className="mt-3 flex items-center gap-2 flex-col md:flex-row"> */}
      {/*   <select */}
      {/*     className="border rounded px-2 py-1" */}
      {/*     value={selected} */}
      {/*     onChange={(e) => setSelected(e.target.value)} */}
      {/*   > */}
      {/*     <option value="">Select a vineyard…</option> */}
      {/*     {vineyards.map((v) => ( */}
      {/*       <option key={v.id} value={v.id}> */}
      {/*         {v.name} — {v.type} */}
      {/*       </option> */}
      {/*     ))} */}
      {/*   </select> */}
      {/*   <button */}
      {/*     type="button" */}
      {/*     disabled={!selected} */}
      {/*     onClick={() => { */}
      {/*       if (!selected) return; */}
      {/*       onAddVineyard(user, selected); */}
      {/*       setSelected(""); */}
      {/*     }} */}
      {/*     className="border px-3 py-1 rounded hover:bg-gray-50 disabled:opacity-50" */}
      {/*   > */}
      {/*     Add to user */}
      {/*   </button> */}
      {/* </div> */}
    </div>
  );
}

export default function UsersPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/admin/users`,
        {
          credentials: "include",
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const userJson = await response.json();

      const data = userJson.users || [];

      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onDeleteUser = async (user) => {
    if (user.role === "admin") {
      toast.error("You cannot delete an admin user.");
      return;
    }

    const prev = structuredClone(users);
    setUsers(users.filter((u) => u.id !== user.id));

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/admin/users/${user.id}`,
        {
          method: "DELETE",
          credentials: "include",
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      toast.success(`User ${user.email} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(`Failed to delete user ${user.email}.`);
      setUsers(prev);
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
            onDeleteUser={onDeleteUser}
            // vineyards={vineyards}
            // onAddVineyard={onAddVineyard}
            // onRemoveVineyard={onRemoveVineyard}
          />
        ))
      ) : (
        <p className="text-gray-500">No users found</p>
      )}
    </div>
  );
}
