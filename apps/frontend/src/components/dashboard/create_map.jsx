"use client";

import { useRef, useEffect, useState } from "react";

import { Map } from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import MobilePageTitle from "../layouts/mobile_page_title";

export default function CreateMapPage() {
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

    map.addControl(new mapboxgl.NavigationControl());

    var draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        line_string: true,
        point: true,
        trash: true,
        combine_features: false,
        uncombine_features: false,
        direct_select: true,
      },
    });

    map.addControl(draw);

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  return (
    <main className="min-h-full w-full">
      <MobilePageTitle>Create Vineyard</MobilePageTitle>
      <div id="map" className="w-full h-[600px] rounded" ref={mapRef} />
      <Separator className="my-2" />
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 sm:flex-row justify-center">
          <Button>Edit Properties</Button>
          <div className="hidden sm:flex mx-4 self-stretch w-[1px] bg-border" />
          <Button>Undo</Button>
        </div>

        <Separator className="my-2" />

        <form
          className="flex flex-col sm:flex-row gap-2 justify-center items-center"
          onSubmit={saveVineyard}
        >
          <label className="text-sm text-gray-600">Vineyard ID:</label>
          <div className="flex flex-row gap-3">
            <input
              type="text"
              placeholder="Enter Vineyard ID"
              className="border-2 p-1 rounded-sm"
              onChange={(e) => setVineyardID(e.target.value)}
              value={vineyardID}
            />
            <div className="hidden sm:flex mx-1 self-stretch w-[1px] bg-border" />
            <Button type="submit">Save</Button>
          </div>
        </form>

        <Separator className="my-2" />

        <p>
          To create a new vineyard a vineyard feature, with name, address owner
          and a polygon with coordinates representing the boundary of the
          vineyard must be created.
        </p>
      </div>
    </main>
  );
}
