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
  const [errorMsg, setErrorMsg] = useState(null);
  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles, rejectedFiles) => {
      const file = acceptedFiles[0]; //we are only excepting one file at a time (multiple: false) so we can set it to the first item in the array
      const rejected = rejectedFiles[0];
      if (file) {
        setFile(Object.assign(file, { preview: URL.createObjectURL(file) }));
      } else {
        setErrorMsg(`${rejected.errors[0].code}: ${rejected.errors[0].message}`); //might need to change this too loop through errors but leave it for now
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
      {errorMsg && <p>{errorMsg}</p>}
      {image && <div>{image}</div>}
    </div>
  );
}
