# Sightline - 6-Month Milestones & KPIs
## CCMF Project Period (Month 1 starts Feb 2026)

**Grant Period:** February 2026 - July 2026  
**Total Budget:** HK$100,000  
**Reporting:** Interim Report (Month 3), Final Report (Month 6)

---

## Overview

| Month | Theme | Key Deliverable | Success Metric |
|-------|-------|----------------|----------------|
| 1 | Foundation | MVP Backend + 10 POIs | p50 latency ≤2.5s |
| 2 | Dual-Path AR | Vision AI + Quest 3 | Method logging working |
| 3 | Education Trial | Teacher pilot (15+ students) | ≥80% satisfaction |
| 4 | Public Beta | 50 users, crash-free ≥99.5% | App Store/Play live |
| 5 | Venue Outreach | Demo video + LOI pitches | 10 outreach emails sent |
| 6 | CIP Preparation | Signed LOI + CIP application | LOI from 1 venue |

---

## Month 1: Foundation (Feb 2026)

### Theme: MVP Backend + Outdoor GPS Path

### Deliverables

**1. Backend API (Week 1-2)**
- Fastify server with CORS enabled
- POST `/identify` endpoint (GPS-based POI identification)
- GET `/poi/:id` endpoint (full POI details)
- Haversine distance calculation function
- Seed database: 10 Hong Kong POIs
  - Clock Tower (Tsim Sha Tsui)
  - Star Ferry Pier (Central)
  - Avenue of Stars (Tsim Sha Tsui)
  - IFC (Central)
  - PMQ (Central)
  - Tai Kwun (Central)
  - Blue House Cluster (Wan Chai)
  - Wong Tai Sin Temple
  - Repulse Bay Beach
  - Victoria Peak

**2. Telemetry & Logging (Week 2)**
- `requestId` (UUID) for all API responses
- `server_ms` (latency measurement)
- Response caching (50m grid tiles, 10-min TTL)
- Basic error handling and validation

**3. WebDemo (Week 3)**
- Vite + TypeScript frontend
- API call test interface
- Latency display
- Mock anchor dot + card visualization

**4. Testing (Week 4)**
- Vitest unit tests (haversine, selectPOI functions)
- Integration tests (API endpoints)
- Load testing (100 concurrent requests)

### Success Criteria (Month 1)

| KPI | Target | Verification Method |
|-----|--------|---------------------|
| POIs live | 10 | Database count |
| API response time (p50) | ≤2.5s | Server logs (GPS path) |
| API uptime | ≥99.0% | Monitoring dashboard |
| Test coverage | ≥70% | Vitest report |
| WebDemo functional | Yes | Manual QA |

### Risks & Mitigation

**Risk:** Gemini Vision API quota limits  
**Mitigation:** Use GPS-only for Month 1; defer Vision AI to Month 2

**Risk:** POI coordinate accuracy  
**Mitigation:** Field-verify all 10 POI coordinates manually in Week 4

### Grant Disbursement

**Tranche 1:** HK$10,000 (upon CCMF Agreement signing)

---

## Month 2: Dual-Path AR (Mar 2026)

### Theme: Unity AR + Vision AI Fallback + Quest 3

### Deliverables

**1. Unity Project Setup (Week 1)**
- Unity 2022.3.58 LTS installed
- AR Foundation + ARCore Geospatial API
- Android build target configured
- Test build on ARCore-compatible phone

**2. ARCore Geospatial Integration (Week 2)**
- Hardcode Clock Tower coordinates (22.2946, 114.1699)
- Place AR card at geospatial anchor
- Basic billboarding (card faces camera)
- Leader line (SVG or Unity LineRenderer)

**3. Vision AI Fallback (Week 2-3)**
- Update POST `/identify` to accept `image` field (base64)
- Gemini Vision API integration
- Confidence scoring (GPS vs. Vision)
- Response includes `method: "geo" | "vision"`

**4. Quest 3 Prototype (Week 3-4)**
- Meta XR All-in-One SDK v7+
- Passthrough Camera API sample import
- WebcamTextureManager + EnvironmentRaycastManager
- Basic POI detection script (adapted from Meta samples)

**5. Telemetry Overlay (Week 4)**
- Display on AR card: latency, confidence, method
- Log all queries to backend for analysis

### Success Criteria (Month 2)

