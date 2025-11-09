/**
 * Sightline WebAR UI V2 - State Manager
 * 
 * Manages the visibility state of POI UI components based on:
 * - Angular difference (delta) between user heading and POI bearing
 * - Hysteresis to prevent flicker
 * - Priority-based rendering (center > side > edge)
 */

/**
 * POI Visibility States
 */
const UIState = {
  HIDDEN: 'hidden',        // |delta| > 90° (behind user)
  OFF_FOV: 'off_fov',      // 30° < |delta| ≤ 90° (edge arrow)
  IN_FOV: 'in_fov',        // 5° < |delta| ≤ 30° (side chip)
  CENTER_LOCK: 'center_lock' // |delta| ≤ 5° (center card)
};

/**
 * State transition thresholds (with hysteresis)
 */
const Thresholds = {
  // Lock thresholds (entering state)
  CENTER_LOCK_ENTER: 5,
  IN_FOV_ENTER: 30,
  OFF_FOV_ENTER: 90,
  
  // Unlock thresholds (exiting state)
  CENTER_LOCK_EXIT: 7,    // Hysteresis: lock at 5°, unlock at 7°
  IN_FOV_EXIT: 32,        // Hysteresis: lock at 30°, unlock at 32°
  OFF_FOV_EXIT: 92        // Hysteresis: lock at 90°, unlock at 92°
};

/**
 * UI State Manager
 * Handles state transitions and component lifecycle
 */
class UIStateManager {
  constructor() {
    this.pois = new Map(); // poiId -> { poi, state, component, lastUpdate }
    this.scene = null;
    this.userHeading = 0;
    this.userPosition = { lat: 0, lng: 0 };
    
    // Performance tracking
    this.lastStateUpdate = 0;
    this.stateUpdateInterval = 100; // Update states every 100ms (10 FPS)
  }

  /**
   * Initialize with A-Frame scene
   * @param {HTMLElement} scene - A-Frame scene element
   */
  init(scene) {
    this.scene = scene;
    console.log('[UIStateManager] Initialized');
  }

  /**
   * Register a POI for state management
   * @param {Object} poi - POI data (id, name, lat, lng, category, description)
   */
  registerPOI(poi) {
    if (!poi.id) {
      console.error('[UIStateManager] POI missing id:', poi);
      return;
    }

    this.pois.set(poi.id, {
      poi,
      state: UIState.HIDDEN,
      component: null,
      lastUpdate: 0,
      bearing: 0,
      distance: 0,
      delta: 180
    });

    console.log(`[UIStateManager] Registered POI: ${poi.name} (${poi.id})`);
  }

  /**
   * Unregister a POI
   * @param {string} poiId - POI identifier
   */
  unregisterPOI(poiId) {
    const entry = this.pois.get(poiId);
    if (entry && entry.component) {
      entry.component.destroy();
    }
    this.pois.delete(poiId);
    console.log(`[UIStateManager] Unregistered POI: ${poiId}`);
  }

  /**
   * Update user position and heading
   * @param {number} lat - User latitude
   * @param {number} lng - User longitude
   * @param {number} heading - User heading (0-359°)
   */
  updateUser(lat, lng, heading) {
    this.userPosition = { lat, lng };
    this.userHeading = heading;

    // Throttle state updates for performance
    const now = Date.now();
    if (now - this.lastStateUpdate < this.stateUpdateInterval) {
      return;
    }
    this.lastStateUpdate = now;

    // Update all POI states
    this.updateAllStates();
  }

