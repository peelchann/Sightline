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
   * Request all permissions SEQUENTIALLY (preserves user gesture context for iOS)
   * CRITICAL: Must be called directly from user gesture handler, no async delays
   */
  async requestAll() {
    console.log('[Permissions] Starting unified permission request (sequential for iOS compatibility)...');
    LogPanel.push('[Permissions] Starting requests...');
    
    // Mark all as requesting
    UI.tickPermit('camera', 'requesting');
    UI.tickPermit('location', 'requesting');
    UI.tickPermit('motion', 'requesting');
    
    // REQUEST SEQUENTIALLY (not parallel) to preserve user gesture context on iOS
    // iOS requires permission requests to happen synchronously from gesture handler
    
    // 1. Camera (most critical, request first)
    LogPanel.push('[Permissions] Requesting camera...');
    try {
      this.results.camera = await this.requestCamera();
      UI.tickPermit('camera', this.results.camera.ok ? 'ok' : 'error');
      if (this.results.camera.ok) {
        LogPanel.push('✅ Camera granted');
      } else {
        LogPanel.push(`❌ Camera failed: ${this.results.camera.error}`);
      }
    } catch (error) {
      this.results.camera = { ok: false, stream: null, error: error.message || 'camera_exception' };
      UI.tickPermit('camera', 'error');
      LogPanel.push(`❌ Camera exception: ${error.message}`);
    }
    
    // 2. Location
    LogPanel.push('[Permissions] Requesting location...');
    try {
      this.results.location = await this.requestLocation();
      UI.tickPermit('location', this.results.location.ok ? 'ok' : 'error');
      if (this.results.location.ok) {
        LogPanel.push('✅ Location granted');
      } else {
        LogPanel.push(`❌ Location failed: ${this.results.location.error}`);
      }
    } catch (error) {
      this.results.location = { ok: false, position: null, watchId: null, error: error.message || 'location_exception' };
      UI.tickPermit('location', 'error');
      LogPanel.push(`❌ Location exception: ${error.message}`);
    }
    
    // 3. Motion (iOS-specific, must be called directly from gesture)
    LogPanel.push('[Permissions] Requesting motion...');
    try {
      this.results.motion = await this.requestMotion();
      UI.tickPermit('motion', this.results.motion.ok ? 'ok' : 'error');
      if (this.results.motion.ok) {
        LogPanel.push('✅ Motion granted');
      } else {
        LogPanel.push(`❌ Motion failed: ${this.results.motion.error}`);
      }
    } catch (error) {
      this.results.motion = { ok: false, error: error.message || 'motion_exception' };
      UI.tickPermit('motion', 'error');
      LogPanel.push(`❌ Motion exception: ${error.message}`);
    }
    
    console.log('[Permissions] All requests completed:', this.results);
    LogPanel.push(`[Permissions] Results: Camera=${this.results.camera.ok}, Location=${this.results.location.ok}, Motion=${this.results.motion.ok}`);
    return this.results;
  },
  
  /**
   * Request camera permission with iOS fallback constraints
   * CRITICAL: Must be called directly from user gesture handler
   */
  async requestCamera() {
    try {
      console.log('[Permissions] Requesting camera...');
      
      // Check if mediaDevices is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('camera_unavailable: getUserMedia not supported');
      }
      
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
          LogPanel.push(`[Camera] Trying constraints: ${JSON.stringify(constraints).substring(0, 50)}...`);
          stream = await navigator.mediaDevices.getUserMedia(constraints);
          console.log('[Permissions] ✅ Camera granted with constraints:', constraints);
          LogPanel.push('✅ Camera stream obtained');
          break;
        } catch (error) {
          lastError = error;
          LogPanel.push(`[Camera] Constraint failed: ${error.name}`);
          console.warn('[Permissions] Camera constraint failed, trying next...', error.name);
        }
      }
      
      if (!stream) {
        const errorMsg = `camera_failed:${lastError?.name || 'unknown'}`;
        LogPanel.push(`❌ All camera constraints failed: ${errorMsg}`);
        throw new Error(errorMsg);
      }
      
      // Store stream for later use
      window.CAMERA_STREAM = stream;
      LogPanel.push(`✅ Camera stream stored (${stream.getVideoTracks().length} tracks)`);
      
      return { ok: true, stream, error: null };
    } catch (error) {
      console.error('[Permissions] ❌ Camera denied:', error);
      LogPanel.push(`❌ Camera error: ${error.message}`);
      return { ok: false, stream: null, error: error.message || 'camera_failed' };
    }
  },
  
  /**
   * Request location permission with better error handling
   */
  async requestLocation() {
    try {
      console.log('[Permissions] Requesting location...');
      LogPanel.push('[Location] Checking geolocation API...');
      
      if (!('geolocation' in navigator)) {
        LogPanel.push('❌ Geolocation API not available');
        throw new Error('geo_unavailable');
      }
      
      LogPanel.push('[Location] Geolocation API available');
      
      // Check permission state (if available)
      let permState = 'prompt';
      try {
        const perm = await navigator.permissions?.query?.({ name: 'geolocation' });
        permState = perm?.state || 'prompt';
        console.log('[Permissions] Geolocation permission state:', permState);
        LogPanel.push(`[Location] Permission state: ${permState}`);
      } catch (e) {
        // Permissions API not available, continue anyway
        LogPanel.push('[Location] Permissions API not available, continuing...');
      }
      
      LogPanel.push('[Location] Requesting current position...');
      
      // First, get current position with longer timeout for iOS
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            LogPanel.push(`✅ Position received: ${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`);
            resolve(pos);
          },
          (error) => {
            // Map error codes to messages
            let errorMsg = 'geo_error:';
            switch (error.code) {
              case 1: errorMsg += 'PERMISSION_DENIED'; break;
              case 2: errorMsg += 'POSITION_UNAVAILABLE'; break;
              case 3: errorMsg += 'TIMEOUT'; break;
              default: errorMsg += error.code;
            }
            LogPanel.push(`❌ Location error: ${errorMsg}`);
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
      LogPanel.push(`✅ Location accuracy: ±${Math.round(position.coords.accuracy)}m`);
      
      // Start watching position
      LogPanel.push('[Location] Starting position watch...');
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          if (window.APP) {
            window.APP.handleLocationUpdate(pos);
          }
        },
        (error) => {
          console.error('[Location] Watch error:', error);
          LogPanel.push(`[Location] Watch error: ${error.message}`);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 1000,
        }
      );
      
      LogPanel.push(`✅ Location watch started (ID: ${watchId})`);
      return { ok: true, position, watchId, error: null };
    } catch (error) {
      console.error('[Permissions] ❌ Location denied:', error);
      LogPanel.push(`❌ Location error: ${error.message}`);
      return { ok: false, position: null, watchId: null, error: error.message || 'geo_error' };
    }
  },
  
  /**
   * Request motion/orientation permission (iOS requires user gesture)
   * CRITICAL: Must be called directly from user gesture handler, no async delays before this
   */
  async requestMotion() {
    try {
      console.log('[Permissions] Requesting motion/orientation...');
      LogPanel.push('[Motion] Checking iOS permission API...');
      
      // Check if iOS permission API exists (DeviceOrientationEvent or DeviceMotionEvent)
      const needsIOSPermission = 
        (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') ||
        (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function');
      
      if (needsIOSPermission) {
        LogPanel.push('[Motion] iOS detected, requesting permission...');
        console.log('[Permissions] iOS detected, requesting motion permission...');
        
        // CRITICAL: Request permissions synchronously, don't await anything before this
        let permission = null;
        
        // Try DeviceOrientationEvent first
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
          try {
            LogPanel.push('[Motion] Requesting DeviceOrientationEvent permission...');
            permission = await DeviceOrientationEvent.requestPermission();
            console.log('[Permissions] DeviceOrientationEvent permission:', permission);
            LogPanel.push(`[Motion] DeviceOrientationEvent: ${permission}`);
          } catch (e) {
            LogPanel.push(`[Motion] DeviceOrientationEvent error: ${e.message}`);
            console.warn('[Permissions] DeviceOrientationEvent.requestPermission failed:', e);
          }
        }
        
        // Also request DeviceMotionEvent if available
        if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
          try {
            LogPanel.push('[Motion] Requesting DeviceMotionEvent permission...');
            const motionPerm = await DeviceMotionEvent.requestPermission();
            console.log('[Permissions] DeviceMotionEvent permission:', motionPerm);
            LogPanel.push(`[Motion] DeviceMotionEvent: ${motionPerm}`);
            // Use the more restrictive permission
            if (permission !== 'granted' && motionPerm === 'granted') {
              permission = motionPerm;
            } else if (motionPerm !== 'granted') {
              permission = motionPerm;
            }
          } catch (e) {
            LogPanel.push(`[Motion] DeviceMotionEvent error: ${e.message}`);
            console.warn('[Permissions] DeviceMotionEvent.requestPermission failed:', e);
          }
        }
        
        if (permission === 'granted') {
          console.log('[Permissions] ✅ iOS motion granted');
          LogPanel.push('✅ Motion permission granted');
          this.attachMotionListeners();
          return { ok: true, error: null };
        } else {
          console.warn('[Permissions] ⚠️ iOS motion denied:', permission);
          LogPanel.push(`⚠️ Motion permission denied: ${permission}`);
          return { ok: false, error: `motion_denied:${permission || 'unknown'}` };
        }
      } else {
        // Non-iOS: attach listeners and verify events arrive
        LogPanel.push('[Motion] Non-iOS, verifying events...');
        console.log('[Permissions] Non-iOS, verifying motion events...');
        return new Promise((resolve) => {
          let gotEvent = false;
          const timeout = setTimeout(() => {
            if (!gotEvent) {
              console.warn('[Permissions] ⚠️ No motion events received');
              LogPanel.push('⚠️ No motion events received (timeout)');
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
            LogPanel.push('✅ Motion events confirmed');
            resolve({ ok: true, error: null });
          };
          
          window.addEventListener('deviceorientation', onEvent, { once: true });
          window.addEventListener('deviceorientationabsolute', onEvent, { once: true });
        });
      }
    } catch (error) {
      console.error('[Permissions] ❌ Motion error:', error);
      LogPanel.push(`❌ Motion error: ${error.message}`);
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
  
  /**
   * Set CTA button loading state
   */
  setCtaLoading(loading) {
    const btnEnable = document.getElementById('cta-enable');
    const btnDemo = document.getElementById('cta-demo');
    
    if (btnEnable) {
      if (loading) {
        btnEnable.disabled = true;
        btnEnable.textContent = 'Requesting permissions...';
        btnEnable.style.opacity = '0.7';
        btnEnable.style.cursor = 'not-allowed';
      } else {
        btnEnable.disabled = false;
        btnEnable.textContent = 'Enable Camera, Location & Motion';
        btnEnable.style.opacity = '1';
        btnEnable.style.cursor = 'pointer';
      }
    }
    
    if (btnDemo) {
      if (loading) {
        btnDemo.disabled = true;
        btnDemo.style.opacity = '0.7';
        btnDemo.style.cursor = 'not-allowed';
      } else {
        btnDemo.disabled = false;
        btnDemo.style.opacity = '1';
        btnDemo.style.cursor = 'pointer';
      }
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
// ON-SCREEN LOGGER (for iOS debugging)
// ============================================================================

const LogPanel = {
  el: null,
  logs: [],
  maxLogs: 20,
  
  init() {
    this.el = document.getElementById('dev-log');
    if (!this.el) {
      // Create log panel if it doesn't exist
      const panel = document.createElement('div');
      panel.id = 'dev-log';
      panel.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        width: 300px;
        max-height: 200px;
        background: rgba(0, 0, 0, 0.9);
        color: #fff;
        padding: 10px;
        border-radius: 8px;
        font-family: monospace;
        font-size: 10px;
        z-index: 10000;
        overflow-y: auto;
        display: none;
      `;
      document.body.appendChild(panel);
      this.el = panel;
    }
    
    // Intercept console methods
    ['log', 'warn', 'error'].forEach(type => {
      const original = console[type].bind(console);
      console[type] = (...args) => {
        original(...args);
        this.push(`[${type.toUpperCase()}] ${args.join(' ')}`);
      };
    });
    
    this.push('Log panel initialized');
  },
  
  push(message) {
    if (!this.el) return;
    
    const timestamp = new Date().toLocaleTimeString();
    const line = `[${timestamp}] ${message}`;
    this.logs.push(line);
    
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
    
    this.el.innerHTML = this.logs.map(log => `<div>${log}</div>`).join('');
    this.el.scrollTop = this.el.scrollHeight;
    
    // Show panel
    this.el.style.display = 'block';
  },
  
  show() {
    if (this.el) this.el.style.display = 'block';
  },
  
  hide() {
    if (this.el) this.el.style.display = 'none';
  }
};

// ============================================================================
// INIT FLOW
// ============================================================================

async function onEnableClick(e) {
  e.preventDefault();
  e.stopPropagation();
  
  LogPanel.push('🔵 Enable button clicked');
  console.log('[Init] User clicked enable permissions');
  
  // CRITICAL: Disable button immediately to prevent double-clicks
  const btn = e.currentTarget;
  if (btn.disabled) {
    LogPanel.push('⚠️ Button already disabled, ignoring click');
    return;
  }
  btn.disabled = true;
  
  // Immediate visual feedback
  UI.setCtaLoading(true);
  setState(AppState.REQUESTING_PERMS, { msg: 'Requesting Camera, Location, Motion...' });
  UI.hideError();
  
  try {
    LogPanel.push('📋 Requesting all permissions (sequential)...');
    
    // CRITICAL: Request permissions NOW, directly from gesture handler
    // Don't await anything before this - iOS requires gesture context
    const results = await Permissions.requestAll();
    
    LogPanel.push(`📊 Permission results received`);
    
    // Check if all required permissions granted
    const allOk = results.camera.ok && results.location.ok && results.motion.ok;
    
    if (!allOk) {
      const explanation = Permissions.explain(results);
      LogPanel.push(`❌ Permissions incomplete: ${explanation}`);
      console.error('[Init] ❌ Not all permissions granted:', explanation);
      setState(AppState.ERROR, { msg: explanation });
      UI.showError(explanation);
      UI.setCtaLoading(false);
      btn.disabled = false; // Re-enable for retry
      
      // Show retry button
      const retryBtn = document.getElementById('cta-retry');
      if (retryBtn) {
        retryBtn.style.display = 'block';
      }
      return;
    }
    
    LogPanel.push('✅ All permissions granted!');
    console.log('[Init] ✅ All permissions granted');
    setState(AppState.READY, { msg: 'Initializing AR...' });
    
    // Initialize app
    const app = new SightlineApp();
    window.APP = app;
    await app.init(results);
    
    LogPanel.push('✅ AR initialized successfully');
    setState(AppState.RUNNING, { msg: 'Live AR Mode' });
    UI.setCtaLoading(false);
  } catch (error) {
    LogPanel.push(`❌ Fatal error: ${error.message}`);
    console.error('[Init] ❌ Error during permission request:', error);
    setState(AppState.ERROR, { msg: error.message || 'Permission error' });
    UI.showError(error.message || 'Permission error');
    UI.setCtaLoading(false);
    btn.disabled = false; // Re-enable for retry
    
    // Show retry button
    const retryBtn = document.getElementById('cta-retry');
    if (retryBtn) {
      retryBtn.style.display = 'block';
    }
  }
}

function onDemoClick(e) {
  e.preventDefault();
  e.stopPropagation();
  
  LogPanel.push('Demo mode button clicked');
  console.log('[Init] User clicked demo mode');
  
  setState(AppState.READY, { msg: 'Initializing Demo Mode...' });
  
  const app = new SightlineApp();
  window.APP = app;
  app.initDemoMode();
  
  LogPanel.push('✅ Demo mode initialized');
  setState(AppState.RUNNING, { msg: 'Demo Mode (No Sensors)' });
}

function onRetryClick(e) {
  e.preventDefault();
  e.stopPropagation();
  
  LogPanel.push('Retry button clicked');
  console.log('[Init] User clicked retry');
  setState(AppState.PERMISSION_GATE);
  UI.hideError();
  UI.setCtaLoading(false);
}

async function startApp() {
  console.log('[Init] Starting app...');
  LogPanel.push('App starting...');
  
  // Security check
  if (!window.isSecureContext) {
    const error = 'App requires HTTPS. Current context is not secure.';
    LogPanel.push(`❌ ${error}`);
    setState(AppState.ERROR, { msg: error });
    UI.showError(error);
    return;
  }
  
  // Diagnostics
  LogPanel.push(`User Agent: ${navigator.userAgent}`);
  LogPanel.push(`Secure Context: ${window.isSecureContext}`);
  LogPanel.push(`Has Focus: ${document.hasFocus()}`);
  
  setState(AppState.PERMISSION_GATE);
  
  // Global click listener for debugging
  document.body.addEventListener('click', (e) => {
    LogPanel.push(`Global click detected on: ${e.target.tagName} #${e.target.id || 'no-id'}`);
    console.log('[Debug] Global click:', e.target);
  }, { passive: true });
  
  // Wire up button handlers with proper event listeners
  const ctaEnable = document.getElementById('cta-enable');
  const ctaDemo = document.getElementById('cta-demo');
  const ctaRetry = document.getElementById('cta-retry');
  
  if (ctaEnable) {
    LogPanel.push('✅ Enable button found');
    
    // Ensure button is clickable
    ctaEnable.style.pointerEvents = 'auto';
    ctaEnable.style.cursor = 'pointer';
    ctaEnable.style.userSelect = 'none';
    ctaEnable.style.webkitUserSelect = 'none';
    ctaEnable.style.touchAction = 'manipulation';
    ctaEnable.style.zIndex = '1001'; // Ensure it's above other elements
    
    // Remove any existing listeners first (prevent duplicates) by cloning
    const newEnableBtn = ctaEnable.cloneNode(true);
    ctaEnable.parentNode.replaceChild(newEnableBtn, ctaEnable);
    const enableBtn = document.getElementById('cta-enable');
    
    if (!enableBtn) {
      LogPanel.push('❌ Enable button lost after clone!');
      console.error('[Init] Enable button not found after clone');
      return;
    }
    
    // Add both click and touchstart for iOS
    enableBtn.addEventListener('click', onEnableClick, { passive: false, capture: false });
    enableBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      e.stopPropagation();
      LogPanel.push('🔵 Enable button touchstart');
      onEnableClick(e);
    }, { passive: false, capture: false });
    
    // Also add mousedown as fallback
    enableBtn.addEventListener('mousedown', (e) => {
      LogPanel.push('🔵 Enable button mousedown');
    }, { passive: true });
    
    // Visual confirmation - pulse highlight
    enableBtn.style.transition = 'all 0.3s';
    setTimeout(() => {
      enableBtn.style.boxShadow = '0 0 20px rgba(102, 126, 234, 0.5)';
      setTimeout(() => {
        enableBtn.style.boxShadow = '';
      }, 500);
    }, 100);
    
    LogPanel.push('✅ Enable button listeners attached');
  } else {
    LogPanel.push('❌ Enable button NOT found!');
    console.error('[Init] ❌ cta-enable button not found');
  }
  
  if (ctaDemo) {
    LogPanel.push('✅ Demo button found');
    
    // Ensure button is clickable
    ctaDemo.style.pointerEvents = 'auto';
    ctaDemo.style.cursor = 'pointer';
    ctaDemo.style.userSelect = 'none';
    ctaDemo.style.webkitUserSelect = 'none';
    ctaDemo.style.touchAction = 'manipulation';
    ctaDemo.style.zIndex = '1001';
    
    // Remove any existing listeners first (prevent duplicates) by cloning
    const newDemoBtn = ctaDemo.cloneNode(true);
    ctaDemo.parentNode.replaceChild(newDemoBtn, ctaDemo);
    const demoBtn = document.getElementById('cta-demo');
    
    if (!demoBtn) {
      LogPanel.push('❌ Demo button lost after clone!');
      console.error('[Init] Demo button not found after clone');
      return;
    }
    
    // Add both click and touchstart for iOS
    demoBtn.addEventListener('click', onDemoClick, { passive: false, capture: false });
    demoBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      e.stopPropagation();
      LogPanel.push('🔵 Demo button touchstart');
      onDemoClick(e);
    }, { passive: false, capture: false });
    
    LogPanel.push('✅ Demo button listeners attached');
  } else {
    LogPanel.push('❌ Demo button NOT found!');
    console.error('[Init] ❌ cta-demo button not found');
  }
  
  if (ctaRetry) {
    LogPanel.push('✅ Retry button found');
    
    // Ensure button is clickable
    ctaRetry.style.pointerEvents = 'auto';
    ctaRetry.style.cursor = 'pointer';
    ctaRetry.style.userSelect = 'none';
    ctaRetry.style.webkitUserSelect = 'none';
    ctaRetry.style.touchAction = 'manipulation';
    ctaRetry.style.zIndex = '1001';
    
    // Remove any existing listeners first (prevent duplicates) by cloning
    const newRetryBtn = ctaRetry.cloneNode(true);
    ctaRetry.parentNode.replaceChild(newRetryBtn, ctaRetry);
    const retryBtn = document.getElementById('cta-retry');
    
    if (!retryBtn) {
      LogPanel.push('❌ Retry button lost after clone!');
      console.error('[Init] Retry button not found after clone');
      return;
    }
    
    // Add both click and touchstart for iOS
    retryBtn.addEventListener('click', onRetryClick, { passive: false, capture: false });
    retryBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      e.stopPropagation();
      LogPanel.push('🔵 Retry button touchstart');
      onRetryClick(e);
    }, { passive: false, capture: false });
    
    LogPanel.push('✅ Retry button listeners attached');
  }
  
  // Debug: Log button positions and styles
  if (ctaEnable) {
    const rect = ctaEnable.getBoundingClientRect();
    const styles = window.getComputedStyle(ctaEnable);
    LogPanel.push(`Enable button: ${rect.width}x${rect.height} at (${rect.left}, ${rect.top})`);
    LogPanel.push(`Pointer events: ${styles.pointerEvents}, Z-index: ${styles.zIndex}`);
    LogPanel.push(`Display: ${styles.display}, Visibility: ${styles.visibility}`);
  }
}

// ============================================================================
// ENTRY POINT
// ============================================================================

window.addEventListener('DOMContentLoaded', () => {
  console.log('[Init] DOM loaded, initializing FSM...');
  console.log('[Init] App booted');
  
  // Initialize log panel first
  LogPanel.init();
  LogPanel.push('DOM loaded');
  
  setState(AppState.INIT);
  
  // Small delay to ensure UI is ready
  setTimeout(() => {
    startApp();
  }, 100);
});

// Also try immediate initialization if DOM already loaded
if (document.readyState === 'loading') {
  // Wait for DOMContentLoaded
} else {
  // DOM already loaded, initialize now
  console.log('[Init] DOM already loaded, initializing immediately...');
  LogPanel.init();
  LogPanel.push('DOM already loaded');
  setState(AppState.INIT);
  setTimeout(() => {
    startApp();
  }, 100);
}

// Expose for debugging
window.Permissions = Permissions;
window.AppState = AppState;
window.setState = setState;
window.LogPanel = LogPanel;

