import { Button} from "@mui/material";
import Link from "next/link";
import "../styles/choices.scss"
import TypingLinkAnimation from "@/components/TypingLink";
import Map from "@/components/Map";
import IntroMap from "@/components/IntroMap";
import Marker from "../../assets/svgs/marker";
import Globe from "../../assets/svgs/globe";


export default function Choices() {
    return (
      <div id="choicesPageContainer">
        <div className="logoSection">
        <div id="logoContainer">
            <a href="/choices">
        <img id="logo" src="/logo.png" alt="JourneyAI"/>
        </a>
        </div>
        </div>
        <div className="typingContainer">
        </div>
        <div className="btnContainer">
            <div className="markerSection">
            <div className="markerContainer">
        <div className="markerDiv">

            <Marker className="marker"/>
        </div>
        <div className="btnContainer">
            <a className="link" href="/image"><TypingLinkAnimation word="Create a journey"/></a>
        </div>
        </div>
        <div className="markerContainer">
        <div className="markerDiv">
        <Marker className="marker"/>
        </div>
        <div className="btnContainer">
            <a className="link" href="/selectTrip"><TypingLinkAnimation word="Relive a journey" /></a>
        </div>
        </div>
        </div>
        <div className="globe">
        <Globe />
        </div>
        </div>
        {/* <div className="introMapContainer">
        <IntroMap/>
        </div> */}
      </div>
    );
}
  