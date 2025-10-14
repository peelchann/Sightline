# Trends & Devices Brief

**Last updated:** October 2025

## What's Real in the Next 12-18 Months

### Consumer AR Glasses (2025-2026)

**Ray-Ban Meta Gen 2** (Expected Q2 2025)
- Current Gen 1 (2023): Camera + audio, no display
- Rumored Gen 2: Micro-LED display for notifications, AR wayfinding
- **Implication:** If Meta adds display, Sightline's overlay architecture ports directly

**Meta Orion** (Dev preview 2025, consumer 2027)
- Full AR display with neural wristband input
- Outdoor-capable with depth sensors
- **Implication:** Validates glasses-first vision; Sightline positions as early content provider

**Snap Spectacles 5** (Dev kit 2024, consumer TBD)
- AR display with SLAM tracking, indoor-focused
- $99/mo dev access, no consumer timeline
- **Implication:** Unlikely to ship consumer glasses before 2027; not a near-term threat

### ARCore/ARKit Maturity (Now)

**ARCore Geospatial API** (Launched 2022)
- Sub-meter outdoor anchoring in 100+ cities (including Hong Kong)
- Depth API for occlusion on supported Android devices
- **Implication:** Production-ready for Sightline MVP; no R&D risk

**ARKit GeoAnchors** (iOS 14+, 2020)
- 5-10m accuracy outdoor anchoring
- LiDAR on iPhone Pro for better depth
- **Implication:** Enables cross-platform (iOS + Android) with minor adjustments

### Voice/LLM Integration (Now)

**OpenAI Whisper + GPT-4o**
- Real-time voice-to-text (<500ms) + natural language understanding
- **Implication:** Enables hands-free "What is this?" queries for glasses

**Google Gemini Live** (2024)
- Multimodal (vision + voice) with <1s latency
- **Implication:** Potential to augment POI answers with live scene understanding

### Devices Timeline

| Device | Display | Outdoor AR | Geo-Anchoring | Availability | Sightline Fit |
|--------|---------|-----------|---------------|--------------|---------------|
| **iPhone 15/16 Pro** | Phone | ✅ ARKit | ✅ GeoAnchors | Now | ✅ Primary testbed |
| **Pixel 8/9** | Phone | ✅ ARCore | ✅ Geospatial | Now | ✅ Primary testbed |
| **Meta Quest 3** | Headset | ❌ Indoor only | ❌ No GPS | Now | 🔶 Indoor POIs later |
| **Ray-Ban Meta Gen 1** | Glasses | ❌ No display | ❌ No AR | Now | 🔶 Voice-only mode |
| **Ray-Ban Meta Gen 2** | Glasses | 🔶 Rumored | 🔶 Unknown | Q2 2025? | ✅ Target platform |
| **Meta Orion** | Glasses | ✅ Full AR | ✅ Expected | 2027 | ✅ Target platform |

## Implications for Sightline

1. **Phone-first is right strategy** — Glasses won't be consumer-ready until 2026-2027; phones de-risk and build user base now.
2. **ARCore/ARKit are mature** — No technical risk for outdoor anchoring; focus on UX and content.
3. **Glasses migration path exists** — Unity + ARFoundation architecture supports future port to Ray-Ban Meta SDK (when available).
4. **Voice is table stakes** — By 2026, users will expect hands-free interaction; build this into MVP.
5. **Content is moat** — Hardware will commoditize; curated POI database + local partnerships create defensibility.

## Risks to Monitor

- **Meta delays Gen 2 display** — If Ray-Ban Meta stays camera-only through 2026, glasses timeline slips. **Mitigation:** Focus on phone MVP; glasses are upside, not dependency.
- **Apple Vision Pro expands outdoors** — If visionOS 3 (WWDC 2025) adds geo-anchoring, Apple owns premium AR. **Mitigation:** Target Android-first; Apple's headset ($3,499) is too expensive for tourism use case.
- **Regulations on outdoor AR** — If HK/EU restrict persistent AR overlays in public spaces. **Mitigation:** Partner with heritage sites for sanctioned deployments; avoid rogue anchoring.

## Sources

- Meta Reality Labs: [Connect 2024 Keynote](https://about.meta.com/realitylabs/)
- ARCore Geospatial API: [Google I/O 2024 Updates](https://developers.google.com/ar)
- Snap Spectacles: [Dev Kit Announcement Sept 2024](https://www.spectacles.com)
- Ray-Ban Meta Gen 2 rumors: [The Verge, Oct 2024](https://www.theverge.com/meta-smart-glasses)



