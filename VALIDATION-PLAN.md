# Sightline CCMF Validation & Submission Plan (30 Days)

## Strategic Architecture: Validation-First WebAR MVP

### Core Principle
Build the MINIMUM to validate demand and prove technical feasibility for CCMF application. Avoid premature infrastructure.

---

## System Architecture (Lean MVP)

```
User Flow (Target):
1. Tourist at Clock Tower
2. Scan QR code → Opens WebAR in Safari/Chrome
3. Grant camera + location permissions
4. AR card appears on screen showing "Clock Tower (1915)"
5. Read info, tap to learn more

Technical Stack (Minimal):
┌─────────────────────────────────────────┐
│ WebAR Frontend (AR.js + A-Frame)        │
│ - HTML/CSS/JavaScript                   │
│ - GPS-based AR positioning              │
│ - Works on iPhone Safari + Android      │
│ - Zero install required                 │
└─────────────────────────────────────────┘
           ↓ (Optional for v0.2)
┌─────────────────────────────────────────┐
│ Backend API (Node + Fastify)            │
│ - POST /identify (lat/lng → POI)        │
│ - GET /poi/:id (full details)           │
│ - Hosted on Vercel/Railway (free tier)  │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ POI Data (JSON file or DB)              │
│ - 3 pilot POIs: Clock Tower, Star       │
│   Ferry, Avenue of Stars                │
└─────────────────────────────────────────┘
```

### Why WebAR Over Unity?
- Works on your iPhone (no Mac needed for iOS build)
- Zero install = lower friction for users
- Easier to demo (just share URL)
- Better for CCMF (shows wider accessibility)
- Can build on Windows
- Faster iteration for validation

### What We're NOT Building (Yet)
- ❌ Complex backend infrastructure
- ❌ User accounts / authentication
- ❌ Native iOS/Android apps
- ❌ Quest 3 implementation
- ❌ Mission engine / gamification
- ❌ Voice input / AI features

**Build these ONLY if CCMF funded + validation positive**

---

## Week 1: Customer Discovery (Lean Startup)

### Goal
Validate that tourists/students actually want geo-anchored AR answers before building anything substantial.

### Day 1-2: Research Prep
**Deliverables:**
- User interview script (5 core questions)
- Simple Figma mockup showing AR card concept
- Consent form for video recording
- Contact list for heritage sites (LOI outreach)

**Activities:**
1. Create interview script:
   - "How do you currently learn about HK landmarks?"
   - "What's frustrating about looking up info?"
   - Show mockup: "Would you use this? Why/why not?"
   - "What info would you want to see first?"
   - "Would you pay HKD 20-30/month for this?"

2. Design simple Figma mockup (2-3 screens):
   - Screen 1: Phone pointing at Clock Tower
   - Screen 2: AR card overlay with info
   - Screen 3: Detailed view with photos

3. Prepare outreach email template for heritage sites

### Day 3-4: Field Interviews
**Deliverables:**
- 15-20 tourist interviews at Clock Tower
- Video recordings (with consent)
- Photos of tourists struggling with phones
- Notes on key pain points and quotes

**Activities:**
1. Go to Clock Tower (10am-5pm, 2 days)
2. Target: Tourists aged 18-45, solo/couples (easier to approach)
3. Script: "Excuse me, I'm researching tourism experiences in HK. Can I ask you 3 quick questions? Takes 2 minutes."
4. Show Figma mockup, record reactions
5. Take notes on objections and excitement points

**Success Criteria:**
- 60%+ say "yes, I'd use this"
- 3-5 strong video testimonials
- Clear pain points identified

### Day 5: Data Analysis & Site Outreach
**Deliverables:**
- Interview summary with key findings
- Video compilation (2-3 min of best clips)
- Emails sent to 3-5 heritage sites for LOI

**Activities:**
1. Watch all interview footage
2. Extract quotes: "It takes me 5 minutes to Google landmarks" 
3. Calculate satisfaction scores
4. Identify top 3 pain points
5. Draft LOI request email to heritage sites:
   - LCSD (Leisure & Cultural Services Department)
   - Star Ferry Company
   - Avenue of Stars management
   - Tsim Sha Tsui District Office

**Decision Point:**
- If <50% interest → PIVOT concept or target audience
- If 60%+ interest → Proceed to Week 2 (technical proof)

---

## Week 2: WebAR Technical Proof

### Goal
Build working WebAR demo that proves geo-anchored AR is technically feasible at Clock Tower.

