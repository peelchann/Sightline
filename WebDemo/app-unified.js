/**
 * Sightline WebAR - Unified Permission & State Machine
 * 
 * This file implements:
 * - Finite State Machine (FSM) for app lifecycle
 * - Unified permission manager (Camera + Location + Motion)
 * - Screen routing to prevent stuck UI
 * - Demo mode fallback
 */

// ============================================================================
// APP STATE MACHINE
// ============================================================================

const AppState = {
  INIT: 'INIT',
  PERMISSION_GATE: 'PERMISSION_GATE',
  REQUESTING_PERMS: 'REQUESTING_PERMS',
  READY: 'READY',
  RUNNING: 'RUNNING',
  ERROR: 'ERROR',
};

let currentState = AppState.INIT;
let stateHistory = [];

function setState(nextState, meta = {}) {
  const prevState = currentState;
  currentState = nextState;
  
  stateHistory.push({
    from: prevState,
    to: nextState,
    meta,
    timestamp: Date.now(),
  });
  
  console.log(`[FSM] ${prevState} → ${nextState}`, meta);
  
  // Update UI
  UI.updateStateBanner(nextState, meta);
  UI.route(nextState);
  
  // Store in window for debug access
  window.APP_STATE = currentState;
  window.STATE_HISTORY = stateHistory;
}

// ============================================================================
// UNIFIED PERMISSION MANAGER
// ============================================================================

