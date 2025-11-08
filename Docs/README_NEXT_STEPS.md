# CCMF Application - Pre-Submission Checklist
## Sightline Project Next Steps

**Application Deadline:** January 2, 2026  
**Target Intake:** March 2026  
**Last Updated:** [Current Date]

---

## Overview

This checklist covers all actions needed before EMS submission. Complete items systematically in the order listed to maximize your chances of CCMF approval.

**Estimated Time:** 40-60 hours total (spread across 8-9 weeks)

---

## Phase 1: Administrative Setup (Week 0-1)

### ✅ EMS Account & Info Session

- [x] **EMS account created** (already done per your confirmation)
- [ ] **Register for Online Programme Information & Sharing Session**
  - URL: https://ems.cyberport.hk
  - Find: "Online Programme Information & Sharing Session" (Microsoft Forms link)
  - Action: Register ASAP (sessions fill up quickly)
  - Timeline: Nov-Dec 2025 (check Cyberport website for exact dates)
  - **Priority:** HIGH (directly informs application strategy)

- [ ] **Download CCMF Guides & Notes (Rev. 7, Feb 26, 2025)**
  - URL: https://www.cyberport.hk/en/about_cyberport/cyberport_community/entrepreneurship/ccmf
  - File: `Docs/CCMF-GUIDES-NOTES-REV7.md` (already downloaded)
  - Action: Read end-to-end, highlight key sections
  - **Priority:** HIGH (compliance requirement)

- [ ] **Prepare questions for Info Session**
  - Reference: `Docs/CCMF-EMS-MAPPING.md` (Section: Questions for Info Session)
  - Top 3 priority questions:
    1. Do reviewers prefer live pilot LOI or public route demo? (Business Model 30%)
    2. What evidence best demonstrates Creativity/Innovation for XR? (Innovation 30%)
    3. Preferred format/length for demo video? (Nice-to-have but helpful)
  - **Priority:** MEDIUM (helps refine application)

---

## Phase 2: Documentation (Weeks 1-7)

### ✅ Core Application Documents

- [ ] **Fill in TEAM.md (30% weight - CRITICAL!)**
  - File: `Docs/TEAM.md`
  - Actions:
    - [ ] Replace all [bracketed placeholders] with your real information
    - [ ] Add 2-3 past projects with links/evidence (GitHub, app store, screenshots)
    - [ ] Include execution proof (commit history, user metrics, testimonials)
    - [ ] Get reference letter from advisor/mentor (optional but helpful)
  - Timeline: Week 1 (THIS WEEK - highest priority!)
  - **Priority:** 🔴 CRITICAL (30% of total score)

- [ ] **Review and finalize CCMF_Answers_EN.md**
  - File: `Docs/CCMF_Answers_EN.md`
  - Actions:
    - [ ] Read through all sections (A-M)
    - [ ] Fill in any [Your Name] placeholders
    - [ ] Verify Abstract is ≤200 words
    - [ ] Update with Info Session learnings (after session)
  - Timeline: Week 7 (Dec 16-20)
  - **Priority:** HIGH (core application)

- [ ] **Review and finalize CCMF_Answers_ZH.md (if needed)**
  - File: `Docs/CCMF_Answers_ZH.md`
  - Actions:
    - [ ] Confirm if Chinese version is required (ask at Info Session)
    - [ ] If yes: Proofread Chinese translations
    - [ ] If no: Skip this file
  - Timeline: Week 7
  - **Priority:** MEDIUM (depends on EMS requirements)

- [ ] **Add Social Impact section to 05-application-outline.md**
  - File: `Docs/05-application-outline.md`
  - Actions:
    - [ ] Copy content from `CCMF-EMS-MAPPING.md` Section E (Social Responsibility)
    - [ ] Add measurable outcomes (≥500 students, ≥80% satisfaction, etc.)
    - [ ] Emphasize free school tier and open-source contributions
  - Timeline: Week 2 (Nov 4-8)
  - **Priority:** MEDIUM (10% weight)

- [ ] **Create Funding Status Declaration**
  - Reference: `CCMF-EMS-MAPPING.md` Section I
  - Actions:
    - [ ] Declare: "No other grants received or applied for"
    - [ ] State compliance with Sections 1.3, 1.4, 3.1
    - [ ] Mention planned CIP application (Jul 2026, no overlap)
  - Timeline: Week 7
  - **Priority:** MEDIUM (compliance requirement)

### ✅ Supporting Materials

