// Sightline WebAR - IMU Heading + Hands-Free Experience
// Real-time compass tracking with look-to-aim navigation

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  MAX_DISTANCE: 5000,
  UPDATE_INTERVAL: 100, // Faster updates for IMU (was 1000ms)
  HEADING_UPDATE_INTERVAL: 50, // IMU heading updates (20 FPS)
  GPS_TIMEOUT: 27000,
  NEARBY_THRESHOLD: 50,
  MID_RANGE: 200,
  FAR_RANGE: 1000,
  FOV: 60,
  HEADING_SMOOTHING: 0.15, // Exponential moving average alpha
  CALIBRATION_VARIANCE_THRESHOLD: 15, // degrees - if variance > this, show calibration hint
};

// ============================================================================
// POI DATA - Complete with Palace Museum
// ============================================================================

const POIS = [
  // Original POIs
  {
    id: 'clock-tower',
    name: 'Clock Tower',
    lat: 22.2946,
    lng: 114.1699,
    year: 1915,
    description: 'Former railway terminus',
    category: 'landmark',
    range: 'mid'
  },
  {
    id: 'star-ferry-tst',
    name: 'Star Ferry (TST)',
    lat: 22.2937,
    lng: 114.1703,
    year: 1888,
    description: 'Iconic ferry service',
    category: 'transport',
    range: 'mid'
  },
  {
    id: 'avenue-stars',
    name: 'Avenue of Stars',
    lat: 22.2930,
    lng: 114.1730,
    year: 2004,
    description: 'HK film industry tribute',
    category: 'landmark',
    range: 'mid'
  },
  // Victoria Harbour Skyline POIs
  {
    id: 'ifc',
    name: 'IFC Tower',
    lat: 22.2855,
    lng: 114.1588,
    year: 2003,
    description: 'International Finance Centre • 412m',
    category: 'landmark',
    range: 'far',
    elevation: 412
  },
  {
    id: 'icc',
    name: 'ICC',
    lat: 22.3069,
    lng: 114.1617,
    year: 2010,
    description: 'Intl Commerce Centre • 484m',
    category: 'landmark',
    range: 'far',
    elevation: 484
  },
  {
    id: 'palace-museum',
    name: 'Hong Kong Palace Museum',
    lat: 22.3015,
    lng: 114.1603,
    year: 2022,
    description: 'Chinese imperial art & culture',
    category: 'museum',
    range: 'mid',
    elevation: 40
  },
  {
    id: 'palace-museum',
    name: 'Hong Kong Palace Museum',
    lat: 22.3016,
    lng: 114.1600,
    year: 2022,
    description: 'Chinese art & culture',
    category: 'museum',
    range: 'mid'
  },
  {
    id: 'mplus',
    name: 'M+ Museum',
    lat: 22.3030,
    lng: 114.1605,
    year: 2021,
    description: 'Visual culture museum',
    category: 'museum',
    range: 'mid'
  },
  {
    id: 'xiqu',
    name: 'Xiqu Centre',
    lat: 22.3049,
    lng: 114.1689,
    year: 2019,
    description: 'Chinese opera & performance',
    category: 'arts',
    range: 'mid'
  },
  {
    id: 'star-ferry-central',
    name: 'Star Ferry (Central)',
    lat: 22.2820,
    lng: 114.1586,
    year: 1888,
    description: 'Central pier terminal',
    category: 'transport',
    range: 'mid'
  }
];

// ============================================================================
// PRESET LOCATIONS - West Kowloon Added
// ============================================================================

