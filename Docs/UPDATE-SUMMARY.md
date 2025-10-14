# Update Summary — Hybrid AR Anchoring Strategy

**Date:** October 14, 2025  
**Commit:** `4d0231b`  
**Based on:** CTO/Founder feedback for CCMF application

---

## What Changed

### ✅ Architecture Decision: Option C (Hybrid Anchoring)

**Chosen Strategy:**
- **GPS Primary** (ARCore Geospatial) for outdoor phone usage
- **Vuforia Fallback** for high accuracy (±5cm) when GPS poor
- **Image Targets** for Quest 3 indoor demos (guaranteed lock)

**Why:** Demonstrates technical breadth, mitigates GPS gaps, future-proofs for glasses

---

## Key Updates by Document

### 1. PLAN.md
- ✅ Added "Chosen Architecture: Option C" section at top
- ✅ Added Engineering Guardrails (API contracts, latency budgets, confidence gating)
- ✅ Added 7-Day Execution Plan (20 blocks × 40 min)
- ✅ Added 6-Month Milestones (Feb-Jul 2026) with measurable KPIs
- ✅ Updated Budget to HKD 100,000 with line-item breakdown

**New sections:**
- Engineering Guardrails
- Latency Budgets (GPS <0.6s, Vision <1.8s)
- Confidence Gating (≥0.85 green, 0.60-0.85 amber, <0.60 default)
- Privacy & Cost Controls

### 2. SPEC.md
- ✅ Updated API contracts (marked as LOCKED)
- ✅ Changed from GET `/answer` to POST `/identify` (accepts GPS OR image)
- ✅ Added GET `/poi/:id` endpoint
- ✅ All responses now include `requestId` and `server_ms`

**New API format:**
```json
POST /identify → {poiId, name, confidence, requestId, server_ms}
GET /poi/:id → {id, name, aliases, lat, lng, year, blurb, snapshots, bounds_m}
```

### 3. Docs/05-application-outline.md (CCMF Application)
- ✅ Updated 6-month milestones with specific KPIs per month
- ✅ Revised budget from generic to specific line items:
  - Unity XR Contractor: HKD 35,000
  - Backend/API: HKD 15,000
  - Cloud & AI (Vuforia + Gemini): HKD 10,000
  - Hardware & Testing: HKD 20,000
  - Design/Video: HKD 10,000
  - Contingency: HKD 10,000

**Month-by-month deliverables now include:**
- Month 1: 10 POIs, p50 <2.5s, 99% crash-free
- Month 2: Vuforia at 1-2 sites, ≥10s stability
- Month 3: 20 POIs, voice I/O, teacher trial (≥15 students)
- Month 4: 50 beta users, p50 <2.0s
- Month 5: 90s demo video
- Month 6: 1 LOI signed, CIP package ready

### 4. Docs/06-tech-plan.md
- ✅ Added "Hybrid Anchoring Strategy (Technical Deep Dive)" section
- ✅ Detailed flows for: GPS path, Vuforia fallback, Quest 3 indoor
- ✅ Added latency budgets for each path
- ✅ Included decision tree code example

**New content:**
- Outdoor flow (GPS → ARCore Geospatial)
- High accuracy flow (Vuforia Area Target)
- Indoor flow (Image Target for Quest 3)
- TypeScript decision tree logic

### 5. Docs/07-iterative-tasks.md
- ✅ Added "Quick Reference: 7-Day Sprint" summary at top
- ✅ Restructured as 7 days × ~3 blocks each
- ✅ Clear acceptance criteria per day
- ✅ Kept detailed task breakdown below as reference

**New structure:**
- Day 1-2: Backend + WebDemo (Blocks 1-5)
- Day 3-4: Unity + ARCore (Blocks 6-9)
- Day 5: Vuforia Integration (Blocks 10-13)
- Day 6: Polish & Filming (Blocks 14-17)
- Day 7: CCMF Packaging (Blocks 18-20)

---

## Engineering Guardrails (NEW)

### Locked API Contracts

**POST `/identify`**
- Accepts: `{lat, lng}` OR `{image: string}`
- Returns: `{poiId, name, confidence, requestId, server_ms}`

**GET `/poi/:id`**
- Returns full POI details with aliases, snapshots, bounds_m

### Latency Budgets

| Path | Target p50 | Components |
|------|-----------|------------|
| GPS (Outdoor) | <0.6s | GPS 100ms + API 300ms + Anchor 200ms |
| Vision (Fallback) | <1.8s | Recognition 400ms + API 800ms + Anchor 100ms |
| Image Target (Indoor) | <1.2s | Recognition 200ms + API 800ms |

### Confidence Gating

- **≥0.85:** Green border, display result
- **0.60-0.85:** Amber border + show 2 nearest POI chips
- **<0.60:** Amber "Look around" message

### Privacy & Cost Controls

- Cap images to 1024px
- Cache POI answers by 50m grid
- Rate limit: 100 req/min per device
- Blur faces/plates (future)

---

## Budget Breakdown (HKD 100,000)

| Category | Amount | % of Total |
|----------|--------|------------|
| Unity XR Contractor | 35,000 | 35% |
| Backend/API Dev | 15,000 | 15% |
| Cloud & AI | 10,000 | 10% |
| Hardware & Testing | 20,000 | 20% |
| Design/Video | 10,000 | 10% |
| Contingency | 10,000 | 10% |

**Key changes from original:**
- Replaced "Founder salary" with "Unity XR Contractor" (CCMF-friendly)
- Added specific Vuforia license cost ($99/mo × 6)
- Broke out design/video separately
- Increased hardware budget for Quest 3 accessories

---

## 7-Day Execution Plan

**Purpose:** Get from zero code to field-testable demo for CCMF video

