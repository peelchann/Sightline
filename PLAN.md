# Sightline MVP + Cyberport CCMF Application

## Primary Goal

Prepare a **Cyberport CCMF funding application** with a working 90-second MVP demo as supporting evidence. Deliverables include: (1) Strategic/business documents (executive summary, competitor analysis, application outline, pitch, etc.), and (2) Technical MVP demo with **hybrid AR anchoring** (GPS primary + Vuforia fallback).

## Dual-Track Approach

- **Track A (Strategic)**: Research, document, and prepare 11 funding-ready deliverables
- **Track B (Technical)**: Build working MVP demo with measurable KPIs and field-tested stability

## Chosen Architecture: **Option C - Hybrid Anchoring** ✅

**Rationale:** Shows breadth (outdoor + indoor), mitigates GPS gaps, future-proofs for glasses.

### Outdoor (Phone + ARCore Geospatial)
- **Primary:** GPS-based geospatial anchoring (free, fast, scalable)
- **Fallback:** Vuforia Area Target (±5cm accuracy when GPS poor)
- **Target:** p50 latency <0.6s, anchor stability ≥10s

### Indoor (Quest 3 + Vuforia)
- **Primary:** Vuforia Image/Area Target (no GPS needed)
- **Fallback:** Vision AI identification + SLAM
- **Target:** p50 latency <1.8s, stable tracking

### Cost & Timeline
- **Build time:** 3 weeks (7-day sprint + 2 weeks polish)
- **Recurring cost:** $99/mo Vuforia + ~$20/mo AI API
- **One-time:** Devices (if needed)

## Implementation Steps

### 1. Project Structure & Configuration

Create the monorepo structure with:

- Root `package.json` with workspaces for Server and WebDemo
- `.gitignore` for Node, build artifacts, and OS files
- `.editorconfig` for consistent formatting
- `README.md` and `SPEC.md` (provided content)
- `/Docs` folder with `field-notes.md` starter
- `/Ops` folder with `api.http` for REST client samples

### 2. Server Setup (`/Server`) — Fastify + TypeScript

**Files to create:**

- `package.json` with dependencies: `fastify`, `@fastify/cors`, `tsx`, `typescript`, `vitest`, `@types/node`
- `tsconfig.json` with strict mode enabled
- `src/types.ts` - shared types: `POI`, `LatLng`, `IdentifyRequest`, `IdentifyResponse`, `POIResponse`
- `src/core/haversine.ts` - Haversine distance formula (WGS84)
- `src/core/geo.ts` - `selectPOI()` function with POIs from `data/pois.json`
- `src/routes/identify.ts` - **POST `/identify`** endpoint (accepts GPS or image)
- `src/routes/poi.ts` - **GET `/poi/:id`** endpoint
- `src/server.ts` - Fastify app with CORS, routes, error handling
- `src/cache.ts` - In-memory cache (10-min TTL) for POI responses
- `data/pois.json` - 3 HK POIs: Clock Tower, Star Ferry, Sheung Wan
- `test/haversine.test.ts` - Vitest tests with 3+ cases
- `test/geo.test.ts` - Tests for `selectPOI` (exact, nearest, none in radius)

**Key logic:**

- `haversine()` returns distance in meters between two lat/lng points
- `selectPOI()` finds nearest POI within 150m radius, returns null if none found
- **POST `/identify`** accepts `{lat,lng}` OR `{image}`, returns `{poiId, name, confidence, requestId, server_ms}`
- **GET `/poi/:id`** returns full POI data with `{name, year, blurb, snapshots[], bounds_m}`
- All responses include `requestId` (UUID) and `server_ms` (latency) for logging

### 3. WebDemo Setup (`/WebDemo`)

**Files to create:**

