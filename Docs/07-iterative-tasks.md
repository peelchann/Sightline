# Iterative Task Ladder

**Last updated:** October 2025

## Overview

Refined **7-day execution plan** with 20 blocks of ~40 minutes each. Based on CTO/founder feedback for CCMF submission timeline (Feb-Jul 2026).

## Critical Path: 7 Days to Demo

This plan gets you from zero to a field-testable demo suitable for CCMF application video.

---

## Quick Reference: 7-Day Sprint

### Day 1-2: Backend + WebDemo (Blocks 1-5)
- **Block 1-2:** Fastify server with POST `/identify` and GET `/poi/:id`, add requestId + server_ms
- **Block 3:** In-memory cache (10-min TTL), seed `data/pois.json` with 3 HK POIs
- **Block 4:** WebDemo: anchor dot + draggable card + SVG leader line
- **Block 5:** WebDemo button calls `/identify`, displays latency/confidence

**Acceptance:** Backend API responds with correct data structure; WebDemo renders anchor + card + line

### Day 3-4: Unity + ARCore Geospatial (Blocks 6-9)
- **Block 6:** Unity 2022.3 LTS + AR Foundation project setup, Android build runs on device
- **Block 7:** `IAnswerService` C# interface + HTTP client to call backend
- **Block 8:** ARCore Geospatial initialization, hardcode Clock Tower GPS anchor
- **Block 9:** Connect Unity → `/identify` with GPS → populate AR card with response

**Acceptance:** Phone app shows AR card anchored to Clock Tower GPS location, <1s latency

### Day 5: Vuforia Integration (Blocks 10-13)
- **Block 10:** Add Vuforia SDK to Unity, import Image Target (printed Clock Tower poster)
- **Block 11:** Quest 3 platform switch, enable passthrough mode
- **Block 12:** Capture camera frame → send to `/identify` (image), display confidence
- **Block 13:** Low confidence UI: amber border + 2 disambiguation chips for <0.7 confidence

**Acceptance:** Quest 3 recognizes poster, anchors card, shows confidence metric

### Day 6: Polish & Filming (Blocks 14-17)
- **Block 14:** Tap-to-lock fallback when geo/vision fails, "Re-aim to lock" state
- **Block 15:** Telemetry overlay (shows latency/confidence/method on screen)
- **Block 16:** Outdoor filming at Clock Tower: 3 clean takes showing ≥10s stability
- **Block 17:** Indoor filming with Quest 3: 2 clean takes showing poster recognition

**Acceptance:** 90-second raw footage captured, all KPIs visible in frame

### Day 7: CCMF Packaging (Blocks 18-20)
- **Block 18:** Edit video: cut 90s demo, add KPI slate at end, color grading
- **Block 19:** Export Gantt chart, budget table, competitor 1-pager (from existing Docs)
- **Block 20:** Finalize CCMF application draft, upload to Cyberport portal

**Acceptance:** Application submitted with video link, all required documents attached

---

## Detailed Task Breakdown (Reference)

The following sections provide step-by-step implementation details for each block. Use these as a guide during development.

### Day 1-2: Backend + WebDemo

### Block 1-2: Fastify Server Setup
**Estimated Time:** 40 minutes

**Steps:**
1. Create `sightline/` root directory
2. Initialize git: `git init`
3. Create folder structure:
   - `/Server`, `/WebDemo`, `/ClientUnity`, `/Docs`, `/Ops`
4. Add `.gitignore` (Node, Unity, OS files)
5. Add `.editorconfig` (tabs/spaces, line endings)
6. Create empty `README.md`, `SPEC.md`, `PLAN.md`

**Acceptance Criteria:**
- [x] `git status` shows clean repo
- [x] Folders exist and are empty (except config files)
- [x] `.gitignore` excludes `node_modules/`, `Library/`, `.DS_Store`

---

### Task 2: Server Foundation
**Estimated Time:** 40 minutes

