# Sightline: Technical Deep Dive

**Version:** 1.0  
**Date:** December 2024  
**Purpose:** Comprehensive technical explanation for investors, technical partners, and team onboarding

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Overview](#2-product-overview)
3. [System Architecture](#3-system-architecture)
4. [Tech Stack Deep Dive](#4-tech-stack-deep-dive)
5. [Core Technical Components](#5-core-technical-components)
6. [Data Flow & Pipelines](#6-data-flow--pipelines)
7. [AI & Personalization Engine](#7-ai--personalization-engine)
8. [Analytics System](#8-analytics-system)
9. [Security & Privacy](#9-security--privacy)
10. [Performance Optimization](#10-performance-optimization)
11. [Deployment Architecture](#11-deployment-architecture)
12. [Future Extensibility](#12-future-extensibility)

---

## 1. Executive Summary

### What is Sightline?

**Sightline** is an AI-native Augmented Reality (AR) platform that transforms static venue information (museum labels, wall text, linear audio guides) into **dynamic, personalized "on-object answers"** anchored directly to physical exhibits and landmarks.

### The Core Innovation

| Traditional Experience | Sightline Experience |
|----------------------|---------------------|
| Read static label | Point phone → See personalized AR card |
| Listen to audio guide in order | Ask any question, get AI-grounded answer |
| One-size-fits-all content | Adapts to language, expertise level, interests |
| No feedback to venue | Real-time analytics on visitor engagement |

### Technical Feasibility Summary

| Capability | Feasibility | Score |
|------------|-------------|-------|
| **AR anchoring (indoor)** | ✅ Image targets with MindAR | 8/10 |
| **AI-personalized Q&A (RAG)** | ✅ Fully feasible | 9/10 |
| **CMS for curators** | ✅ Fully feasible | 9/10 |
| **Analytics dashboard** | ✅ Fully feasible | 9/10 |
| **Zero-install WebAR** | ✅ Browser-based | 8/10 |
| **Headset support (Quest 3)** | ⚠️ Requires native build | 6/10 |

---

## 2. Product Overview

### 2.1 Core Features

```
┌─────────────────────────────────────────────────────────────────┐
│                    SIGHTLINE FEATURE SET                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. AR OVERLAY CARDS                                            │
│     • Info cards anchored to physical exhibits                  │
│     • Leader lines connecting card to object                    │
│     • Auto-scaling based on distance                            │
│     • Bilingual content (EN/ZH)                                 │
│                                                                 │
│  2. OBJECT RECOGNITION                                          │
│     • Image-target based (indoor exhibits)                      │
│     • GPS-based (outdoor landmarks)                             │
│     • QR fallback for difficult lighting                        │
│                                                                 │
│  3. AI-POWERED Q&A                                              │
│     • Natural language questions                                │
│     • RAG-grounded responses (curator-approved sources)         │
│     • Confidence scoring with fallback                          │
│     • Source citation                                           │
│                                                                 │
│  4. CURATOR CMS                                                 │
│     • Upload image targets                                      │
│     • Manage knowledge base                                     │
│     • Set response rules                                        │
│     • Preview AR experience                                     │
│                                                                 │
│  5. ANALYTICS DASHBOARD                                         │
│     • Time To First View (TTFV)                                 │
│     • Dwell time per exhibit                                    │
│     • Popular questions                                         │
│     • Anchor lock success rate                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 User Journey

```
VISITOR FLOW
═══════════════════════════════════════════════════════════════════

Step 1: ENTRY
┌─────────────────┐
│  Scan QR code   │  → No app install required
│  at venue       │  → Opens in mobile browser
└────────┬────────┘
         │
         ▼
Step 2: ONBOARDING (30 seconds)
┌─────────────────┐
│  Grant camera   │  → One-time permission
│  permission     │  → Select language/level
└────────┬────────┘
         │
         ▼
Step 3: EXPLORE
┌─────────────────┐
│  Point at       │  → Camera recognizes exhibit
│  exhibit        │  → AR card appears anchored
└────────┬────────┘
         │
         ▼
Step 4: INTERACT
┌─────────────────┐
│  Tap card or    │  → AI generates personalized response
│  ask question   │  → Grounded in curator-approved content
└────────┬────────┘
         │
         ▼
Step 5: CONTINUE
┌─────────────────┐
│  Walk to next   │  → Previous card fades
│  exhibit        │  → New exhibit recognized
└─────────────────┘
```

### 2.3 Target Use Cases

| Venue Type | Primary Use Case | Key Features |
|------------|------------------|--------------|
| **Museums** | Exhibit exploration | Image targets, deep Q&A, multilingual |
| **Heritage Sites** | Landmark discovery | GPS anchoring, historical context |
| **Schools** | Educational tours | Adaptive difficulty, quiz mode |
| **Art Galleries** | Artist insights | Curator commentary, related works |
| **Cultural Events** | Festival guides | Real-time updates, crowd routing |

---

## 3. System Architecture

### 3.1 High-Level Architecture

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
│  │  │   Sensors     │  │   Engine      │  │  (Vanilla JS)             │    │    │
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
│  │                         BACKEND (Bun + Hono)                                 │ │
│  │                                                                               │ │
│  │  ┌─────────────────────┐  ┌─────────────────────┐  ┌───────────────────────┐ │ │
│  │  │   API Gateway       │  │   AI Orchestrator   │  │   Analytics Engine    │ │ │
│  │  │                     │  │                     │  │                       │ │ │
│  │  │ • /api/exhibit/:id  │  │ • RAG pipeline      │  │ • Event ingestion     │ │ │
│  │  │ • /api/ask          │  │ • OpenAI/Claude API │  │ • TTFV, dwell time    │ │ │
│  │  │ • /api/session      │  │ • Prompt templates  │  │ • Q&A volume          │ │ │
│  │  │ • /api/analytics    │  │ • Source grounding  │  │ • Anchor lock success │ │ │
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
│  │  │  │  (Neon)        │  │  (pgvector)    │  │  (Cloudflare R2)           │  ││ │
│  │  │  │                │  │                │  │                            │  ││ │
│  │  │  │ • Exhibits     │  │ • Content      │  │ • Image targets (.mind)    │  ││ │
│  │  │  │ • Venues       │  │   embeddings   │  │ • Media files              │  ││ │
│  │  │  │ • Users/prefs  │  │ • RAG index    │  │ • 3D assets                │  ││ │
│  │  │  │ • Analytics    │  │                │  │                            │  ││ │
│  │  │  └────────────────┘  └────────────────┘  └────────────────────────────┘  ││ │
│  │  └──────────────────────────────────────────────────────────────────────────┘│ │
│  └──────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                    │
│  ┌──────────────────────────────────────────────────────────────────────────────┐ │
│  │                              CMS DASHBOARD                                    │ │
│  │                          (Separate Next.js App)                               │ │
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

### 3.2 Component Responsibilities

| Component | Responsibility | Technology |
|-----------|---------------|------------|
| **WebAR Client** | Camera, AR rendering, user interaction | MindAR, A-Frame, Vanilla JS |
| **API Gateway** | Request routing, auth, rate limiting | Bun + Hono |
| **AI Orchestrator** | RAG pipeline, LLM calls, response generation | OpenAI API, pgvector |
| **Analytics Engine** | Event ingestion, aggregation, reporting | PostgreSQL, Recharts |
| **Data Layer** | Persistence, caching, file storage | Neon, Cloudflare R2 |
| **CMS Dashboard** | Curator interface for content management | Next.js, shadcn/ui |

---

## 4. Tech Stack Deep Dive

### 4.1 Frontend (WebAR Client)

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND TECH STACK                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  LAYER 1: AR ENGINE                                             │
│  ─────────────────                                              │
│  • MindAR.js (v1.2.5)                                           │
│    ├── Purpose: Image-target based tracking                     │
│    ├── License: MIT (open source)                               │
│    ├── Features: Multi-target, occlusion-aware                  │
│    └── Alternative: AR.js NFT (slower), 8th Wall (paid)         │
│                                                                 │
│  LAYER 2: 3D FRAMEWORK                                          │
│  ────────────────────                                           │
│  • A-Frame (v1.5+)                                              │
│    ├── Purpose: Declarative 3D scene management                 │
│    ├── Built on: Three.js (WebGL)                               │
│    ├── Syntax: HTML-like (<a-entity>, <a-plane>)                │
│    └── Why: Rapid prototyping, great for 2D card overlays       │
│                                                                 │
│  LAYER 3: UI FRAMEWORK                                          │
│  ────────────────────                                           │
│  • Vanilla JS + Web Components                                  │
│    ├── Purpose: Zero-dependency, fast load                      │
│    ├── Bundle target: < 500KB gzipped                           │
│    └── Why: Mobile performance critical                         │
│                                                                 │
│  LAYER 4: STATE MANAGEMENT                                      │
│  ─────────────────────────                                      │
│  • Zustand (optional, 1KB)                                      │
│    ├── Purpose: Lightweight reactive state                      │
│    ├── Features: Works without React                            │
│    └── Stores: currentExhibit, userPrefs, analyticsBuffer       │
│                                                                 │
│  LAYER 5: STYLING                                               │
│  ───────────────                                                │
│  • CSS Variables + BEM naming                                   │
│    ├── Purpose: Theme-able, maintainable                        │
│    └── Features: Dark/light mode, responsive                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Why MindAR over alternatives?

| Feature | MindAR | AR.js NFT | 8th Wall |
|---------|--------|-----------|----------|
| **License** | MIT (free) | MIT (free) | Paid ($$$) |
| **Image tracking** | ✅ Excellent | ⚠️ Slower | ✅ Excellent |
| **Multi-target** | ✅ Yes | ⚠️ Limited | ✅ Yes |
| **Markerless SLAM** | ❌ No | ❌ No | ✅ Yes |
| **A-Frame compat** | ✅ Native | ✅ Native | ⚠️ Custom |
| **Bundle size** | ~200KB | ~300KB | ~400KB |

**Decision:** MindAR for MVP (cost-effective, sufficient for indoor exhibits). Can upgrade to 8th Wall later if markerless tracking needed.

### 4.2 Backend

```
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND TECH STACK                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  RUNTIME                                                        │
│  ───────                                                        │
│  • Bun (v1.0+)                                                  │
│    ├── Why: 3x faster than Node.js, native TypeScript           │
│    ├── Alternative: Node.js 20+ (more mature ecosystem)         │
│    └── Startup time: ~25ms (vs 300ms Node)                      │
│                                                                 │
│  WEB FRAMEWORK                                                  │
│  ─────────────                                                  │
│  • Hono (v4+)                                                   │
│    ├── Why: Ultra-fast, edge-ready, TypeScript-first            │
│    ├── Features: Middleware, validation, OpenAPI                │
│    ├── Performance: 100K+ req/s on Bun                          │
│    └── Alternative: Fastify (Node), Express (legacy)            │
│                                                                 │
│  DATABASE                                                       │
│  ────────                                                       │
│  • PostgreSQL (Neon serverless)                                 │
│    ├── Why: Reliable, free tier, serverless scaling             │
│    ├── Features: pgvector extension for RAG                     │
│    ├── Connection: HTTP-based (no cold starts)                  │
│    └── Alternative: Supabase (more features), PlanetScale (MySQL)│
│                                                                 │
│  VECTOR STORE                                                   │
│  ────────────                                                   │
│  • pgvector (PostgreSQL extension)                              │
│    ├── Why: Same DB = simpler ops, no extra service             │
│    ├── Features: HNSW index, cosine similarity                  │
│    ├── Dimensions: 1536 (OpenAI ada-002)                        │
│    └── Alternative: Pinecone (managed), Qdrant (self-hosted)    │
│                                                                 │
│  AI API                                                         │
│  ──────                                                         │
│  • OpenAI GPT-4o-mini                                           │
│    ├── Why: Best cost/quality ratio, vision support             │
│    ├── Latency: 500-1500ms typical                              │
│    ├── Cost: ~$0.15/1M input tokens                             │
│    └── Alternative: Claude 3 Haiku, Gemini Flash                │
│                                                                 │
│  OBJECT STORAGE                                                 │
│  ──────────────                                                 │
│  • Cloudflare R2                                                │
│    ├── Why: Zero egress fees, S3-compatible                     │
│    ├── Use: Image targets, media, 3D assets                     │
│    └── Alternative: AWS S3 (egress fees), Vercel Blob           │
│                                                                 │
│  HOSTING                                                        │
│  ───────                                                        │
│  • Railway / Fly.io (backend)                                   │
│    ├── Why: Easy deploy, auto-scaling, global edge              │
│    ├── Free tier: 500 hours/month                               │
│    └── Alternative: Render, Vercel (frontend only)              │
│                                                                 │
│  • Vercel (frontend + CMS)                                      │
│    ├── Why: Best-in-class for Next.js, global CDN               │
│    ├── Features: Edge functions, analytics                      │
│    └── Cost: Free tier generous for MVP                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.3 CMS Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│                    CMS TECH STACK                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FRAMEWORK                                                      │
│  • Next.js 14 (App Router)                                      │
│    ├── Why: Full-stack React, server components, great DX       │
│    ├── Features: API routes, image optimization, ISR            │
│    └── Hosting: Vercel (native)                                 │
│                                                                 │
│  UI COMPONENTS                                                  │
│  • shadcn/ui                                                    │
│    ├── Why: Beautiful, accessible, copy-paste components        │
│    ├── Base: Radix UI primitives + Tailwind CSS                 │
│    └── Customization: Full control (not a library)              │
│                                                                 │
│  CHARTS                                                         │
│  • Recharts                                                     │
│    ├── Why: Simple API, React-native, responsive                │
│    └── Use: TTFV charts, dwell heatmaps, Q&A volume             │
│                                                                 │
│  AUTH                                                           │
│  • Clerk                                                        │
│    ├── Why: Easy multi-tenant, social login, MFA                │
│    ├── Features: Organization management, roles                 │
│    └── Alternative: NextAuth (self-hosted), Auth0               │
│                                                                 │
│  FILE UPLOAD                                                    │
│  • UploadThing or direct R2                                     │
│    ├── Why: Type-safe uploads, progress tracking                │
│    └── Use: Image targets, exhibit photos                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Core Technical Components

### 5.1 Image Target System (MindAR)

The core AR experience relies on **image-target tracking**. When a user points their camera at an exhibit, the system recognizes the exhibit from its visual features and anchors AR content.

```
IMAGE TARGET PIPELINE
═══════════════════════════════════════════════════════════════════

Step 1: CURATOR UPLOADS EXHIBIT PHOTO
┌─────────────────────────────────────────────────────────────────┐
│  CMS Dashboard                                                  │
│  ┌─────────────────┐                                            │
│  │  [Upload Image] │  ← Curator uploads high-res exhibit photo  │
│  │  dinosaur.jpg   │    (2000x1500px recommended)               │
│  └────────┬────────┘                                            │
│           │                                                     │
│           ▼                                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  MindAR Compiler (Server-side)                           │   │
│  │                                                          │   │
│  │  1. Extract SIFT/ORB keypoints                          │   │
│  │  2. Generate feature descriptors                        │   │
│  │  3. Build matching index                                │   │
│  │  4. Output: dinosaur.mind (binary, ~50KB)               │   │
│  └─────────────────────────────────────────────────────────┘   │
│           │                                                     │
│           ▼                                                     │
│  ┌─────────────────┐                                            │
│  │  Cloudflare R2  │  ← Store .mind file for client download   │
│  │  /targets/      │                                            │
│  │  dinosaur.mind  │                                            │
│  └─────────────────┘                                            │
└─────────────────────────────────────────────────────────────────┘

Step 2: VISITOR OPENS AR EXPERIENCE
┌─────────────────────────────────────────────────────────────────┐
│  Mobile Browser                                                 │
│                                                                 │
│  1. Load venue target bundle                                    │
│     GET /api/venue/museum-123/targets → [dino.mind, trex.mind]  │
│                                                                 │
│  2. Initialize MindAR scene                                     │
│     <a-scene mindar-image="imageTargetSrc: ./venue.mind">       │
│                                                                 │
│  3. Camera feed analyzed at 30fps                               │
│     ┌─────────────────────────────────────────────────────┐    │
│     │  Frame → Extract features → Match against targets    │    │
│     │                                                      │    │
│     │  Match found?                                        │    │
│     │  ├── YES: Calculate 6DOF pose, emit 'targetFound'    │    │
│     │  └── NO:  Continue scanning                          │    │
│     └─────────────────────────────────────────────────────┘    │
│                                                                 │
│  4. On target found:                                            │
│     • Anchor AR card to exhibit                                 │
│     • Fetch exhibit details from /api/exhibit/:id               │
│     • Display personalized content                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### MindAR Integration Code

```html
<!-- MindAR setup for image tracking -->
<script src="https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js"></script>

<a-scene 
  mindar-image="imageTargetSrc: ./venue-targets.mind; 
                maxTrack: 1;
                filterMinCF: 0.001;
                filterBeta: 1000;"
  vr-mode-ui="enabled: false"
  device-orientation-permission-ui="enabled: false">
  
  <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>
  
  <!-- Target 0: Dinosaur Exhibit -->
  <a-entity mindar-image-target="targetIndex: 0">
    <!-- AR card anchored to this exhibit -->
    <a-entity 
      id="dino-card"
      position="0 0.6 0"
      scale="0.5 0.5 0.5"
      class="ar-info-card">
      
      <!-- Card background -->
      <a-plane 
        color="#FFFFFF" 
        width="2" 
        height="1.5" 
        opacity="0.95">
      </a-plane>
      
      <!-- Title -->
      <a-text 
        value="Tyrannosaurus Rex" 
        position="0 0.5 0.01"
        color="#1a1a1a"
        width="3.5"
        align="center">
      </a-text>
      
      <!-- Description (personalized via JS) -->
      <a-text 
        id="dino-description"
        value="Loading..."
        position="0 0 0.01"
        color="#666666"
        width="3"
        align="center">
      </a-text>
      
    </a-entity>
  </a-entity>
  
</a-scene>
```

### 5.2 GPS-Based Anchoring (Outdoor)

For outdoor landmarks, Sightline uses GPS + compass for positioning:

```javascript
// GPS to 3D coordinate conversion
function gpsTo3D(userLat, userLng, poiLat, poiLng, poiAlt) {
  // Step 1: Calculate distance using Haversine formula
  const R = 6371000; // Earth radius in meters
  const φ1 = userLat * Math.PI / 180;
  const φ2 = poiLat * Math.PI / 180;
  const Δφ = (poiLat - userLat) * Math.PI / 180;
  const Δλ = (poiLng - userLng) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;

  // Step 2: Calculate bearing (direction)
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) -
            Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const bearing = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;

  // Step 3: Convert to 3D coordinates (ENU → WebGL)
  const bearingRad = bearing * Math.PI / 180;
  return {
    x: distance * Math.sin(bearingRad),      // East (+) / West (-)
    y: poiAlt,                                // Up (+) / Down (-)
    z: -distance * Math.cos(bearingRad)      // North (-Z in WebGL)
  };
}
```

### 5.3 Coordinate System Reference

```
COORDINATE SYSTEMS
═══════════════════════════════════════════════════════════════════

GPS (WGS84):
┌─────────────────────────────────────────────────────────────────┐
│  Latitude:  -90° to +90°  (South to North)                      │
│  Longitude: -180° to +180° (West to East)                       │
│  Altitude:  meters above sea level                              │
│                                                                 │
│  Example: Clock Tower                                           │
│    Lat: 22.2946° N                                              │
│    Lng: 114.1699° E                                             │
│    Alt: 7m                                                      │
└─────────────────────────────────────────────────────────────────┘

ENU (East-North-Up) - Local tangent plane:
┌─────────────────────────────────────────────────────────────────┐
│         North (+Y_enu)                                          │
│              ↑                                                  │
│              │                                                  │
│              │                                                  │
│  West ←──────┼──────→ East (+X_enu)                             │
│              │                                                  │
│              │                                                  │
│         South (-Y_enu)                                          │
│                                                                 │
│  Up: +Z_enu (out of page)                                       │
└─────────────────────────────────────────────────────────────────┘

WebGL/Three.js (Right-handed):
┌─────────────────────────────────────────────────────────────────┐
│         Up (+Y)                                                 │
│              ↑                                                  │
│              │                                                  │
│              │                                                  │
│  Left ←──────┼──────→ Right (+X)                                │
│              │╲                                                 │
│              │ ╲                                                │
│              │  ╲ Forward (-Z)                                  │
│                                                                 │
│  Camera looks down -Z axis                                      │
└─────────────────────────────────────────────────────────────────┘

Conversion: GPS → ENU → WebGL
─────────────────────────────
GPS (lat, lng, alt) 
    → ENU (east_m, north_m, up_m)
    → WebGL (east_m, up_m, -north_m)
```

---

## 6. Data Flow & Pipelines

### 6.1 Complete Request Flow

```
USER QUESTION FLOW: "How did T-Rex hunt?"
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│  MOBILE CLIENT                                                  │
│                                                                 │
│  1. User points at T-Rex exhibit                                │
│     │                                                           │
│     ▼                                                           │
│  2. MindAR detects image target → emit 'targetFound'            │
│     │                                                           │
│     ▼                                                           │
│  3. Fetch exhibit info                                          │
│     GET /api/exhibit/trex-001                                   │
│     │                                                           │
│     ▼                                                           │
│  4. Display AR card with basic info                             │
│     │                                                           │
│     ▼                                                           │
│  5. User asks: "How did T-Rex hunt?"                            │
│     │                                                           │
│     ▼                                                           │
│  6. POST /api/ask                                               │
│     {                                                           │
│       "exhibitId": "trex-001",                                  │
│       "question": "How did T-Rex hunt?",                        │
│       "context": {                                              │
│         "language": "en",                                       │
│         "level": "general",  // or "expert", "kids"             │
│         "sessionId": "sess_abc123"                              │
│       }                                                         │
│     }                                                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  API GATEWAY (Hono)                                             │
│                                                                 │
│  7. Validate request                                            │
│     • Check required fields                                     │
│     • Sanitize input                                            │
│     • Rate limit check                                          │
│     │                                                           │
│     ▼                                                           │
│  8. Route to AI Orchestrator                                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  AI ORCHESTRATOR                                                │
│                                                                 │
│  9. CONTEXT INJECTION                                           │
│     • Load exhibit metadata (name, period, artist)              │
│     • Load user preferences (language, level)                   │
│     • Load venue rules (approved sources, tone)                 │
│     │                                                           │
│     ▼                                                           │
│  10. RAG RETRIEVAL                                              │
│      Query: "T-Rex hunting behavior"                            │
│      │                                                          │
│      ▼                                                          │
│      ┌─────────────────────────────────────────────────┐       │
│      │  pgvector similarity search                      │       │
│      │                                                  │       │
│      │  SELECT content, source, similarity              │       │
│      │  FROM knowledge_chunks                           │       │
│      │  WHERE venue_id = 'museum-123'                   │       │
│      │    AND exhibit_id = 'trex-001'                   │       │
│      │  ORDER BY embedding <=> $query_embedding         │       │
│      │  LIMIT 5;                                        │       │
│      └─────────────────────────────────────────────────┘       │
│      │                                                          │
│      │  Returns:                                                │
│      │  • "T-Rex was an apex predator..." (source: curator)     │
│      │  • "Fossil evidence suggests ambush..." (source: guide)  │
│      │  • "Bite force of 12,800 lbs..." (source: research)      │
│      │                                                          │
│      ▼                                                          │
│  11. PROMPT ASSEMBLY                                            │
│      ┌─────────────────────────────────────────────────┐       │
│      │  SYSTEM: You are a museum guide at {venue}.      │       │
│      │  Answer questions about exhibits using ONLY the  │       │
│      │  provided sources. Adapt tone to {level}.        │       │
│      │                                                  │       │
│      │  CONTEXT:                                        │       │
│      │  Exhibit: Tyrannosaurus Rex skeleton             │       │
│      │  Period: Late Cretaceous (68-66 mya)             │       │
│      │  Location: Gallery B, Position 3                 │       │
│      │                                                  │       │
│      │  SOURCES:                                        │       │
│      │  [1] "T-Rex was an apex predator..."             │       │
│      │  [2] "Fossil evidence suggests ambush..."        │       │
│      │  [3] "Bite force of 12,800 lbs..."               │       │
│      │                                                  │       │
│      │  USER: How did T-Rex hunt?                       │       │
│      │                                                  │       │
│      │  Respond in {language}, at {level} level.        │       │
│      │  Cite sources as [1], [2], etc.                  │       │
│      └─────────────────────────────────────────────────┘       │
│      │                                                          │
│      ▼                                                          │
│  12. LLM CALL (OpenAI GPT-4o-mini)                              │
│      • Temperature: 0.3 (factual)                               │
│      • Max tokens: 300                                          │
│      • Latency: ~800ms                                          │
│      │                                                          │
│      ▼                                                          │
│  13. RESPONSE FILTER                                            │
│      • Check confidence (reject if too low)                     │
│      • Verify source citations                                  │
│      • Apply content policy                                     │
│      │                                                          │
│      ▼                                                          │
│  14. FORMAT RESPONSE                                            │
│      {                                                          │
│        "answer": "T-Rex was an apex predator that likely        │
│                   used ambush tactics [1][2]. With a bite       │
│                   force of 12,800 pounds [3], it could          │
│                   crush bone...",                               │
│        "sources": [                                             │
│          { "id": 1, "title": "Curator Notes", "page": 42 },     │
│          { "id": 2, "title": "Museum Guide", "section": "B3" }, │
│          { "id": 3, "title": "Research Paper", "doi": "..." }   │
│        ],                                                       │
│        "confidence": 0.92,                                      │
│        "latency_ms": 823                                        │
│      }                                                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  MOBILE CLIENT                                                  │
│                                                                 │
│  15. Display answer in AR card                                  │
│      • Show response with typing effect                         │
│      • Display source badges                                    │
│      • Show confidence indicator                                │
│      │                                                          │
│      ▼                                                          │
│  16. Track analytics event                                      │
│      {                                                          │
│        "type": "question_answered",                             │
│        "exhibitId": "trex-001",                                 │
│        "latency_ms": 823,                                       │
│        "confidence": 0.92                                       │
│      }                                                          │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Analytics Event Pipeline

```javascript
// Client-side lightweight tracking
class AnalyticsBuffer {
  constructor() {
    this.buffer = [];
    this.flushInterval = setInterval(() => this.flush(), 10000); // 10s
    window.addEventListener('beforeunload', () => this.flush());
  }

  track(event) {
    this.buffer.push({
      type: event.type,
      exhibitId: event.exhibitId,
      timestamp: Date.now(),
      sessionId: this.getSessionId(),
      data: event.data
    });

    if (this.buffer.length >= 10) {
      this.flush();
    }
  }

  async flush() {
    if (this.buffer.length === 0) return;
    
    const events = [...this.buffer];
    this.buffer = [];
    
    try {
      await fetch('/api/analytics/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events }),
        keepalive: true  // Survives page unload
      });
    } catch (e) {
      // Re-queue on failure
      this.buffer.unshift(...events);
    }
  }
}

// Event types
analytics.track({ type: 'session_start', data: { venue: 'museum-123' } });
analytics.track({ type: 'anchor_lock', exhibitId: 'trex-001', data: { ttfv_ms: 3200 } });
analytics.track({ type: 'card_viewed', exhibitId: 'trex-001', data: { dwell_ms: 45000 } });
analytics.track({ type: 'question_asked', exhibitId: 'trex-001', data: { question: '...' } });
analytics.track({ type: 'anchor_lost', exhibitId: 'trex-001', data: { reason: 'occlusion' } });
```

---

## 7. AI & Personalization Engine

### 7.1 RAG Architecture

```
RAG (Retrieval-Augmented Generation) PIPELINE
═══════════════════════════════════════════════════════════════════

INGESTION (Curator uploads content)
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  1. Raw Content Upload                                          │
│     • PDF documents                                             │
│     • Word files                                                │
│     • Plain text                                                │
│     • Structured data (JSON/CSV)                                │
│     │                                                           │
│     ▼                                                           │
│  2. Text Extraction & Chunking                                  │
│     • Extract text from documents                               │
│     • Split into ~500 token chunks                              │
│     • Preserve section/page metadata                            │
│     │                                                           │
│     ▼                                                           │
│  3. Embedding Generation                                        │
│     • Model: OpenAI text-embedding-ada-002                      │
│     • Dimensions: 1536                                          │
│     • Batch processing for efficiency                           │
│     │                                                           │
│     ▼                                                           │
│  4. Store in pgvector                                           │
│     ┌─────────────────────────────────────────────────┐        │
│     │  CREATE TABLE knowledge_chunks (                 │        │
│     │    id UUID PRIMARY KEY,                          │        │
│     │    venue_id TEXT NOT NULL,                       │        │
│     │    exhibit_id TEXT,  -- NULL for venue-wide      │        │
│     │    content TEXT NOT NULL,                        │        │
│     │    source_title TEXT,                            │        │
│     │    source_page INT,                              │        │
│     │    embedding vector(1536),                       │        │
│     │    created_at TIMESTAMPTZ DEFAULT NOW()          │        │
│     │  );                                              │        │
│     │                                                  │        │
│     │  CREATE INDEX ON knowledge_chunks               │        │
│     │    USING hnsw (embedding vector_cosine_ops);     │        │
│     └─────────────────────────────────────────────────┘        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

RETRIEVAL (User asks question)
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  1. Query Embedding                                             │
│     "How did T-Rex hunt?" → [0.023, -0.018, 0.041, ...]        │
│     │                                                           │
│     ▼                                                           │
│  2. Similarity Search                                           │
│     SELECT content, source_title, source_page,                  │
│            1 - (embedding <=> $query_embedding) AS similarity   │
│     FROM knowledge_chunks                                       │
│     WHERE venue_id = $venue_id                                  │
│       AND (exhibit_id = $exhibit_id OR exhibit_id IS NULL)      │
│     ORDER BY embedding <=> $query_embedding                     │
│     LIMIT 5;                                                    │
│     │                                                           │
│     ▼                                                           │
│  3. Reranking (optional)                                        │
│     • Cross-encoder rerank for precision                        │
│     • Filter by minimum similarity threshold (0.7)              │
│     │                                                           │
│     ▼                                                           │
│  4. Context Assembly                                            │
│     Combine top chunks into prompt context                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Personalization Dimensions

```
USER PREFERENCE SYSTEM
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│  LANGUAGE                                                       │
│  ─────────                                                      │
│  • English (en)                                                 │
│  • Traditional Chinese (zh-HK)                                  │
│  • Simplified Chinese (zh-CN)                                   │
│  • Auto-detect from browser                                     │
│                                                                 │
│  Implementation:                                                │
│  • System prompt includes: "Respond in {language}"              │
│  • UI text loaded from i18n bundle                              │
│  • Content prioritizes translated sources if available          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  EXPERTISE LEVEL                                                │
│  ────────────────                                               │
│  • Kids (ages 6-12): Simple vocabulary, fun facts               │
│  • General: Accessible explanations, some context               │
│  • Expert: Technical details, academic references               │
│                                                                 │
│  Implementation:                                                │
│  • System prompt includes expertise-specific instructions       │
│  • Response length varies: kids=short, expert=detailed          │
│  • Source selection prioritizes level-appropriate content       │
│                                                                 │
│  Example prompts:                                               │
│  Kids:   "Explain like I'm 8 years old. Use simple words."      │
│  General: "Explain clearly for a general museum visitor."       │
│  Expert: "Include technical details and academic context."      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  INTEREST AREAS (Future)                                        │
│  ────────────────────────                                       │
│  • History focus                                                │
│  • Art & aesthetics focus                                       │
│  • Science & technical focus                                    │
│  • Cultural context focus                                       │
│                                                                 │
│  Implementation:                                                │
│  • Learn from question patterns                                 │
│  • Weight RAG retrieval toward interest areas                   │
│  • Proactively surface related content                          │
└─────────────────────────────────────────────────────────────────┘
```

### 7.3 Fallback & Safety

```
CONFIDENCE & FALLBACK SYSTEM
═══════════════════════════════════════════════════════════════════

Response States:
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  GREEN (confidence > 0.8)                                       │
│  ─────────────────────────                                      │
│  • Strong RAG match                                             │
│  • Answer grounded in curator content                           │
│  • Display normally with source citations                       │
│                                                                 │
│  AMBER (confidence 0.5-0.8)                                     │
│  ──────────────────────────                                     │
│  • Partial match or inference                                   │
│  • Show with disclaimer: "Based on available information..."    │
│  • Offer "Ask curator" option                                   │
│                                                                 │
│  GREY (confidence < 0.5)                                        │
│  ─────────────────────────                                      │
│  • No good RAG match                                            │
│  • Refuse to hallucinate                                        │
│  • Response: "I don't have specific information about this.     │
│               Would you like to ask a curator?"                 │
│  • Log question for curator review                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Content Policy:
┌─────────────────────────────────────────────────────────────────┐
│  • Never contradict curator-provided facts                      │
│  • Always cite sources                                          │
│  • Refuse off-topic questions gracefully                        │
│  • No opinions on controversial topics                          │
│  • Redirect commercial queries to venue staff                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. Analytics System

### 8.1 Key Metrics

```
SIGHTLINE ANALYTICS METRICS
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│  ENGAGEMENT METRICS                                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  TTFV (Time To First View)                                      │
│  ─────────────────────────                                      │
│  Definition: Time from app open to first successful anchor lock │
│  Target: < 15 seconds                                           │
│  Calculation: timestamp(first_anchor_lock) - timestamp(app_open)│
│                                                                 │
│  Dwell Time                                                     │
│  ──────────                                                     │
│  Definition: Time spent viewing each exhibit's AR card          │
│  Target: > 30 seconds average                                   │
│  Calculation: timestamp(anchor_lost) - timestamp(anchor_lock)   │
│                                                                 │
│  Q&A Volume                                                     │
│  ──────────                                                     │
│  Definition: Number of questions asked per session              │
│  Target: > 3 questions/session                                  │
│  Breakdown: By exhibit, by language, by level                   │
│                                                                 │
│  Session Duration                                               │
│  ────────────────                                               │
│  Definition: Total time in AR experience                        │
│  Target: > 10 minutes                                           │
│                                                                 │
│  Exhibits Visited                                               │
│  ────────────────                                               │
│  Definition: Unique exhibits with successful anchor lock        │
│  Target: > 5 per session                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  TECHNICAL METRICS                                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Anchor Lock Success Rate                                       │
│  ─────────────────────────                                      │
│  Definition: % of anchor attempts that succeed                  │
│  Target: > 85%                                                  │
│  Factors: Lighting, angle, image quality, occlusion             │
│                                                                 │
│  AI Response Latency                                            │
│  ────────────────────                                           │
│  Definition: Time from question submit to answer display        │
│  Target: < 2 seconds (P95)                                      │
│  Breakdown: RAG retrieval, LLM generation, network              │
│                                                                 │
│  Frame Rate                                                     │
│  ──────────                                                     │
│  Definition: AR rendering performance                           │
│  Target: > 30 FPS                                               │
│  Measured: Client-side, sampled                                 │
│                                                                 │
│  Error Rate                                                     │
│  ──────────                                                     │
│  Definition: % of requests resulting in errors                  │
│  Target: < 1%                                                   │
│  Types: Network, auth, validation, AI service                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  BUSINESS METRICS                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Daily Active Users (DAU)                                       │
│  Weekly Active Users (WAU)                                      │
│  Sessions per User                                              │
│  Return Visitor Rate                                            │
│  Venue Coverage (exhibits with AR content)                      │
│  Popular Questions (for content improvement)                    │
│  Unanswered Questions (content gaps)                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 Dashboard Views

```
CMS ANALYTICS DASHBOARD
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│  OVERVIEW TAB                                                   │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   1,234     │  │    8.5      │  │    2.3s     │             │
│  │  Sessions   │  │  Avg Dwell  │  │  Avg TTFV   │             │
│  │   Today     │  │   (min)     │  │             │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Sessions Over Time (Line Chart)                         │   │
│  │  ▂▃▅▆▇█▇▆▅▄▃▂▁▂▃▄▅▆▇█▇▆▅▄▃                               │   │
│  │  Mon  Tue  Wed  Thu  Fri  Sat  Sun                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  EXHIBITS TAB                                                   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Exhibit            │ Views │ Dwell │ Questions │ Success│   │
│  │  ──────────────────────────────────────────────────────│   │
│  │  T-Rex Skeleton     │  423  │ 4.2m  │   156     │  92%   │   │
│  │  Mona Lisa          │  398  │ 3.8m  │   142     │  89%   │   │
│  │  Egyptian Mummy     │  356  │ 5.1m  │   189     │  87%   │   │
│  │  Dinosaur Eggs      │  289  │ 2.9m  │    78     │  94%   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Dwell Time Heatmap (Floor Plan View)                    │   │
│  │  ┌───────────────────────────────────┐                   │   │
│  │  │  █ █ ▓ ░ ░ ░ ▓ █ █               │                   │   │
│  │  │  █ ▓ ░ ░ ░ ░ ░ ▓ █               │  █ = High dwell   │   │
│  │  │  ▓ ░ ░ ░ ░ ░ ░ ░ ▓               │  ▓ = Medium       │   │
│  │  │  ░ ░ ░ ░ ░ ░ ░ ░ ░               │  ░ = Low          │   │
│  │  └───────────────────────────────────┘                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  QUESTIONS TAB                                                  │
│                                                                 │
│  Popular Questions (This Week):                                 │
│  1. "How old is this dinosaur?" (T-Rex) - 89 times              │
│  2. "Who painted this?" (Various) - 67 times                    │
│  3. "What does this symbol mean?" (Egyptian) - 54 times         │
│                                                                 │
│  Unanswered Questions (Needs Content):                          │
│  1. "Where was this found?" (Mummy) - 23 times, 0.4 confidence  │
│  2. "How much is this worth?" (Various) - 18 times, refused     │
│  3. "Can I touch it?" (Various) - 12 times, policy redirect     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. Security & Privacy

### 9.1 Data Protection

```
SECURITY ARCHITECTURE
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│  DATA CLASSIFICATION                                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PUBLIC                                                         │
│  • Venue information                                            │
│  • Exhibit metadata                                             │
│  • Published AR content                                         │
│                                                                 │
│  INTERNAL                                                       │
│  • Curator-uploaded knowledge base                              │
│  • Unpublished content                                          │
│  • Analytics aggregates                                         │
│                                                                 │
│  SENSITIVE                                                      │
│  • Session analytics (anonymized)                               │
│  • User preferences                                             │
│  • Question logs                                                │
│                                                                 │
│  CONFIDENTIAL                                                   │
│  • API keys                                                     │
│  • Database credentials                                         │
│  • Auth tokens                                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  PRIVACY MEASURES                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  LOCATION DATA                                                  │
│  • GPS coordinates rounded to 3 decimal places (±111m)          │
│  • Only transmitted when necessary (POI lookup)                 │
│  • Not stored with user identity                                │
│  • Deleted after session                                        │
│                                                                 │
│  CAMERA DATA                                                    │
│  • Processed client-side only                                   │
│  • Never sent to server                                         │
│  • No recording without explicit consent                        │
│                                                                 │
│  QUESTION LOGS                                                  │
│  • Anonymized (no user ID linkage)                              │
│  • Used for content improvement only                            │
│  • Aggregated in analytics                                      │
│  • Retained 90 days, then deleted                               │
│                                                                 │
│  SESSION DATA                                                   │
│  • Anonymous session IDs (UUID)                                 │
│  • No cross-session tracking                                    │
│  • No third-party analytics (self-hosted)                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 9.2 API Security

```
API SECURITY LAYERS
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│  TRANSPORT                                                      │
│  • HTTPS only (TLS 1.3)                                         │
│  • HSTS enabled                                                 │
│  • Certificate pinning (mobile)                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  AUTHENTICATION                                                 │
│  • Visitor: Anonymous session token (JWT)                       │
│  • Curator: Clerk auth (OAuth2 + MFA)                           │
│  • API: Bearer tokens with scopes                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  RATE LIMITING                                                  │
│  • 60 requests/minute per IP (visitor)                          │
│  • 10 AI questions/minute per session                           │
│  • 1000 requests/minute per venue (CMS)                         │
│  • DDoS protection via Cloudflare                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  INPUT VALIDATION                                               │
│  • Zod schema validation                                        │
│  • SQL injection prevention (parameterized queries)             │
│  • XSS prevention (content sanitization)                        │
│  • Prompt injection filtering                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 10. Performance Optimization

### 10.1 Client-Side Performance

```
PERFORMANCE TARGETS
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│  LOAD TIME                                                      │
│                                                                 │
│  Target: < 3 seconds on 4G                                      │
│                                                                 │
│  Optimizations:                                                 │
│  • Bundle size < 500KB gzipped                                  │
│  • Critical CSS inlined                                         │
│  • Lazy load non-critical scripts                               │
│  • Image targets loaded on-demand                               │
│  • Service worker for repeat visits                             │
│                                                                 │
│  Bundle breakdown:                                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  MindAR.js          │ ████████████████████ │ 180KB     │   │
│  │  A-Frame            │ ██████████████████   │ 150KB     │   │
│  │  App code           │ ██████               │  50KB     │   │
│  │  Styles             │ ███                  │  20KB     │   │
│  │  ─────────────────────────────────────────────────────│   │
│  │  Total              │                      │ 400KB     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  FRAME RATE                                                     │
│                                                                 │
│  Target: > 30 FPS                                               │
│                                                                 │
│  Optimizations:                                                 │
│  • Limit visible AR entities to 3-5                             │
│  • Use simple geometries (planes, not complex 3D)               │
│  • Disable real-time shadows                                    │
│  • Reduce texture resolution on low-end devices                 │
│  • Pause rendering when app backgrounded                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  BATTERY USAGE                                                  │
│                                                                 │
│  Target: < 15% battery/hour                                     │
│                                                                 │
│  Optimizations:                                                 │
│  • Reduce GPS polling (5m threshold)                            │
│  • Lower camera resolution when possible                        │
│  • Pause AR when no user interaction (30s)                      │
│  • Show battery warning at 20%                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 10.2 Backend Performance

```
BACKEND OPTIMIZATIONS
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│  AI RESPONSE LATENCY                                            │
│                                                                 │
│  Target: < 2 seconds P95                                        │
│                                                                 │
│  Breakdown:                                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Embedding query     │ ███               │ 100ms        │   │
│  │  RAG retrieval       │ █████             │ 150ms        │   │
│  │  Prompt assembly     │ █                 │  20ms        │   │
│  │  LLM generation      │ ████████████████  │ 800ms        │   │
│  │  Response formatting │ █                 │  30ms        │   │
│  │  Network overhead    │ █████             │ 200ms        │   │
│  │  ─────────────────────────────────────────────────────│   │
│  │  Total               │                   │ 1300ms       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Optimizations:                                                 │
│  • Stream LLM responses (first token < 500ms)                   │
│  • Cache common questions (Redis)                               │
│  • Pre-compute embeddings for exhibit names                     │
│  • Connection pooling for database                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  DATABASE OPTIMIZATIONS                                         │
│                                                                 │
│  • HNSW index on vector column (faster similarity search)       │
│  • Composite index on (venue_id, exhibit_id)                    │
│  • Connection pooling (pgBouncer)                               │
│  • Read replicas for analytics queries                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  CACHING STRATEGY                                               │
│                                                                 │
│  Edge (Cloudflare):                                             │
│  • Static assets: 1 year                                        │
│  • Image targets: 1 week                                        │
│  • API responses: No cache (dynamic)                            │
│                                                                 │
│  Application (Redis):                                           │
│  • Exhibit metadata: 5 minutes                                  │
│  • Common Q&A responses: 1 hour                                 │
│  • User preferences: Session duration                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 11. Deployment Architecture

### 11.1 Infrastructure

```
DEPLOYMENT TOPOLOGY
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                         CLOUDFLARE                               │
│                      (CDN + DDoS Protection)                     │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  Edge Locations: HK, TW, SG, JP, US, EU                    │ │
│  │  • SSL termination                                         │ │
│  │  • Static asset caching                                    │ │
│  │  • DDoS mitigation                                         │ │
│  │  • Rate limiting                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ▼                   ▼                   ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│     VERCEL      │  │    RAILWAY      │  │  CLOUDFLARE R2  │
│   (Frontend)    │  │    (Backend)    │  │ (Object Storage)│
│                 │  │                 │  │                 │
│ • WebAR client  │  │ • API server    │  │ • Image targets │
│ • CMS dashboard │  │ • AI orchestr.  │  │ • Media files   │
│ • Static assets │  │ • Analytics     │  │ • 3D assets     │
│                 │  │                 │  │                 │
│ Region: Global  │  │ Region: HK/SG   │  │ Region: APAC    │
│ edge            │  │                 │  │                 │
└─────────────────┘  └────────┬────────┘  └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │      NEON       │
                    │   (PostgreSQL)  │
                    │                 │
                    │ • Primary: HK   │
                    │ • Read replica  │
                    │ • pgvector ext  │
                    │                 │
                    │ Auto-scaling    │
                    │ Serverless      │
                    └─────────────────┘
```

### 11.2 CI/CD Pipeline

```
DEPLOYMENT PIPELINE
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│  GITHUB ACTIONS                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  On Push to main:                                               │
│  ────────────────                                               │
│  1. Lint & Type Check                                           │
│     • ESLint                                                    │
│     • TypeScript strict                                         │
│     │                                                           │
│     ▼                                                           │
│  2. Unit Tests                                                  │
│     • Vitest for backend                                        │
│     • Jest for frontend                                         │
│     • Coverage > 80%                                            │
│     │                                                           │
│     ▼                                                           │
│  3. Build                                                       │
│     • Backend: Bun build                                        │
│     • Frontend: Vite build                                      │
│     • CMS: Next.js build                                        │
│     │                                                           │
│     ▼                                                           │
│  4. Deploy (auto)                                               │
│     • Vercel: Preview → Production                              │
│     • Railway: Rolling deployment                               │
│     │                                                           │
│     ▼                                                           │
│  5. Smoke Tests                                                 │
│     • Health check endpoints                                    │
│     • Basic AR load test                                        │
│                                                                 │
│  On Pull Request:                                               │
│  ────────────────                                               │
│  • Preview deployment (Vercel)                                  │
│  • Automated review (linting)                                   │
│  • Manual approval required                                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 12. Future Extensibility

### 12.1 Platform Expansion

```
FUTURE PLATFORM SUPPORT
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│  QUEST 3 / MIXED REALITY HEADSETS                               │
│                                                                 │
│  Approach: Native Unity app (separate build)                    │
│                                                                 │
│  Architecture:                                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  Unity Client                                              │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐   │ │
│  │  │ OpenXR      │  │ Meta SDK    │  │ Sightline SDK   │   │ │
│  │  │ (XR input)  │  │ (passthrough│  │ (shared backend │   │ │
│  │  │             │  │  + spatial) │  │  API client)    │   │ │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘   │ │
│  │                                                           │ │
│  │  Shared: API endpoints, content, analytics                │ │
│  │  Unique: Spatial anchors, hand tracking, voice input      │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  Benefits:                                                      │
│  • True spatial AR (not just billboards)                        │
│  • Hand interaction                                             │
│  • Multi-user experiences                                       │
│  • Higher immersion                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  APPLE VISION PRO                                               │
│                                                                 │
│  Approach: visionOS native app (SwiftUI + RealityKit)           │
│                                                                 │
│  Timeline: Phase B (Month 12+)                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  8TH WALL UPGRADE (PREMIUM WEBAR)                               │
│                                                                 │
│  When: If markerless tracking needed (larger venues)            │
│                                                                 │
│  Features:                                                      │
│  • World tracking (SLAM)                                        │
│  • Surface detection                                            │
│  • Persistent anchors                                           │
│  • Better occlusion                                             │
│                                                                 │
│  Cost: $99-499/month depending on usage                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 12.2 Feature Roadmap

```
6-MONTH ROADMAP (CCMF)
═══════════════════════════════════════════════════════════════════

Month 1-2: FOUNDATION
┌─────────────────────────────────────────────────────────────────┐
│  • MindAR image tracking working                                │
│  • Basic AR cards with exhibit info                             │
│  • Backend API (exhibit lookup)                                 │
│  • 5 exhibits configured                                        │
└─────────────────────────────────────────────────────────────────┘

Month 3: AI Q&A
┌─────────────────────────────────────────────────────────────────┐
│  • RAG pipeline operational                                     │
│  • Natural language questions                                   │
│  • Source-grounded responses                                    │
│  • Confidence scoring                                           │
└─────────────────────────────────────────────────────────────────┘

Month 4: CMS v1
┌─────────────────────────────────────────────────────────────────┐
│  • Curator login                                                │
│  • Upload image targets                                         │
│  • Manage knowledge base                                        │
│  • Preview AR experience                                        │
└─────────────────────────────────────────────────────────────────┘

Month 5: ANALYTICS & BILINGUAL
┌─────────────────────────────────────────────────────────────────┐
│  • TTFV, dwell, Q&A volume tracking                             │
│  • Dashboard with charts                                        │
│  • English + Chinese (Traditional)                              │
│  • User preference persistence                                  │
└─────────────────────────────────────────────────────────────────┘

Month 6: PILOT & POLISH
┌─────────────────────────────────────────────────────────────────┐
│  • 2 pilot venues (heritage + education)                        │
│  • Real-world testing                                           │
│  • Performance optimization                                     │
│  • Documentation & training                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Summary

Sightline is a technically feasible, well-architected AR platform that can deliver its core value proposition within the CCMF timeline:

**Key Technical Decisions:**
1. **Image-target AR (MindAR)** for reliable indoor anchoring
2. **RAG-grounded AI** for trustworthy, curator-controlled responses
3. **WebAR-first** for zero-install visitor experience
4. **Modular backend** for future headset expansion

**Tech Stack Summary:**

| Layer | Technology |
|-------|------------|
| AR Engine | MindAR.js + A-Frame |
| Frontend | Vanilla JS, CSS Variables |
| Backend | Bun + Hono |
| Database | PostgreSQL (Neon) + pgvector |
| AI | OpenAI GPT-4o-mini |
| Storage | Cloudflare R2 |
| CMS | Next.js 14 + shadcn/ui |
| Hosting | Vercel + Railway |

**The architecture supports:**
- ✅ Reliable indoor AR anchoring
- ✅ AI-powered personalization
- ✅ Curator content control
- ✅ Real-time analytics
- ✅ Future headset expansion

---

*Document prepared: December 2024*  
*For: CCMF Application Technical Review*

