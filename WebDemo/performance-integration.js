/**
 * Sightline WebAR - Performance Integration Layer
 * Connects OrientationManagerV2 + LabelLayoutEngine with existing app
 */

// ============================================================================
// REAL-TIME UPDATE LOOPS
// ============================================================================

const PerformanceManager = {
  // State
  headingUpdateInterval: null,
  distanceUpdateInterval: null,
  layoutUpdateInterval: null,
  
  lastHeading: 0,
  lastUserPos: null,
  
  // Performance counters
  frameCount: 0,
  lastFPSUpdate: Date.now(),
  currentFPS: 0,
  
  // ============================================================================
  // INITIALIZE
  // ============================================================================
  
  init(onHeadingUpdate, onDistanceUpdate, onLayoutUpdate) {
    console.log('⚡ PerformanceManager initializing...');
    
    // Heading loop: 20 FPS (50ms) - drives camera rotation and bearing updates
    this.headingUpdateInterval = setInterval(() => {
      if (window.OrientationManagerV2 && window.OrientationManagerV2.isReady()) {
        const heading = window.OrientationManagerV2.getHeading();
        
        // Only trigger update if heading changed meaningfully (>0.5°)
        if (Math.abs(heading - this.lastHeading) > 0.5) {
          this.lastHeading = heading;
          if (onHeadingUpdate) onHeadingUpdate(heading);
        }
      }
      
      this.updateFPS();
    }, 50);
    
    // Distance & bearing loop: 10 FPS (100ms) - updates text labels
    this.distanceUpdateInterval = setInterval(() => {
      if (onDistanceUpdate) onDistanceUpdate();
    }, 100);
    
    // Label layout loop: 2 FPS (500ms) - collision detection & visibility
    this.layoutUpdateInterval = setInterval(() => {
      if (onLayoutUpdate) onLayoutUpdate();
    }, 500);
    
    console.log('✅ Performance loops active: Heading 20fps, Distance 10fps, Layout 2fps');
  },
  
  // ============================================================================
  // FPS TRACKING
  // ============================================================================
  
  updateFPS() {
    this.frameCount++;
    const now = Date.now();
    const delta = now - this.lastFPSUpdate;
    
    if (delta >= 1000) { // Update FPS display every second
      this.currentFPS = Math.round((this.frameCount * 1000) / delta);
      this.frameCount = 0;
      this.lastFPSUpdate = now;
      
      // Update FPS display if element exists
      const fpsElement = document.getElementById('fps-display');
      if (fpsElement) {
        fpsElement.textContent = `${this.currentFPS} FPS`;
        
        // Color-code performance
        if (this.currentFPS >= 50) {
          fpsElement.style.color = '#4ADE80'; // Green
        } else if (this.currentFPS >= 30) {
          fpsElement.style.color = '#FBBF24'; // Yellow
        } else {
          fpsElement.style.color = '#EF4444'; // Red
        }
      }
    }
  },
  
  // ============================================================================
  // CLEANUP
  // ============================================================================
  
  stop() {
    if (this.headingUpdateInterval) clearInterval(this.headingUpdateInterval);
    if (this.distanceUpdateInterval) clearInterval(this.distanceUpdateInterval);
    if (this.layoutUpdateInterval) clearInterval(this.layoutUpdateInterval);
    console.log('⏹️ Performance loops stopped');
  }
};

// ============================================================================
// HEADING-DRIVEN POI UPDATES
// ============================================================================

function updateAllPOIPositions(heading, pois, userPos, poiEntities) {
  if (!userPos || !poiEntities || !heading === undefined) return;
  
  pois.forEach(poi => {
    const entity = poiEntities.get(poi.id);
    if (!entity) return;
    
    // Compute bearing and angular difference
    const bearing = calculateBearing(userPos.lat, userPos.lng, poi.lat, poi.lng);
    const distance = calculateDistance(userPos.lat, userPos.lng, poi.lat, poi.lng);
    
    let delta = (bearing - heading + 360) % 360;
    if (delta > 180) delta -= 360;
    
    // Determine position based on angular difference
    const pos = computePOIScreenPosition(delta, distance);
    
    // Update position with GPU-accelerated transform
    entity.setAttribute('position', `${pos.x} ${pos.y} ${pos.z}`);
    
    // Update zone class for CSS transitions
    const zone = getPositionZone(delta);
    entity.setAttribute('data-zone', zone);
  });
}

// ============================================================================
// POSITION COMPUTATION
// ============================================================================

