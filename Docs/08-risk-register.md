# Risk Register

**Last updated:** October 2025

## Overview

Top 8 risks for Sightline MVP (Months 1-6) with likelihood, impact, early tests, and mitigations.

---

## Risk 1: ARCore Geospatial Accuracy Degrades in Dense Urban Areas

**Category:** Technical  
**Likelihood:** Medium (40%)  
**Impact:** High (poor anchor stability = bad UX)  

**Description:**
ARCore Geospatial API relies on Visual Positioning System (VPS) which requires clear views of buildings for visual localization. Narrow streets, heavy tree cover, or tall buildings (e.g., Central's skyscraper canyons) may degrade accuracy from 1-5m to 10-20m, causing anchors to drift.

**Early Test (Week 3-4):**
- Deploy test build at 5 locations:
  - **Open plaza:** Tsim Sha Tsui Promenade (expected: ≤2m accuracy)
  - **Narrow street:** Pottinger Street, Central (test: does accuracy degrade?)
  - **Park:** Kowloon Park (tree cover test)
  - **Indoor:** Harbour City mall (GPS fails; fallback needed)
  - **Night:** Clock Tower after sunset (lighting test)
- Measure: anchor drift per second; GPS accuracy reported by ARCore

**Mitigation:**
1. **Fallback to ARCore Cloud Anchors** — If geospatial accuracy >10m, switch to visual SLAM + manual placement ("Tap to place")
2. **Display tracking quality** — Show "Low tracking" warning when accuracy degrades; prompt user to move to open area
3. **Hybrid mode** — Use geospatial for initial placement, then visual tracking to maintain stability
4. **POI radius increase** — For narrow streets, increase match radius from 150m to 250m

**Success Criteria:**
- Anchor stability ≥10s in 4/5 test locations
- Fallback triggers correctly when geospatial unavailable

---

## Risk 2: API Latency Exceeds 2s Target Due to Network Congestion

**Category:** Technical  
**Likelihood:** Low (20%)  
**Impact:** Medium (user frustration; still usable at 3-5s)

**Description:**
HK has excellent 5G coverage (99%+ in urban areas), but outdoor locations (e.g., hiking trails, remote piers) may have 4G or poor signal. If API latency spikes to 5-10s, users perceive the app as broken.

**Early Test (Week 2-3):**
- Simulate poor network:
  - Chrome DevTools → throttle to "Slow 3G" (50ms latency, 50kbps)
  - Test `/answer` endpoint latency
- Measure: p50, p95, p99 latency under throttling

**Mitigation:**
1. **On-device POI cache** — Cache 10-20 most popular POIs locally (reduce API calls by 60-80%)
2. **Loading animation** — Show "Asking..." spinner to set expectations
3. **Timeout + retry** — If API >5s, show "Network issue, retrying..." and retry once
4. **CDN edge caching** — Use CloudFront (HK region) to serve API from edge (reduces latency by 50-100ms)

**Success Criteria:**
- Cached queries: <500ms latency (no network call)
- Uncached queries on 5G: <1.5s (p50), <3.0s (p95)
- Slow 3G: <5s (p95) with loading state visible

---

## Risk 3: Google Ships "Lens AR" with Persistent Anchoring

**Category:** Market  
**Likelihood:** Low (15%)  
**Impact:** Critical (commoditizes core feature; hard to compete)

**Description:**
Google Lens currently does 2D image search without AR anchoring. If Google adds persistent AR overlays (likely post-2026 given their ARCore focus), they win on distribution (built into Android). Sightline's tech advantage evaporates.

**Early Test (Ongoing):**
- Monitor Google I/O, ARCore release notes, Lens blog for announcements
- Set up Google Alerts: "Google Lens AR", "ARCore geospatial update"

**Mitigation:**
1. **Pivot to B2B** — If Google ships consumer AR, focus on tour operators, heritage sites (curated content = moat)
2. **Local partnerships** — Sign exclusive content deals with HK sites (Google can't replicate local relationships)
3. **White-label platform** — Offer "Sightline SDK" for museums, malls to build custom AR experiences
4. **Speed advantage** — Ship MVP 6-12 months before Google (if they even prioritize this); build user base early

**Success Criteria:**
- 2-3 pilot site agreements signed by Month 4 (defensibility)
- Open-source toolkit released (community lock-in)

---

## Risk 4: Low User Adoption (Tourists Don't Download AR Apps)

**Category:** Market  
**Likelihood:** Medium (35%)  
**Impact:** High (no traction = no CIP funding)

**Description:**
App install friction is real. Tourists (who stay in HK 3-5 days) may not want to download a single-purpose app. If downloads <100 in first 6 months, MVP fails to prove market fit.

**Early Test (Month 5):**
- Deploy WebAR demo (8th Wall or ARCore WebXR)
- QR codes at 3 pilot sites → instant browser experience (no app download)
- Measure: scan-to-usage rate (target: 30%+ scan → interact)

**Mitigation:**
1. **WebAR trial mode** — Zero-install experience for casual users; native app for power users
2. **Hotel partnerships** — Pre-install Sightline on loaner phones; hotels get affiliate revenue
3. **Tour operator bundles** — Partner with Klook, KKday to include Sightline in tour packages
4. **QR codes everywhere** — Physical signs at pilot sites: "Scan to explore with AR"

**Success Criteria:**
- WebAR trial: 50+ scans in Month 5
- Native app: 100+ downloads in Month 6 (post-demo video)
- Conversion rate: 20%+ trial → download

---

## Risk 5: Pilot Sites Decline Partnership After MVP Demo

**Category:** Operational  
**Likelihood:** Low (20%)  
**Impact:** Medium (limits demo credibility; harder to secure CIP)

**Description:**
Heritage sites (Clock Tower, Star Ferry) may decline after seeing MVP if they perceive:
- Tech is too buggy (anchor drifts, crashes)
- No clear benefit (visitors don't engage; no analytics to prove value)
- Liability concerns (AR overlays on government property)

**Early Test (Month 3):**
- Informal demo to site managers (before formal pitch)
- Gauge reactions; ask: "What would make this a no-brainer yes?"

**Mitigation:**
1. **Polish MVP before pitching** — Ensure anchor stability ≥90% success rate
2. **Analytics dashboard** — Show site managers: "50 visitors engaged for avg 3 min; 85% satisfaction"
3. **Free deployment** — Offer 6 months free in exchange for testimonial + usage data
4. **Liability waiver** — Draft simple agreement: "Sightline is educational tool; no physical installation; revocable anytime"
5. **Backup sites** — Have 5-6 POIs ready; if 2 decline, we still have 3 for demo

**Success Criteria:**
- 2-3 signed LOI (Letter of Intent) by Month 4
- 1-2 backup sites identified
- Legal template approved by pro bono lawyer

---

## Risk 6: Unity + ARCore Integration Takes Longer Than Expected

**Category:** Technical  
**Likelihood:** Medium (30%)  
**Impact:** Medium (delays demo video; Month 4 → Month 5)

**Description:**
ARCore Geospatial API has ~20 setup steps (API keys, AndroidManifest permissions, proguard rules, etc.). First-time integration can take 1-2 weeks of debugging (e.g., "ARCore session failed to initialize" errors are common).

**Early Test (Week 8-9):**
- Set up barebones Unity + ARCore Geospatial project
- Deploy to test device (Pixel 8)
- Measure: hours to first successful anchor placement

**Mitigation:**
1. **Use AR Foundation samples** — Google provides starter project; clone + modify (don't build from scratch)
2. **Buffer time** — Allocate 2 weeks for AR integration (Weeks 8-10), not 1 week
3. **Fallback to WebDemo** — If Unity fails, use WebDemo for CCMF submission (still shows concept)
4. **Hire contractor** — If stuck >3 days, hire Upwork Unity+ARCore expert ($50-100/hr) for 4-hour consult

**Success Criteria:**
- First anchor placed in Unity by Week 9
- Working AR demo by Week 11 (1-week buffer before Month 4 target)

---

## Risk 7: Founder Burnout (Part-Time → Full-Time Unsustainable)

**Category:** Operational  
**Likelihood:** Medium (30%)  
**Impact:** High (project stalls; no demo = no funding)

**Description:**
If founder is employed part-time elsewhere, balancing 20-30 hrs/week on Sightline for 6 months is exhausting. Risk of scope creep, missed deadlines, or health issues derailing MVP.

**Early Test (Month 1-2):**
- Track weekly hours via Toggl or similar
- Measure: burnout risk score (weekly energy level 1-10)

**Mitigation:**
1. **Strict scope control** — Follow 16-task plan; no feature creep (e.g., voice input waits for Month 7+)
2. **Weekly rest day** — No Sightline work 1 day/week (e.g., Sundays)
3. **Reduce day job** — Negotiate 80% employment (if possible) during CCMF period
4. **Hire part-time dev** — Use HKD 10K contingency budget to hire junior dev for 20 hrs (Month 5) to polish UI
5. **Automate repetitive tasks** — GitHub Actions for linting, testing (save 2-3 hrs/week)

**Success Criteria:**
- Weekly hours: 20-30 hrs (not >40)
- Energy level: avg 7/10 across 6 months (if <5 for 2 weeks → trigger help)

---

## Risk 8: Cyberport Rejects CCMF Application (No Funding)

**Category:** Market / Operational  
**Likelihood:** Medium (40%)  
**Impact:** Critical (no funding = pivot to bootstrapping or side project)

**Description:**
CCMF approval rate is ~30-40%. Common rejection reasons:
- Weak social value articulation (too commercial)
- Unrealistic budget (e.g., 2 full-time devs on HKD 100K)
- No evidence of execution (all promises, no demo)
- Competitor blindness ("We're the first AR app!")

**Early Test (Month 5):**
- Submit draft application to Cyberport mentor (free service)
- Get feedback on weak points before final submission

**Mitigation:**
1. **Strengthen application** — Use `Docs/05-application-outline.md` (paste-ready; addresses all criteria)
2. **Build demo BEFORE applying** — 90-sec video proves execution capability (not just promises)
3. **Pilot agreements** — Show 2-3 signed LOI with heritage sites (de-risks market validation)
4. **User testing data** — Include 10-15 user interviews + usability scores in appendix
5. **Reapply if rejected** — CCMF allows reapplication; alumni case study shows success on 2nd attempt
6. **Bootstrap fallback** — If rejected, launch WebAR freemium model; self-fund Month 7-12 from revenue

**Success Criteria:**
- Application submitted by end of Month 6
- Mentor feedback: "Strong application; high approval likelihood"
- Backup plan: freemium revenue target HKD 5K/month (covers cloud costs)

---

## Risk Summary Table

| Risk | Likelihood | Impact | Phase | Mitigation Priority |
|------|-----------|--------|-------|---------------------|
| ARCore accuracy degrades | Medium | High | Tech | **High** — Test Week 3-4 |
| API latency >2s | Low | Medium | Tech | Medium — Cache POIs |
| Google ships Lens AR | Low | Critical | Market | Low — Monitor only |
| Low user adoption | Medium | High | Market | **High** — WebAR trial |
| Pilot sites decline | Low | Medium | Ops | Medium — Polish demo first |
| Unity integration delays | Medium | Medium | Tech | Medium — Buffer time |
| Founder burnout | Medium | High | Ops | **High** — Scope control |
| CCMF rejection | Medium | Critical | Funding | **High** — Strong application |

**Top 3 Priority Mitigations:**
1. Test ARCore accuracy early (Week 3-4) → Avoids late discovery of geospatial issues
2. Scope control + burnout prevention → Ensures project completes on time
3. Strong CCMF application + demo → Maximizes funding approval odds

---

## Monthly Review Cadence

**Week 4, 8, 12, 16, 20, 24:**
- Review risk register
- Update likelihood/impact based on new data
- Add new risks as discovered
- Mark mitigations as completed or failed

**Final Risk Report (Month 6):**
- Include in CCMF final report: "Risks identified, mitigations applied, outcomes achieved"
- Demonstrates mature project management for CIP application

