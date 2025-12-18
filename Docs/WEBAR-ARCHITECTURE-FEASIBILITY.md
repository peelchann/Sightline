# Sightline WebAR Technical Feasibility Assessment

**Date:** December 2024  
**Purpose:** Technical architecture and feasibility analysis for CCMF MVP

---

## Executive Summary

| Aspect | Feasibility | Score |
|--------|-------------|-------|
| **Core AR (anchoring cards to exhibits)** | ✅ Feasible with image targets | 8/10 |
| **AI-personalized responses (RAG)** | ✅ Fully feasible | 9/10 |
| **CMS for curators** | ✅ Fully feasible | 9/10 |
| **Analytics dashboard** | ✅ Fully feasible | 9/10 |
| **Indoor visual anchoring (markerless)** | ⚠️ Limited in pure WebAR | 5/10 |
| **Zero-install WebAR** | ✅ Feasible | 8/10 |
| **Headset support (Quest 3)** | ⚠️ Separate native build needed | 6/10 |

**Overall: WebAR MVP is absolutely viable for CCMF scope. Indoor image-target anchoring is the key technical choice.**

---

## Product Requirements (from CCMF Application)

Sightline is an AI-native Augmented Reality (AR) platform that turns static venue information (labels, wall text and linear audio guides) into dynamic, personalized "on-object answers" anchored to exhibits.

**Core Features:**
1. AR overlay cards anchored to physical objects/exhibits
2. Object/exhibit recognition (to know what user is looking at)
3. CMS for curators to upload content
4. AI orchestration for personalized responses (RAG-based)
5. Analytics dashboard (TTFV, anchor lock success, dwell time, Q&A volume)
6. User preference learning
7. Bilingual UX (EN/ZH)
8. Zero-install mobile WebAR
9. Future support for mixed-reality headsets

---

## Critical Technical Pivot: GPS → Image Targets

Current demo uses **GPS-based AR.js** (outdoor landmarks). For **indoor museums/schools**, switch to **image-target-based anchoring**:

| Approach | Use Case | WebAR Support | Stability |
|----------|----------|---------------|-----------|
| **GPS + Compass** | Outdoor landmarks | ✅ AR.js | ±10-50m drift |
| **Image Targets (QR/Markers)** | Indoor exhibits | ✅ MindAR / AR.js NFT | Very stable |
| **Markerless Visual SLAM** | Walk-around tracking | ⚠️ 8th Wall only ($$$) | Good |
| **ARCore Geospatial** | Google-scanned venues | ❌ Not in WebAR | Excellent |

