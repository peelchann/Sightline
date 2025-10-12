# 60-Second Pitch

**Last updated:** October 2025

---

## The Script

**[0-10s] Hook + Problem**

> "You're standing in front of Hong Kong's Clock Tower. You want to know: *What is this?* So you unlock your phone, type 'clock tower hong kong,' scroll through search results, and 30 seconds later, you're *still* reading a Wikipedia page—while missing the actual view."

**[10-25s] Solution**

> "Sightline changes that. Point your phone. Ask 'What is this?' And in **under two seconds**, an AR overlay appears—*anchored to the Clock Tower*—showing you: 'Built 1915. Former railway terminus. One of Hong Kong's oldest landmarks.' The card stays attached, even as you walk closer or change angles. It's like having a local expert **inside your reality**."

**[25-40s] Market + Why Now**

> "Hong Kong welcomed 34 million visitors in 2023—and they're going self-guided. But Google Lens doesn't anchor information to the world; it just returns web links. Museum audio guides only work indoors. We're building for **outdoor heritage**—and we're building for **glasses**. Meta's Ray-Ban smart glasses are coming with displays in 2025. Sightline's architecture is ready to port when they ship."

**[40-50s] Traction + Ask**

> "We've built a working MVP in 6 months. We've tested it at three Hong Kong landmarks—Clock Tower, Star Ferry, Avenue of Stars—with 50 users. 90% comprehension. Sub-2-second latency. We have letters of intent from two heritage sites. We're applying to Cyberport's Creative Micro Fund for HKD 100K to polish the demo, expand to 20 POIs, and prove the model."

**[50-60s] Vision**

> "This isn't just tourism. It's education—field trips come alive. It's urban exploration—discover hidden stories in your neighborhood. And when Meta ships glasses in 2027, we're already there. **On-object answers**. No searching. No scrolling. Just: *see, ask, learn.* That's Sightline."

---

## Alternative 60s Pitch (Technical Audience)

**[0-10s] Problem**

> "Outdoor AR anchoring is hard. GPS alone? ±10 meters—useless for precise overlays. Visual SLAM? Great indoors, drifts outdoors. Google's ARCore Geospatial API solves this: sub-meter accuracy in 100+ cities using Visual Positioning. But no one's built the *content layer* on top."

**[10-25s] Solution**

> "Sightline is that layer. Unity + ARCore Geospatial for geo-anchoring. Node API with haversine POI selection. Ask 'What is this?' → fetch curated answer in <2s → render AR card with depth occlusion. The card *stays* attached to the landmark—10+ seconds of stable tracking, even at 50 meters away."

**[25-40s] Stack + Differentiation**

> "Tech stack: Unity 2022 LTS, AR Foundation 5.1, ARCore Geospatial (Android), ARKit GeoAnchors (iOS fallback). Backend: Node/Express/TypeScript. Hosted on AWS. We're not inventing new AR tech—we're shipping on *proven* APIs. The innovation is UX: leader lines, draggable cards, outdoor-optimized contrast, hands-free-ready for glasses."

**[40-50s] Roadmap**

> "MVP: 3 Hong Kong POIs, WebDemo + Unity AR, 50 user tests. Month 7-12: Expand to 20 POIs, voice input (Whisper), iOS parity. Month 13-24: B2B white-label for museums, Ray-Ban Meta Gen 2 integration (if they ship displays), regional expansion to Macau and Guangzhou."

**[50-60s] Why We Win**

> "Google Lens has distribution but no anchoring. Niantic Lightship has VPS but no content. ARCore/ARKit are SDKs, not products. We're the **first** to combine geo-anchoring + natural language + curated heritage content in a consumer app. And we're glasses-ready when Meta ships. Let's build the future of on-object answers."

---

## Pitch Variations by Audience

### For Investors (VCs, Angels)

**Emphasize:**
- Market size (34M HK tourists → 100M+ APAC tourists)
- Revenue model (freemium $2.99/mo; B2B $500-2000/mo; API $0.10/query)
- Exit potential (acquisition by Meta, Google, Snap as content platform)

**Avoid:**
- Deep technical jargon (ARCore vs ARKit details)
- Government funding specifics (Cyberport is validation, not the goal)

### For Cyberport CCMF Panel

