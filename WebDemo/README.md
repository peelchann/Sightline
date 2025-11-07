# Sightline WebAR Demo

GPS-based augmented reality for Hong Kong landmarks. Works on iPhone Safari and Android Chrome - **no app installation required!**

## 🎯 Features

- **Zero Install**: Just visit URL in mobile browser
- **3 POIs**: Clock Tower, Star Ferry, Avenue of Stars
- **GPS Tracking**: Real-time position updates
- **Distance Display**: See how far you are from landmarks
- **Outdoor Optimized**: High-contrast UI for sunlight readability
- **Works on iPhone**: Safari iOS 13+ supported

## 🚀 Quick Start

### Option 1: Local Testing (Development)

1. **Install Python** (if not already installed)

2. **Navigate to WebDemo folder**:
   ```bash
   cd WebDemo
   ```

3. **Start local server**:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Or Python 2
   python -m SimpleHTTPServer 8000
   ```

4. **Open on your phone**:
   - Find your computer's local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
   - Visit: `http://YOUR_IP:8000` (e.g., `http://192.168.1.100:8000`)
   - **Note**: For iOS, you'll need HTTPS (use ngrok or deploy to Vercel)

### Option 2: Deploy to Vercel (Production)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   cd WebDemo
   vercel --prod
   ```

3. **Get URL**: Vercel provides HTTPS URL (works on iOS!)

### Option 3: Test with Simulated GPS

For testing without going to actual locations, modify `index.html`:

```html
<!-- Add to <a-camera> element -->
<a-camera 
  gps-camera="minDistance: 5; 
              maxDistance: 150;
              simulateLatitude: 22.2946;
              simulateLongitude: 114.1699;">
</a-camera>
```

This simulates being at Clock Tower location.

## 📍 POI Locations

| POI | Latitude | Longitude | Best Access |
|-----|----------|-----------|-------------|
| **Clock Tower** | 22.2946°N | 114.1699°E | Tsim Sha Tsui Promenade |
| **Star Ferry** | 22.2800°N | 114.1587°E | Star Ferry Pier (Tsim Sha Tsui) |
| **Avenue of Stars** | 22.2930°N | 114.1730°E | Tsim Sha Tsui Waterfront |

**Tip**: All 3 locations are within 500m of each other along the Tsim Sha Tsui waterfront!

## 🧪 Testing Checklist

### Before Field Testing

- [ ] Check browser compatibility (Safari iOS 13+ or Chrome Android)
- [ ] Grant camera permission when prompted
- [ ] Grant location permission when prompted
- [ ] Verify GPS accuracy <50m (shown in top-left)
- [ ] See "AR Ready!" message

### At Location

- [ ] Open URL on phone
- [ ] Walk to within 150m of a POI
- [ ] AR card should appear in camera view
- [ ] Distance updates as you move
- [ ] Card remains anchored to location

### Expected Behavior

**Good GPS (±5-20m):**
- AR cards appear accurately positioned
- Distance updates smoothly
- Stable tracking

**Poor GPS (±50m+):**
- AR cards may drift
- Position updates slower
- Try moving to open area

## 🔧 Configuration

Edit `app.js` to customize:

```javascript
const CONFIG = {
  MAX_DISTANCE: 150,    // Don't show POIs beyond this (meters)
  UPDATE_INTERVAL: 1000, // Update distance every 1 second
  GPS_TIMEOUT: 27000,    // GPS timeout (27 seconds)
  NEARBY_THRESHOLD: 50,  // "Nearby" distance (meters)
};
```

## 📱 Troubleshooting

### AR not starting
- **Check HTTPS**: iOS requires HTTPS for camera/GPS
- **Grant permissions**: Camera + Location must be allowed
- **Restart browser**: Sometimes helps on iOS
- **Check GPS signal**: Go outside with clear sky view

### GPS inaccurate
- **Move to open area**: Tall buildings block GPS
- **Wait 30 seconds**: GPS needs time to lock
- **Enable High Accuracy**: Check phone location settings
- **Check accuracy indicator**: Top-left shows ±Xm

### AR cards not appearing
- **Check distance**: Must be within 150m of POI
- **Check console**: Open Safari/Chrome DevTools
- **Verify POI coordinates**: Use Google Maps to confirm
- **Test with simulated GPS**: Add `simulateLatitude/Longitude`

### Camera feed black
- **Check permission**: Camera access must be granted
- **Close other apps**: Another app may be using camera
- **Try different browser**: Test Safari vs Chrome
- **Restart phone**: Sometimes necessary on iOS

## 🛠️ Development

### File Structure

```
WebDemo/
├── index.html          # Main AR application
├── styles.css          # UI styling (outdoor-optimized)
├── app.js              # JavaScript logic
└── README.md           # This file
```

### Key Libraries

- **A-Frame 1.4.0**: VR/AR framework
- **AR.js**: GPS-based AR SDK
- **Three.js**: 3D engine (included in A-Frame)

### Adding New POIs

Edit `index.html` and `app.js`:

1. **Add HTML entity** in `index.html`:
```html
<a-entity 
  class="poi-entity"
  id="poi-your-poi-id"
  gps-entity-place="latitude: YOUR_LAT; longitude: YOUR_LNG">
  <!-- AR card content -->
