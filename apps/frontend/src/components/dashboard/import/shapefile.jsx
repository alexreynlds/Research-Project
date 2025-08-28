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
import MobilePageTitle from "@/components/layouts/mobile_page_title";

export default function ImportShapefile() {
  const fileRef = useRef(null);

  // Vineyard Data
  const [vineyardID, setVineyardID] = useState("");

  const headers = [
    "Vineyard",
    "Block",
    "Vine Row",
    "Vine",
    "Polygon",
    "Line",
    "Point",
  ];

  const rows = [
    [
      "vineyard_id: String",
      "block_id: String",
      "vine_row_id: String",
      "vine_id: String",
      "polygon_id: String",
      "line_id: String",
      "point_id: String",
    ],
    [
      "name: String",
      "user_defined_id: String",
      "user_defined_id: String",
      "user_defined_id: String",
      "user_defined_id: String",
      "user_defined_id: String",
      "user_defined_id: String",
    ],
    [
      "owner: String",
      "vineyard_id: String",
      "vineyard_id: String",
      "vineyard_id: String",
      "vineyard_id: String",
      "vineyard_id: String",
      "vineyard_id: String",
    ],
    [
      "street_address: String",
      "name: String",
      "block_id: String",
      "vine_row_id: String",
      "name: String",
      "name: String",
      "name: String",
    ],
    [
      "geom: geo:json Polygon",
      "date_start: DateTime",
      "under_vine_width: Float",
      "grapes_number: Float",
      "category: String",
      "category: String",
      "category: String",
    ],
    [
      "",
      "date_end: DateTime",
      "vine_spacing: Float",
      "grapes_yield: Float",
      "class_string: String",
      "class_string: String",
      "class_string: String",
    ],
    [
      "",
      "row_spacing_m: Float",
      "anchor_post_distance: Float",
      "rootstock: String",
      "geom: geo:json Polygon",
      "geom: geo:json LineString",
      "location: geo:json Point",
    ],
    [
      "",
      "under_vine_width: Float",
      "post_spacing: Float",
      "variety: String",
      "",
      "",
      "",
    ],
    [
      "",
      "anchor_post_distance: Float",
      "pruning_style: String",
      "clone: String",
      "",
      "",
      "",
    ],
    [
      "",
      "vine_spacing: Float",
      "clone: String",
      "location: geo:json Point",
      "",
      "",
      "",
    ],
    ["", "clone: String", "variety: String", "", "", "", ""],
    ["", "variety: String", "rootstock: String", "", "", "", ""],
    ["", "rootstock: String", "trellis_type: String", "", "", "", ""],
    ["", "trellis_type: String", "fruiting_wire_height: Float", "", "", "", ""],
    [
      "",
      "geom: geo:json Polygon",
      "pruning_wire_height: Float",
      "",
      "",
      "",
      "",
    ],
    ["", "", "geom: geo:json LineString", "", "", "", ""],
  ];

  return (
    <main className="w-full">
      <MobilePageTitle>Import Vineyard Shapefile</MobilePageTitle>
      <div className="flex flex-col gap-3 items-center">
        {/* File Input */}
        <div className="flex flex-col gap-2 sm:flex-row justify-between w-full md:w-auto">
          <Input id="csv" type="file" className="md:w-[250px]" ref={fileRef} />
          <Button className="flex-1">Upload</Button>
        </div>

        <Separator className="my-2" />

        <form className="flex flex-row gap-2 justify-center items-center">
          <Label className="text-sm text-gray-600">Vineyard ID:</Label>
          <div className="flex flex-col md:flex-row gap-2">
            <input
              type="text"
              placeholder="Enter Vineyard ID"
              className="border-2 p-1 rounded-sm"
              onChange={(e) => setVineyardID(e.target.value)}
              value={vineyardID}
            />
          </div>
        </form>

        <Separator className="my-2" />

        <div className="w-full text-left flex flex-col gap-2">
          <p>
            Each feature mush have coordinates.
            <br />
            To create a new vineyard the Shapefile must include a vineyard
            feature, with vineyard ID, name, address owner and a polygon with
            coordinates representing the boundary of the vineyard.
          </p>

          <p>Accepted Features and Properties:</p>

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
