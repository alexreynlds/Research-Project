"use client";

import { useRef, useEffect, useState } from "react";
import * as mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { toast } from "sonner";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MobilePageTitle from "@/components/layouts/mobile_page_title";

const SRC_ID = "uploaded-src";
const ROWS_LAYER = "rows-layer";

export default function ImportLabelledEndPostsCsv() {
  const fileRef = useRef(null);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  // Vineyard metadata (kept for UI parity)
  const [vineyardID, setVineyardID] = useState("");
  const [vineyardName, setVineyardName] = useState("");
  const [address, setAddress] = useState("");
  const [owner, setOwner] = useState("");

  // Generated data
  const [geojson, setGeojson] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
    if (!mapboxgl.accessToken) {
      console.warn("Missing NEXT_PUBLIC_MAPBOX_TOKEN env var.");
    }

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [-0.9772342405497342, 51.59632509886086],
      zoom: 17,
    });
    mapRef.current = map;

    map.on("error", (e) => {
      toast.error("Mapbox GL error:", e && e.error);
    });

    map.on("load", () => {
      map.addControl(new mapboxgl.NavigationControl(), "top-right");

      if (!map.getSource(SRC_ID)) {
        map.addSource(SRC_ID, {
          type: "geojson",
          data: { type: "FeatureCollection", features: [] },
        });
      }

      // Rows (lines)
      if (!map.getLayer(ROWS_LAYER)) {
        map.addLayer({
          id: ROWS_LAYER,
          type: "line",
          source: SRC_ID,
          filter: ["==", ["get", "lineType"], "vine_row"],
          paint: { "line-color": "#00d1ff", "line-width": 3 },
        });
      }
    });

    return () => {
      try {
        map.remove();
      } catch (_) {}
      mapRef.current = null;
    };
  }, []);

  // Adjust map view to fit the given features
  function fitToFeatures(fc) {
    if (!mapRef.current) return;
    const coords = [];
    for (const f of fc.features || []) {
      if (!f.geometry) continue;
      const g = f.geometry;
      if (g.type === "Point") coords.push(g.coordinates);
      else if (g.type === "LineString") coords.push(...g.coordinates);
    }
    if (coords.length < 2) return;
    const bounds = coords.reduce(
      (b, c) => b.extend(c),
      new mapboxgl.LngLatBounds(coords[0], coords[0]),
    );
    mapRef.current.fitBounds(bounds, { padding: 40, duration: 600 });
  }

  // Convert CSV to GeoJSON FeatureCollection of LineStrings
  function parseCsvToGeoJSON(text) {
    const round6 = (n) => Math.round(Number(n) * 1e6) / 1e6;

    const lines = text.split(/\r?\n/).filter((l) => l.trim().length);
    if (lines.length < 2) return { type: "FeatureCollection", features: [] };

    const headers = lines[0].split(",").map((h) => h.trim());
    const iLat = headers.findIndex((h) => h.toLowerCase() === "latitude");
    const iLon = headers.findIndex((h) => h.toLowerCase() === "longitude");
    const iRow = headers.findIndex((h) => h.toLowerCase() === "row");
    if (iLat < 0 || iLon < 0 || iRow < 0) {
      throw new Error(
        'CSV must have "Latitude", "Longitude", and "Row" columns.',
      );
    }

    const byRow = new Map();
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(","); // simple CSV
      if (cols.length < headers.length) continue;

      const lat = parseFloat(cols[iLat]);
      const lon = parseFloat(cols[iLon]);
      const row = String(cols[iRow]).trim();
      if (!Number.isFinite(lat) || !Number.isFinite(lon) || !row) continue;

      const arr = byRow.get(row) || [];
      arr.push([round6(lon), round6(lat)]); // [lng, lat]
      byRow.set(row, arr);
    }

    const features = [];
    byRow.forEach((pts, rowNo) => {
      if (pts.length >= 2) {
        const [a, b] = pts.slice(0, 2);

        features.push({
          type: "Feature",
          geometry: { type: "LineString", coordinates: [a, b] },
          properties: {
            lineType: "vine_row",
            vineRowUserDefinedID: "",
            vineRowBlockID: "",
            vineRowOrientation: 0,
            vineyard_id: vineyardID || "",
            row_number: rowNo,
          },
        });
      }
    });

    return { type: "FeatureCollection", features };
  }

  // Get the current file if there is one, convert it to GeoJSON and store it
  async function handleUpload() {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const text = await file.text();
      const fc = parseCsvToGeoJSON(text);
      setGeojson(fc);

      const src = mapRef.current?.getSource(SRC_ID);
      if (src) src.setData(fc);
      fitToFeatures(fc);
    } catch (e) {
      alert(e.message || String(e));
    } finally {
      setBusy(false);
    }
  }

  // Download the curren GeoJSON
  function handleDownload() {
    if (!geojson) return;
    const blob = new Blob([JSON.stringify(geojson, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = "rows_only.geojson";
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleSaveToOrion(e) {
    e.preventDefault();
    alert("Saving is disabled in this no-backend view. Use downloads instead.");
  }

  const saveDisabled = true;

  return (
    <main className="min-h-full w-full">
      <MobilePageTitle>Import Labelled End Posts CSV</MobilePageTitle>
      {/* Map container */}
      <div ref={mapContainerRef} className="w-full h-[600px] rounded" />

      <Separator className="my-2" />

      <div className="flex flex-col gap-3 items-center">
        <div className="flex flex-col gap-2 w-full md:w-auto">
          <div className="flex flex-col gap-2 sm:flex-row justify-between">
            <Input
              id="csv"
              type="file"
              accept=".csv"
              className="w-full md:w-[250px] cursor-pointer"
              ref={fileRef}
            />
            <Button className="flex-1" onClick={handleUpload} disabled={busy}>
              {busy ? "Uploading…" : "Upload"}
            </Button>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row justify-center">
            <Button type="button" disabled>
              Edit Properties
            </Button>
            <div className="hidden sm:flex mx-2 self-stretch w-[1px] bg-border" />
            <Button type="button" disabled>
              Undo
            </Button>
            <div className="hidden sm:flex mx-2 self-stretch w-[1px] bg-border" />
            <Button type="button" onClick={handleDownload} disabled={!geojson}>
              Download GeoJSON
            </Button>
          </div>
        </div>

        <Separator className="my-2" />

        <form
          className="flex flex-col gap-2 justify-center items-center w-full md:w-auto"
          onSubmit={handleSaveToOrion}
        >
          <Label className="text-sm text-gray-600">Vineyard Data:</Label>
          <div className="flex flex-col md:flex-row gap-2 w-full">
            <input
              type="text"
              placeholder="Enter Vineyard ID"
              className="border-2 p-1 rounded-sm"
              onChange={(e) => setVineyardID(e.target.value)}
              value={vineyardID}
            />
            <input
              type="text"
              placeholder="Enter Vineyard Name"
              className="border-2 p-1 rounded-sm"
              onChange={(e) => setVineyardName(e.target.value)}
              value={vineyardName}
            />
            <input
              type="text"
              placeholder="Enter Address"
              className="border-2 p-1 rounded-sm"
              onChange={(e) => setAddress(e.target.value)}
              value={address}
            />
            <input
              type="text"
              placeholder="Enter Owner"
              className="border-2 p-1 rounded-sm"
              onChange={(e) => setOwner(e.target.value)}
              value={owner}
            />
            <Button type="submit" className="px-4" disabled={saveDisabled}>
              Save
            </Button>
          </div>
        </form>

        <Separator className="my-2" />

        <div className="text-left flex flex-col gap-2">
          <h2 className="font-bold underline">How to import CSV file</h2>
          <p>
            The CSV needs columns “Latitude”, “Longitude”, and “Row”. Exactly
            two points per row (the end posts) — we’ll convert each row into a
            single LineString to match the legacy format.
          </p>
          <div className="border rounded-md overflow-hidden">
            <Table className="text-xs">
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead>Latitude</TableHead>
                  <TableHead>Longitude</TableHead>
                  <TableHead>Row</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>53.26818842</TableCell>
                  <TableCell>-0.52427737</TableCell>
                  <TableCell>1</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>53.26803849</TableCell>
                  <TableCell>-0.52424047</TableCell>
                  <TableCell>1</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>53.26818842</TableCell>
                  <TableCell>-0.52431449</TableCell>
                  <TableCell>2</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>53.26803515</TableCell>
                  <TableCell>-0.52427742</TableCell>
                  <TableCell>2</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </main>
  );
}
