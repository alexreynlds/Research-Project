"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
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

export default function DeleteEntitiesPage() {
  // const [entities, setEntities] = useState([]);
  // Defining entities with some example ones, do this via API in future
  const [entities, setEntities] = useState([
    {
      id: "entity-001",
      type: "Vineyard",
      vineyard_id: "vineyard-001",
      name: "Sunny Acres",
      user_defined_id: "SA-01",
    },
    {
      id: "entity-002",
      type: "VineRow",
      vineyard_id: "vineyard-001",
      name: "Row 1",
      user_defined_id: "VR-01",
    },
    {
      id: "entity-003",
      type: "Vine",
      vineyard_id: "vineyard-001",
      name: "Pinot Noir Vine 1",
      user_defined_id: "V-001",
    },
    {
      id: "entity-004",
      type: "Vine",
      vineyard_id: "vineyard-001",
      name: "Pinot Noir Vine 2",
      user_defined_id: "V-002",
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [selected, setSelected] = useState(() => new Set());
  const [filter, setFilter] = useState("");

  // Fetch entities
  useEffect(() => {
    let cancelled = false;
    async function fetchEntities() {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/api/entities`,
          {
            credentials: "include",
          },
        );
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        if (!cancelled)
          setEntities(Array.isArray(data) ? data : data.items || []);
      } catch (e) {
        console.error("Failed to load entities:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchEntities();
    return () => {
      cancelled = true;
    };
  }, []);

  // Simple filtering of entities
  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return entities;
    return entities.filter((e) => {
      const s = [e.id, e.vineyard_id, e.type, e.name, e.user_defined_id]
        .join(" ")
        .toLowerCase();
      return s.includes(q);
    });
  }, [entities, filter]);

  const selectedCount = selected.size;
  const allSelected = filtered.length > 0 && selectedCount === filtered.length;
  const someSelected = selectedCount > 0 && !allSelected;

  function toggleOne(id, checked) {
    const next = new Set(selected);
    if (checked) next.add(id);
    else next.delete(id);
    setSelected(next);
  }

  function toggleAll(checked) {
    if (checked) {
      const next = new Set(filtered.map((e) => e.id));
      setSelected(next);
    } else {
      setSelected(new Set());
    }
  }

  // Handle delete
  async function handleDeleteConfirmed() {
    if (selected.size === 0) return;
    setDeleting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/entities`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ entity_ids: Array.from(selected) }),
        },
      );

      console.log(JSON.stringify({ entity_ids: Array.from(selected) }));

      if (!res.ok) throw new Error(await res.text());

      const remaining = entities.filter((e) => !selected.has(e.id));
      setEntities(remaining);
      setSelected(new Set());
      toast.success(`Deleted ${selectedCount} entities.`);
    } catch (e) {
      console.error("Delete failed:", e);
      alert(e.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <main className="w-full mx-auto">
      <h1 className="text-3xl mb-3 underline">Delete Entity</h1>

      <div className="flex flex-col sm:flex-row items-center gap-2 mb-3">
        {/* Search box */}
        <Input
          placeholder="Filter by vineyard, type, name, id…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="sm:max-w-sm"
        />

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              disabled={selected.size === 0 || deleting}
              className="ml-auto w-full md:w-auto"
            >
              Delete Selected Entities
              {selectedCount ? ` (${selectedCount})` : ""}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete selected entities?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. It will permanently remove{" "}
                <b>{selectedCount}</b> selected{" "}
                {selectedCount === 1 ? "entity" : "entities"}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirmed}
                disabled={deleting}
              >
                {deleting ? "Deleting…" : "Confirm Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Entity table */}
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    allSelected ? true : someSelected ? "indeterminate" : false
                  }
                  onCheckedChange={(v) => toggleAll(Boolean(v))}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Vineyard</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>User Defined ID</TableHead>
              <TableHead className="text-right">Entity ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading…
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No entities found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((e) => (
                <TableRow key={e.id} className="hover:bg-muted/30">
                  <TableCell>
                    <Checkbox
                      checked={selected.has(e.id)}
                      onCheckedChange={(v) => toggleOne(e.id, Boolean(v))}
                      aria-label={`Select entity ${e.id}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{e.vineyard_id}</TableCell>
                  <TableCell className="uppercase">{e.type}</TableCell>
                  <TableCell>{e.name}</TableCell>
                  <TableCell className="font-mono">
                    {e.user_defined_id}
                  </TableCell>
                  <TableCell className="text-right font-mono">{e.id}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
