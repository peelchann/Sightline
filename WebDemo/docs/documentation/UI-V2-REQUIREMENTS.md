# Sightline WebAR UI V2 - Engineering Requirements

## 🎯 Objective
Transform the current single-card AR UI into a **3-tier, state-driven system** with progressive disclosure and collision avoidance.

---

## 📐 Design System Tokens

```css
/* Colors */
--sightline-bg-card: rgba(250, 250, 250, 0.95);
--sightline-bg-chip: rgba(255, 255, 255, 0.85);
--sightline-bg-arrow: rgba(0, 0, 0, 0.7);
--sightline-text-primary: #111;
--sightline-text-secondary: #555;
--sightline-text-distance: #007AFF;
--sightline-leader-line: #222;
--sightline-shadow: rgba(0, 0, 0, 0.15);

/* Category Colors */
--category-landmark: #FF6B35;
--category-museum: #6B4FBB;
--category-transport: #007AFF;
--category-nature: #34C759;

/* Spacing */
--space-xs: 4px;
--space-sm: 8px;
--space-md: 12px;
--space-lg: 16px;
--space-xl: 24px;

/* Typography */
--font-title: 18px / 1.2 -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
--font-body: 14px / 1.4 -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
--font-caption: 11px / 1.3 -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;

/* Timing */
--duration-fast: 150ms;
--duration-base: 200ms;
--duration-slow: 300ms;
--easing-standard: cubic-bezier(0.4, 0.0, 0.2, 1);
```

---

## 🏗️ Component Specifications

### **1. Center-Lock Card (Tier 1)**

**When to Show**: `|heading - bearing| ≤ 5°`

**Visual Spec**:
- **Dimensions**: 280px × 160px
- **Position**: Screen center (x: 50%, y: 40%)
- **Background**: `var(--sightline-bg-card)` with `backdrop-filter: blur(12px)`
- **Border**: 1px solid `rgba(0, 0, 0, 0.08)`, 12px radius
- **Shadow**: `0 8px 24px var(--sightline-shadow)`
- **Z-index**: 100

**Content Layout**:
```
┌─────────────────────────────────────┐
│ [Icon]  TITLE (18px bold)      [⭐] │  ← 44px tap target
│         Max 2 lines, ellipsis       │
│                                     │
│ Context line (14px, #555)          │
│ Max 1 line, ellipsis               │
│                                     │
│                    [Distance Badge] │  ← "2.1 km" pill
│                                     │
│ [Leader Line: 2px #222 → end-dot]  │
└─────────────────────────────────────┘
```

**Leader Line**:
- A-Frame `<a-entity line>` component
- Start: Card bottom-center
- End: POI azimuth (screen-projected bearing)
- Stroke: 2px solid `#222`
- End marker: 6px circle dot

**Animation**:
- Entry: Slide from side (based on bearing) + fade (0 → 1 opacity), 200ms
- Exit: Fade out (1 → 0 opacity), 150ms
- Snap: Subtle scale (0.95 → 1.0) when entering center-lock
- Haptic: Single tap (if `navigator.vibrate` supported)

---

### **2. Side Chip (Tier 2)**

**When to Show**: `5° < |heading - bearing| ≤ 30°`

**Visual Spec**:
- **Dimensions**: 120px × 48px
- **Position**: 
  - X: 15% (left) or 85% (right), based on `sign(bearing - heading)`
  - Y: Dynamic (collision-aware, see Layout Engine)
- **Background**: `var(--sightline-bg-chip)`
- **Border**: 1px solid `rgba(0, 0, 0, 0.06)`, 8px radius
- **Shadow**: `0 4px 12px rgba(0, 0, 0, 0.1)`
- **Z-index**: 90

**Content Layout**:
```
┌──────────────────────┐
│ [Icon] Name (12px)   │  ← Category-colored icon (24px)
│        123m (11px)   │  ← Distance, #007AFF
└──────────────────────┘
```

**Leader Line**:
- 1px dashed `#666`
- Start: Chip edge (toward center)
- End: POI azimuth

