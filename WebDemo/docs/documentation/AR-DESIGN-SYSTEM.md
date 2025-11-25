# AR Design System: "Luminous Reality"
Version: 1.0

## Core Philosophy
**Augmentation, not Obstruction.**
Digital elements must obey the physics of light (glow, blur, transparency) to feel native to the real world while maintaining strict data hierarchy.

---

## I. Coordinate Systems & Tracking Behaviors
Before defining visual elements, Engineers and Designers must agree on the Reference Frame.

### Type A: "The Cockpit" (Head-Locked UI)
- **Definition:** UI elements that move with the user's head rotation. They are "stuck" to the screen.
- **Best For:** Status indicators, critical alerts, persistent tools.
- **Technical Spec:**
    - **Rendering:** Screen Space Overlay (2D Canvas).
    - **Motion Damping:** Critical. Do not hard-lock UI 1:1 to head movement. Apply a Spring/Lerp function (0.1s delay) so the UI "floats" slightly behind the head movement to reduce motion sickness.

### Type B: "The Anchor" (World-Locked UI)
- **Definition:** UI elements pinned to a specific GPS coordinate or physical object.
- **Best For:** POIs, Wayfinding, Object labeling.
- **Technical Spec:**
    - **Rendering:** World Space (3D Transform).
    - **Behavior:** Must utilize Billboarding (automatically rotating to face the user).

---

## II. Component Library

### 1. The "Frosted Glass" Card (Data Container)
*Derived from Enterprise/Dashboard style.*

**Visual Spec (Designer):**
- **Surface:** Dark or Light Acrylic. `backdrop-filter: blur(24px)`.
- **Fill:** `rgba(30, 41, 59, 0.6)` (Dark Mode) or `rgba(255,255,255, 0.15)` (Light Mode).
- **Border:** Inside stroke, 1px, White at 20% Opacity.
- **Corner Radius:** 24px (Standard) or 32px (Large).
- **Elevation:** 3D Drop Shadow `0px 10px 40px rgba(0,0,0,0.3)`.

**Technical Spec (Engineer):**
- **Shader:** Standard Unlit Transparent shader.
- **Depth Test:** Always On (Z-Write Off).
- **Scale Behavior:** If World-Locked, the card must maintain optical size. As the user walks away, the card scales up slightly so it remains readable, until a max distance (e.g., 50m) where it fades out.

### 2. The "Spatial Tether" (Navigation Line)
*Derived from Beach/Navigation style.*

**Visual Spec (Designer):**
- **Form:** A floating ribbon, 1.5 meters above the ground, or a "tape" projected on the floor.
- **Color:** Neon Gradient (Start: `#FF2A68` -> End: Transparent).
- **Effect:** Animated texture. Chevrons `>>>` moving along the path to indicate direction.

**Technical Spec (Engineer):**
- **Geometry:** Generated Mesh (Catmull-Rom Spline) following the navigation path nodes.
- **Occlusion:** Optional. If the path goes behind a building, use "X-Ray" rendering (dashed line) so the user doesn't lose the path.
- **Verticality:** Raycast to the ground plane to snap the path to the floor (Navigation Mesh).

### 3. The "Ghost Mesh" (Scanning Overlay)
*Derived from Architectural style.*

**Visual Spec (Designer):**
- **Appearance:** Thin white wireframe (1px stroke) overlaid on physical buildings.
- **Opacity:** 100% at the center of vision, fading to 0% at the periphery (Vignette Mask).
- **Animation:** A "Pulse" effect—a wave of light travels across the grid every 3 seconds.

**Technical Spec (Engineer):**
- **Input:** LiDAR Depth Map or Pre-scanned Photogrammetry model.
- **Shader:** Edge Detection Shader or Barycentric Wireframe Shader.
- **Performance:** Low-Poly proxy meshes only.

### 4. The "Adaptive Callout" (Floating Label)
*Derived from 'Luma Rivers' music widget.*

**Visual Spec (Designer):**
- **Layout:** `[Icon] — [Line] — [Content]`.
- **Line:** A distinct 2px white line connecting the 3D anchor point to the 2D text label.
- **Background:** None (Frameless) OR a soft Radial Gradient Black Glow (20% opacity) behind text.

**Technical Spec (Engineer):**
- **Collision Avoidance:** Use a Force-Directed Graph algorithm to push text labels apart so they don't overlap.

---

## III. Interaction & States (The "Micro-Interactions")

| State | Visual Change | Physics/Motion |
| :--- | :--- | :--- |
| **Idle** | Standard Opacity (80%) | Gentle "Bobbing" (Sine wave, amplitude 0.05m) |
| **Gaze Hover** | Opacity 100%, Glow increases | Scale up 1.1x (Spring Animation) |
| **Active/Selected** | Border color changes to Neon Cyan | Snap to Front (Z-Index increase) |
| **Occluded** | Render as Dashed/Dotted Line | Color desaturates to Grey |

---

## IV. Typography & Readability Standards
The "Outline" Rule: All text must have a subtle Drop Shadow (0, 2px, 4px, black) OR a slight Text Stroke.

- **Minimum Size (World Space):** 20cm height at 5m distance.
- **Minimum Size (Screen Space):** 16pt equivalent.
- **Font:** High x-height and open counters (e.g., Inter, Roboto, DIN). No serifs.

---

## V. Developer Implementation Checklist
- [ ] **Engine:** Unity (AR Foundation) or WebAR (Three.js / 8th Wall).
- [ ] **Lighting:** Unlit Shaders (UI emits light).
- [ ] **Color Space:** Linear.
- [ ] **Post-Processing:** Bloom (Threshold 0.9) + Chromatic Aberration (0.01).

---

## VI. Technical Implementation: Ghost Mesh Wireframe (Three.js)

**Tech Stack:** Three.js (r150+)
**Component:** `THREE.EdgesGeometry`

This implementation creates a clean architectural wireframe by analyzing the mesh and only keeping edges greater than a threshold angle, avoiding the "messy triangle" look of standard wireframes.

```javascript
import * as THREE from 'three';

// 1. Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.set(2, 2, 5);
camera.lookAt(0, 0, 0);

// 2. The Ghost Mesh
// A. Source Geometry (In AR, this comes from the depth scanner/occlusion manager)
const buildingGeometry = new THREE.BoxGeometry(3, 5, 3);

// B. EdgesGeometry (The Magic)
// Only keeps edges > 1 degree threshold
const thresholdAngle = 1;
const edgesGeometry = new THREE.EdgesGeometry(buildingGeometry, thresholdAngle);

// C. The Material (Unlit, Transparent)
const ghostMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    linewidth: 2,
    transparent: true,
    opacity: 0.8,
    depthTest: true, // Hides lines behind the building
    depthWrite: false
});

// D. Final Mesh
const ghostMesh = new THREE.LineSegments(edgesGeometry, ghostMaterial);
scene.add(ghostMesh);

// 3. Pulse Animation
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    // Sine wave pulse between 0.4 and 1.0 opacity
    const pulse = Math.sin(elapsed * 2) * 0.5 + 0.5;
    const minOpacity = 0.4;
    const maxOpacity = 1.0;
    ghostMaterial.opacity = minOpacity + (pulse * (maxOpacity - minOpacity));

    ghostMesh.rotation.y += 0.002;
    renderer.render(scene, camera);
}

animate();

// Window Resize Handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);
```

**Integration Note:** In a real AR context (8th Wall / WebXR), you would subscribe to the meshing API and update `edgesGeometry` whenever the system provides a new `XRMesh`.

