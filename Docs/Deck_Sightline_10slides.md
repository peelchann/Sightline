# Sightline - On-Object AI for Heritage Education
## 10-Slide Pitch Deck (CCMF Application)

**Format:** Each section = 1 slide  
**Total:** 10 slides  
**Duration:** 5-7 minutes presentation  
**Export:** Markdown → Google Slides / PowerPoint → PDF

---

## Slide 1: PROBLEM

**Title:** Heritage Education is Broken

**Visual:** Split image - Left: Students looking bored at museum exhibit. Right: Tourist confused looking at Clock Tower.

**Content:**

**The Challenge:**
- 78% of HK visitors want "local insights" but rely on generic guidebooks
- Museum educators report <30% student engagement with static exhibits
- Traditional audio guides are passive: "Press 7 for artifact"
- Existing AR apps require complex setup or fail indoors

**Pain Points:**
- **Students:** Forget historical facts within days (low retention)
- **Tourists:** "Which building is that?" - no immediate answer without searching
- **Educators:** Struggle to hold attention during outdoor heritage walks

**The Cost:**
- Low dwell time at heritage sites (~5 min average vs. 15 min desired)
- Disengaged learners = cultural knowledge loss
- HK's heritage stories untold to digital-native generation

---

## Slide 2: INSIGHT / WHY NOW

**Title:** Technology + Timing + Need Converge in 2026

**Visual:** Timeline graphic showing technology milestones converging.

**Content:**

**Technology Breakthroughs (2022-2024):**
- ✅ ARCore Geospatial API matured: GPS + VPS hybrid anchoring
- ✅ Quest 3 Passthrough Camera API (2024): Indoor MR without pre-scanning
- ✅ Gemini Vision API affordable (<USD$1 per 1K images)
- ✅ Unity Sentis (2024): On-device ML for privacy-first preprocessing

**Market Timing:**
- HK tourism recovery: 26M visitors (2023), approaching pre-2019 peak
- Museum digital transformation: Post-COVID contactless experiences
- AR glasses validation: Meta Orion (Sep 2024), Ray-Ban Meta selling faster than expected

**Social Need:**
- Youth disengagement crisis: <30% heritage site engagement
- Cultural preservation urgency: Elder generation knowledge at risk
- Government push: "Smart City" initiatives, EdTech funding

**Why Sightline Now:**
- First-mover in HK with proven hybrid anchoring
- Phone-first content library ready when glasses arrive (2026-2027)
- Free tier for schools = social impact + market penetration

---

## Slide 3: PRODUCT (Anchor-First Experience)

**Title:** Zero-Setup AR: Point, See, Learn

**Visual:** 3-panel user flow diagram:
1. User points phone at Clock Tower
2. AR card appears in <2s, anchored to building
3. Leader line shows connection, card displays history

**Content:**

**How It Works:**

**Step 1: Point**
- User opens app, points camera at landmark
- No QR codes, no "scan this poster," no setup

**Step 2: Identify (< 2 seconds)**
- **Outdoor:** GPS + ARCore Geospatial (fast, scalable)
- **Indoor:** Vision AI + Quest 3 Passthrough Camera (precise)
- System auto-selects best method for environment

**Step 3: Anchor**
- AR information card **locks onto physical object**
- Leader line shows connection (solves occlusion problem)
- Card stays attached while user walks 3-4m (≥10s stability)

**Step 4: Learn**
- Name, year built, historical blurb, images
- Voice narration (optional, hands-free for glasses)
- Share to social media (30%+ share rate target)

**Key UX Innovation:**
- **Confidence Gating:** Green (locked) / Amber (uncertain, show nearest POIs) / Grey (searching)
- **Graceful Degradation:** If GPS drifts, prompt "Re-aim camera to lock"
- **Cross-Device:** Same POI data on phone, Quest 3, future glasses

---

## Slide 4: TECHNOLOGY (Hybrid Anchoring Deep Dive)

**Title:** Hybrid AR: Best of GPS + Vision AI

**Visual:** Technical diagram showing dual-path architecture.

**Content:**

**Path 1: Outdoor (GPS-Based)**
- **Tech:** ARCore Geospatial API + Streetscape Geometry
- **Latency:** p50 <0.6s (GPS lock → API call → anchor placement)
- **Accuracy:** ±5-15m (sufficient for landmarks >10m)
- **Use Case:** Clock Tower, Star Ferry, IFC, open areas

**Path 2: Indoor (Vision-Based)**
- **Tech:** Quest 3 Passthrough Camera API + Gemini Vision AI
- **Latency:** p50 <1.5s (frame capture → AI inference → 2D→3D raycast)
- **Accuracy:** ±0.5m (precise object detection)
- **Use Case:** Museum rooms, galleries, interior exhibits

