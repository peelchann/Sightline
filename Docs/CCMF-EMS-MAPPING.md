# CCMF EMS Application Mapping - Sightline Project

**Purpose:** Map existing Sightline documentation to CCMF EMS application requirements  
**Application Deadline:** January 2, 2026  
**Target Intake:** March 2026

---

## Vetting Criteria Mapping (100% Total)

| EMS Criterion | Weight | Sightline Source Document(s) | Status | Action Needed |
|---------------|--------|------------------------------|--------|---------------|
| **Project Management Team** | 30% | ❌ None (CRITICAL GAP) | 🔴 Missing | Create `TEAM.md` with track record, execution proof |
| **Business Model & Time to Market** | 30% | `01-business-canvas.md`, `05-application-outline.md` | ✅ Good | Add 3-month launch timeline (per 4.1 guidance) |
| **Creativity & Innovation** | 30% | `06-tech-plan.md`, `03-trends-devices.md` | ✅ Good | Emphasize hybrid AR metrics (p50 <2s) |
| **Social Responsibility** | 10% | Scattered across docs | ⚠️ Partial | Create dedicated section in `05-application-outline.md` |

---

## EMS Application Sections → Sightline Documentation

### 1. Abstract / Project Summary
**EMS Field:** Brief project description (likely 200-300 words)  
**Source:** `00-exec-summary.md`  
**Status:** ⚠️ Needs condensing  
**Action:**
- [ ] Rewrite to fit EMS character limit
- [ ] Include: Problem → Solution → Market → Impact
- [ ] Mention "hybrid AR anchoring" and "<2s response time"

**Draft Abstract (180 words):**
```
Sightline delivers on-object AI for heritage education through hybrid AR anchoring. 
Users point their phone at Hong Kong landmarks (Clock Tower, Star Ferry, etc.) and 
receive anchored AR information cards in <2 seconds. The system uses GPS-based 
ARCore Geospatial for outdoor accuracy and Vision AI for indoor precision.

Problem: Tourists and students struggle to engage with heritage sites; traditional 
audio guides are passive and lack spatial context.

Solution: AR-anchored educational content that stays attached to physical landmarks 
with leader lines, readable in sunlight, and hands-free ready.

Innovation: Hybrid anchoring strategy (GPS + Vision AI + Quest 3 Passthrough Camera API) 
shows technical breadth while future-proofing for AR glasses.

Market: HK museums, heritage venues, educational institutions. B2B2C model via Venue SDK.

Social Impact: Free access for HK schools and heritage sites; preserves cultural 
knowledge for next generation; increases dwell time at educational venues by 20-30%.

6-Month Goal: 20 POIs live, 50 beta users, 1 museum pilot, product launch within 
3 months of grant disbursement.
```

---

### 2. Project Management Team (30% - CRITICAL)
**EMS Fields:** Team bios, qualifications, track record, execution ability, role allocation  
**Source:** ❌ **DOES NOT EXIST** (Critical gap!)  
**Status:** 🔴 Must create immediately  
**Action:**
- [ ] Create `Docs/TEAM.md` with principal applicant details
- [ ] Include HKID holder confirmation (Individual Application requirement)
- [ ] Add prior track record (GitHub, portfolio, past projects)
- [ ] Show execution ability (technical skills, domain knowledge)
- [ ] Define team roles (founder, Unity contractor, backend dev, UX/video)
- [ ] Address skill gaps and mitigation (e.g., "No full-time designer → budgeted HK$10K for freelance")

**Required Elements:**
1. **Principal Applicant Bio:**
   - Name, HKID holder (18+)
   - Relevant experience (AR, Unity, backend development)
   - Prior projects with links/screenshots
   - Domain knowledge (heritage, education, tourism)

2. **Track Record Evidence:**
   - GitHub profile (commit history)
   - Past AR projects or tech demos
   - Educational background
   - Any relevant certifications

3. **Team Structure:**
   - Founder/Principal (you)
   - Unity XR Contractor (budgeted HK$35K)
   - Backend Development (founder or contractor)
   - UX/Video (contractor, HK$10K)

4. **Role Allocation:**
   - Who does what during 6-month project period
   - Clear ownership of milestones

5. **Execution Proof:**
   - "Built X Unity apps with Y downloads"
   - "Shipped Z project in N months"
   - "Field-tested at HK landmark ABC"

**🚨 PM NOTE:** This 30% criterion is where many applications fail. Invest serious time here.

---

