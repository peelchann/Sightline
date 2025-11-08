# 🎭 Sightline WebAR - Demo Mode & "Works Anywhere" Guide

## Overview

Sightline now supports **Demo Mode** - a simulated AR experience that works without GPS or even leaving your desk! Perfect for testing, demos, and CCMF presentations.

---

## 🚀 Quick Start

### Try Demo Mode Instantly

**Option 1: West Kowloon Freespace Preset (Recommended)**
```
https://sightline-webar.vercel.app?mode=demo&lat=22.3045&lng=114.1595&hdg=120
```
This simulates standing at WKCD Freespace Lawn, facing Victoria Harbour skyline.

**Option 2: TST Promenade (Clock Tower View)**
```
https://sightline-webar.vercel.app?mode=demo&lat=22.2948&lng=114.1712&hdg=300
```

**Option 3: Central Ferry Piers**
```
https://sightline-webar.vercel.app?mode=demo&lat=22.2858&lng=114.1590&hdg=90
```

---

## 📍 How Demo Mode Works

### Live GPS Mode vs Demo Mode

| Feature | Live GPS Mode | Demo Mode |
|---------|---------------|-----------|
| **Location Source** | Real GPS sensor | Simulated coordinates |
| **Requires Permissions** | Yes (Camera + GPS) | Optional (Camera for AR) |
| **Works Indoors** | ❌ Poor | ✅ Perfect |
| **Works on Desktop** | ❌ No GPS | ✅ Yes |
| **Field Testing** | Required | Not required |
| **Best For** | Final testing | Demos, development |

### What Gets Simulated

- ✅ **Latitude & Longitude** - Set your virtual position anywhere
- ✅ **Heading** - Direction you're facing (0-359°)
- ✅ **Distance Calculations** - All POIs calculated from sim position
- ✅ **AR Cards** - Positioned based on bearing & distance
- ⚠️ **Camera** - Real (if granted) or placeholder
- ⚠️ **Motion** - Manual heading adjustment (no auto-tracking)

---

## 🎮 Using the UI Controls

### Control Bar (Top)

```
┌─────────────────────────────────────┐
│ [○──────] Demo Mode  [Choose preset▾] │
│ [22.3045] [114.1595] [120°] [Apply]   │
└─────────────────────────────────────┘
```

### Mode Toggle
- **OFF (Gray)**: Live GPS mode - uses your real location
- **ON (Purple)**: Demo mode - simulated position

### Preset Picker
Choose from 3 pre-configured viewpoints:
- 🌊 **West Kowloon Freespace** - Best skyline view (IFC, ICC, Victoria Harbour)
- 🗼 **TST Promenade** - Clock Tower & Star Ferry area
- ⛴️ **Central Piers** - Central waterfront

### Manual Inputs
- **Lat**: Latitude (e.g., `22.3045`)
- **Lng**: Longitude (e.g., `114.1595`)
- **Hdg**: Heading in degrees (0-359)
  - 0° = North
  - 90° = East
  - 180° = South
  - 270° = West

### Apply Button
Applies manual coordinates immediately.

---

## 🏙️ New POIs & Skyline Landmarks

### All Available POIs (8 Total)

#### Original (3)
1. **Clock Tower** - 22.2946, 114.1699 | Landmark | Mid-range
2. **Star Ferry (TST)** - 22.2937, 114.1703 | Transport | Mid-range
3. **Avenue of Stars** - 22.2930, 114.1730 | Landmark | Mid-range

#### New Additions (5)
4. **IFC Tower** - 22.2855, 114.1588 | Landmark | **Far-field** 🏙️
5. **ICC** - 22.3069, 114.1617 | Landmark | **Far-field** 🏙️
6. **M+ Museum** - 22.3030, 114.1605 | Museum | Mid-range
7. **Xiqu Centre** - 22.3049, 114.1689 | Arts | Mid-range
8. **Star Ferry (Central)** - 22.2820, 114.1586 | Transport | Mid-range

### Far-Field Skyline Rendering

**What is it?**
POIs beyond 1000m get special "skyline" treatment:
- Larger AR cards (15x8 units vs 8x4)
- Elevated positioning (floating in sky)
- Distance shown in kilometers (e.g., "2.1 km")
- Distinct visual style

**Which POIs?**
- IFC Tower (412m tall)
- ICC (484m tall)

---

## 🎯 Recommended Test Scenarios

### Scenario 1: WKCD Freespace → Harbour View

**Setup:**
```
Lat: 22.3045
Lng: 114.1595
Heading: 120° (facing TST/IFC)
```

**Expected POIs in View:**
- IFC Tower (skyline, far) - ~2.5 km
- ICC (skyline, far) - ~500m
- M+ Museum (close) - ~300m
- Star Ferry TST (mid) - ~600m
- Clock Tower (mid) - ~400m

