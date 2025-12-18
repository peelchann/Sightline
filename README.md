# Sightline — MVP (Ask → Overlay)

**Goal:** A tiny demo that proves the loop: **anchor → ask → overlay**.  
Phones are a testbed; the product targets **glasses**.

## Vision

On-object answers: **see → geo-anchor → ask → AR overlay**. This project is built for the **Cyberport CCMF** funding application, with a working MVP demo as supporting evidence.

**Hybrid AR Anchoring Strategy:**
- **Outdoor (Phone):** ARCore Geospatial API (GPS-based, fast)
- **Indoor (Quest 3):** Passthrough Camera API + Gemini Vision (image-based, accurate)

## Project Structure

```
sightline/
├─ README.md
├─ SPEC.md                    # Technical specification
├─ PLAN.md                    # Implementation plan
├─ .editorconfig
├─ .gitignore
├─ /ClientUnity/              # Unity (ARCore/ARKit later; stub now)
├─ /WebDemo/                  # Tiny web overlay mock (anchor + leader line)
├─ /Server/                   # Node/Express (TypeScript)
├─ /Ops/                      # Docker, API samples
└─ /Docs/                     # Strategic documents for funding
   ├─ 00-exec-summary.md
   ├─ 01-business-canvas.md
   ├─ 02-competitor-matrix.md
   ├─ 03-trends-devices.md
   ├─ 04-cyberport-map.md
   ├─ 05-application-outline.md
   ├─ 06-tech-plan.md          # Includes Quest 3 Passthrough Camera API details
   ├─ 07-iterative-tasks.md     # Includes Quest 3 setup steps (Blocks 10-13)
   ├─ 08-risk-register.md
   ├─ 09-60sec-pitch.md
   ├─ 10-agentic-research-plan.md
   ├─ UPDATE-SUMMARY.md          # Changelog for hybrid AR strategy
   └─ UPDATE-SUMMARY-QUEST3.md   # Quest 3 Passthrough Camera API update
```

## Fresh Clone Setup (Any Machine)

```bash
# 1. Clone into your home directory
cd ~
mkdir -p Projects
cd Projects
git clone https://github.com/peelchann/Sightline.git
cd Sightline

# 2. Use correct Node version
nvm use  # reads .nvmrc (Node 20)

# 3. Copy environment template (if needed for future features)
cp .env.example .env

# 4. Open in Cursor/VSCode
cursor .
```

**Notes for cross-machine workflow:**
- Always clone fresh on each machine (don't copy `.git` folders)
- Cursor agent worktrees are machine-local; only push normal branches to remote
- Keep all secrets in `.env` (never commit)

## Quick Start (Development)

```bash
# WebDemo is static HTML/JS - just serve it:
cd WebDemo
python -m http.server 8000
# Open http://localhost:8000

# Or use any static server (npx serve, Live Server extension, etc.)
```

**Production:** Deployed on Vercel at `https://sightline-webar.vercel.app`

## API

### POST `/identify`
Identify POI from GPS coordinates OR image

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
  "image": "data:image/jpeg;base64,..."
}
```

**Response:**
```json
{
  "poiId": "clock_tower",
  "name": "Clock Tower",
  "confidence": 0.95,
  "requestId": "uuid-here",
  "server_ms": 142
}
```

### GET `/poi/:id`
Fetch full POI details

**Response:**
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

## Learn More

- **SPEC.md** — Technical specification and acceptance criteria
- **PLAN.md** — Implementation plan with dual-track approach
- **Docs/** — Strategic documents for Cyberport CCMF application

## Status

🚧 **In Development** — Initial MVP setup in progress

## License

MIT
