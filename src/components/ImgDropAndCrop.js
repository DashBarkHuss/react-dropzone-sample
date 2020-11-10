import React, { useState, useRef, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { image64toCanvasRef } from './utils.js';

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out',
};

const activeStyle = {
  borderColor: '#2196f3',
};

const acceptStyle = {
  borderColor: '#00e676',
};

const rejectStyle = {
  borderColor: '#ff1744',
};
// const verify = (file) => file.type !== 'image/vnd.adobe.photoshop';

export default function ImgDropAndCrop(props) {
  const [imgSrc, setImgSrc] = useState(null);
  const [dimensions, setDimensions] = useState(null);
  const [errorMsgs, setErrorMsgs] = useState([]);
  const [crop, setCrop] = useState({
    aspect: 1 / 1,
  });

  const imagePreviewCanvasRef = useRef();

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    accept: ['image/x-png', 'image/png', 'image/jpg', 'image/jpeg', 'image/gif'],
    onDrop: (acceptedFiles, rejectedFiles) => {
      const file = acceptedFiles[0]; //we are only excepting one file at a time (multiple: false) so we can set it to the first item in the array
      if (file) {
        setErrorMsgs([]);
        const reader = new FileReader();
        reader.addEventListener(
          'load',
          () => {
            setImgSrc(reader.result);
          },
          false
        );
        reader.readAsDataURL(file);
      } else {
        const errorsArray = rejectedFiles[0].errors.map((e) => `${e.code}: ${e.message}`);
        setImgSrc(null);
        setErrorMsgs(errorsArray);
      }
    },
    multiple: false,
    maxSize: 3000000,
    minSize: 3000,
  });
  const handleImageLoaded = (image) => {
    console.log(image);
  };

  const getImageDimensions = async (imgSrc) => {
    var img = new Image();
    const dimensions = await new Promise((resolve) => {
      img.onload = function () {
        resolve({ width: this.width, height: this.height });
      };
      img.src = imgSrc;
    });
    return dimensions;
  };
  const handleCropComplete = async (crop, pixelCrop) => {
    const canvasRef = imagePreviewCanvasRef.current;
    const dimensions = await getImageDimensions(imgSrc);
    const canvasCrop = {
      height: (dimensions.height * pixelCrop.height) / 100,
      width: (dimensions.width * pixelCrop.width) / 100,
      y: (dimensions.height * pixelCrop.y) / 100,
      x: (dimensions.width * pixelCrop.x) / 100,
    };
    console.log('img64', image64toCanvasRef(canvasRef, imgSrc, canvasCrop));
  };
  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  return (
    <div className="container">
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <ReactCrop
        src={imgSrc}
        crop={crop}
        onChange={(newCrop) => setCrop(newCrop)}
        onComplete={handleCropComplete}
        onImageLoaded={handleImageLoaded}
      />
      {errorMsgs && <p>{errorMsgs}</p>}
      <p>Preview Canvas Crop</p>
      <canvas ref={imagePreviewCanvasRef}></canvas>
    </div>
  );
}
