// pages/index.js

import React, { useState } from 'react';
import UploadFileBox from '../components/UploadFileBox';
import { storage } from "../app/firebase";
import { ref, uploadBytesResumable } from "firebase/storage";

const IndexPage = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFiles([...selectedFiles, ...event.target.files]);
  };

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      console.log("hello 2")
      selectedFiles.forEach((image) => {
        const storageRef = ref(storage, `images/${image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
          },
          error => {
            console.log(error.message);
          },
          () => {
            console.log("Upload completed");
          }
        )
      })
    }
  };

  return (
    <div>
      <h1>Upload Multiple Files Example</h1>
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
