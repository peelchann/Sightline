# Sightline Product Roadmap — On-Object AI

**Last Updated:** October 21, 2025  
**Version:** 2.0 (CCMF → CIP)

---

## Product North Star

**Sightline = On-Object AI.**

Users look at a real thing, ask, and a sunlight-readable card anchors on it in <2s, with a leader line. Phone now; glasses next.

---

## Experience Pillars

1. **Anchored (not HUD)**: Leader line + stability SLOs
2. **<2s ask→overlay** (p50), graceful degradation
3. **Outdoor-first and indoor-precise**
4. **Hands-free ready**: Voice, gaze, save/streak/share

---

## 0. KPIs & SLOs (Product + Engineering)

### Performance
- **Latency**: p50 ask→overlay ≤ 2.0s, p90 ≤ 3.0s
- **Stability**: Anchored time without relock ≥ 10s while walking 3–4m
- **Crash-free**: ≥ 99.5% weekly sessions
- **Anchor Confidence**: ≥ 0.7 on ≥ 80% of sessions

### Engagement
- **Discovery**: ≥ 5 POIs / 15 min session
- **D7 Retention**: ≥ 35% in pilot
- **Share Rate**: ≥ 30% of sessions
- **D1 Activation**: ≥ 60%

### Museum Pilot
- **Quest Completion**: ≥ 60%
- **Dwell Time Increase**: +20–30% vs. baseline

---

## 1. Roadmap (CCMF → CIP)

### Phase A — CCMF (6 months, Month-1 = Feb 2026)

#### A1 • Foundation (Feb 2026)
**Deliverables:**
- Backend v1 (`/identify`, `/poi/:id`, `/notes`) + cache + telemetry
- Android build with ARCore Geospatial (outdoor)
- Far-field bearing billboard (IFC @ 2km)
- Indoor Vuforia Image/Area Target for guaranteed lock (Quest/phone)
- WebDemo for API testing (4h)

**Exit Criteria:**
- 10 POIs outdoor + 1 indoor target
- p50 ≤ 2.5s
- Stability ≥ 10s

---

#### A2 • Hybrid Anchoring (Mar 2026)
**Deliverables:**
- Confidence state machine: Green (locked) / Amber (re-aim) / Grey (searching)
- Nearest-POI disambiguation chips when confidence < 0.7
- Telemetry overlay ("1.7s • 0.86 • geo/vision")

**Exit Criteria:**
- 20 POIs live
- Logs prove dual-path usage (geo + vision)
- Confidence gating working

---

#### A3 • Missions & Save/Share (Apr 2026)
**Deliverables:**
- Mission Engine v1 (JSON-authored steps + 3-Q recap)
- Save ⭐ & shareable card image/video
- Teacher trial (15+ students)

**Exit Criteria:**
- Share rate ≥ 30%
- D1 activation ≥ 60%
- 1 mission playable end-to-end

---

#### A4 • Beta + Indoor Room (May 2026)
**Deliverables:**
- Room-Pack v0: Scan 1 room → Vuforia Area Target; 5–10 exhibits anchored
- Beta ≥ 50 users
- p50 ≤ 2.0s, crash-free ≥ 99.5%

**Exit Criteria:**
- Indoor mission playable end-to-end
- Room-Pack documentation complete
- Beta metrics hit targets

---

#### A5 • Film + SDK Brief (Jun 2026)
**Deliverables:**
- 90-sec demo video:
  1. Clock Tower <2s lock
  2. IFC far-field billboard
  3. Museum room with exact lock + SAM-2 highlight
  4. Discovery + save/share
- Venue/Museum SDK brief (Anchor/Answer API + analytics fields)

**Exit Criteria:**
- Video shows all 4 beats
- SDK brief reviewed by 1 venue partner

---

#### A6 • LOI + CIP Prep (Jul 2026)
**Deliverables:**
- 1 LOI (museum/heritage venue) with quoted pilot band
- CIP pack: Milestones, budget, risks, metrics

