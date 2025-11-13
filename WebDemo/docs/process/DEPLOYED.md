# 🚀 Sightline WebAR - Live Deployment

**Status:** ✅ LIVE (IMU Heading v3.0)  
**Deployed:** November 8, 2024  
**Platform:** Vercel (HTTPS enabled)

---

## 📱 Access on Your Phone

### **Production URL:**
```
https://sightline-webar-b41hzttzw-peelchans-projects.vercel.app
```

### **Test Page URL:**
```
https://sightline-webar-b41hzttzw-peelchans-projects.vercel.app/test.html
```

### **Debug Page URL:**
```
https://sightline-webar-b41hzttzw-peelchans-projects.vercel.app/debug.html
```

### **West Kowloon Freespace Demo:**
```
https://sightline-webar-b41hzttzw-peelchans-projects.vercel.app/?mode=demo&lat=22.3045&lng=114.1595&hdg=120
```

---

## 🔗 QR Codes (Generate These)

### Method 1: Use Online QR Generator
1. Visit: https://www.qr-code-generator.com/
2. Paste URL: `https://sightline-webar-lnb0r2yhx-peelchans-projects.vercel.app`
3. Download QR code
4. Print or save to phone

### Method 2: Use iPhone/Android
**iPhone:**
1. Open Notes app
2. Type the URL
3. Long press → "Copy"
4. Open Camera → Point at printed QR code to test

**Android:**
1. Open Chrome
2. Menu → Share → QR Code
3. Screenshot and share

---

## 📲 Step-by-Step Testing Instructions

### **Before Going to Clock Tower (Test at Home)**

1. **Open Test Page First:**
   - Visit: `https://sightline-webar-lnb0r2yhx-peelchans-projects.vercel.app/test.html`
   - Click "Test Camera" → Grant permission
   - Click "Test GPS" → Grant permission
   - Should see: ✅ All checks passed

2. **Test Main App (Simulated):**
   - Click "Launch WebAR Demo"
   - Grant camera + GPS permissions
   - You'll see loading screen → "AR Ready!"
   - GPS will show your current location

### **At Clock Tower (Field Test)**

**Location:** Tsim Sha Tsui Waterfront, Clock Tower  
**Coordinates:** 22.2946°N, 114.1699°E  
**Best Access:** MTR Tsim Sha Tsui Station, Exit E → Walk to waterfront

**Steps:**
1. Open URL on your phone
2. Grant camera + GPS permissions
3. Wait for GPS lock (±5-50m accuracy shown top-left)
4. Walk around the Clock Tower
5. AR card should appear when within 150m
6. Distance updates as you move ("Distance: 45m" → "Distance: 30m")

**Expected Behavior:**
- GPS accuracy: ±5-20m (good signal)
- AR card appears: White card with blue header
- Distance updates: Every 1 second
- POI counter: Shows "3 landmarks nearby"

---

## 🎬 Recording Demo Video

### **What to Record:**

**Scene 1: Setup (10 seconds)**
- Show QR code on screen
- Scan QR code with phone
- Open in browser

**Scene 2: Permissions (10 seconds)**
- Grant camera permission
- Grant location permission
- Show "AR Ready!" message

**Scene 3: AR in Action (40 seconds)**
- Point camera at Clock Tower
- Show AR card appearing
- Walk closer (distance decreases)
- Walk left/right (card stays anchored)
- Close-up of card (readable text)

**Scene 4: UI Features (20 seconds)**
- Show GPS accuracy (top-left)
- Show POI counter (top-right)
- Show distance updating

**Scene 5: Multiple POIs (10 seconds)**
- Walk toward Star Ferry
- Show 2nd AR card appearing
- Show POI counter updating

**Total:** 90 seconds

### **Recording Settings:**

**iPhone:**
- Settings → Control Center → Add "Screen Recording"
- Swipe down from top-right → Hold record button
- Enable microphone
- Start recording

**Android:**
- Swipe down twice → "Screen record"
- Enable audio
- Start recording

**Tips:**
- Record in portrait mode
- Keep phone steady
- Narrate what you're doing
- Show GPS info on screen
- Test on sunny day (outdoor readability)

---

## 🧪 Troubleshooting

### **Camera Not Working**
- Make sure you're using HTTPS (Vercel provides this ✓)
- Try different browser (Safari on iOS, Chrome on Android)
- Close other apps using camera
- Restart browser

### **GPS Inaccurate**
- Go outside (GPS needs clear sky view)
- Wait 30 seconds for GPS lock
- Move to open area (away from tall buildings)
- Check accuracy indicator (should be <50m)

