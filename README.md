# Sightline — MVP (Ask → Overlay)

**Goal:** A tiny demo that proves the loop: **anchor → ask → overlay**.  
Phones are a testbed; the product targets **glasses**.

## Vision

On-object answers: **see → geo-anchor → ask → AR overlay**. This project is built for the **Cyberport CCMF** funding application, with a working MVP demo as supporting evidence.

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
   ├─ 06-tech-plan.md
   ├─ 07-iterative-tasks.md
   ├─ 08-risk-register.md
   ├─ 09-60sec-pitch.md
   └─ 10-agentic-research-plan.md
```

## Quick Start

```bash
# Install dependencies
npm install

# Run server (port 3000)
cd Server && npm run dev

# Run web demo (port 5173)
cd WebDemo && npm run dev
```

Open `http://localhost:5173`. Click **What is this?** to fetch `/answer`.

## API

**GET** `/answer?lat=22.2946&lng=114.1699`

Returns:
```json
{
  "name": "Clock Tower",
  "year": 1915,
  "blurb": "Former KCR terminus landmark.",
  "distance_m": 23.4,
  "latency_ms": 142
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