### Day 6-7: WebAR Prototype v0.1 (Hardcoded)
**Deliverables:**
- Single HTML file with AR.js + A-Frame
- Hardcoded Clock Tower location (22.2946, 114.1699)
- AR card appears when user at Clock Tower
- Hosted on Vercel (free)

**Tech Stack:**
```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://aframe.io/releases/1.4.0/aframe.min.js"></script>
  <script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js"></script>
  <style>
    /* High-contrast styles for outdoor readability */
  </style>
</head>
<body>
  <a-scene vr-mode-ui="enabled: false" arjs="sourceType: webcam; debugUIEnabled: false;">
    
    <!-- Clock Tower POI -->
    <a-entity gps-entity-place="latitude: 22.2946; longitude: 114.1699">
      <!-- AR Card -->
      <a-plane position="0 1 0" rotation="0 0 0" width="3" height="2" 
               color="#FFFFFF" opacity="0.95">
      </a-plane>
      <a-text value="Clock Tower" position="0 2 0" align="center" 
              color="#000000" width="6"></a-text>
      <a-text value="1915" position="0 1.6 0" align="center" 
              color="#666666" width="6"></a-text>
      <a-text value="Former Kowloon-Canton\nRailway terminus" 
              position="0 1.2 0" align="center" color="#333333" 
              width="5" wrap-count="25"></a-text>
    </a-entity>
    
    <a-camera gps-camera rotation-reader></a-camera>
  </a-scene>
</body>
</html>
```

**Activities:**
1. Set up project structure in `/WebDemo`
2. Create `index.html` with AR.js integration
3. Style AR card for outdoor readability
4. Test locally (serve with `python -m http.server`)
5. Deploy to Vercel (`vercel --prod`)
6. Create QR code linking to demo URL

**Testing Checklist:**
- [ ] Loads on iPhone Safari
- [ ] Asks for camera + location permissions
- [ ] AR card visible when at Clock Tower (±50m)
- [ ] Text readable in sunlight
- [ ] No console errors

### Day 8-9: Field Testing & Refinement
**Deliverables:**
- Tested WebAR demo at Clock Tower
- 60-90 second demo video
- Performance notes (latency, accuracy, UX issues)

**Activities:**
1. Go to Clock Tower with iPhone
2. Open WebAR demo URL
3. Test at different distances (10m, 30m, 50m)
4. Record video showing:
   - User scans QR code
   - Camera opens
   - AR card appears
   - User reads info
   - Close-up of card (readable)
5. Test on sunny day (readability) and cloudy day
6. Note GPS accuracy issues

**Expected Issues & Fixes:**
- GPS drift: Add "tap to lock" fallback
- Card too small: Increase text size
- Hard to read: Boost contrast, add shadow
- Slow to appear: Add loading indicator

### Day 10: WebAR v0.2 (Optional Backend)
**Deliverables:**
- Backend API with 3 POIs (if time allows)
- WebAR fetches POI data dynamically
- OR: Keep hardcoded for simplicity

**Decision:**
If WebAR v0.1 works well → Skip backend, keep it simple
If need flexibility → Add lightweight backend

**Backend Stack (if building):**
```javascript
// /Server/src/server.ts (Fastify)
import Fastify from 'fastify';
import cors from '@fastify/cors';

const server = Fastify();
server.register(cors);

const POIS = [
  { id: 'clock_tower', name: 'Clock Tower', lat: 22.2946, lng: 114.1699, 
    year: 1915, blurb: 'Former Kowloon-Canton Railway terminus...' },
  { id: 'star_ferry', name: 'Star Ferry', lat: 22.2800, lng: 114.1587,
    year: 1888, blurb: 'Iconic ferry service since 1888...' },
  { id: 'avenue_stars', name: 'Avenue of Stars', lat: 22.2930, lng: 114.1730,
    year: 2004, blurb: 'Tribute to HK film industry...' }
];

server.get('/poi/nearest', async (req, reply) => {
  const { lat, lng } = req.query;
  // Find nearest POI within 100m
  // Return POI data
});

server.listen({ port: 3000 });
```

Deploy to Railway.app (free tier) or Vercel serverless

---

## Week 3: CCMF Application Preparation

### Goal
Package all validation evidence and technical proof into compelling CCMF application.

### Day 11-12: Application Draft
**Deliverables:**
- 8-page CCMF proposal (adapt from `/Docs/05-application-outline.md`)
- Updated with Week 1 validation data
- Demo video embedded/linked

**Key Sections to Update:**
1. **Problem Statement**: Add interview quotes
   - "12/20 tourists said finding landmark info takes 5-10 minutes"
   - "85% frustrated with screen glare outdoors"

