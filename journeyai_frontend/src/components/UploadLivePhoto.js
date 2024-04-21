import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';

const WebcamCapture = ({livePhotoChange}) => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const startCapture = () => {
    setIsCapturing(true);
  };

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setIsCapturing(false); // Stop capturing after taking the picture
    livePhotoChange(imageSrc);
  };

  const retake = () => {
    setCapturedImage(null);
  };

  return (
    <div>
      {!capturedImage && !isCapturing && (
        <button onClick={startCapture}>Capture</button>
      )}
      {isCapturing && (
        <div>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
          />
          <button onClick = {capture}>Capture</button>
        </div>
      )}
      {capturedImage && !isCapturing && (
        <>
          <img src={capturedImage} alt="Captured" />
          <button onClick={retake}>Retake</button>
        </>
      )}
    </div>
  );
};

export default WebcamCapture;
