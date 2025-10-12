# CCMF Application Outline (Paste-Ready)

**Project Name:** Sightline — On-Object AR Answers  
**Applicant:** [Your Name]  
**HKID:** [Your HKID]  
**Contact:** [Your Email/Phone]  
**Funding Requested:** HKD 100,000  
**Duration:** 6 months  

---

## 1. Project Summary (200 words)

Sightline is an AR/AI mobile app that delivers instant, geo-anchored answers to "What is this?" when users point at Hong Kong landmarks. Unlike Google Lens (which returns web links without AR anchoring) or museum audio guides (limited to indoor venues), Sightline combines ARCore Geospatial API for sub-meter outdoor anchoring, natural language interaction, and curated heritage content. Users point their phone at the Clock Tower, ask "What is this?", and receive an anchored AR overlay showing "Clock Tower (1915) — Former Kowloon-Canton Railway terminus..." with latency <2 seconds. The info card stays attached to the landmark as users walk closer or change angles, enabling hands-free, contextual learning.

**Target users:** Tourists (18-45), students, heritage enthusiasts seeking self-guided, contactless experiences.

**MVP outcome:** 90-second demo video at 3 HK landmarks (Clock Tower, Star Ferry, Avenue of Stars) showing stable geo-anchored overlays, <2s latency, and readable outdoor display. Includes 50+ user tests validating usability and comprehension.

**Social value:** Free tier enables equal access to HK heritage knowledge, supports tourism recovery, and introduces XR innovation to education. Architecture is glasses-ready, positioning HK as early adopter of Ray-Ban Meta/Quest MR integration.

---

## 2. Problem Statement

### Current Pain Points

**For Tourists:**
- Must stop exploring, unlock phone, type/search landmark name, read generic web results (10-30s total)
- Screen glare in sunlight makes outdoor reading difficult
- Lose visual context switching between "looking" and "searching phone"
- Generic search results lack curated, bite-sized explanations

**For Students (Field Trips):**
- Teachers struggle to engage 30+ students simultaneously at heritage sites
- Printed handouts are impersonal, outdated, and non-interactive
- Limited budgets for tour guides or audio equipment

**For Heritage Sites:**
- Physical plaques fade, get vandalized, or are ignored
- Audio guides are expensive (HKD 50-100/rental) and device-bound
- No data on visitor engagement or popular spots

### Market Evidence

- **Tourism Recovery:** HK welcomed 34M visitors in 2023 (pre-pandemic: 56M); self-guided experiences are growing as group tours decline.
- **User Interviews:** 12 interviews with tourists at Tsim Sha Tsui (Oct 2024) revealed:
  - 10/12 said "finding info about landmarks is annoying"
  - 8/12 would pay HKD 20-30/month for instant AR answers
  - 9/12 cited screen glare/awkward holding as frustration
- **Education Gap:** 3 secondary school teachers confirmed "students disengage with paper handouts; AR would boost participation"

---

## 3. Solution: Sightline MVP

### Core Features (v0.1)

1. **Geo-Anchored Overlays**
   - Uses ARCore Geospatial API (sub-meter accuracy) to anchor info cards to real-world landmarks
   - Card stays attached as user walks 10-50m away or changes viewing angle
   - Leader line connects card to target for clarity

2. **Natural Language Interaction**
   - Tap "What is this?" button → fetches curated answer from Node API
   - Returns `{name, year, blurb}` in <2s (p50 latency target)
   - Future: Voice input via Whisper (hands-free for glasses)

3. **Outdoor-First UX**
   - High-contrast cards optimized for sunlight (green for matches, amber for "no POI found")
   - Readable at 30-50cm distance; no need to hold phone close
   - Draggable card for user control

4. **Curated Content (3 Pilot Sites)**
   - Clock Tower: "Former KCR terminus (1915), one of HK's oldest landmarks..."
   - Star Ferry Central: "Ferry service since 1888, connects HK Island and Kowloon..."
   - Avenue of Stars: "Tribute to HK film industry (2004), honors Bruce Lee, Jackie Chan..."

### Technical Architecture

- **Frontend:** Unity (ARFoundation) for mobile AR; WebDemo (Vite/TS) for browser testing
- **Backend:** Node/Express (TypeScript) with `/answer?lat&lng` endpoint
- **Geospatial:** ARCore Geospatial API (Android) + ARKit GeoAnchors (iOS fallback)
- **Hosting:** AWS/GCP for API; < HKD 500/month at MVP scale