- `package.json` with dependencies: `vite`, `typescript`
- `tsconfig.json` for DOM environment
- `vite.config.ts` - dev server on port 5173, proxy `/answer` to `http://localhost:3000`
- `index.html` - container for anchor, card, SVG overlay
- `styles.css` - styling for anchor dot, draggable card, leader line, green/amber tints
- `main.ts` - TypeScript logic for:
  - Render anchor dot at fixed position (420, 240)
  - Create draggable info card
  - Draw SVG leader line from anchor to card center
  - Update leader line on card drag
  - Button click handler: fetch `/answer`, measure latency, update card content and tint

**UI Requirements:**

- Background: gradient or solid color (testbed for future image)
- Anchor: visible dot/circle at the "landmark" position
- Card: draggable, shows name/year/blurb, footer with distance and latency
- Leader line: SVG line connecting anchor to card, updates on drag
- Tint: green for POI match, amber for default response

### 4. Root Scripts & Integration

Create root `package.json` with:

- `workspaces: ["Server", "WebDemo"]`
- Scripts using `npm-run-all` or `concurrently`:
  - `"dev"` - runs both Server and WebDemo dev servers
  - `"test"` - runs Server tests
  - `"install:all"` - installs dependencies in all workspaces

### 5. Documentation

- `README.md` - Quick start, API contract, folder structure, link to SPEC
- `/Ops/api.http` - Sample requests for VS Code REST Client:
  - GET `/answer?lat=22.2946&lng=114.1699` (Clock Tower)
  - GET `/answer?lat=22.2800&lng=114.1587` (Star Ferry)
  - GET `/answer?lat=22.3000&lng=114.2000` (no match)
- `/Docs/field-notes.md` - Template for iteration notes

### 6. Track A — Strategic Documents (`/Docs`)

Create 11 funding-ready documents:

1. **`00-exec-summary.md`** — Executive summary (≤200 words): what to build first, for whom, and why it wins now
2. **`01-business-canvas.md`** — Business Value Canvas: users, pains, gains, top 3 use cases (HK first)
3. **`02-competitor-matrix.md`** — Competitor Matrix table with vendor, device focus, core promise, anchoring, occlusion, onboarding TTFV, pricing, USP vs us, links
4. **`03-trends-devices.md`** — Trends & Devices Brief (≤250 words): what's real in next 12–18 months; implications for us
5. **`04-cyberport-map.md`** — Cyberport Map: CCMF vs CIP deadlines, eligibility, scoring, key docs; 5 bullets on "what passes"
6. **`05-application-outline.md`** — Application Outline (paste-ready): Project summary, Why Now, 6-month milestones with KPIs, Budget, Social Value, Risks/Mitigations
7. **`06-tech-plan.md`** — Tech Plan: stack & integration points: Unity/AR Foundation, ARCore/ARKit geospatial, Meta/Quest MR, Vuforia; LLM/voice; where SAM-2 fits
8. **`07-iterative-tasks.md`** — Iterative Task Ladder: 12–16 tasks (~40 min each) from web mock → Node/TS API → Unity stub → first AR anchor
9. **`08-risk-register.md`** — Risk Register: top 8 risks with early tests/mitigations
10. **`09-60sec-pitch.md`** — 60-Second Pitch: tight, investor-ready script
11. **`10-agentic-research-plan.md`** — Agentic Research Plan: step list for browsing agent to collect links, pricing, case studies (with dates/citations)

## Engineering Guardrails

### API Contract (Locked)

**POST `/identify`**
```typescript
Request: {lat: number, lng: number} OR {image: string}
Response: {
  poiId: string;
  name: string;
  confidence: number;
  requestId: string;
  server_ms: number;
}
```

**GET `/poi/:id`**
```typescript
Response: {
  id: string;
  name: string;
  aliases: string[];
  lat: number;
  lng: number;
  year: number | null;
  blurb: string;
  snapshots: string[];
  bounds_m: number;
}
```

### Latency Budgets

**GPS Path (Phone Outdoor):**
- Client capture → API call: ≤300ms
- Server processing: ≤300ms
- **Target p50: <0.6s end-to-end**

