# Tech Plan

**Last updated:** October 2025

## Stack Overview

Sightline uses a **hybrid AR anchoring architecture** combining GPS-based geospatial positioning (primary) with Vuforia visual tracking (fallback/high-accuracy). Designed for rapid iteration on phones with future glasses compatibility (Ray-Ban Meta, Meta Orion).

## Chosen Architecture: Hybrid Anchoring (Option C)

**Rationale:** Demonstrates technical breadth (outdoor + indoor), mitigates GPS limitations, and future-proofs for glasses while maintaining pragmatic engineering.

## Core Technologies

### Frontend (Mobile AR)

**Unity 2022.3 LTS + AR Foundation 5.1**
- **Why:** Cross-platform abstraction over ARCore (Android) and ARKit (iOS)
- **Enables:** Single codebase for geospatial anchoring, depth occlusion, plane detection
- **Future-proof:** Meta XR SDK and Unity Polyspatial (visionOS) both use Unity base

**ARCore Geospatial API (Android)**
- **Feature:** Visual Positioning System (VPS) + GPS for sub-meter outdoor anchoring
- **Coverage:** 100+ cities including Hong Kong (Tsim Sha Tsui, Central fully supported)
- **Accuracy:** 1-5m horizontal, 3-10m vertical; improves with good GPS + clear sky view
- **API Usage:** Free; included in ARCore SDK; no per-query billing
- **Docs:** [developers.google.com/ar/develop/geospatial](https://developers.google.com/ar/develop/geospatial)

**ARKit GeoAnchors (iOS 14+)**
- **Feature:** GPS + Visual Odometry for outdoor anchoring
- **Accuracy:** 5-10m horizontal (less precise than ARCore VPS)
- **LiDAR:** iPhone Pro models get better depth occlusion
- **Fallback:** If GeoAnchors fail, use ARKit World Tracking + manual placement
- **Docs:** [developer.apple.com/documentation/arkit/argeoanchor](https://developer.apple.com/documentation/arkit/argeoanchor)

### Backend (API + Content)

**Node.js 18 + Express 4 + TypeScript 5**
- **Why:** Fast iteration; serverless-ready (AWS Lambda); rich npm ecosystem
- **Endpoints:**
  - `GET /answer?lat&lng` → nearest POI within 150m or default response
  - `POST /feedback` → user ratings (future)
  - `GET /health` → uptime monitoring

**In-Memory POI Store (MVP)**
- **Data:** Array of `{name, lat, lng, year, blurb}` objects
- **Selection:** Haversine distance calculation; O(n) for n < 100 POIs (acceptable for MVP)
- **Future:** PostgreSQL + PostGIS for spatial queries when POI count > 500

**Hosting: AWS (or GCP/Vercel)**
- **Compute:** EC2 t3.micro or Lambda (serverless) for API
- **Storage:** S3 for static assets (future: POI images, audio)
- **CDN:** CloudFront for low-latency API calls from HK
- **Cost:** <HKD 500/month at MVP scale (100-500 requests/day)

## Hybrid Anchoring Strategy (Technical Deep Dive)

### Outdoor (Phone + ARCore Geospatial) — Primary Path

**Flow:**
```
1. User opens app → ARSession initializes
2. App requests location → GPS: 22.2946, 114.1699
3. Call backend: POST /identify {lat, lng}
4. Backend: Haversine → nearest POI within 150m
5. Return: {poiId: "clock_tower", confidence: 1.0}
6. ARCore creates GeoAnchor at Clock Tower GPS coordinates
7. Render AR card at anchor position
8. Card stays locked to real-world location
```

**Latency Budget:**
- GPS capture: <100ms
- API call (POST /identify): <300ms
- ARCore anchor creation: <200ms
- **Total p50 target: <0.6s**

**Fallback:** If GPS accuracy >10m → switch to Vuforia Area Target

### High Accuracy (Phone/Quest + Vuforia) — Fallback/Indoor

**Flow:**
```
1. User points at Clock Tower
2. Vuforia Area Target recognizes visual features
3. "I see Clock Tower" (no GPS needed)
4. Call backend: POST /identify {image} (optional)
5. Vuforia creates anchor at predefined transform on Area Target
6. Render AR card at anchor
7. ±5cm accuracy, stable for minutes
```

**Latency Budget:**
- Vuforia recognition: <400ms
- Optional vision API: 400-800ms
- Anchor creation: <100ms
- **Total p50 target: <1.5s** (without vision) or **<1.8s** (with vision)

### Indoor Only (Quest 3 + Image Target) — Guaranteed Lock

**Quest 3 Passthrough Camera API Setup:**
```
Unity Version: 2022.3.58 (or Unity 6.0.38)
Meta XR SDK: v7.0+
Quest OS: v74+ (enables Passthrough Camera API)
```

**Flow:**
```
1. Print Clock Tower poster → place in museum/Cyberport office
2. User points Quest 3 at poster
3. Passthrough Camera API captures camera frame
4. Webcam Texture Manager provides camera texture (1280x960 default)
5. Convert 2D screen point → 3D world position:
   - Environment Raycast Manager casts ray into physical space
   - Environment Depth Manager provides depth data
   - Returns 3D pose (position + rotation aligned to surface normal)
6. Vuforia Image Target recognizes poster instantly
7. Anchor locks to poster transform at calculated 3D position
8. Optional: Send frame to Gemini Vision for label confirmation
9. Render AR card next to poster
10. User can walk around, card follows poster
```

**Latency Budget:**
- Camera frame capture: <40ms
- 2D→3D raycast conversion: <60ms
- Image Target recognition: <200ms
- Optional vision API: 400-800ms
- **Total p50 target: <1.2s** (without vision) or **<1.5s** (with vision)

**Key Components (from Meta's Sample Repository):**
- **Webcam Texture Manager**: Access left/right eye camera, resolution selection
- **Passthrough Camera Permissions**: Runtime permission management
- **Environment Raycast Manager**: Convert screen point to world ray
- **Environment Depth Manager**: Required for raycast to work
- **Meta XR Tools → Building Blocks**: Passthrough setup

### Decision Tree (In Code)

```typescript
async function identifyPOI(lat?: number, lng?: number, image?: string) {
  // Path 1: GPS-based (fastest)
  if (lat && lng && gpsAccuracy < 10) {
    const poi = selectPOIByGPS(lat, lng);
    return {poiId: poi.id, confidence: 1.0, method: 'geo'};
  }
  
  // Path 2: Vuforia Area Target (high accuracy fallback)
  if (vuforiaTargetRecognized) {
    const poi = getPOIFromAreaTarget(targetId);
    return {poiId: poi.id, confidence: 0.95, method: 'vuforia'};
  }
  
  // Path 3: Vision AI (when above methods fail)
  if (image) {
    const result = await geminiVision(image);
    return {poiId: result.id, confidence: result.confidence, method: 'vision'};
  }
  
  // Path 4: Default
  return {poiId: 'default', confidence: 0.0, method: 'default'};
}
```

### WebDemo (Browser Testing)

**Vite 5 + TypeScript + Vanilla JS**
- **Why:** Fastest dev server; no framework overhead for simple UI
- **Features:**
  - Draggable info card (DOM manipulation)
  - SVG leader line (connects anchor dot to card)
  - Fetch `/answer` with latency measurement
- **Proxy:** Vite proxies `/answer` to `localhost:3000` (Node API)

**WebXR / 8th Wall (Future)**
- **Why:** Zero-install AR demos (no app download); QR code → instant experience
- **Limitation:** WebXR geospatial APIs are immature; use as trial, not production
- **Timeline:** Experiment in Month 7-9 (post-CCMF)

## Integration Points

### AR Anchoring

**ARCore Geospatial Flow (Android):**
1. User opens app → `ARSession` initializes
2. Request location permissions (GPS + camera)
3. Call `session.Earth.CameraGeospatialPose` → get device lat/lng/heading
4. Call `session.CreateAnchor(targetLat, targetLng, altitude, rotation)` → place AR anchor
5. Render info card at anchor position
6. Update card transform every frame to maintain stability

**ARKit GeoAnchors Flow (iOS):**
1. User opens app → `ARView` initializes
2. Request location permissions
3. Create `ARGeoAnchor(coordinate: CLLocationCoordinate2D, altitude: CLLocationDistance)`
4. Render info card at anchor position
5. Fall back to world tracking if GeoAnchor fails (e.g., indoors)

**Fallback Strategy:**
- If geospatial anchoring unavailable (e.g., indoors, poor GPS):
  - Use **ARCore Cloud Anchors** or **ARKit World Tracking** with manual placement
  - Display "Tap to place" UI; user taps ground → anchor placed
  - Useful for indoor museums, underground stations

### Depth Occlusion

**ARCore Depth API (Android):**
- Supported devices: Pixel 6+, Samsung S22+, OnePlus 10+
- Provides per-pixel depth map → info card hides behind real-world objects
- **Fallback:** If depth unavailable, card always renders on top (acceptable for outdoor use)

**ARKit LiDAR (iOS Pro):**
- iPhone 12 Pro+, iPad Pro 2020+ have LiDAR scanner
- Superior indoor occlusion; less critical outdoors (distant landmarks)

### Voice Input (Future — Month 7+)

**OpenAI Whisper (via API)**
- **Why:** State-of-art speech-to-text; <500ms latency; supports Cantonese/English
- **Flow:**
  1. User holds button → record 2-5s audio
  2. POST audio blob to `/voice` endpoint → Whisper API
  3. Return transcript: "What is this?" → call `/answer`
- **Cost:** $0.006/minute; ~HKD 5 per 100 queries

**Future Glasses Integration:**
- Ray-Ban Meta Gen 1 (camera-only): Use existing Meta AI voice ("Hey Meta, what is this?")
- Ray-Ban Meta Gen 2 (display): Sightline overlay on micro-LED screen
- Meta Orion (full AR): Native Unity app with neural wristband input

## Device Roadmap

| Device | MVP (Month 1-6) | Phase 2 (Month 7-12) | Phase 3 (Month 13-24) |
|--------|-----------------|----------------------|-----------------------|
| **Android (ARCore)** | ✅ Primary | ✅ Production | ✅ Production |
| **iOS (ARKit)** | 🔶 Testing only | ✅ Production | ✅ Production |
| **WebAR (Browser)** | 🔶 Demo only | ✅ Trial mode | ✅ Trial mode |
| **Meta Quest 3** | ❌ Not yet | 🔶 Indoor POIs | ✅ Indoor POIs |
| **Ray-Ban Meta Gen 1** | ❌ No display | 🔶 Voice-only | ✅ Voice + screenshot |
| **Ray-Ban Meta Gen 2** | ❌ Not released | ❌ TBD | 🔶 Overlay (if shipped) |
| **Meta Orion** | ❌ Not released | ❌ Not released | ❌ Not released (2027) |

## Advanced Features (Post-MVP)

### SAM-2 Segmentation (Meta Segment Anything Model 2)
- **Use Case:** Auto-detect landmark boundaries → draw outline around object, not just card
- **Timeline:** Month 13-18 (after stable geospatial anchoring)
- **How:** Run SAM-2 on device (Pixel 8+ NPU) or cloud (AWS Lambda + GPU instance)
- **Example:** Outline Clock Tower in neon blue; card anchors to centroid

### NanoBanana (Lightweight Object Detection)
- **Use Case:** Identify "What is this?" when geospatial anchoring fails (e.g., small objects like plaques)
- **Timeline:** Month 19-24 (if user testing reveals need)
- **How:** Fine-tune YOLO/MobileNet on HK landmarks → 50ms inference on-device

### Multimodal LLM (GPT-4o Vision)
- **Use Case:** Dynamic answers based on camera feed + location
- **Example:** "What is this?" at Clock Tower at night → "Clock Tower (lit up for Christmas 2024)"
- **Timeline:** Month 13-18 (requires API budget + prompt engineering)
- **Cost:** $0.01-0.03/query (high); use for premium tier only

## System Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│            User Device (Phone/Glasses)          │
│  ┌──────────────────────────────────────────┐   │
│  │  Unity AR App (C#)                       │   │
│  │  - ARFoundation                          │   │
│  │  - ARCore Geospatial / ARKit GeoAnchors  │   │
│  │  - UI: Info Card, Leader Line            │   │
│  └────────────┬─────────────────────────────┘   │
│               │ HTTP GET /answer?lat&lng         │
└───────────────┼──────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────┐
│         Backend API (Node/Express/TS)           │
│  ┌──────────────────────────────────────────┐   │
│  │  Routes                                   │   │
│  │  - GET /answer → selectPOI()             │   │
│  │  - GET /health                            │   │
│  └────────────┬─────────────────────────────┘   │
│               │                                  │
│  ┌────────────▼─────────────────────────────┐   │
│  │  Core Logic                               │   │
│  │  - haversine(a, b) → distance in meters  │   │
│  │  - selectPOI(user, pois[], radius=150m)  │   │
│  └────────────┬─────────────────────────────┘   │
│               │                                  │
│  ┌────────────▼─────────────────────────────┐   │
│  │  POI Data Store (In-Memory Array)        │   │
│  │  [{name, lat, lng, year, blurb}, ...]    │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
                │
                │ (Future: PostgreSQL + PostGIS)
                ▼
┌─────────────────────────────────────────────────┐
│          External APIs (Future)                 │
│  - OpenAI Whisper (voice input)                 │
│  - GPT-4o (dynamic answers)                     │
│  - SAM-2 (segmentation)                         │
└─────────────────────────────────────────────────┘
```

## Meta Passthrough Camera API Resources

**Official Repository:**
- **GitHub:** [`oculus-samples/Unity-PassthroughCameraAPI`](https://github.com/oculus-samples/Unity-PassthroughCameraAPI)
- **Unity Version:** 2022.3.58+ or Unity 6.0.38+
- **Meta XR SDK:** v7.0+ (includes Passthrough Camera API support)
- **Quest OS Requirement:** v74+ (experimental API enabled)

**Sample Scenes Included:**
1. **Camera Viewer** — Displays raw camera feed on 2D canvas
2. **Camera to World** — Converts 2D camera coordinates to 3D world space
3. **Brightness Estimation** — Analyzes environment lighting for UI adjustments
4. **Multi-Object Detection** — AI-powered object recognition in real-time
5. **Shader Sample** — Applies visual effects to camera feed

**Key Components to Import:**
- `WebcamTextureManager` — Camera texture access (left/right eye, resolution control)
- `PassthroughCameraPermissions` — Runtime permission management
- `PassthroughCameraUtils` — Screen point → world ray conversion
- `EnvironmentRaycastManager` — 2D→3D position raycasting
- `EnvironmentDepthManager` — Depth data provider for raycasts

**Dependencies:**
- Unity Sentis package (`com.unity.sentis`) — Required for AI sample scenes
- Meta XR All-in-One SDK — Core AR/MR functionality

**Sightline Adaptation Strategy:**
- Replace ZXing QR detection → **Gemini Vision API** (landmark identification)
- Keep Environment Raycast/Depth Managers → **2D→3D conversion** (exact same approach)
- Reuse Webcam Texture Manager → **Camera frame capture**
- Adapt POI detection script from video's QR code approach → **POI anchoring**

## Development Tools

- **IDE:** Visual Studio Code (TS/JS), JetBrains Rider (Unity C#)
- **Version Control:** Git + GitHub (public repo for open-source toolkit)
- **CI/CD:** GitHub Actions (lint, test, build) → deploy to AWS Lambda
- **Testing:**
  - **Unit:** Vitest (Node API logic)
  - **Integration:** Unity Test Framework (AR anchoring stability)
  - **E2E:** Manual outdoor tests with test scripts (50 sessions in Month 5)
- **Monitoring:** Firebase Crashlytics (crash reports), Firebase Analytics (session data)

## Security & Privacy

- **Location Data:** Ephemeral; never stored on server (GDPR/PDPO compliant)
- **User Queries:** Logged anonymously for analytics; no PII (email, HKID, etc.)
- **API Auth:** Optional rate limiting (100 req/min per IP); no login required for MVP
- **Future:** OAuth 2.0 for B2B partners; JWT tokens for premium users

## Scalability Plan (Post-CCMF)

- **Month 1-6 (MVP):** EC2 t3.micro → handles 100-500 req/day
- **Month 7-12 (CIP):** Migrate to Lambda (serverless) → auto-scales to 10K req/day
- **Month 13-24:** PostgreSQL + PostGIS → spatial index for 1,000+ POIs
- **Month 25+:** CDN edge caching (CloudFront) → <200ms p50 latency globally

## Open Source Contributions

**Planned Releases (GitHub):**
1. **Haversine + Geo-selection toolkit** (Month 2) — MIT license
2. **Unity ARCore Geospatial starter project** (Month 4) — Template for HK XR devs
3. **WebDemo boilerplate** (Month 6) — Vite + TypeScript + SVG leader line example

**Why Open Source:**
- Builds HK XR community
- Demonstrates technical credibility for CIP application
- Attracts contributors (future: POI crowdsourcing)