| KPI | Target | Verification Method |
|-----|--------|---------------------|
| Unity build runs on phone | Yes | Field test at Clock Tower |
| AR card anchors at Clock Tower | Yes | Video proof |
| Anchor stability (stationary) | ≥10s | Timer in video |
| Vision API integrated | Yes | Backend logs show `method: "vision"` |
| Quest 3 prototype functional | Yes | Indoor test with poster |
| p50 latency (GPS path) | ≤1.5s | Client-side telemetry |
| p50 latency (Vision path) | ≤2.0s | Client-side telemetry |

### Risks & Mitigation

**Risk:** ARCore Geospatial drift (±5-15m)  
**Mitigation:** Implement amber state for low confidence; add "Re-aim to lock" prompt

**Risk:** Quest 3 API breaking changes  
**Mitigation:** Test with Meta's official samples first; if fails, defer to Month 3

### Unity Contractor

**Onboarding:** Hire contractor in Week 1 (after backend validates feasibility)  
**Hours:** 80 hours budgeted for Month 2  
**Cost:** HK$11,667 (part of HK$35,000 total)

---

## Month 3: Education Trial (Apr 2026)

### Theme: Teacher Trial + User Feedback + Interim Report

### Deliverables

**1. Teacher Trial Preparation (Week 1)**
- Recruit 1-2 teachers from HK schools
- Confirm 15+ student participants (ages 12-18)
- Location: Tsim Sha Tsui Promenade (Clock Tower → Star Ferry → Avenue of Stars)
- Prepare lesson plan: "Heritage Walk AR Experience" (90 min)

