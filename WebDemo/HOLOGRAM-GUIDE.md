# Hologram Validation Implementation Guide

This implementation follows the "Validation-First" approach for Sightline, addressing GPS drift and occlusion.

## Files Created

- `WebDemo/hologram.html`: Main entry point.
- `WebDemo/hologram.css`: Styles for the Glassmorphism UI and Calibration controls.
- `WebDemo/hologram-app.js`: Core logic for Shaders, Occlusion, and Interaction.

## Key Features

### 1. Ghost Architecture (Occlusion)
We use an invisible `a-cylinder` as a proxy for the Clock Tower.
- **Component:** `color-write="false"`
- **Logic:** The proxy writes to the depth buffer but draws no pixels. Any holographic content physically *behind* (or inside) this proxy is not rendered, creating the illusion that the content is obstructed by the building's volume.
- **Effect:** Holographic gears placed *inside* the tower will only be visible if they protrude *outside* the proxy volume.

### 2. Holographic Shader
A custom `hologram-material` is applied to the gears.
- **Vertex Shader:** Calculates surface normals.
- **Fragment Shader:** Uses a Fresnel effect (dot product of view vector and normal) to create a glowing rim light.
- **Blending:** Additive blending for a "light-based" look.

### 3. Anchoring & Calibration
To solve GPS drift:
- **Initial:** Uses `gps-new-entity-place` to anchor to TST Clock Tower coordinates.
- **Calibration:** A "Drag-to-Align" UI allows the user to manually offset the position of the 3D content relative to the GPS anchor.
- **Lock:** Once aligned, the user locks the target.

### 4. UI Overlay
Glassmorphism effect using CSS:
- `backdrop-filter: blur(10px)`
- Semi-transparent borders and backgrounds.

## How to Test

1. Open `hologram.html` on a mobile device with GPS/Camera.
2. Grant permissions.
3. You should see the "Alignment Required" screen.
4. Look for the TST Clock Tower (or the direction of the coordinates).
5. Use the **Touch Pad** to drag the wireframe gears until they align with the real tower.
   - The invisible proxy will block parts of the gear that are "inside" the tower.
6. Click **LOCK TARGET** to hide the calibration UI and show the data panels.

## Customization

- **Target Location:** Edit `TARGET_LAT` and `TARGET_LNG` in `hologram-app.js`.
- **Proxy Size:** Adjust `radius` and `height` of `#proxy-tower` in `hologram.html` to match your building.