const PRESETS = {
  'wkcd-freespace': {
    name: 'West Kowloon Freespace',
    lat: 22.3045,
    lng: 114.1595,
    heading: 105, // Facing Victoria Harbour
    description: 'WKCD lawn facing Victoria Harbour skyline'
  },
  'freespace': {
    name: 'West Kowloon (Alt)',
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
// ORIENTATION MANAGER - IMU/Compass Heading
// ============================================================================

const OrientationManager = {
  // State
  currentHeading: 0,
  smoothedHeading: 0,
  headingSource: 'none', // 'webkit', 'absolute', 'geolocation', 'manual', 'none'
  calibrationState: 'unknown', // 'good', 'poor', 'unknown'
  isCalibrating: false,
  permissionGranted: false,
  headingHistory: [],
  maxHistorySize: 10,
  
  // Callbacks
  onHeadingChange: null,
  onCalibrationChange: null,
  
  // Initialize
  async init(onHeadingCallback, onCalibrationCallback) {
    this.onHeadingChange = onHeadingCallback;
    this.onCalibrationChange = onCalibrationCallback;
    
    console.log('🧭 OrientationManager initializing...');
    
    // Check if iOS 13+ permission required
    if (typeof DeviceOrientationEvent !== 'undefined' && 
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      console.log('📱 iOS 13+ detected - permission required');
      this.showPermissionUI();
      return;
    }
    
    // Start listening for orientation events
    this.startListening();
  },
  
  // Show iOS permission button
  showPermissionUI() {
    const permissionBtn = document.getElementById('motion-permission-btn');
    const permissionOverlay = document.getElementById('motion-permission-overlay');
    
    if (permissionOverlay) {
      permissionOverlay.classList.remove('hidden');
    }
    
    if (permissionBtn) {
      permissionBtn.addEventListener('click', async () => {
        try {
          const permission = await DeviceOrientationEvent.requestPermission();
          if (permission === 'granted') {
            this.permissionGranted = true;
            if (permissionOverlay) {
              permissionOverlay.classList.add('hidden');
            }
            this.startListening();
            showSuccess('✅ Motion permission granted');
          } else {
            showError('Motion permission denied. App will use manual controls.');
          }
        } catch (error) {
          console.error('Permission request failed:', error);
          showError('Could not request motion permission');
        }
      });
    }
  },
  
  // Start listening to device orientation
  startListening() {
    console.log('👂 Starting orientation listeners...');
    
    // Primary: DeviceOrientation with compass heading (iOS Safari)
    window.addEventListener('deviceorientation', (event) => {
      this.handleDeviceOrientation(event);
    }, true);
    
    // Fallback: DeviceOrientationAbsolute
    window.addEventListener('deviceorientationabsolute', (event) => {
      this.handleDeviceOrientationAbsolute(event);
    }, true);
    
    // Geolocation heading (moving only)
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => this.handleGeolocationHeading(position),
        null,
        { enableHighAccuracy: true }
      );
    }
    
    // Start update loop
    setInterval(() => this.updateLoop(), CONFIG.HEADING_UPDATE_INTERVAL);
    
    console.log('✅ Orientation listeners active');
  },
  
  // Handle DeviceOrientation (iOS webkit compass)
  handleDeviceOrientation(event) {
    // iOS provides webkitCompassHeading
    if (event.webkitCompassHeading !== undefined && event.webkitCompassHeading !== null) {
      this.currentHeading = event.webkitCompassHeading;
      this.headingSource = 'webkit';
      this.addToHistory(this.currentHeading);
      return;
    }
    
    // Standard alpha/beta/gamma
    if (event.alpha !== null) {
      // Convert alpha to compass heading (0-360)
      // alpha: 0 = North, increases clockwise
      let heading = event.alpha;
      
      // Adjust for device orientation
      if (event.absolute) {
        heading = 360 - heading; // Convert to true north
      }
      
      this.currentHeading = this.normalizeHeading(heading);
      this.headingSource = 'absolute';
      this.addToHistory(this.currentHeading);
    }
  },
  
  // Handle DeviceOrientationAbsolute
  handleDeviceOrientationAbsolute(event) {
    if (event.alpha !== null && this.headingSource !== 'webkit') {
      let heading = 360 - event.alpha; // True north
      this.currentHeading = this.normalizeHeading(heading);
      this.headingSource = 'absolute';
      this.addToHistory(this.currentHeading);
    }
  },
  
  // Handle Geolocation heading (coarse fallback)
  handleGeolocationHeading(position) {
    if (position.coords.heading !== null && 
        position.coords.heading !== undefined &&
        this.headingSource === 'none') {
      this.currentHeading = position.coords.heading;
      this.headingSource = 'geolocation';
      this.addToHistory(this.currentHeading);
    }
  },
  
  // Update loop - smoothing and calibration
  updateLoop() {
    if (this.currentHeading === null) return;
    
    // Apply smoothing
    const smoothed = this.smoothHeading(this.currentHeading);
    this.smoothedHeading = smoothed;
    
    // Check calibration quality
    this.checkCalibration();
    
    // Callback
    if (this.onHeadingChange) {
      this.onHeadingChange(this.smoothedHeading, this.headingSource);
    }
  },
  
  // Smooth heading with exponential moving average
  smoothHeading(newHeading) {
    const oldHeading = this.smoothedHeading;
    
    // Handle wrap-around (359° → 0°)
    let diff = newHeading - oldHeading;
    
    if (Math.abs(diff) > 180) {
      if (diff > 0) {
        diff -= 360;
      } else {
        diff += 360;
      }
    }
    
    // Exponential moving average
    const smoothed = oldHeading + (CONFIG.HEADING_SMOOTHING * diff);
    
    return this.normalizeHeading(smoothed);
  },
  
  // Normalize heading to [0, 360)
  normalizeHeading(heading) {
    while (heading < 0) heading += 360;
    while (heading >= 360) heading -= 360;
    return heading;
  },
  
  // Add to history for variance calculation
  addToHistory(heading) {
    this.headingHistory.push(heading);
    if (this.headingHistory.length > this.maxHistorySize) {
      this.headingHistory.shift();
    }
  },
  
  // Check calibration quality
  checkCalibration() {
    if (this.headingHistory.length < 5) return;
    
    // Calculate variance
    const mean = this.headingHistory.reduce((a, b) => a + b, 0) / this.headingHistory.length;
    const variance = this.headingHistory.reduce((sum, h) => {
      const diff = h - mean;
      return sum + (diff * diff);
    }, 0) / this.headingHistory.length;
    
    const stdDev = Math.sqrt(variance);
    
    // Update calibration state
    const oldState = this.calibrationState;
    
    if (stdDev > CONFIG.CALIBRATION_VARIANCE_THRESHOLD) {
      this.calibrationState = 'poor';
    } else {
      this.calibrationState = 'good';
    }
    
    // Callback if changed
    if (oldState !== this.calibrationState && this.onCalibrationChange) {
      this.onCalibrationChange(this.calibrationState);
    }
  },
  
  // Get current heading
  getHeading() {
    return this.smoothedHeading;
  },
  
  // Set manual heading (demo mode)
  setManualHeading(heading) {
    this.currentHeading = heading;
    this.smoothedHeading = heading;
    this.headingSource = 'manual';
  },
  
  // Get heading source
  getSource() {
    return this.headingSource;
  }
};

