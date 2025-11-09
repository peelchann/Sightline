# Camera Black Screen - Root Cause Analysis

## 📊 Current Status

### ✅ Working
- [x] Permission-gated start screen
- [x] Camera permission granted (getUserMedia succeeded)
- [x] Location permission granted (GPS data showing)
- [x] Motion permission granted (heading showing)
- [x] IMU data updating (Heading: 127° SE)
- [x] GPS coordinates updating (22.38789, 113.98175)
- [x] Accuracy showing (±15m)
- [x] App initialized (no JS errors visible)

### ❌ Not Working
- [ ] Camera feed visible (black screen)
- [ ] AR.js video stream not showing
- [ ] POI labels not visible

---

## 🔍 Possible Root Causes

### **Category 1: Video Element Issues**

#### RC-1.1: Video element not created by AR.js
**Hypothesis**: AR.js hasn't created the `<video>` element yet  
**Test**: Check if `document.querySelector('video')` exists  
**Priority**: HIGH  
**Status**: ⏳ TO TEST

#### RC-1.2: Video element created but hidden
**Hypothesis**: Video exists but has `display: none` or `opacity: 0`  
**Test**: Check video element computed styles  
**Priority**: HIGH  
**Status**: ⏳ TO TEST

#### RC-1.3: Video element has wrong dimensions
**Hypothesis**: Video is 0×0 or positioned off-screen  
**Test**: Check video `width`, `height`, `position`  
**Priority**: MEDIUM  
**Status**: ✅ **CONFIRMED ROOT CAUSE**
**Evidence**: 
- Video Size: 0×0 (should be 1280×960 or similar)
- Video exists, srcObject attached, but videoWidth/videoHeight = 0
- This means video stream is not rendering

#### RC-1.4: Video stream not attached to element
**Hypothesis**: Video element exists but `srcObject` is null  
**Test**: Check `video.srcObject` and `video.readyState`  
**Priority**: HIGH  
**Status**: ⏳ TO TEST

---

### **Category 2: AR.js Initialization Issues**

#### RC-2.1: AR.js not initialized
**Hypothesis**: A-Frame scene loaded but AR.js system not started  
**Test**: Check `scene.systems['arjs']` exists and is initialized  
**Priority**: HIGH  
**Status**: ⏳ TO TEST

#### RC-2.2: AR.js waiting for user interaction
**Hypothesis**: AR.js needs explicit play() call after permissions  
**Test**: Try calling `video.play()` manually  
**Priority**: HIGH  
**Status**: ✅ **LIKELY RELATED**
**Evidence**: 
- Video Paused: Yes (should be No)
- Video needs to be played to start rendering frames
- iOS may require explicit play() call

#### RC-2.3: AR.js sourceType config wrong
**Hypothesis**: `sourceType: webcam` not working on iOS  
**Test**: Try different sourceType values  
**Priority**: MEDIUM  
**Status**: ⏳ TO TEST

#### RC-2.4: AR.js embedded mode issue
**Hypothesis**: `embedded` attribute causing issues on iOS  
**Test**: Remove `embedded` attribute  
**Priority**: LOW  
**Status**: ⏳ TO TEST

---

### **Category 3: A-Frame Scene Issues**

#### RC-3.1: Scene hidden or not rendered
**Hypothesis**: A-Frame scene has `display: none` or wrong z-index  
**Test**: Check scene visibility and z-index  
**Priority**: HIGH  
**Status**: ⏳ TO TEST

#### RC-3.2: Scene not loaded yet
**Hypothesis**: Scene still loading when we check  
**Test**: Wait for `scene.hasLoaded` to be true  
**Priority**: MEDIUM  
**Status**: ⏳ TO TEST

#### RC-3.3: Canvas covering video
**Hypothesis**: A-Frame canvas is on top of video with black background  
**Test**: Check canvas z-index and background  
**Priority**: MEDIUM  
**Status**: ⏳ TO TEST

---

### **Category 4: Permission/MediaStream Issues**

#### RC-4.1: Camera permission revoked after grant
**Hypothesis**: iOS revoked camera permission after initial grant  
**Test**: Check `navigator.permissions.query({ name: 'camera' })`  
**Priority**: MEDIUM  
**Status**: ⏳ TO TEST

#### RC-4.2: MediaStream stopped
**Hypothesis**: Camera stream was created but then stopped  
**Test**: Check if stream tracks are active  
**Priority**: MEDIUM  
**Status**: ⏳ TO TEST

#### RC-4.3: Wrong camera selected
**Hypothesis**: AR.js using front camera instead of back camera  
**Test**: Check `facingMode` constraint  
**Priority**: LOW  
**Status**: ⏳ TO TEST

