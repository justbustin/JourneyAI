import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'; // Import routing machine CSS
import "../../styles/map.scss"
import { useSearchParams } from "next/navigation";

import { storage, firestore } from "../../app/firebase";
import { collection, onSnapshot } from "firebase/firestore";


// Dynamically import the ReactLeafletRouting component with ssr set to false

const Map = ({ points, album }) => {
  const [loading, setLoading] = useState(true)
  const [generatedText, setGeneratedText] = useState([])

  const searchParams = useSearchParams();

  const collectionRef = collection(firestore, album);
  console.log("albumname test", album)
  console.log("RAHHHHH", collectionRef)

  useEffect(() => {
    const collectionRef = collection(firestore, album);
    console.log("Setting up listener for album:", album);

    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      console.log("Current number of documents:", snapshot.size);

      snapshot.docChanges().forEach((change) => {
        const doc = change.doc;
        const docData = doc.data();
        
        switch (change.type) {
          case "added":
            console.log("Document added:", docData);
            setGeneratedText(prevGeneratedText => [...prevGeneratedText, docData.text]);
            break;
          case "modified":
            console.log("Document modified:", docData);
            break;
          case "removed":
            console.log("Document removed:", docData);
            break;
        }
      });

      // Example: Update loading state based on a condition
      if (snapshot.size - 1 === parseInt(searchParams.get("length"))) {
        setLoading(false);
        console.log("alr perfect")
      }
    });

    // Cleanup function to unsubscribe from the listener when component unmounts or album changes
    return () => {
      console.log("Cleaning up listener for album:", album);
      unsubscribe();
    };
  }, [album, searchParams]);  // Dependency array includes `album` and `searchParams` to reset listener when they change



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
      <MapContainer center={[points[0][0], points[0][1]]} zoom={13} style={{ height: '90%' }} closePopupOnClick>
        <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png" />
        {points.map((point, index) => (
          <Marker eventHandlers={{ click: handleMarkerClick }} key={index} position={[point[0], point[1]]} icon={customIcon} />
        ))}
        <Polyline positions={points.map(point => [point[0], point[1]])} color="green" />
      </MapContainer>
      {!loading && 
        <div>
          {generatedText.map((itm, key) => {
            {console.log(itm)}
            <div>{itm}</div>
          })}
          </div>
      }
    </div>
  );
};

export default Map;
