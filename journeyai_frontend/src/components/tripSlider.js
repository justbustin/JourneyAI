// TripSlider.js
import React from 'react';
import { useRouter } from "next/navigation";

const TripSlider = ({ trips }) => {

    const router = useRouter();
    const handleClick = (trip) => {
        console.log("Clicked trip:", trip);
        router.push(`/info?album=${trip.name}`);
    };

    

  return (
    <div className="sliderContainer">
      <h2>Your Trips</h2>
      <ul className="tripList">
        {trips.map((trip) => (
          <li key={trip.id} className="tripItem" onClick={() => handleClick(trip)}>
            {trip.name}
          </li>
        ))}
      </ul>

      <style jsx>{`
        .sliderContainer {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 300px;
          background-color: rgba(51,51,51,0.8);
          padding: 20px;
          z-index: 1;
          overflow-y: auto;
          color: white;
        }

        .tripList {
          list-style-type: none;
          padding: 0;
        }

        .tripItem {
          padding: 10px;
          cursor: pointer;
        }

        .tripItem:hover {
          background-color: #333333;
        }
      `}</style>
    </div>
  );
};

export default TripSlider;