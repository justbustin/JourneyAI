import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'; // Import routing machine CSS
import "../../styles/map.scss"

import { storage, firestore} from "../../app/firebase";
import { collection, onSnapshot } from "firebase/firestore";


// Dynamically import the ReactLeafletRouting component with ssr set to false

const IntroMap = () => {
  

  const startPoint = [51.505, -0.09];
  const endPoint = [51.51, -0.1];
  
  const [text, setText] = ("");

  useEffect(() => {

  }, [text]);


  const customIcon = L.icon({
    iconUrl: '/marker.png', // URL or path to the icon image
    iconSize: [26.72, 40], // Size of the icon
    iconAnchor: [20, 40], // Anchor point of the icon, relative to its top left corner
    popupAnchor: [0, -40] // Popup anchor point, relative to the icon's anchor
  });


  const handleMarkerClick = () => {
    console.log('Marker clicked!');
    // Add your custom logic here
  };

  return (
    <div className='mapContainer'>
      <div>
        {text}
      </div>
      <MapContainer center={[34.068920,-118.445183]} zoom={12} style={{ height: '100%' }} closePopupOnClick zoomControl={false} attributionControl={false}>
        <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"/>
        <Marker eventHandlers={{ click: handleMarkerClick }} position={[34.068920,-118.445183]} icon={customIcon} />
        {/* <Polyline positions={points.map(point => [point[0], point[1]])} color="green" /> */}
      </MapContainer>
    </div>
  );
};

export default IntroMap;
