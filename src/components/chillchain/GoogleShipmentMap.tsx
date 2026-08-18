import { useEffect, useRef, useState } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import { ROUTES, type RiskLevel } from "@/lib/ChillChain-data";

const strokeFor: Record<RiskLevel, string> = {
  healthy: "#059669",
  warning: "#D97706",
  critical: "#DC2626",
};

const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export function GoogleShipmentMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);

  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  useEffect(() => {
    if (!GOOGLE_MAPS_KEY || !mapRef.current) return;

    let cancelled = false;

    async function loadMap() {
      setOptions({
        key: GOOGLE_MAPS_KEY,
        v: "weekly",
      });

      const { Map } = (await importLibrary("maps")) as google.maps.MapsLibrary;

      if (cancelled || !mapRef.current) return;

      const map = new Map(mapRef.current, {
        center: {
          lat: 22.9734,
          lng: 78.6569,
        },
        zoom: 5,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
        clickableIcons: false,

        styles: [
          {
            featureType: "administrative",
            elementType: "geometry",
            stylers: [{ color: "#d6e3dc" }],
          },
          {
            featureType: "landscape",
            elementType: "geometry",
            stylers: [{ color: "#f5f8f4" }],
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#dceee7" }],
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#ffffff" }],
          },
          {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [{ color: "#6b7d73" }],
          },
          {
            featureType: "poi",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "transit",
            stylers: [{ visibility: "off" }],
          },
        ],
      });

      mapInstance.current = map;

      /*
       * Convert your existing ROUTES data
       * into Google Maps markers and paths.
       *
       * Your current ROUTES uses SVG coordinates,
       * so we use actual Indian city coordinates here.
       */

      const cityCoordinates: Record<
        string,
        google.maps.LatLngLiteral
      > = {
        Indore: {
          lat: 22.7196,
          lng: 75.8577,
        },

        Bhopal: {
          lat: 23.2599,
          lng: 77.4126,
        },

        Delhi: {
          lat: 28.6139,
          lng: 77.209,
        },

        Mumbai: {
          lat: 19.076,
          lng: 72.8777,
        },

        Pune: {
          lat: 18.5204,
          lng: 73.8567,
        },

        Nagpur: {
          lat: 21.1458,
          lng: 79.0882,
        },

        Kolkata: {
          lat: 22.5726,
          lng: 88.3639,
        },

        Jaipur: {
          lat: 26.9124,
          lng: 75.7873,
        },
      };

      ROUTES.forEach((route) => {
        const from = cityCoordinates[route.from];
        const to = cityCoordinates[route.to];

        if (!from || !to) return;

        const color = strokeFor[route.level];

        /*
         * Route line
         */
        const line = new google.maps.Polyline({
          path: [from, to],

          geodesic: true,

          strokeColor: color,
          strokeOpacity: 0.75,
          strokeWeight: route.level === "critical" ? 5 : 4,

          icons: [
            {
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 3,
                fillColor: color,
                fillOpacity: 1,
                strokeWeight: 0,
              },

              offset: "0%",
            },
          ],

          map,
        });

        /*
         * Animate a small moving dot along the route.
         */
        let offset = 0;

        const animation = window.setInterval(() => {
          offset = (offset + 1) % 100;

          const icons = line.get("icons");

          if (icons) {
            icons[0].offset = `${offset}%`;
            line.set("icons", icons);
          }
        }, 80);

        /*
         * Start marker
         */
        createMarker(
          map,
          from,
          route.from,
          route.level,
          () => setSelectedRoute(route.id)
        );

        /*
         * Destination marker
         */
        createMarker(
          map,
          to,
          route.to,
          route.level,
          () => setSelectedRoute(route.id)
        );

        /*
         * Cleanup animation when component unmounts
         */
        return () => {
          window.clearInterval(animation);
        };
      });
    }

    loadMap();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative h-[560px] w-full overflow-hidden rounded-[2rem]">
      <div ref={mapRef} className="h-full w-full" />

      {/* Live badge */}
      <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/70 bg-white/90 px-4 py-2 text-xs font-bold shadow-lg backdrop-blur">
        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
        LIVE TRACKING
      </div>

      {/* Selected route */}
      {selectedRoute && (
        <div className="absolute bottom-5 left-5 rounded-2xl border border-border bg-white/95 px-5 py-4 shadow-xl backdrop-blur">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Selected shipment
          </p>

          <p className="mt-1 font-display text-lg font-bold text-foreground">
            {selectedRoute}
          </p>

          <button
            onClick={() => setSelectedRoute(null)}
            className="mt-2 text-xs font-semibold text-primary"
          >
            Clear selection
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------ */
/* Marker helper                                    */
/* ------------------------------------------------ */

function createMarker(
  map: google.maps.Map,
  position: google.maps.LatLngLiteral,
  label: string,
  level: RiskLevel,
  onClick: () => void
) {
  const color = strokeFor[level];

  const marker = new google.maps.Marker({
    position,
    map,

    title: label,

    label: {
      text: label,
      color: "#40554c",
      fontSize: "11px",
      fontWeight: "600",
    },

    icon: {
      path: google.maps.SymbolPath.CIRCLE,

      scale: 8,

      fillColor: color,
      fillOpacity: 1,

      strokeColor: "#ffffff",
      strokeWeight: 3,
    },
  });

  marker.addListener("click", onClick);
}