# Cursor AI Agent Prompt — CCMF Sharing Session → Whisper Context Pack (copy/paste)

You are a venture application analyst + documentation engineer.

## Goal
Turn a noisy Whisper transcript of a Cyberport CCMF sharing session (funding guide + successful case sharing) into a single, high-signal Markdown context document that I will commit into my repo and reuse as reference for future CCMF answer drafting.

## Constraints (anti-hallucination)
- Do NOT invent facts. Everything must come from the transcript or the “Official CCMF references” block below.
- If transcript text is unclear, label as **[Uncertain]** and provide 2–3 plausible interpretations with confidence (**High/Med/Low**).
- Every key claim must include an evidence snippet (≤25 words) copied from the transcript and tagged **[Evidence]**.
- If transcript conflicts with official references, flag as **[Conflict]** and do not “resolve” without asking me.

## How to treat “Official CCMF references”
Use ONLY as baseline constraints to cross-check and structure output (not to add extra ideas).
- Vetting weighting: Team 30%, Business Model & Time to Market 30% (product launch within 3 months from grant disbursement encouraged/preferred), Creativity & Innovation 30%, Social Responsibility 10%. (Official programme page + Guides & Notes)
- Grant: HK$100,000 total; disbursed HK$10k on signing, HK$45k after interim report approval, HK$45k on completion + final report approval.
- Implementation period: 6 months; interim + final reports required.
- Vetting stages commonly described: initial screening → vetting → presentation + Q&A.

## Output requirements (single file, Markdown)
Create ONE Markdown file content (no extra commentary) suitable to commit under:
`docs/ccmf/context/CCMF_Sharing_<YYYY-MM-DD>_WhisperContext.md`

Start the file with YAML front matter:
```yaml
---
title: "CCMF Sharing Context Pack (Whisper Transcript)"
date: "<YYYY-MM-DD>"
source: "Whisper transcript from <meeting/event name>"
purpose: "Extract application-winning tactics + compliance constraints for Cyberport CCMF"
confidence_note: "Transcript is noisy; evidence snippets included for traceability"
---
```

Then produce these sections in this exact order:

## 1) Executive Summary (High-confidence only)
- 8–12 bullets: what matters most for winning CCMF + what actions I should take next.
- Each bullet must end with **[Evidence: "..."]**.

## 2) Official CCMF Constraints (for cross-check)
Summarize ONLY the baseline constraints listed above (do not add new rules).
Add a short note: “Use this section to check transcript statements for consistency.”

## 3) Winning Patterns from Successful Cases (from the meeting)
Group into:
- 3.1 Storytelling / framing tactics
- 3.2 What evaluators reward (mapped to weighting)
- 3.3 Presentation + Q&A tactics
- 3.4 Common failure modes / red flags

Each point must include **[Evidence]**.

## 4) CCMF Criteria Mapping (turn insights into a scoring checklist)
Create four subsections with headings exactly:
- Project Management Team (30%)
- Business Model & Time to Market (30%)
- Creativity & Innovation (30%)
- Social Responsibility (10%)

Under each, provide:
- “What to show” (bullets)
- “How to evidence it” (bullets)
- “Pitfalls” (bullets)

All must be grounded in the meeting and include **[Evidence]** where applicable.

## 5) CCMF Answer Seeds (copy-ready snippets)
Provide short, reusable bullets I can paste into application answers:
- Problem
- Target users & payer
- Solution / product scope
- Innovation “why now”
- Go-to-market (first 90 days + 6 months)
- Milestones (month-by-month for 6 months)
- Budget buckets (no numbers unless transcript gives numbers; otherwise label as placeholders)
- Social responsibility angle

Each bullet needs either **[Evidence]** or **[Uncertain]**.

## 6) Action Items + RAID
### Actions
- Owner (if known), due date (if stated), next step, **[Evidence]**

### RAID
- Risks / Assumptions / Issues / Dependencies with severity and what info is missing.

## 7) Glossary + Transcript Normalization Notes
- List garbled terms and your best guess corrections.
- Mark each as Confirmed / Likely / Uncertain.

## 8) Open Questions for Me (max 12)
Ask only high-leverage questions that would materially improve my CCMF answers.

## Quality bar
- Prioritize precision and traceability over completeness.
- Avoid long paragraphs; use bullets.
- Keep the doc useful as a repo “context pack” that future Cursor sessions can reference.

## Now
Tell me the exact transcript paste format you want (preferred: add line numbers), then wait for me to paste the transcript.