**Animation**:
- Entry: Fade in + slide from edge, 200ms
- Exit: Fade out, 150ms
- Hover (touch): Scale 1.05, 100ms
- Active (tap): Scale 0.98, 100ms

**Interaction**:
- Tap → Rotate camera to center this POI (animate heading to bearing)

---

### **3. Edge Arrow (Tier 3)**

**When to Show**: `30° < |heading - bearing| ≤ 90°`

**Visual Spec**:
- **Dimensions**: 80px × 32px
- **Position**: 
  - X: 16px (left) or `calc(100% - 96px)` (right)
  - Y: 50% (vertically centered)
- **Background**: `var(--sightline-bg-arrow)`
- **Border**: None
- **Border-radius**: 16px (pill shape)
- **Z-index**: 80

**Content Layout**:
```
┌──────────────┐
│ ← IFC 2.1km  │  ← 16px chevron + name + distance
└──────────────┘
```

**Text**:
- Color: `#FFF`
- Font: 11px medium
- Truncate name if >8 chars (e.g., "Hong K… 1.2km")

**Animation**:
- Pulse: Opacity 0.7 → 1.0, 1s infinite ease-in-out
- Entry: Fade in, 150ms
- Exit: Fade out, 100ms

**Interaction**:
- Tap → Rotate camera toward POI (same as side chip)

---

### **4. Mini-Map (Optional, V2)**

**Status**: Stubbed out for V1

**Placeholder**:
```html
<!-- TODO: Mini-map V2 - Optional toggle in settings -->
<div id="mini-map" style="display: none;">
  <!-- 100×100px circular map, top-right inset -->
</div>
```

---

## 🎭 State Machine

### **POI Visibility States**

| State | Condition | UI Component | Priority |
|-------|-----------|--------------|----------|
| **HIDDEN** | `|Δ°| > 90°` | None | - |
| **OFF_FOV** | `30° < |Δ°| ≤ 90°` | Edge Arrow | Low |
| **IN_FOV** | `5° < |Δ°| ≤ 30°` | Side Chip | Medium |
| **CENTER_LOCK** | `|Δ°| ≤ 5°` | Center Card | High |

**Where**: `Δ° = angularDiff(heading, bearing)`

### **Hysteresis (Prevent Flicker)**

- **Lock threshold**: 5°
- **Unlock threshold**: 7°

**Logic**:
```javascript
if (state === 'CENTER_LOCK') {
  if (delta > 7) state = 'IN_FOV'; // Unlock with hysteresis
} else {
  if (delta <= 5) state = 'CENTER_LOCK'; // Lock
}
```

### **Transition Rules**

```
HIDDEN ←→ OFF_FOV ←→ IN_FOV ←→ CENTER_LOCK
   ↑                                  ↓
   └──────────── (turn 180°) ─────────┘
```

---

## 🧩 Layout Engine (Collision Avoidance)

### **Algorithm (Greedy, Priority-Based)**

1. **Collect Candidates**:
   - Center-lock: 1 max (highest priority)
   - Side chips: 2 max (nearest distance first)
   - Edge arrows: 3 max (nearest distance first)

2. **Sort by Priority**:
   - `CENTER_LOCK > IN_FOV (near) > OFF_FOV (near)`

3. **Place Iteratively**:
   - For each candidate, compute desired screen rect `(x, y, w, h)`
   - Check collision against already-placed rects (2D AABB)
   - If collision:
     - Try vertical nudge: ±8px, ±16px, ±24px (max 3 tries)
     - If still colliding, drop this candidate
   - If no collision, add to placed list

4. **Render**:
   - Apply CSS transforms (no layout recalc)
   - Update text only if value changed (distance ≥10m, heading ≥1°)

### **Collision Detection (2D AABB)**

```javascript
function rectsCollide(a, b) {
  return !(a.right < b.left || 
           a.left > b.right || 
           a.bottom < b.top || 
           a.top > b.bottom);
}
```

---

## 🎨 Category System

### **POI Categories**

| Category | Icon | Color | Example POIs |
|----------|------|-------|--------------|
| Landmark | 🏛️ | `#FF6B35` | Clock Tower, IFC, ICC |
| Museum | 🎨 | `#6B4FBB` | M+, Palace Museum, Xiqu |
| Transport | ⛴️ | `#007AFF` | Star Ferry, MTR |
| Nature | 🌳 | `#34C759` | Victoria Harbour, Parks |