**Recommendation for CCMF MVP: Use Image Targets (MindAR or AR.js NFT)**

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              SIGHTLINE ARCHITECTURE                              │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                        CLIENT (Mobile Browser)                            │    │
│  │                                                                           │    │
│  │  ┌───────────────┐  ┌───────────────┐  ┌───────────────────────────┐    │    │
│  │  │   Camera &    │  │   WebAR       │  │      UI Layer             │    │    │
│  │  │   Sensors     │  │   Engine      │  │  (React/Vanilla)          │    │    │
│  │  │               │  │               │  │                           │    │    │
│  │  │ • getUserMedia│  │ • Three.js    │  │ • Onboarding flow         │    │    │
│  │  │ • DeviceOrient│  │ • MindAR      │  │ • AR card overlays        │    │    │
│  │  │ • Geolocation │  │   (image trk) │  │ • Q&A input panel         │    │    │
│  │  │               │  │ • A-Frame     │  │ • Language/level select   │    │    │
│  │  └───────┬───────┘  └───────┬───────┘  └───────────────┬───────────┘    │    │
│  │          │                  │                          │                 │    │
│  │          └──────────────────┴──────────────────────────┘                 │    │
│  │                              │                                            │    │
│  │                              ▼                                            │    │
│  │              ┌───────────────────────────────────┐                       │    │
│  │              │      State Manager (Zustand)      │                       │    │
│  │              │  • Current exhibit / anchor       │                       │    │
│  │              │  • User preferences (lang/level)  │                       │    │
│  │              │  • Session analytics buffer       │                       │    │
│  │              └───────────────────────────────────┘                       │    │
│  │                              │                                            │    │
│  └──────────────────────────────┼────────────────────────────────────────────┘    │
│                                 │                                                  │
│                                 │ HTTPS / WebSocket                                │
│                                 ▼                                                  │
│  ┌──────────────────────────────────────────────────────────────────────────────┐ │
│  │                         BACKEND (Node.js / Bun)                               │ │
│  │                                                                               │ │
│  │  ┌─────────────────────┐  ┌─────────────────────┐  ┌───────────────────────┐ │ │
│  │  │   API Gateway       │  │   AI Orchestrator   │  │   Analytics Engine    │ │ │
│  │  │   (Fastify/Hono)    │  │                     │  │                       │ │ │
│  │  │                     │  │ • RAG pipeline      │  │ • Event ingestion     │ │ │
│  │  │ • /api/exhibit/:id  │  │ • OpenAI/Claude API │  │ • TTFV, dwell time    │ │ │
│  │  │ • /api/ask          │  │ • Prompt templates  │  │ • Q&A volume          │ │ │
│  │  │ • /api/session      │  │ • Source grounding  │  │ • Anchor lock success │ │ │
│  │  │ • /api/analytics    │  │ • Fallback logic    │  │                       │ │ │
│  │  └─────────┬───────────┘  └─────────┬───────────┘  └───────────┬───────────┘ │ │
│  │            │                        │                          │              │ │
│  │            └────────────────────────┴──────────────────────────┘              │ │
│  │                                     │                                         │ │
│  │                                     ▼                                         │ │
│  │  ┌──────────────────────────────────────────────────────────────────────────┐│ │
│  │  │                          DATA LAYER                                       ││ │
│  │  │                                                                           ││ │
│  │  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────────────────┐  ││ │
│  │  │  │  PostgreSQL    │  │  Vector DB     │  │  Object Storage            │  ││ │
│  │  │  │  (Neon/Supabase│  │  (pgvector)    │  │  (Cloudflare R2/S3)        │  ││ │
│  │  │  │                │  │                │  │                            │  ││ │
│  │  │  │ • Exhibits     │  │ • Content      │  │ • Image targets            │  ││ │
│  │  │  │ • Venues       │  │   embeddings   │  │ • 3D assets                │  ││ │
│  │  │  │ • Users/prefs  │  │ • RAG index    │  │ • Media files              │  ││ │
│  │  │  │ • Analytics    │  │                │  │                            │  ││ │
│  │  │  └────────────────┘  └────────────────┘  └────────────────────────────┘  ││ │
│  │  └──────────────────────────────────────────────────────────────────────────┘│ │
│  └──────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                    │
│  ┌──────────────────────────────────────────────────────────────────────────────┐ │
│  │                              CMS DASHBOARD                                    │ │
│  │                          (Separate React App)                                 │ │
│  │                                                                               │ │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐   │ │
│  │  │  Exhibit Editor │  │  Content Mgmt   │  │  Analytics Viewer           │   │ │
│  │  │                 │  │                 │  │                             │   │ │
│  │  │ • Upload image  │  │ • Add approved  │  │ • TTFV charts               │   │ │
│  │  │   targets       │  │   knowledge     │  │ • Popular questions         │   │ │
│  │  │ • Set anchor    │  │ • Response rules│  │ • Dwell time heatmaps       │   │ │
│  │  │   points        │  │ • Bilingual     │  │ • Anchor success rates      │   │ │
│  │  │ • Preview AR    │  │   content       │  │                             │   │ │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘   │ │
│  └──────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack Detail

### Frontend (WebAR Client)

| Layer | Technology | Why | Alternative |
|-------|------------|-----|-------------|
| **AR Engine** | **MindAR.js** | Open-source, stable image tracking, A-Frame compatible, MIT license | AR.js NFT (slower), 8th Wall (paid) |
| **3D Framework** | **A-Frame 1.5+** | Declarative, easy to prototype, good for 2D cards | Three.js (more control, more code) |
| **UI Framework** | **Vanilla JS + Web Components** | Zero-install, small bundle, fast load | React (heavier) |
| **State** | **Zustand** | Lightweight (1KB), works without React | None (global object) |
| **Styling** | **CSS Variables + BEM** | Theme-able, maintainable | Tailwind (larger bundle) |

**Bundle Size Target:** < 500KB gzipped (critical for mobile load times)

### Backend

| Layer | Technology | Why | Alternative |
|-------|------------|-----|-------------|
| **Runtime** | **Bun** or **Node.js 20+** | Fast, modern JS runtime | Deno |
| **Framework** | **Hono** or **Fastify** | Fast, TypeScript-first, edge-ready | Express (slower) |
| **Database** | **PostgreSQL (Neon/Supabase)** | Reliable, free tier, pgvector for RAG | PlanetScale (MySQL) |
| **Vector Store** | **pgvector extension** | Same DB, simpler ops | Pinecone (separate service) |
| **AI API** | **OpenAI GPT-4o-mini** | Good balance cost/quality, vision support | Claude 3 Haiku, Gemini Flash |
| **Object Storage** | **Cloudflare R2** | Free egress, S3-compatible | AWS S3 |
| **Hosting** | **Vercel** (frontend) + **Railway/Fly.io** (backend) | Easy deploy, free tiers | Cloudflare Workers |

### CMS Dashboard

| Layer | Technology | Why |
|-------|------------|-----|
| **Framework** | **Next.js 14 (App Router)** | Fast, full-stack, good DX |
| **UI Components** | **shadcn/ui** | Beautiful, accessible, copy-paste |
| **Charts** | **Recharts** | Simple, React-native |
| **Auth** | **Clerk** or **NextAuth** | Easy multi-tenant |

---

## Key Technical Decisions

### 1. Image Target Anchoring (Indoor) — MindAR

For indoor museum/school use, use **image-target-based tracking**. MindAR is the best open-source option:

```html
<!-- MindAR integration -->
<script src="https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js"></script>

<a-scene mindar-image="imageTargetSrc: ./targets.mind; showStats: false">
  <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>
  
  <!-- Anchor #0: Dinosaur exhibit image -->
  <a-entity mindar-image-target="targetIndex: 0">
    <a-plane position="0 0.5 0" width="0.5" height="0.3" 
             material="src: #info-card; transparent: true">
    </a-plane>
  </a-entity>
</a-scene>
```

**How it works:**
1. Curator uploads exhibit photo to CMS
2. System generates `.mind` target file (offline or on-demand)
3. User opens WebAR, camera recognizes exhibit → shows AR card anchored to it

### 2. AI Orchestration (RAG)

```
┌─────────────────────────────────────────────────────────────────┐
│                     AI REQUEST FLOW                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  User asks: "How did T-Rex hunt?"                               │
│       │                                                         │
│       ▼                                                         │
│  ┌─────────────────────┐                                        │
│  │ 1. Context Injection│  ← Exhibit ID, user level, language    │
│  └──────────┬──────────┘                                        │
│             │                                                   │
│             ▼                                                   │
│  ┌─────────────────────┐                                        │
│  │ 2. RAG Retrieval    │  ← Query pgvector for relevant chunks  │
│  │    (venue-approved  │    from curator-uploaded knowledge     │
│  │     sources only)   │                                        │
│  └──────────┬──────────┘                                        │
│             │                                                   │
│             ▼                                                   │
│  ┌─────────────────────┐                                        │
│  │ 3. Prompt Assembly  │  ← System prompt + context + sources   │
│  │                     │    + user question                     │
│  └──────────┬──────────┘                                        │
│             │                                                   │
│             ▼                                                   │
│  ┌─────────────────────┐                                        │
│  │ 4. LLM Call         │  ← GPT-4o-mini / Claude Haiku          │
│  │    (grounded)       │                                        │
│  └──────────┬──────────┘                                        │
│             │                                                   │
│             ▼                                                   │
│  ┌─────────────────────┐                                        │
│  │ 5. Response Filter  │  ← Check confidence, refuse if low     │
│  │    + Fallback       │    or offer "Ask curator" option       │
│  └──────────┬──────────┘                                        │
│             │                                                   │
│             ▼                                                   │
│  AR Card displays: "T-Rex used ambush tactics..."               │
│  [Source: Museum Guide p.42]                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3. Analytics Pipeline

```javascript
// Client-side event tracking (lightweight)
const trackEvent = (event) => {
  analyticsBuffer.push({
    type: event.type,        // 'anchor_lock', 'question_asked', 'card_viewed'
    exhibitId: event.exhibitId,
    timestamp: Date.now(),
    dwell: event.dwell,      // ms since anchor lock
    meta: event.meta         // language, level, etc.
  });
  
  // Batch send every 10s or on page unload
  if (analyticsBuffer.length >= 10) flushAnalytics();
};

// Key metrics for CMS dashboard:
// - TTFV (Time To First View): landing → first anchor lock
// - Anchor Lock Success Rate: attempts / successes
// - Dwell Time: per exhibit
// - Q&A Volume: questions per session
// - Popular Questions: clustered by exhibit
```

---

## Limitations & Mitigations

| Limitation | Impact | Mitigation |
|------------|--------|------------|
| **Image targets require good lighting** | Low-light museums may fail | Add "lighting check" to onboarding; recommend exhibit-side QR fallback |
| **No markerless world tracking** | Can't freely walk around exhibit | Accept this for MVP; use multiple image targets per exhibit |
| **Browser AR less stable than native** | Occasional tracking loss | Auto-retry anchoring; show "point camera at exhibit" prompt |
| **No depth/occlusion** | AR cards don't hide behind objects | Not critical for info cards; use transparency |
| **iOS Safari quirks** | Permissions, fullscreen issues | Extensive testing + workarounds documented |
| **Large venue = many targets** | Slow load if 100+ images | Lazy-load targets by GPS zone or room selection |
| **AI latency (1-3s)** | Slow Q&A response | Show typing indicator; stream response; cache common questions |

---

## Stable Tech Stack Summary (CCMF MVP)

```
┌─────────────────────────────────────────────────────────────────┐
│                    SIGHTLINE MVP STACK                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FRONTEND (WebAR)                                               │
│  ────────────────                                               │
│  • MindAR.js (image tracking)                                   │
│  • A-Frame 1.5 (3D scene)                                       │
│  • Vanilla JS + Web Components                                  │
│  • CSS Variables                                                │
│  • Vercel (hosting)                                             │
│                                                                 │
│  BACKEND                                                        │
│  ───────                                                        │
│  • Bun + Hono (API server)                                      │
│  • PostgreSQL + pgvector (Neon)                                 │
│  • OpenAI GPT-4o-mini (RAG)                                     │
│  • Cloudflare R2 (media)                                        │
│  • Railway / Fly.io (hosting)                                   │
│                                                                 │
│  CMS DASHBOARD                                                  │
│  ─────────────                                                  │
│  • Next.js 14                                                   │
│  • shadcn/ui                                                    │
│  • Recharts                                                     │
│  • Clerk (auth)                                                 │
│  • Vercel (hosting)                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## CCMF 6-Month Deliverables

| Month | Deliverable | Tech Milestone |
|-------|-------------|----------------|
| **M1** | MVP prototype (5 exhibits, 1 venue) | MindAR + basic cards working |
| **M2** | AI Q&A v1 (RAG grounded) | Backend API + OpenAI integration |
| **M3** | CMS v0 (exhibit upload, content edit) | Next.js dashboard MVP |
| **M4** | Analytics v1 (TTFV, dwell, Q&A volume) | Event pipeline + dashboard charts |
| **M5** | Bilingual UX + preference learning | i18n + user preference storage |
| **M6** | 2 pilots (heritage + education) | Real-world testing + iteration |

---

## Verdict

**Yes, WebAR can fully deliver the Sightline CCMF MVP.** The key is:

1. **Pivot from GPS (outdoor) to Image Targets (indoor)** — MindAR is the best open-source choice
2. **Keep AR layer simple** — 2D cards, leader lines, text overlays (no complex 3D)
3. **Invest in backend AI/RAG** — this is where the "personalization magic" lives
4. **Build CMS early** — this is your B2B value prop (curator control)

The architecture is modular enough that you can later add:
- Native Quest 3 app (Unity) using the same backend APIs
- 8th Wall for markerless tracking (if budget allows)
- More advanced AI (vision models, Claude artifacts)

---

## References

- [MindAR Documentation](https://hiukim.github.io/mind-ar-js-doc/)
- [A-Frame Documentation](https://aframe.io/docs/)
- [pgvector for RAG](https://github.com/pgvector/pgvector)
- [OpenAI API](https://platform.openai.com/docs)

