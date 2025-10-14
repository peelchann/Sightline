# Sightline MVP — Spec (v0.1)

## Vision (1-liner)

On-object answers: **see → geo-anchor → ask → AR overlay**. Phones are a testbed; the product targets glasses.

## MVP Outcome (for Cyberport demo)

A 60–90s clip where:

1. An info card appears **anchored** to a landmark (geospatial or mocked).
2. User taps "What is this?" → we show `{name, year, blurb}`.
3. Card **stays attached** (leader line to target), is readable outdoors, and shows latency (ms).

## Tech Slice (v0)

- **Server**: Node/Express (TS). Endpoint `/answer?lat&lng` → returns nearest POI within 150m or a default response.
- **WebDemo**: Vite + TS; background image + **anchor dot** + **draggable card** with **leader line**. Button calls `/answer`.
- **Unity**: folder prepared; stub an `IAnswerService` to call `/answer` (implement later).

## Non-goals (v0)

- No real ARCore/ARKit integration yet (Unity is stubbed).
- No auth, no DB—just in-memory POIs.

---

## Interfaces & Contracts (LOCKED)

### API: POST `/identify`

**Purpose:** Identify POI from GPS coordinates OR image

**Request Body:**
```json
// Option A: GPS-based identification
{
  "lat": 22.2946,
  "lng": 114.1699
}

// Option B: Vision-based identification
{
  "image": "data:image/jpeg;base64,..."
}
```

**200 OK Response:**
```json
{
  "poiId": "clock_tower",
  "name": "Clock Tower",
  "confidence": 0.95,
  "requestId": "uuid-here",
  "server_ms": 142
}
```

**Default (no match):**
```json
{
  "poiId": "default",
  "name": "Look around",
  "confidence": 0.0,
  "requestId": "uuid-here",
  "server_ms": 98
}
```

### API: GET `/poi/:id`

**Purpose:** Fetch full POI details

**200 OK Response:**
```json
{
  "id": "clock_tower",
  "name": "Clock Tower",
  "aliases": ["Tsim Sha Tsui Clock Tower", "KCR Clock Tower"],
  "lat": 22.2946,
  "lng": 114.1699,
  "year": 1915,
  "blurb": "Former Kowloon-Canton Railway terminus landmark.",
  "snapshots": ["/img/clock_tower_1.jpg"],
  "bounds_m": 60
}
```

### Core functions (Server)

- `haversine(a:{lat,lng}, b:{lat,lng}): number /* meters */`
- `selectPOI(user:{lat,lng}, pois:POI[], radiusM=150): POI | null`

### Web Demo behavior

- Draws an **anchor** at `(x=420,y=240)` (mock landmark).
- Renders an **SVG leader line** from anchor to the **draggable** info card.
- Button "What is this?" calls `/answer?lat=22.2946&lng=114.1699`, displays result, and shows **latency** in the card footer.
- If default answer → card tint **amber**; else **green**.

### Unity (stub)

- `IAnswerService` (C# interface):

```csharp
public interface IAnswerService {
  Task<AnswerDto> GetAsync(double lat, double lng, CancellationToken ct = default);
}
public record AnswerDto(string name, int? year, string blurb, double distance_m, int latency_ms);
```

- Provide a dummy implementation that hits the Node API.

---

## Acceptance Criteria (v0)

- `npm run dev` serves API + WebDemo; `npm run test` passes Vitest suite.
- `/answer` returns the closest of 3 HK POIs or default.
- WebDemo shows anchor + draggable card + leader line that **tracks** the card.
- Clicking "What is this?" updates text and shows a **measured latency**.
- Repo includes **README** with run steps and **SPEC.md**.

---

## Coding Standards

- TypeScript strict mode (`"strict": true`), ESLint + Prettier (later).
- Small, pure functions in `/Server/src/core`.
- WebDemo in TS; no frameworks beyond Vite.
- Keep functions under ~60 lines; write at least 1 Vitest for core math.

---

## Iterative Roadmap (each step ~40 min)

### Milestone A — "Ask → Overlay" working (today)

1. Scaffold Node/Express (TS) + Vite WebDemo + README.
2. Implement `haversine` + `selectPOI` + seed 3 POIs (Clock Tower, Star Ferry, Avenue of Stars).
3. WebDemo: background image, anchor dot, SVG leader line, draggable card.
4. Wire `/answer` + latency measurement; default vs green tint.
5. Vitest for `haversine` and `selectPOI`.
6. Commit & tag `v0.1`.

### Milestone B — Resilience & cleanliness (next)

7. Error handling + input validation on `/answer`.
8. Simple logger (req id, ms) and `api.http` examples.
9. README polish; add "How to add a new POI".

### Milestone C — Unity hook (later this week)

10. Unity project sanity; `IAnswerService` + Android build target.
11. Simple on-screen debug to fetch `/answer` and show latency.

### Milestone D — Real AR (following sprint)

12. AR Foundation + ARCore Geospatial; place card near real Clock Tower using hardcoded WGS84.
13. Tap-to-place fallback; leader line in Unity; environment depth occlusion.

---

## Backlog (not for v0)

- Voice I/O; TTS.
- Save list; local persistence.
- iOS ARKit `ARGeoAnchor` parity.
- Segmentation (SAM-style) and target locking.
- Analytics (heatmaps/dwell).

---

## Environment & Scripts

**Node**: 18+

**Scripts (Server/package.json):**

```json
{
  "scripts": {
    "dev": "tsx src/server.ts",
    "test": "vitest run",
    "lint": "eslint ."
  }
}
```

**Scripts (workspace root suggestion):**

- Add a root `package.json` with `"workspaces": ["Server","WebDemo"]` and `"dev": "concurrently \"npm:dev-Server\" \"npm:dev-WebDemo\""`.


