import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'; // Import routing machine CSS
import Routing from './route';
import "../../styles/map.scss"

import { storage, firestore} from "../../app/firebase";
import { collection, onSnapshot } from "firebase/firestore";


// Dynamically import the ReactLeafletRouting component with ssr set to false

const Map = ({points}) => {

  const collectionRef = collection(firestore, "test21");
  const watcher = onSnapshot(collectionRef, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const doc = change.doc;
      const docData = doc.data();
      console.log(docData)
  
      // Handle changes based on the change type
      switch (change.type) {
        case "added":
          console.log("Document added:", docData);
          
          // Perform actions for a new document
          break;
        case "modified":
          console.log("Document modified:", docData);
          // Perform actions for a modified document
          break;
        case "removed":
          console.log("Document removed:", docData);
          // Perform actions for a removed document
          break;
      }
    });
  });
  

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
      <MapContainer center={[points[0][0],points[0][1]]} zoom={13} style={{ height: '100%' }} closePopupOnClick>
        <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"/>
        {points.map((point, index) => (
        <Marker eventHandlers={{ click: handleMarkerClick }} key={index} position={[point[0], point[1]]} icon={customIcon} />
      ))}
        {/* <Routing points={points} /> */}
      </MapContainer>
    </div>
  );
};

export default Map;
