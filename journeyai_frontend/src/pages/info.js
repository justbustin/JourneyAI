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
        <Map album={album} />
      </div>
    </div>
  );
}