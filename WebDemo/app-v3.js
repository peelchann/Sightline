/**
 * Sightline WebAR - V3.3 3-Page PWA Flow
 */

// ============================================================================
// CONFIGURATION & DATA
// ============================================================================

const CONFIG = {
  R_IN_RANGE: 600,
  R_VIS: 1500,
  DEBUG: new URLSearchParams(window.location.search).has('debug')
};

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
  currentPage: 'landing'
};

// ============================================================================
// DOM ELEMENTS
// ============================================================================

const UI = {
  stage: document.getElementById('ar-stage'),
  
  // Pages
  pageLanding: document.getElementById('landing-page'),
  pagePerms: document.getElementById('permissions-page'),
  pageExp: document.getElementById('experience-page'),
  
  // Permission Items
  itemCam: document.getElementById('perm-item-camera'),
  itemLoc: document.getElementById('perm-item-location'),
  itemMot: document.getElementById('perm-item-motion'),
  
  // Buttons
  btnStart: document.getElementById('btn-start'),
  btnEnable: document.getElementById('btn-enable-access'),
  btnEnter: document.getElementById('btn-enter-experience'),
  
  // Debug
  debugLog: document.getElementById('dev-log')
};

// ============================================================================
// UTILS & NAVIGATION
// ============================================================================

function log(msg) {
  console.log(`[Sightline] ${msg}`);
  if (UI.debugLog) {
    const ts = new Date().toLocaleTimeString('en-US', { hour12: false });
    UI.debugLog.textContent = `[${ts}] ${msg}\n` + UI.debugLog.textContent;
  }
}

function showPage(pageName) {
  state.currentPage = pageName;
  
  // Hide all
  UI.pageLanding.classList.add('hidden');
  UI.pagePerms.classList.add('hidden');
  UI.pageExp.classList.add('hidden');
  
  // Show target
  if (pageName === 'landing') UI.pageLanding.classList.remove('hidden');
  if (pageName === 'perms') UI.pagePerms.classList.remove('hidden');
  if (pageName === 'experience') UI.pageExp.classList.remove('hidden');
}

function setPermState(type, granted) {
  state.perms[type] = granted;
  const el = UI[`item${type.charAt(0).toUpperCase() + type.slice(1,3)}`];
  
  if (el && granted) {
    el.classList.add('active');
    const icon = el.querySelector('.perm-icon');
    if (icon) icon.textContent = '✓';
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
    stream.getTracks().forEach(t => t.stop());
    setPermState('camera', true);
  } catch (e) {
    alert('Camera access required.');
    UI.btnEnable.disabled = false;
    return;
  }
  
  // 2. Location
  try {
    log('Req: Location...');
    await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => { state.sensors.gps = pos; resolve(); },
        (err) => reject(err),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
    setPermState('location', true);
  } catch (e) {
    alert('Location access required.');
    UI.btnEnable.disabled = false;
    return;
  }
  
  // 3. Motion
  try {
    log('Req: Motion...');
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      const permission = await DeviceMotionEvent.requestPermission();
      if (permission === 'granted') setPermState('motion', true);
      else throw new Error('Denied');
    } else {
      setPermState('motion', true);
    }
  } catch (e) {
    alert('Motion sensors required.');
    UI.btnEnable.disabled = false;
    return;
  }
  
  if (checkAllGranted()) {
    UI.btnEnable.classList.add('hidden');
    UI.btnEnter.classList.remove('hidden');
  }
}

// ============================================================================
// AR INITIALIZATION
// ============================================================================

async function enterExperience() {
  log('System: Launching AR...');
  showPage('experience');
  initARScene();
}

function initARScene() {
  UI.stage.innerHTML = ''; 

  const scene = document.createElement('a-scene');
  scene.setAttribute('embedded', '');
  scene.setAttribute('vr-mode-ui', 'enabled: false');
  scene.setAttribute('loading-screen', 'enabled: false');
  scene.setAttribute('renderer', 'logarithmicDepthBuffer: true; precision: medium; antialias: true; alpha: true;');
  scene.setAttribute('arjs', 'sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;');
  
  const cam = document.createElement('a-camera');
  cam.setAttribute('gps-camera', 'minDistance: 20; maxDistance: 5000;');
  cam.setAttribute('rotation-reader', '');
  scene.appendChild(cam);

  let contentLoaded = false;
  scene.addEventListener('gps-camera-update-position', (e) => {
    if (!contentLoaded) {
      log('GPS Signal Active. Spawning Content.');
      spawnContentInFrontOfUser(scene);
      contentLoaded = true;
      
      // Update Status Pill
      const pill = document.querySelector('.status-pill');
      if(pill) {
          pill.textContent = "Target Locked";
          pill.style.borderColor = "#00f2ff";
          pill.style.color = "#00f2ff";
      }
    }
  });

  UI.stage.appendChild(scene);
}

function spawnContentInFrontOfUser(scene) {
  // 1. HTML Overlay (Guaranteed Visibility)
  const card = document.createElement('div');
  card.className = 'crystal-card fade-in';
  card.style.top = '25%';
  card.style.left = '50%';
  card.style.transform = 'translateX(-50%)';
  
  card.innerHTML = `
    <div class="icon">🏛️</div>
    <h2>Sightline AR</h2>
    <p>Luminous Reality System Active.</p>
    <p style="font-size: 0.8rem; margin-top: 5px; color: #00f2ff;">▼ Crystal Clear Mode</p>
  `;
  UI.stage.appendChild(card);

  // 2. Ghost Mesh (3D Context)
  const box = document.createElement('a-box');
  box.setAttribute('position', '0 0 -4');
  box.setAttribute('material', 'color: #fff; wireframe: true; opacity: 0.3;');
  box.setAttribute('animation', 'property: rotation; to: 0 360 0; loop: true; dur: 20000; easing: linear;');
  scene.appendChild(box);
}

// ============================================================================
// INIT
// ============================================================================

window.addEventListener('DOMContentLoaded', () => {
  // Navigation
  UI.btnStart.onclick = () => showPage('perms');
  UI.btnEnable.onclick = runPermissionSequence;
  UI.btnEnter.onclick = enterExperience;

  // Check Prev Perms
  const pCam = localStorage.getItem('sl_perm_cam');
  // ... (restore logic if needed)
  
  showPage('landing');
});
