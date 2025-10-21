# Quest 3 Passthrough Camera API Implementation Update

**Date:** October 21, 2025  
**Author:** Sightline Team  
**Summary:** Integration of Meta's Passthrough Camera API for Quest 3 indoor AR anchoring

---

## Overview

This update incorporates **Meta's Passthrough Camera API** (experimental since Quest OS v74) as the concrete implementation approach for Sightline's **Quest 3 indoor path**. This decision is based on a verified Unity tutorial demonstrating QR code detection and AR anchoring using Quest 3's cameras.

**Key Resource:** Unity tutorial video "[Cómo acceder a la cámara de Meta Quest 3 y 3s? - Passthrough Camera API](https://www.youtube.com/watch?v=GAyt-LP7Bv8)" showing working implementation of camera access, 2D→3D conversion, and AR object placement.

---

## What Changed

### 1. Technical Architecture (Docs/06-tech-plan.md)

**Added:**
- **Quest 3 Passthrough Camera API Setup** section with exact version requirements:
  - Unity 2022.3.58 (or Unity 6.0.38)
  - Meta XR SDK v7.0+
  - Quest OS v74+
- **Detailed flow** for Quest 3 indoor path:
  1. Passthrough Camera API captures frame
  2. Webcam Texture Manager provides texture (1280x960 default)
  3. Environment Raycast Manager converts 2D screen point → 3D world position
  4. Environment Depth Manager provides depth data for accurate raycasting
  5. Pose returned with position + rotation aligned to surface normal
- **Updated latency budgets**:
  - Camera frame capture: <40ms
  - 2D→3D raycast conversion: <60ms
  - Image Target recognition: <200ms
  - Optional Gemini Vision API: 400-800ms
  - **Total p50 target: <1.2s** (without vision) or **<1.5s** (with vision)

