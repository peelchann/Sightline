# Sightline WebAR Technical Architecture

**Version:** 1.0  
**Date:** November 2024  
**Purpose:** Technical specification for GPS-based WebAR implementation

---

## Table of Contents

1. [System Overview](#system-overview)
2. [How WebAR Actually Works](#how-webar-actually-works)
3. [Tech Stack Deep Dive](#tech-stack-deep-dive)
4. [Architecture Layers](#architecture-layers)
5. [Data Flow](#data-flow)
6. [Coordinate Systems](#coordinate-systems)
7. [Implementation Details](#implementation-details)
8. [File Structure](#file-structure)
9. [API Specification](#api-specification)
10. [Performance Considerations](#performance-considerations)

---

## System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User's Phone                         │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │          Mobile Browser (Safari/Chrome)         │    │
│  │                                                 │    │
│  │  ┌──────────────────────────────────────────┐ │    │
│  │  │         WebAR Application                │ │    │
│  │  │                                          │ │    │
│  │  │  ┌────────────┐      ┌────────────┐    │ │    │
│  │  │  │   A-Frame  │      │   AR.js    │    │ │    │
│  │  │  │ (3D Scene) │◄────►│  (AR SDK)  │    │ │    │
│  │  │  └────────────┘      └────────────┘    │ │    │
│  │  │         ▲                    ▲          │ │    │
│  │  │         │                    │          │ │    │
│  │  │         ▼                    ▼          │ │    │
│  │  │  ┌────────────┐      ┌────────────┐    │ │    │
│  │  │  │ WebGL/     │      │ Device     │    │ │    │
│  │  │  │ Three.js   │      │ APIs       │    │ │    │
│  │  │  └────────────┘      └────────────┘    │ │    │
│  │  └──────────────────────────────────────────┘ │    │
│  └────────────────────────────────────────────────┘    │
│                        ▲                                │
│                        │                                │
│              ┌─────────┴──────────┐                     │
│              │                    │                     │
│         ┌────▼─────┐      ┌──────▼──────┐              │
│         │  Camera  │      │     GPS     │              │
│         │  Feed    │      │  Location   │              │
│         └──────────┘      └─────────────┘              │
└─────────────────────────────────────────────────────────┘
                        │
                        │ HTTPS (Optional)
                        ▼
        ┌───────────────────────────────┐
        │     Backend API (Optional)     │
        │    Node.js + Fastify/Express   │
        │                                │
        │  ┌──────────────────────────┐ │
        │  │   /poi/nearest           │ │
        │  │   ?lat=22.29&lng=114.16  │ │
        │  └──────────────────────────┘ │
        │                                │
        │  ┌──────────────────────────┐ │
        │  │   POI Database           │ │
        │  │   (JSON or PostgreSQL)   │ │
        │  └──────────────────────────┘ │
        └───────────────────────────────┘
```

---

## How WebAR Actually Works

### The Magic Behind GPS-Based AR

WebAR combines **three technologies** to create augmented reality in a browser:

1. **Camera Access** (WebRTC API)
2. **GPS/Orientation Sensors** (Geolocation + DeviceOrientation APIs)
3. **3D Rendering** (WebGL via Three.js/A-Frame)

### Step-by-Step Process

#### Step 1: User Opens WebAR URL
```
User action: Scans QR code or visits URL
Browser: Loads HTML/CSS/JavaScript
Result: WebAR app initializes
```

#### Step 2: Request Permissions
```javascript
// Browser asks user for permissions
navigator.mediaDevices.getUserMedia({ video: true })  // Camera
navigator.geolocation.getCurrentPosition()            // GPS
window.DeviceOrientationEvent.requestPermission()     // Orientation (iOS)
```

#### Step 3: Get User's Position
```javascript
// GPS provides latitude/longitude
navigator.geolocation.watchPosition((position) => {
  const userLat = position.coords.latitude;   // e.g., 22.2946
  const userLng = position.coords.longitude;  // e.g., 114.1699
  const userAlt = position.coords.altitude || 0;
  const accuracy = position.coords.accuracy;  // meters (±5-50m typical)
});
```

#### Step 4: Get Device Orientation
```javascript
// Compass + accelerometer provide rotation
window.addEventListener('deviceorientation', (event) => {
  const alpha = event.alpha;  // Compass heading (0-360°)
  const beta = event.beta;    // Front-to-back tilt (-180 to 180°)
  const gamma = event.gamma;  // Left-to-right tilt (-90 to 90°)
});
```

#### Step 5: Calculate POI Position Relative to User

This is the **core AR calculation**:

```javascript
// Given:
// - User position: (userLat, userLng, userAlt)
// - POI position: (poiLat, poiLng, poiAlt)
// - Device heading: alpha (degrees)

// Step 5a: Calculate distance (Haversine formula)
function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000; // Earth radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lng2 - lng1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
  return R * c; // Distance in meters
}

// Step 5b: Calculate bearing (direction from user to POI)
function bearing(lat1, lng1, lat2, lng2) {
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δλ = (lng2 - lng1) * Math.PI / 180;

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) -
            Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  
  const θ = Math.atan2(y, x);
  return (θ * 180 / Math.PI + 360) % 360; // Bearing in degrees (0-360)
}

// Step 5c: Convert to 3D coordinates (ENU - East-North-Up)
const distance = haversineDistance(userLat, userLng, poiLat, poiLng);
const bearingDeg = bearing(userLat, userLng, poiLat, poiLng);
const bearingRad = bearingDeg * Math.PI / 180;

// Altitude difference
const altDiff = poiAlt - userAlt;

// 3D position relative to user (in meters)
const x = distance * Math.sin(bearingRad);  // East (+) / West (-)
const y = altDiff;                          // Up (+) / Down (-)
const z = -distance * Math.cos(bearingRad); // North (+) / South (-)

// Result: POI is at position (x, y, z) relative to user
```

#### Step 6: Render AR Content
```javascript
// A-Frame/Three.js places 3D object at calculated position
const arEntity = document.createElement('a-entity');
arEntity.setAttribute('position', `${x} ${y} ${z}`);
arEntity.setAttribute('look-at', '[camera]'); // Billboard effect

// Add AR card (plane with text)
arEntity.innerHTML = `
  <a-plane color="white" width="2" height="1.5"></a-plane>
  <a-text value="Clock Tower" position="0 0.5 0.1"></a-text>
`;

scene.appendChild(arEntity);
```

#### Step 7: Camera Feed + AR Overlay
```javascript
// WebGL composites camera feed with 3D scene
// User sees: Real world (camera) + Virtual AR card (3D)
// Frame rate: 30-60 fps
```

### Visual Explanation

```
Real World View (Camera):
┌─────────────────────────┐
│                         │
│      [Clock Tower]      │  ← Real landmark
│           │             │
│           │             │
│           │             │
│          ╱│╲            │
│         ╱ │ ╲           │
│        ╱  │  ╲          │
└───────────────────────┘

AR Overlay Added:
┌─────────────────────────┐
│  ┌───────────────┐      │
│  │ Clock Tower   │      │  ← Virtual AR card
│  │ 1915          │      │     positioned at GPS coords
│  │ KCR terminus  │      │
│  └───────┬───────┘      │
│          │              │
│      [Clock Tower]      │  ← Real landmark
│           │             │
│           │             │
│           │             │
└───────────────────────┘
      ▲
      │
   Leader line (optional)
```

---

## Tech Stack Deep Dive

### 1. A-Frame (3D Scene Framework)

**What it is:**
- Web framework for building VR/AR experiences
- Built on top of Three.js
- Uses HTML-like syntax (declarative)

**Why we use it:**
- Easy to learn (HTML syntax)
- Built-in components for common AR tasks
- Large community and documentation
- Works well with AR.js

**Example:**
```html
<a-scene>
  <!-- Camera (user's viewpoint) -->
  <a-camera gps-camera rotation-reader></a-camera>
  
  <!-- AR entity at Clock Tower -->
  <a-entity gps-entity-place="latitude: 22.2946; longitude: 114.1699">
    <a-box color="red"></a-box>
  </a-entity>
</a-scene>
```

### 2. AR.js (AR SDK)

**What it is:**
- JavaScript library for WebAR
- Handles GPS calculations, marker tracking
- Provides A-Frame components

**Components we use:**

#### `gps-camera`
```javascript
// Attaches to <a-camera>
// Automatically:
// - Reads GPS position
// - Reads device orientation
// - Updates camera transform
```

#### `gps-entity-place`
```javascript
// Attaches to any <a-entity>
// Automatically:
// - Calculates distance from user
// - Converts GPS to 3D coordinates
// - Updates entity position in real-time
```

**Configuration:**
```html
<a-scene 
  arjs="sourceType: webcam; 
        videoTexture: true; 
        debugUIEnabled: false;
        gpsMinDistance: 5;">
  <!-- gpsMinDistance: Only update if user moves 5+ meters -->
</a-scene>
```

### 3. Three.js (3D Engine)

**What it is:**
- Low-level 3D graphics library
- WebGL wrapper
- A-Frame is built on top of Three.js

**We don't write Three.js directly**, but it powers A-Frame under the hood.

**What Three.js handles:**
- WebGL rendering
- Scene graph management
- Matrix transformations
- Shader compilation

### 4. WebGL (Graphics API)

**What it is:**
- Browser API for GPU-accelerated graphics
- Renders 3D content at 30-60 fps

**What it does:**
- Draws camera feed (video texture)
- Draws 3D AR objects (cards, text)
- Composites layers (camera + AR)

### 5. Web APIs (Browser Features)

#### MediaDevices API (Camera)
```javascript
navigator.mediaDevices.getUserMedia({
  video: {
    facingMode: 'environment',  // Back camera
    width: { ideal: 1280 },
    height: { ideal: 720 }
  }
})
```

#### Geolocation API (GPS)
```javascript
navigator.geolocation.watchPosition(
  (position) => {
    // Success: Got GPS coordinates
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const accuracy = position.coords.accuracy; // meters
  },
  (error) => {
    // Error: GPS unavailable or denied
  },
  {
    enableHighAccuracy: true,  // Use GPS (not WiFi/cell tower)
    maximumAge: 0,             // No cached positions
    timeout: 27000             // 27 second timeout
  }
);
```

#### DeviceOrientation API (Compass)
```javascript
window.addEventListener('deviceorientation', (event) => {
  const heading = event.alpha;    // 0-360° (north = 0°)
  const pitch = event.beta;       // -180 to 180° (tilt)
  const roll = event.gamma;       // -90 to 90° (rotation)
});
```

---

## Architecture Layers

### Layer 1: Browser APIs (Platform)
```
┌──────────────────────────────────────┐
│  MediaDevices (Camera)               │
│  Geolocation (GPS)                   │
│  DeviceOrientation (Compass)         │
│  WebGL (Graphics)                    │
└──────────────────────────────────────┘
```

### Layer 2: Three.js (3D Engine)
```
┌──────────────────────────────────────┐
│  Scene Management                    │
│  Camera Transforms                   │
│  Mesh Rendering                      │
│  Texture Mapping                     │
└──────────────────────────────────────┘
```

### Layer 3: A-Frame (Framework)
```
┌──────────────────────────────────────┐
│  Entity-Component System             │
│  HTML-like API                       │
│  Built-in Primitives (box, text)    │
│  Animation System                    │
└──────────────────────────────────────┘
```

### Layer 4: AR.js (AR SDK)
```
┌──────────────────────────────────────┐
│  GPS → 3D Coordinate Conversion      │
│  gps-camera Component                │
│  gps-entity-place Component          │
│  Location-based AR Logic             │
└──────────────────────────────────────┘
```

### Layer 5: Your Application (Business Logic)
```
┌──────────────────────────────────────┐
│  POI Data (Clock Tower, etc.)        │
│  UI Styling (cards, colors)          │
│  Backend Integration (optional)      │
│  Analytics & Telemetry               │
└──────────────────────────────────────┘
```

---

## Data Flow

### Initialization Flow

```
1. User opens URL
   └─> Browser loads HTML

2. HTML loads JavaScript libraries
   └─> A-Frame.js (180KB)
   └─> AR.js (120KB)

3. A-Frame initializes
   └─> Creates WebGL context
   └─> Starts render loop (60 fps)

4. AR.js requests permissions
   └─> Camera access
   └─> GPS access
   └─> Orientation access

5. User grants permissions
   └─> Camera feed starts
   └─> GPS position acquired
   └─> AR ready ✓
```

### Runtime Loop (60 fps)

```
Every frame (16.67ms):

1. Read device sensors
   ├─> GPS position (lat, lng)
   ├─> Compass heading (α)
   └─> Device tilt (β, γ)

2. For each POI:
   ├─> Calculate distance from user
   ├─> Calculate bearing to POI
   ├─> Convert to 3D coordinates (x, y, z)
   └─> Update entity position

3. Render scene
   ├─> Draw camera feed (video texture)
   ├─> Draw 3D AR entities
   └─> Composite to screen

4. Repeat next frame
```

### User Interaction Flow

```
User walks toward Clock Tower:

Frame 1: User at 50m away
   └─> POI card rendered at (x:0, y:0, z:-50)

Frame 60: User at 49m away (1 second later)
   └─> POI card rendered at (x:0, y:0, z:-49)

Frame 3000: User at 10m away (50 seconds later)
   └─> POI card rendered at (x:0, y:0, z:-10)
   └─> Card appears larger (perspective)
```

---

## Coordinate Systems

### GPS Coordinates (WGS84)
```
Latitude:  -90° to +90°  (south to north)
Longitude: -180° to +180° (west to east)
Altitude:  meters above sea level

Example: Clock Tower
  Lat: 22.2946° N (northern hemisphere)
  Lng: 114.1699° E (eastern hemisphere)
  Alt: 7m (above sea level)
```

### 3D World Coordinates (ENU - East-North-Up)
```
X-axis: East (+) / West (-)
Y-axis: Up (+) / Down (-)
Z-axis: North (+) / South (-)

Origin: User's position (0, 0, 0)

Example: Clock Tower 30m north of user
  Position: (0, 0, -30)
           x=0  (not east/west)
           y=0  (same altitude)
           z=-30 (30m north, but -Z in Three.js)
```

### Camera Coordinates (WebGL)
```
A-Frame uses Right-Handed Coordinate System:
X: Right (+) / Left (-)
Y: Up (+) / Down (-)
Z: Backward (+) / Forward (-)

Camera looks down -Z axis
```

### Conversion: GPS → ENU → WebGL

```javascript
// Step 1: GPS to ENU (meters)
const distance = haversineDistance(userLat, userLng, poiLat, poiLng);
const bearing = calculateBearing(userLat, userLng, poiLat, poiLng);

const enuX = distance * Math.sin(bearing * Math.PI / 180);  // East
const enuY = poiAlt - userAlt;                              // Up
const enuZ = distance * Math.cos(bearing * Math.PI / 180);  // North

// Step 2: ENU to WebGL (Three.js/A-Frame)
const webglX = enuX;      // East = Right
const webglY = enuY;      // Up = Up
const webglZ = -enuZ;     // North = -Forward (Three.js convention)

// Result: Set entity position
entity.setAttribute('position', `${webglX} ${webglY} ${webglZ}`);
```

---

## Implementation Details

### Minimal WebAR Implementation

**File: `index.html`**

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Sightline WebAR - Clock Tower</title>
  
  <!-- A-Frame library -->
  <script src="https://aframe.io/releases/1.4.0/aframe.min.js"></script>
  
  <!-- AR.js library -->
  <script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js"></script>
  
  <style>
    body { margin: 0; overflow: hidden; }
    
    /* Loading indicator */
    #loading {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-family: Arial;
      font-size: 20px;
      z-index: 9999;
      background: rgba(0,0,0,0.7);
      padding: 20px;
      border-radius: 10px;
    }
    
    /* GPS accuracy indicator */
    #gps-accuracy {
      position: fixed;
      top: 10px;
      left: 10px;
      color: white;
      font-family: monospace;
      font-size: 12px;
      background: rgba(0,0,0,0.5);
      padding: 5px 10px;
      border-radius: 5px;
      z-index: 1000;
    }
  </style>
</head>
<body>
  
  <!-- Loading indicator (hidden when AR ready) -->
  <div id="loading">Initializing AR...</div>
  
  <!-- GPS accuracy display -->
  <div id="gps-accuracy">GPS: Waiting...</div>
  
  <!-- A-Frame AR Scene -->
  <a-scene
    vr-mode-ui="enabled: false"
    embedded
    arjs="sourceType: webcam; 
          videoTexture: true; 
          debugUIEnabled: false;
          detectionMode: mono_and_matrix;
          matrixCodeType: 3x3;
          gpsMinDistance: 5;">
    
    <!-- Clock Tower POI (22.2946°N, 114.1699°E) -->
    <a-entity 
      id="clock-tower"
      gps-entity-place="latitude: 22.2946; longitude: 114.1699">
      
      <!-- Card background -->
      <a-plane 
        position="0 0 0" 
        rotation="0 0 0" 
        width="3" 
        height="2.5" 
        color="#FFFFFF" 
        opacity="0.95"
        shadow="receive: true">
      </a-plane>
      
      <!-- Title -->
      <a-text 
        value="Clock Tower" 
        position="0 1 0.01" 
        align="center" 
        color="#000000" 
        width="6"
        font="roboto"
        shader="msdf">
      </a-text>
      
      <!-- Year -->
      <a-text 
        value="1915" 
        position="0 0.6 0.01" 
        align="center" 
        color="#666666" 
        width="5">
      </a-text>
      
      <!-- Description -->
      <a-text 
        value="Former Kowloon-Canton\nRailway terminus.\nOne of HK's oldest landmarks." 
        position="0 0 0.01" 
        align="center" 
        color="#333333" 
        width="5.5"
        wrap-count="30">
      </a-text>
      
      <!-- Distance indicator (updated by JavaScript) -->
      <a-text 
        id="distance-text"
        value="Distance: --m" 
        position="0 -0.8 0.01" 
        align="center" 
        color="#999999" 
        width="4">
      </a-text>
      
    </a-entity>
    
    <!-- Camera with GPS tracking -->
    <a-camera 
      id="camera"
      gps-camera="minDistance: 5; maxDistance: 100;" 
      rotation-reader>
    </a-camera>
    
  </a-scene>
  
  <script>
    // Wait for AR.js to be ready
    window.addEventListener('arjs-gps-camera-ready', () => {
      console.log('AR Camera Ready');
      document.getElementById('loading').style.display = 'none';
    });
    
    // Update GPS accuracy display
    window.addEventListener('gps-camera-update-position', (event) => {
      const { position, accuracy } = event.detail;
      
      document.getElementById('gps-accuracy').innerHTML = 
        `GPS: ${position.latitude.toFixed(5)}, ${position.longitude.toFixed(5)}<br>` +
        `Accuracy: ±${accuracy.toFixed(1)}m`;
      
      // Calculate distance to Clock Tower
      const userLat = position.latitude;
      const userLng = position.longitude;
      const poiLat = 22.2946;
      const poiLng = 114.1699;
      
      const distance = haversineDistance(userLat, userLng, poiLat, poiLng);
      
      // Update distance text in AR
      const distanceText = document.getElementById('distance-text');
      if (distanceText) {
        distanceText.setAttribute('value', `Distance: ${Math.round(distance)}m`);
      }
    });
    
    // Haversine distance formula
    function haversineDistance(lat1, lng1, lat2, lng2) {
      const R = 6371000; // Earth radius in meters
      const φ1 = lat1 * Math.PI / 180;
      const φ2 = lat2 * Math.PI / 180;
      const Δφ = (lat2 - lat1) * Math.PI / 180;
      const Δλ = (lng2 - lng1) * Math.PI / 180;

      const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
      
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      
      return R * c;
    }
    
    // Handle GPS errors
    window.addEventListener('gps-camera-error', (event) => {
      console.error('GPS Error:', event.detail);
      document.getElementById('gps-accuracy').innerHTML = 
        `GPS Error: ${event.detail.message || 'Unable to get location'}`;
    });
  </script>
  
</body>
</html>
```

### Testing Locally (Without Going to Clock Tower)

```html
<!-- Add simulate parameters for testing -->
<a-camera 
  gps-camera="minDistance: 5; 
              maxDistance: 100;
              simulateLatitude: 22.2946;
              simulateLongitude: 114.1699;" 
  rotation-reader>
</a-camera>
```

This will fake your GPS position as if you're at Clock Tower, so AR card appears nearby.

---

## File Structure

### Phase 1: Minimal (Hardcoded)

```
/WebDemo
  ├── index.html              # Main AR application
  ├── README.md               # Setup instructions
  └── .gitignore
```

### Phase 2: With Backend (Dynamic POIs)

```
/WebDemo
  ├── index.html              # AR frontend
  ├── styles.css              # UI styles
  ├── app.js                  # JavaScript logic
  ├── poi-loader.js           # Fetch POIs from API
  └── README.md

/Server
  ├── src/
  │   ├── server.ts           # Fastify server
  │   ├── routes/
  │   │   └── poi.ts          # POI endpoints
  │   ├── data/
  │   │   └── pois.json       # POI database
  │   └── types.ts            # TypeScript types
  ├── package.json
  ├── tsconfig.json
  └── README.md
```

---

## API Specification

### GET `/poi/nearest`

**Purpose:** Get nearest POI based on user's GPS location

**Request:**
```http
GET /poi/nearest?lat=22.2946&lng=114.1699&radius=100
```

**Query Parameters:**
- `lat` (required): User's latitude
- `lng` (required): User's longitude
- `radius` (optional): Search radius in meters (default: 100)

**Response:**
```json
{
  "poi": {
    "id": "clock_tower",
    "name": "Clock Tower",
    "lat": 22.2946,
    "lng": 114.1699,
    "alt": 7,
    "year": 1915,
    "blurb": "Former Kowloon-Canton Railway terminus.",
    "distance": 12.5,
    "bearing": 45.2
  },
  "requestId": "req_abc123",
  "timestamp": "2024-11-07T10:30:00Z"
}
```

**Error Response (No POI found):**
```json
{
  "poi": null,
  "message": "No POI found within 100m radius",
  "requestId": "req_abc124",
  "timestamp": "2024-11-07T10:31:00Z"
}
```

### GET `/poi/:id`

**Purpose:** Get full details for specific POI

**Request:**
```http
GET /poi/clock_tower
```

**Response:**
```json
{
  "id": "clock_tower",
  "name": "Clock Tower",
  "aliases": ["Tsim Sha Tsui Clock Tower", "KCR Clock Tower"],
  "coords": {
    "lat": 22.2946,
    "lng": 114.1699,
    "alt": 7
  },
  "year": 1915,
  "blurb": "Former Kowloon-Canton Railway terminus. Built in 1915, it's one of Hong Kong's oldest landmarks.",
  "details": "The Clock Tower is the only remnant of the original Kowloon Station...",
  "images": [
    "/img/clock_tower_day.jpg",
    "/img/clock_tower_night.jpg"
  ],
  "category": "heritage",
  "tags": ["landmark", "heritage", "tsim-sha-tsui"]
}
```

---

## Performance Considerations

### GPS Accuracy

**Typical Accuracy:**
- Open sky: ±5-15m
- Urban area: ±10-30m
- Dense urban (tall buildings): ±30-100m

**Mitigation Strategies:**
1. Display accuracy indicator to user
2. Only show POIs when accuracy < 50m
3. Add manual "tap to lock" fallback
4. Use WiFi positioning as fallback (less accurate but faster)

### GPS Update Frequency

**AR.js Default:** Updates every 5m movement (`gpsMinDistance: 5`)

**Trade-off:**
- Too frequent (1m): Battery drain, jittery
- Too infrequent (20m): Laggy, outdated position

**Recommended:** 5-10m for walking speed

### Frame Rate

**Target:** 30+ fps (smooth AR)

**Optimization:**
- Limit number of AR entities (3-5 max visible)
- Use simple geometries (planes, not complex 3D models)
- Avoid real-time shadows
- Reduce texture sizes

### Network Latency

**Challenge:** Fetching POI data from backend takes time

**Solution:**
1. **Pre-load nearby POIs** when app starts
2. **Cache POI data** in localStorage
3. **Show loading state** while fetching
4. **Fallback to hardcoded** if API fails

### Battery Usage

**AR is power-intensive** (camera + GPS + 3D rendering)

**Optimization:**
- Reduce GPS polling frequency
- Lower frame rate to 30 fps (vs 60 fps)
- Pause AR when app in background
- Show battery warning if < 20%

---

## Security & Privacy

### HTTPS Required (iOS)

iOS Safari requires HTTPS for:
- Camera access
- Geolocation
- DeviceOrientation

**Solution:**
- Use Vercel (free HTTPS)
- Or ngrok for local testing

### Camera Permission

**User must explicitly grant** camera access

**Best Practice:**
- Show explanation before asking
- Graceful fallback if denied
- Never record video without consent

### Location Privacy

**Don't log exact GPS coordinates** to server

**Best Practice:**
- Round coordinates to 3 decimal places (±111m)
- Only send lat/lng when querying POIs
- Delete location data after session

---

## Next Steps

### Week 2 Implementation Plan

**Day 6 (4 hours):**
1. Copy `index.html` from this doc
2. Test locally: `python -m http.server 8000`
3. Deploy to Vercel: `vercel --prod`
4. Test on iPhone via HTTPS URL

**Day 7 (4 hours):**
1. Add 2 more POIs (Star Ferry, Avenue of Stars)
2. Style AR cards (colors, fonts)
3. Add distance indicator
4. Test responsiveness

**Day 8 (8 hours):**
1. Go to Clock Tower
2. Test WebAR with real GPS
3. Record demo video
4. Document issues

**Day 9-10 (Optional):**
1. Build backend API
2. Make POIs dynamic
3. Add analytics

---

## Debugging Tips

### GPS Not Working

**Check:**
1. HTTPS enabled? (iOS requires it)
2. Permissions granted?
3. GPS signal strong? (go outside)
4. Timeout too short? (increase to 27000ms)

**Test:**
```javascript
navigator.geolocation.getCurrentPosition(
  (pos) => console.log('GPS OK:', pos.coords),
  (err) => console.error('GPS Error:', err),
  { enableHighAccuracy: true, timeout: 27000 }
);
```

### AR Card Not Appearing

**Check:**
1. Distance to POI < 100m?
2. POI coordinates correct?
3. Console errors?
4. AR.js loaded?

**Debug:**
```javascript
// Check if AR entity exists
const entity = document.getElementById('clock-tower');
console.log('Entity:', entity);

// Check calculated position
console.log('Entity position:', entity.getAttribute('position'));
```

### Camera Feed Black

**Check:**
1. Camera permission granted?
2. Another app using camera?
3. Browser supports WebRTC?

**Test:**
```javascript
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => console.log('Camera OK'))
  .catch(err => console.error('Camera Error:', err));
```

---

## Summary

**WebAR combines:**
1. **GPS** (user position)
2. **Compass** (device heading)
3. **Camera** (real-world view)
4. **WebGL** (3D rendering)

**Key calculation:** GPS → Distance/Bearing → 3D Coordinates → Rendered AR

**Advantages:**
- ✅ Zero install (web browser)
- ✅ Cross-platform (iOS + Android)
- ✅ Fast to build (HTML/JavaScript)
- ✅ Easy to update (just push new HTML)

**Limitations:**
- ⚠️ GPS accuracy (±10-50m typical)
- ⚠️ Performance (slower than native)
- ⚠️ No advanced features (occlusion, depth)

**For Sightline MVP:** WebAR is perfect ✓

---

**Ready to implement? Start with the minimal `index.html` above and test locally!**

