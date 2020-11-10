import React, { useState, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
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

export default function ImgDropAndCrop(props) {
  const [file, setFile] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [errorMsgs, setErrorMsgs] = useState([]);
  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles, rejectedFiles) => {
      const file = acceptedFiles[0]; //we are only excepting one file at a time (multiple: false) so we can set it to the first item in the array
      if (file) {
        setFile(Object.assign(file, { preview: URL.createObjectURL(file) }));
        const reader = new FileReader();
        reader.addEventListener(
          'load',
          () => {
            console.log(reader.result);
            setImgSrc(reader.result);
          },
          false
        );
        reader.readAsDataURL(file);
      } else {
        rejectedFiles.forEach((f) => {
          setErrorMsgs([...errorMsgs, `${f.errors[0].code}: ${f.errors[0].message}`]);
        });
      }
    },
    multiple: false,
    maxSize: 3000000,
    minSize: 3000,
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );
  const image = file ? (
    <div key={file.name}>
      <div>
        <img src={file.preview} style={{ width: '200px' }} alt="preview" />
      </div>
    </div>
  ) : (
    ''
  );

  return (
    <div className="container">
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      {errorMsgs && <p>{errorMsgs}</p>}
      {image && <div>{image}</div>}
      {imgSrc && <img src={imgSrc} alt="preview" />}
    </div>
  );
}
