/**
 * Sightline WebAR UI V2 - Integration Bridge
 * 
 * Connects the new UI V2 system (3-tier progressive disclosure) with the existing
 * app logic (OrientationManagerV2, PerformanceManager, etc.)
 * 
 * This file initializes the UI system and wires up event handlers.
 */

(function() {
  'use strict';

  // Global instances
  window.SightlineUIV2 = {
    stateManager: null,
    layoutEngine: null,
    initialized: false
  };

  /**
   * Initialize UI V2 system
   */
  function initUIV2() {
    console.log('[UI V2] Initializing...');

    // Wait for A-Frame scene to be ready
    const scene = document.querySelector('a-scene');
    if (!scene) {
      console.error('[UI V2] A-Frame scene not found');
      return;
    }

    scene.addEventListener('loaded', () => {
      console.log('[UI V2] Scene loaded, setting up UI system');

      // Create managers
      window.SightlineUIV2.stateManager = new UIStateManager();
      window.SightlineUIV2.layoutEngine = new UILayoutEngine();

      // Initialize state manager with scene
      window.SightlineUIV2.stateManager.init(scene);

      // Register POIs from POIS array (if exists)
      if (typeof POIS !== 'undefined' && Array.isArray(POIS)) {
        registerPOIsFromArray(POIS);
      } else {
        // Fallback: scan DOM for POI entities
        registerPOIsFromDOM();
      }

      // Wire up update loops
      setupUpdateLoops();

      // Wire up event handlers
      setupEventHandlers();

      window.SightlineUIV2.initialized = true;
      console.log('[UI V2] Initialization complete');
    });
  }

  /**
   * Register POIs from POIS array
   * @param {Array} pois - Array of POI objects
   */
  function registerPOIsFromArray(pois) {
    console.log(`[UI V2] Registering ${pois.length} POIs from array`);

    for (const poi of pois) {
      // Ensure POI has required fields
      if (!poi.id || !poi.name || poi.lat === undefined || poi.lng === undefined) {
        console.warn('[UI V2] Skipping invalid POI:', poi);
        continue;
      }

      // Add category if missing
      if (!poi.category) {
        poi.category = inferCategory(poi);
      }

      window.SightlineUIV2.stateManager.registerPOI(poi);
    }
  }

  /**
   * Register POIs from DOM entities
   */
  function registerPOIsFromDOM() {
    console.log('[UI V2] Scanning DOM for POI entities');

    const entities = document.querySelectorAll('[gps-entity-place]');
    console.log(`[UI V2] Found ${entities.length} GPS entities`);

    for (const entity of entities) {
      const poiId = entity.getAttribute('data-poi-id');
      if (!poiId) continue;

      const gpsAttr = entity.getAttribute('gps-entity-place');
      const [lat, lng] = gpsAttr.split(';').map(part => {
        const [key, value] = part.split(':').map(s => s.trim());
        return parseFloat(value);
      });

      // Extract name from a-text element
      const nameEl = entity.querySelector('a-text[value]');
      const name = nameEl ? nameEl.getAttribute('value') : poiId;

      // Extract description
      const descEls = entity.querySelectorAll('a-text');
      const description = descEls.length > 1 ? descEls[1].getAttribute('value') : '';

      const poi = {
        id: poiId,
        name,
        lat,
        lng,
        category: inferCategoryFromDOM(entity),
        description
      };

      window.SightlineUIV2.stateManager.registerPOI(poi);
    }
  }

  /**
   * Infer category from POI data
   * @param {Object} poi - POI object
   * @returns {string} Category
   */
  function inferCategory(poi) {
    const name = poi.name.toLowerCase();
    
    if (name.includes('museum') || name.includes('xiqu') || name.includes('art')) {
      return 'museum';
    }
    if (name.includes('ferry') || name.includes('mtr') || name.includes('station')) {
      return 'transport';
    }
    if (name.includes('park') || name.includes('harbour') || name.includes('garden')) {
      return 'nature';
    }
    return 'landmark';
  }

  /**
   * Infer category from DOM entity classes
   * @param {HTMLElement} entity - DOM entity
   * @returns {string} Category
   */
  function inferCategoryFromDOM(entity) {
    if (entity.classList.contains('poi-museum')) return 'museum';
    if (entity.classList.contains('poi-transport')) return 'transport';
    if (entity.classList.contains('poi-nature')) return 'nature';
    return 'landmark';
  }

  /**
   * Setup update loops
   */
  function setupUpdateLoops() {
    // Hook into existing PerformanceManager if available
    if (typeof PerformanceManager !== 'undefined' && PerformanceManager.addCallback) {
      console.log('[UI V2] Hooking into PerformanceManager');

      // Update state manager on heading updates (20 FPS)
      PerformanceManager.addCallback('heading', () => {
        updateUIState();
      });

      // Update layout engine on layout updates (2 FPS)
      PerformanceManager.addCallback('layout', () => {
        updateLayout();
      });
    } else {
      // Fallback: manual intervals
      console.log('[UI V2] Using fallback update loops');

      setInterval(() => updateUIState(), 100); // 10 FPS
      setInterval(() => updateLayout(), 500);  // 2 FPS
    }
  }

  /**
   * Update UI state based on current position and heading
   */
  function updateUIState() {
    if (!window.SightlineUIV2.initialized) return;

    // Get current user position and heading
    const position = getCurrentPosition();
    const heading = getCurrentHeading();

    if (!position || heading === null) return;

    // Update state manager
    window.SightlineUIV2.stateManager.updateUser(
      position.lat,
      position.lng,
      heading
    );
  }

  /**
   * Update layout (collision detection)
   */
  function updateLayout() {
    if (!window.SightlineUIV2.initialized) return;

    // Compute layout
    window.SightlineUIV2.layoutEngine.computeLayout(
      window.SightlineUIV2.stateManager.pois
    );
  }

  /**
   * Get current user position
   * @returns {Object|null} {lat, lng} or null
   */
  function getCurrentPosition() {
    // Try DemoController first
    if (typeof DemoController !== 'undefined' && DemoController.getCurrentPosition) {
      return DemoController.getCurrentPosition();
    }

    // Try global state
    if (window.SightlineAR && window.SightlineAR.userPosition) {
      return window.SightlineAR.userPosition;
    }

    // Fallback to GPS camera
    const camera = document.querySelector('[gps-camera]');
    if (camera && camera.components['gps-camera']) {
      const gps = camera.components['gps-camera'];
      if (gps.currentPosition) {
        return {
          lat: gps.currentPosition.latitude,
          lng: gps.currentPosition.longitude
        };
      }
    }

    return null;
  }

  /**
   * Get current user heading
   * @returns {number|null} Heading in degrees (0-359) or null
   */
  function getCurrentHeading() {
    // Try OrientationManagerV2 first
    if (typeof OrientationManagerV2 !== 'undefined' && OrientationManagerV2.getHeading) {
      return OrientationManagerV2.getHeading();
    }

    // Try DemoController
    if (typeof DemoController !== 'undefined' && DemoController.getHeading) {
      return DemoController.getHeading();
    }

    // Try global state
    if (window.SightlineAR && window.SightlineAR.heading !== undefined) {
      return window.SightlineAR.heading;
    }

    return null;
  }

  /**
   * Setup event handlers
   */
  function setupEventHandlers() {
    // Listen for rotate-to-poi events (from SideChip/EdgeArrow taps)
    window.addEventListener('sightline:rotate-to-poi', (event) => {
      const { poiId, bearing } = event.detail;
      console.log(`[UI V2] Rotate to POI: ${poiId}, bearing: ${bearing}°`);

      // Animate camera rotation (if supported)
      animateCameraRotation(bearing);
    });

    // Listen for debug toggle (keyboard shortcut)
    document.addEventListener('keydown', (event) => {
      if (event.key === 'k' && event.ctrlKey) {
        event.preventDefault();
        toggleCollisionVisualization();
      }
    });
  }

  /**
   * Animate camera rotation to target bearing
   * @param {number} targetBearing - Target bearing in degrees
   */
  function animateCameraRotation(targetBearing) {
    // Try DemoController first
    if (typeof DemoController !== 'undefined' && DemoController.setHeading) {
      DemoController.setHeading(targetBearing);
      return;
    }

    // Try OrientationManagerV2
    if (typeof OrientationManagerV2 !== 'undefined' && OrientationManagerV2.setManualHeading) {
      OrientationManagerV2.setManualHeading(targetBearing);
      return;
    }

    console.warn('[UI V2] No method available to rotate camera');
  }

  /**
   * Toggle collision visualization (debug)
   */
  function toggleCollisionVisualization() {
    if (!window.SightlineUIV2.layoutEngine) return;

    const isVisible = document.querySelector('.debug-collision-box') !== null;
    window.SightlineUIV2.layoutEngine.visualizeCollisions(!isVisible);

    console.log(`[UI V2] Collision visualization: ${!isVisible ? 'ON' : 'OFF'}`);
  }

  /**
   * Get debug info
   * @returns {Object} Debug info
   */
  function getDebugInfo() {
    if (!window.SightlineUIV2.initialized) {
      return { error: 'UI V2 not initialized' };
    }

    return {
      stateManager: window.SightlineUIV2.stateManager.getStateSummary(),
      layoutEngine: window.SightlineUIV2.layoutEngine.getLayoutSummary(),
      position: getCurrentPosition(),
      heading: getCurrentHeading()
    };
  }

  // Expose debug API
  window.SightlineUIV2.getDebugInfo = getDebugInfo;
  window.SightlineUIV2.toggleCollisionVisualization = toggleCollisionVisualization;

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUIV2);
  } else {
    initUIV2();
  }

  console.log('[UI V2] Integration bridge loaded');
})();