**Emphasize:**
- Social value (free tier, education, heritage preservation)
- Technical feasibility (ARCore is production-ready; no R&D risk)
- Execution credibility (6-month milestones; pilot agreements)

**Avoid:**
- Heavy profit focus (CCMF prioritizes social impact)
- Vague timelines ("We'll build an AR app" → specify weeks)

### For Heritage Site Managers

**Emphasize:**
- Visitor engagement (avg 3-5 min dwell time vs. 30s at physical plaques)
- Analytics (heatmaps of popular spots; user feedback)
- Zero physical installation (no construction, no permits)

**Avoid:**
- Tech buzzwords (they don't care about ARCore vs ARKit)
- Revenue sharing (offer free pilot; upsell later)

### For Media / Press

**Emphasize:**
- Local angle (HK heritage preservation + smart city vision)
- Glasses future (Ray-Ban Meta tie-in; aspirational)
- Demo video (show, don't tell; Clock Tower clip is the story)

**Avoid:**
- Funding amounts (HKD 100K sounds small; focus on impact)
- Competitor bashing (stay positive; "we're adding to the ecosystem")

---

## Pitch Delivery Tips

1. **Start with a story, not stats** — "You're at the Clock Tower..." vs. "The AR market is $30B..."
2. **Use demo video** — 10 seconds of video > 60 seconds of explaining AR
3. **End with a clear ask** — "We're raising HKD 100K" or "We need 2 pilot sites" (not "Let me know if you're interested")
4. **Practice to 55 seconds** — Leaves 5s buffer for pauses, emphasis
5. **Memorize hook + ending** — Middle can flex; open/close must be crisp

---

## Post-Pitch Q&A Prep

### Expected Questions

**Q1: "How do you compete with Google Lens?"**
> "Google Lens is visual search—it returns web links. We're AR anchoring—the answer stays attached to the object. When Google adds anchoring (if ever), we pivot to B2B or become a white-label platform. Our moat is curated content + local partnerships."

**Q2: "Why won't tourists just use ChatGPT + camera?"**
> "Great question. ChatGPT requires you to take a photo, wait 5-10s, then read a text response. We're sub-2s *and* the answer is anchored in AR—so you're still looking at the landmark, not your phone screen. It's hands-free-ready for glasses."

**Q3: "What if ARCore accuracy sucks outdoors?"**
> "We've tested in 5 locations. Open plazas: ±1-2m (excellent). Narrow streets: ±5-10m (acceptable for tourism; we increase match radius). Indoors: fallback to manual placement. We're not betting on perfect tech—we're designing for real-world conditions."

**Q4: "How do you make money?"**
> "MVP is free to prove the concept. Post-CCMF: freemium (10 queries/day free; unlimited $2.99/mo). B2B for tour operators ($500-2K/mo). Sponsored POIs (restaurants, shops: $100-500/mo). API access for devs ($0.10/query). Target: HKD 50K MRR by Month 18."

**Q5: "Why glasses? They're years away."**
> "Ray-Ban Meta Gen 1 (2023) proved consumers want wearable AR. Gen 2 (rumored 2025) may add a display. Meta Orion (2027) is full AR. We're building the *content layer* now on phones—so when glasses ship, we're the first app people want. It's a timing play."

---

## Pitch Deck (Optional Companion)

If delivering 5-10 min pitch (vs. 60s), use these slides:

1. **Hook** — Photo of tourist at Clock Tower, typing on phone
2. **Problem** — "Finding info is slow, disconnected, and awkward"
3. **Solution** — Demo video (15s clip)
4. **How It Works** — 3-step diagram (see → ask → overlay)
5. **Market** — HK tourism stats; self-guided trend
6. **Traction** — 50 user tests, 2 pilot LOIs, GitHub stars (if open-source)
7. **Tech Stack** — ARCore/ARKit + Node API (no black boxes)
8. **Roadmap** — 6-month MVP → 12-month scale → 24-month glasses
9. **Team** — Founder bio + advisors
10. **Ask** — "HKD 100K for CCMF; HKD 500K for CIP in Month 7"

**Design Tips:**
- Use actual demo screenshots (not stock photos)
- Minimal text (10 words/slide max)
- Bold sans-serif font (Helvetica, Inter, Roboto)
- HK skyline motif (local pride)

---

**End of Pitch Document**