  /**
   * Update states for all registered POIs
   */
  updateAllStates() {
    const updates = [];

    for (const [poiId, entry] of this.pois) {
      // Calculate bearing and distance
      const bearing = this.calculateBearing(
        this.userPosition.lat,
        this.userPosition.lng,
        entry.poi.lat,
        entry.poi.lng
      );
      const distance = this.calculateDistance(
        this.userPosition.lat,
        this.userPosition.lng,
        entry.poi.lat,
        entry.poi.lng
      );

      // Calculate angular difference (delta)
      const delta = this.angularDifference(this.userHeading, bearing);

      // Compute new state
      const newState = this.computeState(entry.state, delta);

      // Store updated values
      entry.bearing = bearing;
      entry.distance = distance;
      entry.delta = delta;

      // Track state changes
      if (newState !== entry.state) {
        updates.push({
          poiId,
          oldState: entry.state,
          newState,
          delta,
          distance
        });
        entry.state = newState;
      }

      // Update component if visible
      if (entry.component && entry.state !== UIState.HIDDEN) {
        entry.component.update({
          heading: this.userHeading,
          bearing,
          distance,
          delta
        });
      }
    }

    // Apply state transitions
    if (updates.length > 0) {
      this.applyStateTransitions(updates);
    }
  }

  /**
   * Compute new state based on current state and delta (with hysteresis)
   * @param {string} currentState - Current UI state
   * @param {number} delta - Angular difference (0-180°)
   * @returns {string} New UI state
   */
  computeState(currentState, delta) {
    // Apply hysteresis based on current state
    switch (currentState) {
      case UIState.CENTER_LOCK:
        // Unlock only if delta exceeds exit threshold
        if (delta > Thresholds.CENTER_LOCK_EXIT) {
          return delta <= Thresholds.IN_FOV_ENTER ? UIState.IN_FOV : 
                 delta <= Thresholds.OFF_FOV_ENTER ? UIState.OFF_FOV : 
                 UIState.HIDDEN;
        }
        return UIState.CENTER_LOCK;

      case UIState.IN_FOV:
        // Check for center lock or exit to edge
        if (delta <= Thresholds.CENTER_LOCK_ENTER) {
          return UIState.CENTER_LOCK;
        }
        if (delta > Thresholds.IN_FOV_EXIT) {
          return delta <= Thresholds.OFF_FOV_ENTER ? UIState.OFF_FOV : UIState.HIDDEN;
        }
        return UIState.IN_FOV;

      case UIState.OFF_FOV:
        // Check for entering FOV or going behind
        if (delta <= Thresholds.IN_FOV_ENTER) {
          return delta <= Thresholds.CENTER_LOCK_ENTER ? UIState.CENTER_LOCK : UIState.IN_FOV;
        }
        if (delta > Thresholds.OFF_FOV_EXIT) {
          return UIState.HIDDEN;
        }
        return UIState.OFF_FOV;

      case UIState.HIDDEN:
      default:
        // Check for entering visible range
        if (delta <= Thresholds.CENTER_LOCK_ENTER) {
          return UIState.CENTER_LOCK;
        }
        if (delta <= Thresholds.IN_FOV_ENTER) {
          return UIState.IN_FOV;
        }
        if (delta <= Thresholds.OFF_FOV_ENTER) {
          return UIState.OFF_FOV;
        }
        return UIState.HIDDEN;
    }
  }

  /**
   * Apply state transitions (create/destroy components)
   * @param {Array} updates - Array of state change objects
   */
  applyStateTransitions(updates) {
    // Sort by priority: CENTER_LOCK > IN_FOV > OFF_FOV
    const priorityOrder = {
      [UIState.CENTER_LOCK]: 3,
      [UIState.IN_FOV]: 2,
      [UIState.OFF_FOV]: 1,
      [UIState.HIDDEN]: 0
    };

    updates.sort((a, b) => {
      const priorityDiff = priorityOrder[b.newState] - priorityOrder[a.newState];
      if (priorityDiff !== 0) return priorityDiff;
      
      // If same priority, sort by distance (nearest first)
      return a.distance - b.distance;
    });

    for (const update of updates) {
      this.transitionTo(update.poiId, update.newState);
    }

    console.log(`[UIStateManager] Applied ${updates.length} state transitions`);
  }

