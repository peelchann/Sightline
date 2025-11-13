# Loading Screen Fix - Troubleshooting Guide

## 🔧 What Was Fixed

### **Problem:**
Loading screen stuck on "Initializing AR..." indefinitely

### **Cause:**
The app was waiting for GPS signal before hiding the loading screen. If GPS takes too long or permissions are denied, the loading screen never disappears.

### **Solution Applied:**

1. **15-Second Timeout** ✅
   - Loading screen auto-hides after 15 seconds, even if AR not ready
   - Prevents infinite loading

2. **Manual Skip Button** ✅
   - "Skip & Continue Anyway" button appears after 5 seconds
   - Click to bypass loading manually

3. **Debug Tool** ✅
   - New page to diagnose issues
   - Tests camera, GPS, and AR.js loading

---

## 🚀 Try It Now (Fixed Version)

**New Production URL:**
```
https://sightline-webar-4380lv692-peelchans-projects.vercel.app
```

**Debug Tool (if still stuck):**
```
https://sightline-webar-4380lv692-peelchans-projects.vercel.app/debug.html
```

---

## 🔍 Common Reasons for Loading Issues

### **1. GPS Permission Denied or Slow** (Most Common)

**Symptoms:**
- Loading screen stuck
- No GPS reading in top-left

**Solutions:**
- ✅ **Grant GPS permission** when browser asks
- ✅ **Go outside** - GPS needs clear sky view
- ✅ **Wait 30 seconds** - GPS lock takes time
- ✅ **Enable Location Services** in phone settings

**How to fix:**
- **iPhone:** Settings → Privacy → Location Services → Safari → "While Using"
- **Android:** Settings → Location → App permissions → Chrome → Allow

---

### **2. Camera Permission Denied**

**Symptoms:**
- Black screen after loading
- No camera feed

**Solutions:**
- ✅ **Grant camera permission** when browser asks
- ✅ **Close other apps** using camera
- ✅ **Check browser settings**

**How to fix:**
- **iPhone:** Settings → Safari → Camera → Allow
- **Android:** Settings → Site settings → Camera → Allow

---

### **3. iOS Motion Permission** (iPhone Only)

**Symptoms:**
- Loading stuck on "Requesting motion access..."

**Solution:**
- **iPhone:** Settings → Safari → Motion & Orientation Access → ON

---

### **4. Slow Internet / Library Loading Failed**

**Symptoms:**
- Loading stuck
- Console shows "Failed to load resource"

**Solutions:**
- ✅ **Check internet connection**
- ✅ **Try cellular data** (not WiFi)
- ✅ **Disable ad blockers**
- ✅ **Refresh page**

---

### **5. Browser Not Supported**

**Symptoms:**
- Loading never starts
- Blank screen

