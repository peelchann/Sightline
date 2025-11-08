/**
 * Sightline WebAR - OrientationManager v2.0
 * Real-time IMU/Compass heading with smoothing, iOS permission, and calibration
 */

const OrientationManagerV2 = {
  // ============================================================================
  // STATE
  // ============================================================================
  
  currentHeading: 0,
  smoothedHeading: 0,
  headingSource: 'none', // 'webkit', 'absolute', 'geolocation', 'manual', 'none'
  calibrationState: 'unknown', // 'good', 'poor', 'unknown'
  isCalibrating: false,
  permissionGranted: false,
  headingHistory: [],
  maxHistorySize: 20,
  lastRawHeading: null,
  
  // Performance
  lastUpdateTime: 0,
  updateInterval: 50, // 20 FPS
  
  // Smoothing
  SMOOTHING_ALPHA: 0.15, // Exponential moving average weight
  
  // Callbacks
  onHeadingChange: null,
  onCalibrationChange: null,
  
  // ============================================================================
  // INITIALIZATION
  // ============================================================================
  
  async init(onHeadingCallback, onCalibrationCallback) {
    this.onHeadingChange = onHeadingCallback;
    this.onCalibrationChange = onCalibrationCallback;
    
    console.log('🧭 OrientationManagerV2 initializing...');
    
    // Check if iOS 13+ permission required
    if (typeof DeviceOrientationEvent !== 'undefined' && 
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      console.log('📱 iOS 13+ detected - permission required');
      this.showPermissionUI();
      return;
    }
    
    // Start listening for orientation events
    this.startListening();
  },
  
  // ============================================================================
  // iOS PERMISSION UI
  // ============================================================================
  
  showPermissionUI() {
    const permissionBtn = document.getElementById('motion-permission-btn');
    const permissionOverlay = document.getElementById('motion-permission-overlay');
    
    if (permissionOverlay) {
      permissionOverlay.classList.remove('hidden');
    }
    
    if (permissionBtn) {
      permissionBtn.addEventListener('click', async () => {
        try {
          const permission = await DeviceOrientationEvent.requestPermission();
          if (permission === 'granted') {
            this.permissionGranted = true;
            if (permissionOverlay) {
              permissionOverlay.classList.add('hidden');
            }
            this.startListening();
            console.log('✅ Motion permission granted');
            if (window.showSuccess) {
              window.showSuccess('✅ Motion sensors enabled');
            }
          } else {
            console.warn('Motion permission denied');
            if (window.showError) {
              window.showError('Motion permission denied. Demo mode available.');
            }
          }
        } catch (error) {
          console.error('Permission request failed:', error);
          if (window.showError) {
            window.showError('Could not request motion permission');
          }
        }
      });
    }
  },
  
  // ============================================================================
  // EVENT LISTENERS
  // ============================================================================
  
  startListening() {
    console.log('👂 Starting orientation listeners...');
    
    // Primary: DeviceOrientation with compass heading (iOS Safari)
    window.addEventListener('deviceorientation', (event) => {
      this.handleDeviceOrientation(event);
    }, true);
    
    // Fallback: DeviceOrientationAbsolute (Android Chrome)
    window.addEventListener('deviceorientationabsolute', (event) => {
      this.handleDeviceOrientationAbsolute(event);
    }, true);
    
    // Geolocation heading (moving only, coarse)
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => this.handleGeolocationHeading(position),
        null,
        { enableHighAccuracy: true }
      );
    }
    
    console.log('✅ Orientation listeners active');
  },
  
  // ============================================================================
  // HEADING SOURCES
  // ============================================================================
  
  handleDeviceOrientation(event) {
    // iOS provides webkitCompassHeading (0-360, true north)
    if (event.webkitCompassHeading !== undefined && event.webkitCompassHeading !== null) {
      const heading = event.webkitCompassHeading;
      this.processHeading(heading, 'webkit');
      return;
    }
    
    // Fallback: use alpha (magnetic north, device-relative)
    if (event.alpha !== null) {
      // Convert alpha to compass heading (alpha is clockwise from north)
      const heading = 360 - event.alpha;
      this.processHeading(heading, 'absolute');
    }
  },
  
  handleDeviceOrientationAbsolute(event) {
    // Android Chrome provides absolute orientation
    if (event.alpha !== null) {
      const heading = 360 - event.alpha;
      this.processHeading(heading, 'absolute');
    }
  },
  
  handleGeolocationHeading(position) {
    // Only use if moving (course is only valid when moving)
    if (position.coords.heading !== null && position.coords.speed > 0.5) {
      this.processHeading(position.coords.heading, 'geolocation');
    }
  },
  
  // ============================================================================
  // HEADING PROCESSING WITH SMOOTHING
  // ============================================================================
  
  processHeading(rawHeading, source) {
    const now = Date.now();
    
    // Throttle updates (20 FPS max)
    if (now - this.lastUpdateTime < this.updateInterval) {
      return;
    }
    
    this.lastUpdateTime = now;
    this.lastRawHeading = rawHeading;
    this.headingSource = source;
    
    // Normalize input to [0, 360)
    rawHeading = (rawHeading + 360) % 360;
    
    // First reading: initialize without smoothing
    if (this.currentHeading === 0 && this.headingHistory.length === 0) {
      this.currentHeading = rawHeading;
      this.smoothedHeading = rawHeading;
      this.headingHistory.push(rawHeading);
      this.triggerUpdate();
      return;
    }
    
    // Compute delta with wrap-around handling
    let delta = rawHeading - this.currentHeading;
    
    // Wrap-around fix: handle 359° → 0° and 0° → 359° transitions
    if (Math.abs(delta) > 180) {
      if (delta > 0) {
        delta -= 360;
      } else {
        delta += 360;
      }
    }
    
    // Apply exponential moving average (lerp)
    this.smoothedHeading = this.currentHeading + (delta * this.SMOOTHING_ALPHA);
    
    // Normalize to [0, 360)
    this.smoothedHeading = (this.smoothedHeading + 360) % 360;
    
    // Update current heading
    this.currentHeading = this.smoothedHeading;
    
    // Update history for calibration check
    this.headingHistory.push(this.smoothedHeading);
    if (this.headingHistory.length > this.maxHistorySize) {
      this.headingHistory.shift();
    }
    
    // Check calibration quality
    this.checkCalibration();
    
    // Trigger UI update
    this.triggerUpdate();
  },
  
  // ============================================================================
  // CALIBRATION DETECTION
  // ============================================================================
  
  checkCalibration() {
    if (this.headingHistory.length < 10) {
      this.calibrationState = 'unknown';
      return;
    }
    
    // Calculate variance (spread of recent headings)
    const mean = this.headingHistory.reduce((a, b) => a + b, 0) / this.headingHistory.length;
    const variance = this.headingHistory.reduce((sum, h) => {
      // Handle wrap-around for variance calculation
      let diff = h - mean;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      return sum + (diff * diff);
    }, 0) / this.headingHistory.length;
    
    const stdDev = Math.sqrt(variance);
    
    // Good: variance < 15°, Poor: variance > 30°
    const previousState = this.calibrationState;
    
    if (stdDev < 15) {
      this.calibrationState = 'good';
      if (previousState === 'poor') {
        this.hideCalibrationHint();
      }
    } else if (stdDev > 30) {
      this.calibrationState = 'poor';
      if (previousState !== 'poor') {
        this.showCalibrationHint();
      }
    }
    
    // Trigger callback if state changed
    if (previousState !== this.calibrationState && this.onCalibrationChange) {
      this.onCalibrationChange(this.calibrationState);
    }
  },
  
  showCalibrationHint() {
    const toast = document.getElementById('calibration-toast');
    if (toast) {
      toast.classList.remove('hidden');
      // Auto-hide after 5 seconds
      setTimeout(() => this.hideCalibrationHint(), 5000);
    }
  },
  
  hideCalibrationHint() {
    const toast = document.getElementById('calibration-toast');
    if (toast) {
      toast.classList.add('hidden');
    }
  },
  
  // ============================================================================
  // UPDATE TRIGGER
  // ============================================================================
  
  triggerUpdate() {
    if (this.onHeadingChange) {
      this.onHeadingChange(this.smoothedHeading);
    }
  },
  
  // ============================================================================
  // PUBLIC API
  // ============================================================================
  
  getHeading() {
    return this.smoothedHeading;
  },
  
  getRawHeading() {
    return this.lastRawHeading;
  },
  
  getSource() {
    return this.headingSource;
  },
  
  getCalibrationState() {
    return this.calibrationState;
  },
  
  isReady() {
    return this.headingSource !== 'none';
  },
  
  setManualHeading(heading) {
    this.processHeading(heading, 'manual');
  },
  
  // ============================================================================
  // DEBUG INFO
  // ============================================================================
  
  getDebugInfo() {
    return {
      heading: this.smoothedHeading.toFixed(1),
      raw: this.lastRawHeading ? this.lastRawHeading.toFixed(1) : 'null',
      source: this.headingSource,
      calibration: this.calibrationState,
      historySize: this.headingHistory.length,
      permissionGranted: this.permissionGranted
    };
  }
};

// Export for use in app.js
if (typeof window !== 'undefined') {
  window.OrientationManagerV2 = OrientationManagerV2;
}

