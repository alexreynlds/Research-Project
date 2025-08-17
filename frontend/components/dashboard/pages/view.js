"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Import the access token from the env
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function View() {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);

  const [geojson, setGeojson] = useState(null);

  // Setup all the toggle states for different layers
  const [showAll, setShowAll] = useState(false);
  const [showBlocks, setShowBlocks] = useState(false);
  const [showVineRows, setShowVineRows] = useState(true);
  const [showVines, setShowVines] = useState(false);
  const [showAnchorPosts, setShowAnchorPosts] = useState(false);
  const [showAnchorLines, setShowAnchorLines] = useState(false);
  const [showUnderVineAreas, setShowUnderVineAreas] = useState(false);
  const [showMidRowLines, setShowMidRowLines] = useState(true);
  const [showMidRowAreas, setShowMidRowAreas] = useState(false);
  const [showPoints, setShowPoints] = useState(false);
  const [showLines, setShowLines] = useState(false);
  const [showPolygons, setShowPolygons] = useState(false);

  useEffect(() => {
    // If the map is already initialized, do nothing
    if (mapRef.current) return;

    // Initialize Mapbox map
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-v9",
      center: [-0.9772342405497342, 51.59632509886086],
      zoom: 17,
    });
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Once the map is loaded, add the GeoJSON source and layers
    map.on("load", () => {
      map.addSource("geojson-data", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      // Add the points layer
      map.addLayer({
        id: "geojson-data-points-layer",
        type: "circle",
        source: "geojson-data",
        minzoom: 15,
        paint: {
          "circle-color": "#ff8040",
          "circle-radius": 5,
        },
        filter: [
          "all",
          ["==", ["geometry-type"], "Point"],
          ["has", "point_id"],
        ],
      });

      // Add the lines layers
      map.addLayer({
        id: "geojson-data-lines-layer",
        type: "line",
        source: "geojson-data",
        minzoom: 15,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#f5e216",
          "line-width": 4,
        },
        filter: [
          "all",
          ["==", ["geometry-type"], "LineString"],
          ["has", "line_id"],
        ],
      });

      // Add the polygons layers
      map.addLayer({
        id: "geojson-data-polygons-layer",
        type: "fill",
        source: "geojson-data",
        minzoom: 15,
        paint: {
          "fill-color": "#fc7f03",
          "fill-opacity": 0.5,
        },
        filter: [
          "all",
          ["==", ["geometry-type"], "Polygon"],
          ["has", "polygon_id"],
        ],
      });

      // Add vineyard specific layers
      map.addLayer({
        id: "geojson-data-block-layer",
        type: "fill",
        source: "geojson-data",
        minzoom: 15,
        paint: {
          "fill-color": "#81ed5a",
          "fill-opacity": 0.5,
        },
        filter: [
          "all",
          ["==", ["geometry-type"], "Polygon"],
          ["has", "block_id"],
          ["!", ["has", "under_vine_id"]],
          ["!", ["has", "mid_row_area_id"]],
        ],
      });

      map.addLayer({
        id: "geojson-data-block-outline-layer",
        type: "line",
        source: "geojson-data",
        minzoom: 15,
        paint: {
          "line-color": "#000000",
          "line-width": 2,
          "line-opacity": 0.5,
        },
        filter: [
          "all",
          ["==", ["geometry-type"], "Polygon"],
          ["has", "block_id"],
          ["!", ["has", "under_vine_id"]],
          ["!", ["has", "mid_row_area_id"]],
        ],
      });

      // Add under vine area layer
      map.addLayer({
        id: "geojson-data-under-vine-layer",
        type: "fill",
        source: "geojson-data",
        minzoom: 15,
        paint: {
          "fill-color": "#e58a92",
          "fill-opacity": 0.5,
        },
        filter: [
          "all",
          ["==", ["geometry-type"], "Polygon"],
          ["has", "under_vine_id"],
        ],
      });

      // Add vine row layer
      map.addLayer({
        id: "geojson-data-vine-row-layer",
        type: "line",
        source: "geojson-data",
        minzoom: 15,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#ad03fc",
          "line-width": 4,
        },
        filter: [
          "all",
          ["==", ["geometry-type"], "LineString"],
          ["has", "vine_row_id"],
        ],
      });

      // Add anchor post line layer
      map.addLayer({
        id: "geojson-data-anchor-post-line-layer",
        type: "line",
        source: "geojson-data",
        minzoom: 15,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#d6fffe",
          "line-width": 4,
        },
        filter: [
          "all",
          ["==", ["geometry-type"], "LineString"],
          ["has", "anchor_post_line_id"],
        ],
      });

      // Add anchor post points layer
      map.addLayer({
        id: "geojson-data-anchor-post-point-layer",
        type: "circle",
        source: "geojson-data",
        minzoom: 15,
        paint: {
          "circle-color": "#a2aebb",
          "circle-radius": 5,
        },
        paint: {
          "circle-color": "#a2aebb",
          "circle-radius": 5,
        },
        filter: [
          "all",
          ["==", ["geometry-type"], "Point"],
          ["has", "anchor_post_point_id"],
        ],
      });

      // Add vine layer
      map.addLayer({
        id: "geojson-data-vine-layer",
        type: "circle",
        source: "geojson-data",
        minzoom: 15,
        paint: {
          "circle-color": "#6af0ca",
          "circle-radius": 5,
        },
        filter: ["all", ["==", ["geometry-type"], "Point"], ["has", "vine_id"]],
      });

      map.on("click", "geojson-data-vine-layer", function (e) {
        var properties = e.features[0].properties;

        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML("Vine ID: " + properties.vine_id)
          .addTo(map);
      });

      // Add mid-row layers
      map.addLayer({
        id: "geojson-data-mid-row-area-layer",
        type: "fill",
        source: "geojson-data",
        minzoom: 15,
        paint: {
          "fill-color": "#fc0328",
          "fill-opacity": 0.5,
        },
        filter: [
          "all",
          ["==", ["geometry-type"], "Polygon"],
          ["has", "mid_row_area_id"],
        ],
      });

      map.addLayer({
        id: "geojson-data-mid-row-line-layer",
        type: "line",
        source: "geojson-data",
        minzoom: 15,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#7ab4f5",
          "line-width": 4,
        },
        filter: [
          "all",
          ["==", ["geometry-type"], "LineString"],
          ["has", "mid_row_line_id"],
        ],
      });

      // Popup for vine rows
      map.on("click", "geojson-data-vine-row-layer", (e) => {
        const p = e.features?.[0]?.properties || {};
        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(
            "Vine Row: " +
              p.user_defined_id +
              "<br />" +
              "Length: " +
              p.length +
              " m" +
              "<br />" +
              "Number of Vines: " +
              p.number_of_vines,
          )
          .addTo(map);
      });

      // Popup for anchor posts
      map.on("click", "geojson-data-block-layer", (e) => {
        const p = e.features?.[0]?.properties || {};
        const html = `
          <strong>Block Name:</strong> ${p.name ?? ""}<br/>
          <strong>Short Code:</strong> ${p.user_defined_id ?? ""}<br/>
          <strong>Total Rows:</strong> ${p.total_rows ?? ""}<br/>
          <strong>Total Row Length:</strong> ${p.total_row_length ?? ""} m<br/>
          <strong>Total Number of Vines:</strong> ${p.number_of_vines_in_block ?? ""}<br/>
          <strong>Area:</strong> ${p.area ?? ""} m²<br/>
          <strong>Perimeter:</strong> ${p.perimeter ?? ""} m
        `;
        new mapboxgl.Popup().setLngLat(e.lngLat).setHTML(html).addTo(map);
      });

      map.on("mouseenter", "geojson-data-lines-layer", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "geojson-data-lines-layer", () => {
        map.getCanvas().style.cursor = "";
      });

      mapRef.current = map;
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // push data to map when geojson changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded() || !geojson) return;
    const src = map.getSource("geojson-data");
    if (src) src.setData(geojson);
    const b = bounds(geojson);
    if (b) map.fitBounds(b, { padding: 24, duration: 0 });
  }, [geojson]);

  // Toggle show all
  useEffect(() => {
    if (!mapRef.current) return;
    const v = showAll;
    setShowBlocks(v);
    setShowVineRows(v);
    setShowVines(v);
    setShowAnchorPosts(v);
    setShowAnchorLines(v);
    setShowUnderVineAreas(v);
    setShowMidRowLines(v);
    setShowMidRowAreas(v);
    setShowPoints(v);
    setShowLines(v);
    setShowPolygons(v);
  }, [showAll]);

  // Update visibility of layers based on toggle states
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    const vis = (on) => (on ? "visible" : "none");
    setVis(map, "geojson-data-points-layer", vis(showPoints));
    setVis(map, "geojson-data-lines-layer", vis(showLines));
    setVis(map, "geojson-data-polygons-layer", vis(showPolygons));
    setVis(map, "geojson-data-vine-row-layer", vis(showVineRows));
    setVis(map, "geojson-data-block-layer", vis(showBlocks));
    setVis(map, "geojson-data-block-outline-layer", vis(showBlocks));
    setVis(map, "geojson-data-anchor-post-line-layer", vis(showAnchorLines));
    setVis(map, "geojson-data-anchor-post-point-layer", vis(showAnchorPosts));
    setVis(map, "geojson-data-under-vine-layer", vis(showUnderVineAreas));
    setVis(map, "geojson-data-mid-row-line-layer", vis(showMidRowLines));
    setVis(map, "geojson-data-mid-row-area-layer", vis(showMidRowAreas));
  }, [
    showPoints,
    showLines,
    showPolygons,
    showVineRows,
    showBlocks,
    showAnchorLines,
    showAnchorPosts,
    showUnderVineAreas,
    showMidRowLines,
    showMidRowAreas,
  ]);

  // Handle file upload
  function onFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        const fc = toFeatureCollection(data);
        setGeojson(fc);
      } catch (err) {
        alert("Invalid GeoJSON");
      }
    };
    reader.readAsText(file);
  }

  // Export current GeoJSON to file
  function exportGeoJSON() {
    if (!geojson) return;
    const blob = new Blob([JSON.stringify(geojson, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "output.geojson";
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
  }

  // Render the component
  return (
    <div className="p-3 space-y-4">
      <div
        ref={mapContainer}
        className="w-full h-[70vh] rounded-[8px] border-2"
      />

      {/* Controls */}
      <fieldset className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showAll}
              onChange={(e) => setShowAll(e.target.checked)}
            />
            Show All
          </label>
          <span>|</span>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showBlocks}
              onChange={(e) => setShowBlocks(e.target.checked)}
            />
            Blocks
          </label>
          <span>|</span>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showVineRows}
              onChange={(e) => setShowVineRows(e.target.checked)}
            />
            Vine Rows
          </label>
          <span>|</span>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showVines}
              onChange={(e) => setShowVines(e.target.checked)}
            />
            Vines
          </label>
          <span>|</span>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showAnchorPosts}
              onChange={(e) => setShowAnchorPosts(e.target.checked)}
            />
            Anchor Posts
          </label>
          <span>|</span>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showAnchorLines}
              onChange={(e) => setShowAnchorLines(e.target.checked)}
            />
            Anchor Lines
          </label>
          <span>|</span>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showUnderVineAreas}
              onChange={(e) => setShowUnderVineAreas(e.target.checked)}
            />
            Under Vine Areas
          </label>
          <span>|</span>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showMidRowLines}
              onChange={(e) => setShowMidRowLines(e.target.checked)}
            />
            Mid Row Lines
          </label>
          <span>|</span>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showMidRowAreas}
              onChange={(e) => setShowMidRowAreas(e.target.checked)}
            />
            Mid Row Areas
          </label>
          <span>|</span>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showPoints}
              onChange={(e) => setShowPoints(e.target.checked)}
            />
            Points
          </label>
          <span>|</span>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showLines}
              onChange={(e) => setShowLines(e.target.checked)}
            />
            Lines
          </label>
          <span>|</span>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showPolygons}
              onChange={(e) => setShowPolygons(e.target.checked)}
            />
            Polygons
          </label>
        </div>

        <div className="flex items-center gap-3">
          {/* TODO: Update input to look nicer */}
          <input
            type="file"
            accept=".geojson,application/geo+json,application/json"
            className="border rounded px-2 py-1 cursor-pointer"
            onChange={onFileChange}
          />
          <button
            onClick={exportGeoJSON}
            className="px-3 py-1 border rounded hover:bg-gray-50 cursor-pointer"
            disabled={!geojson}
          >
            Export current GeoJSON
          </button>
        </div>
      </fieldset>
    </div>
  );
}