**Supported Browsers:**
- ✅ **iOS:** Safari 13+ (Chrome doesn't support AR on iOS!)
- ✅ **Android:** Chrome 90+

**Not Supported:**
- ❌ Desktop browsers (no GPS/camera for AR)
- ❌ Old phone browsers (iOS 12 or earlier)

---

## 📱 Step-by-Step Debugging

### **Step 1: Use Debug Tool**

Visit: `https://sightline-webar-4380lv692-peelchans-projects.vercel.app/debug.html`

Click each button:
1. 📷 **Test Camera** → Should see "Permission granted"
2. 📍 **Test GPS** → Should see your coordinates
3. 📱 **Test Orientation** (iOS) → Should see "Permission granted"
4. 🔄 **Test AR.js** → Should see "Libraries loaded"

**If any fail**, follow the specific instructions shown.

---

### **Step 2: Check Browser Console**

Open console:
- **iPhone Safari:** Settings → Safari → Advanced → Web Inspector (connect to Mac)
- **Android Chrome:** Menu (⋮) → More tools → Developer tools → Console

Look for:
- ❌ Red errors → Something failed
- ⚠️ Yellow warnings → Might have issues
- ✅ Green logs → Everything working

Common errors:
```
"NotAllowedError" → Permission denied (grant in settings)
"Position unavailable" → No GPS signal (go outside)
"Script loading failed" → Internet issue (refresh page)
```

---

### **Step 3: Try Manual Skip**

If loading stuck:
1. **Wait 5 seconds** → "Skip & Continue Anyway" button appears
2. **Click "Skip"** → Loading screen disappears
3. **Check GPS indicator** (top-left) → Should show coordinates
4. **Check POI counter** (top-right) → Should show number

If GPS shows "GPS: Waiting..." after skip:
- Go outside for better signal
- Wait 1-2 minutes
- Refresh page and try again

---

## 🎯 Expected Timeline

**Normal AR initialization:**
```
00:00  Page loads
00:02  Libraries loaded (A-Frame + AR.js)
00:03  Camera permission requested
00:04  GPS permission requested
00:05  Camera feed starts
00:08  GPS acquires signal (±5-50m accuracy)
00:10  "AR Ready!" message appears
00:11  Loading screen disappears ✅
```

**If stuck at any step** → Use debug tool or skip button

---

## 🛠️ Quick Fixes

### **Fix 1: Nuclear Reset** (Works 90% of the time)

1. Close all browser tabs
2. Clear browser cache
3. Restart phone
4. Open URL in fresh browser tab
5. Grant all permissions when asked

---

### **Fix 2: Use Different Browser**

If stuck in Chrome:
- Try Safari (iOS) or Firefox (Android)
- WebAR works better in some browsers

---

### **Fix 3: Test Without AR**

Visit test page first:
```
https://sightline-webar-4380lv692-peelchans-projects.vercel.app/test.html
```

This checks if your browser supports WebAR without loading the full AR app.

---

## ✅ How to Know It's Working

### **Loading Screen Behavior:**

**Working:**
```
Initializing AR...
Requesting camera access... ✓
Camera ready ✓
Starting GPS... ✓
AR initialized! ✓
[Loading screen disappears in 2-3 seconds]
```

**Stuck (Before Fix):**
```
Initializing AR...
Starting GPS...
[Stuck here forever 😢]
```

**Fixed (Now):**
```
Initializing AR...
Starting GPS...
[After 5 seconds: "Skip & Continue Anyway" button appears]
[After 15 seconds: Auto-hides with error message]
```

---

### **After Loading Screen:**

**You should see:**
- 📷 **Camera feed** showing real world
- 📍 **GPS info** (top-left): "GPS: ±15.3m" (green = good)
- 🔢 **POI counter** (top-right): "3 landmarks nearby"
- 📋 **Instructions** (center): "Point your camera at landmarks"

**If you see these** → ✅ It's working!

**If black screen** → Camera permission denied (check settings)

**If no GPS reading** → Go outside, wait for signal

---

## 📍 Field Testing Tips

**Best Testing Conditions:**
- ✅ **Location:** Clock Tower, Tsim Sha Tsui (22.2946°N, 114.1699°E)
- ✅ **Time:** Weekend morning (9-11am) - less crowded
- ✅ **Weather:** Clear day - GPS works better
- ✅ **Position:** Open area near waterfront - clear sky view
- ✅ **Distance:** Within 150m of Clock Tower

**Expected GPS Accuracy:**
- ⭐ **Excellent:** ±5-15m (green indicator)
- ✅ **Good:** ±15-30m (yellow indicator)
- ⚠️ **Poor:** ±30-100m (red indicator) - move to open area

---

## 🆘 Still Not Working?

### **Last Resort Options:**

1. **Use Simulated GPS** (Testing Mode)
   - Edit `index.html` line ~270
   - Add: `simulateLatitude: 22.2946; simulateLongitude: 114.1699`
   - This fakes your GPS position for testing

2. **Contact Support**
   - Open GitHub issue: https://github.com/peelchann/Sightline/issues
   - Include: Phone model, browser version, error messages
   - Attach: Screenshots from debug tool

3. **Wait for Next Update**
   - We're improving GPS handling
   - Check GitHub for updates

---

## 📊 Debug Tool Output Example

**Good (Everything Working):**
```
✅ Geolocation API: Supported
✅ Camera API: Supported
✅ Device Orientation: Supported
✅ WebGL: Supported
✅ HTTPS: Yes

Camera: Permission granted ✅
GPS: Lat 22.29460, Lng 114.16990 (±12.3m) ✅
Motion/Orientation: Permission granted ✅
AR.js libraries loaded successfully ✅
```

**Bad (Something Failed):**
```
❌ Geolocation API: NOT Supported → Use newer browser
❌ Camera: Permission denied → Go to Settings
⚠️ GPS: Timeout → Go outside
❌ HTTPS: No → Must use HTTPS URL (Vercel provides this)
```

---

## 🎯 Success Checklist

After fixing:
- [ ] Loading screen no longer stuck
- [ ] "Skip" button available (after 5s)
- [ ] Can access main app
- [ ] Camera feed visible
- [ ] GPS showing coordinates
- [ ] No error messages
- [ ] POI counter showing "3"
- [ ] Ready for field testing!

---

## 📝 Change Log

**v1.1 (Current):**
- ✅ Added 15-second loading timeout
- ✅ Added manual skip button (shows after 5s)
- ✅ Created debug.html diagnostic tool
- ✅ Better error messages
- ✅ Link to debug tool from loading screen

**v1.0 (Original):**
- ⚠️ Could get stuck on loading screen indefinitely
- ❌ No way to skip or diagnose issues

---

**🎉 Try the fixed version now!**

**Main App:** https://sightline-webar-4380lv692-peelchans-projects.vercel.app  
**Debug Tool:** https://sightline-webar-4380lv692-peelchans-projects.vercel.app/debug.html

---

**Need help?** Open the debug tool first - it will tell you exactly what's wrong!