// ============================================================================
// DEMO CONTROLLER - Mux Live vs Simulated
// ============================================================================

const DemoController = {
  mode: 'live',
  simLat: null,
  simLng: null,
  simHeading: 0,
  livePosition: null,
  
  init() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'demo') {
      this.mode = 'demo';
      this.simLat = parseFloat(params.get('lat')) || 22.3045;
      this.simLng = parseFloat(params.get('lng')) || 114.1595;
      this.simHeading = parseFloat(params.get('hdg')) || 105;
    }
  },
  
  setMode(mode) {
    this.mode = mode;
  },
  
  setDemo(lat, lng, heading) {
    this.simLat = lat;
    this.simLng = lng;
    this.simHeading = heading;
    OrientationManager.setManualHeading(heading);
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
      return {
        lat: this.simLat,
        lng: this.simLng,
        accuracy: 10
      };
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

let userPosition = null;
let arReady = false;
let nearbyPOICount = 0;
let visiblePOIs = new Set();
let poiEntities = new Map(); // Track created entities

// ============================================================================
// DOM ELEMENTS
// ============================================================================

const loadingOverlay = document.getElementById('loading-overlay');
const loadingStatus = document.getElementById('loading-status');
const skipLoadingBtn = document.getElementById('skip-loading');
const gpsAccuracy = document.getElementById('gps-accuracy');
const gpsCoords = document.getElementById('gps-coords');
const headingInfo = document.getElementById('heading-info');
const instructions = document.getElementById('instructions');
const closeInstructionsBtn = document.getElementById('close-instructions');
const poiCounter = document.getElementById('poi-counter');
const poiCountElement = document.getElementById('poi-count');
const modeToggle = document.getElementById('mode-toggle');
const presetPicker = document.getElementById('preset-picker');
const manualLat = document.getElementById('manual-lat');
const manualLng = document.getElementById('manual-lng');
const manualHeading = document.getElementById('manual-heading');
const applyManualBtn = document.getElementById('apply-manual');

// ============================================================================
// INITIALIZE
// ============================================================================

window.addEventListener('DOMContentLoaded', init);

async function init() {
  console.log('🚀 Sightline WebAR IMU Enhanced - Initializing...');
  
  DemoController.init();
  setupControls();
  
  // Initialize Orientation Manager
  await OrientationManager.init(
    onHeadingUpdate,
    onCalibrationUpdate
  );
  
  // Check if demo mode
  if (DemoController.mode === 'demo') {
    console.log('🎭 Demo mode activated');
    updateLoadingStatus('Demo mode - GPS-free!');
    setTimeout(() => {
      loadingOverlay.classList.add('hidden');
      initDemoMode();
    }, 1000);
    return;
  }
  
  // Live GPS flow
  updateLoadingStatus('Requesting camera & GPS...');
  
  const scene = document.querySelector('a-scene');
  if (scene) {
    scene.addEventListener('loaded', () => {
      console.log('📦 A-Frame scene loaded');
      updateLoadingStatus('Starting AR camera...');
    });
    
    scene.addEventListener('renderstart', () => {
      console.log('🎥 Camera rendering started');
      onARReady();
    });
  }
  
  window.addEventListener('gps-camera-ready', onARReady);
  window.addEventListener('gps-camera-update-position', onGPSUpdate);
  window.addEventListener('gps-camera-error', onGPSError);
  
  // Skip button
  setTimeout(() => {
    if (!arReady && skipLoadingBtn) {
      skipLoadingBtn.style.display = 'block';
    }
  }, 5000);
  
  if (skipLoadingBtn) {
    skipLoadingBtn.addEventListener('click', () => {
      loadingOverlay.classList.add('hidden');
      offerDemoMode();
    });
  }
  
  // Start update loops
  setInterval(updateDistances, CONFIG.UPDATE_INTERVAL);
  setInterval(updateVisibilityAndHints, 500); // Faster for IMU responsiveness
  
  console.log('✅ Initialization complete');
}

// ============================================================================
// HEADING UPDATE CALLBACK
// ============================================================================

function onHeadingUpdate(heading, source) {
  // Update heading display
  if (headingInfo) {
    headingInfo.textContent = `Heading: ${Math.round(heading)}° (${source})`;
  }
  
  // Update POI positions in demo mode
  if (DemoController.mode === 'demo') {
    updateAllPOIPositions();
  }
  
  // Update visibility (for FOV filtering)
  updateVisibilityAndHints();
}

// ============================================================================
// CALIBRATION UPDATE CALLBACK
// ============================================================================

function onCalibrationUpdate(state) {
  const calibrationToast = document.getElementById('calibration-toast');
  
  if (state === 'poor' && calibrationToast) {
    calibrationToast.classList.remove('hidden');
    calibrationToast.textContent = '🧭 Compass low confidence—move phone in a figure-8 to calibrate';
  } else if (calibrationToast) {
    calibrationToast.classList.add('hidden');
  }
}

// ============================================================================
// SETUP CONTROLS
// ============================================================================

function setupControls() {
  if (modeToggle) {
    modeToggle.addEventListener('change', (e) => {
      const newMode = e.target.checked ? 'demo' : 'live';
      switchMode(newMode);
    });
    modeToggle.checked = (DemoController.mode === 'demo');
  }
  
  if (presetPicker) {
    presetPicker.addEventListener('change', (e) => {
      const presetKey = e.target.value;
      if (presetKey && PRESETS[presetKey]) {
        const preset = DemoController.loadPreset(presetKey);
        if (manualLat) manualLat.value = preset.lat;
        if (manualLng) manualLng.value = preset.lng;
        if (manualHeading) manualHeading.value = preset.heading;
        applyDemo();
        showSuccess(`📍 Loaded: ${preset.name}`);
      }
    });
  }
  
  if (applyManualBtn) {
    applyManualBtn.addEventListener('click', applyDemo);
  }
  
  if (closeInstructionsBtn) {
    closeInstructionsBtn.addEventListener('click', () => {
      instructions.classList.add('hidden');
    });
  }
  
  const helpButton = document.getElementById('help-button');
  if (helpButton) {
    helpButton.addEventListener('click', () => {
      if (instructions) {
        instructions.classList.remove('hidden');
      }
    });
  }
}

function switchMode(newMode) {
  DemoController.setMode(newMode);
  
  if (newMode === 'demo') {
    initDemoMode();
    showSuccess('🎭 Demo mode active');
  } else {
    showSuccess('📡 Live GPS mode');
    setTimeout(() => location.reload(), 1000);
  }
}

function initDemoMode() {
  arReady = true;
  
  if (!DemoController.simLat || !DemoController.simLng) {
    DemoController.loadPreset('wkcd-freespace');
  }
  
  if (manualLat) manualLat.value = DemoController.simLat;
  if (manualLng) manualLng.value = DemoController.simLng;
  if (manualHeading) manualHeading.value = DemoController.simHeading;
  
  createDemoScene();
  
  const pos = DemoController.getCurrentPosition();
  userPosition = pos;
  updateGPSDisplay(pos.lat, pos.lng, pos.accuracy);
  
  updateDistances();
  updateVisibilityAndHints();
}

function applyDemo() {
  const lat = parseFloat(manualLat.value);
  const lng = parseFloat(manualLng.value);
  const hdg = parseFloat(manualHeading.value) || 0;
  
  if (isNaN(lat) || isNaN(lng)) {
    showError('Invalid coordinates');
    return;
  }
  
  DemoController.setDemo(lat, lng, hdg);
  userPosition = DemoController.getCurrentPosition();
  updateGPSDisplay(lat, lng, 10);
  updateAllPOIPositions();
  updateDistances();
  updateVisibilityAndHints();
  showSuccess('✅ Position updated');
}

function offerDemoMode() {
  if (confirm('GPS not available. Switch to Demo Mode?')) {
    DemoController.setMode('demo');
    if (modeToggle) modeToggle.checked = true;
    initDemoMode();
  }
}

// ============================================================================
// DEMO SCENE CREATION
// ============================================================================

function createDemoScene() {
  const scene = document.querySelector('a-scene');
  if (!scene) return;
  
  const existingCamera = scene.querySelector('[gps-camera]');
  if (existingCamera) {
    existingCamera.parentNode.removeChild(existingCamera);
  }
  
  let camera = scene.querySelector('a-camera');
  if (!camera) {
    camera = document.createElement('a-camera');
    camera.setAttribute('position', '0 1.6 0');
    camera.setAttribute('look-controls', 'enabled: false'); // Disable manual look
    scene.appendChild(camera);
  }
  
  POIS.forEach(poi => {
    createPOIEntity(poi);
  });
  
  console.log('🎬 Demo scene created with', POIS.length, 'POIs');
}

// ============================================================================
// POI ENTITY CREATION - Fixed Card Rendering
// ============================================================================

function createPOIEntity(poi) {
  const scene = document.querySelector('a-scene');
  if (!scene) return;
  
  if (poiEntities.has(poi.id)) {
    updatePOIPosition(poi);
    return;
  }
  
  const entity = document.createElement('a-entity');
  entity.id = `poi-${poi.id}`;
  entity.classList.add('poi-card');
  entity.setAttribute('data-poi-id', poi.id);
  
  const cardColor = getCategoryColor(poi.category);
  const isFar = poi.range === 'far';
  const cardWidth = isFar ? 20 : 10;
  const cardHeight = isFar ? 10 : 5;
  
  // Background plane - white, semi-transparent
  const bg = document.createElement('a-plane');
  bg.setAttribute('width', cardWidth.toString());
  bg.setAttribute('height', cardHeight.toString());
  bg.setAttribute('color', '#ffffff');
  bg.setAttribute('opacity', '0.95');
  bg.setAttribute('shader', 'flat');
  entity.appendChild(bg);
  
  // Title - BLACK text on white background
  const title = document.createElement('a-text');
  title.setAttribute('value', poi.name);
  title.setAttribute('color', '#000000');
  title.setAttribute('align', 'center');
  title.setAttribute('anchor', 'center');
  title.setAttribute('width', (cardWidth * 0.9).toString());
  title.setAttribute('position', `0 ${isFar ? '3' : '1.5'} 0.01`);
  title.setAttribute('shader', 'msdf');
  title.setAttribute('font', 'https://cdn.aframe.io/fonts/Roboto-msdf.json');
  entity.appendChild(title);
  
  // Description - DARK GRAY text
  const desc = document.createElement('a-text');
  desc.setAttribute('value', poi.description);
  desc.setAttribute('color', '#333333');
  desc.setAttribute('align', 'center');
  desc.setAttribute('anchor', 'center');
  desc.setAttribute('width', (cardWidth * 0.8).toString());
  desc.setAttribute('position', `0 ${isFar ? '0.5' : '0'} 0.01`);
  desc.setAttribute('shader', 'msdf');
  desc.setAttribute('font', 'https://cdn.aframe.io/fonts/Roboto-msdf.json');
  entity.appendChild(desc);
  
  // Distance label - COLORED text
  const distLabel = document.createElement('a-text');
  distLabel.setAttribute('value', '---');
  distLabel.setAttribute('color', cardColor);
  distLabel.setAttribute('align', 'center');
  distLabel.setAttribute('anchor', 'center');
  distLabel.setAttribute('width', (cardWidth * 0.7).toString());
  distLabel.setAttribute('position', `0 ${isFar ? '-2.5' : '-1.5'} 0.01`);
  distLabel.setAttribute('class', 'distance-text');
  distLabel.setAttribute('shader', 'msdf');
  distLabel.setAttribute('font', 'https://cdn.aframe.io/fonts/Roboto-msdf.json');
  distLabel.id = `distance-${poi.id}`;
  entity.appendChild(distLabel);
  
  // Year badge
  if (poi.year) {
    const yearBadge = document.createElement('a-circle');
    yearBadge.setAttribute('radius', isFar ? '1.2' : '0.8');
    yearBadge.setAttribute('color', cardColor);
    yearBadge.setAttribute('position', `${isFar ? (cardWidth/2 - 1.5) : (cardWidth/2 - 1)} ${isFar ? '3.5' : '2'} 0.01`);
    entity.appendChild(yearBadge);
    
    const yearText = document.createElement('a-text');
    yearText.setAttribute('value', poi.year.toString());
    yearText.setAttribute('color', '#ffffff');
    yearText.setAttribute('align', 'center');
    yearText.setAttribute('anchor', 'center');
    yearText.setAttribute('width', isFar ? '4' : '3');
    yearText.setAttribute('position', `${isFar ? (cardWidth/2 - 1.5) : (cardWidth/2 - 1)} ${isFar ? '3.5' : '2'} 0.02`);
    yearText.setAttribute('shader', 'msdf');
    yearText.setAttribute('font', 'https://cdn.aframe.io/fonts/Roboto-msdf.json');
    entity.appendChild(yearText);
  }
  
  // Billboard (always face camera)
  entity.setAttribute('look-at', '[camera]');
  
  scene.appendChild(entity);
  poiEntities.set(poi.id, entity);
  
  updatePOIPosition(poi);
}

// ============================================================================
// UPDATE POI POSITION
// ============================================================================

function updatePOIPosition(poi) {
  const entity = poiEntities.get(poi.id);
  if (!entity) return;
  
  const pos = DemoController.getCurrentPosition();
  if (!pos) return;
  
  const distance = calculateDistance(pos.lat, pos.lng, poi.lat, poi.lng);
  const bearing = calculateBearing(pos.lat, pos.lng, poi.lat, poi.lng);
  const heading = DemoController.getHeading();
  
  const relativeBearing = (bearing - heading + 360) % 360;
  const angleRad = (relativeBearing * Math.PI) / 180;
  
  const scaledDist = Math.min(distance, 500);
  const x = Math.sin(angleRad) * scaledDist;
  const z = -Math.cos(angleRad) * scaledDist;
  
  let y = 10;
  if (poi.range === 'far' && distance > CONFIG.FAR_RANGE) {
    y = 50 + (poi.elevation || 200) / 10;
  } else if (distance > CONFIG.MID_RANGE) {
    y = 20;
  }
  
  entity.setAttribute('position', `${x} ${y} ${z}`);
  entity.setAttribute('visible', distance <= CONFIG.MAX_DISTANCE);
  
  const distLabel = document.getElementById(`distance-${poi.id}`);
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

function updateAllPOIPositions() {
  POIS.forEach(poi => updatePOIPosition(poi));
}

// ============================================================================
// AR READY
// ============================================================================

function onARReady() {
  console.log('✅ AR Ready');
  arReady = true;
  updateLoadingStatus('AR initialized!');
  
  setTimeout(() => {
    loadingOverlay.classList.add('hidden');
    showSuccess('AR Ready! Turn to discover landmarks.');
  }, 500);
}

setTimeout(() => {
  if (!arReady) {
    console.warn('⚠️ AR timeout');
    loadingOverlay.classList.add('hidden');
    offerDemoMode();
  }
}, 15000);

// ============================================================================
// GPS HANDLERS
// ============================================================================

function onGPSUpdate(event) {
  const { position, accuracy } = event.detail;
  DemoController.updateLivePosition(position, accuracy);
  userPosition = position;
  updateGPSDisplay(position.latitude, position.longitude, accuracy);
  updateDistances();
}

function onGPSError(event) {
  console.error('❌ GPS Error:', event.detail);
  showError('GPS signal lost. Try demo mode.');
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
      updatePOIPosition(poi);
    }
    
    if (distance <= CONFIG.MAX_DISTANCE) {
      nearbyPOICount++;
    }
  });
  
  if (poiCountElement) {
    poiCountElement.textContent = nearbyPOICount;
  }
}