2. **Solution**: Reference working WebAR demo
   - "Prototype tested at Clock Tower with 10 users"
   - "Average time to info: 8 seconds (vs. 5+ minutes with Google)"

3. **Evidence**: Attach validation materials
   - User interview summary
   - Demo video link
   - Performance metrics (GPS accuracy, load time)

4. **Team**: Add your Unity/AR experience
   - Previous projects
   - Technical skills
   - Why you're credible

5. **Milestones**: Keep existing 6-month plan but emphasize:
   - Month 1: Expand to 10 POIs based on user feedback
   - Month 2: iOS/Android native apps (if WebAR limitations found)
   - Month 3-6: B2B partnerships with validated model

### Day 13-14: Supporting Materials
**Deliverables:**
- Gantt chart (6-month timeline)
- Budget spreadsheet (HKD 100,000 breakdown)
- Architecture diagram
- Competitor comparison table (updated)
- CV/resume

**Activities:**
1. Create Gantt chart in Excel/Google Sheets:
   - Month 1: POI expansion (10 → 20)
   - Month 2: Native app development
   - Month 3: Beta testing (50 users)
   - Month 4: B2B pilot (1 site)
   - Month 5: Demo video production
   - Month 6: LOI + CIP prep

2. Export budget table from existing docs

3. Create architecture diagram (draw.io or Figma):
   - WebAR Frontend
   - Backend API (future)
   - POI Database
   - User flow

4. Update competitor matrix with WebAR angle:
   - Google Lens: No persistent AR
   - 8th Wall: Platform, not end product
   - Niantic: Games, not tourism
   - Sightline: Tourism-focused, zero install

### Day 15: Mock Interview Prep
**Deliverables:**
- Pitch deck (10 slides)
- Practice pitch (record yourself)
- Q&A prep document

**Pitch Structure (15 min):**
1. Problem (2 min): Tourist pain point with video evidence
2. Solution (3 min): WebAR demo walkthrough
3. Validation (2 min): Interview results, user testimonials
4. Technical Approach (2 min): Why WebAR, why feasible
5. Social Value (2 min): Tourism recovery, education, heritage
6. Roadmap (2 min): 6-month milestones
7. Ask (2 min): HKD 100K budget breakdown

**Common Q&A:**
- "Why not just improve Google Lens?"
- "How will you acquire users?"
- "What if heritage sites don't partner?"
- "Can this scale beyond HK?"

---

## Week 4: Submission & Partnerships

### Goal
Submit CCMF application and secure at least 1 Letter of Intent from heritage site.

### Day 16-18: LOI Follow-ups
**Deliverables:**
- 1-2 Letters of Intent (signed)
- Partnership pitch deck for sites
- Demo scheduled at heritage site

**Activities:**
1. Follow up on Week 1 emails to heritage sites
2. Offer to demo WebAR at their location
3. Pitch value proposition:
   - "Free AR experience for your visitors"
   - "Analytics on popular exhibits/times"
   - "No hardware or app install required"
   - "We handle all tech, you provide content"

4. Request simple LOI:
   - "We are interested in piloting Sightline at [Site Name]"
   - "Pending CCMF approval, we commit to 3-month trial"
   - Signed by site manager/director

**Target Sites (Priority Order):**
1. Clock Tower (already tested here)
2. Star Ferry (high tourist traffic)
3. Avenue of Stars (government-managed, easier approval)
4. Hong Kong Museum of History (indoor + outdoor use case)

### Day 19-20: Final Application Polish
**Deliverables:**
- Completed CCMF application form
- All attachments uploaded
- Proofread by advisor/mentor (if available)

**Final Checklist:**
- [ ] HKID copy attached
- [ ] 8-page proposal (PDF)
- [ ] Budget spreadsheet (XLS/PDF)
- [ ] Gantt chart (PDF/image)
- [ ] CV/resume (PDF)
- [ ] Demo video (YouTube unlisted link)
- [ ] User research summary (PDF with quotes)
- [ ] Architecture diagram (PNG/PDF)
- [ ] Competitor matrix (PDF)
- [ ] Letter(s) of Intent from heritage site(s)
- [ ] Application form completed on apply.cyberport.hk

**Proofread Focus:**
- No typos in proposal
- Budget adds up to HKD 100,000
- All claims have evidence citations
- Demo video link works (test in incognito)

### Day 21: SUBMIT
**Activities:**
1. Log in to apply.cyberport.hk
2. Fill online application form
3. Upload all attachments
4. Double-check all fields
5. Click SUBMIT
6. Screenshot confirmation page
7. Email ccmf@cyberport.hk to confirm receipt
8. Send thank-you email to heritage sites who provided LOI

