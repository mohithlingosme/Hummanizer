import React, { useState, useCallback } from 'react';
import { extractTextFromPDF, validatePDFFile, formatFileSize, getPDFSummary } from '../utils/pdfUtils';

const PDFUpload = ({ onPDFTextExtracted, onError }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [pdfData, setPdfData] = useState(null);

  const handleFileSelect = useCallback(async (file) => {
    try {
      // Validate file
      const validation = validatePDFFile(file);
      if (!validation.isValid) {
        onError(validation.error);
        return;
      }

      setSelectedFile(file);
      setIsProcessing(true);

      // Extract text from PDF
      const extractedData = await extractTextFromPDF(file);
      setPdfData(extractedData);
      
      // Pass extracted text to parent component
      onPDFTextExtracted(extractedData.text);
      
    } catch (error) {
      onError(error.message);
      setSelectedFile(null);
      setPdfData(null);
    } finally {
      setIsProcessing(false);
    }
  }, [onPDFTextExtracted, onError]);

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPdfData(null);
    onPDFTextExtracted('');
  };

  const openFileDialog = () => {
    document.getElementById('pdf-file-input').click();
  };

  return (
    <div className="pdf-upload-container">
      <h3 style={{ marginBottom: '15px', color: '#333' }}>PDF Upload</h3>
      
      {/* File Input (Hidden) */}
      <input
        id="pdf-file-input"
        type="file"
        accept=".pdf"
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />

      {/* Drag & Drop Area */}
      {!selectedFile && (
        <div
          className={`drag-drop-area ${isDragOver ? 'drag-over' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <div className="drag-drop-content">
            <div className="upload-icon">📄</div>
            <p className="drag-drop-text">
              <strong>Click to select</strong> or drag and drop a PDF file here
            </p>
            <p className="drag-drop-hint">
              Supports PDF files up to 10MB
            </p>
          </div>
        </div>
      )}

      {/* Selected File Display */}
      {selectedFile && (
        <div className="selected-file">
          <div className="file-info">
            <div className="file-icon">📄</div>
            <div className="file-details">
              <h4 className="file-name">{selectedFile.name}</h4>
              <p className="file-size">{formatFileSize(selectedFile.size)}</p>
              {pdfData && (
                <p className="file-pages">{pdfData.pages} page{pdfData.pages !== 1 ? 's' : ''}</p>
              )}
            </div>
          </div>
          
          <div className="file-actions">
            <button
              className="button secondary"
              onClick={handleRemoveFile}
              disabled={isProcessing}
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Processing State */}
      {isProcessing && (
        <div className="processing-state">
          <div className="spinner"></div>
          <p>Processing PDF...</p>
        </div>
      )}

      {/* PDF Metadata */}
      {pdfData && (
        <div className="pdf-metadata">
          <h4 style={{ marginBottom: '10px', color: '#666' }}>PDF Information</h4>
          <div className="metadata-grid">
            <div className="metadata-item">
              <span className="metadata-label">Title:</span>
              <span className="metadata-value">{pdfData.info?.Title || 'Untitled'}</span>
            </div>
            <div className="metadata-item">
              <span className="metadata-label">Author:</span>
              <span className="metadata-value">{pdfData.info?.Author || 'Unknown'}</span>
            </div>
            <div className="metadata-item">
              <span className="metadata-label">Pages:</span>
              <span className="metadata-value">{pdfData.pages}</span>
            </div>
            {pdfData.info?.Subject && (
              <div className="metadata-item">
                <span className="metadata-label">Subject:</span>
                <span className="metadata-value">{pdfData.info.Subject}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFUpload;
