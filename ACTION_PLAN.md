# 🚀 Action Plan - What to Do RIGHT NOW

You have: MacBook ✅ | Xcode ✅ | Dependencies installed ✅

Follow these steps **on your MacBook** to complete the setup.

---

## ✅ Step 1: Install CocoaPods (5 minutes)

Open **Terminal** on your MacBook and run:

```bash
sudo gem install cocoapods
```

Enter your Mac password when prompted.

**Verify installation:**
```bash
pod --version
```

Should show: `1.12.0` or higher ✅

---

## ✅ Step 2: Install iOS Dependencies (10 minutes)

In Terminal, navigate to your project and install iOS pods:

```bash
cd location-tracker/ios
pod install
```

**Expected output:**
```
Analyzing dependencies
Downloading dependencies
Installing...
Pod installation complete! There are X dependencies from the Podfile
```

**Then go back to project root:**
```bash
cd ..
```

---

## ✅ Step 3: Configure Xcode Signing (5 minutes)

### 3.1 Open the project in Xcode

```bash
open ios/AlHasaTracker.xcworkspace
```

⚠️ **IMPORTANT**: Open the **`.xcworkspace`** file, NOT the `.xcodeproj` file!

### 3.2 Add Your Apple ID

1. In Xcode, go to **Xcode** menu → **Settings** (or **Preferences**)
2. Click **Accounts** tab
3. Click the **"+"** button at bottom left
4. Select **Apple ID**
5. Sign in with your Apple ID (the one you use for App Store)
6. Click **Done**

### 3.3 Configure Signing

1. In Xcode left sidebar, click **AlHasaTracker** (blue icon at the very top)
2. In the middle pane, select **AlHasaTracker** under TARGETS (not PROJECTS)
3. Click the **Signing & Capabilities** tab at the top
4. Check the box: **☑️ Automatically manage signing**
5. Under **Team**, select your Apple ID from the dropdown
6. Xcode will automatically create a provisioning profile

**If you see an error about Bundle Identifier:**
- Change `com.alhasatracker` to something unique like `com.yourname.alhasatracker`

---

## ✅ Step 4: Get Google Maps API Key (10 minutes)

### 4.1 Go to Google Cloud Console

Open this link: [Google Cloud Console](https://console.cloud.google.com/)

### 4.2 Create a New Project

1. Click **Select a project** (top left)
2. Click **New Project**
3. Project name: **"Al Hasa Tracker"**
4. Click **Create**
5. Wait for project creation, then select it

### 4.3 Enable Required APIs

1. In the left menu, go to **APIs & Services** → **Library**
2. Search for and enable these 3 APIs (click on each, then click **Enable**):
   - ✅ **Maps SDK for Android**
   - ✅ **Maps SDK for iOS**
   - ✅ **Geocoding API**

### 4.4 Create API Key

1. Go to **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** at the top
3. Select **API Key**
4. Your API key will be generated
5. **COPY THIS KEY** - you'll need it in the next step!

Example key looks like: `AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

**Optional but Recommended:** Click "Restrict Key" and:
- Under "Application restrictions", select "None" (for testing) or set specific restrictions
- Under "API restrictions", select "Restrict key" and only allow the 3 APIs you enabled

---

## ✅ Step 5: Configure Google Maps API Key (5 minutes)

You need to add your API key to **BOTH** Android and iOS.

### 5.1 Configure Android

Open the file: **`android/app/src/main/AndroidManifest.xml`**

Find line 27 (around the middle of the file):
```xml
<meta-data
  android:name="com.google.android.geo.API_KEY"
  android:value="YOUR_GOOGLE_MAPS_API_KEY_HERE"/>
```

Replace `YOUR_GOOGLE_MAPS_API_KEY_HERE` with your actual API key:
```xml
<meta-data
  android:name="com.google.android.geo.API_KEY"
  android:value="AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"/>
```

**Save the file.**

### 5.2 Configure iOS

You need to create or edit the AppDelegate file.

**Check if file exists:**
```bash
ls ios/AlHasaTracker/AppDelegate.*
```

**If you see `AppDelegate.m`**, rename it:
```bash
mv ios/AlHasaTracker/AppDelegate.m ios/AlHasaTracker/AppDelegate.mm
```

**Edit the file** `ios/AlHasaTracker/AppDelegate.mm`:

Add this import at the top (after other imports):
```objc
#import <GoogleMaps/GoogleMaps.h>
```

Find the `didFinishLaunchingWithOptions` method and add the API key BEFORE `return YES;`:

```objc
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // Add this line with YOUR actual API key
  [GMSServices provideAPIKey:@"AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"];

  self.moduleName = @"AlHasaTracker";
  self.initialProps = @{};

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}
```

**Save the file.**

---

## ✅ Step 6: Set Up Google Sheets (15 minutes)

### 6.1 Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com/)
2. Click **+ Blank** to create a new spreadsheet
3. Name it: **"Al Hasa Grocery Data"**
4. In Row 1, add these column headers:

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| **Timestamp** | **Shop Name** | **Place** | **Latitude** | **Longitude** | **Route** | **Photo URL** |

### 6.2 Create Google Apps Script

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any default code in the editor
3. Paste this code:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Append new row with grocery data
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
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Click **💾 Save** (or Cmd+S)
5. Name the project: **"Al Hasa Data Receiver"**

### 6.3 Deploy the Web App

1. Click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Select **Web app**
4. Configure deployment:
   - **Description**: "Al Hasa Data Receiver"
   - **Execute as**: **Me** (your email)
   - **Who has access**: **Anyone**
5. Click **Deploy**
6. Click **Authorize access**
7. Select your Google account
8. Click **Advanced** → **Go to Al Hasa Data Receiver (unsafe)**
9. Click **Allow**
10. **COPY the Web App URL** (looks like: `https://script.google.com/macros/s/AKfycbz.../exec`)