### **Icon Format**

- **Type**: Inline SVG (24×24px for chips, 32×32px for center card)
- **Style**: Monochrome, 2px stroke, category-colored fill
- **Accessibility**: `<title>` tag for screen readers

**Example**:
```html
<svg width="24" height="24" viewBox="0 0 24 24" aria-labelledby="icon-landmark">
  <title id="icon-landmark">Landmark</title>
  <path fill="#FF6B35" d="M12 2L2 7v10l10 5 10-5V7L12 2z"/>
</svg>
```

---

## 🏃 Performance Requirements

### **Targets**

- **Frame Rate**: ≥50 FPS on iPhone 12 (tested via Xcode Instruments)
- **Transition Latency**: <250ms (heading change → UI update)
- **Bundle Size**: <50KB for new UI components (gzipped)
- **Memory**: <10MB additional heap usage

### **Optimization Strategies**

1. **CSS Transforms**: Use `translate3d()` for motion (GPU-accelerated)
2. **Throttle Text Updates**: Only update DOM when value changes meaningfully
3. **RequestAnimationFrame**: Batch all DOM writes in single RAF callback
4. **Inline Critical CSS**: Design tokens + center-lock card in `<head>`
5. **Defer Non-Critical**: Side chip + edge arrow styles in separate `<link>`

---

## ♿ Accessibility

### **WCAG AAA Compliance**

- **Contrast Ratios**:
  - Body text: 12:1 (primary on card background)
  - Secondary text: 7:1 (distance on card background)
  - Edge arrows: 7:1 (white on dark background)
- **Tap Targets**: 44×44px minimum (Save button, chip tap area)
- **Motion**: Respect `prefers-reduced-motion` (disable animations)
- **Screen Readers**: ARIA labels on all interactive elements

**Example**:
```html
<button class="save-button" aria-label="Save Clock Tower to favorites">
  <svg>...</svg>
</button>
```

---

## 🧪 User Stories & Acceptance Criteria

### **US-1: Center-Lock Card**
**As a user, I want to see detailed information only for the landmark I'm directly facing.**

**AC**:
- [ ] When `|heading - bearing| ≤ 5°`, center-lock card appears
- [ ] Card shows: title, context, distance, Save button, leader line
- [ ] Transition is smooth (200ms) with subtle scale animation
- [ ] Haptic feedback on iOS (if supported)

---

### **US-2: Side Chips**
**As a user, I want subtle hints for nearby landmarks in my peripheral vision.**

**AC**:
- [ ] When `5° < |heading - bearing| ≤ 30°`, side chip appears
- [ ] Chip shows: category icon, name, distance
- [ ] Positioned left/right based on bearing direction
- [ ] Max 2 chips visible simultaneously
- [ ] Tapping chip rotates camera to center that POI

---

### **US-3: Edge Arrows**
**As a user, I want to know about landmarks off-screen so I can turn to explore them.**

**AC**:
- [ ] When `30° < |heading - bearing| ≤ 90°`, edge arrow appears
- [ ] Arrow shows: direction chevron, name, distance
- [ ] Positioned at screen edge (left/right)
- [ ] Max 3 arrows visible simultaneously
- [ ] Pulse animation (opacity 0.7 → 1.0)

---

### **US-4: Smooth Transitions**
**As a user, I want smooth transitions when I turn my head.**

**AC**:
- [ ] All state changes animate with 200ms easing
- [ ] No flicker or jank (hysteresis prevents rapid toggling)
- [ ] FPS ≥ 50 during transitions
- [ ] Transitions respect `prefers-reduced-motion`

---

### **US-5: No Label Overlap**
**As a user, I want labels to never overlap so I can always read them.**

**AC**:
- [ ] Layout engine prevents 2D AABB collisions
- [ ] Max 1 center + 2 side + 3 edge visible simultaneously
- [ ] If collision unavoidable, lower-priority item is hidden
- [ ] Vertical nudging (±8px increments) attempts to resolve collisions