const Permissions = {
  results: {
    camera: { ok: false, error: null },
    location: { ok: false, error: null, position: null, watchId: null },
    motion: { ok: false, error: null },
  },
  
  /**
   * Request all permissions in PARALLEL (after user gesture)
   */
  async requestAll() {
    console.log('[Permissions] Starting unified permission request (parallel)...');
    
    // Mark all as requesting
    UI.tickPermit('camera', 'requesting');
    UI.tickPermit('location', 'requesting');
    UI.tickPermit('motion', 'requesting');
    
    // Request all in parallel using Promise.allSettled
    const [camResult, geoResult, motResult] = await Promise.allSettled([
      this.requestCamera(),
      this.requestLocation(),
      this.requestMotion(),
    ]);
    
    // Extract results
    this.results.camera = camResult.status === 'fulfilled' 
      ? camResult.value 
      : { ok: false, error: camResult.reason?.message || 'unknown' };
    
    this.results.location = geoResult.status === 'fulfilled'
      ? geoResult.value
      : { ok: false, position: null, watchId: null, error: geoResult.reason?.message || 'unknown' };
    
    this.results.motion = motResult.status === 'fulfilled'
      ? motResult.value
      : { ok: false, error: motResult.reason?.message || 'unknown' };
    
    // Update UI
    UI.tickPermit('camera', this.results.camera.ok ? 'ok' : 'error');
    UI.tickPermit('location', this.results.location.ok ? 'ok' : 'error');
    UI.tickPermit('motion', this.results.motion.ok ? 'ok' : 'error');
    
    console.log('[Permissions] All requests completed:', this.results);
    return this.results;
  },
  
  /**
   * Request camera permission with iOS fallback constraints
   */
  async requestCamera() {
    try {
      console.log('[Permissions] Requesting camera...');
      
      // Try multiple constraint sets (iOS fallback)
      const constraintsList = [
        { video: { facingMode: { exact: 'environment' }, width: { ideal: 1280 }, height: { ideal: 960 } }, audio: false },
        { video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 960 } }, audio: false },
        { video: { facingMode: 'environment' }, audio: false },
        { video: true, audio: false },
      ];
      
      let stream = null;
      let lastError = null;
      
      for (const constraints of constraintsList) {
        try {
          stream = await navigator.mediaDevices.getUserMedia(constraints);
          console.log('[Permissions] ✅ Camera granted with constraints:', constraints);
          break;
        } catch (error) {
          lastError = error;
          console.warn('[Permissions] Camera constraint failed, trying next...', error.name);
        }
      }
      
      if (!stream) {
        throw new Error(`camera_failed:${lastError?.name || 'unknown'}`);
      }
      
      // Store stream for later use
      window.CAMERA_STREAM = stream;
      
      return { ok: true, stream, error: null };
    } catch (error) {
      console.error('[Permissions] ❌ Camera denied:', error);
      return { ok: false, stream: null, error: error.message || 'camera_failed' };
    }
  },
  
  /**
   * Request location permission with better error handling
   */
  async requestLocation() {
    try {
      console.log('[Permissions] Requesting location...');
      
      if (!('geolocation' in navigator)) {
        throw new Error('geo_unavailable');
      }
      
      // Check permission state (if available)
      let permState = 'prompt';
      try {
        const perm = await navigator.permissions?.query?.({ name: 'geolocation' });
        permState = perm?.state || 'prompt';
        console.log('[Permissions] Geolocation permission state:', permState);
      } catch (e) {
        // Permissions API not available, continue anyway
      }
      
      // First, get current position with longer timeout for iOS
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          (error) => {
            // Map error codes to messages
            let errorMsg = 'geo_error:';
            switch (error.code) {
              case 1: errorMsg += 'PERMISSION_DENIED'; break;
              case 2: errorMsg += 'POSITION_UNAVAILABLE'; break;
              case 3: errorMsg += 'TIMEOUT'; break;
              default: errorMsg += error.code;
            }
            reject(new Error(errorMsg));
          },
          {
            enableHighAccuracy: true,
            timeout: 20000, // 20 seconds for iOS
            maximumAge: 0,
          }
        );
      });
      
      console.log('[Permissions] ✅ Location granted:', position.coords);
      console.log('[Permissions] Location accuracy:', position.coords.accuracy, 'm');
      
      // Start watching position
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          if (window.APP) {
            window.APP.handleLocationUpdate(pos);
          }
        },
        (error) => {
          console.error('[Location] Watch error:', error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 1000,
        }
      );
      
      return { ok: true, position, watchId, error: null };
    } catch (error) {
      console.error('[Permissions] ❌ Location denied:', error);
      return { ok: false, position: null, watchId: null, error: error.message || 'geo_error' };
    }
  },
  
  /**
   * Request motion/orientation permission (iOS requires user gesture)
   */
  async requestMotion() {
    try {
      console.log('[Permissions] Requesting motion/orientation...');
      
      // Check if iOS permission API exists (DeviceOrientationEvent or DeviceMotionEvent)
      const needsIOSPermission = 
        (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') ||
        (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function');
      
      if (needsIOSPermission) {
        console.log('[Permissions] iOS detected, requesting motion permission...');
        
        // Try DeviceOrientationEvent first, then DeviceMotionEvent
        let permission = null;
        
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
          try {
            permission = await DeviceOrientationEvent.requestPermission();
            console.log('[Permissions] DeviceOrientationEvent permission:', permission);
          } catch (e) {
            console.warn('[Permissions] DeviceOrientationEvent.requestPermission failed:', e);
          }
        }
        
        // Also request DeviceMotionEvent if available
        if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
          try {
            const motionPerm = await DeviceMotionEvent.requestPermission();
            console.log('[Permissions] DeviceMotionEvent permission:', motionPerm);
            // Use the more restrictive permission
            if (permission !== 'granted' && motionPerm === 'granted') {
              permission = motionPerm;
            } else if (motionPerm !== 'granted') {
              permission = motionPerm;
            }
          } catch (e) {
            console.warn('[Permissions] DeviceMotionEvent.requestPermission failed:', e);
          }
        }
        
        if (permission === 'granted') {
          console.log('[Permissions] ✅ iOS motion granted');
          this.attachMotionListeners();
          return { ok: true, error: null };
        } else {
          console.warn('[Permissions] ⚠️ iOS motion denied:', permission);
          return { ok: false, error: 'motion_denied' };
        }
      } else {
        // Non-iOS: attach listeners and verify events arrive
        console.log('[Permissions] Non-iOS, verifying motion events...');
        return new Promise((resolve) => {
          let gotEvent = false;
          const timeout = setTimeout(() => {
            if (!gotEvent) {
              console.warn('[Permissions] ⚠️ No motion events received');
              resolve({ ok: false, error: 'motion_unavailable' });
            }
          }, 1500);
          
          const onEvent = () => {
            gotEvent = true;
            clearTimeout(timeout);
            window.removeEventListener('deviceorientation', onEvent);
            window.removeEventListener('deviceorientationabsolute', onEvent);
            this.attachMotionListeners();
            console.log('[Permissions] ✅ Motion events confirmed');
            resolve({ ok: true, error: null });
          };
          
          window.addEventListener('deviceorientation', onEvent, { once: true });
          window.addEventListener('deviceorientationabsolute', onEvent, { once: true });
        });
      }
    } catch (error) {
      console.error('[Permissions] ❌ Motion error:', error);
      return { ok: false, error: error.message || 'motion_error' };
    }
  },
  
  /**
   * Attach motion/orientation event listeners
   */
  attachMotionListeners() {
    window.addEventListener('deviceorientation', (event) => {
      if (window.APP) {
        window.APP.handleOrientationUpdate(event);
      }
    });
    
    window.addEventListener('deviceorientationabsolute', (event) => {
      if (window.APP) {
        window.APP.handleOrientationUpdate(event);
      }
    });
    
    console.log('[Permissions] Motion listeners attached');
  },
  
  /**
   * Generate human-readable explanation of permission results
   */
  explain(results) {
    const issues = [];
    
    if (!results.camera.ok) {
      issues.push(`Camera: ${results.camera.error || 'denied'}`);
    }
    if (!results.location.ok) {
      issues.push(`Location: ${results.location.error || 'denied'}`);
    }
    if (!results.motion.ok) {
      issues.push(`Motion: ${results.motion.error || 'denied'}`);
    }
    
    if (issues.length === 0) {
      return 'All permissions granted';
    }
    
    return issues.join('; ');
  },
};

