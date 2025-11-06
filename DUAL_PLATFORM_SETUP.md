# 🚀 Complete Setup Guide - Android & iOS Development

This guide covers setting up the Al Hasa Grocery Tracker for **BOTH** Android and iOS development.

---

## 📋 System Requirements

### For Android Development
- **Any OS**: Windows, Mac, or Linux
- **Android Studio**: Latest version
- **Java JDK**: 11 or higher
- **Android SDK**: API Level 21+ (Android 5.0+)
- **Disk Space**: ~10GB

### For iOS Development (Mac Only!)
- **macOS**: 12.0 (Monterey) or higher
- **Xcode**: 14.0 or higher
- **CocoaPods**: Latest version
- **Disk Space**: ~20GB

### For Both
- **Node.js**: 16+ with npm
- **React Native CLI**: `npm install -g react-native-cli`
- **Git**: For version control

---

## 🎯 Step-by-Step Setup for Both Platforms

### ✅ Step 1: Initial Setup (COMPLETED)

Already done:
- [x] Node dependencies installed (1,172 packages)
- [x] TypeScript configured
- [x] Android configuration verified
- [x] iOS configuration verified

---

### 📱 Step 2: Android Studio Setup

#### 2.1 Install Android Studio

1. Download from [Android Studio Website](https://developer.android.com/studio)
2. Install with default settings
3. Open Android Studio
4. Go through the setup wizard

#### 2.2 Install Android SDK

In Android Studio:
1. Go to **Tools** → **SDK Manager**
2. In **SDK Platforms** tab, check:
   - ✅ Android 13.0 (Tiramisu) - API Level 33
   - ✅ Android 12.0 (S) - API Level 31
   - ✅ Android 11.0 (R) - API Level 30
3. In **SDK Tools** tab, check:
   - ✅ Android SDK Build-Tools 33.0.0
   - ✅ Android SDK Command-line Tools
   - ✅ Android Emulator
   - ✅ Android SDK Platform-Tools
   - ✅ Intel x86 Emulator Accelerator (HAXM) - for Windows/Mac
4. Click **Apply** and wait for installation

#### 2.3 Set Environment Variables

**On Mac/Linux**, add to `~/.zshrc` or `~/.bash_profile`:
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

**On Windows**, set in System Environment Variables:
```
ANDROID_HOME = C:\Users\YourUsername\AppData\Local\Android\Sdk
PATH += %ANDROID_HOME%\platform-tools
PATH += %ANDROID_HOME%\emulator
PATH += %ANDROID_HOME%\tools
PATH += %ANDROID_HOME%\tools\bin
```

**Apply changes**:
```bash
# Mac/Linux
source ~/.zshrc

# Windows - restart terminal
```

**Verify**:
```bash
adb --version
# Should show Android Debug Bridge version
```

#### 2.4 Create Android Virtual Device (AVD)

1. In Android Studio, click **Device Manager** (phone icon)
2. Click **Create Device**
3. Select **Pixel 5** or any recent phone
4. Select **System Image**: API Level 33 (Tiramisu)
5. Click **Next** → **Finish**

---

### 🍎 Step 3: Xcode Setup (Mac Only)

#### 3.1 Install Xcode

```bash
# Check if Xcode is installed
xcode-select -p

# If not installed, install from App Store or:
xcode-select --install
```

#### 3.2 Accept Xcode License

```bash
sudo xcodebuild -license accept
```

#### 3.3 Install CocoaPods

```bash
# Install CocoaPods
sudo gem install cocoapods

# Verify installation
pod --version
```

#### 3.4 Install iOS Pods

```bash
cd location-tracker/ios
pod install
cd ..
```

**Expected output**:
```
Analyzing dependencies
Downloading dependencies
Installing...
Pod installation complete!
```

#### 3.5 Configure iOS Signing

1. Open Xcode:
   ```bash
   open ios/AlHasaTracker.xcworkspace
   ```

2. In Xcode:
   - Click **AlHasaTracker** (blue icon in left sidebar)
   - Select **AlHasaTracker** under TARGETS
   - Go to **Signing & Capabilities** tab
   - Check **"Automatically manage signing"**
   - Add your Apple ID:
     - **Xcode** menu → **Preferences** → **Accounts**
     - Click **"+"** → **Apple ID** → Sign in
   - Back in Signing & Capabilities, select your **Team**

---

### 🗺️ Step 4: Configure Google Maps API

#### 4.1 Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: **"Al Hasa Tracker"**
3. Enable APIs:
   - **Maps SDK for Android**
   - **Maps SDK for iOS**
   - **Geocoding API**
4. Create API Key:
   - **APIs & Services** → **Credentials** → **Create Credentials** → **API Key**
5. Copy the API key

#### 4.2 Configure Android

Edit `android/app/src/main/AndroidManifest.xml` (line 27):

```xml
<meta-data
  android:name="com.google.android.geo.API_KEY"
  android:value="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"/>
```

Replace with your actual API key.

#### 4.3 Configure iOS

Create or edit `ios/AlHasaTracker/AppDelegate.mm`:

```objc
#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>
#import <GoogleMaps/GoogleMaps.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [GMSServices provideAPIKey:@"AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"];

  self.moduleName = @"AlHasaTracker";
  self.initialProps = @{};

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
```

---

### 📊 Step 5: Configure Google Sheets

#### 5.1 Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com/)
2. Create new sheet: **"Al Hasa Grocery Data"**
3. Add headers in Row 1:
   ```
   Timestamp | Shop Name | Place | Latitude | Longitude | Route | Photo URL
   ```

#### 5.2 Create Google Apps Script

1. In the sheet: **Extensions** → **Apps Script**
2. Paste this code:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

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

3. **Deploy** → **New Deployment**
4. Type: **Web app**
5. Settings:
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Click **Deploy**
7. **Copy the Web App URL**

#### 5.3 Configure in App

Edit `src/services/googleSheets.ts` (line 41):

```typescript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz.../exec';
```

Replace with your actual Web App URL.

---

### ▶️ Step 6: Run the App

#### Option A: Run on Android

```bash
# Terminal 1: Start Metro bundler
npm start

# Terminal 2: Run Android
npm run android

# Or specify emulator
npx react-native run-android --deviceId emulator-5554
```

#### Option B: Run on iOS (Mac only)

```bash
# Terminal 1: Start Metro bundler
npm start

# Terminal 2: Run iOS
npm run ios

# Or specify simulator
npx react-native run-ios --simulator="iPhone 15 Pro"
```

#### Option C: Run Both Simultaneously

```bash
# Terminal 1: Metro bundler
npm start

# Terminal 2: Android
npm run android

# Terminal 3: iOS (Mac only)
npm run ios
```

---

## 🎯 Development Workflow

### Daily Development Routine

```bash
# 1. Pull latest changes
git pull

# 2. Install any new dependencies
npm install
cd ios && pod install && cd ..  # Mac only

# 3. Start Metro bundler
npm start

# 4. In separate terminals, run platforms:
npm run android    # For Android
npm run ios        # For iOS
```

### Making Changes

1. Edit code in your editor (VS Code, etc.)
2. Save files
3. App will **hot reload** automatically
4. For native changes (permissions, etc.):
   - Android: Rebuild with `npm run android`
   - iOS: Rebuild with `npm run ios`

---

## 🐛 Troubleshooting Both Platforms

### Android Issues

#### "SDK location not found"
```bash
# Create local.properties
echo "sdk.dir=/Users/YOUR_USERNAME/Library/Android/sdk" > android/local.properties
# Windows: sdk.dir=C:\\Users\\YOUR_USERNAME\\AppData\\Local\\Android\\Sdk
```

#### "Build failed"
```bash
cd android
./gradlew clean
cd ..
npm run android
```

#### "Could not connect to development server"
```bash
adb reverse tcp:8081 tcp:8081
```

### iOS Issues

#### "Module not found"
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
npm run ios
```

#### "Command PhaseScriptExecution failed"
```bash
cd ios
xcodebuild clean
pod install
cd ..
```

#### "Unable to boot simulator"
```bash
xcrun simctl erase all
```

### Both Platforms

#### Metro bundler issues
```bash
# Clear cache
npm start -- --reset-cache

# Or
watchman watch-del-all
rm -rf node_modules
npm install
```

---

## ✅ Verification Checklist

### Android Setup
- [ ] Android Studio installed
- [ ] Android SDK installed (API 33)
- [ ] ANDROID_HOME environment variable set
- [ ] AVD (emulator) created
- [ ] Google Maps API key added to AndroidManifest.xml
- [ ] `npm run android` builds successfully

### iOS Setup (Mac only)
- [ ] Xcode installed
- [ ] Command line tools installed
- [ ] CocoaPods installed
- [ ] `pod install` completed
- [ ] Apple ID added and team selected
- [ ] Google Maps API key added to AppDelegate.mm
- [ ] `npm run ios` builds successfully

### Google Services
- [ ] Google Maps API key created and configured
- [ ] Google Sheets created with headers
- [ ] Apps Script deployed as web app
- [ ] Web App URL added to googleSheets.ts

### App Testing
- [ ] App launches on Android
- [ ] App launches on iOS
- [ ] Camera permission prompt appears
- [ ] Location permission prompt appears
- [ ] Can take photos
- [ ] GPS coordinates captured
- [ ] Data saves to Google Sheets

---

## 📊 Project Structure

```
location-tracker/
├── android/               # Android native code
│   ├── app/
│   │   └── src/main/
│   │       └── AndroidManifest.xml  # ← Configure Google Maps key here
│   └── build.gradle
├── ios/                   # iOS native code
│   ├── AlHasaTracker/
│   │   ├── AppDelegate.mm           # ← Configure Google Maps key here
│   │   └── Info.plist
│   ├── Podfile
│   └── AlHasaTracker.xcworkspace    # ← Open this in Xcode
├── src/                   # React Native code
│   ├── components/
│   ├── services/
│   │   ├── googleSheets.ts          # ← Configure Apps Script URL here
│   │   ├── location.ts
│   │   └── ocr.ts
│   └── types/
├── App.tsx                # Main app component
├── package.json
└── SETUP.md              # This file
```

---

## 🚀 Quick Start Commands Reference

```bash
# Complete setup from scratch
npm install                              # Install dependencies
cd ios && pod install && cd ..           # iOS pods (Mac only)

# Daily development
npm start                                # Terminal 1: Metro
npm run android                          # Terminal 2: Android
npm run ios                              # Terminal 3: iOS (Mac)

# Cleaning/resetting
npm start -- --reset-cache               # Clear Metro cache
cd android && ./gradlew clean && cd ..   # Clean Android
cd ios && xcodebuild clean && cd ..      # Clean iOS (Mac)
watchman watch-del-all                   # Reset watchman

# Debugging
npx react-native log-android             # View Android logs
npx react-native log-ios                 # View iOS logs
```

---

## 📱 Testing on Physical Devices

### Android Physical Device

1. Enable **Developer Options** on Android:
   - Go to **Settings** → **About Phone**
   - Tap **Build Number** 7 times
2. Enable **USB Debugging**:
   - **Settings** → **Developer Options** → **USB Debugging**
3. Connect via USB
4. Run: `npm run android`

### iOS Physical Device (Mac only)

1. Connect iPhone via USB
2. On iPhone: Trust computer when prompted
3. In Xcode:
   - Select your iPhone from device list
   - Build and run (⌘R)
4. Or run: `npx react-native run-ios --device`

**First time**: Enable Developer Mode on iPhone
- **Settings** → **Privacy & Security** → **Developer Mode** → ON

---

## 💡 Pro Tips

### For Both Platforms

1. **Use hot reload**: Press `r` in Metro terminal to reload
2. **Debug menu**:
   - Android: Shake device or press `Ctrl+M` (emulator: `Cmd+M`)
   - iOS: Shake device or press `Cmd+D` (simulator)
3. **Chrome DevTools**: Enable "Debug JS Remotely" in debug menu
4. **React DevTools**: `npm install -g react-devtools` then run `react-devtools`

### Development Speed

- **Develop on Android first** (faster build times)
- **Test on iOS periodically** (to catch iOS-specific issues)
- **Use emulator/simulator** during development
- **Test on real devices** before releasing

### Version Control

```bash
# Before making changes
git pull

# After making changes
git add .
git commit -m "Your message"
git push
```

---

## 🎯 Next Steps

1. **Complete Android Studio setup** (if not done)
2. **Complete Xcode setup** (if on Mac)
3. **Install iOS pods**: `cd ios && pod install`
4. **Get Google Maps API key** and configure both platforms
5. **Set up Google Sheets** and deploy Apps Script
6. **Update configuration files** with your keys
7. **Run on Android**: `npm run android`
8. **Run on iOS**: `npm run ios`
9. **Test all features**
10. **Start collecting grocery data!**

---

## 📚 Documentation Reference

- [SETUP.md](./SETUP.md) - General setup guide
- [XCODE_SETUP.md](./XCODE_SETUP.md) - Detailed Xcode guide
- [GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md) - Google Sheets integration
- [QUICK_START.md](./QUICK_START.md) - Quick reference
- [README.md](./README.md) - Project overview

---

## ❓ Need Help?

Check these resources:
- **React Native Docs**: https://reactnative.dev/docs/environment-setup
- **Android Studio**: https://developer.android.com/studio/intro
- **Xcode**: https://developer.apple.com/xcode/
- **Troubleshooting**: See SETUP.md for common issues

---

**You're now set up for BOTH Android and iOS development! 🎉**

**Happy coding!** 📱🚀
