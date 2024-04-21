import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'; // Import routing machine CSS
import "../../styles/map.scss"

import { storage, firestore } from "../../app/firebase";
import { ref, listAll, getDownloadURL, getMetadata } from 'firebase/storage';
import { collection, onSnapshot } from "firebase/firestore";
import { listItemSecondaryActionClasses } from '@mui/material';


// Dynamically import the ReactLeafletRouting component with ssr set to false
function ConvertDMSToDD(degrees, minutes, seconds, direction) {
  const dd = Number(degrees) + Number(minutes) / 60 + Number(seconds) / 3600;

  if (direction == "S" || direction == "W") {
    return -dd;
  }

  return dd;
}

function ParseDMS(input) {
  const parts = input.split(",");
  const latOrLong = ConvertDMSToDD(parts[0], parts[1], parts[2], parts[3]);
  return latOrLong;
}

const Map = ({ album }) => {
  const [imageURLs, setImageURLs] = useState([]);
  const [coords, setCoords] = useState([])

  useEffect(() => {
    const getList = async () => {
      const listRef = ref(storage, album);
      const list = await listAll(listRef);
      list.items.forEach(async (item) => {
        const url = await getDownloadURL(item);
        const metadata = await getMetadata(item);
        console.log(metadata);
        setImageURLs([...imageURLs, url]);
        const coord = [ParseDMS(metadata.customMetadata.latitude), ParseDMS(metadata.customMetadata.longitude)];
        console.log(coord);
        setCoords([...coords, coord]);
      })
    };
    getList();
  }, [])

  const collectionRef = collection(firestore, album);
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
        {imageURLs.map((imageURL) => {
          return (
            <img src={imageURL} />
          )
        })}
      </div>
      {
        coords.length > 0 &&
        <MapContainer center={[coords[0][0], coords[0][1]]} zoom={13} style={{ height: '100%' }} closePopupOnClick>
          <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png" />
          {coords.map((coord, index) => (
            <Marker eventHandlers={{ click: handleMarkerClick }} key={index} position={[coord[0], coord[1]]} icon={customIcon} />
          ))}
          <Polyline positions={coords.map(coord => [coord[0], coord[1]])} color="green" />
        </MapContainer>
      }
    </div>
  );
};

export default Map;