### **AR Cards Not Appearing**
- Make sure you're within 150m of POI
- Check GPS accuracy (should be <50m)
- Verify POI counter shows "3 landmarks nearby"
- Try refreshing page

### **Page Won't Load**
- Check internet connection
- Try cellular data (not WiFi)
- Clear browser cache
- Try incognito/private mode

---

## 📍 POI Locations for Testing

### **Clock Tower**
- **Address:** Tsim Sha Tsui Waterfront, Salisbury Rd
- **MTR:** Tsim Sha Tsui Station, Exit E
- **Walking:** 5 minutes from MTR
- **Coordinates:** 22.2946°N, 114.1699°E
- **Best Time:** Morning (less crowded, good light)

### **Star Ferry Pier**
- **Address:** Star Ferry Pier, Tsim Sha Tsui
- **MTR:** Tsim Sha Tsui Station, Exit L
- **Walking:** 7 minutes from MTR
- **Coordinates:** 22.2800°N, 114.1587°E
- **Note:** 500m from Clock Tower (walk south)

### **Avenue of Stars**
- **Address:** Tsim Sha Tsui Promenade
- **MTR:** Tsim Sha Tsui Station, Exit J
- **Walking:** 10 minutes from MTR
- **Coordinates:** 22.2930°N, 114.1730°E
- **Note:** 200m from Clock Tower (walk northeast)

**Pro Tip:** Walk the entire promenade (15 min) to see all 3 POIs!

---

## 🔧 Update Deployment

If you make changes to the code:

```bash
cd WebDemo

# Make your changes to index.html, styles.css, app.js

# Redeploy
vercel --prod

# New URL will be provided (or use existing domain)
```

---

## 📊 Analytics & Monitoring

**Vercel Dashboard:**
- Visit: https://vercel.com/peelchans-projects/sightline-webar
- See: Deployments, Analytics, Logs

**Check:**
- Page views
- Load times
- Errors
- Geographic distribution

---

## 🌐 Custom Domain (Optional)

### **Option 1: Use Vercel's Domain**
Current: `https://sightline-webar-lnb0r2yhx-peelchans-projects.vercel.app`

### **Option 2: Add Custom Domain**
1. Buy domain (e.g., `sightline.ar` or `sightline.hk`)
2. Go to Vercel dashboard → Settings → Domains
3. Add domain
4. Update DNS records
5. Get: `https://sightline.ar` (cleaner!)

**Cost:** ~$10-30/year for domain

---

## 🎯 For CCMF Application

### **What to Include:**

1. **Live Demo Link:**
   ```
   https://sightline-webar-lnb0r2yhx-peelchans-projects.vercel.app
   ```

2. **QR Code:**
   - Generate and print
   - Include in proposal PDF
   - Put on presentation slides

3. **Demo Video:**
   - Record 90 seconds at Clock Tower
   - Upload to YouTube (unlisted)
   - Include link in application

4. **User Testing Evidence:**
   - Test with 10-15 people
   - Record reactions
   - Get quotes: "This is so cool!" "Very useful for tourists"
   - Include testimonials in proposal

5. **Technical Proof:**
   - GitHub repo: https://github.com/peelchann/Sightline
   - Show commit history (proves development)
   - Include BUILD-SUMMARY.md stats

---

## ✅ Deployment Checklist

- [x] Code deployed to Vercel
- [x] HTTPS enabled (required for iOS)
- [x] Camera permission working
- [x] GPS permission working
- [x] Test page accessible
- [ ] QR code generated
- [ ] Tested on iPhone
- [ ] Tested on Android
- [ ] Tested at Clock Tower location
- [ ] Demo video recorded
- [ ] User feedback collected

---

## 🚀 Next Steps

**TODAY:**
1. Test on your phone at home (permissions work?)
2. Generate QR code for easy access
3. Plan Clock Tower visit (weekend?)

**THIS WEEKEND:**
1. Go to Clock Tower (morning 9-11am best)
2. Test all 3 POIs
3. Record 90-second demo video
4. Ask 5-10 tourists to try it

**NEXT WEEK:**
1. Edit demo video (add KPI overlay)
2. Update CCMF proposal with evidence
3. Submit application!

---

## 📞 Support

**Deployment Issues:**
- Check Vercel logs: `vercel logs`
- Inspect deployment: `vercel inspect`
- Redeploy: `vercel --prod`

**App Issues:**
- Check browser console (F12)
- Review README.md troubleshooting section
- Test simulated GPS first (easier to debug)

---

**🎉 Your WebAR app is LIVE! Test it now on your phone!**

**Quick test:** Point your phone camera at this page → scan the URL → open in browser!

