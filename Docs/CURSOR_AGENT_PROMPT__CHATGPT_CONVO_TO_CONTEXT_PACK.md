# Cursor AI Agent Prompt — ChatGPT Conversation → Repo Context Pack (copy/paste)

You are a documentation engineer + product strategist.

## Goal
I will paste a very long ChatGPT conversation history (multiple threads). Your job is to extract a long, detailed, high-signal “Context Pack” as a single Markdown file that I will commit into my repo for future reference in Cursor prompts.

## Hard constraints (anti-hallucination + traceability)
- Do NOT invent any facts. Everything must come from the pasted chat history.
- If something is implied but not explicit, tag it as **[Inference]** and include your reasoning briefly.
- If something is unclear/ambiguous, tag it **[Uncertain]** and list 1–3 plausible interpretations with confidence (High/Med/Low).
- Every non-trivial claim must include a traceable reference in the form:  
  `[Source: <thread title or timestamp>, <speaker>, <message index>]` plus an evidence snippet ≤25 words.
- If you see contradictions across time, mark as **[Conflict]** and show both sources.

## Privacy & repo-safety
- Redact or generalize any sensitive or overly personal data that should not be committed to a repo:
  - Exact addresses, phone numbers, personal IDs, private emails, financial account numbers, etc.
- Keep project-relevant identity info only at a high level (e.g., “PM in AR/VR”; “based in HK/Taipei region”), unless the user explicitly stated it is intended for publication.
- If unsure whether something is safe to store, keep it out and list it under “Excluded Items (privacy)”.

## Output: ONE Markdown file (single file, no extra commentary)
Produce exactly one Markdown file content, suitable to commit at:  
`docs/context/ChatGPT_ContextPack_<YYYY-MM-DD>.md`

Start with YAML front matter:
```yaml
---
title: "ChatGPT Context Pack"
date: "<YYYY-MM-DD>"
scope: "Full conversation history provided by user"
purpose: "Long-term reference for Cursor prompts and repo context"
confidentiality: "Internal"
quality_notes: "Evidence-linked; uncertain items tagged"
---
```

Then include these sections in this exact order:

## 0) How to Use This Context Pack (for Cursor)
- 5–8 bullets explaining what this document contains and how to reference it in prompts.
- Include a short “Recommended Cursor snippet” (<=120 words) that I can paste into future Cursor prompts.

## 1) High-Level Identity & Working Style (repo-safe)
### 1.1 User profile (only stable, relevant facts)
### 1.2 Communication preferences
### 1.3 Tooling / platforms mentioned (e.g., Unity, Vuforia, Meta XR, etc.)
- Each bullet must include [Source] and evidence snippet.

## 2) Master Timeline (chronological)
Create a timeline table:  
Date/Period | Topic/Project | What happened | Why it matters | Source  
- Prefer exact dates if present; otherwise use approximate and mark [Uncertain].

## 3) Project Index (the “portfolio view”)
For each project discussed, create a standardized block:
### <Project Name>
- One-liner
- Current status (from latest message)
- Key stakeholders/actors (generic if needed)
- Deliverables / scope
- Tech stack / dependencies
- Business model assumptions (if any)
- Risks / unknowns
- Links to related sections in this doc
- Top 3 evidence snippets

## 4) Reusable Assets & Artifacts Mentioned
List things that can be reused later:
- Prompts (Sora prompts, pitch prompts, etc.)
- Deck structures / application templates
- Code snippets / commands
- Research requests and outputs
For each item: what it is, where it appears, and how to reuse it.

## 5) Domain Knowledge Accumulated (what “we” have established)
Extract stable conclusions and definitions that recur, e.g.:
- Product positioning language
- AR best-practice criteria (stability, anchoring, UX)
- Funding/application constraints (if in chat)
- Any standard operating procedures
Format as “Principle -> Implication -> Evidence”.

## 6) Decisions, Commitments, and Strategy Shifts
Create a table:  
Decision/Shift | When | Rationale | Impact | Source  
Include both personal and project decisions only if relevant to future work.

## 7) Open Threads and Next Questions
- Unresolved questions
- Pending tasks
- Things that were promised/needed but not completed
Prioritize by impact and urgency if implied.

## 8) Glossary (names, acronyms, internal terms)
- Term | Meaning | Confidence | Source  
If there are garbled/uncertain terms, list them with likely corrections.

## 9) Prompt Library (ready-to-reuse)
Create 6–10 reusable prompt templates that reference this doc, e.g.:
- “Draft CCMF answer using Context Pack”
- “Generate Sora storyboard using our AR UX principles”
- “Summarize latest project status for exec update”
Each template must include placeholders and a short instruction on when to use it.

## 10) Excluded Items (privacy / low confidence)
List anything you intentionally did not include and why.

## Quality bar
- Prefer bullet points and tables over long paragraphs.
- Do not compress too aggressively; this is meant to be long and detailed.
- However, remove repetitive chat noise; keep only what supports future work.
- Ensure the doc is navigable: add a Table of Contents after section 0.

## Before you start
1) Ask me to paste the chat history in chunks if needed.
2) Specify the exact paste format you prefer:
   - Each chunk starts with “CHUNK X/Y”
   - Preserve timestamps/titles if available
   - Keep speaker labels (“User:” / “Assistant:”)
Then proceed once I paste the content.

## Now
Tell me your preferred paste format and chunk size, then stop.


