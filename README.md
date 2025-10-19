# AI Content Humanizer

A React application that demonstrates how replacing normal spaces with various Unicode whitespace characters can potentially evade AI content detection tools.

## Features

### Core Functionality
- **Text Input**: Manual text entry with real-time statistics (word count, character count, spaces)
- **Unicode Spacing**: Replace standard spaces with various Unicode whitespace characters
- **Custom Combinations**: Create custom spacing patterns by combining different Unicode characters
- **Text Transformation**: View how your text looks with different spacing types
- **Copy to Clipboard**: Easy copying of transformed text

### PDF Handling (NEW!)
- **PDF Upload**: Drag & drop or click to upload PDF files
- **Text Extraction**: Automatically extract text content from PDF documents
- **File Validation**: Supports PDFs up to 10MB with automatic validation
- **Metadata Display**: Shows PDF information (title, author, pages, etc.)
- **Seamless Integration**: Extracted text automatically populates the text input area

### Unicode Spacing Types
- **Em Space** (U+2003): Wide spacing between characters
- **En Space** (U+2002): Mid-range spacing
- **Thin Space** (U+2009): Slightly narrower spacing
- **Hair Space** (U+200A): Very thin spacing
- **Narrow No-Break** (U+202F): Prevents line breaks with tight spacing
- **Zero Width Space** (U+200B): Creates word breaks without visible space
- **Word Joiner** (U+2060): Prevents word breaks without adding width
- **Custom Combinations**: Mix and match different spacing types

## Installation & Usage

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd humanizer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production
```bash
npm run build
```

## How to Use

### Manual Text Input
1. Type or paste your text in the "Text Input" area
2. Use the "Quick Copy" buttons to copy text with different spacing types
3. Create custom spacing combinations using the "Custom Unicode Spacing" section

### PDF Processing
1. Upload a PDF file by dragging and dropping or clicking the upload area
2. The app will automatically extract text from the PDF
3. Extracted text appears in the text input area with a "From PDF" badge
4. View PDF metadata (title, author, pages, etc.)
5. Apply Unicode spacing transformations to the extracted text

### Custom Spacing
1. Select spacing types from the dropdown
2. Click "Add" to create custom combinations
3. View the combined effect in the "Custom Spacing Output" section
4. Copy the custom-spaced text to your clipboard

## Technical Details

### Architecture
- **Frontend**: React 18 with Vite build tool
- **Styling**: Custom CSS with responsive design
- **PDF Processing**: pdf-parse library for text extraction
- **State Management**: React hooks for local state
- **Error Handling**: Comprehensive error handling with user-friendly messages

### File Structure
```
src/
├── components/
│   └── PDFUpload.jsx      # PDF upload and processing component
├── utils/
│   ├── textUtils.js       # Unicode spacing and text transformation utilities
│   └── pdfUtils.js        # PDF handling utilities
├── App.jsx                # Main application component
├── main.jsx               # React entry point
└── index.css              # Global styles
```

### Dependencies
- **React**: UI library
- **pdf-parse**: PDF text extraction
- **Vite**: Build tool and development server

## Use Cases

### Content Creators
- Transform articles, essays, or blog posts
- Test different spacing patterns for readability
- Create unique text variations

### Researchers
- Process research papers and documents
- Analyze text with different spacing configurations
- Study Unicode character effects on text

### Developers
- Test AI content detection systems
- Experiment with text transformation techniques
- Learn about Unicode whitespace characters

## Security & Privacy

- **Local Processing**: All PDF processing happens in the browser
- **No Data Upload**: Files are not sent to external servers
- **File Size Limits**: PDF files limited to 10MB for performance
- **File Validation**: Automatic validation of PDF file types

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Disclaimer

This tool is for educational and research purposes only. Users are responsible for complying with applicable laws and terms of service when using this application.