**Vision Path (Quest/Fallback):**
- Frame capture: ≤40ms
- Upload: ≤150ms
- AI model (Gemini): 400-800ms
- JSON compose: ≤80ms
- **Target p50: 1.2-1.8s**
- If >2.0s → show "Re-aim to lock" + amber state

### Confidence Gating

- **Confidence ≥0.85:** Green border, display result
- **Confidence 0.60-0.85:** Amber border + show 2 nearest POI chips
- **Confidence <0.60:** Amber "Look around" default message

### Privacy & Cost Controls

- Cap vision images to 1024px max width
- Blur faces/license plates server-side (future)
- Cache POI answers by location grid (50m tiles)
- Rate limit: 100 requests/min per device

## 7-Day Execution Plan (40-min blocks)

### Day 1-2: Backend + WebDemo
- **(Block 1-2)** Fastify server: POST `/identify`, GET `/poi/:id`, requestId + server_ms
- **(Block 3)** In-memory cache (10-min TTL), seed `data/pois.json`
- **(Block 4)** WebDemo: anchor dot + draggable card + leader line
- **(Block 5)** WebDemo: button calls `/identify`, render latency/confidence

### Day 3-4: Unity + ARCore Geospatial
- **(Block 6)** Unity 2022.3 LTS + AR Foundation, Android build runs
- **(Block 7)** `IAnswerService` interface + HTTP client
- **(Block 8)** ARCore Geospatial: hardcode Clock Tower anchor
- **(Block 9)** Hook geo path → call `/identify` with GPS → populate card

### Day 5: Vuforia Integration
- **(Block 10)** Add Vuforia SDK, Image Target (printed poster)
- **(Block 11)** Quest 3 platform switch, passthrough enabled
- **(Block 12)** Capture frame → `/identify` (image), display confidence
- **(Block 13)** Low confidence UI: amber + 2 disambiguation chips

### Day 6: Polish & Film
- **(Block 14)** Tap-to-lock fallback, "Re-aim to lock" state
- **(Block 15)** Telemetry overlay: latency/confidence/method
- **(Block 16)** Outdoor filming: Clock Tower (3 takes, ≥10s stability)
- **(Block 17)** Indoor filming: Quest 3 with poster (2 takes)

### Day 7: CCMF Packaging
- **(Block 18)** Cut 90-second video, add KPI slate
- **(Block 19)** Export Gantt/Budget/Competition 1-pager
- **(Block 20)** Finalize CCMF application draft

## 6-Month Milestones (Feb–Jul 2026)

### Month 1 (Feb 2026): Foundation
- **Deliverable:** Phone outdoor geo path live at 10 POIs
- **KPIs:**
  - p50 ask→overlay: ≤2.5s
  - Crash-free rate: ≥99.0%
  - GPS-only (no vision yet)

### Month 2 (Mar 2026): Vuforia Fallback
- **Deliverable:** Vuforia at 1-2 POIs for high accuracy
- **KPIs:**
  - Anchor stability: ≥10s
  - Logs show method (geo/vision), latency, confidence
  - Quest 3 indoor demo working

### Month 3 (Apr 2026): Feature Expansion
- **Deliverable:** 20 POIs, voice I/O, Save/Share
- **KPIs:**
  - Teacher trial at Star Ferry: ≥15 students
  - User satisfaction: ≥80%
  - Voice input working (Cantonese + English)

### Month 4 (May 2026): Beta Testing
- **Deliverable:** Beta with ≥50 users
- **KPIs:**
  - p50 latency: ≤2.0s
  - Crash-free: ≥99.5%
  - Traditional Chinese localization complete

### Month 5 (Jun 2026): Demo Polish
- **Deliverable:** 90-second field demo video
- **KPIs:**
  - Video shows stable anchor, <2s response, leader line
  - Creator collaboration (video production)
  - Draft venue SDK brief

### Month 6 (Jul 2026): Pilot Preparation
- **Deliverable:** 1 LOI from venue/district + pilot plan
- **KPIs:**
  - Pilot agreement signed
  - CIP application package ready
  - Analytics dashboard for venue partners

