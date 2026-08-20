import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { HazardPrediction } from '../types/fleet';

const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

export const DriverMapDashboard: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const originInputRef = useRef<HTMLInputElement>(null);
  const destInputRef = useRef<HTMLInputElement>(null);

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
  const [hazards, setHazards] = useState<HazardPrediction[]>([]);
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);
  const [driverMarker, setDriverMarker] = useState<google.maps.Marker | null>(null);

  // Initialize Map and Autocomplete
  useEffect(() => {
    const loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places', 'routes'],
    });

    loader.load().then(() => {
      if (!mapRef.current) return;

      const mapInstance = new google.maps.Map(mapRef.current, {
        center: { lat: 23.2599, lng: 77.4126 },
        zoom: 10,
        mapId: 'COLDTRACE_MAP_DARK',
      });

      const renderer = new google.maps.DirectionsRenderer({
        map: mapInstance,
        suppressMarkers: false,
      });

      setMap(mapInstance);
      setDirectionsRenderer(renderer);

      if (originInputRef.current && destInputRef.current) {
        new google.maps.places.Autocomplete(originInputRef.current);
        new google.maps.places.Autocomplete(destInputRef.current);
      }
    });
  }, []);

  // Calculate Route and Call AI Hazard API
  const handleCalculateRoute = () => {
    if (!originInputRef.current?.value || !destInputRef.current?.value || !directionsRenderer || !map) {
      alert('Please enter both Origin and Destination');
      return;
    }

    const origin = originInputRef.current.value;
    const destination = destInputRef.current.value;

    const directionsService = new google.maps.DirectionsService();

    directionsService.route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      async (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          directionsRenderer.setDirections(result);

          const route = result.routes[0].legs[0];

          // Place initial Driver Marker at Point A
          if (driverMarker) driverMarker.setMap(null);
          const newMarker = new google.maps.Marker({
            position: route.start_location,
            map,
            title: 'Driver Location',
            icon: {
              url: 'https://cdn-icons-png.flaticon.com/512/1995/1995470.png', // Truck icon
              scaledSize: new google.maps.Size(40, 40),
            },
          });
          setDriverMarker(newMarker);

          // Extract waypoints for AI analysis
          const waypoints = route.steps.map((step) => step.instructions.replace(/<[^>]*>?/gm, ''));

          // Call AI Backend for Road Hazard Predictions
          setIsLoadingAI(true);
          try {
            const response = await fetch('http://localhost:5000/api/v1/ai/predict-route-hazards', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                origin: route.start_address,
                destination: route.end_address,
                distanceText: route.distance?.text || '',
                durationText: route.duration?.text || '',
                waypoints: waypoints.slice(0, 10), // Pass key steps
              }),
            });

            const data = await response.json();
            if (data.success) {
              setHazards(data.hazards);
              renderHazardMarkers(data.hazards, map);
            }
          } catch (err) {
            console.error('AI Prediction error:', err);
          } finally {
            setIsLoadingAI(false);
          }
        } else {
          alert('Directions request failed due to ' + status);
        }
      }
    );
  };

  // Render Risk Markers on the Google Map
  const renderHazardMarkers = (hazardList: HazardPrediction[], mapInstance: google.maps.Map) => {
    hazardList.forEach((hazard) => {
      const color = hazard.severity === 'CRITICAL' ? 'red' : hazard.severity === 'HIGH' ? 'orange' : 'yellow';

      const marker = new google.maps.Marker({
        position: hazard.coordinates,
        map: mapInstance,
        title: hazard.hazardType,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: color,
          fillOpacity: 0.9,
          strokeWeight: 2,
          strokeColor: '#FFFFFF',
        },
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="color: #111; font-family: sans-serif; padding: 5px;">
            <h4 style="margin: 0 0 5px; color: ${color === 'red' ? '#d32f2f' : '#111'};">${hazard.hazardType}</h4>
            <p style="margin: 0 0 5px; font-size: 13px;"><strong>Severity:</strong> ${hazard.severity}</p>
            <p style="margin: 0 0 5px; font-size: 12px;">${hazard.description}</p>
            <p style="margin: 0; font-size: 12px; color: #2e7d32;"><strong>Action:</strong> ${hazard.recommendedAction}</p>
          </div>
        `,
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstance, marker);
      });
    });
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      {/* Control Drawer */}
      <div style={{ width: '350px', background: '#1a1a2e', color: '#fff', padding: '20px', overflowY: 'auto' }}>
        <h2>ColdTrace Navigation</h2>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}>Point A (Origin)</label>
          <input
            ref={originInputRef}
            type="text"
            placeholder="Enter starting location..."
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: 'none', marginBottom: '10px' }}
          />

          <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}>Point B (Destination)</label>
          <input
            ref={destInputRef}
            type="text"
            placeholder="Enter destination..."
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: 'none', marginBottom: '15px' }}
          />

          <button
            onClick={handleCalculateRoute}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#00d2d3',
              color: '#fff',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {isLoadingAI ? 'Analyzing Route with AI...' : 'Set Route & Predict Hazards'}
          </button>
        </div>

        <hr style={{ borderColor: '#333', margin: '20px 0' }} />

        {/* AI Hazards Side Panel */}
        <h3>Predicted Road Hazards</h3>
        {hazards.length === 0 ? (
          <p style={{ fontSize: '13px', color: '#888' }}>Set a route to analyze potential road hazards.</p>
        ) : (
          hazards.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: '#16213e',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '10px',
                borderLeft: `4px solid ${
                  item.severity === 'CRITICAL' ? '#ff4d4d' : item.severity === 'HIGH' ? '#ff9f43' : '#feca57'
                }`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{item.hazardType}</span>
                <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: '#333' }}>
                  {item.severity}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#ccc', margin: '6px 0' }}>{item.description}</p>
              <p style={{ fontSize: '11px', color: '#1dd1a1', margin: 0 }}>
                💡 <strong>Rec:</strong> {item.recommendedAction}
              </p>
            </div>
          ))
        )
        }
      </div>

      {/* Google Map Display Container */}
      <div ref={mapRef} style={{ flex: 1, height: '100%' }} />
    </div>
  );
};