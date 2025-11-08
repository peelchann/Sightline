/**
 * Sightline WebAR - Label Layout Engine
 * Prevents overlapping AR labels and manages visibility priority
 */

const LabelLayoutEngine = {
  // ============================================================================
  // CONFIG
  // ============================================================================
  
  maxVisibleLabels: 5,
  collisionPadding: 0.1, // 10cm padding between labels in 3D space
  verticalOffsets: [0, 0.2, -0.2, 0.4, -0.4, 0.6, -0.6], // Try these Y offsets
  
  // State
  visibleLabels: [],
  placedBoxes: [],
  
  // ============================================================================
  // MAIN LAYOUT FUNCTION
  // ============================================================================
  
  run(pois, userPos, userHeading, poiEntities) {
    if (!userPos || !poiEntities) return [];
    
    // Reset state
    this.visibleLabels = [];
    this.placedBoxes = [];
    
    // 1. Compute metadata for all POIs
    const candidates = pois.map(poi => {
      const bearing = this.calculateBearing(userPos.lat, userPos.lng, poi.lat, poi.lng);
      const distance = this.calculateDistance(userPos.lat, userPos.lng, poi.lat, poi.lng);
      
      // Angular difference (wrap-aware)
      let delta = (bearing - userHeading + 360) % 360;
      if (delta > 180) delta -= 360;
      
      const inFOV = Math.abs(delta) <= 40; // 80° total FOV
      const centered = Math.abs(delta) <= 5;
      
      return {
        poi,
        bearing,
        distance,
        delta,
        inFOV,
        centered,
        entity: poiEntities.get(poi.id)
      };
    }).filter(c => c.inFOV && c.entity); // Only in-FOV with valid entities
    
    // 2. Sort by priority: centered first, then by distance (closer = higher priority)
    candidates.sort((a, b) => {
      if (a.centered !== b.centered) return b.centered - a.centered; // Centered first
      return a.distance - b.distance; // Then by distance (closer first)
    });
    
    // 3. Place labels with collision detection
    for (const candidate of candidates) {
      if (this.visibleLabels.length >= this.maxVisibleLabels) {
        // Hide remaining labels
        candidate.entity.setAttribute('visible', false);
        continue;
      }
      
      // Try to place this label
      const placed = this.tryPlaceLabel(candidate);
      
      if (placed) {
        this.visibleLabels.push(candidate);
      } else {
        // Could not place without collision
        candidate.entity.setAttribute('visible', false);
      }
    }
    
    // 4. Hide POIs that are out of FOV
    pois.forEach(poi => {
      const entity = poiEntities.get(poi.id);
      if (!entity) return;
      
      const isInCandidates = candidates.some(c => c.poi.id === poi.id);
      if (!isInCandidates) {
        entity.setAttribute('visible', false);
      }
    });
    
    return this.visibleLabels;
  },
  
  // ============================================================================
  // LABEL PLACEMENT
  // ============================================================================
  
  tryPlaceLabel(candidate) {
    const entity = candidate.entity;
    const basePos = this.computeBasePosition(candidate);
    
    // Try base position first, then vertical offsets
    for (const yOffset of this.verticalOffsets) {
      const testPos = {
        x: basePos.x,
        y: basePos.y + yOffset,
        z: basePos.z
      };
      
      const testBox = this.createBoundingBox(testPos);
      
      // Check collision with already-placed labels
      if (!this.overlapsAny(testBox)) {
        // No collision! Place it here
        entity.setAttribute('position', `${testPos.x} ${testPos.y} ${testPos.z}`);
        entity.setAttribute('visible', true);
        
        // Add zone class for styling
        const zone = this.getZone(candidate.delta);
        entity.setAttribute('class', `poi-card zone-${zone}`);
        
        // Store bounding box
        this.placedBoxes.push(testBox);
        
        return true;
      }
    }
    
    // Could not place without collision
    return false;
  },
  
  // ============================================================================
  // POSITION COMPUTATION
  // ============================================================================
  
  computeBasePosition(candidate) {
    const { delta, distance, centered } = candidate;
    
    let x, y, z;
    
    if (centered) {
      // Center-lock: directly ahead
      x = 0;
      y = 1.6; // Eye level
      z = -3; // 3m ahead
    } else if (delta < -30) {
      // Far left edge
      x = -5;
      y = 1.6;
      z = -2;
    } else if (delta < -5) {
      // Left side (sliding in)
      x = -2;
      y = 1.6;
      z = -3;
    } else if (delta > 30) {
      // Far right edge
      x = 5;
      y = 1.6;
      z = -2;
    } else {
      // Right side (sliding in)
      x = 2;
      y = 1.6;
      z = -3;
    }
    
    // Adjust for far-field POIs (skyline anchors)
    if (distance > 300) {
      y = 2.5; // Elevated skyline
      z = -5; // Further back
    }
    
    return { x, y, z };
  },
  
  getZone(delta) {
    if (Math.abs(delta) <= 5) return 'center';
    if (delta < -30) return 'left-far';
    if (delta < -5) return 'left-near';
    if (delta > 30) return 'right-far';
    return 'right-near';
  },
  
  // ============================================================================
  // COLLISION DETECTION
  // ============================================================================
  
  createBoundingBox(pos) {
    // Simplified 3D bounding box (axis-aligned)
    return {
      x: pos.x - 0.5, // Label width ~1m
      y: pos.y - 0.3, // Label height ~0.6m
      z: pos.z - 0.1,
      width: 1.0,
      height: 0.6,
      depth: 0.2
    };
  },
  
  overlapsAny(box) {
    return this.placedBoxes.some(other => this.boxesOverlap(box, other));
  },
  
  boxesOverlap(a, b) {
    // 3D AABB collision detection
    const xOverlap = !(
      a.x + a.width + this.collisionPadding < b.x ||
      b.x + b.width + this.collisionPadding < a.x
    );
    
    const yOverlap = !(
      a.y + a.height + this.collisionPadding < b.y ||
      b.y + b.height + this.collisionPadding < a.y
    );
    
    const zOverlap = !(
      a.z + a.depth + this.collisionPadding < b.z ||
      b.z + b.depth + this.collisionPadding < a.z
    );
    
    return xOverlap && yOverlap && zOverlap;
  },
  
  // ============================================================================
  // GEOMETRY HELPERS
  // ============================================================================
  
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371000; // Earth radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;
    
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c; // meters
  },
  
  calculateBearing(lat1, lng1, lat2, lng2) {
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;
    
    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) -
              Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    
    const θ = Math.atan2(y, x);
    const bearing = (θ * 180 / Math.PI + 360) % 360;
    
    return bearing;
  }
};

// Export for use in app.js
if (typeof window !== 'undefined') {
  window.LabelLayoutEngine = LabelLayoutEngine;
}

