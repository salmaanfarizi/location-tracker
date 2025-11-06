import axios from 'axios';

export interface GroceryData {
  photoUri: string;
  name: string;
  place: string;
  latitude: number;
  longitude: number;
  route: number;
  timestamp: string;
}

/**
 * Google Sheets Integration Service
 *
 * Setup Instructions:
 * 1. Go to https://console.cloud.google.com/
 * 2. Create a new project or select existing one
 * 3. Enable Google Sheets API
 * 4. Create credentials (API Key)
 * 5. Create a Google Apps Script web app to receive data
 *
 * Apps Script Code:
 * function doPost(e) {
 *   var sheet = SpreadsheetApp.openById('YOUR_SHEET_ID').getActiveSheet();
 *   var data = JSON.parse(e.postData.contents);
 *   sheet.appendRow([
 *     data.timestamp,
 *     data.name,
 *     data.place,
 *     data.latitude,
 *     data.longitude,
 *     data.route,
 *     data.photoUri
 *   ]);
 *   return ContentService.createTextOutput(JSON.stringify({status: 'success'}));
 * }
 */

// Replace with your Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxZEktKhTlb-CZsg6ZBOvRHW67I1vVCa2Hh1yGHxo21296H2omifeitXq9R-JSRodYuEg/exec';

export const saveToGoogleSheets = async (data: GroceryData): Promise<boolean> => {
  try {
    const response = await axios.post(GOOGLE_SCRIPT_URL, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.data.status === 'success') {
      console.log('✅ Data saved to Google Sheets successfully');
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ Error saving to Google Sheets:', error);
    return false;
  }
};

// Alternative: Save to local storage as backup
export const saveToLocalStorage = async (
  storage: any,
  data: GroceryData
): Promise<void> => {
  try {
    const existingData = await storage.getItem('groceries');
    const groceries = existingData ? JSON.parse(existingData) : [];
    groceries.push(data);
    await storage.setItem('groceries', JSON.stringify(groceries));
    console.log('✅ Data saved to local storage');
  } catch (error) {
    console.error('❌ Error saving to local storage:', error);
  }
};
