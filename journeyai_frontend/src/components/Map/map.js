import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'; // Import routing machine CSS
import Routing from './route';

import { storage, firestore} from "../../app/firebase";
import { collection, onSnapshot } from "firebase/firestore";


// Dynamically import the ReactLeafletRouting component with ssr set to false

const Map = ({points}) => {

  const collectionRef = collection(firestore, "123");
  const watcher = onSnapshot(collectionRef, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const doc = change.doc;
      const docData = doc.data();
  
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


  const handleMarkerClick = () => {
    console.log('Marker clicked!');
    // Add your custom logic here
  };

  return (
    <div style={{ height: '100vh' }}>
      <div>
        {text}
      </div>
      <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100%' }} closePopupOnClick>
        <TileLayer url="https://tile.thunderforest.com/neighbourhood/{z}/{x}/{y}.png?apikey=0e29fe17ee264ba3b1c09f4751bc43c1"/>
        {points.map((point, index) => (
        <Marker eventHandlers={{ click: handleMarkerClick }} key={index} position={[point[0], point[1]]} />
      ))}
        {/* <Routing points={points} /> */}
      </MapContainer>
    </div>
  );
};

export default Map;