- [ ] **Budget spreadsheet finalized**
  - File: `Docs/Budget_HKD.csv`
  - Actions:
    - [ ] Verify sum = HK$100,000 exactly
    - [ ] Add justification column if not already present
    - [ ] Export as Excel (.xlsx) for EMS upload
  - Timeline: Week 7
  - **Priority:** HIGH (required document)

- [ ] **Milestones document finalized**
  - File: `Docs/Milestones_6M.md`
  - Actions:
    - [ ] Review all 6 months for realistic KPIs
    - [ ] Ensure all milestones are measurable (not vague)
    - [ ] Update [TBD] placeholders if applicable
  - Timeline: Week 7
  - **Priority:** HIGH (core planning document)

- [ ] **One-pager exported to PDF**
  - File: `Docs/OnePager_Sightline.md`
  - Actions:
    - [ ] Export as PDF using Pandoc, Typora, or Google Docs
    - [ ] Verify PDF is 1-2 pages A4 (adjust font size if needed)
    - [ ] Check all links are clickable (if PDF supports hyperlinks)
  - Timeline: Week 6
  - **Priority:** MEDIUM (nice-to-have supplementary document)

- [ ] **Pitch deck exported to PDF**
  - File: `Docs/Deck_Sightline_10slides.md`
  - Actions:
    - [ ] Import to Google Slides or PowerPoint
    - [ ] Add visuals (photos, diagrams, icons - NOT just text)
    - [ ] Insert QR code linking to demo video on Slide 5 and Slide 10
    - [ ] Export as PDF (<10MB)
  - Timeline: Week 6
  - **Priority:** MEDIUM (nice-to-have for venue pitches)

---

## Phase 3: Technical Build (Weeks 1-6) - OPTIONAL BUT RECOMMENDED

**Note:** Based on our discussion, a simple demo (backend + WebDemo) is recommended but not required by CCMF.

### Decision Point: Demo or No Demo?

**Option A: No Demo (Documentation Only)**
- ✅ Less work, focus on TEAM.md quality
- ❌ Competing against applicants who DO have demos
- Viability: 60-70% approval chance (if TEAM.md is very strong)

**Option B: Simple Demo (Backend + WebDemo)**
- ✅ Proves technical execution (strengthens Team 30% + Innovation 30%)
- ⚠️ Requires 40-60 hours development work
- Viability: 75-85% approval chance
- **RECOMMENDED**

**Option C: Full MVP (AR working)**
- ✅ Maximum competitive advantage
- ❌ Very tight timeline (risky)
- Viability: 80-90% IF completed, but 40% risk of not finishing

**Choose one option and check below:**

- [ ] **Option A selected:** Skip Phase 3, proceed to Phase 4
- [ ] **Option B selected:** Build backend + WebDemo (follow checklist below)
- [ ] **Option C selected:** Build full MVP (not recommended given 9-week timeline)

---

### If Option B (Simple Demo) Selected:

#### Week 1-3: Backend Development

- [ ] **Set up Backend project**
  - [ ] Install Node.js 18+ and npm
  - [ ] Create /Server folder with package.json
  - [ ] Install dependencies: `fastify`, `@fastify/cors`, `tsx`, `typescript`, `vitest`, `@types/node`, `uuid`
  - [ ] Configure tsconfig.json (strict mode)

- [ ] **Implement core logic**
  - [ ] Create `src/types.ts` (POI, LatLng, IdentifyRequest, IdentifyResponse interfaces)
  - [ ] Implement `src/core/haversine.ts` (distance calculation)
  - [ ] Implement `src/core/geo.ts` (selectPOI function)
  - [ ] Create `data/pois.json` with 3 POIs (Clock Tower, Star Ferry, IFC)

- [ ] **Build API endpoints**
  - [ ] POST `/identify` (GPS-based, returns nearest POI)
  - [ ] GET `/poi/:id` (returns full POI details)
  - [ ] Add telemetry: `requestId` (UUID), `server_ms` (latency)
  - [ ] Add CORS headers

- [ ] **Write tests**
  - [ ] Vitest tests for haversine function (3+ test cases)
  - [ ] Vitest tests for selectPOI function (exact match, nearest, none in radius)
  - [ ] Run `npm test` and verify all pass

- [ ] **Deploy to cloud** (optional, for demo purposes)
  - [ ] Deploy to Firebase, Heroku, or Google Cloud Run
  - [ ] Get public URL (e.g., `https://sightline-api.onrender.com`)

#### Week 4-5: WebDemo

- [ ] **Set up WebDemo project**
  - [ ] Create /WebDemo folder with Vite + TypeScript
  - [ ] Configure proxy to backend (port 3000 → 5173)