**Timeline:**
- **Day 1-2:** Backend API + WebDemo prototype
- **Day 3-4:** Unity AR with ARCore Geospatial
- **Day 5:** Vuforia SDK integration
- **Day 6:** Outdoor + indoor filming
- **Day 7:** Video editing + CCMF packaging

**Total time:** 7 days × 8-hour days = ~56 hours of focused work

**Deliverable:** 90-second field demo showing:
- Clock Tower outdoor (phone + GPS, <1s response, ≥10s stability)
- Quest 3 indoor (poster recognition, confidence display)
- KPI slate at end (latency, confidence, method)

---

## Next Steps (Action Items)

### Immediate (This Week)

1. **Review updated plan** in `PLAN.md` and `Docs/05-application-outline.md`
2. **Validate tech stack choices:**
   - Fastify (vs Express) for backend
   - Vuforia license budget ($99/mo acceptable?)
   - Gemini Vision API (vs alternatives)
3. **Confirm hardware:**
   - Do you have ARCore-compatible Android phone?
   - Do you have Quest 3?
   - Need to purchase any devices?

### Week 1 (Start Development)

4. **Day 1-2:** Build backend + WebDemo
   - Follow Block 1-5 from `Docs/07-iterative-tasks.md`
   - Deliverable: API responding, WebDemo showing card
5. **Day 3-4:** Unity + ARCore
   - Blocks 6-9
   - Deliverable: Phone app with AR anchor at Clock Tower

### Week 2 (Vuforia + Demo)

6. **Day 5:** Vuforia integration
   - Blocks 10-13
   - Need to scan Clock Tower or use Image Target
7. **Day 6:** Film at Clock Tower
   - Bring: Phone, tripod/gimbal, external mic
   - Get 3 clean takes (≥10s each)
8. **Day 7:** Edit + submit CCMF
   - 90-second cut
   - Upload to Cyberport portal

---

## Decision Points

### Before You Start Coding

**Q1:** Fastify or Express for backend?
- **Recommendation:** Fastify (2x faster, better TS support)
- **Alternative:** Express (simpler, more familiar)

**Q2:** Vuforia license OK?
- **Cost:** $99/mo × 6 = $594 USD ≈ HKD 4,600
- **Benefit:** ±5cm accuracy vs ±5m GPS
- **Alternative:** Skip Vuforia, use GPS only (simpler but less impressive)

**Q3:** Quest 3 for CCMF demo?
- **Benefit:** Shows indoor capability, "glasses-ready" form factor
- **Alternative:** Phone-only demo (outdoor GPS only)

**Q4:** When to submit CCMF?
- **Next intake:** Check `Docs/04-cyberport-map.md` for deadlines
- **Recommended:** Submit by end of November 2025 (after 7-day sprint)

---

## Files Modified

### Core Planning
- ✅ `PLAN.md` — Added hybrid strategy, guardrails, 7-day plan, milestones
- ✅ `SPEC.md` — Locked API contracts, updated endpoints

### Strategic Docs (`Docs/`)
- ✅ `05-application-outline.md` — Updated milestones, budget, KPIs
- ✅ `06-tech-plan.md` — Added hybrid anchoring deep dive
- ✅ `07-iterative-tasks.md` — Restructured as 7-day sprint
- ✅ `UPDATE-SUMMARY.md` — This file (new)

### Not Modified (Still Valid)
- ✅ `README.md` — Still accurate
- ✅ `00-exec-summary.md` — Still relevant
- ✅ `01-business-canvas.md` — No changes needed
- ✅ `02-competitor-matrix.md` — Up to date
- ✅ `03-trends-devices.md` — Current
- ✅ `04-cyberport-map.md` — CCMF details current
- ✅ `08-risk-register.md` — Risks still relevant
- ✅ `09-60sec-pitch.md` — Pitch still valid
- ✅ `10-agentic-research-plan.md` — Research plan current

---

## Go/No-Go Checklist (Before Building)

### Technical Readiness
- [ ] Confirmed Fastify vs Express choice
- [ ] Vuforia budget approved ($99/mo × 6)
- [ ] ARCore-compatible Android phone available
- [ ] Quest 3 available (or skip indoor demo)
- [ ] Gemini Vision API key obtained

### CCMF Readiness
- [ ] Reviewed all 11 strategic docs in `Docs/`
- [ ] Confirmed 6-month timeline (Feb-Jul 2026) is realistic
- [ ] Budget HKD 100K breakdown approved
- [ ] Ready to film outdoor demo at Clock Tower

### Resource Readiness
- [ ] Unity XR contractor identified (or founder doing it?)
- [ ] 7-day sprint block scheduled (dedicated time)
- [ ] Cyberport CCMF deadline confirmed
- [ ] 2-3 pilot site contacts made (for LOI in Month 6)

---

## Summary

**What you have now:**
✅ Complete strategic plan (Track A) — 11 documents ready for CCMF  
✅ Refined technical plan (Track B) — Hybrid AR architecture locked  
✅ 7-day execution timeline — Clear path to demo  
✅ Budget breakdown — HKD 100K line-itemed  
✅ Engineering guardrails — API contracts, latency budgets, confidence gating  

**What you need to do:**
1. Review this update summary
2. Make tech stack decisions (Fastify, Vuforia, etc.)
3. Start Day 1-2 of 7-day sprint (backend + WebDemo)
4. Film outdoor demo by end of Week 2
5. Submit CCMF application by end of November 2025

**Next command:**
```bash
# Start backend development (Day 1, Block 1)
cd Server
npm init -y
npm install fastify @fastify/cors tsx typescript vitest
```

---

**Questions? Next steps?** Let me know if you want me to:
- Generate starter code for backend (Fastify + types + POI data)
- Create Unity project structure
- Help with CCMF application text
- Anything else!

