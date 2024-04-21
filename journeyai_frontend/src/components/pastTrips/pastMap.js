import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'; // Import routing machine CSS
import "../../styles/introMap.scss"


// Dynamically import the ReactLeafletRouting component with ssr set to false

const PastMap = () => {


  const customIcon1 = L.icon({
    className: 'custom-icon',
    iconUrl: '/ben.jpg', // URL or path to the icon image
    iconSize: [40, 40], // Size of the icon
    iconAnchor: [20, 40], // Anchor point of the icon, relative to its top left corner
    popupAnchor: [0, -40] // Popup anchor point, relative to the icon's anchor
  });

  const customIcon2 = L.icon({
    className: 'custom-icon',
    iconUrl: '/hammy.jpg', // URL or path to the icon image
    iconSize: [40, 40], // Size of the icon
    iconAnchor: [20, 40], // Anchor point of the icon, relative to its top left corner
    popupAnchor: [0, -40] // Popup anchor point, relative to the icon's anchor
  });

  const customIcon3 = L.icon({
    className: 'custom-icon',
    iconUrl: '/nelson.jpg', // URL or path to the icon image
    iconSize: [40, 40], // Size of the icon
    iconAnchor: [20, 40], // Anchor point of the icon, relative to its top left corner
    popupAnchor: [0, -40] // Popup anchor point, relative to the icon's anchor
  });


  const handleMarkerClick = () => {
    console.log('Marker clicked!');
    // Add your custom logic here
  };

  return (
    <div className='mapContainer'>
      <MapContainer center={[34.018820,-118.245183]} zoom={12} style={{ height: '100%' }} closePopupOnClick zoomControl={false} attributionControl={false}>
        <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"/>
        <Marker eventHandlers={{ click: handleMarkerClick }} position={[34.068920,-118.445183]} icon={customIcon1} />
        <Marker eventHandlers={{ click: handleMarkerClick }} position={[34.0806,-118.0728]} icon={customIcon2} />
        <Marker eventHandlers={{ click: handleMarkerClick }} position={[34.018920,-118.445183]} icon={customIcon3} />
        {/* <Polyline positions={points.map(point => [point[0], point[1]])} color="green" /> */}
      </MapContainer>
    </div>
  );
};

export default PastMap;