## Budget (HKD 100,000)

| Category | Amount (HKD) | Justification |
|----------|--------------|---------------|
| Unity XR Contractor (pt-time) | 35,000 | AR development, 3 months @ 11,667/mo |
| Backend/API Development | 15,000 | Fastify server, AI integration, testing |
| Cloud & AI APIs | 10,000 | Vuforia ($99/mo × 6), Gemini Vision, hosting |
| Devices & Field Testing | 20,000 | Android phone, Quest 3 accessories, outdoor tests |
| Design/Brand/Video | 10,000 | UI/UX, branding, 90-sec demo video production |
| Contingency | 10,000 | Unexpected costs, extra testing, equipment repair |
| **TOTAL** | **100,000** | |

## Acceptance Criteria

### Track B (Technical)

- [x] `npm install` at root installs all workspaces
- [x] `npm run dev` starts both Server (port 3000) and WebDemo (port 5173)
- [x] `npm test` passes all Vitest tests
- [x] GET `/answer?lat=22.2946&lng=114.1699` returns Clock Tower data
- [x] WebDemo shows anchor dot, draggable card, and leader line
- [x] Clicking "What is this?" fetches data and displays latency
- [x] Card tint is green for POI match, amber for default

### Track A (Strategic)

- [x] All 11 strategic documents created in `/Docs/`
- [x] Documents include measurable KPIs (e.g., p50 ask→overlay ≤2.0s)
- [x] Competitor matrix includes links to official docs/pricing
- [x] Application outline is paste-ready for CCMF submission
- [x] Time-sensitive claims cite publish/update dates

## Key Files

### Track B (Technical)

- `/Server/src/core/haversine.ts` - Distance calculation
- `/Server/src/core/geo.ts` - POI selection logic
- `/Server/src/routes/answer.ts` - API endpoint
- `/WebDemo/main.ts` - UI logic and interaction
- `/WebDemo/styles.css` - Visual styling

### Track A (Strategic)

- `/Docs/00-exec-summary.md` - Executive summary
- `/Docs/05-application-outline.md` - CCMF application (paste-ready)
- `/Docs/07-iterative-tasks.md` - Task breakdown
- `/Docs/08-risk-register.md` - Risk mitigation

## To-dos

### Track B — Technical MVP

- [ ] Create root folder structure, .gitignore, .editorconfig, README.md, SPEC.md, /Docs, /Ops
- [ ] Create root package.json with workspaces and dev/test scripts
- [ ] Set up /Server with package.json, tsconfig.json, and folder structure
- [ ] Implement haversine distance calculation in /Server/src/core/haversine.ts
- [ ] Implement selectPOI with 3 HK POIs in /Server/src/core/geo.ts
- [ ] Create /answer endpoint in Express with latency measurement
- [ ] Write Vitest tests for haversine and selectPOI functions
- [ ] Set up /WebDemo with Vite, package.json, tsconfig.json, index.html
- [ ] Create WebDemo UI: anchor dot, draggable card, SVG leader line, styles
- [ ] Implement fetch /answer, latency measurement, card update, tint logic
- [ ] Create api.http samples and field-notes.md template

### Track A — Strategic Documents

- [ ] Create 00-exec-summary.md with product vision and business case
- [ ] Create 01-business-canvas.md with users, pains, gains, use cases
- [ ] Create 02-competitor-matrix.md with vendor comparison table
- [ ] Create 03-trends-devices.md with AR/MR market analysis
- [ ] Create 04-cyberport-map.md with CCMF/CIP program details
- [ ] Create 05-application-outline.md (paste-ready CCMF application)
- [ ] Create 06-tech-plan.md with stack and integration details
- [ ] Create 07-iterative-tasks.md with 12-16 development tasks
- [ ] Create 08-risk-register.md with top 8 risks and mitigations
- [ ] Create 09-60sec-pitch.md with investor pitch script
- [ ] Create 10-agentic-research-plan.md with research steps for browser agent



