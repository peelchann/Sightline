/**
 * Sightline WebAR - V3.1 Unified Flow (v4 Design)
 * 
 * Features:
 * - Unified "Start Panel" with Permission Gates
 * - Strict Gating: Camera + Location + Motion required
 * - Dynamic Scene Injection (Clean DOM)
 * - Persisted Permissions (localStorage)
 */

// ============================================================================
// CONFIGURATION & DATA
// ============================================================================

const CONFIG = {
  R_IN_RANGE: 600,   // meters
  R_VIS: 1500,       // meters
  R_NEAREST: 5000,   // meters
  DEBUG: new URLSearchParams(window.location.search).has('debug')
};

const POIS = [
  { id: 'clock-tower', name: 'Clock Tower', lat: 22.2946, lng: 114.1699, description: 'Former railway terminus (1915)', color: '#3B82F6' },
  { id: 'star-ferry', name: 'Star Ferry', lat: 22.2937, lng: 114.1703, description: 'Iconic harbour crossing', color: '#22C55E' },
  { id: 'ifc', name: 'IFC Two', lat: 22.2855, lng: 114.1588, description: '412m Skyscraper', color: '#3B82F6', elevation: 412 },
  { id: 'icc', name: 'ICC', lat: 22.3069, lng: 114.1617, description: '484m Skyscraper', color: '#3B82F6', elevation: 484 },
  { id: 'mplus', name: 'M+ Museum', lat: 22.3030, lng: 114.1590, description: 'Global visual culture', color: '#A855F7' },
  { id: 'palace', name: 'Palace Museum', lat: 22.3016, lng: 114.1600, description: 'Chinese art treasures', color: '#A855F7' },
  // Southside
  { id: 'ocean-park', name: 'Ocean Park', lat: 22.2476, lng: 114.1733, description: 'Marine mammal park', color: '#0EA5E9' },
  { id: 'wch-mtr', name: 'Wong Chuk Hang MTR', lat: 22.2472, lng: 114.1739, description: 'Island South hub', color: '#22C55E' }
];

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

const state = {
  perms: {
    cam: 'unknown', // 'granted', 'denied', 'unknown'
    loc: 'unknown',
    mot: 'unknown'
  },
  ready: false,
  demo: false,
  sensors: {
    heading: null,
    gps: null,
    watchId: null
  }
};

// ============================================================================
// DOM ELEMENTS
// ============================================================================

const UI = {
  panel: document.getElementById('start-panel'),
  stage: document.getElementById('ar-stage'),
  btnCam: document.getElementById('btn-perm-camera'),
  btnLoc: document.getElementById('btn-perm-location'),
  btnMot: document.getElementById('btn-perm-motion'),
  btnStart: document.getElementById('btn-start-ar'),
  btnDemo: document.getElementById('btn-start-demo'),
  debugLog: document.getElementById('dev-log'),
  debugFab: document.getElementById('debug-fab'),
  debugPanel: document.querySelector('.debug-panel')
};

// ============================================================================
// LOGGING & DEBUG
// ============================================================================

function log(msg) {
  const ts = new Date().toLocaleTimeString('en-US', { hour12: false });
  console.log(`[Sightline ${ts}] ${msg}`);
  if (UI.debugLog) {
    UI.debugLog.textContent = `[${ts}] ${msg}\n` + UI.debugLog.textContent;
  }
}

UI.debugFab?.addEventListener('click', () => {
  UI.debugPanel?.classList.toggle('show');
});

// ============================================================================
// PERMISSION HANDLERS
// ============================================================================

async function checkPersistedPermissions() {
  // Load state from localStorage
  const pCam = localStorage.getItem('sl_perm_cam');
  const pLoc = localStorage.getItem('sl_perm_loc');
  const pMot = localStorage.getItem('sl_perm_mot');

  if (pCam === 'granted') state.perms.cam = 'granted';
  if (pLoc === 'granted') state.perms.loc = 'granted';
  if (pMot === 'granted') state.perms.mot = 'granted';

  // Note: We still need to request streams/watches to re-activate them,
  // but visual state can look "ready" or we can auto-trigger if gesture not needed.
  // iOS Motion ALWAYS needs gesture, so we cannot auto-trigger that.
  // Camera/Location usually don't need gesture if already granted.
  
  // For this flow, we will reflect state but require click to "Enable" (re-verify).
  updateUI();
}

