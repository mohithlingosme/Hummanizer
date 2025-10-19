// PDF handling utilities using PDF.js (browser-compatible)
import * as pdfjsLib from 'pdfjs-dist';

// Set the worker source for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

// Extract text from PDF file
export const extractTextFromPDF = async (file) => {
  try {
    if (!file || file.type !== 'application/pdf') {
      throw new Error('Please select a valid PDF file');
    }

    const arrayBuffer = await file.arrayBuffer();
    
    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    const numPages = pdf.numPages;
    
    // Extract text from each page
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      try {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        // Combine text items from the page
        const pageText = textContent.items
          .map(item => item.str)
          .join(' ');
        
        fullText += pageText + '\n';
      } catch (pageError) {
        console.warn(`Error extracting text from page ${pageNum}:`, pageError);
        // Continue with other pages
      }
    }
    
    if (!fullText || fullText.trim().length === 0) {
      throw new Error('No text content found in the PDF');
    }

    // Get PDF metadata
    let metadata = {};
    let info = {};
    
    try {
      metadata = await pdf.getMetadata();
      info = metadata?.info || {};
    } catch (metadataError) {
      console.warn('Could not extract PDF metadata:', metadataError);
      // Continue without metadata
    }

    return {
      text: fullText.trim(),
      pages: numPages,
      info: info,
      metadata: metadata
    };
  } catch (error) {
    console.error('PDF parsing error:', error);
    
    // Provide more specific error messages
    if (error.name === 'PasswordException') {
      throw new Error('This PDF is password protected. Please provide the password.');
    } else if (error.name === 'InvalidPDFException') {
      throw new Error('The selected file is not a valid PDF or is corrupted.');
    } else if (error.message.includes('Worker')) {
      throw new Error('PDF processing worker failed to load. Please refresh the page and try again.');
    } else if (error.message.includes('timeout')) {
      throw new Error('PDF processing timed out. The file might be too large or complex.');
    } else {
      throw new Error(`Failed to parse PDF: ${error.message}`);
    }
  }
};

// Validate PDF file
export const validatePDFFile = (file) => {
  if (!file) {
    return { isValid: false, error: 'No file selected' };
  }

  if (file.type !== 'application/pdf') {
    return { isValid: false, error: 'Please select a PDF file' };
  }

  // Check file size (limit to 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return { isValid: false, error: 'File size must be less than 10MB' };
  }

  return { isValid: true, error: null };
};

// Format file size for display
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Get PDF metadata summary
export const getPDFSummary = (pdfData) => {
  if (!pdfData) return null;
  
  return {
    pages: pdfData.pages,
    title: pdfData.info?.Title || 'Untitled',
    author: pdfData.info?.Author || 'Unknown',
    subject: pdfData.info?.Subject || 'No subject',
    creator: pdfData.info?.Creator || 'Unknown',
    creationDate: pdfData.info?.CreationDate || 'Unknown',
    modificationDate: pdfData.info?.ModDate || 'Unknown'
  };
};

// Check if PDF.js is properly loaded
export const checkPDFJSAvailability = () => {
  try {
    return typeof pdfjsLib !== 'undefined' && 
           typeof pdfjsLib.getDocument === 'function';
  } catch (error) {
    return false;
  }
};