**Added Section: Meta Passthrough Camera API Resources**
- Official GitHub repository: [`oculus-samples/Unity-PassthroughCameraAPI`](https://github.com/oculus-samples/Unity-PassthroughCameraAPI)
- 5 sample scenes included (Camera Viewer, Camera to World, Brightness Estimation, Multi-Object Detection, Shader Sample)
- Key components to import:
  - `WebcamTextureManager` — Camera texture access
  - `PassthroughCameraPermissions` — Runtime permissions
  - `PassthroughCameraUtils` — Screen point → world ray conversion
  - `EnvironmentRaycastManager` — 2D→3D raycasting
  - `EnvironmentDepthManager` — Depth data provider
- Dependencies: Unity Sentis package (`com.unity.sentis`), Meta XR All-in-One SDK
- **Sightline adaptation strategy**: Replace ZXing QR detection with Gemini Vision API for POI identification

---

### 2. Implementation Tasks (Docs/07-iterative-tasks.md)

**Updated Day 5 (Blocks 10-13):** Quest 3 + Passthrough Camera API Implementation

**Block 10: Quest 3 Project Setup with Meta XR SDK (40 min)**
- Install Unity 2022.3.58+
- Install Meta XR All-in-One SDK from Package Manager
- Configure Meta XR Tools → Project Setup Tool
- Add Passthrough building block
- Build to Quest 3 to verify passthrough working

**Block 11: Import Passthrough Camera API Samples (40 min)**
- Clone Meta's `Unity-PassthroughCameraAPI` GitHub repo
- Import `PassthroughCameraAPISamples` folder into Unity project
- Install Unity Sentis package (`com.unity.sentis`)
- Fix import errors (delete duplicate scripts)
- Verify `WebcamTextureManager` prefab available

**Block 12: Configure Camera Access & 2D→3D Conversion (40 min)**
- Add `WebcamTextureManager` prefab to scene (camera access)
- Configure resolution: `Preset3_1280x960` (default, highest quality)
- Add `EnvironmentRaycastManager` component (2D→3D conversion)
- Add `EnvironmentDepthManager` component (enables depth data)
- Create test script to verify camera texture accessible
- Build and test on Quest 3 (grant camera permissions)

**Block 13: POI Detection with Vision AI & AR Anchoring (40 min)**
- Create `POIDetection.cs` script (adapted from video's QR detection approach)
- Capture camera frame every N frames (scan frequency: 10)
- Convert frame to base64 → call Backend `POST /identify` with image
- Calculate 2D center of detected POI
- Use `PassthroughCameraUtils.ScreenPointToRayInWorld()` to convert 2D → Ray
- Use `EnvironmentRaycastManager.Raycast()` to get 3D pose with surface alignment
- Position AR card at calculated 3D position
- Display confidence/latency in debug overlay

**Full C# Implementation Provided:**
- Complete `POIDetection.cs` script with:
  - Camera frame capture from `WebcamTextureManager`
  - Base64 encoding for API calls
  - Backend `/identify` endpoint integration
  - 2D→3D conversion using Environment Raycast Manager
  - AR card positioning with pose alignment
  - Confidence/latency logging

---

### 3. Execution Plan (PLAN.md)

**Updated Day 5 Description:**
- Changed from generic "Vuforia Integration" to specific "Quest 3 + Passthrough Camera API"
- Updated block descriptions to reflect Meta XR SDK setup, GitHub sample import, and concrete implementation steps
- Added reference to `Unity-PassthroughCameraAPI` repository

---

## Why This Approach

### Technical Validation
- **Proven implementation**: Video tutorial shows working QR code detection → AR anchoring on Quest 3
- **Official Meta support**: Passthrough Camera API is experimental but officially released (OS v74+)
- **Reusable components**: Meta's sample repository provides battle-tested components
- **Exact match for Sightline needs**: 2D→3D conversion is identical whether detecting QR codes or POIs

### Adaptation for Sightline
| Video's Approach | Sightline Adaptation |
|------------------|----------------------|
| ZXing QR code detection | **Gemini Vision API** for POI identification |
| QR code content → GameObject mapping | **POI ID → AR Card** mapping (from Backend `/identify`) |
| Webcam Texture Manager | **Same** (camera frame capture) |
| Environment Raycast Manager | **Same** (2D→3D conversion) |
| Environment Depth Manager | **Same** (depth data for raycasting) |
| Hardcoded QR targets | **Dynamic POI targets** from Backend |

### Key Differences from Video
1. **Identification method**: Gemini Vision API (cloud) instead of ZXing (local)
   - **Rationale**: POI identification requires semantic understanding (landmarks, buildings) not just pattern matching
   - **Latency impact**: +400-800ms (acceptable for indoor use case)
2. **POI data source**: Backend API instead of hardcoded Unity scene objects
   - **Rationale**: Centralized POI database, easier to scale, supports outdoor/indoor consistency
3. **Confidence gating**: Amber state + disambiguation chips for <0.7 confidence
   - **Rationale**: Vision AI may return multiple candidates or low confidence results

---

## Implementation Roadmap

### Immediate (This Week)
- [ ] Follow Block 10-13 steps to set up Quest 3 project
- [ ] Test camera access and 2D→3D conversion with sample scenes
- [ ] Adapt `POIDetection.cs` script for Sightline Backend `/identify` endpoint

### Short-term (Month 2-3)
- [ ] Add Vuforia Image Target as fallback for guaranteed indoor lock
- [ ] Implement confidence gating UI (green/amber tints, disambiguation chips)
- [ ] Add telemetry overlay (latency/confidence/method display)

### Long-term (Month 4-6)
- [ ] Compare Passthrough Camera API vs. Vuforia for accuracy/stability
- [ ] Optimize scan frame frequency based on field testing
- [ ] Add on-device caching to reduce API calls (50m grid tiles)

---

## Resources Added to Documentation

### New Files
- `Docs/UPDATE-SUMMARY-QUEST3.md` — This document

### Updated Files
1. **Docs/06-tech-plan.md**
   - Added "Quest 3 Passthrough Camera API Setup" section
   - Added "Meta Passthrough Camera API Resources" section with GitHub repo, sample scenes, key components, dependencies
   - Updated latency budgets for Quest 3 path

2. **Docs/07-iterative-tasks.md**
   - Rewrote Day 5 (Blocks 10-13) with concrete Meta XR SDK setup steps
   - Added full `POIDetection.cs` implementation (adapted from video's QR approach)
   - Added step-by-step instructions for camera access, 2D→3D conversion, and AR anchoring

3. **PLAN.md**
   - Updated Day 5 execution plan to reflect Quest 3 Passthrough Camera API approach
   - Added reference to `Unity-PassthroughCameraAPI` GitHub repository

---

## Next Steps for Team

### For Developer (You)
1. **Install Unity 2022.3.58** (if not already installed)
2. **Verify Quest 3 OS version** (Settings → About → should show v74+)
3. **Clone Meta's sample repo**:
   ```bash
   git clone https://github.com/oculus-samples/Unity-PassthroughCameraAPI.git
   ```
4. **Follow Blocks 10-13** in `Docs/07-iterative-tasks.md` exactly
5. **Test camera access** using provided `CameraTest.cs` script
6. **Adapt `POIDetection.cs`** to call your Backend `/identify` endpoint

### For CCMF Application
- **Mention Passthrough Camera API** in Tech Plan section (shows cutting-edge tech adoption)
- **Highlight experimental API usage** as innovation/risk mitigation (we're leveraging latest Meta releases)
- **Include in demo video**: Show Quest 3 camera feed + 2D→3D conversion + AR card anchoring

### For Future CIP Application
- **Open-source contribution potential**: Publish Sightline's POI detection script as companion to Meta's samples
- **Community building**: Share HK-specific AR development learnings on GitHub
- **Technical credibility**: Demonstrates deep understanding of Quest 3 platform and Meta XR ecosystem

---

## Summary

This update provides a **concrete, tested path** for Quest 3 indoor AR anchoring using Meta's official Passthrough Camera API. The video tutorial validates the technical approach, and the provided implementation steps (Blocks 10-13) give you a clear execution plan.

**Key takeaway:** You're not inventing new camera access methods — you're adapting a proven QR detection approach to POI identification using Gemini Vision API. The 2D→3D conversion logic is **exactly the same** as the video tutorial.

---

**Status:** Documentation updated, implementation steps ready  
**Next Action:** Begin Block 10 (Quest 3 Project Setup)

