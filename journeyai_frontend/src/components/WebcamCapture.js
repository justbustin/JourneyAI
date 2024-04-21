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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', minHeight: '0px' }}>
      {!capturedImage && !isCapturing && (
        <button className="captureButton" style={styles.captureButton} onClick={startCapture}>Capture A Live Photo</button>
      )}
      {isCapturing && (
        <div>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
          />
          <button className="captureButton" style={styles.captureButton} onClick = {capture}>Capture</button>
        </div>
      )}
      {capturedImage && !isCapturing && (
        <>
          <img src={capturedImage} alt="Captured" />
          <button className="captureButton" style={styles.captureButton} onClick={retake}>Retake</button>
        </>
      )}
    </div>
  );
};

const styles = {
  captureButton: {
    display: 'inline-block',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    color: '#fff', /* White text color */
    backgroundColor: '#428bca', /* Blue background color */
    font: 'inherit',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
  },
  captureButtonHover: {
    backgroundColor: '#357ebd', /* Darker blue on hover */
  },
};

export default WebcamCapture;
