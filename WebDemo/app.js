// Sightline WebAR - Enhanced with Demo Mode & Far-Field Anchoring
// GPS-based AR for Hong Kong landmarks - Works Anywhere

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  MAX_DISTANCE: 5000, // meters - increased for skyline landmarks
  UPDATE_INTERVAL: 1000, // ms - update distance text
  GPS_TIMEOUT: 27000, // ms - GPS timeout
  NEARBY_THRESHOLD: 50, // meters - "nearby" distance
  MID_RANGE: 200, // meters - mid-range threshold
  FAR_RANGE: 1000, // meters - far-range threshold (skyline)
  FOV: 60, // degrees - field of view cone
};

// ============================================================================
// POI DATA - Extended with Skyline Landmarks
// ============================================================================

const POIS = [
  // Original POIs
  {
    id: 'clock-tower',
    name: 'Clock Tower',
    lat: 22.2946,
    lng: 114.1699,
    year: 1915,
    description: 'Former Kowloon-Canton Railway terminus',
    category: 'landmark',
    range: 'mid'
  },
  {
    id: 'star-ferry-tst',
    name: 'Star Ferry (TST)',
    lat: 22.2937,
    lng: 114.1703,
    year: 1888,
    description: 'Iconic ferry service since 1888',
    category: 'transport',
    range: 'mid'
  },
  {
    id: 'avenue-stars',
    name: 'Avenue of Stars',
    lat: 22.2930,
    lng: 114.1730,
    year: 2004,
    description: 'Tribute to HK film industry',
    category: 'landmark',
    range: 'mid'
  },
  // New Skyline POIs
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
    description: 'International Commerce Centre • 484m',
    category: 'landmark',
    range: 'far',
    elevation: 484
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
// PRESET LOCATIONS
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
// DEMO CONTROLLER - Mux Live GPS vs Simulated Position
// ============================================================================

const DemoController = {
  mode: 'live', // 'live' or 'demo'
  simLat: null,
  simLng: null,
  simHeading: 0,
  livePosition: null,
  liveHeading: 0,
  
  init() {
    // Check URL params
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'demo') {
      this.mode = 'demo';
      this.simLat = parseFloat(params.get('lat')) || 22.3045;
      this.simLng = parseFloat(params.get('lng')) || 114.1595;
      this.simHeading = parseFloat(params.get('hdg')) || 120;
    }
    
    // Listen for orientation changes (compass)
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', (e) => {
        if (e.alpha !== null) {
          this.liveHeading = 360 - e.alpha; // Convert to true bearing
        }
      });
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
      return {
        lat: this.simLat,
        lng: this.simLng,
        accuracy: 10 // Fake high accuracy
      };
    }
    return this.livePosition;
  },
  
  getHeading() {
    if (this.mode === 'demo') {
      return this.simHeading;
    }
    return this.liveHeading;
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
const instructions = document.getElementById('instructions');
const closeInstructionsBtn = document.getElementById('close-instructions');
const poiCounter = document.getElementById('poi-counter');
const poiCountElement = document.getElementById('poi-count');

// New controls
const modeToggle = document.getElementById('mode-toggle');
const presetPicker = document.getElementById('preset-picker');
const manualLat = document.getElementById('manual-lat');
const manualLng = document.getElementById('manual-lng');
const manualHeading = document.getElementById('manual-heading');
const applyManualBtn = document.getElementById('apply-manual');
const onboardingCoach = document.getElementById('onboarding-coach');
const coachMessage = document.getElementById('coach-message');
const coachNext = document.getElementById('coach-next');
const emptyState = document.getElementById('empty-state');
const ghostHints = document.getElementById('ghost-hints');

// ============================================================================
// INITIALIZE
// ============================================================================

window.addEventListener('DOMContentLoaded', init);

function init() {
  console.log('🚀 Sightline WebAR Enhanced - Initializing...');
  
  DemoController.init();
  
  // Set up UI controls
  setupControls();
  
  // Check if demo mode from URL
  if (DemoController.mode === 'demo') {
    console.log('🎭 Demo mode activated from URL');
    updateLoadingStatus('Demo mode - no GPS needed!');
    setTimeout(() => {
      loadingOverlay.classList.add('hidden');
      initDemoMode();
    }, 1000);
    return;
  }
  
  // Normal live GPS flow
  updateLoadingStatus('Requesting camera & GPS...');
  
  // A-Frame scene loaded
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
  
  // GPS camera ready event
  window.addEventListener('gps-camera-ready', () => {
    console.log('📡 GPS Camera Component Ready');
    onARReady();
  });
  
  // GPS update event
  window.addEventListener('gps-camera-update-position', onGPSUpdate);
  
  // GPS error event
  window.addEventListener('gps-camera-error', onGPSError);
  
  // Close instructions
  if (closeInstructionsBtn) {
    closeInstructionsBtn.addEventListener('click', () => {
      instructions.classList.add('hidden');
    });
  }
  
  // Help button - show instructions
  const helpButton = document.getElementById('help-button');
  if (helpButton) {
    helpButton.addEventListener('click', () => {
      if (instructions) {
        instructions.classList.remove('hidden');
      }
    });
  }
  
  // Skip loading button (show after 5 seconds)
  setTimeout(() => {
    if (!arReady && skipLoadingBtn) {
      skipLoadingBtn.style.display = 'block';
    }
  }, 5000);
  
  if (skipLoadingBtn) {
    skipLoadingBtn.addEventListener('click', () => {
      console.log('User clicked skip - offering demo mode');
      loadingOverlay.classList.add('hidden');
      offerDemoMode();
    });
  }
  
  // Start distance update interval
  setInterval(updateDistances, CONFIG.UPDATE_INTERVAL);
  setInterval(updateVisibilityAndHints, 2000);
  
  // Show onboarding on first run
  if (!localStorage.getItem('sightline-onboarded')) {
    setTimeout(() => showOnboarding(), 2000);
  }
}

// ============================================================================
// SETUP CONTROLS
// ============================================================================

function setupControls() {
  // Mode toggle
  if (modeToggle) {
    modeToggle.addEventListener('change', (e) => {
      const newMode = e.target.checked ? 'demo' : 'live';
      switchMode(newMode);
    });
    
    // Set initial state
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
  
  // Apply manual position
  if (applyManualBtn) {
    applyManualBtn.addEventListener('click', applyDemo);
  }
  
  // Onboarding coach
  if (coachNext) {
    coachNext.addEventListener('click', nextOnboardingStep);
  }
}

function switchMode(newMode) {
  DemoController.setMode(newMode);
  
  if (newMode === 'demo') {
    initDemoMode();
    showSuccess('🎭 Demo mode active - position simulated');
  } else {
    showSuccess('📡 Live GPS mode - using your location');
    // Reload page to restart GPS
    setTimeout(() => location.reload(), 1000);
  }
}

function initDemoMode() {
  arReady = true;
  
  // Set default preset if none loaded
  if (!DemoController.simLat || !DemoController.simLng) {
    DemoController.loadPreset('freespace');
  }
  
  // Update UI
  if (manualLat) manualLat.value = DemoController.simLat;
  if (manualLng) manualLng.value = DemoController.simLng;
  if (manualHeading) manualHeading.value = DemoController.simHeading;
  
  // Create demo scene without AR.js GPS camera
  createDemoScene();
  
  // Simulate position update
  const pos = DemoController.getCurrentPosition();
  userPosition = pos;
  updateGPSDisplay(pos.lat, pos.lng, pos.accuracy);
  
  // Initial POI update
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
  if (confirm('GPS not available. Switch to Demo Mode?\n\nDemo mode simulates your position so you can preview the AR experience.')) {
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
  
  // Remove GPS camera if exists
  const existingCamera = scene.querySelector('[gps-camera]');
  if (existingCamera) {
    existingCamera.parentNode.removeChild(existingCamera);
  }
  
  // Add simple camera for demo
  let camera = scene.querySelector('a-camera');
  if (!camera) {
    camera = document.createElement('a-camera');
    camera.setAttribute('position', '0 1.6 0');
    scene.appendChild(camera);
  }
  
  // Create POI entities
  POIS.forEach(poi => {
    createPOIEntity(poi);
  });
  
  console.log('🎬 Demo scene created');
}

function createPOIEntity(poi) {
  const scene = document.querySelector('a-scene');
  if (!scene) return;
  
  // Check if already exists
  if (document.getElementById(`poi-${poi.id}`)) {
    updatePOIPosition(poi);
    return;
  }
  
  const entity = document.createElement('a-entity');
  entity.id = `poi-${poi.id}`;
  entity.classList.add('poi-card');
  entity.setAttribute('data-poi-id', poi.id);
  
  // Will update position based on bearing/distance
  updatePOIPosition(poi);
  
  // Create card visual
  const cardColor = getCategoryColor(poi.category);
  const isFar = poi.range === 'far';
  
  // Background plane
  const bg = document.createElement('a-plane');
  bg.setAttribute('width', isFar ? '15' : '8');
  bg.setAttribute('height', isFar ? '8' : '4');
  bg.setAttribute('color', '#ffffff');
  bg.setAttribute('opacity', '0.95');
  entity.appendChild(bg);
  
  // Title
  const title = document.createElement('a-text');
  title.setAttribute('value', poi.name);
  title.setAttribute('color', '#000000');
  title.setAttribute('align', 'center');
  title.setAttribute('width', isFar ? '14' : '7');
  title.setAttribute('position', `0 ${isFar ? '2' : '1'} 0.01`);
  title.setAttribute('font', 'roboto');
  entity.appendChild(title);
  
  // Description
  const desc = document.createElement('a-text');
  desc.setAttribute('value', poi.description);
  desc.setAttribute('color', '#666666');
  desc.setAttribute('align', 'center');
  desc.setAttribute('width', isFar ? '12' : '6');
  desc.setAttribute('position', `0 ${isFar ? '0' : '-0.5'} 0.01`);
  entity.appendChild(desc);
  
  // Distance label (will be updated)
  const distLabel = document.createElement('a-text');
  distLabel.setAttribute('value', '---');
  distLabel.setAttribute('color', cardColor);
  distLabel.setAttribute('align', 'center');
  distLabel.setAttribute('width', '6');
  distLabel.setAttribute('position', `0 ${isFar ? '-2' : '-1.5'} 0.01`);
  distLabel.setAttribute('class', 'distance-text');  // Add class for updateDistances()
  distLabel.id = `distance-${poi.id}`;
  entity.appendChild(distLabel);
  
  // Year badge
  if (poi.year) {
    const yearBadge = document.createElement('a-circle');
    yearBadge.setAttribute('radius', '0.8');
    yearBadge.setAttribute('color', cardColor);
    yearBadge.setAttribute('position', `${isFar ? '6' : '3'} ${isFar ? '3' : '1.5'} 0.01`);
    entity.appendChild(yearBadge);
    
    const yearText = document.createElement('a-text');
    yearText.setAttribute('value', poi.year.toString());
    yearText.setAttribute('color', '#ffffff');
    yearText.setAttribute('align', 'center');
    yearText.setAttribute('width', '3');
    yearText.setAttribute('position', `${isFar ? '6' : '3'} ${isFar ? '3' : '1.5'} 0.02`);
    entity.appendChild(yearText);
  }
  
  // Billboard behavior (always face camera)
  entity.setAttribute('look-at', '[camera]');
  
  scene.appendChild(entity);
}

function updatePOIPosition(poi) {
  const entity = document.getElementById(`poi-${poi.id}`);
  if (!entity) return;
  
  const pos = DemoController.getCurrentPosition();
  if (!pos) return;
  
  const distance = calculateDistance(pos.lat, pos.lng, poi.lat, poi.lng);
  const bearing = calculateBearing(pos.lat, pos.lng, poi.lat, poi.lng);
  const heading = DemoController.getHeading();
  
  // Convert bearing/distance to x,z coordinates
  const relativeBearing = (bearing - heading + 360) % 360;
  const angleRad = (relativeBearing * Math.PI) / 180;
  
  // Scale distance for AR world (1m real = 1 unit in AR)
  const scaledDist = Math.min(distance, 500); // Clamp for visibility
  const x = Math.sin(angleRad) * scaledDist;
  const z = -Math.cos(angleRad) * scaledDist;
  
  // Height based on distance (skyline effect for far POIs)
  let y = 0;
  if (poi.range === 'far' && distance > CONFIG.FAR_RANGE) {
    y = 50 + (poi.elevation || 200) / 10; // Elevated for skyline
  } else if (distance > CONFIG.MID_RANGE) {
    y = 20;
  } else {
    y = 10;
  }
  
  entity.setAttribute('position', `${x} ${y} ${z}`);
  entity.setAttribute('visible', distance <= CONFIG.MAX_DISTANCE);
  
  // Update distance label
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
  console.log('✅ AR Camera Ready');
  arReady = true;
  updateLoadingStatus('AR initialized!');
  
  setTimeout(() => {
    loadingOverlay.classList.add('hidden');
    showSuccess('AR Ready! Point at landmarks to discover.');
  }, 500);
}

// Timeout fallback - hide loading after 15 seconds even if AR not ready
setTimeout(() => {
  if (!arReady) {
    console.warn('⚠️ AR initialization timeout - hiding loading screen anyway');
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
  
  console.log(`📍 GPS: ${position.latitude.toFixed(5)}, ${position.longitude.toFixed(5)} ±${accuracy.toFixed(1)}m`);
}

function onGPSError(event) {
  console.error('❌ GPS Error:', event.detail);
  showError('GPS signal lost. Try moving to an open area or switch to Demo Mode.');
}

// ============================================================================
// DISTANCE CALCULATIONS
// ============================================================================

function calculateDistance(lat1, lng1, lat2, lng2) {
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
    
    // Update distance in AR card
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
  
  // Update counter
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
    
    // Check if in FOV
    const inFOV = relativeBearing < CONFIG.FOV/2 || relativeBearing > (360 - CONFIG.FOV/2);
    
    if (inFOV) {
      visiblePOIs.add(poi.id);
    } else {
      // Calculate direction hint
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
  
  // Update ghost hints
  updateGhostHints(offScreenPOIs);
  
  // Show/hide empty state
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
  
  // Clear existing
  ghostHints.innerHTML = '';
  
  if (offScreenPOIs.length === 0) {
    ghostHints.classList.add('hidden');
    return;
  }
  
  ghostHints.classList.remove('hidden');
  
  // Show top 3 closest off-screen POIs
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
// ONBOARDING COACH
// ============================================================================

const ONBOARDING_STEPS = [
  "This is Sightline. Anchors appear on the skyline where you're looking.",
  "Turn your head slowly—cards slide in when landmarks enter your field of view.",
  "Tap ⭐ Save to keep anything you discover."
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
    let color = '#22c55e'; // green
    let status = 'Excellent';
    
    if (accuracy > 30) {
      color = '#eab308'; // yellow
      status = 'Good';
    }
    if (accuracy > 100) {
      color = '#ef4444'; // red
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
  // Remove existing toasts
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

console.log('✅ Sightline WebAR Enhanced - Ready');
console.log('💡 Debug API: window.SightlineAR');
