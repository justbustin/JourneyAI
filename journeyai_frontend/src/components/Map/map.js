import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'; // Import routing machine CSS
import "../../styles/map.scss"
import ImageHover from '../ImageHover'; import { useSearchParams } from "next/navigation";

import { storage, firestore } from "../../app/firebase";
import { ref, listAll, getDownloadURL, getMetadata } from 'firebase/storage';
import { collection, onSnapshot, setIndexConfiguration } from "firebase/firestore";


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
  const [time, setTime] = useState("")
  const [loading, setLoading] = useState(true)
  const [generatedText, setGeneratedText] = useState([])
  const [index, setIndex] = useState(0);  

  const searchParams = useSearchParams();

  useEffect(() => {
    const getList = async () => {
      const listRef = ref(storage, album);
      const list = await listAll(listRef);
      const temp_urls = [];
      const temp_coords = [];
      const temp_times = [];
      for (let i = 0; i < list.items.length; i++) {
        const item = list.items[i];
        const url = await getDownloadURL(item);
        const metadata = await getMetadata(item);
        temp_urls.push(url);
        const coord = [ParseDMS(metadata.customMetadata.latitude), ParseDMS(metadata.customMetadata.longitude)];
        const time = metadata.customMetadata.time
        temp_times.push(time)
        temp_coords.push(coord);
      }
      setImageURLs(temp_urls);
      setCoords(temp_coords);
      setTime(temp_times)

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

      const temp_text = []
      snapshot.docChanges().forEach((change) => {
        const doc = change.doc;
        console.log(doc);
        const docData = doc.data();

        switch (change.type) {
          case "added":
            console.log("Document added:", docData);
            temp_text.push(docData.text);
            break;
          case "modified":
            console.log("Document modified:", docData);
            break;
          case "removed":
            console.log("Document removed:", docData);
            break;
        }
      });
      console.log(temp_text);

      setGeneratedText([...generatedText, ...temp_text]);

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


  const handleMarkerClick = (index) => {
    console.log('Marker clicked!');
    setHovering(!hovering);
    setIndex(index);
  };

  return (
    <div className='mapContainer'>
      {
        hovering && <ImageHover generatedText={generatedText[index]} coord={coords[index]} />
      }
      {
        coords.length > 0 &&
        <MapContainer center={[coords[0][0], coords[0][1]]} zoom={13} style={{ height: '100%', flexGrow: 1 }} closePopupOnClick>
          <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png" />
          {coords.map((coord, index) => (
            <ZoomableMarker
              position={coord}
              time={time[index]}
              imageURL={imageURLs[index]}
              index={index}
              onClick={handleMarkerClick}
              key={index}
            />
          ))}
          <Polyline positions={coords.map(coord => [coord[0], coord[1]])} color="green" />
        </MapContainer>
      }
    </div>
  );
  
};

const ZoomableMarker = ({ position, time, imageURL, index, onClick }) => {
  const map = useMap();
  const [hovering, setHovering] = useState(false)
  const [iconSize, setIconSize] = useState([100, 160]);

  const targetZoomLevel = 17;  // Set your desired zoom level here
    
  const timeString = time;

  const formattedString = timeString.replace(/(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3');

  const dateTime = new Date(formattedString);

  const options = { year: 'numeric', month: 'long', day: 'numeric' };

  const readableDate = dateTime.toLocaleDateString('en-US', options);

  console.log(readableDate);  // Outputs: "April 5, 2024"



  const customIcon = (url) => {
    return L.divIcon({
      html: hovering ? `<div style="text-align: center; position: relative;">
             <div style="color: white; font-size: 30px; font-weight: bold; padding: 2px 4px; border-radius: 8px; position: absolute; left: 50%; transform: translateX(-50%); top: -40px;">
              ${readableDate}   <!-- Text above the marker -->
             </div>
             <img src="${url}" style="width: ${iconSize[0]}px; height: ${iconSize[1]}px;">  <!-- Marker icon -->
           </div>` : `<div style="text-align: center; position: relative;">
           <div style="color: white; font-size: 30px; font-weight: bold; padding: 2px 4px; border-radius: 8px; position: absolute; left: 50%; transform: translateX(-50%); top: -40px;">
              <!-- Text above the marker -->
           </div>
           <img src="${url}" style="width: ${iconSize[0]}px; height: ${iconSize[1]}px;">  <!-- Marker icon -->
         </div>`,
      iconSize: iconSize, // Size of the icon
      iconAnchor: [iconSize[0] / 2, iconSize[1] / 2], // Anchor point of the icon, relative to its top left corner
    });
  }

  const handleClick = () => {
    onClick(index);  // Handle the hovering and other side effects
    if (map.getZoom() !== targetZoomLevel) {
      map.panTo(position)
      map.setView(position, targetZoomLevel);  // Set the view with the target zoom level
    } else {
      map.panTo(position);  // Only recenter the map if already at target zoom level
      map.setView(position, 12)
    }

    if (!hovering) {
      setIconSize([20 * 18, 30 * 18])
    }
    else {
      setIconSize([100, 160])
    }

    setHovering(!hovering)
  };

  return (
    <Marker position={position} icon={customIcon(imageURL)} eventHandlers={{ click: handleClick }} />
  );
};


export default Map;
