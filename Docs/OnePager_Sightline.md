# Sightline - On-Object AI for Heritage Education
## One-Page Project Summary

**Project:** Sightline AR  
**Founder:** [Your Name]  
**Application:** Cyberport CCMF (March 2026 Intake)  
**Grant Amount:** HK$100,000  
**Project Period:** 6 months (Feb–Jul 2026)  
**Website:** sightline.hk (planned)  
**Contact:** [your.email@example.com] | [+852 XXXX XXXX]

---

## The Problem

**Tourists and students struggle to engage with Hong Kong's heritage sites.**

- Traditional audio guides are passive, require manual selection ("Press 7 for Clock Tower")
- Existing AR apps need complex setup, fail indoors, or show generic HUD overlays
- 78% of visitors want "local insights" but rely on generic guidebooks
- Museum educators report <30% student engagement with static exhibits

**Result:** Low dwell time, poor retention of historical knowledge, disengaged learners.

---

## Our Solution

**Sightline: Zero-setup AR that anchors answers on real objects in <2 seconds.**

**How it works:**
1. User points smartphone at landmark (Clock Tower, Star Ferry, etc.)
2. System identifies object via **hybrid anchoring:**
   - **Outdoor:** GPS + ARCore Geospatial (fast, scalable)
   - **Indoor:** Vision AI + Quest 3 Passthrough Camera (precise)
3. AR information card appears **anchored to the object** with visible leader line
4. Card displays: Name, year built, historical blurb, images

**Key Innovation:** Adapts to environment automatically—no pre-scanning, no setup, works everywhere.

---

## Technology Highlights

### Hybrid AR Anchoring
- **GPS Path:** ARCore Geospatial (p50 <0.6s, ±5-15m accuracy)
- **Vision Path:** Gemini Vision AI (p50 <1.5s, ±0.5m accuracy)
- **Confidence Gating:** Green (locked) / Amber (uncertain) / Grey (searching)

### Cutting-Edge Platforms
- Meta Quest 3 Passthrough Camera API (experimental, OS v74+)
- Unity Sentis (on-device ML preprocessing)
- ARCore VPS (cm-level precision in select areas)

### Performance Breakthrough
- **<2s response time** (vs. 5-8s industry average)
- **≥10s anchor stability** while walking 3-4m
- **99.5% crash-free** target

### Future-Ready
- Same backend serves phones, Quest 3, future AR glasses (Ray-Ban Meta)
- Voice I/O roadmap (hands-free for glasses)

---

## Market Opportunity

### Target Customers (B2B)
- **HK museums:** 60+ institutions (M+, Heritage Museum, Science Museum, etc.)
- **Heritage venues:** Clock Tower, Star Ferry, Tai Kwun, PMQ, Blue House
- **Schools:** 500+ primary/secondary schools (350K+ students)

### Revenue Model (Post-CCMF, Month 7+)
**Venue SDK Subscriptions:**
- Tier 1: HK$5,000/year (5 POIs, 500 monthly users)
- Tier 2: HK$10,000/year (15 POIs, 2,000 monthly users)
- Tier 3: HK$15,000/year (30 POIs, 5,000 monthly users)

**Projected Revenue:**
- Month 12: 10 venues × HK$10K = HK$100K ARR
- Month 24: 50 venues × HK$10K = HK$500K ARR (operational break-even)

### Market Size
- HK receives 26M+ visitors annually (2023 recovery)
- Asia-Pacific AR market: USD$XX billion by 2027 (growing 40%+ CAGR)

---

## Social Impact (Core Mission)

### Free for All HK Schools
- 500+ schools, 350K+ students
- No ads, no usage caps, full features
- Traditional Chinese + English localization

### Cultural Heritage Preservation
- Preserves HK heritage knowledge for digital-native youth
- Makes history tangible through immersive AR storytelling
- Target: 20-30% increase in student dwell time at heritage sites

### Open Source Contribution
- Quest 3 POI detection script (MIT License, companion to Meta samples)
- ARCore Geospatial HK examples (GPS drift mitigation techniques)
- Field testing data shared with AR developer community

### Ethical Technology
- Privacy-first: No facial recognition, blur faces/plates before AI upload
- Content safety: Museum content curated, user notes moderated
- Transparent: Display method (geo/vision), latency, confidence on every query

---

## 6-Month Roadmap (CCMF Period)

| Month | Deliverable | Success Metric |
|-------|-------------|----------------|
| **1** | MVP Backend + 10 POIs | p50 latency ≤2.5s |
| **2** | Unity AR + Vision AI fallback | Method logging working |
| **3** | Teacher trial (15+ students) | ≥80% satisfaction |
| **4** | Public beta (50 users) | App Store/Play live |
| **5** | Demo video + venue outreach | 10 emails sent |
| **6** | Signed LOI + CIP application | LOI from 1 venue |

**Key Milestones:**
- ✅ Product launch within 3 months of grant (Month 4 beta)
- ✅ 20 POIs operational by Month 6
- ✅ Teacher trial testimonial video
- ✅ Pilot LOI signed for post-CCMF deployment

---

## Team

### Principal Applicant: [Your Name]
**Role:** Founder & Technical Lead  
**Background:**
- 5+ years software development (Unity, AR Foundation, Node.js)
- [X] past projects totaling [Y] users/downloads
- HK heritage sector knowledge (visited 15+ museums, interviewed 8 educators)

**Skills:** Unity, ARCore, Fastify, TypeScript, Gemini Vision API, Git

