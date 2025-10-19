// Unicode whitespace characters for text humanization
export const unicodeSpaces = {
  'Em Space': '\u2003',
  'En Space': '\u2002',
  'Thin Space': '\u2009',
  'Thin Space*2': '\u2009\u2009',
  'Hair Space': '\u200A',
  'Narrow, Hair': '\u202F\u200A',
  'Thin, Hair': ' \u2009\u200A',
  'Hair Space*3': '\u200A\u200A\u200A',
  'Narrow No-Break': '\u202F',
  'Narrow No-Break*2': '\u202F\u202F',
  'Zero Width Space': '\u200A\u200B\u200A',
  'Word Joiner': '\u2009\u2060\u2009'
};

// Usage descriptions for each spacing type
export const usageDescription = {
  'Em Space': 'in wide spacing between characters',
  'En Space': 'for mid-range spacing',
  'Thin Space': 'for slightly narrower spacing',
  'Thin Space*2': 'for even narrower spacing',
  'Hair Space': 'for very thin spacing',
  'Narrow, Hair': 'for extra narrow hair-like spacing',
  'Thin, Hair': 'for a mix of thin and hair spacing',
  'Hair Space*3': 'for extremely tight spacing',
  'Narrow No-Break': 'to prevent line breaks with tight spacing',
  'Narrow No-Break*2': 'for even tighter no-break spacing',
  'Zero Width Space': 'to create word breaks without visible space',
  'Word Joiner': 'to prevent word breaks without adding width'
};

// Get Unicode code representation of text
export const getUnicodeCode = (text) => {
  return text.split('').map((char) => '\\u' + char.charCodeAt(0).toString(16).padStart(4, '0').toUpperCase()).join('');
};

// Replace regular spaces with Unicode spaces in plain text
export const replaceSpaces = (text, unicodeCharacter) => {
  if (!text || typeof text !== 'string') return '';
  return text.split(' ').join(unicodeCharacter);
};

// Replace regular spaces with Unicode spaces in HTML content
export const replaceSpacesInHtml = (html, unicodeCharacter) => {
  if (!html || typeof html !== 'string') return '';
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  const walkTextNodes = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      node.textContent = replaceSpaces(node.textContent, unicodeCharacter);
    } else {
      for (let child of node.childNodes) {
        walkTextNodes(child);
      }
    }
  };
  
  walkTextNodes(doc.body);
  return doc.body.innerHTML;
};

// Create custom spacing combinations
export const createCustomSpacing = (spaces, text, isHtml = false) => {
  if (!spaces || spaces.length === 0) return text;
  
  const customSpacing = spaces.map(space => unicodeSpaces[space]).join('');
  
  if (isHtml) {
    return replaceSpacesInHtml(text, customSpacing);
  }
  return replaceSpaces(text, customSpacing);
};

// Validate text input
export const validateText = (text) => {
  if (!text || typeof text !== 'string') return false;
  if (text.trim().length === 0) return false;
  return true;
};

// Count words in text
export const countWords = (text) => {
  if (!validateText(text)) return 0;
  return text.trim().split(/\s+/).length;
};

// Get text statistics
export const getTextStats = (text) => {
  if (!validateText(text)) {
    return { words: 0, characters: 0, spaces: 0 };
  }
  
  const words = countWords(text);
  const characters = text.length;
  const spaces = (text.match(/ /g) || []).length;
  
  return { words, characters, spaces };
};
