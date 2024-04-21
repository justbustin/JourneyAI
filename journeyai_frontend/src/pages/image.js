// pages/index.js


import "../styles/image.scss"
import React, { useState } from 'react';
import UploadFileBox from '../components/UploadFileBox';
import { storage, firestore } from "../app/firebase";
import { ref, uploadBytesResumable, updateMetadata, getMetadata } from "firebase/storage";
import { Button, TextField } from "@mui/material";
import { collection, doc, setDoc } from "firebase/firestore";
import WebcamCapture from '../components/WebcamCapture';
import { useRouter } from "next/navigation";
import EXIF from 'exif-js';
import { NULL } from "sass";

const IndexPage = () => {
  const router = useRouter();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [albumName, setAlbumName] = useState("");
  const [livePhoto, setLivePhoto] = useState("");

  const handleFileChange = (event) => {
    console.log("handlefileChanges")
    setSelectedFiles([...selectedFiles, ...event.target.files]);
  };

  const livePhotoChange = (photo) => {
    console.log("photo recorded")
    setLivePhoto(photo)
  }
  const handleAlbumNameChange = (event) => {
    console.log("set album")
    setAlbumName(event.target.value);
  };


  const dataURLtoBlob = (dataURL) => {
    const parts = dataURL.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
  };

  const getCurrentPosition = () => {
    console.log("getting current positon")
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        }
      );
    });
  };


  /**********************
   *********************
   *********************/
  const handleUpload = () => {

    if (livePhoto) {
      console.log("uploading photo")
      const imageBlob = dataURLtoBlob(livePhoto);

      const storageRef = ref(storage, `${albumName}/photo1YAAAYYY`);
      const uploadTask = uploadBytesResumable(storageRef, imageBlob);

      const metaDataObject = EXIF.getAllTags(livePhoto);

      const { latitude, longitude } = getCurrentPosition();

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
          let customMetadata = {}

          if (metaDataObject.GPSLatitude == null) {
            customMetadata = {
              time: metaDataObject.DateTimeOriginal ? metaDataObject.DateTimeOriginal : "2024:04:05 23:24:40",
              latitude: "34,4,20.07,N",
              longitude: "118,21,30.37,W",
            };
          }
          else{
            const customMetadata = {
              time: metaDataObject.DateTimeOriginal ? metaDataObject.DateTimeOriginal : "2024:04:05 23:24:40",
              latitude: "34,4,20.07,N",
              longitude: "118,21,30.37,W",
            };
          }

          updateMetadata(storageRef, { customMetadata })
            .then((metadata) => {
              console.log("Metadata updated successfully");
              console.log(metadata);
            })
            .catch((error) => {
              console.error("Error updating metadata:", error);
            });

            const collectionRef = collection(firestore, `${albumName}`);
            const customDocId = `length`;
            const dataToStore = {
              length: 1
            };

          const docRef = doc(collectionRef, customDocId);
          setDoc(docRef, dataToStore)
            .then(() => {
              console.log('Document successfully written!');
            })
            .catch((error) => {
              console.error('Error writing document: ', error);
            });
          console.log("about to run pythno")
          const runPythonScript = async () => {
            try {

              const queryString = "hello XD"
              const res = await fetch(`/api/python2?album=${albumName}`);
              
              const data = await res.json();
              console.log(data.message); // Output: "Python script executed successfully"
            } catch (error) {
              console.error('Error:', error);
            }
          };

          runPythonScript();

        }
      );

      setTimeout(() => router.push(`/info?album=${albumName}&length=${selectedFiles.length}`), 3000)

      // Your existing upload logic with the captured imageFile
    }




    if (selectedFiles.length > 0) {
      selectedFiles.forEach((image) => {
        EXIF.getData(image, function () {
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
              const customMetadata = {
                time: metaDataObject.DateTimeOriginal,
                latitude: metaDataObject.GPSLatitude ? `${metaDataObject.GPSLatitude.toString()},${metaDataObject.GPSLatitudeRef.toString()}` : "34,4,20.07,N",
                longitude: metaDataObject.GPSLongitude ? `${metaDataObject.GPSLongitude.toString()},${metaDataObject.GPSLongitudeRef.toString()}` : "118,21,30.37,W",
              };

              updateMetadata(storageRef, { customMetadata })
                .then((metadata) => {
                  console.log("Metadata updated successfully");
                  console.log(metadata);
                })
                .catch((error) => {
                  console.error("Error updating metadata:", error);
                });

              const collectionRef = collection(firestore, `${albumName}`);
              const customDocId = `length`;
              const dataToStore = {
                length: selectedFiles.length
              };

              const docRef = doc(collectionRef, customDocId);
              setDoc(docRef, dataToStore)
                .then(() => {
                  console.log('Document successfully written!');
                })
                .catch((error) => {
                  console.error('Error writing document: ', error);
                });
              console.log("about to run pythno")
              const runPythonScript = async () => {
                try {

                  const queryString = "hello XD"
                  const res = await fetch(`/api/python2?album=${albumName}`);
                  
                  const data = await res.json();
                  console.log(data.message); // Output: "Python script executed successfully"
                } catch (error) {
                  console.error('Error:', error);
                }
              };

              runPythonScript();

            }
          );
        });
      });

      
      setTimeout(() => router.push(`/info?album=${albumName}&length=${selectedFiles.length}`), 3000)
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
      <div>
        <WebcamCapture livePhotoChange={livePhotoChange} />
        <UploadFileBox onChange={handleFileChange} />
      </div>
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
