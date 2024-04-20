import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'; // Import routing machine CSS
import Routing from './route';

// Dynamically import the ReactLeafletRouting component with ssr set to false

const Map = () => {
  const startPoint = [51.505, -0.09];
  const endPoint = [51.51, -0.1];

  return (
    <div style={{ height: '100vh' }}>
      <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={startPoint} />
        <Marker position={endPoint} />
        <Routing />
      </MapContainer>
    </div>
  );
};

export default Map;
