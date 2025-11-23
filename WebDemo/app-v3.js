/**
 * Sightline WebAR - V3.2 Reduction Flow
 * Single-stream permission sequence with minimalist UI
 */

// ============================================================================
// CONFIGURATION & DATA
// ============================================================================

const CONFIG = {
  R_IN_RANGE: 600,
  R_VIS: 1500,
  DEBUG: new URLSearchParams(window.location.search).has('debug')
};

const POIS = [
  { id: 'clock-tower', name: 'Clock Tower', lat: 22.2946, lng: 114.1699, description: 'Former railway terminus', color: '#3B82F6' },
  { id: 'star-ferry', name: 'Star Ferry', lat: 22.2937, lng: 114.1703, description: 'Iconic crossing', color: '#22C55E' },
  { id: 'ifc', name: 'IFC Two', lat: 22.2855, lng: 114.1588, description: '412m Skyscraper', color: '#3B82F6' },
  { id: 'icc', name: 'ICC', lat: 22.3069, lng: 114.1617, description: '484m Skyscraper', color: '#3B82F6' },
  { id: 'mplus', name: 'M+ Museum', lat: 22.3030, lng: 114.1590, description: 'Visual culture', color: '#A855F7' }
];

// ============================================================================
// STATE
// ============================================================================

const state = {
  perms: {
    camera: false,
    location: false,
    motion: false
  },
  sensors: {
    heading: null,
    gps: null
  },
  isDemo: false
};

// ============================================================================
// DOM ELEMENTS
// ============================================================================

const UI = {
  panel: document.querySelector('.start-panel'),
  stage: document.getElementById('ar-stage'),
  
  // Permission Items
  itemCam: document.getElementById('perm-item-camera'),
  itemLoc: document.getElementById('perm-item-location'),
  itemMot: document.getElementById('perm-item-motion'),
  
  // Buttons
  btnEnable: document.getElementById('btn-enable-access'),
  btnEnter: document.getElementById('btn-enter-experience'),
  
  // Debug
  debugPanel: document.querySelector('.debug-panel'),
  debugLog: document.getElementById('dev-log')
};

// ============================================================================
// UTILS
// ============================================================================

function log(msg) {
  console.log(`[Sightline] ${msg}`);
  if (UI.debugLog) {
    const ts = new Date().toLocaleTimeString('en-US', { hour12: false });
    UI.debugLog.textContent = `[${ts}] ${msg}\n` + UI.debugLog.textContent;
  }
}

function setPermState(type, granted) {
  state.perms[type] = granted;
  const el = UI[`item${type.charAt(0).toUpperCase() + type.slice(1,3)}`]; // itemCam, itemLoc...
  
  if (el && granted) {
    el.classList.add('active');
    const icon = el.querySelector('.perm-icon');
    if (icon) icon.textContent = '✓'; // Checkmark
  }
}

function checkAllGranted() {
  return state.perms.camera && state.perms.location && state.perms.motion;
}

// ============================================================================
// PERMISSION FLOW
// ============================================================================

async function runPermissionSequence() {
  UI.btnEnable.disabled = true;
  UI.btnEnable.textContent = 'Requesting...';

  // 1. Camera
  try {
    log('Req: Camera...');
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    stream.getTracks().forEach(t => t.stop()); // Release immediately
    setPermState('camera', true);
    log('Ack: Camera');
  } catch (e) {
    log('Err: Camera denied');
    alert('Camera access is required. Please enable in Settings.');
    UI.btnEnable.textContent = 'Retry Access';
    UI.btnEnable.disabled = false;
    return;
  }
  
  // 2. Location
  try {
    log('Req: Location...');
    await new Promise((resolve, reject) => {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
          state.sensors.gps = pos;
          resolve();
        },
        (err) => reject(err),
        { enableHighAccuracy: true, timeout: 10000 }
  );
  });
    setPermState('location', true);
    log('Ack: Location');
  } catch (e) {
    log('Err: Location denied');
    alert('Location access is required for AR.');
    UI.btnEnable.textContent = 'Retry Access';
    UI.btnEnable.disabled = false;
    return;
  }
  
  // 3. Motion (iOS Guard)
  try {
    log('Req: Motion...');
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      const permission = await DeviceMotionEvent.requestPermission();
      if (permission === 'granted') {
        setPermState('motion', true);
        log('Ack: Motion (iOS)');
  } else {
        throw new Error('iOS Motion denied');
      }
  } else {
      // Non-iOS or older
      setPermState('motion', true);
      log('Ack: Motion (Implicit)');
    }
  } catch (e) {
    log('Err: Motion denied');
    alert('Motion sensors blocked.');
    UI.btnEnable.textContent = 'Retry Access';
    UI.btnEnable.disabled = false;
    return;
  }
  
  // Done?
  if (checkAllGranted()) {
    showEnterButton();
  }
}

function showEnterButton() {
  UI.btnEnable.classList.add('hidden');
  UI.btnEnter.classList.remove('hidden');
  
  // Auto-focus animation or sound could go here
}

// ============================================================================
// AR INITIALIZATION
// ============================================================================

async function enterExperience() {
  log('System: Entering AR...');
  
  // Fade out start panel
  UI.panel.classList.add('hidden');
  document.getElementById('hud').classList.remove('hidden');

  // Initialize A-Frame
  initARScene();
}