---

### **Category 5: CSS/Layout Issues**

#### RC-5.1: Video behind other elements
**Hypothesis**: Video has lower z-index than black overlay  
**Test**: Check z-index stacking context  
**Priority**: HIGH  
**Status**: ⏳ TO TEST

#### RC-5.2: Video clipped by parent
**Hypothesis**: Parent container has `overflow: hidden`  
**Test**: Check parent element styles  
**Priority**: MEDIUM  
**Status**: ⏳ TO TEST

#### RC-5.3: Video has black background
**Hypothesis**: Video element or parent has `background: black`  
**Test**: Check background styles  
**Priority**: LOW  
**Status**: ⏳ TO TEST

---

### **Category 6: iOS-Specific Issues**

#### RC-6.1: iOS requires playsinline
**Hypothesis**: Video needs `playsinline` attribute on iOS  
**Test**: Check if video has `playsinline` attribute  
**Priority**: HIGH  
**Status**: ⏳ TO TEST (need to check video attributes)

#### RC-6.2: iOS autoplay policy blocking
**Hypothesis**: iOS blocking autoplay without user gesture  
**Test**: Try playing video after user tap  
**Priority**: HIGH  
**Status**: ⏳ TO TEST

#### RC-6.3: iOS WebGL context issue
**Hypothesis**: A-Frame WebGL context not created on iOS  
**Test**: Check if canvas has WebGL context  
**Priority**: MEDIUM  
**Status**: ⏳ TO TEST

---

## 🔧 Fix Strategy

### **Phase 1: Diagnostic (Gather Info)**
1. Add debug overlay showing:
   - Video element exists: Yes/No
   - Video dimensions: W×H
   - Video readyState: 0-4
   - Video srcObject: null/MediaStream
   - AR.js initialized: Yes/No
   - Scene loaded: Yes/No

### **Phase 2: Quick Wins (High Priority, Easy Fixes)**
1. RC-1.4: Ensure video srcObject is set
2. RC-2.2: Call video.play() explicitly
3. RC-6.1: Add playsinline attribute
4. RC-6.2: Trigger play on user gesture

### **Phase 3: Systematic Fixes (If Phase 2 Doesn't Work)**
1. RC-2.1: Force AR.js initialization
2. RC-3.1: Fix scene visibility
3. RC-5.1: Fix z-index stacking
4. RC-1.2: Unhide video element

### **Phase 4: Nuclear Options (Last Resort)**
1. Replace AR.js with manual getUserMedia + Three.js
2. Use different AR library (8th Wall, WebXR)
3. Build custom camera component

---

## 📝 Test Plan

### Test 1: Video Element Diagnostic
```javascript
const video = document.querySelector('video');
console.log('Video exists:', !!video);
if (video) {
  console.log('Video dimensions:', video.videoWidth, 'x', video.videoHeight);
  console.log('Video readyState:', video.readyState);
  console.log('Video srcObject:', video.srcObject);
  console.log('Video paused:', video.paused);
  console.log('Video style:', window.getComputedStyle(video));
}
```

### Test 2: AR.js System Check
```javascript
const scene = document.querySelector('a-scene');
console.log('Scene exists:', !!scene);
console.log('Scene loaded:', scene.hasLoaded);
console.log('AR.js system:', scene.systems['arjs']);
```

### Test 3: Manual Video Play
```javascript
const video = document.querySelector('video');
if (video) {
  video.play().then(() => {
    console.log('Video playing');
  }).catch(err => {
    console.error('Video play failed:', err);
  });
}
```

---

## 🎯 Action Items

1. [ ] Add diagnostic overlay to show video status
2. [ ] Test each root cause systematically
3. [ ] Apply fixes one at a time
4. [ ] Verify each fix before moving to next
5. [ ] Document what worked

---

**Next Step**: ~~Implement Phase 1 diagnostic overlay to gather information.~~ ✅ DONE

---

## 🎯 DIAGNOSTIC RESULTS

### **From Field Test Screenshot:**

```
✅ Video exists
Size: 0×0          ← ⚠️ PROBLEM #1: Video dimensions are 0×0
Ready: 0/4         ← ⚠️ PROBLEM #2: Video not ready (should be 4/4)
SrcObj: Yes        ← ✅ Good: MediaStream attached
Paused: Yes        ← ⚠️ PROBLEM #3: Video is paused (should be playing)
Display: inline    ← ✅ Good: Video is visible
Visibility: visible ← ✅ Good: Not hidden
Opacity: 1         ← ✅ Good: Fully opaque
Z-index: auto      ← ✅ Good: Normal stacking
✅ Scene exists
Loaded: Yes        ← ✅ Good: A-Frame loaded
AR.js: Yes         ← ✅ Good: AR.js initialized
✅ Canvas exists
Canvas Size: 0×0   ← ⚠️ PROBLEM #4: Canvas also 0×0
```

