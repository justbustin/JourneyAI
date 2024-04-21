// pages/index.js
import React from 'react';
import TripSlider from '../components/tripSlider';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import PastMap from '@/components/pastTrips';

const trips = [
  { id: 1, name: 'XDD' },
  { id: 2, name: '232' },
  { id: 3, name: '69' },
  // Add more trips here
];

const selectTrip = () => {
  return (

    <div className="container">
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
          background-color: #333333;
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