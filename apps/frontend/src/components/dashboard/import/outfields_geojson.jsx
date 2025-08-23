"use client";

import { useRef, useState } from "react";

import "mapbox-gl/dist/mapbox-gl.css";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ImportOutfieldsGeoJson() {
  const fileRef = useRef(null);

  // Vineyard Data
  const [vineyardID, setVineyardID] = useState("");

  const [fileName, setFileName] = useState("");
  const [busy, setBusy] = useState(false);

  function openPicker() {
    fileRef.current && fileRef.current.click();
  }

  async function uploadCsvToBackend(file, vineyardID) {}

  const headers = ["Property", "Value Example"];

  const rows = [
    [
      "Coordinates",
      "[ [-2.567159445513686, 51.12813421066522], [-2.567435443658527, 51.127130069394276] ]",
    ],
    ["Row Number", "101"],
    ["Plant Count", "76"],
    ["Fruit", "Grape"],
    ["Variety", "Pinot Noir"],
    ["Year Planted", "2020"],
    ["Growing System", "Trellis"],
    ["Plant Separation", "1.5"],
    ["Plant Separation Metric", "m"],
    ["Retired", "False"],
  ];

  return (
    <main className="min-h-full w-full">
      <Separator className="my-2" />
      <div className="flex flex-col gap-3 items-center">
        <div className="flex flex-col gap-2 sm:flex-row justify-between">
          <Input id="csv" type="file" className="w-[250px]" ref={fileRef} />
          <Button className="flex-1">Upload</Button>
        </div>

        <Separator className="my-2" />

        <form className="flex flex-col gap-2 justify-center items-center">
          <div className="flex flex-row gap-2">
            <Label className="text-sm text-gray-600">
              Vineyard ID (must be unique):
            </Label>
            <div className="flex flex-col md:flex-row gap-2">
              <input
                type="text"
                placeholder="Vineyard ID"
                className="border-2 p-1 rounded-sm"
                onChange={(e) => setVineyardID(e.target.value)}
                value={vineyardID}
              />
            </div>
          </div>
          <div className="flex flex-row gap-2">
            <Label className="text-sm text-gray-600">
              Block ID (must be unique)
            </Label>
            <div className="flex flex-col md:flex-row gap-2">
              <input
                type="text"
                placeholder="Block ID"
                className="border-2 p-1 rounded-sm"
                onChange={(e) => setVineyardID(e.target.value)}
                value={vineyardID}
              />
            </div>
          </div>
          <div className="flex flex-row gap-2">
            <Label className="text-sm text-gray-600">Block Name</Label>
            <div className="flex flex-col md:flex-row gap-2">
              <input
                type="text"
                placeholder="Block Name"
                className="border-2 p-1 rounded-sm"
                onChange={(e) => setVineyardID(e.target.value)}
                value={vineyardID}
              />
            </div>
          </div>
        </form>

        <Separator className="my-2" />

        <div className="text-left flex flex-col gap-2">
          <p>
            Each GeoJSON feature must have coordinates.
            <br />
            Import row lines GeoJSON file of one block, with these variables.
          </p>

          <div className="border rounded-md overflow-hidden">
            <Table className="text-xs">
              <TableHeader className="bg-muted/40">
                <TableRow>
                  {headers.map((h) => (
                    <TableHead key={h} className="whitespace-nowrap">
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, idx) => (
                  <TableRow key={idx}>
                    {row.map((cell, i) => (
                      <TableCell
                        key={`${idx}-${i}`}
                        className="align-top whitespace-nowrap"
                      >
                        {cell || ""}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </main>
  );
}
