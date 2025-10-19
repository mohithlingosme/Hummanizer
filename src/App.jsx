import React, { useState, useCallback } from 'react';
import { unicodeSpaces, usageDescription, getUnicodeCode, replaceSpaces, createCustomSpacing } from './utils/textUtils';
import PDFUpload from './components/PDFUpload';

const App = () => {
  const [inputText, setInputText] = useState('');
  const [customSpaces, setCustomSpaces] = useState([]);
  const [selectedSpace, setSelectedSpace] = useState('');
  const [error, setError] = useState('');
  const [inputSource, setInputSource] = useState('manual'); // 'manual' or 'pdf'

  const handleTextChange = (e) => {
    setInputText(e.target.value);
    setInputSource('manual');
    setError('');
  };

  const handlePDFTextExtracted = (text) => {
    setInputText(text);
    setInputSource('pdf');
    setError('');
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  const handleClearText = () => {
    setInputText('');
    setCustomSpaces([]);
    setInputSource('manual');
    setError('');
  };

  const handleAddCustomSpace = () => {
    if (selectedSpace && !customSpaces.includes(selectedSpace)) {
      setCustomSpaces([...customSpaces, selectedSpace]);
      setSelectedSpace('');
    }
  };

  const handleRemoveCustomSpace = (space) => {
    setCustomSpaces(customSpaces.filter(s => s !== space));
  };

  const handleCopyText = useCallback((text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(`Copied text with ${key} spacing!`);
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert(`Copied text with ${key} spacing!`);
    });
  }, []);

  const getTextStats = (text) => {
    if (!text || text.trim().length === 0) {
      return { words: 0, characters: 0, spaces: 0 };
    }
    
    const words = text.trim().split(/\s+/).length;
    const characters = text.length;
    const spaces = (text.match(/ /g) || []).length;
    
    return { words, characters, spaces };
  };

  const textStats = getTextStats(inputText);

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <h1>AI Content Humanizer</h1>
        <p>Transform your text using Unicode whitespace characters to potentially evade AI content detection tools</p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
          <button 
            className="error-close" 
            onClick={() => setError('')}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', marginLeft: '10px' }}
          >
            ×
          </button>
        </div>
      )}

      {/* PDF Upload Section */}
      <div className="card">
        <PDFUpload 
          onPDFTextExtracted={handlePDFTextExtracted}
          onError={handleError}
        />
      </div>

      {/* Text Input */}
      <div className="card">
        <h2>Text Input {inputSource === 'pdf' && <span className="source-badge">From PDF</span>}</h2>
        <div className="stats">
          <span>Words: {textStats.words}</span>
          <span>Characters: {textStats.characters}</span>
          <span>Spaces: {textStats.spaces}</span>
        </div>
        <textarea
          className="textarea"
          value={inputText}
          onChange={handleTextChange}
          placeholder="Enter your text here or upload a PDF above to experiment with Unicode spacing..."
        />
      </div>

      {/* Controls */}
      <div className="card">
        <h2>Controls & Actions</h2>
        <div className="button-group">
          <button className="button danger" onClick={handleClearText}>
            Clear Text
          </button>
        </div>

        {/* Custom Spacing */}
        <h3 style={{ marginTop: '20px', marginBottom: '15px' }}>Custom Unicode Spacing</h3>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
          <select
            value={selectedSpace}
            onChange={(e) => setSelectedSpace(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ced4da' }}
          >
            <option value="">Select spacing type</option>
            {Object.keys(unicodeSpaces).map((key) => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
          <button className="button" onClick={handleAddCustomSpace}>
            Add
          </button>
        </div>

        {/* Selected combinations */}
        <div style={{ marginBottom: '15px' }}>
          <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '10px' }}>
            Selected combinations:
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {customSpaces.map((space) => (
              <span
                key={space}
                style={{
                  background: '#e3f2fd',
                  color: '#1976d2',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  border: '1px solid #bbdefb'
                }}
                onClick={() => handleRemoveCustomSpace(space)}
              >
                {space} ×
              </span>
            ))}
            {customSpaces.length === 0 && (
              <span style={{ color: '#6c757d', fontStyle: 'italic' }}>
                No custom combinations selected
              </span>
            )}
          </div>
        </div>

        {/* Quick Copy Buttons */}
        <h3 style={{ marginTop: '20px', marginBottom: '15px' }}>Quick Copy with Different Spacing</h3>
        <div className="button-group">
          {Object.entries(unicodeSpaces).map(([key, value]) => (
            <button
              key={key}
              className="button secondary"
              onClick={() => handleCopyText(
                inputText.split(' ').join(value),
                key
              )}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* Output */}
      <div className="card">
        <h2>Transformed Output</h2>
        
        {/* Individual Spacing Types */}
        <h3 style={{ marginTop: '20px', marginBottom: '15px' }}>Text Transformations</h3>
        <div className="output-grid">
          {Object.entries(unicodeSpaces).map(([key, value]) => (
            <div key={key} className="output-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3>{key}</h3>
                <span style={{ fontSize: '10px', color: '#6c757d', fontFamily: 'monospace' }}>
                  {getUnicodeCode(value)}
                </span>
              </div>
              
              <div className="output-text">
                {inputText ? inputText.split(' ').join(value) : 'Enter some text to see the transformation'}
              </div>
              
              <p style={{ fontSize: '12px', color: '#6c757d', textAlign: 'center', margin: '10px 0' }}>
                {usageDescription[key]}
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  className="button"
                  style={{ padding: '6px 12px', fontSize: '12px' }}
                  onClick={() => handleCopyText(
                    inputText.split(' ').join(value),
                    key
                  )}
                >
                  Copy
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Spacing Output */}
        <h3 style={{ marginTop: '30px', marginBottom: '15px' }}>Custom Spacing Output</h3>
        <div className="output-item">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h3>Combined Unicode Spacing</h3>
            <div style={{ display: 'flex', gap: '5px' }}>
              {customSpaces.map((space) => (
                <span
                  key={space}
                  style={{
                    background: '#e3f2fd',
                    color: '#1976d2',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '10px',
                    border: '1px solid #bbdefb'
                  }}
                >
                  {space}
                </span>
              ))}
            </div>
          </div>
          
          <div className="output-text">
            {inputText && customSpaces.length > 0 
              ? createCustomSpacing(customSpaces, inputText, false)
              : inputText 
                ? 'Select custom spacing combinations'
                : 'Enter some text and select custom spacing combinations'
            }
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button
              className="button"
              onClick={() => {
                if (inputText && customSpaces.length > 0) {
                  const transformedText = createCustomSpacing(customSpaces, inputText, false);
                  handleCopyText(transformedText, 'Custom');
                }
              }}
              disabled={!inputText || customSpaces.length === 0}
            >
              Copy Custom
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
