"use client";

import { useRef, useEffect, useState } from "react";

import { Map } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MobilePageTitle from "../layouts/mobile_page_title";

export default function EditMapPage() {
  const [vineyardID, setVineyardID] = useState("");
  const mapRef = useRef(null);

  function saveVineyard(e) {
    e.preventDefault();
  }

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
      <MobilePageTitle>Edit Vineyard</MobilePageTitle>
      <div id="map" className="w-full h-[600px] rounded" ref={mapRef} />
      <Separator className="my-2" />
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 sm:flex-row justify-center">
          <Button>Edit Properties</Button>
          <div className="hidden sm:flex mx-4 self-stretch w-[1px] bg-border" />
          <Button>Undo</Button>
        </div>

        <Separator className="my-2" />

        <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
          <label className="text-sm text-gray-600">Select Vineyard</label>
          <div className="flex flex-row gap-3">
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {/* Get all vineyards from backend here */}
                <SelectItem>Placeholder</SelectItem>
              </SelectContent>
            </Select>
            <div className="hidden sm:flex mx-1 self-stretch w-[1px] bg-border" />
            <Button>View</Button>
          </div>
        </div>

        <Separator className="my-2" />

        <div className="flex flex-col gap-2 sm:flex-row justify-center">
          <Button>Download GeoJSON</Button>
          <div className="hidden sm:flex mx-4 self-stretch w-[1px] bg-border" />
          <Button>Save</Button>
        </div>
      </div>
    </main>
  );
}