**Exit Criteria:**
- LOI signed
- CIP application submitted

---

### Phase B — CIP (12–18 months)

#### B1 • Creator Tools & Analytics
- Mission Composer (web): Place anchors, author cards/steps, preview
- Analytics dashboard: Sessions, dwell, completion, saves, latency heatmap

#### B2 • Glasses Adapters
- Quest 3 comfort & hand interactions
- visionOS port (room/object tracking)
- Ray-Ban/Android "companion display" exploration

#### B3 • City-Scale & Monetization
- Creator routes marketplace; moderation
- Sponsored layers (opt-in), redemption tracking
- 2–3 paying pilots live

---

## 2. System Architecture (Hybrid)

```
Client (Unity, AR Foundation)
  ├─ Anchor Subsystem
  │   ├─ Geospatial (ARCore VPS) — outdoor + far-field bearing
  │   ├─ Visual (Vuforia Area/Model/Image Targets) — indoor/object
  │   └─ Selector: confidence gating + handoff (far→near)
  ├─ Perception Helpers
  │   ├─ Vision classify (cloud) [fallback]
  │   └─ SAM-2 Segment (edge/server) [near-field part highlights]
  ├─ UX Layer
  │   ├─ On-object Card + Leader Line (billboarding, occlusion)
  │   ├─ Mission Engine (steps/quiz/collectibles)
  │   └─ Notes UI (XR love-locks)
  └─ Telemetry & Logs (latency, confidence, method)

Backend (Node/TS + Fastify)
  ├─ /identify   { lat,lng | image } → { poiId, name, confidence, requestId, server_ms }
  ├─ /poi/:id    → { name, year, blurb, aliases[], coords|room, assets }
  ├─ /notes      POST/GET with geo/room/object anchors + moderation
  ├─ /sam2/segment (optional) → polygons for part highlights
  ├─ Auth & Rate-limit
  └─ Caching & Metrics export (Prometheus/OpenTelemetry)

Data
  ├─ POI DB (Clock Tower, Star Ferry, IFC …)
  ├─ Missions JSON (room_id, steps, hints, rewards)
  └─ Notes store (geo/room/object anchors)

Optional Infra
  ├─ Photorealistic 3D Tiles (Cesium/Google) for skyline occlusion
  └─ CDN for assets (cards, images)
```

---

## 3. Anchoring Modes (and when to use)

### Far-Field (Skyline / IFC @ ~2km)
- Device pose → bearing/elevation to target POI
- Billboard at long range with distance chip ("IFC · 2.1 km")
- Optional city mesh (Photorealistic 3D Tiles) for occlusion
- Hand off to local geospatial or visual anchors as user approaches

### Outdoor Near-Field (≤100m)
- ARCore Geospatial/VPS + Streetscape/Depth for nearby geometry
- Leader line edge-snapping to building edges

### Indoor / Object-Precise (≤5m)
- Vuforia Area/Model/Image Targets for cm-level pose
- Optional SAM-2 highlight on parts (promptable segmentation)

### Confidence State Machine
- **Green (locked)**: Render full card; enable SAM-2 prompts
- **Amber (uncertain)**: Reduce size/opacity; show "re-aim / tap-to-lock"; offer nearest POIs
- **Grey (searching)**: Hint "steady camera"

---

## 4. APIs (Contracts)

### POST `/identify`

**Request (GPS-based):**
```json
{
  "lat": 22.2946,
  "lng": 114.1699
}
```

**Request (Vision-based):**
```json
{
  "image_base64": "..."
}
```

**Response:**
```json
{
  "poiId": "clock_tower",
  "name": "Clock Tower",
  "confidence": 0.93,
  "method": "geo|vision",
  "requestId": "req_8c1",
  "server_ms": 118
}
```

---

### GET `/poi/:id`

