# Sightline WebAR - Unified Permission Flow

## 🎯 What's New

**Version 2.0** introduces a **unified permission flow** with a proper **Finite State Machine (FSM)** to eliminate the "stuck on single screen" bug.

---

## 🚀 Quick Start

1. **Open the app**: https://sightline-webar.vercel.app
2. **Tap "Enable Camera, Location & Motion"**
3. **Grant permissions** when prompted (Camera → Location → Motion)
4. **AR experience starts automatically**

**Alternative**: Tap "Continue in Demo Mode" to try without sensors.

---

## 📱 User Flow

### **Start Screen**

When you first load the app, you'll see:

- **Title**: "🎯 Sightline WebAR"
- **Permission Checklist**:
  - ⭕ Camera (To see the real world)
  - ⭕ Location (To find nearby landmarks)
  - ⭕ Motion & Orientation (To track where you're looking)
- **State Banner**: Shows current app state (e.g., `PERMISSION_GATE`)
- **Primary Button**: "Enable Camera, Location & Motion"
- **Secondary Button**: "Continue in Demo Mode (No Sensors)"

### **Permission Request Flow**

When you tap the primary button:

1. **Camera Permission**
   - Browser prompts: "Allow camera access?"
   - Checklist updates: ⭕ → ⏳ → ✅
   
2. **Location Permission**
   - Browser prompts: "Allow location access?"
   - Checklist updates: ⭕ → ⏳ → ✅
   
3. **Motion Permission** (iOS only)
   - Browser prompts: "Allow motion & orientation?"
   - Checklist updates: ⭕ → ⏳ → ✅

4. **Auto-Transition**
   - State: `REQUESTING_PERMS` → `READY` → `RUNNING`
   - Start screen fades out
   - AR screen appears

### **AR Screen**

Once permissions are granted:

- **Live Camera Feed**: Real-world view
- **IMU HUD** (top-left):
  - Heading: 127° SE
  - GPS: 22.38789, 113.98175
  - Accuracy: ±15m
- **Mode Badge** (top-right): "LIVE AR" or "DEMO MODE"
- **POI Labels**: Appear as you look around

### **Error Handling**

If any permission is denied:

- **Error State**: State banner turns red
- **Error Message**: "Camera: denied; Location: granted; Motion: granted"
- **Recovery Options**:
  - **Retry Button**: Re-request all permissions
  - **Demo Mode Button**: Continue without sensors

---

## 🎮 Demo Mode

**What is it?**  
Demo Mode lets you experience the app without granting any permissions. Perfect for:
- Testing the UI
- Showcasing features
- Demos/presentations
- Troubleshooting

**How to use:**
1. Tap "Continue in Demo Mode (No Sensors)"
2. App starts immediately with simulated data:
   - **Position**: West Kowloon Freespace (22.3045, 114.1595)
   - **Heading**: 120° (facing Victoria Harbour)
   - **Accuracy**: ±10m

**Limitations:**
- No real camera feed
- No sensor updates
- Fixed position/heading

---

## 🏗️ Technical Architecture

### **Finite State Machine (FSM)**

The app uses a 6-state FSM to manage lifecycle:

```
INIT
  ↓
PERMISSION_GATE (Show start screen)
  ↓
REQUESTING_PERMS (Request Camera → Location → Motion)
  ↓
READY (Initialize AR scene)
  ↓
RUNNING (AR experience active)
  ↓
ERROR (If any permission fails)
```

**Key Benefits:**
- ✅ Clear state transitions
- ✅ No ambiguous states
- ✅ Impossible to get stuck
- ✅ Easy to debug

### **Unified Permission Manager**

Single `Permissions.requestAll()` call handles:

1. **Camera** (`getUserMedia`)
   - Requests video stream
   - Stores stream for AR.js
   
2. **Location** (`getCurrentPosition` + `watchPosition`)
   - Gets initial position
   - Starts continuous tracking
   
3. **Motion** (`DeviceOrientation`)
   - iOS: Requests permission (requires user gesture)
   - Android: Attaches listeners directly

**Returns:**
```javascript
{
  camera: { ok: true/false, stream, error },
  location: { ok: true/false, position, watchId, error },
  motion: { ok: true/false, error }
}
```

### **Screen Router**

`UI.route(state)` controls screen visibility:

- **Start Screen**: `INIT`, `PERMISSION_GATE`, `REQUESTING_PERMS`, `ERROR`
- **AR Screen**: `READY`, `RUNNING`

**Impossible to get stuck** - every state has defined visibility.

---

## 🐛 Debugging

### **Debug Page**

Open https://sightline-webar.vercel.app/debug-unified.html to see:

- **Current FSM State**
- **Permission Results** (✅/❌ for each)
- **Sensor Data** (Heading, GPS, Accuracy)
- **State History** (Last 10 transitions)
- **Console Logs** (Last 50 messages)
- **Quick Actions**:
  - Request All Permissions
  - Enter Demo Mode
  - Retry Permissions
  - Clear Logs

### **Browser Console**

Check these global variables:

```javascript
window.APP_STATE          // Current FSM state
window.STATE_HISTORY      // Array of state transitions
window.Permissions.results // Permission results
window.APP                // App instance
window.APP.sensors        // Sensor data
```

### **Console Logs**

Look for these prefixes:

- `[FSM]` - State transitions
- `[Permissions]` - Permission requests
- `[UI]` - Screen routing
- `[App]` - App initialization
- `[VideoFix]` - Camera troubleshooting

---

## 🔧 Troubleshooting

### **Problem: Stuck on Start Screen**

**Cause**: Permissions not granted or error occurred  
**Solution**:
1. Check state banner for current state
2. If `ERROR`, read error message
3. Tap "Retry Permissions"
4. Or use "Demo Mode" to bypass

### **Problem: Camera Feed is Black**

**Cause**: Video element not playing  
**Solution**:
1. Check console for `[VideoFix]` logs
2. Ensure camera permission granted
3. Try refreshing the page
4. Check if camera is used by another app

### **Problem: IMU Data Not Updating**

**Cause**: Motion permission denied or not supported  
**Solution**:
1. Check if motion permission granted (iOS)
2. Try device calibration (figure-8 motion)
3. Check console for orientation events
4. Use Demo Mode to test UI

### **Problem: GPS Not Accurate**

**Cause**: Poor GPS signal or denied permission  
**Solution**:
1. Check accuracy value (should be <20m)
2. Move to open area (away from buildings)
3. Wait 10-30 seconds for GPS lock
4. Check if location permission granted

### **Problem: iOS Motion Permission Not Appearing**

**Cause**: Permission must be requested from user gesture  
**Solution**:
1. Ensure you tap the button (don't auto-grant)
2. Check if iOS 13+ (required for permission API)
3. Try Safari (best support)
4. Check console for permission errors

---

## 📱 Browser Compatibility

| Browser | Camera | Location | Motion | Notes |
|---------|--------|----------|--------|-------|
| **iOS Safari** | ✅ | ✅ | ✅ | Best support, requires iOS 13+ for motion permission |
| **iOS Chrome** | ✅ | ✅ | ⚠️ | Motion may be less accurate |
| **Android Chrome** | ✅ | ✅ | ✅ | Excellent support |
| **Android Firefox** | ✅ | ✅ | ✅ | Good support |
| **Desktop Chrome** | ✅ | ⚠️ | ❌ | Location may be IP-based, no motion sensors |
| **Desktop Safari** | ✅ | ⚠️ | ❌ | Location may be IP-based, no motion sensors |

**Recommended**: iOS Safari or Android Chrome for best experience.

---

## 🔐 Privacy & Permissions

### **What We Access**

1. **Camera**: To display real-world view in AR
2. **Location**: To find nearby landmarks and calculate distances
3. **Motion**: To track device orientation and heading

### **What We DON'T Do**

- ❌ Store photos/videos
- ❌ Share location with third parties
- ❌ Track you across websites
- ❌ Collect personal information

### **How to Revoke Permissions**

**iOS Safari:**
1. Settings → Safari → Privacy & Security
2. Tap "Website Settings"
3. Find sightline-webar.vercel.app
4. Change permissions

**Android Chrome:**
1. Chrome → Settings → Site Settings
2. Find sightline-webar.vercel.app
3. Change permissions

---

## 📚 Additional Resources

- **Main Documentation**: `/README.md`
- **Technical Architecture**: `/TECH-ARCHITECTURE.md`
- **Deployment Info**: `/UNIFIED-DEPLOYMENT.md`
- **Root Cause Analysis**: `/CAMERA-RCA.md`
- **Debug Page**: https://sightline-webar.vercel.app/debug-unified.html

---

## 🆘 Support

**Issues?** Open a GitHub issue with:
1. Device & browser (e.g., "iPhone 14, iOS 17, Safari")
2. What you see (screenshot if possible)
3. Console logs (from debug page)
4. State banner text
5. Steps to reproduce

---

**Version**: 2.0 (Unified Permission Flow)  
**Last Updated**: 2025-11-09  
**Status**: ✅ Production