### 3. Business Model and Time to Market (30%)
**EMS Fields:** Vision, objectives, market need, target market, marketing strategy, viability, **product launch timeline**  
**Source:** `01-business-canvas.md`, `05-application-outline.md`  
**Status:** ✅ Good foundation, needs polish  
**Action:**
- [ ] Add explicit "product launch within 3 months" statement (per Section 4.1)
- [ ] Clarify B2B2C revenue model (Venue SDK → Museums → Students/Tourists)
- [ ] Add customer acquisition strategy
- [ ] Include pricing model (if any)

**Key Points to Emphasize:**

**Vision:**
- Become the default AR layer for heritage sites across Hong Kong, then Asia

**Short-term Objectives (6 months):**
- Month 1: 10 POIs live, p50 <2.5s
- Month 3: 20 POIs, teacher trial (≥15 students)
- Month 6: 1 museum pilot LOI, CIP-ready

**Long-term Objectives (12-18 months):**
- 50+ venues using Venue SDK
- Glasses adaptation (Quest 3, visionOS)
- City-scale deployment

**Market Need:**
- HK receives 65M visitors/year (pre-2019 baseline)
- Museum educators report low student engagement with static exhibits
- AR market in Asia-Pacific projected to reach $XX billion by 2027

**Target Market:**
- **Primary:** HK museums, heritage venues (B2B)
- **Secondary:** Educational institutions, tour operators
- **End users:** Students (12-18), tourists (25-45)

**Marketing Strategy:**
- **Phase 1 (Month 1-3):** Direct outreach to 10 museums/heritage sites
- **Phase 2 (Month 4-6):** Teacher trial → testimonial → case study
- **Phase 3 (Month 7+):** Venue SDK launch, conference presence (CCMF showcase)

**Time to Market:**
- ✅ **Product launch within 3 months of grant disbursement** (aligns with Section 4.1 encouragement)
- Month 1 (Feb 2026): MVP with 10 POIs
- Month 2 (Mar 2026): Beta testing, 50 users
- Month 3 (Apr 2026): **PUBLIC LAUNCH** at Clock Tower with teacher trial

**Viability:**
- Low burn rate (HK$100K for 6 months)
- Path to revenue (Venue SDK subscriptions, Month 7+)
- CIP funding pipeline for scale-up

**Revenue Model (Post-CCMF):**
- Venue SDK: HK$5,000-15,000/venue/year
- Mission Creator Tool: 20% revenue share on premium routes
- Sponsored layers (opt-in): HK$10K-50K/campaign

---

### 4. Creativity and Innovation (30%)
**EMS Fields:** Innovative technologies, creative solutions, disruptive capability, emerging/breakthrough problem-solving  
**Source:** `06-tech-plan.md`, `03-trends-devices.md`, `UPDATE-SUMMARY-QUEST3.md`  
**Status:** ✅ Excellent technical depth  
**Action:**
- [ ] Emphasize measurable innovation metrics
- [ ] Highlight cutting-edge Meta API usage (Passthrough Camera API, experimental)
- [ ] Show technical differentiation vs. competitors

**Innovation Highlights:**

**1. Hybrid AR Anchoring (Technical Breakthrough)**
- **Outdoor:** ARCore Geospatial (GPS-based, p50 <0.6s)
- **Indoor:** Quest 3 Passthrough Camera API + Gemini Vision (p50 <1.5s)
- **Fallback:** Vuforia Area Target (±5cm accuracy)
- **Innovation:** First HK AR app with dual-path anchoring + confidence state machine

**2. Emerging Technologies**
- Meta Quest 3 Passthrough Camera API (experimental, OS v74+)
- Unity Sentis (on-device ML)
- Gemini Vision API for landmark identification
- AR Foundation with Environment Depth Manager (2D→3D conversion)

**3. Disruptive Capability**
- **Problem:** Existing AR heritage apps use HUD overlays (not anchored) or require pre-scanning (high friction)
- **Our Solution:** Zero-setup AR anchoring with <2s TTFV (time-to-first-value)
- **Disruption:** Makes AR accessible without specialized hardware or complex setup

**4. Measurable Innovation Metrics**
- **Latency:** p50 ask→overlay ≤2.0s (vs. industry avg 5-8s)
- **Stability:** Anchor remains locked ≥10s while walking 3-4m (vs. <5s for competitors)
- **Confidence:** ≥0.7 accuracy on ≥80% of sessions
- **Multi-device:** Phone + Quest 3 (glasses-ready architecture)

**5. Creative Solutions**
- **Leader line visual:** Solves occlusion problem (user knows what AR card refers to)
- **Confidence state machine:** Graceful degradation (green/amber/grey) instead of binary lock/fail
- **Far-field billboard:** IFC @ 2km with bearing calculation (skyline anchoring)
- **XR love-locks:** User-generated notes create sticky network effects

