---
title: "Context Pack — Ivan Consultation (Product Direction + CCMF Relevance)"
date: "[Unspecified in source]"
source: "User-provided Cantonese discussion notes (Ivan consultation). Transcript not embedded in this file."
purpose: "Reusable high-signal context for continuing CCMF application work (problem framing, MVP scope, pilot/KPIs, business model)."
evidence_policy: "Do not treat any statement as a verified fact unless it is explicitly confirmed elsewhere with an artifact (email/LOI/demo/CV/link). When citing externally, re-check and label uncertain items."
---

> **Important:** This file is saved exactly as a reusable context pack. It reflects **stakeholder input and design direction**, not confirmed market facts. Where the original notes imply inferences, treat them as hypotheses unless you have evidence.

---

# Context Pack — Ivan Consultation (Product Direction + CCMF Relevance)

## 1) Core Insight: Product Must Map to Learning Outcomes and a Clear “User Need”

Ivan’s central framing is that education solutions must prove they improve at least one of two outcomes:

1. **Increase learning interest / engagement** (引起學習興趣)
2. **Improve exam results / measurable learning performance** (令到考試好咗)

He believes both are possible, but **(1) engagement uplift is the stronger first win**, because many students disengage when the teaching style does not match their preferences. This supports a strong CCMF narrative: *clear problem definition → solution benefit → measurable pilot metrics*.

**CCMF relevance:**

* Tightens “Problem & Pain Point” and “Expected Benefits/Impact” sections.
* Enables KPI design for pilot: engagement proxies + pre/post learning checks.

---

## 2) Market Signal: “AI in Education” Demand is Emerging and Visible

Ivan notes he has already observed **market evidence**: posts/openings where people are hired to teach or support AI use for students (e.g., hourly-paid tutoring / roles). The key point is not the exact job detail, but that:

* **There is observable demand** for AI-enabled learning support.
* Education is “starting to have” these postings, indicating early-stage market pull.

**CCMF relevance:**

* Helps strengthen “Market Validation” (even if light) and “Why Now” rationale.
* Suggests you can cite “market signals” in a cautious way: *early demand indicators exist; pilot will validate willingness to adopt/pay.*

---

## 3) Product Differentiation Direction: “Personalised Learning Format” Engine (Not Just Content)

Ivan repeatedly returns to a differentiation hypothesis:

> The product should adapt the same curriculum content into **different formats** that match different learners’ preferences.

He gives examples of format personalization:

* **Visual-first learners**: information re-expressed as images/comics/diagrams.
* **Text-first learners**: structured text explanations, summaries.
* **Audio learners**: narration/voice style (professional vs casual).
* Potentially animation or more abstract representations.

Key design concept: **same knowledge base**, different expression forms.

**CCMF relevance:**

* Strengthens “Innovation & Uniqueness” as *format-personalisation engine*, not just “AI answers.”
* Provides a credible MVP boundary: start with 2–3 output modes (e.g., text + visual + voice), then expand.

---

## 4) SEN (Special Educational Needs) as a High-Leverage Pilot Segment

Ivan aligns with your teacher’s view: SEN is valuable because:

* **Requirements are well-researched and well-documented**, enabling clearer spec definition.
* Many SEN learners have strong constraints and strong preference patterns (e.g., only respond to certain stimuli or formats).
* This makes it easier to frame a rigorous product requirement and test value.

He suggests: identify learner “types” and their needs; define a small “framework” (e.g., 10-ish forms/templates) to guide generation so outputs are not random.

**CCMF relevance:**

* Strongly supports **impact narrative** and clear pilot design.
* Makes your MVP more defensible: constraints, guardrails, and measurable goals.
* Enhances “social value” and public benefit arguments (education inclusion).

---

## 5) “Controlled Creativity”: Guardrails + Flexibility Balance

Ivan highlights a critical product design tension:

* You must leave **some flexibility** for personalization and interest alignment.
* But the system must remain **controlled**, so outputs do not become weird, off-topic, or unsafe.

He suggests the core method:

* Start with a curated base knowledge/content set (curriculum-aligned).
* The AI selects and re-expresses from that set based on user preference.
* Use a system framework/templates so the output is **structured**, not random.

**CCMF relevance:**

* This becomes your “Content Safety & Quality” story: controlled source + templates + teacher approval workflow.
* Supports “risk control” section in execution plan.