- [ ] **Build UI**
  - [ ] Create index.html with container
  - [ ] Add anchor dot at fixed position (420, 240)
  - [ ] Create draggable AR card mockup
  - [ ] Draw SVG leader line from anchor to card

- [ ] **Implement API integration**
  - [ ] Button click: fetch `/identify?lat=22.2946&lng=114.1699`
  - [ ] Measure latency (client-side timer)
  - [ ] Display result in card: name, year, blurb
  - [ ] Show latency in footer: "1.4s"
  - [ ] Tint: Green for POI match, amber for default

#### Week 6: Demo Video (if built demo)

- [ ] **Screen recording**
  - [ ] Record WebDemo calling API (show browser, network tab, response)
  - [ ] Voiceover: "This is Sightline's backend API returning Clock Tower data in 1.4 seconds"
  - [ ] Show latency measurement

- [ ] **Edit video**
  - [ ] 60-90 seconds total
  - [ ] Format: MP4, <50MB
  - [ ] Upload to YouTube (unlisted) or Google Drive
  - [ ] Get shareable link

---

## Phase 4: Demo Video (if NO technical build)

### Alternative: Mockup Video (Weeks 4-5)

If you're NOT building a demo (Option A), you can still create a video using mockups/wireframes:

- [ ] **Create mockup slides**
  - [ ] Slide 1: Problem statement (10s) - "Tourists struggle to engage with heritage sites"
  - [ ] Slide 2: Wireframe of AR experience (30s) - Hand-drawn or Figma mockup showing phone pointing at Clock Tower, AR card appearing
  - [ ] Slide 3: Tech explanation (20s) - Diagram showing hybrid anchoring (GPS + Vision)
  - [ ] Slide 4: Social impact (15s) - "Free for 500+ HK schools"
  - [ ] Slide 5: Team + roadmap (10s) - Your photo, "Applying for CCMF HK$100K"

- [ ] **Record voiceover**
  - [ ] Script: Write 60-90 second narration
  - [ ] Record: Use phone or laptop mic (clear audio is more important than video quality)
  - [ ] Edit: Use iMovie, DaVinci Resolve (free), or Camtasia