// ============================================================================
// UI CONTROLLER
// ============================================================================

const UI = {
  /**
   * Route screens based on FSM state
   */
  route(state) {
    const startScreen = document.getElementById('start-screen');
    const arScreen = document.getElementById('ar-screen');
    
    console.log('[UI] Routing to state:', state);
    
    // Start screen: INIT, PERMISSION_GATE, REQUESTING_PERMS, ERROR
    const showStart = [
      AppState.INIT,
      AppState.PERMISSION_GATE,
      AppState.REQUESTING_PERMS,
      AppState.ERROR,
    ].includes(state);
    
    // AR screen: READY, RUNNING
    const showAR = [
      AppState.READY,
      AppState.RUNNING,
    ].includes(state);
    
    if (startScreen) {
      startScreen.style.display = showStart ? 'flex' : 'none';
    }
    
    if (arScreen) {
      arScreen.style.display = showAR ? 'block' : 'none';
    }
    
    console.log('[UI] Screen visibility:', { start: showStart, ar: showAR });
  },
  
  /**
   * Update state banner
   */
  updateStateBanner(state, meta = {}) {
    const banner = document.getElementById('state-banner');
    if (!banner) return;
    
    const msg = meta.msg ? `${state} — ${meta.msg}` : state;
    banner.textContent = msg;
    
    // Color coding
    banner.className = 'state-banner';
    if (state === AppState.ERROR) {
      banner.classList.add('error');
    } else if (state === AppState.RUNNING) {
      banner.classList.add('success');
    } else if (state === AppState.REQUESTING_PERMS) {
      banner.classList.add('requesting');
    }
  },
  
  /**
   * Update permission checklist item
   */
  tickPermit(key, status) {
    const item = document.querySelector(`[data-permit="${key}"]`);
    if (!item) return;
    
    item.className = 'permit-item';
    item.classList.add(status);
    
    const icon = item.querySelector('.permit-icon');
    if (icon) {
      if (status === 'ok') {
        icon.textContent = '✅';
      } else if (status === 'error') {
        icon.textContent = '❌';
      } else if (status === 'requesting') {
        icon.textContent = '⏳';
      } else {
        icon.textContent = '⭕';
      }
    }
  },
  
  /**
   * Show error message
   */
  showError(message) {
    const errorEl = document.getElementById('error-message');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
    }
  },
  
  /**
   * Hide error message
   */
  hideError() {
    const errorEl = document.getElementById('error-message');
    if (errorEl) {
      errorEl.style.display = 'none';
    }
  },
};