function computePOIScreenPosition(delta, distance) {
  let x, y, z;
  
  // Center-lock zone (±5°)
  if (Math.abs(delta) <= 5) {
    x = delta * 0.2; // Slight offset for exact alignment
    y = 1.6; // Eye level
    z = -3; // 3m ahead
    return { x, y, z, zone: 'center' };
  }
  
  // Far left (< -30°)
  if (delta < -30) {
    x = -5;
    y = 1.8;
    z = -2;
    return { x, y, z, zone: 'left-far' };
  }
  
  // Near left (-30° to -5°)
  if (delta < -5) {
    const t = (delta + 30) / 25; // Normalize to [0, 1]
    x = -5 + (t * 3); // Slide from -5 to -2
    y = 1.6;
    z = -2.5;
    return { x, y, z, zone: 'left-near' };
  }
  
  // Far right (> 30°)
  if (delta > 30) {
    x = 5;
    y = 1.8;
    z = -2;
    return { x, y, z, zone: 'right-far' };
  }
  
  // Near right (5° to 30°)
  const t = (delta - 5) / 25; // Normalize to [0, 1]
  x = 2 + (t * 3); // Slide from 2 to 5
  y = 1.6;
  z = -2.5;
  return { x, y, z, zone: 'right-near' };
}

function getPositionZone(delta) {
  if (Math.abs(delta) <= 5) return 'center';
  if (delta < -30) return 'left-far';
  if (delta < -5) return 'left-near';
  if (delta > 30) return 'right-far';
  return 'right-near';
}

// ============================================================================
// DISTANCE & BEARING TEXT UPDATES
// ============================================================================

function updateAllDistancesAndBearings(pois, userPos, poiEntities) {
  if (!userPos || !poiEntities) return;
  
  pois.forEach(poi => {
    const entity = poiEntities.get(poi.id);
    if (!entity) return;
    
    const distance = calculateDistance(userPos.lat, userPos.lng, poi.lat, poi.lng);
    const bearing = calculateBearing(userPos.lat, userPos.lng, poi.lat, poi.lng);
    
    // Update distance text (only if changed by ≥1m to reduce DOM writes)
    const distanceLabel = entity.querySelector('.distance-text');
    if (distanceLabel) {
      const newText = formatDistance(distance);
      const currentText = distanceLabel.getAttribute('value');
      
      if (newText !== currentText) {
        distanceLabel.setAttribute('value', newText);
      }
    }
    
    // Store bearing in data attribute for debugging
    entity.setAttribute('data-bearing', bearing.toFixed(1));
    entity.setAttribute('data-distance', distance.toFixed(1));
  });
}

// ============================================================================
// GEOMETRY HELPERS
// ============================================================================

function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000; // Earth radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lng2 - lng1) * Math.PI / 180;
  
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c; // meters
}

function calculateBearing(lat1, lng1, lat2, lng2) {
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δλ = (lng2 - lng1) * Math.PI / 180;
  
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) -
            Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  
  const θ = Math.atan2(y, x);
  const bearing = (θ * 180 / Math.PI + 360) % 360;
  
  return bearing;
}

function formatDistance(meters) {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  } else {
    return `${(meters / 1000).toFixed(1)}km`;
  }
}

// ============================================================================
// HEADING DISPLAY
// ============================================================================

function updateHeadingDisplay(heading) {
  const display = document.getElementById('heading-display');
  if (!display) return;
  
  const direction = getCompassDirection(heading);
  display.textContent = `${Math.round(heading)}° ${direction}`;
  
  // Color-code by calibration state
  if (window.OrientationManagerV2) {
    const state = window.OrientationManagerV2.getCalibrationState();
    if (state === 'good') {
      display.style.borderColor = '#4ADE80'; // Green
    } else if (state === 'poor') {
      display.style.borderColor = '#FBBF24'; // Yellow
    } else {
      display.style.borderColor = '#6B7280'; // Gray
    }
  }
}

function getCompassDirection(heading) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(heading / 45) % 8;
  return dirs[index];
}

// ============================================================================
// EXPORT TO GLOBAL SCOPE
// ============================================================================

if (typeof window !== 'undefined') {
  window.PerformanceManager = PerformanceManager;
  window.updateAllPOIPositions = updateAllPOIPositions;
  window.updateAllDistancesAndBearings = updateAllDistancesAndBearings;
  window.updateHeadingDisplay = updateHeadingDisplay;
  window.calculateDistance = calculateDistance;
  window.calculateBearing = calculateBearing;
  window.formatDistance = formatDistance;
}

console.log('✅ Performance integration layer loaded');