function updateUI() {
  // Update Chips
  updateChip(UI.btnCam, state.perms.cam);
  updateChip(UI.btnLoc, state.perms.loc);
  updateChip(UI.btnMot, state.perms.mot);

  // Update Start Button
  const allGranted = 
    state.perms.cam === 'granted' && 
    state.perms.loc === 'granted' && 
    state.perms.mot === 'granted';
  
  UI.btnStart.disabled = !allGranted;
  
  if (allGranted && !state.ready) {
    state.ready = true;
    // Optional: Auto-focus start button or pulse it
    UI.btnStart.style.transform = 'scale(1.05)';
    setTimeout(() => UI.btnStart.style.transform = '', 200);
  }
}

function updateChip(btn, status) {
  const chip = btn.querySelector('.chip');
  if (chip) {
    chip.setAttribute('data-status', status === 'granted' ? 'ok' : (status === 'denied' ? 'err' : 'unknown'));
  }
  // Visual feedback on button
  if (status === 'granted') {
    btn.style.borderColor = '#4ADE80';
    btn.style.background = 'rgba(74, 222, 128, 0.1)';
  } else if (status === 'denied') {
    btn.style.borderColor = '#EF4444';
  }
}

// --- CAMERA ---
UI.btnCam.onclick = async () => {
  updateChip(UI.btnCam, 'wait');
  try {
    // Request stream to verify permission
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: 'environment' }, 
      audio: false 
    });
    
    // Stop immediately (we just wanted permission, AR.js will grab it later)
    // actually AR.js needs us to NOT hold the stream sometimes, or pass it.
    // For smoothness, let's keep it granted state.
    stream.getTracks().forEach(t => t.stop());
    
    state.perms.cam = 'granted';
    localStorage.setItem('sl_perm_cam', 'granted');
    log('Camera: Granted');
  } catch (e) {
    state.perms.cam = 'denied';
    log(`Camera Error: ${e.name}`);
    alert('Camera blocked. Please enable in Settings.');
  }
  updateUI();
};

// --- LOCATION ---
UI.btnLoc.onclick = () => {
  updateChip(UI.btnLoc, 'wait');
  if (!navigator.geolocation) {
    state.perms.loc = 'denied';
    alert('Geolocation not supported');
    updateUI();
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      state.perms.loc = 'granted';
      state.sensors.gps = pos;
      localStorage.setItem('sl_perm_loc', 'granted');
      log(`GPS: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)} (±${Math.round(pos.coords.accuracy)}m)`);
      updateUI();
    },
    (err) => {
      state.perms.loc = 'denied';
      log(`GPS Error: ${err.message}`);
      alert('Location denied. Please allow "While Using App" in Settings.');
      updateUI();
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
};

// --- MOTION ---
UI.btnMot.onclick = async () => {
  updateChip(UI.btnMot, 'wait');
  
  // iOS 13+ Requirement
  if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
    try {
      const permission = await DeviceMotionEvent.requestPermission();
      if (permission === 'granted') {
        state.perms.mot = 'granted';
        localStorage.setItem('sl_perm_mot', 'granted');
        log('Motion: Granted (iOS)');
        
        // Start listener to warm up
        window.addEventListener('deviceorientation', handleOrientation, true);
      } else {
        state.perms.mot = 'denied';
        log('Motion: Denied (iOS)');
        alert('Motion sensors blocked.');
      }
    } catch (e) {
      log(`Motion API Error: ${e.message}`);
      state.perms.mot = 'denied';
    }
  } else {
    // Non-iOS or older devices (assume granted implicitly if supported)
    state.perms.mot = 'granted';
    localStorage.setItem('sl_perm_mot', 'granted');
    log('Motion: Implicit (Android/Desktop)');
    window.addEventListener('deviceorientationabsolute', handleOrientation, true);
    window.addEventListener('deviceorientation', handleOrientation, true);
  }
  updateUI();
};

// ============================================================================
// CORE ACTIONS
// ============================================================================

UI.btnStart.onclick = async () => {
  if (UI.btnStart.disabled) return;
  
  log('System: Starting AR...');
  
  // Fade out panel
  UI.panel.classList.add('hidden');
  
  // Init AR
  await initARStage();
};

UI.btnDemo.onclick = async () => {
  log('System: Starting Demo Mode...');
  state.demo = true;
  UI.panel.classList.add('hidden');
  await initARStage({ demo: true });
};