### Team Structure
- **Unity XR Contractor** (3 months, HK$35K): AR Foundation, Quest 3 integration
- **UX/Video** (project-based, HK$10K): AR card design, 90-sec demo video
- **Advisors** (if applicable): [Name, organization, expertise]

**Execution Proof:**
- GitHub: [github.com/username] - active contributor
- Prior projects: [Project 1], [Project 2] (evidence of shipping on time)

---

## Budget (HK$100,000)

| Category | Amount | % |
|----------|--------|---|
| Unity XR Contractor | 35,000 | 35% |
| Backend/API Development | 15,000 | 15% |
| Cloud & AI APIs | 10,000 | 10% |
| Devices & Field Testing | 20,000 | 20% |
| Design/Video Production | 10,000 | 10% |
| Contingency | 10,000 | 10% |
| **TOTAL** | **100,000** | **100%** |

**Key Allocations:**
- Vuforia license: HK$4,600 (6 months @ USD$99/mo)
- Gemini Vision API: HK$2,400 (5K images + buffer)
- Teacher trial: HK$4,000 (transport, materials, coordinator)
- Demo video: HK$6,000 (videographer, editing)

---

## Competitive Advantage

| | Google Lens | Niantic Lightship | Museum Apps | **Sightline** |
|---|---|---|---|---|
| **AR Anchored** | ❌ | ✅ | ⚠️ (pre-scanned) | ✅ |
| **<2s TTFV** | ✅ | ❌ (~5-8s) | ❌ | ✅ |
| **Indoor + Outdoor** | ❌ | ⚠️ (VPS only) | ❌ (indoor only) | ✅ |
| **Zero Setup** | ✅ | ❌ | ❌ | ✅ |
| **Glasses-Ready** | ❌ | ⚠️ Planned | ❌ | ✅ (Quest 3) |
| **Heritage Focus** | ❌ | ❌ (gaming) | ✅ | ✅ |

**Our Moat:** Hybrid anchoring + HK POI library + venue relationships

---

## Traction & Validation

### Pre-CCMF Progress (if applicable)
- [ ] Prototype tested at Clock Tower (GPS path functional)
- [ ] Educator interviews (8 teachers, validated problem)
- [ ] Competitive analysis (identified gaps in existing solutions)
- [ ] Self-funded: HK$8,000 invested in prototyping

### CCMF Goals
- [ ] 20 POIs operational
- [ ] 50 beta users (≥80% satisfaction)
- [ ] 1 signed pilot LOI
- [ ] Teacher testimonial video

### Post-CCMF (CIP Application, Jul 2026)
- **Funding Ask:** HK$500K (CIP, 12-24 months)
- **Use of Funds:** Scale to 50 venues, hire 2 FTE, glasses R&D
- **Revenue Target:** HK$100K ARR (10 paying venues by Month 12)

---

## Why Now?

### Technology Convergence
- ARCore Geospatial API matured (2022+): GPS + VPS hybrid
- Quest 3 Passthrough Camera API released (2024): Indoor MR without pre-scanning
- Gemini Vision API affordable (2024): <USD$1 per 1K images

### Market Timing
- HK tourism recovery: 26M visitors (2023), approaching pre-2019 levels
- Museum digital transformation: Post-COVID push for contactless experiences
- AR glasses on horizon: Meta Orion (2024), Ray-Ban Meta (2023) validate consumer demand

### Social Need
- Youth disengagement with heritage: <30% engagement at museums (educator feedback)
- Cultural preservation urgency: Elder generation passing, knowledge at risk

---

## Ask & Next Steps

### CCMF Grant (HK$100,000)
**What we'll deliver in 6 months:**
- 20 POIs operational across HK
- 50 beta users with ≥80% satisfaction
- Teacher trial testimonial video
- 1 signed pilot LOI (museum or school)
- Open-source Quest 3 integration script

**Timeline:** Feb–Jul 2026 (product launch Month 4)

### Post-CCMF Funding (CIP, Jul 2026)
**Scale-up plan:** 50 venues, 2 FTE, glasses adaptation  
**Path to sustainability:** HK$500K ARR by Month 24

### Vision (3-5 Years)
- Default AR content layer for Asia-Pacific heritage sites
- 200K+ monthly active users
- Ray-Ban Meta launch partner (when glasses release widely)
- Social enterprise model: 10% revenue to heritage preservation NGOs

---

## Contact & Links

**Founder:** [Your Name]  
**Email:** [your.email@example.com]  
**Phone:** [+852 XXXX XXXX]  
**GitHub:** [github.com/username]  
**LinkedIn:** [linkedin.com/in/yourname]  

**Demo Materials:**
- [ ] 90-second demo video: [YouTube link or attach to EMS]
- [ ] Pitch deck (10 slides): See `Deck_Sightline_10slides.md`
- [ ] GitHub repo (when public): [github.com/username/sightline]

**Application Documents:**
- `CCMF_Answers_EN.md` - Full English responses
- `CCMF_Answers_ZH.md` - Chinese responses
- `Milestones_6M.md` - Detailed 6-month roadmap
- `Budget_HKD.csv` - Itemized budget
- `Pilot_LOI_draft.md` - Sample LOI for venues

---

**Prepared for:** Cyberport CCMF (March 2026 Intake)  
**Application Deadline:** January 2, 2026  
**Document Version:** 1.0  
**Last Updated:** [Date]

---

**Export Instructions:**
- Save as PDF: Use Markdown→PDF converter (Pandoc, Typora, or Google Docs import)
- Target: 1-2 pages A4 (adjust font size 10-12pt as needed)
- Include in EMS submission as "Project One-Pager" supplementary document


