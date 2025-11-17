# CCMF Submission - Detailed Document Requirements Guide
## Complete Breakdown of Every Required Document

**Application Deadline:** January 2, 2026  
**Submission Platform:** EMS (Cyberport Entrepreneurship Management System)  
**URL:** https://ems.cyberport.hk

---

## Table of Contents

1. [Online EMS Application Form](#1-online-ems-application-form)
2. [HKID Copy](#2-hkid-copy)
3. [Resume/CV](#3-resumecv)
4. [Budget Spreadsheet](#4-budget-spreadsheet)
5. [Milestones Timeline](#5-milestones-timeline)
6. [Optional Documents](#6-optional-documents)
7. [File Preparation Checklist](#7-file-preparation-checklist)
8. [Submission Process](#8-submission-process)

---

## 1. Online EMS Application Form

### Overview
**Type:** Online form (filled directly in EMS system)  
**Format:** Text fields, dropdowns, file uploads  
**Character Limits:** Varies by section (see below)  
**Status:** REQUIRED (Core application)

### Detailed Section Breakdown

#### Section A: Abstract / Project Summary
- **Character Limit:** 150-200 words (strict)
- **Content Source:** `Docs/CCMF_Answers_EN.md` → Section A
- **What to Include:**
  - Problem statement (1-2 sentences)
  - Solution description (2-3 sentences)
  - Innovation highlights (1-2 sentences)
  - Market opportunity (1 sentence)
  - Social impact (1 sentence)
  - 6-month goal (1 sentence)
- **Word Count Check:** Must be exactly 150-200 words
- **Tips:**
  - Start with the most compelling sentence
  - Use active voice
  - Include key metrics if space allows
  - Avoid jargon; make it accessible

#### Section B: Project Management Team (30% Weight - CRITICAL!)
- **Character Limit:** ~2000-3000 words (check EMS for exact limit)
- **Content Source:** `Docs/CCMF_Answers_EN.md` → Section B + `Docs/TEAM.md`
- **What to Include:**

  **B.1 Principal Applicant:**
  - Full name, role, contact info
  - HKID holder confirmation (18+)
  
  **B.2 Qualifications & Experience:**
  - Technical skills (bullet points):
    - AR Development: Unity, AR Foundation, ARCore, ARKit
    - Backend: Node.js, TypeScript, Fastify
    - AI/ML: Gemini Vision API, prompt engineering
    - Version Control: Git, GitHub
  - Relevant projects (2-3 with links):
    - Project name, description, tech stack
    - Your role, outcome (users/downloads/revenue)
    - GitHub links, app store links, demo videos
  - Domain knowledge:
    - HK heritage sector familiarity
    - Museum visitor engagement understanding
    - Prior volunteer work (if applicable)
  
  **B.3 Team Structure:**
  - Founder & Technical Lead (full-time, 40 hrs/week)
  - Unity XR Contractor (part-time, 3 months, HK$35,000)
  - UX/UI & Video Production (project-based, HK$10,000)
  
  **B.4 Execution Proof:**
  - Track record: Shipped X projects, Y users/downloads
  - GitHub profile: Active contributor, Z public repositories
  - Risk mitigation: Contingency plans, backup strategies
  
  **B.5 Role Allocation Table:**
  - Milestone → Owner → Support columns
  - Shows clear responsibility distribution

- **Evidence Required:**
  - GitHub profile screenshot (showing commit history)
  - Links to past projects
  - Reference letters (optional but helpful)

#### Section C: Business Model and Time to Market (30% Weight)
- **Character Limit:** ~2000-3000 words
- **Content Source:** `Docs/CCMF_Answers_EN.md` → Section C
- **What to Include:**

  **C.1 Vision:**
  - Long-term goal (1-2 paragraphs)
  - Market positioning statement
  
  **C.2 Short-Term Objectives (6 Months):**
  - Month-by-month milestones with specific deliverables
  - KPIs for each milestone
  
  **C.3 Long-Term Objectives (12-24 Months):**
  - Post-CCMF roadmap
  - CIP application plan
  
  **C.4 Market Need:**
  - Problem validation with data:
    - HK receives 26M+ visitors annually
    - Museum educators report <30% student engagement
    - 78% of tourists use smartphones for research
  - User pain points (tourists, students, educators)
  
  **C.5 Target Market:**
  - Primary (B2B): HK museums (60+), heritage venues, schools (500+)
  - Secondary: Tour operators, cultural NGOs
  - End users (B2B2C): Students (350K+), tourists (26M), local residents
  
  **C.6 Marketing & Go-to-Market Strategy:**
  - Phase 1 (Month 1-3): Proof of concept
  - Phase 2 (Month 4-6): Pilot validation
  - Phase 3 (Month 7-12): Venue SDK launch
  
  **C.7 Time to Market:**
  - Product launch within 3 months of grant (Month 4 beta)
  - Month-by-month timeline
  
  **C.8 Revenue Model (Post-CCMF):**
  - Venue SDK Subscriptions:
    - Tier 1: HK$5,000/year (5 POIs, 500 monthly users)
    - Tier 2: HK$10,000/year (15 POIs, 2,000 monthly users)
    - Tier 3: HK$15,000/year (30 POIs, 5,000 monthly users)
  - Projected revenue: Month 12 (HK$100K ARR), Month 24 (HK$500K ARR)
  
  **C.9 Project Viability:**
  - Unit economics breakdown
  - Competitive moat
  - Path to profitability

#### Section D: Creativity and Innovation (30% Weight)
- **Character Limit:** ~2000-3000 words
- **Content Source:** `Docs/CCMF_Answers_EN.md` → Section D
- **What to Include:**

  **D.1 Innovative Technologies:**
  - Hybrid AR Anchoring (Core Innovation):
    - Outdoor (GPS-based): ARCore Geospatial API
      - Latency: p50 <0.6s
      - Accuracy: ±5-15m
    - Indoor (Vision-based): Quest 3 Passthrough Camera API + Gemini Vision AI
      - Latency: p50 <1.5s
      - Accuracy: ±0.5m
    - Fallback: Vuforia Area Target
  - Confidence state machine: Green/Amber/Grey
  - Cross-device consistency
  
  **D.2 Cutting-Edge Platform APIs:**
  - Meta Quest 3 Passthrough Camera API (experimental, OS v74+)
  - Unity Sentis (on-device ML)
  - ARCore Geospatial API (VPS, Streetscape Geometry)
  
  **D.3 Performance Breakthrough:**
  - <2s Time-to-First-Value (vs. 5-8s industry average)
  - Measurable KPIs:
    - GPS path: p50 latency 0.4-0.6s
    - Vision path: p50 latency 1.2-1.5s
    - Anchor stability: ≥10s continuous lock
  
  **D.4 Creative Solutions:**
  - Leader Line Visualization
  - Far-Field Bearing Billboard
  - Confidence Gating UI
  
  **D.5 Disruptive Capability:**
  - Disrupts traditional museum audio guides
  - Disrupts existing AR heritage apps
  - Market impact metrics
  
  **D.6 Emerging/Breakthrough Problem-Solving:**
  - AR glasses adoption strategy
  - Technical foresight
  - Industry timing

#### Section E: Social Responsibility (10% Weight)
- **Character Limit:** ~1500-2000 words
- **Content Source:** `Docs/CCMF_Answers_EN.md` → Section E
- **What to Include:**

  **E.1 Educational Equity & Access:**
  - Free tier for all HK schools (500+ institutions, 350K+ students)
  - Mobile-first = no hardware barrier
  - Teacher support (co-designed, lesson plans)
  
  **E.2 Cultural Heritage Preservation:**
  - Problem: HK heritage knowledge at risk
  - Solution: Immersive AR storytelling
  - Measurable impact: 20-30% increase in student dwell time
  
  **E.3 Open Source Contribution:**
  - Quest 3 POI Detection Script (MIT License)
  - ARCore Geospatial HK Examples (GitHub)
  - Field Testing Data (anonymized)
  
  **E.4 Ethical Decision-Making:**
  - Privacy-first design (no facial recognition, blur faces/plates)
  - Content safety (moderation, curator review)
  - Ethical monetization (no dark patterns)
  
  **E.5 Solving Social Problems:**
  - Low museum engagement
  - Passive tourism
  - Digital divide
  
  **E.6 Community Building:**
  - Teacher trial program
  - Creator tools (future)
  
  **E.7 Measurable Social Outcomes:**
  - Students using free edu tier: ≥500
  - Student satisfaction: ≥80%
  - Dwell time increase: +20-30%
  - Share rate: ≥30%
  - Open-source GitHub stars: ≥50

#### Section F: Competition Analysis
- **Character Limit:** ~1000-1500 words
- **Content Source:** `Docs/CCMF_Answers_EN.md` → Section F
- **What to Include:**
  - Competitive landscape table:
    - Competitor | Focus | Anchoring Method | <2s TTFV? | Glasses-Ready? | Pricing | USP vs. Sightline
  - Key differentiators (5 points)
  - Market positioning statement

#### Section G: Six-Month Milestones
- **Character Limit:** ~1500-2000 words
- **Content Source:** `Docs/CCMF_Answers_EN.md` → Section G + `Docs/Milestones_6M.md`
- **What to Include:**
  - Month-by-month breakdown:
    - Month 1: MVP Backend + 10 POIs
    - Month 2: Unity AR + Vision AI fallback
    - Month 3: Teacher trial (15+ students)
    - Month 4: Public beta launch (50 users)
    - Month 5: Demo video + venue outreach
    - Month 6: Pilot LOI signed + CIP application ready
  - Each month should include:
    - Theme
    - Key deliverables
    - Success metrics (KPIs)
    - Innovation highlights

#### Section H: Cost Projections
- **Character Limit:** ~1000 words + table
- **Content Source:** `Docs/CCMF_Answers_EN.md` → Section H + `Docs/Budget_HKD.csv`
- **What to Include:**
  - Total grant: HK$100,000
  - Summary breakdown table:
    - Unity XR Contractor: HK$35,000 (35%)
    - Backend/API Development: HK$15,000 (15%)
    - Cloud & AI APIs: HK$10,000 (10%)
    - Devices & Field Testing: HK$20,000 (20%)
    - Design/Video Production: HK$10,000 (10%)
    - Contingency: HK$10,000 (10%)
  - Key allocations with justifications
  - Reference to detailed budget spreadsheet (uploaded separately)

#### Section I: Funding Status
- **Character Limit:** ~500-800 words
- **Content Source:** `Docs/CCMF_Answers_EN.md` → Section I
- **What to Include:**
  - Current status: No other grants received or applied for
  - Compliance statements:
    - NOT received HKDC/HKSTP funding (Section 1.3)
    - NOT participated in CCMF/CIP previously (Section 1.4)
    - NOT applied to other publicly-funded programmes (Section 3.1)
  - Founder self-funding: HK$8,000 (prototyping)
  - Planned future funding: CIP application (Jul 2026, no overlap)
  - Compliance commitment statements

#### Section J: Risks & Mitigations
- **Character Limit:** ~1500-2000 words
- **Content Source:** `Docs/CCMF_Answers_EN.md` → Section J
- **What to Include:**
  - Technical risks (3-4 risks):
    - GPS drift outdoors
    - Vision AI latency spikes
    - Quest 3 API changes
  - Market risks (2-3 risks):
    - Museum pilot rejection
    - Low student engagement
  - Team risks (2 risks):
    - Unity contractor availability
    - Founder burnout
  - Operational risks (1-2 risks):
    - Cloud cost overrun
  - For each risk: Probability, Impact, Mitigation strategy, Early test plan

#### Section K: Exit Strategy / Sustainability Plan
- **Character Limit:** ~1000-1500 words
- **Content Source:** `Docs/CCMF_Answers_EN.md` → Section K
- **What to Include:**
  - Scenario 1: Successful Pilot → CIP Application (Primary Path)
  - Scenario 2: Pivot to Open-Source (If Pilot Fails)
  - Scenario 3: Acquisition by Education Platform (Best Case)
  - Long-Term Vision (Independence Path)

#### Section L: Intellectual Property
- **Character Limit:** ~300-500 words
- **Content Source:** `Docs/CCMF_Answers_EN.md` → Section L
- **What to Include:**
  - Ownership: All code/IP belongs to Principal Applicant
  - No IP conflicts
  - Open-source components properly attributed
  - Trademarks: "Sightline" name search conducted
  - Patents: No applications planned (defensive publication strategy)

#### Section M: Regulatory Compliance
- **Character Limit:** ~400-600 words
- **Content Source:** `Docs/CCMF_Answers_EN.md` → Section M
- **What to Include:**
  - Privacy (PDPO): Minimal data collection, privacy policy, user consent
  - Safety: AR safety warnings, stationary use design
  - Accessibility: WCAG 2.1 AA compliance target
  - Content: Museum content reviewed, user notes moderated

### How to Fill EMS Form

1. **Login to EMS:**
   - URL: https://ems.cyberport.hk
   - Use your registered email and password

2. **Start New Application:**
   - Find: "CCMF Hong Kong Programme - March 2026 Intake"
   - Click: "Apply" or "New Application"

3. **Fill Sections Sequentially:**
   - EMS may auto-save drafts (but save manually frequently!)
   - Copy-paste content from `CCMF_Answers_EN.md`
   - Check character limits for each field
   - Use bullet points where appropriate

4. **Upload Supporting Documents:**
   - Use "Upload" buttons in relevant sections
   - Ensure files are <10MB each
   - PDF format preferred

5. **Review Before Submission:**
   - Print preview or review all sections
   - Check for typos, placeholder text
   - Verify all file uploads completed

6. **Submit:**
   - Click "Submit" button (final, cannot edit after)
   - Submit 2-3 days before deadline (Jan 1, 2026 recommended)
   - Confirm submission email received from Cyberport

---

## 2. HKID Copy

### Overview
**Type:** Scanned document or photo  
**Format:** PDF  
**File Size:** <10MB  
**Status:** REQUIRED

### Detailed Requirements

#### What to Include:
- **HKID Card Image:**
  - Front side of HKID card
  - Must be clear and readable
  - High resolution (at least 300 DPI)

#### What to Redact (Privacy):
- **DO NOT show:**
  - Full HKID number (only show last 4 digits if needed for verification)
  - Date of birth (full date)
  - Full name (if sensitive)
  
- **DO show:**
  - HKID holder status (confirms you are a holder)
  - Name (first name and last name initial, or full name if comfortable)
  - Photo (to verify identity)

#### Redaction Methods:
1. **Digital Redaction:**
   - Use PDF editor (Adobe Acrobat, Preview on Mac)
   - Use black boxes to cover sensitive numbers
   - Ensure redaction is permanent (not just white text)

2. **Physical Redaction:**
   - Cover sensitive parts with paper/tape before scanning
   - Scan the partially covered card

3. **Photo Editing:**
   - Use image editor (Photoshop, GIMP, online tools)
   - Blur or black out sensitive information
   - Export as PDF

#### File Preparation:
1. **Scan or Photograph:**
   - Use scanner (recommended) or high-quality phone camera
   - Ensure good lighting, no shadows
   - Place card on white background

2. **Edit/Redact:**
   - Open in PDF editor or image editor
   - Redact sensitive information
   - Ensure redaction is permanent

3. **Export as PDF:**
   - Save as: `HKID_Redacted.pdf`
   - File size should be <10MB
   - If too large, compress PDF

4. **Quality Check:**
   - Verify card is readable
   - Verify sensitive info is properly redacted
   - Verify file opens correctly

#### Example Redaction:
```
Before: A123456(7)
After:  A******(*)
```

#### File Naming Convention:
- `HKID_Redacted.pdf`
- Or: `HKID_[YourLastName]_Redacted.pdf`

#### Upload Location in EMS:
- Usually in "Supporting Documents" section
- Or "Identity Verification" section
- Check EMS interface for exact location

---

## 3. Resume/CV

### Overview
**Type:** Professional resume/curriculum vitae  
**Format:** PDF  
**File Size:** <10MB  
**Page Limit:** 2 pages maximum (strict)  
**Status:** REQUIRED

### Detailed Requirements

#### What to Include:

**1. Header Section:**
- Full name
- Contact information:
  - Email address
  - Phone number (with country code: +852)
  - Location (Hong Kong)
  - LinkedIn profile (optional but recommended)
  - GitHub profile (required - shows technical proof)
  - Personal website/portfolio (optional)

**2. Professional Summary (2-3 sentences):**
- Years of experience
- Key expertise areas
- Current role/focus
- Example: "5+ years software developer specializing in AR/VR applications using Unity and ARCore. Currently building Sightline, an AR heritage education platform."

**3. Technical Skills:**
- **AR Development:**
  - Unity, AR Foundation
  - ARCore, ARKit
  - Quest 3, Passthrough Camera API
- **Programming Languages:**
  - TypeScript, JavaScript
  - C# (Unity)
  - Python (if applicable)
- **Backend:**
  - Node.js, Express, Fastify
  - RESTful APIs
  - Database (PostgreSQL, MongoDB)
- **AI/ML:**
  - Gemini Vision API
  - Prompt engineering
  - Unity Sentis
- **Version Control:**
  - Git, GitHub
- **Other:**
  - Cloud platforms (AWS, GCP, Firebase)
  - Mobile development (Android, iOS)

**4. Professional Experience:**
- List in reverse chronological order (most recent first)
- For each role, include:
  - Job title
  - Company name
  - Location
  - Duration (Month Year - Month Year)
  - Key achievements (3-5 bullet points):
    - Use action verbs (Developed, Built, Led, Implemented)
    - Include metrics (users, downloads, revenue, performance improvements)
    - Highlight AR/VR/XR projects
    - Show impact and results

**5. Relevant Projects (if not in work experience):**
- Project name
- Your role
- Technologies used
- Outcome (users, downloads, impact)
- Links (GitHub, demo, app store)

**6. Education:**
- Degree name
- University name
- Location
- Graduation year
- Relevant coursework (if space allows)
- Academic achievements (if significant)

**7. Certifications (optional):**
- Unity Certified Developer
- Google ARCore certification
- Other relevant certifications

**8. Additional Sections (if space allows):**
- Awards/Honors
- Publications
- Speaking engagements
- Volunteer work (especially if related to heritage/education)

#### Formatting Guidelines:

**Layout:**
- Clean, professional design
- Consistent formatting
- Easy to scan/read
- Use bullet points for achievements
- Use bold for section headers

**Font:**
- Professional font (Arial, Calibri, Times New Roman)
- Size: 10-12pt for body text
- Headers: 14-16pt
- Ensure readability when printed

**Spacing:**
- Adequate white space
- 1-inch margins
- Line spacing: 1.15 or 1.5

**Length:**
- **STRICT 2-page limit**
- If over 2 pages, prioritize:
  1. Most recent/relevant experience
  2. Technical skills
  3. Projects with measurable outcomes
  4. Remove older/irrelevant experience

#### Content Source:
- Use `Docs/TEAM.md` as starting point
- Extract relevant information
- Format as professional CV
- Add any missing experience

#### File Preparation:

1. **Create/Update Resume:**
   - Use Word, Google Docs, or LaTeX
   - Start from `Docs/TEAM.md` content
   - Format professionally

2. **Review for Relevance:**
   - Emphasize AR/VR/XR experience
   - Highlight backend/API development
   - Show execution proof (shipped projects)
   - Include GitHub links

3. **Check Length:**
   - Must be exactly 2 pages or less
   - Remove less relevant content if needed
   - Adjust font size/margins if necessary

4. **Export as PDF:**
   - Save as: `Resume_CV.pdf`
   - Ensure formatting preserved
   - File size <10MB

5. **Quality Check:**
   - Proofread for typos
   - Verify all links work
   - Check formatting is consistent
   - Print test to ensure readability

#### File Naming Convention:
- `Resume_CV.pdf`
- Or: `CV_[YourName].pdf`

#### Upload Location in EMS:
- "Supporting Documents" section
- Or "Team Information" section

---

## 4. Budget Spreadsheet

### Overview
**Type:** Spreadsheet (Excel or CSV)  
**Format:** .xlsx or .csv (export to PDF for upload)  
**File Size:** <10MB  
**Status:** REQUIRED

### Detailed Requirements

#### What to Include:

**Required Columns:**
1. **Category** - High-level budget category
2. **Item** - Specific line item description
3. **Cost_HKD** - Amount in Hong Kong Dollars
4. **Justification** - Why this expense is necessary

#### Budget Breakdown Structure:

**1. Unity XR Development (HK$35,000 - 35%)**
- Unity contractor - Month 2 (80 hours @ HK$146/hr) = HK$11,667
- Unity contractor - Month 3 (80 hours @ HK$146/hr) = HK$11,667
- Unity contractor - Month 4 (40 hours @ HK$146/hr) = HK$5,833
- Unity contractor - Month 5-6 (40 hours @ HK$146/hr) = HK$5,833
- **Justification:** ARCore Geospatial integration, Quest 3 API integration, AR card UI

**2. Backend/API Development (HK$15,000 - 15%)**
- Backend development - Month 1 (120 hours @ HK$100/hr) = HK$12,000
- Backend development - Month 2-4 (30 hours @ HK$100/hr) = HK$3,000
- **Justification:** Fastify server, POI database, Gemini Vision API integration, telemetry

**3. Cloud & AI APIs (HK$10,000 - 10%)**
- Vuforia Engine license (6 months @ USD$99/mo) = HK$4,600
- Gemini Vision API calls (est. 5000 images @ USD$1/1000) = HK$300
- Gemini Vision API buffer = HK$2,100
- Firebase/Google Cloud hosting (6 months) = HK$2,000
- Cloudflare CDN (6 months @ HK$200/mo) = HK$1,000
- **Justification:** Area Target capability, POI identification, backend hosting, asset delivery

**4. Devices & Field Testing (HK$20,000 - 20%)**
- Quest 3 accessories = HK$3,000
- Android test device = HK$5,000
- Field testing - Month 1-2 = HK$3,000
- Field testing - Month 3 (Teacher trial) = HK$4,000
- Field testing - Month 4-6 = HK$5,000
- **Justification:** Extended testing comfort, backup device, on-site testing, beta support

**5. Design/Video Production (HK$10,000 - 10%)**
- UX/UI design = HK$4,000
- Demo video production = HK$6,000
- **Justification:** AR card design, 90-second field demo video

**6. Contingency (HK$10,000 - 10%)**
- Technical contingency = HK$5,000
- Operational contingency = HK$5,000
- **Justification:** Buffer for unexpected costs, API overages, hardware failure, legal review

**TOTAL: HK$100,000**

#### File Preparation:

1. **Open Source File:**
   - File: `Docs/Budget_HKD.csv`
   - Open in Excel, Google Sheets, or Numbers

2. **Review and Verify:**
   - Check all amounts sum to exactly HK$100,000
   - Verify justifications are clear and specific
   - Ensure hourly rates are reasonable
   - Check currency conversions (USD to HKD) are accurate

3. **Format Professionally:**
   - Add headers with project name
   - Format numbers with currency symbols
   - Add totals row
   - Use consistent formatting

4. **Export Options:**
   - **Option A: Excel (.xlsx)**
     - Save as: `Budget_HKD.xlsx`
     - Preferred format for EMS
   - **Option B: PDF**
     - Export/Print to PDF
     - Save as: `Budget_HKD.pdf`
     - Easier to view but less editable

5. **Quality Check:**
   - Verify total = HK$100,000
   - Check all percentages add up correctly
   - Ensure justifications are complete
   - Verify file opens correctly

#### File Naming Convention:
- `Budget_HKD.xlsx` (preferred)
- Or: `Budget_HKD.pdf`

#### Upload Location in EMS:
- "Cost Projections" section
- Or "Supporting Documents" section

#### Additional Notes:
- Budget must align with Section H (Cost Projections) in application form
- Keep receipts for all expenses (required for grant reporting)
- Budget can be adjusted during project (with Cyberport approval)

---

## 5. Milestones Timeline

### Overview
**Type:** Document (Markdown or Word)  
**Format:** PDF  
**File Size:** <10MB  
**Status:** REQUIRED

### Detailed Requirements

#### What to Include:

**1. Overview Table:**
- Month | Theme | Key Deliverable | Success Metric
- Shows 6-month roadmap at a glance

**2. Month-by-Month Breakdown:**

For each month (1-6), include:

**Month X: [Theme] ([Month Year])**

**Deliverables:**
- List of specific deliverables (numbered)
- Technical components
- Content creation
- Testing/validation

**KPIs (Key Performance Indicators):**
- Measurable success metrics
- Specific targets (e.g., p50 latency ≤2.0s)
- User metrics (e.g., ≥50 beta users)

**Innovation Highlights:**
- What makes this month innovative
- Technical breakthroughs
- Unique features

**3. Detailed Timeline:**

**Month 1: Foundation (Feb 2026)**
- Theme: MVP Backend + Outdoor GPS Path
- Deliverables:
  - Backend API (POST `/identify`, GET `/poi/:id`)
  - 10 Hong Kong POIs seeded
  - Telemetry & logging system
  - Android build with ARCore Geospatial
  - WebDemo for API testing
- KPIs:
  - 10 POIs outdoor
  - p50 ask→overlay latency: ≤2.5s
  - Stability: ≥10s without drift
  - Crash-free rate: ≥99.0%
- Innovation: Far-field anchoring (IFC @ 2km)

**Month 2: Hybrid Anchoring (Mar 2026)**
- Theme: Dual-Path AR (GPS + Vision)
- Deliverables:
  - Confidence state machine (Green/Amber/Grey)
  - Nearest-POI disambiguation
  - Telemetry overlay
  - Logging system
- KPIs:
  - 20 POIs live
  - Logs prove dual-path usage
  - Confidence gating working
- Innovation: Adaptive UX (graceful degradation)

**Month 3: Missions & Save/Share (Apr 2026)**
- Theme: Education Trial
- Deliverables:
  - Mission Engine v1 (JSON-authored steps)
  - Save & share functionality
  - Notes API (`/notes` - XR love-locks)
  - Teacher trial at Star Ferry (≥15 students)
- KPIs:
  - Share rate: ≥30%
  - D1 activation: ≥60%
  - 1 mission playable end-to-end
  - Teacher feedback: 2-3 positive testimonials
- Innovation: Mission Engine, XR Love-Locks

**Month 4: Beta + Indoor Room (May 2026)**
- Theme: Public Beta Launch
- Deliverables:
  - Room-Pack v0 (Vuforia Area Target)
  - Public beta launch (≥50 users)
  - Traditional Chinese localization
  - Analytics dashboard
- KPIs:
  - p50 latency: ≤2.0s
  - Crash-free: ≥99.5%
  - Beta users: ≥50 MAU
  - Indoor mission playable
- Innovation: Room-Pack (scalable B2B model)

**Month 5: Film + SDK Brief (Jun 2026)**
- Theme: Venue Outreach
- Deliverables:
  - 90-second demo video (4 beats)
  - Venue/Museum SDK brief
- KPIs:
  - Video shows all 4 beats
  - 3 clean takes per location
  - SDK brief reviewed by 1 venue
- Innovation: SAM-2 Integration, Far-field → near-field handoff

**Month 6: LOI + CIP Prep (Jul 2026)**
- Theme: Pilot & Reporting
- Deliverables:
  - 1 LOI from museum/heritage venue
  - CIP application package
  - Analytics dashboard
- KPIs:
  - LOI signed
  - Pilot plan includes 3-month timeline
  - CIP package complete
- Innovation: Venue Analytics (B2B value prop)

**4. Reporting Schedule:**
- Interim Report: Month 3 (due end of April 2026)
- Final Report: Month 6 (due end of July 2026)

#### File Preparation:

1. **Open Source File:**
   - File: `Docs/Milestones_6M.md`
   - This is your source document

2. **Review Content:**
   - Ensure all months have clear deliverables
   - Verify KPIs are measurable
   - Check innovation highlights are compelling
   - Ensure timeline is realistic

3. **Format for Export:**
   - Can export directly from Markdown
   - Or copy to Word/Google Docs for formatting
   - Add visual elements (tables, charts) if helpful

4. **Export as PDF:**
   - **Option A: From Markdown**
     - Use Pandoc: `pandoc Milestones_6M.md -o Milestones_6M.pdf`
     - Or use Typora, Marked, or other Markdown-to-PDF tools
   - **Option B: From Word/Google Docs**
     - Format professionally
     - Add page numbers
     - Export as PDF

5. **Quality Check:**
   - Verify all 6 months are included
   - Check KPIs are specific and measurable
   - Ensure timeline aligns with application form (Section G)
   - Verify file opens correctly

#### File Naming Convention:
- `Milestones_6M.pdf`
- Or: `Milestones_Timeline.pdf`

#### Upload Location in EMS:
- "Six-Month Milestones" section
- Or "Supporting Documents" section

#### Additional Notes:
- Milestones must align with Section G in application form
- KPIs should be realistic but ambitious
- Include both technical and business milestones
- Show clear progression month-to-month

---

## 6. Optional Documents

### 6.1 Demo Video

**Status:** OPTIONAL but HIGHLY RECOMMENDED

**Requirements:**
- Duration: 90 seconds (strict)
- File size: <50MB
- Format: MP4 (H.264 codec recommended)
- Resolution: 1080p minimum

**Content (4 beats):**
1. Clock Tower <2s lock (outdoor near-field) - 20 seconds
2. IFC far-field billboard @ 2km with distance chip - 20 seconds
3. Museum room with exact lock + SAM-2 highlight - 20 seconds
4. Discovery + save/share + love-locks - 30 seconds

**File Naming:**
- `Demo_Video.mp4`
- Or upload to YouTube/Vimeo and provide link

**Upload Location:**
- "Supporting Documents" section
- Or provide link in application form

### 6.2 GitHub Profile Screenshot

**Status:** OPTIONAL but RECOMMENDED (shows execution proof)

**Requirements:**
- Screenshot of your GitHub profile page
- Should show:
  - Commit history graph
  - Public repositories
  - Contribution activity
- Format: PNG or PDF
- File size: <10MB

**File Naming:**
- `GitHub_Profile_Screenshot.png`

### 6.3 Reference Letter

**Status:** OPTIONAL

**Requirements:**
- From advisor, mentor, or former colleague
- Should attest to your technical skills and execution ability
- Format: PDF
- Should be on letterhead (if from organization)
- Signed (digital signature OK)

**File Naming:**
- `Reference_Letter_[Name].pdf`

### 6.4 Teacher Trial Confirmation

**Status:** OPTIONAL (if trial scheduled pre-submission)

**Requirements:**
- Email confirmation from school/teacher
- Shows commitment to Month 3 teacher trial
- Format: PDF (screenshot or print of email)
- File size: <10MB

**File Naming:**
- `Teacher_Trial_Confirmation.pdf`

### 6.5 Letters of Intent (LOI)

**Status:** OPTIONAL but HIGHLY RECOMMENDED (strengthens Business Model score)

**Requirements:**
- Signed LOI from museum/heritage venue
- Should include:
  - Venue name and contact
  - Commitment to pilot
  - Timeline (3 months)
  - Success criteria
- Format: PDF
- Template: `Docs/Pilot_LOI_draft.md`

**File Naming:**
- `Pilot_LOI_[Venue_Name]_Signed.pdf`

### 6.6 One-Pager

**Status:** OPTIONAL (supplementary document)

**Requirements:**
- 1-2 pages A4
- Project summary
- Format: PDF
- Source: `Docs/OnePager_Sightline.md`

**File Naming:**
- `OnePager_Sightline.pdf`

### 6.7 Pitch Deck

**Status:** OPTIONAL (supplementary document)

**Requirements:**
- 10 slides
- Visual design (not just text)
- Format: PDF
- Source: `Docs/Deck_Sightline_10slides.md`

**File Naming:**
- `Deck_Sightline_10slides.pdf`

---

## 7. File Preparation Checklist

### Pre-Upload Checklist

**For Each Document:**

- [ ] File name follows convention
- [ ] File size <10MB (or <50MB for video)
- [ ] Format is correct (PDF preferred for documents)
- [ ] Content is complete (no placeholders)
- [ ] Proofread for typos
- [ ] All links work (if applicable)
- [ ] Formatting is professional
- [ ] File opens correctly

### Folder Structure

Create this folder structure before submission:

```
CCMF_Submission_Sightline/
├── 01_Required/
│   ├── HKID_Redacted.pdf
│   ├── Resume_CV.pdf
│   ├── Budget_HKD.xlsx
│   └── Milestones_6M.pdf
├── 02_Optional/
│   ├── Demo_Video.mp4
│   ├── GitHub_Profile_Screenshot.png
│   ├── Reference_Letter.pdf (if available)
│   ├── Teacher_Trial_Confirmation.pdf (if available)
│   ├── Pilot_LOI_Venue_Signed.pdf (if available)
│   ├── OnePager_Sightline.pdf
│   └── Deck_Sightline_10slides.pdf
└── 03_Backup/
    └── [Copy of all files for backup]
```

### File Compression

If files are too large:

**PDF Compression:**
- Use Adobe Acrobat: File → Reduce File Size
- Use online tools: SmallPDF, ILovePDF
- Reduce image quality if needed

**Video Compression:**
- Use HandBrake (free, open-source)
- Target: H.264 codec, 1080p, <50MB
- Reduce bitrate if needed

---

## 8. Submission Process

### Step-by-Step Submission

**Week Before Deadline (Dec 26-30):**

1. **Final Review:**
   - [ ] All documents prepared
   - [ ] All placeholders replaced
   - [ ] Proofread all content
   - [ ] Verify file sizes
   - [ ] Test all file uploads

2. **EMS Login:**
   - [ ] Login to https://ems.cyberport.hk
   - [ ] Verify account is active
   - [ ] Check application deadline

3. **Start Application:**
   - [ ] Find "CCMF Hong Kong Programme - March 2026 Intake"
   - [ ] Click "Apply" or "New Application"
   - [ ] Note application ID (if provided)

**Day Before Deadline (Jan 1, 2026):**

4. **Fill Online Form:**
   - [ ] Section A: Abstract (150-200 words)
   - [ ] Section B: Project Management Team
   - [ ] Section C: Business Model
   - [ ] Section D: Creativity and Innovation
   - [ ] Section E: Social Responsibility
   - [ ] Section F: Competition
   - [ ] Section G: Six-Month Milestones
   - [ ] Section H: Cost Projections
   - [ ] Section I: Funding Status
   - [ ] Section J: Risks & Mitigations
   - [ ] Section K: Exit Strategy
   - [ ] Section L: Intellectual Property
   - [ ] Section M: Regulatory Compliance

5. **Upload Supporting Documents:**
   - [ ] HKID_Redacted.pdf
   - [ ] Resume_CV.pdf
   - [ ] Budget_HKD.xlsx
   - [ ] Milestones_6M.pdf
   - [ ] Demo_Video.mp4 (optional)
   - [ ] GitHub_Profile_Screenshot.png (optional)
   - [ ] Other optional documents

6. **Review Application:**
   - [ ] Print preview or review all sections
   - [ ] Check for typos
   - [ ] Verify all uploads completed
   - [ ] Check character limits

7. **Save Draft:**
   - [ ] Click "Save Draft" frequently
   - [ ] Verify draft saved successfully
   - [ ] Note: EMS may not auto-save

**Submission Day (Jan 1-2, 2026):**

8. **Final Check:**
   - [ ] All sections complete
   - [ ] All required documents uploaded
   - [ ] No placeholder text remaining
   - [ ] All information accurate

9. **Submit:**
   - [ ] Click "Submit" button
   - [ ] Confirm submission (may be final, cannot edit)
   - [ ] Note submission confirmation number/ID

10. **Post-Submission:**
    - [ ] Check email for confirmation from Cyberport
    - [ ] Save confirmation email
    - [ ] Screenshot submission status page
    - [ ] Backup all files to cloud storage

### Important Notes

- **Submit Early:** Submit by Jan 1, 2026 (not Jan 2 evening) to avoid technical issues
- **No Auto-Save:** EMS may not auto-save - save drafts frequently
- **Cannot Edit After Submit:** Review carefully before final submission
- **Confirmation Required:** Wait for email confirmation from Cyberport
- **Backup Everything:** Save copies of all documents and submission

### Contact Information

**If Issues Arise:**
- **EMS Technical Support:** Check EMS help section
- **CCMF Questions:** ccmf@cyberport.hk
- **Application Questions:** Refer to Info Session notes

---

## Appendix: Quick Reference

### Required Documents Summary

| Document | Format | Size Limit | Status | Source File |
|----------|--------|------------|--------|-------------|
| Online EMS Form | Online | N/A | REQUIRED | `CCMF_Answers_EN.md` |
| HKID Copy | PDF | <10MB | REQUIRED | Scan/photograph |
| Resume/CV | PDF | <10MB | REQUIRED | `TEAM.md` |
| Budget Spreadsheet | Excel/PDF | <10MB | REQUIRED | `Budget_HKD.csv` |
| Milestones Timeline | PDF | <10MB | REQUIRED | `Milestones_6M.md` |

### Optional Documents Summary

| Document | Format | Size Limit | Status | Source File |
|----------|--------|------------|--------|-------------|
| Demo Video | MP4 | <50MB | OPTIONAL | Record |
| GitHub Screenshot | PNG/PDF | <10MB | OPTIONAL | Screenshot |
| Reference Letter | PDF | <10MB | OPTIONAL | Request |
| Teacher Trial Confirmation | PDF | <10MB | OPTIONAL | Email |
| LOI | PDF | <10MB | OPTIONAL | `Pilot_LOI_draft.md` |
| One-Pager | PDF | <10MB | OPTIONAL | `OnePager_Sightline.md` |
| Pitch Deck | PDF | <10MB | OPTIONAL | `Deck_Sightline_10slides.md` |

### Key Dates

- **Application Deadline:** January 2, 2026
- **Recommended Submission:** January 1, 2026 (buffer)
- **Target Intake:** March 2026
- **Project Period:** February 2026 - July 2026

### Character Limits (EMS Form)

- Section A (Abstract): 150-200 words
- Section B (Team): ~2000-3000 words
- Section C (Business Model): ~2000-3000 words
- Section D (Innovation): ~2000-3000 words
- Section E (Social Responsibility): ~1500-2000 words
- Other sections: Check EMS for exact limits

---

**END OF DETAILED GUIDE**

**Last Updated:** [Current Date]  
**Version:** 1.0  
**Status:** Ready for Use