**Why This Works:**
Perfect sightline across Victoria Harbour, showcasing both close landmarks and distant skyline anchors.

---

### Scenario 2: TST Promenade → Central

**Setup:**
```
Lat: 22.2948
Lng: 114.1712
Heading: 300° (facing Central)
```

**Expected POIs:**
- Clock Tower (close) - ~80m
- Star Ferry TST (close) - ~130m
- IFC Tower (far) - ~2.1 km
- Star Ferry Central (mid) - ~1.5 km

---

### Scenario 3: Central Piers → Kowloon

**Setup:**
```
Lat: 22.2858
Lng: 114.1590
Heading: 90° (facing Kowloon)
```

**Expected POIs:**
- IFC Tower (close) - ~200m
- Star Ferry Central (close) - ~50m
- Clock Tower (far) - ~2.4 km
- ICC (far) - ~2.9 km

---

## 🎨 UX Enhancements

### 1. Onboarding Coach (3 Steps)

First-time users see a guided tutorial:

**Step 1:**
> "This is Sightline. Anchors appear on the skyline where you're looking."

**Step 2:**
> "Turn your head slowly—cards slide in when landmarks enter your field of view."

**Step 3:**
> "Tap ⭐ Save to keep anything you discover."

### 2. Ghost Hints (Off-Screen POIs)

When landmarks are nearby but outside your FOV:

```
← Clock Tower • 450m
→ IFC Tower • 2.1 km
```

Shows top 3 closest off-screen POIs with direction arrows.

### 3. Empty State

If no POIs in current view:

```
🔍 No landmarks in view
Turn toward the harbour or choose a Preset
```

### 4. POI Counter

Top-right indicator:
```
3 landmarks nearby
```

---

## 📱 URL Parameters

### Full Syntax
```
https://sightline-webar.vercel.app?mode={MODE}&lat={LAT}&lng={LNG}&hdg={HDG}
```

### Parameters

| Param | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `mode` | string | No | `live` or `demo` | `demo` |
| `lat` | float | If `mode=demo` | Latitude | `22.3045` |
| `lng` | float | If `mode=demo` | Longitude | `114.1595` |
| `hdg` | int | If `mode=demo` | Heading (0-359°) | `120` |

### Examples

**Demo at Clock Tower:**
```
?mode=demo&lat=22.2946&lng=114.1699&hdg=0
```

**Demo facing specific direction:**
```
?mode=demo&lat=22.3045&lng=114.1595&hdg=180
```

**Live GPS (default, no params needed):**
```
(no parameters)
```

---

## 🧪 Debug API

Open browser console and use `window.SightlineAR`:

### Methods

```javascript
// Get current position (live or simulated)
window.SightlineAR.getUserPosition()
// → {lat: 22.3045, lng: 114.1595, accuracy: 10}

// Get current heading
window.SightlineAR.getHeading()
// → 120

// Get current mode
window.SightlineAR.getMode()
// → "demo"

// Check if AR ready
window.SightlineAR.isARReady()
// → true

// Get nearby POI count
window.SightlineAR.getNearbyPOICount()
// → 5

// Get visible POIs
window.SightlineAR.getVisiblePOIs()
// → ["ifc", "clock-tower", "mplus"]

// Get all POIs
window.SightlineAR.getAllPOIs()
// → [{id: "clock-tower", ...}, {...}]

// Calculate distance to coordinates
window.SightlineAR.testDistance(22.2946, 114.1699)
// → 422.5 (meters)

// Programmatically set demo position
window.SightlineAR.setDemo(22.3045, 114.1595, 120)

// Load preset
window.SightlineAR.loadPreset('freespace')
// → {name: "West Kowloon Freespace", lat: 22.3045, ...}
```

---

## 🎥 Demo Video Recording Tips

### Best Practices

1. **Start with West Kowloon Preset**
   - Most impressive skyline view
   - Shows both near and far landmarks

2. **Show Mode Toggle**
   - Demonstrate switching between Live/Demo
   - Explain "works anywhere" value prop

3. **Pan Slowly**
   - Turn heading gradually (10° per second)
   - Let ghost hints appear
   - Show cards sliding into view

4. **Highlight POI Counter**
   - Point out "X landmarks nearby" updates
   - Explain distance calculations

5. **Showcase Variety**
   - Near landmarks (Clock Tower)
   - Mid-range (M+, Xiqu)
   - Far skyline (IFC, ICC)

### Suggested Script (90 seconds)

