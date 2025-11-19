# CCMF Cross-Boundary Programme - AI Research Prompts Guide
## Web-Scraping Prompts to Gather Data for Maximum Application Score

**Purpose:** This document provides specific prompts to give to web-scraping AI (Claude with web access, GPT-4 with browsing, etc.) to research and gather data that will maximize your CCMF application score.

**Based on:** `Docs/CCMF_CROSS_BOUNDARY_SCORING_MAPPING.md` - Scoring criteria priorities

---

## Table of Contents

1. [Critical Sections Overview](#critical-sections-overview)
2. [Research Prompts by Section](#research-prompts-by-section)
3. [Data Extraction Checklist](#data-extraction-checklist)
4. [Prompt Templates](#prompt-templates)

---

## Critical Sections Overview

### Highest Scoring Impact Sections:

| Section | Score Impact | Word Limit | Priority |
|---------|-------------|------------|----------|
| **2.4b: Project Description** | **70%** (Business 30% + Innovation 30% + Social 10%) | 150 words EN, 150 words CH | 🔴 **CRITICAL** |
| **2.3: Self-Introduction** | **30%** (Team) | 150 words EN, 100 words CH | 🔴 **CRITICAL** |
| **2.9: Supplementary Info** | **All criteria** (strengthens everything) | Text area (no strict limit) | 🟠 **HIGH** |
| **2.5: Team Information** | **30%** (Team) | Text area | 🟠 **HIGH** |

---

## Research Prompts by Section

### Section 2.4b: Project Description (70% Score Impact!)

This section needs data for:
- **Problem Statement** (Business Model 30%)
- **Target Market** (Business Model 30%)
- **Innovation Highlights** (Innovation 30%)
- **Social Impact** (Social Responsibility 10%)

---

#### PROMPT 1: Market Problem Research (For Problem Statement)

**Give this prompt to your AI:**

```
I'm applying for a startup grant for my AR heritage education project called "Sightline". 
I need data-backed problem statements for my application. Please research and provide:

1. **Hong Kong Tourism & Heritage Education Statistics:**
   - Annual visitor numbers to HK heritage sites (2023-2024)
   - Museum visitor engagement rates (percentage of visitors who engage beyond lobby)
   - Student field trip statistics (how many students visit heritage sites annually)
   - Average dwell time at heritage sites (minutes)
   - Percentage of tourists who want "local insights" vs. those who get generic guidebooks

2. **Pain Points Data:**
   - Statistics on museum visitor disengagement (e.g., "X% of students disengage with static exhibits")
   - Data on audio guide usage rates (percentage of visitors who use audio guides)
   - Survey data on tourist frustration with finding landmark information (if available)
   - Statistics on screen glare/outdoor reading difficulties

3. **Market Gap Evidence:**
   - Number of existing AR heritage apps in Hong Kong
   - User complaints about existing AR apps (setup complexity, indoor/outdoor limitations)
   - Market research on demand for contactless, self-guided experiences post-COVID

**Sources to check:**
- Hong Kong Tourism Board annual reports
- Hong Kong Museum of History visitor statistics
- Education Bureau field trip data
- Google Travel Insights for Hong Kong
- App Store reviews of existing AR/museum apps
- Academic papers on museum visitor engagement

**Format:** Provide specific numbers, percentages, and dates. Include source URLs.
```

**What to Extract:**
- Visitor numbers (e.g., "26M+ visitors annually")
- Engagement rates (e.g., "<30% student engagement")
- Pain point statistics (e.g., "78% want local insights but get generic info")
- Market gap evidence (e.g., "No existing AR apps with hybrid GPS+Vision anchoring")

---

#### PROMPT 2: Target Market Research (For Target Market Statement)

**Give this prompt to your AI:**

```
I need specific, measurable target market data for my AR heritage education startup in Hong Kong. 
Please research and provide:

1. **B2B Market Size:**
   - Number of museums in Hong Kong (total count)
   - Number of heritage venues/sites in Hong Kong
   - Number of primary/secondary schools in Hong Kong
   - Number of students in HK schools (total enrollment)
   - Number of tour operators in Hong Kong (licensed)

2. **B2C Market Size:**
   - Annual tourist numbers to Hong Kong (2023-2024)
   - Breakdown by age group (18-45 years old - our target)
   - Percentage of tourists who use smartphones for destination research
   - Number of local residents who visit heritage sites annually

3. **Market Segments:**
   - Museum visitor demographics (age, origin, purpose)
   - School field trip frequency (how many trips per year per school)
   - Tourist spending on guided tours vs. self-guided experiences

**Sources to check:**
- Hong Kong Census and Statistics Department
- Hong Kong Tourism Board statistics
- Education Bureau school statistics
- Museum annual reports (M+, Heritage Museum, etc.)
- Travel industry reports

**Format:** Provide specific numbers with dates. Include market segment breakdowns.
```

**What to Extract:**
- Exact numbers (e.g., "60+ museums", "500+ schools", "350K+ students")
- Market size (e.g., "26M annual visitors")
- Demographics (e.g., "78% of tourists aged 25-55 use smartphones")
- Segment sizes (e.g., "20+ licensed tour operators in Tsim Sha Tsui")

---

#### PROMPT 3: Innovation & Technology Research (For Innovation Highlights)

**Give this prompt to your AI:**

```
I need to demonstrate cutting-edge innovation for my AR heritage education app. 
Please research and provide:

1. **AR Technology Benchmarks:**
   - Industry average AR content loading time (Time-to-First-Value)
   - ARCore Geospatial API accuracy benchmarks (±X meters)
   - Quest 3 Passthrough Camera API release date and capabilities
   - Gemini Vision API latency benchmarks (p50, p90)
   - Comparison: GPS-based vs. Vision-based AR anchoring accuracy

2. **Competitive Technology Analysis:**
   - Niantic Lightship VPS latency (how long does it take?)
   - Google Lens AR anchoring capabilities (does it have persistent anchoring?)
   - Vuforia Area Target accuracy (±X cm)
   - Museum AR app performance benchmarks (if available)

3. **Emerging Technology Trends:**
   - AR glasses market timeline (Ray-Ban Meta, Meta Orion release dates)
   - ARCore Geospatial API coverage in Hong Kong (VPS availability)
   - Latest AR/XR innovation awards or recognition (2024-2025)

4. **Performance Metrics:**
   - Typical AR app latency (industry standard)
   - AR anchor stability benchmarks (how long anchors stay locked)
   - GPS accuracy in urban environments (Hong Kong specific if available)

**Sources to check:**
- Google ARCore documentation and benchmarks
- Meta Quest developer documentation
- Niantic Lightship technical specs
- AR/XR industry reports (Gartner, IDC)
- Tech blogs (TechCrunch, The Verge) for AR glasses timeline
- Academic papers on AR performance metrics

**Format:** Provide specific numbers, dates, and technical specifications. Include comparison data.
```

**What to Extract:**
- Performance benchmarks (e.g., "Industry average: 5-8s, our target: <2s")
- Technology release dates (e.g., "Quest 3 Passthrough API: OS v74+, released 2024")
- Accuracy metrics (e.g., "ARCore Geospatial: ±5-15m outdoor, Vision AI: ±0.5m indoor")
- Competitive comparisons (e.g., "Niantic Lightship: 5-8s latency vs. our <2s target")

---

#### PROMPT 4: Social Impact Research (For Social Impact Statement)

**Give this prompt to your AI:**

```
I need data to demonstrate social impact for my AR heritage education project in Hong Kong. 
Please research and provide:

1. **Education Impact Data:**
   - Number of students in Hong Kong schools (primary + secondary)
   - Percentage of schools that conduct heritage field trips
   - Average student engagement rates at museums (baseline)
   - Studies on AR/technology improving student engagement (percentage increase)
   - Digital divide statistics (students without access to technology)

2. **Cultural Heritage Preservation:**
   - Number of heritage sites at risk in Hong Kong
   - Statistics on youth disengagement with heritage (if available)
   - Cultural knowledge preservation challenges (elder generation passing)
   - Heritage education funding gaps (if available)

3. **Accessibility & Inclusion:**
   - Number of visually impaired students in Hong Kong
   - Accessibility features in existing heritage apps (if any)
   - Free educational resource usage statistics

4. **Community Impact:**
   - Open source contribution statistics (GitHub stars, forks for similar projects)
   - Community engagement metrics (if available for similar projects)
   - Social enterprise impact measurements

**Sources to check:**
- Education Bureau statistics
- Hong Kong Heritage Conservation Office reports
- Academic papers on AR in education
- UNESCO heritage preservation reports (Hong Kong)
- Social enterprise impact reports

**Format:** Provide specific numbers, percentages, and measurable outcomes. Include baseline vs. target comparisons.
```

**What to Extract:**
- Student numbers (e.g., "350K+ students across 500+ schools")
- Engagement improvements (e.g., "AR increases engagement by 20-30% based on studies")
- Social impact metrics (e.g., "Free access for 500+ schools")
- Measurable outcomes (e.g., "Target: 20-30% increase in student dwell time")

---

### Section 2.3: Self-Introduction (30% Team Score)

This section needs data for:
- **Qualifications** (education, certifications)
- **Start-up experience** (track record)
- **Project execution ability** (shipped projects, metrics)
- **Communication skills** (evidence)
- **Teamwork** (collaborative projects)

---

#### PROMPT 5: Personal Track Record Research (For Self-Introduction)

**Give this prompt to your AI:**

```
I need to strengthen my self-introduction section for a startup grant application. 
Please help me research and compile evidence of:

1. **Industry Benchmarks for My Experience Level:**
   - Typical project timelines for AR apps (MVP to launch)
   - Average user acquisition rates for educational apps
   - Typical GitHub activity levels for active developers (commits per year)
   - Industry standards for "experienced" developer (years of experience)

2. **Competitive Analysis of Similar Founders:**
   - Typical qualifications of AR/EdTech startup founders
   - Common certifications in AR/VR development (Unity Certified, etc.)
   - Typical startup experience before first grant application

3. **Success Metrics to Reference:**
   - What constitutes "successful" project execution (users, downloads, revenue thresholds)
   - Typical team sizes for early-stage AR startups
   - Common collaboration tools and methods (to show teamwork)

**Note:** I'm not asking you to make up my experience. I want to understand industry benchmarks 
so I can accurately position my actual experience and achievements.

**Sources to check:**
- LinkedIn profiles of AR/EdTech founders (public data only)
- GitHub statistics (average commits per year for active developers)
- Startup accelerator program requirements (typical founder profiles)
- Industry reports on developer experience levels

**Format:** Provide benchmarks and industry standards. Help me understand how to position my experience.
```

**What to Extract:**
- Industry benchmarks (e.g., "Typical AR MVP: 3-6 months", "Active developer: 500+ commits/year")
- Success thresholds (e.g., "10K+ downloads = successful indie app")
- Qualification standards (e.g., "5+ years = experienced developer")
- Team size norms (e.g., "Early-stage AR startups: 1-3 founders")

---

### Section 2.9: Supplementary Information (Strengthens All Criteria)

This section can include:
- **3-month launch timeline** (Business Model - Time to Market)
- **Open source contributions** (Social Responsibility)
- **Technical innovation details** (Innovation)
- **Market validation data** (Business Model)

---

#### PROMPT 6: 3-Month Launch Timeline Research (For Time to Market)

**Give this prompt to your AI:**

```
I need to create a realistic 3-month launch timeline for my AR heritage education app. 
Please research and provide:

1. **Typical AR App Development Timelines:**
   - MVP development time for AR apps (weeks/months)
   - ARCore Geospatial API integration time (typical duration)
   - App Store/Google Play review times (submission to approval)
   - Beta testing duration (typical length)

2. **Regulatory & Compliance Requirements:**
   - App Store submission requirements for AR apps
   - Privacy policy requirements (PDPO compliance for Hong Kong)
   - Camera/GPS permission requirements
   - Content moderation requirements (if applicable)

3. **Realistic Milestone Breakdown:**
   - Month 1: What can realistically be completed?
   - Month 2: What can realistically be completed?
   - Month 3: What can realistically be completed?
   - Buffer time needed for unexpected delays

**Sources to check:**
- AR development case studies (MVP timelines)
- App Store review guidelines
- Hong Kong PDPO (Personal Data Privacy Ordinance) requirements
- ARCore developer documentation (integration time estimates)

**Format:** Provide realistic timelines with buffer time. Include regulatory requirements.
```

**What to Extract:**
- Development timelines (e.g., "ARCore integration: 2-3 weeks", "App Store review: 1-2 weeks")
- Milestone breakdowns (e.g., "Month 1: Backend + 10 POIs", "Month 2: AR integration", "Month 3: Beta launch")
- Regulatory requirements (e.g., "Privacy policy required", "PDPO compliance needed")

---

#### PROMPT 7: Open Source & Social Impact Research (For Social Responsibility)

**Give this prompt to your AI:**

```
I want to demonstrate social responsibility through open source contributions and ethical practices. 
Please research and provide:

1. **Open Source Impact Metrics:**
   - GitHub stars/forks benchmarks for educational AR projects
   - Open source license best practices (MIT, Apache, etc.)
   - Community engagement metrics (contributors, issues, PRs)

2. **Ethical Technology Practices:**
   - Privacy-first design principles (GDPR, PDPO compliance)
   - Ethical AI/ML practices (bias mitigation, transparency)
   - Accessibility standards (WCAG 2.1 AA compliance)
   - Content safety best practices (moderation, fact-checking)

3. **Social Impact Measurement:**
   - How to measure educational impact (engagement rates, learning outcomes)
   - Community building metrics (users, active contributors)
   - Free tier impact (number of users, usage statistics)

**Sources to check:**
- GitHub open source project statistics
- WCAG accessibility guidelines
- GDPR/PDPO compliance requirements
- Educational technology impact studies

**Format:** Provide specific metrics, standards, and best practices. Include measurable outcomes.
```

**What to Extract:**
- Open source benchmarks (e.g., "Educational AR projects: 50-200 GitHub stars average")
- Ethical standards (e.g., "WCAG 2.1 AA compliance required", "PDPO: minimal data collection")
- Impact metrics (e.g., "Free tier: 500+ students target", "Open source: MIT License standard")

---

### Section 2.5: Team Information (30% Team Score)

This section needs:
- **Team structure** (roles, duties)
- **Complementary skills** (balanced team)

---

#### PROMPT 8: Team Structure Research (For Team Information)

**Give this prompt to your AI:**

```
I need to structure my team information effectively for a startup grant application. 
Please research and provide:

1. **Typical Early-Stage AR Startup Team Structures:**
   - Common roles (Founder/Technical Lead, Unity Developer, Backend Developer, etc.)
   - Typical team sizes (1-3 founders for early stage)
   - Role distribution (who does what)
   - Complementary skills needed (technical + business + design)

2. **Team Allocation Best Practices:**
   - How to show clear role separation
   - How to demonstrate complementary skills
   - How to show realistic team size (not overstaffed)

3. **Team Experience Benchmarks:**
   - Typical experience levels for each role
   - Common certifications/qualifications
   - Portfolio/project requirements

**Sources to check:**
- Startup accelerator program team requirements
- AR/VR job postings (role descriptions)
- Founder profiles in AR startups (public LinkedIn data)
- Team structure examples from similar grants

**Format:** Provide role templates, skill requirements, and team size recommendations.
```

**What to Extract:**
- Role templates (e.g., "Founder & Technical Lead: Backend + AR integration", "Unity Developer: AR Foundation + Quest 3")
- Team size norms (e.g., "Early stage: 1-3 founders", "Maximum 3 for boot camp")
- Skill requirements (e.g., "Unity XR Developer: ARCore, Quest 3, C#")

---

## Data Extraction Checklist

### For Section 2.4b (Project Description - 70% Impact):

- [ ] **Problem Statement Data:**
  - [ ] HK visitor numbers (annual)
  - [ ] Museum engagement rates (%)
  - [ ] Student field trip statistics
  - [ ] Pain point survey data
  - [ ] Market gap evidence

- [ ] **Target Market Data:**
  - [ ] Number of museums (exact count)
  - [ ] Number of schools (exact count)
  - [ ] Number of students (exact count)
  - [ ] Tourist demographics (age breakdown)
  - [ ] Market segment sizes

- [ ] **Innovation Data:**
  - [ ] AR performance benchmarks (latency, accuracy)
  - [ ] Technology release dates (Quest 3, ARCore)
  - [ ] Competitive comparisons (Niantic, Google Lens)
  - [ ] Performance metrics (p50, p90 latency)

- [ ] **Social Impact Data:**
  - [ ] Student numbers (exact count)
  - [ ] Engagement improvement rates (%)
  - [ ] Free access statistics
  - [ ] Measurable outcomes (targets)

### For Section 2.3 (Self-Introduction - 30% Impact):

- [ ] **Industry Benchmarks:**
  - [ ] Typical project timelines
  - [ ] Success metrics thresholds
  - [ ] GitHub activity benchmarks
  - [ ] Experience level standards

### For Section 2.9 (Supplementary Information):

- [ ] **3-Month Timeline:**
  - [ ] Development time estimates
  - [ ] Regulatory requirements
  - [ ] Milestone breakdowns

- [ ] **Open Source:**
  - [ ] GitHub benchmarks
  - [ ] License best practices
  - [ ] Community metrics

### For Section 2.5 (Team Information):

- [ ] **Team Structure:**
  - [ ] Role templates
  - [ ] Team size norms
  - [ ] Skill requirements

---

## Prompt Templates

### Template 1: Market Research Prompt

```
I'm researching market data for my [PROJECT TYPE] startup application. 
Please find and extract:

1. [SPECIFIC DATA POINT 1] - [SOURCE HINT]
2. [SPECIFIC DATA POINT 2] - [SOURCE HINT]
3. [SPECIFIC DATA POINT 3] - [SOURCE HINT]

Sources to prioritize:
- [SOURCE 1]
- [SOURCE 2]
- [SOURCE 3]

Format: Provide specific numbers, percentages, and dates. Include source URLs.
```

### Template 2: Technology Benchmark Prompt

```
I need technology benchmarks for [TECHNOLOGY NAME] to demonstrate innovation. 
Please research:

1. Performance metrics: [METRIC 1], [METRIC 2]
2. Competitive comparisons: [COMPETITOR 1] vs [COMPETITOR 2]
3. Industry standards: [STANDARD 1], [STANDARD 2]

Sources to check:
- [TECH DOCUMENTATION]
- [INDUSTRY REPORTS]
- [ACADEMIC PAPERS]

Format: Provide specific numbers, dates, and technical specifications.
```

### Template 3: Social Impact Research Prompt

```
I need social impact data for [PROJECT DOMAIN] in [LOCATION]. 
Please find:

1. Target population: [GROUP 1], [GROUP 2]
2. Baseline metrics: [METRIC 1], [METRIC 2]
3. Impact measurements: [MEASUREMENT 1], [MEASUREMENT 2]

Sources to check:
- [GOVERNMENT STATISTICS]
- [ACADEMIC STUDIES]
- [NGO REPORTS]

Format: Provide specific numbers and measurable outcomes.
```

---

## How to Use These Prompts

### Step 1: Prioritize Research
Start with **Section 2.4b** (70% impact) - this is most critical.

### Step 2: Run Prompts Sequentially
1. Run PROMPT 1 (Market Problem) → Extract problem data
2. Run PROMPT 2 (Target Market) → Extract market data
3. Run PROMPT 3 (Innovation) → Extract tech benchmarks
4. Run PROMPT 4 (Social Impact) → Extract impact data

### Step 3: Compile Results
- Create a spreadsheet with all extracted data
- Include source URLs for verification
- Note dates (ensure data is recent, 2023-2025)

### Step 4: Write Application Sections
- Use extracted data to write Section 2.4b (150 words)
- Use benchmarks to write Section 2.3 (150 words EN, 100 words CH)
- Use timeline data for Section 2.9

### Step 5: Verify Sources
- Check all URLs work
- Verify numbers are accurate
- Ensure dates are current

---

## Example: Complete Research Workflow

### Day 1: Market & Problem Research
```
Run PROMPT 1 → Get problem statistics
Run PROMPT 2 → Get market size data
Compile into problem statement (20 words)
```

### Day 2: Innovation Research
```
Run PROMPT 3 → Get tech benchmarks
Run PROMPT 4 → Get social impact data
Compile into innovation highlights (40 words)
```

### Day 3: Team & Timeline Research
```
Run PROMPT 5 → Get industry benchmarks
Run PROMPT 6 → Get timeline data
Compile into self-introduction (150 words)
```

### Day 4: Write & Refine
```
Write Section 2.4b using all research data
Write Section 2.3 using benchmarks
Write Section 2.9 with timeline
Verify word counts
```

---

## Important Notes

### Data Quality:
- ✅ Use **specific numbers** (not "many" or "some")
- ✅ Include **dates** (ensure data is recent)
- ✅ Provide **source URLs** (for verification)
- ✅ Use **percentages** (more impactful than raw numbers)

### Data Verification:
- ✅ Cross-check numbers from multiple sources
- ✅ Verify URLs are accessible
- ✅ Ensure dates are current (2023-2025)
- ✅ Check if statistics are Hong Kong-specific (not global)

### Word Count Strategy:
- **Section 2.4b:** 150 words total
  - Problem: ~20 words
  - Solution: ~40 words
  - Innovation: ~40 words
  - Market: ~20 words
  - Social Impact: ~30 words

- **Section 2.3:** 150 words EN, 100 words CH
  - Qualifications: ~30 words
  - Experience: ~40 words
  - Execution: ~40 words
  - Communication/Teamwork: ~40 words

---

## Related Documents

- `Docs/CCMF_CROSS_BOUNDARY_SCORING_MAPPING.md` - Scoring criteria priorities
- `Docs/CCMF_CROSS_BOUNDARY_OFFICIAL_REQUIREMENTS.md` - Application form requirements
- `Docs/CCMF_Answers_EN.md` - Application answers template
- `Docs/TEAM.md` - Team information template

---

**Document Status:** Ready for Use  
**Last Updated:** [Current Date]  
**Next Steps:** Run prompts with web-scraping AI, compile data, write application sections

---

**END OF DOCUMENT**

