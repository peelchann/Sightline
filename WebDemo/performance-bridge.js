/**
 * Sightline WebAR - Performance Bridge
 * Connects OrientationManagerV2 with existing app-enhanced-imu.js
 * This script runs AFTER app-enhanced-imu.js to enhance it
 */

(function() {
  console.log('🌉 Performance Bridge initializing...');
  
  // Wait for DOM and app to be ready
  const initBridge = () => {
    // Check if required globals exist
    if (!window.OrientationManagerV2) {
      console.error('❌ OrientationManagerV2 not loaded');
      return;
    }
    
    if (!window.LabelLayoutEngine) {
      console.error('❌ LabelLayoutEngine not loaded');
      return;
    }
    
    if (!window.PerformanceManager) {
      console.error('❌ PerformanceManager not loaded');
      return;
    }
    
    console.log('✅ All performance modules loaded, applying enhancements...');
    
    // ============================================================================
    // REPLACE OLD ORIENTATIONMANAGER WITH V2
    // ============================================================================
    
    if (window.OrientationManager) {
      console.log('🔄 Replacing OrientationManager with V2...');
      
      // Backup original
      window.OrientationManager_V1 = window.OrientationManager;
      
      // Replace with V2
      window.OrientationManager = window.OrientationManagerV2;
      
      // Re-initialize if app already started
      if (window.DemoController) {
        window.OrientationManagerV2.init(
          onHeadingUpdate_Bridge,
          onCalibrationUpdate_Bridge
        );
      }
    }
    
    // ============================================================================
    // BRIDGE CALLBACKS
    // ============================================================================
    
    function onHeadingUpdate_Bridge(heading) {
      // Update heading display
      if (window.updateHeadingDisplay) {
        window.updateHeadingDisplay(heading);
      }
      
      // Update POI positions based on heading
      if (window.POIS && window.DemoController && window.poiEntities) {
        const userPos = window.DemoController.getCurrentPosition();
        if (userPos) {
          window.updateAllPOIPositions(
            heading,
            window.POIS,
            userPos,
            window.poiEntities
          );
        }
      }
    }
    
    function onCalibrationUpdate_Bridge(state) {
      console.log(`🧭 Calibration state: ${state}`);
      
      // Show/hide calibration warning
      if (state === 'poor') {
        const toast = document.getElementById('calibration-toast');
        if (toast) toast.classList.remove('hidden');
      } else {
        const toast = document.getElementById('calibration-toast');
        if (toast) toast.classList.add('hidden');
      }
    }
    
    // ============================================================================
    // START PERFORMANCE LOOPS
    // ============================================================================
    
    window.PerformanceManager.init(
      // Heading update callback (20 FPS)
      (heading) => {
        onHeadingUpdate_Bridge(heading);
      },
      
      // Distance update callback (10 FPS)
      () => {
        if (window.POIS && window.DemoController && window.poiEntities) {
          const userPos = window.DemoController.getCurrentPosition();
          if (userPos) {
            window.updateAllDistancesAndBearings(
              window.POIS,
              userPos,
              window.poiEntities
            );
          }
        }
      },
      
      // Label layout callback (2 FPS)
      () => {
        if (window.LabelLayoutEngine && window.POIS && window.DemoController && window.poiEntities) {
          const userPos = window.DemoController.getCurrentPosition();
          const heading = window.OrientationManagerV2.getHeading();
          
          if (userPos) {
            window.LabelLayoutEngine.run(
              window.POIS,
              userPos,
              heading,
              window.poiEntities
            );
          }
        }
      }
    );
    
    // ============================================================================
    // ADD FPS DISPLAY
    // ============================================================================
    
    const fpsDisplay = document.createElement('div');
    fpsDisplay.id = 'fps-display';
    fpsDisplay.style.cssText = `
      position: fixed;
      bottom: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.7);
      color: #4ADE80;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-family: monospace;
      z-index: 1000;
      pointer-events: none;
    `;
    fpsDisplay.textContent = '-- FPS';
    document.body.appendChild(fpsDisplay);
    
    // ============================================================================
    // ENHANCE DEBUG API
    // ============================================================================
    
    if (window.SightlineAR) {
      window.SightlineAR.getHeadingV2 = () => window.OrientationManagerV2.getHeading();
      window.SightlineAR.getHeadingSource = () => window.OrientationManagerV2.getSource();
      window.SightlineAR.getCalibrationState = () => window.OrientationManagerV2.getCalibrationState();
      window.SightlineAR.getFPS = () => window.PerformanceManager.currentFPS;
      window.SightlineAR.getDebugInfo = () => ({
        ...window.OrientationManagerV2.getDebugInfo(),
        fps: window.PerformanceManager.currentFPS,
        visibleLabels: window.LabelLayoutEngine.visibleLabels.length
      });
    }
    
    console.log('✅ Performance bridge active - 20 FPS heading, 10 FPS distance, 2 FPS layout');
    console.log('💡 Debug: window.SightlineAR.getDebugInfo()');
  };
  
  // Run after DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // Give app-enhanced-imu.js time to initialize
      setTimeout(initBridge, 500);
    });
  } else {
    setTimeout(initBridge, 500);
  }
  
})();

