"use client";

import { useRef, useEffect } from "react";

import { Map } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Separator } from "../ui/separator";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export default function ViewPage() {
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

  return (
    <main className="min-h-full w-full">
      <div id="map" className="w-full h-[600px] rounded" ref={mapRef} />
      <Separator className="my-2" />
      <h2 className="text-xl underline">Vineyard Data</h2>
      <div className="flex flex-col sm:flex-row mt-2">
        <div className="">
          <p>Total Block Area:</p>
          <p>Total Vine Rows:</p>
          <p>Total Vines:</p>
          <p>Total Vine Row Length:</p>
          <p>Total Under Vine Area:</p>
          <p>Total Mid Row Area:</p>
        </div>

        <div className="hidden sm:flex mx-8 self-stretch w-[1px] bg-border" />
        <div className="flex sm:hidden my-2 self-stretch h-[1px] bg-border" />

        <div className="">
          <p>Name:</p>
          <p>Address:</p>
          <p>Owner:</p>
        </div>
      </div>
      <Separator className="my-2" />
      <h2 className="text-xl underline">Robotic Data</h2>
      <p>Total Topological Nav Map Edge Length:</p>
      <p>Total Topological Nav Map Nodes:</p>
      <Separator className="my-2" />
      <h2 className="text-xl underline">Block Data</h2>
      <Table className="border-1 text-xs">
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Variety</TableHead>
            <TableHead>Clone</TableHead>
            <TableHead>Rootstock</TableHead>
            <TableHead>Pruning Style</TableHead>
            <TableHead>
              Area (m<sup>2</sup>)
            </TableHead>
            <TableHead>Total Vine Rows</TableHead>
            <TableHead>Total Vines</TableHead>
            <TableHead>
              Total Vine Row Length (m<sup>2</sup>)
            </TableHead>
            <TableHead>
              Total Under Vine Area (m<sup>2</sup>)
            </TableHead>
            <TableHead>
              Total Mid Row Area (m<sup>2</sup>)
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    </main>
  );
}
