/*
 * Sightline Hologram Validation Demo
 * Implements "Ghost" Architecture, Holographic Shader, and Drag-to-Align
 */

// 1. HOLOGRAPHIC SHADER COMPONENT
AFRAME.registerComponent('hologram-material', {
  init: function () {
    const el = this.el;
    
    // Wait for mesh to load
    el.addEventListener('model-loaded', () => this.applyMaterial());
    // Or if it's a primitive, apply immediately (after a tick or check)
    if (el.getObject3D('mesh')) {
      this.applyMaterial();
    } else {
      el.addEventListener('loaded', () => this.applyMaterial());
    }
  },

  applyMaterial: function () {
    const mesh = this.el.getObject3D('mesh');
    if (!mesh) return;

    const material = new THREE.ShaderMaterial({
      uniforms: { 
         glowColor: { value: new THREE.Color(0x00aaff) },
         viewVector: { value: new THREE.Vector3() }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: `
        uniform vec3 glowColor;
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          // Fresnel effect
          vec3 viewDir = normalize(-vPosition);
          float intensity = pow(0.6 - dot(vNormal, viewDir), 2.0);
          
          // Additive glow
          gl_FragColor = vec4(glowColor, intensity * 1.5);
        }`,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false, // Important for "ghost" effects
      blending: THREE.AdditiveBlending // Makes it glow
    });

    mesh.traverse((node) => {
      if (node.isMesh) {
        node.material = material;
      }
    });
  }
});

// 2. COLOR WRITE FALSE (OCCLUSION) COMPONENT
AFRAME.registerComponent('color-write', {
  schema: { type: 'boolean', default: true },
  init: function () {
    const el = this.el;
    if (el.getObject3D('mesh')) {
      this.updateMaterial();
    } else {
      el.addEventListener('loaded', () => this.updateMaterial());
    }
  },
  updateMaterial: function () {
    const mesh = this.el.getObject3D('mesh');
    if (!mesh) return;
    
    const val = this.data; // 'false' means we turn OFF color write (invisible occluder)
    
    // We need a basic material that writes to depth but not color
    // If 'color-write' is false, it acts as a mask
    
    if (val === false) {
      const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
      material.colorWrite = false; // Do not draw pixels
      material.depthWrite = true;  // BUT block things behind me
      
      mesh.traverse((node) => {
        if (node.isMesh) {
          node.material = material;
          // Ensure render order is correct (render before hologram)
          node.renderOrder = -1; 
        }
      });
    }
  }
});

// 3. MAIN APP LOGIC
window.addEventListener('DOMContentLoaded', () => {
  console.log('Sightline Hologram Demo Init');
  
  // Setup state
  const state = {
    calibrating: true,
    locked: false,
    offset: { x: 0, y: 0, z: 0 },
    rotation: 0
  };
  
  // DOM Elements
  const ui = document.getElementById('calibration-ui');
  const touchPad = document.getElementById('touch-pad');
  const btnLock = document.getElementById('btn-lock');
  const infoOverlays = document.getElementById('info-overlays');
  const worldRoot = document.getElementById('world-root');
  const distVal = document.getElementById('dist-val');
  
  // Target Location (Example: Clock Tower TST)
  // 22.2946°N, 114.1699°E
  const TARGET_LAT = 22.2946;
  const TARGET_LNG = 114.1699;
  
  // Initialize GPS placement
  // We wait for camera-init event from ar.js
  const scene = document.querySelector('a-scene');
  
  // Create the wrapper that holds the GPS position
  const gpsWrapper = document.createElement('a-entity');
  gpsWrapper.setAttribute('gps-new-entity-place', {
    latitude: TARGET_LAT,
    longitude: TARGET_LNG
  });
  
  // Move worldRoot inside gpsWrapper
  // But wait, worldRoot is already in DOM.
  // Let's reparent it.
  worldRoot.parentNode.removeChild(worldRoot);
  gpsWrapper.appendChild(worldRoot);
  scene.appendChild(gpsWrapper);
  
  // Make it visible initially for testing (or wait for gps)
  worldRoot.setAttribute('visible', 'true');
  
  // --- DRAG INTERACTION ---
  let startX = 0;
  let startY = 0;
  let isDragging = false;
  
  touchPad.addEventListener('touchstart', (e) => {
    if (!state.calibrating) return;
    isDragging = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  });
  
  touchPad.addEventListener('touchmove', (e) => {
    if (!state.calibrating || !isDragging) return;
    e.preventDefault();
    
    const x = e.touches[0].clientX;
    const y = e.touches[0].clientY;
    
    const dx = (x - startX) * 0.1; // Sensitivity
    const dy = (y - startY) * 0.1;
    
    // Update offset
    // Moving on screen X translates to world X (roughly, relative to camera view)
    // Moving on screen Y translates to world Z (distance/forward-back) or Y (up/down)?
    // For "Align with real tower", usually we mean Azimuth (Left/Right) and maybe Altitude or Distance.
    // Let's map X to X (Left/Right) and Y to Z (Forward/Back) for positioning
    
    // Get current rotation of camera to align movement with view? 
    // Simplified: Just move in local X/Z of the object
    
    state.offset.x += dx;
    state.offset.z += dy; // Pulling down brings it closer?
    
    applyOffset();
    
    startX = x;
    startY = y;
  });
  
  touchPad.addEventListener('touchend', () => {
    isDragging = false;
  });
  
  // Buttons for Up/Down (Altitude)
  document.getElementById('btn-nudge-up').addEventListener('click', () => {
    state.offset.y += 1;
    applyOffset();
  });
  
  document.getElementById('btn-nudge-down').addEventListener('click', () => {
    state.offset.y -= 1;
    applyOffset();
  });
  
  function applyOffset() {
    if (!worldRoot) return;
    worldRoot.object3D.position.set(
      state.offset.x,
      state.offset.y,
      state.offset.z
    );
  }
  
  // --- LOCK LOGIC ---
  btnLock.addEventListener('click', () => {
    state.locked = true;
    state.calibrating = false;
    
    // Hide Calibration UI
    ui.style.display = 'none';
    
    // Show Info Overlays
    infoOverlays.style.display = 'block';
    
    // Optional: "Freeze" GPS updates? 
    // gps-new-camera continually updates camera position.
    // The object stays at its GPS coordinate.
    // If we want to rely "solely on IMU", we might want to stop updating camera position from GPS?
    // But usually we just want to stop the "jitter" of the object placement.
    // Since we are offsetting the object relative to its GPS anchor, the anchor might still jump if GPS jumps.
    // To fully "Lock", we might want to detach from GPS updates or dampen them significantly.
    // For this demo, the visual lock is the main goal.
  });
  
  // --- DISTANCE UPDATE ---
  setInterval(() => {
    // Calculate distance to target
    // Use AR.js helper or Haversine if available, or just distance from camera to object
    const camera = document.querySelector('[gps-new-camera]');
    if (camera && gpsWrapper.object3D) {
      const dist = camera.object3D.position.distanceTo(gpsWrapper.object3D.position);
      if (Number.isFinite(dist)) {
        distVal.textContent = Math.round(dist) + 'm';
      }
    }
  }, 500);
  
});

