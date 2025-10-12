# Field Notes

## Overview

This document tracks outdoor testing sessions for the Sightline MVP. Use the template below for each test session.

---

## Test Session Template

### Session [Number]: [Date YYYY-MM-DD]

**Location:** [POI name, e.g., "Clock Tower, Tsim Sha Tsui"]  
**Coordinates:** [lat, lng]  
**Device:** [Phone model + OS version, e.g., "Pixel 8, Android 14"]  
**Conditions:** [Weather, time of day, e.g., "Sunny, 3:00 PM, 28°C"]  
**Tester:** [Name/initials]  

#### Test Results

- **Anchor Stability:** [seconds tracked without drift, e.g., "12s"]
- **Latency (Ask → Overlay):** [milliseconds, e.g., "1,850ms"]
- **GPS Accuracy:** [meters reported by ARCore, e.g., "2.3m"]
- **Tracking Quality:** [ARCore reported quality: "Excellent" / "Good" / "Poor"]
- **User Comprehension:** [Did tester understand the POI info? Yes/No + notes]

#### Usability Observations

- [Note any UX issues, e.g., "Card text too small in sunlight"]
- [Note any bugs, e.g., "Leader line disappeared after 5s"]
- [Note any positive feedback, e.g., "Loved the draggable card"]

#### Technical Issues

- [ ] Anchor drift (describe)
- [ ] API timeout (describe)
- [ ] App crash (describe)
- [ ] Other: [describe]

#### Photos/Videos

- [Link to demo video or screenshot]
- [Link to device screen recording]

#### Next Steps

- [ ] [Action item 1, e.g., "Increase card font size by 2pt"]
- [ ] [Action item 2, e.g., "Add retry logic for API timeout"]

---

## Session 1: [Example] 2024-10-12

**Location:** Clock Tower, Tsim Sha Tsui  
**Coordinates:** 22.2946, 114.1699  
**Device:** Pixel 8, Android 14  
**Conditions:** Sunny, 3:00 PM, 28°C  
**Tester:** Larry  

#### Test Results

- **Anchor Stability:** 15s (excellent)
- **Latency:** 1,750ms (good)
- **GPS Accuracy:** 2.1m (ARCore: "Excellent")
- **Tracking Quality:** Excellent
- **User Comprehension:** Yes – recalled "Clock Tower, 1915, KCR terminus"

#### Usability Observations

- Card text readable in direct sunlight (high contrast works!)
- Leader line stayed connected during 10m walk
- Draggable card felt natural; user moved it to avoid blocking view

#### Technical Issues

- None observed in this session

#### Photos/Videos

- demo-clocktower-20241012.mp4 (stored locally)

#### Next Steps

- [x] Validate that this template works
- [ ] Test at Star Ferry location next

---

## Session 2: [Placeholder]

_Use the template above for your next test session._

---

## Summary Stats (Updated After Each Session)

| Metric | Target | Current (Avg of N sessions) |
|--------|--------|----------------------------|
| Anchor Stability | ≥10s | [X.Xs] |
| Ask→Overlay Latency | ≤2.0s (p50) | [X,XXXms] |
| GPS Accuracy | ≤5m | [X.Xm] |
| User Comprehension | ≥90% | [X%] |
| Crash Rate | <5% | [X%] |

**Total Sessions:** [N]  
**Successful Sessions:** [N - crashes]  
**Success Rate:** [%]

---

## Lessons Learned

### What Worked Well

- [Lesson 1, e.g., "Testing in open plazas first reduced debugging time"]
- [Lesson 2, e.g., "High-contrast cards are essential for outdoor readability"]

### What Didn't Work

- [Lesson 1, e.g., "Narrow streets caused anchor drift; need fallback"]
- [Lesson 2, e.g., "API latency spikes at 5 PM (network congestion?)"]

### Improvements for Next Sprint

- [Improvement 1, e.g., "Add manual placement fallback"]
- [Improvement 2, e.g., "Cache top 10 POIs on-device"]

---

**Instructions:**
1. Copy the "Test Session Template" for each new outdoor test
2. Fill in all fields immediately after testing (while memory is fresh)
3. Update "Summary Stats" table after each session
4. Review "Lessons Learned" weekly; add to backlog as needed