**Path 3: High-Precision (Optional Fallback)**
- **Tech:** Vuforia Area Target (pre-scanned environments)
- **Latency:** p50 <1.2s (image recognition → pose estimation)
- **Accuracy:** ±5cm (cm-level precision)
- **Use Case:** High-value museums willing to invest in scanning

**System Intelligence:**
- **Automatic Selection:** Choose GPS/Vision based on GPS accuracy + indoor/outdoor detection
- **Parallel Requests:** Send both GPS + Vision API calls, use whichever returns first
- **Confidence Scoring:** 0.0-1.0 confidence, gate UI based on threshold (0.85 = green)

**Performance Breakthrough:**
- **<2s response time** (vs. 5-8s industry avg)
- **≥10s anchor stability** while walking
- **99.5% crash-free** target

---

## Slide 5: DEMO SHOTS (Clock Tower + Museum Room)

**Title:** Sightline in Action

**Visual:** 4-photo grid with captions:

**Photo 1 (Top-Left): Clock Tower - Outdoor GPS Path**
- User holding phone at Clock Tower
- AR card visible on screen, anchored to building
- Green border (high confidence lock)
- Telemetry overlay: "1.4s · 0.89 · geo"

**Photo 2 (Top-Right): Leader Line Visualization**
- Close-up of AR card with leader line connecting to anchor point
- Card shows: "Clock Tower (鐘樓) | Built 1915 | Former Kowloon-Canton Railway terminus"
- Distance chip: "12m away"

**Photo 3 (Bottom-Left): Museum Room - Indoor Vision Path**
- User wearing Quest 3 in museum
- Passthrough view with AR card anchored to exhibit
- Amber border (medium confidence, showing 2 nearest POI chips)
- Telemetry overlay: "1.8s · 0.72 · vision"

**Photo 4 (Bottom-Right): Student Engagement**
- Teacher trial photo: 15+ students at Tsim Sha Tsui Promenade
- Students pointing phones at Star Ferry pier
- Quote overlay: "My students were more engaged than ever" - [Teacher Name, School]

**QR Code (Bottom-Right Corner):**
- Link to 90-second demo video: [YouTube/Google Drive link]

---

## Slide 6: KEY PERFORMANCE INDICATORS (KPIs)

**Title:** Measurable Impact (6-Month CCMF Targets)

**Visual:** Dashboard-style layout with 3 sections:

**Technical Performance:**
| Metric | Target | Verification |
|--------|--------|--------------|
| Response time (p50) | ≤2.0s | Server logs |
| Anchor stability | ≥10s | Video proof |
| Crash-free rate | ≥99.5% | Crashlytics |
| POIs operational | 20 | Database count |

**User Engagement:**
| Metric | Target | Verification |
|--------|--------|--------------|
| Beta users | 50 | Google Analytics |
| Active users (≥1 POI) | 40/50 (80%) | App telemetry |
| Student satisfaction | ≥80% | Survey results |
| Share rate | ≥30% | Event tracking |
| D7 retention | ≥25% | Cohort analysis |

**Business Development:**
| Metric | Target | Verification |
|--------|--------|--------------|
| Venue outreach | 10 | Email records |
| Warm leads | ≥2 | CRM notes |
| Signed LOI | ≥1 | Signed PDF |
| CIP application ready | Yes | Draft submitted |

**Social Impact:**
| Metric | Target | Verification |
|--------|--------|--------------|
| Students reached (trial) | ≥15 | Attendance list |
| Free tier users | ≥500 | Analytics |
| Dwell time increase | +20-30% | Venue data |
| Open-source GitHub stars | ≥50 | GitHub metrics |

**Competitive Benchmark:**
- **Response time:** 2.0s vs. 5-8s (Niantic Lightship, museum apps)
- **Setup friction:** Zero vs. 5 min (download app, choose audio guide)

---

## Slide 7: GO-TO-MARKET (GTM) STRATEGY

**Title:** B2B2C: Venues → Educators → Students/Tourists

**Visual:** Funnel diagram showing 3-tier strategy.

**Content:**

**Phase 1 (Month 1-3): Proof of Concept**
- Build MVP with 10 POIs (Clock Tower, Star Ferry, Avenue of Stars, etc.)
- Field test at Tsim Sha Tsui Promenade
- Collect performance data (latency, stability, crash-free rate)

**Phase 2 (Month 4-6): Education Pilot**
- Teacher trial: 15+ students at heritage walk
- Collect testimonial video + satisfaction survey (≥80% target)
- Case study: "[School name] increases engagement by 25%"
- Venue outreach: 10 museums + heritage sites

