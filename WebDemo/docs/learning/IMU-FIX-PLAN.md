# IMU Heading Fix Plan — Real-Time Bearings & Non-Overlapping Labels

## Field Test Issues (Priority Order)

### 🚨 Critical
1. **IMU heading not reflected in UI** → indicators feel "stuck"
2. **Landmark indicators don't switch sides** → sometimes always point right
3. **Live distance/azimuth not refreshing** → feels static

### ⚠️ High
4. **Labels overlap** → cards on top of each other, readability suffers

## Root Causes

### 1. Heading Not Reflected
**Problem**: `OrientationManager` updates heading internally but doesn't drive UI transforms in real-time.

**Fix**:
- Add continuous update loop (20 FPS = 50ms interval)
- On every tick: read smoothed heading → compute bearing to each POI → update transforms
- Show heading in HUD readout (e.g., "105° ENE")

### 2. Indicators Don't Switch Sides
**Problem**: Bearing calculation doesn't account for which side of FOV the POI is on.

**Fix**:
- Compute angular difference: `Δ° = (poiBearing - userHeading + 360) % 360`
- If `Δ° > 180`: POI is on left (normalize to negative: `Δ° -= 360`)
- Position indicator:
  - `Δ° < -30°`: left edge arrow
  - `-30° ≤ Δ° ≤ -5°`: left card (sliding in)
  - `-5° ≤ Δ° ≤ 5°`: center-lock card
  - `5° ≤ Δ° ≤ 30°`: right card (sliding in)
  - `Δ° > 30°`: right edge arrow

### 3. Live Distance Not Refreshing
**Problem**: Distance calculated once on entity creation, not updated continuously.

**Fix**:
- Add `updateDistancesAndBearings()` function (100ms interval)
- Re-compute distance & bearing for all visible POIs
- Update text only if changed by ≥1m (to reduce DOM writes)
- Use `element.setAttribute('value', ...)` for A-Frame text components

### 4. Labels Overlap
**Problem**: All labels render at same depth; no collision detection.

**Fix**:
- **Label Layout Engine** (runs 2x/sec):
  1. Sort POIs by priority: distance (closer first) + category weight
  2. For each label, check if its bounding box overlaps any already-placed label
  3. If collision: try vertical offset (+20px, -20px); if still colliding, hide
  4. Cap visible labels per frame: max 5 on-screen
  5. Use CSS `transform: translateY(...)` for offsets (GPU-accelerated)

## Implementation Steps

### Step 1: Fix OrientationManager Smoothing
```javascript
// Add to OrientationManager
const SMOOTHING_ALPHA = 0.15;

updateHeading(rawHeading) {
  let delta = rawHeading - this.currentHeading;
  
  // Wrap-around fix: if crossing 0°/360° boundary
  if (Math.abs(delta) > 180) {
    if (delta > 0) delta -= 360;
    else delta += 360;
  }
  
  // Exponential moving average
  this.smoothedHeading = this.currentHeading + delta * SMOOTHING_ALPHA;
  
  // Normalize to [0, 360)
  this.smoothedHeading = (this.smoothedHeading + 360) % 360;
  
  this.currentHeading = this.smoothedHeading;
  this.headingHistory.push(this.smoothedHeading);
  if (this.headingHistory.length > this.maxHistorySize) {
    this.headingHistory.shift();
  }
  
  // Trigger UI update
  if (this.onHeadingChange) {
    this.onHeadingChange(this.smoothedHeading);
  }
}
```

### Step 2: Bearing-Aware Positioning
```javascript
function computePOIPosition(poi, userPos, userHeading) {
  const bearing = calculateBearing(userPos.lat, userPos.lng, poi.lat, poi.lng);
  const distance = calculateDistance(userPos.lat, userPos.lng, poi.lat, poi.lng);
  
  // Angular difference (wrapping-aware)
  let delta = (bearing - userHeading + 360) % 360;
  if (delta > 180) delta -= 360;
  
  // Determine zone
  let zone, x, y, z;
  if (Math.abs(delta) <= 5) {
    zone = 'center';
    x = 0;
    y = 1.6; // eye level
    z = -3; // 3m ahead
  } else if (delta < -30) {
    zone = 'left-far';
    x = -5;
    y = 1.6;
    z = -2;
  } else if (delta < -5) {
    zone = 'left-near';
    x = -2;
    y = 1.6;
    z = -3;
  } else if (delta > 30) {
    zone = 'right-far';
    x = 5;
    y = 1.6;
    z = -2;
  } else {
    zone = 'right-near';
    x = 2;
    y = 1.6;
    z = -3;
  }
  
  return { x, y, z, zone, bearing, delta, distance };
}
```

### Step 3: Continuous Update Loops
```javascript
function init() {
  // ... existing init code ...
  
  // Heading loop: 20 FPS (50ms)
  setInterval(() => {
    const heading = OrientationManager.getHeading();
    updateHeadingDisplay(heading);
    updateAllPOIPositions(heading);
  }, 50);
  
  // Distance loop: 10 FPS (100ms)
  setInterval(() => {
    updateDistancesAndBearings();
  }, 100);
  
  // Layout loop: 2 FPS (500ms)
  setInterval(() => {
    runLabelLayoutEngine();
  }, 500);
}

function updateAllPOIPositions(userHeading) {
  const userPos = DemoController.getCurrentPosition();
  if (!userPos) return;
  
  POIS.forEach(poi => {
    const entity = poiEntities.get(poi.id);
    if (!entity) return;
    
    const pos = computePOIPosition(poi, userPos, userHeading);
    
    // Update position with CSS transform (no re-layout)
    entity.setAttribute('position', `${pos.x} ${pos.y} ${pos.z}`);
    
    // Update zone class for styling
    entity.setAttribute('class', `poi-card zone-${pos.zone}`);
  });
}
```

