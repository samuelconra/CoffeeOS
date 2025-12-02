import { useState, useMemo, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { Search, Filter, Wifi, Zap, Dog, Star, X, Pencil, Trash2, Plus, MapPin } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getCoffeeShops,
  createCoffeeShop,
  updateCoffeeShop,
  deleteCoffeeShop,
  getZones,
  createZone,
  deleteZone,
} from "../api/dataService";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export function MapPage() {
  const queryClient = useQueryClient();

  const { data: shops = [], isLoading } = useQuery({
    queryKey: ["coffeeShops"],
    queryFn: getCoffeeShops,
  });

  const { data: zones = [] } = useQuery({
    queryKey: ["zones"],
    queryFn: getZones,
  });

  // CRUD Mutations
  const createMutation = useMutation({
    mutationFn: createCoffeeShop,
    onSuccess: () => {
      queryClient.invalidateQueries(["coffeeShops"]);
      toast.success("Coffee Shop created!");
      closeModal();
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: updateCoffeeShop,
    onSuccess: (updatedShop) => {
      queryClient.invalidateQueries(["coffeeShops"]);
      toast.success("Coffee Shop updated!");
      setSelectedShop(updatedShop);
      closeModal();
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCoffeeShop,
    onSuccess: () => {
      queryClient.invalidateQueries(["coffeeShops"]);
      toast.success("Coffee Shop deleted!");
      setSelectedShop(null);
    },
    onError: (err) => toast.error(err.message),
  });

  const createZoneMutation = useMutation({
    mutationFn: createZone,
    onSuccess: () => {
      queryClient.invalidateQueries(["zones"]);
      toast.success("Zone created!");
      setIsZoneModalOpen(false);
      if (drawRef.current) {
        drawRef.current.deleteAll();
      }
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteZoneMutation = useMutation({
    mutationFn: deleteZone,
    onSuccess: () => {
      queryClient.invalidateQueries(["zones"]);
      toast.success("Zone deleted!");
    },
    onError: (err) => toast.error(err.message),
  });

  // Estado para el modal de nueva zona
  const [isAddMode, setIsAddMode] = useState(false);
  const isAddModeRef = useRef(false);

  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);
  const [newZoneName, setNewZoneName] = useState("");
  const [currentPolygon, setCurrentPolygon] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [vibeFilter, setVibeFilter] = useState("all");
  const [selectedShop, setSelectedShop] = useState(null);

  // Modal / form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShop, setEditingShop] = useState(null);
  const [formData, setFormData] = useState({
    amenities: { hasWifi: false, hasPowerOutlets: false, isPetFriendly: false },
  });
  const [newShopCoordinates, setNewShopCoordinates] = useState(null);

  // Map refs
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const drawRef = useRef(null);

  useEffect(() => {
    isAddModeRef.current = isAddMode;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.getCanvas().style.cursor = isAddMode ? "crosshair" : "";
    }
  }, [isAddMode]);

  // Filtered shops based on search & vibe
  const filteredShops = useMemo(() => {
    return shops.filter((shop) => {
      const matchesSearch =
        shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        "";
      const matchesVibe = vibeFilter === "all" || shop.vibe === vibeFilter;
      return matchesSearch && matchesVibe;
    });
  }, [shops, searchQuery, vibeFilter]);

  // Initialize Mapbox map once
  useEffect(() => {
    if (isLoading || !mapContainerRef.current) {
      return;
    }
    if (mapInstanceRef.current) {
      return;
    }

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-122.4194, 37.7749],
      zoom: 12,
      pitch: 60,
      attributionControl: false,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
      defaultMode: "simple_select",
    });
    map.addControl(draw, "top-left");
    drawRef.current = draw;

    map.on("click", (e) => {
      if (!isAddModeRef.current) {
        return;
      }

      const mode = draw.getMode();
      if (mode === "draw_polygon") {
        return;
      }

      const { lng, lat } = e.lngLat;
      setNewShopCoordinates([lng, lat]);
      setEditingShop(null);
      setFormData({
        location: { type: "Point", coordinates: [lng, lat] },
        amenities: { hasWifi: false, hasPowerOutlets: false, isPetFriendly: false },
        rating: 5.0,
        name: "",
        slug: "",
        description: "",
        address: "",
        vibe: "Focus",
      });
      setSelectedShop(null);
      setIsModalOpen(true);

      setIsAddMode(false);
    });

    map.on("draw.create", (e) => {
      const feature = e.features[0];
      setCurrentPolygon(feature.geometry);
      setNewZoneName("");
      setIsZoneModalOpen(true);
    });

    map.on("click", "zones-fill", (e) => {
      if (isAddModeRef.current) {
        return;
      }

      const feature = e.features[0];
      const zoneId = feature.properties.id;
      const zoneName = feature.properties.name;

      const polygonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4"><path d="M3 11l18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>`;
      const trashIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-3.5"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>`;

      new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(
          `
            <div class="p-1 min-w-[200px]">
              <div class="flex items-center gap-3 mb-4 pr-4">
                <div class="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  ${polygonIcon}
                </div>
                <div>
                  <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Zone Name</p>
                  <h3 class="font-semibold text-gray-900 text-sm leading-tight">${zoneName}</h3>
                </div>
              </div>
              
              <button 
                id="delete-zone-btn"
                class="flex items-center justify-center gap-2 w-full px-3 py-2 border border-red-200 bg-red-50/50 text-red-600 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all duration-200 cursor-pointer text-xs font-medium"
              >
                ${trashIcon}
                Delete Zone
              </button>
            </div>
          `
        )
        .addTo(map);

      setTimeout(() => {
        const btn = document.getElementById("delete-zone-btn");
        if (btn) {
          btn.onclick = () => {
            if (confirm(`Are you sure you want to delete zone "${zoneName}"?`)) {
              deleteZoneMutation.mutate(zoneId);
              const popup = document.getElementsByClassName("mapboxgl-popup")[0];
              if (popup) {
                popup.remove();
              }
            }
          };
        }
      }, 100);
    });

    // Cambiar cursor sobre zonas
    map.on("mouseenter", "zones-fill", () => {
      if (!isAddModeRef.current) {
        map.getCanvas().style.cursor = "pointer";
      }
    });
    map.on("mouseleave", "zones-fill", () => {
      if (!isAddModeRef.current) {
        map.getCanvas().style.cursor = "";
      } else {
        map.getCanvas().style.cursor = "crosshair";
      }
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [isLoading]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) {
      return;
    }

    // Esperar a que el estilo cargue antes de añadir capas
    if (!map.isStyleLoaded()) {
      map.once("style.load", renderZones);
    } else {
      renderZones();
    }

    function renderZones() {
      const source = map.getSource("zones-source");
      const geoJsonData = {
        type: "FeatureCollection",
        features: zones.map((z) => ({
          type: "Feature",
          properties: { id: z._id, name: z.name },
          geometry: z.location,
        })),
      };

      if (source) {
        source.setData(geoJsonData);
      } else {
        map.addSource("zones-source", {
          type: "geojson",
          data: geoJsonData,
        });

        map.addLayer({
          id: "zones-fill",
          type: "fill",
          source: "zones-source",
          paint: {
            "fill-color": "#a4bee1",
            "fill-opacity": 0.3,
          },
        });

        map.addLayer({
          id: "zones-line",
          type: "line",
          source: "zones-source",
          paint: {
            "line-color": "#1c398e",
            "line-width": 2,
          },
        });
      }
    }
  }, [zones]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) {
      return;
    }

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    filteredShops.forEach((shop) => {
      if (!shop.location || !shop.location.coordinates) {
        return;
      }

      const lng = shop.location.coordinates[0];
      const lat = shop.location.coordinates[1];

      const el = document.createElement("div");
      el.className = "custom-marker cursor-pointer";

      const inner = document.createElement("div");
      inner.className = "transition-transform duration-200 hover:scale-110 text-gray-900";
      inner.innerHTML = `
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" fill="white"></path>
          <circle cx="12" cy="10" r="3" fill="currentColor"></circle>
        </svg>
      `;
      el.appendChild(inner);

      const clickHandler = (e) => {
        e.stopPropagation();
        setSelectedShop(shop);
        map.flyTo({ center: [lng, lat], zoom: 14, essential: true });
      };

      el.addEventListener("click", clickHandler);

      const marker = new mapboxgl.Marker({ element: el, anchor: "bottom" }).setLngLat([lng, lat]).addTo(map);

      markersRef.current.push(marker);
    });
  }, [filteredShops]);

  const handleEdit = (shop) => {
    setEditingShop(shop);
    setFormData({ ...shop });
    setNewShopCoordinates(null);
    setIsModalOpen(true);
  };

  // Delete shop
  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this coffee shop?")) {
      deleteMutation.mutate(id);
    }
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    const dataToSubmit = {
      ...formData,
      location:
        formData.location?.coordinates?.length === 2
          ? formData.location
          : newShopCoordinates
            ? { type: "Point", coordinates: newShopCoordinates }
            : { type: "Point", coordinates: [0, 0] },
      rating: parseFloat(formData.rating ?? 5),
    };

    if (editingShop) {
      updateMutation.mutate({ id: editingShop._id, data: dataToSubmit });
    } else {
      createMutation.mutate(dataToSubmit);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingShop(null);
    setNewShopCoordinates(null);
    setFormData({ amenities: { hasWifi: false, hasPowerOutlets: false, isPetFriendly: false } });
  };

  const handleZoneSubmit = (e) => {
    e.preventDefault();
    if (!currentPolygon) {
      return;
    }

    createZoneMutation.mutate({
      name: newZoneName,
      location: currentPolygon,
    });
  };

  const cancelZoneCreation = () => {
    setIsZoneModalOpen(false);
    if (drawRef.current) {
      drawRef.current.deleteAll();
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading map data...</div>;
  }

  return (
    <div className="h-[calc(100vh-64px)] flex">
      {/* Sidebar */}
      <div className="w-[400px] bg-white border-r border-gray-200/60 flex flex-col z-10 relative shadow-xl">
        <div className="p-6 border-b border-gray-200/60 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search coffee shops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900/20 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="size-5 text-gray-400" />
            <select
              value={vibeFilter}
              onChange={(e) => setVibeFilter(e.target.value)}
              className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900/20 transition-all"
            >
              <option value="all">All Vibes</option>
              <option value="Focus">Focus</option>
              <option value="Social">Social</option>
              <option value="Date">Date</option>
              <option value="Fast">Fast</option>
              <option value="Chill">Chill</option>
            </select>
          </div>

          <button
            onClick={() => setIsAddMode(!isAddMode)}
            className={`w-full p-4 rounded-lg border transition-all flex items-center justify-center gap-2 font-medium cursor-pointer ${
              isAddMode
                ? "bg-gray-900 text-white border-gray-900 ring-2 ring-offset-2 ring-gray-900"
                : "bg-blue-50 text-blue-900 border-blue-100 hover:bg-blue-100"
            }`}
          >
            {isAddMode ? (
              <>
                <MapPin className="size-5" />
                Click map to place shop
              </>
            ) : (
              <>
                <Plus className="size-5" />
                Add New Coffee Shop
              </>
            )}
          </button>
        </div>

        {/* Coffee Shop List */}
        <div className="flex-1 overflow-y-auto">
          {filteredShops.map((shop) => (
            <button
              key={shop._id}
              onClick={() => {
                setSelectedShop(shop);
                if (mapInstanceRef.current && shop.location) {
                  mapInstanceRef.current.flyTo({
                    center: [shop.location.coordinates[0], shop.location.coordinates[1]],
                    zoom: 14,
                    essential: true,
                  });
                }
              }}
              className="w-full p-4 border-b border-gray-200/60 hover:bg-gray-50/50 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-gray-900 font-medium">{shop.name}</h3>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="size-4 fill-current" />
                  <span className="text-gray-700 text-sm">{shop.rating}</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{shop.description}</p>
              <div className="flex items-center gap-3 mb-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-xs font-medium text-gray-700 uppercase tracking-wide">
                  {shop.vibe}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Selected Shop Info Card */}
        {selectedShop && (
          <div className="absolute top-4 left-4 right-4 bg-white rounded-xl shadow-xl border border-gray-200/60 p-5 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300 z-20">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-xl font-semibold text-gray-900">{selectedShop.name}</h3>
              <button
                onClick={() => setSelectedShop(null)}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
              >
                <span className="sr-only">Close</span>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex items-center gap-1 text-amber-500 mb-3">
              <Star className="size-4 fill-current" />
              <span className="text-gray-900 font-medium">{selectedShop.rating}</span>
              <span className="text-gray-400 text-sm">/ 5.0</span>
            </div>

            <p className="text-gray-600 mb-4 text-sm leading-relaxed">{selectedShop.description}</p>
            <p className="text-gray-500 text-sm mb-4 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {selectedShop.address}
            </p>

            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-xs font-semibold text-gray-700 uppercase">
                {selectedShop.vibe}
              </span>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
              {selectedShop.amenities?.hasWifi && (
                <div className="flex items-center gap-1.5 text-gray-600 text-sm" title="WiFi Available">
                  <Wifi className="size-4" />
                  <span>WiFi</span>
                </div>
              )}
              {selectedShop.amenities?.hasPowerOutlets && (
                <div className="flex items-center gap-1.5 text-gray-600 text-sm" title="Power Outlets">
                  <Zap className="size-4" />
                  <span>Power</span>
                </div>
              )}
              {selectedShop.amenities?.isPetFriendly && (
                <div className="flex items-center gap-1.5 text-gray-600 text-sm" title="Pet Friendly">
                  <Dog className="size-4" />
                  <span>Pets</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-4">
              <button
                onClick={() => handleEdit(selectedShop)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <Pencil className="size-4" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(selectedShop._id)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
              >
                <Trash2 className="size-4" />
                Delete
              </button>
            </div>
          </div>
        )}

        {isZoneModalOpen && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Name this Zone</h3>
              <form onSubmit={handleZoneSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="e.g., Downtown District"
                  value={newZoneName}
                  onChange={(e) => setNewZoneName(e.target.value)}
                  required
                  autoFocus
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={cancelZoneCreation}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Save Zone
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Modal  */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200/60 px-6 py-4 flex items-center justify-between">
              <h3 className="text-gray-900">{editingShop ? "Edit Coffee Shop" : "Add New Coffee Shop"}</h3>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="size-5 text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Slug *</label>
                <input
                  type="text"
                  required
                  value={formData.slug || ""}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  value={formData.address || ""}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900/20 transition-all"
                />
              </div>

              {/* Coordinates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Longitude *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={
                      (formData.location && formData.location.coordinates && formData.location.coordinates[0]) ?? ""
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: {
                          type: "Point",
                          coordinates: [parseFloat(e.target.value), formData.location?.coordinates?.[1] ?? 0],
                        },
                      })
                    }
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Latitude *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={
                      (formData.location && formData.location.coordinates && formData.location.coordinates[1]) ?? ""
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: {
                          type: "Point",
                          coordinates: [formData.location?.coordinates?.[0] ?? 0, parseFloat(e.target.value)],
                        },
                      })
                    }
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900/20 transition-all"
                  />
                </div>
              </div>

              {/* Vibe and Rating */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Vibe</label>
                  <select
                    value={formData.vibe || ""}
                    onChange={(e) => setFormData({ ...formData, vibe: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900/20 transition-all"
                  >
                    <option value="">Select vibe</option>
                    <option value="Focus">Focus</option>
                    <option value="Social">Social</option>
                    <option value="Date">Date</option>
                    <option value="Fast">Fast</option>
                    <option value="Chill">Chill</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Rating</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={formData.rating ?? 5}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900/20 transition-all"
                  />
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-gray-700 mb-3">Amenities</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.amenities?.hasWifi || false}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          amenities: { ...formData.amenities, hasWifi: e.target.checked },
                        })
                      }
                      className="size-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900/10"
                    />
                    <span className="text-gray-700">WiFi</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.amenities?.hasPowerOutlets || false}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          amenities: { ...formData.amenities, hasPowerOutlets: e.target.checked },
                        })
                      }
                      className="size-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900/10"
                    />
                    <span className="text-gray-700">Power Outlets</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.amenities?.isPetFriendly || false}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          amenities: { ...formData.amenities, isPetFriendly: e.target.checked },
                        })
                      }
                      className="size-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900/10"
                    />
                    <span className="text-gray-700">Pet Friendly</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200/60">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 border border-gray-200/60 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "Saving..."
                    : editingShop
                      ? "Update"
                      : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MapPage;