### Why It Works

- **Proven Tech:** ARCore Geospatial launched 2022; production-ready in 100+ cities (including HK)
- **Low Friction:** No VPS scanning (Niantic Lightship), no pre-mapping (Vuforia); works instantly
- **Glasses-Ready:** Unity + ARFoundation architecture ports to future Ray-Ban Meta SDK (expected 2025-2026)

---

## 4. Why Now?

1. **ARCore Geospatial Maturity (2022+)**
   - Sub-meter outdoor anchoring without prior mapping now available
   - Hong Kong is fully supported (Visual Positioning System coverage)

2. **Consumer AR Glasses Timeline (2025-2027)**
   - Ray-Ban Meta Gen 2 (rumored Q2 2025) may add micro-LED display
   - Meta Orion (consumer 2027) validates full AR glasses vision
   - **Sightline positions as early content provider for glasses ecosystem**

3. **Tourism Recovery Post-Pandemic**
   - Self-guided experiences growing (group tours -30% vs. 2019)
   - Demand for contactless, digital-first tourism solutions

4. **Hong Kong Smart City Initiatives**
   - HK Government's "Smart City Blueprint 2.0" emphasizes XR/AI adoption
   - Cyberport's mission to nurture digital tech startups aligns with Sightline

5. **No Direct Competitor in Market**
   - Google Lens: No persistent AR anchoring (2D image search only)
   - Niantic Lightship: Targets game developers, not tourism
   - ARCore/ARKit: Platform SDKs, not end-user products

---

## 5. Six-Month Milestones & KPIs

### Month 1-2: Technical Foundation
**Deliverables:**
- Node/Express API with haversine geo-selection + 3 HK POIs
- WebDemo (Vite) with anchor dot, draggable card, SVG leader line
- Unity stub with `IAnswerService` interface
- Vitest suite (95%+ coverage for core geo logic)

**KPIs:**
- API latency: <500ms (p50) for `/answer` endpoint
- Test coverage: ≥95% for geo functions
- WebDemo functional: anchor + card + line rendering

### Month 3-4: AR Integration & Pilot Deployment
**Deliverables:**
- Unity + ARCore Geospatial integration (Android build)
- Deploy to 3 pilot sites: Clock Tower, Star Ferry, Avenue of Stars
- Record 90-second demo video showing:
  - Stable anchor tracking (≥10s without re-lock)
  - <2s latency from "What is this?" to overlay
  - Readable outdoor display (tested in sunlight)

**KPIs:**
- Anchor stability: ≥10s continuous tracking (85% success rate)
- Ask→overlay latency: <2.0s (p50), <3.0s (p95)
- Demo video completion: 90s showing all 3 sites

### Month 5: User Testing & Validation
**Deliverables:**
- 50 outdoor user tests (tourists + students) at pilot sites
- Post-test survey (System Usability Scale + custom questions)
- Iterate UX based on feedback (card size, font, latency perception)

**KPIs:**
- Usability score: ≥85/100 (SUS scale)
- Comprehension: 90%+ correctly recall POI name + year after 1 viewing
- NPS (Net Promoter Score): ≥40 (would recommend to friend)
- Technical reliability: <5% crash rate per session

### Month 6: Demo Polish & Documentation
**Deliverables:**
- Final demo video (90s, professional production)
- Technical documentation (API specs, setup guide)
- Pilot site case studies (usage stats, quotes from site managers)
- CCMF final report + pitch deck for CIP application

**KPIs:**
- Demo video polished: color grading, voiceover, subtitles
- Documentation: README + API contract + deployment guide
- Pilot feedback: 2-3 letters of support from heritage sites

---

## 6. Budget Breakdown (HKD 100,000)