### **Root Cause Analysis:**

**PRIMARY ISSUE**: Video is **paused** and has **0×0 dimensions**

**Why this happens:**
1. AR.js creates video element ✅
2. AR.js attaches MediaStream to video.srcObject ✅
3. AR.js does NOT call video.play() ❌
4. Video stays paused, never loads frames
5. Video dimensions stay 0×0 (no frames = no size)
6. Canvas copies from 0×0 video = black screen

**Secondary Issues:**
- `readyState: 0/4` - Video hasn't loaded metadata yet (because it's paused)
- Canvas `0×0` - Canvas mirrors video dimensions

### **Solution:**

**FIX #1: Force video.play() after permissions granted**
- Explicitly call `video.play()` after AR.js initializes
- Add `playsinline` attribute for iOS
- Add `autoplay` attribute
- Add `muted` attribute (required for autoplay on iOS)

**FIX #2: Wait for video metadata before proceeding**
- Listen for `loadedmetadata` event
- Ensure video dimensions are set before rendering

**FIX #3: Add explicit video attributes to A-Frame scene**
- Set `videoTexture: true` (already done)
- Add iOS-specific attributes

---

## 🔧 IMPLEMENTING FIX #1

**Target**: RC-2.2 + RC-6.1 + RC-6.2

**Changes needed:**
1. Find video element after AR.js creates it
2. Add `playsinline`, `autoplay`, `muted` attributes
3. Call `video.play()` explicitly
4. Wait for `loadedmetadata` event
5. Verify video dimensions > 0

**Status**: ✅ IMPLEMENTED but revealed deeper issue

---

## 🎯 FIX #2: UNIFIED PERMISSION FLOW (Root Cause of "Stuck UI")

### **New Root Cause Identified:**

The camera black screen was **symptom**, not the root cause. The real issue:

**FRAGMENTED PERMISSION FLOW** → Permissions requested at different times → Sensors never initialize → UI never transitions → **Stuck on single screen**

### **Problems with Original Flow:**

1. ❌ **Permissions split across multiple places**
   - Camera requested in one place
   - Location requested elsewhere
   - Motion requested (maybe) after app starts
   
2. ❌ **No state machine**
   - No clear "current state" tracking
   - No transition logic
   - UI routing is ad-hoc
   
3. ❌ **iOS Motion Permission Timing**
   - Must be called from user gesture
   - Was being called too late (after app init)
   - Sensors stay null, UI never updates

4. ❌ **No recovery path**
   - If any permission fails, app is stuck
   - No way to retry
   - No demo mode fallback

### **FIX #2 Implementation:**

**Created:**
- `app-unified.js` - Complete rewrite with FSM
- `index-unified.html` - New start gate UI

**Key Features:**
1. ✅ **Finite State Machine (FSM)**
   - `INIT → PERMISSION_GATE → REQUESTING_PERMS → READY → RUNNING`
   - Clear state transitions
   - No ambiguous states

2. ✅ **Unified Permission Manager**
   - Single `Permissions.requestAll()` call
   - Requests Camera + Location + Motion in sequence
   - Real-time progress checklist
   - Returns detailed results

3. ✅ **Screen Router**
   - `UI.route(state)` controls visibility
   - Start screen: INIT, PERMISSION_GATE, REQUESTING_PERMS, ERROR
   - AR screen: READY, RUNNING
   - **Impossible to get stuck on one screen**

4. ✅ **iOS Motion Permission Fix**
   - Called from button click (user gesture)
   - Proper timing in permission sequence
   - Fallback for non-iOS devices

5. ✅ **Demo Mode**
   - Works without any sensors
   - Fixed position (West Kowloon Freespace)
   - Fixed heading (120° facing harbour)
   - Allows testing without permissions

6. ✅ **Error Recovery**
   - Clear error messages
   - Retry button
   - Demo mode as fallback

### **Testing FIX #2:**

**URL**: Will deploy `index-unified.html` as new entry point

**Expected Flow:**
1. User sees Start screen with permission checklist
2. User taps "Enable Camera, Location & Motion"
3. Checklist items tick ✅ as each permission is granted
4. State banner shows progress: `REQUESTING_PERMS → READY → RUNNING`
5. AR screen automatically appears
6. Camera feed visible, IMU/GPS data updating

**If Permissions Denied:**
1. Error state with clear message
2. Retry button appears
3. Demo Mode button available as fallback

