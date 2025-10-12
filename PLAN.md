# Sightline MVP + Cyberport CCMF Application

## Primary Goal

Prepare a **Cyberport CCMF funding application** with a working 90-second MVP demo as supporting evidence. Deliverables include: (1) Strategic/business documents (executive summary, competitor analysis, application outline, pitch, etc.), and (2) Technical MVP demo (Node API + WebDemo showing geo-anchored "ask → overlay" flow).

## Dual-Track Approach

- **Track A (Strategic)**: Research, document, and prepare 11 funding-ready deliverables
- **Track B (Technical)**: Build working MVP demo to support the application with measurable KPIs

## Implementation Steps

### 1. Project Structure & Configuration

Create the monorepo structure with:

- Root `package.json` with workspaces for Server and WebDemo
- `.gitignore` for Node, build artifacts, and OS files
- `.editorconfig` for consistent formatting
- `README.md` and `SPEC.md` (provided content)
- `/Docs` folder with `field-notes.md` starter
- `/Ops` folder with `api.http` for REST client samples

### 2. Server Setup (`/Server`)

**Files to create:**

- `package.json` with dependencies: `express`, `cors`, `tsx`, `typescript`, `vitest`, `@types/node`, `@types/express`, `@types/cors`
- `tsconfig.json` with strict mode enabled
- `src/types.ts` - shared types: `POI`, `LatLng`, `AnswerResponse`
- `src/core/haversine.ts` - Haversine distance formula (WGS84)
- `src/core/geo.ts` - `selectPOI()` function with 3 hardcoded HK POIs:
  - Clock Tower (22.2946, 114.1699)
  - Star Ferry Central (22.2800, 114.1587)
  - Avenue of Stars (22.2930, 114.1730)
- `src/routes/answer.ts` - GET `/answer?lat&lng` endpoint
- `src/server.ts` - Express app with CORS, routes, error handling
- `test/haversine.test.ts` - Vitest tests with 3+ cases
- `test/geo.test.ts` - Tests for `selectPOI` (exact, nearest, none in radius)

**Key logic:**

- `haversine()` returns distance in meters between two lat/lng points
- `selectPOI()` finds nearest POI within 150m radius, returns null if none found
- `/answer` endpoint measures latency, returns `{name, year, blurb, distance_m, latency_ms}` or default response

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