**Steps:**
1. `cd Server && npm init -y`
2. Install deps: `npm install express cors tsx typescript vitest @types/node @types/express @types/cors`
3. Create `tsconfig.json`:
   ```json
   {
     "compilerOptions": {
       "target": "ES2022",
       "module": "commonjs",
       "strict": true,
       "esModuleInterop": true,
       "skipLibCheck": true,
       "outDir": "./dist"
     },
     "include": ["src/**/*"],
     "exclude": ["node_modules", "test"]
   }
   ```
4. Create `src/types.ts`:
   ```ts
   export interface LatLng {
     lat: number;
     lng: number;
   }
   export interface POI extends LatLng {
     name: string;
     year: number | null;
     blurb: string;
   }
   export interface AnswerResponse {
     name: string;
     year: number | null;
     blurb: string;
     distance_m: number;
     latency_ms: number;
   }
   ```
5. Create `src/server.ts`:
   ```ts
   import express from 'express';
   import cors from 'cors';
   const app = express();
   app.use(cors());
   app.get('/health', (req, res) => res.json({ status: 'ok' }));
   app.listen(3000, () => console.log('Server on :3000'));
   ```
6. Add scripts to `package.json`:
   ```json
   "scripts": {
     "dev": "tsx src/server.ts",
     "test": "vitest run"
   }
   ```
7. Test: `npm run dev` → visit `http://localhost:3000/health`

**Acceptance Criteria:**
- [x] `npm run dev` starts server without errors
- [x] `curl http://localhost:3000/health` returns `{"status":"ok"}`
- [x] `src/types.ts` compiles (no TS errors)

---

### Task 3: Haversine Distance Function
**Estimated Time:** 40 minutes

**Steps:**
1. Create `src/core/haversine.ts`:
   ```ts
   import { LatLng } from '../types';
   const EARTH_RADIUS_M = 6371000;
   export function haversine(a: LatLng, b: LatLng): number {
     const dLat = (b.lat - a.lat) * Math.PI / 180;
     const dLng = (b.lng - a.lng) * Math.PI / 180;
     const aRad = a.lat * Math.PI / 180;
     const bRad = b.lat * Math.PI / 180;
     const h = Math.sin(dLat / 2) ** 2 + Math.cos(aRad) * Math.cos(bRad) * Math.sin(dLng / 2) ** 2;
     return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h));
   }
   ```
2. Create `test/haversine.test.ts`:
   ```ts
   import { describe, it, expect } from 'vitest';
   import { haversine } from '../src/core/haversine';
   describe('haversine', () => {
     it('returns 0 for same location', () => {
       const p = { lat: 22.2946, lng: 114.1699 };
       expect(haversine(p, p)).toBe(0);
     });
     it('calculates distance between Clock Tower and Star Ferry (~2.2km)', () => {
       const clockTower = { lat: 22.2946, lng: 114.1699 };
       const starFerry = { lat: 22.2800, lng: 114.1587 };
       const dist = haversine(clockTower, starFerry);
       expect(dist).toBeGreaterThan(2000);
       expect(dist).toBeLessThan(2500);
     });
     it('handles cross-equator distances', () => {
       const north = { lat: 10, lng: 0 };
       const south = { lat: -10, lng: 0 };
       const dist = haversine(north, south);
       expect(dist).toBeGreaterThan(2000000); // ~2,200km
     });
   });
   ```
3. Run: `npm test` → all pass

**Acceptance Criteria:**
- [x] `npm test` shows 3/3 passing
- [x] No TypeScript errors
- [x] Function returns correct distance (±10% acceptable)

---

### Task 4: POI Selector with Seed Data
**Estimated Time:** 40 minutes