---

## Post-Submission (Day 22-30)

### Week 4 Remaining: Iteration Based on Validation

**If validation was positive (60%+ interest):**
- Expand WebAR to 2nd POI (Star Ferry)
- Recruit 5-10 beta testers
- Gather more testimonials for interview stage

**If validation was mixed (40-60% interest):**
- Analyze objections from interviews
- Iterate on value proposition
- Test alternative use cases (education vs. tourism)

**If validation was negative (<40% interest):**
- Consider pivot:
  - Indoor museum focus (higher engagement)
  - B2B only (venues pay, not consumers)
  - Different geography (less competitive city)

### Prepare for CCMF Interview (if shortlisted)

**Timeline Expectation:**
- Week 6-8: Shortlist notification
- Week 8-10: Interview invitation (15 min pitch + 15 min Q&A)

**Interview Prep:**
- Practice pitch 10+ times
- Have demo ready on phone (WiFi backup plan)
- Bring printed materials (backup if projector fails)
- Prepare answers to tough questions

---

## Technical Implementation Details

### WebAR Stack (Week 2)

**Files to Create:**

1. `/WebDemo/index.html` - Main WebAR interface
2. `/WebDemo/styles.css` - High-contrast outdoor styles
3. `/WebDemo/poi-data.js` - Hardcoded POI data (v0.1)
4. `/WebDemo/README.md` - Setup instructions

**Optional (if building backend):**

5. `/Server/src/server.ts` - Fastify API server
6. `/Server/src/types.ts` - TypeScript interfaces
7. `/Server/src/data/pois.json` - POI database
8. `/Server/package.json` - Dependencies

**Deployment:**
- Frontend: Vercel (free, instant deploy from Git)
- Backend: Railway.app or Vercel serverless (free tier)
- Domain: Use Vercel subdomain or buy custom (optional)

### GPS-Based AR Implementation

**AR.js Location-Based Mode:**
```javascript
// Key parameters to tune:
arjs="sourceType: webcam; 
      videoTexture: true; 
      debugUIEnabled: false;
      detectionMode: mono_and_matrix;
      matrixCodeType: 3x3;
      gpsMinDistance: 5;"  // Update every 5m

// For each POI:
gps-entity-place="latitude: 22.2946; 
                  longitude: 114.1699;"

// Camera setup:
gps-camera="minDistance: 5; 
            maxDistance: 100;
            simulateLatitude: 22.2946;  // For testing
            simulateLongitude: 114.1699;"
```

**Testing Without Going to Clock Tower:**
- Use `simulateLatitude/simulateLongitude` for local testing
- Test responsiveness on desktop first
- Then test GPS on iPhone at home
- Finally test at actual Clock Tower

### Performance Optimization

**Target Metrics:**
- Page load: <3s on 4G
- AR initialization: <5s
- GPS lock: <10s
- Frame rate: 30+ fps

**Optimizations:**
- Compress textures/images
- Lazy load AR.js (only when camera accessed)
- Cache POI data in localStorage
- Use service worker for offline capability (future)

---

## Risk Mitigation

### Risk 1: WebAR GPS Inaccuracy
**Likelihood**: Medium (urban canyon effect in HK)

**Mitigation:**
- Test at open areas first (Tsim Sha Tsui waterfront)
- Add "tap to lock" manual positioning fallback
- Display accuracy indicator ("GPS: ±12m")
- Future: Add image target backup (QR code on plaque)

### Risk 2: Low Interview Participation
**Likelihood**: Medium (tourists may be in a rush)

**Mitigation:**
- Offer HKD 20 Starbucks gift card incentive (10 people = HKD 200)
- Target weekends when tourists more relaxed
- Keep interview under 5 minutes
- Approach at Clock Tower plaza (tourists already stopped)

### Risk 3: Heritage Sites Don't Respond
**Likelihood**: High (cold outreach is hard)

**Mitigation:**
- Leverage any existing connections (friends/family in tourism)
- Attend LCSD public consultation sessions
- Contact tour operators as alternative (they can write LOI)
- Worst case: Submit without LOI (not required, just helpful)

### Risk 4: WebAR Doesn't Work Well on iPhone
**Likelihood**: Low (AR.js tested on Safari)

**Mitigation:**
- Test on multiple iOS versions (14, 15, 16+)
- Have backup plan: Simple Unity app if WebAR fails
- Document issues for CCMF (shows technical understanding)
- Emphasize in proposal: "WebAR for MVP, native apps in Month 2"

---

## Success Criteria

