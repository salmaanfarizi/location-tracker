# 🍎 Xcode Setup Guide for Al Hasa Tracker

This guide covers everything you need to do with Xcode for iOS development.

---

## ⚠️ Prerequisites

**You ONLY need Xcode if**:
- You have a Mac computer
- You want to develop/test the iOS version of the app
- You plan to publish to the Apple App Store

**If you only need Android**, you can skip this entirely and just use Android Studio!

---

## 📋 Step 1: Install Xcode (Mac Only)

### Option A: Install from App Store (Recommended)

1. Open **App Store** on your Mac
2. Search for **"Xcode"**
3. Click **"Get"** or **"Install"**
4. Wait for installation (Xcode is ~12GB, may take 30-60 minutes)

### Option B: Install from Apple Developer

1. Go to [Apple Developer Downloads](https://developer.apple.com/download/)
2. Download latest Xcode
3. Open the `.xip` file and drag Xcode to Applications

### Verify Installation

```bash
xcode-select --version
# Should output: xcode-select version 2396 or similar
```

### Install Command Line Tools

```bash
sudo xcode-select --install
```

---

## 📦 Step 2: Install CocoaPods

CocoaPods manages iOS dependencies (like npm for iOS).

```bash
# Install CocoaPods
sudo gem install cocoapods

# Verify installation
pod --version
# Should output: 1.12.0 or higher
```

---

## 🔧 Step 3: Install iOS Dependencies

```bash
# Navigate to iOS directory
cd location-tracker/ios

# Install pods (this downloads iOS libraries)
pod install

# This may take 5-10 minutes the first time
```

**Expected output**:
```
Installing...
Pod installation complete! There are X dependencies from the Podfile
```

**Important**: After running `pod install`, you must ALWAYS open the **`.xcworkspace`** file, NOT the `.xcodeproj` file!

---

## 🎯 Step 4: Open Project in Xcode

```bash
# From the ios directory
open AlHasaTracker.xcworkspace

# OR double-click this file in Finder:
# location-tracker/ios/AlHasaTracker.xcworkspace
```

⚠️ **DO NOT open** `AlHasaTracker.xcodeproj` - always use the **`.xcworkspace`** file!

---

## 🔐 Step 5: Configure Code Signing

### 5.1 Add Your Apple ID

1. In Xcode, go to **Xcode** menu → **Preferences** (or **Settings** in newer Xcode)
2. Click **"Accounts"** tab
3. Click **"+"** at bottom left
4. Select **"Apple ID"**
5. Sign in with your Apple ID (free account works for testing!)

### 5.2 Configure Signing for the App

1. In Xcode left sidebar, click **"AlHasaTracker"** (blue icon at top)
2. Select **"AlHasaTracker"** under TARGETS
3. Click **"Signing & Capabilities"** tab
4. Check **"Automatically manage signing"**
5. Select your **Team** (your Apple ID)
6. Xcode will automatically create a provisioning profile

**If you see errors about Bundle Identifier**:
- Change the Bundle Identifier to something unique
- Example: `com.yourname.alhasatracker`

---

## 🗺️ Step 6: Add Google Maps API Key

### 6.1 Create AppDelegate.mm (if needed)

The file might be named `AppDelegate.m` or `AppDelegate.mm`. Let's check:

```bash
ls ios/AlHasaTracker/AppDelegate.*
```

### 6.2 Edit AppDelegate File

1. In Xcode, open **`AlHasaTracker/AppDelegate.mm`** (or `.m`)
2. At the top, add the import:

```objc
#import <GoogleMaps/GoogleMaps.h>
```

3. Find the `didFinishLaunchingWithOptions` method
4. Add this line BEFORE `return YES;`:

```objc
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // Add this line with your actual API key
  [GMSServices provideAPIKey:@"YOUR_GOOGLE_MAPS_API_KEY_HERE"];

  // ... rest of the existing code ...

  return YES;
}
```

**Complete example**:

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

## 📱 Step 7: Select Device/Simulator

### Option A: Use iOS Simulator (No iPhone needed)

1. In Xcode top toolbar, click the device dropdown (next to "AlHasaTracker")
2. Select a simulator like:
   - **iPhone 14 Pro**
   - **iPhone 15**
   - **Any iOS 13.0+ device**

### Option B: Use Physical iPhone

1. Connect your iPhone to Mac with USB cable
2. On iPhone, tap **"Trust This Computer"** if prompted
3. In Xcode, select your iPhone from the device dropdown
4. Make sure your iPhone is unlocked

**First time using your iPhone for development?**
- On iPhone, go to **Settings** → **Privacy & Security** → **Developer Mode**
- Enable **Developer Mode**
- Restart iPhone if prompted

---

## ▶️ Step 8: Build and Run

### Method 1: Using Xcode

1. Click the **Play ▶️** button in Xcode top left
2. Wait for build to complete (first build may take 5-10 minutes)
3. App will launch on simulator or device

### Method 2: Using Terminal (Recommended)

```bash
# From project root directory
cd location-tracker

# Terminal 1: Start Metro bundler
npm start

# Terminal 2: Run iOS
npm run ios

# Or run on specific simulator
npx react-native run-ios --simulator="iPhone 15 Pro"

# Or run on connected iPhone
npx react-native run-ios --device
```

---

## 🐛 Common Xcode Issues & Solutions

### Issue 1: "Unable to boot device"

**Solution**:
```bash
# Reset iOS Simulator
xcrun simctl erase all
```

### Issue 2: "Command PhaseScriptExecution failed"

**Solution**:
```bash
cd ios
rm -rf Pods
rm Podfile.lock
pod install
```

### Issue 3: "Module not found" errors

**Solution**:
```bash
# Clean build
cd ios
xcodebuild clean

# Or in Xcode: Product → Clean Build Folder (Cmd + Shift + K)
```

### Issue 4: "Signing requires a development team"

**Solution**:
- Add your Apple ID in Xcode Preferences → Accounts
- Select your team in Signing & Capabilities
- Free Apple ID accounts work for testing!

### Issue 5: "Could not find iPhone"

**Solution**:
- Make sure iPhone is unlocked
- Trust the computer on iPhone
- Enable Developer Mode on iPhone (Settings → Privacy & Security)

### Issue 6: "GoogleMaps/GoogleMaps.h not found"

**Solution**:
```bash
cd ios
pod deintegrate
pod install
```

### Issue 7: Build takes forever or freezes

**Solution**:
- Close Xcode
- Delete derived data:
  ```bash
  rm -rf ~/Library/Developer/Xcode/DerivedData
  ```
- Reopen Xcode and rebuild

---

## 🎨 Xcode Optional Customizations

### Change App Name

1. In Xcode, select **AlHasaTracker** project
2. Select **AlHasaTracker** under TARGETS
3. Go to **General** tab
4. Edit **Display Name**

### Change App Icon

1. Prepare icons (you can use [App Icon Generator](https://appicon.co/))
2. In Xcode, open **Assets.xcassets**
3. Click **AppIcon**
4. Drag your icon images into the slots

### Change Launch Screen

1. In Xcode, open **LaunchScreen.storyboard**
2. Design your launch screen using Interface Builder

---

## ✅ Verification Checklist

After completing all steps:

- [ ] Xcode installed and command line tools installed
- [ ] CocoaPods installed
- [ ] `pod install` completed successfully in `ios` directory
- [ ] Opened `.xcworkspace` file (not `.xcodeproj`)
- [ ] Apple ID added to Xcode
- [ ] Signing configured with your team
- [ ] Google Maps API key added to AppDelegate
- [ ] Device or simulator selected
- [ ] App builds and runs successfully
- [ ] Camera permission prompt appears
- [ ] Location permission prompt appears

---

## 🚀 Quick Start Commands

```bash
# Complete iOS setup from scratch
cd location-tracker
npm install                          # Install Node dependencies
cd ios
pod install                          # Install iOS dependencies
cd ..
npm start                            # Start Metro bundler
# In another terminal:
npm run ios                          # Build and run iOS app
```

---

## 📊 System Requirements

- **macOS**: 12.0 (Monterey) or higher
- **Xcode**: 14.0 or higher
- **iOS Deployment Target**: 13.0 or higher
- **Disk Space**: ~20GB for Xcode + simulators
- **RAM**: 8GB minimum, 16GB recommended

---

## 💡 Tips

1. **Always use `.xcworkspace`** after running `pod install`
2. **Clean build** if you get random errors (Product → Clean Build Folder)
3. **Simulator is slower** than a physical device - be patient on first launch
4. **Free Apple ID works** for testing on your own devices (no $99 dev account needed)
5. **Use physical device** for testing camera and GPS features (simulators have limitations)

---

## 🔗 Helpful Resources

- [Xcode Documentation](https://developer.apple.com/documentation/xcode)
- [React Native iOS Setup](https://reactnative.dev/docs/environment-setup)
- [CocoaPods Guides](https://guides.cocoapods.org/)
- [Apple Developer](https://developer.apple.com/)

---

## ❓ Do You Need Xcode?

**YES, if**:
- You want to test on iPhone/iPad
- You want to publish to App Store
- You're developing iOS-specific features

**NO, if**:
- You only need Android version
- You don't have a Mac
- You're just testing backend/API features

**For Android-only development**, just use Android Studio and ignore all iOS/Xcode steps!

---

**Happy iOS Development! 🍎📱**