---

## 6) MVP Strategy: Validate Fast; Start Simple If Needed

Ivan supports a lean MVP approach:

* Build something **simple enough to validate quickly** (“very fast to validate the concept and value”).
* The MVP goal is feedback: what is valuable, what needs changing, and whether the concept is “right.”

He specifically discusses a phased path:

* Mobile phone first (practical).
* Longer-term: glasses/smart glasses once market matures.

He also mentions a pragmatic fallback if full AR is too hard at first:

* Use **photo capture**: user takes a photo → AI answers immediately.
* AR can be introduced later after validation.

**CCMF relevance:**

* CCMF heavily rewards *probability of launch within 3 months* and feasibility.
* This gives you a credible “risk-managed MVP” plan: photo-based Q&A first, then AR overlays.

---

## 7) Product Vision: “Phone Now → Smart Glasses Later” (Trend Alignment)

Ivan frames Sightline as aligned with an industry trajectory:

* Today: phone-based experience
* Future: smart glasses with camera + AI overlays

He references that major players (e.g., Meta-like research direction) are pushing towards wearable AI experiences, and that being early on a platform can be strategic.

**CCMF relevance:**

* Enhances “Why now” and “future scalability” without overpromising MVP scope.
* Keep it as: *vision statement + roadmap*, not a CCMF deliverable.

---

## 8) Business Model Thoughts: SaaS Tiering for Schools

Ivan recalls Lucas-style pricing logic and agrees it should be addressed:

* A school can pay an annual/one-off platform fee (example structure mentioned: setup + CMS + training).
* Then tiered packages: Plus / Pro / Enterprise (more features/credits/content/modules).

He is not asserting final numbers; the valuable insight is:

* CCMF judges want to see you have a **coherent monetization path** even if early.
* Packaging should map to deliverables: onboarding/training, modules, credits, admin controls.

**CCMF relevance:**

* Strengthens Business Model section: simple, plausible pricing model.
* Supports “commercialization readiness.”

---

## 9) Engineering Feasibility Notes Mentioned in Conversation

Ivan discusses implementation at a high level with a “system prompt / agent” approach:

* A framework of “system prompts” becomes a key product asset (value driver).
* Suggests the architecture likely includes:
  * A server/service (could be API-based to avoid local model dependency complexity).
  * A web/admin side (CMS) to manage content and configurations.
  * Generation pipelines for different output modes (text/visual/audio).

He also notes an operational preference:

* Avoid local model dependency complexity; **use APIs** for flexibility and reliability (switch providers if needed).

**CCMF relevance:**

* Supports “feasibility” and “delivery confidence.”
* Strengthens “team capability” narrative (implementation + deployment).

---

## 10) Immediate Action Items Derived (High Priority for CCMF Submission)

These are concrete next steps implied by the discussion:

1. **Define target learner segments** (start with SEN + 1 mainstream segment) and articulate needs clearly.
2. Create a **Learning Preference Framework**:
   * 5–10 learner “types”
   * each has allowed output modes (text/visual/audio) and tone/style rules
3. Define a **controlled content approach**: curriculum-aligned knowledge base + template-driven generation.
4. MVP scope decision:
   * Option A: Photo → Q&A + personalised output modes (fastest validation)
   * Option B: Lightweight AR overlay (if feasible within 3 months)
5. Decide **pilot measurement plan**: engagement + learning improvement proxies; teacher feedback loop.
6. Prepare **pricing packaging** for schools: setup/training + tiered subscription.
7. Collect and organize **team proof artifacts**: CVs, demo video, past project portfolio references.

---

## 11) How This Strengthens Your CCMF Narrative (Judge-Facing Mapping)

This consultation provides direct materials for high-scoring CCMF sections:

* **Problem & Need**: mismatch between student learning preferences and current teaching formats; SEN needs are clear and underserved.
* **Innovation**: personalised “format transformation” engine (same curriculum knowledge, different expressions), controlled by framework templates and safety rules.
* **Feasibility**: MVP can launch quickly by starting with photo-based flow; AR overlays later; API approach reduces infra risk.
* **Impact**: engagement uplift + measurable learning outcomes; inclusion benefits for SEN.
* **Commercialisation**: school SaaS pricing + onboarding/training; tiering for scale.
* **Risk Control**: controlled content, guardrails, and template system; pilot fallback plan.



