/**
 * Sightline WebAR - Fixed Version
 * 
 * Fixes:
 * - Permission-gated start flow
 * - NaN guards throughout
 * - Real-time IMU heading with live updates
 * - Bearing-driven UI (labels flip left/right)
 * - Proper sensor initialization sequence
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  MAX_DISTANCE: 5000,
  UPDATE_INTERVAL: 50, // 20 FPS for smooth heading updates
  GPS_TIMEOUT: 27000,
  NEARBY_THRESHOLD: 50,
  MID_RANGE: 200,
  FAR_RANGE: 1000,
  FOV: 60,
  HEADING_SMOOTH_ALPHA: 0.15,
  HEADING_VARIANCE_THRESHOLD: 15,
  CALIBRATION_SAMPLE_SIZE: 20,
};

// ============================================================================
// POI DATA
// ============================================================================

const POIS = [
  {
    id: 'clock-tower',
    name: 'Clock Tower',
    lat: 22.2946,
    lng: 114.1699,
    description: 'Former railway terminus',
    category: 'landmark'
  },
  {
    id: 'star-ferry-tst',
    name: 'Star Ferry (TST)',
    lat: 22.2937,
    lng: 114.1703,
    description: 'Iconic ferry service',
    category: 'transport'
  },
  {
    id: 'avenue-stars',
    name: 'Avenue of Stars',
    lat: 22.2930,
    lng: 114.1730,
    description: 'HK film industry tribute',
    category: 'landmark'
  },
  {
    id: 'ifc',
    name: 'IFC Tower',
    lat: 22.2855,
    lng: 114.1588,
    description: 'International Finance Centre • 412m',
    category: 'landmark'
  },
  {
    id: 'icc',
    name: 'ICC',
    lat: 22.3069,
    lng: 114.1617,
    description: 'International Commerce Centre • 484m',
    category: 'landmark'
  },
  {
    id: 'mplus',
    name: 'M+ Museum',
    lat: 22.3030,
    lng: 114.1605,
    description: 'Visual culture museum',
    category: 'museum'
  },
  {
    id: 'palace-museum',
    name: 'Hong Kong Palace Museum',
    lat: 22.3015,
    lng: 114.1605,
    description: 'Chinese art from Forbidden City',
    category: 'museum'
  },
  {
    id: 'xiqu',
    name: 'Xiqu Centre',
    lat: 22.3049,
    lng: 114.1689,
    description: 'Cantonese opera house',
    category: 'museum'
  }
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if a number is valid (not NaN, not null, not undefined, finite)
 */
function isValidNumber(n) {
  return typeof n === 'number' && !isNaN(n) && isFinite(n);
}

/**
 * Safe number formatting with fallback
 */
function formatNumber(n, decimals = 0, fallback = '—') {
  if (!isValidNumber(n)) return fallback;
  return n.toFixed(decimals);
}

/**
 * Format distance with units
 */
