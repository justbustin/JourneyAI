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
        <div className="btnContainer">
        <Link className="link" href="/image"><Button className="enterButton">click to start</Button></Link>
        </div>
        <div>
        <TypingAnimation texts={['Embark on a trip through your memories', 'Text 2', 'Text 3']} typingSpeed={150} />
        </div>
      </div>
        <div className="introMapContainer">
        <IntroMap/>
        </div>
        </div>
    );
}
  