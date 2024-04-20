// components/UploadFileBox.js

import React, { useState } from 'react';

const UploadFileBox = ({ onChange }) => {
  const [thumbnails, setThumbnails] = useState([]);

  const handleFileChange = (event) => {
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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', minHeight: '400px' }}>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        style={{ display: 'none' }} // hide the file input
        id="fileInput" // associate label with file input
      />
      <label htmlFor="fileInput" style={{ cursor: 'pointer' }}>
        <div style={{ border: '2px dashed #aaa', padding: '20px', marginBottom: '20px' }}>
          <p>Drag & drop files here or</p>
          <p>click to select files</p>
        </div>
      </label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {thumbnails.map((thumbnail, index) => (
          <div key={index} style={{ width: '100px', height: '100px', overflow: 'hidden' }}>
            <img src={thumbnail} alt={`Thumbnail ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadFileBox;