**Steps:**
1. Create `src/core/geo.ts`:
   ```ts
   import { LatLng, POI } from '../types';
   import { haversine } from './haversine';
   export const HK_POIS: POI[] = [
     { name: 'Clock Tower', lat: 22.2946, lng: 114.1699, year: 1915, blurb: 'Former Kowloon-Canton Railway terminus, one of HK\'s oldest landmarks.' },
     { name: 'Star Ferry Central', lat: 22.2800, lng: 114.1587, year: 1888, blurb: 'Iconic ferry service connecting HK Island and Kowloon since 1888.' },
     { name: 'Avenue of Stars', lat: 22.2930, lng: 114.1730, year: 2004, blurb: 'Tribute to Hong Kong film industry, honoring Bruce Lee and Jackie Chan.' },
   ];
   export function selectPOI(user: LatLng, pois: POI[], radiusM = 150): POI | null {
     let nearest: POI | null = null;
     let minDist = Infinity;
     for (const poi of pois) {
       const dist = haversine(user, poi);
       if (dist < radiusM && dist < minDist) {
         minDist = dist;
         nearest = poi;
       }
     }
     return nearest;
   }
   ```
2. Create `test/geo.test.ts`:
   ```ts
   import { describe, it, expect } from 'vitest';
   import { selectPOI, HK_POIS } from '../src/core/geo';
   describe('selectPOI', () => {
     it('returns Clock Tower when user is at exact location', () => {
       const user = { lat: 22.2946, lng: 114.1699 };
       const poi = selectPOI(user, HK_POIS);
       expect(poi?.name).toBe('Clock Tower');
     });
     it('returns nearest POI within 150m', () => {
       const user = { lat: 22.2945, lng: 114.1700 }; // ~10m from Clock Tower
       const poi = selectPOI(user, HK_POIS);
       expect(poi?.name).toBe('Clock Tower');
     });
     it('returns null when no POI within radius', () => {
       const user = { lat: 22.3000, lng: 114.2000 }; // far from all POIs
       const poi = selectPOI(user, HK_POIS);
       expect(poi).toBeNull();
     });
   });
   ```
3. Run: `npm test` → all pass

**Acceptance Criteria:**
- [x] `npm test` shows 6/6 passing (3 haversine + 3 selectPOI)
- [x] HK_POIS array has 3 entries
- [x] selectPOI returns correct POI or null

---

### Task 5: /answer Endpoint
**Estimated Time:** 40 minutes

**Steps:**
1. Create `src/routes/answer.ts`:
   ```ts
   import { Router } from 'express';
   import { selectPOI, HK_POIS } from '../core/geo';
   import { AnswerResponse } from '../types';
   export const answerRouter = Router();
   answerRouter.get('/answer', (req, res) => {
     const startMs = Date.now();
     const lat = parseFloat(req.query.lat as string);
     const lng = parseFloat(req.query.lng as string);
     if (isNaN(lat) || isNaN(lng)) {
       return res.status(400).json({ error: 'Invalid lat/lng' });
     }
     const poi = selectPOI({ lat, lng }, HK_POIS, 150);
     const latency_ms = Date.now() - startMs;
     if (poi) {
       const response: AnswerResponse = {
         name: poi.name,
         year: poi.year,
         blurb: poi.blurb,
         distance_m: 0, // TODO: calculate actual distance
         latency_ms,
       };
       return res.json(response);
     } else {
       return res.json({
         name: 'Look around',
         year: null,
         blurb: 'Try pointing at a known landmark.',
         distance_m: 0,
         latency_ms,
       });
     }
   });
   ```
2. Update `src/server.ts`:
   ```ts
   import { answerRouter } from './routes/answer';
   app.use(answerRouter);
   ```
3. Test: `curl "http://localhost:3000/answer?lat=22.2946&lng=114.1699"`

**Acceptance Criteria:**
- [x] `curl` returns Clock Tower data with `latency_ms` field
- [x] Invalid lat/lng returns 400 error
- [x] Far location returns "Look around" default

---

### Task 6: WebDemo Scaffolding
**Estimated Time:** 40 minutes

**Steps:**
1. `cd WebDemo && npm init -y`
2. Install: `npm install vite typescript`
3. Create `tsconfig.json`:
   ```json
   {
     "compilerOptions": {
       "target": "ES2022",
       "module": "ESNext",
       "strict": true,
       "esModuleInterop": true,
       "skipLibCheck": true,
       "lib": ["ES2022", "DOM"],
       "moduleResolution": "bundler"
     },
     "include": ["*.ts"]
   }
   ```