- [ ] **Export and upload**
  - [ ] Format: MP4, <50MB
  - [ ] Upload to YouTube (unlisted) or Google Drive
  - [ ] Test link (make sure it's publicly accessible)

**Priority:** MEDIUM (nice-to-have, NOT required by CCMF)

---

## Phase 5: Venue Outreach (Weeks 5-7) - OPTIONAL

**Note:** This is for securing a pilot LOI (Letter of Intent) to strengthen your Business Model score (30%). Not required, but highly recommended.

### LOI Strategy

- [ ] **Identify target venues (10 total)**
  - [ ] Tier 1 (easier approval): PMQ, Tai Kwun, Blue House Cluster
  - [ ] Tier 2 (mid-size): Hong Kong Heritage Museum, Hong Kong Science Museum
  - [ ] Tier 3 (dream targets): M+, Hong Kong Museum of History

- [ ] **Customize outreach emails**
  - [ ] Reference: `Docs/Pilot_LOI_draft.md` (Outreach Email Template)
  - [ ] Personalize each email (mention specific gallery, exhibit, school program)
  - [ ] Attach: OnePager PDF, Demo video link
  - [ ] Send 10 emails in Week 5 (after demo video ready)

- [ ] **Follow up**
  - [ ] Week 6: Send follow-up email to non-responders (1 week after initial email)
  - [ ] Week 7: Schedule calls with interested venues (target 2-3 meetings)

- [ ] **Secure 1 signed LOI**
  - [ ] Customize LOI template from `Docs/Pilot_LOI_draft.md`
  - [ ] Get signature (digital signature OK, or scan of physical signature)
  - [ ] Save as PDF: `Pilot_LOI_[Venue_Name]_Signed.pdf`
  - [ ] **Deadline:** End of Week 7 (for CCMF Final Report)

**Priority:** MEDIUM-HIGH (strengthens Business Model 30% score)

---

## Phase 6: Final Review (Week 8, Dec 23-27)

### Quality Assurance

- [ ] **Proofread all documents**
  - [ ] Check for typos, grammar errors, inconsistent numbers
  - [ ] Verify all [placeholders] replaced with real data
  - [ ] Ensure same KPIs cited across all docs (no contradictions)

- [ ] **Get external feedback**
  - [ ] Share draft application with mentor/advisor (if available)
  - [ ] Ask colleague or friend to review (fresh eyes catch errors)
  - [ ] Incorporate feedback within 2-3 days

- [ ] **Verify file sizes and formats**
  - [ ] Demo video: <50MB (compress if needed)
  - [ ] PDF documents: <10MB each (compress images if needed)
  - [ ] Check EMS upload limits (confirm at Info Session)

- [ ] **Create EMS submission folder**
  - [ ] Folder structure:
    ```
    CCMF_Submission_Sightline/
    ├── CCMF_Answers_EN.pdf (exported from .md)
    ├── CCMF_Answers_ZH.pdf (if required)
    ├── Budget_HKD.xlsx
    ├── Milestones_6M.pdf
    ├── TEAM.pdf (exported from TEAM.md)
    ├── OnePager_Sightline.pdf
    ├── Deck_Sightline_10slides.pdf
    ├── Pilot_LOI_[Venue]_Signed.pdf (if secured)
    ├── Demo_Video.mp4 OR Demo_Video_Link.txt
    ├── HKID_Redacted.pdf (show holder status only)
    ├── Resume_CV.pdf (2 pages max)
    └── GitHub_Profile_Screenshot.png
    ```

- [ ] **Practice elevator pitch** (if invited to presentation session)
  - [ ] 60-second version: Problem → Solution → Innovation → Social Impact → Ask
  - [ ] 5-minute version: Walk through 10-slide deck
  - [ ] Record yourself, watch, iterate

---

## Phase 7: EMS Submission (Week 9, Dec 30 - Jan 2)

### Pre-Submission (Dec 30-31)

- [ ] **Login to EMS**
  - URL: https://ems.cyberport.hk
  - Account: [your email]

- [ ] **Start new CCMF application**
  - Find: "CCMF Hong Kong Programme - March 2026 Intake"
  - Click: "Apply"

- [ ] **Fill in online form fields**
  - [ ] Section A: Abstract / Project Summary (~200 words)
  - [ ] Section B: Project Management Team
  - [ ] Section C: Business Model and Time to Market
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

- [ ] **Upload supporting documents**
  - [ ] HKID copy (redacted)
  - [ ] Resume/CV
  - [ ] Budget spreadsheet
  - [ ] Milestones document
  - [ ] Demo video OR video link
  - [ ] [Optional] Pilot LOI signed PDF
  - [ ] [Optional] Reference letter
  - [ ] [Optional] GitHub profile screenshot

- [ ] **Save draft frequently** (EMS has no auto-save!)

### Final Submission (Jan 1-2)

- [ ] **Final review checklist**
  - [ ] All required fields filled
  - [ ] All supporting documents uploaded
  - [ ] File sizes within limits
  - [ ] No typos or errors
  - [ ] Consistent information across sections

- [ ] **Submit application**
  - [ ] Click "Submit" button in EMS
  - [ ] Confirm submission
  - [ ] **DO NOT wait until Jan 2 evening** (submit by Jan 1 noon for buffer)

- [ ] **Confirm receipt**
  - [ ] Check email for Cyberport confirmation
  - [ ] Save confirmation email
  - [ ] Screenshot EMS submission status page

- [ ] **Backup all files**
  - [ ] Save copy of entire submission folder to Google Drive, Dropbox, or external drive
  - [ ] Keep local copy on computer

---

## Post-Submission Actions

### Immediate (Jan 3-10)

- [ ] **Thank you email to anyone who helped**
  - [ ] Mentor/advisor (if provided reference letter or feedback)
  - [ ] Teacher (if arranged trial pre-submission)
  - [ ] Venue contacts (if provided LOI)

- [ ] **Update LinkedIn/portfolio**
  - [ ] Add "Applied for Cyberport CCMF grant for Sightline AR project"
  - [ ] Share one-pager or demo video publicly (if comfortable)

### If Shortlisted for Presentation (Est. Feb 2026)

- [ ] **Prepare presentation**
  - [ ] Use 10-slide deck (Deck_Sightline_10slides.md)
  - [ ] Practice 5-7 minute delivery
  - [ ] Anticipate Q&A: Technical feasibility? Why hybrid vs. GPS-only? Path to revenue?

- [ ] **Prepare demo** (if you built one)
  - [ ] Bring laptop with demo running locally (don't rely on WiFi)
  - [ ] Backup: Pre-recorded video on USB drive

- [ ] **Dress code:** Business casual (no suit required, but presentable)

### If Successful (Est. Mar 2026)

- [ ] **Sign CCMF Agreement within 30 days**
  - [ ] Read terms carefully (Section 6.1 compliance)
  - [ ] Confirm bank account for grant disbursement
  - [ ] Return signed agreement to Cyberport

- [ ] **Receive Tranche 1 (HK$10,000)**
  - [ ] Confirm receipt
  - [ ] Set up budget tracking spreadsheet
  - [ ] Begin Month 1 development

- [ ] **Start execution!**
  - [ ] Follow `Milestones_6M.md` timeline
  - [ ] Deliver Interim Report (Month 3)
  - [ ] Deliver Final Report (Month 6)

### If Unsuccessful

- [ ] **Request feedback** (if Cyberport provides it)
- [ ] **Iterate and reapply** (next CCMF intake or pivot to CIP)
- [ ] **Alternative funding:** Explore other HK grants (HKSTP, HKDC, Innovation and Technology Fund)

---

## Additional Resources

### Collect Quotes for Scanning/Targets (if doing Vuforia)

- [ ] **Vuforia scanning service quotes**
  - [ ] Contact 2-3 vendors (search "Vuforia scanning service Hong Kong")
  - [ ] Get quotes for: 1 museum room scan (Area Target)
  - [ ] Typical cost: HK$5,000-15,000 per room
  - [ ] **Note:** This is for post-CCMF (not needed for application)

### Confirm School/Museum Availability Windows

- [ ] **School term dates (2026)**
  - [ ] Check Education Bureau website for school holidays
  - [ ] Avoid: Chinese New Year (late Jan/early Feb), Easter (Apr), Summer (Jul-Aug)
  - [ ] Best for teacher trial: Sep-Nov (after CCMF completion)

- [ ] **Museum availability**
  - [ ] Check museum websites for closure days
  - [ ] Confirm: Most HK museums closed on Tue or Wed (not Mon)
  - [ ] Plan field testing accordingly

### Prep EMS Uploads (Format Check)

- [ ] **PDF requirements**
  - [ ] File size: <10MB each (compress if needed using Smallpdf, Adobe Acrobat)
  - [ ] Page count: No strict limit, but keep TEAM.md to 3-5 pages max
  - [ ] Format: PDF/A for archival (if required, check EMS)

- [ ] **Video requirements**
  - [ ] File size: <50MB (compress using HandBrake, VLC, or online tools)
  - [ ] Format: MP4 (H.264 codec preferred)
  - [ ] Duration: 60-90 seconds (no strict limit, but concise is better)
  - [ ] Alternative: Upload to YouTube (unlisted), provide link in EMS

---

## Time Estimate Summary

| Phase | Duration | Effort (Hours) |
|-------|----------|----------------|
| Phase 1: Administrative Setup | Week 0-1 | 2-3 hours |
| Phase 2: Documentation | Week 1-7 | 15-20 hours |
| Phase 3: Technical Build (Optional) | Week 1-6 | 40-60 hours |
| Phase 4: Demo Video (if no build) | Week 4-5 | 8-12 hours |
| Phase 5: Venue Outreach (Optional) | Week 5-7 | 10-15 hours |
| Phase 6: Final Review | Week 8 | 4-6 hours |
| Phase 7: EMS Submission | Week 9 | 2-3 hours |
| **TOTAL** | 9 weeks | **41-69 hours** (depends on demo option) |

**Recommendation:** Allocate 8-10 hours per week (evenings + weekends) to stay on track.

---

## Critical Path Items (Must Do)

1. 🔴 **Fill in TEAM.md** (Week 1 - 30% weight)
2. 🔴 **Register for Info Session** (ASAP - informs strategy)
3. 🟡 **Add Social Impact section** (Week 2 - 10% weight)
4. 🟡 **Create demo video** (Week 4-5 - nice-to-have but impactful)
5. 🟡 **Secure 1 LOI** (Week 5-7 - strengthens Business Model)
6. 🟢 **Final review** (Week 8 - catch errors)
7. 🔴 **Submit by Jan 1** (not Jan 2 evening - give yourself buffer!)

---

## Questions or Issues?

### Contact Cyberport

**Email:** ccmf_enquiry@cyberport.hk  
**Response Time:** Usually 2-3 business days  
**Best for:** Technical EMS issues, eligibility questions, document format clarification

### Leverage Your Network

- [ ] Post in Cyberport alumni groups (if you have access)
- [ ] Ask mentors/advisors for feedback
- [ ] Join HK startup communities (Meetup, Facebook groups)

---

**Document Status:** ✅ Ready for execution  
**Next Immediate Action:** Fill in TEAM.md THIS WEEK (highest priority!)  
**Deadline Reminder:** January 2, 2026 (submit by Jan 1 for safety buffer)

**Good luck with your CCMF application! 🚀**

