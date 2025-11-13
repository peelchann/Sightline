# Sightline WebAR Demo

GPS-based augmented reality for Hong Kong landmarks. Works on iPhone Safari and Android Chrome - **no app installation required!**

## 🎯 Features

- **Zero Install**: Just visit URL in mobile browser
- **Individual Permission Buttons**: Request Camera, Location, and Motion permissions separately
- **8+ POIs**: Clock Tower, Star Ferry, IFC, ICC, M+, Palace Museum, and more
- **Real-Time IMU**: Instant heading updates from phone compass/gyro
- **GPS Tracking**: Real-time position updates
- **Distance Display**: See how far you are from landmarks
- **Demo Mode**: Test without GPS or sensors
- **Full-Screen AR**: True full-screen with iOS safe area support
- **Non-Blocking HUD**: UI overlays never block the camera

## 📚 Documentation

All documentation has been organized into the `docs/` directory:

- **`docs/documentation/`** - User guides and API documentation
- **`docs/process/`** - Development process, bug fixes, deployments
- **`docs/learning/`** - Implementation guides and reference materials

See `docs/README.md` for the complete documentation structure.

## 🚀 Quick Start

### Production URL
```
https://sightline-webar.vercel.app
```

### Local Development

1. **Navigate to WebDemo folder**:
   ```bash
   cd WebDemo
   ```

2. **Start local server** (Python 3):
   ```bash
   python -m http.server 8000
   ```

3. **Open in browser**:
   ```
   http://localhost:8000
   ```

4. **Test on mobile**: Use your computer's IP address:
   ```
   http://YOUR_IP:8000
   ```

## 📱 Mobile Testing

- **iOS Safari**: iOS 13+ required
- **Android Chrome**: Latest version recommended
- **HTTPS Required**: For camera and location access

## 🔧 Current Version

**V3 - Individual Permission Flow**
- Three separate permission buttons (Camera, Location, Motion)
- Status pills (🔴/🟡/🟢) for each permission
- Start AR button (enabled when Camera + Location granted)
- Demo Mode (always available, no permissions needed)
- Full-screen viewport with iOS safe area support
- Collapsible debug panel

## 📖 More Information

- **User Guides**: See `docs/documentation/`
- **Development History**: See `docs/process/`
- **Implementation Details**: See `docs/learning/`
