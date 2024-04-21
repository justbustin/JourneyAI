// pages/index.js
import React from 'react';
import TripSlider from '../components/tripSlider';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import PastMap from '@/components/pastTrips';
import "../styles/selectTrips.scss";

const trips = [
  { id: 1, name: 'japantrip' },
  { id: 2, name: 'asia4' },
  { id: 3, name: 'asia5' },
  // Add more trips here
];

const selectTrip = () => {
  return (

    <div className="container">
       <div className="logoSection">
        <div id="logoContainer">
            <a href="/choices">
        <img id="logo" src="/logo.png" alt="JourneyAI"/>
        </a>
        </div>
        </div>
      <TripSlider trips={trips} />
      <div className="mapContainer">
        {/* Render your map background image here */}
        <PastMap/>
      </div>

      <style jsx>{`
        .container {
          position: relative;
          height: 100vh;
          width: 100vw;
          z-index: 10;
        }

        .mapContainer {
          height: 100%;
          width: 100%;
          z-index: -1;
          position: absolute;
        }

        .mapBackground {
          height: 100%;
          width: 100%;
          object-fit: cover;
        }
      `}</style>

      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
            sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        #__next {
          height: 100vh;
          width: 100vw;
          overflow: hidden;
        }
      `}</style>
    </div>

  );
};

export default selectTrip;