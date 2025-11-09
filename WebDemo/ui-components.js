/**
 * Sightline WebAR UI V2 - Component Classes
 * 
 * Three-tier progressive disclosure system:
 * - CenterLockCard: Full details when user is aligned with POI (≤5°)
 * - SideChip: Compact hint for POIs in peripheral vision (5-30°)
 * - EdgeArrow: Off-screen indicator for POIs outside FOV (30-90°)
 */

/**
 * Base class for all UI components
 */
class UIComponent {
  constructor(poi, scene) {
    this.poi = poi;
    this.scene = scene;
    this.element = null;
    this.leaderLine = null;
    this.isVisible = false;
    this.lastDistance = null;
    this.lastPosition = { x: 0, y: 0 };
  }

  /**
   * Create the DOM element for this component
   * @abstract
   */
  render() {
    throw new Error('render() must be implemented by subclass');
  }

  /**
   * Update component position and content
   * @param {Object} state - Current state (heading, bearing, distance, delta)
   */
  update(state) {
    if (!this.element) return;
    
    // Only update text if distance changed significantly (≥10m)
    if (this.lastDistance === null || Math.abs(state.distance - this.lastDistance) >= 10) {
      this.updateDistance(state.distance);
      this.lastDistance = state.distance;
    }
    
    this.updatePosition(state);
  }

  /**
   * Update distance display
   * @param {number} distance - Distance in meters
   */
  updateDistance(distance) {
    // Override in subclasses
  }

  /**
   * Update component position
   * @param {Object} state - Current state
   */
  updatePosition(state) {
    // Override in subclasses
  }

  /**
   * Show component with animation
   */
  show() {
    if (this.isVisible) return;
    
    if (!this.element) {
      this.render();
    }
    
    this.element.classList.add('entering');
    this.element.classList.remove('exiting', 'hidden');
    this.isVisible = true;
    
    // Remove entering class after animation
    setTimeout(() => {
      if (this.element) {
        this.element.classList.remove('entering');
      }
    }, 200);
  }

  /**
   * Hide component with animation
   */
  hide() {
    if (!this.isVisible || !this.element) return;
    
    this.element.classList.add('exiting');
    this.element.classList.remove('entering');
    this.isVisible = false;
    
    // Hide after animation
    setTimeout(() => {
      if (this.element) {
        this.element.classList.add('hidden');
        this.element.classList.remove('exiting');
      }
    }, 150);
  }