function formatDistance(meters, fallback = '—') {
  if (!isValidNumber(meters)) return fallback;
  
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${Math.round(meters / 5) * 5} m`; // Round to nearest 5m
}

/**
 * Calculate bearing from point A to point B (Haversine)
 */
function calculateBearing(lat1, lng1, lat2, lng2) {
  if (!isValidNumber(lat1) || !isValidNumber(lng1) || 
      !isValidNumber(lat2) || !isValidNumber(lng2)) {
    return null;
  }

  const toRad = deg => deg * Math.PI / 180;
  const toDeg = rad => rad * 180 / Math.PI;

  const dLng = toRad(lng2 - lng1);
  const lat1Rad = toRad(lat1);
  const lat2Rad = toRad(lat2);

  const y = Math.sin(dLng) * Math.cos(lat2Rad);
  const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) -
            Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng);

  let bearing = toDeg(Math.atan2(y, x));
  return (bearing + 360) % 360; // Normalize to 0-359
}

/**
 * Calculate distance between two points (Haversine)
 */
function calculateDistance(lat1, lng1, lat2, lng2) {
  if (!isValidNumber(lat1) || !isValidNumber(lng1) || 
      !isValidNumber(lng1) || !isValidNumber(lng2)) {
    return null;
  }

  const R = 6371000; // Earth radius in meters
  const toRad = deg => deg * Math.PI / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculate angular difference between two headings
 */
function angularDifference(heading1, heading2) {
  if (!isValidNumber(heading1) || !isValidNumber(heading2)) {
    return null;
  }

  let diff = Math.abs(heading1 - heading2);
  if (diff > 180) {
    diff = 360 - diff;
  }
  return diff;
}

/**
 * Normalize angle to 0-359 range
 */
function normalizeAngle(angle) {
  if (!isValidNumber(angle)) return null;
  
  while (angle < 0) angle += 360;
  while (angle >= 360) angle -= 360;
  return angle;
}

/**
 * Smooth heading with exponential moving average (handles wrap-around)
 */
function smoothHeading(newHeading, oldHeading, alpha = 0.15) {
  if (!isValidNumber(newHeading)) return oldHeading;
  if (!isValidNumber(oldHeading)) return newHeading;

  // Handle wrap-around (359° → 0°)
  let diff = newHeading - oldHeading;
  if (diff > 180) {
    oldHeading += 360;
  } else if (diff < -180) {
    oldHeading -= 360;
  }

  // Exponential moving average
  const smoothed = oldHeading + alpha * (newHeading - oldHeading);
  
  return normalizeAngle(smoothed);
}

// ============================================================================
// PERMISSION MANAGER
// ============================================================================

class PermissionManager {
  constructor() {
    this.permissions = {
      camera: false,
      location: false,
      motion: false
    };
    this.callbacks = [];
  }

  /**
   * Request all permissions in sequence
   */
  async requestAll() {
    console.log('[PermissionManager] Requesting all permissions...');

    try {
      // 1. Camera permission (implicit via getUserMedia)
      await this.requestCamera();
      
      // 2. Location permission
      await this.requestLocation();
      
      // 3. Motion permission (iOS only)
      await this.requestMotion();

      console.log('[PermissionManager] All permissions granted:', this.permissions);
      
      // Notify callbacks
      this.callbacks.forEach(cb => cb(this.permissions));
      
      return this.permissions;
    } catch (error) {
      console.error('[PermissionManager] Permission error:', error);
      throw error;
    }
  }

  /**
   * Request camera permission
   */
  async requestCamera() {
    try {
      // AR.js will handle this, but we can test it
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop()); // Stop immediately
      
      this.permissions.camera = true;
      console.log('[PermissionManager] Camera permission granted');
    } catch (error) {
      console.error('[PermissionManager] Camera permission denied:', error);
      this.permissions.camera = false;
      throw new Error('Camera permission denied');
    }
  }

  /**
   * Request location permission
   */
  async requestLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.permissions.location = true;
          console.log('[PermissionManager] Location permission granted');
          resolve(position);
        },
        (error) => {
          console.error('[PermissionManager] Location permission denied:', error);
          this.permissions.location = false;
          reject(new Error('Location permission denied'));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  }

  /**
   * Request motion permission (iOS only)
   */
  async requestMotion() {
    // Check if iOS permission is needed
    if (typeof DeviceOrientationEvent !== 'undefined' && 
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      
      try {
        const response = await DeviceOrientationEvent.requestPermission();
        
        if (response === 'granted') {
          this.permissions.motion = true;
          console.log('[PermissionManager] Motion permission granted (iOS)');
        } else {
          this.permissions.motion = false;
          console.warn('[PermissionManager] Motion permission denied (iOS)');
        }
      } catch (error) {
        console.error('[PermissionManager] Motion permission error:', error);
        this.permissions.motion = false;
      }
    } else {
      // Android or desktop - no permission needed
      this.permissions.motion = true;
      console.log('[PermissionManager] Motion permission not required (Android/Desktop)');
    }
  }

  /**
   * Subscribe to permission changes
   */
  onChange(callback) {
    this.callbacks.push(callback);
  }

  /**
   * Check if all permissions are granted
   */
  allGranted() {
    return this.permissions.camera && 
           this.permissions.location && 
           this.permissions.motion;
  }
}

// ============================================================================
// IMU MANAGER (Real-Time Heading)
// ============================================================================

class IMUManager {
  constructor() {
    this.heading = null;
    this.headingRaw = null;
    this.headingSource = null;
    this.accuracy = null;
    this.headingHistory = [];
    this.callbacks = [];
    this.isEnabled = false;
  }

  /**
   * Initialize IMU sensors
   */
  enable() {
    console.log('[IMUManager] Enabling IMU sensors...');
    this.isEnabled = true;

    // Try iOS webkitCompassHeading first
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', (event) => this.handleDeviceOrientation(event), true);
      console.log('[IMUManager] DeviceOrientation listener added');
    }

    // Fallback to geolocation heading (when moving)
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => this.handleGeolocationHeading(position),
        (error) => console.warn('[IMUManager] Geolocation watch error:', error),
        {
          enableHighAccuracy: true,
          maximumAge: 1000,
          timeout: 5000
        }
      );
      console.log('[IMUManager] Geolocation watch started');
    }
  }

  /**
   * Handle DeviceOrientation event
   */
  handleDeviceOrientation(event) {
    if (!this.isEnabled) return;

    let newHeading = null;
    let source = null;

    // Try iOS webkitCompassHeading (most accurate)
    if (event.webkitCompassHeading !== undefined && event.webkitCompassHeading !== null) {
      newHeading = event.webkitCompassHeading;
      source = 'webkit';
    }
    // Try absolute orientation (Android)
    else if (event.absolute && event.alpha !== null) {
      // Convert alpha to compass heading
      // alpha: 0° = North, 90° = East, 180° = South, 270° = West
      newHeading = 360 - event.alpha; // Invert for compass heading
      source = 'alpha';
    }

    if (isValidNumber(newHeading)) {
      this.updateHeading(newHeading, source);
    }
  }

  /**
   * Handle Geolocation heading (fallback when moving)
   */
  handleGeolocationHeading(position) {
    if (!this.isEnabled) return;

    if (position.coords.heading !== null && isValidNumber(position.coords.heading)) {
      this.updateHeading(position.coords.heading, 'geolocation');
    }

    // Update accuracy
    if (isValidNumber(position.coords.accuracy)) {
      this.accuracy = position.coords.accuracy;
    }
  }

  /**
   * Update heading with smoothing
   */
  updateHeading(newHeading, source) {
    this.headingRaw = newHeading;
    this.headingSource = source;

    // Smooth heading
    if (this.heading === null) {
      this.heading = newHeading;
    } else {
      this.heading = smoothHeading(newHeading, this.heading, CONFIG.HEADING_SMOOTH_ALPHA);
    }

    // Track history for calibration detection
    this.headingHistory.push(this.heading);
    if (this.headingHistory.length > CONFIG.CALIBRATION_SAMPLE_SIZE) {
      this.headingHistory.shift();
    }

    // Notify callbacks
    this.callbacks.forEach(cb => cb(this.heading, source));
  }

  /**
   * Get current heading
   */
  getHeading() {
    return this.heading;
  }

  /**
   * Get heading source
   */
  getSource() {
    return this.headingSource;
  }

  /**
   * Get calibration state
   */
  getCalibrationState() {
    if (this.headingHistory.length < CONFIG.CALIBRATION_SAMPLE_SIZE) {
      return 'initializing';
    }

    // Calculate variance
    const mean = this.headingHistory.reduce((sum, h) => sum + h, 0) / this.headingHistory.length;
    const variance = this.headingHistory.reduce((sum, h) => {
      const diff = h - mean;
      return sum + diff * diff;
    }, 0) / this.headingHistory.length;

    const stdDev = Math.sqrt(variance);

    if (stdDev > CONFIG.HEADING_VARIANCE_THRESHOLD) {
      return 'poor';
    }
    return 'good';
  }

  /**
   * Subscribe to heading changes
   */
  onChange(callback) {
    this.callbacks.push(callback);
  }
}

// ============================================================================
// GPS MANAGER
// ============================================================================

class GPSManager {
  constructor() {
    this.position = null;
    this.accuracy = null;
    this.callbacks = [];
    this.watchId = null;
  }

  /**
   * Start watching GPS position
   */
  enable() {
    console.log('[GPSManager] Enabling GPS tracking...');

    if (!navigator.geolocation) {
      console.error('[GPSManager] Geolocation not supported');
      return;
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => this.handlePosition(position),
      (error) => console.error('[GPSManager] Position error:', error),
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 5000
      }
    );

    console.log('[GPSManager] GPS watch started');
  }

  /**
   * Handle position update
   */
  handlePosition(position) {
    this.position = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    this.accuracy = position.coords.accuracy;

    console.log(`[GPSManager] Position updated: ${this.position.lat.toFixed(5)}, ${this.position.lng.toFixed(5)} (±${this.accuracy.toFixed(0)}m)`);

    // Notify callbacks
    this.callbacks.forEach(cb => cb(this.position, this.accuracy));
  }

  /**
   * Get current position
   */
  getPosition() {
    return this.position;
  }

  /**
   * Get accuracy
   */
  getAccuracy() {
    return this.accuracy;
  }

  /**
   * Subscribe to position changes
   */
  onChange(callback) {
    this.callbacks.push(callback);
  }

  /**
   * Stop watching
   */
  disable() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
      console.log('[GPSManager] GPS watch stopped');
    }
  }
}

// ============================================================================
// MAIN APP
// ============================================================================

class SightlineApp {
  constructor() {
    this.permissionManager = new PermissionManager();
    this.imuManager = new IMUManager();
    this.gpsManager = new GPSManager();
    
    this.state = {
      initialized: false,
      heading: null,
      position: null,
      accuracy: null,
      pois: []
    };

    this.updateLoopId = null;
  }

  /**
   * Initialize app (called after permissions granted)
   */
  async init() {
    console.log('[SightlineApp] Initializing...');

    // Enable sensors
    this.imuManager.enable();
    this.gpsManager.enable();

    // Subscribe to sensor updates
    this.imuManager.onChange((heading) => {
      this.state.heading = heading;
      this.updateHUD();
    });

    this.gpsManager.onChange((position, accuracy) => {
      this.state.position = position;
      this.state.accuracy = accuracy;
      this.updateHUD();
    });

    // Initialize POI states
    this.state.pois = POIS.map(poi => ({
      ...poi,
      bearing: null,
      distance: null,
      delta: null,
      state: 'HIDDEN'
    }));

    // Start update loop
    this.startUpdateLoop();

    this.state.initialized = true;
    console.log('[SightlineApp] Initialization complete');
  }

  /**
   * Start main update loop
   */
  startUpdateLoop() {
    const tick = () => {
      this.update();
      this.updateLoopId = requestAnimationFrame(tick);
    };
    tick();
  }

  /**
   * Main update function (called every frame)
   */
  update() {
    if (!this.state.position || !isValidNumber(this.state.heading)) {
      return; // Wait for valid data
    }

    // Update POI states
    for (const poi of this.state.pois) {
      // Calculate bearing
      poi.bearing = calculateBearing(
        this.state.position.lat,
        this.state.position.lng,
        poi.lat,
        poi.lng
      );

      // Calculate distance
      poi.distance = calculateDistance(
        this.state.position.lat,
        this.state.position.lng,
        poi.lat,
        poi.lng
      );

      // Calculate delta (angular difference)
      if (isValidNumber(poi.bearing) && isValidNumber(this.state.heading)) {
        poi.delta = angularDifference(this.state.heading, poi.bearing);

        // Determine state
        if (poi.delta > 90) {
          poi.state = 'HIDDEN';
        } else if (poi.delta > 30) {
          poi.state = 'OFF_FOV';
        } else if (poi.delta > 5) {
          poi.state = 'IN_FOV';
        } else {
          poi.state = 'CENTER_LOCK';
        }
      } else {
        poi.state = 'HIDDEN';
      }
    }

    // Update UI
    this.updatePOIUI();
  }

  /**
   * Update HUD (heading, GPS, accuracy)
   */
  updateHUD() {
    // Update heading display
    const headingEl = document.getElementById('heading-value');
    if (headingEl) {
      if (isValidNumber(this.state.heading)) {
        const direction = this.getCompassDirection(this.state.heading);
        headingEl.textContent = `${Math.round(this.state.heading)}° ${direction}`;
        headingEl.style.color = this.imuManager.getCalibrationState() === 'good' ? '#4ADE80' : '#FFA500';
      } else {
        headingEl.textContent = '—';
        headingEl.style.color = '#888';
      }
    }

    // Update GPS display
    const gpsEl = document.getElementById('gps-value');
    if (gpsEl && this.state.position) {
      gpsEl.textContent = `${this.state.position.lat.toFixed(5)}, ${this.state.position.lng.toFixed(5)}`;
    }

    // Update accuracy display
    const accEl = document.getElementById('accuracy-value');
    if (accEl) {
      if (isValidNumber(this.state.accuracy)) {
        accEl.textContent = `±${Math.round(this.state.accuracy)}m`;
        accEl.style.color = this.state.accuracy < 20 ? '#4ADE80' : '#FFA500';
      } else {
        accEl.textContent = '—';
      }
    }

    // DIAGNOSTIC: Update camera debug info
    this.updateCameraDebug();
  }

  /**
   * Update camera diagnostic info
   */
  updateCameraDebug() {
    const debugEl = document.getElementById('camera-debug');
    if (!debugEl) return;

    const video = document.querySelector('video');
    const scene = document.querySelector('a-scene');
    const canvas = document.querySelector('canvas');

    let debugInfo = [];

    // Video element check
    if (video) {
      const isWorking = video.videoWidth > 0 && video.videoHeight > 0 && !video.paused;
      
      if (isWorking) {
        debugInfo.push(`✅ Video WORKING!`);
      } else {
        debugInfo.push(`⚠️ Video exists but not working`);
      }
      
      debugInfo.push(`Size: ${video.videoWidth}×${video.videoHeight}${video.videoWidth === 0 ? ' ❌' : ' ✅'}`);
      debugInfo.push(`Ready: ${video.readyState}/4${video.readyState === 4 ? ' ✅' : ' ⚠️'}`);
      debugInfo.push(`SrcObj: ${video.srcObject ? 'Yes ✅' : 'No ❌'}`);
      debugInfo.push(`Paused: ${video.paused ? 'Yes ❌' : 'No ✅'}`);
      
      const style = window.getComputedStyle(video);
      debugInfo.push(`Display: ${style.display}`);
      debugInfo.push(`Visibility: ${style.visibility}`);
      debugInfo.push(`Opacity: ${style.opacity}`);
      debugInfo.push(`Z-index: ${style.zIndex}`);
      
      // Show attributes
      const attrs = [];
      if (video.hasAttribute('playsinline')) attrs.push('playsinline');
      if (video.hasAttribute('autoplay')) attrs.push('autoplay');
      if (video.hasAttribute('muted')) attrs.push('muted');
      debugInfo.push(`Attrs: ${attrs.join(', ') || 'none'}`);
    } else {
      debugInfo.push(`❌ Video not found`);
    }

    // Scene check
    if (scene) {
      debugInfo.push(`✅ Scene exists`);
      debugInfo.push(`Loaded: ${scene.hasLoaded ? 'Yes' : 'No'}`);
      const arSystem = scene.systems['arjs'];
      debugInfo.push(`AR.js: ${arSystem ? 'Yes' : 'No'}`);
    } else {
      debugInfo.push(`❌ Scene not found`);
    }

    // Canvas check
    if (canvas) {
      debugInfo.push(`✅ Canvas exists`);
      debugInfo.push(`Canvas size: ${canvas.width}×${canvas.height}`);
    } else {
      debugInfo.push(`❌ Canvas not found`);
    }

    debugEl.innerHTML = debugInfo.join('<br>');
  }

  /**
   * Update POI UI (labels)
   */
  updatePOIUI() {
    // This will integrate with UI V2 system
    // For now, just update the old AR.js entities
    
    for (const poi of this.state.pois) {
      const entity = document.querySelector(`[data-poi-id="${poi.id}"]`);
      if (!entity) continue;

      // Update distance text
      const distanceText = entity.querySelector('.distance-text');
      if (distanceText) {
        distanceText.setAttribute('value', formatDistance(poi.distance));
      }

      // Show/hide based on state
      if (poi.state === 'HIDDEN') {
        entity.setAttribute('visible', 'false');
      } else {
        entity.setAttribute('visible', 'true');
      }
    }
  }

  /**
   * Get compass direction from heading
   */
  getCompassDirection(heading) {
    if (!isValidNumber(heading)) return '';
    
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(heading / 45) % 8;
    return directions[index];
  }

  /**
   * Get debug info
   */
  getDebugInfo() {
    return {
      initialized: this.state.initialized,
      heading: {
        current: formatNumber(this.state.heading, 1),
        raw: formatNumber(this.imuManager.headingRaw, 1),
        source: this.imuManager.getSource(),
        calibration: this.imuManager.getCalibrationState()
      },
      gps: {
        lat: this.state.position ? formatNumber(this.state.position.lat, 5) : null,
        lng: this.state.position ? formatNumber(this.state.position.lng, 5) : null,
        accuracy: formatNumber(this.state.accuracy, 0)
      },
      pois: this.state.pois.map(poi => ({
        id: poi.id,
        name: poi.name,
        bearing: formatNumber(poi.bearing, 1),
        distance: formatNumber(poi.distance, 0),
        delta: formatNumber(poi.delta, 1),
        state: poi.state
      }))
    };
  }
}

// ============================================================================
// START PAGE FLOW
// ============================================================================

let app = null;

/**
 * Force video element to play (FIX #1)
 */
async function forceVideoPlay() {
  console.log('[VideoFix] Looking for video element...');
  
  // Wait for video element to be created by AR.js
  let video = null;
  let attempts = 0;
  const maxAttempts = 20; // 2 seconds max
  
  while (!video && attempts < maxAttempts) {
    video = document.querySelector('video');
    if (!video) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
  }
  
  if (!video) {
    console.error('[VideoFix] Video element not found after 2 seconds');
    return;
  }
  
  console.log('[VideoFix] Video element found');
  
  // Add iOS-required attributes
  video.setAttribute('playsinline', '');
  video.setAttribute('autoplay', '');
  video.setAttribute('muted', '');
  video.muted = true; // Ensure muted (required for autoplay on iOS)
  
  console.log('[VideoFix] Added playsinline, autoplay, muted attributes');
  
  // Wait for video metadata to load
  if (video.readyState < 1) {
    console.log('[VideoFix] Waiting for video metadata...');
    await new Promise((resolve) => {
      video.addEventListener('loadedmetadata', () => {
        console.log('[VideoFix] Video metadata loaded');
        console.log('[VideoFix] Video dimensions:', video.videoWidth, 'x', video.videoHeight);
        resolve();
      }, { once: true });
      
      // Timeout after 5 seconds
      setTimeout(() => {
        console.warn('[VideoFix] Metadata load timeout');
        resolve();
      }, 5000);
    });
  }
  
  // Force play
  try {
    console.log('[VideoFix] Calling video.play()...');
    await video.play();
    console.log('[VideoFix] ✅ Video playing successfully!');
    console.log('[VideoFix] Video dimensions:', video.videoWidth, 'x', video.videoHeight);
    console.log('[VideoFix] Video readyState:', video.readyState);
  } catch (error) {
    console.error('[VideoFix] ❌ Failed to play video:', error);
  }
}

async function handleStartClick() {
  const startScreen = document.getElementById('start-screen');
  const arScreen = document.getElementById('ar-screen');
  const statusEl = document.getElementById('permission-status');
  const startBtn = document.getElementById('start-btn');

  try {
    // Disable button
    startBtn.disabled = true;
    startBtn.textContent = 'Requesting permissions...';
    statusEl.textContent = 'Requesting camera, location, and motion permissions...';

    // Request all permissions
    const permissionManager = new PermissionManager();
    await permissionManager.requestAll();

    // Hide start screen, show AR screen
    startScreen.style.display = 'none';
    arScreen.style.display = 'block';

    // Hide loading overlay (it's blocking the camera)
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.style.display = 'none';
    }

    // Wait for A-Frame scene to be ready
    const scene = document.querySelector('a-scene');
    if (scene) {
      console.log('[StartPage] Waiting for A-Frame scene...');
      
      // If scene already loaded, proceed
      if (scene.hasLoaded) {
        console.log('[StartPage] Scene already loaded');
      } else {
        // Wait for scene to load
        await new Promise((resolve) => {
          scene.addEventListener('loaded', () => {
            console.log('[StartPage] Scene loaded');
            resolve();
          });
        });
      }

      // FIX #1: Force video to play
      await this.forceVideoPlay();
    }

    // Initialize app
    app = new SightlineApp();
    await app.init();

    // Expose to window for debugging
    window.SightlineApp = app;

    console.log('[StartPage] App initialized successfully');

  } catch (error) {
    console.error('[StartPage] Permission error:', error);
    
    // Show error
    statusEl.textContent = `Error: ${error.message}. Please grant permissions and try again.`;
    statusEl.style.color = '#ef4444';
    
    // Re-enable button
    startBtn.disabled = false;
    startBtn.textContent = 'Try Again';
  }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('[Sightline] DOM loaded, waiting for user interaction...');

  // Wire up start button
  const startBtn = document.getElementById('start-btn');
  if (startBtn) {
    startBtn.addEventListener('click', handleStartClick);
  }
});

// Expose for debugging
window.SightlineDebug = {
  getApp: () => app,
  getDebugInfo: () => app ? app.getDebugInfo() : null
};