</a-entity>
```

2. **Add to POIS array** in `app.js`:
```javascript
const POIS = [
  // ... existing POIs
  {
    id: 'your-poi-id',
    name: 'Your POI Name',
    lat: YOUR_LAT,
    lng: YOUR_LNG,
    year: YEAR,
    description: 'Description'
  }
];
```

## 📊 Performance

### Target Metrics
- Page load: <3s on 4G
- AR initialization: <5s
- GPS lock: <10s
- Frame rate: 30+ fps
- Battery usage: ~10-15%/hour

### Optimization Tips
- Limit visible POIs to 3-5
- Use simple geometries (planes, not complex 3D)
- Compress textures/images
- Cache POI data locally

## 🔐 Privacy & Security

- **HTTPS required** for iOS camera/GPS access
- **No data collected** by default
- **GPS data** only used locally (not sent to server)
- **Camera feed** not recorded or transmitted
- **Location data** rounded to 3 decimal places (±111m) if logged

## 📖 Technical Documentation

See `../TECH-ARCHITECTURE.md` for detailed explanation of:
- How WebAR works
- GPS → 3D coordinate conversion
- Coordinate systems
- Tech stack breakdown

## 🐛 Debugging

### Console Debug Tools

```javascript
// Available in browser console:
window.SightlineAR.getUserPosition()     // Current GPS position
window.SightlineAR.isARReady()           // AR initialization status
window.SightlineAR.getNearbyPOICount()   // How many POIs nearby
window.SightlineAR.testDistance(lat, lng) // Calculate distance to coords
```

### Enable AR.js Debug Mode

In `index.html`, change:
```html
arjs="debugUIEnabled: false"
```
to:
```html
arjs="debugUIEnabled: true"
```

This shows debug stats overlay.

## 🎬 Demo Video Recording

For CCMF application:

1. **Go to Clock Tower** (22.2946°N, 114.1699°E)
2. **Open WebAR** on phone
3. **Grant permissions** (camera + location)
4. **Wait for GPS lock** (<50m accuracy)
5. **Record screen** showing:
   - AR card appearing
   - Distance updating as you move
   - Stable tracking for 10+ seconds
   - GPS info visible
6. **Get close-up** of readable AR card
7. **Duration**: 60-90 seconds

### iOS Screen Recording
1. Settings → Control Center → Add Screen Recording
2. Swipe down from top-right
3. Hold record button → Enable microphone
4. Record WebAR session

### Android Screen Recording
1. Swipe down twice from top
2. Tap "Screen record"
3. Enable "Record audio"
4. Record WebAR session

## 📝 License

MIT License - See main project README

## 🤝 Contributing

This is a proof-of-concept for CCMF application. After funding:
- Open issues for bugs
- Submit PRs for features
- Add more POIs via JSON
- Improve UI/UX

## 📞 Support

For questions about implementation:
- Check `TECH-ARCHITECTURE.md`
- Review AR.js docs: https://ar-js-org.github.io/AR.js-Docs/
- A-Frame docs: https://aframe.io/docs/

---

**Built with ❤️ for Hong Kong heritage preservation**

🇭🇰 Sightline - On-Object AI for AR Glasses

