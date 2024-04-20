import Map from "@/components/Map";
import ImageHover from "@/components/ImageHover";
import "../styles/info.scss"

export default function Info() {

  return (
    <div id="infoPageContainer">
        <div className="textContainer">
        <ImageHover/>
        </div>
        <div className="mapContainer">
        <Map points={[[51.505, -0.09],[51.51, 10.5],[53.51, -10.5]]}/>
        </div>
    </div>
  );
}

// export async function getServerSideProps() {
//   // Fetch points from backend
//   // const response = await fetch('your-backend-endpoint');
//   // const points = await response.json();

//   return {
//     props: {
//       points,
//     },
//   };
// }