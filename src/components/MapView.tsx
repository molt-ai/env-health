"use client";

import { useEffect, useRef, useState } from "react";
import { ToxicFacility } from "@/lib/types";

interface Props {
  lat: number;
  lng: number;
  facilities: ToxicFacility[];
  locationName: string;
}

export default function MapView({ lat, lng, facilities, locationName }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initRef = useRef(false);

  useEffect(() => {
    // Guard against double-init (React strict mode / re-renders)
    if (!mapRef.current || initRef.current) return;
    initRef.current = true;

    const loadMap = async () => {
      try {
        const L = await import("leaflet");

        // Import CSS
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          document.head.appendChild(link);
        }

        await new Promise(resolve => setTimeout(resolve, 200));

        if (!mapRef.current) return;

        // If there's already a map on this container, remove it first
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        const map = L.map(mapRef.current, {
          zoomControl: true,
          scrollWheelZoom: true,
        }).setView([lat, lng], 13);
        mapInstanceRef.current = map;

        L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
          attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map);

        // Restrict to roughly US bounds
        map.setMaxBounds(L.latLngBounds([18, -135], [55, -60]));
        map.setMinZoom(4);

        const homeIcon = L.divIcon({
          className: "custom-marker",
          html: `<div style="background: #3ecf8e; width: 28px; height: 28px; border-radius: 50%; border: 3px solid rgba(255,255,255,0.9); box-shadow: 0 2px 12px rgba(62,207,142,0.4); position: relative;"><div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:8px;height:8px;background:white;border-radius:50%;"></div></div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const toxicIcon = L.divIcon({
          className: "custom-marker",
          html: `<div style="background: #ef4444; width: 18px; height: 18px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.8); box-shadow: 0 2px 8px rgba(239,68,68,0.3); opacity: 0.85;"></div>`,
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        });

        // Draw area circle (approx ZIP code area ~3km radius)
        L.circle([lat, lng], {
          radius: 3000,
          color: '#3ecf8e',
          fillColor: '#3ecf8e',
          fillOpacity: 0.06,
          weight: 1.5,
          opacity: 0.3,
          dashArray: '6, 4',
        }).addTo(map);

        L.marker([lat, lng], { icon: homeIcon })
          .addTo(map)
          .bindPopup(`<strong>${locationName}</strong><br>Searched location`)
          .openPopup();

        const facilitiesWithCoords = facilities.filter(
          f => f.latitude && f.longitude && f.latitude !== 0 && f.longitude !== 0
        );

        for (const f of facilitiesWithCoords) {
          if (f.latitude && f.longitude) {
            L.marker([f.latitude, f.longitude], { icon: toxicIcon })
              .addTo(map)
              .bindPopup(
                `<strong>${f.facilityName}</strong><br>${f.industry !== "Unknown" ? f.industry + "<br>" : ""}${f.streetAddress}, ${f.city}`
              );
          }
        }

        if (facilitiesWithCoords.length > 0) {
          const allPoints: [number, number][] = [[lat, lng]];
          for (const f of facilitiesWithCoords) {
            if (f.latitude && f.longitude) {
              allPoints.push([f.latitude, f.longitude]);
            }
          }
          map.fitBounds(L.latLngBounds(allPoints), { padding: [30, 30], maxZoom: 14 });
        }

        // Force Leaflet to recalculate size after render
        setTimeout(() => map.invalidateSize(), 300);

        setIsLoaded(true);
      } catch (err) {
        console.error("Map load error:", err);
        setError("Failed to load map");
      }
    };

    loadMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      initRef.current = false;
    };
  }, [lat, lng, facilities, locationName]);

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden">
      <div className="px-6 pt-4 pb-2">
        <h3 className="text-lg font-bold text-[var(--text-primary)]">Map View</h3>
        <p className="text-xs text-[var(--text-muted)]">
          Location and nearby TRI facilities
        </p>
      </div>
      
      {error ? (
        <div className="px-6 pb-4">
          <p className="text-sm text-[var(--accent-red)]">{error}</p>
        </div>
      ) : (
        <>
          <div
            ref={mapRef}
            className="w-full h-80 md:h-96"
            style={{ background: "var(--bg-secondary)" }}
          />
          {!isLoaded && (
            <div className="flex items-center justify-center h-80 md:h-96 absolute inset-0">
              <p className="text-sm text-[var(--text-muted)]">Loading map...</p>
            </div>
          )}
          <div className="px-6 py-3 flex flex-wrap gap-4 text-xs text-[var(--text-muted)]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#3ecf8e" }} />
              Searched location
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border border-[rgba(62,207,142,0.3)]" style={{ backgroundColor: "transparent", borderColor: "#3ecf8e", opacity: 0.5 }} />
              ~ZIP area
            </div>
            {facilities.some(f => f.latitude && f.longitude) && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#ef4444" }} />
                TRI facility
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