### Step 4: Label Layout Engine
```javascript
const LabelLayoutEngine = {
  visibleLabels: [],
  maxLabels: 5,
  
  run(allPOIs, userPos, userHeading) {
    // 1. Filter to in-FOV POIs
    const candidates = allPOIs
      .map(poi => {
        const bearing = calculateBearing(userPos.lat, userPos.lng, poi.lat, poi.lng);
        const distance = calculateDistance(userPos.lat, userPos.lng, poi.lat, poi.lng);
        let delta = (bearing - userHeading + 360) % 360;
        if (delta > 180) delta -= 360;
        
        return { poi, bearing, distance, delta, inFOV: Math.abs(delta) <= 30 };
      })
      .filter(p => p.inFOV);
    
    // 2. Sort by priority: center-locked first, then by distance
    candidates.sort((a, b) => {
      const aCentered = Math.abs(a.delta) <= 5 ? 1 : 0;
      const bCentered = Math.abs(b.delta) <= 5 ? 1 : 0;
      if (aCentered !== bCentered) return bCentered - aCentered;
      return a.distance - b.distance;
    });
    
    // 3. Place labels with collision detection
    const placed = [];
    const boxes = [];
    
    for (const candidate of candidates) {
      if (placed.length >= this.maxLabels) break;
      
      const entity = poiEntities.get(candidate.poi.id);
      if (!entity) continue;
      
      const baseBox = this.getScreenBoundingBox(entity);
      let finalBox = baseBox;
      let offset = 0;
      
      // Try base position, then ±20px, ±40px
      for (const tryOffset of [0, 20, -20, 40, -40]) {
        const testBox = { ...baseBox, y: baseBox.y + tryOffset };
        if (!this.overlapsAny(testBox, boxes)) {
          finalBox = testBox;
          offset = tryOffset;
          break;
        }
      }
      
      // If still colliding after all offsets, skip
      if (offset === 0 && this.overlapsAny(finalBox, boxes) && boxes.length > 0) {
        entity.setAttribute('visible', false);
        continue;
      }
      
      // Place
      entity.setAttribute('visible', true);
      if (offset !== 0) {
        const card = entity.querySelector('.card-container');
        if (card) card.setAttribute('position', `0 ${offset * 0.01} 0`);
      }
      
      placed.push(candidate);
      boxes.push(finalBox);
    }
    
    this.visibleLabels = placed;
  },
  
  getScreenBoundingBox(entity) {
    // Simplified: use entity position + fixed size estimate
    const pos = entity.getAttribute('position');
    return {
      x: pos.x - 0.5,
      y: pos.y - 0.3,
      width: 1.0,
      height: 0.6
    };
  },
  
  overlapsAny(box, others) {
    return others.some(other => this.boxesOverlap(box, other));
  },
  
  boxesOverlap(a, b) {
    return !(
      a.x + a.width < b.x ||
      b.x + b.width < a.x ||
      a.y + a.height < b.y ||
      b.y + b.height < a.y
    );
  }
};
```

### Step 5: iOS Permission UI Enhancement
```html
<!-- In index.html -->
<div id="motion-permission-overlay" class="permission-overlay hidden">
  <div class="permission-card">
    <h2>🧭 Motion & Orientation</h2>
    <p>Sightline needs access to your device's compass and gyroscope to show anchors where you look.</p>
    <button id="motion-permission-btn" class="btn-primary full-width">
      Enable Motion & Orientation
    </button>
  </div>
</div>
```

```css
/* In styles.css */
.permission-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.permission-card {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  max-width: 400px;
  margin: 1rem;
}

.btn-primary.full-width {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
}
```

## Performance Targets

- **Frame rate**: 60 FPS (16.67ms budget per frame)
- **Heading update**: 20 FPS (50ms) ← smoothing reduces jitter
- **Distance update**: 10 FPS (100ms)
- **Layout engine**: 2 FPS (500ms) ← expensive, run rarely
- **DOM writes**: Batch; use `requestAnimationFrame` for transforms

## Testing Checklist

### Desktop (Chrome DevTools Sensors)
- [ ] Simulate orientation changes → heading display updates
- [ ] Simulate lat/lng changes → distances update
- [ ] Multiple POIs in FOV → no overlaps

### iPhone (Field Test)
- [ ] Motion permission button appears
- [ ] After granting, heading reacts to phone rotation
- [ ] Turning left/right: indicators switch sides
- [ ] Center-lock: card anchors when aligned
- [ ] Off-FOV: edge arrows point correctly
- [ ] No overlapping labels (max 5 visible)

## Success Criteria

1. ✅ Heading HUD shows live degrees (e.g., "105° E")
2. ✅ Rotating phone left → labels slide right (relative motion correct)
3. ✅ Center-aligned POI (±5°) → card anchors at center
4. ✅ Distance updates live (visible change every ~1s if moving)
5. ✅ No more than 5 labels on screen; no overlaps
6. ✅ Smooth 60fps; no jank

## Deployment

After implementation:
1. Test locally: `npm run dev` or open `index.html` in browser
2. Test on iPhone via Vercel preview
3. If all checks pass, deploy to production
4. Update `WebDemo/DEPLOYED.md` with new build timestamp
5. Post field test video/GIF to CCMF application

---

**Next**: Implement Step 1 (OrientationManager smoothing fix) → verify → Step 2 → ...

