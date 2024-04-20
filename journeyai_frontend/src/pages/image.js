// pages/index.js


import "../styles/image.scss"
import React, { useState } from 'react';
import UploadFileBox from '../components/UploadFileBox';
import { storage } from "../app/firebase";
import { ref, uploadBytesResumable, updateMetadata, getMetadata } from "firebase/storage";
import { Button, TextField } from "@mui/material";
import EXIF from 'exif-js';

const IndexPage = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [albumName, setAlbumName] = useState("");

  const handleFileChange = (event) => {
    setSelectedFiles([...selectedFiles, ...event.target.files]);
  };

  const handleAlbumNameChange = (event) => {
    setAlbumName(event.target.value);
  };

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      selectedFiles.forEach((image) => {
        EXIF.getData(image, function() {
          const metaDataObject = EXIF.getAllTags(this);
          console.log(`Metadata for ${image.name}:`, metaDataObject);
          console.log('OG TIME:', metaDataObject.DateTimeOriginal);
          
          const storageRef = ref(storage, `${albumName}/${image.name}`);
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
                latitude: metaDataObject.GPSLatitude.toString(),
                longitude: metaDataObject.GPSLongitude.toString()

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
        <div id="title">
            <h1>
            Create your journey
            </h1>
        </div>
      <div id="textInputContainer"> 
      <TextField
        id="textInput"
        type="text"
        placeholder="Enter album name"
        value={albumName}
        onChange={handleAlbumNameChange}
      />
      </div>
      <UploadFileBox onChange={handleFileChange} />
      {selectedFiles.length > 0 && (
        <div>
          <h2>Selected Files:</h2>
          <ul>
          {selectedFiles.slice(0, 4).map((file, index) => (
            <li key={index}>{file.name}</li>
        ))}
        {selectedFiles.length > 4 && (
            <li id="extra">+ {selectedFiles.length - 4} more</li>
        )}
          </ul>
        </div>
      )}
      <div className="btnContainer">
        <Button className="uploadButton" onClick={handleUpload}>Upload</Button>
      </div>
    </div>
  );
};

export default IndexPage;
