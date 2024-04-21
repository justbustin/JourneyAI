import { Button} from "@mui/material";
import Link from "next/link";
import "../styles/index.scss"
import TypingAnimation from "@/components/Typing";
import Map from "@/components/Map";
import IntroMap from "@/components/IntroMap";


export default function Home() {
    return (
        <div>
      <div id="homePageContainer">
        <div id="logoContainer">
        <img id="logo" src="/logo.png" alt="JourneyAI"/>
        </div>
        <div className="typingContainer">
        <TypingAnimation texts={['Embark on a trip through your memories', 'Create new journeys']} typingSpeed={100} />
        </div>
        <div className="btnContainer">
        <a className="link" href="/choices"><Button className="enterButton">click to start</Button></a>
        </div>
      </div>
      <div className="introMapContainer">
      <IntroMap/>
      </div>
      </div>
    );
}
  