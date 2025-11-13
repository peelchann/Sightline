/**
 * Sightline WebAR - V3 Individual Permission Flow
 * 
 * Each permission is requested independently via separate buttons.
 * This is more reliable on iOS Chrome.
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

const R_IN_RANGE = 600;   // meters: place anchored card
const R_VIS = 1500;       // meters: show off-axis arrow/label
const R_NEAREST = 5000;   // meters: nearest fallback arrow

// ============================================================================
// POI DATA
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
    range: 'mid',
    color: '#3B82F6'
  },
  {
    id: 'star-ferry-tst',
    name: 'Star Ferry (TST)',
    lat: 22.2937,
    lng: 114.1703,
    year: 1888,
    description: 'Iconic ferry service',
    category: 'transport',
    range: 'mid',
    color: '#22C55E'
  },
  {
    id: 'ifc',
    name: 'IFC Tower',
    lat: 22.2855,
    lng: 114.1588,
    year: 2003,
    description: 'International Finance Centre • 412m',
    category: 'landmark',
    range: 'far',
    elevation: 412,
    color: '#3B82F6'
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
    elevation: 484,
    color: '#3B82F6'
  },
  {
    id: 'mplus',
    name: 'M+ Museum',
    lat: 22.3030,
    lng: 114.1590,
    year: 2021,
    description: 'Visual culture museum',
    category: 'museum',
    range: 'mid',
    color: '#A855F7'
  },
  {
    id: 'palace-museum',
    name: 'Hong Kong Palace Museum',
    lat: 22.3016,
    lng: 114.1600,
    year: 2022,
    description: 'Chinese art & culture',
    category: 'museum',
    range: 'mid',
    color: '#A855F7'
  },
  // Wong Chuk Hang POIs
  {
    id: 'ocean_park_main_entrance',
    name: 'Ocean Park Hong Kong (Main Entrance)',
    year: 1977,
    lat: 22.2476,
    lng: 114.1733,
    description: 'Hong Kong\'s classic marine-themed park linking The Waterfront & The Summit.',
    category: 'landmark',
    color: '#0EA5E9'
  },
  {
    id: 'wong_chuk_hang_mtr',
    name: 'Wong Chuk Hang MTR (Exit B)',
    year: 2016,
    lat: 22.2472,
    lng: 114.1739,
    description: 'South Island Line station serving the revitalized industrial district.',
    category: 'transport',
    color: '#22C55E'
  },
  {
    id: 'aberdeen_promenade',
    name: 'Aberdeen Promenade',
    year: 1990,
    lat: 22.2489,
    lng: 114.1579,
    description: 'Waterfront walkway facing the typhoon shelter and floating village.',
    category: 'waterfront',
    color: '#A855F7'
  },
  {
    id: 'the_southside_mall',
    name: 'THE SOUTHSIDE',
    year: 2023,
    lat: 22.2459,
    lng: 114.1698,
    description: 'Transit-oriented mall above Wong Chuk Hang station.',
    category: 'retail',
    color: '#F59E0B'
  }
];

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

const state = {
  camera: { granted: false, stream: null },
  geo: { granted: false, watchId: null, last: null },
  imu: { granted: false, active: false, headingDeg: null },
  mode: 'INIT', // INIT | START | AR | DEMO | ERROR
  poiClassifications: new Map(), // POI ID -> { type: 'IN_RANGE' | 'VISIBLE' | 'NEAREST', distance, bearing }
  nearestPOI: null
};

// ============================================================================
// UI HELPERS
// ============================================================================

function setChip(txt) {
  const chip = document.getElementById('state-chip');
  if (chip) {
    chip.textContent = txt;
    state.mode = txt;
  }
}

function setStat(id, v) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = v; // '🔴' | '🟡' | '🟢'
  }
}

function log(msg) {
  const p = document.getElementById('dev-log');
  if (p) {
    const timestamp = new Date().toLocaleTimeString();
    p.textContent += `[${timestamp}] ${msg}\n`;
    p.scrollTop = p.scrollHeight;
  }
  console.log(`[Sightline] ${msg}`);
}

// ============================================================================
// PERMISSION HANDLERS
// ============================================================================

function setupPermissionHandlers() {
  // Camera Permission
  const btnCamera = document.getElementById('btn-perm-camera');
  if (!btnCamera) {
    log('ERROR: btn-perm-camera not found');
    return;
  }
  
  btnCamera.addEventListener('click', async (e) => {
  e.preventDefault();
  e.stopPropagation();
  
  const btn = e.currentTarget;
  if (btn.disabled || btn.classList.contains('loading')) return;
  
  setStat('stat-camera', '🟡');
  btn.classList.add('loading');
  btn.disabled = true;
  log('camera: requesting');
  
  try {
    // Try multiple constraint sets (iOS fallback)
    const candidates = [
      { video: { facingMode: { exact: 'environment' } }, audio: false },
      { video: { facingMode: 'environment' }, audio: false },
      { video: true, audio: false }
    ];
    
    let stream = null;
    for (const c of candidates) {
      try {
        stream = await navigator.mediaDevices.getUserMedia(c);
        log(`camera: granted with constraints ${JSON.stringify(c).substring(0, 50)}`);
        break;
      } catch (err) {
        log(`camera: constraint failed: ${err.name}`);
      }
    }
    
    if (!stream) {
      setStat('stat-camera', '🔴');
      log('camera: getUserMedia failed - all constraints rejected');
      btn.classList.remove('loading');
      btn.disabled = false;
      showIOSHelp();
      return;
    }
    
    // Attach to video element
    const video = document.getElementById('camera');
    if (video) {
      video.srcObject = stream;
      await video.play().catch(() => {});
      log('camera: video playing');
    }
    
    state.camera = { granted: true, stream };
    setStat('stat-camera', '🟢');
    log('camera: granted & playing');
    btn.classList.remove('loading');
    btn.disabled = false;
    maybeEnableStartAR();
    
  } catch (err) {
    setStat('stat-camera', '🔴');
    log(`camera: error ${err.message}`);
    btn.classList.remove('loading');
    btn.disabled = false;
    showIOSHelp();
  }
  });
  
  // Location Permission
  const btnGeo = document.getElementById('btn-perm-geo');
  if (!btnGeo) {
    log('ERROR: btn-perm-geo not found');
    return;
  }
  
  btnGeo.addEventListener('click', async (e) => {
  e.preventDefault();
  e.stopPropagation();
  
  const btn = e.currentTarget;
  if (btn.disabled || btn.classList.contains('loading')) return;
  
  setStat('stat-geo', '🟡');
  btn.classList.add('loading');
  btn.disabled = true;
  log('geo: requesting');
  
  if (!('geolocation' in navigator)) {
    setStat('stat-geo', '🔴');
    log('geo: not supported');
    btn.classList.remove('loading');
    btn.disabled = false;
    return;
  }
  
  const opts = {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 10000 // 10 seconds
  };
  
  let gotFirst = false;
  
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      gotFirst = true;
      state.geo.granted = true;
      state.geo.last = pos;
      
      const lat = pos.coords.latitude.toFixed(6);
      const lng = pos.coords.longitude.toFixed(6);
      const acc = Math.round(pos.coords.accuracy);
      
      setStat('stat-geo', '🟢');
      log(`geo: granted lat=${lat} lng=${lng} acc=±${acc}m`);
      
      // Check accuracy - show hint if > 80m
      if (pos.coords.accuracy > 80) {
        log(`geo: accuracy low (${acc}m), showing reacquiring hint`);
        showAccuracyHint(true);
      } else {
        showAccuracyHint(false);
      }
      
      // Start watch after first fix
      state.geo.watchId = navigator.geolocation.watchPosition(
        (p) => {
          state.geo.last = p;
          updateHUDGeo(p);
          
          // Update accuracy hint
          if (p.coords.accuracy > 80) {
            showAccuracyHint(true);
          } else {
            showAccuracyHint(false);
          }
        },
        (err) => {
          log(`geo: watch error ${err.code} ${err.message}`);
        },
        opts
      );
      
      btn.classList.remove('loading');
      btn.disabled = false;
      maybeEnableStartAR();
    },
    (err) => {
      setStat('stat-geo', '🔴');
      log(`geo: error ${err.code} ${err.message}`);
      btn.classList.remove('loading');
      btn.disabled = false;
      showIOSHelp();
    },
    opts
  );
  });
  
  // Motion & Orientation Permission
  const btnImu = document.getElementById('btn-perm-imu');
  if (!btnImu) {
    log('ERROR: btn-perm-imu not found');
    return;
  }
  
  btnImu.addEventListener('click', async (e) => {
  e.preventDefault();
  e.stopPropagation();
  
  const btn = e.currentTarget;
  if (btn.disabled || btn.classList.contains('loading')) return;
  
  setStat('stat-imu', '🟡');
  btn.classList.add('loading');
  btn.disabled = true;
  log('imu: requesting');
  
  try {
    const needIOS = typeof DeviceMotionEvent !== 'undefined' 
      && typeof DeviceMotionEvent.requestPermission === 'function';
    
    if (needIOS) {
      log('imu: iOS detected, requesting permissions...');
      
      // Request DeviceMotionEvent permission
      const r1 = await DeviceMotionEvent.requestPermission();
      log(`imu: DeviceMotionEvent permission: ${r1}`);
      
      // Request DeviceOrientationEvent permission
      let r2 = 'granted';
      if (typeof DeviceOrientationEvent !== 'undefined' 
          && typeof DeviceOrientationEvent.requestPermission === 'function') {
        r2 = await DeviceOrientationEvent.requestPermission();
        log(`imu: DeviceOrientationEvent permission: ${r2}`);
      }
      
      if (r1 !== 'granted' || r2 !== 'granted') {
        setStat('stat-imu', '🔴');
        log('imu: denied');
        btn.classList.remove('loading');
        btn.disabled = false;
        showIOSHelp();
        return;
      }
    }
    
    // Attach listeners
    window.addEventListener('deviceorientation', onOrient, { passive: true });
    window.addEventListener('deviceorientationabsolute', onOrient, { passive: true });
    
    state.imu.granted = true;
    state.imu.active = true;
    setStat('stat-imu', '🟢');
    log('imu: granted & listening');
    btn.classList.remove('loading');
    btn.disabled = false;
    maybeEnableStartAR();
    
  } catch (err) {
    setStat('stat-imu', '🔴');
    log(`imu: error ${err.message}`);
    btn.classList.remove('loading');
    btn.disabled = false;
    showIOSHelp();
  }
  });
  
  log('permission-handlers: all handlers attached');
}

// ============================================================================
// ORIENTATION HANDLER
// ============================================================================

function onOrient(ev) {
  // Compute compass heading
  let heading = null;
  
  // iOS webkitCompassHeading (most accurate)
  if (ev.webkitCompassHeading !== undefined && ev.webkitCompassHeading !== null) {
    heading = ev.webkitCompassHeading;
  }
  // Android/absolute orientation
  else if (ev.absolute && ev.alpha !== null) {
    heading = 360 - ev.alpha;
  }
  // Relative orientation (fallback)
  else if (ev.alpha !== null) {
    heading = 360 - ev.alpha;
  }
  
  if (heading !== null) {
    // Normalize to 0-359
    heading = ((heading % 360) + 360) % 360;
    state.imu.headingDeg = heading;
    updateHUDHeading(heading);
  }
}

function computeHeadingFromEuler(ev) {
  if (ev.webkitCompassHeading !== undefined) {
    return ev.webkitCompassHeading;
  }
  if (ev.alpha !== null) {
    return ((360 - ev.alpha) % 360 + 360) % 360;
  }
  return null;
}

// ============================================================================
// START AR LOGIC
// ============================================================================

function maybeEnableStartAR() {
  const btn = document.getElementById('btn-start-ar');
  if (!btn) return;
  
  const ready = state.camera.granted && state.geo.granted;
  btn.disabled = !ready;
  
  if (ready) {
    log('start-ar: ready (Camera + Location granted)');
  } else {
    const missing = [];
    if (!state.camera.granted) missing.push('Camera');
    if (!state.geo.granted) missing.push('Location');
    log(`start-ar: not ready (missing: ${missing.join(', ')})`);
  }
}

function setupActionHandlers() {
  const btnStartAR = document.getElementById('btn-start-ar');
  if (!btnStartAR) {
    log('ERROR: btn-start-ar not found');
    return;
  }
  
  btnStartAR.addEventListener('click', async (e) => {
  e.preventDefault();
  e.stopPropagation();
  
  if (!(state.camera.granted && state.geo.granted)) {
    log('start-ar: not ready');
    return;
  }
  
  log('start-ar: initializing AR scene...');
  setChip('AR');
  
  // Hide start screen, show AR screen
  const startScreen = document.getElementById('start-screen');
  const arScreen = document.getElementById('ar-screen');
  
  if (startScreen) startScreen.style.display = 'none';
  if (arScreen) arScreen.style.display = 'block';
  
  // Initialize AR scene
  await enterARScene();
  
  log('start-ar: AR scene ready');
  });
  
  // Demo Mode
  const btnDemo = document.getElementById('btn-start-demo');
  if (!btnDemo) {
    log('ERROR: btn-start-demo not found');
    return;
  }
  
  btnDemo.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  
  log('demo: starting (no sensors required)');
  stopAllSensors();
  
  state.mode = 'DEMO';
  setChip('DEMO');
  
  // Show preset selector
  showPresetSelector();
  });
  
  log('action-handlers: all handlers attached');
}

const PRESETS = [
  {
    id: 'west-kowloon',
    name: 'West Kowloon Freespace',
    lat: 22.3045,
    lng: 114.1595,
    headingDeg: 120,
    description: 'Facing Victoria Harbour skyline'
  },
  {
    id: 'wong-chuk-hang',
    name: 'Wong Chuk Hang MTR',
    lat: 22.2472,
    lng: 114.1739,
    headingDeg: 0,
    description: 'South Island Line station'
  },
  {
    id: 'ocean-park',
    name: 'Ocean Park Entrance',
    lat: 22.2476,
    lng: 114.1733,
    headingDeg: 45,
    description: 'Main entrance area'
  }
];

function showPresetSelector() {
  let modal = document.getElementById('preset-selector-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'preset-selector-modal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <h2>Choose Demo Location</h2>
        <button class="modal-close" onclick="document.getElementById('preset-selector-modal').style.display='none'">×</button>
        <div class="preset-list">
          ${PRESETS.map(preset => `
            <button class="preset-btn" data-preset-id="${preset.id}">
              <div class="preset-name">${preset.name}</div>
              <div class="preset-desc">${preset.description}</div>
            </button>
          `).join('')}
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    
    // Add click handlers
    modal.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const presetId = e.currentTarget.getAttribute('data-preset-id');
        const preset = PRESETS.find(p => p.id === presetId);
        if (preset) {
          modal.style.display = 'none';
          initDemoRuntime(preset);
        }
      });
    });
  }
  
  modal.style.display = 'flex';
}

function initDemoRuntime(preset) {
  // Hide start screen, show AR screen
  const startScreen = document.getElementById('start-screen');
  const arScreen = document.getElementById('ar-screen');
  
  if (startScreen) startScreen.style.display = 'none';
  if (arScreen) arScreen.style.display = 'block';
  
  // Set synthetic GPS
  state.geo.granted = true;
  state.geo.last = {
    coords: {
      latitude: preset.lat,
      longitude: preset.lng,
      accuracy: 10
    }
  };
  
  // Set synthetic heading
  state.imu.granted = true;
  state.imu.headingDeg = preset.headingDeg;
  
  // Update HUD
  updateHUDGeo(state.geo.last);
  updateHUDHeading(preset.headingDeg);
  
  // Initialize AR scene (without camera)
  enterARScene(false); // false = no camera
  
  // Update mode badge
  const badge = document.getElementById('mode-badge');
  if (badge) {
    badge.textContent = 'DEMO MODE';
    badge.className = 'mode-badge demo';
  }
  
  log(`demo: preset location ${preset.lat}, ${preset.lng}, heading ${preset.headingDeg}°`);
}

// ============================================================================
// AR SCENE INITIALIZATION
// ============================================================================

async function enterARScene(useCamera = true) {
  log('ar-scene: initializing...');
  
  const scene = document.querySelector('a-scene');
  if (!scene) {
    log('ar-scene: scene not found');
    return;
  }
  
  // Wait for scene to load
  if (!scene.hasLoaded) {
    await new Promise((resolve) => {
      scene.addEventListener('loaded', resolve, { once: true });
    });
  }
  
  log('ar-scene: scene loaded');
  
  // Ensure viewport is updated
  setVH();
  
  // Resize renderer to match viewport
  resizeRenderTarget();
  
  if (useCamera && state.camera.stream) {
    // Attach camera stream to AR.js video
    const video = scene.querySelector('video');
    if (video && !video.srcObject) {
      video.srcObject = state.camera.stream;
      await video.play().catch(() => {});
      log('ar-scene: camera stream attached');
    }
  }
  
  // Add POIs to scene
  addPOIsToScene(scene);
  
  // Start update loop
  startUpdateLoop();
  
  // Log rects after scene is ready
  setTimeout(() => {
    logRects();
    log('ar-scene: ready');
  }, 100);
}

// ============================================================================
// POI SCENE MANAGEMENT
// ============================================================================

function addPOIsToScene(scene) {
  if (!POIS || POIS.length === 0) {
    log('ar-scene: no POIs to add');
    return;
  }
  
  log(`ar-scene: adding ${POIS.length} POIs...`);
  
  POIS.forEach(poi => {
    // Create container entity
    const container = document.createElement('a-entity');
    container.setAttribute('gps-entity-place', `latitude: ${poi.lat}; longitude: ${poi.lng}`);
    container.setAttribute('data-poi-id', poi.id);
    container.setAttribute('visible', false); // Hidden until in range
    
    // Leader line to ground
    const leader = document.createElement('a-box');
    leader.setAttribute('position', '0 0 0');
    leader.setAttribute('width', '0.02');
    leader.setAttribute('height', '2');
    leader.setAttribute('depth', '0.02');
    leader.setAttribute('color', '#222');
    leader.setAttribute('opacity', '0.6');
    leader.setAttribute('class', 'leader');
    container.appendChild(leader);
    
    // AR Card (billboard to camera)
    const card = document.createElement('a-entity');
    card.setAttribute('position', '0 1.2 0');
    card.setAttribute('look-at', '[camera]');
    card.setAttribute('scale', '1 1 1');
    
    // Card background
    const cardBg = document.createElement('a-plane');
    cardBg.setAttribute('width', '2.6');
    cardBg.setAttribute('height', '1.2');
    cardBg.setAttribute('color', '#FAFAFA');
    cardBg.setAttribute('opacity', '0.95');
    cardBg.setAttribute('position', '0 0 0');
    card.appendChild(cardBg);
    
    // Title
    const title = document.createElement('a-text');
    title.setAttribute('value', poi.name);
    title.setAttribute('align', 'left');
    title.setAttribute('position', '-1.2 0.4 0.01');
    title.setAttribute('scale', '0.18 0.18 0.18');
    title.setAttribute('color', '#111');
    title.setAttribute('font', 'roboto');
    title.setAttribute('width', '5');
    title.setAttribute('class', 'ar-card-title');
    card.appendChild(title);
    
    // Year badge
    if (poi.year) {
      const badge = document.createElement('a-text');
      badge.setAttribute('value', poi.year.toString());
      badge.setAttribute('align', 'center');
      badge.setAttribute('position', '1.1 0.4 0.01');
      badge.setAttribute('scale', '0.12 0.12 0.12');
      badge.setAttribute('color', '#666');
      badge.setAttribute('background-color', 'rgba(0,0,0,0.06)');
      badge.setAttribute('class', 'ar-card-badge');
      card.appendChild(badge);
    }
    
    // Description
    const desc = document.createElement('a-text');
    desc.setAttribute('value', poi.description || '');
    desc.setAttribute('align', 'left');
    desc.setAttribute('position', '-1.2 0 0.01');
    desc.setAttribute('scale', '0.14 0.14 0.14');
    desc.setAttribute('color', '#333');
    desc.setAttribute('width', '5');
    desc.setAttribute('wrap-count', '20');
    desc.setAttribute('class', 'ar-card-blurb');
    card.appendChild(desc);
    
    // Distance
    const distText = document.createElement('a-text');
    distText.setAttribute('value', '');
    distText.setAttribute('align', 'right');
    distText.setAttribute('position', '1.1 -0.3 0.01');
    distText.setAttribute('scale', '0.15 0.15 0.15');
    distText.setAttribute('color', poi.color || '#0EA5E9');
    distText.setAttribute('id', `poi-dist-${poi.id}`);
    distText.setAttribute('class', 'ar-card-distance');
    card.appendChild(distText);
    
    container.appendChild(card);
    scene.appendChild(container);
    log(`ar-scene: added POI ${poi.name} at ${poi.lat}, ${poi.lng}`);
  });
  
  log('ar-scene: all POIs added');
}

// ============================================================================
// UPDATE LOOPS
// ============================================================================

// Debug state
let debugFrameCount = 0;
let lastFpsTime = performance.now();
let fps = 0;
let debugHudVisible = false;
let nearestPOIEntity = null;
let debugCube = null;

function startUpdateLoop() {
  const update = () => {
    // Check for NaNs first
    checkForNaNs();
    
    // Update FPS
    updateFPS();
    
    // Update sensor chips
    updateSensorChips();
    
    // Update HUD
    updateHUD();
    
    // Classify POIs (with NaN guards)
    classifyPOIs();
    
    // Update POI distances
    updatePOIDistances();
    
    // Update POI rendering with visibility checks
    updatePOIRendering();
    
    // Update off-screen arrow
    updateOffScreenArrow();
    
    // Update debug HUD
    updateDebugHUD();
    
    requestAnimationFrame(update);
  };
  update();
}

function updateFPS() {
  const now = performance.now();
  const delta = now - lastFpsTime;
  if (delta >= 1000) {
    fps = Math.round((debugFrameCount * 1000) / delta);
    debugFrameCount = 0;
    lastFpsTime = now;
  } else {
    debugFrameCount++;
  }
}

function checkForNaNs() {
  let hasNaN = false;
  
  if (state.geo.last) {
    const lat = state.geo.last.coords.latitude;
    const lng = state.geo.last.coords.longitude;
    const acc = state.geo.last.coords.accuracy;
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || !Number.isFinite(acc)) {
      hasNaN = true;
    }
  }
  
  if (state.imu.headingDeg !== null && !Number.isFinite(state.imu.headingDeg)) {
    hasNaN = true;
  }
  
  // Check POI classifications
  state.poiClassifications.forEach((classification) => {
    if (!Number.isFinite(classification.distance) || 
        !Number.isFinite(classification.bearing)) {
      hasNaN = true;
    }
  });
  
  const nanBadge = document.getElementById('nan-badge');
  if (nanBadge) {
    nanBadge.style.display = hasNaN ? 'block' : 'none';
  }
  
  if (hasNaN) {
    log('WARNING: NaN detected in sensor data');
  }
}

function updateSensorChips() {
  const gpsChip = document.getElementById('sensor-gps');
  const hdgChip = document.getElementById('sensor-hdg');
  const fpsChip = document.getElementById('sensor-fps');
  
  if (gpsChip) {
    if (state.geo.last && Number.isFinite(state.geo.last.coords.accuracy)) {
      const acc = Math.round(state.geo.last.coords.accuracy);
      gpsChip.textContent = `GPS ±${acc}m`;
      gpsChip.classList.toggle('warning', acc > 80);
    } else {
      gpsChip.textContent = 'GPS —';
      gpsChip.classList.add('warning');
    }
  }
  
  if (hdgChip) {
    if (state.imu.headingDeg !== null && Number.isFinite(state.imu.headingDeg)) {
      hdgChip.textContent = `hdg ${Math.round(state.imu.headingDeg)}°`;
      hdgChip.classList.remove('warning');
    } else {
      hdgChip.textContent = 'hdg —';
      hdgChip.classList.add('warning');
    }
  }
  
  if (fpsChip) {
    fpsChip.textContent = `fps ${fps}`;
  }
}

function updateDebugHUD() {
  if (!debugHudVisible) return;
  
  const debugGps = document.getElementById('debug-gps');
  const debugAcc = document.getElementById('debug-acc');
  const debugHeading = document.getElementById('debug-heading');
  const debugNearest = document.getElementById('debug-nearest');
  const debugDist = document.getElementById('debug-dist');
  const debugBearing = document.getElementById('debug-bearing');
  const debugBearingDelta = document.getElementById('debug-bearing-delta');
  const debugScreen = document.getElementById('debug-screen');
  const debugOnscreen = document.getElementById('debug-onscreen');
  const debugFps = document.getElementById('debug-fps');
  
  // GPS
  if (debugGps && state.geo.last) {
    const lat = state.geo.last.coords.latitude;
    const lng = state.geo.last.coords.longitude;
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      debugGps.textContent = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } else {
      debugGps.textContent = 'NaN';
    }
  }
  
  // Accuracy
  if (debugAcc && state.geo.last) {
    const acc = state.geo.last.coords.accuracy;
    if (Number.isFinite(acc)) {
      debugAcc.textContent = `±${Math.round(acc)}m`;
    } else {
      debugAcc.textContent = 'NaN';
    }
  }
  
  // Heading
  if (debugHeading) {
    if (state.imu.headingDeg !== null && Number.isFinite(state.imu.headingDeg)) {
      debugHeading.textContent = `${Math.round(state.imu.headingDeg)}°`;
    } else {
      debugHeading.textContent = '—';
    }
  }
  
  // Nearest POI
  if (state.nearestPOI) {
    const { poi, distance, bearing } = state.nearestPOI;
    const heading = state.imu.headingDeg || 0;
    const bearingDelta = shortestBearingDelta(heading, bearing);
    
    if (debugNearest) debugNearest.textContent = poi.name;
    if (debugDist) {
      if (Number.isFinite(distance)) {
        debugDist.textContent = distance < 1000 
          ? `${Math.round(distance)}m` 
          : `${(distance / 1000).toFixed(1)}km`;
      } else {
        debugDist.textContent = 'NaN';
      }
    }
    if (debugBearing) {
      if (Number.isFinite(bearing)) {
        debugBearing.textContent = `${Math.round(bearing)}°`;
      } else {
        debugBearing.textContent = 'NaN';
      }
    }
    if (debugBearingDelta) {
      if (Number.isFinite(bearingDelta)) {
        debugBearingDelta.textContent = `${Math.round(bearingDelta)}°`;
      } else {
        debugBearingDelta.textContent = 'NaN';
      }
    }
    
    // Screen projection
    const scene = document.querySelector('a-scene');
    const camera = scene?.querySelector('a-camera');
    if (camera && nearestPOIEntity) {
      const screen = worldToScreen(nearestPOIEntity.object3D, camera.object3D);
      if (debugScreen) {
        debugScreen.textContent = `${Math.round(screen.x)}, ${Math.round(screen.y)}`;
      }
      if (debugOnscreen) {
        debugOnscreen.textContent = screen.visible ? 'YES' : 'NO';
      }
    } else {
      if (debugScreen) debugScreen.textContent = '—';
      if (debugOnscreen) debugOnscreen.textContent = '—';
    }
  } else {
    if (debugNearest) debugNearest.textContent = '—';
    if (debugDist) debugDist.textContent = '—';
    if (debugBearing) debugBearing.textContent = '—';
    if (debugBearingDelta) debugBearingDelta.textContent = '—';
    if (debugScreen) debugScreen.textContent = '—';
    if (debugOnscreen) debugOnscreen.textContent = '—';
  }
  
  // FPS
  if (debugFps) {
    debugFps.textContent = fps;
  }
  
  // Log first 10 frames after permissions
  if (debugFrameCount <= 10 && state.geo.granted && state.camera.granted) {
    const activePois = Array.from(state.poiClassifications.entries())
      .map(([id, c]) => {
        const poi = POIS.find(p => p.id === id);
        return { id: poi?.name || id, distM: Math.round(c.distance) };
      })
      .sort((a, b) => a.distM - b.distM)
      .slice(0, 5);
    
    console.table({
      frame: debugFrameCount,
      activePois: activePois.length,
      top5: activePois.map(p => `${p.id} (${p.distM}m)`).join(', ')
    });
  }
}

function updateOffScreenArrow() {
  const arrowHUD = document.getElementById('arrowHUD');
  const needle = arrowHUD?.querySelector('.needle');
  const label = arrowHUD?.querySelector('.label');
  
  if (!arrowHUD || !needle || !label) return;
  
  if (!state.nearestPOI || !state.geo.last || state.imu.headingDeg === null) {
    arrowHUD.classList.add('hidden');
    return;
  }
  
  const { poi, distance, bearing } = state.nearestPOI;
  const heading = state.imu.headingDeg;
  
  // Check if NaN
  if (!Number.isFinite(distance) || !Number.isFinite(bearing) || !Number.isFinite(heading)) {
    arrowHUD.classList.add('hidden');
    return;
  }
  
  // Check if POI is on screen
  const scene = document.querySelector('a-scene');
  const camera = scene?.querySelector('a-camera');
  let isOnScreen = false;
  
  if (camera && nearestPOIEntity) {
    const screen = worldToScreen(nearestPOIEntity.object3D, camera.object3D);
    isOnScreen = screen.visible;
  }
  
  // Show arrow only if off-screen and within range
  if (isOnScreen && distance <= R_IN_RANGE) {
    arrowHUD.classList.add('hidden');
    return;
  }
  
  // Calculate bearing delta
  const bearingDelta = shortestBearingDelta(heading, bearing);
  
  if (!Number.isFinite(bearingDelta)) {
    arrowHUD.classList.add('hidden');
    return;
  }
  
  // Update arrow
  needle.style.transform = `rotate(${bearingDelta}deg)`;
  
  // Update label
  const distText = distance < 1000 
    ? `${Math.round(distance)}m` 
    : `${(distance / 1000).toFixed(1)}km`;
  label.textContent = `${poi.name} · ${distText} →`;
  
  arrowHUD.classList.remove('hidden');
}

function setupDebugHUD() {
  const debugHud = document.getElementById('debug-hud');
  const toggle = document.getElementById('debug-hud-toggle');
  
  if (toggle) {
    toggle.addEventListener('click', () => {
      debugHudVisible = !debugHudVisible;
      if (debugHud) {
        debugHud.style.display = debugHudVisible ? 'block' : 'none';
      }
    });
  }
  
  // Toggle with 'D' key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'd' || e.key === 'D') {
      debugHudVisible = !debugHudVisible;
      if (debugHud) {
        debugHud.style.display = debugHudVisible ? 'block' : 'none';
      }
    }
  });
}

function classifyPOIs() {
  if (!state.geo.last) {
    // Show temporary demo card if GPS not ready
    showTemporaryDemoCard();
    return;
  }
  
  const userLat = Number(state.geo.last.coords.latitude);
  const userLng = Number(state.geo.last.coords.longitude);
  const heading = Number(state.imu.headingDeg) || 0;
  
  // Guard against NaN
  if (!Number.isFinite(userLat) || !Number.isFinite(userLng)) {
    log('WARNING: Invalid GPS coordinates');
    return;
  }
  
  state.poiClassifications.clear();
  let nearestDistance = Infinity;
  state.nearestPOI = null;
  nearestPOIEntity = null;
  
  POIS.forEach(poi => {
    const distance = haversineM(userLat, userLng, poi.lat, poi.lng);
    const bearing = bearingDeg(userLat, userLng, poi.lat, poi.lng);
    
    // Skip if NaN
    if (!Number.isFinite(distance) || !Number.isFinite(bearing)) {
      return;
    }
    
    let type = null;
    if (distance <= R_IN_RANGE) {
      type = 'IN_RANGE';
    } else if (distance <= R_VIS) {
      type = 'VISIBLE';
    } else if (distance <= R_NEAREST) {
      type = 'NEAREST';
    }
    
    if (type) {
      const relativeBearing = normalizeDeg(bearing - heading);
      state.poiClassifications.set(poi.id, {
        type,
        distance,
        bearing,
        relativeBearing
      });
    }
    
    // Track nearest for fallback
    if (distance < nearestDistance && distance <= R_NEAREST) {
      nearestDistance = distance;
      state.nearestPOI = { poi, distance, bearing };
      
      // Find entity for screen projection
      const entity = document.querySelector(`[data-poi-id="${poi.id}"]`);
      if (entity) {
        nearestPOIEntity = entity;
      }
    }
  });
  
  // If nothing within R_VIS, use nearest fallback
  const hasVisible = Array.from(state.poiClassifications.values()).some(c => c.type === 'VISIBLE' || c.type === 'IN_RANGE');
  if (!hasVisible && state.nearestPOI) {
    const { poi, distance, bearing } = state.nearestPOI;
    const heading = Number(state.imu.headingDeg) || 0;
    state.poiClassifications.set(poi.id, {
      type: 'NEAREST',
      distance,
      bearing,
      relativeBearing: normalizeDeg(bearing - heading)
    });
  }
}

function updatePOIDistances() {
  if (!state.geo.last) return;
  
  const userLat = state.geo.last.coords.latitude;
  const userLng = state.geo.last.coords.longitude;
  
  POIS.forEach(poi => {
    const distance = calculateDistance(userLat, userLng, poi.lat, poi.lng);
    const distEl = document.getElementById(`poi-dist-${poi.id}`);
    if (distEl) {
      if (distance < 1000) {
        distEl.setAttribute('value', `${Math.round(distance)}m`);
      } else {
        distEl.setAttribute('value', `${(distance / 1000).toFixed(1)}km`);
      }
    }
  });
}

function updatePOIRendering() {
  const scene = document.querySelector('a-scene');
  const camera = scene?.querySelector('a-camera');
  
  // Update 3D anchored cards for IN_RANGE and VISIBLE POIs
  state.poiClassifications.forEach((classification, poiId) => {
    const poi = POIS.find(p => p.id === poiId);
    if (!poi) return;
    
    const entity = document.querySelector(`[data-poi-id="${poiId}"]`);
    if (!entity) return;
    
    // Check if NaN
    if (!Number.isFinite(classification.distance) || !Number.isFinite(classification.bearing)) {
      entity.setAttribute('visible', false);
      return;
    }
    
    // For IN_RANGE: show if on screen or clamp to visible distance
    if (classification.type === 'IN_RANGE') {
      // Check screen projection
      const screen = worldToScreen(entity.object3D, camera?.object3D);
      
      // If far away, clamp position to make it visible
      if (classification.distance > 80) {
        // Place at clamped distance (60-80m) along bearing
        const clampedDist = Math.min(Math.max(classification.distance, 60), 80);
        // This would require custom positioning logic - for now, just show/hide
      }
      
      entity.setAttribute('visible', true);
      
      // Add debug cube if ?debug=1
      if (new URLSearchParams(window.location.search).get('debug') === '1') {
        addDebugCube(entity);
      }
    } else if (classification.type === 'VISIBLE') {
      // For VISIBLE: show card clamped at 60-80m
      entity.setAttribute('visible', true);
    } else {
      entity.setAttribute('visible', false);
    }
  });
  
  // Update off-axis indicators for VISIBLE POIs
  updateOffAxisIndicators();
  
  // Update nearest fallback banner
  updateNearestFallback();
}

function addDebugCube(entity) {
  if (debugCube) return; // Already added
  
  const cube = document.createElement('a-box');
  cube.setAttribute('position', '0 0 0');
  cube.setAttribute('width', '1');
  cube.setAttribute('height', '1');
  cube.setAttribute('depth', '1');
  cube.setAttribute('color', '#ff0000');
  cube.setAttribute('opacity', '0.5');
  cube.id = 'debug-cube';
  entity.appendChild(cube);
  debugCube = cube;
}

function updateOffAxisIndicators() {
  let indicatorContainer = document.getElementById('off-axis-indicators');
  if (!indicatorContainer) {
    indicatorContainer = document.createElement('div');
    indicatorContainer.id = 'off-axis-indicators';
    indicatorContainer.className = 'off-axis-indicators';
    document.getElementById('ar-screen').appendChild(indicatorContainer);
  }
  
  // Clear existing
  indicatorContainer.innerHTML = '';
  
  const visiblePOIs = Array.from(state.poiClassifications.entries())
    .filter(([_, c]) => c.type === 'VISIBLE')
    .map(([poiId, classification]) => ({
      poi: POIS.find(p => p.id === poiId),
      classification
    }));
  
  visiblePOIs.forEach(({ poi, classification }) => {
    const indicator = createOffAxisIndicator(poi, classification);
    indicatorContainer.appendChild(indicator);
  });
}

function createOffAxisIndicator(poi, classification) {
  const { relativeBearing, distance } = classification;
  const isLeft = relativeBearing > 180;
  // Normalize angle to -180 to 180 for positioning
  const angle = isLeft ? relativeBearing - 360 : relativeBearing;
  
  const div = document.createElement('div');
  div.className = 'off-axis-chip';
  div.style.left = isLeft ? '12px' : 'auto';
  div.style.right = isLeft ? 'auto' : '12px';
  // Position on screen edge based on angle (-90 to 90 degrees)
  const normalizedAngle = Math.max(-90, Math.min(90, angle));
  const topPercent = 50 + (normalizedAngle / 90) * 30; // 20% to 80% of screen
  div.style.top = `${topPercent}%`;
  
  const distText = distance < 1000 ? `${Math.round(distance)}m` : `${(distance / 1000).toFixed(1)}km`;
  const arrowSymbol = isLeft ? '←' : '→';
  
  div.innerHTML = `
    <div class="off-axis-arrow" style="transform: rotate(${angle}deg)">${arrowSymbol}</div>
    <div class="off-axis-name">${poi.name}</div>
    <div class="off-axis-distance">${distText}</div>
  `;
  
  return div;
}

function updateNearestFallback() {
  const nearest = Array.from(state.poiClassifications.entries())
    .find(([_, c]) => c.type === 'NEAREST' && !Array.from(state.poiClassifications.values()).some(c2 => c2.type === 'VISIBLE' || c2.type === 'IN_RANGE'));
  
  let banner = document.getElementById('nearest-fallback-banner');
  
  if (nearest) {
    const [poiId, classification] = nearest;
    const poi = POIS.find(p => p.id === poiId);
    const { distance, relativeBearing } = classification;
    
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'nearest-fallback-banner';
      banner.className = 'nearest-fallback-banner';
      document.getElementById('ar-screen').appendChild(banner);
    }
    
    const distText = distance < 1000 ? `${Math.round(distance)}m` : `${(distance / 1000).toFixed(1)}km`;
    const arrow = relativeBearing > 180 ? '←' : '→';
    
    banner.innerHTML = `
      <div class="nearest-label">Nearest:</div>
      <div class="nearest-name">${poi.name}</div>
      <div class="nearest-distance">${distText}</div>
      <div class="nearest-arrow" style="transform: rotate(${relativeBearing}deg)">${arrow}</div>
    `;
    banner.style.display = 'block';
  } else if (banner) {
    banner.style.display = 'none';
  }
}

function showTemporaryDemoCard() {
  let tempCard = document.getElementById('temp-demo-card');
  if (!tempCard) {
    tempCard = document.createElement('div');
    tempCard.id = 'temp-demo-card';
    tempCard.className = 'temp-demo-card';
    tempCard.innerHTML = '<div class="temp-card-content">Awaiting GPS/Heading...</div>';
    document.getElementById('ar-screen').appendChild(tempCard);
  }
  tempCard.style.display = 'block';
  
  // Hide when GPS is ready
  if (state.geo.last) {
    tempCard.style.display = 'none';
  }
}

function showAccuracyHint(show) {
  let hint = document.getElementById('accuracy-hint');
  if (show) {
    if (!hint) {
      hint = document.createElement('div');
      hint.id = 'accuracy-hint';
      hint.className = 'accuracy-hint';
      hint.textContent = 'Reacquiring location...';
      document.getElementById('ar-screen').appendChild(hint);
    }
    hint.style.display = 'block';
  } else if (hint) {
    hint.style.display = 'none';
  }
}

// ============================================================================
// ROBUST MATH HELPERS (NaN-Safe)
// ============================================================================

function haversineM(lat1, lon1, lat2, lon2) {
  // Guard against NaN/undefined
  lat1 = Number(lat1);
  lon1 = Number(lon1);
  lat2 = Number(lat2);
  lon2 = Number(lon2);
  
  if (!Number.isFinite(lat1) || !Number.isFinite(lon1) || 
      !Number.isFinite(lat2) || !Number.isFinite(lon2)) {
    return NaN;
  }
  
  const R = 6371000; // Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const dist = R * c;
  return Number.isFinite(dist) ? dist : NaN;
}

function bearingDeg(lat1, lon1, lat2, lon2) {
  lat1 = Number(lat1);
  lon1 = Number(lon1);
  lat2 = Number(lat2);
  lon2 = Number(lon2);
  
  if (!Number.isFinite(lat1) || !Number.isFinite(lon1) || 
      !Number.isFinite(lat2) || !Number.isFinite(lon2)) {
    return NaN;
  }
  
  const dLng = (lon2 - lon1) * Math.PI / 180;
  const lat1Rad = lat1 * Math.PI / 180;
  const lat2Rad = lat2 * Math.PI / 180;
  const y = Math.sin(dLng) * Math.cos(lat2Rad);
  const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - 
            Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng);
  const bearing = Math.atan2(y, x) * 180 / Math.PI;
  return normalizeDeg(bearing);
}

function normalizeDeg(d) {
  d = Number(d);
  if (!Number.isFinite(d)) return NaN;
  return ((d % 360) + 360) % 360;
}

function shortestBearingDelta(a, b) {
  a = normalizeDeg(a);
  b = normalizeDeg(b);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return NaN;
  let d = normalizeDeg(b - a);
  return d > 180 ? d - 360 : d;
}

function worldToScreen(obj3D, camera, out = { x: 0, y: 0, visible: false }) {
  if (!obj3D || !camera) {
    out.visible = false;
    return out;
  }
  
  const vector = new THREE.Vector3();
  obj3D.getWorldPosition(vector);
  vector.project(camera);
  
  out.x = (vector.x * 0.5 + 0.5) * window.innerWidth;
  out.y = (vector.y * -0.5 + 0.5) * window.innerHeight;
  
  // Visible if in viewport and in front of camera
  out.visible = (
    vector.x >= -1 && vector.x <= 1 &&
    vector.y >= -1 && vector.y <= 1 &&
    vector.z >= 0 && vector.z <= 1
  );
  
  return out;
}

// Legacy aliases for backward compatibility
function calculateDistance(lat1, lng1, lat2, lng2) {
  return haversineM(lat1, lng1, lat2, lng2);
}

function calculateBearing(lat1, lng1, lat2, lng2) {
  return bearingDeg(lat1, lng1, lat2, lng2);
}

function updateHUD() {
  // Update heading
  if (state.imu.headingDeg !== null) {
    updateHUDHeading(state.imu.headingDeg);
  }
  
  // Update GPS
  if (state.geo.last) {
    updateHUDGeo(state.geo.last);
  }
}

function updateHUDHeading(heading) {
  const el = document.getElementById('heading-value');
  if (el) {
    el.textContent = `${Math.round(heading)}°`;
  }
  
  // Update debug chip
  const debugChip = document.getElementById('heading-debug-chip');
  const debugValue = document.getElementById('heading-debug-value');
  if (debugChip && debugValue) {
    debugChip.style.display = 'block';
    debugValue.textContent = Math.round(heading);
  }
}

function updateHUDGeo(pos) {
  const gpsEl = document.getElementById('gps-value');
  const accEl = document.getElementById('accuracy-value');
  
  if (gpsEl && pos) {
    gpsEl.textContent = `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`;
  }
  
  if (accEl && pos) {
    accEl.textContent = `±${Math.round(pos.coords.accuracy)}m`;
  }
}

// ============================================================================
// CLEANUP
// ============================================================================

function stopAllSensors() {
  // Stop camera
  try {
    const video = document.getElementById('camera');
    if (video && video.srcObject) {
      video.srcObject.getTracks().forEach(track => track.stop());
      video.srcObject = null;
    }
  } catch (e) {
    log(`cleanup: camera error ${e.message}`);
  }
  
  // Stop location watch
  try {
    if (state.geo.watchId) {
      navigator.geolocation.clearWatch(state.geo.watchId);
      state.geo.watchId = null;
    }
  } catch (e) {
    log(`cleanup: geo error ${e.message}`);
  }
  
  // Remove orientation listeners
  window.removeEventListener('deviceorientation', onOrient);
  window.removeEventListener('deviceorientationabsolute', onOrient);
  
  log('cleanup: all sensors stopped');
}

// ============================================================================
// iOS HELP
// ============================================================================

function showIOSHelp() {
  const helpEl = document.getElementById('ios-help');
  if (helpEl) {
    helpEl.style.display = 'block';
  }
}

function setupIOSHelp() {
  const helpLink = document.getElementById('ios-help-link');
  if (helpLink) {
    helpLink.addEventListener('click', (e) => {
      e.preventDefault();
      const modal = document.getElementById('ios-help-modal');
      if (modal) {
        modal.style.display = 'flex';
      }
    });
  }
}

// ============================================================================
// VIEWPORT MANAGEMENT (iOS Safari Toolbar Fix)
// ============================================================================

function setVH() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  log(`viewport: --vh=${vh.toFixed(2)}px (window.innerHeight=${window.innerHeight})`);
}

// Update on resize and orientation change
window.addEventListener('resize', setVH);
window.addEventListener('orientationchange', () => {
  setTimeout(setVH, 100); // Delay for iOS orientation animation
});
window.addEventListener('visualViewport', setVH); // iOS Safari address bar

// ============================================================================
// DEBUG PANEL TOGGLE
// ============================================================================

function setupDebugToggle() {
  const toggleBtn = document.getElementById('toggle-debug');
  const logPanel = document.getElementById('dev-log');
  
  if (!toggleBtn || !logPanel) {
    console.warn('[Viewport] Debug toggle elements not found');
    return;
  }
  
  // Restore state from localStorage
  const wasVisible = localStorage.getItem('sightline-debug-visible') === 'true';
  if (wasVisible) {
    logPanel.hidden = false;
  }
  
  toggleBtn.addEventListener('click', () => {
    logPanel.hidden = !logPanel.hidden;
    localStorage.setItem('sightline-debug-visible', !logPanel.hidden);
    log(`debug: panel ${logPanel.hidden ? 'hidden' : 'visible'}`);
  });
  
  log('debug: toggle button initialized');
}

// ============================================================================
// RENDERER RESIZE HANDLING
// ============================================================================

function resizeRenderTarget() {
  const scene = document.querySelector('a-scene');
  if (!scene || !scene.hasLoaded) return;
  
  const renderer = scene.renderer;
  const camera = scene.camera;
  
  if (renderer) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    log(`renderer: resized to ${w}x${h}`);
  }
  
  if (camera) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }
}

// ============================================================================
// DIAGNOSTICS
// ============================================================================

function logRects() {
  const selectors = ['#camera', '.a-canvas', 'canvas.webgl', '#imu-hud', '#dev-log', '#state-chip', '.mode-badge'];
  const results = [];
  
  selectors.forEach(sel => {
    const el = document.querySelector(sel);
    if (el) {
      const rect = el.getBoundingClientRect();
      const styles = window.getComputedStyle(el);
      results.push({
        selector: sel,
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        top: Math.round(rect.top),
        left: Math.round(rect.left),
        zIndex: styles.zIndex,
        display: styles.display,
        visibility: styles.visibility
      });
    }
  });
  
  console.table(results);
  log(`diagnostics: rects logged (window: ${window.innerWidth}x${window.innerHeight})`);
  
  return results;
}

// Debug outline toggle
window.__dbgOutline = function(on = true) {
  const selectors = ['#camera', '.a-canvas', 'canvas.webgl', '#imu-hud', '#dev-log', '#state-chip', '.mode-badge'];
  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.style.outline = on ? '2px solid rgba(0,255,255,0.6)' : 'none';
    });
  });
  log(`diagnostics: outline ${on ? 'ON' : 'OFF'}`);
};

// Expose diagnostics
window.__dbgLogRects = logRects;

// ============================================================================
// INITIALIZATION
// ============================================================================

window.addEventListener('DOMContentLoaded', () => {
  log(`boot: ua=${navigator.userAgent.substring(0, 50)}`);
  log(`boot: secure=${window.isSecureContext}`);
  log(`boot: ts=${Date.now()}`);
  
  // Set initial viewport height
  setVH();
  
  setChip('INIT');
  
  // Setup all handlers
  setupPermissionHandlers();
  setupActionHandlers();
  setupIOSHelp();
  setupDebugToggle();
  setupMuseumDebugToggle();
  setupDebugHUD();
  
  // Setup resize handlers
  window.addEventListener('resize', () => {
    setVH();
    resizeRenderTarget();
    logRects();
  });
  
  // Check initial permission states
  maybeEnableStartAR();
  
  // Log initial rects after a short delay
  setTimeout(() => {
    logRects();
    log('boot: ready');
  }, 500);
});

// ============================================================================
// MUSEUM ANCHOR CARD
// ============================================================================

let museumCardInstance = null;
let museumModeActive = false;
let leaderCanvas = null;
let leaderCtx = null;
let highlightTimeouts = new Map();

// Museum card data
const MUSEUM_CARD_DATA = {
  title: 'Tyrannosaurus rex',
  chip: 'Late Cretaceous',
  subtitle: 'Predator with extreme bite force.',
  location: 'You\'re here · Main Hall',
  imageUrl: './assets/img/specimen-detail.jpg', // Placeholder
  pills: {
    active: 'In Range',
    options: ['In Range', 'Visible', 'Nearest']
  }
};

// AI reply templates with keyword mapping
const AI_REPLIES = {
  'bite force': {
    text: 'The T. rex had one of the strongest bite forces of any land animal, estimated at 8,000–12,000 pounds per square inch. This allowed it to crush bone.',
    highlight: 'upper_jaw'
  },
  'upper jaw': {
    text: 'The upper jaw contains massive serrated teeth up to 12 inches long, designed for tearing flesh and crushing bone.',
    highlight: 'upper_jaw'
  },
  'teeth': {
    text: 'T. rex had 50–60 banana-sized teeth with serrated edges. They were constantly replaced throughout its life.',
    highlight: 'teeth'
  },
  'skull': {
    text: 'The skull was massive, up to 5 feet long, with powerful jaw muscles and large openings to reduce weight.',
    highlight: 'skull'
  },
  default: {
    text: 'Tyrannosaurus rex was one of the largest land predators, living 68–66 million years ago in what is now North America.',
    highlight: null
  }
};

function createMuseumCard() {
  const container = document.getElementById('museum-card-container');
  if (!container) return null;
  
  const card = document.createElement('div');
  card.className = 'mx-card';
  card.id = 'museum-card';
  
  card.innerHTML = `
    <div class="mx-card__tile">
      <img src="${MUSEUM_CARD_DATA.imageUrl}" alt="Specimen detail" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'520\\' height=\\'120\\'%3E%3Crect fill=\\'%23DDD\\' width=\\'520\\' height=\\'120\\'/%3E%3Ctext x=\\'50%25\\' y=\\'50%25\\' text-anchor=\\'middle\\' dy=\\'.3em\\' fill=\\'%23999\\' font-size=\\'18\\'%3ESpecimen Detail%3C/text%3E%3C/svg%3E'">
    </div>
    <div class="mx-card__title-row">
      <h1 class="mx-card__title">${MUSEUM_CARD_DATA.title}</h1>
      <span class="mx-chip">${MUSEUM_CARD_DATA.chip}</span>
    </div>
    <p class="mx-card__subtitle">${MUSEUM_CARD_DATA.subtitle}</p>
    <div class="mx-card__bottom">
      <span class="mx-here">${MUSEUM_CARD_DATA.location}</span>
      <div class="mx-pills">
        ${MUSEUM_CARD_DATA.pills.options.map((pill, i) => 
          `<button class="mx-pill ${i === 0 ? 'mx-pill--active' : ''}" data-pill="${pill}">${pill}</button>`
        ).join('')}
      </div>
    </div>
    <button class="mx-more" id="mx-more-btn">More ▸ → Ask AI</button>
    <div class="mx-drawer" id="mx-drawer">
      <div class="mx-drawer__input">
        <button class="mx-voice" id="mx-voice-btn" aria-label="Voice input">🎤</button>
        <input class="mx-query" id="mx-query-input" placeholder="Ask about this fossil…" />
        <button class="mx-send" id="mx-send-btn">Send</button>
      </div>
      <div class="mx-drawer__feed" id="mx-drawer-feed"></div>
    </div>
  `;
  
  container.appendChild(card);
  container.style.display = 'block';
  
  // Setup event listeners
  setupMuseumCardListeners(card);
  
  // Animate in
  setTimeout(() => {
    card.classList.add('mx-card--visible');
    playSound('appear');
  }, 50);
  
  return card;
}

function setupMuseumCardListeners(card) {
  // More button
  const moreBtn = card.querySelector('#mx-more-btn');
  const drawer = card.querySelector('#mx-drawer');
  
  if (moreBtn && drawer) {
    moreBtn.addEventListener('click', () => {
      drawer.classList.toggle('mx-drawer--open');
      moreBtn.textContent = drawer.classList.contains('mx-drawer--open') 
        ? 'Less ▾' 
        : 'More ▸ → Ask AI';
    });
  }
  
  // Voice button
  const voiceBtn = card.querySelector('#mx-voice-btn');
  const queryInput = card.querySelector('#mx-query-input');
  
  if (voiceBtn && queryInput) {
    let recognition = null;
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        queryInput.value = transcript;
        voiceBtn.classList.remove('mx-voice--active');
      };
      
      recognition.onerror = () => {
        voiceBtn.classList.remove('mx-voice--active');
      };
      
      recognition.onend = () => {
        voiceBtn.classList.remove('mx-voice--active');
      };
    }
    
    voiceBtn.addEventListener('click', () => {
      if (recognition) {
        if (voiceBtn.classList.contains('mx-voice--active')) {
          recognition.stop();
        } else {
          voiceBtn.classList.add('mx-voice--active');
          recognition.start();
        }
      } else {
        // Fallback: focus input
        queryInput.focus();
      }
    });
  }
  
  // Send button
  const sendBtn = card.querySelector('#mx-send-btn');
  if (sendBtn && queryInput) {
    sendBtn.addEventListener('click', () => {
      const query = queryInput.value.trim();
      if (query) {
        handleMuseumQuery(query);
        queryInput.value = '';
      }
    });
    
    // Enter key
    queryInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendBtn.click();
      }
    });
  }
  
  // Pill buttons
  card.querySelectorAll('.mx-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      card.querySelectorAll('.mx-pill').forEach(p => p.classList.remove('mx-pill--active'));
      pill.classList.add('mx-pill--active');
    });
  });
}

function handleMuseumQuery(query) {
  const feed = document.getElementById('mx-drawer-feed');
  if (!feed) return;
  
  // Add user message
  const userMsg = document.createElement('div');
  userMsg.className = 'msg user';
  userMsg.textContent = query;
  feed.appendChild(userMsg);
  feed.scrollTop = feed.scrollHeight;
  
  // Find matching AI reply
  const lowerQuery = query.toLowerCase();
  let reply = AI_REPLIES.default;
  let highlightRegion = null;
  
  for (const [keyword, data] of Object.entries(AI_REPLIES)) {
    if (keyword !== 'default' && lowerQuery.includes(keyword)) {
      reply = data;
      highlightRegion = data.highlight;
      break;
    }
  }
  
  // Simulate AI delay
  setTimeout(() => {
    const aiMsg = document.createElement('div');
    aiMsg.className = 'msg ai';
    aiMsg.textContent = reply.text;
    feed.appendChild(aiMsg);
    feed.scrollTop = feed.scrollHeight;
    
    playSound('reply');
    
    // Highlight region if specified
    if (highlightRegion) {
      highlightRegionOnFossil(highlightRegion);
    }
  }, 500);
}

function highlightRegionOnFossil(regionId) {
  // Clear existing highlights
  clearAllHighlights();
  
  const anchor = document.getElementById(`bone_anchor_${regionId}`);
  if (!anchor) return;
  
  // Get 3D position
  const scene = document.querySelector('a-scene');
  if (!scene) return;
  
  const camera = scene.querySelector('a-camera');
  if (!camera) return;
  
  // Create highlight overlay on the fossil mesh
  const fossilSkull = document.getElementById('fossil-skull');
  if (fossilSkull) {
    // Add emissive material for glow effect
    fossilSkull.setAttribute('material', {
      opacity: 0.8,
      emissive: '#FFA500',
      emissiveIntensity: 0.5
    });
    
    // Auto-clear after 1.5s
    const timeout = setTimeout(() => {
      fossilSkull.setAttribute('material', {
        opacity: 0.8,
        emissive: '#000000',
        emissiveIntensity: 0
      });
    }, 1500);
    
    highlightTimeouts.set(regionId, timeout);
  }
}

function clearAllHighlights() {
  highlightTimeouts.forEach(timeout => clearTimeout(timeout));
  highlightTimeouts.clear();
  
  const fossilSkull = document.getElementById('fossil-skull');
  if (fossilSkull) {
    fossilSkull.setAttribute('material', {
      opacity: 0.8,
      emissive: '#000000',
      emissiveIntensity: 0
    });
  }
}

function playSound(type) {
  // Stub for sound effects (will use actual OGG files when available)
  try {
    const audio = new Audio(`./assets/sfx/${type}.ogg`);
    audio.volume = 0.3;
    audio.play().catch(() => {
      // Silently fail if audio not available
    });
  } catch (e) {
    // Silently fail
  }
}

function updateMuseumCardPosition() {
  if (!museumCardInstance || !museumModeActive) return;
  
  const scene = document.querySelector('a-scene');
  const camera = scene?.querySelector('a-camera');
  const anchor = document.getElementById('bone_anchor_upper_jaw');
  
  if (!scene || !camera || !anchor) return;
  
  // Get world positions
  const anchorObj = anchor.object3D;
  const cameraObj = camera.object3D;
  
  // Calculate offset position (0.3m right, 0.2m up, 0.6m toward camera)
  const offset = new THREE.Vector3(0.3, 0.2, 0.6);
  const worldPos = new THREE.Vector3();
  anchorObj.getWorldPosition(worldPos);
  worldPos.add(offset);
  
  // Project to screen space
  const vector = worldPos.clone();
  vector.project(cameraObj);
  
  const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
  const y = (vector.y * -0.5 + 0.5) * window.innerHeight;
  
  // Update card position
  museumCardInstance.style.left = `${x}px`;
  museumCardInstance.style.top = `${y}px`;
  museumCardInstance.style.transform = `translate(-50%, -50%)`;
  
  // Gentle billboarding (slerp quaternion toward camera)
  const cardQuat = new THREE.Quaternion();
  const lookAt = new THREE.Vector3();
  lookAt.subVectors(cameraObj.position, worldPos).normalize();
  const targetQuat = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 0, -1),
    lookAt
  );
  cardQuat.slerp(targetQuat, 0.1); // Small factor to avoid sliding
  
  // Update leader line
  updateLeaderLine(anchorObj, museumCardInstance);
}

function updateLeaderLine(anchorObj, cardEl) {
  if (!leaderCanvas || !leaderCtx) {
    leaderCanvas = document.getElementById('mx-leader');
    if (leaderCanvas) {
      leaderCanvas.width = window.innerWidth;
      leaderCanvas.height = window.innerHeight;
      leaderCtx = leaderCanvas.getContext('2d');
    } else {
      return;
    }
  }
  
  // Resize canvas if needed
  if (leaderCanvas.width !== window.innerWidth || leaderCanvas.height !== window.innerHeight) {
    leaderCanvas.width = window.innerWidth;
    leaderCanvas.height = window.innerHeight;
  }
  
  // Clear canvas
  leaderCtx.clearRect(0, 0, leaderCanvas.width, leaderCanvas.height);
  
  const scene = document.querySelector('a-scene');
  const camera = scene?.querySelector('a-camera');
  if (!camera) return;
  
  // Get anchor world position
  const worldPos = new THREE.Vector3();
  anchorObj.getWorldPosition(worldPos);
  
  // Project to screen
  const vector = worldPos.clone();
  vector.project(camera.object3D);
  
  const anchorX = (vector.x * 0.5 + 0.5) * window.innerWidth;
  const anchorY = (vector.y * -0.5 + 0.5) * window.innerHeight;
  
  // Get card position
  const cardRect = cardEl.getBoundingClientRect();
  const cardX = cardRect.left + cardRect.width / 2;
  const cardY = cardRect.top + cardRect.height / 2;
  
  // Draw line
  leaderCtx.strokeStyle = '#222';
  leaderCtx.lineWidth = 2;
  leaderCtx.beginPath();
  leaderCtx.moveTo(anchorX, anchorY);
  leaderCtx.lineTo(cardX, cardY);
  leaderCtx.stroke();
  
  // Draw end-dot (6-8px)
  leaderCtx.fillStyle = '#222';
  leaderCtx.beginPath();
  leaderCtx.arc(anchorX, anchorY, 7, 0, Math.PI * 2);
  leaderCtx.fill();
}

function startMuseumMode() {
  if (museumModeActive) return;
  
  museumModeActive = true;
  
  // Show fossil
  const fossil = document.getElementById('demo-fossil');
  if (fossil) {
    fossil.setAttribute('visible', 'true');
  }
  
  // Create card
  museumCardInstance = createMuseumCard();
  
  // Start update loop
  const updateLoop = () => {
    if (museumModeActive && museumCardInstance) {
      updateMuseumCardPosition();
      requestAnimationFrame(updateLoop);
    }
  };
  updateLoop();
  
  log('museum: mode activated');
}

function stopMuseumMode() {
  if (!museumModeActive) return;
  
  museumModeActive = false;
  
  // Hide fossil
  const fossil = document.getElementById('demo-fossil');
  if (fossil) {
    fossil.setAttribute('visible', 'false');
  }
  
  // Remove card
  const container = document.getElementById('museum-card-container');
  if (container) {
    container.innerHTML = '';
    container.style.display = 'none';
  }
  
  museumCardInstance = null;
  clearAllHighlights();
  
  // Clear leader canvas
  if (leaderCtx) {
    leaderCtx.clearRect(0, 0, leaderCanvas.width, leaderCanvas.height);
  }
  
  log('museum: mode deactivated');
}

// Add debug toggle for museum mode
function setupMuseumDebugToggle() {
  // Add toggle to debug panel
  const devLog = document.getElementById('dev-log');
  if (devLog) {
    const toggle = document.createElement('button');
    toggle.textContent = '🦴 Museum Demo (Fossil)';
    toggle.style.cssText = 'margin: 8px 0; padding: 8px 12px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px;';
    toggle.addEventListener('click', () => {
      if (museumModeActive) {
        stopMuseumMode();
        toggle.textContent = '🦴 Museum Demo (Fossil)';
      } else {
        startMuseumMode();
        toggle.textContent = '❌ Stop Museum Demo';
      }
    });
    
    // Insert after first log entry or at top
    if (devLog.firstChild) {
      devLog.insertBefore(toggle, devLog.firstChild);
    } else {
      devLog.appendChild(toggle);
    }
  }
}

// Expose for debugging
window.SightlineState = state;
window.SightlineLog = log;
window.SightlineStopSensors = stopAllSensors;
window.SightlineSetVH = setVH;
window.SightlineMuseumMode = { start: startMuseumMode, stop: stopMuseumMode };

