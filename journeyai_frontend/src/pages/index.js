import { Button} from "@mui/material";
import Link from "next/link";
import "../styles/index.scss"


export default function Home() {
    return (
      <div id="homePageContainer">
        <div id="logoContainer">
        <img id="logo" src="/logo.png" alt="JourneyAI"/>
        </div>
        <div className="btnContainer">
        <Link className="link" href="/image"><Button className="enterButton">click to start</Button></Link>
        </div>
      </div>
    );
}
  