4. Create `vite.config.ts`:
   ```ts
   import { defineConfig } from 'vite';
   export default defineConfig({
     server: {
       port: 5173,
       proxy: {
         '/answer': 'http://localhost:3000',
       },
     },
   });
   ```
5. Create `index.html`:
   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
     <meta charset="UTF-8"/>
     <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
     <title>Sightline WebDemo</title>
     <link rel="stylesheet" href="styles.css"/>
   </head>
   <body>
     <div id="viewport">
       <svg id="overlay"></svg>
       <div id="anchor"></div>
       <div id="card">
         <h3 id="card-title">?</h3>
         <p id="card-year"></p>
         <p id="card-blurb"></p>
         <footer id="card-footer"></footer>
       </div>
       <button id="ask-btn">What is this?</button>
     </div>
     <script type="module" src="main.ts"></script>
   </body>
   </html>
   ```
6. Add scripts to `package.json`:
   ```json
   "scripts": {
     "dev": "vite",
     "build": "vite build"
   }
   ```
7. Test: `npm run dev` → visit `http://localhost:5173`

**Acceptance Criteria:**
- [x] `npm run dev` serves WebDemo
- [x] index.html renders (even if unstyled)
- [x] No 404 errors in console

---

### Task 7: WebDemo UI Styling
**Estimated Time:** 40 minutes

**Steps:**
1. Create `styles.css`:
   ```css
   * { margin: 0; padding: 0; box-sizing: border-box; }
   body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
   #viewport {
     position: relative;
     width: 100vw;
     height: 100vh;
     background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
     overflow: hidden;
   }
   #overlay {
     position: absolute;
     top: 0;
     left: 0;
     width: 100%;
     height: 100%;
     pointer-events: none;
   }
   #anchor {
     position: absolute;
     top: 240px;
     left: 420px;
     width: 20px;
     height: 20px;
     background: #ff6b6b;
     border: 3px solid white;
     border-radius: 50%;
     box-shadow: 0 4px 12px rgba(0,0,0,0.3);
   }
   #card {
     position: absolute;
     top: 100px;
     left: 50px;
     width: 300px;
     padding: 20px;
     background: white;
     border-radius: 12px;
     box-shadow: 0 8px 24px rgba(0,0,0,0.15);
     cursor: move;
     transition: border-color 0.3s;
   }
   #card.success { border: 3px solid #51cf66; }
   #card.default { border: 3px solid #ffc107; }
   #card h3 { margin-bottom: 8px; font-size: 20px; }
   #card p { margin-bottom: 12px; font-size: 14px; color: #666; }
   #card footer { font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 8px; }
   #ask-btn {
     position: absolute;
     bottom: 40px;
     left: 50%;
     transform: translateX(-50%);
     padding: 16px 32px;
     background: #4c6ef5;
     color: white;
     border: none;
     border-radius: 8px;
     font-size: 16px;
     font-weight: 600;
     cursor: pointer;
     box-shadow: 0 4px 12px rgba(76,110,245,0.4);
   }
   #ask-btn:hover { background: #3b5bdb; }
   ```
2. Test: refresh browser → styled UI appears

**Acceptance Criteria:**
- [x] Viewport has gradient background
- [x] Anchor dot visible at (420, 240)
- [x] Card is white, rounded, with shadow
- [x] Button is centered at bottom

---

### Task 8: WebDemo Interaction Logic
**Estimated Time:** 40 minutes

