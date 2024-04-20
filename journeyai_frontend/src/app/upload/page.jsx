"use client";

import React, { ChangeEvent, useState } from "react";
import { storage } from "../firebase";
import { ref, uploadBytesResumable, UploadTaskSnapshot } from "firebase/storage";

const ImageUpload = () => {
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (image) {
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
    }
  };

  return (
    <div>
      <input type="file" onChange={handleChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default ImageUpload;