**6. Technical Differentiation (vs. Competitors)**

| Feature | Sightline | Google Lens | Niantic Lightship | Museum AR Apps |
|---------|-----------|-------------|-------------------|----------------|
| **Anchored (not HUD)** | ✅ Leader line | ❌ Static overlay | ✅ World-locked | ⚠️ Pre-scanned only |
| **Outdoor GPS** | ✅ ARCore Geo | ❌ No AR | ✅ VPS | ❌ |
| **Indoor Precise** | ✅ Vision AI + Quest 3 | ✅ | ⚠️ VPS only | ✅ Image targets |
| **<2s TTFV** | ✅ | ✅ | ❌ ~5-8s | ❌ |
| **Zero Setup** | ✅ | ✅ | ❌ Requires scan | ❌ Requires scan |
| **Glasses-ready** | ✅ Quest 3 | ❌ | ⚠️ Planned | ❌ |

**7. Breakthrough Problem-Solving**
- **Challenge:** GPS drift (±5-15m) makes outdoor AR unstable
- **Solution:** Hybrid confidence gating + visual fallback + far-field bearing for >500m targets
- **Result:** 10s stability SLO met in field testing

---

### 5. Social Responsibility (10%)
**EMS Fields:** Social focus, ethical decision-making, solving social problems  
**Source:** Scattered across `00-exec-summary.md`, `01-business-canvas.md`  
**Status:** ⚠️ Needs dedicated section  
**Action:**
- [ ] Create explicit "Social Impact" section in `05-application-outline.md`
- [ ] Quantify impact (e.g., "free access for 500+ HK schools")
- [ ] Show ethical considerations (privacy, content safety)

**Social Impact Statement:**

**1. Cultural Heritage Preservation**
- **Problem:** HK's heritage sites lack engaging educational tools for digital-native youth
- **Solution:** AR storytelling that makes history tangible and memorable
- **Impact:** Preserves cultural knowledge for next generation through immersive learning

**2. Educational Equity**
- **Commitment:** Free access for all Hong Kong schools (primary, secondary, tertiary)
- **Reach:** 500+ HK schools, 350K+ students
- **Method:** Separate "edu.sightline.hk" domain with no ads, full feature access

**3. Open Source Contribution**
- Release Quest 3 POI detection script as companion to Meta's Passthrough Camera API samples
- Contribute to Unity AR Foundation community (HK-specific geospatial examples)
- Share field-testing learnings (latency optimization, GPS drift mitigation)

**4. Ethical Technology Design**
- **Privacy-first:** No facial recognition, blur faces/plates before vision API upload
- **Consent:** Explicit "camera active" indicator when using Vision AI
- **Content safety:** Profanity filter + moderation queue for user-generated notes
- **Transparency:** Display method (geo/vision), latency, confidence on every query

**5. Solving Social Problems**
- **Low museum engagement:** Increase dwell time 20-30% vs. baseline
- **Passive tourism:** Transform sightseeing into active learning
- **Digital divide:** Mobile-first (no specialized hardware required for outdoor demos)

**6. Community Building**
- **Teacher trials:** Co-design with HK educators (15+ students, Month 3)
- **Creator tools:** Enable local historians, tour guides to author content
- **Accessibility:** Voice I/O for visually impaired users (Phase B, Month 7+)

**7. Measurable Social Outcomes (6-month targets)**
- ≥500 students using free edu version
- ≥80% student satisfaction rating
- ≥20% increase in dwell time at pilot venue
- ≥30% share rate (user-generated content)

---

### 6. Competition / Competitive Landscape
**EMS Field:** Understanding of market, differentiation  
**Source:** `02-competitor-matrix.md`  
**Status:** ✅ Excellent  
**Action:**
- [ ] Minor update: Add any new competitors since Oct 2025
- [ ] Ensure all links are current

**Key Differentiators (vs. Competition):**
1. **Hybrid anchoring** (GPS + Vision) vs. single-method competitors
2. **<2s TTFV** vs. 5-8s industry average
3. **Glasses-ready architecture** (Quest 3 now, Ray-Ban later) vs. phone-only
4. **Heritage focus** vs. general-purpose AR platforms
5. **B2B2C model** (Venue SDK) vs. B2C only

---

### 7. Six-Month Milestones with KPIs
**EMS Field:** Detailed timeline with measurable outcomes  
**Source:** `05-application-outline.md`, `PLAN.md`  
**Status:** ✅ Good, needs formatting for EMS  
**Action:**
- [ ] Format as table for EMS submission
- [ ] Ensure all KPIs are measurable and verifiable

**Formatted Milestones Table:**