// ============================================================================
// AR ENGINE
// ============================================================================

async function initARStage(options = {}) {
  log('AR: Injecting Scene...');
  
  // 1. Clean Stage
  UI.stage.innerHTML = '';
  
  // 2. Create Scene Element
  const scene = document.createElement('a-scene');
  scene.setAttribute('embedded', '');
  scene.setAttribute('vr-mode-ui', 'enabled: false');
  scene.setAttribute('loading-screen', 'enabled: false');
  scene.setAttribute('renderer', 'logarithmicDepthBuffer: true; precision: medium; antialias: true; alpha: true;');
  
  // AR.js Params
  if (options.demo) {
    // Demo Mode: No Camera, Synthetic GPS
    log('AR: Configured for DEMO (No Camera)');
    // Just use standard look-controls for demo
    const cam = document.createElement('a-camera');
    cam.setAttribute('gps-camera', 'simulateLatitude: 22.2946; simulateLongitude: 114.1699;'); 
    cam.setAttribute('rotation-reader', '');
    cam.setAttribute('look-controls', 'enabled: true');
    scene.appendChild(cam);
    
    // Add a sky for context
    const sky = document.createElement('a-sky');
    sky.setAttribute('color', '#87CEEB');
    scene.appendChild(sky);
    
    // Add grid floor
    const grid = document.createElement('a-grid');
    grid.setAttribute('static-body', '');
    scene.appendChild(grid);
    
  } else {
    // Real AR Mode
    scene.setAttribute('arjs', `
      sourceType: webcam; 
      videoTexture: true; 
      debugUIEnabled: false; 
      sourceWidth: 1280; sourceHeight: 960; 
      displayWidth: 1280; displayHeight: 960;
    `);
    
    const cam = document.createElement('a-camera');
    cam.setAttribute('gps-camera', 'minDistance: 20; maxDistance: 5000;');
    cam.setAttribute('rotation-reader', '');
    scene.appendChild(cam);
  }
  
  // 3. Inject POIs
  POIS.forEach(poi => {
    const el = createPOIEntity(poi);
    scene.appendChild(el);
  });
  
  // 4. Mount
  UI.stage.appendChild(scene);
  
  // 5. Wait for Load
  // (A-Frame emits 'loaded' on scene)
  scene.addEventListener('loaded', () => {
    log('AR: Scene Loaded');
    if (!options.demo) {
      startSensorLoop();
    }
  });
}

function createPOIEntity(poi) {
  const container = document.createElement('a-entity');
  container.setAttribute('gps-entity-place', `latitude: ${poi.lat}; longitude: ${poi.lng}`);
  
  // Visual: Pin/Marker
  const pin = document.createElement('a-entity');
  pin.setAttribute('geometry', 'primitive: cone; radiusBottom: 0.2; radiusTop: 1.5; height: 3; segmentsRadial: 8');
  pin.setAttribute('material', `color: ${poi.color}; opacity: 0.9;`);
  pin.setAttribute('position', '0 25 0'); // High up
  pin.setAttribute('rotation', '180 0 0'); // Point down
  pin.setAttribute('animation', 'property: position; to: 0 28 0; dir: alternate; dur: 2000; loop: true');
  
  // Label
  const text = document.createElement('a-text');
  text.setAttribute('value', poi.name);
  text.setAttribute('scale', '5 5 5');
  text.setAttribute('align', 'center');
  text.setAttribute('position', '0 4 0');
  text.setAttribute('look-at', '[camera]');
  
  container.appendChild(pin);
  container.appendChild(text);
  
  return container;
}

// ============================================================================
// SENSOR LOOPS & MATH
// ============================================================================

function handleOrientation(e) {
  let heading = null;
  
  // iOS
  if (e.webkitCompassHeading) {
    heading = e.webkitCompassHeading;
  } 
  // Android Absolute
  else if (e.alpha !== null && e.absolute) {
    heading = 360 - e.alpha;
  }
  
  if (heading !== null) {
    state.sensors.heading = heading;
    // Update HUD if active
    const hud = document.getElementById('hud');
    // We can inject HUD HTML if we want
  }
}

function startSensorLoop() {
  log('Sensors: Active Loop Started');
  // Any per-frame logic goes here (filtering, smoothing)
}

// ============================================================================
// INIT
// ============================================================================

checkPersistedPermissions();
