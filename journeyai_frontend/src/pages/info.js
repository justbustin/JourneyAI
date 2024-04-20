import Map from "@/components/Map";
import ImageHover from "@/components/ImageHover";
import "../styles/info.scss"

export default function Info() {

  return (
    <div id="infoPageContainer">
        <div>
        <ImageHover/>
        </div>
        <div class="mapContainer">
        <Map />
        </div>
    </div>
  );
}