---

## 📂 File Structure

```
/WebDemo/
├── ui-state-manager.js       ← NEW: State machine (HIDDEN/OFF_FOV/IN_FOV/CENTER_LOCK)
├── ui-components.js          ← NEW: CenterLockCard, SideChip, EdgeArrow classes
├── ui-layout-engine.js       ← NEW: 3-tier collision detection
├── styles-ui-v2.css          ← NEW: Design tokens + component styles
├── app-enhanced-imu.js       ← UPDATED: Integrate UIStateManager
├── index.html                ← UPDATED: Add UI layers, inline critical CSS
└── README.md                 ← UPDATED: Document UI state machine
```

---

## 🚀 Implementation Checklist

### **Phase 1: Design Tokens & Base Styles** (1 hour)
- [ ] Create `styles-ui-v2.css` with CSS variables
- [ ] Inline critical CSS in `index.html` `<head>`
- [ ] Add category icon SVGs (inline in HTML)

### **Phase 2: Component Classes** (2 hours)
- [ ] Implement `CenterLockCard` class
  - [ ] Render method (HTML structure)
  - [ ] Update method (text, position)
  - [ ] Leader line (A-Frame `<a-entity line>`)
  - [ ] Save button event handler
- [ ] Implement `SideChip` class
  - [ ] Render method
  - [ ] Update method
  - [ ] Tap-to-center event handler
- [ ] Implement `EdgeArrow` class
  - [ ] Render method
  - [ ] Pulse animation
  - [ ] Tap-to-turn event handler

### **Phase 3: State Machine** (1.5 hours)
- [ ] Create `UIStateManager` class
  - [ ] `computeState(delta)` with hysteresis
  - [ ] `transitionTo(newState)` with animations
  - [ ] Priority sorting (center > side > edge)
- [ ] Integrate with `OrientationManagerV2` (heading updates)
- [ ] Integrate with `PerformanceManager` (update loops)

### **Phase 4: Layout Engine** (1.5 hours)
- [ ] Create `UILayoutEngine` class
  - [ ] `collectCandidates()` (max 1+2+3)
  - [ ] `checkCollision()` (2D AABB)
  - [ ] `nudgeVertical()` (±8px increments)
  - [ ] `applyTransforms()` (CSS translate3d)
- [ ] Integrate with `UIStateManager`

### **Phase 5: Integration & Testing** (2 hours)
- [ ] Update `app-enhanced-imu.js` to use new UI system
- [ ] Remove old single-card logic
- [ ] Test on desktop (Chrome DevTools Sensors)
- [ ] Test on iPhone (field test at WKCD)
- [ ] Verify FPS ≥ 50 (Xcode Instruments)
- [ ] Verify no overlaps (20 test scenarios)

### **Phase 6: Documentation & Deployment** (1 hour)
- [ ] Update `/WebDemo/README.md` with state machine diagram
- [ ] Add JSDoc comments to all new classes
- [ ] Deploy to Vercel
- [ ] Update `/WebDemo/DEPLOYED-V2.md` with new screenshots
- [ ] Post in project Slack/Discord

---

## 🎯 Success Metrics

- [ ] All 5 user stories pass QA
- [ ] FPS ≥ 50 on iPhone 12 (Xcode Instruments)
- [ ] No label overlaps in 20 field test scenarios
- [ ] Transition latency < 250ms (heading change → UI update)
- [ ] Lighthouse Accessibility score ≥ 95
- [ ] Bundle size < 50KB (gzipped)

---

## 🚫 Out of Scope (V1)

- ❌ Mini-map (stub only, implement in V2)
- ❌ "Learn More" button (no backend POI details yet)
- ❌ Multi-language support (English only for CCMF demo)
- ❌ Offline mode (requires service worker, V3)
- ❌ 3D occlusion (2D collision only for V1)
- ❌ Dark mode (light mode only)

---

## 📞 Questions?

If you encounter any blockers or need clarification:
1. Check this document first
2. Review UX Figma file (link in Slack)
3. Ask in #sightline-dev channel
4. Tag @PM or @UX-Designer

**You're cleared to start! 🚀**