### 6.4 Configure in App

Open the file: **`src/services/googleSheets.ts`**

Find line 41:
```typescript
const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
```

Replace with your actual Web App URL:
```typescript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz.../exec';
```

**Save the file.**

---

## ✅ Step 7: Test on Android (10 minutes)

### 7.1 Start Metro Bundler

Open Terminal and run:
```bash
cd location-tracker
npm start
```

Keep this terminal open - it's the JavaScript bundler.

### 7.2 Run on Android (in a new terminal)

Open a **new Terminal window** and run:
```bash
cd location-tracker
npm run android
```

**First time will take 5-10 minutes** as it downloads and builds Android dependencies.

**App should launch on Android emulator!** 🎉

---

## ✅ Step 8: Test on iOS (10 minutes)

### 8.1 Keep Metro Running

Make sure Metro bundler is still running from Step 7.1.

### 8.2 Run on iOS (in another new terminal)

Open **another new Terminal window** and run:
```bash
cd location-tracker
npm run ios
```

**First time will take 5-10 minutes** as it builds for iOS.

**App should launch on iOS simulator!** 🎉

---

## 🎯 Summary Checklist

Complete these in order:

- [ ] **Step 1**: Install CocoaPods → `sudo gem install cocoapods`
- [ ] **Step 2**: Install iOS pods → `cd ios && pod install && cd ..`
- [ ] **Step 3**: Configure Xcode signing (add Apple ID, select team)
- [ ] **Step 4**: Get Google Maps API key from Google Cloud Console
- [ ] **Step 5**: Add API key to AndroidManifest.xml AND AppDelegate.mm
- [ ] **Step 6**: Create Google Sheet, deploy Apps Script, get Web App URL
- [ ] **Step 6**: Add Web App URL to googleSheets.ts
- [ ] **Step 7**: Run Android → `npm start` then `npm run android`
- [ ] **Step 8**: Run iOS → `npm run ios` (Metro already running)
- [ ] **Step 9**: Test camera, GPS, and saving to Google Sheets

---

## 🚨 If You Get Stuck

### Android Issues

**"SDK location not found"**
```bash
echo "sdk.dir=$HOME/Library/Android/sdk" > android/local.properties
```

**"Build failed"**
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### iOS Issues

**"Pod install failed"**
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

**"Signing error"**
- Make sure you selected your Team in Xcode
- Try changing the Bundle Identifier to something unique

**"Command PhaseScriptExecution failed"**
```bash
cd ios
xcodebuild clean
cd ..
npm run ios
```

### Metro Bundler Issues

**"Port 8081 already in use"**
```bash
npx react-native start --reset-cache
```

---

## 📱 Testing the App

Once both platforms are running, test these features:

1. **Camera**: Tap "📸 ONE-CLICK CAPTURE"
2. **GPS**: Check location coordinates appear
3. **OCR**: Take a photo with text and see if it's recognized
4. **Google Sheets**: Select a route and tap "✅ SAVE TO GOOGLE SHEETS"
5. **Map**: Tap map view to see data points

---

## 🎉 You're Almost There!

The hardest part is getting the Google Maps API key and Google Sheets set up. Once that's done, the app will work perfectly on both Android and iOS!

**Estimated total time**: 60-90 minutes

**Questions?** Check DUAL_PLATFORM_SETUP.md for more details.

Good luck! 🚀
