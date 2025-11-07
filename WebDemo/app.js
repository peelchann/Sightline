// Sightline WebAR - Application Logic
// GPS-based AR for Hong Kong landmarks

// Configuration
const CONFIG = {
  MAX_DISTANCE: 150, // meters - don't show POIs beyond this
  UPDATE_INTERVAL: 1000, // ms - update distance text
  GPS_TIMEOUT: 27000, // ms - GPS timeout
  NEARBY_THRESHOLD: 50, // meters - "nearby" distance
};

// POI Data
const POIS = [
  {
    id: 'clock-tower',
    name: 'Clock Tower',
    lat: 22.2946,
    lng: 114.1699,
    year: 1915,
    description: 'Former Kowloon-Canton Railway terminus'
  },
  {
    id: 'star-ferry',
    name: 'Star Ferry',
    lat: 22.2800,
    lng: 114.1587,
    year: 1888,
    description: 'Iconic ferry service since 1888'
  },
  {
    id: 'avenue-stars',
    name: 'Avenue of Stars',
    lat: 22.2930,
    lng: 114.1730,
    year: 2004,
    description: 'Tribute to HK film industry'
  }
];

// State
let userPosition = null;
let arReady = false;
let nearbyPOICount = 0;

// DOM Elements
const loadingOverlay = document.getElementById('loading-overlay');
const loadingStatus = document.getElementById('loading-status');
const gpsAccuracy = document.getElementById('gps-accuracy');
const gpsCoords = document.getElementById('gps-coords');
const instructions = document.getElementById('instructions');
const closeInstructionsBtn = document.getElementById('close-instructions');
const poiCounter = document.getElementById('poi-counter');
const poiCountElement = document.getElementById('poi-count');

// Initialize
window.addEventListener('DOMContentLoaded', init);

function init() {
  console.log('🚀 Sightline WebAR initializing...');
  
  // Check browser support
  if (!checkBrowserSupport()) {
    showError('Your browser does not support WebAR. Please use Safari on iOS or Chrome on Android.');
    return;
  }
  
  // Set up event listeners
  setupEventListeners();
  
  // Request permissions
  requestPermissions();
}

// Check browser support
function checkBrowserSupport() {
  const hasGeolocation = 'geolocation' in navigator;
  const hasGetUserMedia = 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;
  const hasDeviceOrientation = 'DeviceOrientationEvent' in window;
  
  console.log('Browser support check:', {
    geolocation: hasGeolocation,
    camera: hasGetUserMedia,
    orientation: hasDeviceOrientation
  });
  
  return hasGeolocation && hasGetUserMedia;
}

// Request device permissions
async function requestPermissions() {
  try {
    updateLoadingStatus('Requesting camera access...');
    
    // Request camera
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: 'environment' } 
    });
    stream.getTracks().forEach(track => track.stop()); // Stop preview
    
    console.log('✅ Camera permission granted');
    updateLoadingStatus('Camera ready');
    
    // iOS requires motion permission
    if (typeof DeviceOrientationEvent !== 'undefined' && 
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      updateLoadingStatus('Requesting motion access...');
      const response = await DeviceOrientationEvent.requestPermission();
      if (response !== 'granted') {
        throw new Error('Motion permission denied');
      }
      console.log('✅ Motion permission granted');
    }
    
    updateLoadingStatus('Starting GPS...');
    
  } catch (error) {
    console.error('❌ Permission error:', error);
    showError('Camera or motion access denied. Please enable in browser settings.');
  }
}

// Set up event listeners
function setupEventListeners() {
  // AR.js ready event
  window.addEventListener('arjs-gps-camera-ready', onARReady);
  
  // GPS update event
  window.addEventListener('gps-camera-update-position', onGPSUpdate);
  
  // GPS error event
  window.addEventListener('gps-camera-error', onGPSError);
  
  // Close instructions
  closeInstructionsBtn.addEventListener('click', () => {
    instructions.classList.add('hidden');
  });
  
  // A-Frame scene loaded
  const scene = document.querySelector('a-scene');
  if (scene) {
    scene.addEventListener('loaded', () => {
      console.log('A-Frame scene loaded');
    });
  }
  
  // Start distance update interval
  setInterval(updateDistances, CONFIG.UPDATE_INTERVAL);
}

// AR ready handler
function onARReady() {
  console.log('✅ AR Camera Ready');
  arReady = true;
  updateLoadingStatus('AR initialized!');
  
  setTimeout(() => {
    loadingOverlay.classList.add('hidden');
    showSuccess('AR Ready! Point at landmarks to discover.');
  }, 500);
}

// GPS update handler
function onGPSUpdate(event) {
  const { position, accuracy } = event.detail;
  
  userPosition = {
    lat: position.latitude,
    lng: position.longitude,
    accuracy: accuracy
  };
  
  // Update GPS info display
  gpsAccuracy.innerHTML = `GPS: ±${accuracy.toFixed(1)}m`;
  gpsCoords.innerHTML = `Lat: ${position.latitude.toFixed(5)}, Lng: ${position.longitude.toFixed(5)}`;
  
  // Change color based on accuracy
  if (accuracy < 20) {
    gpsAccuracy.style.color = '#4ADE80'; // Green - good
  } else if (accuracy < 50) {
    gpsAccuracy.style.color = '#FBBF24'; // Yellow - okay
  } else {
    gpsAccuracy.style.color = '#EF4444'; // Red - poor
  }
  
  // Update nearby POI count
  updateNearbyPOICount();
  
  console.log(`📍 GPS Update: ${position.latitude.toFixed(5)}, ${position.longitude.toFixed(5)} (±${accuracy.toFixed(1)}m)`);
}

