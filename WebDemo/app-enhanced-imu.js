// Sightline WebAR - IMU Heading + Hands-Free Experience
// Real-time compass/gyro tracking for look-to-aim AR

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  MAX_DISTANCE: 5000, // meters
  UPDATE_INTERVAL: 100, // ms - faster for smooth rotation
  GPS_TIMEOUT: 27000,
  NEARBY_THRESHOLD: 50,
  MID_RANGE: 200,
  FAR_RANGE: 1000,
  FOV: 60, // degrees field of view
  
  // Heading smoothing
  HEADING_SMOOTHING: 0.15, // exponential moving average alpha (0.15 = smooth)
  HEADING_VARIANCE_THRESHOLD: 15, // degrees - if variance > this, show calibration
  
  // Calibration
  CALIBRATION_SAMPLE_SIZE: 20, // samples to calculate variance
};

// ============================================================================
// POI DATA - Enhanced with Victoria Harbour Skyline
// ============================================================================

const POIS = [
  // Original TST POIs
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
  
  // Victoria Harbour Skyline (Far-field)
  {
    id: 'ifc',
    name: 'IFC',
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
    description: 'International Commerce Centre • 484m',
    category: 'landmark',
    range: 'far',
    elevation: 484
  },
  
  // West Kowloon Cultural District
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
    id: 'palace-museum',
    name: 'Hong Kong Palace Museum',
    lat: 22.3011,
    lng: 114.1607,
    year: 2022,
    description: 'Chinese art & culture',
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
  
  // Additional coverage
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
// PRESET LOCATIONS - Enhanced with WKCD Freespace
// ============================================================================

const PRESETS = {
  'wkcd-freespace': {
    name: 'West Kowloon Freespace',
    lat: 22.3045,
    lng: 114.1595,
    heading: 120,
    description: 'Facing Victoria Harbour skyline (IFC, ICC, Palace Museum, M+)'
  },
  'freespace': { // Legacy alias
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
// ORIENTATION MANAGER - IMU/Compass Tracking
// ============================================================================

const OrientationManager = {
  currentHeading: 0,
  smoothedHeading: 0,
  headingSamples: [],
  headingSource: 'none', // 'webkit', 'absolute', 'geo', 'none'
  
  isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
  permissionGranted: false,
  permissionRequired: false,
  
  calibrationState: 'unknown', // 'good', 'poor', 'unknown'
  
  listeners: [],
  
  init() {
    console.log('🧭 Initializing OrientationManager...');
    
    // Check if permission is required (iOS 13+)
    if (typeof DeviceOrientationEvent !== 'undefined' && 
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      this.permissionRequired = true;
      console.log('📱 iOS - Permission required for motion sensors');
      return; // Will request permission via button
    }
    
    this.startListening();
  },
  
  async requestPermission() {
    if (!this.permissionRequired) {
      this.startListening();
      return true;
    }
    
    try {
      const response = await DeviceOrientationEvent.requestPermission();
      if (response === 'granted') {
        this.permissionGranted = true;
        this.startListening();
        console.log('✅ Motion permission granted');
        return true;
      } else {
        console.warn('⚠️ Motion permission denied');
        return false;
      }
    } catch (error) {
      console.error('❌ Permission request failed:', error);
      return false;
    }
  },
  
  startListening() {
    console.log('👂 Starting orientation listeners...');
    
    // iOS webkit compass heading (most reliable on iOS)
    window.addEventListener('deviceorientation', (event) => {
      // iOS provides webkitCompassHeading directly
      if (event.webkitCompassHeading !== undefined && event.webkitCompassHeading !== null) {
        const heading = event.webkitCompassHeading;
        this.headingSource = 'webkit';
        this.updateHeading(heading);
        return;
      }
      
      // Absolute orientation (Android & modern iOS)
      if (event.absolute && event.alpha !== null) {
        // Convert alpha to compass heading
        // alpha: 0° = North, 90° = East, 180° = South, 270° = West
        let heading = 360 - event.alpha;
        if (heading >= 360) heading -= 360;
        this.headingSource = 'absolute';
        this.updateHeading(heading);
        return;
      }
    }, true);
    
    // Geolocation heading fallback (when moving)
    navigator.geolocation.watchPosition((position) => {
      if (position.coords.heading !== null && position.coords.heading !== undefined) {
        // Only use if no other source available or user is moving
        if (this.headingSource === 'none' || position.coords.speed > 1) {
          this.headingSource = 'geo';
          this.updateHeading(position.coords.heading);
        }
      }
    }, null, {
      enableHighAccuracy: true,
      maximumAge: 1000
    });
    
    console.log('✅ Orientation listeners active');
  },
  
  updateHeading(rawHeading) {
    // Store raw heading
    this.currentHeading = rawHeading;
    
    // Add to samples for variance calculation
    this.headingSamples.push(rawHeading);
    if (this.headingSamples.length > CONFIG.CALIBRATION_SAMPLE_SIZE) {
      this.headingSamples.shift();
    }
    
    // Calculate variance for calibration state
    this.updateCalibrationState();
    
    // Apply smoothing with wrap-around handling
    this.smoothedHeading = this.smoothHeading(rawHeading, this.smoothedHeading);
    
    // Notify listeners
    this.notifyListeners(this.smoothedHeading);
  },
  
  smoothHeading(newHeading, oldHeading) {
    if (oldHeading === 0 && this.smoothedHeading === 0) {
      // First update
      return newHeading;
    }
    
    let delta = newHeading - oldHeading;
    
    // Wrap-around handling
    if (delta > 180) {
      delta -= 360;
    } else if (delta < -180) {
      delta += 360;
    }
    
    // Exponential moving average
    let smoothed = oldHeading + (CONFIG.HEADING_SMOOTHING * delta);
    
    // Normalize to [0, 360)
    if (smoothed < 0) smoothed += 360;
    if (smoothed >= 360) smoothed -= 360;
    
    return smoothed;
  },
  
  updateCalibrationState() {
    if (this.headingSamples.length < CONFIG.CALIBRATION_SAMPLE_SIZE) {
      this.calibrationState = 'unknown';
      return;
    }
    
    // Calculate variance
    const mean = this.headingSamples.reduce((a, b) => a + b, 0) / this.headingSamples.length;
    const variance = this.headingSamples.reduce((sum, val) => {
      let diff = val - mean;
      // Handle wrap-around in variance calculation
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      return sum + (diff * diff);
    }, 0) / this.headingSamples.length;
    
    const stdDev = Math.sqrt(variance);
    
    if (stdDev > CONFIG.HEADING_VARIANCE_THRESHOLD) {
      this.calibrationState = 'poor';
    } else {
      this.calibrationState = 'good';
    }
  },
  
  getHeading() {
    return this.smoothedHeading;
  },
  
  getSource() {
    return this.headingSource;
  },
  
  getCalibrationState() {
    return this.calibrationState;
  },
  
  onHeadingChange(callback) {
    this.listeners.push(callback);
  },
  
  notifyListeners(heading) {
    this.listeners.forEach(callback => callback(heading));
  }
};

// ============================================================================
// DEMO CONTROLLER - Live GPS vs Simulated
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
      this.simHeading = parseFloat(params.get('hdg')) || 120;
    }
  },
  
  setMode(mode) {
    this.mode = mode;
  },
  
  setDemo(lat, lng, heading) {
    this.simLat = lat;
    this.simLng = lng;
    this.simHeading = heading;
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
let onboardingStep = 0;

// ============================================================================
// DOM ELEMENTS
// ============================================================================

const loadingOverlay = document.getElementById('loading-overlay');
const loadingStatus = document.getElementById('loading-status');
const skipLoadingBtn = document.getElementById('skip-loading');
const gpsAccuracy = document.getElementById('gps-accuracy');
const gpsCoords = document.getElementById('gps-coords');
const headingDisplay = document.getElementById('heading-display');
const calibrationToast = document.getElementById('calibration-toast');
const permissionBtn = document.getElementById('permission-btn');
const instructions = document.getElementById('instructions');
const closeInstructionsBtn = document.getElementById('close-instructions');
const poiCounter = document.getElementById('poi-counter');
const poiCountElement = document.getElementById('poi-count');
const helpButton = document.getElementById('help-button');
const onboardingCoach = document.getElementById('onboarding-coach');
const coachMessage = document.getElementById('coach-message');
const coachNext = document.getElementById('coach-next');
const emptyState = document.getElementById('empty-state');
const ghostHints = document.getElementById('ghost-hints');

// Control elements (demo mode)
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

function init() {
  console.log('🚀 Sightline WebAR - IMU Enhanced');
  
  DemoController.init();
  
  // Check if iOS permission required
  if (OrientationManager.permissionRequired && !OrientationManager.permissionGranted) {
    showPermissionUI();
    return;
  }
  
  // Start orientation tracking
  OrientationManager.init();
  
  // Setup controls
  setupControls();
  setupHeadingListener();
  
  // Demo mode?
  if (DemoController.mode === 'demo') {
    updateLoadingStatus('Demo mode - no GPS needed');
    setTimeout(() => {
      loadingOverlay.classList.add('hidden');
      initDemoMode();
    }, 1000);
    return;
  }
  
  // Live GPS mode
  updateLoadingStatus('Requesting camera & GPS...');
  
  const scene = document.querySelector('a-scene');
  if (scene) {
    scene.addEventListener('loaded', () => {
      console.log('📦 A-Frame scene loaded');
      updateLoadingStatus('Starting AR camera...');
    });
    
    scene.addEventListener('renderstart', () => {
      console.log('🎥 Camera rendering');
      onARReady();
    });
  }
  
  window.addEventListener('gps-camera-ready', () => {
    console.log('📡 GPS Camera Ready');
    onARReady();
  });
  
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
  
  // Update loops
  setInterval(updateDistances, CONFIG.UPDATE_INTERVAL);
  setInterval(updateVisibilityAndHints, 500); // Fast for heading changes
  setInterval(updateCalibrationUI, 2000);
  
  // Onboarding
  if (!localStorage.getItem('sightline-onboarded')) {
    setTimeout(() => showOnboarding(), 2000);
  }
}

// ============================================================================
// iOS PERMISSION UI
// ============================================================================

function showPermissionUI() {
  if (loadingStatus) {
    loadingStatus.textContent = 'Motion sensors required for AR';
  }
  
  if (permissionBtn) {
    permissionBtn.style.display = 'block';
    permissionBtn.addEventListener('click', async () => {
      const granted = await OrientationManager.requestPermission();
      if (granted) {
        permissionBtn.style.display = 'none';
        init(); // Restart initialization
      } else {
        showError('Motion permission denied. Enable in Settings → Safari → Motion & Orientation');
      }
    });
  }
}

// ============================================================================
// CONTROLS SETUP
// ============================================================================

function setupControls() {
  // Mode toggle
  if (modeToggle) {
    modeToggle.addEventListener('change', (e) => {
      const newMode = e.target.checked ? 'demo' : 'live';
      switchMode(newMode);
    });
    modeToggle.checked = (DemoController.mode === 'demo');
  }
  
  // Preset picker
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
  
  // Apply manual
  if (applyManualBtn) {
    applyManualBtn.addEventListener('click', applyDemo);
  }
  
  // Instructions
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
  
  // Onboarding
  if (coachNext) {
    coachNext.addEventListener('click', nextOnboardingStep);
  }
}

function setupHeadingListener() {
  OrientationManager.onHeadingChange((heading) => {
    // Update heading display
    if (headingDisplay) {
      const direction = getCompassDirection(heading);
      headingDisplay.textContent = `${Math.round(heading)}° ${direction}`;
    }
    
    // Update POI visibility based on new heading
    updateVisibilityAndHints();
  });
}

function getCompassDirection(heading) {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(heading / 45) % 8;
  return directions[index];
}

// ============================================================================
// MODE SWITCHING
// ============================================================================

function switchMode(newMode) {
  DemoController.setMode(newMode);
  
  if (newMode === 'demo') {
    initDemoMode();
    showSuccess('🎭 Demo mode - simulated position');
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
    scene.appendChild(camera);
  }
  
  POIS.forEach(poi => {
    createPOIEntity(poi);
  });
  
  console.log('🎬 Demo scene created with', POIS.length, 'POIs');
}

function createPOIEntity(poi) {
  const scene = document.querySelector('a-scene');
  if (!scene) return;
  
  if (document.getElementById(`poi-${poi.id}`)) {
    updatePOIPosition(poi);
    return;
  }
  
  const entity = document.createElement('a-entity');
  entity.id = `poi-${poi.id}`;
  entity.classList.add('poi-card');
  entity.setAttribute('data-poi-id', poi.id);
  
  updatePOIPosition(poi);
  
  const cardColor = getCategoryColor(poi.category);
  const isFar = poi.range === 'far';
  
  // Background plane with proper sizing
  const bg = document.createElement('a-plane');
  bg.setAttribute('width', isFar ? '20' : '10');
  bg.setAttribute('height', isFar ? '10' : '5');
  bg.setAttribute('color', '#ffffff');
  bg.setAttribute('opacity', '0.95');
  bg.setAttribute('shader', 'flat'); // Prevent lighting issues
  entity.appendChild(bg);
  
  // Title - MUST be visible
  const title = document.createElement('a-text');
  title.setAttribute('value', poi.name);
  title.setAttribute('color', '#000000');
  title.setAttribute('align', 'center');
  title.setAttribute('width', isFar ? '18' : '9');
  title.setAttribute('position', `0 ${isFar ? '3' : '1.5'} 0.02`);
  title.setAttribute('font', 'roboto');
  title.setAttribute('shader', 'msdf'); // Better text rendering
  entity.appendChild(title);
  
  // Description
  const desc = document.createElement('a-text');
  desc.setAttribute('value', poi.description);
  desc.setAttribute('color', '#666666');
  desc.setAttribute('align', 'center');
  desc.setAttribute('width', isFar ? '16' : '8');
  desc.setAttribute('position', `0 ${isFar ? '1' : '0'} 0.02`);
  desc.setAttribute('shader', 'msdf');
  entity.appendChild(desc);
  
  // Distance label
  const distLabel = document.createElement('a-text');
  distLabel.setAttribute('value', '---');
  distLabel.setAttribute('color', cardColor);
  distLabel.setAttribute('align', 'center');
  distLabel.setAttribute('width', '8');
  distLabel.setAttribute('position', `0 ${isFar ? '-2' : '-1'} 0.02`);
  distLabel.setAttribute('class', 'distance-text');
  distLabel.setAttribute('shader', 'msdf');
  distLabel.id = `distance-${poi.id}`;
  entity.appendChild(distLabel);
  
  // Year badge
  if (poi.year) {
    const yearBadge = document.createElement('a-circle');
    yearBadge.setAttribute('radius', isFar ? '1.2' : '0.8');
    yearBadge.setAttribute('color', cardColor);
    yearBadge.setAttribute('position', `${isFar ? '8' : '4'} ${isFar ? '4' : '2'} 0.02`);
    entity.appendChild(yearBadge);
    
    const yearText = document.createElement('a-text');
    yearText.setAttribute('value', poi.year.toString());
    yearText.setAttribute('color', '#ffffff');
    yearText.setAttribute('align', 'center');
    yearText.setAttribute('width', '4');
    yearText.setAttribute('position', `${isFar ? '8' : '4'} ${isFar ? '4' : '2'} 0.03`);
    yearText.setAttribute('shader', 'msdf');
    entity.appendChild(yearText);
  }
  
  // Billboard behavior
  entity.setAttribute('look-at', '[camera]');
  
  scene.appendChild(entity);
  console.log(`✅ Created POI: ${poi.name}`);
}

function updatePOIPosition(poi) {
  const entity = document.getElementById(`poi-${poi.id}`);
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
  
  let y = 0;
  if (poi.range === 'far' && distance > CONFIG.FAR_RANGE) {
    y = 50 + (poi.elevation || 200) / 10;
  } else if (distance > CONFIG.MID_RANGE) {
    y = 20;
  } else {
    y = 10;
  }
  
  entity.setAttribute('position', `${x} ${y} ${z}`);
  entity.setAttribute('visible', distance <= CONFIG.MAX_DISTANCE);
  
  // Update distance
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
  showError('GPS signal lost');
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
    } else {
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
      let direction = 'right';
      if (relativeBearing > 180) {
        direction = 'left';
      }
      
      let distText;
      if (distance >= 1000) {
        distText = `${(distance / 1000).toFixed(1)} km`;
      } else {
        distText = `${Math.round(distance)}m`;
      }
      
      offScreenPOIs.push({
        name: poi.name,
        distance: distText,
        direction,
        bearing: relativeBearing
      });
    }
  });
  
  updateGhostHints(offScreenPOIs);
  
  if (emptyState) {
    if (visiblePOIs.size === 0 && nearbyPOICount > 0) {
      emptyState.classList.remove('hidden');
    } else {
      emptyState.classList.add('hidden');
    }
  }
}

