import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'; // Import routing machine CSS
import dynamic from 'next/dynamic';

// Dynamically import the ReactLeafletRouting component with ssr set to false
const ReactLeafletRouting = dynamic(() => import('react-leaflet-routing-machine'), { ssr: false });

const Map = () => {

    useEffect(() => {
        // Initialize Leaflet map inside useEffect
        const map = L.map('map');
        map.setView([51.505, -0.09], 13);
    
        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
        }).addTo(map);
    
        // Cleanup function
        return () => {
          map.remove(); // Remove the map when component unmounts
        };
      }, []);

  const startPoint = [51.505, -0.09];
  const endPoint = [51.51, -0.1];

  return (
    <div style={{ height: '100vh' }}>
      <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={startPoint} />
        <Marker position={endPoint} />
        <ReactLeafletRouting
          positionServiceOptions={{
            timeout: 10000,
            maximumWait: 10000,
            setView: true,
          }}
          route={L.Routing.control({
            waypoints: [
              L.latLng(startPoint[0], startPoint[1]),
              L.latLng(endPoint[0], endPoint[1]),
            ],
          })}
        />
      </MapContainer>
    </div>
  );
};

export default Map;
