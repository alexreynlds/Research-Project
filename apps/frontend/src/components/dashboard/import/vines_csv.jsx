"use client";

import { useRef, useEffect, useState } from "react";

import { Map } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MobilePageTitle from "@/components/layouts/mobile_page_title";

export default function ImportVinesCsv() {
  const fileRef = useRef(null);

  // Vineyard Data
  const [vineyardID, setVineyardID] = useState("");
  const [vineyardName, setVineyardName] = useState("");
  const [address, setAddress] = useState("");
  const [owner, setOwner] = useState("");

  const mapRef = useRef(null);

  useEffect(() => {
    const mapContainer = document.getElementById("map");
    if (!mapContainer) return;

    const map = new Map({
      container: mapContainer,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [-0.9772342405497342, 51.59632509886086],
      zoom: 17,
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
    });

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  function openPicker() {
    fileRef.current && fileRef.current.click();
  }

  async function uploadCsvToBackend(file, vineyardID) {}

  return (
    <main className="min-h-full w-full">
      <MobilePageTitle>Import Vines from CSV</MobilePageTitle>
      <div id="map" className="w-full h-[600px] rounded" ref={mapRef} />
      <Separator className="my-2" />
      <div className="flex flex-col gap-3 items-center">
        {/* File Input and buttons */}
        <div className="flex flex-col gap-2 w-full md:w-auto">
          <div className="flex flex-col gap-2 sm:flex-row justify-between">
            <Input
              id="csv"
              type="file"
              className="md:w-[250px]"
              ref={fileRef}
            />
            <Button className="flex-1">Upload</Button>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row justify-center">
            <Button>Edit Properties</Button>
            <div className="hidden sm:flex mx-2 self-stretch w-[1px] bg-border" />
            <Button>Undo</Button>
            <div className="hidden sm:flex mx-2 self-stretch w-[1px] bg-border" />
            <Button>Download GeoJSON</Button>
          </div>
        </div>

        <Separator className="my-2" />

        {/* Vineyard data input */}
        <form className="flex flex-col  gap-2 justify-center items-center w-full md:w-auto">
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
            <Button type="submit" className="px-4">
              Save
            </Button>
          </div>
        </form>

        <Separator className="my-2" />

        {/* Fix the overflow issue with this table at somepoint */}
        <div className="text-left flex flex-col gap-2">
          <h2 className="font-bold underline">How to import CSV file</h2>
          <p>
            The CSV file needs to have columns labelled "Vine ID" "Latitude",
            "Longitude", "Vine Row", the row name/number, "Variety", "Clone",
            "Rootstock". E.g.
          </p>
          <div className="border rounded-md overflow-hidden">
            <Table className="text-xs">
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead>Vine ID</TableHead>
                  <TableHead>Latitude</TableHead>
                  <TableHead>Longitude</TableHead>
                  <TableHead>Vine Row</TableHead>
                  <TableHead>Variety</TableHead>
                  <TableHead>Clone</TableHead>
                  <TableHead>Rootstock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>ROW 01 VINE 01</TableCell>
                  <TableCell>53.26818842</TableCell>
                  <TableCell>-0.52427737</TableCell>
                  <TableCell>1</TableCell>
                  <TableCell>Pinot Noir</TableCell>
                  <TableCell>115</TableCell>
                  <TableCell>41B</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>ROW 01 VINE 02</TableCell>
                  <TableCell>53.26803849</TableCell>
                  <TableCell>-0.52424047</TableCell>
                  <TableCell>1</TableCell>
                  <TableCell>Pinot Noir</TableCell>
                  <TableCell>115</TableCell>
                  <TableCell>41B</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>ROW 02 VINE 01</TableCell>
                  <TableCell>53.26818522</TableCell>
                  <TableCell>-0.52431449</TableCell>
                  <TableCell>2</TableCell>
                  <TableCell>Chardonnay</TableCell>
                  <TableCell>INRA 177</TableCell>
                  <TableCell>Fercal</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>ROW 02 VINE 02</TableCell>
                  <TableCell>53.26803515</TableCell>
                  <TableCell>-0.52427742</TableCell>
                  <TableCell>2</TableCell>
                  <TableCell>Chardonnay</TableCell>
                  <TableCell>INRA 177</TableCell>
                  <TableCell>Fercal</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </main>
  );
}
