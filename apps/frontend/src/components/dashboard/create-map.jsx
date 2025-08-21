"use client";

import { useRef, useEffect, useState } from "react";

import { Map } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Separator } from "../ui/separator";

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
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 sm:flex-row justify-center">
          <button className="border-2 rounded p-1 cursor-pointer bg-gray-100 hover:bg-gray-300 transition-colors duration-300">
            Edit Properties
          </button>
          <div className="hidden sm:flex mx-4 self-stretch w-[1px] bg-border" />
          <button className="border-2 rounded p-1 cursor-pointer bg-gray-100 hover:bg-gray-300 transition-colors duration-300">
            Undo
          </button>
        </div>

        <Separator className="my-2" />

        <form
          className="flex flex-col sm:flex-row gap-2 justify-center items-center"
          onSubmit={saveVineyard}
        >
          <label className="text-sm text-gray-600">Vineyard ID:</label>
          <div className="flex flex-row">
            <input
              type="text"
              placeholder="Enter Vineyard ID"
              className="border-2 p-1 rounded-sm"
              onChange={(e) => setVineyardID(e.target.value)}
              value={vineyardID}
            />
            <div className="hidden sm:flex mx-1 self-stretch w-[1px] bg-border" />
            <button
              type="submit"
              className="submit border-2 rounded p-1 cursor-pointer bg-gray-100 hover:bg-gray-300 transition-colors duration-300"
            >
              Save
            </button>
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