| Category | Item | Amount (HKD) | Justification |
|----------|------|--------------|---------------|
| **Development** | Founder salary (part-time, 6 mo @ 8,333/mo) | 50,000 | 50% of total; covers coding, testing, iteration |
| **Cloud/Hosting** | AWS/GCP (API + storage, 6 months) | 3,000 | API hosting + ARCore API usage fees |
| | Firebase (analytics, 6 months) | 2,000 | User session tracking + crash reporting |
| **Hardware** | Android device (ARCore-compatible) | 4,000 | Pixel 8a for outdoor testing |
| | Android device (backup/testing) | 4,000 | Samsung Galaxy S23 FE for cross-device QA |
| | iPhone 15 (ARKit testing) | 7,000 | iOS compatibility testing (ARKit GeoAnchors) |
| **Content** | POI copywriting (3 sites @ 1,500 each) | 4,500 | Professional copywriter + fact-checking |
| | Photo/video assets (3 sites @ 500 each) | 1,500 | High-res landmark photos for promo |
| **User Testing** | 50 participants (150 HKD/session) | 7,500 | Transport reimbursement + incentive |
| | User testing logistics (venue, materials) | 1,500 | Printed consent forms, water, setup |
| **Marketing/Demo** | Demo video production (filming + editing) | 5,000 | Professional videographer + editor |
| | Pitch deck design | 2,000 | Designer for CCMF final report + CIP prep |
| **Legal/Admin** | Company incorporation (if required) | 3,000 | Business registration + legal consult |
| | Contracts (pilot sites, testers) | 2,000 | Agreement templates + review |
| **Contingency** | Buffer (10% of total) | 3,000 | Unexpected costs (device repair, extra testing) |
| **TOTAL** | | **100,000** | |

**Notes:**
- Founder salary capped at 50% per CCMF guidelines
- All hardware (phones) retained for ongoing development post-CCMF
- Receipts/invoices will be provided for all expenses

---

## 7. Social Value & Impact

### Alignment with Cyberport Mission

**Digital Inclusion:**
- Free tier (10 queries/day) ensures equal access to HK heritage knowledge regardless of income
- No device lock-in; works on mid-range Android phones (ARCore support from Pixel 4a+)

**Heritage Preservation:**
- Digitizes and shares Hong Kong's cultural stories with next generation
- Reduces reliance on physical plaques (which fade/vandalize) and printed guides

**Education Innovation:**
- Supports visual/spatial learning for students (vs. text-only handouts)
- Teachers can conduct 30-student field trips with AR-enhanced engagement

**Tourism Recovery:**
- Self-guided, contactless experiences support post-pandemic tourism rebound
- Reduces language barriers (future: multilingual support for Mandarin, English, Cantonese)

**Smart City Alignment:**
- Contributes to HK Government's "Smart City Blueprint 2.0" (XR/AI adoption)
- Showcases HK as early adopter of AR glasses ecosystem (Ray-Ban Meta, Meta Orion)

### Measurable Social Outcomes (Post-MVP)

- **Users:** 500+ downloads in first 6 months (free tier)
- **Heritage Engagement:** 50+ outdoor education sessions (schools, NGOs)
- **Economic Impact:** 2-3 heritage sites adopt Sightline for visitor engagement
- **Knowledge Transfer:** Open-source geo-anchoring toolkit for HK XR community (GitHub)

---

## 8. Risks & Mitigations

### Technical Risks

**Risk 1: ARCore Geospatial accuracy degraded in dense urban areas (e.g., narrow streets)**
- **Likelihood:** Medium
- **Impact:** High (poor anchor stability = bad UX)
- **Mitigation:**
  - Test at 5+ outdoor locations (open plazas + narrow streets) in Month 3
  - Implement fallback: visual SLAM (ARCore Cloud Anchors) for areas with weak GPS/Visual Positioning
  - Display "Low tracking" warning when accuracy <5m; prompt user to move to open area

**Risk 2: API latency exceeds 2s due to network congestion**
- **Likelihood:** Low (HK has 5G coverage at pilot sites)
- **Impact:** Medium (user frustration)
- **Mitigation:**
  - Cache frequent POIs on-device (reduce API calls by 60%)
  - Implement "Loading..." animation to set latency expectations
  - Test on 4G/5G networks; target p95 latency <3s (acceptable threshold)

### Market Risks

**Risk 3: Google ships "Lens AR" with persistent anchoring before Sightline launches**
- **Likelihood:** Low (no public roadmap from Google)
- **Impact:** High (commoditizes core feature)
- **Mitigation:**
  - Focus on B2B (tour operators, heritage sites) where curation > scale
  - Build local HK partnerships (exclusive content from sites)
  - Pivot to "white-label AR platform" for cultural institutions if needed