**Response:**
```json
{
  "id": "clock_tower",
  "name": "Clock Tower",
  "aliases": ["Tsim Sha Tsui Clock Tower", "KCR Clock Tower"],
  "coords": {
    "lat": 22.294606,
    "lng": 114.169899,
    "alt": 7.2
  },
  "year": 1915,
  "blurb": "Former Kowloon–Canton Railway terminus.",
  "assets": {
    "photo": "/img/clock.jpg"
  },
  "bounds_m": 60
}
```

---

### POST `/sam2/segment` (Optional Helper)

**Request:**
```json
{
  "image_base64": "...",
  "prompt": {
    "type": "point|box|text",
    "value": [x, y]
  }
}
```

**Response:**
```json
{
  "polygons": [
    [[x1, y1], [x2, y2], ...],
    [[x3, y3], ...]
  ],
  "server_ms": 320
}
```

---

### POST `/notes`

**Request:**
```json
{
  "anchor": {
    "type": "geo",
    "lat": 22.2946,
    "lng": 114.1699,
    "alt": 7.2,
    "sigma_m": 3.5
  },
  "content": {
    "text": "Met here in 2012 💛",
    "sticker": "lock_gold"
  },
  "visibility": "public"
}
```

---

## 5. Data Schemas

### POI
```json
{
  "id": "ifc2_hk",
  "name": "IFC",
  "coords": {
    "lat": 22.2856,
    "lng": 114.1589,
    "alt": 0
  },
  "height_m": 412,
  "aliases": ["Two International Finance Centre"],
  "blurb": "Hong Kong skyscraper on the waterfront."
}
```

### Mission (Room-Pack)
```json
{
  "mission_id": "galleryA_intro",
  "room_id": "museum_gallery_A",
  "steps": [
    {
      "id": "find_relief",
      "type": "highlight",
      "prompt": "segment 'Roman numerals'",
      "poiId": "artifact_12",
      "success": "mask_detected"
    },
    {
      "id": "quiz_year",
      "type": "quiz",
      "question": "When was it made?",
      "answers": ["1899", "1915", "1923"],
      "correct": 1
    },
    {
      "id": "collect_card",
      "type": "collect",
      "poiId": "artifact_12"
    }
  ],
  "reward": "badge_galleryA_1"
}
```

### Note (XR Love-Lock)
```json
{
  "note_id": "note_abc123",
  "anchor": {
    "type": "geo",
    "lat": 22.2946,
    "lng": 114.1699,
    "alt": 7.2,
    "sigma_m": 3.5
  },
  "content": {
    "text": "Met here in 2012 💛",
    "sticker": "lock_gold"
  },
  "visibility": "public",
  "created_at": "2026-03-15T14:30:00Z"
}
```

---

## 6. Repo Structure (Mono-repo)

```
/sightline
  /apps
    /android-unity      # Unity project (AR Foundation, Vuforia plugin)
    /quest-unity        # Same project; different build config
    /webdemo            # Vite/React tiny tester for API
  /services
    /api                # Fastify/TS; /identify /poi /notes /sam2 (proxy)
  /packages
    /sdk-unity          # IAnswerService, AnchorSelector, StateMachine, CardUI
    /schemas            # JSON schemas & validators
    /mission-engine     # Shared mission runner logic
  /infra
    /deploy             # IaC scripts, Docker, CD
  /ops
    /dashboards         # Grafana/Looker configs for latency, confidence, method
  /docs
    ARCHITECTURE.md
    API.md
    MISSION_SPEC.md
    ANCHORING_GUIDE.md
    PRODUCT-ROADMAP.md (this file)
```

---

## 7. Unity Components (Must-Have)

### `AnchorSelector.cs`
**Inputs:** Geospatial pose, visual tracker status  
**Output:** `AnchorState { mode, confidence, transform }`

### `LeaderLine.cs`
World-space quad + capsule ends; snaps to Streetscape edges when available

### `CardBillboard.cs`
Billboards to camera, scales with distance; supports far-field placement

### `MissionEngine.cs`
Runs steps; integrates with SAM-2 masks & quiz UI

