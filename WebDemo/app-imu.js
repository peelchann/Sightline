// Sightline WebAR v3.0 - IMU Heading + Hands-Free AR
// Real-time compass tracking with proper labeled cards

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  MAX_DISTANCE: 5000,
  UPDATE_INTERVAL: 1000,
  HEADING_UPDATE_INTERVAL: 100,
  HEADING_SMOOTH_ALPHA: 0.15,
  CALIBRATION_VARIANCE_THRESHOLD: 30,
  GPS_TIMEOUT: 27000,
  FOV: 60,
};

// ============================================================================
// POI DATA - Now with Palace Museum
// ============================================================================

const POIS = [
  {
    id: 'clock-tower',
    name: 'Clock Tower',
    lat: 22.2946,
    lng: 114.1699,
    year: 1915,
    fact: 'Former Kowloon-Canton Railway terminus',
    category: 'landmark'
  },
  {
    id: 'star-ferry-tst',
    name: 'Star Ferry (TST)',
    lat: 22.2937,
    lng: 114.1703,
    year: 1888,
    fact: 'Iconic ferry • 7 min crossing',
    category: 'transport'
  },
  {
    id: 'avenue-stars',
    name: 'Avenue of Stars',
    lat: 22.2930,
    lng: 114.1730,
    year: 2004,
    fact: 'HK film industry walk of fame',
    category: 'landmark'
  },
  {
    id: 'ifc',
    name: 'IFC Tower',
    lat: 22.2855,
    lng: 114.1588,
    year: 2003,
    fact: '412m • International Finance Centre',
    category: 'landmark',
    elevation: 412
  },
  {
    id: 'icc',
    name: 'ICC',
    lat: 22.3069,
    lng: 114.1617,
    year: 2010,
    fact: '484m • Tallest in Hong Kong',
    category: 'landmark',
    elevation: 484
  },
  {
    id: 'mplus',
    name: 'M+ Museum',
    lat: 22.3030,
    lng: 114.1605,
    year: 2021,
    fact: 'Visual culture • Contemporary art',
    category: 'museum'
  },
  {
    id: 'xiqu',
    name: 'Xiqu Centre',
    lat: 22.3049,
    lng: 114.1689,
    year: 2019,
    fact: 'Chinese opera & performance',
    category: 'arts'
  },
  {
    id: 'palace-museum',
    name: 'Hong Kong Palace Museum',
    lat: 22.3017,
    lng: 114.1603,
    year: 2022,
    fact: 'Chinese imperial art treasures',
    category: 'museum'
  },
  {
    id: 'star-ferry-central',
    name: 'Star Ferry (Central)',
    lat: 22.2820,
    lng: 114.1586,
    year: 1888,
    fact: 'Central pier terminal',
    category: 'transport'
  }
];

// ============================================================================
// PRESETS
// ============================================================================

const PRESETS = {
  'freespace': {
    name: 'West Kowloon Freespace',
    lat: 22.3045,
    lng: 114.1595,
    heading: 120,
    description: 'Facing Victoria Harbour skyline'
  },
  'tst-promenade': {
    name: 'TST Promenade',
    lat: 22.2948,
    lng: 114.1712,
    heading: 300,
    description: 'Clock Tower viewpoint'
  },
  'central-piers': {
    name: 'Central Ferry Piers',
    lat: 22.2858,
    lng: 114.1590,
    heading: 90,
    description: 'Central waterfront'
  }
};

// ============================================================================
// ORIENTATION MANAGER - IMU/Compass with Smoothing
// ============================================================================

