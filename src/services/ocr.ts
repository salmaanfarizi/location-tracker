import TextRecognition from '@react-native-ml-kit/text-recognition';

/**
 * Extract text from image using OCR
 * Supports both English and Arabic text
 */
export const extractTextFromImage = async (
  imageUri: string,
): Promise<string> => {
  try {
    const result = await TextRecognition.recognize(imageUri);

    if (!result || !result.text) {
      return 'Unknown Shop';
    }

    // Get all text blocks
    const blocks = result.blocks || [];

    if (blocks.length > 0) {
      // Return the first block's text (usually the shop name/sign)
      return blocks[0].text.trim();
    }

    // Fallback to full text
    return result.text.trim() || 'Unknown Shop';
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
