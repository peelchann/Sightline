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
**Status**: ⏳ TO TEST

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
**Status**: ⏳ TO TEST

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
**Status**: ⏳ TO TEST

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

**Next Step**: Implement Phase 1 diagnostic overlay to gather information.