### Week 1 Success:
- ✅ 15+ user interviews completed
- ✅ 60%+ positive interest
- ✅ 3-5 strong video testimonials
- ✅ Clear pain points identified

### Week 2 Success:
- ✅ WebAR demo loads on iPhone
- ✅ AR card appears at Clock Tower
- ✅ 60-90 second demo video captured
- ✅ Performance acceptable (no major blockers)

### Week 3 Success:
- ✅ 8-page proposal drafted
- ✅ All supporting materials ready
- ✅ Pitch deck completed
- ✅ Mock interview practiced

### Week 4 Success:
- ✅ CCMF application SUBMITTED
- ✅ At least 1 LOI secured (ideal: 2-3)
- ✅ Confirmation email received from Cyberport
- ✅ WebAR demo live and shareable

### Overall CCMF Success:
- Application ranks high on:
  - **Feasibility (30%)**: Working demo + clear timeline
  - **Innovation (30%)**: WebAR zero-install approach
  - **Team (30%)**: Unity experience + execution evidence
  - **Social Value (10%)**: Tourism recovery + heritage preservation

---

## Budget Allocation (30-Day Validation Phase)

| Category | Item | Cost (HKD) |
|----------|------|-----------|
| **User Research** | Gift cards for interviews (10 × HKD 20) | 200 |
| | Printing (consent forms, mockups) | 50 |
| **Tools** | Figma Pro (1 month, optional) | 0 (free tier) |
| | Vercel hosting | 0 (free tier) |
| **Field Testing** | Transportation to Clock Tower (4 trips) | 200 |
| | Meals during field days | 200 |
| **Professional Services** | Video editing (optional, if not DIY) | 500 |
| | Proofreading/consulting (optional) | 500 |
| **Contingency** | Unexpected expenses | 350 |
| **TOTAL** | | **2,000** |

**All expenses documented for potential CCMF reimbursement if approved.**

---

## Key Files & Resources

### Existing Assets (Already in Repo):
- `/Docs/05-application-outline.md` - CCMF proposal template
- `/Docs/04-cyberport-map.md` - Program requirements
- `/Docs/01-business-canvas.md` - User personas
- `/Docs/02-competitor-matrix.md` - Competition analysis
- `/Docs/06-tech-plan.md` - Technical approach
- `/PLAN.md` - Original 7-day implementation plan
- `/README.md` - Project overview

### New Files to Create (Week 2):
- `/WebDemo/index.html` - WebAR demo
- `/WebDemo/styles.css` - UI styles
- `/validation/interview-script.md` - Research questions
- `/validation/interview-summary.md` - Findings
- `/validation/user-videos/` - Testimonial clips
- `/ccmf-application/` - Final submission package

### External Resources:
- AR.js Documentation: https://ar-js-org.github.io/AR.js-Docs/
- A-Frame Documentation: https://aframe.io/docs/
- CCMF Application Portal: https://apply.cyberport.hk
- Vercel Deployment: https://vercel.com/docs

---

## Next Steps After This Plan

**Immediate (Tomorrow):**
1. Review this plan, ask questions if anything unclear
2. Confirm 1-month timeline is realistic
3. Block calendar for field interview days (Week 1, Day 3-4)
4. Set up tools: Figma account, Vercel account, code editor

**Week 1 Start:**
5. Create user interview script (I can provide template)
6. Design Figma mockup (I can provide structure)
7. Draft heritage site outreach email (I can provide template)
8. Schedule Clock Tower field trips (2 full days)

**Decision Point (End of Week 1):**
- If validation positive → Proceed to Week 2 (build WebAR)
- If validation mixed → Iterate on concept, re-interview
- If validation negative → Pivot or reconsider CCMF timing

---

## What Makes This Plan "Lean Startup"

1. ✅ **Validate first**: Customer interviews BEFORE building
2. ✅ **Build minimum**: WebAR only, no complex backend
3. ✅ **Measure**: Collect quantitative data (% interested, time saved)
4. ✅ **Learn**: Decision point after Week 1 (pivot if needed)
5. ✅ **Iterate**: WebAR v0.1 → v0.2 based on testing
6. ✅ **Evidence over promises**: User videos > architectural diagrams

**Alignment with CCMF:**
- Shows customer validation (Feasibility: 30%)
- Demonstrates technical capability (Team: 30%)
- Proves innovation (WebAR approach: 30%)
- Clear social value (Tourism + Heritage: 10%)

---

**This plan prioritizes VALIDATION and EVIDENCE over building infrastructure, aligned with lean startup principles while meeting CCMF requirements.**

