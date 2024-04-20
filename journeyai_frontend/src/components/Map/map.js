import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'; // Import routing machine CSS
import Routing from './route';

// Dynamically import the ReactLeafletRouting component with ssr set to false

const Map = () => {
  const startPoint = [51.505, -0.09];
  const endPoint = [51.51, -0.1];
  
  const [text, setText] = ("");

  useEffect(() => {

  }, [text]);

  return (
    <div style={{ height: '100vh' }}>
      <div>
        {text}
      </div>
      <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100%' }} closePopupOnClick>
        <TileLayer url="https://tile.thunderforest.com/neighbourhood/{z}/{x}/{y}.png?apikey=0e29fe17ee264ba3b1c09f4751bc43c1"/>
        <Marker position={startPoint}/>
        <Marker position={endPoint} />
        <Routing />
      </MapContainer>
    </div>
  );
};

export default Map;
