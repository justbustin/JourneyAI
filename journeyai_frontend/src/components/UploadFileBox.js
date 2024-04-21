// components/UploadFileBox.js
import "../styles/fileBox.scss"
import React, { useState } from 'react';

const UploadFileBox = ({ onChange }) => {
  const [thumbnails, setThumbnails] = useState([]);

  const handleFileChange = (event) => {
    onChange(event);
    const files = event.target.files;
    const fileThumbnails = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (e) => {
        fileThumbnails.push(e.target.result);
        if (fileThumbnails.length === files.length) {
          setThumbnails(fileThumbnails);
        }
      };

      reader.readAsDataURL(file);
    }
  };


  return (
    <div className="fileBox">
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        style={{ display: 'none' }} // hide the file input
        id="fileInput" // associate label with file input
      />
      <label htmlFor="fileInput" style={{ cursor: 'pointer' }}>
        <div className="fileInputContainer">
          <p>Drag & drop files here or</p>
          <p>click to select files</p>
        </div>
      </label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {thumbnails.reverse().slice(0,3).map((thumbnail, index) => (
          <div key={index} style={{ width: '75px', height: '75px', overflow: 'hidden', marginTop: '10px' }}>
            <img src={thumbnail} alt={`Thumbnail ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            
          </div>

        ))}
        <span>
        {thumbnails.length > 3 && (
    <p>
      + {thumbnails.length - 3} more
    </p>
    
  )}
  </span>
      </div>
    </div>
  );
};

export default UploadFileBox;
