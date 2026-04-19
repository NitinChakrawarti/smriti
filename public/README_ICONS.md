# PWA Icons Setup

## Quick Start

### Option 1: Generate Icons (Recommended)

1. Open `frontend/scripts/generate-icons.html` in your browser
2. Click "Download All Icons" button
3. Save the files as `icon-192.png` and `icon-512.png`
4. Place them in this directory (`frontend/public/`)
5. Restart your development server

### Option 2: Use Your Own Icons

Create two PNG files with the following specifications:

**icon-192.png:**
- Size: 192x192 pixels
- Format: PNG
- Purpose: Small icon for app shortcuts and notifications

**icon-512.png:**
- Size: 512x512 pixels
- Format: PNG
- Purpose: Large icon for app installation and splash screen

**Design Guidelines:**
- Use a simple, recognizable design
- Ensure good contrast for visibility
- Test on both light and dark backgrounds
- Avoid text smaller than 20% of icon size
- Use your brand colors

### Option 3: Online Tools

Use these free tools to generate PWA icons:

1. **PWA Builder Image Generator**
   - https://www.pwabuilder.com/imageGenerator
   - Upload a single image, get all sizes

2. **Real Favicon Generator**
   - https://realfavicongenerator.net/
   - Comprehensive favicon and PWA icon generator

3. **Favicon.io**
   - https://favicon.io/
   - Simple text-to-icon generator

## Verification

After adding icons:

1. **Check manifest:**
   ```bash
   curl http://localhost:3000/manifest.json
   ```
   Should show icon paths in the response

2. **Test PWA installation:**
   - Chrome: Look for install icon in address bar
   - Mobile: Check "Add to Home Screen" option

3. **Verify icons load:**
   - Open: http://localhost:3000/icon-192.png
   - Open: http://localhost:3000/icon-512.png

## Current Status

⚠️ **Icons Required:** The manifest.json references these icons, but they need to be created.

Once you add the icons, the PWA will be fully functional with:
- ✅ Native share target
- ✅ Install prompt
- ✅ Offline support
- ✅ App-like experience

## Troubleshooting

**Icons not showing:**
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)
- Reinstall PWA

**Install prompt not appearing:**
- Ensure HTTPS (or localhost)
- Check all manifest requirements met
- Verify service worker registered

**Share target not working:**
- Install PWA first
- Check browser compatibility
- Verify manifest.json accessible
