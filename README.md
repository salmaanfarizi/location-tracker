# 🏪 Al Hasa Grocery Tracker

**AI-Powered Mobile App for Field Data Collection**

A smart mobile application designed for collecting grocery store data in Al Hasa area with **ONE-CLICK** automation using AI, GPS, and Google Sheets integration.

---

## ✨ Features

### 🚀 **One-Click Data Capture**
- 📸 **Take Photo** of grocery store
- 🤖 **AI Reads Shop Name** from photo (OCR)
- 📍 **Auto-Capture GPS** coordinates
- 🗺️ **Auto-Fetch Address** from GPS
- ✅ **Auto-Save** to Google Sheets

### 🎨 **4 Sales Routes with Color Coding**
- Route 1: Red
- Route 2: Teal
- Route 3: Yellow
- Route 4: Green

### 🗺️ **Interactive Map View**
- See all collected groceries on map
- Color-coded markers by route
- Click markers to see store details
- Progress tracking (Target: 1750 stores)

---

## 📋 Requirements

### Development Environment
- **Node.js** 16+ ([Download](https://nodejs.org/))
- **React Native CLI** (`npm install -g react-native-cli`)
- **Android Studio** (for Android) or **Xcode** (for iOS)
- **Google Cloud Account** (for Maps & Sheets API)

### Hardware
- Android device/emulator (Android 5.0+) OR iOS device/simulator (iOS 13+)
- Camera and GPS enabled

---

## 🛠️ Installation

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd location-tracker

# Install Node modules
npm install

# For iOS only (Mac required)
cd ios && pod install && cd ..
```

### 2. Google Cloud Setup

#### A. Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable these APIs:
   - **Maps SDK for Android**
   - **Maps SDK for iOS**
   - **Geocoding API**
4. Create API Key:
   - Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy your API key

**Configure API Key:**

**For Android:**
- Open `android/app/src/main/AndroidManifest.xml`
- Replace `YOUR_GOOGLE_MAPS_API_KEY_HERE` with your actual key

**For iOS:**
- Open `ios/AlHasaTracker/AppDelegate.m`
- Add Google Maps initialization (see iOS setup guide below)

#### B. Google Sheets API Setup

**Step 1: Create Google Sheet**
1. Go to [Google Sheets](https://sheets.google.com/)
2. Create a new spreadsheet
3. Name it "Al Hasa Grocery Data"
4. Add headers in Row 1:
   ```
   Timestamp | Shop Name | Place | Latitude | Longitude | Route | Photo URL
   ```
5. Copy the Sheet ID from URL:
   ```
   https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
   ```

**Step 2: Create Google Apps Script**
1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete default code and paste this:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Append new row
    sheet.appendRow([
      data.timestamp,
      data.name,
      data.place,
      data.latitude,
      data.longitude,
      data.route,
      data.photoUri
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({status: 'success'}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({status: 'error', message: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Click **Deploy** → **New Deployment**
4. Select type: **Web app**
5. Settings:
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Click **Deploy**
7. Copy the **Web App URL**

**Step 3: Configure App**
- Open `src/services/googleSheets.ts`
- Replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with your Web App URL

---

## 🚀 Running the App

### For Android

```bash
# Start Metro bundler
npm start

# In another terminal, run Android
npm run android
```

### For iOS (Mac only)

```bash
# Start Metro bundler
npm start

# In another terminal, run iOS
npm run ios
```

---

## 📱 How to Use

### For Supervisor (Data Collection)

1. **Launch App**
2. **Tap "📸 ONE-CLICK CAPTURE"**
3. **Take Photo** of grocery store sign
4. **Wait 2-3 seconds** - AI will:
   - Read shop name from photo
   - Get GPS location
   - Fetch address automatically
5. **Select Route** (1, 2, 3, or 4)
6. **Tap "✅ SAVE TO GOOGLE SHEETS"**
7. **Done!** Move to next store

### View Collected Data

- **On Map**: Tap "🗺️ Map" button to see all stores
- **On Google Sheets**: Check your spreadsheet for all data
- **Progress**: See stats at bottom of capture screen

---

## 🎨 Route Assignment Strategy

Divide Al Hasa area into 4 geographical zones:

- **Route 1 (Red)**: North Zone
- **Route 2 (Teal)**: South Zone
- **Route 3 (Yellow)**: East Zone
- **Route 4 (Green)**: West Zone

Each salesman gets one route with all assigned grocery stores.

---

## 🔧 Configuration

### Customize for Your Area

Edit `src/components/MapView.tsx`:
```typescript
// Change default map center to your area
const initialRegion = {
  latitude: 25.4295,  // Your area latitude
  longitude: 49.5815, // Your area longitude
  latitudeDelta: 0.5,
  longitudeDelta: 0.5,
};
```

### Change Route Colors

Edit `src/types/index.ts`:
```typescript
export const ROUTE_COLORS = {
  1: '#FF6B6B', // Change colors here
  2: '#4ECDC4',
  3: '#FFD93D',
  4: '#6BCB77',
};
```

---

## 📊 Data Format

### Google Sheet Columns

| Column | Description | Example |
|--------|-------------|---------|
| Timestamp | Date & time of capture | 2025-11-05T14:30:00.000Z |
| Shop Name | Extracted by AI | "Ahmed Grocery Store" |
| Place | Address from GPS | "Al Hasa, Saudi Arabia" |
| Latitude | GPS coordinate | 25.4295 |
| Longitude | GPS coordinate | 49.5815 |
| Route | Assigned route (1-4) | 2 |
| Photo URL | Local photo path | file:///storage/... |

---

## 🐛 Troubleshooting

### Camera Not Working
- Check permissions in device settings
- Ensure camera hardware is available
- Restart the app

### GPS Not Accurate
- Enable "High Accuracy" location mode
- Use outdoors for better signal
- Wait a few seconds for GPS lock

### OCR Not Reading Shop Name
- Take clear, well-lit photos
- Ensure shop sign is in focus
- Try closer photos of shop name

### Google Sheets Not Saving
- Check your Apps Script Web App URL
- Ensure sheet is accessible (not private)
- Check internet connection
- Data still saves locally as backup

### Map Not Showing
- Verify Google Maps API key is correct
- Check if Maps API is enabled in Google Cloud
- Ensure billing is enabled (Google requires it, has free tier)

---

## 📦 Dependencies

### Core
- React Native 0.72.6
- TypeScript 5.2.2

### Features
- **Camera**: react-native-image-picker
- **GPS**: react-native-geolocation-service
- **Maps**: react-native-maps
- **OCR**: react-native-text-recognition
- **Storage**: @react-native-async-storage/async-storage
- **HTTP**: axios

---

## 🔐 Privacy & Permissions

This app requires:
- **Camera**: To photograph grocery stores
- **Location**: To capture GPS coordinates
- **Storage**: To save photos locally
- **Internet**: To save data to Google Sheets

All data is stored in YOUR Google Sheet. No third-party data collection.

---

## 🎯 Project Goals

- **Target**: 1750 grocery stores in Al Hasa
- **Current Database**: 850 registered
- **New to Find**: 900 stores
- **Routes**: 4 sales routes
- **Average per Route**: ~437 stores

---

## 📞 Support

For issues or questions:
1. Check troubleshooting section above
2. Review Google Cloud console for API status
3. Test with sample data first
4. Ensure all permissions are granted

---

## 📝 License

This project is for internal use at your organization.

---

## 🚀 Future Enhancements

- [ ] Offline mode with sync when online
- [ ] Export data to Excel/CSV
- [ ] Salesman login to see only their route
- [ ] Navigation to nearest unvisited store
- [ ] Photo gallery view
- [ ] Bulk edit route assignments
- [ ] Analytics dashboard

---

## 👨‍💻 Development

Built with:
- React Native
- TypeScript
- Google Maps API
- Google Sheets API
- ML Kit Text Recognition
- OpenStreetMap Nominatim

---

**Happy Data Collecting! 🎉**

---

*Made for Al Hasa Sales Team - Streamlining grocery store data collection with AI*
