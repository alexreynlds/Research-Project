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
import MobilePageTitle from "@/components/layouts/mobile_page_title";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ImportOutfieldsGeoJson() {
  const fileRef = useRef(null);

  // Vineyard Data
  const [vineyardID, setVineyardID] = useState("");

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
      <MobilePageTitle>Import Outfields GeoJSON</MobilePageTitle>
      <Separator className="my-2 flex md:hidden" />
      <div className="flex flex-col gap-3 items-center">
        {/* File Input */}
        <div className="flex flex-col gap-2 sm:flex-row justify-between w-full md:w-auto">
          <Input id="csv" type="file" className="md:w-[250px]" ref={fileRef} />
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

          <div className="w-full max-w-full overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
            <Table className="w-full table-fixed text-xs">
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="w-36 md:w-48 whitespace-nowrap">
                    Property
                  </TableHead>
                  <TableHead>Value Example</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, idx) => (
                  <TableRow key={idx}>
                    {/* Property */}
                    <TableCell className="align-top whitespace-nowrap">
                      {row[0]}
                    </TableCell>

                    {/* Value */}
                    <TableCell className="align-top min-w-0 whitespace-pre-wrap break-all leading-snug">
                      {/* wrapping helper to ensure the style applies even if shadcn TableCell sets display: table-cell */}
                      <span className="block min-w-0 break-all">
                        {row[1] || ""}
                      </span>
                    </TableCell>
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