function updateGhostHints(offScreenPOIs) {
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
    hint.style.top = `${30 + idx * 60}px`;
    
    const arrow = poi.direction === 'left' ? '←' : '→';
    hint.innerHTML = `${arrow} ${poi.name} • ${poi.distance}`;
    
    ghostHints.appendChild(hint);
  });
}

// ============================================================================
// CALIBRATION UI
// ============================================================================

function updateCalibrationUI() {
  const state = OrientationManager.getCalibrationState();
  
  if (calibrationToast) {
    if (state === 'poor') {
      calibrationToast.textContent = '🧭 Compass low confidence—move phone in a figure-8 to calibrate';
      calibrationToast.classList.remove('hidden');
    } else {
      calibrationToast.classList.add('hidden');
    }
  }
}

// ============================================================================
// ONBOARDING
// ============================================================================

const ONBOARDING_STEPS = [
  "Turn your phone slowly—landmarks appear as you look around.",
  "No touching needed. The compass tracks where you're facing.",
  "Cards show name, year, and distance to each landmark."
];

function showOnboarding() {
  if (!onboardingCoach || !coachMessage) return;
  
  onboardingStep = 0;
  coachMessage.textContent = ONBOARDING_STEPS[0];
  onboardingCoach.classList.remove('hidden');
}

function nextOnboardingStep() {
  onboardingStep++;
  
  if (onboardingStep >= ONBOARDING_STEPS.length) {
    onboardingCoach.classList.add('hidden');
    localStorage.setItem('sightline-onboarded', 'true');
    return;
  }
  
  coachMessage.textContent = ONBOARDING_STEPS[onboardingStep];
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
  
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
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
  getOrientationSource: () => OrientationManager.getSource(),
  getCalibrationState: () => OrientationManager.getCalibrationState(),
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
  }
};

console.log('✅ Sightline WebAR IMU - Ready');
console.log('💡 Debug API: window.SightlineAR');
console.log('🧭 Heading source:', OrientationManager.getSource());

