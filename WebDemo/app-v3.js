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
  scene.setAttribute('arjs', 'sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;');
  
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
      
      // IMMEDIATE SPAWN: Bypass GPS distance checks
      // Spawn content right in front of the user
      spawnContentInFrontOfUser(scene, cam);
      
      contentLoaded = true;
    }
  });

  UI.stage.appendChild(scene);
  
  // Sensor Listeners
  window.addEventListener('deviceorientation', (e) => {
    // Keep sensor warm
    state.sensors.heading = e.webkitCompassHeading || (360 - e.alpha);
  }, true);
}

function spawnContentInFrontOfUser(scene, camera) {
  log('Spawning "Crystal Card" in front of user (Luminous Reality)...');

  // 1. Create the Entity Wrapper
  const wrapper = document.createElement('a-entity');
  
  // Position: 0 0 -2 (2 meters directly in front in camera space)
  // However, since gps-camera controls the camera, "0 0 0" is the user's world position.
  // To spawn "in front" effectively in a GPS scene without complex math, 
  // we attach it to the camera initially OR we use a fixed distance.
  // BETTER APPROACH: We use HTML Overlay for the "Crystal Card" to guarantee readability.
  // But the prompt asks for AR effect. Let's do a "World-Locked" entity that spawns at current location.
  
  // Since we are inside the `gps-camera-update-position` event, we know the user's lat/long.
  // But we just want to see it immediately.
  
  // We will cheat: Add an entity with `position="0 0 -3"` relative to the CAMERA, 
  // then detach it to world space? No, simpler:
  // Just put it in the scene. AR.js moves the camera, not the world.
  // So `0 0 -2` is 2 meters south? No.
  
  // In AR.js gps-camera, the camera is at (0,0,0) initially, then moves.
  // We want to spawn the content relative to the *current* camera position and rotation.
  // Since this is complex in A-Frame without specific components, we'll use a "Head-Locked"
  // approach that drifts slightly (as per design system Type A) or simply fixed in screen space.
  
  // PLAN B: HTML Overlay with 3D Context
  // We spawn the HTML "Crystal Card" directly on screen (Screen Space).
  // We spawn a "Ghost Mesh" in 3D space around the user.
  
  createCrystalCardHTML();
  createGhostMesh3D(scene);
}

function createCrystalCardHTML() {
  const card = document.createElement('div');
  card.className = 'crystal-card fade-in';
  card.style.top = '20%';
  card.style.left = '50%';
  card.style.transform = 'translateX(-50%)'; // Center horizontally
  
  card.innerHTML = `
    <div class="icon">🏛️</div>
    <h2>Sightline Demo</h2>
    <p>This is a "Crystal Clear" AR overlay using the Luminous Reality design system.</p>
    <p style="font-size: 0.8rem; margin-top: 5px; color: #00f2ff;">▼ GPS Bypass Active</p>
  `;
  
  UI.stage.appendChild(card);
}

function createGhostMesh3D(scene) {
  // We can't easily do Three.js custom geometry inside A-Frame without a custom component.
  // We'll use A-Frame primitives to simulate the "Ghost Mesh" wireframe effect.
  
  // Create a wireframe box surrounding the user
  const box = document.createElement('a-box');
  box.setAttribute('position', '0 0 -5'); // 5 meters away (approx North)
  box.setAttribute('width', '4');
  box.setAttribute('height', '4');
  box.setAttribute('depth', '4');
  box.setAttribute('material', 'color: #ffffff; wireframe: true; opacity: 0.3; transparent: true;');
  box.setAttribute('animation', 'property: rotation; to: 0 360 0; loop: true; dur: 20000; easing: linear;');
  
  scene.appendChild(box);
  
  // Add a second "Inner" box for complexity
  const innerBox = document.createElement('a-box');
  innerBox.setAttribute('position', '0 0 -5');
  innerBox.setAttribute('width', '2');
  innerBox.setAttribute('height', '2');
  innerBox.setAttribute('depth', '2');
  innerBox.setAttribute('material', 'color: #00f2ff; wireframe: true; opacity: 0.5; transparent: true;');
  innerBox.setAttribute('animation', 'property: rotation; to: 360 0 0; loop: true; dur: 15000; easing: linear;');
  
  scene.appendChild(innerBox);
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