// ============================================================================
// VISIBILITY & GHOST HINTS
// ============================================================================

function updateVisibilityAndHints() {
  const pos = DemoController.getCurrentPosition();
  const heading = DemoController.getHeading();
  if (!pos) return;
  
  visiblePOIs.clear();
  const offScreenPOIs = [];
  
  POIS.forEach(poi => {
    const distance = calculateDistance(pos.lat, pos.lng, poi.lat, poi.lng);
    if (distance > CONFIG.MAX_DISTANCE) return;
    
    const bearing = calculateBearing(pos.lat, pos.lng, poi.lat, poi.lng);
    const relativeBearing = (bearing - heading + 360) % 360;
    
    const inFOV = relativeBearing < CONFIG.FOV/2 || relativeBearing > (360 - CONFIG.FOV/2);
    
    if (inFOV) {
      visiblePOIs.add(poi.id);
    } else {
      let direction = relativeBearing > 180 ? 'left' : 'right';
      let distText = distance >= 1000 ? `${(distance/1000).toFixed(1)} km` : `${Math.round(distance)}m`;
      
      offScreenPOIs.push({
        name: poi.name,
        distance: distText,
        direction,
        bearing: relativeBearing
      });
    }
  });
  
  updateGhostHints(offScreenPOIs);
  
  const emptyState = document.getElementById('empty-state');
  if (emptyState) {
    if (visiblePOIs.size === 0 && nearbyPOICount > 0) {
      emptyState.classList.remove('hidden');
    } else {
      emptyState.classList.add('hidden');
    }
  }
}

