import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();

function FileUploader() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [svgData, setSvgData] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    setUploadedFile(URL.createObjectURL(file));
    await convertToSVG(file);
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setUploadedFile(URL.createObjectURL(file));
    await convertToSVG(file);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const convertToSVG = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:5000//api/convert/pdf-to-svg', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const svgData = await response.text();
        setSvgData(svgData);
        console.log('SVG DATA is', svgData);
      } else {
        throw new Error('PDF to SVG conversion failed');
      }
    } catch (error) {
      console.error(error);
      // Handle error state accordingly
    }
  };

  return (
    <div
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
      style={{
        border: '2px dashed #000',
        padding: '20px',
        width: '100%',
        height: '100%',
        display: 'flex',
      }}
    >
      <div style={{ flex: 1 }}>
        <h3>Upload PDF File</h3>
        <input type="file" onChange={handleFileUpload} />
        {uploadedFile && (
          <div style={{ marginTop: '20px', width: '100%', height: '100%' }}>
            <Document
              file={uploadedFile}
              onLoadSuccess={onDocumentLoadSuccess}
            >
              {Array.from(new Array(numPages), (_, index) => (
                <Page
                  key={index + 1}
                  pageNumber={index + 1}
                  width={window.innerWidth * 0.8}
                  height={window.innerHeight * 0.8}
                />
              ))}
            </Document>
          </div>
        )}
      </div>
      <div style={{ flex: 1, marginLeft: '20px' }}>
        {svgData && (
          <div dangerouslySetInnerHTML={{ __html: svgData }} />
        )}
      </div>
    </div>
  );
}

export default FileUploader;