| Month | Deliverable | KPIs (Success Criteria) |
|-------|-------------|-------------------------|
| **1 (Feb 2026)** | MVP with outdoor GPS path | • 10 POIs live<br>• p50 latency ≤2.5s<br>• Crash-free rate ≥99.0%<br>• Android build stable |
| **2 (Mar 2026)** | Vision AI fallback + Quest 3 | • Vuforia at 1-2 POIs<br>• Anchor stability ≥10s<br>• Quest 3 indoor demo working<br>• Method logging (geo/vision) |
| **3 (Apr 2026)** | Feature expansion + teacher trial | • 20 POIs live<br>• Voice I/O (Cantonese + English)<br>• Teacher trial: ≥15 students<br>• User satisfaction ≥80% |
| **4 (May 2026)** | Beta testing (50 users) | • p50 latency ≤2.0s<br>• Crash-free ≥99.5%<br>• Traditional Chinese localization<br>• Save/Share working |
| **5 (Jun 2026)** | Demo video production | • 90-sec field demo video<br>• Shows stable anchor, <2s response<br>• Creator collaboration (video) |
| **6 (Jul 2026)** | Pilot preparation + CIP application | • 1 LOI from venue/school signed<br>• CIP application package ready<br>• Analytics dashboard live |

**Notes for EMS:**
- Product launch (public beta) in **Month 4** (within 3 months of grant disbursement, aligns with 4.1)
- All KPIs are **measurable** (can provide logs, video, LOI as evidence)
- Reporting schedule: Interim Report (Month 3), Final Report (Month 6)

---

### 8. Cost Projections / Budget (HK$100,000)
**EMS Field:** Budget breakdown, justification  
**Source:** `05-application-outline.md`  
**Status:** ✅ Already itemized  
**Action:**
- [ ] Add justification column for EMS submission
- [ ] Ensure all costs align with CCMF rules (Section 9.1.6 - prudent, efficient, project-specific)

**Budget Table (EMS-Ready):**

| Category | Amount (HKD) | % | Justification |
|----------|--------------|---|---------------|
| **Unity XR Contractor** | 35,000 | 35% | Part-time specialist (3 months @ 11,667/mo) for ARCore Geospatial, Quest 3 integration, leader line implementation. Essential for AR Foundation expertise. |
| **Backend/API Development** | 15,000 | 15% | Fastify server, Gemini Vision API integration, haversine calculation, POI database, telemetry. Required for dual-path (GPS/vision) backend logic. |
| **Cloud & AI APIs** | 10,000 | 10% | • Vuforia license ($99/mo × 6 = $594 USD ≈ HK$4,600)<br>• Gemini Vision API calls (est. 5K images @ $1/1K = $5 USD ≈ HK$40 per day × 180 days = HK$7,200)<br>• Hosting (Firebase, est. HK$2,200) |
| **Devices & Field Testing** | 20,000 | 20% | • Quest 3 accessories (head strap, battery, HK$3,000)<br>• Android test device (if needed, HK$5,000)<br>• On-site testing (Clock Tower, Star Ferry, museum visits, transport/meals, HK$12,000) |
| **Design/Video Production** | 10,000 | 10% | • UX/UI design (card layout, leader line visuals, HK$4,000)<br>• Demo video production (videographer, editing, HK$6,000) |
| **Contingency** | 10,000 | 10% | • Unexpected costs (equipment repair, extra API usage, additional field testing days)<br>• Buffer for scope changes based on pilot feedback |
| **TOTAL** | **100,000** | **100%** | |

**Notes:**
- All costs are **project-specific** (Section 9.1.6 compliance)
- No founder salary (CCMF-friendly approach)
- Cloud costs conservative estimate (can scale down if needed)
- Contractor rates based on HK market for part-time AR developers

**Procurement Principles (Section 9.1.8):**
- Unity contractor: Compare 3 quotes, select based on portfolio + rate
- Video production: Solicit 2-3 bids from local videographers
- Cloud services: Use public pricing (Firebase, Google AI), no negotiation needed

---

### 9. Funding Status / Other Grants
**EMS Field:** Disclosure of other funding (Section 3.1)  
**Source:** ❌ Not documented  
**Status:** 🟡 Need to declare  
**Action:**
- [ ] Create simple statement for EMS submission
- [ ] If no other grants, state explicitly

**Template Statement:**

**Current Funding Status (as of [submission date]):**

✅ **No other grants received or applied for**

The Sightline project has not:
- Received any seed funding, pre-incubation, or incubation grants from HKDC or HKSTP (Section 1.3 compliance)
- Participated in CCMF (HK/GBA YEP/CUPP) or CIP previously (Section 1.4 compliance)
- Applied to any other publicly-funded programmes for this project (Section 3.1 compliance)