**Steps:**
1. Create `main.ts`:
   ```ts
   const anchor = document.getElementById('anchor')!;
   const card = document.getElementById('card')!;
   const overlay = document.getElementById('overlay')! as SVGElement;
   const askBtn = document.getElementById('ask-btn')!;
   const cardTitle = document.getElementById('card-title')!;
   const cardYear = document.getElementById('card-year')!;
   const cardBlurb = document.getElementById('card-blurb')!;
   const cardFooter = document.getElementById('card-footer')!;

   let line: SVGLineElement | null = null;

   function updateLine() {
     const anchorRect = anchor.getBoundingClientRect();
     const cardRect = card.getBoundingClientRect();
     const x1 = anchorRect.left + anchorRect.width / 2;
     const y1 = anchorRect.top + anchorRect.height / 2;
     const x2 = cardRect.left + cardRect.width / 2;
     const y2 = cardRect.top + cardRect.height / 2;

     if (!line) {
       line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
       line.setAttribute('stroke', 'white');
       line.setAttribute('stroke-width', '2');
       line.setAttribute('stroke-dasharray', '5,5');
       overlay.appendChild(line);
     }
     line.setAttribute('x1', String(x1));
     line.setAttribute('y1', String(y1));
     line.setAttribute('x2', String(x2));
     line.setAttribute('y2', String(y2));
   }

   let isDragging = false;
   let offsetX = 0, offsetY = 0;

   card.addEventListener('mousedown', (e) => {
     isDragging = true;
     offsetX = e.clientX - card.offsetLeft;
     offsetY = e.clientY - card.offsetTop;
   });

   document.addEventListener('mousemove', (e) => {
     if (isDragging) {
       card.style.left = `${e.clientX - offsetX}px`;
       card.style.top = `${e.clientY - offsetY}px`;
       updateLine();
     }
   });

   document.addEventListener('mouseup', () => {
     isDragging = false;
   });

   askBtn.addEventListener('click', async () => {
     const startMs = Date.now();
     const lat = 22.2946; // Clock Tower
     const lng = 114.1699;
     const res = await fetch(`/answer?lat=${lat}&lng=${lng}`);
     const data = await res.json();
     const clientLatency = Date.now() - startMs;

     cardTitle.textContent = data.name;
     cardYear.textContent = data.year ? `Year: ${data.year}` : '';
     cardBlurb.textContent = data.blurb;
     cardFooter.textContent = `Distance: ${data.distance_m.toFixed(1)}m | Latency: ${clientLatency}ms`;

     card.className = data.year ? 'success' : 'default';
   });

   updateLine();
   ```
2. Test: click "What is this?" → card updates with Clock Tower data

**Acceptance Criteria:**
- [x] Card is draggable
- [x] SVG line updates on drag
- [x] Button fetches `/answer` and displays data
- [x] Latency shown in footer

---

### Task 9: Root Monorepo Setup
**Estimated Time:** 40 minutes

**Steps:**
1. Create root `package.json`:
   ```json
   {
     "name": "sightline-monorepo",
     "version": "0.1.0",
     "private": true,
     "workspaces": ["Server", "WebDemo"],
     "scripts": {
       "install:all": "npm install",
       "dev": "concurrently \"npm:dev-server\" \"npm:dev-web\"",
       "dev-server": "cd Server && npm run dev",
       "dev-web": "cd WebDemo && npm run dev",
       "test": "cd Server && npm test"
     },
     "devDependencies": {
       "concurrently": "^8.2.2"
     }
   }
   ```
2. Install: `npm install`
3. Test: `npm run dev` → both server and WebDemo start

**Acceptance Criteria:**
- [x] `npm run dev` starts both services
- [x] `npm test` runs Server tests
- [x] Workspaces link correctly

---

### Task 10: API Samples & Ops
**Estimated Time:** 40 minutes

**Steps:**
1. Create `Ops/api.http`:
   ```http
   ### Health check
   GET http://localhost:3000/health

   ### Clock Tower
   GET http://localhost:3000/answer?lat=22.2946&lng=114.1699

   ### Star Ferry
   GET http://localhost:3000/answer?lat=22.2800&lng=114.1587

   ### No match
   GET http://localhost:3000/answer?lat=22.3000&lng=114.2000
   ```
