"use client"

import Map from "@/components/Map";
import "../styles/info.scss"
import { useSearchParams } from "next/navigation";

export default function Info() {
  const searchParams = useSearchParams();
  const album = searchParams.get("album");
  console.log(album);

  return (
    <div>
      <div className="logoSection">
    <div id="logoContainer">
        <a href="/choices">
    <img id="logo" src="/logo.png" alt="JourneyAI"/>
    </a>
    </div>
    </div>
      <div id="infoPageContainer">
        <div className="mapContainer">
          <Map album={album} />
        </div>
      </div>
    </div>
  );
}