### `Telemetry.cs`
Emits `{ requestId, t_client_ms, t_server_ms, method, confidence }`

---

## 8. QA Plan

### Walk Tests
- Lateral 3–4m around Clock Tower
- Record stability time
- **Pass:** ≥ 10s

### Latency Harness
- Inject synthetic 3G/4G jitter
- Maintain p50 ≤ 2.0s
- Show amber > 2.0s

### Indoor Precision
- Area Target drift ≤ 5cm over 60s

### Far-Field
- IFC @ ≥1.5km
- Billboard aligns with skyline
- Distance chip correct ±3%

### Load
- 30 concurrent students (Star Ferry)
- No degradation >15%

---

## 9. Privacy, Safety, Cost

### Privacy
- Edge blur faces/plates before any vision upload
- Explicit "camera active" indicator

### Rate Limiting
- `/identify(image)` rate-limited
- Cache results per POI (10 min TTL)

### Cost Controls
- **MVP Budget:** < US$20/mo if geo-primary
- **Vuforia:** US$99/mo for 1–2 Area Targets
- **LLM Usage:** Bounded; POI blurbs templated, LLM adds flavor only

### Content Safety
- POI blurbs templated
- User notes: Profanity filter + moderation queue

---

## 10. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Outdoor drift | Confidence gating, tap-to-lock, vision fallback; far-field uses bearing billboard |
| Network spikes | Frame downscale, pre-warm HTTP/keep-alive, cache POIs |
| Indoor scan effort | Start with one room; document 2-hour scan checklist; reuse pipeline |
| Platform changes | Keep AR subsystems modular (Strategy pattern in AnchorSelector) |
| SAM-2 latency | Run edge/server hybrid; show progressive masks |
| User-generated spam | Profanity filter + moderation queue for notes |

---

## 11. 40-Minute Task Grid (First 2 Weeks)

### Day 1
- ✅ Fastify boilerplate + `/identify` (geo path) → nearest POI
- ✅ WebDemo call + latency readout

### Day 2
- `/poi/:id` + in-mem cache; add `requestId`, `server_ms`
- Seed 10 HK POIs (Clock Tower, Star Ferry, Sheung Wan, IFC)

### Day 3
- Unity project + AR Foundation; run on Android
- `IAnswerService` client; dummy card render

### Day 4
- ARCore Geospatial init; card at geo anchor; leader line
- Telemetry overlay

### Day 5
- **Far-field bearing billboard to IFC**; distance chip

### Day 6
- Confidence state machine (green/amber/grey) + disambiguation chips

### Day 7
- Vuforia Image Target indoor lock (poster)

### Day 8
- Vuforia Area Target (one room) import; place 5 exhibits

### Day 9
- **Mission Engine v1**; 3-step mission JSON; recap quiz

### Day 10–12
- **Save/Share**; note pins (`/notes`); profanity filter
- Field filming: outdoor + indoor

---

## 12. What "Done" Looks Like for CCMF

### Video (90 seconds)
1. **Clock Tower** <2s lock (outdoor near-field)
2. **IFC far-field billboard** @ 2km with distance chip
3. **Museum room** with exact lock + SAM-2 highlight
4. **Discovery** + save/share

### Milestones
- Month-by-month with numeric KPIs (see Phase A)

### Budget
- Line-itemed: Unity XR, backend, cloud, devices, video (HKD 100,000)

### LOI
- One museum/heritage venue acknowledging Room-Pack scope & pilot band

---

## Next Steps

1. **Review this roadmap** with team
2. **Update PLAN.md** to reflect Phase A milestones
3. **Update SPEC.md** with new API contracts (`/notes`, `/sam2/segment`)
4. **Create MISSION_SPEC.md** for Mission Engine details
5. **Update Docs/05-application-outline.md** with new KPIs and milestones

---

**Status:** Roadmap approved, ready for implementation  
**Owner:** Sightline Team  
**Next Review:** Feb 2026 (post-A1 milestone)