// GPS error handler
function onGPSError(event) {
  console.error('❌ GPS Error:', event.detail);
  
  let message = 'GPS error: ';
  switch (event.detail.code) {
    case 1:
      message += 'Permission denied. Please enable location access.';
      break;
    case 2:
      message += 'Position unavailable. Check your GPS signal.';
      break;
    case 3:
      message += 'Timeout. Make sure you have a clear view of the sky.';
      break;
    default:
      message += event.detail.message || 'Unknown error';
  }
  
  showError(message);
  gpsAccuracy.innerHTML = 'GPS: Error';
  gpsAccuracy.style.color = '#EF4444';
}

// Calculate distance between two GPS coordinates (Haversine formula)
function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000; // Earth radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lng2 - lng1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
  return R * c; // Distance in meters
}

// Update distances for all POIs
function updateDistances() {
  if (!userPosition) return;
  
  POIS.forEach(poi => {
    const distance = haversineDistance(
      userPosition.lat, 
      userPosition.lng, 
      poi.lat, 
      poi.lng
    );
    
    // Find the distance text element for this POI
    const entity = document.getElementById(`poi-${poi.id}`);
    if (entity) {
      const distanceText = entity.querySelector('.distance-text');
      if (distanceText) {
        if (distance < 1000) {
          distanceText.setAttribute('value', `Distance: ${Math.round(distance)}m`);
        } else {
          distanceText.setAttribute('value', `Distance: ${(distance / 1000).toFixed(1)}km`);
        }
        
        // Add direction indicator
        if (distance < CONFIG.NEARBY_THRESHOLD) {
          distanceText.setAttribute('value', 
            `🎯 ${Math.round(distance)}m - You're here!`);
          distanceText.setAttribute('color', '#4ADE80');
        } else {
          distanceText.setAttribute('color', '#888888');
        }
      }
    }
  });
}

// Update nearby POI count
function updateNearbyPOICount() {
  if (!userPosition) return;
  
  let count = 0;
  POIS.forEach(poi => {
    const distance = haversineDistance(
      userPosition.lat, 
      userPosition.lng, 
      poi.lat, 
      poi.lng
    );
    if (distance <= CONFIG.MAX_DISTANCE) {
      count++;
    }
  });
  
  if (count !== nearbyPOICount) {
    nearbyPOICount = count;
    poiCountElement.textContent = count;
    
    // Animate counter
    poiCountElement.style.transform = 'scale(1.3)';
    setTimeout(() => {
      poiCountElement.style.transform = 'scale(1)';
    }, 200);
  }
}

// Update loading status
function updateLoadingStatus(message) {
  loadingStatus.textContent = message;
  console.log(`📱 ${message}`);
}

// Show error message
function showError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;
  document.body.appendChild(errorDiv);
  
  console.error('❌', message);
  
  setTimeout(() => {
    errorDiv.style.opacity = '0';
    setTimeout(() => errorDiv.remove(), 300);
  }, 5000);
}

// Show success message
function showSuccess(message) {
  const successDiv = document.createElement('div');
  successDiv.className = 'success-message';
  successDiv.textContent = message;
  document.body.appendChild(successDiv);
  
  console.log('✅', message);
  
  setTimeout(() => {
    successDiv.style.opacity = '0';
    setTimeout(() => successDiv.remove(), 300);
  }, 3000);
}

// Debug: Log device info
console.log('Device Info:', {
  userAgent: navigator.userAgent,
  platform: navigator.platform,
  language: navigator.language,
  online: navigator.onLine,
  cookieEnabled: navigator.cookieEnabled
});

// Debug: Test GPS
navigator.geolocation.getCurrentPosition(
  (position) => {
    console.log('✅ GPS Test successful:', {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      accuracy: position.coords.accuracy
    });
  },
  (error) => {
    console.error('❌ GPS Test failed:', error);
  },
  { 
    enableHighAccuracy: true, 
    timeout: CONFIG.GPS_TIMEOUT,
    maximumAge: 0 
  }
);

// Export for debugging in console
window.SightlineAR = {
  CONFIG,
  POIS,
  getUserPosition: () => userPosition,
  isARReady: () => arReady,
  getNearbyPOICount: () => nearbyPOICount,
  testDistance: (lat, lng) => {
    if (!userPosition) {
      console.log('User position not available yet');
      return;
    }
    const dist = haversineDistance(userPosition.lat, userPosition.lng, lat, lng);
    console.log(`Distance: ${dist.toFixed(1)}m (${(dist/1000).toFixed(2)}km)`);
    return dist;
  }
};

console.log('💡 Debug tools available: window.SightlineAR');