**2. Field Trial (Week 2)**
- Distribute test devices (phones or student BYOD)
- Guide students through 5 POI visits
- Collect qualitative feedback (what worked, what didn't)
- Record video testimonials (with consent)

**3. Post-Trial Analysis (Week 2-3)**
- Survey: Student satisfaction (1-5 scale)
- Measure: Dwell time vs. baseline (if venue provides data)
- Interview teachers: Would they use this again?
- Compile case study: "[School name] Heritage AR Trial"

**4. Iteration Based on Feedback (Week 3)**
- Bug fixes (top 5 user-reported issues)
- UI improvements (e.g., larger text, clearer instructions)
- Content updates (if students found POI info confusing)

**5. Interim Report (Week 4)**
- Submit to Cyberport Entrepreneurship Team
- Sections: Milestones achieved, KPIs met, budget spent, next steps
- Include: Trial video, survey results, teacher testimonial

### Success Criteria (Month 3)

| KPI | Target | Verification Method |
|-----|--------|---------------------|
| Student participants | ≥15 | Attendance list |
| Student satisfaction | ≥80% | Post-trial survey |
| Teacher would recommend | ≥2/2 | Interview transcripts |
| POIs visited per student | ≥3/5 | App telemetry |
| Zero critical bugs during trial | Yes | Bug tracker |
| Interim Report approved | Yes | Cyberport confirmation email |

### Risks & Mitigation

**Risk:** Low student engagement  
**Mitigation:** Gamification (scavenger hunt mode, "Find 5 POIs to unlock badge")

**Risk:** Weather (rain on trial day)  
**Mitigation:** Schedule 2 trial dates (backup day if rained out)

**Risk:** Device compatibility issues  
**Mitigation:** Pre-test with 3 different Android phones (Samsung, Xiaomi, Google Pixel)

### Grant Disbursement

**Tranche 2:** HK$45,000 (upon Interim Report approval)

---

## Month 4: Public Beta (May 2026)

### Theme: Beta Launch + 50 Users + Crash-Free ≥99.5%

### Deliverables

**1. Beta Preparation (Week 1)**
- App Store (iOS) + Google Play (Android) submissions
- Privacy policy published (https://sightline.hk/privacy)
- Terms of Service published
- Beta signup form (Google Forms or Typeform)

**2. Beta Launch (Week 2)**
- Recruit 50 beta users:
  - 20 from teacher trial network
  - 15 from CCMF showcase event
  - 15 from social media (Instagram, Xiaohongshu)
- Onboarding email: How to use Sightline, where to visit (10 POI locations)
- Beta Slack/WhatsApp group for feedback

**3. Monitoring & Support (Week 2-4)**
- Daily crash monitoring (Firebase Crashlytics or Sentry)
- Response time dashboard (Grafana or Google Cloud Monitoring)
- Weekly office hours: Answer beta user questions
- Bug triaging: P0 (blocks usage) fixed within 24h, P1 (annoying) within 1 week

**4. Performance Optimization (Week 3-4)**
- Achieve p50 latency ≤2.0s (down from 2.5s in Month 1)
- Reduce app size (if >100MB, optimize assets)
- Battery optimization (AR is power-hungry; target <20% drain per 30 min use)

**5. Analytics Setup (Week 4)**
- Google Analytics 4: Track POI visits, session duration, share rate
- Custom events: "anchor_locked", "ar_card_opened", "shared_to_social"
- Cohort analysis: Do users return after first visit?

### Success Criteria (Month 4)

| KPI | Target | Verification Method |
|-----|--------|---------------------|
| Beta users enrolled | ≥50 | Signup form count |
| Active users (≥1 POI visit) | ≥40/50 (80%) | Google Analytics |
| Crash-free rate | ≥99.5% | Crashlytics dashboard |
| p50 latency (GPS path) | ≤2.0s | Server logs |
| p50 latency (Vision path) | ≤2.5s | Server logs |
| Average session duration | ≥10 min | Google Analytics |
| Share rate | ≥30% | Custom event tracking |
| D7 retention | ≥25% | Cohort analysis |

### Risks & Mitigation

**Risk:** App Store rejection (privacy, content)  
**Mitigation:** Submit 2 weeks early (Week 0 of Month 4); address review feedback promptly

**Risk:** Low beta signup (<50 users)  
**Mitigation:** Offer incentive (HK$50 coffee voucher for completing 5 POI visits)

**Risk:** Server overload (50 concurrent users)  
**Mitigation:** Load test with 100 simulated users in Month 3; scale server if needed

---

## Month 5: Venue Outreach (Jun 2026)

### Theme: Demo Video + LOI Pitches + Venue SDK Positioning

### Deliverables

**1. Demo Video Production (Week 1-2)**
- Hire videographer (HK$6,000 budget)
- Shot list:
  1. Problem statement (10s): Tourists/students struggle with passive heritage learning
  2. Clock Tower demo (30s): User points phone, AR card appears <2s, walk 3-4m (anchor stable)
  3. Star Ferry demo (20s): Different POI, same experience
  4. Quest 3 indoor demo (20s): Museum room with poster, Vision AI locks
  5. Teacher testimonial (15s): "My students were more engaged than ever"
  6. Team + roadmap (10s): Founder on-camera, "Free for HK schools, CIP-funded scale-up"
- Deliverable: 90-second video, <50MB, MP4 format

**2. Venue Outreach Strategy (Week 2-3)**
- Target list: 10 museums + heritage venues
  - Tier 1 (easier approval): PMQ, Tai Kwun, Blue House Cluster
  - Tier 2 (mid-size): Hong Kong Heritage Museum (Sha Tin), Hong Kong Science Museum
  - Tier 3 (dream targets): M+, Hong Kong Museum of History, Hong Kong Palace Museum
- Outreach email template (see Pilot_LOI_draft.md)
- Pitch deck: 10 slides (see Deck_Sightline_10slides.md)

**3. Outreach Execution (Week 3-4)**
- Send 10 personalized emails (Mon-Tue)
- Follow up after 1 week (Mon-Tue of next week)
- Schedule calls/meetings with interested venues (target 3-5 responses)
- Demo in-person: Bring phone + Quest 3, show at venue if possible

**4. Venue SDK Positioning (Week 4)**
- Create "Venue SDK Brief" (1-pager):
  - What it is: White-label AR layer for museums
  - Pricing: HK$5K-15K/year (tiered by # of POIs)
  - Benefits: Increase visitor engagement, collect analytics, no dev work required
  - Case study: Teacher trial results (80% satisfaction, 25% dwell time increase)
- Publish on sightline.hk/venues

### Success Criteria (Month 5)

| KPI | Target | Verification Method |
|-----|--------|---------------------|
| Demo video completed | Yes | Video file exported |
| Outreach emails sent | 10 | Gmail sent folder |
| Response rate | ≥30% (3/10) | Email replies |
| In-person meetings | ≥2 | Calendar invites |
| Warm leads (interested venues) | ≥2 | CRM notes |
| Demo video views | ≥100 | YouTube Analytics (if public) OR email open tracking |

### Risks & Mitigation

**Risk:** No venue responses (cold outreach is hard)  
**Mitigation:** Leverage CCMF network (ask Cyberport for introductions), attend museum conferences

**Risk:** Demo video quality too low  
**Mitigation:** Hire semi-pro videographer (not DIY); get 3 takes of each shot

### Design/Video Production Budget

**Spend in Month 5:** HK$6,000 (video production)  
**Remaining from HK$10,000 budget:** HK$4,000 (Month 1 UX design)

---

## Month 6: CIP Preparation (Jul 2026)

### Theme: Pilot LOI + Final Report + CIP Application Ready

### Deliverables

**1. Pilot LOI Negotiation (Week 1-2)**
- Select 1 venue from Month 5 warm leads
- Draft pilot agreement (see Pilot_LOI_draft.md):
  - Dates: Sep-Nov 2026 (3 months, post-CCMF)
  - Scope: 10 POIs in museum, free trial
  - Data sharing: Venue provides visitor analytics (dwell time, foot traffic)
  - Exit terms: Either party can terminate with 2 weeks notice
- Legal review (if needed, allocate HK$2,000 from contingency)
- Signed LOI by end of Week 2

**2. CIP Application Preparation (Week 2-3)**
- Gather all materials:
  - CCMF Final Report (milestones, KPIs, budget spent)
  - Beta metrics (50 users, 80% satisfaction, p50 <2s)
  - Teacher trial case study
  - Signed pilot LOI
  - Demo video
- Draft CIP application (12-24 month roadmap, HK$500K budget request)
- Sections:
  - Team expansion: Hire 2 FTE (Unity dev, sales/partnerships)
  - Technical roadmap: Scale to 50 venues, glasses R&D (Ray-Ban Meta)
  - Revenue model: Venue SDK subscriptions (10 paying venues by Month 12)
  - Social impact: Maintain free tier for HK schools

**3. Final Report (Week 3-4)**
- Submit to Cyberport Entrepreneurship Team
- Comprehensive report covering:
  - All 6 months' milestones achieved (vs. targets)
  - KPIs met (with evidence: logs, videos, surveys)
  - Budget breakdown (all HK$100K spent; itemized receipts)
  - Risks encountered and how mitigated
  - Next steps: CIP application, pilot execution
- Include appendices:
  - Teacher trial survey results
  - Beta user testimonials (3-5 quotes)
  - Server logs (latency p50/p90)
  - GitHub commit history (proof of development)
- Video supplement: 2-minute montage (highlights from 6 months)

**4. Project Handoff Documentation (Week 4)**
- Code repository: Clean up, add README, MIT License
- API documentation: Swagger/OpenAPI spec
- Deployment guide: How to run server, how to build Unity app
- Content creation guide: How to add new POIs
- (Optional) Open-source selected components: Quest 3 POI detection script

### Success Criteria (Month 6)

| KPI | Target | Verification Method |
|-----|--------|---------------------|
| Signed pilot LOI | ≥1 venue | Signed PDF |
| Final Report submitted | Yes | Cyberport confirmation email |
| Final Report approved | Yes | Cyberport approval + Tranche 3 disbursement |
| CIP application drafted | Yes | Draft PDF (ready to submit Jul 2026 intake) |
| All HK$100K spent | 95-100% | Budget spreadsheet |
| Open-source release | Yes | GitHub public repo OR published blog post |

### Risks & Mitigation

**Risk:** Venue backs out of LOI at last minute  
**Mitigation:** Have 2 backup venues lined up (from Month 5 warm leads)

**Risk:** Final Report rejected (Cyberport finds gaps)  
**Mitigation:** Submit draft for informal feedback in Week 3; iterate before official submission

**Risk:** Budget underspend (<95%)  
**Mitigation:** If underspend, reallocate to: extra field testing days, 3rd-party security audit, or community workshops

### Grant Disbursement

**Tranche 3:** HK$45,000 (upon Final Report approval)

---

## Cumulative KPIs (6-Month Summary)

### Technical Performance

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| POIs live | 20 | [TBD] | [TBD] |
| p50 latency (GPS) | ≤2.0s | [TBD] | [TBD] |
| p50 latency (Vision) | ≤2.5s | [TBD] | [TBD] |
| Crash-free rate | ≥99.5% | [TBD] | [TBD] |
| Anchor stability | ≥10s | [TBD] | [TBD] |

### User Engagement

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Beta users | ≥50 | [TBD] | [TBD] |
| Active users (≥1 POI) | ≥40/50 (80%) | [TBD] | [TBD] |
| Student satisfaction | ≥80% | [TBD] | [TBD] |
| Share rate | ≥30% | [TBD] | [TBD] |
| D7 retention | ≥25% | [TBD] | [TBD] |

### Business Development

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Venue outreach | 10 | [TBD] | [TBD] |
| Warm leads | ≥2 | [TBD] | [TBD] |
| Signed LOI | ≥1 | [TBD] | [TBD] |
| CIP application ready | Yes | [TBD] | [TBD] |

### Social Impact

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Students reached (trial) | ≥15 | [TBD] | [TBD] |
| Free tier users | ≥500 | [TBD] | [TBD] |
| Open-source GitHub stars | ≥50 | [TBD] | [TBD] |

---

## Budget Tracking by Month

| Month | Planned Spend (HKD) | Actual Spend (HKD) | Variance | Notes |
|-------|---------------------|-------------------|----------|-------|
| 1 | 18,000 | [TBD] | [TBD] | Backend dev + cloud setup |
| 2 | 22,667 | [TBD] | [TBD] | Unity contractor (80 hrs) |
| 3 | 18,667 | [TBD] | [TBD] | Unity contractor + field testing |
| 4 | 12,666 | [TBD] | [TBD] | Beta launch + monitoring |
| 5 | 14,000 | [TBD] | [TBD] | Video production + design |
| 6 | 14,000 | [TBD] | [TBD] | LOI legal + final testing |
| **Total** | **100,000** | [TBD] | [TBD] | Target: 95-100% spent |

---

## Reporting Schedule

### Interim Report (Month 3, Week 4)
**Due:** April 30, 2026 (approximate, depends on grant start date)  
**Sections:**
- Milestones 1-3 achieved
- KPIs met (with evidence)
- Budget spent (50-60% of total)
- Risks encountered and mitigated
- Next steps (Month 4-6 preview)

**Appendices:**
- Teacher trial video (5 min)
- Survey results (Excel/CSV)
- Server logs (latency p50/p90)

**Approval:** Required for Tranche 2 (HK$45,000)

---

### Final Report (Month 6, Week 4)
**Due:** July 31, 2026 (approximate)  
**Sections:**
- All 6 months' milestones achieved
- Cumulative KPIs (vs. targets)
- Budget breakdown (100% spent)
- Social impact outcomes (students reached, satisfaction)
- Open-source contributions
- Next steps: CIP application, pilot execution

**Appendices:**
- Demo video (90 sec)
- Beta user testimonials
- Signed pilot LOI
- GitHub commit history
- Financial receipts (all HK$100K)

**Approval:** Required for Tranche 3 (HK$45,000)

---

## Contingency Plans

### If GPS Drift is Unacceptable (Month 2)
- **Trigger:** Field tests show >50% of queries have ≥20m drift
- **Action:** Pivot to Vision AI primary, GPS secondary
- **Budget:** Reallocate HK$5,000 from contingency to Vision API calls

### If Unity Contractor Unavailable (Month 2)
- **Trigger:** Unable to hire contractor by Week 2
- **Action:** Founder handles Unity work; extend timeline by 2 weeks
- **Budget:** Reallocate HK$35,000 to: additional field testing (HK$10K), video production upgrade (HK$15K), open-source bounties (HK$10K)

### If Teacher Trial Fails (Month 3)
- **Trigger:** <60% student satisfaction OR teachers refuse to recommend
- **Action:** Conduct second trial with different school (use contingency budget)
- **Budget:** HK$5,000 for second trial (transport, incentives)
- **Timeline:** Push Interim Report by 2 weeks

### If No Venue LOI (Month 6)
- **Trigger:** All 10 venues decline or ghost
- **Action:** Pivot to school partnership (easier approval); OR apply to CIP anyway with strong beta metrics
- **Budget:** Reallocate LOI legal budget (HK$2K) to extra beta incentives

---

## Success Definition

**CCMF Project is successful if:**
1. ✅ All 6 milestones delivered on time
2. ✅ ≥80% of KPIs met (technical, engagement, social impact)
3. ✅ Signed LOI from 1 venue OR 2 schools
4. ✅ CIP application ready to submit (Jul 2026 intake)
5. ✅ Open-source contribution published (GitHub stars ≥50)
6. ✅ Teacher testimonial video suitable for future marketing

**Stretch Goals:**
- p50 latency <1.5s (exceeds target of 2.0s)
- Beta users >75 (exceeds target of 50)
- D7 retention >35% (exceeds target of 25%)
- 2 signed LOIs (exceeds target of 1)

---

**Document Status:** Ready for EMS submission  
**Last Updated:** [Date]  
**Owner:** [Your Name], Sightline Founder


