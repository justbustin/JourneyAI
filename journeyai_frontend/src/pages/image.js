// pages/index.js


import "../styles/image.scss"
import React, { useState } from 'react';
import UploadFileBox from '../components/UploadFileBox';
import { storage } from "../app/firebase";
import { ref, uploadBytesResumable, updateMetadata, getMetadata } from "firebase/storage";

import EXIF from 'exif-js';

const IndexPage = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFiles([...selectedFiles, ...event.target.files]);
  };

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      selectedFiles.forEach((image) => {
        EXIF.getData(image, function() {
          const allMetaData = EXIF.pretty(this);
          const metaDataObject = EXIF.getAllTags(this);
          console.log(`Metadata for ${image.name}:`, metaDataObject);
          console.log('OG TIME:', metaDataObject.DateTimeOriginal);
          
          const storageRef = ref(storage, `images/${image.name}`);
          const uploadTask = uploadBytesResumable(storageRef, image);
  
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log(`Upload is ${progress}% done`);
            },
            (error) => {
              console.log(error.message);
            },
            () => {
              /*
              const customMetadata = { metadata: allMetaData };
              const fileRef = ref(storage, uploadTask.snapshot.ref.fullPath);

              getMetadata(storageRef)
              .then((metadata) => {
                const storageObjectId = metadata.fullPath; // This is the Storage Object ID
                console.log("Storage Object ID:", storageObjectId);
              })
              .catch((error) => {
              // Handle metadata retrieval error
              });
              */
              
              const customMetadata = {
                time: metaDataObject.DateTimeOriginal,
              };


              updateMetadata(storageRef, {customMetadata})
                .then((metadata) => {
                  console.log("Metadata updated successfully");
                  console.log(metadata);
                })
                .catch((error) => {
                  console.error("Error updating metadata:", error);
                });
              
            }
          );
        });
      });
    }
  };

  return (
    <div id="imagePageContainer">
      <h1 className="heading">Upload Multiple Files Example</h1>
      <UploadFileBox onChange={handleFileChange} />
      {selectedFiles.length > 0 && (
        <div>
          <h2>Selected Files:</h2>
          <ul>
            {selectedFiles.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default IndexPage;
