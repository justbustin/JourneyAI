import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'; // Import routing machine CSS
import "../../styles/map.scss"
import ImageHover from '../ImageHover';import { useSearchParams } from "next/navigation";

import { storage, firestore } from "../../app/firebase";
import { ref, listAll, getDownloadURL, getMetadata } from 'firebase/storage';
import { collection, onSnapshot } from "firebase/firestore";


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
  const [hovering, setHovering] = useState(false);
  const [imageURLs, setImageURLs] = useState([]);
  const [coords, setCoords] = useState([])
  const [loading, setLoading] = useState(true)
  const [generatedText, setGeneratedText] = useState("test")

  const searchParams = useSearchParams();

  useEffect(() => {
    const getList = async () => {
      const listRef = ref(storage, album);
      const list = await listAll(listRef);
      const temp_urls = [];
      const temp_coords = [];
      for (let i = 0; i < list.items.length; i++) {
        const item = list.items[i];
        const url = await getDownloadURL(item);
        const metadata = await getMetadata(item);
        temp_urls.push(url);
        const coord = [ParseDMS(metadata.customMetadata.latitude), ParseDMS(metadata.customMetadata.longitude)];
        temp_coords.push(coord);
      }
      setImageURLs(temp_urls);
      setCoords(temp_coords);


    };
    getList();
  }, [])

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
            setGeneratedText(docData.text);
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
        console.log("GENTEXT AT MAP", generatedText)
        console.log("alr perfect")
      }
    });

    // Cleanup function to unsubscribe from the listener when component unmounts or album changes
    return () => {
      console.log("Cleaning up listener for album:", album);
      unsubscribe();
    };
  }, [album, searchParams]);  // Dependency array includes `album` and `searchParams` to reset listener when they change


  const customIcon = (url) => {
    console.log(coords);
    console.log(url);
    return L.icon({
      iconUrl: url, // URL or path to the icon image
      iconSize: [100, 160], // Size of the icon
      iconAnchor: [20, 40], // Anchor point of the icon, relative to its top left corner
      popupAnchor: [0, -40] // Popup anchor point, relative to the icon's anchor
    });
  }


  const handleMarkerClick = () => {
    console.log('Marker clicked!');
    setHovering(!hovering);
  };

  return (
    <div className='mapContainer'>
      {
        hovering && <ImageHover generatedText={generatedText}/>
      }
      {
        coords.length > 0 &&
        <MapContainer center={[coords[0][0], coords[0][1]]} zoom={13} style={{ height: '100%' }} closePopupOnClick>
          <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png" />
          {coords.map((coord, index) => (
            <Marker eventHandlers={{ click: handleMarkerClick }} key={index} position={coord} icon={customIcon(imageURLs[index])} />
          ))}
          <Polyline positions={coords.map(coord => [coord[0], coord[1]])} color="green" />
        </MapContainer>
      }
    </div>
  );
};

export default Map;
