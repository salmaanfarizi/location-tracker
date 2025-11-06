# Building with Xcode - Step by Step Guide

This guide will help you build and install the Al Hasa Tracker app on your iPhone using Xcode.

## Prerequisites

1. **Mac with Xcode installed**
   - Download from Mac App Store (it's free)
   - Xcode 14.0 or later recommended

2. **iPhone connected to your Mac**
   - USB cable connection
   - Trust the computer on your iPhone when prompted

3. **Apple ID** (Free or Paid)
   - Free account: Can install on your own device (app expires after 7 days)
   - Paid ($99/year): Full distribution, no expiration

## Step 1: Install CocoaPods (If Not Already Installed)

Open Terminal on your Mac and run:

```bash
# Check if CocoaPods is installed
which pod

# If not installed, install it:
sudo gem install cocoapods

# Verify installation
pod --version
```

## Step 2: Install iOS Dependencies

Navigate to your project directory and install pods:

```bash
# Navigate to your project
cd /Users/salman/Desktop/AlHasaTracker

# Install CocoaPods dependencies
cd ios
pod install
cd ..
```

**IMPORTANT**: This will create a `.xcworkspace` file. Always use the **workspace** file, NOT the `.xcodeproj` file!

## Step 3: Open Project in Xcode

```bash
# Open the workspace file (NOT the .xcodeproj)
open ios/AlHasaTracker.xcworkspace
```

OR double-click the `AlHasaTracker.xcworkspace` file in Finder.

## Step 4: Configure Signing & Capabilities

Once Xcode opens:

1. **Select the project** in the left sidebar (top item - blue icon)
2. **Select the target** "AlHasaTracker" under TARGETS
3. **Go to "Signing & Capabilities" tab**
4. **Enable "Automatically manage signing"** (check the box)
5. **Select your Team**:
   - Click the "Team" dropdown
   - Select your Apple ID account
   - If you don't see your account, click "Add Account..." and sign in with your Apple ID

6. **Bundle Identifier** (Important!):
   - Change from default to something unique
   - Format: `com.yourname.alhasatracker`
   - Example: `com.salman.alhasatracker`
   - Must be unique across App Store

## Step 5: Connect and Trust Your iPhone

1. **Connect your iPhone** to Mac via USB cable
2. **Unlock your iPhone**
3. **Trust the computer** if prompted on iPhone
4. In Xcode, at the top near the "Play" button, you'll see a device selector
5. **Select your iPhone** from the dropdown (it will show your iPhone's name)

## Step 6: Build and Run

1. **Click the "Play" button** (▶️) in Xcode's top-left corner
   - OR press `Cmd + R`

2. **First time only**: You'll see an error about "Untrusted Developer"
   - This is normal for free Apple accounts
   - Go to your iPhone: **Settings → General → VPN & Device Management**
   - Tap on your Apple ID / Developer App
   - Tap **"Trust [Your Apple ID]"**
   - Go back to Xcode and click the Play button again

3. **Watch the build process**:
   - You'll see build progress at the top
   - It may take 2-5 minutes the first time
   - Subsequent builds will be faster

## Step 7: Test the App

The app should launch on your iPhone automatically! You can now:
- ✅ Test location tracking with real GPS data
- ✅ Test camera functionality
- ✅ Use it independently (no computer needed after installation)
- ✅ Keep it on your phone for 7 days (free account) or permanently (paid account)

## Troubleshooting

### Error: "Failed to register bundle identifier"
**Solution**: Change your Bundle Identifier to something unique (Step 4, item 6)

### Error: "Code signing is required"
**Solution**: Make sure you selected a Team in Signing & Capabilities (Step 4, item 5)

### Error: "Unable to install..."
**Solution**:
- Delete the app from your iPhone if it's already there
- Clean build folder: Xcode → Product → Clean Build Folder
- Try building again

### App crashes immediately
**Solution**:
- Check that Metro bundler is running (in your other terminal)
- If not, run: `npm start` in the project root
- Make sure your iPhone and Mac are on the same WiFi network

### "Untrusted Developer" won't go away
**Solution**:
- iPhone Settings → General → VPN & Device Management
- Trust the developer profile associated with your Apple ID

## Re-building After Code Changes

1. Make your code changes in VSCode or any editor
2. In Xcode, just press `Cmd + R` to rebuild and run
3. OR stop the app and click the Play button again

## Development Workflow

**Best Practice**: Keep two terminals open:

Terminal 1 - Metro Bundler:
```bash
cd /Users/salman/Desktop/AlHasaTracker
npm start
```

Terminal 2 - For git, installs, etc:
```bash
cd /Users/salman/Desktop/AlHasaTracker
# Run commands as needed
```

Then use Xcode to build and deploy to your iPhone.

## Notes

- **Free Apple Account**: App expires after 7 days, need to re-install
- **Paid Developer Account** ($99/year): No expiration, can distribute via TestFlight/App Store
- **Location permissions**: Will be requested when you first use location features
- **Camera permissions**: Will be requested when you first use camera

## Next Steps

Once the app is running on your iPhone:
1. Test location tracking in real-world scenarios
2. Test shop name entry and photo capture
3. Verify data is being saved correctly

Good luck! 🚀
