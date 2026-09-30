Nexus Impact AI - Asset Requirements
========================================

Before generating a production store release (Google Play Store / Apple App Store),
place the following image assets into this `mobile/assets/` directory:

1. icon.png
   - App Launcher Icon (Square PNG, no transparency recommended for iOS).
   - Recommended resolution: 1024 x 1024 px.

2. adaptive-icon.png
   - Android Adaptive Icon foreground layer (PNG with transparent background).
   - Recommended resolution: 1024 x 1024 px.

3. splash-icon.png
   - Splash screen centerpiece icon (PNG with transparent background).
   - Recommended resolution: 200 x 200 px (or larger).

4. favicon.png
   - Web preview favicon (PNG or ICO).
   - Recommended resolution: 48 x 48 px.

Re-enabling in app.json:
Once you have added these files, you can restore their references in `mobile/app.json`:
- "icon": "./assets/icon.png"
- "splash": { "image": "./assets/splash-icon.png", "resizeMode": "contain", "backgroundColor": "#070D1E" }
- "android": { "package": "com.fetleepi.nexusimpact", "adaptiveIcon": { "foregroundImage": "./assets/adaptive-icon.png", "backgroundColor": "#070D1E" } }
- "web": { "favicon": "./assets/favicon.png" }

These references were omitted from the default configuration so EAS Build and local Metro
bundlers do not fail when building without binary image assets present.