**Phase 3 (Month 7-12, Post-CCMF / CIP): Venue SDK Launch**
- **Target:** 10 paying venues by Month 12
- **Pricing:** HK$5K-15K/year (tiered by # of POIs, monthly users)
- **Sales:** Direct B2B outreach, museum association partnerships
- **Marketing:** Conference presence (MuseumNext Asia, EdTech Asia), CCMF showcase

**Phase 4 (Month 13-24): Scale & Glasses**
- **Target:** 50 venues, HK$500K ARR (operational break-even)
- **Expansion:** Singapore, Taiwan, Japan (heritage-rich markets)
- **Glasses:** Quest 3 MR mode, Ray-Ban Meta partnership exploration
- **Creator Tools:** Enable historians, educators to author POI content (rev-share model)

**Competitive Moat:**
- First-mover in HK heritage AR with proven hybrid anchoring
- Venue relationships + 200+ POI content library (barrier to entry)
- Free tier for schools = market penetration + social goodwill

---

## Slide 8: SOCIAL VALUE (Why It Matters)

**Title:** Education + Heritage + Ethics

**Visual:** 3 icons with stats:

**1. Educational Equity**
**Icon:** School building
**Stat:** 500+ HK schools, 350K+ students
**Details:**
- Free tier: edu.sightline.hk (no ads, no caps, full features)
- Traditional Chinese + English localization
- Mobile-first (no specialized hardware required)
- Voice I/O roadmap (accessibility for visually impaired)

**2. Cultural Heritage Preservation**
**Icon:** Heritage building
**Stat:** 20-30% dwell time increase target
**Details:**
- Preserves HK heritage stories for digital-native youth
- Makes history tangible through immersive AR storytelling
- Long-term: Archive 200+ HK POI database (community resource)
- Co-designed with educators (8 interviews, lesson plan templates)

**3. Ethical Technology**
**Icon:** Shield with checkmark
**Stat:** Privacy-first, no facial recognition
**Details:**
- No facial recognition (explicitly rejected feature requests)
- Blur faces/license plates before Vision API upload (client-side)
- Minimal data collection: POI query logs only (anonymized)
- User notes: Profanity filter + moderation queue
- Transparent: Display method, latency, confidence on every query

**Open Source Contribution:**
- Quest 3 POI detection script (MIT License, companion to Meta samples)
- ARCore Geospatial HK examples (GPS drift mitigation techniques)
- Field testing data (latency benchmarks, GPS heatmaps)
- **Target:** ≥50 GitHub stars by Month 6

**Alignment with CCMF Social Responsibility Criteria (10%):**
- ✅ Social responsibility as **core project focus** (free school tier)
- ✅ Contribution to open source and "progressive" technologies
- ✅ Ethical decision-making (privacy, content safety)
- ✅ Solving social problem (youth disengagement with heritage)

---

## Slide 9: TEAM & EXECUTION

**Title:** Technical Expertise + Execution Track Record

**Visual:** Team photo (if available) + role breakdown.

**Content:**

**Principal Applicant: [Your Name]**
**Role:** Founder & Technical Lead  
**HKID:** Confirmed (18+)

**Background:**
- 5+ years software development (Unity, AR Foundation, Node.js, TypeScript)
- [X] past projects totaling [Y] users/downloads
- HK heritage sector knowledge (visited 15+ museums, interviewed 8 educators)

**Technical Skills:**
- **AR Development:** Unity, ARCore Geospatial, Quest 3 MR, ARKit
- **Backend:** Fastify, Express, PostgreSQL, Redis
- **AI Integration:** Gemini Vision API, prompt engineering, Unity Sentis
- **DevOps:** Git, GitHub Actions, Docker, Firebase

**Execution Proof:**
- ✅ Shipped [Project 1] in [X] months ([Y] users/downloads)
- ✅ GitHub: [github.com/username] - [Z] commits/year, [W] public repos
- ✅ [Project 2]: [Brief description of relevant achievement]

**Team Structure (6-Month CCMF Period):**

**Unity XR Contractor (Part-time, 3 months)**
- **Budget:** HK$35,000 (240 hours total)
- **Responsibilities:** AR Foundation, ARCore Geospatial, Quest 3 integration, leader line rendering
- **Hiring:** Week 2 (after backend validates feasibility)

**UX/UI & Video Production (Project-based)**
- **Budget:** HK$10,000
- **Responsibilities:** AR card design (Month 1, HK$4K), demo video (Month 5, HK$6K)
- **Hiring:** Solicit 2-3 quotes, select based on portfolio

**Advisors (if applicable):**
- [Advisor 1 Name], [Title], [Organization] - [Expertise area, e.g., museum partnerships]
- [Advisor 2 Name], [Title], [Organization] - [Expertise area, e.g., AR technical guidance]

**Risk Mitigation:**
- Contingency budget (HK$10,000) for contractor delays or hardware failure
- Phone-first approach: Quest 3 is enhancement, not MVP blocker
- Fallback plan: If Unity contractor unavailable, founder extends timeline by 2 weeks

**Why This Team Wins:**
- ✅ Proven track record of shipping projects on time
- ✅ Deep HK heritage domain knowledge
- ✅ Technical skills match project requirements (AR, backend, AI)
- ✅ Realistic scope (not over-promised)

---

## Slide 10: ROADMAP & ASK

**Title:** 6 Months → 2 Years → Vision

**Visual:** Timeline graphic with 3 phases + funding milestones.

**Content:**

**CCMF (6 Months, Feb–Jul 2026) - HK$100,000**

**Month-by-Month:**
| Month | Deliverable | KPI |
|-------|-------------|-----|
| 1 | MVP Backend + 10 POIs | p50 ≤2.5s |
| 2 | Unity AR + Vision AI | Method logging working |
| 3 | Teacher trial (15+ students) | ≥80% satisfaction |
| 4 | Public beta (50 users) | App Store/Play live |
| 5 | Demo video + venue outreach | 10 emails sent |
| 6 | Signed LOI + CIP application | LOI from 1 venue |

**Exit Criteria:**
- ✅ 20 POIs operational
- ✅ 50 beta users (≥80% satisfaction)
- ✅ 1 signed pilot LOI
- ✅ Teacher testimonial video
- ✅ Open-source Quest 3 script published

---

**CIP (12-24 Months, Aug 2026–Jul 2028) - HK$500,000**

**Use of Funds:**
- **Team Expansion:** Hire 2 FTE (Unity dev, sales/partnerships)
- **Technical Roadmap:** Scale to 50 venues, glasses R&D (Ray-Ban Meta)
- **Revenue Model:** Venue SDK subscriptions (target 10 paying venues by Month 12)
- **Social Impact:** Maintain free tier for HK schools

**Milestones:**
- Month 12: 10 venues × HK$10K = HK$100K ARR
- Month 18: Glasses adaptation (Quest 3 MR, Ray-Ban Meta partnership)
- Month 24: 50 venues × HK$10K = HK$500K ARR (operational break-even)

---

**Vision (3-5 Years)**

**Mission:** Default AR content layer for heritage sites across Asia-Pacific

**Goals:**
- 200K+ monthly active users
- 200+ venues across HK, Singapore, Taiwan, Japan
- Ray-Ban Meta official launch partner (when glasses release widely)
- Social enterprise model: 10% revenue to heritage preservation NGOs

**Exit Opportunities (if any):**
- Acquisition by EdTech platform (e.g., Snapask, TabSquare)
- Acquisition by museum tech vendor (e.g., Bloomberg Connects, Cuseum)
- Integration into Google Arts & Culture (Lens AR layer)

---

**THE ASK:**

**CCMF Grant: HK$100,000 (6 months)**
- Build working MVP with 20 POIs
- Validate with 50 beta users + teacher trial
- Sign 1 pilot LOI (museum or school)
- Prepare CIP application for scale-up funding

**Why Support Sightline:**
- ✅ **Proven Problem:** 78% of tourists want local insights, <30% museum engagement
- ✅ **Technical Innovation:** First HK app with hybrid GPS+Vision anchoring
- ✅ **Social Impact:** Free for 500+ HK schools (350K students)
- ✅ **Market Timing:** AR glasses on horizon, content library needed NOW
- ✅ **Execution Track Record:** Founder has shipped [X] projects totaling [Y] users
- ✅ **Clear Path to Sustainability:** B2B Venue SDK subscriptions (HK$500K ARR by Month 24)

**Contact:**
**[Your Name]** | [your.email@example.com] | [+852 XXXX XXXX]  
GitHub: [github.com/username] | LinkedIn: [linkedin.com/in/yourname]

**Demo:** [QR code linking to 90-second video]

---

**END OF DECK**

**Export Instructions:**
- Use Google Slides or PowerPoint template (clean, professional design)
- Keep text minimal (bullet points, not paragraphs)
- Use high-quality visuals (photos, diagrams, icons)
- Include QR code on final slide linking to demo video
- Export as PDF for EMS submission (<10MB)

**Presentation Tips:**
- Practice 5-7 minute delivery (if invited to CCMF presentation session)
- Emphasize hybrid anchoring (unique tech), social impact (free schools), and execution proof (past projects)
- Show demo video on Slide 5 (embed if presenting live, or provide link)
- End with clear ask: HK$100K CCMF → HK$500K CIP → sustainable business

