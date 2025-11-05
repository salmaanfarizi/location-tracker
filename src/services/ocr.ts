import TextRecognition from 'react-native-text-recognition';

/**
 * Extract text from image using OCR
 * Supports both English and Arabic text
 */
export const extractTextFromImage = async (
  imageUri: string,
): Promise<string> => {
  try {
    const result = await TextRecognition.recognize(imageUri);

    if (!result || result.length === 0) {
      return 'Unknown Shop';
    }

    // Combine all recognized text
    const allText = result.join(' ').trim();

    // Try to extract the shop name (usually the largest/first text)
    const lines = result.filter(line => line.trim().length > 0);

    if (lines.length > 0) {
      // Return the first significant line as shop name
      return lines[0].trim();
    }

    return allText || 'Unknown Shop';
  } catch (error) {
    console.error('OCR Error:', error);
    return 'Unknown Shop';
  }
};

/**
 * Clean and format the extracted shop name
 */
export const cleanShopName = (text: string): string => {
  // Remove special characters but keep Arabic and English letters
  const cleaned = text
    .replace(/[^\w\s\u0600-\u06FF]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return cleaned || 'Unknown Shop';
};

/**
 * Extract shop name with cleaning
 */
export const getShopNameFromPhoto = async (
  imageUri: string,
): Promise<string> => {
  const rawText = await extractTextFromImage(imageUri);
  return cleanShopName(rawText);
};
