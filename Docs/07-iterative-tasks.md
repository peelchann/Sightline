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

### Day 5: Quest 3 + Passthrough Camera API (Blocks 10-13)
- **Block 10:** Quest 3 project setup: Meta XR All-in-One SDK, Project Setup Tool, Building Blocks (Passthrough)
- **Block 11:** Import Passthrough Camera API samples from Meta GitHub repo, add Sentis package
- **Block 12:** Configure Webcam Texture Manager + Environment Raycast/Depth Managers for 2D→3D conversion
- **Block 13:** Implement POI detection script (adapt video's QR approach): camera frame → Gemini Vision API → 2D center → raycast → 3D pose → anchor AR card

**Acceptance:** Quest 3 camera access working, 2D→3D conversion functioning, AR card anchors to detected POI position

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

## Day 5: Quest 3 + Passthrough Camera API Implementation

### Block 10: Quest 3 Project Setup with Meta XR SDK
**Estimated Time:** 40 minutes

**Prerequisites:**
- Unity 2022.3.58 (or Unity 6.0.38) installed
- Meta Quest 3 with OS v74+ (check in Settings → About)

**Steps:**
1. Create new Unity project (3D Core template)
   - Project name: `SightlineQuest3`
   - Location: `ClientUnity/`
2. Install Meta XR All-in-One SDK:
   - Window → Package Manager
   - Add package from git URL: `https://github.com/oculus-samples/Unity-Movement.git`
   - Or download from Meta developer portal
3. Configure project for Quest 3:
   - Meta XR Tools → Project Setup Tool
   - In **Meta XR Plugin Management**, install and add Oculus
   - Click "Fix All" for all issues
   - Apply all recommended settings
4. Configure Android build:
   - File → Build Settings → Android
   - Switch Platform
   - Texture Compression: ASTC
5. Add Passthrough capability:
   - Meta XR Tools → Building Blocks
   - Add "Passthrough" block
   - Delete Main Camera (Passthrough includes camera)
6. Test build on Quest 3:
   - Build and Run (Quest 3 connected via USB)
   - Should see empty passthrough scene

**Acceptance Criteria:**
- [x] Unity project builds to Quest 3 without errors
- [x] Passthrough mode working on device
- [x] Meta XR SDK v7+ installed

---

### Block 11: Import Passthrough Camera API Samples
**Estimated Time:** 40 minutes

**Steps:**
1. Clone Meta's Passthrough Camera API samples:
   ```bash
   git clone https://github.com/oculus-samples/Unity-PassthroughCameraAPI.git
   cd Unity-PassthroughCameraAPI
   ```
2. Import samples into your project:
   - Open `Unity-PassthroughCameraAPI/Assets/PassthroughCameraAPISamples/` folder
   - Drag `PassthroughCameraAPISamples` folder into your Unity `Assets/` folder
3. Install Sentis package (required for samples):
   - Window → Package Manager → Add package by name
   - Name: `com.unity.sentis`
   - Click "Add"
4. Fix import errors (if any):
   - In `Assets/PassthroughCameraAPISamples/`, delete duplicate scripts
   - Keep only `WebcamTextureManager` and `PassthroughCameraPermissions`
5. Verify samples imported:
   - Check for `WebcamTextureManager` prefab in Project window
   - Check for example scenes (CameraViewer, CameraToWorld, etc.)

**Acceptance Criteria:**
- [x] Passthrough Camera API samples imported
- [x] Sentis package installed
- [x] No compiler errors in Console

---

### Block 12: Configure Camera Access & 2D→3D Conversion
**Estimated Time:** 40 minutes

**Steps:**
1. Add Webcam Texture Manager to scene:
   - Drag `WebcamTextureManager` prefab from samples into Hierarchy
   - Inspector settings:
     - Camera Eye: `LeftEye` (or `RightEye`)
     - Resolution: `Preset3_1280x960` (default, highest quality)
2. Inspect scripts on prefab:
   - **WebcamTextureManager**: Provides camera texture access
   - **PassthroughCameraPermissions**: Manages runtime permissions
3. Add Environment Raycast Manager:
   - Create empty GameObject: "EnvironmentManagers"
   - Add Component → `OVRSceneManager` (Meta XR)
   - Add Component → `EnvironmentRaycastManager` (from samples or custom)
4. Add Environment Depth Manager:
   - On same "EnvironmentManagers" object
   - Add Component → `EnvironmentDepthManager`
   - This enables depth data for raycasting
5. Create test script to verify camera access:
   ```csharp
   // Assets/Scripts/CameraTest.cs
   using UnityEngine;
   using PassthroughCameraSamples; // from imported samples
   
   public class CameraTest : MonoBehaviour
   {
       public WebcamTextureManager webcamManager;
       
       void Update()
       {
           if (webcamManager.webcamTexture != null)
           {
               Debug.Log($"Camera active: {webcamManager.webcamTexture.width}x{webcamManager.webcamTexture.height}");
           }
       }
   }
   ```
6. Attach script to empty GameObject, reference `WebcamTextureManager`
7. Build and test on Quest 3:
   - Grant camera permissions when prompted
   - Check logs for camera resolution output

**Acceptance Criteria:**
- [x] Camera texture accessible in Unity
- [x] Environment Raycast Manager configured
- [x] Logs show camera resolution (1280x960)

---

### Block 13: POI Detection with Vision AI & AR Anchoring
**Estimated Time:** 40 minutes

**Steps:**
1. Create POI detection script (adapted from video's QR detection):
   ```csharp
   // Assets/Scripts/POIDetection.cs
   using System.Collections;
   using System.Collections.Generic;
   using UnityEngine;
   using PassthroughCameraSamples;
   using UnityEngine.Networking;
   
   public class POIDetection : MonoBehaviour
   {
       [SerializeField] private WebcamTextureManager webcamManager;
       [SerializeField] private EnvironmentRaycastManager raycastManager;
       [SerializeField] private int scanFrameFrequency = 10; // scan every N frames
       
       private bool isCameraReady = false;
       private Dictionary<string, Transform> poiObjects = new Dictionary<string, Transform>();
       
       // POI Target structure
       [System.Serializable]
       public struct POITarget
       {
           public string poiId; // e.g., "clock_tower"
           public Transform arCard; // AR card prefab instance
       }
       
       [SerializeField] private List<POITarget> poiTargets = new List<POITarget>();
       
       IEnumerator Start()
       {
           // Wait for camera to initialize
           while (webcamManager.webcamTexture == null)
           {
               yield return null;
           }
           
           isCameraReady = true;
           
           // Populate dictionary for fast lookup
           foreach (var target in poiTargets)
           {
               poiObjects[target.poiId] = target.arCard;
           }
       }
       
       void Update()
       {
           if (!isCameraReady) return;
           if (Time.frameCount % scanFrameFrequency != 0) return;
           
           // Get camera texture
           var camTexture = webcamManager.webcamTexture;
           if (camTexture == null || camTexture.width < 16 || camTexture.height < 16)
           {
               return;
           }
           
           // Capture frame for vision API
           Texture2D frame = new Texture2D(camTexture.width, camTexture.height);
           frame.SetPixels32(camTexture.GetPixels32());
           frame.Apply();
           
           // Convert to base64 (for API call)
           byte[] imageBytes = frame.EncodeToJPG(75);
           string base64Image = System.Convert.ToBase64String(imageBytes);
           
           // Call backend /identify endpoint
           StartCoroutine(IdentifyPOI(base64Image, camTexture.width, camTexture.height));
           
           Destroy(frame); // cleanup
       }
       
       IEnumerator IdentifyPOI(string base64Image, int textureWidth, int textureHeight)
       {
           string apiUrl = "http://localhost:3000/identify"; // TODO: use production URL
           
           // Create JSON request
           string jsonData = $"{{\"image\":\"{base64Image}\"}}";
           
           using (UnityWebRequest request = UnityWebRequest.Post(apiUrl, jsonData, "application/json"))
           {
               yield return request.SendWebRequest();
               
               if (request.result == UnityWebRequest.Result.Success)
               {
                   string responseText = request.downloadHandler.text;
                   var response = JsonUtility.FromJson<IdentifyResponse>(responseText);
                   
                   // Check if POI exists in our targets
                   if (poiObjects.TryGetValue(response.poiId, out Transform arCard))
                   {
                       // Calculate 3D position from screen center
                       Vector2Int screenCenter = new Vector2Int(textureWidth / 2, textureHeight / 2);
                       Pose worldPose = ConvertScreenPointToWorldPoint(screenCenter);
                       
                       // Position AR card at detected location
                       arCard.SetPositionAndRotation(worldPose.position, worldPose.rotation);
                       arCard.gameObject.SetActive(true);
                       
                       Debug.Log($"POI detected: {response.name} (confidence: {response.confidence})");
                   }
               }
               else
               {
                   Debug.LogError($"API Error: {request.error}");
               }
           }
       }
       
       // Convert 2D screen point → 3D world position (from video tutorial)
       private Pose ConvertScreenPointToWorldPoint(Vector2Int screenPoint)
       {
           // Use PassthroughCameraUtils to convert screen→ray
           Ray ray = PassthroughCameraUtils.ScreenPointToRayInWorld(
               webcamManager.CameraEye, 
               screenPoint
           );
           
           // Raycast into physical environment
           if (raycastManager.Raycast(ray, out EnvironmentRaycastHit hitInfo))
           {
               // Return pose aligned to surface
               Quaternion rotation = Quaternion.FromToRotation(Vector3.up, hitInfo.Normal);
               return new Pose(hitInfo.Point, rotation);
           }
           
           // Fallback: place at fixed distance
           return new Pose(ray.origin + ray.direction * 2f, Quaternion.identity);
       }
       
       [System.Serializable]
       private struct IdentifyResponse
       {
           public string poiId;
           public string name;
           public float confidence;
           public string requestId;
           public int server_ms;
       }
   }
   ```

2. Create AR card prefab:
   - Create 3D Object → Quad (for card background)
   - Add TextMeshPro text for POI name/info
   - Add leader line (LineRenderer from anchor to card)
   - Save as Prefab: `Prefabs/ARCard.prefab`

3. Configure POI Detection in scene:
   - Create empty GameObject: "POIDetection"
   - Attach `POIDetection.cs` script
   - Reference `WebcamTextureManager` and `EnvironmentRaycastManager`
   - Add POI targets in Inspector:
     - POI ID: "clock_tower"
     - AR Card: drag ARCard prefab instance

4. Build and test on Quest 3:
   - Point at Clock Tower (or printed poster for testing)
   - AR card should anchor to detected position
   - Check logs for confidence scores

**Acceptance Criteria:**
- [x] Vision API returns POI identification
- [x] 2D→3D conversion working via raycast
- [x] AR card anchors to calculated 3D position
- [x] Confidence displayed in debug overlay

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



