# Wong Chuk Hang AR Cards Implementation

## Summary
Implemented always-visible AR indicators with Wong Chuk Hang POIs, improved card visibility, and graceful fallbacks.

## Changes Made

### 1. POI Data (`app-v3.js`)
Added 4 Wong Chuk Hang POIs:
- **Ocean Park Hong Kong (Main Entrance)** - 22.2476, 114.1733
- **Wong Chuk Hang MTR (Exit B)** - 22.2472, 114.1739
- **Aberdeen Promenade** - 22.2489, 114.1579
- **THE SOUTHSIDE** - 22.2459, 114.1698

### 2. Detection Radius System
Implemented 3-tier detection:
- **R_IN_RANGE = 600m**: Place anchored 3D AR card with leader line
- **R_VIS = 1500m**: Show off-axis indicator arrow with name + distance
- **R_NEAREST = 5000m**: Show nearest fallback banner if nothing closer

### 3. Always-Visible Fallback Rendering
- **In-range anchors**: 3D cards with leader lines, billboard to camera, outdoor-readable styling
- **Visible but out-of-range**: Screen-edge compass chips with rotating arrows
- **Nearest fallback**: Center-top banner showing closest POI (max 5km)
- **Temporary demo card**: Shows "Awaiting GPS/Heading..." while sensors initialize

### 4. Improved AR Cards
- **Leader lines**: Vertical lines connecting cards to ground
- **Billboard to camera**: Cards always face user
- **Outdoor legibility**: High contrast (#FAFAFA background, #111 text), drop shadows, larger fonts
- **Card components**: Title, year badge, description, distance (color-coded by category)
- **Scale clamping**: Cards scale between 0.9-1.15x based on distance

### 5. Preset Selector
Added demo mode preset selector with 3 locations:
- **West Kowloon Freespace** - 22.3045, 114.1595, heading 120°
- **Wong Chuk Hang MTR** - 22.2472, 114.1739, heading 0°
- **Ocean Park Entrance** - 22.2476, 114.1733, heading 45°

### 6. Heading/IMU Updates
- **Heading debug chip**: Shows live heading (↻ 132°) in top-left
- **Debounced updates**: Normalized to 0-359°, clamped to prevent jitter
- **Fallback handling**: If heading unavailable, uses GPS bearing for arrows

### 7. UI Improvements
- **Center dead zone**: 160x160px non-blocking area to prevent cards from covering camera center
- **Accuracy hint**: Shows "Reacquiring location..." when GPS accuracy > 80m
- **Off-axis indicators**: Positioned on screen edges, rotate with heading
- **Nearest banner**: Always shows something if within 5km

### 8. Edge Cases Handled
- **Low GPS accuracy**: Shows hint but keeps fallback arrows visible
- **No heading**: Renders distance-only chips, keeps anchors visible if GPS bearing stable
- **No POIs in range**: Shows nearest fallback banner (up to 5km)
- **Sensors not ready**: Shows temporary demo card until GPS/heading available

## Testing Checklist

### iPhone Safari (Portrait)
- [ ] Grant all permissions → see card/arrow within 2s
- [ ] Within ~600m → world-anchored card appears with leader line
- [ ] 600-1500m → off-axis arrow chip with name + distance
- [ ] >1500m → nearest fallback banner
- [ ] Rotate 180° → arrow flips, card repositions correctly
- [ ] Text legible outdoors, no overlaps with system bars
- [ ] Preset "Wong Chuk Hang (Demo)" shows anchor immediately

### Android Chrome (Portrait)
- [ ] Same behavior as iPhone Safari

### Demo Mode
- [ ] Preset selector appears on "Start Demo Mode"
- [ ] Selecting preset immediately shows AR scene
- [ ] Cards appear at correct positions
- [ ] No camera required, works with zero permissions

## Files Modified
- `WebDemo/app-v3.js` - POI data, detection logic, rendering, preset selector
- `WebDemo/index.html` - Added UI elements (debug chip, dead zone, indicators, banners)
- `WebDemo/styles-v3.css` - Styling for new UI components, AR cards, outdoor readability

## Deployment
- **Committed**: `d39e2ef` - "FEAT: Wong Chuk Hang POIs + always-visible AR indicators"
- **Deployed**: Production URL available at Vercel
- **Status**: ✅ Live

## Next Steps
1. Test on actual device at Wong Chuk Hang location
2. Verify POI coordinates are accurate (may need adjustment based on real-world testing)
3. Fine-tune detection radii based on user feedback
4. Add more POIs if needed
5. Record screen captures showing:
   - (A) Grant each permission separately → Start AR works
   - (B) Zero permissions → Demo Mode runs with synthetic presets


