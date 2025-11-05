# ⚡ Quick Start Guide

Get your Al Hasa Grocery Tracker app running in **15 minutes**!

---

## 🎯 For Developers

### 1. Install Dependencies (5 minutes)

```bash
# Clone and navigate to project
cd location-tracker

# Install packages
npm install

# For iOS only (Mac required)
cd ios && pod install && cd ..
```

### 2. Basic Setup (2 minutes)

**Skip Google integration for now** - the app works offline and saves data locally!

### 3. Run the App (3 minutes)

**For Android:**
```bash
# Terminal 1
npm start

# Terminal 2 (in new terminal)
npm run android
```

**For iOS:**
```bash
# Terminal 1
npm start

# Terminal 2 (in new terminal)
npm run ios
```

### 4. Test It! (5 minutes)

1. Open the app
2. Grant camera and location permissions
3. Tap "📸 ONE-CLICK CAPTURE"
4. Take a photo of any text
5. Watch the magic happen! ✨

---

## 📱 For Field Supervisors

### How to Use the App

1. **Open App** → See big blue "ONE-CLICK CAPTURE" button
2. **Tap Button** → Camera opens
3. **Take Photo** of grocery store sign
4. **Wait 3 seconds** → AI reads the name automatically!
5. **Check the info**:
   - Shop name (read by AI)
   - Address (from GPS)
   - GPS coordinates
6. **Select Route**: Tap on route number (1, 2, 3, or 4)
7. **Tap "SAVE"** → Done! ✅

### View Your Progress

- Tap "🗺️ Map" button to see all collected stores
- Different colors = different routes
- Bottom of screen shows your progress

---

## 🔧 Google Sheets Setup (Optional)

**Want data in Google Sheets?**

Follow the detailed guide in `GOOGLE_SHEETS_SETUP.md`

Quick version:
1. Create Google Sheet
2. Add Apps Script
3. Deploy as Web App
4. Copy URL to app
5. Done!

---

## ❓ Common Questions

### Q: Do I need internet to use the app?
**A:** No! The app works offline. Data saves to your phone and syncs to Google Sheets when you have internet.

### Q: How accurate is the shop name reading?
**A:** Very accurate for clear photos! Tips for best results:
- Good lighting
- Focus on the shop sign
- Close-up photos work best

### Q: Can I edit the shop name if AI gets it wrong?
**A:** Currently, the name is auto-captured. In the future, we'll add manual editing. For now, you can edit directly in Google Sheets.

### Q: What if GPS is not accurate?
**A:** Use the app outdoors for best GPS signal. Indoor GPS may be less accurate.

### Q: How do I assign routes?
**A:** Just tap the route number (1, 2, 3, or 4) before saving. Colors help you identify:
- 1 = Red
- 2 = Teal
- 3 = Yellow
- 4 = Green

### Q: Where are photos stored?
**A:** Photos are saved to your device's photo library automatically.

---

## 🚀 Pro Tips

### For Faster Data Collection:

1. **Plan Your Route**: Group nearby stores
2. **Battery Saver**: Bring a power bank
3. **Good Photos**: Clear shop signs = better AI reading
4. **Route Strategy**:
   - Route 1 (Red): North area
   - Route 2 (Teal): South area
   - Route 3 (Yellow): East area
   - Route 4 (Green): West area

### Daily Workflow:

**Morning:**
- Charge phone fully
- Check app is working
- Plan which area to visit

**In Field:**
- Take photos of all stores
- Select correct route for each
- Save immediately after each photo

**Evening:**
- Connect to WiFi
- Data syncs to Google Sheets
- Review the map view
- Check progress vs 1750 goal

---

## 📊 Track Your Progress

### Daily Goals:
- **Day 1-5**: 50 stores/day = 250 total
- **Day 6-10**: 50 stores/day = 500 total
- **Day 11-30**: 45 stores/day = 1350 total
- **Day 31-35**: 80 stores/day = **1750 COMPLETE!** 🎉

### Weekly Targets:
- Week 1: 250 stores
- Week 2: 250 stores (500 total)
- Week 3: 250 stores (750 total)
- Week 4: 250 stores (1000 total)
- Week 5: 250 stores (1250 total)
- Week 6: 250 stores (1500 total)
- Week 7: 250 stores (**1750 DONE!**)

---

## 🆘 Help!

### App won't start?
```bash
# Clear cache and restart
npm start --reset-cache
```

### Camera not working?
- Check Settings → Apps → Al Hasa Tracker → Permissions
- Enable Camera permission

### GPS not working?
- Enable Location Services in device settings
- Try outdoors for better signal

### Need more help?
- Check `README.md` for full documentation
- Check `GOOGLE_SHEETS_SETUP.md` for integration help

---

## 🎉 You're Ready!

**Start collecting data and reach that 1750 goal!**

Good luck! 💪

---

*Questions? Check the full README.md for detailed information.*