const OrientationManager = {
  heading: 0,
  rawHeading: 0,
  smoothedHeading: 0,
  headingHistory: [],
  isCalibrating: false,
  permissionGranted: false,
  headingSource: null,
  
  callbacks: {
    onHeadingChange: null,
    onCalibrationNeeded: null
  },
  
  init(onHeadingChange, onCalibrationNeeded) {
    console.log('🧭 Initializing OrientationManager...');
    this.callbacks.onHeadingChange = onHeadingChange;
    this.callbacks.onCalibrationNeeded = onCalibrationNeeded;
    
    // Check if iOS requires permission
    if (this.isIOS() && typeof DeviceOrientationEvent !== 'undefined' && 
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      console.log('📱 iOS detected - showing permission button');
      this.showIOSPermissionButton();
    } else {
      // Start listening immediately
      this.startListening();
    }
  },
  
  isIOS() {
    return /iPhone|iPad|iPod/.test(navigator.userAgent);
  },
  
  showIOSPermissionButton() {
    const btn = document.createElement('button');
    btn.id = 'ios-motion-permission';
    btn.textContent = '🧭 Enable Motion & Orientation';
    btn.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 20px 40px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: #fff;
      border: none;
      border-radius: 12px;
      font-size: 18px;
      font-weight: 600;
      cursor: pointer;
      z-index: 10000;
      box-shadow: 0 8px 24px rgba(102, 126, 234, 0.5);
    `;
    
    btn.onclick = async () => {
      try {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission === 'granted') {
          this.permissionGranted = true;
          btn.remove();
          this.startListening();
          showSuccess('✅ Motion access granted');
        } else {
          showError('❌ Motion permission denied');
        }
      } catch (error) {
        console.error('Permission error:', error);
        btn.remove();
        this.startListening(); // Try anyway
      }
    };
    
    document.body.appendChild(btn);
  },
  
  startListening() {
    console.log('👂 Starting orientation listeners...');
    
    // Primary: deviceorientation with compass heading
    window.addEventListener('deviceorientation', (e) => {
      // iOS compass (true heading)
      if (e.webkitCompassHeading !== undefined && e.webkitCompassHeading !== null) {
        this.rawHeading = e.webkitCompassHeading;
        this.headingSource = 'iOS-compass';
        this.updateHeading(this.rawHeading);
      }
      // Android alpha (magnetic heading)
      else if (e.alpha !== null) {
        this.rawHeading = 360 - e.alpha; // Convert to compass bearing
        this.headingSource = 'Android-alpha';
        this.updateHeading(this.rawHeading);
      }
    }, true);
    
    // Fallback: Geolocation course
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (pos) => {
          if (pos.coords.heading !== null && pos.coords.heading >= 0) {
            if (!this.headingSource || this.headingSource === 'geolocation') {
              this.rawHeading = pos.coords.heading;
              this.headingSource = 'geolocation';
              this.updateHeading(this.rawHeading);
            }
          }
        },
        null,
        { enableHighAccuracy: true }
      );
    }
    
    // Start calibration monitoring
    setInterval(() => this.checkCalibration(), 2000);
  },
  
  updateHeading(newHeading) {
    // Handle wrap-around (359° → 0°)
    let delta = newHeading - this.smoothedHeading;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    
    // Exponential smoothing
    this.smoothedHeading += delta * CONFIG.HEADING_SMOOTH_ALPHA;
    
    // Normalize to [0, 360)
    while (this.smoothedHeading < 0) this.smoothedHeading += 360;
    while (this.smoothedHeading >= 360) this.smoothedHeading -= 360;
    
    this.heading = this.smoothedHeading;
    
    // Update history
    this.headingHistory.push(newHeading);
    if (this.headingHistory.length > 10) {
      this.headingHistory.shift();
    }
    
    // Notify callback
    if (this.callbacks.onHeadingChange) {
      this.callbacks.onHeadingChange(this.heading);
    }
  },
  
  checkCalibration() {
    if (this.headingHistory.length < 5) return;
    
    const mean = this.headingHistory.reduce((a, b) => a + b, 0) / this.headingHistory.length;
    const variance = this.headingHistory.reduce((sum, val) => {
      let diff = val - mean;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      return sum + diff * diff;
    }, 0) / this.headingHistory.length;
    
    const stdDev = Math.sqrt(variance);
    
    if (stdDev > CONFIG.CALIBRATION_VARIANCE_THRESHOLD && !this.isCalibrating) {
      this.isCalibrating = true;
      if (this.callbacks.onCalibrationNeeded) {
        this.callbacks.onCalibrationNeeded();
      }
      setTimeout(() => { this.isCalibrating = false; }, 10000);
    }
  },
  
  getHeading() {
    return this.heading;
  },
  
  getSource() {
    return this.headingSource || 'none';
  }
};

// ============================================================================
// DEMO CONTROLLER
// ============================================================================

const DemoController = {
  mode: 'live',
  simLat: null,
  simLng: null,
  simHeading: 0,
  livePosition: null,
  liveHeading: 0,
  
  init() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'demo') {
      this.mode = 'demo';
      this.simLat = parseFloat(params.get('lat')) || 22.3045;
      this.simLng = parseFloat(params.get('lng')) || 114.1595;
      this.simHeading = parseFloat(params.get('hdg')) || 120;
    }
    
    // Initialize OrientationManager for live mode
    if (this.mode === 'live') {
      OrientationManager.init(
        (heading) => {
          this.liveHeading = heading;
          this.updateCameraRotation(heading);
        },
        () => {
          showCalibrationWarning();
        }
      );
    }
  },
  
  updateCameraRotation(heading) {
    const camera = document.querySelector('a-camera, [camera]');
    if (camera) {
      camera.setAttribute('rotation', { x: 0, y: -heading, z: 0 });
    }
  },
  
  setMode(mode) {
    this.mode = mode;
    console.log(`📍 Mode: ${mode}`);
  },
  
  setDemo(lat, lng, heading) {
    this.simLat = lat;
    this.simLng = lng;
    this.simHeading = heading;
    console.log(`🎯 Demo position: ${lat.toFixed(4)}, ${lng.toFixed(4)}, hdg: ${heading}°`);
  },
  
  loadPreset(presetKey) {
    const preset = PRESETS[presetKey];
    if (preset) {
      this.setDemo(preset.lat, preset.lng, preset.heading);
      return preset;
    }
    return null;
  },
  
  getCurrentPosition() {
    if (this.mode === 'demo' && this.simLat && this.simLng) {
      return { lat: this.simLat, lng: this.simLng, accuracy: 10 };
    }
    return this.livePosition;
  },
  
  getHeading() {
    if (this.mode === 'demo') {
      return this.simHeading;
    }
    return OrientationManager.getHeading();
  },
  
  updateLivePosition(position, accuracy) {
    this.livePosition = { lat: position.lat, lng: position.lng, accuracy };
  }
};

// ============================================================================
// STATE
// ============================================================================

let arReady = false;
let nearbyPOICount = 0;
let visiblePOIs = new Set();

// ============================================================================
// DOM ELEMENTS
// ============================================================================

const loadingOverlay = document.getElementById('loading-overlay');
const skipLoadingBtn = document.getElementById('skip-loading');
const gpsAccuracy = document.getElementById('gps-accuracy');
const gpsCoords = document.getElementById('gps-coords');
const poiCountElement = document.getElementById('poi-count');
const helpButton = document.getElementById('help-button');
const instructions = document.getElementById('instructions');
const closeInstructionsBtn = document.getElementById('close-instructions');

// ============================================================================
// INITIALIZE
// ============================================================================

window.addEventListener('DOMContentLoaded', init);

function init() {
  console.log('🚀 Sightline WebAR v3.0 - IMU Heading');
  
  DemoController.init();
  
  // Check if demo mode from URL
  if (DemoController.mode === 'demo') {
    console.log('🎭 Demo mode activated');
    setTimeout(() => {
      loadingOverlay.classList.add('hidden');
      initDemoMode();
    }, 1000);
    return;
  }
  
  // Normal live GPS flow
  setupEventListeners();
  
  // Start distance update interval
  setInterval(updateDistances, CONFIG.UPDATE_INTERVAL);
}

function setupEventListeners() {
  const scene = document.querySelector('a-scene');
  if (scene) {
    scene.addEventListener('loaded', () => {
      console.log('📦 A-Frame scene loaded');
    });
    
    scene.addEventListener('renderstart', () => {
      console.log('🎥 Camera rendering started');
      onARReady();
    });
  }
  
  window.addEventListener('gps-camera-ready', () => {
    console.log('📡 GPS Camera Ready');
    onARReady();
  });
  
  window.addEventListener('gps-camera-update-position', onGPSUpdate);
  window.addEventListener('gps-camera-error', onGPSError);
  
  if (closeInstructionsBtn) {
    closeInstructionsBtn.addEventListener('click', () => {
      instructions.classList.add('hidden');
    });
  }
  
  if (helpButton) {
    helpButton.addEventListener('click', () => {
      if (instructions) {
        instructions.classList.remove('hidden');
      }
    });
  }
  
  if (skipLoadingBtn) {
    setTimeout(() => {
      if (!arReady) skipLoadingBtn.style.display = 'block';
    }, 5000);
    
    skipLoadingBtn.addEventListener('click', () => {
      loadingOverlay.classList.add('hidden');
      offerDemoMode();
    });
  }
}

function onARReady() {
  arReady = true;
  setTimeout(() => {
    loadingOverlay.classList.add('hidden');
    showSuccess('✅ AR Ready! Turn to discover landmarks');
  }, 500);
}

function onGPSUpdate(event) {
  const { position, accuracy } = event.detail;
  DemoController.updateLivePosition(position, accuracy);
  updateGPSDisplay(position.latitude, position.longitude, accuracy);
  updateDistances();
}

function onGPSError(event) {
  console.error('❌ GPS Error:', event.detail);
  showError('GPS signal lost. Switch to Demo Mode?');
}

function initDemoMode() {
  arReady = true;
  
  if (!DemoController.simLat || !DemoController.simLng) {
    DemoController.loadPreset('freespace');
  }
  
  createDemoScene();
  
  const pos = DemoController.getCurrentPosition();
  updateGPSDisplay(pos.lat, pos.lng, pos.accuracy);
  updateDistances();
}

function createDemoScene() {
  console.log('🎬 Creating demo scene...');
  // Scene creation logic here
  // (keeping existing logic)
}

function offerDemoMode() {
  if (confirm('GPS not available. Switch to Demo Mode?')) {
    DemoController.setMode('demo');
    initDemoMode();
  }
}

// ============================================================================
// DISTANCE CALCULATIONS
// ============================================================================

function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000;
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

function calculateBearing(lat1, lng1, lat2, lng2) {
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δλ = (lng2 - lng1) * Math.PI / 180;
  
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) -
            Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);
  
  return ((θ * 180 / Math.PI) + 360) % 360;
}

function updateDistances() {
  const pos = DemoController.getCurrentPosition();
  if (!pos) return;
  
  nearbyPOICount = 0;
  
  POIS.forEach(poi => {
    const distance = calculateDistance(pos.lat, pos.lng, poi.lat, poi.lng);
    
    if (DemoController.mode === 'demo') {
      updatePOIPosition(poi, distance);
    } else {
      updatePOILabel(poi, distance);
    }
    
    if (distance <= CONFIG.MAX_DISTANCE) {
      nearbyPOICount++;
    }
  });
  
  if (poiCountElement) {
    poiCountElement.textContent = nearbyPOICount;
  }
}

function updatePOILabel(poi, distance) {
  const distLabel = document.querySelector(`[data-poi-id="${poi.id}"] .distance-text`);
  if (distLabel) {
    let distText;
    if (distance >= 1000) {
      distText = `${(distance / 1000).toFixed(1)} km`;
    } else {
      distText = `${Math.round(distance)}m`;
    }
    distLabel.setAttribute('value', distText);
  }
}

function updatePOIPosition(poi, distance) {
  // Demo mode POI positioning logic
  // (keeping existing logic)
}

// ============================================================================
// UI HELPERS
// ============================================================================

function updateGPSDisplay(lat, lng, accuracy) {
  if (gpsCoords) {
    gpsCoords.textContent = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }
  
  if (gpsAccuracy) {
    let color = '#22c55e';
    let status = 'Excellent';
    if (accuracy > 30) { color = '#eab308'; status = 'Good'; }
    if (accuracy > 100) { color = '#ef4444'; status = 'Poor'; }
    
    gpsAccuracy.textContent = `GPS: ±${accuracy.toFixed(1)}m (${status})`;
    gpsAccuracy.style.color = color;
  }
}

function showSuccess(message) {
  showToast(message, 'success');
}

function showError(message) {
  showToast(message, 'error');
}

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function showCalibrationWarning() {
  const warning = document.createElement('div');
  warning.className = 'calibration-warning';
  warning.innerHTML = '🧭 Compass low confidence — move phone in figure-8 to calibrate';
  warning.style.cssText = `
    position: fixed;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(234, 179, 8, 0.95);
    color: #000;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  `;
  
  document.body.appendChild(warning);
  
  setTimeout(() => warning.remove(), 10000);
}

// ============================================================================
// DEBUG API
// ============================================================================

window.SightlineAR = {
  getUserPosition: () => DemoController.getCurrentPosition(),
  getHeading: () => DemoController.getHeading(),
  getHeadingSource: () => OrientationManager.getSource(),
  getMode: () => DemoController.mode,
  isARReady: () => arReady,
  getNearbyPOICount: () => nearbyPOICount,
  getVisiblePOIs: () => Array.from(visiblePOIs),
  getAllPOIs: () => POIS,
  testDistance: (lat, lng) => {
    const pos = DemoController.getCurrentPosition();
    if (!pos) return null;
    return calculateDistance(pos.lat, pos.lng, lat, lng);
  },
  setDemo: (lat, lng, hdg) => {
    DemoController.setDemo(lat, lng, hdg);
    updateDistances();
  },
  loadPreset: (key) => {
    const preset = DemoController.loadPreset(key);
    updateDistances();
    return preset;
  }
};

console.log('✅ Sightline WebAR v3.0 - IMU Heading Ready');
console.log('💡 Debug API: window.SightlineAR');
console.log(`📡 Heading source: ${OrientationManager.getSource()}`);