// Function to set visibility of a layer in the map
function setVis(map, id, vis) {
  if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", vis);
}

// Function to convert various GeoJSON formats to a FeatureCollection
function toFeatureCollection(data) {
  if (!data) return { type: "FeatureCollection", features: [] };
  if (data.type === "FeatureCollection") return data;
  if (data.type && data.geometry)
    return { type: "FeatureCollection", features: [data] };
  if (Array.isArray(data)) return { type: "FeatureCollection", features: data };
  throw new Error("Unsupported GeoJSON");
}

// Function to compute bounds of a GeoJSON FeatureCollection
function bounds(fc) {
  try {
    const b = new mapboxgl.LngLatBounds();
    let has = false;
    (fc.features || []).forEach((f) => {
      const g = f.geometry;
      if (!g) return;
      const add = ([lng, lat]) => {
        if (!isFinite(lng) || !isFinite(lat)) return;
        b.extend([lng, lat]);
        has = true;
      };
      if (g.type === "Point") add(g.coordinates);
      else if (g.type === "LineString") g.coordinates.forEach(add);
      else if (g.type === "Polygon") g.coordinates.flat().forEach(add);
      else if (g.type === "MultiPoint") g.coordinates.forEach(add);
      else if (g.type === "MultiLineString") g.coordinates.flat().forEach(add);
      else if (g.type === "MultiPolygon") g.coordinates.flat(2).forEach(add);
    });
    return has ? b : null;
  } catch {
    return null;
  }
}
