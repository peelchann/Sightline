/**
 * Sightline WebAR UI V2 - Layout Engine
 * 
 * Handles collision detection and label positioning to prevent overlaps.
 * Uses a greedy, priority-based algorithm with 2D AABB collision detection.
 * 
 * Constraints:
 * - Max 1 center card
 * - Max 2 side chips
 * - Max 3 edge arrows
 * - No overlapping labels
 */

/**
 * Layout slot for positioning components
 */
class LayoutSlot {
  constructor(x, y, width, height, priority, component) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.priority = priority;
    this.component = component;
    this.placed = false;
  }

  /**
   * Get bounding box for collision detection
   * @returns {Object} AABB {left, right, top, bottom}
   */
  getBounds() {
    return {
      left: this.x,
      right: this.x + this.width,
      top: this.y,
      bottom: this.y + this.height
    };
  }

  /**
   * Check collision with another slot
   * @param {LayoutSlot} other - Other slot
   * @returns {boolean} True if colliding
   */
  collidesWith(other) {
    const a = this.getBounds();
    const b = other.getBounds();
    
    return !(a.right < b.left || 
             a.left > b.right || 
             a.bottom < b.top || 
             a.top > b.bottom);
  }

  /**
   * Try vertical nudge to resolve collision
   * @param {Array<LayoutSlot>} placedSlots - Already placed slots
   * @param {number} maxAttempts - Max nudge attempts
   * @returns {boolean} True if nudge successful
   */
  tryNudge(placedSlots, maxAttempts = 3) {
    const nudgeStep = 8; // 8px increments
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      // Try nudging up
      const originalY = this.y;
      this.y = originalY - (nudgeStep * attempt);
      
      if (!this.collidesWithAny(placedSlots)) {
        return true;
      }
      
      // Try nudging down
      this.y = originalY + (nudgeStep * attempt);
      
      if (!this.collidesWithAny(placedSlots)) {
        return true;
      }
      
      // Reset for next attempt
      this.y = originalY;
    }
    
    return false;
  }

  /**
   * Check collision with any placed slot
   * @param {Array<LayoutSlot>} placedSlots - Already placed slots
   * @returns {boolean} True if colliding with any
   */
  collidesWithAny(placedSlots) {
    return placedSlots.some(slot => this.collidesWith(slot));
  }
}

/**
 * UI Layout Engine
 * Manages component positioning and collision avoidance
 */
class UILayoutEngine {
  constructor() {
    this.placedSlots = [];
    this.visibleLabels = [];
    
    // Component dimensions (from CSS)
    this.dimensions = {
      center: { width: 280, height: 160 },
      side: { width: 120, height: 48 },
      edge: { width: 80, height: 32 }
    };
    
    // Max visible per tier
    this.limits = {
      center: 1,
      side: 2,
      edge: 3
    };
    
    // Performance tracking
    this.lastLayoutUpdate = 0;
    this.layoutUpdateInterval = 500; // Update layout every 500ms (2 FPS)
  }

  /**
   * Compute layout for all visible components
   * @param {Map} pois - POI map from UIStateManager
   * @returns {Array} Array of layout results
   */
  computeLayout(pois) {
    // Throttle layout updates for performance
    const now = Date.now();
    if (now - this.lastLayoutUpdate < this.layoutUpdateInterval) {
      return this.visibleLabels;
    }
    this.lastLayoutUpdate = now;

    // Reset
    this.placedSlots = [];
    this.visibleLabels = [];

    // Collect candidates by tier
    const candidates = {
      center: [],
      side: [],
      edge: []
    };

    for (const [poiId, entry] of pois) {
      if (entry.state === 'hidden' || !entry.component) continue;

      const tier = this.stateToTier(entry.state);
      if (!tier) continue;

      candidates[tier].push({
        poiId,
        entry,
        tier,
        priority: this.calculatePriority(entry)
      });
    }

    // Sort each tier by priority (highest first)
    for (const tier in candidates) {
      candidates[tier].sort((a, b) => b.priority - a.priority);
    }

    // Apply limits
    candidates.center = candidates.center.slice(0, this.limits.center);
    candidates.side = candidates.side.slice(0, this.limits.side);
    candidates.edge = candidates.edge.slice(0, this.limits.edge);

    // Place components (priority order: center > side > edge)
    const allCandidates = [
      ...candidates.center,
      ...candidates.side,
      ...candidates.edge
    ];

    for (const candidate of allCandidates) {
      this.placeComponent(candidate);
    }

    console.log(`[UILayoutEngine] Placed ${this.placedSlots.length} labels (${candidates.center.length} center, ${candidates.side.length} side, ${candidates.edge.length} edge)`);

    return this.visibleLabels;
  }

