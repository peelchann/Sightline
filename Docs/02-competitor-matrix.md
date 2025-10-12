# Competitor Matrix

**Last updated:** October 2025

## Overview

Comparison of AR/visual search platforms and their capabilities vs. Sightline. Focus on outdoor anchoring, occlusion, onboarding friction, and glasses-readiness.

## Matrix

| Vendor | Device Focus | Core Promise | Anchoring | Occlusion | Onboarding TTFV | Pricing | USP vs. Sightline | Links |
|--------|-------------|--------------|-----------|-----------|-----------------|---------|-------------------|-------|
| **Google Lens** | Phone (iOS/Android) | Visual search → web results | None (2D image match) | No | <5s (built-in) | Free | No persistent AR anchoring; returns web links, not overlays | [lens.google.com](https://lens.google.com) |
| **Niantic Lightship VPS** | Phone (AR apps) | Geo + visual positioning | VPS + GPS (±1m) | Yes (depth mesh) | 10-20s (app download + scan) | Free tier: 1K MAU; $99/mo for 10K MAU | Requires prior 3D mapping; limited POI coverage outside major cities | [lightship.dev/pricing](https://lightship.dev/pricing) |
| **8th Wall** | Phone (WebAR) | No-app AR in browser | Image/world tracking | Limited (SLAM) | <5s (web-based) | $99-499/mo | No geospatial anchoring; indoor/close-range only | [8thwall.com/pricing](https://8thwall.com/pricing) |
| **Vuforia Area Targets** | Phone/tablet (Unity) | Precise indoor positioning | VPS (±5cm indoors) | No | 15-30s (download + scan) | $99-499/mo; enterprise custom | Indoor-only; requires pre-scanned areas; outdoor fails | [developer.vuforia.com/pricing](https://developer.vuforia.com/pricing) |
| **ARCore Geospatial API** | Android (ARCore devices) | Outdoor geo-anchoring | GPS + Visual (±1-5m) | Yes (depth API) | 10-20s (app install) | Free (Google Cloud usage) | Platform SDK, not end-user product; no content layer | [developers.google.com/ar/develop/geospatial](https://developers.google.com/ar/develop/geospatial) |
| **ARKit GeoAnchors** | iOS 14+ (iPhone/iPad) | Outdoor geo-anchoring | GPS + Visual (±5-10m) | Yes (LiDAR on Pro) | 10-20s (app install) | Free (Apple dev) | Platform SDK, not product; iOS-only; limited to recent devices | [developer.apple.com/augmented-reality/arkit/](https://developer.apple.com/augmented-reality/arkit/) |
| **Meta Quest (Passthrough MR)** | Quest 3/Pro | Indoor spatial computing | Scene anchors (local) | Yes (depth, hand) | <10s (built-in) | $499-999 hardware; free SDK | Indoor-only; no GPS; no geo-anchoring; glasses factor in 2027+ | [developer.oculus.com](https://developer.oculus.com) |
| **Ray-Ban Meta (2023)** | Smart glasses | Capture + AI assistant | None (camera only) | No | <5s (built-in) | $299 hardware | No AR display; audio/camera only; limited to Meta AI voice queries | [ray-ban.com/meta-smart-glasses](https://www.ray-ban.com/usa/ray-ban-meta-smart-glasses) |
| **Snap Spectacles (2024)** | AR glasses (dev kit) | AR gaming/social | SLAM (local) | Yes (depth) | <10s | $99/mo (dev access) | Dev-only; no consumer release; no geo-anchoring; indoor focus | [spectacles.com](https://www.spectacles.com) |

## Sightline's Differentiation

| Dimension | Competitors | Sightline |
|-----------|-------------|-----------|
| **Anchoring** | Google Lens: None; ARCore/ARKit: SDK-only; Niantic: Limited POI coverage | Geo-anchored overlays (ARCore/ARKit) with fallback to visual SLAM |
| **Occlusion** | Most lack outdoor depth; Quest indoor-only | Depth API (ARCore/ARKit) + environment detection |
| **Onboarding** | App download (10-20s) or VPS scan (10-30s) | WebAR demo (<5s); native app for full AR |
| **Content** | Google Lens: Web links; Others: No content layer | Curated POI database with conversational answers |
| **Outdoor UX** | Google Lens: No AR; ARCore/ARKit: Dev tools only | Designed for sunlight, long-distance landmarks, leader lines |
| **Glasses-ready** | Ray-Ban Meta: No display; Snap: Dev-only; Quest: Indoor | Architecture supports future Ray-Ban/Quest MR integration |
| **Latency** | Google Lens: 2-5s; VPS: 5-10s (scan) | Target <2s (p50) for ask→overlay |

## Key Insights

1. **No direct competitor** combines outdoor geo-anchoring + conversational interface + content layer in a consumer product.
2. **ARCore/ARKit** are platform SDKs; Sightline builds the end-user experience on top.
3. **Google Lens** is closest in UX but lacks persistent AR anchoring (2D image search only).
4. **Niantic Lightship** targets game devs; expensive for tourism/education use cases.
5. **Glasses landscape** is nascent (2025-2027); Sightline's phone-first approach de-risks while staying glasses-ready.

## Competitive Risks

1. **Google ships "Lens AR"** — If Google adds persistent anchoring to Lens, they win on distribution. **Mitigation:** Focus on B2B (tour operators, heritage sites) where curation > scale.
2. **Apple Vision Pro expands outdoors** — If Apple enables geo-anchoring in visionOS 3+, they own premium market. **Mitigation:** Target Android-first (ARCore has wider outdoor support) + cross-platform Unity.
3. **Niantic pivots to tourism** — If Niantic shifts from gaming to cultural heritage, they have VPS tech. **Mitigation:** Speed + local HK partnerships; we ship MVP in 6 months, not 18.

## Sources & Update Log

- ARCore Geospatial API docs: [Updated March 2024](https://developers.google.com/ar/develop/geospatial)
- Niantic Lightship pricing: [Updated September 2024](https://lightship.dev/pricing)
- 8th Wall pricing: [Current as of October 2024](https://8thwall.com/pricing)
- Ray-Ban Meta specs: [Product launch September 2023](https://www.ray-ban.com/usa/ray-ban-meta-smart-glasses)
- Snap Spectacles: [Dev kit announced September 2024](https://www.spectacles.com)

