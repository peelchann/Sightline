# Agentic Research Plan

**Last updated:** October 2025

## Overview

This document provides a step-by-step plan for a **browsing agent** (GPT-4 with web search, Claude with tools, or human researcher) to collect comprehensive data on AR platforms, Cyberport funding, and competitor intelligence. All findings should include **dates** and **links** to primary sources.

---

## Task 1: AR Platform Capabilities & Pricing

### Objective
Compile official documentation, pricing, and technical specifications for 8 AR platforms relevant to Sightline.

### Steps

1. **ARCore Geospatial API (Google)**
   - Visit: [developers.google.com/ar/develop/geospatial](https://developers.google.com/ar/develop/geospatial)
   - Extract:
     - Supported cities (confirm Hong Kong coverage)
     - Accuracy specs (horizontal, vertical)
     - Pricing model (free? API quotas?)
     - Device requirements (Android versions, ARCore-compatible devices)
     - Date of last major update
   - Save to: `Docs/research/arcore-geospatial.md`

2. **ARKit GeoAnchors (Apple)**
   - Visit: [developer.apple.com/documentation/arkit/argeoanchor](https://developer.apple.com/documentation/arkit/argeoanchor)
   - Extract:
     - Accuracy specs vs ARCore
     - iOS version requirements (iOS 14+ confirmed?)
     - LiDAR advantages (depth occlusion)
     - Date of feature introduction
   - Save to: `Docs/research/arkit-geoanchors.md`

3. **Niantic Lightship VPS**
   - Visit: [lightship.dev](https://lightship.dev) and [lightship.dev/pricing](https://lightship.dev/pricing)
   - Extract:
     - Free tier: MAU limits (1,000? 5,000?)
     - Paid tiers: pricing per MAU ($99/mo for 10K? Confirm)
     - VPS coverage (which cities? HK included?)
     - Onboarding time (how long to scan and activate a new location?)
     - Date of pricing page update
   - Save to: `Docs/research/niantic-lightship.md`

4. **8th Wall (WebAR)**
   - Visit: [8thwall.com](https://8thwall.com) and [8thwall.com/pricing](https://8thwall.com/pricing)
   - Extract:
     - Pricing tiers ($99/mo Standard? $499/mo Pro?)
     - Features by tier (world tracking, image targets, geolocation)
     - Geospatial anchoring support (does it exist?)
     - Browser compatibility (Chrome, Safari)
     - Date of pricing update
   - Save to: `Docs/research/8thwall.md`

5. **Vuforia Area/Model Targets**
   - Visit: [developer.vuforia.com](https://developer.vuforia.com) and pricing page
   - Extract:
     - Pricing model (per-app? per-month?)
     - Area Target limitations (indoor-only? outdoor support?)
     - Scanning requirements (how long to create Area Target?)
     - Unity integration complexity
     - Date of last SDK update
   - Save to: `Docs/research/vuforia.md`

6. **Meta Quest (Passthrough MR)**
   - Visit: [developer.oculus.com](https://developer.oculus.com) and Meta XR docs
   - Extract:
     - Scene anchors (local vs persistent)
     - Depth API + hand tracking
     - Outdoor support (GPS? or indoor-only?)
     - SDK pricing (free for devs?)
     - Quest 3 vs Quest Pro capabilities
     - Date of Meta XR SDK updates
   - Save to: `Docs/research/meta-quest.md`

7. **Ray-Ban Meta Smart Glasses**
   - Visit: [ray-ban.com/meta-smart-glasses](https://www.ray-ban.com/usa/ray-ban-meta-smart-glasses) and Meta newsroom
   - Extract:
     - Current features (camera, audio, Meta AI)
     - Display status (none? micro-LED rumored?)
     - Gen 2 rumors (search The Verge, Bloomberg for leaks)
     - Pricing ($299? $329?)
     - Release date (Gen 1: Sept 2023)
   - Save to: `Docs/research/ray-ban-meta.md`

8. **Snap Spectacles (AR Glasses)**
   - Visit: [spectacles.com](https://www.spectacles.com) and Snap developer portal
   - Extract:
     - Dev kit availability ($99/mo? $1,290 upfront?)
     - Display specs (FoV, resolution)
     - AR capabilities (SLAM, world locking, geospatial?)
     - Consumer timeline (TBD? 2026+?)
     - Date of announcement (Sept 2024 confirmed?)
   - Save to: `Docs/research/snap-spectacles.md`

### Output Format (Per Platform)
```md
# [Platform Name]

**Last Updated:** [Date from official site]
**Official Docs:** [URL]

## Capabilities
- Anchoring: [Geospatial / VPS / SLAM / None]
- Occlusion: [Yes / No / Depth API]
- Devices: [iOS / Android / Headset / Glasses]
- Accuracy: [±Xm horizontal, ±Ym vertical]

## Pricing
- Free Tier: [Limits]
- Paid Tiers: [USD/month + details]
- Enterprise: [Custom / Contact sales]

## Onboarding
- TTFV: [Time to first value, e.g., "<5s" or "10-20s scan required"]
- Setup complexity: [Low / Medium / High]

## Sightline Fit
- [Why this platform is or isn't suitable for our use case]

## Sources
- [Link 1] — [Description + Date]
- [Link 2] — [Description + Date]
```

---

## Task 2: Cyberport Funding Programmes (CCMF & CIP)

### Objective
Collect official programme details, deadlines, eligibility, scoring criteria, and successful alumni case studies.

### Steps

1. **CCMF (Creative Micro Fund)**
   - Visit: [cyberport.hk/ccmf](https://www.cyberport.hk/en/about_cyberport/cyberport_youth_programme/creative_micro_fund)
   - Extract:
     - Funding amount (HKD 100K max? Confirm)
     - Duration (6-12 months?)
     - Equity taken (none? Confirm)
     - Eligibility (HK resident, age limits, company status)
     - Application deadlines (rolling? Monthly intake?)
     - Scoring criteria (innovation, feasibility, social value, etc.)
     - Required documents (proposal, CV, budget, etc.)
     - Contact: ccmf@cyberport.hk
   - Save to: `Docs/research/cyberport-ccmf.md`

2. **CIP (Cyberport Incubation Programme)**
   - Visit: [cyberport.hk/cip](https://www.cyberport.hk/en/about_cyberport/cyberport_incubation_programme)
   - Extract:
     - Funding: Seed (HKD 500K?) + Follow-on (HKD 1M?)
     - Duration: 24-36 months?
     - Eligibility: Incorporated company? Full-time commitment?
     - Deadlines: Quarterly (Jan/Apr/Jul/Oct?)
     - Approval rate (estimated from public data)
     - Difference vs CCMF (scale, maturity, commitment)
   - Save to: `Docs/research/cyberport-cip.md`

3. **CCMF Alumni Case Studies (XR/AI Focus)**
   - Search: "Cyberport CCMF alumni" + "XR" or "AR" or "AI"
   - Find 3-5 case studies:
     - Project name, year funded, outcome
     - What made them successful? (Pilot partnerships? User testing? KPIs?)
     - Quotes from founders (if available)
   - Sources:
     - Cyberport blog: [cyberport.hk/en/about_cyberport/media_centre](https://www.cyberport.hk/en/about_cyberport/media_centre)
     - LinkedIn: Search "Cyberport CCMF" + filter by Hong Kong
     - HKTDC: [hktdc.com/en/success-stories](https://hktdc.com/en/success-stories)
   - Save to: `Docs/research/cyberport-alumni.md`

4. **Application Tips (From Alumni)**
   - Search Reddit, LinkedIn, Medium for "Cyberport CCMF tips" or "How to get Cyberport funding"
   - Compile 10-15 tips:
     - "Show pilot agreements before applying"
     - "Budget founder salary at 50% max"
     - "Emphasize social value, not just revenue"
   - Save to: `Docs/research/cyberport-tips.md`

### Output Format (CCMF/CIP)
```md
# [Programme Name]

**Official Page:** [URL]
**Last Updated:** [Date]

## Funding
- Amount: HKD [X]
- Equity: [None / X%]
- Duration: [Months]

## Eligibility
- [Criteria 1]
- [Criteria 2]
- [...]

## Deadlines
- [Rolling / Quarterly / Annual]
- Next intake: [Date]

## Scoring Criteria (Estimated Weights)
- [Criterion 1]: X%
- [Criterion 2]: Y%
- [...]

## Required Documents
- [ ] [Doc 1]
- [ ] [Doc 2]
- [...]

## Key Success Factors (From Alumni)
- [Factor 1]
- [Factor 2]
- [...]

## Sources
- [Link 1] — [Date]
- [Link 2] — [Date]
```

---

## Task 3: Competitor Intelligence (Google Lens, Lightship, etc.)

### Objective
Track competitors' product updates, pricing changes, and strategic moves (e.g., Google Lens adding AR anchoring).

### Steps

1. **Set Up Alerts**
   - Google Alerts:
     - "Google Lens AR anchoring"
     - "ARCore Geospatial update"
     - "Niantic Lightship pricing"
     - "Meta Ray-Ban smart glasses display"
   - RSS Feeds:
     - The Verge: [theverge.com/ar-vr/rss](https://www.theverge.com/ar-vr/rss)
     - TechCrunch AR: [techcrunch.com/tag/augmented-reality](https://techcrunch.com/tag/augmented-reality)
     - Google AR Blog: [developers.googleblog.com/search/label/AR](https://developers.googleblog.com/search/label/AR)

2. **Monthly Competitor Scan (First Tuesday of Each Month)**
   - Visit:
     - Google Lens release notes: [support.google.com/websearch/answer/11480036](https://support.google.com/websearch/answer/11480036)
     - Niantic Lightship blog: [lightship.dev/blog](https://lightship.dev/blog)
     - Meta Reality Labs newsroom: [about.meta.com/realitylabs](https://about.meta.com/realitylabs)
   - Record: New features, pricing changes, press releases
   - Save to: `Docs/research/competitor-updates-[YYYY-MM].md`

3. **Quarterly Deep Dive (End of Mar/Jun/Sep/Dec)**
   - Re-visit all 8 platforms from Task 1
   - Update pricing, features, device support
   - Flag: "High risk" changes (e.g., Google ships Lens AR → urgent pivot discussion)
   - Save updated files to: `Docs/research/[platform]-[YYYY-QX].md`

---

## Task 4: Hong Kong Heritage Sites & Tourism Data

### Objective
Identify high-traffic heritage sites for pilot deployments and validate market size.

### Steps

1. **Top 20 HK Heritage Sites (Public Data)**
   - Visit: [heritage.gov.hk](https://www.heritage.gov.hk) (HK Antiquities & Monuments Office)
   - Extract:
     - List of declared monuments (120+ sites)
     - Visitor statistics (if available)
     - Contact: heritage@lcsd.gov.hk (for pilot partnerships)
   - Filter: Outdoor, high foot traffic, iconic (e.g., Clock Tower, Man Mo Temple, etc.)
   - Save to: `Docs/research/hk-heritage-sites.md`

2. **Tourism Statistics (HK Tourism Board)**
   - Visit: [discoverhongkong.com/eng/about-hktb/statistics.html](https://www.discoverhongkong.com/eng/about-hktb/statistics.html)
   - Extract:
     - Total visitors: [2023: 34M? 2019: 56M?]
     - Top source markets (Mainland China, Taiwan, Japan, USA, etc.)
     - Self-guided vs group tour ratio (trend data)
     - Avg length of stay (days)
   - Save to: `Docs/research/hk-tourism-stats.md`

3. **Pilot Site Contact List**
   - Compile:
     - Site name, address, managing authority (LCSD, MTR, private)
     - Contact email/phone (from official websites)
     - Decision-maker role (e.g., "Public Affairs Manager")
   - Prioritize: Sites with existing QR codes or digital guides (signal of tech-friendliness)
   - Save to: `Docs/research/pilot-site-contacts.csv`

---

## Task 5: AR Market Research (APAC Focus)

### Objective
Validate market size, growth projections, and investment trends for AR tourism/education.

### Steps

1. **Market Reports (Free Summaries)**
   - Search: "AR market size 2024" + "tourism" or "education"
   - Sources:
     - Statista (free summary): [statista.com/topics/ar-vr](https://www.statista.com/topics/3286/augmented-reality-ar/)
     - Grand View Research: [grandviewresearch.com](https://www.grandviewresearch.com)
     - IDC (free press releases): [idc.com/getdoc.jsp?containerId=prAP51587224](https://www.idc.com/getdoc.jsp?containerId=prAP51587224)
   - Extract:
     - Global AR market size (USD $XX billion in 2024?)
     - CAGR (compound annual growth rate, 2024-2030)
     - Tourism + education segments (% of total market)
   - Save to: `Docs/research/ar-market-size.md`

2. **Investment Trends (Crunchbase / AngelList)**
   - Search: "AR tourism" or "AR education" funded startups
   - Filter: APAC region, 2022-2024
   - Record: Company name, funding round, amount, investors, date
   - Example: "XR Studio HK raised USD 2M Series A from Vertex Ventures, Dec 2023"
   - Save to: `Docs/research/ar-investment-trends.md`

3. **Government Initiatives (HK Smart City)**
   - Visit: [smartcity.gov.hk](https://www.smartcity.gov.hk/index.php)
   - Extract:
     - Smart City Blueprint 2.0: XR/AI initiatives
     - Funding programmes (beyond Cyberport: HKSTPC, InnoHK, etc.)
     - Dates of policy announcements
   - Save to: `Docs/research/hk-smartcity-xr.md`

---

## Task 6: Technical Benchmarks (Latency, Accuracy)

### Objective
Establish industry benchmarks for AR app performance to set realistic KPIs.

### Steps

1. **ARCore/ARKit Latency Studies**
   - Search: "ARCore Geospatial latency benchmark" or "ARKit GeoAnchor accuracy study"
   - Sources:
     - Google I/O talks (YouTube): [youtube.com/@GoogleDevelopers](https://www.youtube.com/@GoogleDevelopers)
     - Academic papers (Google Scholar): "ARCore geospatial api accuracy"
     - Unity forums: [forum.unity.com](https://forum.unity.com)
   - Extract:
     - Anchor placement time (ms)
     - Tracking stability (seconds without re-lock)
     - GPS accuracy (meters)
   - Save to: `Docs/research/ar-latency-benchmarks.md`

2. **Competitor App Testing (Manual)**
   - Download: Google Lens, Niantic apps (e.g., Pikmin Bloom), ARCore sample apps
   - Measure:
     - Time from camera open → result displayed (stopwatch)
     - Anchor drift over 30 seconds (video recording)
   - Record: Device (Pixel 8), location (Clock Tower), date, conditions (sunny/cloudy)
   - Save to: `Docs/research/competitor-app-tests.md`

---

## Task 7: Synthesis & Gap Analysis

### Objective
Consolidate all research into actionable insights and identify gaps vs Sightline.

### Steps

1. **Create Summary Table**
   - Columns: Competitor, Anchoring, Occlusion, Pricing, Onboarding, USP vs Sightline
   - Rows: Google Lens, Niantic, ARCore, ARKit, Vuforia, 8th Wall, Quest, Ray-Ban, Snap
   - Save to: `Docs/research/competitor-summary.csv`

2. **Identify Gaps**
   - What do competitors lack? (e.g., "No one combines geospatial + content + NL interface")
   - What are we missing? (e.g., "Google Lens has 100M+ users; we have 0")
   - Save to: `Docs/research/gap-analysis.md`

3. **Quick Wins (Top 10)**
   - Based on gaps, list 10 actionable steps:
     - "Add WebAR demo to reduce install friction"
     - "Partner with HK Tourism Board for co-marketing"
     - "Open-source geo-selection toolkit to build community"
   - Prioritize by: Impact (High/Med/Low), Effort (days), Cost (HKD)
   - Save to: `Docs/research/quick-wins.md`

---

## Output Structure

After completing all tasks, the `/Docs/research/` folder should contain:

```
Docs/research/
├─ arcore-geospatial.md
├─ arkit-geoanchors.md
├─ niantic-lightship.md
├─ 8thwall.md
├─ vuforia.md
├─ meta-quest.md
├─ ray-ban-meta.md
├─ snap-spectacles.md
├─ cyberport-ccmf.md
├─ cyberport-cip.md
├─ cyberport-alumni.md
├─ cyberport-tips.md
├─ competitor-updates-2024-10.md
├─ hk-heritage-sites.md
├─ hk-tourism-stats.md
├─ pilot-site-contacts.csv
├─ ar-market-size.md
├─ ar-investment-trends.md
├─ hk-smartcity-xr.md
├─ ar-latency-benchmarks.md
├─ competitor-app-tests.md
├─ competitor-summary.csv
├─ gap-analysis.md
└─ quick-wins.md
```

---

## Automation (Optional)

If using a browsing agent (e.g., GPT-4 with web search):

1. **Prompt Template:**
```
Research Task: [Task Name from above]
Steps: [Copy steps 1-X from Task section]
Output Format: [Copy format template]
Requirements:
- Include publish date for all sources
- Prefer official docs over blogs
- If data unavailable, note "Not found as of [Date]"
- Save output to: Docs/research/[filename].md
```

2. **Batch Execution:**
- Run Tasks 1-6 in parallel (independent)
- Run Task 7 after Tasks 1-6 complete (depends on earlier outputs)

3. **Quality Check:**
- Verify all links resolve (no 404s)
- Check dates are recent (<6 months for pricing, <12 months for specs)
- Cross-reference critical claims (e.g., "ARCore covers HK" → confirm on official map)

---

**End of Agentic Research Plan**