```
[0-15s] "Sightline brings augmented reality to Hong Kong's heritage sites. 
        Watch as I point my phone at the Victoria Harbour skyline..."

[15-30s] [Pan across harbour, POIs appear]
        "AR cards appear automatically as landmarks enter view. 
        Each shows name, year, distance, and description."

[30-45s] [Switch to Demo Mode]
        "Here's the game-changer: Demo Mode. I can preview the experience 
        from anywhere—even my desk—without GPS."

[45-60s] [Select preset, show multiple POIs]
        "Choose from presets like West Kowloon Freespace, where you see 
        everything from IFC Tower to Clock Tower in one panoramic view."

[60-75s] [Show ghost hints, empty state]
        "The UI guides you: arrows show off-screen landmarks, and 
        distance updates in real-time as you move."

[75-90s] "From indoor museums to outdoor skylines, Sightline makes 
        heritage discovery effortless. Try it now at [URL]."
```

---

## 🐛 Troubleshooting Demo Mode

### Demo Mode Not Activating

**Symptoms:**
- Toggle switch doesn't work
- URL params ignored

**Solutions:**
1. Check URL syntax (no typos in `mode=demo`)
2. Clear browser cache and reload
3. Try manual toggle instead of URL params

---

### POIs Not Appearing

**Symptoms:**
- Empty scene
- "No landmarks in view"

**Check:**
1. **Position**: Are you within 5000m of any POI?
   ```javascript
   window.SightlineAR.getNearbyPOICount()
   ```
2. **Heading**: Are you facing the right direction?
   - Use ghost hints to find POIs
   - Rotate heading 360° to scan
3. **Console Errors**: Open DevTools → Console

---

### Distance Calculations Wrong

**Symptoms:**
- POI shows "10km" when should be "100m"

**Solutions:**
1. Verify lat/lng format (decimal degrees, not DMS)
2. Check heading is 0-359°
3. Reload page to reset calculations

---

## 📊 Comparison: Live vs Demo Mode

### When to Use Live GPS Mode

✅ **Field Testing**
- Actual Clock Tower visit
- User testing at real locations
- GPS accuracy validation
- Demo video at real site

✅ **Final Product**
- Public release
- Exhibition/event
- Tourism use case

### When to Use Demo Mode

✅ **Development**
- Testing features
- Debugging POI positioning
- Iterating on UI

✅ **Presentations**
- Investor pitches
- CCMF application video
- Stakeholder demos
- Press previews

✅ **User Research**
- Mockup validation
- Concept testing
- Usability studies
- A/B testing

---

## 🎓 Educational Use Cases

### Teaching Tool

Demo Mode makes Sightline ideal for:

1. **Classroom Demos**
   - No need to visit sites
   - Consistent, repeatable experience
   - Works on projector/big screen

2. **Virtual Field Trips**
   - Explore Victoria Harbour from school
   - Compare different viewpoints (TST vs Central)
   - Learn about landmarks' history

3. **AR Development Workshops**
   - Show how GPS AR works
   - Explain bearing/distance calculations
   - Demonstrate FOV filtering

---

## 🚀 Next Steps

### For Developers

1. **Add More Presets**
   - Edit `PRESETS` object in `app.js`
   - Add dropdown option in HTML
   - Test bearing/heading alignment

2. **Customize POI Data**
   - Edit `POIS` array in `app.js`
   - Add categories, ranges, elevation
   - Update AR card templates in HTML

3. **Enhance UI**
   - Add category filters
   - Implement screenshot button
   - Create mini-map overlay

### For CCMF Application

1. **Record Demo Video**
   - Use West Kowloon preset
   - Show 6-8 different POIs
   - Highlight "works anywhere" feature
   - Keep under 90 seconds

2. **User Testing**
   - Share demo mode URL
   - Collect feedback remotely
   - No need for field visits
   - Get 10-15 testers in 1 day

3. **Stakeholder Previews**
   - Send preset URL to partners
   - Clock Tower management
   - LCSD officials
   - Tourism board

---

## 📖 API Reference

See full API docs in `TECH-ARCHITECTURE.md` for:
- Haversine distance formula
- Bearing calculation
- GPS → 3D coordinate conversion
- FOV gating logic
- DemoController state management

---

## 🎉 Success Metrics

### Demo Mode Adoption

**KPIs:**
- ✅ 100% uptime without GPS
- ✅ <2s load time in demo mode
- ✅ 0 permission prompts needed
- ✅ Works on desktop browsers

### User Experience

**Targets:**
- ✅ 3-step onboarding completion: >80%
- ✅ Preset usage: >60%
- ✅ Ghost hint engagement: >40%
- ✅ Mode toggle usage: >30%

---

## 📞 Support

**Issues with Demo Mode?**

1. Check `debug.html` for diagnostics
2. Inspect `window.SightlineAR` in console
3. Review browser console errors
4. Open GitHub issue with:
   - URL used
   - Expected behavior
   - Actual behavior
   - Screenshots

---

**🎭 Demo Mode = Sightline Anywhere, Anytime!**

Try it now: https://sightline-webar.vercel.app?mode=demo&lat=22.3045&lng=114.1595&hdg=120

