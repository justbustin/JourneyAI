"use client"

import Map from "@/components/Map";
import "../styles/info.scss"
import { useSearchParams } from "next/navigation";

export default function Info() {
  const searchParams = useSearchParams();
  const album = searchParams.get("album");
  console.log(album);

  return (
    <div id="infoPageContainer">
      <div className="mapContainer">
        <Map points={[[51.505, -0.09], [51.51, 10.5], [53.51, -10.5]]} album={album} />
      </div>
    </div>
  );
}