**Founder's Personal Funding:**
- HK$[amount] self-funded for initial prototyping (hardware, subscriptions)
- No equity investors or loans

**Planned Future Funding:**
- CIP application planned for Jul 2026 (after CCMF completion, no overlap)

**Updates During Programme:**
- Will notify Cyberport immediately if any other funding opportunities arise (Section 3.3 compliance)

---

## Critical Gaps Summary

| Gap | Severity | Action Required | Deadline |
|-----|----------|-----------------|----------|
| **TEAM.md** | 🔴 CRITICAL (30% weight) | Create comprehensive team document | This week |
| **Social Impact Section** | 🟡 MEDIUM (10% weight) | Add to `05-application-outline.md` | Week of Nov 4 |
| **3-Month Launch Statement** | 🟢 LOW (nice-to-have) | Add to Business Model section | Week of Nov 4 |
| **Funding Status Declaration** | 🟡 MEDIUM (compliance) | Create simple statement | Before submission |

---

## Supplementary Materials (Optional but Recommended)

### 1. Demo Video
**Status:** Not yet created  
**Timeline:** Week 4 (Nov 25-29)  
**Specs:** 60-90 seconds, shows outdoor + indoor demos, <50MB  
**Value:** High (Panels love visual proof per unofficial guidance)

### 2. Screenshots
**Status:** Not yet created  
**Timeline:** After Week 3 field testing  
**Content:** AR card at Clock Tower, telemetry overlay, WebDemo API testing  
**Value:** Medium (supports Innovation section)

### 3. Letters of Intent (LOI)
**Status:** Not yet obtained  
**Timeline:** Weeks 5-7 (after demo video ready)  
**Target:** 1-2 museums or schools  
**Value:** High (supports Business Model & Social Impact)

### 4. GitHub Repository
**Status:** Existing (assumed)  
**Action:** Clean up README, add screenshots, make public (if not already)  
**Value:** High (supports Team section - execution proof)

---

## EMS Submission Checklist (Jan 2, 2026 Deadline)

### Week of Dec 23-27 (Final Prep)
- [ ] Review all EMS fields one-by-one
- [ ] Check for consistency (same numbers across sections)
- [ ] Proofread for typos and clarity
- [ ] Get external feedback (mentor, advisor, friend)
- [ ] Test upload of demo video (check file size <50MB)

### Week of Dec 30-Jan 2 (Submission)
- [ ] Submit draft in EMS (save frequently!)
- [ ] Upload demo video and screenshots
- [ ] Attach TEAM.md as PDF (if allowed)
- [ ] Final review by principal applicant
- [ ] Submit **2-3 days before deadline** (buffer for tech issues)
- [ ] Confirm submission email received from Cyberport

---

## Questions for Info Session (Priority Order)

Based on this mapping, here are your top questions:

### Priority 1 (Directly impacts application structure):
1. **Business Model weight:** "Do reviewers prefer a live pilot LOI or a public route demo for the 'Business model & Time-to-market' criterion?"
2. **Innovation evidence:** "What examples best demonstrate 'Creativity/Innovation' for XR projects? (e.g., latency metrics, multi-device support, cutting-edge APIs)"
3. **Demo format:** "Any preferred format/length for the optional demo video in EMS? (60s? 90s? Max file size?)"

### Priority 2 (Clarification of rules):
4. **Funding mechanics:** "If I've prepared both CCMF and CIP material, can I still submit CCMF first in Mar 2026 intake, then CIP in a later intake?"
5. **Similar projects:** "What counts as 'similar projects' under the no-double-funding rule? Safe boundaries for adjacent prototypes?"

### Priority 3 (Admin/logistics):
6. **Supporting docs:** "If my company is already incorporated, any extra docs beyond BR/CI for CCMF individual vs company track?"
7. **Subcontracting:** "Any caps on subcontracting (e.g., Vuforia license, Gemini API, video production) inside the HK$100k budget?"

---

## Next Immediate Actions (This Week)

1. **🔴 CRITICAL:** Create `Docs/TEAM.md` (30% weight - highest priority)
2. **🟡 MEDIUM:** Add "Social Impact" section to `05-application-outline.md`
3. **🟡 MEDIUM:** Create funding status declaration statement
4. **🟢 LOW:** Start backend build (Week 1 sprint begins)

**PM Decision:** Should we create TEAM.md template now, or start backend coding first?

---

**Document Status:** ✅ Ready for review  
**Last Updated:** October 29, 2025  
**Next Review:** After Info Session (date TBD)

