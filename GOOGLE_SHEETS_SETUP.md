# 📊 Google Sheets Integration - Complete Setup Guide

This guide will help you set up Google Sheets integration for the Al Hasa Grocery Tracker app.

---

## 📋 Prerequisites

- Google Account
- Access to Google Sheets
- 10-15 minutes

---

## 🎯 Step-by-Step Setup

### Step 1: Create Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com/)
2. Click **+ Blank** to create new spreadsheet
3. Name it: **"Al Hasa Grocery Data"**
4. In Row 1, add these column headers:

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| Timestamp | Shop Name | Place | Latitude | Longitude | Route | Photo URI |

5. Format the sheet (optional):
   - Bold the headers
   - Freeze Row 1 (View → Freeze → 1 row)
   - Add filters (Data → Create a filter)

6. **Copy the Sheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j/edit
                                        ^^^^^^^^^^^^^^^^^^^
                                        This is your SHEET_ID
   ```

---

### Step 2: Create Google Apps Script

1. In your Google Sheet, click **Extensions** → **Apps Script**

2. Delete the default `function myFunction() {}` code

3. Copy and paste this complete script:

```javascript
/**
 * Al Hasa Grocery Tracker - Google Sheets Backend
 * This script receives data from the mobile app and saves it to the sheet
 */

function doPost(e) {
  try {
    // Get the active spreadsheet and sheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Parse the incoming JSON data
    var data = JSON.parse(e.postData.contents);

    // Log the received data (for debugging)
    Logger.log('Received data: ' + JSON.stringify(data));

    // Append new row with the data
    sheet.appendRow([
      data.timestamp,      // Column A: Timestamp
      data.name,           // Column B: Shop Name
      data.place,          // Column C: Place/Address
      data.latitude,       // Column D: Latitude
      data.longitude,      // Column E: Longitude
      data.route,          // Column F: Route Number
      data.photoUri        // Column G: Photo URI
    ]);

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Data saved successfully',
        rowNumber: sheet.getLastRow()
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Return error response
    Logger.log('Error: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Test function to verify the script works
 * Run this function to test
 */
function testDoPost() {
  var testData = {
    timestamp: new Date().toISOString(),
    name: "Test Shop",
    place: "Al Hasa, Saudi Arabia",
    latitude: 25.4295,
    longitude: 49.5815,
    route: 1,
    photoUri: "test-photo-uri"
  };

  var e = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };

  var result = doPost(e);
  Logger.log(result.getContent());
}
```

4. Click **Save** (💾 icon or Ctrl+S)
5. Name the project: "Al Hasa Grocery Tracker API"

---

### Step 3: Test the Script

1. In Apps Script editor, select the function `testDoPost` from the dropdown
2. Click **Run** (▶️ button)
3. **First time only**: You'll need to grant permissions:
   - Click **Review permissions**
   - Choose your Google account
   - Click **Advanced** → **Go to Al Hasa Grocery Tracker API (unsafe)**
   - Click **Allow**
4. Check your Google Sheet - you should see a test row added!

---

### Step 4: Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Configure settings:
   - **Description**: "Al Hasa Grocery Tracker API v1"
   - **Execute as**: **Me** (your email)
   - **Who has access**: **Anyone**
5. Click **Deploy**
6. **Important**: Copy the **Web app URL**
   ```
   https://script.google.com/macros/s/AKfycbz.../exec
   ```
7. Click **Done**

---

### Step 5: Configure the Mobile App

1. Open the project in your code editor
2. Navigate to: `src/services/googleSheets.ts`
3. Find this line:
   ```typescript
   const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
   ```
4. Replace it with your Web App URL:
   ```typescript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz.../exec';
   ```
5. Save the file
6. Rebuild the app:
   ```bash
   npm run android
   # or
   npm run ios
   ```

---

### Step 6: Test the Integration

1. Open the app on your device
2. Take a photo of any store
3. Select a route
4. Tap "Save to Google Sheets"
5. Check your Google Sheet - the data should appear!

---

## 🔍 Verify It's Working

### ✅ Success Indicators:
- New row appears in your Google Sheet
- App shows "✅ Data saved to Google Sheets successfully!"
- Timestamp, name, location, and route are all filled in

### ❌ If It's Not Working:

**Issue: "Failed to save to Google Sheets"**
- Check your Web App URL is correct
- Ensure you deployed as "Anyone" not "Only myself"
- Try redeploying the Apps Script

**Issue: "Permission denied"**
- Redeploy with "Execute as: Me"
- Ensure "Who has access" is set to "Anyone"

**Issue: Data appears but some fields are empty**
- Check the order of fields in `sheet.appendRow([...])`
- Ensure column order matches your sheet headers

---

## 📊 Advanced: Viewing Your Data

### Add Conditional Formatting by Route

1. Select column F (Route)
2. Click **Format** → **Conditional formatting**
3. Add rules:
   - If cell = 1, background color = Red
   - If cell = 2, background color = Teal
   - If cell = 3, background color = Yellow
   - If cell = 4, background color = Green

### Create a Summary Dashboard

Add a new sheet called "Dashboard" with formulas:

```
Total Stores: =COUNTA(Sheet1!B:B)-1
Route 1 Count: =COUNTIF(Sheet1!F:F,1)
Route 2 Count: =COUNTIF(Sheet1!F:F,2)
Route 3 Count: =COUNTIF(Sheet1!F:F,3)
Route 4 Count: =COUNTIF(Sheet1!F:F,4)
Progress: =CONCATENATE(TEXT((COUNTA(Sheet1!B:B)-1)/1750*100,"0.0"),"%")
```

### Add Google Maps Links

In a new column H, add this formula in H2:
```
=IF(D2<>"","https://www.google.com/maps?q="&D2&","&E2,"")
```
This creates clickable map links for each store!

---

## 🔐 Security Notes

- The Web App URL is public, but only sends data to YOUR sheet
- No one can read data without access to your Google Sheet
- Consider sharing the sheet with team members (click Share button)
- For production, consider adding authentication tokens

---

## 🚀 Next Steps

Once your integration is working:

1. ✅ Test with 5-10 sample stores
2. ✅ Verify all data is captured correctly
3. ✅ Train your supervisor on how to use the app
4. ✅ Start field data collection!

---

## 📞 Troubleshooting

### View Apps Script Logs
1. In Apps Script editor, click **Executions** (clock icon on left)
2. See all recent runs and any errors
3. Click on an execution to see detailed logs

### Test with Postman/cURL
You can test the endpoint directly:

```bash
curl -X POST YOUR_WEB_APP_URL \
  -H "Content-Type: application/json" \
  -d '{
    "timestamp": "2025-11-05T14:30:00.000Z",
    "name": "Test Shop",
    "place": "Al Hasa",
    "latitude": 25.4295,
    "longitude": 49.5815,
    "route": 1,
    "photoUri": "test"
  }'
```

---

## ✨ Tips

- Keep the Apps Script URL private (only in your app code)
- Regularly backup your Google Sheet
- Use filters to view stores by route
- Sort by timestamp to see most recent entries
- Export to Excel when needed (File → Download → Excel)

---

**You're all set! 🎉**

Your app is now connected to Google Sheets and ready for field data collection!