  /**
   * Remove component from DOM
   */
  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    if (this.leaderLine && this.leaderLine.parentNode) {
      this.leaderLine.parentNode.removeChild(this.leaderLine);
    }
    this.element = null;
    this.leaderLine = null;
    this.isVisible = false;
  }

  /**
   * Format distance for display
   * @param {number} meters - Distance in meters
   * @returns {string} Formatted distance
   */
  formatDistance(meters) {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${Math.round(meters / 5) * 5} m`; // Round to nearest 5m
  }

  /**
   * Get category icon ID
   * @returns {string} Icon symbol ID
   */
  getCategoryIcon() {
    const category = this.poi.category || 'landmark';
    return `icon-${category}`;
  }

  /**
   * Create leader line (A-Frame entity)
   * @param {number} startX - Start X position (screen space)
   * @param {number} startY - Start Y position (screen space)
   * @param {number} endX - End X position (screen space)
   * @param {number} endY - End Y position (screen space)
   */
  createLeaderLine(startX, startY, endX, endY) {
    if (!this.scene) return;
    
    // Remove existing line
    if (this.leaderLine) {
      this.leaderLine.parentNode.removeChild(this.leaderLine);
    }
    
    // Create A-Frame line entity
    const line = document.createElement('a-entity');
    line.setAttribute('line', {
      start: { x: startX, y: startY, z: -2 },
      end: { x: endX, y: endY, z: -2 },
      color: '#222',
      opacity: 0.8
    });
    line.setAttribute('class', 'leader-line');
    
    this.scene.appendChild(line);
    this.leaderLine = line;
  }

  /**
   * Update leader line position
   * @param {number} startX - Start X position
   * @param {number} startY - Start Y position
   * @param {number} endX - End X position
   * @param {number} endY - End Y position
   */
  updateLeaderLine(startX, startY, endX, endY) {
    if (!this.leaderLine) {
      this.createLeaderLine(startX, startY, endX, endY);
      return;
    }
    
    this.leaderLine.setAttribute('line', {
      start: { x: startX, y: startY, z: -2 },
      end: { x: endX, y: endY, z: -2 },
      color: '#222',
      opacity: 0.8
    });
  }
}

/**
 * TIER 1: Center-Lock Card
 * Full details when user is directly facing POI (|delta| ≤ 5°)
 */
class CenterLockCard extends UIComponent {
  render() {
    const card = document.createElement('div');
    card.className = `center-lock-card category-${this.poi.category || 'landmark'} hidden`;
    
    card.innerHTML = `
      <div class="center-lock-card__header">
        <svg class="center-lock-card__icon" aria-hidden="true">
          <use href="#${this.getCategoryIcon()}"></use>
        </svg>
        <div class="center-lock-card__title-group">
          <h3 class="center-lock-card__title">${this.poi.name}</h3>
        </div>
        <button class="center-lock-card__save-btn" aria-label="Save ${this.poi.name} to favorites">
          <svg aria-hidden="true">
            <use href="#icon-star"></use>
          </svg>
        </button>
      </div>
      <p class="center-lock-card__context">${this.poi.description || 'Landmark'}</p>
      <div class="center-lock-card__footer">
        <span class="center-lock-card__distance">${this.formatDistance(this.poi.distance || 0)}</span>
      </div>
    `;
    
    // Add save button handler
    const saveBtn = card.querySelector('.center-lock-card__save-btn');
    saveBtn.addEventListener('click', () => this.onSave());
    
    document.body.appendChild(card);
    this.element = card;
    
    return card;
  }

  updateDistance(distance) {
    if (!this.element) return;
    const distanceEl = this.element.querySelector('.center-lock-card__distance');
    if (distanceEl) {
      distanceEl.textContent = this.formatDistance(distance);
    }
  }

  updatePosition(state) {
    // Center card stays centered, but we update leader line
    // Leader line points from card bottom to POI azimuth
    const cardRect = this.element.getBoundingClientRect();
    const startX = cardRect.left + cardRect.width / 2;
    const startY = cardRect.bottom;
    
    // Calculate end point based on bearing (screen-projected azimuth)
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // Project bearing to screen X position
    const bearingOffset = state.bearing - state.heading;
    const endX = screenWidth / 2 + (bearingOffset * 10); // Scale factor
    const endY = screenHeight * 0.7; // Point to lower screen area
    
    this.updateLeaderLine(startX, startY, endX, endY);
  }

  onSave() {
    console.log(`[CenterLockCard] Saved POI: ${this.poi.name}`);
    
    // Haptic feedback (if supported)
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    // Visual feedback
    const btn = this.element.querySelector('.center-lock-card__save-btn');
    btn.style.transform = 'scale(1.2)';
    setTimeout(() => {
      btn.style.transform = '';
    }, 200);
    
    // TODO: Persist to localStorage or backend
    const saved = JSON.parse(localStorage.getItem('sightline_saved_pois') || '[]');
    if (!saved.find(p => p.id === this.poi.id)) {
      saved.push({
        id: this.poi.id,
        name: this.poi.name,
        lat: this.poi.lat,
        lng: this.poi.lng,
        savedAt: new Date().toISOString()
      });
      localStorage.setItem('sightline_saved_pois', JSON.stringify(saved));
    }
  }

  show() {
    super.show();
    
    // Haptic feedback on center-lock (if supported)
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
  }
}

/**
 * TIER 2: Side Chip
 * Compact hint for POIs in peripheral vision (5° < |delta| ≤ 30°)
 */
class SideChip extends UIComponent {
  render() {
    const chip = document.createElement('div');
    chip.className = `side-chip category-${this.poi.category || 'landmark'} hidden`;
    
    chip.innerHTML = `
      <svg class="side-chip__icon" aria-hidden="true">
        <use href="#${this.getCategoryIcon()}"></use>
      </svg>
      <div class="side-chip__content">
        <p class="side-chip__name">${this.poi.name}</p>
        <p class="side-chip__distance">${this.formatDistance(this.poi.distance || 0)}</p>
      </div>
    `;
    
    // Add tap-to-center handler
    chip.addEventListener('click', () => this.onTap());
    
    // Add keyboard support
    chip.setAttribute('tabindex', '0');
    chip.setAttribute('role', 'button');
    chip.setAttribute('aria-label', `View ${this.poi.name}, ${this.formatDistance(this.poi.distance || 0)} away`);
    chip.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.onTap();
      }
    });
    
    document.body.appendChild(chip);
    this.element = chip;
    
    return chip;
  }

  updateDistance(distance) {
    if (!this.element) return;
    const distanceEl = this.element.querySelector('.side-chip__distance');
    if (distanceEl) {
      distanceEl.textContent = this.formatDistance(distance);
    }
  }

  updatePosition(state) {
    if (!this.element) return;
    
    // Position left or right based on bearing direction
    const isLeft = state.bearing < state.heading;
    const xPercent = isLeft ? 15 : 85;
    
    // Y position will be set by layout engine (collision avoidance)
    // For now, use a default
    const yPercent = 50;
    
    // Use transform for GPU acceleration
    this.element.style.left = `${xPercent}%`;
    this.element.style.top = `${yPercent}%`;
    this.element.style.transform = 'translate(-50%, -50%)';
    
    // Update side class for animation direction
    if (isLeft) {
      this.element.classList.remove('side-right');
      this.element.classList.add('side-left');
    } else {
      this.element.classList.remove('side-left');
      this.element.classList.add('side-right');
    }
    
    this.lastPosition = { x: xPercent, y: yPercent };
  }

  onTap() {
    console.log(`[SideChip] Tapped: ${this.poi.name}, rotating to center`);
    
    // Emit event for camera rotation
    const event = new CustomEvent('sightline:rotate-to-poi', {
      detail: {
        poiId: this.poi.id,
        bearing: this.poi.bearing
      }
    });
    window.dispatchEvent(event);
  }
}

/**
 * TIER 3: Edge Arrow
 * Off-screen indicator for POIs outside FOV (30° < |delta| ≤ 90°)
 */
class EdgeArrow extends UIComponent {
  render() {
    const arrow = document.createElement('div');
    arrow.className = 'edge-arrow hidden';
    
    // Determine direction (left or right)
    const isLeft = this.poi.bearing < (this.poi.heading || 0);
    const chevronIcon = isLeft ? 'icon-chevron-left' : 'icon-chevron-right';
    
    // Truncate name if too long
    const displayName = this.poi.name.length > 8 
      ? this.poi.name.substring(0, 8) + '…' 
      : this.poi.name;
    
    arrow.innerHTML = `
      <svg class="edge-arrow__chevron" aria-hidden="true">
        <use href="#${chevronIcon}"></use>
      </svg>
      <p class="edge-arrow__text">${displayName} ${this.formatDistance(this.poi.distance || 0)}</p>
    `;
    
    // Add tap-to-turn handler
    arrow.addEventListener('click', () => this.onTap());
    
    // Add keyboard support
    arrow.setAttribute('tabindex', '0');
    arrow.setAttribute('role', 'button');
    arrow.setAttribute('aria-label', `Turn to ${this.poi.name}, ${this.formatDistance(this.poi.distance || 0)} away`);
    arrow.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.onTap();
      }
    });
    
    document.body.appendChild(arrow);
    this.element = arrow;
    
    return arrow;
  }

  updateDistance(distance) {
    if (!this.element) return;
    const textEl = this.element.querySelector('.edge-arrow__text');
    if (textEl) {
      const displayName = this.poi.name.length > 8 
        ? this.poi.name.substring(0, 8) + '…' 
        : this.poi.name;
      textEl.textContent = `${displayName} ${this.formatDistance(distance)}`;
    }
  }

  updatePosition(state) {
    if (!this.element) return;
    
    // Position at screen edge (left or right)
    const isLeft = state.bearing < state.heading;
    
    if (isLeft) {
      this.element.style.left = '16px';
      this.element.style.right = 'auto';
    } else {
      this.element.style.right = '16px';
      this.element.style.left = 'auto';
    }
    
    // Vertically centered
    this.element.style.top = '50%';
    this.element.style.transform = 'translateY(-50%)';
    
    // Update chevron icon
    const chevronIcon = isLeft ? 'icon-chevron-left' : 'icon-chevron-right';
    const chevronEl = this.element.querySelector('.edge-arrow__chevron use');
    if (chevronEl) {
      chevronEl.setAttribute('href', `#${chevronIcon}`);
    }
  }

  onTap() {
    console.log(`[EdgeArrow] Tapped: ${this.poi.name}, rotating to view`);
    
    // Emit event for camera rotation
    const event = new CustomEvent('sightline:rotate-to-poi', {
      detail: {
        poiId: this.poi.id,
        bearing: this.poi.bearing
      }
    });
    window.dispatchEvent(event);
  }
}

/**
 * Component Factory
 * Creates the appropriate component type based on state
 */
class ComponentFactory {
  /**
   * Create a component for a POI based on its state
   * @param {string} tier - Component tier ('center', 'side', 'edge')
   * @param {Object} poi - POI data
   * @param {Object} scene - A-Frame scene element
   * @returns {UIComponent} Component instance
   */
  static create(tier, poi, scene) {
    switch (tier) {
      case 'center':
        return new CenterLockCard(poi, scene);
      case 'side':
        return new SideChip(poi, scene);
      case 'edge':
        return new EdgeArrow(poi, scene);
      default:
        throw new Error(`Unknown component tier: ${tier}`);
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    UIComponent,
    CenterLockCard,
    SideChip,
    EdgeArrow,
    ComponentFactory
  };
}