  /**
   * Place a component on screen
   * @param {Object} candidate - Candidate object {poiId, entry, tier, priority}
   */
  placeComponent(candidate) {
    const { entry, tier } = candidate;
    const component = entry.component;
    
    if (!component || !component.element) return;

    // Get component dimensions
    const dims = this.dimensions[tier];
    
    // Get desired position from component
    const rect = component.element.getBoundingClientRect();
    
    // Create layout slot
    const slot = new LayoutSlot(
      rect.left,
      rect.top,
      dims.width,
      dims.height,
      candidate.priority,
      component
    );

    // Check collision with placed slots
    if (slot.collidesWithAny(this.placedSlots)) {
      // Try nudging
      if (!slot.tryNudge(this.placedSlots)) {
        // Can't place, hide component
        console.log(`[UILayoutEngine] Collision: hiding ${entry.poi.name}`);
        component.hide();
        return;
      }
    }

    // Place successful
    slot.placed = true;
    this.placedSlots.push(slot);
    this.visibleLabels.push({
      poiId: candidate.poiId,
      name: entry.poi.name,
      tier,
      position: { x: slot.x, y: slot.y }
    });

    // Apply nudged position if changed
    if (slot.y !== rect.top) {
      component.element.style.top = `${slot.y}px`;
    }

    // Ensure component is visible
    if (!component.isVisible) {
      component.show();
    }
  }

  /**
   * Calculate priority for a POI
   * @param {Object} entry - POI entry from UIStateManager
   * @returns {number} Priority score (higher = more important)
   */
  calculatePriority(entry) {
    let priority = 0;

    // State priority (center > side > edge)
    switch (entry.state) {
      case 'center_lock':
        priority += 1000;
        break;
      case 'in_fov':
        priority += 500;
        break;
      case 'off_fov':
        priority += 100;
        break;
    }

    // Distance priority (nearer = higher)
    // Inverse distance, capped at 1000m
    const distancePriority = 1000 - Math.min(entry.distance, 1000);
    priority += distancePriority;

    // Delta priority (more centered = higher)
    const deltaPriority = 180 - entry.delta;
    priority += deltaPriority;

    return priority;
  }

  /**
   * Convert state to tier
   * @param {string} state - UI state
   * @returns {string} Tier ('center', 'side', 'edge')
   */
  stateToTier(state) {
    switch (state) {
      case 'center_lock':
        return 'center';
      case 'in_fov':
        return 'side';
      case 'off_fov':
        return 'edge';
      default:
        return null;
    }
  }

  /**
   * Get layout summary (for debugging)
   * @returns {Object} Layout summary
   */
  getLayoutSummary() {
    return {
      placed: this.placedSlots.length,
      visible: this.visibleLabels.length,
      byTier: {
        center: this.visibleLabels.filter(l => l.tier === 'center').length,
        side: this.visibleLabels.filter(l => l.tier === 'side').length,
        edge: this.visibleLabels.filter(l => l.tier === 'edge').length
      },
      labels: this.visibleLabels.map(l => ({
        name: l.name,
        tier: l.tier,
        x: Math.round(l.position.x),
        y: Math.round(l.position.y)
      }))
    };
  }

  /**
   * Visualize collision boxes (debug mode)
   * @param {boolean} enabled - Enable visualization
   */
  visualizeCollisions(enabled) {
    // Remove existing debug boxes
    document.querySelectorAll('.debug-collision-box').forEach(el => el.remove());

    if (!enabled) return;

    // Draw collision boxes for each placed slot
    for (const slot of this.placedSlots) {
      const box = document.createElement('div');
      box.className = 'debug-collision-box';
      box.style.cssText = `
        position: fixed;
        left: ${slot.x}px;
        top: ${slot.y}px;
        width: ${slot.width}px;
        height: ${slot.height}px;
        border: 2px solid red;
        background: rgba(255, 0, 0, 0.1);
        pointer-events: none;
        z-index: 9999;
      `;
      document.body.appendChild(box);
    }
  }

  /**
   * Reset layout engine
   */
  reset() {
    this.placedSlots = [];
    this.visibleLabels = [];
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    LayoutSlot,
    UILayoutEngine
  };
}