// ============================================================================
// MAIN APP
// ============================================================================

class SightlineApp {
  constructor() {
    this.sensors = {
      heading: null,
      position: null,
      accuracy: null,
    };
    
    this.isDemoMode = false;
  }
  
  /**
   * Initialize app with granted permissions
   */
  async init(permissionResults) {
    console.log('[App] Initializing with permissions:', permissionResults);
    
    // Store permission results
    this.permissions = permissionResults;
    
    // Initialize sensors
    if (permissionResults.location.ok && permissionResults.location.position) {
      this.handleLocationUpdate(permissionResults.location.position);
    }
    
    // Initialize AR scene
    await this.initARScene();
    
    // Start update loop
    this.startUpdateLoop();
    
    console.log('[App] ✅ Initialization complete');
  },
  
  /**
   * Initialize AR scene
   */
  async initARScene() {
    console.log('[App] Initializing AR scene...');
    
    const scene = document.querySelector('a-scene');
    if (!scene) {
      console.error('[App] A-Frame scene not found');
      return;
    }
    
    // Wait for scene to load
    if (!scene.hasLoaded) {
      await new Promise((resolve) => {
        scene.addEventListener('loaded', resolve, { once: true });
      });
    }
    
    console.log('[App] Scene loaded');
    
    // Force video to play
    await this.forceVideoPlay();
  },
  
  /**
   * Force video element to play (critical for iOS)
   */
  async forceVideoPlay() {
    console.log('[App] Looking for video element...');
    
    // Wait for video element
    let video = null;
    let attempts = 0;
    const maxAttempts = 30; // 3 seconds
    
    while (!video && attempts < maxAttempts) {
      video = document.querySelector('video');
      if (!video) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
    }
    
    if (!video) {
      console.error('[App] ❌ Video element not found after 3 seconds');
      return;
    }
    
    console.log('[App] ✅ Video element found');
    
    // Add iOS-required attributes
    video.setAttribute('playsinline', '');
    video.setAttribute('autoplay', '');
    video.setAttribute('muted', '');
    video.muted = true;
    
    // If we have a camera stream from permissions, use it
    if (window.CAMERA_STREAM && !video.srcObject) {
      console.log('[App] Attaching camera stream to video...');
      video.srcObject = window.CAMERA_STREAM;
    }
    
    // Wait for metadata
    if (video.readyState < 1) {
      console.log('[App] Waiting for video metadata...');
      await new Promise((resolve) => {
        video.addEventListener('loadedmetadata', resolve, { once: true });
        setTimeout(resolve, 5000); // Timeout
      });
    }
    
    // Play
    try {
      await video.play();
      console.log('[App] ✅ Video playing:', video.videoWidth, 'x', video.videoHeight);
    } catch (error) {
      console.error('[App] ❌ Video play failed:', error);
    }
  },
  
  /**
   * Handle location update
   */
  handleLocationUpdate(position) {
    this.sensors.position = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    this.sensors.accuracy = position.coords.accuracy;
    
    console.log('[App] Location update:', this.sensors.position, `±${this.sensors.accuracy}m`);
  },
  
  /**
   * Handle orientation update
   */
  handleOrientationUpdate(event) {
    // iOS webkitCompassHeading
    if (event.webkitCompassHeading !== undefined) {
      this.sensors.heading = event.webkitCompassHeading;
    }
    // Android/absolute orientation
    else if (event.absolute && event.alpha !== null) {
      this.sensors.heading = 360 - event.alpha;
    }
    // Relative orientation (fallback)
    else if (event.alpha !== null) {
      this.sensors.heading = 360 - event.alpha;
    }
  },
  
  /**
   * Start update loop
   */
  startUpdateLoop() {
    console.log('[App] Starting update loop...');
    
    const update = () => {
      this.updateHUD();
      requestAnimationFrame(update);
    };
    
    update();
  },
  