  /**
   * Transition a POI to a new state
   * @param {string} poiId - POI identifier
   * @param {string} newState - Target state
   */
  transitionTo(poiId, newState) {
    const entry = this.pois.get(poiId);
    if (!entry) return;

    const oldState = entry.state;

    // Destroy old component if transitioning away from visible state
    if (entry.component && newState === UIState.HIDDEN) {
      entry.component.hide();
      setTimeout(() => {
        if (entry.component) {
          entry.component.destroy();
          entry.component = null;
        }
      }, 200);
    }

    // Create new component if transitioning to visible state
    if (newState !== UIState.HIDDEN) {
      const tier = this.stateToTier(newState);
      
      // Destroy old component if tier changed
      if (entry.component && this.stateToTier(oldState) !== tier) {
        entry.component.hide();
        setTimeout(() => {
          if (entry.component) {
            entry.component.destroy();
            entry.component = null;
          }
          
          // Create new component
          this.createComponent(poiId, tier);
        }, 200);
      } else if (!entry.component) {
        // Create component if none exists
        this.createComponent(poiId, tier);
      }
    }

    console.log(`[UIStateManager] ${entry.poi.name}: ${oldState} → ${newState} (Δ=${entry.delta.toFixed(1)}°)`);
  }

  /**
   * Create a component for a POI
   * @param {string} poiId - POI identifier
   * @param {string} tier - Component tier ('center', 'side', 'edge')
   */
  createComponent(poiId, tier) {
    const entry = this.pois.get(poiId);
    if (!entry) return;

    // Import ComponentFactory (assumes it's loaded)
    if (typeof ComponentFactory === 'undefined') {
      console.error('[UIStateManager] ComponentFactory not loaded');
      return;
    }

    // Create component
    const component = ComponentFactory.create(tier, entry.poi, this.scene);
    entry.component = component;

    // Show component
    component.show();

    // Initial update
    component.update({
      heading: this.userHeading,
      bearing: entry.bearing,
      distance: entry.distance,
      delta: entry.delta
    });
  }

  /**
   * Convert state to component tier
   * @param {string} state - UI state
   * @returns {string} Component tier
   */
  stateToTier(state) {
    switch (state) {
      case UIState.CENTER_LOCK:
        return 'center';
      case UIState.IN_FOV:
        return 'side';
      case UIState.OFF_FOV:
        return 'edge';
      default:
        return null;
    }
  }

  /**
   * Calculate bearing from point A to point B
   * @param {number} lat1 - Start latitude
   * @param {number} lng1 - Start longitude
   * @param {number} lat2 - End latitude
   * @param {number} lng2 - End longitude
   * @returns {number} Bearing in degrees (0-359)
   */
  calculateBearing(lat1, lng1, lat2, lng2) {
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
   * Calculate distance between two points (Haversine formula)
   * @param {number} lat1 - Start latitude
   * @param {number} lng1 - Start longitude
   * @param {number} lat2 - End latitude
   * @param {number} lng2 - End longitude
   * @returns {number} Distance in meters
   */
  calculateDistance(lat1, lng1, lat2, lng2) {
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
   * @param {number} heading1 - First heading (0-359°)
   * @param {number} heading2 - Second heading (0-359°)
   * @returns {number} Angular difference (0-180°)
   */
  angularDifference(heading1, heading2) {
    let diff = Math.abs(heading1 - heading2);
    if (diff > 180) {
      diff = 360 - diff;
    }
    return diff;
  }

  /**
   * Get current state summary (for debugging)
   * @returns {Object} State summary
   */
  getStateSummary() {
    const summary = {
      total: this.pois.size,
      byState: {
        [UIState.HIDDEN]: 0,
        [UIState.OFF_FOV]: 0,
        [UIState.IN_FOV]: 0,
        [UIState.CENTER_LOCK]: 0
      },
      visible: []
    };

    for (const [poiId, entry] of this.pois) {
      summary.byState[entry.state]++;
      
      if (entry.state !== UIState.HIDDEN) {
        summary.visible.push({
          id: poiId,
          name: entry.poi.name,
          state: entry.state,
          delta: entry.delta.toFixed(1),
          distance: Math.round(entry.distance)
        });
      }
    }

    return summary;
  }

  /**
   * Cleanup all components
   */
  destroy() {
    for (const [poiId, entry] of this.pois) {
      if (entry.component) {
        entry.component.destroy();
      }
    }
    this.pois.clear();
    console.log('[UIStateManager] Destroyed');
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    UIState,
    Thresholds,
    UIStateManager
  };
}

