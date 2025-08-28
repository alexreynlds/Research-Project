"use client";

import { useRef, useState, useEffect } from "react";

import { Map } from "mapbox-gl";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Table, TableHead, TableHeader, TableRow } from "../ui/table";
import MobilePageTitle from "../layouts/mobile_page_title";

export default function ViewPage() {
  const mapRef = useRef(null);

  // State handlers for the different menus
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [topologicalMenuOpen, setTopologicalMenuOpen] = useState(false);
  const [rosMenuOpen, setRosMenuOpen] = useState(false);

  // State handlers for the filter checkboxes
  // Currently purely visual but can be hooked up later
  const [showAll, setShowAll] = useState(true);
  const [showZoneBlocks, setShowZoneBlocks] = useState(true);
  const [showVarietyBlocks, setShowVarietyBlocks] = useState(true);
  const [showVineRows, setShowVineRows] = useState(true);
  const [showVines, setShowVines] = useState(true);
  const [showVineGrapeNumbers, setShowVineGrapeNumbers] = useState(true);
  const [showRowPosts, setShowRowPosts] = useState(true);
  const [showAnchorPosts, setShowAnchorPosts] = useState(true);
  const [showAnchorLines, setShowAnchorLines] = useState(true);
  const [showUnderVineArea, setShowUnderVineArea] = useState(true);
  const [showMidRowLines, setShowMidRowLines] = useState(true);
  const [showMidRowAreas, setShowMidRowAreas] = useState(true);
  const [showVineRowBoundaries, setShowVineRowBoundaries] = useState(true);
  const [showTopologicalNavMap, setShowTopologicalNavMap] = useState(true);
  const [showTopologicalPOIMap, setShowTopologicalPOIMap] = useState(true);
  const [showPoints, setShowPoints] = useState(true);
  const [showLines, setShowLines] = useState(true);
  const [showPolygons, setShowPolygons] = useState(true);
  const [showVineyardBoundary, setShowVineyardBoundary] = useState(true);
  const [showRobots, setShowRobots] = useState(true);

  // Function to handle toggling all filters
  function handleToggleAllFilters() {
    const newValue = !showAll;
    setShowAll(newValue);
    setShowZoneBlocks(newValue);
    setShowVarietyBlocks(newValue);
    setShowVineRows(newValue);
    setShowVines(newValue);
    setShowVineGrapeNumbers(newValue);
    setShowRowPosts(newValue);
    setShowAnchorPosts(newValue);
    setShowAnchorLines(newValue);
    setShowUnderVineArea(newValue);
    setShowMidRowLines(newValue);
    setShowMidRowAreas(newValue);
    setShowVineRowBoundaries(newValue);
    setShowTopologicalNavMap(newValue);
    setShowTopologicalPOIMap(newValue);
    setShowPoints(newValue);
    setShowLines(newValue);
    setShowPolygons(newValue);
    setShowVineyardBoundary(newValue);
    setShowRobots(newValue);
  }

  // Functions to toggle each menu, ensuring only one is open at a time
  function toggleFiltersMenu() {
    let oldState = filterMenuOpen;
    closeMenus();
    setFilterMenuOpen(!oldState);
  }

  function toggleExportMenu() {
    let oldState = exportMenuOpen;
    closeMenus();
    setExportMenuOpen(!oldState);
  }

  function toggleTopologicalMap() {
    let oldState = topologicalMenuOpen;
    closeMenus();
    setTopologicalMenuOpen(!oldState);
  }

  function toggleRosMenu() {
    let oldState = rosMenuOpen;
    closeMenus();
    setRosMenuOpen(!oldState);
  }

  // Close all menus
  function closeMenus() {
    setFilterMenuOpen(false);
    setExportMenuOpen(false);
    setTopologicalMenuOpen(false);
    setRosMenuOpen(false);
  }

  // Initialize the map
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

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  return (
    <main className="min-h-full w-full">
      <MobilePageTitle>View Vineyard</MobilePageTitle>
      <div id="map" className="w-full h-[600px] rounded relative" ref={mapRef}>
        {/* Vineyard Selector */}
        <div className="absolute top-2 left-2 bg-white p-2 rounded shadow z-10 flex flex-row items-center gap-2">
          <p className="text-sm font-semibold">Vineyard:</p>
          <Select>
            <SelectTrigger
              className="w-[150px]"
              name="Select Vineyard Trigger"
              title="Select Vineyard Trigger"
            >
              <SelectValue
                placeholder="Select Vineyard"
                name="Select Vineyard Dropdown"
                title="Select Vineyard Dropdown"
              />
            </SelectTrigger>
            <SelectContent>
              {/* Link this to backend vineyards */}
              <SelectItem>Placeholder</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filters Menu */}
        <div
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[90%] w-[90%] md:w-[70%] bg-white shadow-lg rounded-t-md z-10 transform transition-transform duration-300 ease-in-out ${
            filterMenuOpen
              ? "translate-y-[10%] md:translate-y-[30%]"
              : "translate-y-full"
          }`}
        >
          <div className="p-4">
            <p className="text-lg font-semibold mb-4">Filters</p>
            <div className="flex items-center mb-2">
              <Checkbox
                id="toggleAll"
                className="mr-2"
                checked={showAll}
                onCheckedChange={() => handleToggleAllFilters()}
              />
              <Label htmlFor="toggleAll" className="text-sm">
                Toggle All
              </Label>
            </div>
            <Separator className="my-2" />
            {/* display it as flex or grid - cant decide which is better */}
            {/* <div className="grid grid-cols-3 md:grid-cols-6 border rounded-md p-2"> */}
            <div className="flex flex-row flex-wrap gap-4">
              <div className="flex items-center">
                <Checkbox
                  id="showVines"
                  className="mr-2"
                  checked={showZoneBlocks}
                  onCheckedChange={(v) => setShowZoneBlocks(Boolean(v))}
                />
                <Label htmlFor="showVines" className="text-sm">
                  Zone Blocks
                </Label>
              </div>
              <div className="flex items-center">
                <Checkbox
                  id="showVines"
                  className="mr-2"
                  checked={showVarietyBlocks}
                  onCheckedChange={(v) => setShowVarietyBlocks(Boolean(v))}
                />
                <Label htmlFor="showVines" className="text-sm">
                  Variety Blocks
                </Label>
              </div>
              <div className="flex items-center">
                <Checkbox
                  id="showVines"
                  className="mr-2"
                  checked={showVineRows}
                  onCheckedChange={(v) => setShowVineRows(Boolean(v))}
                />
                <Label htmlFor="showVines" className="text-sm">
                  Vine Rows
                </Label>
              </div>
              <div className="flex items-center">
                <Checkbox
                  id="showVines"
                  className="mr-2"
                  checked={showVines}
                  onCheckedChange={(v) => setShowVines(Boolean(v))}
                />
                <Label htmlFor="showVines" className="text-sm">
                  Vines
                </Label>
              </div>
              <div className="flex items-center">
                <Checkbox
                  id="showVines"
                  className="mr-2"
                  checked={showVineGrapeNumbers}
                  onCheckedChange={(v) => setShowVineGrapeNumbers(v)}
                />
                <Label htmlFor="showVines" className="text-sm">
                  Vine Grape Numbers
                </Label>
              </div>
              <div className="flex items-center">
                <Checkbox
                  id="showVines"
                  className="mr-2"
                  checked={showRowPosts}
                  onCheckedChange={(v) => setShowRowPosts(v)}
                />
                <Label htmlFor="showVines" className="text-sm">
                  Row Posts
                </Label>
              </div>
              <div className="flex items-center">
                <Checkbox
                  id="showVines"
                  className="mr-2"
                  checked={showAnchorPosts}
                  onCheckedChange={(v) => setShowAnchorPosts(v)}
                />
                <Label htmlFor="showVines" className="text-sm">
                  Anchor Posts
                </Label>
              </div>
              <div className="flex items-center">
                <Checkbox
                  id="showVines"
                  className="mr-2"
                  checked={showAnchorLines}
                  onCheckedChange={(v) => setShowAnchorLines(v)}
                />
                <Label htmlFor="showVines" className="text-sm">
                  Anchor Lines
                </Label>
              </div>
              <div className="flex items-center">
                <Checkbox
                  id="showVines"
                  className="mr-2"
                  checked={showUnderVineArea}
                  onCheckedChange={(v) => setShowUnderVineArea(v)}
                />
                <Label htmlFor="showVines" className="text-sm">
                  Under Vine Area
                </Label>
              </div>
              <div className="flex items-center">
                <Checkbox
                  id="showVines"
                  className="mr-2"
                  checked={showMidRowLines}
                  onCheckedChange={(v) => setShowMidRowLines(v)}
                />
                <Label htmlFor="showVines" className="text-sm">
                  Mid Row Lines
                </Label>
              </div>
              <div className="flex items-center">
                <Checkbox
                  id="showVines"
                  className="mr-2"
                  checked={showMidRowAreas}
                  onCheckedChange={(v) => setShowMidRowAreas(v)}
                />
                <Label htmlFor="showVines" className="text-sm">
                  Mid Row Areas
                </Label>
              </div>
              <div className="flex items-center">
                <Checkbox
                  id="showVines"
                  className="mr-2"
                  checked={showVineRowBoundaries}
                  onCheckedChange={(v) => setShowVineRowBoundaries(v)}
                />
                <Label htmlFor="showVines" className="text-sm">
                  Vine Row Boundaries
                </Label>
              </div>
              <div className="flex items-center">
                <Checkbox
                  id="showVines"
                  className="mr-2"
                  checked={showTopologicalNavMap}
                  onCheckedChange={(v) => setShowTopologicalNavMap(v)}
                />
                <Label htmlFor="showVines" className="text-sm">
                  Topological Nav Map
                </Label>
              </div>
              <div className="flex items-center">
                <Checkbox
                  id="showVines"
                  className="mr-2"
                  checked={showTopologicalPOIMap}
                  onCheckedChange={(v) => setShowTopologicalPOIMap(v)}
                />
                <Label htmlFor="showVines" className="text-sm">
                  Topological POI Map
                </Label>
              </div>
              <div className="flex items-center">
                <Checkbox
                  id="showVines"
                  className="mr-2"
                  checked={showPoints}
                  onCheckedChange={(v) => setShowPoints(v)}
                />
                <Label htmlFor="showVines" className="text-sm">
                  Points
                </Label>
              </div>
              <div className="flex items-center">
                <Checkbox
                  id="showLines"
                  className="mr-2"
                  checked={showLines}
                  onCheckedChange={(v) => setShowLines(v)}
                />
                <Label htmlFor="showLines" className="text-sm">
                  Lines
                </Label>
              </div>
              <div className="flex items-center">
                <Checkbox
                  id="showPolygons"
                  className="mr-2"
                  checked={showPolygons}
                  onCheckedChange={(v) => setShowPolygons(v)}
                />
                <Label htmlFor="showPolygons" className="text-sm">
                  Polygons
                </Label>
              </div>
              <div className="flex items-center">
                <Checkbox
                  id="showVineRowBoundaries"
                  className="mr-2"
                  checked={showVineyardBoundary}
                  onCheckedChange={(v) => setShowVineyardBoundary(v)}
                />
                <Label htmlFor="showVineRowBoundaries" className="text-sm">
                  Vineyard Boundary
                </Label>
              </div>
              <div className="flex items-center">
                <Checkbox
                  id="showVines"
                  className="mr-2"
                  checked={showRobots}
                  onCheckedChange={(v) => setShowRobots(v)}
                />
                <Label htmlFor="showVines" className="text-sm">
                  Robots
                </Label>
              </div>
            </div>
          </div>
        </div>

        {/* Export menu */}
        <div
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[90%] w-[90%] md:w-[70%] bg-white shadow-lg rounded-t-md z-10 transform transition-transform duration-300 ease-in-out ${
            exportMenuOpen
              ? "translate-y-[10%] md:translate-y-[30%]"
              : "translate-y-full"
          }`}
        >
          <div className="p-4">
            <p className="text-lg font-semibold mb-4">Export</p>
            <div className="flex flex-col gap-4">
              <Button variant="green" className="w-full">
                Export to GeoJSON
              </Button>
              <Button variant="green" className="w-full">
                Export to KML
              </Button>
              <Button variant="green" className="w-full">
                Export to Shapefile
              </Button>
              <Button variant="green" className="w-full">
                Export to PDF Report
              </Button>
            </div>
          </div>
        </div>

        {/* Topological Map Menu */}
        <div
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[90%] w-[90%] md:w-[70%] bg-white shadow-lg rounded-t-md z-10 transform transition-transform duration-300 ease-in-out ${
            topologicalMenuOpen
              ? "translate-y-[10%] md:translate-y-[30%]"
              : "translate-y-full"
          }`}
        >
          <div className="p-4">
            <p className="text-lg font-semibold mb-4">Export</p>
            <div className="flex flex-col gap-4">
              <Button variant="green" className="w-full">
                Navigation Map
              </Button>
              <Button variant="green" className="w-full">
                POI Map
              </Button>
              <Button variant="green" className="w-full">
                Datum
              </Button>
              <Button variant="green" className="w-full">
                KML
              </Button>
              <Button variant="green" className="w-full">
                Antobot XML
              </Button>
            </div>
          </div>
        </div>

        {/* ROS Menu */}
        <div
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[90%] w-[90%] md:w-[70%] bg-white shadow-lg rounded-t-md z-10 transform transition-transform duration-300 ease-in-out ${
            rosMenuOpen
              ? "translate-y-[10%] md:translate-y-[30%]"
              : "translate-y-full"
          }`}
        >
          <div className="p-4">
            <p className="text-lg font-semibold mb-4">ROS Menu</p>
            <div className="flex flex-col gap-4">
              <p>ROS NoGo Occupancy Map</p>
              <Button variant="green" className="w-full">
                PNG
              </Button>
              <Button variant="green" className="w-full">
                YAML
              </Button>
              <p>ROS Post & Vine Occupancy Map</p>
              <Button variant="green" className="w-full">
                PNG
              </Button>
              <Button variant="green" className="w-full">
                YAML
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-2" />

      {/* button holder for map settings */}
      <div className="flex gap-3 flex-wrap">
        <Button
          className={`p-2 rounded-full shadow z-10 ${filterMenuOpen ? "bg-gray-300" : ""}`}
          onClick={toggleFiltersMenu}
        >
          Filters
        </Button>
        <Button
          className={`p-2 rounded-full shadow z-10 ${exportMenuOpen ? "bg-gray-300" : ""}`}
          onClick={toggleExportMenu}
        >
          Export
        </Button>
        <Button
          className={`p-2 rounded-full shadow z-10 ${topologicalMenuOpen ? "bg-gray-300" : ""}`}
          onClick={toggleTopologicalMap}
        >
          Topological Map
        </Button>
        <Button
          className={`p-2 rounded-full shadow z-10 ${rosMenuOpen ? "bg-gray-300" : ""}`}
          onClick={toggleRosMenu}
        >
          ROS Menu
        </Button>
      </div>

      <Separator className="my-2" />

      {/* Vineyard data */}
      <h2 className="text-xl underline">Vineyard Data</h2>
      <div className="flex flex-col sm:flex-row mt-2">
        <div className="">
          <p>
            Total Block Area: 0 m<sup>2</sup>
          </p>
          <p>Total Vine Rows: 0</p>
          <p>Total Vines: 0</p>
          <p>Total Vine Row Length: 0 m</p>
          <p>
            Total Under Vine Area: 0 m<sup>2</sup>
          </p>
          <p>
            Total Mid Row Area: 0 m<sup>2</sup>
          </p>
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
      <p>Total Topological Nav Map Edge Length: 0</p>
      <p>Total Topological Nav Map Nodes: 0</p>

      <Separator className="my-2" />

      <h2 className="text-xl underline">Block Data</h2>

      <Table className="border-1 text-xs z-100">
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