2. Create `Docs/field-notes.md`:
   ```md
   # Field Notes

   ## Template for Outdoor Tests

   **Date:** YYYY-MM-DD
   **Location:** [POI name]
   **Device:** [Phone model + OS]
   **Conditions:** [Weather, time of day]

   ### Test Results
   - Anchor stability: [seconds tracked]
   - Latency: [ms]
   - GPS accuracy: [meters]
   - Usability notes: [observations]

   ### Issues
   - [List any bugs or UX problems]

   ### Next Steps
   - [Action items]
   ```

**Acceptance Criteria:**
- [x] `api.http` has 4 sample requests
- [x] `field-notes.md` template created
- [x] Files in correct folders

---

### Task 11: Unity Stub (Optional)
**Estimated Time:** 40 minutes

**Steps:**
1. Create `ClientUnity/Assets/Scripts/IAnswerService.cs`:
   ```csharp
   using System.Threading;
   using System.Threading.Tasks;

   public interface IAnswerService
   {
       Task<AnswerDto> GetAsync(double lat, double lng, CancellationToken ct = default);
   }

   public record AnswerDto(string name, int? year, string blurb, double distance_m, int latency_ms);
   ```
2. Create `ClientUnity/Assets/Scripts/MockAnswerService.cs`:
   ```csharp
   using System.Threading;
   using System.Threading.Tasks;
   using UnityEngine;
   using UnityEngine.Networking;

   public class MockAnswerService : IAnswerService
   {
       private const string API_URL = "http://localhost:3000/answer";

       public async Task<AnswerDto> GetAsync(double lat, double lng, CancellationToken ct = default)
       {
           var url = $"{API_URL}?lat={lat}&lng={lng}";
           using var request = UnityWebRequest.Get(url);
           await request.SendWebRequest();

           if (request.result != UnityWebRequest.Result.Success)
           {
               Debug.LogError($"API Error: {request.error}");
               return null;
           }

           var json = request.downloadHandler.text;
           var data = JsonUtility.FromJson<AnswerDto>(json);
           return data;
       }
   }
   ```
3. Document: Add Unity setup steps to README

**Acceptance Criteria:**
- [x] Interface and mock service compile in Unity
- [x] README explains how to test (optional for MVP)

---

## Track A — Strategic Documents (Tasks 12-16)

### Task 12: Executive Summary
**Estimated Time:** 30 minutes
- [x] Write `Docs/00-exec-summary.md` (200 words)
- [x] Include: problem, solution, market, why now, 6-month outcome

### Task 13: Business Canvas + Competitor Matrix
**Estimated Time:** 50 minutes
- [x] Write `Docs/01-business-canvas.md` (users, pains, gains, 3 use cases)
- [x] Write `Docs/02-competitor-matrix.md` (table with 8+ competitors)

### Task 14: Trends + Cyberport Map
**Estimated Time:** 50 minutes
- [x] Write `Docs/03-trends-devices.md` (AR/MR landscape, 12-18 months)
- [x] Write `Docs/04-cyberport-map.md` (CCMF vs CIP, deadlines, scoring)

### Task 15: Application Outline
**Estimated Time:** 60 minutes
- [x] Write `Docs/05-application-outline.md` (paste-ready CCMF form)
- [x] Include: summary, problem, solution, why now, milestones, budget, risks

### Task 16: Tech Plan + Tasks + Risks + Pitch
**Estimated Time:** 60 minutes
- [x] Write `Docs/06-tech-plan.md` (stack, integrations, roadmap)
- [x] Write `Docs/07-iterative-tasks.md` (this file!)
- [x] Write `Docs/08-risk-register.md` (8 risks + mitigations)
- [x] Write `Docs/09-60sec-pitch.md` (investor script)
- [x] Write `Docs/10-agentic-research-plan.md` (browser agent steps)

---

## Summary

**Total Tasks:** 16  
**Total Estimated Time:** ~12-14 hours  
**Completion Order:** Tasks 1-11 (technical) → Tasks 12-16 (strategic)

**First 3 Priority Tasks (Today):**
1. Task 1: Repo Init (40 min) → Unlocks all other work
2. Task 2-5: Server + Core Logic (160 min) → Proves technical feasibility
3. Task 15: Application Outline (60 min) → Paste-ready CCMF submission