  /**
   * Update HUD display
   */
  updateHUD() {
    // Heading
    const headingEl = document.getElementById('heading-value');
    if (headingEl && this.sensors.heading !== null) {
      headingEl.textContent = `${Math.round(this.sensors.heading)}°`;
    }
    
    // GPS
    const gpsEl = document.getElementById('gps-value');
    if (gpsEl && this.sensors.position) {
      gpsEl.textContent = `${this.sensors.position.lat.toFixed(5)}, ${this.sensors.position.lng.toFixed(5)}`;
    }
    
    // Accuracy
    const accEl = document.getElementById('accuracy-value');
    if (accEl && this.sensors.accuracy !== null) {
      accEl.textContent = `±${Math.round(this.sensors.accuracy)}m`;
    }
  },
  
  /**
   * Initialize demo mode (no sensors)
   */
  initDemoMode() {
    console.log('[App] Initializing demo mode...');
    
    this.isDemoMode = true;
    
    // Set fixed position (West Kowloon Freespace)
    this.sensors.position = {
      lat: 22.3045,
      lng: 114.1595,
    };
    this.sensors.heading = 120; // Facing Victoria Harbour
    this.sensors.accuracy = 10;
    
    // Initialize AR scene
    this.initARScene();
    
    // Start update loop
    this.startUpdateLoop();
    
    console.log('[App] ✅ Demo mode initialized');
  }
}

// ============================================================================
// INIT FLOW
// ============================================================================

async function startApp() {
  console.log('[Init] Starting app...');
  
  setState(AppState.PERMISSION_GATE);
  
  // Enable permissions button
  const ctaEnable = document.getElementById('cta-enable');
  if (ctaEnable) {
    ctaEnable.onclick = async () => {
      console.log('[Init] User clicked enable permissions');
      
      setState(AppState.REQUESTING_PERMS, { msg: 'Requesting Camera, Location, Motion...' });
      UI.hideError();
      
      try {
        const results = await Permissions.requestAll();
        
        // Check if all required permissions granted
        const allOk = results.camera.ok && results.location.ok && results.motion.ok;
        
        if (!allOk) {
          const explanation = Permissions.explain(results);
          console.error('[Init] ❌ Not all permissions granted:', explanation);
          setState(AppState.ERROR, { msg: explanation });
          UI.showError(explanation);
          return;
        }
        
        console.log('[Init] ✅ All permissions granted');
        setState(AppState.READY, { msg: 'Initializing AR...' });
        
        // Initialize app
        const app = new SightlineApp();
        window.APP = app;
        await app.init(results);
        
        setState(AppState.RUNNING, { msg: 'Live AR Mode' });
      } catch (error) {
        console.error('[Init] ❌ Error during permission request:', error);
        setState(AppState.ERROR, { msg: error.message || 'Permission error' });
        UI.showError(error.message || 'Permission error');
      }
    };
  }
  
  // Demo mode button
  const ctaDemo = document.getElementById('cta-demo');
  if (ctaDemo) {
    ctaDemo.onclick = () => {
      console.log('[Init] User clicked demo mode');
      
      setState(AppState.READY, { msg: 'Initializing Demo Mode...' });
      
      const app = new SightlineApp();
      window.APP = app;
      app.initDemoMode();
      
      setState(AppState.RUNNING, { msg: 'Demo Mode (No Sensors)' });
    };
  }
  
  // Retry button
  const ctaRetry = document.getElementById('cta-retry');
  if (ctaRetry) {
    ctaRetry.onclick = () => {
      console.log('[Init] User clicked retry');
      setState(AppState.PERMISSION_GATE);
      UI.hideError();
    };
  }
}

// ============================================================================
// ENTRY POINT
// ============================================================================

window.addEventListener('DOMContentLoaded', () => {
  console.log('[Init] DOM loaded, initializing FSM...');
  
  setState(AppState.INIT);
  
  // Small delay to ensure UI is ready
  setTimeout(() => {
    startApp();
  }, 100);
});

// Expose for debugging
window.Permissions = Permissions;
window.AppState = AppState;
window.setState = setState;