function initARScene() {
  UI.stage.innerHTML = ''; // Clear placeholder

  const scene = document.createElement('a-scene');
  scene.setAttribute('embedded', '');
  scene.setAttribute('vr-mode-ui', 'enabled: false');
  scene.setAttribute('loading-screen', 'enabled: false');
  scene.setAttribute('renderer', 'logarithmicDepthBuffer: true; precision: medium; antialias: true; alpha: true;');
  
  // AR.js config
  // FIX: Updated config to match requirements and fix black screen
  scene.setAttribute('arjs', `
    sourceType: webcam; 
    debugUIEnabled: false; 
    detectionMode: mono_and_matrix; 
    matrixCodeType: 3x3;
  `);
  
  // Renderer config for logarithmic depth (prevents z-fighting)
  scene.setAttribute('renderer', 'logarithmicDepthBuffer: true; precision: medium;');

  // Camera
  const cam = document.createElement('a-camera');
  cam.setAttribute('gps-camera', 'minDistance: 20; maxDistance: 5000;');
  cam.setAttribute('rotation-reader', '');
  scene.appendChild(cam);

  // Add listener for GPS updates to load content dynamically
  let contentLoaded = false;
  scene.addEventListener('gps-camera-update-position', (e) => {
    if (!contentLoaded) {
      log(`GPS Acquired: ${e.detail.position.longitude}, ${e.detail.position.latitude}`);
      loadTuenMunContent(scene);
      contentLoaded = true;
    }
  });

  // Add static POIs (Legacy/Global) - Optional, keeping for now or can remove if Tuen Mun is exclusive
  // POIS.forEach(poi => {
  //   const el = createPOI(poi);
  //   scene.appendChild(el);
  // });

  UI.stage.appendChild(scene);
  
  // Sensor Listeners
  window.addEventListener('deviceorientation', (e) => {
    // Keep sensor warm
    state.sensors.heading = e.webkitCompassHeading || (360 - e.alpha);
  }, true);
}

function loadTuenMunContent(scene) {
  log('Loading Tuen Mun Content...');

  // POI 1: Tuen Mun Government School
  const poi1 = document.createElement('a-text');
  poi1.setAttribute('value', 'Tuen Mun Govt. School');
  poi1.setAttribute('look-at', '[gps-camera]');
  poi1.setAttribute('color', '#FFFFFF');
  poi1.setAttribute('scale', '10 10 10'); // Large visibility
  poi1.setAttribute('align', 'center');
  poi1.setAttribute('gps-entity-place', 'latitude: 22.3916; longitude: 113.9765;');
  scene.appendChild(poi1);

  // POI 2: Jockey Club
  const poi2 = document.createElement('a-text');
  poi2.setAttribute('value', 'Jockey Club');
  poi2.setAttribute('look-at', '[gps-camera]');
  poi2.setAttribute('color', '#FFFF00'); // Yellow
  poi2.setAttribute('scale', '10 10 10');
  poi2.setAttribute('align', 'center');
  poi2.setAttribute('gps-entity-place', 'latitude: 22.3925; longitude: 113.9770;');
  scene.appendChild(poi2);

  log('Tuen Mun POIs added.');
}

function createPOI(poi) {
  const el = document.createElement('a-entity');
  el.setAttribute('gps-entity-place', `latitude: ${poi.lat}; longitude: ${poi.lng}`);
  
  // Simple Pin
  const pin = document.createElement('a-entity');
  pin.setAttribute('geometry', 'primitive: cone; radiusBottom: 0.2; radiusTop: 1; height: 3; segmentsRadial: 8');
  pin.setAttribute('material', `color: ${poi.color}; opacity: 0.9;`);
  pin.setAttribute('position', '0 30 0');
  pin.setAttribute('rotation', '180 0 0');
  
  // Label
  const text = document.createElement('a-text');
  text.setAttribute('value', poi.name);
  text.setAttribute('scale', '8 8 8');
  text.setAttribute('align', 'center');
  text.setAttribute('position', '0 5 0');
  text.setAttribute('look-at', '[camera]');

  el.appendChild(pin);
  el.appendChild(text);
  return el;
}

// ============================================================================
// EVENT WIRING
// ============================================================================

window.addEventListener('DOMContentLoaded', () => {
  // Wire Buttons
  if (UI.btnEnable) {
    UI.btnEnable.onclick = runPermissionSequence;
  }
  
  if (UI.btnEnter) {
    UI.btnEnter.onclick = enterExperience;
  }

  // Check if already granted (optional - maybe skip straight to Enter?)
  // For "Reduction", we usually prefer the user to tap at least once to ensure Intent.
  // We can check localstorage to auto-fill checkmarks but still require "Enter".
  const pCam = localStorage.getItem('sl_perm_cam');
  const pLoc = localStorage.getItem('sl_perm_loc');
  const pMot = localStorage.getItem('sl_perm_mot');
  
  if (pCam === 'granted') setPermState('camera', true);
  if (pLoc === 'granted') setPermState('location', true);
  if (pMot === 'granted') setPermState('motion', true);
  
  if (checkAllGranted()) {
    showEnterButton();
  }
});
