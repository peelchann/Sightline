# MVP Gap Analysis: WebAR vs. Target Design System

## Overview
This document bridges the gap between our **Target Design System ("Luminous Reality")** and the **Current WebAR MVP** capabilities.

| Feature | Target State (Ultimate) | Current MVP (WebDemo) | Gap / Workaround |
| :--- | :--- | :--- | :--- |
| **Tracking** | Visual Positioning System (VPS) <br> *Sub-centimeter accuracy* | GPS + IMU (Compass) <br> *±5-10m accuracy* | **Gap:** Jittery positioning. <br> **Fix:** Use larger "Area Targets" (radius ~20m) rather than precise pinpoints. Use manual "Tap to Place" fallback. |
| **Occlusion** | Real-time Mesh Occlusion <br> *Digital objects hide behind buildings* | None (Always on Top) | **Gap:** Immersion breaking. <br> **Fix:** Design UI to float *above* buildings (Billboards) rather than integrating *into* them. |
| **Ghost Mesh** | LiDAR/Depth Scanning <br> *Real-time wireframe of environment* | Pre-built 3D Models | **Gap:** No real-time scanning in WebAR (iOS limitation). <br> **Fix:** Use a static "Hologram Cube" or pre-made model to demonstrate the *visual effect* without real-time data. |
| **Navigation** | World-Anchored Path <br> *Stays fixed on ground* | Screen-Locked Arrow | **Gap:** Floor tracking is unstable outdoors. <br> **Fix:** Use a 2D "Compass HUD" (Type A UI) to point direction instead of a 3D path. |
| **Lighting** | Scene Estimation <br> *Shadows match real sun* | Unlit / Baked Lighting | **Gap:** No light estimation. <br> **Fix:** Use "Luminous" style (Unlit shaders) as defined in design system. The UI emits its own light, bypassing the need for scene lighting. |

## MVP Implementation Strategy
For the current WebDemo, we simulate the *look and feel* of the high-end system using simpler tech:

1.  **Visual Style:** Fully implement the **"Frosted Glass"** CSS and **Neon Colors**. This requires no advanced AR tech, just standard CSS3.
2.  **Interaction:** Implement **Type A (Cockpit)** UI for the HUD. It is reliable and works perfectly with just IMU data.
3.  **Anchoring:** Use **GPS** for rough placement. If the user is within 50m, show the **"Adaptive Callout"** style, but keep it floating high up to avoid ground collision issues.

## Future Roadmap (Post-MVP)
1.  Integrate 8th Wall or Niantic Lightship for VPS.
2.  Enable Depth API for real-world occlusion.
3.  Implement real-time meshing for the Ghost Mesh effect.