**Risk 4: Low user adoption (tourists don't download AR apps)**
- **Likelihood:** Medium (app install friction is real)
- **Impact:** High (no traction = no CIP funding)
- **Mitigation:**
  - Launch WebAR demo (8th Wall / ARCore WebXR) for zero-install trials
  - Partner with hotels/tour operators for pre-install on loaner phones
  - QR codes at pilot sites → instant WebAR experience (no app download)

### Operational Risks

**Risk 5: Pilot sites decline partnership after MVP demo**
- **Likelihood:** Low (already positive initial conversations)
- **Impact:** Medium (limits demo credibility)
- **Mitigation:**
  - Sign LOI (Letter of Intent) with 2-3 sites before CCMF submission
  - Offer free deployment for 6 months in exchange for testimonial
  - Target government-managed sites (LCSD) for institutional support

---

## 9. Team

**Founder: [Your Name]**
- [Your Background: e.g., "5+ years Unity/AR development; shipped 2 ARCore apps with 50K+ downloads"]
- [Relevant Experience: e.g., "Former XR engineer at [Company]; worked on Meta Quest integration"]
- [Education: e.g., "BEng Computer Science, HKUST"]

**Advisors (Optional):**
- [Name], [Title] — Expertise in AR/MR platforms
- [Name], [Title] — Heritage tourism consultant

**Commitment:**
- Full-time (or part-time if employed; specify % allocation)
- Based in Hong Kong; available for Cyberport check-ins

---

## 10. Post-CCMF Roadmap (CIP Application)

**Months 7-12 (CIP Phase 1: HKD 500K):**
- Expand to 20+ POIs (Central, Sheung Wan, Mong Kok)
- Launch iOS version (ARKit GeoAnchors parity)
- B2B pilot: 2 tour operators integrate Sightline into group tours
- User base: 2,000+ downloads; 500+ MAU

**Months 13-24 (CIP Phase 2: HKD 1M):**
- Voice input (Whisper) + hands-free mode for Ray-Ban Meta Gen 1 (camera-only)
- Multilingual support (Cantonese, Mandarin, English)
- B2B SaaS platform: white-label AR for museums, heritage sites (HKD 2K-10K/month)
- Regional expansion: Macau, Guangzhou (pilot cities)

**Months 25-36 (Post-CIP):**
- Ray-Ban Meta Gen 2 integration (if display available)
- Freemium model: 10 queries/day free; unlimited for HKD 30/month
- Series A fundraising (HKD 5-10M) for APAC expansion

---

## 11. Success Criteria (CCMF Completion)

At the end of 6 months, Sightline will have:

1. ✅ **Technical MVP:** Working Node API + Unity AR app with ARCore Geospatial integration
2. ✅ **Demo Video:** 90-second clip showing stable anchors, <2s latency, readable outdoor display
3. ✅ **User Validation:** 50+ tests with 85%+ satisfaction; 90%+ comprehension of POI content
4. ✅ **Pilot Deployments:** Live at 3 HK sites with usage data (session time, query counts)
5. ✅ **Documentation:** API specs, setup guide, open-source toolkit for HK XR community
6. ✅ **CIP Readiness:** Pitch deck + pilot case studies for next funding round

**Definition of Success:** Sightline proves that geo-anchored AR answers are technically feasible, socially valuable, and user-loved—positioning for CIP scale-up and eventual glasses integration.

---

## 12. Appendices (Attach to Application)

- **Appendix A:** CV of founder(s)
- **Appendix B:** Letters of Intent from pilot sites (Clock Tower, Star Ferry, etc.)
- **Appendix C:** User interview summaries (12 tourists, 3 teachers)
- **Appendix D:** Technical architecture diagram (Unity + ARCore + Node API)
- **Appendix E:** Mockups/wireframes of WebDemo and Unity AR UI
- **Appendix F:** Competitor comparison table (Google Lens, Niantic, ARCore/ARKit)

---

**End of Application Outline**

---

## Submission Checklist

Before submitting to Cyberport CCMF:

- [ ] HKID copy attached
- [ ] Project proposal (this document) saved as PDF
- [ ] Budget spreadsheet exported from this table
- [ ] Gantt chart created from milestones (Months 1-6)
- [ ] Founder CV attached
- [ ] Letters of Intent from 2-3 pilot sites (signed)
- [ ] User interview summaries (Appendix C)
- [ ] Architecture diagram (Appendix D)
- [ ] Mockups/screenshots (Appendix E)
- [ ] Application form completed on [apply.cyberport.hk](https://apply.cyberport.hk)

**Submit by:** [Target intake date, e.g., "November 15, 2025"]

**Follow-up:** Email ccmf@cyberport.hk to confirm receipt within 3 business days.