function updateGhostHints(offScreenPOIs) {
  const ghostHints = document.getElementById('ghost-hints');
  if (!ghostHints) return;
  
  ghostHints.innerHTML = '';
  
  if (offScreenPOIs.length === 0) {
    ghostHints.classList.add('hidden');
    return;
  }
  
  ghostHints.classList.remove('hidden');
  
  offScreenPOIs.slice(0, 3).forEach((poi, idx) => {
    const hint = document.createElement('div');
    hint.className = `ghost-hint ghost-${poi.direction}`;
    hint.style.top = `${130 + idx * 60}px`;
    
    const arrow = poi.direction === 'left' ? '←' : '→';
    hint.innerHTML = `${arrow} ${poi.name} • ${poi.distance}`;
    
    ghostHints.appendChild(hint);
  });
}

// ============================================================================
// UI UPDATES
// ============================================================================

function updateLoadingStatus(message) {
  if (loadingStatus) {
    loadingStatus.textContent = message;
  }
}

function updateGPSDisplay(lat, lng, accuracy) {
  if (gpsCoords) {
    gpsCoords.textContent = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }
  
  if (gpsAccuracy) {
    let color = '#22c55e';
    let status = 'Excellent';
    
    if (accuracy > 30) {
      color = '#eab308';
      status = 'Good';
    }
    if (accuracy > 100) {
      color = '#ef4444';
      status = 'Poor';
    }
    
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
  const existing = document.querySelectorAll('.toast');
  existing.forEach(t => t.remove());
  
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

// ============================================================================
// UTILITIES
// ============================================================================

function getCategoryColor(category) {
  const colors = {
    'landmark': '#3b82f6',
    'transport': '#ef4444',
    'museum': '#8b5cf6',
    'arts': '#ec4899'
  };
  return colors[category] || '#6b7280';
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
    applyDemo();
  },
  loadPreset: (key) => {
    const preset = DemoController.loadPreset(key);
    applyDemo();
    return preset;
  },
  getCalibrationState: () => OrientationManager.calibrationState
};

console.log('✅ Sightline WebAR IMU Enhanced - Ready');
console.log('💡 Debug API: window.SightlineAR');
console.log('🧭 OrientationManager active');

